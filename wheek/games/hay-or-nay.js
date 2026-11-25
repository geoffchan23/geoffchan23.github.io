/* Hay or Nay?: guinea higher/lower card game (Wheek World, carnival, luck).
 *
 * Math (verified by a Node simulation of drawCard/pWin/nextPot below, 2M rounds per strategy):
 *   Cards are 1-13, drawn fresh each time (like an endless deck). A tie ("Twins!") is a free pass.
 *   The first correct guess sets pot = bet x 0.95 / p, where p is the true chance of that guess
 *   (among non-tie cards). Every later guess multiplies the pot by exactly 1 / p (a fair bet).
 *   So any strategy (cash out after 1 win, after 5, always pick the likely side, pick at random...)
 *   returns 95% long-run (93.9%-95.5% after rounding coins to whole numbers); you must win at least one
 *   guess before cashing out. Once the pot reaches 100x the bet it cashes out automatically (the jackpot);
 *   it is never clamped, because clamping would make that last guess unfair.
 */
(function () {
  "use strict";
  // ---------------------------------------------------------------------------
  // Carnival kit: shared helpers (lifecycle, HUD, bet chips, modal, intro, FX).
  // Every timer / frame / listener goes through K so destroy() cleans it all up.
  // ---------------------------------------------------------------------------
  function makeKit(root, api, P) {
    const K = {};
    const timers = new Set(), frames = new Set(), offs = [];
    let dead = false;
    K.P = P;
    K.reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    K.isDead = () => dead;
    K.after = (ms, fn) => { const id = setTimeout(() => { timers.delete(id); if (!dead) fn(); }, ms); timers.add(id); return id; };
    K.clear = id => { clearTimeout(id); timers.delete(id); };
    K.wait = ms => new Promise(res => K.after(ms, res));
    K.loop = fn => {
      const h = { id: 0 }; let last = performance.now();
      const tick = now => {
        if (dead) return;
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
        if (fn(dt, now) === false) { frames.delete(h); return; }
        h.id = requestAnimationFrame(tick);
      };
      h.id = requestAnimationFrame(tick); frames.add(h);
      return () => { cancelAnimationFrame(h.id); frames.delete(h); };
    };
    K.on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
    K.el = (tag, cls, html, parent) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls.split(" ").map(c => c.startsWith("!") ? c.slice(1) : P + "-" + c).join(" ");
      if (html != null) e.innerHTML = html;
      if (parent) parent.appendChild(e);
      return e;
    };
    K.sfx = n => { try { api.sfx(n); } catch (e) { /* sound is optional */ } };
    K.haptic = ms => { try { api.haptic(ms); } catch (e) { /* optional */ } };
    K.rand = (a, b) => a + Math.random() * (b - a);
    K.pick = arr => arr[Math.floor(Math.random() * arr.length)];
    K.vp = (x, y) => { const r = root.getBoundingClientRect(); return [r.left + x, r.top + y]; };
    K.center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    K.local = el => { const r = el.getBoundingClientRect(), q = root.getBoundingClientRect(); return [r.left - q.left + r.width / 2, r.top - q.top + r.height / 2]; };
    K.fmt = n => Math.round(n).toLocaleString("en-US");
    K.css = text => { const s = document.createElement("style"); s.textContent = text.replace(/\.P\b/g, "." + P).replace(/(^|[^\w-])P-/g, "$1" + P + "-"); root.appendChild(s); };
    K.svgUrl = svg => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'));

    root.classList.add(P);
    K.css(`
      .P { font-family: var(--body); color: var(--ink); touch-action: manipulation; -webkit-user-select: none; user-select: none; }
      .P * { box-sizing: border-box; }
      .P-hud { position: relative; z-index: 5; display: flex; align-items: center; gap: 8px; padding: 8px 10px 4px; }
      .P-coins { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 3px solid var(--ink); border-radius: 999px;
        padding: 3px 12px 3px 5px; box-shadow: 0 3px 0 var(--ink); font-family: var(--display); font-size: 19px; min-width: 88px; }
      .P-coins .P-cico { width: 26px; height: 26px; flex: none; }
      .P-coins.P-bump { animation: P-bump .35s; }
      @keyframes P-bump { 30% { transform: scale(1.18); } 100% { transform: scale(1); } }
      .P-x2 { font-family: var(--display); background: var(--orange); border: 3px solid var(--ink); border-radius: 12px; padding: 1px 8px; font-size: 16px;
        animation: P-wob 1s infinite alternate ease-in-out; box-shadow: 0 3px 0 var(--ink); }
      @keyframes P-wob { from { transform: rotate(-6deg); } to { transform: rotate(6deg) scale(1.08); } }
      .P-hud .P-sp { flex: 1; }
      .P-ibtn { width: 42px; height: 42px; min-height: 0; padding: 0; border-radius: 50%; font-size: 20px; border-width: 3px; box-shadow: 0 3px 0 var(--ink); }
      .P-chips { display: flex; justify-content: center; gap: 10px; }
      .P-chip { position: relative; width: 60px; height: 60px; border-radius: 50%; border: 4px solid var(--ink); box-shadow: 0 4px 0 var(--ink);
        font-family: var(--display); font-size: 21px; display: grid; place-items: center; padding: 0; transition: transform .15s cubic-bezier(.3,1.8,.5,1), box-shadow .15s, filter .2s; }
      .P-chip::before { content: ""; position: absolute; inset: 4px; border-radius: 50%; border: 3px dashed rgba(255,255,255,.95); pointer-events: none; }
      .P-chip span { position: relative; text-shadow: 0 2px 0 rgba(255,255,255,.6); }
      .P-chip small { position: absolute; bottom: -2px; left: 0; right: 0; font-size: 9px; font-family: var(--body); font-weight: 900; opacity: .75; }
      .P-chip.P-c5 { background: var(--sky); } .P-chip.P-c10 { background: var(--pink); } .P-chip.P-c25 { background: var(--slime); } .P-chip.P-c50 { background: var(--yellow); }
      .P-chip.P-on { transform: translateY(-7px) scale(1.08); box-shadow: 0 9px 0 var(--ink), 0 0 0 5px #fff, 0 0 0 8px var(--ink); }
      .P-chip:disabled { filter: grayscale(1) brightness(1.15); opacity: .45; transform: none; box-shadow: 0 2px 0 var(--ink); }
      .P-chip:active:not(:disabled) { transform: translateY(2px) scale(.96); }
      .P-fx { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; z-index: 60; }
      .P-flash { position: absolute; inset: 0; pointer-events: none; z-index: 58; opacity: 0; }
      .P-banner { position: absolute; left: 50%; top: 42%; z-index: 62; pointer-events: none; text-align: center; transform: translate(-50%,-50%); width: 96%; }
      .P-banner b { display: block; font-family: var(--display); font-weight: 400; font-size: 54px; line-height: .95; color: var(--yellow);
        -webkit-text-stroke: 3px var(--ink); paint-order: stroke fill; text-shadow: 0 6px 0 var(--ink), 0 0 30px rgba(255,255,255,.9); letter-spacing: 1px; }
      .P-banner i { display: inline-block; margin-top: 10px; font-style: normal; font-family: var(--display); font-size: 26px; background: #fff; border: 4px solid var(--ink);
        border-radius: 18px; padding: 4px 16px; box-shadow: 0 5px 0 var(--ink); }
      .P-banner.pink b { color: var(--pink); } .P-banner.green b { color: var(--slime); } .P-banner.sky b { color: var(--sky); } .P-banner.lilac b { color: var(--lilac); }
      .P-modal { position: absolute; inset: 0; z-index: 70; background: rgba(43,22,64,.55); display: grid; place-items: center; padding: 14px; animation: P-fade .2s; }
      @keyframes P-fade { from { opacity: 0; } }
      .P-mcard { background: var(--card); border: 4px solid var(--ink); border-radius: 24px; box-shadow: 0 8px 0 var(--ink); width: min(100%, 420px);
        max-height: 92%; overflow: auto; padding: 16px 16px 18px; animation: P-pop .35s cubic-bezier(.3,1.6,.5,1); }
      @keyframes P-pop { from { transform: scale(.6); opacity: 0; } }
      .P-mcard h2 { font-size: 28px; text-align: center; margin-bottom: 8px; }
      .P-mcard .P-mfoot { display: flex; justify-content: center; margin-top: 14px; }
      .P-ptab { width: 100%; border-collapse: separate; border-spacing: 0 4px; font-size: 15px; }
      .P-ptab td { background: #fff; border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink); padding: 2px 8px; }
      .P-ptab td:first-child { border-left: 3px solid var(--ink); border-radius: 14px 0 0 14px; }
      .P-ptab td:last-child { border-right: 3px solid var(--ink); border-radius: 0 14px 14px 0; text-align: right; font-family: var(--display); font-size: 19px; white-space: nowrap; }
      .P-note { font-size: 13px; color: var(--ink-soft); text-align: center; margin-top: 8px; line-height: 1.3; }
      .P-intro { position: absolute; inset: 0; z-index: 40; display: grid; place-items: center; padding: 14px;
        background: radial-gradient(circle at 50% 30%, rgba(255,255,255,.55), rgba(43,22,64,.45)); animation: P-fade .25s; }
      .P-icard { position: relative; background: var(--card); border: 5px solid var(--ink); border-radius: 28px; box-shadow: 0 9px 0 var(--ink);
        width: min(100%, 400px); padding: 18px 16px 20px; text-align: center; animation: P-pop .45s cubic-bezier(.3,1.6,.5,1); }
      .P-icard .P-iart { height: 120px; display: grid; place-items: center; margin: -6px 0 4px; }
      .P-icard h1 { font-size: 40px; line-height: .95; color: var(--pink); -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 0 4px 0 var(--ink); }
      .P-icard .P-how { margin: 12px 0 14px; font-size: 16px; line-height: 1.35; }
      .P-icard .P-how div { margin: 3px 0; }
      .P-icard .P-lbl { font-family: var(--display); font-size: 16px; color: var(--ink-soft); margin-bottom: 10px; }
      .P-icard .P-go { margin-top: 18px; display: flex; gap: 10px; justify-content: center; }
      .P-icard .P-go .btn { font-size: 22px; min-height: 58px; padding: 10px 26px; }
      .P-ribbon { position: absolute; top: -18px; left: 50%; transform: translateX(-50%) rotate(-3deg); background: var(--yellow); border: 4px solid var(--ink);
        border-radius: 12px; padding: 2px 14px; font-family: var(--display); font-size: 15px; white-space: nowrap; box-shadow: 0 4px 0 var(--ink); }
      .P-float { position: absolute; z-index: 61; pointer-events: none; font-family: var(--display); font-size: 26px; color: var(--yellow);
        -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 0 3px 0 var(--ink); transform: translate(-50%,-50%); animation: P-floatup 1.1s ease-out forwards; white-space: nowrap; }
      @keyframes P-floatup { 0% { transform: translate(-50%,-30%) scale(.4); opacity: 0; } 20% { transform: translate(-50%,-60%) scale(1.15); opacity: 1; } 100% { transform: translate(-50%,-160%) scale(1); opacity: 0; } }
    `);

    // ---- FX canvas: coins, sparkles, goo -------------------------------------
    const fx = K.el("canvas", "fx", null, root);
    const fctx = fx.getContext("2d");
    const parts = [];
    let fxStop = null;
    const fitFx = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      fx.width = Math.max(1, root.clientWidth * d); fx.height = Math.max(1, root.clientHeight * d);
      fctx.setTransform(d, 0, 0, d, 0, 0);
    };
    fitFx();
    K.on(window, "resize", fitFx);
    function drawCoin(c, x, y, r, rot) {
      const sx = Math.abs(Math.cos(rot)) * .85 + .15;
      c.save(); c.translate(x, y); c.scale(sx, 1);
      c.fillStyle = "#2b1640"; c.beginPath(); c.arc(0, 0, r + 2, 0, 7); c.fill();
      c.fillStyle = "#ffb82e"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
      c.fillStyle = "#ffd84d"; c.beginPath(); c.arc(0, -r * .1, r * .78, 0, 7); c.fill();
      c.fillStyle = "#fff6b8"; c.beginPath(); c.ellipse(-r * .3, -r * .38, r * .22, r * .13, -.6, 0, 7); c.fill();
      c.restore();
    }
    function drawStar(c, x, y, r, rot, col) {
      c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .35 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      c.closePath(); c.fill(); c.restore();
    }
    function fxRun() {
      if (fxStop) return;
      fxStop = K.loop(dt => {
        const W = root.clientWidth, H = root.clientHeight;
        fctx.clearRect(0, 0, W, H);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.t += dt; p.vy += (p.g || 900) * dt; p.vx *= (1 - (p.drag || 0) * dt);
          p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
          const a = Math.max(0, Math.min(1, (p.life - p.t) / .35));
          if (p.t > p.life || p.y > H + 60) { parts.splice(i, 1); continue; }
          fctx.globalAlpha = a;
          if (p.k === "coin") drawCoin(fctx, p.x, p.y, p.r, p.rot);
          else if (p.k === "star") drawStar(fctx, p.x, p.y, p.r, p.rot, p.c);
          else if (p.k === "conf") { fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.fillStyle = p.c; fctx.fillRect(-p.r, -p.r * .45, p.r * 2, p.r * .9); fctx.restore(); }
          else { fctx.fillStyle = p.c; fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, 7); fctx.fill(); }
        }
        fctx.globalAlpha = 1;
        if (!parts.length) { fxStop = null; fctx.clearRect(0, 0, W, H); return false; }
      });
    }
    K.fountain = (x, y, n, spread) => {
      n = Math.min(n, 160); spread = spread || 1;
      for (let i = 0; i < n; i++) parts.push({ k: "coin", x: x + K.rand(-10, 10), y, vx: K.rand(-260, 260) * spread, vy: K.rand(-900, -420), r: K.rand(6.5, 10), rot: K.rand(0, 6), vr: K.rand(-14, 14), t: -i * 0.012, life: K.rand(1.6, 2.4) });
      fxRun();
    };
    K.coinRain = n => {
      const W = root.clientWidth;
      for (let i = 0; i < Math.min(n, 120); i++) parts.push({ k: "coin", x: K.rand(0, W), y: K.rand(-300, -20), vx: K.rand(-40, 40), vy: K.rand(0, 200), g: 700, r: K.rand(7, 11), rot: K.rand(0, 6), vr: K.rand(-12, 12), t: 0, life: 3 });
      fxRun();
    };
    K.sparkle = (x, y, n, cols) => {
      cols = cols || ["#ffd84d", "#fff", "#ff8fc7", "#7be04a", "#5fd3ff"];
      for (let i = 0; i < n; i++) { const a = K.rand(0, 6.28), s = K.rand(120, 420); parts.push({ k: i % 3 ? "star" : "conf", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, g: 500, drag: 1.5, r: K.rand(4, 9), rot: K.rand(0, 6), vr: K.rand(-10, 10), c: K.pick(cols), t: 0, life: K.rand(.7, 1.3) }); }
      fxRun();
    };
    K.goo = (x, y, n, col) => {
      for (let i = 0; i < n; i++) { const a = K.rand(Math.PI * 1.1, Math.PI * 1.9), s = K.rand(80, 260); parts.push({ k: "dot", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 1100, r: K.rand(2.5, 6), rot: 0, vr: 0, c: col || "#7be04a", t: 0, life: K.rand(.5, .9) }); }
      fxRun();
    };
    K.float = (x, y, text, color) => {
      const f = K.el("div", "float", text, root); f.style.left = x + "px"; f.style.top = y + "px"; if (color) f.style.color = color;
      K.after(1150, () => f.remove());
      try { const v = K.vp(x, y); api.floatText(v[0], v[1], text, color); } catch (e) { /* optional */ }
    };
    const flashEl = K.el("div", "flash", null, root);
    K.flash = (color, ms) => {
      flashEl.style.background = color || "#fff";
      flashEl.animate([{ opacity: .85 }, { opacity: 0 }], { duration: ms || 450, easing: "ease-out" });
    };
    K.shake = (target, mag) => {
      mag = (mag || 10) * (K.reduced ? .2 : 1);
      const kf = []; for (let i = 0; i < 8; i++) { const m = mag * (1 - i / 8); kf.push({ transform: `translate(${K.rand(-m, m)}px,${K.rand(-m, m)}px) rotate(${K.rand(-m, m) * .08}deg)` }); }
      kf.push({ transform: "none" });
      (target || root).animate(kf, { duration: 420, easing: "linear" });
    };
    K.banner = (big, small, theme, ms) => {
      const b = K.el("div", "banner " + (theme ? "!" + theme : ""), `<b>${big}</b>${small ? `<i>${small}</i>` : ""}`, root);
      b.animate([{ transform: "translate(-50%,-50%) scale(.2) rotate(-12deg)", opacity: 0 }, { transform: "translate(-50%,-50%) scale(1.15) rotate(3deg)", opacity: 1, offset: .55 }, { transform: "translate(-50%,-50%) scale(1) rotate(-2deg)", opacity: 1 }], { duration: 520, easing: "ease-out", fill: "forwards" });
      K.after(ms || 1900, () => { b.animate([{ opacity: 1 }, { opacity: 0, transform: "translate(-50%,-70%) scale(.9)" }], { duration: 300, fill: "forwards" }); K.after(320, () => b.remove()); });
      return b;
    };
    K.confetti = (el, n) => { try { const c = K.center(el); api.confetti(c[0], c[1], n || 60); } catch (e) { /* optional */ } };
    K.gas = (x, y) => { try { const v = K.vp(x, y); api.gas(v[0], v[1]); } catch (e) { /* optional */ } };
    K.countUp = (el, from, to, ms, fmt) => {
      fmt = fmt || K.fmt; const t0 = performance.now();
      K.loop((dt, now) => { const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3); el.textContent = fmt(from + (to - from) * e); return t < 1; });
    };

    // ---- HUD: coin pill, x2 badge, info button --------------------------------
    K.coinSVG = s => `<svg class="${P}-cico" viewBox="0 0 40 40" width="${s || 26}" height="${s || 26}" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#ffb82e" stroke="#2b1640" stroke-width="3.5"/><circle cx="20" cy="18.5" r="12" fill="#ffd84d"/><path d="M15 14q5-5 10 0M20 12v14" stroke="#e08a00" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="12" rx="3.4" ry="2" fill="#fff6b8" transform="rotate(-35 13 12)"/></svg>`;
    let shown = api.coins(), coinNum = null, coinPill = null;
    K.hud = (parent, onInfo, extraHTML) => {
      const h = K.el("div", "hud", null, parent);
      coinPill = K.el("div", "coins", K.coinSVG(26) + "<span></span>", h);
      coinNum = coinPill.querySelector("span"); coinNum.textContent = K.fmt(shown);
      if (api.multiplier > 1) K.el("div", "x2", "x" + api.multiplier + "!", h);
      const sp = K.el("div", "sp", extraHTML || "", h);
      const info = K.el("button", "ibtn !btn !white", "?", h); info.setAttribute("aria-label", "Odds and prizes");
      K.on(info, "click", () => { K.sfx("click"); onInfo(); });
      return { el: h, sp, info };
    };
    K.refreshCoins = () => {
      const now = api.coins();
      if (coinNum && now !== shown) { K.countUp(coinNum, shown, now, 600); coinPill.classList.remove(P + "-bump"); void coinPill.offsetWidth; coinPill.classList.add(P + "-bump"); }
      shown = now; K.chipsAll.forEach(c => c.refresh());
    };
    K.coinPill = () => coinPill;

    // ---- Bet chips ----------------------------------------------------------------
    K.chipsAll = [];
    K.bet = 10;
    K.chips = (parent, opts) => {
      opts = opts || {};
      const bets = opts.bets || [5, 10, 25, 50];
      const row = K.el("div", "chips", null, parent);
      const btns = bets.map(b => {
        const x = K.el("button", "chip c" + b, `<span>${b}</span>${opts.sub ? `<small>${opts.sub(b)}</small>` : ""}`, row);
        x.setAttribute("aria-label", "Bet " + b);
        K.on(x, "click", () => { if (C.locked) return; K.bet = b; K.sfx("click"); K.haptic(8); K.chipsAll.forEach(c => c.refresh()); opts.onChange && opts.onChange(b); });
        return x;
      });
      const C = {
        row, locked: false,
        refresh() {
          const have = api.coins();
          if (have < K.bet) { const ok = bets.filter(b => b <= have); if (ok.length) K.bet = ok[ok.length - 1]; }
          btns.forEach((x, i) => { x.disabled = C.locked || bets[i] > have; x.classList.toggle(P + "-on", bets[i] === K.bet && bets[i] <= have); });
        },
        lock(v) { C.locked = v; C.refresh(); },
      };
      K.chipsAll.push(C); C.refresh();
      return C;
    };

    // ---- Modal ----------------------------------------------------------------------
    K.modal = (title, body, btnLabel) => {
      const m = K.el("div", "modal", `<div class="${P}-mcard"><h2>${title}</h2><div>${body}</div><div class="${P}-mfoot"><button class="btn green">${btnLabel || "Got it!"}</button></div></div>`, root);
      const close = () => { K.sfx("pop"); m.remove(); };
      K.on(m.querySelector(".btn"), "click", close);
      K.on(m, "pointerdown", e => { if (e.target === m) close(); });
      return close;
    };

    // ---- Intro panel --------------------------------------------------------------
    K.intro = o => {
      const ov = K.el("div", "intro", null, root);
      const card = K.el("div", "icard", `${o.ribbon ? `<div class="${P}-ribbon">${o.ribbon}</div>` : ""}<div class="${P}-iart">${o.art || ""}</div><h1>${o.title}</h1><div class="${P}-how">${o.how.map(l => `<div>${l}</div>`).join("")}</div><div class="${P}-lbl">${o.betLabel || "Pick your bet"}</div>`, ov);
      if (api.coins() < 5) {
        K.el("div", "how", `<b>Oh no, you're out of coins!</b><br>Play a skill game to earn some, then come back.`, card);
        const go = K.el("div", "go", null, card);
        const b = K.el("button", "!btn !pink", "Leave", go); K.on(b, "click", () => api.exit());
        return ov;
      }
      K.chips(card, { sub: o.chipSub });
      const go = K.el("div", "go", null, card);
      if (o.onInfo) { const i = K.el("button", "!btn !white", "Odds", go); K.on(i, "click", () => { K.sfx("click"); o.onInfo(); }); }
      const s = K.el("button", "!btn !green", o.startLabel || "Let's play!", go);
      K.on(s, "click", () => {
        K.sfx("pop"); K.haptic(15);
        ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
        K.after(220, () => { ov.remove(); o.onStart(); });
      });
      return ov;
    };

    K.destroy = () => {
      dead = true;
      timers.forEach(clearTimeout); timers.clear();
      frames.forEach(h => cancelAnimationFrame(h.id)); frames.clear();
      offs.forEach(f => f()); offs.length = 0;
      parts.length = 0;
      root.innerHTML = ""; root.classList.remove(P);
    };
    return K;
  }

  // ---- pure maths (copied verbatim into the Node simulation) ----------------------
  const EDGE = 0.95, MAX_MULT = 100;
  const pWin = (c, dir) => dir > 0 ? (13 - c) / 12 : (c - 1) / 12; // chance among non-tie cards
  const nextPot = (pot, bet, c, dir, first) => first ? bet * EDGE / pWin(c, dir) : pot / pWin(c, dir);
  const drawCard = (rng, first) => first ? 3 + Math.floor(rng() * 9) : 1 + Math.floor(rng() * 13);

  const NAMES = ["", "Teeny Baby", "Pip", "Squeak", "Nibbles", "Fluff", "Pudding", "Biscuit", "Waffles", "Chonk", "Mega Chonk", "Prince Wheek", "Queen Squeak", "King Chonkers"];
  const SUITS = ["#c7f0b0", "#ffe08a", "#ffc1df", "#bfe9ff"];
  const LOSE = ["The pot got GASSED! 💨", "Nay-ver mind! Try again!", "Pffft! There goes the hay.", "Wrong way! The guinea giggled.", "Oopsie-poopsie!", "That card was a sneaky one!"];
  const RIGHT = ["Hay-yes!", "Wheek! Correct!", "Nailed it!", "Snack-tastic!", "Big brain guinea!", "Ooh, you're good!"];

  WW.registerGame({
    id: "hay-or-nay",
    name: "Hay or Nay?",
    icon: "🃏",
    place: "carnival",
    kind: "luck",
    blurb: "Higher or lower? Grow the pot, cash out before the fart!",
    mount(root, api) {
      const K = makeKit(root, api, "g-hay");
      K.css(`
        .P { position: absolute; inset: 0; overflow: hidden; background:
          repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 14px, transparent 14px 28px), radial-gradient(circle at 50% 30%, #3fa34d, #1f6b3a 80%); }
        .P-wrap { position: absolute; inset: 0; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; }
        .P-pot { margin: 0 10px; display: flex; align-items: center; justify-content: center; gap: 10px; background: #1d0d2e; border: 4px solid var(--ink); border-radius: 18px;
          box-shadow: 0 4px 0 var(--ink), inset 0 0 0 3px #3b2160; padding: 4px 12px; color: #ffe58a; min-height: 58px; }
        .P-pot .P-pl { font-weight: 900; font-size: 13px; line-height: 1.05; text-align: right; }
        .P-pot .P-pv { font-family: var(--display); font-size: 36px; color: var(--yellow); text-shadow: 0 0 12px rgba(255,216,77,.7); display: flex; align-items: center; gap: 6px; }
        .P-pot .P-pm { font-family: var(--display); font-size: 16px; background: var(--yellow); color: var(--ink); border: 3px solid var(--ink); border-radius: 10px; padding: 0 6px; }
        .P-pot.P-gassed { background: #3b5e16; animation: P-stink .5s 3; }
        @keyframes P-stink { 50% { transform: rotate(-2deg) scale(.97); } }
        .P-table { position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px 8px 4px; }
        .P-cards { position: relative; width: calc(var(--cw) * 1.62); height: calc(var(--cw) * 1.45); flex: none; perspective: 900px; }
        .P-card { position: absolute; top: 0; width: var(--cw); height: calc(var(--cw) * 1.4); transform-style: preserve-3d; transition: none; }
        .P-face, .P-back { position: absolute; inset: 0; border: 5px solid var(--ink); border-radius: calc(var(--cw) * .12); backface-visibility: hidden; -webkit-backface-visibility: hidden; box-shadow: 0 6px 0 var(--ink); overflow: hidden; }
        .P-face { background: var(--card); transform: rotateY(180deg); }
        .P-face .P-band { position: absolute; left: 0; right: 0; top: 0; height: 34%; background: var(--suit); border-bottom: 4px dashed rgba(43,22,64,.25); }
        .P-num { position: absolute; font-family: var(--display); font-size: calc(var(--cw) * .26); line-height: 1; color: var(--ink); }
        .P-num.P-tl { left: 7%; top: 5%; } .P-num.P-tr { right: 8%; top: 7%; font-size: calc(var(--cw) * .13); opacity: .55; }
        .P-art { position: absolute; left: 50%; top: 54%; transform: translate(-50%,-50%); display: grid; place-items: center; }
        .P-art svg { display: block; }
        .P-crown { position: absolute; left: 50%; top: -24%; transform: translateX(-50%); font-size: calc(var(--cw) * .22); }
        .P-cname { position: absolute; left: 0; right: 0; bottom: 6%; text-align: center; font-family: var(--display); font-size: calc(var(--cw) * .1); color: var(--ink-soft); }
        .P-back { background: repeating-linear-gradient(45deg, #ff8fc7 0 10px, #ff74b8 10px 20px); display: grid; place-items: center; }
        .P-back div { width: 70%; aspect-ratio: 1; border-radius: 50%; background: var(--yellow); border: 4px solid var(--ink); display: grid; place-items: center; font-family: var(--display); font-size: calc(var(--cw) * .17); text-align: center; line-height: .95; }
        .P-card.P-gold .P-face { box-shadow: 0 6px 0 var(--ink), 0 0 0 4px var(--yellow); }
        .P-ladder { width: 74px; flex: none; display: flex; flex-direction: column-reverse; gap: 4px; max-height: 100%; overflow: hidden; }
        .P-rung { position: relative; height: 30px; border: 3px solid var(--ink); border-radius: 10px; background: rgba(255,255,255,.25); display: flex; align-items: center; justify-content: space-between;
          padding: 0 6px; font-family: var(--display); font-size: 13px; color: rgba(255,255,255,.75); flex: none; transition: background .3s, transform .3s; }
        .P-rung i { font-style: normal; font-size: 10px; font-family: var(--body); font-weight: 900; }
        .P-rung.P-done { background: var(--yellow); color: var(--ink); }
        .P-rung.P-now { background: var(--slime); color: var(--ink); transform: scale(1.12); box-shadow: 0 0 0 3px #fff; }
        .P-rung.P-top { background: var(--pink); color: var(--ink); }
        .P-say { text-align: center; font-family: var(--display); font-size: 19px; margin-bottom: 8px; color: #fff; -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 0 3px 0 var(--ink); min-height: 30px; padding: 0 8px; }
        .P-say.P-pop { animation: P-pop .35s cubic-bezier(.3,1.6,.5,1); }
        .P-ctrl { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 4px 12px calc(12px + var(--safe-bottom)); }
        .P-two { display: flex; gap: 10px; width: min(100%, 380px); }
        .P-two .btn { flex: 1; min-height: 76px; flex-direction: column; gap: 0; line-height: 1; padding: 6px 8px; }
        .P-two .btn b { font-family: var(--display); font-weight: 400; font-size: 26px; }
        .P-two .btn small { font-family: var(--body); font-weight: 900; font-size: 13px; margin-top: 3px; }
        .P-cash { width: min(100%, 380px); min-height: 56px; font-size: 21px; background: var(--yellow); }
        .P-cash small, .P-deal small { font-family: var(--body); font-weight: 900; font-size: 13px; }
        .P-deal { width: min(100%, 380px); min-height: 62px; font-size: 24px; }
        .P-hidden { display: none !important; }
      `);

      const wrap = K.el("div", "wrap", null, root);
      K.hud(wrap, showRules);
      const potEl = K.el("div", "pot", `<div class="g-hay-pl">THE<br>POT</div><div class="g-hay-pv">${K.coinSVG(30)}<span>0</span></div><div class="g-hay-pm">x0</div>`, wrap);
      const potNum = potEl.querySelector(".g-hay-pv span"), potMult = potEl.querySelector(".g-hay-pm");
      const table = K.el("div", "table", null, wrap);
      const cardsEl = K.el("div", "cards", null, table);
      const ladder = K.el("div", "ladder", null, table);
      const sayEl = K.el("div", "say", "", wrap);
      const ctrl = K.el("div", "ctrl", null, wrap);
      const two = K.el("div", "two", null, ctrl);
      const hiBtn = K.el("button", "!btn !green", "", two);
      const loBtn = K.el("button", "!btn !pink", "", two);
      const cashBtn = K.el("button", "cash !btn", "", ctrl);
      const betBox = K.el("div", null, null, ctrl);
      betBox.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:10px;width:100%";
      K.chips(betBox, { onChange: () => setDeal() });
      const dealBtn = K.el("button", "deal !btn !green", "", betBox);
      const setDeal = () => { dealBtn.innerHTML = `Deal! &nbsp;<small>bet ${K.bet} 🪙</small>`; };
      setDeal();

      let cw = 130, round = null, busy = false, curEl = null;
      function layout() {
        const W = root.clientWidth, H = root.clientHeight;
        cw = Math.round(Math.max(96, Math.min(170, (W - 120) / 1.62, (H - 430) / 1.5)));
        root.style.setProperty("--cw", cw + "px");
      }

      function cardHTML(v) {
        const s = Math.round(cw * (0.44 + v * 0.027));
        const svg = api.randomGuineaSVG(v * 7 + 3, { size: s });
        const crown = v >= 11 ? `<div class="g-hay-crown">${v === 13 ? "👑" : v === 12 ? "🎀" : "🎩"}</div>` : v === 1 ? `<div class="g-hay-crown" style="font-size:${cw * .14}px;top:-30%">🍼</div>` : "";
        return `<div class="g-hay-back"><div>HAY<br>or<br>NAY</div></div>
          <div class="g-hay-face" style="--suit:${SUITS[v % 4]}"><div class="g-hay-band"></div>
          <div class="g-hay-num g-hay-tl">${v}</div><div class="g-hay-num g-hay-tr">${v}</div>
          <div class="g-hay-art" style="width:${s}px">${crown}${svg}</div><div class="g-hay-cname">${NAMES[v]}</div></div>`;
      }
      function makeCard(v, faceUp) {
        const c = K.el("div", "card", cardHTML(v), cardsEl);
        c.style.left = (cw * .62) + "px";
        c.style.transform = faceUp ? "rotateY(180deg)" : "none";
        return c;
      }
      // the deck (face down) on the right, current card on the left
      function placeDeck() {
        const d = K.el("div", "card", `<div class="g-hay-back"><div>HAY<br>or<br>NAY</div></div>`, cardsEl);
        d.style.left = (cw * .62) + "px"; d.style.zIndex = 0; d.style.transform = "translate(4px,4px)";
        const d2 = K.el("div", "card", `<div class="g-hay-back"><div>HAY<br>or<br>NAY</div></div>`, cardsEl);
        d2.style.left = (cw * .62) + "px"; d2.style.zIndex = 0;
      }
      async function flipIn(v) {
        const c = makeCard(v, false);
        c.style.zIndex = 5;
        K.sfx("whoosh");
        const a = c.animate([{ transform: "translate(0,0) rotateY(0deg)" }, { transform: `translate(${-cw * .31}px,-24px) rotateY(90deg) scale(1.08)`, offset: .5 }, { transform: `translate(${-cw * .62}px,0) rotateY(180deg)` }], { duration: 520, easing: "cubic-bezier(.3,.9,.4,1.1)", fill: "forwards" });
        await K.wait(260); K.sfx("pop");
        await K.wait(280);
        a.cancel(); c.style.transform = `translate(${-cw * .62}px,0) rotateY(180deg)`;
        if (curEl) { const old = curEl; old.animate([{ opacity: 1 }, { opacity: 0, transform: `translate(${-cw * .9}px,30px) rotateY(180deg) rotate(-20deg)` }], { duration: 300, fill: "forwards" }); K.after(320, () => old.remove()); }
        c.style.zIndex = 4; curEl = c;
        return c;
      }

      function setPot(v, mult) {
        const from = parseInt(potNum.textContent.replace(/,/g, ""), 10) || 0;
        K.countUp(potNum, from, Math.round(v), 450);
        potMult.textContent = "x" + (mult >= 10 ? mult.toFixed(0) : mult.toFixed(1));
      }
      function say(t) { sayEl.innerHTML = t; sayEl.classList.remove("g-hay-pop"); void sayEl.offsetWidth; sayEl.classList.add("g-hay-pop"); }

      function buildLadder() {
        ladder.innerHTML = "";
        const n = Math.max(6, Math.min(12, Math.floor((table.clientHeight - 10) / 34)));
        for (let i = 1; i <= n; i++) K.el("div", "rung" + (i === n ? " g-hay-top" : ""), `<span>${i}</span><i>${i === n ? "🏆" : "?"}</i>`, ladder);
      }
      function markLadder(wins, pot) {
        const rungs = [...ladder.children];
        wins = Math.min(wins, rungs.length);
        rungs.forEach((r, i) => {
          r.classList.toggle("g-hay-done", i < wins - 1);
          r.classList.toggle("g-hay-now", i === wins - 1);
          if (i === wins - 1) r.querySelector("i").textContent = K.fmt(pot);
        });
      }

      function showButtons(mode) {
        two.classList.toggle("g-hay-hidden", mode !== "play");
        cashBtn.classList.toggle("g-hay-hidden", mode !== "play");
        betBox.classList.toggle("g-hay-hidden", mode !== "bet");
      }
      function refreshPlay() {
        const r = round, c = r.card;
        const opt = (dir, btn, word, arrow) => {
          const p = pWin(c, dir);
          if (p <= 0) { btn.disabled = true; btn.innerHTML = `<b>${word} ${arrow}</b><small>impossible!</small>`; return; }
          btn.disabled = busy;
          const np = nextPot(r.pot, r.bet, c, dir, r.wins === 0);
          btn.innerHTML = `<b>${word} ${arrow}</b><small>${dir > 0 ? "higher" : "lower"} → ${K.fmt(np)} 🪙</small>`;
        };
        opt(1, hiBtn, "HAY!", "⬆");
        opt(-1, loBtn, "NAY!", "⬇");
        cashBtn.disabled = busy || r.wins === 0;
        cashBtn.innerHTML = r.wins === 0 ? `CASH OUT <small>&nbsp;(win a guess first)</small>` : `💰 CASH OUT ${K.fmt(Math.round(r.pot))} 🪙`;
      }

      async function deal() {
        if (busy) return;
        if (!api.spend(K.bet)) { K.sfx("buzz"); say(api.coins() < 5 ? "Out of coins! Go play a skill game." : "Not enough coins!"); K.chipsAll.forEach(c => c.refresh()); return; }
        K.refreshCoins(); busy = true;
        round = { bet: K.bet, pot: K.bet, wins: 0, card: drawCard(Math.random, true) };
        potEl.classList.remove("g-hay-gassed");
        setPot(K.bet, 1); potMult.textContent = "BET";
        buildLadder(); showButtons("play");
        await flipIn(round.card);
        busy = false; refreshPlay();
        say(`Is the next card <b style="color:#b8ff8a">higher</b> or <b style="color:#ffc1df">lower</b> than ${round.card}?`);
      }

      async function guess(dir) {
        if (busy || !round) return;
        const r = round, c = r.card, p = pWin(c, dir);
        if (p <= 0) return;
        busy = true; refreshPlay(); K.sfx("click"); K.haptic(10);
        const nv = drawCard(Math.random, false);
        const el = await flipIn(nv);
        r.card = nv;
        const [x, y] = K.local(el);
        if (nv === c) {
          K.sfx("boop"); say("Twins! 👯 Free pass, guess again!");
          el.animate([{ transform: el.style.transform + " scale(1)" }, { transform: el.style.transform + " scale(1.08)" }, { transform: el.style.transform }], { duration: 300 });
        } else if ((nv > c) === (dir > 0)) {
          const first = r.wins === 0;
          r.pot = nextPot(r.pot, r.bet, c, dir, first); // never clamped: clamping would make the step unfair
          r.wins++;
          setPot(r.pot, r.pot / r.bet); markLadder(r.wins, r.pot);
          K.sfx(r.wins >= 4 ? "win" : "coin"); K.sparkle(x, y, 14 + r.wins * 3);
          say(`${K.pick(RIGHT)} Pot: ${K.fmt(Math.round(r.pot))}`);
          potEl.animate([{ transform: "scale(1.08)" }, { transform: "none" }], { duration: 300 });
          if (r.pot >= r.bet * MAX_MULT) { await K.wait(500); busy = false; await cashOut(true); return; }
          if (r.wins === ladder.children.length) { K.sfx("fanfare"); say("TOP OF THE LADDER! Cash out?! 🏆"); }
        } else {
          // wrong: the pot gets gassed
          K.sfx("fart"); K.after(200, () => K.sfx("lose")); K.haptic(200);
          K.gas(x, y); K.after(150, () => K.gas(...K.local(potEl)));
          K.shake(root, 8);
          potEl.classList.add("g-hay-gassed");
          el.animate([{ transform: el.style.transform }, { transform: el.style.transform + " rotate(-8deg)" }, { transform: el.style.transform + " rotate(6deg)" }, { transform: el.style.transform }], { duration: 400 });
          say(K.pick(LOSE) + (r.wins ? ` (lost ${K.fmt(Math.round(r.pot))})` : ""));
          setPot(0, 0); potMult.textContent = "💨";
          round = null;
          await K.wait(900);
          busy = false; showButtons("bet"); K.chipsAll.forEach(x => x.refresh()); setDeal();
          dealBtn.innerHTML = api.coins() >= 5 ? `Play again! &nbsp;<small>bet ${K.bet} 🪙</small>` : `Out of coins 😢`;
          dealBtn.disabled = api.coins() < 5;
          return;
        }
        busy = false; refreshPlay();
      }

      async function cashOut(auto) {
        if (busy || !round || round.wins === 0) return;
        busy = true;
        const r = round; round = null;
        const amt = Math.round(r.pot);
        const got = api.award(amt, { reason: "Hay or Nay cash out x" + (r.pot / r.bet).toFixed(2) });
        K.refreshCoins();
        const [x, y] = K.local(potEl);
        K.float(x, y + 20, "+" + K.fmt(got));
        const m = r.pot / r.bet;
        if (m >= 10) {
          K.sfx("bigwin"); K.after(450, () => K.sfx("fanfare")); K.haptic(220); K.flash("#ffd84d", 600); K.shake(root, 10);
          K.banner(auto ? "MAX POT!!" : "HUGE CASH OUT!", "+" + K.fmt(got) + " 🪙", "", 2600);
          K.fountain(x, y + 40, 110, 1.3); K.after(400, () => K.coinRain(70)); K.confetti(potEl, 160);
        } else if (m >= 3) {
          K.sfx("bigwin"); K.haptic(120); K.flash("#fff", 350);
          K.banner("CASHED OUT!", "+" + K.fmt(got) + " 🪙", "green", 1900);
          K.fountain(x, y + 30, 60); K.confetti(potEl, 90);
        } else {
          K.sfx("win"); K.fountain(x, y + 30, 20, .7); K.sparkle(x, y, 18);
        }
        say(`Smart guinea! You banked ${K.fmt(got)} coins! 🏦`);
        potMult.textContent = "✔";
        await K.wait(700);
        busy = false; showButtons("bet"); K.chipsAll.forEach(c => c.refresh()); setDeal();
        dealBtn.innerHTML = `Play again! &nbsp;<small>bet ${K.bet} 🪙</small>`;
      }

      K.on(hiBtn, "click", () => guess(1));
      K.on(loBtn, "click", () => guess(-1));
      K.on(cashBtn, "click", () => cashOut(false));
      K.on(dealBtn, "click", deal);

      function showRules() {
        K.modal("How it works", `<table class="g-hay-ptab">
          <tr><td>Guess right</td><td>pot grows</td></tr>
          <tr><td>Hard guess (e.g. higher than 11)</td><td>grows a LOT</td></tr>
          <tr><td>Easy guess (e.g. higher than 2)</td><td>grows a little</td></tr>
          <tr><td>Same number (twins)</td><td>free pass</td></tr>
          <tr><td>Wrong guess</td><td>pot gassed 💨</td></tr>
          <tr><td>Pot hits 100x bet</td><td>JACKPOT! 🏆</td></tr>
        </table><div class="g-hay-note">Cards go from 1 (Teeny Baby) to 13 (King Chonkers). Each button shows what the pot becomes.<br>Win one guess, then cash out any time. On average you get back about 95 of every 100 coins.</div>`);
      }

      layout();
      K.on(window, "resize", layout);
      placeDeck();
      showButtons("bet");
      say("Pick a bet and deal!");
      setPot(0, 0); potMult.textContent = "x0";
      K.intro({
        title: "Hay or Nay?",
        ribbon: "🎪 Carnival",
        art: `<div style="display:flex;gap:6px;transform:rotate(-4deg)">${[3, 13].map(v => `<div style="width:84px;height:112px;background:#fffdf8;border:4px solid ${"#2b1640"};border-radius:12px;box-shadow:0 5px 0 #2b1640;display:grid;place-items:center;position:relative"><span style="position:absolute;left:6px;top:2px;font-family:var(--display);font-size:22px">${v}</span>${api.randomGuineaSVG(v * 7 + 3, { size: 60 })}</div>`).join("")}<div style="font-family:var(--display);font-size:40px;align-self:center">⬆⬇</div></div>`,
        how: ["Will the next card be <b>higher (HAY!)</b> or <b>lower (NAY!)</b>?", "Each right guess grows the pot. <b>Cash out</b> before a wrong guess gasses it! 💨"],
        onInfo: showRules,
        startLabel: "Let's play!",
        onStart: () => { K.chipsAll.forEach(c => c.refresh()); setDeal(); },
      });
      return { destroy() { K.destroy(); } };
    },
  });
})();
