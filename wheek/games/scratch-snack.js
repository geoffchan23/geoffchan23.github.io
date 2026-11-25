/* Scratch-a-Snack: scratch-card game for Wheek World (carnival, luck).
 *
 * Math (verified by a 2M-card Node simulation of dealCard + scoreCard below):
 *   Main prize (match 3 of a snack, at most one per card), as card-price multiples:
 *     carrot 1x (16%), lettuce 2x (9%), strawberry 4x (4.5%), melon 10x (1.2%), cupcake 25x (0.3%),
 *     golden pudding 100x (0.06%, 1 in ~1,670 cards)
 *   Golden Guinea bonus box (independent): 3x (3.5%) or MEGA 20x (0.2%).
 *   RTP = 77.5% + 14.5% = 92.0%; about 1 card in 3 wins something.
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

  const SNACKS = [
    { s: "🥕", name: "Carrot", mult: 1, p: 0.16 },
    { s: "🥬", name: "Lettuce", mult: 2, p: 0.09 },
    { s: "🍓", name: "Strawberry", mult: 4, p: 0.045 },
    { s: "🍉", name: "Melon", mult: 10, p: 0.012 },
    { s: "🧁", name: "Cupcake", mult: 25, p: 0.003 },
    { s: "🍮", name: "Golden Pudding", mult: 100, p: 0.0006 },
  ];
  const BONUS = [{ mult: 3, p: 0.035 }, { mult: 20, p: 0.002 }];
  const DUDS = ["🧦", "🪨", "🌾", "🥄", "🧽", "🍂"];

  // ---- pure card logic (copied verbatim into the Node simulation) ------------------
  function dealCard(rng) {
    rng = rng || Math.random;
    let r = rng(), win = -1;
    for (let i = 0; i < SNACKS.length; i++) { r -= SNACKS[i].p; if (r < 0) { win = i; break; } }
    const counts = SNACKS.map(() => 0), cells = [];
    if (win >= 0) { for (let k = 0; k < 3; k++) cells.push(win); counts[win] = 3; }
    // tease: losing cards often show two of a big prize
    if (win < 0 && rng() < 0.45) { const t = 3 + Math.floor(rng() * 3); cells.push(t, t); counts[t] = 2; }
    while (cells.length < 9) {
      const k = Math.floor(rng() * SNACKS.length);
      if (k === win || counts[k] >= 2) continue;
      counts[k]++; cells.push(k);
    }
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
    let b = rng(), bonus = 0;
    for (const x of BONUS) { b -= x.p; if (b < 0) { bonus = x.mult; break; } }
    return { cells, bonus };
  }
  function scoreCard(card) {
    const counts = SNACKS.map(() => 0);
    card.cells.forEach(k => counts[k]++);
    const win = counts.findIndex(c => c >= 3);
    return { win, mult: (win >= 0 ? SNACKS[win].mult : 0) + card.bonus };
  }

  const TIERS = { 5: ["Snack Card", "#5fd3ff", "#d9f5ff"], 10: ["Lunch Card", "#ff8fc7", "#ffe3f1"], 25: ["Feast Card", "#7be04a", "#e6fbd8"], 50: ["Royal Buffet", "#ffd84d", "#fff6c9"] };
  const LOSE = ["Nothing but crumbs! 🍪", "Your guinea ate the prize. Oops.", "So close! Two out of three ain't bad... (it is)", "Just hay. Lots of hay.", "No match! But you smell lovely.", "The snack ran away! 🏃"];

  WW.registerGame({
    id: "scratch-snack",
    name: "Scratch-a-Snack",
    icon: "🎟️",
    place: "carnival",
    kind: "luck",
    blurb: "Scratch the foil, match 3 snacks, win up to 100x!",
    mount(root, api) {
      const K = makeKit(root, api, "g-scr");
      K.css(`
        .P { position: absolute; inset: 0; overflow: hidden; background:
          radial-gradient(circle at 20% 15%, rgba(255,255,255,.6) 0 40px, transparent 41px),
          radial-gradient(rgba(255,255,255,.35) 2px, transparent 3px) 0 0/22px 22px, linear-gradient(160deg, #c7b3ff, #ffb3d9); }
        .P-wrap { position: absolute; inset: 0; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; }
        .P-mid { flex: 1; min-height: 0; display: grid; place-items: center; padding: 4px 12px; }
        .P-ticket { position: relative; width: calc(var(--cs) * 3 + 64px); background: var(--tbg); border: 5px solid var(--ink); border-radius: 26px; box-shadow: 0 8px 0 var(--ink);
          padding: 10px 14px 14px; }
        .P-ticket::before, .P-ticket::after { content: ""; position: absolute; top: 50%; width: 26px; height: 26px; border-radius: 50%; background: #e9c6f0; border: 5px solid var(--ink); transform: translateY(-50%); }
        .P-ticket::before { left: -16px; clip-path: inset(0 0 0 50%); } .P-ticket::after { right: -16px; clip-path: inset(0 50% 0 0); }
        .P-thead { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--tcol); border: 4px solid var(--ink); border-radius: 16px; padding: 4px 10px; margin-bottom: 6px; }
        .P-thead h2 { font-size: clamp(18px, calc(var(--cs) * .27), 26px); white-space: nowrap; color: #fff; -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 0 3px 0 var(--ink); }
        .P-price { font-family: var(--display); font-size: 16px; background: #fff; border: 3px solid var(--ink); border-radius: 10px; padding: 0 8px; white-space: nowrap; display: flex; align-items: center; gap: 3px; }
        .P-tsub { text-align: center; font-size: 14px; font-weight: 900; margin-bottom: 6px; }
        .P-zone { position: relative; touch-action: none; }
        .P-grid { display: grid; grid-template-columns: repeat(3, var(--cs)); gap: 8px; justify-content: center; }
        .P-cell { width: var(--cs); height: var(--cs); border-radius: 18px; background: #fff; border: 4px solid var(--ink); display: grid; place-items: center; font-size: calc(var(--cs) * .52); line-height: 1; position: relative; }
        .P-cell span { display: block; transform-origin: 50% 80%; }
        .P-cell.P-pop span { animation: P-pop .4s cubic-bezier(.3,1.8,.5,1); }
        .P-cell.P-win { background: #fff4b0; animation: P-glow .5s infinite alternate; z-index: 2; }
        .P-cell.P-win span { animation: P-jig .5s infinite alternate ease-in-out; }
        @keyframes P-jig { from { transform: rotate(-8deg) scale(1); } to { transform: rotate(8deg) scale(1.15); } }
        @keyframes P-glow { from { box-shadow: 0 0 0 0 var(--yellow); } to { box-shadow: 0 0 0 6px var(--yellow), 0 0 22px 6px rgba(255,216,77,.9); } }
        .P-cell.P-dim { opacity: .45; filter: grayscale(.6); }
        .P-bonus { margin-top: 8px; height: calc(var(--cs) * .62); border-radius: 18px; border: 4px dashed var(--ink); background: linear-gradient(90deg, #fff3b0, #ffe17a);
          display: flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--display); font-size: 18px; }
        .P-bonus .P-bi { font-size: calc(var(--cs) * .4); }
        .P-bonus.P-win { animation: P-glow .5s infinite alternate; border-style: solid; }
        .P-foil { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 18px; touch-action: none; cursor: crosshair; z-index: 3; }
        .P-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 10px; margin-top: 8px; font-size: 13px; font-weight: 900; }
        .P-legend span { white-space: nowrap; }
        .P-legend b { font-family: var(--display); font-weight: 400; font-size: 14px; }
        .P-hint { position: absolute; left: 50%; top: 42%; z-index: 4; transform: translate(-50%,-50%); pointer-events: none; font-size: 44px; animation: P-rub 1.1s infinite ease-in-out; }
        @keyframes P-rub { 0%,100% { transform: translate(-80%,-50%) rotate(-10deg); } 50% { transform: translate(-20%,-40%) rotate(10deg); } }
        .P-ctrl { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 4px 12px calc(12px + var(--safe-bottom)); }
        .P-ctrl .P-row { display: flex; gap: 10px; width: min(100%, 360px); }
        .P-ctrl .btn { flex: 1; min-height: 60px; font-size: 20px; }
        .P-ctrl .btn small { display: block; font-family: var(--body); font-weight: 900; font-size: 13px; line-height: 1; }
        .P-ctrl .P-col { display: flex; flex-direction: column; gap: 4px; line-height: 1; }
        .P-result { margin: 10px auto 0; width: fit-content; display: flex; align-items: center; justify-content: center; max-width: 100%; text-align: center; font-family: var(--display); font-size: 20px; line-height: 1.1;
          background: #fff; border: 4px solid var(--ink); border-radius: 16px; padding: 5px 14px; box-shadow: 0 4px 0 var(--ink); animation: P-pop .4s cubic-bezier(.3,1.6,.5,1); }
        .P-result.P-good { background: var(--slime); }
        .P-empty { text-align: center; font-family: var(--display); font-size: 22px; color: var(--ink); opacity: .8; }
        .P-flake { position: absolute; z-index: 5; width: 6px; height: 4px; background: #c9cfe0; border: 1px solid #8b90a8; pointer-events: none; }
      `);

      const wrap = K.el("div", "wrap", null, root);
      K.hud(wrap, showPrizes);
      const mid = K.el("div", "mid", null, wrap);
      const ctrl = K.el("div", "ctrl", null, wrap);
      K.chips(ctrl, { onChange: () => { setBuy(); if (!card) drawPreview(); } });
      const row = K.el("div", "row", null, ctrl);
      const revealBtn = K.el("button", "!btn !white", "Reveal all", row);
      const buyBtn = K.el("button", "!btn !green", "", row);
      const setBuy = () => { buyBtn.innerHTML = `<span class="g-scr-col">${card && !card.done ? "Scratching..." : "Buy card"}<small>${TIERS[K.bet][0]} · ${K.bet} 🪙</small></span>`; };

      let cs = 86, card = null, ticket = null, foil = null, fctx = null, zone = null, cellsEl = [], bonusEl = null, scratching = null, lastTick = 0, checkT = 0;
      function layout() {
        const W = root.clientWidth, H = root.clientHeight;
        cs = Math.round(Math.max(56, Math.min(100, (W - 104) / 3, (H - 470) / 3.7)));
        root.style.setProperty("--cs", cs + "px");
        fitTicket();
        if (foil && card && !card.done) { /* keep foil; sizes only change on rotation */ fitFoil(true); }
      }

      function buildTicket(c, preview) {
        mid.innerHTML = "";
        const t = TIERS[K.bet];
        ticket = K.el("div", "ticket", null, mid);
        ticket.style.setProperty("--tcol", t[1]); ticket.style.setProperty("--tbg", t[2]);
        K.el("div", "thead", `<h2>${t[0]}</h2><div class="g-scr-price">${K.coinSVG(18)}${K.bet}</div>`, ticket);
        K.el("div", "tsub", "Match 3 snacks to win!", ticket);
        zone = K.el("div", "zone", null, ticket);
        const grid = K.el("div", "grid", null, zone);
        cellsEl = [];
        for (let i = 0; i < 9; i++) cellsEl.push(K.el("div", "cell", `<span>${c ? SNACKS[c.cells[i]].s : "❔"}</span>`, grid));
        bonusEl = K.el("div", "bonus", c ? (c.bonus ? `<span class="g-scr-bi">🐹</span>${c.bonus >= 20 ? "MEGA GOLDEN GUINEA! " : "GOLDEN GUINEA! "}${c.bonus}x` : `<span class="g-scr-bi">${K.pick(DUDS)}</span>no bonus`) : `<span class="g-scr-bi">🐹</span>Golden Guinea bonus`, zone);
        K.el("div", "legend", SNACKS.slice().reverse().map(s => `<span>${s.s}x3 <b>${K.fmt(s.mult * K.bet)}</b></span>`).join("") + `<span>🐹 <b>${K.fmt(3 * K.bet)}-${K.fmt(20 * K.bet)}</b></span>`, ticket);
        if (preview) {
          foil = K.el("canvas", "foil", null, zone); foil.style.pointerEvents = "none";
          fctx = foil.getContext("2d", { willReadFrequently: true });
          fitFoil(false);
        }
        fitTicket();
      }
      function drawPreview() { buildTicket(null, true); }
      // shrink the whole ticket on short screens (pointer maths below divides the scale back out)
      let tScale = 1;
      function fitTicket() {
        if (!ticket) return;
        ticket.style.transform = "";
        tScale = Math.min(1, (mid.clientHeight - 26) / ticket.offsetHeight, (mid.clientWidth - 6) / ticket.offsetWidth);
        ticket.style.transform = tScale < 1 ? `scale(${tScale})` : "";
      }

      function fitFoil(keep) {
        const d = Math.min(2, window.devicePixelRatio || 1);
        const w = zone.clientWidth, h = zone.clientHeight;
        if (keep && foil.width === Math.round(w * d)) return;
        foil.width = Math.round(w * d); foil.height = Math.round(h * d);
        fctx.setTransform(d, 0, 0, d, 0, 0);
        paintFoil(w, h);
      }
      function paintFoil(w, h) {
        const c = fctx;
        c.globalCompositeOperation = "source-over";
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#b8bdd2"); g.addColorStop(.35, "#eef0f8"); g.addColorStop(.5, "#c3c8dc"); g.addColorStop(.7, "#f6f7fc"); g.addColorStop(1, "#aeb3c9");
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.globalAlpha = .18; c.strokeStyle = "#7d829c"; c.lineWidth = 6;
        for (let x = -h; x < w; x += 18) { c.beginPath(); c.moveTo(x, h); c.lineTo(x + h, 0); c.stroke(); }
        c.globalAlpha = 1;
        // per-cell foil stamps
        cellsEl.concat([bonusEl]).forEach((el, i) => {
          const r = { width: el.offsetWidth, height: el.offsetHeight }, x = el.offsetLeft, y = el.offsetTop;
          c.fillStyle = "rgba(120,126,155,.28)"; roundRect(c, x + 3, y + 3, r.width - 6, r.height - 6, 14); c.fill();
          c.fillStyle = "rgba(255,255,255,.75)"; c.font = `${i < 9 ? Math.round(cs * .42) : Math.round(cs * .3)}px "Bagel Fat One", sans-serif`;
          c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText(i < 9 ? "?" : "SCRATCH ME!", x + r.width / 2, y + r.height / 2 + 2);
        });
        for (let i = 0; i < 70; i++) { // sparkles
          const x = Math.random() * w, y = Math.random() * h, s = 1.5 + Math.random() * 3.5;
          c.fillStyle = Math.random() < .5 ? "#fff" : "#fdf3c4";
          c.beginPath(); c.moveTo(x, y - s * 2); c.lineTo(x + s * .5, y - s * .5); c.lineTo(x + s * 2, y); c.lineTo(x + s * .5, y + s * .5); c.lineTo(x, y + s * 2); c.lineTo(x - s * .5, y + s * .5); c.lineTo(x - s * 2, y); c.lineTo(x - s * .5, y - s * .5); c.fill();
        }
      }
      function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

      function buy() {
        if (card && !card.done) return;
        if (!api.spend(K.bet)) { K.sfx("buzz"); try { api.toast("Not enough coins for that card!"); } catch (e) { /* optional */ } K.shake(ctrl, 6); K.chipsAll.forEach(c => c.refresh()); return; }
        K.refreshCoins(); K.sfx("whoosh"); K.haptic(15);
        card = dealCard(); card.price = K.bet; card.done = false; card.revealed = new Set();
        buildTicket(card, false);
        fitTicket();
        const sc = tScale < 1 ? ` scale(${tScale})` : "";
        ticket.animate([{ transform: "translateY(120%) rotate(8deg)" + sc }, { transform: "translateY(-4%) rotate(-2deg)" + sc, offset: .7 }, { transform: sc ? sc.trim() : "none" }], { duration: 520, easing: "ease-out" });
        foil = K.el("canvas", "foil", null, zone); fctx = foil.getContext("2d", { willReadFrequently: true });
        fitFoil(false);
        const hint = K.el("div", "hint", "👆", zone);
        card.hint = hint;
        K.chipsAll.forEach(c => c.lock(true));
        buyBtn.disabled = true; revealBtn.disabled = false; setBuy();
        hookFoil();
      }

      function hookFoil() {
        const pos = e => { const r = foil.getBoundingClientRect(), k = foil.clientWidth / (r.width || 1); return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; };
        const scratch = (a, b) => {
          const c = fctx; c.globalCompositeOperation = "destination-out";
          c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = Math.max(30, cs * .42);
          c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0] + .01, b[1]); c.stroke();
          c.globalCompositeOperation = "source-over";
        };
        K.on(foil, "pointerdown", e => {
          if (!card || card.done) return;
          e.preventDefault();
          try { foil.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
          if (card.hint) { card.hint.remove(); card.hint = null; }
          scratching = { id: e.pointerId, p: pos(e) }; scratch(scratching.p, scratching.p);
        });
        K.on(foil, "pointermove", e => {
          if (!scratching || e.pointerId !== scratching.id || card.done) return;
          const p = pos(e); scratch(scratching.p, p);
          const dist = Math.hypot(p[0] - scratching.p[0], p[1] - scratching.p[1]);
          scratching.p = p;
          const now = performance.now();
          if (dist > 2 && now - lastTick > 55) { lastTick = now; K.sfx("tick"); if (Math.random() < .3) K.haptic(5); flake(p); }
          if (now - checkT > 180) { checkT = now; checkCoverage(); }
        });
        const up = e => { if (scratching && e.pointerId === scratching.id) { scratching = null; checkCoverage(); } };
        K.on(foil, "pointerup", up); K.on(foil, "pointercancel", up);
      }
      function flake(p) {
        const zr = zone.getBoundingClientRect(), rr = root.getBoundingClientRect();
        for (let i = 0; i < 2; i++) {
          const f = K.el("div", "flake", null, root);
          const x = zr.left - rr.left + p[0], y = zr.top - rr.top + p[1];
          f.style.left = x + "px"; f.style.top = y + "px";
          f.animate([{ transform: `rotate(${K.rand(0, 180)}deg)`, opacity: 1 }, { transform: `translate(${K.rand(-30, 30)}px, ${K.rand(40, 90)}px) rotate(${K.rand(200, 500)}deg)`, opacity: 0 }], { duration: 650, easing: "ease-in", fill: "forwards" });
          K.after(660, () => f.remove());
        }
      }
      function checkCoverage() {
        if (!card || card.done) return;
        const w = foil.width, h = foil.height;
        let data;
        try { data = fctx.getImageData(0, 0, w, h).data; } catch (e) { return; }
        const sx = w / zone.clientWidth;
        let clear = 0, tot = 0;
        const step = Math.max(4, Math.round(6 * sx));
        const areas = cellsEl.concat([bonusEl]).map(el => ({ x0: el.offsetLeft * sx, y0: el.offsetTop * sx, x1: (el.offsetLeft + el.offsetWidth) * sx, y1: (el.offsetTop + el.offsetHeight) * sx, c: 0, t: 0 }));
        for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
          const a = data[(y * w + x) * 4 + 3];
          const isClear = a < 40;
          for (const ar of areas) if (x >= ar.x0 && x < ar.x1 && y >= ar.y0 && y < ar.y1) { ar.t++; if (isClear) ar.c++; tot++; if (isClear) clear++; break; }
        }
        areas.forEach((ar, i) => {
          if (ar.t && ar.c / ar.t > .5 && !card.revealed.has(i)) {
            card.revealed.add(i);
            const el = i < 9 ? cellsEl[i] : bonusEl;
            el.classList.add("g-scr-pop"); K.sfx(i < 9 && card.cells[i] === 5 ? "sparkle" : "pop");
            if (i === 9 && card.bonus) { K.sfx("sparkle"); }
          }
        });
        if (tot && clear / tot >= .6) reveal();
      }

      async function reveal() {
        if (!card || card.done) return;
        card.done = true; revealBtn.disabled = true;
        if (card.hint) { card.hint.remove(); card.hint = null; }
        K.sfx("whoosh");
        const f = foil;
        f.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(1.04)" }], { duration: 380, fill: "forwards" });
        K.after(400, () => f.remove());
        await K.wait(420);
        const sc = scoreCard(card), price = card.price;
        const legend = ticket.querySelector(".g-scr-legend");
        const lh = legend.offsetHeight; legend.style.display = "none";
        const res = K.el("div", "result", "", ticket); res.style.minHeight = Math.max(0, lh - 10) + "px";
        if (sc.win >= 0) { cellsEl.forEach((el, i) => { if (card.cells[i] === sc.win) el.classList.add("g-scr-win"); else el.classList.add("g-scr-dim"); }); }
        if (card.bonus) bonusEl.classList.add("g-scr-win");
        if (sc.mult > 0) {
          const got = api.award(sc.mult * price, { reason: "Scratch-a-Snack" });
          K.refreshCoins();
          res.classList.add("g-scr-good"); res.innerHTML = `YOU WIN ${K.fmt(got)} 🪙`;
          const [x, y] = K.local(ticket);
          K.float(x, y - 60, "+" + K.fmt(got));
          if (sc.win === 5) {
            K.sfx("bigwin"); K.after(500, () => K.sfx("fanfare")); K.haptic(250); K.flash("#ffd84d", 700); K.shake(ticket, 14);
            K.banner("PUDDING<br>JACKPOT!", "+" + K.fmt(got) + " 🪙", "", 3000);
            K.fountain(x, y, 130, 1.4); K.after(500, () => K.coinRain(110)); K.confetti(ticket, 180);
          } else if (sc.mult >= 10) {
            K.sfx("bigwin"); K.after(400, () => K.sfx("fanfare")); K.haptic(150); K.flash("#fff", 450); K.shake(ticket, 9);
            K.banner(card.bonus >= 20 ? "MEGA GUINEA!" : "BIG WIN!", "+" + K.fmt(got) + " 🪙", card.bonus >= 20 ? "pink" : "", 2200);
            K.fountain(x, y, 70, 1.1); K.confetti(ticket, 110);
          } else {
            K.sfx(sc.mult >= 3 ? "win" : "coin"); K.sparkle(x, y, 24); K.fountain(x, y + 40, 8 + sc.mult * 4, .6); K.confetti(ticket, 30);
            if (card.bonus) K.sfx("wheek");
          }
        } else {
          res.innerHTML = K.pick(LOSE);
          res.style.fontSize = "15px";
          K.sfx("fart"); const [x, y] = K.local(ticket); K.gas(x, y);
          ticket.animate([{ transform: "rotate(0)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(2deg)" }, { transform: "none" }], { duration: 400 });
        }
        K.chipsAll.forEach(c => c.lock(false));
        buyBtn.disabled = api.coins() < 5; setBuy();
        buyBtn.innerHTML = api.coins() >= 5 ? `<span class="g-scr-col">New card!<small>${TIERS[K.bet][0]} · ${K.bet} 🪙</small></span>` : `<span class="g-scr-col">Out of coins<small>play a skill game!</small></span>`;
      }

      K.on(buyBtn, "click", buy);
      K.on(revealBtn, "click", () => { K.sfx("click"); reveal(); });
      revealBtn.disabled = true;

      function showPrizes() {
        K.modal("Snack prizes", `<table class="g-scr-ptab">${SNACKS.slice().reverse().map(s => `<tr><td><span style="font-size:22px">${s.s}${s.s}${s.s}</span> ${s.name}</td><td>${s.mult}x</td></tr>`).join("")}
          <tr><td><span style="font-size:22px">🐹</span> Golden Guinea box</td><td>3x</td></tr><tr><td><span style="font-size:22px">🐹</span> MEGA Golden Guinea</td><td>20x</td></tr></table>
          <div class="g-scr-note">Prizes are times the card price. Bigger cards = bigger prizes!<br>About 1 card in 3 wins. On average cards give back about 92 of every 100 coins.</div>`);
      }

      layout();
      K.on(window, "resize", layout);
      setBuy(); drawPreview();
      K.intro({
        title: "Scratch-a-Snack",
        ribbon: "🎪 Carnival",
        art: `<div style="font-size:56px;transform:rotate(-6deg);background:linear-gradient(135deg,#d0d4e4,#f4f6fb,#c3c8dc);border:5px solid var(--ink);border-radius:20px;padding:4px 18px;box-shadow:0 6px 0 var(--ink)">🍓🧁🍮</div>`,
        how: ["Pick a card, then <b>scratch the foil</b> with your finger!", "Match 3 snacks to win. Find the <b>Golden Guinea 🐹</b> for a bonus!"],
        betLabel: "Pick your card price",
        onInfo: showPrizes,
        startLabel: "Let's scratch!",
        onStart: () => { K.chipsAll.forEach(c => c.refresh()); setBuy(); drawPreview(); },
      });
      return { destroy() { K.destroy(); } };
    },
  });
})();
