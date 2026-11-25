/* Slime Slots: a 3-reel guinea-pig slot machine for Wheek World (carnival, luck).
 *
 * Math (verified by exact enumeration + 2M-spin Node simulation of evalSpin/REEL_WEIGHTS below):
 *   Each reel independently lands on a symbol with weights
 *     pudding 1, poop 4, guinea 3, squishy 4, slime 5, lettuce 6   (total 23)
 *   Pays (x bet, centre line): 3 pudding 100 | 3 poop 30 (STINKY JACKPOT) | 3 guinea 25 | 3 squishy 12
 *     | 3 slime 8 | 3 lettuce 5 | any 2 pudding 6 | first two reels match (guinea 5, squishy 3, slime 2, lettuce 2)
 *     | any 1 pudding 1 (bet back)
 *   RTP = 92.4%, hit rate 28.6%, pudding jackpot 1 in 12,167 spins.
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

  const SYMS = ["pudding", "poop", "guinea", "squishy", "slime", "lettuce"];
  const REEL_WEIGHTS = { pudding: 1, poop: 4, guinea: 3, squishy: 4, slime: 5, lettuce: 6 };
  const PAY3 = { pudding: 100, poop: 30, guinea: 25, squishy: 12, slime: 8, lettuce: 5 };
  const PAY2 = { guinea: 5, squishy: 3, slime: 2, lettuce: 2 };
  const NAMES = { pudding: "Golden Pudding", poop: "Poop", guinea: "Guinea", squishy: "Squishy", slime: "Slime", lettuce: "Lettuce" };

  // Pure payout logic (copied verbatim into the Node simulation).
  function evalSpin(s) {
    if (s[0] === s[1] && s[1] === s[2]) return { mult: PAY3[s[0]], kind: s[0] === "pudding" ? "jackpot" : s[0] === "poop" ? "stinky" : "three", cells: [0, 1, 2] };
    const pud = [0, 1, 2].filter(i => s[i] === "pudding");
    if (pud.length === 2) return { mult: 6, kind: "pud2", cells: pud };
    if (s[0] === s[1] && PAY2[s[0]]) return { mult: PAY2[s[0]], kind: "two", cells: [0, 1] };
    if (pud.length === 1) return { mult: 1, kind: "pud1", cells: pud };
    return { mult: 0, kind: "none", cells: [] };
  }
  function spinReel() {
    let r = Math.random() * 23;
    for (const k of SYMS) { r -= REEL_WEIGHTS[k]; if (r < 0) return k; }
    return "lettuce";
  }

  const INK = "#2b1640";
  const face = (cx, cy, s, mood) => {
    s = s || 1;
    const eye = (x) => `<ellipse cx="${x}" cy="${cy}" rx="${4.6 * s}" ry="${5.4 * s}" fill="${INK}"/><circle cx="${x + 1.4 * s}" cy="${cy - 2 * s}" r="${1.7 * s}" fill="#fff"/>`;
    const mouth = mood === "o" ? `<ellipse cx="${cx}" cy="${cy + 9 * s}" rx="${3.4 * s}" ry="${4 * s}" fill="${INK}"/>`
      : `<path d="M${cx - 5 * s} ${cy + 6 * s}q${5 * s} ${6 * s} ${10 * s} 0" fill="none" stroke="${INK}" stroke-width="${3.2 * s}" stroke-linecap="round"/>`;
    return eye(cx - 11 * s) + eye(cx + 11 * s) + `<ellipse cx="${cx - 19 * s}" cy="${cy + 6 * s}" rx="${4.5 * s}" ry="${2.6 * s}" fill="#ff7aa8" opacity=".7"/><ellipse cx="${cx + 19 * s}" cy="${cy + 6 * s}" rx="${4.5 * s}" ry="${2.6 * s}" fill="#ff7aa8" opacity=".7"/>` + mouth;
  };
  const ART = {
    lettuce: `<svg viewBox="0 0 100 100"><g stroke="${INK}" stroke-width="5" stroke-linejoin="round"><path d="M50 90C25 90 11 74 13 56C7 45 15 31 27 32C27 18 43 11 52 19C62 9 80 15 80 29C93 33 95 50 88 58C91 77 75 90 50 90Z" fill="#7be04a"/><path d="M50 90C30 84 26 66 30 50M50 90C70 84 74 66 70 50" fill="none" stroke="#2f7d14" stroke-width="4" stroke-linecap="round"/></g><path d="M30 40Q36 30 46 32" stroke="#c8ff9e" stroke-width="5" fill="none" stroke-linecap="round"/>${face(50, 58, .9)}</svg>`,
    squishy: `<svg viewBox="0 0 100 100"><path d="M50 16C76 16 92 36 90 60C88 82 72 90 50 90S12 82 10 60C8 36 24 16 50 16Z" fill="#ffb3d9" stroke="${INK}" stroke-width="5"/><path d="M40 16Q50 4 60 16" fill="#7be04a" stroke="${INK}" stroke-width="4"/><ellipse cx="30" cy="36" rx="9" ry="5" fill="#fff" opacity=".8" transform="rotate(-30 30 36)"/><path d="M76 24l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#fff"/>${face(50, 58, 1)}</svg>`,
    slime: `<svg viewBox="0 0 100 100"><path d="M18 80C10 70 12 52 20 40C28 22 44 14 56 16C76 18 90 36 88 58C87 70 84 78 80 82C79 92 72 94 70 84C64 88 56 88 50 86C46 96 36 96 36 86C30 86 24 86 18 80Z" fill="#7be04a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="36" cy="32" rx="10" ry="6" fill="#d8ffb8" transform="rotate(-30 36 32)"/><circle cx="72" cy="40" r="3" fill="#d8ffb8"/><circle cx="38" cy="54" r="9" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="64" cy="52" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="40" cy="56" r="4" fill="${INK}"/><circle cx="66" cy="55" r="5" fill="${INK}"/><path d="M44 70q8 8 16 0" fill="#ff7aa8" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
    poop: `<svg viewBox="0 0 100 100"><g stroke="${INK}" stroke-width="5" stroke-linejoin="round"><path d="M14 86C6 86 6 70 18 68C12 60 20 50 30 52C28 42 38 36 46 40C46 28 56 18 60 12C64 22 72 30 70 42C80 42 84 52 76 58C88 58 94 72 84 78C90 86 84 92 76 90Z" fill="#a0612e"/><path d="M20 70Q50 78 80 66M30 54Q50 60 70 50" fill="none" stroke="#7a431b" stroke-width="4" stroke-linecap="round"/></g><ellipse cx="44" cy="30" rx="5" ry="3" fill="#d79a62" transform="rotate(-30 44 30)"/>${face(50, 68, .85)}<path d="M84 18q6 6 0 12q-6 6 0 12M14 16q6 6 0 12q-6 6 0 12" fill="none" stroke="#7be04a" stroke-width="4" stroke-linecap="round"/></svg>`,
    pudding: `<svg viewBox="0 0 100 100"><g class="rays" opacity=".9"><path d="M50 50L40 0H60ZM50 50L100 40V60ZM50 50L60 100H40ZM50 50L0 60V40Z" fill="#fff3a8"/></g><path d="M22 84L30 40H70L78 84Z" fill="#ffd84d" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M28 50C30 38 40 34 50 34S70 38 72 50C70 58 66 54 64 60C62 66 58 58 56 64C52 70 50 58 46 62C42 68 40 56 36 60C32 64 30 56 28 50Z" fill="#b4561f" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M14 86H86" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M36 14L42 24L50 12L58 24L64 14L62 32H38Z" fill="#ffb82e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="18" r="3" fill="#ff5a5f"/>${face(50, 70, .7)}<path d="M80 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" stroke="${INK}" stroke-width="2"/></svg>`,
  };
  let guineaArt = "";
  const symHTML = s => s === "guinea" ? guineaArt : ART[s];

  WW.registerGame({
    id: "slime-slots",
    name: "Slime Slots",
    icon: "🎰",
    place: "carnival",
    kind: "luck",
    blurb: "Pull the lever! Three golden puddings = 100x!",
    mount(root, api) {
      const K = makeKit(root, api, "g-slots");
      guineaArt = api.guineaSVG({ size: 100, mood: "happy" }).replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"');
      K.css(`
        .P { position: absolute; inset: 0; overflow: hidden;
          background: repeating-conic-gradient(from 0deg at 50% 118%, #ff9fd0 0 7.5deg, #ffe6f3 7.5deg 15deg); }
        .P::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 35%, transparent 40%, rgba(43,22,64,.28)); }
        .P-wrap { position: absolute; inset: 0; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; z-index: 1; }
        .P-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 2px 10px 10px; min-height: 0; }
        .P-rig { position: relative; display: flex; align-items: stretch; }
        .P-cab { position: relative; background: linear-gradient(180deg, #9c6cff, #6c3fd8 70%, #5a2fc0); border: 5px solid var(--ink); border-radius: 30px;
          box-shadow: 0 8px 0 var(--ink), inset 0 4px 0 rgba(255,255,255,.35), inset 0 -6px 0 rgba(0,0,0,.18); padding: 10px 12px 12px; }
        .P-marq { position: relative; margin: -2px -2px 10px; background: var(--ink); border-radius: 20px; padding: 8px 8px 9px; text-align: center; }
        .P-title { font-family: var(--display); font-size: calc(var(--cell) * .4); line-height: 1; color: var(--slime); letter-spacing: 1px;
          -webkit-text-stroke: 2px #1a4a0a; paint-order: stroke fill; text-shadow: 0 0 12px rgba(123,224,74,.7); position: relative; }
        .P-title em { font-style: normal; color: var(--yellow); text-shadow: 0 0 12px rgba(255,216,77,.8); -webkit-text-stroke: 2px #6b4a00; }
        .P-drip { position: absolute; top: calc(100% - 4px); width: 9px; border-radius: 0 0 6px 6px; background: var(--slime); border: 2.5px solid var(--ink); border-top: 0; animation: P-drip 2.6s infinite ease-in-out; }
        @keyframes P-drip { 0%,100% { height: 8px; } 50% { height: 18px; } }
        .P-bulbs { display: flex; justify-content: space-between; padding: 0 4px; }
        .P-bulbs i { width: 9px; height: 9px; border-radius: 50%; background: #ffe58a; box-shadow: 0 0 6px #ffd84d; animation: P-blink .8s infinite steps(1); }
        .P-bulbs i:nth-child(2n) { animation-delay: .4s; }
        .P.P-hot .P-bulbs i { animation-duration: .16s; }
        @keyframes P-blink { 50% { background: #7a5a2a; box-shadow: none; } }
        .P-win .P-bulbs i { background: #fff; }
        .P-reels { position: relative; display: flex; gap: 8px; background: var(--ink); border-radius: 18px; padding: 6px; }
        .P-reel { position: relative; width: var(--cell); height: calc(var(--cell) * 3); overflow: hidden; border-radius: 12px;
          background: linear-gradient(180deg, #d9cbe9, #fffdf8 22%, #fffdf8 78%, #d9cbe9); }
        .P-reel::after { content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: 12px;
          background: linear-gradient(180deg, rgba(43,22,64,.45), transparent 26%, transparent 74%, rgba(43,22,64,.45)); }
        .P-reel.P-ant { animation: P-glow .35s infinite alternate; }
        @keyframes P-glow { from { box-shadow: inset 0 0 0 4px var(--yellow), 0 0 0 0 var(--yellow); } to { box-shadow: inset 0 0 0 4px #fff, 0 0 18px 6px var(--yellow); } }
        .P-strip { position: absolute; left: 0; right: 0; top: 0; will-change: transform; }
        .P-cell { position: absolute; left: 0; width: var(--cell); height: var(--cell); padding: 9%; display: grid; place-items: center; }
        .P-cell svg { width: 100%; height: 100%; overflow: visible; }
        .P-cell.P-hit { z-index: 2; }
        .P-cell.P-hit svg { animation: P-hit .5s infinite alternate cubic-bezier(.3,1.6,.5,1); }
        .P-cell.P-hit::before { content: ""; position: absolute; inset: 5%; border-radius: 50%; background: radial-gradient(#fff6a8, rgba(255,216,77,0) 70%); z-index: -1; }
        @keyframes P-hit { from { transform: scale(1); } to { transform: scale(1.14) rotate(-4deg); } }
        .P-line { position: absolute; left: -10px; right: -10px; top: 50%; height: 0; border-top: 4px dashed rgba(255,90,95,.75); pointer-events: none; z-index: 3; }
        .P-line::before, .P-line::after { content: ""; position: absolute; top: -12px; border: 10px solid transparent; }
        .P-line::before { left: -4px; border-left: 14px solid #ff5a5f; }
        .P-line::after { right: -4px; border-right: 14px solid #ff5a5f; }
        .P-ant-tag { position: absolute; top: -14px; right: -6px; z-index: 6; font-family: var(--display); font-size: 18px; background: var(--yellow); border: 3px solid var(--ink);
          border-radius: 12px; padding: 0 8px; transform: rotate(8deg); animation: P-wob .3s infinite alternate; }
        .P-lever { position: relative; width: 40px; margin-left: 4px; touch-action: none; cursor: grab; }
        .P-lslot { position: absolute; left: 7px; top: 34%; width: 20px; height: 34%; background: #4a2a78; border: 4px solid var(--ink); border-radius: 0 14px 14px 0; }
        .P-arm { position: absolute; left: 13px; top: 6%; width: 10px; height: calc(52%); background: linear-gradient(90deg, #ddd, #fff, #aaa); border: 3px solid var(--ink); border-radius: 6px; transform-origin: 50% 100%; }
        .P-knob { position: absolute; left: -2px; top: calc(6% - 20px); width: 40px; height: 40px; border-radius: 50%; border: 4px solid var(--ink);
          background: radial-gradient(circle at 35% 30%, #fff 0 12%, #ff6b8f 14%, #e8245a 70%); box-shadow: 0 4px 0 var(--ink); }
        .P-pull { position: absolute; left: -8px; top: calc(6% + 26px); font-family: var(--display); font-size: 12px; color: #fff; -webkit-text-stroke: 3px var(--ink); paint-order: stroke fill; writing-mode: vertical-rl; letter-spacing: 1px; animation: P-wob 1s infinite alternate; pointer-events: none; }
        .P-panel { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .P-pig { width: 56px; height: 48px; flex: none; transition: transform .2s; }
        .P-pig svg { width: 100%; height: 100%; }
        .P-led { flex: 1; min-height: 50px; background: #1d0d2e; border: 4px solid var(--ink); border-radius: 14px; box-shadow: inset 0 0 0 3px #3b2160;
          display: flex; align-items: center; justify-content: center; text-align: center; padding: 4px 10px; color: #ffe58a; font-size: 15px; line-height: 1.15; font-weight: 900; overflow: hidden; }
        .P-led b { font-family: var(--display); font-weight: 400; font-size: 26px; color: var(--yellow); text-shadow: 0 0 10px rgba(255,216,77,.8); margin-left: 6px; }
        .P-led.P-say { animation: P-say .35s cubic-bezier(.3,1.6,.5,1); }
        @keyframes P-say { from { transform: scale(.85); } }
        .P-ctrl { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 6px 10px calc(12px + var(--safe-bottom)); }
        .P-spin { width: min(100%, 330px); min-height: 66px; font-size: 30px; border-radius: 24px; letter-spacing: 2px; background: var(--slime); }
        .P-spin small { font-family: var(--body); font-weight: 900; font-size: 14px; letter-spacing: 0; opacity: .8; }
        .P-gasfog { position: absolute; inset: 0; z-index: 57; pointer-events: none; background: radial-gradient(circle at 50% 55%, rgba(150,230,60,.85), rgba(123,224,74,.35) 60%, rgba(123,224,74,0)); opacity: 0; }
        .P-ptab .P-mini { display: inline-block; width: 26px; height: 26px; vertical-align: middle; margin-right: 1px; }
        .P-ptab .P-mini svg { width: 100%; height: 100%; }
      `);

      const wrap = K.el("div", "wrap", null, root);
      const hud = K.hud(wrap, showPaytable);
      const main = K.el("div", "main", null, wrap);
      const rig = K.el("div", "rig", null, main);
      const cab = K.el("div", "cab", null, rig);
      const marq = K.el("div", "marq", `<div class="g-slots-bulbs">${"<i></i>".repeat(11)}</div><div class="g-slots-title">SLIME <em>SLOTS</em></div><div class="g-slots-bulbs">${"<i></i>".repeat(11)}</div>`, cab);
      [14, 38, 71, 88].forEach((l, i) => { const d = K.el("i", "drip", null, marq); d.style.left = l + "%"; d.style.animationDelay = (i * .7) + "s"; });
      const reelsEl = K.el("div", "reels", null, cab);
      K.el("div", "line", null, reelsEl);
      const panel = K.el("div", "panel", null, cab);
      const pig = K.el("div", "pig", api.guineaSVG({ size: 56, mood: "happy" }), panel);
      const led = K.el("div", "led", "Pull the lever!", panel);
      const lever = K.el("div", "lever", `<div class="g-slots-lslot"></div><div class="g-slots-arm"></div><div class="g-slots-knob"></div><div class="g-slots-pull">PULL</div>`, rig);
      const arm = lever.querySelector(".g-slots-arm"), knob = lever.querySelector(".g-slots-knob");
      const ctrl = K.el("div", "ctrl", null, wrap);
      K.chips(ctrl, { onChange: () => setSpinLabel() });
      const spinBtn = K.el("button", "spin !btn", "", ctrl);
      const setSpinLabel = () => { spinBtn.innerHTML = `SPIN <small>bet ${K.bet}</small>`; };
      setSpinLabel();
      const gasFog = K.el("div", "gasfog", null, root);

      // ---- reels ----------------------------------------------------------------
      const reels = [0, 1, 2].map(i => {
        const el = K.el("div", "reel", null, reelsEl);
        const strip = K.el("div", "strip", null, el);
        const cells = [0, 1, 2, 3].map(() => K.el("div", "cell", null, strip));
        const r = { el, strip, cells, seq: [spinReel(), spinReel(), spinReel(), spinReel()], k: 0, idx: -1 };
        return r;
      });
      let cell = 90;
      function render(r) {
        const base = Math.floor(r.k), frac = r.k - base;
        if (base !== r.idx) {
          r.idx = base;
          r.cells.forEach((c, j) => { const s = r.seq[base + 1 + j] || "lettuce"; if (c.dataset.s !== s) { c.dataset.s = s; c.innerHTML = symHTML(s); } });
        }
        // seq[i] sits at y = (i - k - 1) * cell, so lowering k scrolls symbols downward
        r.cells.forEach((c, j) => { c.style.transform = `translateY(${(j - frac) * cell}px)`; });
      }
      function layout() {
        const W = root.clientWidth, H = root.clientHeight;
        cell = Math.round(Math.max(62, Math.min(112, (W - 112) / 3, (H - 452) / 3)));
        root.style.setProperty("--cell", cell + "px");
        reels.forEach(r => { r.idx = -1; render(r); });
      }
      // visible rows are seq[k+1..k+3] (top..bottom); the centre (payline) row is seq[k+2]
      const start = ["slime", "pudding", "squishy"];
      reels.forEach((r, i) => { r.seq = [spinReel(), spinReel(), start[i], spinReel(), spinReel()]; r.k = 0; });
      layout();
      K.on(window, "resize", layout);

      let spinning = false, lastTick = 0, lastResult = null;
      const LOSE = ["So close! The lettuce got shy.", "The machine burped. Try again!", "Nope! Just slime in the gears.", "Wheek! Not this time.", "The poops are plotting...", "Squishy says: one more go?", "Zero coins, 100% fun.", "That spin smelled funny.", "The puddings are napping."];

      function say(html) { led.innerHTML = html; led.classList.remove("g-slots-say"); void led.offsetWidth; led.classList.add("g-slots-say"); }
      function mood(m) { pig.innerHTML = api.guineaSVG({ size: 56, mood: m }); pig.animate([{ transform: "translateY(0)" }, { transform: "translateY(-10px) scale(1.1)" }, { transform: "none" }], { duration: 350, easing: "ease-out" }); }

      function animateReel(r, target, dur, anticip) {
        // New sequence: [spare, top, TARGET, bottom, ...randoms, current top, centre, bottom, spare].
        const b0 = Math.floor(r.k), cur = [r.seq[b0 + 1], r.seq[b0 + 2], r.seq[b0 + 3]];
        const n = Math.round(dur * (anticip ? 9 : 14)) + 6;
        const seq = [spinReel(), spinReel(), target, spinReel()];
        for (let i = 0; i < n; i++) seq.push(spinReel());
        seq.push(...cur, spinReel());
        r.seq = seq; r.idx = -1;
        const k0 = seq.length - 5; // shows the current symbols; spinning ends at k = 0 (target centred)
        r.k = k0; render(r);
        const t0 = performance.now();
        return new Promise(res => {
          K.loop((dt, now) => {
            let t = (now - t0) / 1000;
            let k;
            if (t < .12) { k = k0 + Math.sin(t / .12 * Math.PI) * .22; } // wind-up nudge
            else if (t < dur + .12) {
              const u = (t - .12) / dur, e = anticip ? 1 - Math.pow(1 - u, 4.2) : 1 - Math.pow(1 - u, 2.6);
              k = k0 * (1 - e);
            } else {
              const v = (t - dur - .12) / .28; // settle bounce
              k = v >= 1 ? 0 : -Math.sin(v * Math.PI) * .16 * (1 - v);
              if (v >= 1) { r.k = 0; r.idx = -1; render(r); r.strip.style.filter = ""; return false; }
            }
            const speed = Math.abs(k - r.k) / Math.max(dt, .001);
            const prevBase = Math.floor(r.k);
            r.k = k; render(r);
            r.strip.style.filter = speed > 5 && !K.reduced ? `blur(${Math.min(3.2, speed * .13).toFixed(1)}px)` : "";
            if (Math.floor(k) !== prevBase && now - lastTick > (speed > 14 ? 90 : 40)) { lastTick = now; K.sfx("tick"); }
          });
          K.after((dur + .12 + .3) * 1000, () => { res(); });
          K.after((dur + .12) * 1000, () => { K.sfx("click"); K.haptic(10); r.el.animate([{ transform: "translateY(4px)" }, { transform: "none" }], { duration: 180 }); });
        });
      }

      function pullLever() {
        arm.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(-.15)" }, { transform: "scaleY(1)" }], { duration: 520, easing: "cubic-bezier(.3,1.4,.5,1)" });
        knob.animate([{ transform: "translateY(0)" }, { transform: `translateY(${lever.clientHeight * .5}px)` }, { transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(.3,1.4,.5,1)" });
      }

      async function spin(fromLever) {
        if (spinning) return;
        if (!api.spend(K.bet)) {
          K.sfx("buzz"); say("Not enough coins for that bet!"); K.shake(ctrl, 6); K.chipsAll.forEach(c => c.refresh());
          if (api.coins() < 5) say("Out of coins! Go play a skill game.");
          return;
        }
        const bet = K.bet;
        spinning = true; spinBtn.disabled = true; K.chipsAll.forEach(c => c.lock(true));
        K.refreshCoins(); K.sfx("whoosh"); K.haptic(20);
        if (!fromLever) pullLever();
        reels.forEach(r => r.el.querySelectorAll(".g-slots-hit").forEach(c => c.classList.remove("g-slots-hit")));
        cab.classList.remove("g-slots-win");
        say("Spinning... 🤞");
        const res = [spinReel(), spinReel(), spinReel()];
        lastResult = res;
        const tease = res[0] === res[1] || (res[0] === "pudding" && res[1] === "pudding");
        const p0 = animateReel(reels[0], res[0], .85);
        const p1 = animateReel(reels[1], res[1], 1.25);
        let p2;
        if (tease) {
          await p1;
          if (K.isDead()) return;
          reels[2].el.classList.add("g-slots-ant"); root.classList.add("g-slots-hot");
          const tag = K.el("div", "ant-tag", res[0] === "pudding" ? "JACKPOT?!" : res[0] === "poop" ? "uh oh..." : "!!!", reels[2].el.parentNode);
          tag.style.right = "-6px";
          K.sfx("drum"); say(res[0] === "pudding" ? "Two puddings... come ON!" : res[0] === "poop" ? "Is that... a stink coming?" : "Ooooh... one more!");
          mood("wow");
          p2 = animateReel(reels[2], res[2], 2.1, true);
          await p2; tag.remove();
          reels[2].el.classList.remove("g-slots-ant"); root.classList.remove("g-slots-hot");
        } else {
          p2 = animateReel(reels[2], res[2], 1.65);
          await Promise.all([p0, p1, p2]);
        }
        if (K.isDead()) return;
        await finish(res, bet);
        spinning = false; spinBtn.disabled = false; K.chipsAll.forEach(c => c.lock(false));
      }

      async function finish(res, bet) {
        const out = evalSpin(res);
        const centre = i => reels[i].cells[1];
        if (out.mult <= 0) {
          say(K.pick(LOSE)); mood("sad");
          return;
        }
        out.cells.forEach(i => centre(i).classList.add("g-slots-hit"));
        cab.classList.add("g-slots-win");
        const win = bet * out.mult;
        const got = api.award(win, { reason: "Slime Slots " + out.kind });
        K.refreshCoins();
        const [lx, ly] = K.local(led);
        const [rx, ry] = K.local(reelsEl);
        if (out.kind === "jackpot") {
          K.sfx("bigwin"); K.after(500, () => K.sfx("fanfare")); K.haptic(200);
          K.flash("#ffd84d", 700); K.shake(cab, 14);
          K.after(700, () => K.banner("PUDDING<br>JACKPOT!", "+" + K.fmt(got) + " 🪙", "", 3000));
          K.fountain(rx, ry, 120, 1.4); K.after(600, () => K.coinRain(110)); K.after(1200, () => K.fountain(rx, ry, 80, 1.2));
          K.confetti(reelsEl, 160); K.after(900, () => K.confetti(cab, 120));
          mood("wow"); say(`JACKPOT!!! <b>+${K.fmt(got)}</b>`);
          await K.wait(2600);
        } else if (out.kind === "stinky") {
          K.haptic(300);
          K.sfx("fart"); K.after(350, () => K.sfx("fart")); K.after(800, () => K.sfx("fart"));
          gasFog.animate([{ opacity: 0 }, { opacity: .95, offset: .25 }, { opacity: 0 }], { duration: 2400, easing: "ease-out" });
          K.shake(root, 16); K.after(400, () => K.shake(root, 10));
          for (let i = 0; i < 6; i++) K.after(i * 160, () => K.gas(K.rand(40, root.clientWidth - 40), K.rand(150, root.clientHeight - 200)));
          K.after(600, () => K.banner("STINKY<br>JACKPOT!", "+" + K.fmt(got) + " 🪙", "green", 2800));
          K.after(700, () => { K.sfx("bigwin"); K.fountain(rx, ry, 80, 1.2); K.confetti(reelsEl, 100); });
          mood("wow"); say(`💨 PEE-YEW! <b>+${K.fmt(got)}</b>`);
          await K.wait(2400);
        } else if (out.mult >= 8) {
          K.sfx("bigwin"); K.after(400, () => K.sfx("fanfare")); K.haptic(120);
          K.flash("#fff", 450); K.shake(cab, 9);
          K.after(450, () => K.banner(out.mult >= 20 ? "MEGA WIN!" : "BIG WIN!", "+" + K.fmt(got) + " 🪙", out.mult >= 20 ? "pink" : "", 2000));
          K.fountain(rx, ry, 40 + out.mult * 2); K.confetti(reelsEl, 90);
          mood("wow"); say(`${NAMES[res[1]]} x3! <b>+${K.fmt(got)}</b>`);
          await K.wait(1700);
        } else {
          K.sfx(out.mult >= 2 ? "win" : "coin");
          K.sparkle(rx, ry, 18);
          K.fountain(lx, ly, Math.min(30, 4 + out.mult * 3), .5);
          const txt = out.kind === "pud1" ? "Pudding saves your bet!" : out.kind === "pud2" ? "Double pudding!" : out.kind === "two" ? "Two " + NAMES[res[0]] + "s!" : NAMES[res[0]] + " x3!";
          mood("happy"); say(`${txt} <b>+${K.fmt(got)}</b>`);
          await K.wait(500);
        }
        K.float(lx, ly - 30, "+" + K.fmt(got));
      }

      K.on(spinBtn, "click", () => spin(false));

      // ---- lever drag -------------------------------------------------------------
      let drag = null;
      K.on(lever, "pointerdown", e => {
        if (spinning) return;
        drag = { y: e.clientY, id: e.pointerId, d: 0 };
        try { lever.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
        K.sfx("click");
      });
      K.on(lever, "pointermove", e => {
        if (!drag || e.pointerId !== drag.id) return;
        const L = lever.clientHeight * .5;
        drag.d = Math.max(0, Math.min(L, e.clientY - drag.y));
        const f = drag.d / L;
        knob.style.transform = `translateY(${drag.d}px)`;
        arm.style.transform = `scaleY(${1 - f * 1.15})`;
      });
      const release = e => {
        if (!drag || e.pointerId !== drag.id) return;
        const L = lever.clientHeight * .5, pulled = drag.d > L * .55, tapped = e.type === "pointerup" && drag.d < 6;
        drag = null;
        knob.animate([{ transform: knob.style.transform || "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.3,1.6,.5,1)" });
        arm.animate([{ transform: arm.style.transform || "none" }, { transform: "scaleY(1.05)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.3,1.6,.5,1)" });
        knob.style.transform = ""; arm.style.transform = "";
        if (pulled) spin(true); else if (tapped) spin(false);
      };
      K.on(lever, "pointerup", release);
      K.on(lever, "pointercancel", release);

      function showPaytable() {
        const mini = s => `<span class="g-slots-mini">${symHTML(s)}</span>`;
        const row = (icons, label, pay) => `<tr><td>${icons}${label ? ` <span style="font-size:13px">${label}</span>` : ""}</td><td>${pay}</td></tr>`;
        K.modal("Prizes", `<table class="g-slots-ptab">
          ${row(mini("pudding").repeat(3), "", "100x")}
          ${row(mini("poop").repeat(3), "STINKY!", "30x")}
          ${row(mini("guinea").repeat(3), "", "25x")}
          ${row(mini("squishy").repeat(3), "", "12x")}
          ${row(mini("slime").repeat(3), "", "8x")}
          ${row(mini("lettuce").repeat(3), "", "5x")}
          ${row(mini("pudding").repeat(2), "any 2", "6x")}
          ${row(mini("guinea").repeat(2), "first two", "5x")}
          ${row(mini("squishy").repeat(2), "first two", "3x")}
          ${row(mini("slime").repeat(2) + " " + mini("lettuce").repeat(2), "", "2x")}
          ${row(mini("pudding"), "any 1", "1x")}
        </table><div class="g-slots-note">Wins pay on the middle line. 1 poop pays nothing... but 3 poops?! 💨<br>On average the machine gives back about 92 of every 100 coins.</div>`);
      }

      K.intro({
        title: "Slime Slots",
        ribbon: "🎪 Carnival",
        art: `<div style="display:flex;gap:4px;width:250px;height:84px">${["pudding", "slime", "poop"].map(s => `<div style="flex:1;background:#fff;border:4px solid ${INK};border-radius:16px;padding:6px">${symHTML(s)}</div>`).join("")}</div>`,
        how: ["Pick a bet, then <b>pull the lever</b> (drag it down) or tap <b>SPIN</b>.", "Match 3 on the middle line. 🍮🍮🍮 = <b>100x!</b>"],
        onInfo: showPaytable,
        onStart: () => { K.chipsAll.forEach(c => c.refresh()); setSpinLabel(); say("Pull the lever! ⬇️"); },
      });

      // test hook (harmless): lets the dev harness force a result
      return {
        destroy() { K.destroy(); },
      };
    },
  });
})();
