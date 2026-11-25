/* Wheek World mini-game: Popcorn Hop.
   Endless runner: tap to popcorn over hay bales, sleeping cats and slime puddles. Double-tap for a second hop. */
(function () {
  "use strict";
  const ID = "popcorn-hop", C = "g-popcorn";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const GRAV = 2300;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  function svgImg(svg) {
    if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return img;
  }
  function sprite(w, h, fn) {
    const S = 3, c = document.createElement("canvas");
    c.width = Math.ceil(w * S); c.height = Math.ceil(h * S);
    const g = c.getContext("2d");
    g.scale(S, S); g.lineJoin = "round"; g.lineCap = "round";
    fn(g);
    return { c, w, h };
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function txt(g, s, x, y, size, fill, lw) {
    g.font = size + "px " + FONT; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = lw || Math.max(4, size * 0.2); g.strokeStyle = INK; g.strokeText(s, x, y);
    g.fillStyle = fill; g.fillText(s, x, y);
  }
  function blob(g, shapes, fill, lw) {
    g.strokeStyle = INK; g.lineWidth = (lw || 5) * 2;
    shapes.forEach((s) => { s(); g.stroke(); });
    g.fillStyle = fill;
    shapes.forEach((s) => { s(); g.fill(); });
  }
  const ell = (g, x, y, rx, ry, r) => () => { g.beginPath(); g.ellipse(x, y, rx, ry, r || 0, 0, TAU); };

  /* ---------- obstacle art (design units; bottom of sprite = ground) ---------- */
  function drawBale(g, w, h) {
    const b = () => rr(g, 3, 3, w - 6, h - 6, 10);
    blob(g, [b], "#f5c842", 4);
    g.strokeStyle = "#d39b1c"; g.lineWidth = 2.5;
    for (let y = 12; y < h - 8; y += 9) { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y + rnd(-2, 2)); g.stroke(); }
    g.fillStyle = "#b5532a"; g.fillRect(w * 0.28, 4, 6, h - 8); g.fillRect(w * 0.66, 4, 6, h - 8);
    g.strokeStyle = INK; g.lineWidth = 4; b(); g.stroke();
    g.strokeStyle = "#f5c842"; g.lineWidth = 3;
    for (let i = 0; i < 7; i++) { const x = rnd(10, w - 10); g.beginPath(); g.moveTo(x, 4); g.lineTo(x + rnd(-6, 6), -4); g.stroke(); }
    g.fillStyle = "rgba(255,255,255,.5)"; rr(g, 10, 8, w * 0.3, 5, 3); g.fill();
  }
  function drawCat(g) {
    // 100 x 60, sleeping loaf
    const parts = [ell(g, 50, 40, 42, 20), ell(g, 26, 30, 22, 19), () => { g.beginPath(); g.moveTo(10, 22); g.lineTo(12, 4); g.lineTo(24, 14); g.closePath(); }, () => { g.beginPath(); g.moveTo(28, 13); g.lineTo(40, 3); g.lineTo(42, 20); g.closePath(); }];
    blob(g, [...parts, () => { g.beginPath(); g.moveTo(88, 46); g.quadraticCurveTo(102, 30, 90, 22); g.lineTo(95, 20); g.quadraticCurveTo(110, 34, 92, 52); g.closePath(); }], "#9aa0b4", 4);
    g.fillStyle = "#7b8096";
    g.beginPath(); g.ellipse(62, 28, 6, 3, 0.3, 0, TAU); g.ellipse(74, 32, 6, 3, 0.4, 0, TAU); g.ellipse(52, 24, 5, 3, 0.2, 0, TAU); g.fill();
    g.fillStyle = "#ffb3d4"; g.beginPath(); g.moveTo(14, 20); g.lineTo(15, 9); g.lineTo(21, 15); g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 2.6;
    g.beginPath(); g.arc(18, 30, 4, 0.2, Math.PI - 0.2); g.stroke();
    g.beginPath(); g.arc(32, 30, 4, 0.2, Math.PI - 0.2); g.stroke();
    g.fillStyle = "#ff7aa8"; g.beginPath(); g.moveTo(23, 36); g.lineTo(27, 36); g.lineTo(25, 38.5); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(25, 39); g.quadraticCurveTo(22, 42, 20, 40); g.moveTo(25, 39); g.quadraticCurveTo(28, 42, 30, 40); g.stroke();
    g.lineWidth = 1.6; g.beginPath(); g.moveTo(10, 36); g.lineTo(0, 34); g.moveTo(10, 39); g.lineTo(1, 41); g.moveTo(40, 36); g.lineTo(50, 34); g.stroke();
    // paws
    blob(g, [ell(g, 30, 56, 9, 5), ell(g, 48, 57, 9, 5)], "#c2c7d6", 3);
    g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.ellipse(60, 24, 14, 4, -0.1, 0, TAU); g.fill();
  }
  function drawPuddle(g) {
    // 120 x 30
    const p = () => { g.beginPath(); g.moveTo(8, 22); g.bezierCurveTo(0, 6, 30, 4, 46, 9); g.bezierCurveTo(62, 0, 104, 2, 114, 14); g.bezierCurveTo(124, 26, 90, 30, 60, 28); g.bezierCurveTo(30, 30, 14, 30, 8, 22); g.closePath(); };
    blob(g, [p], "#7be04a", 4);
    g.fillStyle = "#b8f58f"; g.beginPath(); g.ellipse(40, 14, 18, 4, -0.1, 0, TAU); g.ellipse(84, 11, 10, 3, 0, 0, TAU); g.fill();
    g.fillStyle = "#4fb52a"; g.beginPath(); g.ellipse(70, 22, 26, 4, 0, 0, TAU); g.fill();
    g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 2.5;
    [[36, 18], [52, 17]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); g.stroke(); });
    g.fillStyle = INK; g.beginPath(); g.arc(37, 19, 2.2, 0, TAU); g.arc(53, 19, 2.2, 0, TAU); g.fill();
  }
  function drawCandy(g) {
    // 60 x 90 lollipop
    g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(30, 50); g.lineTo(30, 88); g.stroke();
    g.strokeStyle = "#fff"; g.lineWidth = 4; g.beginPath(); g.moveTo(30, 50); g.lineTo(30, 86); g.stroke();
    blob(g, [ell(g, 30, 30, 26, 26)], "#ff8fc7", 4);
    g.save(); g.beginPath(); g.arc(30, 30, 24, 0, TAU); g.clip();
    g.strokeStyle = "#fff"; g.lineWidth = 6;
    g.beginPath(); for (let a = 0; a < TAU * 2.6; a += 0.1) { const r = a * 3.2; g.lineTo(30 + Math.cos(a) * r, 30 + Math.sin(a) * r); } g.stroke();
    g.strokeStyle = "#ffd84d"; g.lineWidth = 3;
    g.beginPath(); for (let a = 1.2; a < TAU * 2.6; a += 0.1) { const r = a * 3.2; g.lineTo(30 + Math.cos(a + 1.6) * r, 30 + Math.sin(a + 1.6) * r); } g.stroke();
    g.restore();
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(30, 30, 26, 0, TAU); g.stroke();
    g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.ellipse(20, 18, 6, 4, -0.6, 0, TAU); g.fill();
  }

  const HEART = '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';
  const POPS = ["POPCORN!", "WHEE!", "BOING!", "YIPPEE!", "HOP!"];
  const OUCH = { bale: "BONK!", stack: "BONK!", cat: "HISSS!", puddle: "SPLAT!" };

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:21px;display:flex;align-items:center;gap:5px;min-height:42px;white-space:nowrap}
.${C} .pill small{font-size:14px;opacity:.7}
.${C} .pill.lv{gap:1px;padding:2px 8px}
.${C} .pill.lv svg{transition:transform .3s, filter .3s, opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:58px;left:12px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;animation:${C}-throb 1s infinite;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(43,22,64,.28);z-index:5}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:18px 18px 20px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:120px;display:flex;align-items:flex-end;justify-content:center;margin-top:-6px}
.${C} .panel .art svg{animation:${C}-hop 1.1s cubic-bezier(.3,0,.7,1) infinite}
.${C} .panel .art .fl{position:absolute;bottom:4px;font-size:30px}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--pink)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.35;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#f3edff;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-hop{0%,100%{transform:translateY(0) scale(1.08,.92)}15%{transform:translateY(0) scale(.94,1.06)}50%{transform:translateY(-34px) rotate(-12deg)}70%{transform:translateY(-20px) rotate(10deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1) rotate(-8deg)}50%{transform:scale(1.12) rotate(-8deg)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill ds">🏁<b>0</b><small>m</small></div><div class="pill cn">🪙<b>0</b></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), dsEl = wrap.querySelector(".ds b"), cnEl = wrap.querySelector(".cn b");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 240, mood: "happy", flip: true })), wow: svgImg(api.guineaSVG({ size: 240, mood: "wow", flip: true })), sad: svgImg(api.guineaSVG({ size: 240, mood: "sad", flip: true })) };
    const SPR = {
      bale: sprite(64, 56, (g) => drawBale(g, 64, 56)),
      cat: sprite(110, 64, drawCat),
      puddle: sprite(124, 32, drawPuddle),
      candy: sprite(60, 92, drawCandy),
    };
    const OB = {
      bale: { w: 64, h: 56 },
      stack: { w: 64, h: 104 },
      cat: { w: 110, h: 64 },
      puddle: { w: 124, h: 32 },
    };

    let W = 1, H = 1, dpr = 1, u = 1, groundY = 1, gw = 100, gh = 85, px0 = 100;
    let sky = null;
    const S = {};
    const P = { y: 0, vy: 0, onGround: true, hops: 0, spin: 0, spinV: 0, wig: 9, sqT: 9, hurtT: 9, runT: 0 };

    function reset() {
      Object.assign(S, { state: "intro", t: 0, dist: 0, coins: 0, gold: 0, lives: 3, speed: 300, scroll: 0, obs: [], items: [], parts: [], floats: [],
        nextGap: 2.2, shake: 0, flash: 0, inv: 0, rush: 0, rushCD: rnd(12, 18), banner: null, endT: 0, awarded: false, hintShown: false, smashed: 0, hitBy: "", lastMilestone: 0 });
      Object.assign(P, { y: 0, vy: 0, onGround: true, hops: 0, spin: 0, spinV: 0, wig: 9, sqT: 9, hurtT: 9 });
    }

    function resize() {
      W = Math.max(1, root.clientWidth); H = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      u = clamp(Math.min(H / 640, W / 340), 0.7, 1.5);
      groundY = H - Math.max(100 * u, H * 0.18);
      gw = 104 * u; gh = gw * 0.85; px0 = Math.max(gw * 0.7, W * 0.24);
      sky = document.createElement("canvas"); sky.width = cv.width; sky.height = cv.height;
      const g = sky.getContext("2d"); g.scale(dpr, dpr);
      const gr = g.createLinearGradient(0, 0, 0, groundY);
      gr.addColorStop(0, "#ffb3d9"); gr.addColorStop(0.45, "#ffd9ec"); gr.addColorStop(1, "#fff4d6");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const sx = W * 0.78, sy = groundY * 0.28, sr = 46 * u;
      g.fillStyle = "rgba(255,216,77,.3)"; g.beginPath(); g.arc(sx, sy, sr * 1.8, 0, TAU); g.fill();
      g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(sx, sy, sr, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = INK; g.beginPath(); g.arc(sx - sr * 0.3, sy - sr * 0.08, 4, 0, TAU); g.arc(sx + sr * 0.3, sy - sr * 0.08, 4, 0, TAU); g.fill();
      g.lineWidth = 3; g.beginPath(); g.arc(sx, sy + sr * 0.1, sr * 0.25, 0.3, Math.PI - 0.3); g.stroke();
    }

    /* ---------- UI ---------- */
    function meters() { return Math.floor(S.dist / (50 * u)); }
    function score() { return meters() + S.coins * 10; }
    function payout() { return Math.min(300, Math.round(meters() / 5 + S.coins / 4)); }
    function setHud() {
      dsEl.textContent = meters(); cnEl.textContent = S.coins;
      hearts.forEach((h, i) => h.classList.toggle("gone", i >= S.lives));
    }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 120, mood: "happy", flip: true });
      const lastLine = after ? `<div class="last">🏁 ${after.m}m &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="fl" style="left:12%">🌾</span><span class="fl" style="right:10%">🐈</span>${svg}</div>
        <h2>${after ? "Hop again?" : "Popcorn Hop"}</h2>${lastLine}
        <p><b>Tap</b> to popcorn over hay, cats and slime. <b>Tap again</b> in the air to double hop!</p>
        <div class="chips"><span class="chip">🪙 Grab coins</span><span class="chip">🍭 Sugar Rush!</span></div>
        <button class="btn pink">${after ? "Run again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start(e) {
      if (e) e.stopPropagation();
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "play";
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud();
      banner("RUN!", "tap to popcorn!", "#ff8fc7");
      api.sfx("wheek");
    }

    /* ---------- fx ---------- */
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 24; x = clamp(x, text.length * size * 0.32 + 8, W - text.length * size * 0.32 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 0.9 }); }
    function burst(x, y, cols, n, spd, k) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 260);
        S.parts.push({ k: k || "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 100, g: 800, r: rnd(3, 7) * u, col: pick(cols), life: rnd(0.4, 0.8), t: 0, rot: rnd(0, TAU) });
      }
    }
    function dust(x, y, n) {
      for (let i = 0; i < n; i++) S.parts.push({ k: "puff", x: x + rnd(-10, 10), y, vx: rnd(-120, -20), vy: rnd(-60, -10), g: 0, r: rnd(5, 10) * u, grow: 20, col: "#fff4e0", life: rnd(0.3, 0.5), t: 0 });
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- spawning ---------- */
    function spawnObstacle() {
      const d = clamp(S.t / 70, 0, 1);
      const types = ["bale", "bale", "cat", "puddle"];
      if (d > 0.25) types.push("stack", "cat");
      const type = pick(types);
      const o = OB[type];
      const x = W + 40 * u;
      S.obs.push({ type, x, w: o.w * u, h: o.h * u, hit: false, fly: 0, vx: 0, vy: 0, y: 0, rot: 0, ph: rnd(0, TAU), passed: false });
      // coin arc above
      const top = groundY - o.h * u;
      const n = 5;
      for (let i = 0; i < n; i++) {
        const f = (i - (n - 1) / 2) / ((n - 1) / 2);
        addCoin(x + o.w * u / 2 + f * 46 * u, top - 46 * u - (1 - f * f) * 64 * u);
      }
      // sometimes a sugar rush candy or a ground coin line in the following gap
      const gapTime = lerp(1.7, 1.0, d) * rnd(0.85, 1.4);
      S.nextGap = gapTime;
      const gapPx = gapTime * S.speed;
      if (S.rushCD <= 0 && S.rush <= 0) {
        S.items.push({ k: "candy", x: x + o.w * u + gapPx * 0.55, y: groundY - 150 * u, got: false, ph: 0 });
        S.rushCD = rnd(14, 22);
      } else if (gapPx > 260 * u && Math.random() < 0.7) {
        const m = 3 + ((Math.random() * 2) | 0);
        for (let i = 0; i < m; i++) addCoin(x + o.w * u + gapPx * 0.3 + i * 34 * u, groundY - 30 * u);
      }
    }
    function addCoin(x, y) { S.items.push({ k: Math.random() < 0.06 ? "gold" : "coin", x, y, got: false, ph: rnd(0, TAU) }); }

    function jump() {
      if (S.state !== "play") return;
      if (P.onGround) {
        P.vy = -Math.sqrt(2 * GRAV * u * 185 * u); P.onGround = false; P.hops = 1; P.wig = 0; P.sqT = 0;
        api.sfx("jump"); dust(px0, groundY, 6);
        if (Math.random() < 0.3) floatT(px0 + 30 * u, groundY - gh - 60 * u, pick(POPS), pick(["#ffd84d", "#ff8fc7", "#5fd3ff"]), 22);
      } else if (P.hops < 2) {
        P.vy = -Math.sqrt(2 * GRAV * u * 130 * u); P.hops = 2; P.spin = 0; P.spinV = TAU / 0.45; P.sqT = 0;
        api.sfx("boop");
        burst(px0, groundY + P.y - gh * 0.3, ["#fff", "#ffd84d", "#ff8fc7"], 10, 180, "star");
      }
    }

    function hitObstacle(o) {
      if (S.rush > 0) {
        o.fly = 1; o.vx = rnd(500, 800) * u; o.vy = -rnd(600, 900) * u; S.smashed++;
        api.sfx("hit"); shake(8); burst(o.x + o.w / 2, groundY - o.h / 2, ["#ffd84d", "#ff8fc7", "#fff"], 14, 300, "star");
        floatT(o.x + o.w / 2, groundY - o.h - 20 * u, "SMASH!", "#ffd84d", 28);
        S.coins += 2; floatT(o.x + o.w / 2, groundY - o.h - 50 * u, "+2🪙", "#fff", 20);
        return;
      }
      if (S.inv > 0 || o.hit) return;
      o.hit = true;
      S.lives--; S.inv = 1.6; P.hurtT = 0; S.flash = 0.25; S.hitBy = o.type;
      S.speed *= 0.7;
      api.sfx(o.type === "puddle" ? "splat" : o.type === "cat" ? "buzz" : "hit"); api.haptic(80); shake(14);
      if (o.type === "puddle") burst(px0, groundY, ["#7be04a", "#b8f58f", "#4fb52a"], 22, 380);
      else burst(px0 + gw * 0.3, groundY + P.y - gh * 0.5, ["#f5c842", "#fff"], 12, 260, "star");
      if (o.type === "cat") { o.awake = 1.2; }
      floatT(px0, groundY + P.y - gh - 30 * u, OUCH[o.type], o.type === "puddle" ? "#7be04a" : "#ff5a5f", 32);
      P.vy = -700 * u; P.onGround = false; P.hops = 2; P.spin = 0; P.spinV = -TAU / 0.6;
      bump(hearts[Math.max(0, S.lives)]);
      setHud();
      if (S.lives <= 0) endRound();
    }

    function collect(it) {
      it.got = true;
      if (it.k === "candy") {
        S.rush = 5.5; S.inv = 0;
        api.sfx("bigwin"); api.haptic(40); shake(6);
        const [vx, vy] = vp(it.x, it.y); api.confetti(vx, vy, 50);
        burst(it.x, it.y, ["#ff8fc7", "#ffd84d", "#5fd3ff", "#7be04a", "#c7b3ff"], 30, 400, "star");
        banner("SUGAR RUSH!", "smash everything!", "#ff8fc7");
        return;
      }
      const v = it.k === "gold" ? 5 : 1;
      S.coins += v; if (it.k === "gold") S.gold++;
      api.sfx(it.k === "gold" ? "sparkle" : "coin");
      burst(it.x, it.y, ["#ffd84d", "#fff3b0"], it.k === "gold" ? 12 : 5, 160, "star");
      if (v > 1) floatT(it.x, it.y - 20 * u, "+5!", "#ffd84d", 26);
      bump(cnEl.parentNode);
    }

    function endRound() {
      if (S.state !== "play") return;
      S.state = "end"; S.endT = 0;
      banner("OOF!", gName + " needs a nap", "#c7b3ff");
      api.sfx("lose");
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const m = meters(), coins = payout();
      const earned = coins > 0 ? api.award(coins, { reason: "Popcorn Hop" }) : 0;
      const sc = score();
      const hs = api.highscore(ID, sc);
      const quip = S.hitBy === "cat" ? `${gName} woke the cat. Run!!` : S.hitBy === "puddle" ? `${gName} is covered in slime. Again.` : `${gName} bonked a hay bale.`;
      const text = `${quip} Ran ${m}m and grabbed ${S.coins} coins${S.smashed ? `, smashed ${S.smashed} thing${S.smashed > 1 ? "s" : ""}` : ""}. Score ${sc}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew ? "New best!" : "What a run!", text, score: sc });
      hud.classList.add("off");
      showPanel({ m, earned });
    }

    /* ---------- update ---------- */
    function update(dt) {
      const playing = S.state === "play";
      let spd = 0;
      if (playing) {
        S.t += dt;
        const target = (lerp(300, 560, clamp(S.t / 75, 0, 1)) + Math.max(0, S.t - 75) * 5) * u;
        S.speed = lerp(S.speed, target, Math.min(1, dt * 1.2));
        spd = S.speed * (S.rush > 0 ? 1.55 : 1);
        S.dist += spd * dt;
        S.rush = Math.max(0, S.rush - dt); S.inv = Math.max(0, S.inv - dt); S.rushCD -= dt;
        S.nextGap -= dt * (spd / S.speed);
        if (S.nextGap <= 0) spawnObstacle();
        const ms = Math.floor(meters() / 100);
        if (ms > S.lastMilestone) { S.lastMilestone = ms; floatT(W / 2, H * 0.3, ms * 100 + "m!", "#5fd3ff", 30); api.sfx("sparkle"); }
        if (!S.hintShown && S.obs.length && S.obs[0].x < W * 0.75) { S.hintShown = true; banner("TAP!", "popcorn over it!", "#ffd84d"); }
      } else if (S.state === "end") {
        S.endT += dt; spd = S.speed * Math.max(0, 1 - S.endT * 1.5);
        if (S.endT > 1.8) finish();
      } else if (S.state === "intro" || S.state === "over") {
        spd = 120 * u;
      }
      S.scroll += spd * dt;
      // player physics
      P.runT += dt * (spd / (200 * u) + 1);
      if (!P.onGround) {
        P.vy += GRAV * u * dt; P.y += P.vy * dt;
        if (P.y >= 0) { P.y = 0; P.vy = 0; P.onGround = true; P.hops = 0; P.sqT = 0; P.spin = 0; P.spinV = 0; dust(px0, groundY, 5); if (playing) api.sfx("squish"); }
      }
      if (P.spinV) { P.spin += P.spinV * dt; if (Math.abs(P.spin) >= TAU) { P.spin = 0; P.spinV = 0; } }
      P.wig += dt; P.sqT += dt; P.hurtT += dt;
      // obstacles
      const hx0 = px0 - gw * 0.22, hx1 = px0 + gw * 0.24, feet = groundY + P.y - gh * 0.06, headTop = groundY + P.y - gh * 0.62;
      for (const o of S.obs) {
        if (o.fly > 0) { o.x += o.vx * dt; o.y += o.vy * dt; o.vy += 2200 * u * dt; o.rot += 10 * dt; o.fly -= dt * 0.6; continue; }
        o.x -= spd * dt;
        if (o.awake) o.awake = Math.max(0, o.awake - dt);
        if (playing && !o.hit) {
          const inset = (o.type === "puddle" ? 18 : o.type === "cat" ? 14 : 10) * u;
          const top = groundY - o.h + (o.type === "puddle" ? 14 * u : 8 * u);
          if (hx1 > o.x + inset && hx0 < o.x + o.w - inset && feet > top && headTop < groundY) hitObstacle(o);
          if (!o.passed && o.x + o.w < hx0) { o.passed = true; if (!o.hit && S.rush <= 0) { /* clean jump */ } }
        }
      }
      S.obs = S.obs.filter((o) => o.x > -o.w - 40 && o.fly > -0.5 && o.y < H + 200);
      // items
      const cx = px0, cy = groundY + P.y - gh * 0.45, cr = gw * 0.5;
      for (const it of S.items) {
        it.x -= spd * dt; it.ph += dt;
        if (it.got) continue;
        if (S.rush > 0 && it.k !== "candy") { const dx = cx - it.x, dy = cy - it.y; if (dx * dx + dy * dy < (200 * u) ** 2) { it.x += dx * Math.min(1, dt * 8); it.y += dy * Math.min(1, dt * 8); } }
        if (playing) { const dx = cx - it.x, dy = cy - it.y, rr2 = cr + (it.k === "candy" ? 26 * u : 14 * u); if (dx * dx + dy * dy < rr2 * rr2) collect(it); }
      }
      S.items = S.items.filter((i) => !i.got && i.x > -60);
      // rush trail
      if (S.rush > 0) {
        const cols = ["#ff5a5f", "#ff9f43", "#ffd84d", "#7be04a", "#5fd3ff", "#c7b3ff"];
        S.parts.push({ k: "trail", x: px0 - gw * 0.3, y: groundY + P.y - gh * 0.45 + rnd(-gh * 0.25, gh * 0.25), vx: -spd, vy: 0, g: 0, r: rnd(6, 11) * u, col: pick(cols), life: 0.45, t: 0 });
      }
      if (playing && P.onGround && Math.random() < dt * 8) dust(px0 - gw * 0.3, groundY, 1);
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.grow) p.r += p.grow * dt;
        if (p.k === "star") p.rot += dt * 6;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 60 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.6 && S.state === "play") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 40);
      S.flash = Math.max(0, S.flash - dt);
      if (playing) setHud();
    }

    /* ---------- drawing ---------- */
    function layer(par, baseY, amp, freq, col, seed) {
      const g = ctx, off = S.scroll * par;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 12; x += 12) {
        const wx = (x + off) / u;
        g.lineTo(x, baseY - (Math.sin(wx * freq + seed) * 0.6 + Math.sin(wx * freq * 2.3 + seed * 2) * 0.4) * amp);
      }
      g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    }
    function cloud(x, y, s) {
      const g = ctx; g.save(); g.translate(x, y); g.scale(s, s);
      blob(g, [ell(g, 0, 0, 34, 18), ell(g, 28, 6, 24, 14), ell(g, -28, 6, 22, 12), ell(g, 6, -12, 22, 16)], "#fff", 3);
      g.restore();
    }
    function trees(par, baseY, spacing, size) {
      const g = ctx, off = S.scroll * par;
      const i0 = Math.floor(off / spacing) - 1, i1 = Math.ceil((off + W) / spacing) + 1;
      for (let i = i0; i <= i1; i++) {
        const h = hash(i);
        if (h < 0.35) continue;
        const x = i * spacing - off + hash(i + 9) * spacing * 0.5, s = size * (0.75 + hash(i + 3) * 0.5);
        if (h < 0.7) {
          g.fillStyle = "#a8743f"; g.strokeStyle = INK; g.lineWidth = 3;
          rr(g, x - s * 0.1, baseY - s * 0.9, s * 0.2, s * 0.9, 4); g.fill(); g.stroke();
          blob(g, [ell(g, x, baseY - s * 1.1, s * 0.5, s * 0.42), ell(g, x - s * 0.3, baseY - s * 0.85, s * 0.32, s * 0.28), ell(g, x + s * 0.32, baseY - s * 0.85, s * 0.32, s * 0.28)], h < 0.5 ? "#7ed957" : "#5fc24a", 3);
          if (hash(i + 5) > 0.5) { g.fillStyle = "#ff5a5f"; [[-0.2, -1.1], [0.15, -0.95], [0.25, -1.2]].forEach(([a, b]) => { g.beginPath(); g.arc(x + a * s, baseY + b * s, s * 0.05, 0, TAU); g.fill(); }); }
        } else {
          blob(g, [ell(g, x, baseY - s * 0.2, s * 0.42, s * 0.28), ell(g, x - s * 0.3, baseY - s * 0.12, s * 0.28, s * 0.2), ell(g, x + s * 0.3, baseY - s * 0.12, s * 0.28, s * 0.2)], "#67c94b", 3);
          g.fillStyle = "#ff8fc7"; g.beginPath(); g.arc(x - s * 0.1, baseY - s * 0.3, s * 0.05, 0, TAU); g.arc(x + s * 0.2, baseY - s * 0.2, s * 0.05, 0, TAU); g.fill();
        }
      }
    }
    function ground() {
      const g = ctx, off = S.scroll;
      g.fillStyle = "#c98d52"; g.fillRect(0, groundY, W, H - groundY);
      // stripes
      g.fillStyle = "#b67a42";
      const sp = 60 * u, o2 = off % sp;
      for (let x = -sp; x < W + sp; x += sp) { g.beginPath(); g.moveTo(x - o2, groundY + 20 * u); g.lineTo(x - o2 + 30 * u, groundY + 20 * u); g.lineTo(x - o2 + 10 * u, H); g.lineTo(x - o2 - 20 * u, H); g.closePath(); g.fill(); }
      // pebbles
      const sp2 = 90 * u, i0 = Math.floor(off / sp2) - 1, i1 = Math.ceil((off + W) / sp2) + 1;
      for (let i = i0; i <= i1; i++) {
        const x = i * sp2 - off + hash(i) * 40 * u, y = groundY + 30 * u + hash(i + 2) * (H - groundY - 40 * u);
        g.fillStyle = "#e3b27c"; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 7 * u, 4.5 * u, 0, 0, TAU); g.fill(); g.stroke();
      }
      // grass edge
      const gs = 22 * u, o3 = off % gs;
      g.beginPath(); g.moveTo(0, groundY - 6 * u);
      for (let x = -gs; x <= W + gs; x += gs) g.quadraticCurveTo(x - o3 + gs / 2, groundY + 18 * u, x - o3 + gs, groundY + 8 * u);
      g.lineTo(W, groundY - 6 * u); g.closePath();
      g.fillStyle = "#6fd14a"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      g.beginPath(); g.moveTo(0, groundY - 4.5 * u); g.lineTo(W, groundY - 4.5 * u); g.stroke();
      // tufts
      const sp3 = 70 * u, j0 = Math.floor(off / sp3) - 1, j1 = Math.ceil((off + W) / sp3) + 1;
      g.strokeStyle = "#3fa52a"; g.lineWidth = 3;
      for (let i = j0; i <= j1; i++) {
        if (hash(i + 7) < 0.4) continue;
        const x = i * sp3 - off;
        g.beginPath(); g.moveTo(x, groundY); g.lineTo(x - 4 * u, groundY - 12 * u); g.moveTo(x + 4, groundY); g.lineTo(x + 6 * u, groundY - 14 * u); g.stroke();
      }
    }
    function drawObstacle(o) {
      const g = ctx;
      g.save();
      if (o.fly > 0 || o.y) { g.translate(o.x + o.w / 2, groundY - o.h / 2 + o.y); g.rotate(o.rot); g.translate(-o.w / 2, -o.h / 2); }
      else g.translate(o.x, groundY - o.h);
      if (o.type === "bale") g.drawImage(SPR.bale.c, 0, 2 * u, o.w, o.h);
      else if (o.type === "stack") { g.drawImage(SPR.bale.c, 0, o.h * 0.48, o.w, o.h * 0.54); g.drawImage(SPR.bale.c, 3 * u, 0, o.w - 6 * u, o.h * 0.52); }
      else if (o.type === "cat") {
        const br = o.awake ? 1 : 1 + Math.sin(performance.now() / 500 + o.ph) * 0.03;
        g.translate(0, o.h); g.scale(1, br); g.translate(0, -o.h);
        g.drawImage(SPR.cat.c, 0, 4 * u, o.w, o.h);
        if (o.awake) {
          // angry open eyes overlay
          g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 2;
          [[18, 30], [32, 30]].forEach(([a, b]) => { g.beginPath(); g.arc(a / 110 * o.w, (b + 4) / 64 * o.h, 5 * u, 0, TAU); g.fill(); g.stroke(); });
        }
      } else if (o.type === "puddle") {
        g.drawImage(SPR.puddle.c, 0, 6 * u, o.w, o.h);
      }
      g.restore();
      if (o.type === "cat" && !o.fly && !o.awake) {
        const t = performance.now() / 1000 + o.ph;
        for (let k = 0; k < 3; k++) {
          const f = (t * 0.6 + k / 3) % 1;
          g.globalAlpha = 1 - f;
          txt(g, "z", o.x + o.w * 0.25 + f * 30 * u + Math.sin(f * 6) * 4, groundY - o.h - f * 46 * u, (12 + f * 10) * u, "#fff", 3);
        }
        g.globalAlpha = 1;
      }
      if (o.type === "puddle" && !o.fly) {
        const t = performance.now() / 1000 + o.ph;
        g.fillStyle = "#b8f58f"; g.strokeStyle = INK; g.lineWidth = 2;
        for (let k = 0; k < 2; k++) { const f = (t * 0.8 + k * 0.5) % 1; g.globalAlpha = 1 - f; g.beginPath(); g.arc(o.x + o.w * (0.6 + k * 0.15), groundY - 8 * u - f * 22 * u, (3 + f * 4) * u, 0, TAU); g.fill(); g.stroke(); }
        g.globalAlpha = 1;
      }
    }
    function drawItem(it) {
      const g = ctx;
      if (it.k === "candy") {
        const t = it.ph, y = it.y + Math.sin(t * 4) * 8 * u;
        g.save(); g.translate(it.x, y); g.rotate(t * 1.5);
        g.fillStyle = "rgba(255,143,199,.35)";
        for (let i = 0; i < 10; i++) { g.rotate(TAU / 10); g.beginPath(); g.moveTo(0, 0); g.lineTo(-7 * u, 62 * u); g.lineTo(7 * u, 62 * u); g.closePath(); g.fill(); }
        g.restore();
        g.save(); g.translate(it.x, y); g.rotate(Math.sin(t * 3) * 0.25);
        const s = 60 * u * 0.9; g.drawImage(SPR.candy.c, -s / 2, -s * 0.5, s, s * 92 / 60); g.restore();
        return;
      }
      const r = (it.k === "gold" ? 15 : 12) * u, sx = Math.abs(Math.cos(it.ph * 4)) * 0.85 + 0.15;
      const y = it.y + Math.sin(it.ph * 3) * 3 * u;
      g.save(); g.translate(it.x, y); g.scale(sx, 1);
      g.fillStyle = it.k === "gold" ? "#fff06a" : "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = it.k === "gold" ? "#ffb300" : "#f0b400"; g.beginPath(); g.arc(0, 0, r * 0.58, 0, TAU); g.fill();
      g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.15, -0.6, 0, TAU); g.fill();
      g.restore();
      if (it.k === "gold" && Math.random() < 0.2) S.parts.push({ k: "star", x: it.x + rnd(-r, r), y: y + rnd(-r, r), vx: 0, vy: 20, g: 0, r: rnd(3, 5) * u, col: "#fff", life: 0.4, t: 0, rot: 0 });
    }
    function drawGuinea() {
      const g = ctx;
      const hurt = P.hurtT < 0.8;
      const st = P.sqT, wob = Math.exp(-st * 8) * Math.cos(st * 24) * 0.25;
      let sx = 1 + wob, sy = 1 - wob;
      if (!P.onGround) { const s = clamp(-P.vy / (2000 * u), -0.15, 0.2); sx -= s * 0.6; sy += s; }
      const bob = P.onGround && (S.state === "play" || S.state === "intro" || S.state === "over") ? Math.abs(Math.sin(P.runT * 5)) * 7 * u : 0;
      const wig = P.wig < 0.5 ? Math.sin(P.wig * 28) * 0.35 * (1 - P.wig / 0.5) : 0;
      const x = px0, y = groundY + P.y - bob;
      // shadow
      const sh = clamp(1 + P.y / (300 * u), 0.3, 1);
      g.fillStyle = "rgba(43,22,64,.2)"; g.beginPath(); g.ellipse(x, groundY + 2, gw * 0.42 * sh, 7 * u * sh, 0, 0, TAU); g.fill();
      if (S.inv > 0 && !hurt && Math.floor(S.inv * 12) % 2 === 0) g.globalAlpha = 0.45;
      if (S.rush > 0) {
        const t = performance.now() / 1000;
        const grd = g.createRadialGradient(x, y - gh * 0.45, 4, x, y - gh * 0.45, gw * 0.85);
        grd.addColorStop(0, "hsla(" + ((t * 360) % 360) + ",100%,75%,.9)"); grd.addColorStop(1, "hsla(" + ((t * 360 + 60) % 360) + ",100%,75%,0)");
        g.fillStyle = grd; g.beginPath(); g.arc(x, y - gh * 0.45, gw * 0.85, 0, TAU); g.fill();
      }
      g.save(); g.translate(x, y - gh * 0.45); g.rotate(P.spin + wig + (P.onGround ? Math.sin(P.runT * 5) * 0.04 : -0.08)); g.scale(sx, sy); g.translate(0, gh * 0.45);
      const img = hurt ? gImg.sad : S.rush > 0 || !P.onGround ? gImg.wow : gImg.happy;
      if (img.complete && img.naturalWidth) g.drawImage(img, -gw / 2, -gh, gw, gh);
      // little feet
      if (P.onGround) {
        g.fillStyle = "#ffb3c8"; g.strokeStyle = INK; g.lineWidth = 2.5;
        const ph = P.runT * 10;
        [[-0.22, 0], [0.2, Math.PI]].forEach(([fx, o]) => { g.beginPath(); g.ellipse(gw * fx + Math.cos(ph + o) * 5 * u, -gh * 0.06 + Math.min(0, Math.sin(ph + o)) * 4 * u, 7 * u, 4.5 * u, 0, 0, TAU); g.fill(); g.stroke(); });
      }
      g.restore();
      g.globalAlpha = 1;
    }
    function drawStar(g, x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      for (let i = 0; i < 8; i++) { const r2 = i % 2 ? r * 0.4 : r, a = (i / 8) * TAU; g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); }
      g.closePath(); g.fill(); g.restore();
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state === "play" && t > 1.3 ? 1 - (t - 1.3) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.3); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(52, W * 0.9 / (b.text.length * 0.7 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 18, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      if (sky) g.drawImage(sky, 0, 0, W, H);
      if (S.rush > 0) { g.fillStyle = "hsla(" + ((performance.now() / 5) % 360) + ",100%,70%,.18)"; g.fillRect(0, 0, W, H); }
      g.save();
      const sh = S.shake; if (sh > 0) g.translate(rnd(-sh, sh) * 0.6, rnd(-sh, sh) * 0.6);
      // clouds
      const co = S.scroll * 0.05 + performance.now() / 1000 * 8;
      for (let i = 0; i < 4; i++) { const x = ((i * 170 - co) % (W + 300) + W + 300) % (W + 300) - 150; cloud(x, groundY * (0.16 + (i % 2) * 0.17), u * (0.7 + (i % 3) * 0.15)); }
      layer(0.06, groundY - 230 * u, 70 * u, 0.004, "#efd8ff", 2);
      layer(0.12, groundY - 130 * u, 45 * u, 0.006, "#d9c7ff", 1);
      layer(0.25, groundY - 60 * u, 30 * u, 0.01, "#b7e6a5", 4);
      trees(0.45, groundY - 34 * u, 150 * u, 90 * u);
      layer(0.6, groundY - 18 * u, 12 * u, 0.02, "#93d977", 7);
      trees(0.75, groundY - 4 * u, 220 * u, 56 * u);
      ground();
      for (const o of S.obs) drawObstacle(o);
      for (const it of S.items) drawItem(it);
      for (const p of S.parts) if (p.k === "trail") { g.globalAlpha = 1 - p.t / p.life; g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
      g.globalAlpha = 1;
      drawGuinea();
      for (const p of S.parts) {
        if (p.k === "trail") continue;
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "puff" ? a * 0.8 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); if (p.k === "dot") { g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); } }
      }
      g.globalAlpha = 1;
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.6) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, (f.t - 0.12));
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = "rgba(255,90,95," + S.flash * 1.2 + ")"; g.fillRect(0, 0, W, H); }
      if (S.rush > 0) {
        const f = S.rush / 5.5, w = Math.min(220, W * 0.5), x = (W - w) / 2, y = 64;
        g.fillStyle = "#fffdf8"; g.strokeStyle = INK; g.lineWidth = 3; rr(g, x, y, w, 26, 13); g.fill(); g.stroke();
        const gr = g.createLinearGradient(x, 0, x + w, 0);
        ["#ff5a5f", "#ffd84d", "#7be04a", "#5fd3ff", "#c7b3ff"].forEach((c, i) => gr.addColorStop(i / 4, c));
        g.fillStyle = gr; rr(g, x + 4, y + 4, Math.max(8, (w - 8) * f), 18, 9); g.fill();
        txt(g, "🍭 SUGAR RUSH", W / 2, y + 13, 14, "#fff", 3);
      }
      if (S.state === "end" || S.state === "over") { g.fillStyle = "rgba(43,22,64," + Math.min(0.3, (S.endT || 2) * 0.3) + ")"; g.fillRect(0, 0, W, H); }
      drawBanner();
    }

    /* ---------- loop & input ---------- */
    let raf = 0, last = 0, alive = true;
    function frame(t) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      let dt = last ? (t - last) / 1000 : 0; last = t;
      if (dt > 0.05) dt = 0.05;
      update(dt); draw();
    }
    function onDown(e) { e.preventDefault(); jump(); }
    function onKey(e) { if (e.repeat) return; if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { e.preventDefault && S.state === "play" && e.preventDefault(); jump(); } }
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    reset();
    resize();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Popcorn Hop", icon: "🍿", place: "arcade", kind: "skill",
    blurb: "Popcorn over hay and sleepy cats!",
    mount,
  });
})();
