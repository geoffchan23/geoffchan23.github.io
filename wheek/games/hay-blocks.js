/* Wheek World mini-game: Hay Blocks.
   8x8 block-placement puzzle. Three hay-bale / slime-cube shapes are offered at a time; drag one onto the
   board. Fill a whole row or column to splat it. New three when all are placed. The round ends when no
   piece fits or after 90 seconds. Free to play; pays once per round by score. */
(function () {
  "use strict";
  const ID = "hay-blocks", C = "g-hayb";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 90, N = 8, HUDH = 58, PAD = 10, LIFT = 50;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const easeBack = (t) => { const s = 1.9; t -= 1; return t * t * ((s + 1) * t + s) + 1; };

  // candy colours: hay bales (straw + twine) and slime cubes (glossy with a face)
  const COLS = [
    { f: "#ffd84d", d: "#e0a92a", k: "hay" },
    { f: "#ff9f43", d: "#d9711c", k: "hay" },
    { f: "#ff8fc7", d: "#e0559c", k: "slime" },
    { f: "#5fd3ff", d: "#2a9fd0", k: "slime" },
    { f: "#7be04a", d: "#45a826", k: "slime" },
    { f: "#c7b3ff", d: "#9277e6", k: "slime" },
    { f: "#ff7a7a", d: "#d94a55", k: "slime" },
  ];

  // shapes as strings; weights favour friendly sizes
  function S(rows) { const cells = []; rows.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === "#") cells.push([r, c]); })); return { cells, h: rows.length, w: Math.max(...rows.map((x) => x.length)) }; }
  const SHAPES = [];
  function add(w, ...list) { list.forEach((rows) => SHAPES.push(Object.assign(S(rows), { wt: w }))); }
  add(5, ["#"]);
  add(7, ["##"], ["#", "#"]);
  add(7, ["###"], ["#", "#", "#"]);
  add(4, ["####"], ["#", "#", "#", "#"]);
  add(2, ["#####"], ["#", "#", "#", "#", "#"]);
  add(8, ["##", "##"]);
  add(2, ["###", "###", "###"]);
  add(3, ["###", "###"], ["##", "##", "##"]);
  add(5, ["##", "#."], ["##", ".#"], ["#.", "##"], [".#", "##"]);
  add(2, ["###", "#..", "#.."], ["###", "..#", "..#"], ["#..", "#..", "###"], ["..#", "..#", "###"]);
  add(3, ["#.", "#.", "##"], [".#", ".#", "##"], ["##", "#.", "#."], ["##", ".#", ".#"], ["###", "#.."], ["###", "..#"], ["#..", "###"], ["..#", "###"]);
  add(3, ["###", ".#."], [".#.", "###"], ["#.", "##", "#."], [".#", "##", ".#"]);
  add(2, ["##.", ".##"], [".##", "##."], ["#.", "##", ".#"], [".#", "##", "#."]);
  const WSUM = SHAPES.reduce((a, s) => a + s.wt, 0);
  function randShape() { let x = Math.random() * WSUM; for (const s of SHAPES) { x -= s.wt; if (x <= 0) return s; } return SHAPES[0]; }

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

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#6fa847}
.${C} canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 10px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:4px;min-height:40px;white-space:nowrap}
.${C} .pill.sc{min-width:84px}
.${C} .pill.cb{background:var(--orange);transform:scale(0);transition:transform .25s cubic-bezier(.2,1.6,.4,1)}
.${C} .pill.cb.on{transform:scale(1) rotate(-4deg)}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb .5s infinite}
.${C} .x2{position:absolute;top:56px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:16px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(43,22,64,.32);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:16px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:104px;display:flex;align-items:flex-end;justify-content:center;margin-top:-4px}
.${C} .panel .art svg{animation:${C}-bob 1.1s ease-in-out infinite}
.${C} .panel .art .fl{position:absolute;font-size:30px;bottom:6px;animation:${C}-float 2s ease-in-out infinite}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--yellow)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.32;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#fff3c4;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
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
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill cb">🔥<b>x2</b></div><div class="pill tm">⏱<b>${ROUND}</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    const cbPill = wrap.querySelector(".cb"), cbEl = wrap.querySelector(".cb b"), ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = {
      happy: svgImg(api.guineaSVG({ size: 200, mood: "happy" })),
      wow: svgImg(api.guineaSVG({ size: 200, mood: "wow" })),
      sad: svgImg(api.guineaSVG({ size: 200, mood: "sad" })),
      sleepy: svgImg(api.guineaSVG({ size: 200, mood: "sleepy" })),
    };

    let raf = 0, last = 0, alive = true;
    const timers = new Set();
    const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); };
    let W = 1, H = 1, dpr = 1, cell = 40, bx = 0, by = 0, ts = 20, trayY = 0, trayH = 100, stripH = 0, bg = null;
    let sprites = new Map();
    const St = {};
    let grid = [];
    let tray = [null, null, null];
    let D = null; // drag

    /* ---------- layout ---------- */
    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const cw = Math.floor((W - PAD * 2 - 16) / N);
      const tsOf = (c) => Math.min(c * 0.55, (W - PAD * 2) / 3 / 5.5);
      let tr = tsOf(cw) * 5 + 22;
      const ch = Math.floor((H - HUDH - tr - PAD * 2 - 8) / N);
      cell = clamp(Math.min(cw, ch, 64), 18, 64);
      ts = tsOf(cell);
      trayH = ts * 5 + 22;
      const boardPx = cell * N;
      let spare = H - HUDH - boardPx - trayH - PAD * 2;
      stripH = spare >= 50 ? Math.min(spare, Math.max(64, cell * 2.4)) : 0;
      spare -= stripH;
      const gap = Math.max(0, spare) / 3;
      by = HUDH + gap + stripH;
      bx = Math.round((W - boardPx) / 2);
      trayY = by + boardPx + PAD + gap;
      sprites = new Map();
      buildBg();
    }

    function buildBg() {
      bg = document.createElement("canvas");
      bg.width = cv.width; bg.height = cv.height;
      const g = bg.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const grd = g.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "#c6ee8e"); grd.addColorStop(0.45, "#86c45a"); grd.addColorStop(1, "#4f8a35");
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
      // murky swamp blobs + lily pads
      let seed = 7;
      const sr = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (let i = 0; i < 14; i++) {
        g.fillStyle = sr() < 0.5 ? "rgba(70,120,40,.25)" : "rgba(220,255,170,.18)";
        g.beginPath(); g.ellipse(sr() * W, sr() * H, 30 + sr() * 70, 14 + sr() * 30, 0, 0, TAU); g.fill();
      }
      for (let i = 0; i < 7; i++) {
        const x = sr() * W, y = HUDH + sr() * (H - HUDH), r = 12 + sr() * 16, a = sr() * TAU;
        g.fillStyle = "#3f8f3a"; g.strokeStyle = "rgba(43,22,64,.55)"; g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, a + 0.35, a + TAU - 0.35); g.closePath(); g.fill(); g.stroke();
        if (sr() < 0.4) { g.fillStyle = "#ff8fc7"; g.beginPath(); g.arc(x + r * 0.2, y - r * 0.2, r * 0.28, 0, TAU); g.fill(); g.stroke(); }
      }
      // board frame (mossy log box)
      const bp = cell * N, fr = Math.max(6, cell * 0.2);
      g.fillStyle = "rgba(43,22,64,.25)"; rr(g, bx - fr + 2, by - fr + 7, bp + fr * 2, bp + fr * 2, cell * 0.45); g.fill();
      g.fillStyle = "#8a5a2b"; g.strokeStyle = INK; g.lineWidth = 4;
      rr(g, bx - fr, by - fr, bp + fr * 2, bp + fr * 2, cell * 0.45); g.fill(); g.stroke();
      g.fillStyle = "#2f4a22"; rr(g, bx - 2, by - 2, bp + 4, bp + 4, cell * 0.28); g.fill();
      g.lineWidth = 3; g.stroke();
      // cell wells
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const x = bx + c * cell, y = by + r * cell, i = cell * 0.07;
        g.fillStyle = (r + c) % 2 ? "#3a5a2a" : "#36542a";
        rr(g, x + i, y + i, cell - i * 2, cell - i * 2, cell * 0.2); g.fill();
        g.fillStyle = "rgba(0,0,0,.18)"; rr(g, x + i, y + i, cell - i * 2, cell * 0.18, cell * 0.12); g.fill();
      }
      // moss tufts on the frame
      g.fillStyle = "#7be04a"; g.strokeStyle = INK; g.lineWidth = 2;
      [[bx + cell * 0.6, by - fr], [bx + bp - cell * 1.4, by - fr], [bx - fr, by + bp * 0.6], [bx + bp + fr, by + bp * 0.3]].forEach(([x, y]) => {
        g.beginPath(); g.ellipse(x, y, cell * 0.38, cell * 0.16, 0, 0, TAU); g.fill(); g.stroke();
      });
      // tray tray (a soggy wooden plank)
      const ty = trayY, th = trayH;
      g.fillStyle = "rgba(43,22,64,.22)"; rr(g, 8, ty + 5, W - 16, th, 22); g.fill();
      g.fillStyle = "#fff3c4"; g.strokeStyle = INK; g.lineWidth = 4; rr(g, 8, ty, W - 16, th, 22); g.fill(); g.stroke();
      g.strokeStyle = "rgba(200,150,60,.35)"; g.lineWidth = 2;
      for (let i = 1; i < 3; i++) { const x = 8 + (W - 16) * i / 3; g.beginPath(); g.moveTo(x, ty + 12); g.lineTo(x, ty + th - 12); g.stroke(); }
    }

    function sprite(ci, s) {
      s = Math.max(4, Math.round(s));
      const key = ci + "_" + s;
      let sp = sprites.get(key);
      if (sp) return sp;
      sp = document.createElement("canvas");
      const pad = 3;
      sp.width = sp.height = Math.ceil((s + pad * 2) * dpr);
      const g = sp.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
      const col = COLS[ci], lw = Math.max(2, s * 0.075), i = lw / 2 + 0.5, w = s - i * 2, rad = s * 0.22;
      rr(g, i, i, w, w, rad); g.fillStyle = col.f; g.fill();
      g.save(); rr(g, i, i, w, w, rad); g.clip();
      g.fillStyle = col.d; g.fillRect(i, i + w * 0.72, w, w * 0.4);
      if (col.k === "hay") {
        g.strokeStyle = col.d; g.lineWidth = Math.max(1, s * 0.035); g.lineCap = "round";
        for (let k = 0; k < 5; k++) {
          const y = i + w * (0.16 + k * 0.13);
          g.beginPath(); g.moveTo(i + w * 0.08, y); g.quadraticCurveTo(i + w * 0.5, y + s * 0.04 * (k % 2 ? 1 : -1), i + w * 0.92, y); g.stroke();
        }
        g.fillStyle = "#a0522d";
        g.fillRect(i + w * 0.26, i, w * 0.1, w); g.fillRect(i + w * 0.64, i, w * 0.1, w);
        g.fillStyle = "rgba(255,255,255,.45)"; g.beginPath(); g.ellipse(i + w * 0.2, i + w * 0.16, w * 0.12, w * 0.06, -0.4, 0, TAU); g.fill();
      } else {
        g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(i + w * 0.28, i + w * 0.24, w * 0.16, w * 0.1, -0.6, 0, TAU); g.fill();
        g.beginPath(); g.arc(i + w * 0.5, i + w * 0.17, w * 0.05, 0, TAU); g.fill();
        if (s >= 16) {
          g.fillStyle = INK;
          g.beginPath(); g.arc(i + w * 0.36, i + w * 0.52, w * 0.065, 0, TAU); g.arc(i + w * 0.64, i + w * 0.52, w * 0.065, 0, TAU); g.fill();
          g.strokeStyle = INK; g.lineWidth = Math.max(1.2, s * 0.045); g.lineCap = "round";
          g.beginPath(); g.arc(i + w * 0.5, i + w * 0.6, w * 0.09, 0.2, Math.PI - 0.2); g.stroke();
          g.fillStyle = "rgba(255,90,150,.35)"; g.beginPath(); g.arc(i + w * 0.24, i + w * 0.64, w * 0.07, 0, TAU); g.arc(i + w * 0.76, i + w * 0.64, w * 0.07, 0, TAU); g.fill();
        }
      }
      g.restore();
      rr(g, i, i, w, w, rad); g.strokeStyle = INK; g.lineWidth = lw; g.stroke();
      sprites.set(key, sp);
      return sp;
    }
    function drawBlock(g, ci, cx, cy, s, sx, sy, rot, alpha) {
      const sp = sprite(ci, s), full = sp.width / dpr;
      g.save(); g.translate(cx, cy); if (rot) g.rotate(rot); g.scale(sx || 1, sy || 1);
      if (alpha != null) g.globalAlpha = alpha;
      g.drawImage(sp, -full / 2, -full / 2, full, full);
      g.restore();
    }

    /* ---------- state ---------- */
    function reset() {
      grid = []; for (let r = 0; r < N; r++) { const row = []; for (let c = 0; c < N; c++) row.push(null); grid.push(row); }
      Object.assign(St, { state: "intro", t: 0, timeLeft: ROUND, score: 0, combo: 0, miss: 0, lines: 0, best: 0, placed: 0, megas: 0,
        parts: [], floats: [], dying: [], flashes: [], shake: 0, banner: null, endT: 0, awarded: false, lastSec: ROUND, why: "",
        cheer: 0, cheerText: "", mood: "happy", bubbles: [] });
      tray = [null, null, null]; D = null;
      refill(true);
    }
    function fits(sh, r, c) {
      for (const [dr, dc] of sh.cells) {
        const rr2 = r + dr, cc = c + dc;
        if (rr2 < 0 || cc < 0 || rr2 >= N || cc >= N || grid[rr2][cc]) return false;
      }
      return true;
    }
    function anyFit(sh) { for (let r = 0; r <= N - sh.h; r++) for (let c = 0; c <= N - sh.w; c++) if (fits(sh, r, c)) return true; return false; }
    function refill(first) {
      let set = null;
      for (let k = 0; k < 30; k++) {
        set = [randShape(), randShape(), randShape()];
        if (first) set = set.map((s) => (s.cells.length > 6 ? randShape() : s));
        if (set.some(anyFit)) break;
      }
      const used = new Set();
      tray = set.map((sh, i) => {
        let ci; do { ci = (Math.random() * COLS.length) | 0; } while (used.has(ci) && used.size < COLS.length);
        used.add(ci);
        return { sh, ci, appear: -i * 0.08, ret: null, ok: true };
      });
      updateOk();
    }
    function updateOk() { tray.forEach((p) => { if (p) p.ok = anyFit(p.sh); }); }

    /* ---------- UI ---------- */
    function setHud() {
      scEl.textContent = St.score;
      const sec = Math.max(0, Math.ceil(St.timeLeft));
      tmEl.textContent = sec;
      tmPill.classList.toggle("hurry", sec <= 10 && St.state === "play");
      cbEl.textContent = "x" + Math.max(2, St.combo);
      cbPill.classList.toggle("on", St.combo >= 2 && St.state === "play");
    }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 112, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="fl" style="left:6%">🧱</span><span class="fl" style="right:6%;animation-delay:-.7s">🟩</span>${svg}</div>
        <h2>${after ? "Again?!" : "Hay Blocks"}</h2>${lastLine}
        ${after ? `<p>${after.line}</p>` : `<p>Drag <b>hay bales</b> and <b>slime cubes</b> onto the board. Fill a whole <b>row</b> or <b>column</b> to SPLAT it!</p>
        <div class="chips"><span class="chip">👆 Drag a block</span><span class="chip">💥 Fill lines</span><span class="chip">⏱ ${ROUND} seconds</span></div>`}
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      St.state = "play";
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud();
      banner("GO!", "fill a row or column!", "#7be04a");
      api.sfx("whoosh");
    }

    /* ---------- fx ---------- */
    function shake(a) { St.shake = Math.max(St.shake, RM ? a * 0.2 : a); }
    function banner(text, sub, col) { St.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 24; x = clamp(x, text.length * size * 0.3 + 8, W - text.length * size * 0.3 - 8); St.floats.push({ x, y, text, col, size, t: 0, life: 1 }); }
    function burst(x, y, ci, n, spd) {
      const col = COLS[ci];
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 260);
        St.parts.push({ k: "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 160, g: 900, r: rnd(2.5, cell * 0.13), col: Math.random() < 0.7 ? col.f : col.d, life: rnd(0.4, 0.8), t: 0 });
      }
      if (col.k === "hay") {
        for (let i = 0; i < 4; i++) St.parts.push({ k: "straw", x, y, vx: rnd(-180, 180), vy: rnd(-320, -120), g: 900, r: cell * 0.3, rot: rnd(0, TAU), vr: rnd(-12, 12), col: "#e8b93a", life: rnd(0.6, 1), t: 0 });
      } else {
        St.parts.push({ k: "goo", x, y, vx: 0, vy: 0, g: 0, r: cell * 0.45, col: col.f, life: 0.35, t: 0 });
      }
    }
    function gas(x, y, n) {
      for (let i = 0; i < n; i++) St.parts.push({ k: "gas", x: x + rnd(-20, 20), y: y + rnd(-10, 10), vx: rnd(-50, 50), vy: rnd(-70, -15), g: -20, r: rnd(10, 18), grow: rnd(18, 34), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.9, 1.5), t: 0 });
    }
    function sparkles(x, y, n) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(80, 300); St.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 200, r: rnd(5, 10), rot: rnd(0, TAU), vr: rnd(-6, 6), col: pick(["#ffd84d", "#fff", "#ff8fc7", "#5fd3ff"]), life: rnd(0.5, 0.9), t: 0 }); }
    }
    function cheer(text, mood) { St.cheer = 1.4; St.cheerText = text; St.mood = mood || "wow"; }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- geometry ---------- */
    function slotRect(i) { const sw = (W - 16) / 3; return { x: 8 + sw * i, y: trayY, w: sw, h: trayH }; }
    function slotCenter(i) { const s = slotRect(i); return [s.x + s.w / 2, s.y + s.h / 2]; }
    function snapFor(p, fx, fy) {
      const sh = p.sh, px = fx - (sh.w * cell) / 2, py = fy - LIFT - sh.h * cell;
      const fc = (px - bx) / cell, fr = (py - by) / cell;
      const c0 = Math.round(fc), r0 = Math.round(fr);
      if (fits(sh, r0, c0)) return { r: r0, c: c0 };
      let best = null, bd = 0.8;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const r = r0 + dr, c = c0 + dc;
        const d = Math.hypot(r - fr, c - fc);
        if (d < bd && fits(sh, r, c)) { bd = d; best = { r, c }; }
      }
      return best;
    }
    function clearsFor(sh, r, c) {
      const fill = new Set(sh.cells.map(([dr, dc]) => (r + dr) * N + (c + dc)));
      const rows = [], cols = [];
      for (let i = 0; i < N; i++) {
        let fr = true, fc = true;
        for (let j = 0; j < N; j++) {
          if (!grid[i][j] && !fill.has(i * N + j)) fr = false;
          if (!grid[j][i] && !fill.has(j * N + i)) fc = false;
        }
        if (fr) rows.push(i); if (fc) cols.push(i);
      }
      return { rows, cols };
    }
    function fingerFor(i, r, c) { const p = tray[i]; return [bx + (c + p.sh.w / 2) * cell, by + (r + p.sh.h) * cell + LIFT]; }

    /* ---------- input ---------- */
    function local(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function onDown(e) {
      if (St.state !== "play" || D) return;
      const [x, y] = local(e);
      for (let i = 0; i < 3; i++) {
        const s = slotRect(i), p = tray[i];
        if (!p || x < s.x || x > s.x + s.w || y < s.y - 14 || y > s.y + s.h + 14) continue;
        D = { i, pid: e.pointerId, fx: x, fy: y, grab: 0, snap: null, clr: null };
        p.ret = null;
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        api.sfx("squish"); api.haptic(10);
        updateSnap();
        e.preventDefault();
        return;
      }
    }
    function onMove(e) {
      if (!D || e.pointerId !== D.pid) return;
      const [x, y] = local(e); D.fx = x; D.fy = y;
      const prev = D.snap;
      updateSnap();
      if (D.snap && (!prev || prev.r !== D.snap.r || prev.c !== D.snap.c)) api.sfx("tick");
      e.preventDefault();
    }
    function updateSnap() {
      const p = tray[D.i];
      D.snap = snapFor(p, D.fx, D.fy);
      D.clr = D.snap ? clearsFor(p.sh, D.snap.r, D.snap.c) : null;
    }
    function onUp(e) {
      if (!D || e.pointerId !== D.pid) return;
      const [x, y] = local(e); D.fx = x; D.fy = y;
      updateSnap();
      const d = D; D = null;
      const p = tray[d.i];
      if (St.state === "play" && d.snap) place(d.i, d.snap.r, d.snap.c);
      else returnPiece(d, p);
    }
    function onCancel(e) { if (!D || e.pointerId !== D.pid) return; const d = D; D = null; returnPiece(d, tray[d.i]); }
    function returnPiece(d, p) {
      if (!p) return;
      const s = lerp(ts, cell, d.grab);
      p.ret = { x: d.fx, y: d.fy - LIFT - (p.sh.h * s) / 2, s, t: 0 };
      api.sfx("boop");
    }

    /* ---------- core ---------- */
    function place(i, r, c) {
      const p = tray[i];
      if (!p || !fits(p.sh, r, c)) return false;
      for (const [dr, dc] of p.sh.cells) grid[r + dr][c + dc] = { ci: p.ci, t: 0, delay: (dr + dc) * 0.03 };
      tray[i] = null;
      St.placed++;
      const n = p.sh.cells.length;
      St.score += n;
      api.sfx("nom"); api.haptic(12);
      const pcx = bx + (c + p.sh.w / 2) * cell, pcy = by + (r + p.sh.h / 2) * cell;
      // clears
      const rows = [], cols = [];
      for (let k = 0; k < N; k++) {
        if (grid[k].every((v) => v)) rows.push(k);
        let full = true; for (let j = 0; j < N; j++) if (!grid[j][k]) { full = false; break; }
        if (full) cols.push(k);
      }
      const L = rows.length + cols.length;
      if (L > 0) {
        St.combo += 1; St.miss = 0; St.lines += L; St.best = Math.max(St.best, St.combo);
        const mult = Math.min(5, Math.max(1, St.combo));
        const pts = 20 * (L * (L + 1)) / 2 * mult;
        St.score += pts;
        const kill = new Map();
        rows.forEach((rr2) => { for (let j = 0; j < N; j++) kill.set(rr2 * N + j, [rr2, j]); St.flashes.push({ row: rr2, t: 0 }); });
        cols.forEach((cc) => { for (let j = 0; j < N; j++) kill.set(j * N + cc, [j, cc]); St.flashes.push({ col: cc, t: 0 }); });
        const ccx = c + p.sh.w / 2, ccy = r + p.sh.h / 2;
        kill.forEach(([kr, kc]) => {
          const g = grid[kr][kc];
          St.dying.push({ r: kr, c: kc, ci: g.ci, t: 0, delay: 0.05 + Math.hypot(kr + 0.5 - ccy, kc + 0.5 - ccx) * 0.035, popped: false });
          grid[kr][kc] = null;
        });
        const empty = grid.every((row) => row.every((v) => !v));
        let ty = pcy - cell * 0.6;
        if (L >= 2) {
          St.megas++;
          banner(L >= 4 ? "ULTRA MEGA!" : "MEGA CLEAR!", L + " lines at once!", L >= 4 ? "#ff8fc7" : "#ffd84d");
          api.sfx("bigwin"); later(() => api.sfx("wheek"), 220);
          cheer(pick(["MEGA!", "WHEEEK!", "YESSS!"]), "wow");
          shake(6 + L * 3); api.haptic(60);
          const [vx, vy] = vp(pcx, pcy); api.confetti(vx, vy, 30 + L * 10);
        } else {
          api.sfx("pop"); later(() => api.sfx("sparkle"), 90);
          cheer(pick(["Wheek!", "Yay!", "Splat!", "Nice!", "Ooh!"]), "happy");
          shake(4);
        }
        floatT(pcx, ty, "+" + pts, "#ffd84d", 28);
        if (mult >= 2) {
          floatT(pcx, ty - 32, "COMBO x" + mult + "!", "#ff9f43", 24);
          later(() => api.sfx("coin"), 160);
          bump(cbPill);
        }
        if (empty) {
          St.score += 300;
          later(() => { banner("SPOTLESS!", "+300 squeaky clean!", "#5fd3ff"); api.sfx("fanfare"); sparkles(bx + cell * 4, by + cell * 4, 40); }, 450);
        }
        bump(scEl.parentNode);
      } else {
        St.miss++;
        if (St.miss >= 3 && St.combo > 0) { St.combo = 0; }
        if (Math.random() < 0.12) { api.sfx("fart"); const [vx, vy] = vp(pcx, pcy); api.gas(vx, vy); gas(pcx, pcy, 5); }
      }
      // pop of the placed piece
      for (const [dr, dc] of p.sh.cells) for (let k = 0; k < 2; k++) St.parts.push({ k: "dot", x: bx + (c + dc + 0.5) * cell, y: by + (r + dr + 1) * cell, vx: rnd(-80, 80), vy: rnd(-160, -60), g: 700, r: rnd(2, 4), col: COLS[p.ci].f, life: 0.4, t: 0 });
      if (tray.every((x) => !x)) { refill(false); api.sfx("whoosh"); }
      updateOk();
      setHud();
      if (!tray.some((x) => x && x.ok)) endRound("noroom");
      return true;
    }
    function endRound(why) {
      if (St.state !== "play") return;
      St.state = "end"; St.endT = 0; St.why = why;
      if (D) { const d = D; D = null; returnPiece(d, tray[d.i]); }
      if (why === "noroom") {
        banner("NO ROOM!", "the board's too stuffed!", "#b6f27a");
        api.sfx("lose"); later(() => api.sfx("fart"), 300);
        cheer("Oof!", "sad");
        const [vx, vy] = vp(bx + cell * 4, by + cell * 4); api.gas(vx, vy); gas(bx + cell * 4, by + cell * 4, 14);
        shake(8);
      } else { banner("TIME'S UP!", "", "#5fd3ff"); api.sfx("fanfare"); cheer("Phew!", "happy"); }
      setHud();
    }
    function finish() {
      if (St.awarded) return;
      St.awarded = true; St.state = "over";
      const coins = St.score > 0 ? Math.min(200, Math.round(12 + St.score / 6)) : 0;
      const earned = coins > 0 ? api.award(coins, { reason: "Hay Blocks" }) : 0;
      const hs = api.highscore(ID, St.score);
      const quip = St.megas >= 3 ? `${gName} says you're a MEGA CLEAR machine!` : St.lines >= 12 ? `${gName} is wheeking with joy. ${St.lines} lines splatted!` : St.lines >= 1 ? `${St.lines} line${St.lines > 1 ? "s" : ""} splatted! ${gName} wants more hay.` : St.why === "noroom" ? `${gName} got squished by hay. Pfffft!` : `${gName} is still waiting for a splat!`;
      const text = `${quip} Score ${St.score}${St.best >= 2 ? `, best combo x${St.best}` : ""}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && St.score > 0 ? "New best!" : St.why === "noroom" ? "Stuffed!" : "Time's up!", text, score: St.score });
      hud.classList.add("off");
      showPanel({ score: St.score, earned, line: `${quip} ${hs.isNew && St.score > 0 ? "<b>New best!</b> 🏆" : "Best: " + hs.best}` });
    }

    /* ---------- update ---------- */
    function update(dt) {
      if (St.state === "play") {
        St.t += dt; St.timeLeft -= dt;
        const sec = Math.ceil(St.timeLeft);
        if (sec !== St.lastSec) { St.lastSec = sec; setHud(); if (sec <= 5 && sec > 0) api.sfx("tick"); }
        if (St.timeLeft <= 0) { St.timeLeft = 0; endRound("time"); }
      } else if (St.state === "end") {
        St.endT += dt; if (St.endT > 1.9) finish();
      }
      if (D) D.grab = Math.min(1, D.grab + dt / 0.12);
      tray.forEach((p) => { if (!p) return; p.appear += dt; if (p.ret) { p.ret.t += dt / 0.22; if (p.ret.t >= 1) p.ret = null; } });
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const g = grid[r][c]; if (g && g.t < 2) g.t += dt; }
      for (const d of St.dying) {
        d.t += dt;
        if (!d.popped && d.t >= d.delay) { d.popped = true; burst(bx + (d.c + 0.5) * cell, by + (d.r + 0.5) * cell, d.ci, 7); }
      }
      St.dying = St.dying.filter((d) => d.t < d.delay + 0.3);
      St.flashes.forEach((f) => (f.t += dt)); St.flashes = St.flashes.filter((f) => f.t < 0.5);
      for (const p of St.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.vr) p.rot += p.vr * dt;
      }
      St.parts = St.parts.filter((p) => p.t < p.life);
      if (St.parts.length > 400) St.parts.splice(0, St.parts.length - 400);
      St.floats.forEach((f) => (f.t += dt)); St.floats = St.floats.filter((f) => f.t < f.life);
      if (St.banner) { St.banner.t += dt; if (St.state === "end" && St.banner.t > 1) St.banner.t = 1; if (St.banner.t > 1.3) St.banner = null; }
      if (St.cheer > 0) St.cheer = Math.max(0, St.cheer - dt);
      St.shake = Math.max(0, St.shake - dt * 30);
      if (Math.random() < dt * 1.5) St.bubbles.push({ x: rnd(0, W), y: H + 10, r: rnd(3, 8), v: rnd(20, 45), t: 0 });
      St.bubbles.forEach((b) => { b.y -= b.v * dt; b.t += dt; }); St.bubbles = St.bubbles.filter((b) => b.y > HUDH);
    }

    /* ---------- draw ---------- */
    function drawPiece(g, p, cx, cy, s, alpha, sqx, sqy) {
      const sh = p.sh, ox = cx - (sh.w * s) / 2, oy = cy - (sh.h * s) / 2;
      for (const [dr, dc] of sh.cells) {
        const x = ox + (dc + 0.5) * s, y = oy + (dr + 0.5) * s;
        drawBlock(g, p.ci, cx + (x - cx) * (sqx || 1), cy + (y - cy) * (sqy || 1), s, sqx, sqy, 0, alpha);
      }
    }
    function drawGuinea(g) {
      const img = gImg[St.cheer > 0 ? St.mood : St.state === "intro" ? "sleepy" : St.why === "noroom" ? "sad" : "happy"] || gImg.happy;
      if (!img.complete || !img.naturalWidth) return;
      const ch = St.cheer > 0 ? St.cheer / 1.4 : 0;
      if (stripH > 0) {
        const gs = Math.min(stripH * 1.25, 130), gh = gs * 0.85;
        const hop = ch > 0 ? Math.abs(Math.sin((1 - ch) * Math.PI * 3)) * gs * 0.25 * ch : Math.sin(St.t * 2.4) * 2;
        const sq = ch > 0 ? 1 + Math.sin((1 - ch) * Math.PI * 6) * 0.08 * ch : 1;
        const gx = bx + cell * N - gs * 0.55, gy = by - Math.max(6, cell * 0.2) + gh * 0.12;
        g.save(); g.translate(gx, gy - hop); g.scale(2 - sq, sq);
        g.drawImage(img, -gs / 2, -gh, gs, gh); g.restore();
        // paws on the frame
        g.fillStyle = "#fff6ea"; g.strokeStyle = INK; g.lineWidth = 2.5;
        if (ch <= 0) [-0.18, 0.18].forEach((o) => { g.beginPath(); g.ellipse(gx + gs * o, gy - gh * 0.08, gs * 0.07, gs * 0.05, 0, 0, TAU); g.fill(); g.stroke(); });
        if (St.cheer > 0) speech(g, St.cheerText, gx - gs * 0.85, gy - gh * 0.7 - hop, ch);
      } else if (St.cheer > 0) {
        const gs = cell * 2.6, gh = gs * 0.85, k = Math.min(1, (1 - ch) * 6) * Math.min(1, ch * 4);
        const gx = bx + cell * N - gs * 0.35, gy = by + cell * N + gh * 0.2;
        g.save(); g.globalAlpha = k; g.translate(gx, gy - gh * 0.6 * easeBack(Math.min(1, (1 - ch) * 4)));
        g.drawImage(img, -gs / 2, -gh, gs, gh); g.restore();
        speech(g, St.cheerText, gx - gs * 0.6, gy - gh * 1.3, ch);
      }
    }
    function speech(g, text, x, y, ch) {
      const sz = Math.max(16, Math.min(24, cell * 0.5));
      g.font = sz + "px " + FONT;
      const w = g.measureText(text).width + 22, h = sz + 16;
      const s = easeBack(Math.min(1, (1 - ch) * 5));
      x = clamp(x, w / 2 + 6, W - w / 2 - 6);
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 3;
      rr(g, -w / 2, -h / 2, w, h, h / 2); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(w * 0.22, h / 2 - 2); g.lineTo(w * 0.38, h / 2 + 10); g.lineTo(w * 0.36, h / 2 - 2); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#fff"; g.fillRect(w * 0.2, h / 2 - 5, w * 0.2, 4);
      g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 0, 1);
      g.restore();
    }

    function draw() {
      const g = ctx;
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (bg) g.drawImage(bg, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sh = St.shake;
      if (sh > 0) g.translate(rnd(-sh, sh), rnd(-sh, sh));
      // bubbles
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 2;
      for (const b of St.bubbles) { g.beginPath(); g.arc(b.x + Math.sin(b.t * 3) * 4, b.y, b.r, 0, TAU); g.stroke(); }

      drawGuinea(g);

      // line highlight from ghost
      const ghost = D && D.snap ? D : null;
      const hlRows = new Set(ghost && ghost.clr ? ghost.clr.rows : []), hlCols = new Set(ghost && ghost.clr ? ghost.clr.cols : []);
      if (hlRows.size || hlCols.size) {
        const a = 0.35 + Math.sin(performance.now() / 90) * 0.15;
        g.fillStyle = `rgba(255,240,120,${a})`;
        hlRows.forEach((r) => { rr(g, bx + 2, by + r * cell + 2, cell * N - 4, cell - 4, cell * 0.25); g.fill(); });
        hlCols.forEach((c) => { rr(g, bx + c * cell + 2, by + 2, cell - 4, cell * N - 4, cell * 0.25); g.fill(); });
      }
      // board cells
      const tnow = performance.now() / 1000;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = grid[r][c]; if (!v) continue;
        const x = bx + (c + 0.5) * cell, y = by + (r + 0.5) * cell;
        const tt = v.t - (v.delay || 0);
        let sx = 1, sy = 1;
        if (tt < 0) { sx = sy = 0.6; }
        else if (tt < 0.4) { const k = tt / 0.4, w = Math.sin(k * Math.PI * 2.5) * (1 - k) * 0.28; sx = 1 + w; sy = 1 - w; }
        if (hlRows.has(r) || hlCols.has(c)) { const w = Math.sin(tnow * 18 + r + c) * 0.06; sx += w; sy -= w; }
        drawBlock(g, v.ci, x, y, cell, sx, sy);
        if (hlRows.has(r) || hlCols.has(c)) { g.fillStyle = "rgba(255,250,200,.28)"; rr(g, x - cell / 2 + 3, y - cell / 2 + 3, cell - 6, cell - 6, cell * 0.2); g.fill(); }
      }
      if (hlRows.size || hlCols.size) {
        g.save(); g.strokeStyle = "#fff36b"; g.lineWidth = 4; g.shadowColor = "#ffd84d"; g.shadowBlur = 14;
        hlRows.forEach((r) => { rr(g, bx + 1, by + r * cell + 1, cell * N - 2, cell - 2, cell * 0.25); g.stroke(); });
        hlCols.forEach((c) => { rr(g, bx + c * cell + 1, by + 1, cell - 2, cell * N - 2, cell * 0.25); g.stroke(); });
        g.restore();
      }
      // ghost
      if (ghost) {
        const p = tray[ghost.i];
        const ghostCi = (hlRows.size || hlCols.size) ? p.ci : p.ci;
        for (const [dr, dc] of p.sh.cells) {
          const x = bx + (ghost.snap.c + dc + 0.5) * cell, y = by + (ghost.snap.r + dr + 0.5) * cell;
          drawBlock(g, ghostCi, x, y, cell, 1, 1, 0, 0.42);
          g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 2; g.setLineDash([5, 4]);
          rr(g, x - cell / 2 + 3, y - cell / 2 + 3, cell - 6, cell - 6, cell * 0.2); g.stroke(); g.setLineDash([]);
        }
      }
      // line flashes
      for (const f of St.flashes) {
        const a = (1 - f.t / 0.5);
        g.fillStyle = `rgba(255,255,255,${a * 0.8})`;
        const grow = (1 - a) * cell * 0.3;
        if (f.row != null) { rr(g, bx - grow, by + f.row * cell - grow / 2, cell * N + grow * 2, cell + grow, cell * 0.4); g.fill(); }
        else { rr(g, bx + f.col * cell - grow / 2, by - grow, cell + grow, cell * N + grow * 2, cell * 0.4); g.fill(); }
      }
      // dying cells
      for (const d of St.dying) {
        const x = bx + (d.c + 0.5) * cell, y = by + (d.r + 0.5) * cell;
        if (d.t < d.delay) { drawBlock(g, d.ci, x, y, cell, 1.05, 0.95); continue; }
        const k = (d.t - d.delay) / 0.3, s = k < 0.35 ? 1 + k * 0.9 : (1.3 * (1 - (k - 0.35) / 0.65));
        drawBlock(g, d.ci, x, y, cell, s, s * (k < 0.35 ? 0.85 : 1), k * 2, 1 - k * 0.5);
      }
      // tray
      for (let i = 0; i < 3; i++) {
        const p = tray[i]; if (!p) continue;
        if (D && D.i === i) continue;
        let [cx, cy] = slotCenter(i);
        let s = ts;
        const ap = clamp(p.appear / 0.35, 0, 1);
        if (p.appear < 0) continue;
        let sc = easeBack(ap);
        if (p.ret) { const k = easeBack(Math.min(1, p.ret.t)); cx = lerp(p.ret.x, cx, k); cy = lerp(p.ret.y, cy, k); s = lerp(p.ret.s, ts, k); }
        const bob = St.state === "play" ? Math.sin(St.t * 3 + i * 1.7) * 2 : 0;
        const live = St.state === "play" || St.state === "end";
        drawPiece(g, p, cx, cy + bob, s * sc, p.ok || !live ? 1 : 0.35, 1, 1);
        if (!p.ok && live) { g.font = "14px " + FONT; txt(g, "no room", cx, slotRect(i).y + trayH - 12, 14, "#ff8fc7", 4); }
      }
      // dragged piece above the finger
      if (D) {
        const p = tray[D.i], k = easeBack(D.grab);
        const [sx0, sy0] = slotCenter(D.i);
        const s = lerp(ts, cell, k);
        const tx = D.fx, ty = D.fy - LIFT - (p.sh.h * s) / 2;
        const cx = lerp(sx0, tx, Math.min(1, D.grab * 1.2)), cy = lerp(sy0, ty, Math.min(1, D.grab * 1.2));
        const wob = Math.sin(performance.now() / 120) * 0.03;
        g.save(); g.globalAlpha = 0.25; g.fillStyle = INK;
        for (const [dr, dc] of p.sh.cells) { rr(g, cx - (p.sh.w * s) / 2 + dc * s + 4, cy - (p.sh.h * s) / 2 + dr * s + 8, s - 2, s - 2, s * 0.2); g.fill(); }
        g.restore();
        drawPiece(g, p, cx, cy, s * 1.02, 1, 1 + wob, 1 - wob);
      }
      // particles
      for (const p of St.parts) {
        const a = 1 - p.t / p.life;
        if (p.k === "dot") { g.fillStyle = p.col; g.globalAlpha = Math.min(1, a * 1.5); g.beginPath(); g.arc(p.x, p.y, p.r * (0.5 + a * 0.5), 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
        else if (p.k === "straw") { g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(-p.r / 2, 0); g.lineTo(p.r / 2, 0); g.stroke(); g.strokeStyle = p.col; g.lineWidth = 2.5; g.stroke(); g.restore(); }
        else if (p.k === "goo") { const k = p.t / p.life; g.globalAlpha = 1 - k; g.strokeStyle = p.col; g.lineWidth = 6 * (1 - k) + 1; g.beginPath(); g.arc(p.x, p.y, p.r * (0.5 + k * 1.3), 0, TAU); g.stroke(); }
        else if (p.k === "gas") { g.globalAlpha = a * 0.75; g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r + (p.grow * p.t) / p.life, 0, TAU); g.fill(); }
        else if (p.k === "star") {
          g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.col; g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath();
          for (let j = 0; j < 10; j++) { const rr2 = j % 2 ? p.r * 0.45 : p.r, an = (j / 10) * TAU; g.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2); }
          g.closePath(); g.fill(); g.stroke(); g.restore();
        }
        g.globalAlpha = 1;
      }
      // floats
      for (const f of St.floats) {
        const k = f.t / f.life, sc = f.t < 0.15 ? easeBack(f.t / 0.15) : 1;
        g.save(); g.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1; g.translate(f.x, f.y - k * 50); g.scale(sc, sc);
        txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      // banner
      if (St.banner) {
        const b = St.banner, t = b.t, sc = t < 0.3 ? easeBack(t / 0.3) : t > 1.05 ? 1 - (t - 1.05) / 0.25 : 1;
        const size = Math.min(54, W * 0.12), cy = by + cell * N * 0.45;
        g.save(); g.translate(W / 2, cy); g.scale(sc, sc); g.rotate(-0.05);
        txt(g, b.text, 0, 0, size, b.col, size * 0.24);
        if (b.sub) txt(g, b.sub, 0, size * 0.75, Math.round(size * 0.38), "#fff", 5);
        g.restore();
      }
    }

    function frame(now) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      update(dt);
      draw();
    }

    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onCancel);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    // test hook (harmless in production)
    wrap._hb = { St, grid: () => grid, tray: () => tray, fits, fingerFor, layout: () => ({ W, H, cell, bx, by, ts, trayY, trayH, stripH }), slotCenter, end: endRound };

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t)); timers.clear();
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointermove", onMove);
        cv.removeEventListener("pointerup", onUp);
        cv.removeEventListener("pointercancel", onCancel);
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Hay Blocks", icon: "🧱", place: "swamp", kind: "skill",
    blurb: "Drag hay bales and slime cubes, fill lines, SPLAT!",
    mount,
  });
})();
