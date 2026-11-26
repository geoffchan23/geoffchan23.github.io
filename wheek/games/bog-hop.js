/* Wheek World mini-game: Bog Hop.
   Frogger-style: hop your guinea across a stinky swamp on lily pads, logs and floating squishies.
   Reach the far bank to level up (faster bog). 3 hearts, 90 second round. Free to play; pays by skill. */
(function () {
  "use strict";
  const ID = "bog-hop", C = "g-bog";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 90;
  const ROWS = 9, COLS = 7, GOAL = 8, ISLAND = 4;
  const CTRLH = 78, HUDH = 60;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];

  function svgImg(svg) {
    if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return img;
  }
  function rr(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function txt(g, s, x, y, size, fill, lw) {
    g.font = size + "px " + FONT; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = lw || Math.max(4, size * 0.2); g.strokeStyle = INK; g.strokeText(s, x, y);
    g.fillStyle = fill; g.fillText(s, x, y);
  }

  // lane recipes (row -> kind, base speed in cells/sec, direction)
  const LANES = {
    1: { kind: "pad", sp: 0.85, dir: 1 },
    2: { kind: "log", sp: 1.15, dir: -1 },
    3: { kind: "squish", sp: 0.95, dir: 1 },
    5: { kind: "log", sp: 1.35, dir: -1 },
    6: { kind: "pad", sp: 1.05, dir: 1 },
    7: { kind: "squish", sp: 1.5, dir: -1 },
  };
  const SQ_COLS = [["#ff8fc7", "#e8458f"], ["#c7b3ff", "#8f74e0"], ["#ffd84d", "#e0a800"], ["#5fd3ff", "#1f9ccc"], ["#ffb38a", "#ef7a4a"]];
  const EWS = ["SPLOOSH!", "STINKY!", "BLUB BLUB!", "PEE-YEW!", "SPLASH!"];
  const HOPS = ["BOING!", "HOP!", "WHEE!", "SPROING!"];
  const DIVE = 5.6;

  const HEART = '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#4d6b2e}
.${C} canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 10px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:4px;min-height:40px;white-space:nowrap}
.${C} .pill.sc{min-width:76px}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb .5s infinite}
.${C} .pill.lv{gap:1px;padding:2px 7px}
.${C} .pill.lv svg{transition:transform .3s,filter .3s,opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:56px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:16px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ctrl{position:absolute;left:0;right:0;bottom:0;height:${CTRLH}px;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 8px 4px;z-index:3;background:linear-gradient(#5a3b1c,#3d2611);border-top:4px solid var(--ink)}
.${C} .ctrl .btn{min-height:56px;height:56px;padding:0;font-size:26px;width:64px;touch-action:none;flex:0 1 auto}
.${C} .ctrl .btn.up{width:112px;font-size:22px}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(43,22,64,.32);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:16px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:104px;display:flex;align-items:flex-end;justify-content:center;margin-top:-4px}
.${C} .panel .art svg{animation:${C}-bob 1.1s ease-in-out infinite}
.${C} .panel .art .fl{position:absolute;font-size:28px;bottom:4px;animation:${C}-float 2s ease-in-out infinite}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--slime)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.32;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#eafbe0;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-bob{0%,100%{transform:translateY(0) scale(1,1)}40%{transform:translateY(-22px) scale(.94,1.06)}80%{transform:translateY(0) scale(1.08,.92)}}
@keyframes ${C}-float{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-6px) rotate(6deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (max-height:700px){.${C} .panel .art{height:84px}.${C} .panel h2{font-size:30px}.${C} .panel p{font-size:15px}.${C} .chips{margin-bottom:10px}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill tm">⏱<b>${ROUND}</b></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div>
      <div class="ctrl"><button class="btn sky" data-d="l" aria-label="left">◀</button><button class="btn sky" data-d="d" aria-label="down">▼</button><button class="btn green up" data-d="u" aria-label="hop up">▲ HOP</button><button class="btn sky" data-d="r" aria-label="right">▶</button></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = wrap.querySelector(".ov");
    const ctrlBtns = [...wrap.querySelectorAll(".ctrl .btn")];
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = {
      happy: svgImg(api.guineaSVG({ size: 200, mood: "happy" })),
      happyF: svgImg(api.guineaSVG({ size: 200, mood: "happy", flip: true })),
      wow: svgImg(api.guineaSVG({ size: 200, mood: "wow" })),
      wowF: svgImg(api.guineaSVG({ size: 200, mood: "wow", flip: true })),
      sad: svgImg(api.guineaSVG({ size: 200, mood: "sad" })),
    };

    let raf = 0, last = 0, alive = true;
    const timers = new Set();
    const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); };
    let W = 1, H = 1, dpr = 1, cell = 50, boardBottom = 1, bg = null;
    const S = {};
    const P = { x: 0, row: 0, hopT: -1, fx: 0, tx: 0, frow: 0, trow: 0, face: 1, sqT: 9, dead: 0, buf: null, win: 0 };
    let lanes = {};

    const rowY = (r) => boardBottom - (r + 0.5) * cell;
    const isWater = (r) => r > 0 && r < GOAL && r !== ISLAND;

    function reset() {
      Object.assign(S, { state: "intro", t: 0, timeLeft: ROUND, score: 0, lives: 3, level: 1, levels: 0, rows: 0, coins: 0, maxRow: 0,
        parts: [], floats: [], shake: 0, banner: null, flash: 0, endT: 0, awarded: false, lastSec: ROUND, coinT: 1.5, why: "", splashes: 0, hops: 0 });
      respawn();
      buildLanes();
    }
    function respawn() {
      P.row = 0; P.x = W / 2; P.hopT = -1; P.dead = 0; P.buf = null; P.face = 1; P.sqT = 0; P.win = 0;
    }

    function buildLanes() {
      lanes = {};
      const L = S.level || 1;
      const spMul = Math.min(2.3, 1 + 0.22 * (L - 1));
      const flip = L % 2 === 0 ? -1 : 1;
      const A = 5 * cell;
      Object.keys(LANES).forEach((k) => {
        const r = +k, cfg = LANES[r];
        const items = [];
        let cur = rnd(0, 1.5);
        const need = (W + 9 * cell) / cell;
        while (cur < need || items.length < 3) {
          let len;
          if (cfg.kind === "log") len = clamp(Math.round(rnd(2, L >= 3 ? 3 : 4)), 2, 4);
          else len = L >= 4 ? 1 + (Math.random() < 0.5 ? 1 : 0) : 2 + (Math.random() < 0.45 ? 1 : 0);
          const it = { x: cur * cell - A, len, kind: cfg.kind, coin: -1, ph: rnd(0, DIVE), col: pick(SQ_COLS), flower: Math.random() < 0.35, dive: false, depth: 0, seed: Math.random() * 100 };
          if (cfg.kind === "squish" && L >= 2 && Math.random() < Math.min(0.85, 0.4 + 0.15 * L)) it.dive = true;
          items.push(it);
          cur += len + rnd(1.3, 2.4) + Math.min(1.2, (L - 1) * 0.18);
        }
        lanes[r] = { r, kind: cfg.kind, dir: cfg.dir * flip * (r === 5 || r === 7 ? 1 : 1), speed: cfg.sp * spMul * rnd(0.92, 1.08), items, loop: cur * cell, A };
      });
    }

    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      const oldCell = cell, oldW = W;
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cell = Math.max(20, Math.min(W / COLS, (H - HUDH - CTRLH - 12) / ROWS));
      boardBottom = H - CTRLH - Math.max(4, (H - HUDH - CTRLH - ROWS * cell) * 0.45);
      if (S.state && oldW > 1) {
        P.x = clamp(P.x * (W / oldW), cell / 2, W - cell / 2);
        if (Math.abs(oldCell - cell) > 0.5 || Math.abs(oldW - W) > 0.5) buildLanes();
      }
      buildBg();
    }

    /* ---------- background ---------- */
    function buildBg() {
      bg = document.createElement("canvas"); bg.width = cv.width; bg.height = cv.height;
      const g = bg.getContext("2d"); g.scale(dpr, dpr); g.lineJoin = "round"; g.lineCap = "round";
      const topBank = rowY(GOAL) - cell / 2, botBank = rowY(0) + cell / 2;
      // far bank (and everything above it)
      const gr = g.createLinearGradient(0, 0, 0, topBank + cell);
      gr.addColorStop(0, "#5aa83a"); gr.addColorStop(1, "#7bd04f");
      g.fillStyle = gr; g.fillRect(0, 0, W, topBank + cell);
      // fog-green sky strip at the very top for depth
      g.fillStyle = "rgba(200,240,170,.25)"; g.fillRect(0, 0, W, Math.max(0, topBank - cell * 1.2));
      // water
      const wy0 = topBank + cell, wy1 = botBank - cell;
      const wg = g.createLinearGradient(0, wy0, 0, wy1);
      wg.addColorStop(0, "#56743a"); wg.addColorStop(0.5, "#4a6a30"); wg.addColorStop(1, "#557a36");
      g.fillStyle = wg; g.fillRect(0, wy0, W, wy1 - wy0);
      // lane shading
      for (let r = 1; r < GOAL; r++) {
        if (r === ISLAND) continue;
        g.fillStyle = r % 2 ? "rgba(30,50,15,.12)" : "rgba(160,200,90,.07)";
        g.fillRect(0, rowY(r) - cell / 2, W, cell);
      }
      // murk blobs
      for (let i = 0; i < W * (wy1 - wy0) / 1800; i++) {
        g.fillStyle = pick(["rgba(120,150,60,.25)", "rgba(40,60,20,.22)", "rgba(150,170,70,.18)"]);
        g.beginPath(); g.ellipse(rnd(0, W), rnd(wy0, wy1), rnd(6, 22), rnd(3, 8), 0, 0, TAU); g.fill();
      }
      // island (mud)
      const iy = rowY(ISLAND);
      g.fillStyle = "#9a7440"; g.strokeStyle = INK; g.lineWidth = 3.5;
      g.beginPath(); g.moveTo(-10, iy - cell * 0.42);
      for (let x = 0; x <= W + 20; x += 20) g.quadraticCurveTo(x + 10, iy - cell * 0.5 - Math.sin(x * 0.07) * 4, x + 20, iy - cell * 0.42);
      g.lineTo(W + 10, iy + cell * 0.42);
      for (let x = W + 20; x >= -20; x -= 20) g.quadraticCurveTo(x - 10, iy + cell * 0.5 + Math.cos(x * 0.05) * 3, x - 20, iy + cell * 0.42);
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#7d5a2c";
      for (let i = 0; i < W / 18; i++) { g.beginPath(); g.ellipse(rnd(0, W), iy + rnd(-cell * 0.28, cell * 0.3), rnd(2, 5), rnd(1.5, 3), 0, 0, TAU); g.fill(); }
      for (let x = rnd(10, 40); x < W; x += rnd(cell * 1.6, cell * 3)) { // stones and mushrooms
        if (Math.random() < 0.5) {
          g.fillStyle = "#b9b3c9"; g.beginPath(); g.ellipse(x, iy + cell * 0.18, cell * 0.14, cell * 0.09, 0, 0, TAU); g.fill(); g.lineWidth = 2; g.stroke();
        } else {
          g.fillStyle = "#fff6e8"; g.fillRect(x - 2, iy - cell * 0.05, 4, cell * 0.16); g.lineWidth = 2; g.strokeRect(x - 2, iy - cell * 0.05, 4, cell * 0.16);
          g.fillStyle = "#ff5a5f"; g.beginPath(); g.ellipse(x, iy - cell * 0.06, cell * 0.12, cell * 0.08, 0, Math.PI, TAU); g.closePath(); g.fill(); g.stroke();
          g.fillStyle = "#fff"; g.beginPath(); g.arc(x - cell * 0.04, iy - cell * 0.1, 1.8, 0, TAU); g.fill();
        }
      }
      // start bank (and everything below it)
      const sg = g.createLinearGradient(0, botBank - cell, 0, H);
      sg.addColorStop(0, "#7bd04f"); sg.addColorStop(1, "#5aa83a");
      g.fillStyle = sg; g.fillRect(0, botBank - cell, W, H - botBank + cell);
      // wavy shorelines
      const shore = (y, up) => {
        g.beginPath(); g.moveTo(-10, y);
        for (let x = 0; x <= W + 20; x += 16) g.quadraticCurveTo(x + 8, y + (up ? 6 : -6), x + 16, y);
        g.lineTo(W + 10, y + (up ? -40 : 40)); g.lineTo(-10, y + (up ? -40 : 40)); g.closePath();
      };
      g.fillStyle = "#8a6a3a"; shore(topBank + cell + 4, true); g.fill();
      g.fillStyle = "#7bd04f"; shore(topBank + cell - 4, true); g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5;
      g.beginPath(); g.moveTo(-10, topBank + cell - 4); for (let x = 0; x <= W + 20; x += 16) g.quadraticCurveTo(x + 8, topBank + cell + 2, x + 16, topBank + cell - 4); g.stroke();
      g.fillStyle = "#8a6a3a"; shore(botBank - cell - 4, false); g.fill();
      g.fillStyle = "#7bd04f"; shore(botBank - cell + 4, false); g.fill();
      g.beginPath(); g.moveTo(-10, botBank - cell + 4); for (let x = 0; x <= W + 20; x += 16) g.quadraticCurveTo(x + 8, botBank - cell - 2, x + 16, botBank - cell + 4); g.stroke();
      // grass tufts + flowers on banks
      const tufts = (y0, y1) => {
        for (let i = 0; i < W / 22; i++) {
          const x = rnd(0, W), y = rnd(y0, y1);
          g.strokeStyle = "#4f9a2c"; g.lineWidth = 2.5;
          g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x - 6, y - 7); g.moveTo(x, y); g.lineTo(x, y - 9); g.moveTo(x + 4, y); g.lineTo(x + 6, y - 7); g.stroke();
        }
        for (let x = rnd(10, 50); x < W; x += rnd(50, 100)) {
          const y = rnd(y0, y1), c = pick(["#ff8fc7", "#ffd84d", "#fff", "#c7b3ff"]);
          g.fillStyle = c; g.strokeStyle = INK; g.lineWidth = 1.8;
          for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * TAU / 5) * 4, y + Math.sin(k * TAU / 5) * 4, 3.2, 0, TAU); g.fill(); g.stroke(); }
          g.fillStyle = "#ff9f43"; g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill();
        }
      };
      tufts(8, topBank + cell * 0.8);
      tufts(botBank - cell * 0.7, H - CTRLH - 2);
      // cattails along the far shore
      for (let x = rnd(6, 30); x < W; x += rnd(cell * 1.2, cell * 2.4)) {
        const y = topBank + cell - 2;
        g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - cell * 0.7); g.stroke();
        g.strokeStyle = "#3f8a24"; g.lineWidth = 2; g.stroke();
        g.fillStyle = "#7a4a22"; rr(g, x - 3, y - cell * 0.78, 9, cell * 0.3, 4); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      }
      // finish sign on the far bank
      const fy = rowY(GOAL), fx = W - cell * 0.9;
      g.strokeStyle = INK; g.lineWidth = 3;
      g.fillStyle = "#a8743f"; g.fillRect(fx - 2, fy - cell * 0.3, 4, cell * 0.55); g.strokeRect(fx - 2, fy - cell * 0.3, 4, cell * 0.55);
      rr(g, fx - cell * 0.62, fy - cell * 0.48, cell * 1.24, cell * 0.36, 6); g.fillStyle = "#fffdf8"; g.fill(); g.stroke();
      g.font = Math.round(cell * 0.24) + "px " + FONT; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = INK;
      g.fillText("SAFE!", fx, fy - cell * 0.29);
      // little hay pile goal on the left of far bank
      const hx = cell * 0.9;
      g.fillStyle = "#ffd84d"; g.beginPath(); g.ellipse(hx, fy + cell * 0.12, cell * 0.42, cell * 0.24, 0, Math.PI, TAU); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      g.strokeStyle = "#e0a800"; g.lineWidth = 2;
      for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(hx + i * cell * 0.1, fy + cell * 0.1); g.lineTo(hx + i * cell * 0.13, fy - cell * 0.08); g.stroke(); }
    }

    /* ---------- UI ---------- */
    function setHud() {
      scEl.textContent = S.score;
      const sec = Math.max(0, Math.ceil(S.timeLeft));
      tmEl.textContent = sec;
      tmPill.classList.toggle("hurry", sec <= 10 && S.state === "play");
      hearts.forEach((h, i) => h.classList.toggle("gone", i >= S.lives));
    }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 112, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="fl" style="left:8%">🪷</span><span class="fl" style="right:6%;animation-delay:-.7s">🪵</span>${svg}</div>
        <h2>${after ? "Again?!" : "Bog Hop"}</h2>${lastLine}
        ${after ? `<p>${after.line}</p>` : `<p>Hop <b>${gName}</b> across the stinky bog! Ride <b>lily pads</b>, <b>logs</b> and <b>squishies</b>. Don't fall in!</p>
        <div class="chips"><span class="chip">👆 Swipe or tap arrows</span><span class="chip">🪙 Grab coins</span><span class="chip">🏁 Reach the far bank</span></div>`}
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "play";
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud();
      banner("GO!", "hop to the far bank!", "#7be04a");
      api.sfx("whoosh");
    }

    /* ---------- fx ---------- */
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 24; x = clamp(x, text.length * size * 0.32 + 8, W - text.length * size * 0.32 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 0.9 }); }
    function burst(x, y, cols, n, spd) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 240);
        S.parts.push({ k: "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, g: 800, r: rnd(2.5, 6), col: pick(cols), life: rnd(0.4, 0.8), t: 0 });
      }
    }
    function gas(x, y, n) {
      for (let i = 0; i < n; i++) {
        S.parts.push({ k: "gas", x: x + rnd(-14, 14), y: y + rnd(-8, 8), vx: rnd(-50, 50), vy: rnd(-70, -15), g: -20, r: rnd(8, 16), grow: rnd(16, 30), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.8, 1.4), t: 0 });
      }
    }
    function stars(x, y, n) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(80, 240);
        S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120, r: rnd(4, 9), col: pick(["#ffd84d", "#fff", "#ffe98a"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) });
      }
    }
    function ring(x, y) { S.parts.push({ k: "ring", x, y, vx: 0, vy: 0, g: 0, r: cell * 0.2, life: 0.7, t: 0, col: "#c8e89a" }); }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- gameplay ---------- */
    function itemAt(r, x) {
      const ln = lanes[r]; if (!ln) return null;
      const tol = cell * 0.22;
      for (const it of ln.items) if (x >= it.x - tol && x <= it.x + it.len * cell + tol) return it;
      return null;
    }
    function hop(d) {
      if (S.state !== "play" || P.dead > 0 || P.win > 0) return;
      if (P.hopT >= 0) { P.buf = d; return; }
      let tr = P.row, tx = P.x;
      if (d === "u") tr = Math.min(GOAL, P.row + 1);
      else if (d === "d") tr = Math.max(0, P.row - 1);
      else if (d === "l") { tx = P.x - cell; P.face = -1; }
      else if (d === "r") { tx = P.x + cell; P.face = 1; }
      tx = clamp(tx, cell * 0.5, W - cell * 0.5);
      if (tr === P.row && Math.abs(tx - P.x) < 2) { P.sqT = 0; api.sfx("boop"); return; }
      P.fx = P.x; P.tx = tx; P.frow = P.row; P.trow = tr; P.hopT = 0;
      S.hops++;
      api.sfx("jump");
    }
    function land() {
      P.hopT = -1; P.x = P.tx; P.row = P.trow; P.sqT = 0;
      if (isWater(P.row)) {
        const it = itemAt(P.row, P.x);
        if (!it || it.depth > 0.55) { splash("water"); return; }
        api.sfx(it.kind === "squish" ? "squish" : it.kind === "log" ? "nom" : "pop");
        if (it.kind === "squish") it.squish = 0;
        ring(P.x, rowY(P.row) + cell * 0.3);
      } else {
        api.sfx("tick");
        P.x = clamp(P.x, cell * 0.5, W - cell * 0.5);
      }
      if (P.row > S.maxRow) {
        const n = P.row - S.maxRow; S.maxRow = P.row; S.rows += n; S.score += 10 * n;
        floatT(P.x, rowY(P.row) - cell * 0.6, "+" + 10 * n, "#fff", 22);
        if (Math.random() < 0.18) floatT(P.x + rnd(-30, 30), rowY(P.row) - cell, pick(HOPS), pick(["#ff8fc7", "#ffd84d", "#5fd3ff"]), 20);
        bump(scEl.parentNode);
      }
      if (P.row === GOAL) reachGoal();
      else if (P.buf) { const b = P.buf; P.buf = null; hop(b); }
    }
    function reachGoal() {
      S.levels++; S.level++;
      const bonus = 150;
      S.score += bonus;
      P.win = 1.4;
      api.sfx("fanfare"); api.haptic(40);
      later(() => api.sfx("wheek"), 250);
      const [vx, vy] = vp(P.x, rowY(GOAL)); api.confetti(vx, vy, 60);
      stars(P.x, rowY(GOAL), 26);
      floatT(P.x, rowY(GOAL) - cell, "+" + bonus, "#ffd84d", 30);
      banner("MADE IT!", "level " + S.level + ": faster bog!", "#ffd84d");
      bump(scEl.parentNode); shake(5);
    }
    function splash(why) {
      if (P.dead > 0) return;
      P.dead = 1.05; P.hopT = -1; P.buf = null; S.splashes++;
      S.lives--;
      const y = rowY(P.row);
      api.sfx("splat"); later(() => api.sfx("fart"), 160);
      api.haptic(90); shake(12); S.flash = 0.22;
      burst(P.x, y, ["#8fbf4a", "#c8e89a", "#5c7a3a"], 16, 260);
      gas(P.x, y - cell * 0.3, 10);
      const [vx, vy] = vp(P.x, y); api.gas(vx, vy);
      ring(P.x, y); const rx = P.x; later(() => ring(rx, y), 150);
      floatT(P.x, y - cell * 0.8, why === "edge" ? "WHOOOA!" : pick(EWS), "#b6f27a", 30);
      bump(hearts[Math.max(0, S.lives)]);
      setHud();
    }
    function spawnCoin() {
      const cand = [];
      Object.values(lanes).forEach((ln) => ln.items.forEach((it) => { if (it.coin < 0 && it.x > -cell && it.x < W) cand.push(it); }));
      const have = Object.values(lanes).reduce((n, ln) => n + ln.items.filter((i) => i.coin >= 0).length, 0);
      if (!cand.length || have >= 4) return;
      const it = pick(cand); it.coin = ((Math.random() * it.len) | 0) + 0.5;
    }
    function endRound(why) {
      if (S.state !== "play") return;
      S.state = "end"; S.endT = 0; S.why = why;
      if (why === "lives") { banner("OUT OF HEARTS!", "too much bog stink!", "#b6f27a"); api.sfx("lose"); }
      else { banner("TIME'S UP!", "", "#5fd3ff"); api.sfx("fanfare"); }
      setHud();
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const coins = Math.min(200, Math.round(S.score / 10));
      const earned = coins > 0 ? api.award(coins, { reason: "Bog Hop" }) : 0;
      const hs = api.highscore(ID, S.score);
      const quip = S.levels >= 3 ? `${gName} is a bog-hopping LEGEND!` : S.levels >= 1 ? `${gName} crossed the bog ${S.levels} time${S.levels > 1 ? "s" : ""}!` : S.why === "lives" ? `${gName} needs a bath. Pee-yew!` : `${gName} got ${S.maxRow} hops in. So close!`;
      const text = `${quip} Score ${S.score}${S.coins ? `, ${S.coins} coins grabbed` : ""}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && S.score > 0 ? "New best!" : S.why === "lives" ? "Sploosh!" : "Time's up!", text, score: S.score });
      hud.classList.add("off");
      showPanel({ score: S.score, earned, line: `${quip} ${hs.isNew && S.score > 0 ? "<b>New best!</b> 🏆" : "Best: " + hs.best}` });
    }

    function update(dt) {
      if (S.state === "play") {
        S.t += dt; S.timeLeft -= dt;
        const sec = Math.ceil(S.timeLeft);
        if (sec !== S.lastSec) { S.lastSec = sec; if (sec <= 5 && sec > 0) api.sfx("tick"); }
        S.coinT -= dt; if (S.coinT <= 0) { spawnCoin(); S.coinT = rnd(1.6, 3.2); }
        if (S.timeLeft <= 0) { S.timeLeft = 0; endRound("time"); }
      } else if (S.state === "end") {
        S.endT += dt; if (S.endT > 1.9) finish();
      }
      const moving = S.state !== "end" || S.endT < 0.6;
      // lanes
      for (const k in lanes) {
        const ln = lanes[k], v = ln.dir * ln.speed * cell * (moving ? 1 : 0.2);
        for (const it of ln.items) {
          it.x += v * dt;
          if (ln.dir > 0 && it.x > ln.loop - ln.A) { it.x -= ln.loop; it.coin = -1; }
          if (ln.dir < 0 && it.x < -ln.A) { it.x += ln.loop; it.coin = -1; }
          if (it.squish != null) { it.squish += dt; if (it.squish > 0.5) it.squish = null; }
          if (it.dive) {
            const p = (S.t + it.ph) % DIVE;
            it.warn = p > 3.4 && p < 4.3;
            it.depth = p < 4.2 ? 0 : p < 4.5 ? (p - 4.2) / 0.3 : p < 5.1 ? 1 : p < 5.5 ? 1 - (p - 5.1) / 0.4 : 0;
            if (it.warn && Math.random() < dt * 8) S.parts.push({ k: "bub", x: it.x + rnd(0, it.len * cell), y: rowY(+k) + rnd(-cell * 0.2, cell * 0.3), vx: 0, vy: -30, g: 0, r: rnd(2, 5), life: 0.6, t: 0, col: "#d7f0b0" });
          } else it.depth = 0;
        }
      }
      // player
      P.sqT += dt;
      if (P.hopT >= 0) {
        P.hopT += dt / 0.14;
        if (P.hopT >= 1) land();
      } else if (P.dead > 0) {
        P.dead -= dt;
        if (P.dead <= 0) {
          P.dead = 0;
          if (S.lives <= 0) endRound("lives");
          else if (S.state === "play") { respawn(); api.sfx("pop"); }
        }
      } else if (P.win > 0) {
        P.win -= dt;
        if (P.win <= 0) { buildLanes(); respawn(); S.maxRow = 0; }
      } else if (S.state === "play" && isWater(P.row)) {
        const it = itemAt(P.row, P.x);
        if (!it || it.depth > 0.55) splash("water");
        else {
          P.x += lanes[P.row].dir * lanes[P.row].speed * cell * dt;
          if (it.coin >= 0 && Math.abs(it.x + it.coin * cell - P.x) < cell * 0.7) {
            it.coin = -1; S.coins++; S.score += 20;
            api.sfx("coin");
            floatT(P.x, rowY(P.row) - cell * 0.7, "+🪙", "#ffd84d", 24);
            stars(P.x, rowY(P.row) - cell * 0.3, 8);
            bump(scEl.parentNode);
          }
          if (P.x < cell * 0.12 || P.x > W - cell * 0.12) splash("edge");
        }
      }
      // particles
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 1.5; }
        if (p.k === "star") p.rot += dt * 6;
        if (p.k === "ring") p.r += cell * 1.1 * dt;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      // ambient bog bubbles & stink
      if (Math.random() < dt * 5) {
        let r = 1 + ((Math.random() * 7) | 0); if (r === ISLAND) r = 3;
        S.parts.push({ k: "bub", x: rnd(0, W), y: rowY(r) + rnd(-cell * 0.3, cell * 0.3), vx: 0, vy: -12, g: 0, r: rnd(2, 4.5), life: rnd(0.6, 1.2), t: 0, col: "#a8c870" });
      }
      for (const f of S.floats) { f.t += dt; f.y -= 55 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.8 && S.state === "play") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 40);
      S.flash = Math.max(0, S.flash - dt);
      if (S.state === "play") setHud();
    }

    /* ---------- drawing ---------- */
    function drawPad(x, y, s, flower, seed) {
      const g = ctx, r = s * 0.42, a0 = seed % TAU;
      g.fillStyle = "rgba(20,40,10,.25)"; g.beginPath(); g.ellipse(x + 2, y + 4, r, r * 0.8, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(x, y); g.ellipse(x, y, r, r * 0.82, 0, a0 + 0.35, a0 + TAU - 0.35); g.closePath();
      g.fillStyle = "#5cc93a"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      g.strokeStyle = "#3f9a24"; g.lineWidth = 1.8;
      for (let i = 1; i < 6; i++) { const a = a0 + 0.35 + i * (TAU - 0.7) / 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.66); g.stroke(); }
      g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(x - r * 0.4, y - r * 0.35, r * 0.2, r * 0.1, -0.5, 0, TAU); g.fill();
      if (flower) {
        const fx = x + r * 0.35, fy = y + r * 0.2;
        g.fillStyle = "#ff8fc7"; g.strokeStyle = INK; g.lineWidth = 1.8;
        for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(fx + Math.cos(k * TAU / 5) * r * 0.16, fy + Math.sin(k * TAU / 5) * r * 0.13, r * 0.14, r * 0.1, k * TAU / 5, 0, TAU); g.fill(); g.stroke(); }
        g.fillStyle = "#ffd84d"; g.beginPath(); g.arc(fx, fy, r * 0.08, 0, TAU); g.fill();
      }
    }
    function drawLog(it, y) {
      const g = ctx, x = it.x + 3, w = it.len * cell - 6, h = cell * 0.66;
      g.fillStyle = "rgba(20,40,10,.3)"; rr(g, x + 2, y - h / 2 + 5, w, h, h / 2); g.fill();
      rr(g, x, y - h / 2, w, h, h / 2); g.fillStyle = "#a8743f"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      g.save(); rr(g, x, y - h / 2, w, h, h / 2); g.clip();
      g.fillStyle = "#c48d52"; g.fillRect(x, y - h / 2 + 3, w, h * 0.22);
      g.strokeStyle = "#7a4f24"; g.lineWidth = 2.2;
      for (let i = 0; i < it.len * 2; i++) { const bx = x + h * 0.6 + ((i * 37 + it.seed * 7) % (w - h * 1.2)); g.beginPath(); g.moveTo(bx, y - h * 0.15); g.quadraticCurveTo(bx + 10, y + h * 0.02, bx + 22, y - h * 0.08); g.stroke(); }
      g.fillStyle = "#6fd14a"; g.beginPath(); g.ellipse(x + w * 0.35, y - h / 2 + 2, cell * 0.16, cell * 0.06, 0, 0, TAU); g.fill();
      g.restore();
      const ex = it.dirPos ? x + h / 2 : x + w - h * 0.32;
      g.fillStyle = "#e9be86"; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.ellipse(ex, y, h * 0.24, h * 0.42, 0, 0, TAU); g.fill(); g.stroke();
      g.strokeStyle = "#b9874e"; g.lineWidth = 1.6; g.beginPath(); g.ellipse(ex, y, h * 0.12, h * 0.22, 0, 0, TAU); g.stroke();
    }
    function drawSquishy(x, y, s, col, depth, warn, squash, t) {
      const g = ctx, r = s * 0.4;
      let sx = 1, sy = 1;
      if (squash != null) { const k = Math.exp(-squash * 8) * Math.cos(squash * 30) * 0.25; sx += k; sy -= k; }
      if (warn) { const k = Math.sin(t * 30) * 0.08; sx += k; sy -= k; }
      g.save();
      g.beginPath(); g.rect(x - r * 2, y - r * 3, r * 4, r * 3 + r * 0.55); g.clip();
      g.translate(x, y + depth * r * 1.6); g.scale(sx, sy);
      g.globalAlpha = 1 - depth * 0.6;
      g.fillStyle = "rgba(20,40,10,.25)"; g.beginPath(); g.ellipse(2, r * 0.55, r, r * 0.3, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(-r, r * 0.45); g.bezierCurveTo(-r * 1.15, -r * 0.6, -r * 0.5, -r, 0, -r); g.bezierCurveTo(r * 0.5, -r, r * 1.15, -r * 0.6, r, r * 0.45); g.quadraticCurveTo(0, r * 0.8, -r, r * 0.45); g.closePath();
      const grd = g.createRadialGradient(-r * 0.3, -r * 0.5, r * 0.1, 0, 0, r * 1.2);
      grd.addColorStop(0, "#fff"); grd.addColorStop(0.4, col[0]); grd.addColorStop(1, col[1]);
      g.fillStyle = grd; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      // face
      g.fillStyle = INK;
      const ey = -r * 0.1;
      if (warn || depth > 0) {
        g.strokeStyle = INK; g.lineWidth = 2;
        [-1, 1].forEach((s2) => { g.beginPath(); g.moveTo(s2 * r * 0.42, ey - r * 0.08); g.lineTo(s2 * r * 0.26, ey); g.lineTo(s2 * r * 0.42, ey + r * 0.08); g.stroke(); });
        g.beginPath(); g.ellipse(0, r * 0.18, r * 0.08, r * 0.1, 0, 0, TAU); g.fill();
      } else {
        g.beginPath(); g.ellipse(-r * 0.32, ey, r * 0.09, r * 0.12, 0, 0, TAU); g.ellipse(r * 0.32, ey, r * 0.09, r * 0.12, 0, 0, TAU); g.fill();
        g.fillStyle = "#fff"; g.beginPath(); g.arc(-r * 0.35, ey - r * 0.05, r * 0.035, 0, TAU); g.arc(r * 0.29, ey - r * 0.05, r * 0.035, 0, TAU); g.fill();
        g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(-r * 0.12, r * 0.12); g.quadraticCurveTo(-r * 0.06, r * 0.22, 0, r * 0.12); g.quadraticCurveTo(r * 0.06, r * 0.22, r * 0.12, r * 0.12); g.stroke();
      }
      g.fillStyle = "rgba(255,90,140,.4)"; g.beginPath(); g.ellipse(-r * 0.58, r * 0.1, r * 0.13, r * 0.07, 0, 0, TAU); g.ellipse(r * 0.58, r * 0.1, r * 0.13, r * 0.07, 0, 0, TAU); g.fill();
      g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(-r * 0.45, -r * 0.55, r * 0.18, r * 0.09, -0.6, 0, TAU); g.fill();
      g.restore();
      if (depth > 0.05) { g.strokeStyle = "rgba(200,232,154,.8)"; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y + r * 0.5, r * (1 + depth * 0.2), r * 0.25, 0, 0, TAU); g.stroke(); }
      if (warn) txt(g, "!", x, y - r * 1.35, Math.round(r * 0.8), "#ffd84d", 4);
    }
    function drawCoin(x, y, t) {
      const g = ctx, r = cell * 0.2, sx = Math.abs(Math.cos(t * 3));
      const yy = y - cell * 0.18 + Math.sin(t * 4) * 3;
      g.save(); g.translate(x, yy); g.scale(Math.max(0.2, sx), 1);
      g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.stroke();
      g.strokeStyle = "#e0a800"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * 0.6, 0, TAU); g.stroke();
      g.restore();
      if (Math.random() < 0.05) S.parts.push({ k: "star", x: x + rnd(-r, r), y: yy + rnd(-r, r), vx: 0, vy: -20, g: 0, r: rnd(2, 4), col: "#fff", life: 0.4, t: 0, rot: 0 });
    }
    function drawLanes(t) {
      for (const k in lanes) {
        const ln = lanes[k], y = rowY(+k);
        for (const it of ln.items) {
          if (it.x > W + cell || it.x + it.len * cell < -cell) continue;
          if (ln.kind === "log") { it.dirPos = ln.dir < 0; drawLog(it, y); }
          else for (let i = 0; i < it.len; i++) {
            const cx = it.x + (i + 0.5) * cell;
            const bob = Math.sin(t * 2 + it.seed + i) * 1.5;
            if (ln.kind === "pad") drawPad(cx, y + bob, cell, it.flower && i === 0, it.seed + i * 2);
            else drawSquishy(cx, y + bob, cell, it.col, it.depth, it.warn, it.squish, t);
          }
          if (it.coin >= 0 && it.depth < 0.3) drawCoin(it.x + it.coin * cell, y, t + it.seed);
        }
      }
    }
    function drawGuinea(t) {
      const g = ctx, gw = cell * 1.08, gh = gw * 0.85;
      let x = P.x, y = rowY(P.row) + cell * 0.32, lift = 0, sx = 1, sy = 1;
      if (P.hopT >= 0) {
        const p = clamp(P.hopT, 0, 1);
        x = lerp(P.fx, P.tx, p); y = lerp(rowY(P.frow), rowY(P.trow), p) + cell * 0.32;
        lift = Math.sin(p * Math.PI) * cell * 0.45; sx = 0.88; sy = 1.14;
      } else {
        const w = Math.exp(-P.sqT * 9) * Math.cos(P.sqT * 28) * 0.22; sx = 1 + w; sy = 1 - w;
      }
      let sink = 0;
      if (P.dead > 0) { const p = 1 - P.dead / 1.05; sink = clamp(p * 1.4, 0, 1); }
      // shadow
      if (!sink) { g.fillStyle = "rgba(20,30,10,.3)"; g.beginPath(); g.ellipse(x, y, gw * 0.34 * (1 - lift / cell * 0.5), gh * 0.08, 0, 0, TAU); g.fill(); }
      g.save();
      if (sink) { g.beginPath(); g.rect(x - gw, y - gh * 2, gw * 2, gh * 2); g.clip(); }
      g.translate(x, y - lift + sink * gh * 0.9);
      if (P.dead > 0) g.rotate(Math.sin(t * 25) * 0.15);
      g.scale(sx, sy);
      const flip = P.face < 0;
      const img = P.dead > 0 ? gImg.sad : (P.hopT >= 0 || P.win > 0) ? (flip ? gImg.wowF : gImg.wow) : (flip ? gImg.happyF : gImg.happy);
      if (img.complete && img.naturalWidth) g.drawImage(img, -gw / 2, -gh, gw, gh);
      g.restore();
      if (sink) { g.strokeStyle = "rgba(200,232,154,.9)"; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y - 2, gw * 0.45, gh * 0.1, 0, 0, TAU); g.stroke(); }
      if (P.win > 0) { // happy hearts over her head
        for (let i = 0; i < 2; i++) { const a = t * 3 + i * 3; txt(g, "♥", x + Math.cos(a) * gw * 0.4, y - gh - 8 + Math.sin(a * 2) * 4, 18, "#ff8fc7", 3); }
      }
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
      const out = S.state === "play" && t > 1.5 ? 1 - (t - 1.5) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, rowY(ISLAND) - cell * 0.2); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(46, W * 0.9 / (b.text.length * 0.7 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 17, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx, t = performance.now() / 1000;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      if (bg) g.drawImage(bg, 0, 0, W, H);
      g.save();
      const sh = S.shake;
      if (sh > 0) g.translate(rnd(-sh, sh) * 0.6, rnd(-sh, sh) * 0.6);
      // stink wiggles over water
      g.strokeStyle = "rgba(190,225,120,.35)"; g.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) {
        const bx = ((i * 97 + t * 14) % (W + 40)) - 20, r = [1, 2, 3, 5, 6, 7][i], by = rowY(r) - cell * 0.1;
        g.beginPath(); for (let k = 0; k < 5; k++) { const yy = by - k * 5 - ((t * 10 + i * 3) % 8), xx = bx + Math.sin(k + t * 3 + i) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
      }
      drawLanes(t);
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        if (p.k === "bub") { g.globalAlpha = a; g.strokeStyle = p.col; g.lineWidth = 1.6; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.stroke(); }
        else if (p.k === "ring") { g.globalAlpha = a * 0.9; g.strokeStyle = p.col; g.lineWidth = 3; g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * 0.35, 0, 0, TAU); g.stroke(); }
      }
      g.globalAlpha = 1;
      drawGuinea(t);
      for (const p of S.parts) {
        if (p.k === "bub" || p.k === "ring") continue;
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.75 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else if (p.k === "gas") { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
      }
      g.globalAlpha = 1;
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.6) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, f.t - 0.12);
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = "rgba(155,217,106," + S.flash * 1.6 + ")"; g.fillRect(0, 0, W, H); }
      if (S.state === "play" || S.state === "end") {
        // level tag
        txt(g, "LEVEL " + S.level, W / 2, HUDH + 12, 15, "#ffd84d", 4);
      }
      if (S.state === "end" || S.state === "over") { g.fillStyle = "rgba(43,22,64," + Math.min(0.3, (S.endT || 2) * 0.3) + ")"; g.fillRect(0, 0, W, H); }
      drawBanner();
    }

    /* ---------- loop & input ---------- */
    function frame(t) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      let dt = last ? (t - last) / 1000 : 0; last = t;
      if (dt > 0.05) dt = 0.05;
      update(dt); draw();
    }
    let sw = null;
    function onDown(e) {
      e.preventDefault();
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
      sw = { x: e.clientX, y: e.clientY, id: e.pointerId };
    }
    function onUp(e) {
      if (!sw || sw.id !== e.pointerId) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) { hop("u"); return; }
      if (Math.abs(dx) > Math.abs(dy)) hop(dx > 0 ? "r" : "l"); else hop(dy > 0 ? "d" : "u");
    }
    function onCancel() { sw = null; }
    const btnHandlers = ctrlBtns.map((b) => {
      const h = (e) => { e.preventDefault(); hop(b.dataset.d); };
      b.addEventListener("pointerdown", h);
      return [b, h];
    });
    function onKey(e) {
      const m = { ArrowUp: "u", w: "u", " ": "u", ArrowDown: "d", s: "d", ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r" }[e.key];
      if (!m || S.state !== "play") return;
      e.preventDefault(); if (!e.repeat) hop(m);
    }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    // test hook (harmless in production)
    wrap._bog = { S, P, lanes: () => lanes, cell: () => cell, rowY, W: () => W, hop, itemAt };

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t)); timers.clear();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointerup", onUp);
        cv.removeEventListener("pointercancel", onCancel);
        btnHandlers.forEach(([b, h]) => b.removeEventListener("pointerdown", h));
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Bog Hop", icon: "🐸", place: "swamp", kind: "skill",
    blurb: "Hop across the stinky bog on lily pads and logs!",
    mount,
  });
})();
