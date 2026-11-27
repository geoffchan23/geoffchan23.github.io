/* Wheek World mini-game: Slime Drop.
   Drop-and-merge physics: aim along the top of the jar, let go to drop a slime blob.
   Two blobs of the same size that touch squish into the next size up (10 sizes, ending
   in the giant Mega Pudding guinea blob). Round ends after 120 seconds or when the jar
   stays over the line for 2 seconds. Free to play; pays once per round by score. */
(function () {
  "use strict";
  const ID = "slime-drop", C = "g-slime";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];

  /* ---------- tuning (physics runs in jar units: the jar is 100 wide) ---------- */
  const ROUND = 120;          // seconds
  const OVER_LIMIT = 2;       // seconds over the line before the jar burps
  const JW = 100;             // jar inside width, units (height adapts 140-160 to the screen)
  const LINE = 27;            // danger line (units from the top of the jar)
  const HELD_Y = 14;          // where the held blob hangs
  const G = 640;              // gravity, units/s^2
  const HZ = 240, H_STEP = 1 / HZ, MAX_SUB = 10;
  const ITER = 4;             // constraint iterations per substep
  const VMAX = 300;           // speed clamp, units/s (2.5 units per substep < smallest radius)
  const WAKE_V = 30, SLEEP_V = 7, SLEEP_T = 0.35;
  const COOLDOWN = 0.45;
  const MAXL = 9;

  const LV = [
    { n: "Goo Pea", c: "#d4f77a", d: "#93cf3c" },
    { n: "Snot Drop", c: "#7be04a", d: "#45a82a" },
    { n: "Gum Glob", c: "#ff9fcf", d: "#e2609f" },
    { n: "Lemon Jelly", c: "#ffe066", d: "#e5ae1c" },
    { n: "Sky Squish", c: "#6fd8ff", d: "#2c9fd6" },
    { n: "Grape Goop", c: "#bea6ff", d: "#8665e0" },
    { n: "Orange Ooze", c: "#ffab57", d: "#e47315" },
    { n: "Bubble Bomb", c: "#ff73a1", d: "#d63a6c" },
    { n: "Minty Mallow", c: "#69e8c6", d: "#26b38c" },
    { n: "Mega Pudding", c: "#fff0c2", d: "#f0b85e" },
  ];
  const R = [4.6, 6.2, 8.1, 10.1, 12.3, 15, 17.9, 21.1, 24.6, 29];
  const PTS = [0, 2, 4, 7, 12, 18, 26, 36, 50, 75]; // points for MAKING this level
  const MEGA_POP = 150;                              // two Mega Puddings
  const DROP_W = [28, 26, 22, 14, 10];               // drop odds for levels 0-4

  const SQUELCH = ["SQUELCH!", "SPLORT!", "SQUISH!", "BLORP!", "GLOOP!", "SPLAT!"];
  const BIG = ["MEGA SQUISH!", "GOOEY!", "SLIME TIME!", "SO SQUISHY!"];

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#5fae6e}
.${C} canvas.main{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 10px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:5px;min-height:42px;white-space:nowrap}
.${C} .pill.sc{min-width:84px}
.${C} .pill.tm{min-width:84px;justify-content:center}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb .5s infinite}
.${C} .pill.nx{padding:2px 4px 2px 10px;gap:2px}
.${C} .pill.nx small{font-family:var(--body);font-weight:900;font-size:12px;color:var(--ink-soft);text-transform:uppercase}
.${C} .pill.nx canvas{width:36px;height:36px;display:block}
.${C} .x2{position:absolute;top:58px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.3);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:14px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .art{position:relative;height:112px;display:flex;align-items:flex-end;justify-content:center;gap:0}
.${C} .panel .art .pig{animation:${C}-wob 1.2s ease-in-out infinite;transform-origin:50% 100%;position:relative;z-index:1;margin:0 -6px}
.${C} .panel .art .b{border:3.5px solid var(--ink);border-radius:50%;position:relative;animation:${C}-jig 1s ease-in-out infinite;transform-origin:50% 100%}
.${C} .panel .art .b:before,.${C} .panel .art .b:after{content:"";position:absolute;top:38%;width:16%;height:16%;background:var(--ink);border-radius:50%}
.${C} .panel .art .b:before{left:26%}.${C} .panel .art .b:after{right:26%}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--slime)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#e6ffd4;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ${C}-jig{0%,100%{transform:scale(1,1)}50%{transform:scale(1.08,.9)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

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
  function pickLevel() {
    let t = Math.random() * DROP_W.reduce((a, b) => a + b, 0);
    for (let i = 0; i < DROP_W.length; i++) { t -= DROP_W[i]; if (t < 0) return i; }
    return 0;
  }

  /* ---------- blob art (shared by jar, next pill and ladder) ---------- */
  // o: {sx, sy, lx, ly (look -1..1), blink, scared, alpha, img (guinea image), sil (silhouette)}
  function drawBlob(g, x, y, r, L, o) {
    o = o || {};
    const lv = LV[L];
    g.save(); g.translate(x, y); g.scale(o.sx || 1, o.sy || 1);
    if (o.alpha != null) g.globalAlpha = o.alpha;
    const lw = clamp(r * 0.15, 2, 4.5);
    g.beginPath(); g.arc(0, 0, r, 0, TAU);
    if (o.sil) {
      g.fillStyle = "rgba(43,22,64,.28)"; g.fill();
      g.lineWidth = lw * 0.8; g.strokeStyle = "rgba(43,22,64,.55)"; g.stroke();
      g.restore(); return;
    }
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.05);
    gr.addColorStop(0, lv.c); gr.addColorStop(0.6, lv.c); gr.addColorStop(1, lv.d);
    g.fillStyle = gr; g.fill();
    if (L === MAXL) {
      // caramel cap with drips
      g.save(); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.clip();
      g.fillStyle = "#c46a2a";
      g.beginPath(); g.moveTo(-r, -r);
      g.lineTo(r, -r); g.lineTo(r, -r * 0.45);
      const drips = [[0.75, 0.2], [0.45, 0.05], [0.15, 0.35], [-0.2, 0.1], [-0.5, 0.3], [-0.8, 0]];
      let px = r;
      for (const [dx, dl] of drips) {
        const xx = dx * r;
        g.quadraticCurveTo((px + xx) / 2, -r * 0.5, xx + r * 0.08, -r * 0.45);
        if (dl > 0) { g.lineTo(xx + r * 0.08, -r * 0.45 + dl * r); g.arc(xx, -r * 0.45 + dl * r, r * 0.08, 0, Math.PI); }
        px = xx;
      }
      g.lineTo(-r, -r * 0.4); g.closePath(); g.fill();
      g.restore();
      g.beginPath(); g.arc(0, 0, r, 0, TAU);
      g.lineWidth = lw; g.strokeStyle = INK; g.stroke();
      if (o.img && o.img.complete && o.img.naturalWidth) {
        const iw = r * 1.62, ih = iw * 0.85;
        g.drawImage(o.img, -iw / 2, -ih * 0.42, iw, ih);
      }
      // cherry on top
      const cr = Math.max(2.5, r * 0.15);
      g.strokeStyle = INK; g.lineWidth = Math.max(1.5, lw * 0.6);
      g.beginPath(); g.moveTo(0, -r - cr * 0.6); g.quadraticCurveTo(cr * 0.6, -r - cr * 2.2, cr * 1.5, -r - cr * 2.4); g.stroke();
      g.fillStyle = "#ff3b5c"; g.lineWidth = Math.max(1.5, lw * 0.7);
      g.beginPath(); g.arc(0, -r - cr * 0.3, cr, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.arc(-cr * 0.35, -r - cr * 0.65, cr * 0.3, 0, TAU); g.fill();
      g.restore();
      return;
    }
    g.lineWidth = lw; g.strokeStyle = INK; g.stroke();
    // goo bubbles inside bigger blobs
    if (L >= 4) {
      g.fillStyle = "rgba(255,255,255,.35)";
      g.beginPath(); g.arc(r * 0.45, r * 0.42, r * 0.09, 0, TAU); g.fill();
      g.beginPath(); g.arc(r * 0.62, r * 0.18, r * 0.05, 0, TAU); g.fill();
    }
    // shine
    g.fillStyle = "rgba(255,255,255,.75)";
    g.beginPath(); g.ellipse(-r * 0.42, -r * 0.48, r * 0.24, r * 0.13, -0.65, 0, TAU); g.fill();
    if (r > 8) { g.beginPath(); g.arc(-r * 0.15, -r * 0.66, r * 0.06, 0, TAU); g.fill(); }
    // face
    const lx = (o.lx || 0), ly = (o.ly || 0);
    const ex = r * 0.34, ey = -r * 0.05;
    g.fillStyle = INK; g.strokeStyle = INK;
    if (L <= 1 || r < 9) {
      const er = Math.max(1.3, r * 0.13);
      for (const s of [-1, 1]) {
        if (o.blink) { g.lineWidth = Math.max(1.2, r * 0.08); g.beginPath(); g.moveTo(s * ex - er, ey); g.lineTo(s * ex + er, ey); g.stroke(); }
        else { g.beginPath(); g.arc(s * ex + lx * er * 0.3, ey + ly * er * 0.3, er, 0, TAU); g.fill(); }
      }
    } else {
      const er = r * 0.17;
      for (const s of [-1, 1]) {
        const cx = s * ex, cy = ey;
        if (o.blink) {
          g.lineWidth = Math.max(1.5, r * 0.07);
          g.beginPath(); g.arc(cx, cy - er * 0.2, er * 0.8, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
        } else {
          g.fillStyle = "#fff"; g.beginPath(); g.arc(cx, cy, er, 0, TAU); g.fill();
          g.lineWidth = Math.max(1.4, r * 0.055); g.stroke();
          const pr = o.scared ? er * 0.35 : er * 0.58;
          g.fillStyle = INK; g.beginPath(); g.arc(cx + lx * er * 0.38, cy + ly * er * 0.38, pr, 0, TAU); g.fill();
          g.fillStyle = "#fff"; g.beginPath(); g.arc(cx + lx * er * 0.38 - pr * 0.35, cy + ly * er * 0.38 - pr * 0.35, pr * 0.32, 0, TAU); g.fill();
        }
      }
      // cheeks
      g.fillStyle = "rgba(255,90,140,.38)";
      g.beginPath(); g.ellipse(-r * 0.58, r * 0.2, r * 0.13, r * 0.08, 0, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(r * 0.58, r * 0.2, r * 0.13, r * 0.08, 0, 0, TAU); g.fill();
    }
    // mouth
    const my = r * 0.27, mw = r * 0.2;
    g.lineWidth = Math.max(1.3, r * 0.07); g.strokeStyle = INK; g.fillStyle = INK;
    if (o.scared) {
      g.beginPath(); g.moveTo(-mw, my);
      for (let i = 1; i <= 4; i++) g.lineTo(-mw + (i * mw) / 2, my + (i % 2 ? -r * 0.05 : r * 0.05));
      g.stroke();
    } else {
      const kind = L % 4;
      if (kind === 0) { g.beginPath(); g.arc(0, my - mw * 0.6, mw, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
      else if (kind === 1) { g.beginPath(); g.ellipse(0, my + r * 0.02, mw * 0.5, mw * 0.6, 0, 0, TAU); g.fill(); }
      else if (kind === 2) {
        g.beginPath(); g.arc(-mw * 0.5, my - mw * 0.2, mw * 0.5, 0.1 * Math.PI, 0.9 * Math.PI);
        g.arc(mw * 0.5, my - mw * 0.2, mw * 0.5, 0.1 * Math.PI, 0.9 * Math.PI); g.stroke();
      } else {
        g.beginPath(); g.arc(0, my - mw * 0.6, mw, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
        g.fillStyle = "#ff6f91"; g.beginPath(); g.ellipse(mw * 0.25, my + mw * 0.45, mw * 0.32, mw * 0.42, 0, 0, TAU); g.fill();
        g.lineWidth = Math.max(1, r * 0.04); g.stroke();
      }
    }
    g.restore();
  }

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas class="main"></canvas>
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill nx"><small>next</small><canvas></canvas></div><div class="pill tm">⏱<b>2:00</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas.main"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    const nxCv = wrap.querySelector(".nx canvas"), nxG = nxCv.getContext("2d");
    const ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = svgImg(api.guineaSVG({ size: 200, mood: "happy" }));
    const gWow = svgImg(api.guineaSVG({ size: 200, mood: "wow" }));
    const bgCv = document.createElement("canvas"), bgG = bgCv.getContext("2d");

    let JH = 150;
    let W = 1, H = 1, dpr = 1, k = 3, x0 = 0, y0 = 0, WT = 7, ladY = 0, cell = 30;
    const S = {};
    let B = [];   // bodies
    let nextId = 1;

    function reset() {
      Object.assign(S, {
        state: "intro", t: 0, left: ROUND, score: 0, drops: 0, merges: 0, best: 0, megas: 0,
        aimX: JW / 2, aiming: false, held: pickLevel(), next: pickLevel(), heldPop: 1, cool: 0,
        overT: 0, warned: false, parts: [], floats: [], shake: 0, banner: null, chain: 0, chainT: 9,
        endT: 0, awarded: false, endWhy: "", lastSfx: 0, lastTick: 0, acc: 0, reached: 0, flash: 0, ladPop: -1, ladT: 0,
      });
      S.reached = Math.max(S.held, S.next);
      B = [];
      drawNext();
    }

    /* ---------- layout ---------- */
    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const HUDH = 66;
      cell = clamp((W - 24) / 10, 24, 40);
      const LADH = cell + 12;
      WT = clamp(W * 0.018, 5, 8);
      const availH = H - HUDH - LADH - WT - 14;
      k = Math.max(1, Math.min((W - 28 - WT * 2) / JW, availH / 140));
      JH = clamp(availH / k, 140, 160);
      const jh = JH * k, group = jh + WT + 10 + LADH;
      x0 = (W - JW * k) / 2;
      y0 = HUDH + 4 + Math.max(0, (H - HUDH - 4 - group) * 0.45);
      ladY = y0 + jh + WT + 10 + cell / 2 + 2;
      buildBg();
      drawNext();
    }
    const sx = (x) => x0 + x * k, sy = (y) => y0 + y * k;
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    function buildBg() {
      bgCv.width = cv.width; bgCv.height = cv.height;
      const g = bgG;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      const sk = g.createLinearGradient(0, 0, 0, H);
      sk.addColorStop(0, "#c8f7a0"); sk.addColorStop(0.55, "#86d47c"); sk.addColorStop(1, "#3f9466");
      g.fillStyle = sk; g.fillRect(0, 0, W, H);
      // far mossy hills
      g.fillStyle = "#6fc27a"; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 12; x += 12) g.lineTo(x, H * 0.42 - Math.sin(x / W * 5 + 0.6) * 18 - Math.sin(x / W * 13) * 6);
      g.lineTo(W, H); g.closePath(); g.fill(); g.stroke();
      // murky water
      const wy = H * 0.72;
      const wg = g.createLinearGradient(0, wy, 0, H);
      wg.addColorStop(0, "#4fa38a"); wg.addColorStop(1, "#2f6f5e");
      g.fillStyle = wg; g.beginPath(); g.moveTo(0, wy);
      for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, wy + Math.sin(x / 22) * 3);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill(); g.stroke();
      // lily pads
      const pads = [[0.12, 0.83, 26], [0.9, 0.79, 22], [0.78, 0.93, 30], [0.25, 0.95, 20]];
      for (const [px, py, pr] of pads) {
        g.fillStyle = "#7be04a"; g.beginPath(); g.ellipse(px * W, py * H, pr, pr * 0.42, 0, 0.25, TAU - 0.1); g.lineTo(px * W, py * H); g.closePath(); g.fill(); g.stroke();
      }
      // cattails along the sides
      const tails = [[0.04, 1], [0.09, 0.8], [0.95, 0.9], [0.985, 1.1], [0.02, 0.65]];
      for (const [tx, s] of tails) {
        const bx = tx * W, by = H * 0.78;
        const top = by - H * 0.36 * s;
        g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + 6, (by + top) / 2, bx + 2, top); g.stroke();
        g.strokeStyle = "#4fae4a"; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + 6, (by + top) / 2, bx + 2, top); g.stroke();
        g.fillStyle = "#8a4a2a"; g.strokeStyle = INK; g.lineWidth = 3;
        rr(g, bx - 5, top + 6, 13, 34 * s, 6); g.fill(); g.stroke();
      }
      // jar back glass + shadow
      const jx = x0 - WT, jy = y0 - 4, jw = JW * k + WT * 2, jh = JH * k + WT + 4;
      g.fillStyle = "rgba(43,22,64,.22)"; g.beginPath(); g.ellipse(W / 2, y0 + JH * k + WT, jw * 0.56, 12, 0, 0, TAU); g.fill();
      g.fillStyle = "rgba(230,255,240,.7)"; rr(g, x0, y0 - 4, JW * k, JH * k + 4, 10); g.fill();
      // subtle grid of goo dots on the back glass
      g.fillStyle = "rgba(123,224,74,.18)";
      for (let yy = y0 + 20; yy < y0 + JH * k; yy += 34) for (let xx = x0 + 14 + ((yy / 34) % 2) * 17; xx < x0 + JW * k; xx += 34) { g.beginPath(); g.arc(xx, yy, 3, 0, TAU); g.fill(); }
      void jx; void jy; void jw; void jh;
    }

    function drawNext() {
      const s = 36;
      nxCv.width = Math.round(s * dpr); nxCv.height = Math.round(s * dpr);
      nxG.setTransform(dpr, 0, 0, dpr, 0, 0);
      nxG.clearRect(0, 0, s, s);
      if (S.next == null) return;
      const r = 7 + S.next * 2.4;
      drawBlob(nxG, s / 2, s / 2 + 1, r, S.next, {});
    }

    /* ---------- bodies & physics ---------- */
    function addBody(L, x, y, vx, vy, r0) {
      const b = {
        id: nextId++, L, x, y, px: x, py: y, vx: vx || 0, vy: vy || 0, r: r0 || R[L], r0: r0 || R[L], rT: R[L], grow: r0 ? 0 : 1,
        asleep: false, still: 0, age: 0, sq: 0, sqv: 0, pop: 0, blinkT: rnd(1.5, 5), dead: false, merging: false,
        landed: false, lastVy: 0, lastVx: 0, touch: false, contact: false, danger: false,
      };
      B.push(b);
      return b;
    }
    function wakeAll() { for (const b of B) { b.asleep = false; b.still = 0; } }

    const mergeQ = [];
    function substep(h) {
      const n = B.length;
      for (let i = 0; i < n; i++) {
        const b = B[i];
        b.px = b.x; b.py = b.y; b.contact = false; b.touch = false;
        if (b.grow < 1) {
          b.grow = Math.min(1, b.grow + h / 0.14);
          const e = 1 - Math.pow(1 - b.grow, 3);
          b.r = lerp(b.r0, b.rT, e);
        }
        if (b.asleep) continue;
        b.vy += G * h;
        b.x += b.vx * h; b.y += b.vy * h;
      }
      for (let it = 0; it < ITER; it++) {
        for (let i = 0; i < n; i++) {
          const a = B[i]; if (a.dead) continue;
          for (let j = i + 1; j < n; j++) {
            const b = B[j]; if (b.dead) continue;
            const dx = b.x - a.x, dy = b.y - a.y, rs = a.r + b.r;
            if (dx > rs + 0.6 || dx < -rs - 0.6 || dy > rs + 0.6 || dy < -rs - 0.6) continue;
            const d2 = dx * dx + dy * dy;
            if (d2 >= (rs + 0.6) * (rs + 0.6)) continue;
            const d = Math.sqrt(d2) || 0.0001;
            // support check for sleepers: a neighbour below holds you up
            if (dy > 0) a.touch = true; else b.touch = true;
            if (a.L === b.L && d < rs + 0.25 && !a.merging && !b.merging && a.grow >= 1 && b.grow >= 1) {
              a.merging = b.merging = true; mergeQ.push([a, b]); continue;
            }
            if (d >= rs) continue;
            if (a.asleep && b.asleep) continue;
            if (a.asleep && b.vx * b.vx + b.vy * b.vy > WAKE_V * WAKE_V) { a.asleep = false; a.still = 0; }
            if (b.asleep && a.vx * a.vx + a.vy * a.vy > WAKE_V * WAKE_V) { b.asleep = false; b.still = 0; }
            const ia = a.asleep ? 0 : 1 / (a.r * a.r), ib = b.asleep ? 0 : 1 / (b.r * b.r), s = ia + ib;
            if (s === 0) continue;
            const ov2 = (rs - d) / s, nx = dx / d, ny = dy / d;
            a.x -= nx * ov2 * ia; a.y -= ny * ov2 * ia;
            b.x += nx * ov2 * ib; b.y += ny * ov2 * ib;
            a.contact = b.contact = true;
          }
        }
        for (let i = 0; i < n; i++) {
          const b = B[i];
          if (b.x < b.r) { b.x = b.r; b.contact = true; }
          else if (b.x > JW - b.r) { b.x = JW - b.r; b.contact = true; }
          if (b.y > JH - b.r) { b.y = JH - b.r; b.contact = true; }
          if (b.y >= JH - b.r - 0.6) b.touch = true;
        }
      }
      for (let i = 0; i < n; i++) {
        const b = B[i];
        if (b.asleep) {
          if (!b.touch) { b.asleep = false; b.still = 0; }
          else { b.x = b.px; b.y = b.py; continue; } // sleepers stay put (pushes only wake them)
        }
        let vx = (b.x - b.px) / h, vy = (b.y - b.py) / h;
        if (b.contact) { vx *= 0.992; vy *= 0.998; } else { vx *= 0.9995; }
        const sp2 = vx * vx + vy * vy;
        if (sp2 > VMAX * VMAX) { const f = VMAX / Math.sqrt(sp2); vx *= f; vy *= f; }
        if (vy < -160) vy = -160;
        b.vx = vx; b.vy = vy;
        if (b.contact && sp2 < SLEEP_V * SLEEP_V && b.grow >= 1) {
          b.still += h;
          if (b.still > SLEEP_T) { b.asleep = true; b.vx = b.vy = 0; }
        } else b.still = 0;
      }
      if (mergeQ.length) doMerges();
    }

    function doMerges() {
      for (const [a, b] of mergeQ) {
        if (a.dead || b.dead) continue;
        a.dead = b.dead = true;
        const ma = a.r * a.r, mb = b.r * b.r, m = ma + mb;
        const mx = (a.x * ma + b.x * mb) / m, my = (a.y * ma + b.y * mb) / m;
        if (a.L === MAXL) { megaPop(mx, my); continue; }
        const L = a.L + 1;
        const nb = addBody(L, mx, my, (a.vx * ma + b.vx * mb) / m, Math.min(0, (a.vy * ma + b.vy * mb) / m) - 45, Math.max(a.r, b.r));
        nb.pop = 1; nb.age = 2; nb.landed = true;
        mergeFx(nb, L);
      }
      mergeQ.length = 0;
      B = B.filter((b) => !b.dead);
      wakeAll();
    }

    function addPoints(p, x, y, col, big) {
      S.chain = S.chainT < 0.9 ? S.chain + 1 : 1;
      S.chainT = 0;
      const mult = Math.min(3, 1 + (S.chain - 1) * 0.5);
      const pts = Math.round(p * mult);
      S.score += pts;
      scEl.textContent = S.score; bump(scEl.parentNode);
      if (S.chain >= 2) {
        for (const f of S.floats) if (f.combo) f.t = Math.max(f.t, 0.72); // older combo text fades out fast
        floatT(x, y - 10, "+" + pts + " COMBO x" + S.chain + "!", "#ffd84d", 20 + Math.min(8, S.chain * 2));
        S.floats[S.floats.length - 1].combo = true;
      }
      else floatT(x, y - 10, "+" + pts, col, big ? 30 : 22);
    }
    function mergeFx(b, L) {
      S.merges++;
      const X = sx(b.x), Y = sy(b.y), r = R[L] * k;
      const lv = LV[L];
      goo(X, Y, [lv.c, lv.d, "#fff"], 8 + L * 2, 90 + L * 25);
      S.parts.push({ k: "ring", x: X, y: Y, r: r * 0.6, grow: r * 3, col: lv.c, life: 0.35, t: 0 });
      addPoints(PTS[L], X, Y - r, lv.c, L >= 6);
      const now = performance.now();
      if (now - S.lastSfx > 70 || L >= 6) { api.sfx("squish"); if (L >= 3) api.sfx("pop"); S.lastSfx = now; }
      api.haptic(L >= 6 ? 40 : 12);
      shake(Math.min(10, 1 + L * 1.1));
      if (L > S.reached) {
        S.reached = L; S.ladPop = L; S.ladT = 0;
        if (L >= 5) {
          banner(L === MAXL ? "MEGA PUDDING!" : "NEW: " + lv.n.toUpperCase() + "!", L === MAXL ? gName + " is a slime now?!" : pick(BIG).toLowerCase(), lv.c);
        }
      }
      if (L > S.best) S.best = L;
      if (L >= 6) { sparkle(X, Y, 10 + L * 2); api.sfx(L >= 8 ? "bigwin" : "sparkle"); }
      if (L === MAXL) {
        S.megas++;
        api.sfx("wheek"); api.sfx("fanfare");
        const [vx, vy] = vp(X, Y); api.confetti(vx, vy, 80);
        S.flash = 0.25;
      } else if (L >= 7) {
        const [vx, vy] = vp(X, Y); api.confetti(vx, vy, 30);
      } else if (Math.random() < 0.35 || L >= 4) {
        floatT(X, Y + r * 0.2, pick(SQUELCH), "#fff", 16 + Math.min(10, L * 1.5));
      }
    }
    function megaPop(x, y) {
      const X = sx(x), Y = sy(y);
      S.megas++;
      goo(X, Y, ["#fff0c2", "#c46a2a", "#ff8fc7", "#7be04a"], 50, 420);
      sparkle(X, Y, 30);
      gasPuff(X, Y, 16);
      addPoints(MEGA_POP, X, Y, "#ffd84d", true);
      banner("PUDDING PARTY!", "two megas went KABLOOP", "#ffd84d");
      api.sfx("fart"); api.sfx("bigwin"); api.haptic(80); shake(14);
      const [vx, vy] = vp(X, Y); api.confetti(vx, vy, 120); api.gas(vx, vy);
    }

    /* ---------- particles & text ---------- */
    function floatT(x, y, text, col, size) {
      size = size || 22;
      const half = text.length * size * 0.32;
      x = clamp(x, half + 6, W - half - 6);
      S.floats.push({ x, y, text, col, size, t: 0, life: 1 });
    }
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function goo(x, y, cols, n, spd) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * spd;
        S.parts.push({ k: "goo", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, g: 900, r: rnd(2.5, 6.5), col: pick(cols), life: rnd(0.45, 0.85), t: 0 });
      }
    }
    function sparkle(x, y, n) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(80, 260);
        S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120, r: rnd(5, 10), col: pick(["#ffd84d", "#fff", "#ffe98a", "#ff8fc7"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) });
      }
    }
    function gasPuff(x, y, n) {
      for (let i = 0; i < n; i++) S.parts.push({ k: "gas", x: x + rnd(-14, 14), y: y + rnd(-10, 10), vx: rnd(-70, 70), vy: rnd(-70, -10), g: -20, r: rnd(9, 16), grow: rnd(16, 30), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.8, 1.3), t: 0 });
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.15 : a); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function setTime() {
      const s = Math.max(0, Math.ceil(S.left));
      tmEl.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
      tmPill.classList.toggle("hurry", S.left <= 10 && S.state === "play");
    }

    /* ---------- UI ---------- */
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 92, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      const blob = (L, s) => `<div class="b" style="width:${s}px;height:${s}px;background:${LV[L].c};animation-delay:-${(L * 0.17).toFixed(2)}s"></div>`;
      ov.innerHTML = `<div class="panel"><div class="art">${blob(1, 26)}${blob(3, 38)}<div class="pig">${svg}</div>${blob(5, 46)}${blob(2, 30)}</div>
        <h2>${after ? (after.isNew ? "New best!" : after.why === "burp" ? "Jar burp!" : "Time's up!") : "Slime Drop"}</h2>${lastLine}
        <p><b>Drag</b> to aim, <b>let go</b> to drop. Two the <b>same size</b> squish into a bigger one!</p>
        <div class="chips"><span class="chip">🫧 Grow a Mega Pudding</span><span class="chip">⏱ 2 min</span><span class="chip">🚫 Don't fill past the line</span></div>
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
      scEl.textContent = "0"; setTime();
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      banner("SQUISH 'EM!", "drag, then let go", "#7be04a");
      api.sfx("whoosh");
    }

    /* ---------- gameplay ---------- */
    function heldClamp() { const r = R[S.held]; S.aimX = clamp(S.aimX, r + 0.5, JW - r - 0.5); }
    function drop() {
      if (S.state !== "play" || S.cool > 0 || S.held == null) return;
      heldClamp();
      const b = addBody(S.held, S.aimX + rnd(-0.05, 0.05), HELD_Y, 0, 40);
      b.sq = -0.12;
      S.drops++;
      S.held = null; S.cool = COOLDOWN;
      api.sfx("boop");
    }
    function endRound(why) {
      if (S.state !== "play") return;
      S.state = "end"; S.endT = 0; S.endWhy = why; S.aiming = false;
      hud.classList.toggle("off", false);
      tmPill.classList.remove("hurry");
      if (why === "burp") {
        banner("JAR BURP!", "too much slime!", "#b6f27a");
        api.sfx("fart"); api.haptic(120); shake(12);
        const X = sx(JW / 2), Y = sy(LINE);
        gasPuff(X, Y - 10, 22);
        const [vx, vy] = vp(X, Y); api.gas(vx, vy);
      } else {
        banner("TIME'S UP!", "what a gooey mess", "#ffd84d");
        api.sfx("fanfare");
        const [vx, vy] = vp(W / 2, H * 0.3); api.confetti(vx, vy, 50);
      }
    }
    function coinsFor(score) { return Math.min(200, Math.round(score / 25)); }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const score = S.score;
      const coins = coinsFor(score);
      const earned = coins > 0 ? api.award(coins, { reason: "Slime Drop" }) : 0;
      const hs = api.highscore(ID, score);
      const big = LV[S.best].n;
      const quip = S.megas > 0 ? `${gName} turned into a MEGA PUDDING! Wheek!` : S.best >= 7 ? `So close to a Mega Pudding! ${gName} is drooling.` : S.best >= 5 ? `${gName} poked the ${big}. Squish!` : `${gName} says: squish more, little goo!`;
      const text = `${quip} Biggest: ${big}. ${S.merges} squishes. ${hs.isNew && score > 0 ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && score > 0 ? "New best!" : S.endWhy === "burp" ? "Jar burp!" : "Time's up!", text, score });
      hud.classList.add("off");
      showPanel({ score, earned, isNew: hs.isNew && score > 0, why: S.endWhy });
    }

    function update(dt) {
      if (S.state === "play" || S.state === "end") {
        // physics, fixed timestep
        S.acc = Math.min(S.acc + dt, MAX_SUB * H_STEP);
        while (S.acc >= H_STEP) { substep(H_STEP); S.acc -= H_STEP; }
      }
      for (const b of B) {
        b.age += dt;
        // impacts -> squash
        const dvy = b.vy - b.lastVy, dvx = b.vx - b.lastVx;
        if (dvy < -60) {
          b.sqv += Math.min(10, -dvy * 0.035);
          if (!b.landed) {
            b.landed = true;
            const now = performance.now();
            if (now - S.lastSfx > 90) { api.sfx("splat"); S.lastSfx = now; }
            if (-dvy > 120) goo(sx(b.x), sy(b.y + b.r), [LV[b.L].c, LV[b.L].d], 4, 70);
          }
        }
        if (Math.abs(dvx) > 80) b.sqv -= Math.min(4, Math.abs(dvx) * 0.02);
        b.lastVy = b.vy; b.lastVx = b.vx;
        b.sqv += (-170 * b.sq - 9 * b.sqv) * dt;
        b.sq = clamp(b.sq + b.sqv * dt, -0.18, 0.2);
        b.pop = Math.max(0, b.pop - dt * 2.6);
        b.blinkT -= dt; if (b.blinkT < -0.13) b.blinkT = rnd(2, 6);
        b.danger = b.age > 1 && b.y - b.r < LINE;
      }
      if (S.state === "play") {
        S.t += dt;
        S.left -= dt;
        if (S.left <= 10 && Math.ceil(S.left) !== S.lastTick && S.left > 0) { S.lastTick = Math.ceil(S.left); api.sfx("tick"); }
        setTime();
        if (S.cool > 0) {
          S.cool -= dt;
          if (S.cool <= 0) { S.held = S.next; S.next = pickLevel(); S.heldPop = 0; drawNext(); heldClamp(); }
        }
        S.heldPop = Math.min(1, S.heldPop + dt * 4);
        // overflow
        const over = B.some((b) => b.danger);
        if (over) {
          if (!S.warned) { S.warned = true; api.sfx("buzz"); }
          S.overT += dt;
          if (S.overT >= OVER_LIMIT) endRound("burp");
        } else { S.overT = 0; S.warned = false; }
        if (S.left <= 0) { S.left = 0; setTime(); endRound("time"); }
      }
      if (S.state === "end") { S.endT += dt; if (S.endT > 2.2) finish(); }
      S.chainT += dt;
      for (const p of S.parts) {
        p.t += dt;
        if (p.k === "ring") { p.r += p.grow * dt; continue; }
        p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 1.5; }
        if (p.k === "star") p.rot += 6 * dt;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      if (S.parts.length > 400) S.parts.splice(0, S.parts.length - 400);
      for (const f of S.floats) { f.t += dt; f.y -= 46 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.9 && S.state !== "end") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 30);
      S.flash = Math.max(0, S.flash - dt);
      S.ladT += dt;
    }

    /* ---------- drawing ---------- */
    function drawStar(g, x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      for (let i = 0; i < 8; i++) { const r2 = i % 2 ? r * 0.4 : r, a = (i / 8) * TAU; g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); }
      g.closePath(); g.fill(); g.restore();
    }
    function drawJarFront() {
      const g = ctx;
      const jw = JW * k, jh = JH * k;
      // walls
      g.fillStyle = "rgba(255,255,255,.55)"; g.strokeStyle = INK; g.lineWidth = 4;
      g.beginPath();
      g.moveTo(x0 - WT, y0 - 6);
      g.lineTo(x0 - WT, y0 + jh + WT - 12);
      g.quadraticCurveTo(x0 - WT, y0 + jh + WT, x0 - WT + 12, y0 + jh + WT);
      g.lineTo(x0 + jw + WT - 12, y0 + jh + WT);
      g.quadraticCurveTo(x0 + jw + WT, y0 + jh + WT, x0 + jw + WT, y0 + jh + WT - 12);
      g.lineTo(x0 + jw + WT, y0 - 6);
      g.lineTo(x0 + jw, y0 - 6);
      g.lineTo(x0 + jw, y0 + jh);
      g.lineTo(x0, y0 + jh);
      g.lineTo(x0, y0 - 6);
      g.closePath(); g.fill(); g.stroke();
      // rim lips
      g.fillStyle = "#c7b3ff";
      rr(g, x0 - WT - 5, y0 - 13, WT + 10, 10, 5); g.fill(); g.stroke();
      rr(g, x0 + jw - 5, y0 - 13, WT + 10, 10, 5); g.fill(); g.stroke();
      // glass glints
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 5; g.lineCap = "round";
      g.beginPath(); g.moveTo(x0 + 9, y0 + jh * 0.18); g.lineTo(x0 + 9, y0 + jh * 0.5); g.stroke();
      g.beginPath(); g.moveTo(x0 + 9, y0 + jh * 0.56); g.lineTo(x0 + 9, y0 + jh * 0.62); g.stroke();
      g.beginPath(); g.moveTo(x0 + jw - 9, y0 + jh * 0.7); g.lineTo(x0 + jw - 9, y0 + jh * 0.86); g.stroke();
    }
    function drawLine() {
      const g = ctx, y = sy(LINE);
      const danger = S.overT > 0 && S.state === "play";
      const fl = danger ? (Math.sin(performance.now() / 70) > 0 ? 1 : 0.4) : 1;
      g.save();
      g.globalAlpha = fl;
      g.strokeStyle = danger ? "#ff3b5c" : "rgba(255,90,140,.8)"; g.lineWidth = danger ? 4 : 3;
      g.setLineDash([10, 8]); g.beginPath(); g.moveTo(x0 + 3, y); g.lineTo(x0 + JW * k - 3, y); g.stroke(); g.setLineDash([]);
      g.restore();
      if (danger) {
        const left = Math.max(0, OVER_LIMIT - S.overT);
        txt(g, "TOO FULL! " + left.toFixed(1), x0 + JW * k / 2, y + 18, 18, "#ff8fc7", 4.5);
      }
    }
    function drawAim() {
      if (S.state !== "play" || S.held == null) return;
      const g = ctx, x = sx(S.aimX);
      g.save();
      g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 3; g.setLineDash([4, 8]);
      g.beginPath(); g.moveTo(x, sy(HELD_Y) + R[S.held] * k); g.lineTo(x, sy(JH)); g.stroke(); g.setLineDash([]);
      g.restore();
    }
    function drawHeld() {
      if (S.held == null || S.state !== "play") return;
      const g = ctx, L = S.held, x = sx(S.aimX), y = sy(HELD_Y), r = R[L] * k;
      const p = S.heldPop, e = p < 1 ? 1 + Math.sin(p * Math.PI) * 0.25 - (1 - p) * 0.6 : 1;
      const wob = Math.sin(performance.now() / 260) * 0.04;
      // goo string to the top
      g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x, y0 - 26); g.stroke();
      g.strokeStyle = LV[L].c; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x, y0 - 26); g.stroke();
      // dropper nozzle
      g.fillStyle = "#ff8fc7"; g.strokeStyle = INK; g.lineWidth = 3;
      rr(g, x - 13, y0 - 40, 26, 16, 7); g.fill(); g.stroke();
      drawBlob(g, x, y, r * Math.max(0.2, e), L, { sx: 1 + wob, sy: 1 - wob, ly: 1, blink: false });
    }
    function drawBodies() {
      const g = ctx, now = performance.now();
      const ax = sx(S.aimX), ay = sy(HELD_Y);
      const scaredAll = S.state === "end" && S.endWhy === "burp";
      for (const b of B) {
        const X = sx(b.x), Y = sy(b.y), r = b.r * k;
        const pop = b.pop > 0 ? 1 + Math.sin((1 - b.pop) * Math.PI * 2.2) * 0.18 * b.pop : 1;
        const s = b.sq;
        let lx = ax - X, ly = ay - Y; const ll = Math.hypot(lx, ly) || 1; lx /= ll; ly /= ll;
        if (S.held == null) { lx = 0; ly = 0.3; }
        const bottom = Y + r; // squash anchored at the bottom
        const ssx = (1 + s) * pop, ssy = (1 - s) * pop;
        drawBlob(g, X, bottom - r * ssy, r, b.L, {
          sx: ssx, sy: ssy, lx, ly, blink: b.blinkT < 0, scared: b.danger || scaredAll, img: scaredAll ? gWow : gImg,
        });
      }
      void now;
    }
    function drawLadder() {
      const g = ctx;
      const total = cell * 10, lx = (W - total) / 2;
      g.fillStyle = "rgba(255,253,248,.85)"; g.strokeStyle = INK; g.lineWidth = 3;
      rr(g, lx - 6, ladY - cell / 2 - 5, total + 12, cell + 10, (cell + 10) / 2); g.fill(); g.stroke();
      for (let L = 0; L <= MAXL; L++) {
        const cx = lx + cell * (L + 0.5);
        const rr0 = cell * (0.24 + L * 0.024);
        const got = L <= S.reached;
        let sc = 1;
        if (S.ladPop === L && S.ladT < 0.6) sc = 1 + Math.sin(S.ladT / 0.6 * Math.PI) * 0.5;
        drawBlob(g, cx, ladY, rr0 * sc, L, got ? { img: gImg } : { sil: true });
        if (!got) txt(g, "?", cx, ladY + 1, Math.round(rr0 * 1.1), "#fff", 3);
      }
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state !== "end" && t > 1.6 ? 1 - (t - 1.6) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, sy(JH * 0.42)); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(42, W * 0.9 / (b.text.length * 0.66 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 17, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(bgCv, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      g.save();
      if (S.shake > 0) g.translate(rnd(-S.shake, S.shake) * 0.6, rnd(-S.shake, S.shake) * 0.6);
      drawAim();
      drawBodies();
      drawHeld();
      drawJarFront();
      drawLine();
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        if (p.k === "ring") {
          g.globalAlpha = a; g.strokeStyle = p.col; g.lineWidth = 5 * a + 1;
          g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.stroke(); continue;
        }
        g.globalAlpha = p.k === "gas" ? a * 0.75 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); if (p.k === "goo") { g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); } }
      }
      g.globalAlpha = 1;
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.7) / 0.3), s = f.t < 0.12 ? 0.5 + (f.t / 0.12) * 0.6 : 1.1 - Math.min(0.1, f.t - 0.12);
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      drawLadder();
      if (S.flash > 0) { g.fillStyle = "rgba(255,240,194," + S.flash * 2 + ")"; g.fillRect(0, 0, W, H); }
      if (S.state === "end" || S.state === "over") { g.fillStyle = "rgba(43,22,64," + Math.min(0.3, (S.state === "over" ? 2 : S.endT) * 0.3) + ")"; g.fillRect(0, 0, W, H); }
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
    function toUnits(clientX) { const r = cv.getBoundingClientRect(); return (clientX - r.left - x0) / k; }
    function onDown(e) {
      if (S.state !== "play") return;
      e.preventDefault();
      S.aiming = true; S.aimX = toUnits(e.clientX); if (S.held != null) heldClamp();
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onMove(e) {
      if (!S.aiming || S.state !== "play") return;
      S.aimX = toUnits(e.clientX); if (S.held != null) heldClamp();
    }
    function onUp(e) {
      if (!S.aiming) return;
      S.aiming = false;
      S.aimX = toUnits(e.clientX); if (S.held != null) heldClamp();
      drop();
    }
    function onCancel() { S.aiming = false; }
    function onKey(e) {
      if (S.state !== "play") return;
      if (e.key === "ArrowLeft") { S.aimX -= 4; if (S.held != null) heldClamp(); e.preventDefault(); }
      else if (e.key === "ArrowRight") { S.aimX += 4; if (S.held != null) heldClamp(); e.preventDefault(); }
      else if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); drop(); }
    }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    reset();
    resize();
    showPanel(null);
    raf = requestAnimationFrame(frame);
    wrap._slime = { S, bodies: () => B, R, JW, jh: () => JH, LINE, layout: () => ({ x0, y0, k }) }; // test hook

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKey);
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
    id: ID, name: "Slime Drop", icon: "🫧", place: "swamp", kind: "skill",
    blurb: "Drop slime blobs. Same sizes squish into bigger ones!",
    mount,
  });
})();
