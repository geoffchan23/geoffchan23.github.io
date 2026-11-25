/* Slime Plinko: drop slime balls through a peg pyramid (Wheek World, carnival, luck).
 *
 * Math (verified by a 300k-ball Node simulation that runs the exact PHYSICS block below,
 * 60k balls per chute, see makeBoard/newBall/stepBall):
 *   13 slots pay 15x 4x 1.8x 1x 0.6x 0.4x 0.2x 0.4x 0.6x 1x 1.8x 4x 15x the bet.
 *   1 ball in 25 is a Golden Slime that pays double.
 *   RTP by chute (left to right): 94.4%, 91.4%, 93.9%, 92.4%, 93.5%; average 93.1%.
 *   Edge 15x lands about 1 ball in 110 (30x when golden).
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

  // ---- PHYSICS (pure; the Node RTP simulation runs exactly this code) ------------
  const ROWS = 12;
  const MULTS = [15, 4, 1.8, 1, 0.6, 0.4, 0.2, 0.4, 0.6, 1, 1.8, 4, 15];
  const GOLD_CHANCE = 1 / 25; // a golden slime pays double
  function makeBoard() {
    const S = 26, V = 23, top = 70, cx = 182;
    const pegs = [];
    for (let r = 0; r < ROWS; r++) {
      const n = r + 3, y = top + r * V;
      for (let i = 0; i < n; i++) pegs.push({ x: cx + (i - (n - 1) / 2) * S, y, r: 3.6, row: r });
    }
    const lastN = ROWS + 2, yLast = top + (ROWS - 1) * V;
    const x0 = cx - (lastN - 1) / 2 * S; // first peg of last row = left edge of slot 0
    return { S, V, top, cx, pegs, yLast, x0, slots: ROWS + 1, W: 364, H: yLast + 62, ballR: 7.2,
      chutes: [-2, -1, 0, 1, 2].map(k => cx + k * S * .5) };
  }
  function newBall(B, chute, rnd) {
    return { x: B.chutes[chute] + (rnd() - .5) * 3, y: B.top - 46, vx: (rnd() - .5) * 8, vy: 0, done: false, slot: -1, sq: 0, nx: 0, ny: 1 };
  }
  // Advances one ball by dt seconds. Returns the index of a peg it bounced off (or -1).
  function stepBall(b, B, dt, rnd) {
    const g = 1500, R = B.ballR;
    b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    const sp = Math.hypot(b.vx, b.vy); if (sp > 640) { b.vx *= 640 / sp; b.vy *= 640 / sp; }
    let hit = -1;
    const row = Math.round((b.y - B.top) / B.V);
    for (let rr = row - 1; rr <= row + 1; rr++) {
      if (rr < 0 || rr >= ROWS) continue;
      const n = rr + 3, base = (rr * (rr + 5)) / 2; // pegs before row rr = sum_{k<rr}(k+3)
      for (let i = 0; i < n; i++) {
        const p = B.pegs[base + i], dx = b.x - p.x, dy = b.y - p.y, d2 = dx * dx + dy * dy, m = R + p.r;
        if (d2 >= m * m || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
        b.x = p.x + nx * m; b.y = p.y + ny * m;
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) {
          const e = .42;
          b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny;
          const tx = -ny, ty = nx, kick = (rnd() - .5) * 70 + (Math.abs(nx) < .25 ? (rnd() < .5 ? -40 : 40) : 0);
          b.vx += tx * kick; b.vy += ty * kick;
          b.vx *= .96;
          b.sq = Math.min(1, -vn / 260); b.nx = nx; b.ny = ny;
          hit = base + i;
        }
      }
    }
    // slanted side walls keep the ball inside the pyramid
    const t = Math.max(0, Math.min(1, (b.y - B.top) / (B.yLast - B.top)));
    const half = (2 + t * (ROWS - 1)) * B.S * .5 + B.S * .55;
    if (b.y > B.top - 10) {
      if (b.x < B.cx - half + R) { b.x = B.cx - half + R; if (b.vx < 0) b.vx = -b.vx * .5; }
      if (b.x > B.cx + half - R) { b.x = B.cx + half - R; if (b.vx > 0) b.vx = -b.vx * .5; }
    }
    if (b.y > B.yLast + 22) {
      b.done = true;
      b.slot = Math.max(0, Math.min(B.slots - 1, Math.floor((b.x - B.x0) / B.S)));
    }
    b.sq *= Math.pow(.0005, dt);
    return hit;
  }
  // ---- END PHYSICS ---------------------------------------------------------------

  const SLOT_COL = m => m >= 15 ? "#ff5a5f" : m >= 4 ? "#ff9f43" : m >= 1.8 ? "#ffd84d" : m >= 1 ? "#7be04a" : m >= .6 ? "#5fd3ff" : m >= .4 ? "#c7b3ff" : "#b9a6d9";
  const LOSE = ["Splat! Tiny win.", "Boing boing... meh.", "The slime got sleepy.", "Goo-d try!", "Squelch. Try another!", "The middle is hungry!"];

  WW.registerGame({
    id: "slime-plinko",
    name: "Slime Plinko",
    icon: "🟢",
    place: "carnival",
    kind: "luck",
    blurb: "Drop slime through the pegs. Edges pay 15x!",
    mount(root, api) {
      const K = makeKit(root, api, "g-plk");
      K.css(`
        .P { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(circle at 50% 0%, #6a3fb0, #2b1640 75%); color: var(--ink); }
        .P-wrap { position: absolute; inset: 0; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; }
        .P-hud .P-coins { background: #fff; }
        .P-title { text-align: center; font-family: var(--display); font-size: 30px; line-height: 1; color: var(--slime); -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill;
          text-shadow: 0 4px 0 var(--ink), 0 0 18px rgba(123,224,74,.6); margin-top: -4px; }
        .P-hist { display: flex; justify-content: center; gap: 4px; min-height: 26px; margin: 6px 0 0; }
        .P-hist span { font-family: var(--display); font-size: 12px; border: 2.5px solid var(--ink); border-radius: 9px; padding: 1px 6px; animation: P-pop .3s cubic-bezier(.3,1.6,.5,1); }
        .P-stage { position: relative; flex: 1; min-height: 0; }
        .P-stage canvas { position: absolute; left: 0; top: 0; width: 100%; height: 100%; touch-action: none; }
        .P-msg { position: absolute; left: 50%; top: var(--msgy, 4px); transform: translateX(-50%); z-index: 3; font-weight: 900; font-size: 14px; color: #fff; white-space: nowrap; pointer-events: none;
          background: rgba(0,0,0,.25); border-radius: 12px; padding: 2px 10px; }
        .P-ctrl { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 4px 12px calc(12px + var(--safe-bottom)); }
        .P-drop { width: min(100%, 330px); min-height: 62px; font-size: 26px; letter-spacing: 1px; background: var(--slime); }
        .P-drop small { font-family: var(--body); font-weight: 900; font-size: 13px; letter-spacing: 0; opacity: .8; }
      `);
      const wrap = K.el("div", "wrap", null, root);
      K.hud(wrap, showOdds);
      K.el("div", "title", "SLIME PLINKO", wrap);
      const hist = K.el("div", "hist", null, wrap);
      const stage = K.el("div", "stage", null, wrap);
      const cv = K.el("canvas", null, null, stage);
      const msg = K.el("div", "msg", "Tap the board to drop! 👇", stage);
      const ctx = cv.getContext("2d");
      const ctrl = K.el("div", "ctrl", null, wrap);
      K.chips(ctrl, { onChange: () => setDrop() });
      const dropBtn = K.el("button", "drop !btn", "", ctrl);
      const setDrop = () => { dropBtn.innerHTML = `DROP! <small>${K.bet} 🪙</small>`; };
      setDrop();

      const B = makeBoard();
      const balls = [], splats = [], pegHit = new Float32Array(B.pegs.length), slotBump = new Float32Array(B.slots);
      let lastDraw = 0, chute = 2, scale = 1, ox = 0, oy = 0, W = 0, H = 0, dpr = 1, stopLoop = null, acc = 0, lastTick = 0, started = false;
      const TIME_SCALE = 1.55; // physics runs 1.55x real time (same fixed 1/240 s steps as the simulation)

      function layout() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = stage.clientWidth; H = stage.clientHeight;
        cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
        scale = Math.min((W - 12) / B.W, (H - 42) / B.H);
        ox = (W - B.W * scale) / 2; oy = 36 + Math.max(0, (H - 42 - B.H * scale) * .7);
        stage.style.setProperty("--msgy", Math.max(2, oy - 36) + "px");
        draw();
      }
      const sx = x => ox + x * scale, sy = y => oy + y * scale;

      // ---- drawing ------------------------------------------------------------------
      function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
      function draw(t) {
        t = t || performance.now() / 1000;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.save(); ctx.translate(ox, oy); ctx.scale(scale, scale);
        // pyramid glow
        ctx.fillStyle = "rgba(123,224,74,.07)";
        ctx.beginPath(); ctx.moveTo(B.cx - 40, B.top - 14); ctx.lineTo(B.cx + 40, B.top - 14); ctx.lineTo(B.cx + (B.slots / 2 + .6) * B.S, B.yLast + 12); ctx.lineTo(B.cx - (B.slots / 2 + .6) * B.S, B.yLast + 12); ctx.closePath(); ctx.fill();
        // chutes
        B.chutes.forEach((x, i) => {
          const sel = i === chute, h = 30;
          ctx.fillStyle = "#2b1640"; rr(x - 7.5, B.top - 62, 15, h + 4, 6); ctx.fill();
          ctx.fillStyle = sel ? "#a8f57a" : "#5fae3a"; rr(x - 5, B.top - 60, 10, h, 4); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x - 3, B.top - 57, 2, h - 8);
          // drip
          const dl = 3 + 3 * Math.sin(t * 3 + i);
          ctx.fillStyle = sel ? "#a8f57a" : "#5fae3a"; ctx.beginPath(); ctx.ellipse(x, B.top - 28 + dl, 2.6, dl, 0, 0, 7); ctx.fill();
          if (sel) { ctx.fillStyle = "#ffd84d"; ctx.beginPath(); const ay = B.top - 70 + Math.sin(t * 6) * 2; ctx.moveTo(x - 6, ay - 7); ctx.lineTo(x + 6, ay - 7); ctx.lineTo(x, ay); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#2b1640"; ctx.lineWidth = 2; ctx.stroke(); }
        });
        // splats (goo stuck on pegs)
        splats.forEach(s => { ctx.globalAlpha = Math.min(1, s.life / .8) * .9; ctx.fillStyle = s.gold ? "#ffd84d" : "#7be04a"; ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r, s.r * .8, s.a, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(s.x + Math.cos(s.a) * s.r * .3, s.y + s.r * .7 + s.drip, s.r * .35, s.r * .35 + s.drip * .6, 0, 0, 7); ctx.fill(); });
        ctx.globalAlpha = 1;
        // pegs
        B.pegs.forEach((p, i) => {
          const h = pegHit[i];
          if (h > 0) { ctx.fillStyle = `rgba(255,216,77,${h * .5})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 5 * h, 0, 7); ctx.fill(); }
          ctx.fillStyle = h > .05 ? "#fff3a8" : "#f4ecff"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + .5 + h * 1.2, 0, 7); ctx.fill();
          ctx.fillStyle = "rgba(43,22,64,.35)"; ctx.beginPath(); ctx.arc(p.x + .8, p.y + 1, p.r * .55, 0, 7); ctx.fill();
        });
        // slots
        for (let k = 0; k < B.slots; k++) {
          const m = MULTS[k], x = B.x0 + k * B.S, bump = slotBump[k], y = B.yLast + 24 + bump * 5;
          ctx.fillStyle = "#2b1640"; rr(x + 1, y + 2, B.S - 2, 26, 6); ctx.fill();
          ctx.fillStyle = bump > .05 ? "#fff" : SLOT_COL(m); rr(x + 1.5, y, B.S - 3, 24, 6); ctx.fill();
          ctx.strokeStyle = "#2b1640"; ctx.lineWidth = 2; rr(x + 1.5, y, B.S - 3, 24, 6); ctx.stroke();
          const lab = m % 1 ? String(m) : m + "x";
          ctx.fillStyle = "#2b1640"; ctx.font = `${lab.length > 2 ? 8.5 : 10}px "Bagel Fat One", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(lab, x + B.S / 2, y + 12.5);
        }
        // balls
        balls.forEach(b => drawBall(b, t));
        ctx.restore();
      }
      function drawBall(b, t) {
        const R = B.ballR, s = b.sq * .38;
        ctx.save(); ctx.translate(b.x, b.y);
        const ang = Math.atan2(b.ny, b.nx);
        ctx.rotate(ang); ctx.scale(1 - s, 1 + s * .7); ctx.rotate(-ang);
        const g = ctx.createRadialGradient(-R * .35, -R * .4, 1, 0, 0, R * 1.1);
        if (b.gold) { g.addColorStop(0, "#fffbe0"); g.addColorStop(.5, "#ffd84d"); g.addColorStop(1, "#e09a00"); }
        else { g.addColorStop(0, "#d8ffb8"); g.addColorStop(.55, "#7be04a"); g.addColorStop(1, "#3f9a1c"); }
        ctx.fillStyle = "#2b1640"; ctx.beginPath(); ctx.arc(0, 0, R + 1.6, 0, 7); ctx.fill();
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill();
        // eyes look where it's going
        const sp = Math.hypot(b.vx, b.vy) || 1, ex = b.vx / sp * 1.4, ey = b.vy / sp * 1.4;
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-2.6, -1, 2.3, 0, 7); ctx.arc(2.6, -1, 2.3, 0, 7); ctx.fill();
        ctx.fillStyle = "#2b1640"; ctx.beginPath(); ctx.arc(-2.6 + ex * .6, -1 + ey * .6, 1.2, 0, 7); ctx.arc(2.6 + ex * .6, -1 + ey * .6, 1.2, 0, 7); ctx.fill();
        if (b.gold && Math.sin(t * 20 + b.id) > .6) { ctx.fillStyle = "#fff"; ctx.fillRect(R * .5, -R * 1.1, 2, 5); ctx.fillRect(R * .5 - 1.5, -R * 1.1 + 1.5, 5, 2); }
        ctx.restore();
      }

      // ---- simulation loop ----------------------------------------------------------
      let nextId = 0;
      function run() {
        if (stopLoop) return;
        stopLoop = K.loop((dt, now) => {
          acc += dt * TIME_SCALE;
          const step = 1 / 240;
          let guard = 0;
          while (acc >= step && guard++ < 40) {
            acc -= step;
            for (let i = balls.length - 1; i >= 0; i--) {
              const b = balls[i];
              const hit = stepBall(b, B, step, Math.random);
              if (hit >= 0) onHit(b, hit, now);
              if (b.done) { balls.splice(i, 1); land(b); }
            }
          }
          for (let i = 0; i < pegHit.length; i++) if (pegHit[i] > 0) pegHit[i] = Math.max(0, pegHit[i] - dt * 3);
          for (let k = 0; k < slotBump.length; k++) if (slotBump[k] > 0) slotBump[k] = Math.max(0, slotBump[k] - dt * 3);
          for (let i = splats.length - 1; i >= 0; i--) { const s = splats[i]; s.life -= dt; s.drip = Math.min(4, s.drip + dt * 2.2); if (s.life <= 0) splats.splice(i, 1); }
          const busy = balls.length || splats.length;
          if (busy || now - lastDraw > 66) { lastDraw = now; draw(now / 1000); }
          if (!balls.length && !splats.length && !pegHit.some(h => h > 0) && !slotBump.some(h => h > 0) && !started) { stopLoop = null; return false; }
        });
      }
      function onHit(b, i, now) {
        const p = B.pegs[i];
        pegHit[i] = 1;
        if (b.sq > .25 && splats.length < 140) splats.push({ x: p.x + b.nx * p.r * .9, y: p.y + b.ny * p.r * .9, r: 1.6 + b.sq * 1.8, a: Math.random() * 3, life: 2.2 + Math.random(), drip: 0, gold: b.gold });
        if (now - lastTick > 45) { lastTick = now; K.sfx("tick"); }
      }
      function land(b) {
        const m = MULTS[b.slot], payout = Math.round(b.bet * m * (b.gold ? 2 : 1));
        slotBump[b.slot] = 1;
        const lx = ox + (B.x0 + (b.slot + .5) * B.S) * scale, ly = stage.offsetTop + oy + (B.yLast + 30) * scale;
        K.goo(lx, ly, 10, b.gold ? "#ffd84d" : "#7be04a");
        const pill = K.el("span", null, `${b.gold ? "⭐" : ""}${m * (b.gold ? 2 : 1)}x`, null);
        pill.style.background = SLOT_COL(m); hist.prepend(pill); while (hist.children.length > 8) hist.lastChild.remove();
        let got = 0;
        if (payout > 0) { got = api.award(payout, { reason: "Slime Plinko " + m + "x" + (b.gold ? " golden" : "") }); K.refreshCoins(); }
        K.float(lx, ly - 30, (m >= 1 || b.gold ? "+" : "") + K.fmt(got || payout), m >= 1 ? "#ffd84d" : "#c7b3ff");
        const eff = m * (b.gold ? 2 : 1);
        if (eff >= 15) {
          K.sfx("bigwin"); K.after(450, () => K.sfx("fanfare")); K.haptic(220); K.flash(b.gold ? "#ffd84d" : "#fff", 600); K.shake(stage, 12);
          K.banner(b.gold ? "GOLDEN<br>JACKPOT!" : "SLIME<br>JACKPOT!", "+" + K.fmt(got) + " 🪙", b.gold ? "" : "green", 2600);
          K.fountain(lx, ly, 110, 1.3); K.after(400, () => K.coinRain(80)); K.confetti(cv, 150);
          say(`${eff}x!!! The slime hit the edge! 🤩`);
        } else if (eff >= 4) {
          K.sfx("bigwin"); K.haptic(120); K.flash("#fff", 350); K.shake(stage, 7);
          K.banner("BIG SPLAT!", "+" + K.fmt(got) + " 🪙", "", 1800);
          K.fountain(lx, ly, 50); K.confetti(cv, 70);
          say(`${eff}x! Squishy win!`);
        } else if (eff >= 1) {
          K.sfx(eff >= 1.8 ? "win" : "coin"); K.sparkle(lx, ly, 12);
          say(b.gold ? `Golden slime! ${eff}x` : `${eff}x! Nice bounce!`);
        } else {
          K.sfx("splat");
          say(`${K.pick(LOSE)} (${eff}x)`);
        }
      }
      function say(t) { msg.textContent = t; msg.animate([{ transform: "translateX(-50%) scale(1.15)" }, { transform: "translateX(-50%) scale(1)" }], { duration: 250 }); }

      function drop(c) {
        if (c != null) chute = c;
        if (balls.length >= 12) { K.sfx("buzz"); say("Whoa, too much slime! Wait a sec."); return; }
        if (!api.spend(K.bet)) { K.sfx("buzz"); say(api.coins() < 5 ? "Out of coins! Go play a skill game." : "Not enough coins for that bet!"); K.chipsAll.forEach(x => x.refresh()); K.shake(ctrl, 6); return; }
        K.refreshCoins();
        const b = newBall(B, chute, Math.random);
        b.bet = K.bet; b.id = nextId++; b.gold = Math.random() < GOLD_CHANCE;
        balls.push(b);
        K.sfx(b.gold ? "sparkle" : "pop"); K.haptic(10);
        if (b.gold) say("✨ A GOLDEN SLIME! Pays double! ✨");
        run();
      }

      K.on(cv, "pointerdown", e => {
        if (!started) return;
        const r = cv.getBoundingClientRect(), x = (e.clientX - r.left - ox) / scale;
        let best = 0; B.chutes.forEach((cx, i) => { if (Math.abs(cx - x) < Math.abs(B.chutes[best] - x)) best = i; });
        drop(best);
      });
      K.on(dropBtn, "click", () => { if (started) drop(); });

      function showOdds() {
        const rows = MULTS.slice(0, 7).map((m, i) => `<tr><td><span style="display:inline-block;width:16px;height:16px;border-radius:5px;border:2px solid #2b1640;background:${SLOT_COL(m)};vertical-align:-2px"></span> ${i === 0 ? "Edge slots" : i === 6 ? "Middle slot" : "Slot " + (i + 1) + " from edge"}</td><td>${m}x</td></tr>`).join("");
        K.modal("Slot prizes", `<table class="g-plk-ptab">${rows}<tr><td>⭐ Golden slime (1 in 25)</td><td>x2</td></tr></table>
          <div class="g-plk-note">Every ball pays something! The middle is easy to hit, the edges are rare.<br>On average Plinko gives back about 93 of every 100 coins.</div>`);
      }

      layout();
      K.on(window, "resize", layout);
      // idle animation for the dripping tubes (cheap, stopped by destroy)
      started = false; run();
      K.intro({
        title: "Slime Plinko",
        ribbon: "🎪 Carnival",
        art: `<svg viewBox="0 0 200 120" width="210" height="126" aria-hidden="true">
          <rect x="4" y="4" width="192" height="112" rx="20" fill="#3a1d5c" stroke="#2b1640" stroke-width="5"/>
          ${[[60, 30], [100, 30], [140, 30], [40, 56], [80, 56], [120, 56], [160, 56], [60, 82], [100, 82], [140, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f4ecff"/><path d="M${x - 3} ${y + 3}q3 6 6 0" fill="#7be04a"/>`).join("")}
          ${["#ff5a5f", "#ff9f43", "#5fd3ff", "#c7b3ff", "#5fd3ff", "#ff9f43", "#ff5a5f"].map((c, i) => `<rect x="${17 + i * 24}" y="96" width="20" height="14" rx="4" fill="${c}" stroke="#2b1640" stroke-width="2.5"/>`).join("")}
          <g transform="translate(100 46) rotate(-12)"><ellipse rx="19" ry="16" fill="#7be04a" stroke="#2b1640" stroke-width="4.5"/><ellipse cx="-7" cy="-7" rx="6" ry="3.5" fill="#d8ffb8"/>
          <circle cx="-6" cy="0" r="4.5" fill="#fff"/><circle cx="6" cy="0" r="4.5" fill="#fff"/><circle cx="-5" cy="1.5" r="2.2" fill="#2b1640"/><circle cx="7" cy="1.5" r="2.2" fill="#2b1640"/><path d="M-4 8q4 4 8 0" stroke="#2b1640" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
          <path d="M118 30l4 -8M124 36l8 -4M82 30l-4 -8" stroke="#ffd84d" stroke-width="4" stroke-linecap="round"/></svg>`,
        how: ["<b>Tap the board</b> to drop a slime ball. It costs your bet.", "It bounces into a slot: edges pay <b>15x</b>! Drop lots at once!"],
        onInfo: showOdds,
        startLabel: "Drop slime!",
        onStart: () => { started = true; K.chipsAll.forEach(x => x.refresh()); setDrop(); run(); },
      });
      return { destroy() { K.destroy(); } };
    },
  });
})();
