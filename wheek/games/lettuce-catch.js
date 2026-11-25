/* Wheek World mini-game: Lettuce Catch.
   Slide the guinea along the bottom to catch falling veggies; dodge poops and stinky socks. */
(function () {
  "use strict";
  const ID = "lettuce-catch", C = "g-lettuce";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 75;
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
  function sprite(w, h, fn) {
    const S = 3, c = document.createElement("canvas");
    c.width = Math.ceil(w * S); c.height = Math.ceil(h * S);
    const g = c.getContext("2d");
    g.scale(S, S); g.lineJoin = "round"; g.lineCap = "round";
    fn(g);
    return { c, w, h };
  }
  function blit(g, s, x, y, size, rot, sx, sy) {
    g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sx || 1, sy || 1);
    const k = size / s.w;
    g.drawImage(s.c, -s.w * k / 2, -s.h * k / 2, s.w * k, s.h * k);
    g.restore();
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
  // Draw several shapes as one outlined blob: thick ink strokes first, then fills on top.
  function blob(g, shapes, fill, lw) {
    g.strokeStyle = INK; g.lineWidth = (lw || 5) * 2;
    shapes.forEach((s) => { s(); g.stroke(); });
    g.fillStyle = fill;
    shapes.forEach((s) => { s(); g.fill(); });
  }
  const ell = (g, x, y, rx, ry, r) => () => { g.beginPath(); g.ellipse(x, y, rx, ry, r || 0, 0, TAU); };
  function scallop(g, cx, cy, r, n, b) {
    g.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU - Math.PI / 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (i === 0) g.moveTo(x, y);
      else {
        const m = ((i - 0.5) / n) * TAU - Math.PI / 2;
        g.quadraticCurveTo(cx + Math.cos(m) * (r + b * 2), cy + Math.sin(m) * (r + b * 2), x, y);
      }
    }
    g.closePath();
  }

  /* ---------- item art (100x100 boxes) ---------- */
  function drawLettuce(g, gold) {
    const base = gold ? "#ffd84d" : "#7be04a", light = gold ? "#fff3b0" : "#c8f7a0", dark = gold ? "#d99a00" : "#3a9e1c";
    g.lineWidth = 5; g.strokeStyle = INK;
    scallop(g, 50, 52, 38, 9, 4); g.fillStyle = base; g.fill(); g.stroke();
    scallop(g, 50, 56, 24, 7, 3); g.fillStyle = light; g.fill(); g.lineWidth = 3; g.strokeStyle = dark; g.stroke();
    g.beginPath(); g.moveTo(50, 84); g.lineTo(50, 40); g.moveTo(50, 66); g.lineTo(36, 52); g.moveTo(50, 62); g.lineTo(64, 48);
    g.moveTo(50, 76); g.lineTo(30, 66); g.moveTo(50, 74); g.lineTo(70, 64); g.stroke();
    g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.ellipse(34, 30, 7, 4, -0.6, 0, TAU); g.fill();
  }
  function drawCarrot(g) {
    g.save(); g.translate(50, 50); g.rotate(0.5); g.translate(-50, -50);
    const leaf = [ell(g, 42, 18, 6, 15, -0.4), ell(g, 50, 14, 6, 16, 0), ell(g, 58, 18, 6, 15, 0.4)];
    blob(g, leaf, "#59c22f", 4);
    const body = () => { g.beginPath(); g.moveTo(32, 30); g.quadraticCurveTo(50, 22, 68, 30); g.quadraticCurveTo(60, 70, 50, 94); g.quadraticCurveTo(40, 70, 32, 30); g.closePath(); };
    blob(g, [body], "#ff9f43", 5);
    g.strokeStyle = "#d9661a"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(38, 44); g.lineTo(48, 44); g.moveTo(52, 58); g.lineTo(60, 58); g.moveTo(42, 70); g.lineTo(50, 70); g.stroke();
    g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(40, 36, 4, 3, 0, 0, TAU); g.fill();
    g.restore();
  }
  function drawCucumber(g) {
    g.save(); g.translate(50, 50); g.rotate(-0.6);
    const b = () => { rr(g, -15, -42, 30, 84, 15); };
    blob(g, [b], "#3fae3a", 5);
    g.fillStyle = "#7fd66a"; rr(g, -6, -34, 9, 62, 5); g.fill();
    g.fillStyle = "#1f6e1c";
    [[-8, -20], [8, -6], [-7, 10], [7, 24], [6, -28], [-9, 30]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill(); });
    g.restore();
  }
  function drawStrawberry(g) {
    const body = () => { g.beginPath(); g.moveTo(50, 93); g.bezierCurveTo(14, 72, 12, 30, 36, 28); g.quadraticCurveTo(50, 24, 64, 28); g.bezierCurveTo(88, 30, 86, 72, 50, 93); g.closePath(); };
    blob(g, [body], "#ff4d6d", 5);
    g.fillStyle = "#ffe066";
    [[34, 44], [50, 40], [66, 44], [40, 58], [58, 58], [48, 72], [30, 56], [70, 56], [50, 84]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 2.4, 3.6, 0, 0, TAU); g.fill(); });
    const leaves = [];
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.55; leaves.push(ell(g, 50 + Math.cos(a) * 10, 28 + Math.sin(a) * 4 + 2, 11, 5, a)); }
    blob(g, leaves, "#59c22f", 3.5);
    g.fillStyle = "rgba(255,255,255,.65)"; g.beginPath(); g.ellipse(32, 42, 4, 7, 0.3, 0, TAU); g.fill();
  }
  function drawPepper(g) {
    const lobes = [ell(g, 34, 58, 18, 30, 0.15), ell(g, 66, 58, 18, 30, -0.15), ell(g, 50, 60, 18, 33, 0)];
    blob(g, lobes, "#ff4a3d", 5);
    g.strokeStyle = "#c22a20"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(42, 36); g.quadraticCurveTo(38, 62, 44, 86); g.moveTo(58, 36); g.quadraticCurveTo(62, 62, 56, 86); g.stroke();
    const stem = () => { g.beginPath(); g.moveTo(44, 32); g.quadraticCurveTo(50, 24, 56, 32); g.lineTo(56, 22); g.quadraticCurveTo(58, 12, 66, 10); g.lineTo(64, 16); g.quadraticCurveTo(60, 18, 58, 26); g.closePath(); };
    blob(g, [stem, ell(g, 50, 32, 13, 6)], "#3fae3a", 3.5);
    g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(28, 50, 4, 9, 0.2, 0, TAU); g.fill();
  }
  function drawPoop(g) {
    const parts = [ell(g, 50, 78, 38, 15), ell(g, 50, 60, 29, 13), ell(g, 50, 43, 20, 11), () => { g.beginPath(); g.moveTo(40, 38); g.quadraticCurveTo(52, 14, 62, 22); g.quadraticCurveTo(56, 30, 60, 38); g.closePath(); }];
    blob(g, parts, "#9a6232", 5);
    g.strokeStyle = "#6e4020"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(26, 70); g.quadraticCurveTo(50, 80, 74, 70); g.moveTo(32, 54); g.quadraticCurveTo(50, 62, 68, 54); g.stroke();
    // googly eyes and grin
    g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 3;
    [[40, 58], [60, 58]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 8, 0, TAU); g.fill(); g.stroke(); });
    g.fillStyle = INK; g.beginPath(); g.arc(42, 60, 3.6, 0, TAU); g.arc(58, 56, 3.6, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(40, 76); g.quadraticCurveTo(50, 86, 60, 76); g.lineWidth = 3.5; g.stroke();
    g.fillStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.ellipse(30, 74, 5, 3, -0.3, 0, TAU); g.fill();
  }
  function drawSock(g) {
    g.save(); g.translate(50, 50); g.rotate(0.25); g.translate(-50, -50);
    const leg = () => { rr(g, 34, 10, 30, 56, 8); };
    const foot = ell(g, 46, 72, 28, 16, 0.05);
    blob(g, [leg, foot], "#f6efe0", 5);
    g.fillStyle = "#ff8fc7"; g.fillRect(34, 18, 30, 7); g.fillStyle = "#5fd3ff"; g.fillRect(34, 30, 30, 7);
    g.fillStyle = "#c9b48a"; g.beginPath(); g.ellipse(22, 74, 6, 9, 0.2, 0, TAU); g.fill();
    g.fillStyle = "#d8c7a4"; g.beginPath(); g.ellipse(52, 80, 8, 5, 0, 0, TAU); g.fill();
    g.fillStyle = INK; g.beginPath(); g.ellipse(64, 74, 4, 3, 0, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 5; leg(); g.stroke(); // re-ink cuff edge
    g.restore();
  }
  function drawBox(g) {
    g.save(); g.translate(50, 54); g.rotate(-0.1);
    const box = () => { rr(g, -34, -28, 68, 62, 10); };
    blob(g, [box], "#c7b3ff", 5);
    g.fillStyle = "#9f86f0"; rr(g, -34, -28, 68, 16, 8); g.fill();
    g.fillStyle = "#ff8fc7"; g.fillRect(-7, -28, 14, 62);
    g.strokeStyle = INK; g.lineWidth = 5; box(); g.stroke();
    blob(g, [ell(g, -13, -34, 13, 8, -0.4), ell(g, 13, -34, 13, 8, 0.4)], "#ff8fc7", 4);
    txt(g, "?", 0, 8, 40, "#ffd84d", 6);
    g.restore();
  }

  const KINDS = {
    lettuce: { pts: 10, good: true, draw: (g) => drawLettuce(g, false), col: ["#7be04a", "#c8f7a0"], w: 30 },
    carrot: { pts: 15, good: true, draw: drawCarrot, col: ["#ff9f43", "#59c22f"], w: 22 },
    cucumber: { pts: 15, good: true, draw: drawCucumber, col: ["#3fae3a", "#7fd66a"], w: 22 },
    strawberry: { pts: 20, good: true, draw: drawStrawberry, col: ["#ff4d6d", "#ffe066"], w: 16 },
    pepper: { pts: 25, good: true, draw: drawPepper, col: ["#ff4a3d", "#3fae3a"], w: 10 },
    poop: { bad: true, draw: drawPoop, col: ["#9a6232"] },
    sock: { bad: true, draw: drawSock, col: ["#f6efe0"] },
    golden: { pts: 50, gold: true, draw: (g) => drawLettuce(g, true), col: ["#ffd84d", "#fff3b0"] },
    box: { box: true, draw: drawBox, col: ["#c7b3ff", "#ff8fc7"] },
  };
  const GOOD = ["lettuce", "carrot", "cucumber", "strawberry", "pepper"];
  const NOMS = ["NOM!", "YUM!", "CRUNCH!", "WHEEK!", "MUNCH!", "TASTY!"];
  const EWS = ["EWW!", "STINKY!", "BLEH!", "GROSS!", "PEE-YEW!"];
  const POWERS = {
    magnet: { icon: "🧲", name: "VEGGIE MAGNET!", dur: 7, col: "#ff5a5f" },
    shield: { icon: "🫧", name: "BUBBLE SHIELD!", dur: 0, col: "#5fd3ff" },
    slow: { icon: "🐌", name: "SLOW-MO!", dur: 6, col: "#c7b3ff" },
    prank: { icon: "💨", name: "PRANKED!", dur: 3.5, col: "#7be04a" },
  };

  const HEART = '<svg viewBox="0 0 24 22" width="26" height="24"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:21px;display:flex;align-items:center;gap:5px;min-height:42px;white-space:nowrap}
.${C} .pill small{font-size:15px}
.${C} .pill.sc{min-width:92px}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb .5s infinite}
.${C} .pill.lv{gap:1px;padding:2px 8px}
.${C} .pill.lv svg{transition:transform .3s, filter .3s, opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:58px;left:12px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;animation:${C}-throb 1s infinite;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(43,22,64,.28);z-index:5}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:18px 18px 20px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:118px;display:flex;align-items:flex-end;justify-content:center;margin-top:-6px}
.${C} .panel .art svg{animation:${C}-bob 1.4s ease-in-out infinite}
.${C} .panel .art .fl{position:absolute;font-size:30px;animation:${C}-fall 1.6s ease-in infinite}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--yellow)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.35;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#f3edff;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}
@keyframes ${C}-fall{0%{transform:translateY(-40px) rotate(0);opacity:0}20%{opacity:1}100%{transform:translateY(70px) rotate(200deg);opacity:0}}
@keyframes ${C}-throb{0%,100%{transform:scale(1) rotate(-8deg)}50%{transform:scale(1.12) rotate(-8deg)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill tm">⏱<b>${ROUND}</b></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 240, mood: "happy" })), wow: svgImg(api.guineaSVG({ size: 240, mood: "wow" })), sad: svgImg(api.guineaSVG({ size: 240, mood: "sad" })) };
    const SPR = {};
    Object.keys(KINDS).forEach((k) => { SPR[k] = sprite(100, 100, KINDS[k].draw); });

    let W = 1, H = 1, dpr = 1, groundY = 1, gw = 100, gh = 85, ir = 30;
    let bg = null;
    const clouds = [];
    for (let i = 0; i < 4; i++) clouds.push({ x: i * 130 + rnd(0, 60), y: (i % 2) * 0.35 + rnd(0, 0.2), s: rnd(0.55, 0.9), v: rnd(6, 16) });

    const S = {};
    const P = { x: 200, tx: 200, vx: 0, sqT: 9, hurtT: 9, nomT: 9, blink: 0 };
    let keyDir = 0;

    function reset() {
      Object.assign(S, { state: "intro", t: 0, timeLeft: ROUND, score: 0, lives: 3, combo: 0, bestCombo: 0, items: [], parts: [], floats: [],
        spawnT: 0.6, shake: 0, gold: 0, magnet: 0, slow: 0, shield: false, prank: 0, inv: 0, endT: 0, caught: 0, banner: null, flash: 0,
        boxCD: 8, goldCD: 12, prankBlobs: [], hitBy: "", awarded: false, lastSec: ROUND });
      P.x = P.tx = W / 2; P.vx = 0;
    }

    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      groundY = H - Math.max(64, H * 0.1);
      gw = clamp(W * 0.3, 96, 150); gh = gw * 0.85;
      ir = clamp(W * 0.075, 24, 38);
      P.x = clamp(P.x, gw / 2, W - gw / 2); P.tx = clamp(P.tx, gw / 2, W - gw / 2);
      buildBg();
    }

    function buildBg() {
      bg = document.createElement("canvas"); bg.width = cv.width; bg.height = cv.height;
      const g = bg.getContext("2d"); g.scale(dpr, dpr); g.lineJoin = "round";
      const sky = g.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, "#7fd8ff"); sky.addColorStop(0.7, "#c9f0ff"); sky.addColorStop(1, "#f2fbff");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      // sun
      const sx = W * 0.82, sy = H * 0.16, sr = Math.min(W, H) * 0.08;
      g.fillStyle = "rgba(255,216,77,.35)"; g.beginPath(); g.arc(sx, sy, sr * 1.7, 0, TAU); g.fill();
      g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(sx, sy, sr, 0, TAU); g.fill(); g.stroke();
      // hills
      const hill = (yb, amp, col, ph) => {
        g.beginPath(); g.moveTo(0, H);
        for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, yb - Math.sin(x / W * 5 + ph) * amp - Math.sin(x / W * 11 + ph * 2) * amp * 0.3);
        g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      };
      hill(groundY - H * 0.16, H * 0.03, "#b9ecb0", 1);
      hill(groundY - H * 0.07, H * 0.025, "#95dd7f", 3);
      // fence
      const fy = groundY - 46;
      g.fillStyle = "#fffdf8"; g.strokeStyle = INK; g.lineWidth = 3;
      rr(g, -10, fy + 12, W + 20, 9, 4); g.fill(); g.stroke();
      rr(g, -10, fy + 30, W + 20, 9, 4); g.fill(); g.stroke();
      for (let x = 8; x < W; x += 34) {
        g.beginPath(); g.moveTo(x, groundY); g.lineTo(x, fy + 6); g.lineTo(x + 8, fy - 2); g.lineTo(x + 16, fy + 6); g.lineTo(x + 16, groundY); g.closePath(); g.fill(); g.stroke();
      }
      // ground
      g.fillStyle = "#a8743f"; g.fillRect(0, groundY, W, H - groundY);
      g.fillStyle = "#93622f";
      for (let i = 0; i < W / 14; i++) { g.beginPath(); g.ellipse(rnd(0, W), rnd(groundY + 22, H), rnd(3, 7), rnd(2, 4), 0, 0, TAU); g.fill(); }
      g.beginPath(); g.moveTo(0, groundY + 14);
      for (let x = 0; x <= W; x += 18) g.quadraticCurveTo(x + 9, groundY + 24, x + 18, groundY + 14);
      g.lineTo(W, groundY - 4); g.lineTo(0, groundY - 4); g.closePath();
      g.fillStyle = "#6fd14a"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      g.beginPath(); g.moveTo(0, groundY - 2); g.lineTo(W, groundY - 2); g.stroke();
      // flowers
      for (let x = 20; x < W; x += rnd(50, 90)) {
        const y = groundY + rnd(30, H - groundY - 12), c = pick(["#ff8fc7", "#ffd84d", "#fff", "#c7b3ff"]);
        g.fillStyle = c; g.strokeStyle = INK; g.lineWidth = 2;
        for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * TAU / 5) * 4.5, y + Math.sin(k * TAU / 5) * 4.5, 3.6, 0, TAU); g.fill(); g.stroke(); }
        g.fillStyle = "#ff9f43"; g.beginPath(); g.arc(x, y, 3, 0, TAU); g.fill();
      }
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
      const svg = api.guineaSVG({ size: 120, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="fl" style="left:18%;animation-delay:-.3s">🥬</span><span class="fl" style="left:72%;animation-delay:-1s">🥕</span><span class="fl" style="left:84%;top:10px;animation-delay:-.6s">💩</span>${svg}</div>
        <h2>${after ? "Again?!" : "Lettuce Catch"}</h2>${lastLine}
        <p>Slide your finger to move <b>${gName}</b>. Catch the veggies, dodge <b>poops</b> and <b>stinky socks</b>!</p>
        <div class="chips"><span class="chip">✨ Golden lettuce = x3</span><span class="chip">🎁 Mystery boxes</span></div>
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
      banner("GO!", "catch the veggies!", "#7be04a");
      api.sfx("whoosh");
    }

    /* ---------- fx ---------- */
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { x = clamp(x, text.length * (size || 26) * 0.32 + 8, W - text.length * (size || 26) * 0.32 - 8); S.floats.push({ x, y, text, col, size: size || 26, t: 0, life: 0.9 }); }
    function burst(x, y, cols, n, spd) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 260);
        S.parts.push({ k: "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, g: 700, r: rnd(3, 7), col: pick(cols), life: rnd(0.4, 0.8), t: 0 });
      }
    }
    function gas(x, y, n, big) {
      for (let i = 0; i < n; i++) {
        S.parts.push({ k: "gas", x: x + rnd(-14, 14), y: y + rnd(-10, 10), vx: rnd(-60, 60), vy: rnd(-70, -10), g: -20, r: rnd(10, 20) * (big ? 1.6 : 1), grow: rnd(18, 34), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.8, 1.4), t: 0 });
      }
    }
    function stars(x, y, n) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(80, 240);
        S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120, r: rnd(5, 10), col: pick(["#ffd84d", "#fff", "#ffe98a"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) });
      }
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- gameplay ---------- */
    function spawn() {
      const d = clamp(S.t / 65, 0, 1);
      let type;
      const r = Math.random();
      if (S.goldCD <= 0 && r < 0.05) { type = "golden"; S.goldCD = rnd(10, 16); }
      else if (S.boxCD <= 0 && r < 0.12 && !S.items.some((i) => i.type === "box")) { type = "box"; S.boxCD = rnd(7, 12); }
      else if (Math.random() < lerp(0.16, 0.3, d)) type = Math.random() < 0.6 ? "poop" : "sock";
      else {
        let tot = 0; GOOD.forEach((k) => (tot += KINDS[k].w));
        let q = Math.random() * tot; type = GOOD[0];
        for (const k of GOOD) { q -= KINDS[k].w; if (q <= 0) { type = k; break; } }
      }
      const speed = lerp(150, 360, d) * (H / 720) * rnd(0.85, 1.2) * (type === "golden" ? 1.25 : 1);
      S.items.push({ type, x: rnd(ir + 6, W - ir - 6), y: -ir * 1.4, vy: speed, rot: rnd(-0.4, 0.4), vr: rnd(-1.6, 1.6), sway: rnd(10, 40), ph: rnd(0, TAU), age: 0, fly: 0 });
      S.spawnT = lerp(0.85, 0.36, d) * rnd(0.75, 1.25);
    }

    function catchItem(it) {
      const K = KINDS[it.type];
      const hx = it.x, hy = it.y;
      if (K.bad) {
        if (S.inv > 0) return false;
        if (S.shield) {
          S.shield = false; api.sfx("pop"); burst(P.x, groundY - gh * 0.5, ["#5fd3ff", "#fff"], 16, 300);
          floatT(hx, hy - 20, "BLOCKED!", "#5fd3ff", 28); S.inv = 0.6; return true;
        }
        S.lives--; S.combo = 0; S.inv = 1.4; P.hurtT = 0; S.flash = 0.25; S.hitBy = it.type;
        api.sfx("fart"); api.haptic(90); shake(16);
        gas(P.x - gw * 0.3, groundY - gh * 0.3, 14, true);
        const [vx, vy] = vp(P.x, groundY - gh * 0.5); api.gas(vx, vy);
        floatT(hx, hy - 24, pick(EWS), "#b6f27a", 34);
        bump(hearts[Math.max(0, S.lives)]);
        if (S.lives <= 0) endRound("lives");
        return true;
      }
      if (K.box) {
        const keys = ["magnet", "shield", "slow", "prank"];
        const p = pick(keys), D = POWERS[p];
        api.sfx(p === "prank" ? "fart" : "sparkle");
        stars(hx, hy, 18); burst(hx, hy, K.col, 12);
        if (p === "shield") S.shield = true;
        else if (p === "prank") {
          S.prank = D.dur; S.prankBlobs = [];
          for (let i = 0; i < 9; i++) S.prankBlobs.push({ x: rnd(-0.1, 1.1), y: rnd(0.25, 0.65), r: rnd(0.16, 0.28), ph: rnd(0, TAU) });
          const [vx, vy] = vp(W / 2, H * 0.45); api.gas(vx, vy); api.gas(vx - 80, vy + 30); api.gas(vx + 80, vy - 20);
          gas(W / 2, H * 0.45, 20, true);
        } else S[p] = D.dur;
        banner(D.icon + " " + D.name, p === "prank" ? "a mystery fart cloud!" : p === "shield" ? "blocks one stinky" : p === "magnet" ? "veggies come to you!" : "everything goes slooow", D.col);
        P.sqT = 0; return true;
      }
      // veggie / golden
      S.combo++; S.bestCombo = Math.max(S.bestCombo, S.combo); S.caught++;
      const cm = 1 + Math.min(3, Math.floor(S.combo / 10)) * 0.5;
      let pts = Math.round(K.pts * cm * (S.gold > 0 ? 3 : 1));
      if (K.gold) {
        S.gold = 5; api.sfx("bigwin"); api.haptic(40);
        const [vx, vy] = vp(hx, hy); api.confetti(vx, vy, 40);
        stars(hx, hy, 30); banner("✨ GOLDEN! ✨", "x3 points for 5 seconds!", "#ffd84d"); shake(6);
      } else {
        api.sfx(S.combo % 2 ? "nom" : "pop");
      }
      S.score += pts; P.sqT = 0; P.nomT = 0;
      burst(hx, hy, K.col, 10, 220);
      floatT(hx, hy - 30, "+" + pts, S.gold > 0 ? "#ffd84d" : "#fff", S.gold > 0 ? 32 : 26);
      if (Math.random() < 0.28) floatT(P.x + rnd(-30, 30), groundY - gh - 30, pick(NOMS), pick(["#ff8fc7", "#ffd84d", "#7be04a", "#5fd3ff"]), 24);
      if (S.combo > 0 && S.combo % 10 === 0) { banner("COMBO " + S.combo + "!", "points x" + (1 + Math.min(3, S.combo / 10) * 0.5), "#ff8fc7"); api.sfx("sparkle"); stars(P.x, groundY - gh, 16); }
      bump(scEl.parentNode);
      return true;
    }

    function endRound(why) {
      if (S.state !== "play") return;
      S.state = "end"; S.endT = 0; S.why = why;
      if (why === "lives") { banner("OUT OF LIVES!", "too much stink!", "#b6f27a"); api.sfx("lose"); }
      else { banner("TIME'S UP!", "", "#5fd3ff"); api.sfx("fanfare"); }
      setHud();
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const coins = Math.min(300, Math.round(S.score / 10));
      const earned = coins > 0 ? api.award(coins, { reason: "Lettuce Catch" }) : 0;
      const hs = api.highscore(ID, S.score);
      const quip = S.why === "lives"
        ? (S.hitBy === "sock" ? `${gName} ate a stinky sock. Blech!` : `${gName} caught one poop too many. Wash those paws!`)
        : S.score >= 1500 ? `${gName} is SO full. Veggie champion!` : `${gName} munched ${S.caught} veggies!`;
      const text = `${quip} Score ${S.score}${S.bestCombo >= 5 ? `, best combo ${S.bestCombo}` : ""}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: S.why === "lives" ? "Pee-yew!" : hs.isNew ? "New best!" : "Time's up!", text, score: S.score });
      hud.classList.add("off");
      showPanel({ score: S.score, earned });
    }

    function update(dt) {
      clouds.forEach((c) => { c.x += c.v * dt; if (c.x > W + 120) c.x = -140; });
      if (S.state === "play") {
        S.t += dt; S.timeLeft -= dt;
        S.gold = Math.max(0, S.gold - dt); S.magnet = Math.max(0, S.magnet - dt); S.slow = Math.max(0, S.slow - dt);
        S.prank = Math.max(0, S.prank - dt); S.inv = Math.max(0, S.inv - dt); S.boxCD -= dt; S.goldCD -= dt;
        const sec = Math.ceil(S.timeLeft);
        if (sec !== S.lastSec) { S.lastSec = sec; if (sec <= 5 && sec > 0) api.sfx("tick"); }
        S.spawnT -= dt * (S.slow > 0 ? 0.5 : 1);
        if (S.spawnT <= 0) spawn();
        if (S.timeLeft <= 0) { S.timeLeft = 0; endRound("time"); }
      } else if (S.state === "end") {
        S.endT += dt;
        if (S.endT > 1.9) finish();
      }
      // player
      if (keyDir) P.tx = clamp(P.tx + keyDir * W * 1.3 * dt, gw / 2, W - gw / 2);
      const ox = P.x;
      if (S.state === "play" || S.state === "intro" || S.state === "over") P.x += (P.tx - P.x) * Math.min(1, dt * 16);
      P.vx = lerp(P.vx, (P.x - ox) / Math.max(dt, 1e-3), Math.min(1, dt * 10));
      P.sqT += dt; P.hurtT += dt; P.nomT += dt; P.blink -= dt; if (P.blink < -3) P.blink = rnd(0, 0.15);
      // items
      const ts = S.slow > 0 ? 0.45 : 1;
      const headY = groundY - gh * 0.72, mouthY = groundY - gh * 0.2;
      for (const it of S.items) {
        it.age += dt;
        if (it.fly) { it.x += it.fvx * dt; it.y += it.fvy * dt; it.fvy += 900 * dt; it.rot += 8 * dt; it.fly -= dt; if (it.fly <= 0) it.dead = true; continue; }
        if (S.state === "end") { it.vy *= 0.9; }
        it.y += it.vy * dt * ts;
        it.x += Math.cos(it.age * 2.2 + it.ph) * it.sway * dt;
        it.rot += it.vr * dt * ts;
        const K = KINDS[it.type];
        if (S.magnet > 0 && !K.bad && it.y > H * 0.15) it.x += (P.x - it.x) * Math.min(1, dt * 5);
        if (S.magnet > 0 && K.bad && Math.abs(it.x - P.x) < gw) it.x += Math.sign(it.x - P.x || 1) * 160 * dt;
        it.x = clamp(it.x, ir, W - ir);
        if (S.state === "play" && it.y + ir * 0.6 > headY && it.y - ir * 0.5 < mouthY && Math.abs(it.x - P.x) < gw * 0.42 + ir * 0.35) {
          if (catchItem(it)) { it.dead = true; continue; }
        }
        if (it.y - ir > groundY + 8) {
          it.dead = true;
          if (!K.bad && !K.box && S.state === "play") {
            burst(it.x, groundY + 6, K.col, 6, 140);
            if (S.combo >= 5) floatT(it.x, groundY - 20, "combo lost", "#ffb3d4", 18);
            S.combo = 0; api.sfx("splat");
          } else if (K.bad) { burst(it.x, groundY + 6, K.col, 4, 100); }
        }
      }
      S.items = S.items.filter((i) => !i.dead);
      // particles
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 1.5; }
        if (p.k === "star") p.rot += dt * 6;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 60 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.8 && S.state === "play") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 40);
      S.flash = Math.max(0, S.flash - dt);
      if (S.state === "play") setHud();
    }

    /* ---------- drawing ---------- */
    function drawCloud(x, y, s) {
      const g = ctx; g.save(); g.translate(x, y); g.scale(s, s);
      blob(g, [ell(g, 0, 0, 34, 20), ell(g, 30, 6, 26, 16), ell(g, -30, 8, 24, 14), ell(g, 8, -14, 24, 18)], "#fff", 3);
      g.restore();
    }
    function drawGuinea() {
      const g = ctx;
      const st = P.sqT, wob = Math.exp(-st * 7) * Math.cos(st * 26) * 0.22;
      let sx = 1 + wob, sy = 1 - wob;
      const hurt = P.hurtT < 1;
      const tilt = clamp(P.vx / 2500, -0.22, 0.22) + (hurt ? Math.sin(P.hurtT * 40) * 0.08 * (1 - P.hurtT) : 0);
      const run = Math.abs(P.vx) > 40 ? Math.abs(Math.sin(performance.now() / 70)) * 4 : 0;
      const x = P.x, y = groundY + gh * 0.08 - run;
      if (S.inv > 0 && !hurt && Math.floor(S.inv * 12) % 2 === 0) g.globalAlpha = 0.5;
      // golden aura
      if (S.gold > 0) {
        const pr = 1 + Math.sin(performance.now() / 120) * 0.08;
        const grd = g.createRadialGradient(x, y - gh * 0.5, 4, x, y - gh * 0.5, gw * 0.9 * pr);
        grd.addColorStop(0, "rgba(255,230,90,.85)"); grd.addColorStop(1, "rgba(255,230,90,0)");
        g.fillStyle = grd; g.beginPath(); g.arc(x, y - gh * 0.5, gw * 0.9 * pr, 0, TAU); g.fill();
      }
      g.save(); g.translate(x, y); g.rotate(tilt); g.scale(sx, sy);
      const img = hurt ? gImg.sad : (S.gold > 0 || P.nomT < 0.25) ? gImg.wow : gImg.happy;
      if (img.complete && img.naturalWidth) g.drawImage(img, -gw / 2, -gh, gw, gh);
      // chewing cheeks
      if (P.nomT < 0.35) {
        g.fillStyle = "rgba(255,143,199,.7)";
        g.beginPath(); g.ellipse(-gw * 0.24, -gh * 0.38, gw * 0.07, gh * 0.045, 0, 0, TAU); g.ellipse(gw * 0.24, -gh * 0.38, gw * 0.07, gh * 0.045, 0, 0, TAU); g.fill();
      }
      g.restore();
      g.globalAlpha = 1;
      if (hurt) { // stink lines over her head
        g.strokeStyle = "#7fcf4a"; g.lineWidth = 4;
        for (let i = -1; i <= 1; i++) {
          g.beginPath();
          for (let k = 0; k < 6; k++) { const yy = y - gh - 8 - k * 6, xx = x + i * 22 + Math.sin(k + P.hurtT * 12) * 5; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
          g.stroke();
        }
      }
      if (S.shield) {
        const pr = 1 + Math.sin(performance.now() / 200) * 0.04;
        g.save(); g.globalAlpha = 0.28; g.fillStyle = "#bfeeff"; g.strokeStyle = "#5fd3ff"; g.lineWidth = 4;
        g.beginPath(); g.ellipse(x, y - gh * 0.5, gw * 0.62 * pr, gh * 0.68 * pr, 0, 0, TAU); g.fill(); g.globalAlpha = 0.9; g.stroke();
        g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x - gw * 0.3, y - gh * 0.85, 8, 5, -0.6, 0, TAU); g.fill();
        g.restore();
      }
      if (S.magnet > 0) {
        const t = performance.now() / 1000;
        g.strokeStyle = "rgba(255,90,95,.55)"; g.lineWidth = 3;
        for (let i = 0; i < 3; i++) { const r = ((t * 1.5 + i / 3) % 1); g.globalAlpha = 1 - r; g.beginPath(); g.arc(x, y - gh * 0.6, gw * (0.4 + r * 0.9), Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
        g.globalAlpha = 1;
      }
    }
    function drawItem(it) {
      const K = KINDS[it.type], g = ctx, sz = ir * 2.2;
      if (K.gold || K.box) {
        const t = performance.now() / 1000;
        g.save(); g.translate(it.x, it.y); g.rotate(t * 2);
        g.fillStyle = K.gold ? "rgba(255,216,77,.45)" : "rgba(199,179,255,.5)";
        for (let i = 0; i < 8; i++) { g.rotate(TAU / 8); g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, ir * 1.7); g.lineTo(6, ir * 1.7); g.closePath(); g.fill(); }
        g.restore();
      }
      const wob = 1 + Math.sin(it.age * 9 + it.ph) * 0.05;
      blit(g, SPR[it.type], it.x, it.y, sz, it.rot, wob, 2 - wob);
      if (K.bad) {
        g.strokeStyle = "rgba(120,200,70,.8)"; g.lineWidth = 3;
        for (let i = -1; i <= 1; i += 2) {
          g.beginPath();
          for (let k = 0; k < 5; k++) { const yy = it.y - ir - 4 - k * 5, xx = it.x + i * 10 + Math.sin(k * 1.4 + it.age * 10) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
          g.stroke();
        }
        if (it.type === "poop") {
          g.fillStyle = INK;
          for (let k = 0; k < 2; k++) { const a = it.age * 8 + k * 3; g.beginPath(); g.arc(it.x + Math.cos(a) * ir * 1.1, it.y - ir * 0.6 + Math.sin(a * 1.3) * ir * 0.5, 2.5, 0, TAU); g.fill(); }
        }
      }
      if (K.gold && Math.random() < 0.3) S.parts.push({ k: "star", x: it.x + rnd(-ir, ir), y: it.y + rnd(-ir, ir), vx: 0, vy: 30, g: 0, r: rnd(3, 6), col: "#fff", life: 0.4, t: 0, rot: 0 });
    }
    function drawStar(g, x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      for (let i = 0; i < 8; i++) { const rr2 = i % 2 ? r * 0.4 : r, a = (i / 8) * TAU; g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
      g.closePath(); g.fill(); g.restore();
    }
    function drawPowers() {
      const g = ctx; let y = 66; const x = W - 12;
      const list = [];
      if (S.gold > 0) list.push(["✨", "x3", S.gold / 5, "#ffd84d"]);
      if (S.magnet > 0) list.push(["🧲", "", S.magnet / POWERS.magnet.dur, "#ff8a8d"]);
      if (S.slow > 0) list.push(["🐌", "", S.slow / POWERS.slow.dur, "#c7b3ff"]);
      if (S.shield) list.push(["🫧", "", 1, "#5fd3ff"]);
      for (const [ic, lab, f, col] of list) {
        const w = 74;
        g.fillStyle = "#fffdf8"; g.strokeStyle = INK; g.lineWidth = 3; rr(g, x - w, y, w, 32, 16); g.fill(); g.stroke();
        g.fillStyle = col; rr(g, x - w + 30, y + 11, Math.max(4, (w - 38) * f), 10, 5); g.fill();
        g.font = "18px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = INK; g.fillText(ic, x - w + 16, y + 17);
        if (lab) txt(g, lab, x - w + 50, y + 16, 14, "#fff", 3);
        y += 38;
      }
      if (S.combo >= 3 && S.state === "play") {
        const cm = 1 + Math.min(3, Math.floor(S.combo / 10)) * 0.5;
        const pulse = 1 + Math.exp(-P.sqT * 8) * 0.25;
        g.save(); g.translate(16 + 50, 82); g.scale(pulse, pulse); g.rotate(-0.06);
        txt(g, "🔥" + S.combo, 0, 0, 24, "#ff9f43", 5);
        if (cm > 1) txt(g, "x" + cm + " pts", 0, 24, 15, "#ffd84d", 4);
        g.restore();
      }
    }
    function drawPrank() {
      if (S.prank <= 0) return;
      const g = ctx, a = Math.min(1, S.prank / 0.6, (POWERS.prank.dur - S.prank) / 0.3), t = performance.now() / 1000;
      g.save(); g.globalAlpha = 0.88 * a;
      for (const b of S.prankBlobs) {
        const x = b.x * W + Math.sin(t * 0.9 + b.ph) * 30, y = b.y * H + Math.cos(t * 1.1 + b.ph) * 20, r = b.r * W * (1 + Math.sin(t * 2 + b.ph) * 0.06);
        g.fillStyle = "#9bd96a"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        g.fillStyle = "#b9ec8a"; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.25, r * 0.6, 0, TAU); g.fill();
      }
      g.globalAlpha = a;
      if (!S.banner) txt(g, "💨 PRANKED! 💨", W / 2, H * 0.45, 30, "#e4fbd5", 6);
      g.restore();
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state === "play" && t > 1.5 ? 1 - (t - 1.5) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.33); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(48, W * 0.9 / (b.text.length * 0.7 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 18, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      const sh = S.shake;
      if (bg) g.drawImage(bg, 0, 0, W, H);
      g.save();
      if (sh > 0) g.translate(rnd(-sh, sh) * 0.6, rnd(-sh, sh) * 0.6);
      clouds.forEach((c) => drawCloud(c.x, H * 0.12 + c.y * H * 0.5, c.s * clamp(W / 400, 0.8, 1.3) * 1.25));
      if (S.slow > 0) { g.fillStyle = "rgba(199,179,255,.18)"; g.fillRect(0, 0, W, H); }
      // shadow under items close to ground
      for (const it of S.items) {
        const k = clamp(it.y / groundY, 0, 1);
        g.fillStyle = "rgba(43,22,64," + 0.18 * k + ")"; g.beginPath(); g.ellipse(it.x, groundY + 6, ir * 0.9 * k, 5 * k, 0, 0, TAU); g.fill();
      }
      drawGuinea();
      for (const it of S.items) drawItem(it);
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.75 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else if (p.k === "gas") { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
      }
      g.globalAlpha = 1;
      drawPrank();
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.6) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, (f.t - 0.12));
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = "rgba(155,217,106," + S.flash * 1.6 + ")"; g.fillRect(0, 0, W, H); }
      if (S.state === "play" || S.state === "end") drawPowers();
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
    function px(e) { const r = cv.getBoundingClientRect(); return e.clientX - r.left; }
    function onDown(e) {
      e.preventDefault();
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
      P.tx = clamp(px(e), gw / 2, W - gw / 2);
    }
    function onMove(e) { if (e.pointerType === "mouse" || e.buttons || e.pressure > 0) P.tx = clamp(px(e), gw / 2, W - gw / 2); }
    function onKey(e) {
      const d = e.type === "keydown";
      if (e.key === "ArrowLeft" || e.key === "a") keyDir = d ? -1 : keyDir === -1 ? 0 : keyDir;
      else if (e.key === "ArrowRight" || e.key === "d") keyDir = d ? 1 : keyDir === 1 ? 0 : keyDir;
    }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    reset();
    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("keyup", onKey);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointermove", onMove);
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Lettuce Catch", icon: "🥬", place: "arcade", kind: "skill",
    blurb: "Catch falling veggies, dodge the poops!",
    mount,
  });
})();
