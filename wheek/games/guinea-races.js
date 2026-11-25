/* Guinea Grand Prix: bet on one of 5 racing guineas (Wheek World, carnival, luck).
 *
 * Math (verified by a 1M-race Node simulation of makeField/pickOrder below):
 *   Each racer gets a hidden strength; odds = 0.93 / share, rounded to 0.5 and clamped to 2x-12x.
 *   The true win chance of racer i is then set to (1/odds_i) / S with S = sum(1/odds), and a field is
 *   only used when 1/S is between 0.915 and 0.95. So EVERY pick in a race returns exactly 1/S of the bet
 *   on average: long-run RTP = 92.9% (simulated: random pick 92.9%, always favourite 92.9%, always longest
 *   shot 92.7%) whichever racer she backs. Payout = bet x odds (12x long shots).
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

  // ---- pure race maths (copied verbatim into the Node simulation) ----------------
  const roundHalf = x => Math.round(x * 2) / 2;
  function makeField(rng) {
    rng = rng || Math.random;
    for (let tries = 0; tries < 500; tries++) {
      const str = [0, 1, 2, 3, 4].map(() => Math.exp((rng() + rng() + rng() - 1.5) * 1.6));
      const tot = str.reduce((a, b) => a + b, 0);
      const odds = str.map(s => Math.min(12, Math.max(2, roundHalf(0.93 * tot / s))));
      const S = odds.reduce((a, o) => a + 1 / o, 0);
      const rtp = 1 / S;
      if (rtp >= 0.915 && rtp <= 0.95) return { odds, probs: odds.map(o => (1 / o) / S), rtp };
    }
    return { odds: [2.5, 4, 5, 8, 12], probs: [2.5, 4, 5, 8, 12].map(o => (1 / o) / 1.0583), rtp: 1 / 1.0583 };
  }
  function pickOrder(probs, rng) {
    rng = rng || Math.random;
    const left = probs.map((p, i) => i), order = [];
    while (left.length) {
      const tot = left.reduce((a, i) => a + probs[i], 0);
      let r = rng() * tot, k = 0;
      for (; k < left.length - 1; k++) { r -= probs[left[k]]; if (r < 0) break; }
      order.push(left.splice(k, 1)[0]);
    }
    return order; // order[0] is the winner
  }

  const SEEDS = [3, 8, 12, 17, 22, 26, 31, 36, 41, 45, 50, 55];
  const LANE_COL = ["#ff8fc7", "#5fd3ff", "#ffd84d", "#7be04a", "#c7b3ff"];
  const TITLES = ["Sir", "Lady", "Captain", "Princess", "Lord", "Little", "Big", "Turbo", "Professor", "Dame", "Count", "Baby", "Mega", "Duchess"];
  const FIRST = ["Toots-a-Lot", "Nibbles", "Wheekers", "Popcorn", "Fluffbutt", "Squeaks", "Sprout", "Waffles", "Beans", "Crumble", "Fuzzball", "Muffin", "Snuffles", "Pickles", "Biscuit", "Noodle"];
  const FOOD = ["Lettuce", "Carrot", "Pudding", "Cucumber", "Hay", "Pepper", "Melon", "Parsley", "Dandelion", "Broccoli"];
  const SPEED = ["Lightning", "Rocket", "Zoom", "Thunder", "Express", "Blaster", "Dash", "Turbo", "Tornado", "Comet"];
  const QUIRKS = [["Gassy today", "💨"], ["Loves carrots", "🥕"], ["A bit clumsy", "💫"], ["Super focused", "👀"], ["Had a big nap", "😴"], ["Lucky socks", "🧦"], ["Ate a lot of hay", "🌾"]];
  const LOSE = ["Your racer stopped to sniff a flower. 🌼", "So close! Well... kind of close.", "They tried their best (and farted).", "Wheek! Better luck next race!", "Your guinea says it was a warm-up.", "Pfffft. The hay was too tasty."];

  function makeName(used) {
    for (;;) {
      const n = Math.random() < .5 ? K_pick(TITLES) + " " + K_pick(FIRST) : K_pick(FOOD) + " " + K_pick(SPEED);
      if (!used.has(n)) { used.add(n); return n; }
    }
  }
  function K_pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  WW.registerGame({
    id: "guinea-races",
    name: "Guinea Grand Prix",
    icon: "🏁",
    place: "carnival",
    kind: "luck",
    blurb: "Bet on the fastest fluffball. Long shots pay 12x!",
    mount(root, api) {
      const K = makeKit(root, api, "g-race");
      K.css(`
        .P { position: absolute; inset: 0; overflow: hidden; background: #8fd86a; }
        .P-wrap { position: absolute; inset: 0; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; }
        .P-track { position: relative; flex: none; margin: 0 8px; border: 4px solid var(--ink); border-radius: 22px; overflow: hidden; box-shadow: 0 5px 0 var(--ink);
          background: repeating-linear-gradient(90deg, #6cc24a 0 26px, #79cc55 26px 52px); }
        .P-crowd { position: relative; height: 34px; background: linear-gradient(#ff8fc7, #ff6fb0); border-bottom: 4px solid var(--ink); overflow: hidden; }
        .P-crowd .P-flags { position: absolute; left: 0; right: 0; top: 0; height: 16px;
          background: conic-gradient(from 135deg at 50% 0, #ffd84d 0 90deg, transparent 0) 0 0/24px 16px repeat-x; }
        .P-crowd .P-fans { position: absolute; left: 0; right: 0; bottom: -4px; font-size: 18px; white-space: nowrap; letter-spacing: 2px; }
        .P.P-racing .P-fans { animation: P-cheer .35s infinite alternate; }
        @keyframes P-cheer { to { transform: translateY(-4px); } }
        .P-lane { position: relative; height: var(--lane); border-bottom: 3px dashed rgba(255,255,255,.55);
          background: linear-gradient(180deg, rgba(196,132,72,.85), rgba(214,152,90,.85)); }
        .P-lane:nth-child(2n) { background: linear-gradient(180deg, rgba(206,142,82,.85), rgba(224,164,100,.85)); }
        .P-lane:last-child { border-bottom: 0; }
        .P-lnum { position: absolute; left: 4px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid var(--ink);
          display: grid; place-items: center; font-family: var(--display); font-size: 13px; z-index: 1; }
        .P-start { position: absolute; top: 38px; bottom: 0; width: 6px; background: #fff; opacity: .85; }
        .P-finish { position: absolute; top: 38px; bottom: 0; width: 16px; border-left: 3px solid var(--ink); border-right: 3px solid var(--ink);
          background: conic-gradient(#fff 0 25%, var(--ink) 0 50%, #fff 0 75%, var(--ink) 0) 0 0/10px 10px; }
        .P-racer { position: absolute; left: 0; top: 0; z-index: 3; will-change: transform; pointer-events: none; }
        .P-racer .P-body { position: relative; width: var(--gs); height: calc(var(--gs) * .85); transform-origin: 50% 90%; }
        .P-racer .P-body svg { width: 100%; height: 100%; display: block; }
        .P-bib { position: absolute; right: 6%; bottom: 10%; width: 19px; height: 19px; border-radius: 50%; border: 2.5px solid var(--ink); font-family: var(--display);
          font-size: 11px; display: grid; place-items: center; }
        .P-mine .P-body { filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px var(--yellow)) drop-shadow(0 0 5px var(--yellow)); }
        .P-mine .P-body::after { content: "YOU"; position: absolute; left: 0; top: 52%; transform: translate(-72%,-50%) rotate(-10deg); font-family: var(--display); font-size: 11px;
          background: var(--yellow); border: 2.5px solid var(--ink); border-radius: 8px; padding: 0 4px; z-index: -1; }
        .P-emo { position: absolute; z-index: 4; font-size: 22px; pointer-events: none; transform: translate(-50%,-50%); }
        .P-puff { position: absolute; z-index: 2; border-radius: 50%; pointer-events: none; }
        .P-ticker { position: relative; flex: none; margin: 8px 8px 0; min-height: 50px; display: flex; align-items: center; gap: 8px; background: #fff; border: 4px solid var(--ink);
          border-radius: 18px; box-shadow: 0 4px 0 var(--ink); padding: 6px 10px; overflow: hidden; }
        .P-ticker .P-mic { font-size: 28px; flex: none; animation: P-wob .6s infinite alternate; }
        .P-ticker .P-say { font-size: 15px; line-height: 1.2; font-weight: 900; }
        .P-ticker .P-say.P-new { animation: P-slide .35s cubic-bezier(.3,1.5,.5,1); }
        @keyframes P-slide { from { transform: translateX(40px); opacity: 0; } }
        .P-panel { flex: 1; min-height: 0; overflow: auto; padding: 8px 8px calc(12px + var(--safe-bottom)); display: flex; flex-direction: column; gap: 8px; }
        .P-h { font-family: var(--display); font-size: 20px; text-align: center; color: #fff; -webkit-text-stroke: 2px var(--ink); paint-order: stroke fill; text-shadow: 0 3px 0 var(--ink); }
        .P-form { display: inline-grid; place-items: center; width: 17px; height: 17px; border-radius: 5px; border: 2px solid var(--ink); font-size: 10px; font-weight: 900; color: var(--ink); background: #fff; }
        .P-form.P-f1 { background: var(--yellow); } .P-form.P-f2 { background: #e3e3ef; } .P-form.P-f3 { background: #f2b98a; }
        .P-odds { flex: none; font-family: var(--display); font-size: 20px; background: var(--slime); border: 3px solid var(--ink); border-radius: 12px; padding: 1px 8px; min-width: 62px; text-align: center; }
        .P-odds.P-long { background: var(--orange); }
        .P-lbtn { position: absolute; left: var(--sx); width: calc(var(--fx) - var(--sx)); top: calc(38px + var(--i) * var(--lane) + 3px); height: calc(var(--lane) - 6px); z-index: 4;
          display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 0 4px 0 10px; border: 3px solid transparent; border-radius: 14px;
          background: rgba(255,255,255,.18); min-height: 0; transition: background .15s, border-color .15s; }
        .P-lbtn:active { transform: scale(.98); }
        .P-lbtn.P-sel { background: rgba(255,236,120,.55); border-color: var(--ink); box-shadow: 0 0 0 3px var(--yellow); }
        .P-lname { font-family: var(--display); font-size: clamp(13px, calc(var(--lane) * .36), 17px); color: #fff; -webkit-text-stroke: 3px var(--ink); paint-order: stroke fill;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
        .P-lbtn .P-odds { font-size: clamp(14px, calc(var(--lane) * .38), 19px); min-width: 0; padding: 0 6px; border-radius: 10px; }
        .P-detail { display: flex; align-items: center; gap: 8px; background: var(--card); border: 3px solid var(--ink); border-radius: 16px; box-shadow: 0 3px 0 var(--ink);
          padding: 4px 8px 4px 4px; min-height: 60px; }
        .P-detail .P-por { position: relative; width: 52px; height: 44px; flex: none; }
        .P-detail .P-por svg { width: 100%; height: 100%; }
        .P-detail .P-por .P-bib { right: -2px; bottom: -2px; }
        .P-detail .P-info { flex: 1; min-width: 0; }
        .P-detail .P-nm { font-family: var(--display); font-size: 17px; line-height: 1.05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .P-detail .P-meta { display: flex; align-items: center; gap: 3px; font-size: 12px; margin-top: 2px; color: var(--ink-soft); white-space: nowrap; }
        .P-dprompt { flex: 1; text-align: center; font-family: var(--display); font-size: 18px; color: var(--ink-soft); animation: P-wob .8s infinite alternate; }
        .P-go { width: 100%; min-height: 56px; font-size: 22px; flex: none; }
        .P-panel .P-chip { width: 54px; height: 54px; font-size: 19px; }
        .P-medal { position: absolute; left: -4px; top: 2px; font-size: 20px; animation: P-pop .4s cubic-bezier(.3,1.6,.5,1); }
        .P-stand { display: flex; gap: 6px; justify-content: center; }
        .P-st { position: relative; width: 19%; background: var(--card); border: 3px solid var(--ink); border-radius: 14px; text-align: center; padding: 2px 0 3px; transition: transform .25s; }
        .P-st svg { width: 46px; height: 39px; }
        .P-st b { position: absolute; top: -10px; left: -6px; font-family: var(--display); font-weight: 400; font-size: 13px; background: var(--yellow); border: 2.5px solid var(--ink); border-radius: 9px; padding: 0 5px; }
        .P-st.P-me { background: #fff4b0; box-shadow: 0 0 0 3px var(--yellow); }
        .P-go small { font-family: var(--body); font-weight: 900; font-size: 13px; display: block; line-height: 1; }
        .P-gocol { display: flex; flex-direction: column; line-height: 1.05; }
        .P-count { position: absolute; left: 50%; top: 55%; z-index: 6; font-family: var(--display); font-size: 74px; color: #fff; -webkit-text-stroke: 4px var(--ink); paint-order: stroke fill;
          text-shadow: 0 6px 0 var(--ink); transform: translate(-50%,-50%); pointer-events: none; }
        .P-res { background: var(--card); border: 4px solid var(--ink); border-radius: 22px; box-shadow: 0 5px 0 var(--ink); padding: 10px; text-align: center; animation: P-pop .4s cubic-bezier(.3,1.6,.5,1); }
        .P-podium { display: flex; align-items: flex-end; justify-content: center; gap: 6px; margin: 2px 0 8px; }
        .P-pod { width: 30%; display: flex; flex-direction: column; align-items: center; }
        .P-pod svg { width: 54px; height: 46px; }
        .P-pod .P-blk { width: 100%; border: 3px solid var(--ink); border-radius: 10px 10px 0 0; font-family: var(--display); font-size: 22px; display: grid; place-items: center; }
        .P-pod .P-pn { font-size: 11.5px; font-weight: 900; line-height: 1.1; min-height: 26px; }
        .P-msg { font-family: var(--display); font-size: 22px; margin: 4px 0 8px; }
        .P-msg.P-good { color: var(--slime-dark); }
        .P-sub { font-size: 14px; margin-bottom: 10px; }
        .P-watch { display: flex; align-items: center; gap: 8px; background: var(--card); border: 3px solid var(--ink); border-radius: 16px; padding: 6px 10px; box-shadow: 0 3px 0 var(--ink); }
        .P-watch .P-pos { font-family: var(--display); font-size: 30px; min-width: 58px; text-align: center; }
        .P-watch svg { width: 52px; height: 44px; }
      `);

      const wrap = K.el("div", "wrap", null, root);
      K.hud(wrap, showOdds);
      const track = K.el("div", "track", null, wrap);
      K.el("div", "crowd", `<div class="g-race-flags"></div><div class="g-race-fans">🐹🎉🐹📣🐹🎈🐹🎉🐹📣🐹🎈🐹🎉🐹📣🐹🎈🐹🎉</div>`, track);
      const lanesEl = K.el("div", "lanes", null, track);
      const lanes = [0, 1, 2, 3, 4].map(i => { const l = K.el("div", "lane", `<div class="g-race-lnum" style="background:${LANE_COL[i]}">${i + 1}</div>`, lanesEl); return l; });
      const startLine = K.el("div", "start", null, track);
      const finishLine = K.el("div", "finish", null, track);
      const ticker = K.el("div", "ticker", `<div class="g-race-mic">🎙️</div><div class="g-race-say">Welcome to the Guinea Grand Prix!</div>`, wrap);
      const sayEl = ticker.querySelector(".g-race-say");
      const panel = K.el("div", "panel", null, wrap);

      let lane = 46, gs = 50, W = 360, startX = 40, finishX = 320;
      function layout() {
        const H = root.clientHeight;
        W = track.clientWidth || (root.clientWidth - 16);
        lane = Math.round(Math.max(34, Math.min(56, (H - 420) / 5)));
        gs = Math.round(lane * 1.12);
        root.style.setProperty("--lane", lane + "px"); root.style.setProperty("--gs", gs + "px");
        startX = 34 + gs; finishX = W - 26 - Math.round(gs * .45);
        startLine.style.left = (startX - 2) + "px"; finishLine.style.left = (finishX - 6) + "px";
        root.style.setProperty("--sx", (startX + 2) + "px"); root.style.setProperty("--fx", (finishX - 10) + "px");
        if (field) racers.forEach((r, i) => place(r, r.x || 0));
      }

      let field = null, racers = [], picked = -1, state = "pick", raceStop = null, laneBtns = [];
      const SAY_POOL = [];
      function say(t) { sayEl.innerHTML = t; sayEl.classList.remove("g-race-new"); void sayEl.offsetWidth; sayEl.classList.add("g-race-new"); }

      function newField() {
        const f = makeField();
        const seeds = SEEDS.slice().sort(() => Math.random() - .5).slice(0, 5);
        const used = new Set();
        const rank = f.odds.map((o, i) => i).sort((a, b) => f.odds[a] - f.odds[b]);
        f.racers = f.odds.map((o, i) => {
          const r = rank.indexOf(i); // 0 = favourite
          const form = [0, 1, 2, 3, 4].map(() => Math.max(1, Math.min(5, Math.round(1 + r * .9 + (Math.random() - .5) * 3.2))));
          return { i, seed: seeds[i], name: makeName(used), odds: o, form, quirk: K_pick(QUIRKS) };
        });
        return f;
      }

      function guineaSVG(seed, size) {
        return api.randomGuineaSVG(seed, { size, flip: true }).replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"');
      }

      function buildRacers() {
        racers.forEach(r => r.el.remove());
        racers = field.racers.map((d, i) => {
          // (medals from the previous race are dropped with the old elements)
          const el = K.el("div", "racer", `<div class="g-race-body">${guineaSVG(d.seed, gs)}<div class="g-race-bib" style="background:${LANE_COL[i]}">${i + 1}</div></div>`, track);
          const r = { d, el, body: el.firstChild, x: 0, lane: i };
          place(r, 0);
          return r;
        });
      }
      function place(r, x) {
        r.x = x;
        const top = 38 + r.lane * lane + lane / 2 - gs * .85 * .55;
        r.el.style.transform = `translate(${startX - gs + x}px, ${top}px)`;
      }

      // ---- pick screen -------------------------------------------------------------
      function showPick() {
        state = "pick"; root.classList.remove("g-race-racing");
        field = newField(); picked = -1;
        buildRacers();
        say(K_pick(["New race! Tap your champion on the track!", "Fresh fluffballs at the gate! Tap one!", "Pick a racer, any racer! Tap a lane!", "The crowd goes wheek! Who's your pick?"]));
        panel.innerHTML = "";
        laneBtns.forEach(b => b.remove());
        const detail = K.el("div", "detail", `<div class="g-race-dprompt">👆 Tap a racer on the track!</div>`, panel);
        laneBtns = field.racers.map((d, i) => {
          const b = K.el("button", "lbtn", `<span class="g-race-lname">${d.name}</span><span class="g-race-odds${d.odds >= 7 ? " g-race-long" : ""}">${d.odds}x</span>`, track);
          b.style.setProperty("--i", i);
          b.setAttribute("aria-label", d.name + " pays " + d.odds + " times");
          K.on(b, "click", () => {
            picked = i; K.sfx("wheek"); K.haptic(10);
            laneBtns.forEach((x, j) => x.classList.toggle("g-race-sel", j === i));
            racers.forEach((r, j) => r.el.classList.toggle("g-race-mine", j === i));
            racers[i].body.animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px) scale(1.1)" }, { transform: "none" }], { duration: 380, easing: "ease-out" });
            say(`${d.name}! Pays <b>${d.odds}x</b> if they win.`);
            detail.innerHTML = `<div class="g-race-por">${guineaSVG(d.seed, 52)}<div class="g-race-bib" style="background:${LANE_COL[i]}">${i + 1}</div></div>
              <div class="g-race-info"><div class="g-race-nm">${d.name}</div><div class="g-race-meta">Form ${d.form.map(f => `<span class="g-race-form g-race-f${f}">${f}</span>`).join("")}</div><div class="g-race-meta">${d.quirk[1]} ${d.quirk[0]}</div></div>
              <div class="g-race-odds${d.odds >= 7 ? " g-race-long" : ""}">${d.odds}x</div>`;
            detail.animate([{ transform: "scale(.94)" }, { transform: "none" }], { duration: 250, easing: "cubic-bezier(.3,1.6,.5,1)" });
            upd();
          });
          return b;
        });
        K.chips(panel, { onChange: () => upd() });
        const go = K.el("button", "go !btn !green", "", panel);
        const upd = () => {
          go.disabled = picked < 0 || api.coins() < K.bet;
          go.innerHTML = picked < 0 ? `<span class="g-race-gocol">Pick a racer first<small>tap a lane on the track</small></span>`
            : `<span class="g-race-gocol">🏁 START RACE<small>${K.bet} on #${picked + 1} → wins ${K.fmt(K.bet * field.racers[picked].odds)}</small></span>`;
        };
        upd();
        K.on(go, "click", () => startRace());
        layout();
      }

      // ---- the race ------------------------------------------------------------------
      async function startRace() {
        if (state !== "pick" || picked < 0) return;
        if (!api.spend(K.bet)) { K.sfx("buzz"); say("Not enough coins for that bet!"); K.chipsAll.forEach(c => c.refresh()); return; }
        const bet = K.bet, mine = picked, odds = field.racers[mine].odds;
        K.refreshCoins(); state = "race"; K.chipsAll.length = 0;
        const order = pickOrder(field.probs);
        panel.innerHTML = "";
        laneBtns.forEach(b => b.remove()); laneBtns = [];
        layout();
        const watch = K.el("div", "watch", `${guineaSVG(field.racers[mine].seed, 52)}<div style="flex:1"><div style="font-family:var(--display);font-size:17px">${field.racers[mine].name}</div><div style="font-size:13px">Bet ${bet} · pays ${K.fmt(bet * odds)} 🪙</div></div><div class="g-race-pos">-</div>`, panel);
        const posEl = watch.querySelector(".g-race-pos");
        const stand = K.el("div", "stand", null, panel);
        const stEls = field.racers.map((d, i) => K.el("div", "st" + (i === mine ? " g-race-me" : ""), `<b>${i + 1}</b>${guineaSVG(d.seed, 46)}`, stand));
        let lastRankKey = "";

        // countdown
        const cd = K.el("div", "count", "", track);
        for (const t of ["3", "2", "1"]) { cd.textContent = t; K.sfx("boop"); cd.animate([{ transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 1 }], { duration: 300, easing: "ease-out" }); await K.wait(650); }
        cd.textContent = "GO!"; K.sfx("whoosh"); K.sfx("wheek"); say("And they're OFF! 🏁");
        cd.animate([{ transform: "translate(-50%,-50%) scale(.6)" }, { transform: "translate(-50%,-50%) scale(1.3)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 650, fill: "forwards" });
        K.after(700, () => cd.remove());
        root.classList.add("g-race-racing");

        const plan = planRace(order);
        const D = finishX - startX;
        const t0 = performance.now();
        let lastLeader = -1, lastCall = 0, nextPuff = 0, crossed = [], ended = false;
        const evDone = new Set();
        await new Promise(res => {
          raceStop = K.loop((dt, now) => {
            const t = (now - t0) / 1000;
            const xs = plan.map(p => t >= p.T ? D + Math.min(gs * .55, (t - p.T) * 75) : posAt(p, t) * D);
            racers.forEach((r, i) => {
              place(r, xs[i]);
              const st = stateAt(plan[i], t);
              const bob = st === "stop" ? 0 : Math.abs(Math.sin(t * (st === "boost" ? 26 : 17) + i)) * -7;
              const rot = st === "trip" ? (t - plan[i].evStart) / .7 * 360 : st === "stop" ? Math.sin(t * 14) * 4 : Math.sin(t * 17 + i) * 6;
              r.body.style.transform = `translateY(${bob}px) rotate(${rot}deg)` + (st === "boost" ? " scaleX(1.12)" : "");
              if (xs[i] >= D && !crossed.includes(i)) {
                crossed.push(i); if (crossed.length === 1) photoFinish(r);
                if (crossed.length <= 3) { K.el("div", "medal", ["🥇", "🥈", "🥉"][crossed.length - 1], r.el); K.sfx(crossed.length === 1 ? "sparkle" : "tick"); }
              }
            });
            // events
            plan.forEach((p, i) => {
              if (p.ev && t >= p.evStart && !evDone.has(i)) { evDone.add(i); fireEvent(p.ev, racers[i]); }
            });
            // dust puffs
            if (t > nextPuff) { nextPuff = t + .12; racers.forEach((r, i) => { if (stateAt(plan[i], t) !== "stop" && xs[i] < D + 30) puff(r, stateAt(plan[i], t) === "boost"); }); }
            // leader commentary
            const lead = xs.indexOf(Math.max(...xs));
            const rank = xs.map((x, i) => i).sort((a, b) => xs[b] - xs[a]);
            const myPos = crossed.includes(mine) ? crossed.indexOf(mine) + 1 : rank.indexOf(mine) + 1;
            posEl.textContent = ["1st", "2nd", "3rd", "4th", "5th"][myPos - 1];
            const live = crossed.concat(rank.filter(i => !crossed.includes(i)));
            const key = live.join("");
            if (key !== lastRankKey) { lastRankKey = key; live.forEach((ri, k) => { stEls[ri].style.order = k; stEls[ri].querySelector("b").textContent = k + 1; }); }
            posEl.style.color = myPos === 1 ? "#e8458f" : "";
            if (t > 1.2 && lead !== lastLeader && t - lastCall > 1.1 && !crossed.length) {
              lastLeader = lead; lastCall = t;
              say(K_pick(["<b>{n}</b> takes the lead!", "<b>{n}</b> zooms to the front!", "Look at <b>{n}</b> go!", "<b>{n}</b> is in first!"]).replace("{n}", field.racers[lead].name));
              if (lead === mine) K.sfx("pop");
            }
            if (!ended && crossed.length === 5 && t > plan[order[4]].T + .4) { ended = true; res(); return false; }
            if (t > 20) { ended = true; res(); return false; }
          });
        });
        raceStop = null;
        root.classList.remove("g-race-racing");
        finishRace(order, mine, bet, odds);
      }

      // Each racer's progress (0..1 at the finish line) is a normalised integral of a wobbly speed curve
      // with a scripted event, finishing exactly at its target time T. The winner is decided beforehand
      // by pickOrder (true odds); the animation just tells that story.
      function planRace(order) {
        const T = [];
        let t = K.rand(7.2, 8.2);
        order.forEach((ri, k) => { T[ri] = t; t += K.rand(.12, .55) + (k === 0 ? K.rand(0, .35) : 0); });
        const evTypes = ["carrot", "trip", "fart"].sort(() => Math.random() - .5);
        const evCount = Math.random() < .35 ? 3 : 2;
        const evRacers = [0, 1, 2, 3, 4].sort(() => Math.random() - .5).slice(0, evCount);
        return [0, 1, 2, 3, 4].map(i => {
          const p = { T: T[i], a1: K.rand(.12, .3), w1: K.rand(.6, 1.4), f1: K.rand(0, 6), a2: K.rand(.05, .15), w2: K.rand(2, 3.5), f2: K.rand(0, 6), ev: null, evStart: 99, evEnd: 99 };
          const ei = evRacers.indexOf(i);
          if (ei >= 0) {
            p.ev = evTypes[ei];
            p.evStart = K.rand(1.6, T[i] - 2.2);
            p.evEnd = p.evStart + (p.ev === "carrot" ? 1.1 : p.ev === "trip" ? .7 : .9);
          }
          // a strong late kick for the winner sometimes, for comebacks
          p.kick = order[0] === i && Math.random() < .5 ? K.rand(.25, .5) : 0;
          // integrate raw speed to normalise
          const N = 400; let acc = 0; p.tab = new Float32Array(N + 1); p.dtab = T[i] / N;
          for (let k = 0; k <= N; k++) { p.tab[k] = acc; acc += rawV(p, k * p.dtab) * p.dtab; }
          p.total = p.tab[N];
          return p;
        });
      }
      function rawV(p, t) {
        if (t >= p.evStart && t < p.evEnd) { if (p.ev === "fart") return 2.6; return 0; }
        const ramp = Math.min(1, t / .5);
        const kick = p.kick && t > p.T - 2 ? 1 + p.kick : 1;
        return ramp * kick * (1 + p.a1 * Math.sin(p.w1 * t + p.f1) + p.a2 * Math.sin(p.w2 * t + p.f2));
      }
      function posAt(p, t) {
        if (t <= 0) return 0;
        if (t >= p.T) return 1 + Math.min(.06, (t - p.T) * .05); // trot past the line
        const k = t / p.dtab, k0 = Math.floor(k), f = k - k0;
        const a = p.tab[k0], b = p.tab[Math.min(p.tab.length - 1, k0 + 1)];
        return (a + (b - a) * f) / p.total;
      }
      function stateAt(p, t) {
        if (t >= p.evStart && t < p.evEnd) return p.ev === "fart" ? "boost" : p.ev === "trip" ? "trip" : "stop";
        return t >= p.T + 1.2 ? "stop" : "run";
      }
      function racerXY(r) { const m = new DOMMatrix(getComputedStyle(r.el).transform); return [m.m41 + gs / 2 + 8, m.m42 + gs * .4 + track.offsetTop + 4]; }
      function emo(r, txt, ms, dx, dy) {
        const [x, y] = racerXY(r);
        const e = K.el("div", "emo", txt, root); e.style.left = (x + (dx || 0)) + "px"; e.style.top = (y + (dy || 0)) + "px";
        e.animate([{ transform: "translate(-50%,-50%) scale(0)" }, { transform: "translate(-50%,-50%) scale(1.3)", offset: .2 }, { transform: "translate(-50%,-90%) scale(1)", opacity: 1, offset: .8 }, { transform: "translate(-50%,-120%) scale(.8)", opacity: 0 }], { duration: ms || 1100, fill: "forwards" });
        K.after(ms || 1100, () => e.remove());
      }
      function fireEvent(ev, r) {
        const n = r.d.name;
        if (ev === "carrot") { emo(r, "🥕", 1200, gs * .5, -6); K.sfx("nom"); K.after(350, () => K.sfx("nom")); say(`Oh no! <b>${n}</b> stopped for a carrot snack! 🥕`); }
        if (ev === "trip") { emo(r, "💫", 900, 0, -gs * .45); K.sfx("squish"); K.after(120, () => K.sfx("hit")); say(`<b>${n}</b> tripped on a squishy! 💫`); }
        if (ev === "fart") {
          K.sfx("fart"); emo(r, "💨", 1000, -gs * .9, 0); const [x, y] = racerXY(r); K.gas(x - gs * .6, y);
          say(`<b>${n}</b> used a FART BOOST! 💨💨`);
          if (!K.reduced) K.shake(track, 4);
        }
      }
      function puff(r, boost) {
        const [x, y] = racerXY(r);
        const p = K.el("div", "puff", null, track);
        const s = boost ? K.rand(12, 20) : K.rand(5, 9);
        p.style.cssText = `left:${x - gs * .75 - 8}px;top:${y - track.offsetTop + gs * .12}px;width:${s}px;height:${s}px;background:${boost ? "rgba(140,230,70,.8)" : "rgba(255,236,200,.85)"}`;
        p.animate([{ transform: "scale(.5)", opacity: 1 }, { transform: `translate(-${boost ? 22 : 12}px,-6px) scale(1.6)`, opacity: 0 }], { duration: 500, fill: "forwards" });
        K.after(520, () => p.remove());
      }
      function photoFinish(r) {
        K.flash("#fff", 300); K.sfx("drum");
        say(`<b>${r.d.name}</b> crosses the line FIRST! 📸`);
        K.sparkle(...K.local(r.el), 24);
      }

      function finishRace(order, mine, bet, odds) {
        state = "done";
        const won = order[0] === mine;
        panel.innerHTML = "";
        const res = K.el("div", "res", null, panel);
        const pod = K.el("div", "podium", null, res);
        [[1, 70, "#e3e3ef"], [0, 96, "#ffd84d"], [2, 52, "#f2b98a"]].forEach(([k, h, c]) => {
          const d = field.racers[order[k]];
          K.el("div", "pod", `${guineaSVG(d.seed, 54)}<div class="g-race-pn">${d.name}${order[k] === mine ? " ⭐" : ""}</div><div class="g-race-blk" style="height:${h * .42}px;background:${c}">${k + 1}</div>`, pod);
        });
        const myPlace = order.indexOf(mine) + 1;
        if (won) {
          const got = api.award(bet * odds, { reason: "Guinea Grand Prix win" });
          K.refreshCoins();
          K.el("div", "msg g-race-good", `YOUR RACER WON! +${K.fmt(got)} 🪙`, res);
          const big = odds >= 6;
          K.sfx(big ? "bigwin" : "win"); K.after(350, () => K.sfx("fanfare")); K.haptic(big ? 200 : 80);
          K.banner(big ? "LONG SHOT!" : "WINNER!", "+" + K.fmt(got) + " 🪙", big ? "pink" : "", 2200);
          const [x, y] = K.local(res);
          K.fountain(x, y - 40, big ? 90 : 40, big ? 1.3 : .9); K.confetti(res, big ? 150 : 80);
          if (big) K.after(500, () => K.coinRain(60));
          K.float(x, y - 60, "+" + K.fmt(got));
          say(`What a race! <b>${field.racers[mine].name}</b> is the champion! 🏆`);
        } else {
          K.sfx("fart"); K.after(250, () => K.sfx("lose"));
          K.el("div", "msg", `${field.racers[mine].name} came ${["1st", "2nd", "3rd", "4th", "5th"][myPlace - 1]}`, res);
          K.el("div", "sub", K_pick(LOSE), res);
          say(`<b>${field.racers[order[0]].name}</b> wins it! Yours came ${["1st", "2nd", "3rd", "4th", "5th"][myPlace - 1]}.`);
          const [x, y] = K.local(res); K.gas(x, y);
        }
        const again = K.el("button", "go !btn !green", api.coins() >= 5 ? "Next race! 🏁" : "Out of coins 😢", res);
        if (api.coins() < 5) { again.disabled = true; K.el("div", "sub", "Play a skill game to earn more coins!", res); }
        K.on(again, "click", () => { K.sfx("pop"); showPick(); });
      }

      function showOdds() {
        K.modal("How odds work", `<table class="g-race-ptab">
          <tr><td>Bet on 1 racer</td><td>pays bet × odds</td></tr>
          <tr><td>Favourite (2x-3x)</td><td>wins often</td></tr>
          <tr><td>Long shot (8x-12x)</td><td>wins rarely</td></tr>
          <tr><td>Form <span class="g-race-form g-race-f1">1</span><span class="g-race-form g-race-f2">2</span><span class="g-race-form g-race-f3">3</span></td><td>last 5 races</td></tr>
        </table><div class="g-race-note">A 4x racer wins about 1 race in 4.<br>On average races give back about 93 of every 100 coins bet.<br>Carrots, squishies and fart boosts happen in every race!</div>`);
      }

      layout();
      K.on(window, "resize", layout);
      showPick();
      K.intro({
        title: "Guinea Grand Prix",
        ribbon: "🎪 Carnival",
        art: `<div style="display:flex;align-items:flex-end;gap:2px;height:100px">${[SEEDS[0], SEEDS[3], SEEDS[6]].map((s, i) => `<div style="width:${i === 1 ? 110 : 84}px">${guineaSVG(s, 100)}</div>`).join("")}</div>`,
        how: ["Pick a racer, place your bet and watch them go!", "If your guinea wins you get <b>bet × odds</b>. Long shots pay up to <b>12x!</b>"],
        onInfo: showOdds,
        startLabel: "To the track!",
        onStart: () => { K.chipsAll.forEach(c => c.refresh()); },
      });
      return { destroy() { K.destroy(); } };
    },
  });
})();
