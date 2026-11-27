/* Wheek World mini-game: Squishy Swap.
   A match-3 swapper. 8x8 board of squishy blobs (6 kinds, each a different colour AND shape).
   Swipe (or tap-tap) to swap neighbours; only swaps that make a line of 3+ stick, otherwise they
   wobble back. Gravity cascades build "Squishy combo xN!". Match 4 = Fart Bomb (clears 3x3 in a
   gas puff), match 5 = Rainbow Slime (swap it with a blob to clear every blob of that colour).
   No moves left = reshuffle. Hint glow after 5s idle. 70 second round.
   Pays once per round: score / 40, min 10 if she scored at all, capped at 200. */
(function () {
  "use strict";
  const ID = "squishy-swap", C = "g-sqswap";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const N = 8, ROUND = 70, HINT_AFTER = 5;
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const easeOutBack = (t) => { const c = 1.7; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; };
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // 6 kinds: colour + shape + face height
  const KINDS = [
    { name: "heart", fill: "#ff6fae", light: "#ffd0e6", shade: "#d93d84", fy: -0.08 },
    { name: "star", fill: "#ffd84d", light: "#fff6c4", shade: "#e9a300", fy: 0.1 },
    { name: "drop", fill: "#7be04a", light: "#dcffc4", shade: "#3c9f27", fy: 0.28 },
    { name: "blob", fill: "#5fd3ff", light: "#d4f5ff", shade: "#2a8fd6", fy: 0.05 },
    { name: "mochi", fill: "#b48cff", light: "#ece2ff", shade: "#7650da", fy: 0.05 },
    { name: "onigiri", fill: "#ff9f43", light: "#ffdcb4", shade: "#dc6410", fy: 0.3 },
  ];
  const SP_NONE = 0, SP_BOMB = 1, SP_RAINBOW = 2;

  const QUIPS = {
    combo: ["SQUISHY!", "so jiggly!", "wheeeek!", "slime time!", "squish squish!", "yummy goo!"],
    bomb: ["oops, that was me", "PFFFT!", "excuse me!", "smells like winning", "that one was juicy"],
    bombMade: ["ooh, a Fart Bomb!", "it's gonna blow...", "careful, it's gassy"],
    rainbow: ["RAINBOW!!", "so shiny!", "sparkle slurp!"],
    rainbowMade: ["Rainbow Slime!", "swap it with a colour!"],
    nope: ["nope!", "no match!", "wobble wobble", "try another!"],
    shuffle: ["no moves! mix mix!"],
    hint: ["psst... the glowy ones!", "try the glowy ones!"],
    start: ["let's squish!", "swipe the blobs!"],
  };

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas.main{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:8px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:6px;min-height:40px;white-space:nowrap;position:relative;overflow:hidden}
.${C} .pill b{font-weight:400;position:relative}
.${C} .pill span{position:relative}
.${C} .pill.tm{flex:0 1 150px;justify-content:center;min-width:104px}
.${C} .pill.tm i{position:absolute;left:0;top:0;bottom:0;background:var(--slime);transition:width .25s linear,background .3s;width:100%}
.${C} .pill.tm.low i{background:#ff6b6b}
.${C} .pill.tm.low{animation:${C}-throb .5s ease-in-out infinite}
.${C} .x2{background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink)}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.3);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:14px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .art{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px}
.${C} .panel .art .pig{animation:${C}-wob 1.2s ease-in-out infinite;transform-origin:50% 100%;height:78px}
.${C} .panel .art canvas{width:228px;height:42px;display:block}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:32px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--pink)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#fff4cc;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .chip.g{background:#dcffc4}.${C} .chip.r{background:#ffe0f0}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.22)}100%{transform:scale(1)}}
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
    g.lineWidth = lw || Math.max(4, size * 0.22); g.strokeStyle = INK; g.strokeText(s, x, y);
    g.fillStyle = fill; g.fillText(s, x, y);
  }

  /* ---------- piece art (unit shapes, radius ~1) ---------- */
  function shapePath(g, kind) {
    g.beginPath();
    switch (kind) {
      case 0: // heart
        g.moveTo(0, 0.98);
        g.bezierCurveTo(-0.55, 0.62, -1.08, 0.22, -1.0, -0.32);
        g.bezierCurveTo(-0.92, -0.92, -0.2, -1.02, 0, -0.5);
        g.bezierCurveTo(0.2, -1.02, 0.92, -0.92, 1.0, -0.32);
        g.bezierCurveTo(1.08, 0.22, 0.55, 0.62, 0, 0.98);
        break;
      case 1: { // chubby star
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? 0.55 : 1.05;
          pts.push([Math.cos(a) * rad, Math.sin(a) * rad + 0.06]);
        }
        g.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
        for (let i = 1; i <= 10; i++) {
          const p = pts[i % 10], q = pts[(i + 1) % 10];
          g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
        }
        break;
      }
      case 2: // slime drop
        g.moveTo(0, -1.05);
        g.bezierCurveTo(0.45, -0.55, 0.92, -0.08, 0.92, 0.34);
        g.bezierCurveTo(0.92, 0.8, 0.5, 1.0, 0, 1.0);
        g.bezierCurveTo(-0.5, 1.0, -0.92, 0.8, -0.92, 0.34);
        g.bezierCurveTo(-0.92, -0.08, -0.45, -0.55, 0, -1.05);
        break;
      case 3: // round blob
        g.arc(0, 0.02, 0.92, 0, TAU);
        break;
      case 4: // square mochi
        rr(g, -0.84, -0.8, 1.68, 1.66, 0.38);
        break;
      case 5: { // onigiri triangle
        const P = [[0, -1.08], [1.12, 0.9], [-1.12, 0.9]], r = 0.36;
        g.moveTo((P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2);
        g.arcTo(P[1][0], P[1][1], P[2][0], P[2][1], r);
        g.arcTo(P[2][0], P[2][1], P[0][0], P[0][1], r);
        g.arcTo(P[0][0], P[0][1], P[1][0], P[1][1], r);
        g.closePath();
        break;
      }
      default:
        g.arc(0, 0, 0.92, 0, TAU);
    }
  }
  function face(g, fy, s, big) {
    // eyes
    const ex = 0.3, er = big ? 0.13 : 0.115;
    g.fillStyle = INK;
    g.beginPath(); g.ellipse(-ex, fy, er, er * 1.15, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(ex, fy, er, er * 1.15, 0, 0, TAU); g.fill();
    g.fillStyle = "#fff";
    g.beginPath(); g.arc(-ex + 0.04, fy - 0.05, er * 0.38, 0, TAU); g.fill();
    g.beginPath(); g.arc(ex + 0.04, fy - 0.05, er * 0.38, 0, TAU); g.fill();
    // blush
    g.fillStyle = "rgba(255,90,140,.45)";
    g.beginPath(); g.ellipse(-0.52, fy + 0.2, 0.14, 0.08, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(0.52, fy + 0.2, 0.14, 0.08, 0, 0, TAU); g.fill();
    // mouth: little guinea "w"
    g.strokeStyle = INK; g.lineWidth = s * 0.075; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath();
    if (big) { g.moveTo(-0.2, fy + 0.18); g.quadraticCurveTo(0, fy + 0.45, 0.2, fy + 0.18); g.closePath(); g.fillStyle = "#ff5a8a"; g.fill(); g.stroke(); }
    else { g.moveTo(-0.15, fy + 0.18); g.quadraticCurveTo(-0.075, fy + 0.3, 0, fy + 0.2); g.quadraticCurveTo(0.075, fy + 0.3, 0.15, fy + 0.18); g.stroke(); }
  }
  // Render one piece into its own canvas. px = sprite size in device pixels.
  function makeSprite(kind, px) {
    const cv = document.createElement("canvas"); cv.width = cv.height = px;
    const g = cv.getContext("2d");
    const R = px * 0.385;
    g.translate(px / 2, px / 2); g.scale(R, R);
    const lw = 0.13;
    if (kind === 6) {
      // rainbow slime: conic gradient blob
      shapePath(g, 3);
      let grad;
      if (g.createConicGradient) {
        grad = g.createConicGradient(0, 0, 0);
        ["#ff6b8b", "#ffb347", "#ffe66d", "#7be04a", "#5fd3ff", "#b48cff", "#ff6b8b"].forEach((c, i, a) => grad.addColorStop(i / (a.length - 1), c));
      } else {
        grad = g.createLinearGradient(-1, -1, 1, 1);
        ["#ff6b8b", "#ffe66d", "#7be04a", "#5fd3ff", "#b48cff"].forEach((c, i, a) => grad.addColorStop(i / (a.length - 1), c));
      }
      g.fillStyle = grad; g.fill();
      const wg = g.createRadialGradient(-0.2, -0.3, 0.05, 0, 0, 1);
      wg.addColorStop(0, "rgba(255,255,255,.85)"); wg.addColorStop(0.5, "rgba(255,255,255,.2)"); wg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = wg; g.fill();
      g.lineWidth = lw; g.strokeStyle = INK; g.lineJoin = "round"; g.stroke();
      g.fillStyle = "rgba(255,255,255,.8)";
      g.beginPath(); g.ellipse(-0.42, -0.5, 0.2, 0.12, -0.6, 0, TAU); g.fill();
      face(g, 0.02, 1, true);
      return cv;
    }
    const K = KINDS[kind];
    shapePath(g, kind);
    const grad = g.createRadialGradient(-0.35, -0.45, 0.05, 0, 0.1, 1.15);
    grad.addColorStop(0, K.light); grad.addColorStop(0.45, K.fill); grad.addColorStop(1, K.shade);
    g.fillStyle = grad; g.fill();
    g.lineWidth = lw; g.strokeStyle = INK; g.lineJoin = "round"; g.stroke();
    // glossy highlight
    g.save(); shapePath(g, kind); g.clip();
    g.fillStyle = "rgba(255,255,255,.7)";
    g.beginPath(); g.ellipse(-0.38, -0.42 + (kind === 2 ? 0.25 : kind === 5 ? 0.3 : 0), 0.22, 0.12, -0.7, 0, TAU); g.fill();
    g.beginPath(); g.arc(-0.12, -0.6 + (kind === 2 ? 0.3 : kind === 5 ? 0.4 : 0), 0.05, 0, TAU); g.fill();
    g.restore();
    face(g, K.fy, 1, false);
    return cv;
  }
  // green gas ring that orbits a Fart Bomb
  function makeBombRing(px) {
    const cv = document.createElement("canvas"); cv.width = cv.height = px;
    const g = cv.getContext("2d");
    g.translate(px / 2, px / 2);
    const R = px * 0.4, r = px * 0.1;
    g.lineWidth = Math.max(2, px * 0.03); g.strokeStyle = INK;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU, rad = r * (i % 2 ? 0.8 : 1.05);
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      g.fillStyle = i % 2 ? "#9df06a" : "#6fd23e";
      g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = "rgba(255,255,255,.55)";
      g.beginPath(); g.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.3, 0, TAU); g.fill();
    }
    return cv;
  }

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas class="main"></canvas>
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill tm"><i></i><span>⏱</span><b>${ROUND}</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas.main"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), scPill = wrap.querySelector(".sc");
    const tmPill = wrap.querySelector(".tm"), tmEl = wrap.querySelector(".tm b"), tmBar = wrap.querySelector(".tm i");
    const ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 200, mood: "happy" })), wow: svgImg(api.guineaSVG({ size: 200, mood: "wow" })), sad: svgImg(api.guineaSVG({ size: 200, mood: "sad" })) };

    // layout
    let W = 1, H = 1, dpr = 1, CS = 40, BX = 0, BY = 0, BS = 320, gSize = 0, gX = 0, gY = 0;
    let sprites = [], bombRing = null, bgCanvas = null;
    let uid = 1;
    const S = { phase: "intro" };

    /* ---------- board helpers ---------- */
    const I = (c, r) => r * N + c;
    const inB = (c, r) => c >= 0 && r >= 0 && c < N && r < N;
    function newPiece(k, c, y) { return { id: uid++, k, sp: SP_NONE, x: c, y, vy: 0, sqA: 0, sqT: 9, slide: null, wob: 0, born: 0, sel: 0 }; }
    const kindAt = (grid, c, r) => { const p = grid[I(c, r)]; return p && p.sp !== SP_RAINBOW ? p.k : -1; };

    function fillBoard() {
      for (let tries = 0; tries < 200; tries++) {
        const g = new Array(N * N);
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          let k;
          do { k = (Math.random() * 6) | 0; }
          while ((c >= 2 && g[I(c - 1, r)].k === k && g[I(c - 2, r)].k === k) || (r >= 2 && g[I(c, r - 1)].k === k && g[I(c, r - 2)].k === k));
          g[I(c, r)] = newPiece(k, c, r - N - 1 - (N - r) * 0.35);
        }
        S.grid = g;
        if (findMove()) return;
      }
    }

    // all runs of 3+ in rows and columns
    function findRuns() {
      const runs = [], g = S.grid;
      for (let r = 0; r < N; r++) {
        let c = 0;
        while (c < N) {
          const k = kindAt(g, c, r); let e = c + 1;
          if (k >= 0) while (e < N && kindAt(g, e, r) === k) e++;
          if (k >= 0 && e - c >= 3) { const cells = []; for (let x = c; x < e; x++) cells.push(I(x, r)); runs.push({ cells, dir: "h", k }); }
          c = e;
        }
      }
      for (let c = 0; c < N; c++) {
        let r = 0;
        while (r < N) {
          const k = kindAt(g, c, r); let e = r + 1;
          if (k >= 0) while (e < N && kindAt(g, c, e) === k) e++;
          if (k >= 0 && e - r >= 3) { const cells = []; for (let y = r; y < e; y++) cells.push(I(c, y)); runs.push({ cells, dir: "v", k }); }
          r = e;
        }
      }
      return runs;
    }
    // does cell (c,r) sit in a 3-run in a kinds array?
    function lineAt(ks, c, r) {
      const k = ks[I(c, r)]; if (k < 0) return false;
      let n = 1;
      for (let x = c - 1; x >= 0 && ks[I(x, r)] === k; x--) n++;
      for (let x = c + 1; x < N && ks[I(x, r)] === k; x++) n++;
      if (n >= 3) return true;
      n = 1;
      for (let y = r - 1; y >= 0 && ks[I(c, y)] === k; y--) n++;
      for (let y = r + 1; y < N && ks[I(c, y)] === k; y++) n++;
      return n >= 3;
    }
    // find one valid move: [idxA, idxB] or null. Prefer a random one so hints vary.
    function findMove() {
      const g = S.grid, ks = g.map((p) => (p && p.sp !== SP_RAINBOW ? p.k : -1));
      const moves = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        for (const [dc, dr] of [[1, 0], [0, 1]]) {
          const c2 = c + dc, r2 = r + dr; if (!inB(c2, r2)) continue;
          const a = I(c, r), b = I(c2, r2), pa = g[a], pb = g[b];
          if (!pa || !pb) continue;
          if (pa.sp === SP_RAINBOW || pb.sp === SP_RAINBOW || (pa.sp === SP_BOMB && pb.sp === SP_BOMB)) { moves.push([a, b]); continue; }
          const t = ks[a]; ks[a] = ks[b]; ks[b] = t;
          if (lineAt(ks, c, r) || lineAt(ks, c2, r2)) moves.push([a, b]);
          ks[b] = ks[a]; ks[a] = t;
        }
      }
      return moves.length ? pick(moves) : null;
    }

    /* ---------- layout & sprites ---------- */
    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const top = 60, pad = 8;
      const minBottom = H > 600 ? 96 : 70;
      BS = Math.floor(Math.min(W - 2 * pad - 8, H - top - minBottom - 14, 560));
      CS = Math.floor(BS / N); BS = CS * N;
      BX = Math.round((W - BS) / 2);
      const spare = H - top - BS - 14;
      gSize = clamp(Math.min((spare - 12) / 0.85, W * 0.36), 0, 150);
      if (gSize < 56) gSize = 0;
      // centre board + guinea in the space under the HUD (biased upward)
      const used = BS + 14 + (gSize ? gSize * 0.85 + 12 : 0);
      BY = Math.round(top + 6 + Math.max(0, (H - top - 6 - used) * 0.3));
      gX = Math.max(8, BX + 4); gY = BY + BS + 18;
      const px = Math.ceil(CS * 1.2 * dpr);
      sprites = [];
      for (let k = 0; k < 7; k++) sprites.push(makeSprite(k, px));
      bombRing = makeBombRing(Math.ceil(CS * 1.05 * dpr));
      makeBg();
    }
    function makeBg() {
      bgCanvas = document.createElement("canvas"); bgCanvas.width = cv.width; bgCanvas.height = cv.height;
      const g = bgCanvas.getContext("2d"); g.scale(dpr, dpr);
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "#ffd0ea"); gr.addColorStop(0.55, "#e4d4ff"); gr.addColorStop(1, "#c7b3ff");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // carnival tent stripes fanning from the top
      g.save(); g.globalAlpha = 0.18; g.fillStyle = "#fff";
      const cx = W / 2, rays = 18;
      for (let i = 0; i < rays; i += 2) {
        const a0 = Math.PI * (i / rays), a1 = Math.PI * ((i + 1) / rays), L = Math.max(W, H) * 1.6;
        g.beginPath(); g.moveTo(cx, -40); g.lineTo(cx + Math.cos(a0) * L, -40 + Math.sin(a0) * L); g.lineTo(cx + Math.cos(a1) * L, -40 + Math.sin(a1) * L); g.fill();
      }
      g.restore();
      // polka dots
      g.fillStyle = "rgba(255,255,255,.35)";
      for (let i = 0; i < 40; i++) { const x = (i * 97.3) % W, y = (i * 61.7 + (i % 3) * 140) % H; g.beginPath(); g.arc(x, y, 3 + (i % 4), 0, TAU); g.fill(); }
      // board tray
      const p = 7;
      g.fillStyle = INK; rr(g, BX - p, BY - p + 6, BS + p * 2, BS + p * 2, 20); g.fill();
      g.fillStyle = "#fffdf8"; rr(g, BX - p, BY - p, BS + p * 2, BS + p * 2, 20); g.fill();
      g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        g.fillStyle = (r + c) % 2 ? "#f3e9ff" : "#ffeaf5";
        rr(g, BX + c * CS + 1.5, BY + r * CS + 1.5, CS - 3, CS - 3, CS * 0.22); g.fill();
      }
    }

    /* ---------- state ---------- */
    function reset() {
      Object.assign(S, {
        phase: "intro", phaseT: 0, t: 0, timeLeft: ROUND, timeUp: false, score: 0, shown: 0, combo: 0, bestCombo: 0,
        bombs: 0, rainbows: 0, cleared: 0, moves: 0, sel: -1, drag: null, swapA: -1, swapB: -1, idleT: 0, hint: null,
        parts: [], floats: [], banners: [], dying: [], shake: 0, flash: 0, bubble: null, mood: "happy", moodT: 0,
        pigHop: 0, awarded: false, lastTick: 99, grid: null,
      });
      fillBoard();
    }

    function vp(x, y) { const b = cv.getBoundingClientRect(); return [b.left + x, b.top + y]; }
    const cellX = (c) => BX + (c + 0.5) * CS, cellY = (r) => BY + (r + 0.5) * CS;
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function say(list, mood, force) {
      if (!gSize) return;
      if (!force && S.bubble && S.bubble.t < 0.8) return;
      S.bubble = { text: typeof list === "string" ? list : pick(list), t: 0 };
      if (mood) { S.mood = mood; S.moodT = 1.6; }
      S.pigHop = 1;
    }
    // one banner at a time; a less important one can't stomp a fresh important one
    function banner(text, sub, color, pri) {
      pri = pri || 1;
      const cur = S.banners[0];
      if (cur && cur.pri > pri && cur.t < 0.7) return;
      S.banners = [{ text, sub, color, pri, t: 0 }];
    }
    function addScore(n, x, y, col) {
      S.score += n;
      S.floats.push({ x, y, text: "+" + n, col: col || "#fff", t: 0 });
      bump(scPill);
    }
    function setHud() {
      scEl.textContent = S.shown;
      const tl = Math.max(0, Math.ceil(S.timeLeft));
      tmEl.textContent = tl;
      tmBar.style.width = (100 * clamp(S.timeLeft / ROUND, 0, 1)).toFixed(1) + "%";
      tmPill.classList.toggle("low", S.timeLeft <= 10 && S.phase !== "intro" && S.phase !== "over");
    }

    /* ---------- UI ---------- */
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 92, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><div class="pig">${svg}</div><canvas width="456" height="84"></canvas></div>
        <h2>${after ? (after.isNew ? "New best!" : "Squish again?") : "Squishy Swap"}</h2>${lastLine}
        <p><b>Swipe</b> a blob to swap it with its neighbour. Line up <b>3 or more</b> of the same blob to squish them!</p>
        <div class="chips"><span class="chip g">4 in a row = 💨 Fart Bomb</span><span class="chip r">5 in a row = 🌈 Rainbow Slime</span><span class="chip">⏱ ${ROUND} seconds</span></div>
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      // little row of blobs
      const pc = ov.querySelector(".art canvas"), pg = pc.getContext("2d");
      for (let k = 0; k < 6; k++) { const sp = makeSprite(k, 90); pg.drawImage(sp, k * 76 - 7, -3); }
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.phase = "fall"; // pieces drop in
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; hud.insertBefore(x2El, tmPill); }
      setHud();
      banner("SQUISH!", "swipe to swap", "#ffd84d");
      say(QUIPS.start, "wow", true);
      api.sfx("whoosh");
    }

    /* ---------- moves ---------- */
    function isPlaying() { return S.phase !== "intro" && S.phase !== "ending" && S.phase !== "over"; }
    function adjacent(a, b) { const ac = a % N, ar = (a / N) | 0, bc = b % N, br = (b / N) | 0; return Math.abs(ac - bc) + Math.abs(ar - br) === 1; }
    function trySwap(a, b) {
      if (S.phase !== "idle" || S.timeUp) return false;
      const g = S.grid, pa = g[a], pb = g[b];
      if (!pa || !pb) return false;
      S.sel = -1; S.hint = null; S.idleT = 0;
      g[a] = pb; g[b] = pa;
      pa.slide = { fx: pa.x, fy: pa.y, t: 0, d: 0.15 };
      pb.slide = { fx: pb.x, fy: pb.y, t: 0, d: 0.15 };
      S.swapA = a; S.swapB = b; S.phase = "swap";
      api.sfx("boop");
      return true;
    }
    function evaluateSwap() {
      const g = S.grid, a = S.swapA, b = S.swapB, pa = g[a], pb = g[b];
      S.combo = 0;
      // specials activated by the swap itself
      if (pa.sp === SP_RAINBOW || pb.sp === SP_RAINBOW) {
        S.moves++;
        const rb = pa.sp === SP_RAINBOW ? a : b, other = rb === a ? b : a, po = g[other];
        const set = new Set([rb]);
        if (po.sp === SP_RAINBOW) {
          for (let i = 0; i < N * N; i++) if (g[i]) set.add(i);
          banner("MEGA SLIME!", "the whole board!", "#c7b3ff", 5);
        } else {
          for (let i = 0; i < N * N; i++) if (g[i] && g[i].sp !== SP_RAINBOW && g[i].k === po.k) set.add(i);
          banner("RAINBOW SLURP!", "bye bye " + KINDS[po.k].name + "s!", "#5fd3ff", 5);
        }
        S.rainbows++;
        api.sfx("sparkle"); api.sfx("bigwin"); api.haptic(40);
        const [vx, vy] = vp(cellX(rb % N), cellY((rb / N) | 0)); api.confetti(vx, vy, 50);
        say(QUIPS.rainbow, "wow", true);
        S.combo = 1;
        applyClear(set, [], new Set([rb]), 150);
        return;
      }
      if (pa.sp === SP_BOMB && pb.sp === SP_BOMB) {
        S.moves++;
        const set = new Set([a, b]);
        const bc = b % N, br = (b / N) | 0;
        for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) if (inB(bc + dc, br + dr)) set.add(I(bc + dc, br + dr));
        banner("DOUBLE FART!", "PFFFFFFFT!", "#7be04a", 5);
        S.combo = 1;
        bigGas(bc, br, 2);
        applyClear(set, [], new Set([a, b]), 150);
        return;
      }
      const runs = findRuns();
      if (!runs.length) {
        // wobble back
        g[a] = pb; g[b] = pa;
        for (const i of [a, b]) { const p = g[i]; p.slide = { fx: p.x, fy: p.y, t: 0, d: 0.2 }; p.wob = 1; }
        S.phase = "back";
        api.sfx("squish"); api.haptic(10);
        if (Math.random() < 0.5) say(QUIPS.nope, "sad");
        return;
      }
      S.moves++;
      resolveRuns(runs, [a, b]);
    }

    // runs -> cleared cells + special creations
    function resolveRuns(runs, swapCells) {
      S.combo++;
      const g = S.grid, set = new Set(), creations = [], used = new Set(), hits = new Map();
      for (const run of runs) for (const i of run.cells) { set.add(i); hits.set(i, (hits.get(i) || 0) + 1); }
      const choose = (cells) => {
        const pref = swapCells ? cells.filter((i) => swapCells.includes(i)) : [];
        const pool = (pref.length ? pref : cells).filter((i) => !used.has(i) && g[i] && g[i].sp === SP_NONE);
        if (pool.length) return pref.length ? pool[0] : pool[(pool.length / 2) | 0];
        const any = cells.filter((i) => !used.has(i) && g[i] && g[i].sp === SP_NONE);
        return any.length ? any[(any.length / 2) | 0] : -1;
      };
      const runDone = new Set();
      // 5+ in a line -> rainbow
      runs.forEach((run, ri) => {
        if (run.cells.length >= 5) { const c = choose(run.cells); if (c >= 0) { creations.push({ i: c, sp: SP_RAINBOW, k: run.k }); used.add(c); runDone.add(ri); } }
      });
      // L / T shapes -> bomb at the corner
      for (const [i, n] of hits) {
        if (n < 2 || used.has(i) || !g[i] || g[i].sp !== SP_NONE) continue;
        const rs = runs.map((r, ri) => (r.cells.includes(i) ? ri : -1)).filter((ri) => ri >= 0);
        if (rs.some((ri) => runDone.has(ri))) continue;
        creations.push({ i, sp: SP_BOMB, k: g[i].k }); used.add(i); rs.forEach((ri) => runDone.add(ri));
      }
      // 4 in a line -> bomb
      runs.forEach((run, ri) => {
        if (runDone.has(ri) || run.cells.length !== 4) return;
        const c = choose(run.cells); if (c >= 0) { creations.push({ i: c, sp: SP_BOMB, k: run.k }); used.add(c); runDone.add(ri); }
      });
      applyClear(set, creations, new Set(), 0);
    }

    function bigGas(c, r, rad) {
      const x = cellX(c), y = cellY(r);
      for (let i = 0; i < 14 + rad * 6; i++) {
        const a = rnd(0, TAU), sp = rnd(30, 110) * rad;
        S.parts.push({ type: "gas", x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 20, r: rnd(CS * 0.25, CS * 0.5) * (rad > 1 ? 1.3 : 1), life: 0, max: rnd(0.7, 1.2), col: pick(["#9df06a", "#7be04a", "#b6f58e", "#6fd23e"]) });
      }
      S.parts.push({ type: "ring", x, y, r: CS * 0.3, R: CS * (rad + 1) * 1.1, life: 0, max: 0.45, col: "#7be04a" });
      const [vx, vy] = vp(x, y); api.gas(vx, vy);
      api.sfx("fart"); api.haptic(60); shake(9 + rad * 3);
      S.flash = 0.35;
    }

    // remove the cells in `set` (with bomb/rainbow chain reactions), make new specials, score it
    function applyClear(set, creations, processed, bonus) {
      const g = S.grid, keep = new Set(creations.map((c) => c.i));
      for (const i of keep) set.delete(i);
      const queue = [...set].filter((i) => g[i] && g[i].sp !== SP_NONE && !processed.has(i));
      let bombsHit = 0, rainbowsHit = 0;
      while (queue.length) {
        const i = queue.shift(); if (processed.has(i)) continue; processed.add(i);
        const p = g[i]; if (!p) continue;
        const c = i % N, r = (i / N) | 0;
        if (p.sp === SP_BOMB) {
          bombsHit++;
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const j = I(c + dc, r + dr); if (!inB(c + dc, r + dr) || keep.has(j) || !g[j]) continue;
            if (!set.has(j)) { set.add(j); if (g[j].sp !== SP_NONE) queue.push(j); }
          }
          bigGas(c, r, 1);
        } else if (p.sp === SP_RAINBOW) {
          // caught in a blast: slurp the most common colour
          rainbowsHit++;
          const cnt = [0, 0, 0, 0, 0, 0];
          g.forEach((q, j) => { if (q && q.sp !== SP_RAINBOW && !set.has(j)) cnt[q.k]++; });
          const k = cnt.indexOf(Math.max(...cnt));
          g.forEach((q, j) => { if (q && q.sp !== SP_RAINBOW && q.k === k && !keep.has(j) && !set.has(j)) { set.add(j); if (q.sp !== SP_NONE) queue.push(j); } });
          api.sfx("sparkle");
        }
      }
      if (bombsHit) { S.bombs += bombsHit; banner(bombsHit > 1 ? "FART CHAIN x" + bombsHit + "!" : pick(["PFFFFT!", "PEE-YEW!", "PFFRRRT!"]), bombsHit > 1 ? "so gassy!" : "fart bomb blast!", "#7be04a", 4); say(QUIPS.bomb, "wow", true); }
      if (rainbowsHit) S.rainbows += rainbowsHit;

      // score
      const n = set.size;
      let pts = n * 10 * S.combo + bombsHit * 40 + rainbowsHit * 80 + bonus;
      if (n >= 6) pts += (n - 5) * 5;
      let sx = 0, sy = 0;
      for (const i of set) {
        const p = g[i]; if (!p) continue;
        const x = cellX(i % N), y = cellY((i / N) | 0); sx += x; sy += y;
        const col = KINDS[p.k] ? KINDS[p.k].fill : "#fff";
        S.dying.push({ p, x, y, t: 0 });
        for (let j = 0; j < 5; j++) {
          const a = rnd(0, TAU), sp = rnd(60, 220);
          S.parts.push({ type: "drop", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, r: rnd(CS * 0.06, CS * 0.13), life: 0, max: rnd(0.45, 0.8), col });
        }
        S.parts.push({ type: "splat", x, y, r: CS * 0.2, R: CS * 0.62, life: 0, max: 0.28, col });
        g[i] = null;
      }
      S.cleared += n;
      if (n) addScore(pts, sx / n, sy / n, S.combo >= 2 ? "#ffd84d" : "#fff");

      // new specials
      for (const cr of creations) {
        const p = g[cr.i]; if (!p) continue;
        p.sp = cr.sp; if (cr.sp === SP_RAINBOW) p.k = 6; p.born = 1; p.sqA = 0.35; p.sqT = 0;
        const x = cellX(cr.i % N), y = cellY((cr.i / N) | 0);
        for (let j = 0; j < 10; j++) { const a = (j / 10) * TAU; S.parts.push({ type: "star", x, y, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150, r: CS * 0.12, life: 0, max: 0.6, col: cr.sp === SP_RAINBOW ? pick(["#ff6b8b", "#ffe66d", "#5fd3ff", "#7be04a"]) : "#9df06a" }); }
        if (cr.sp === SP_RAINBOW) { banner("RAINBOW SLIME!", "swap it with any blob!", "#ff8fc7", 3); say(QUIPS.rainbowMade, "wow", true); api.sfx("bigwin"); const [vx, vy] = vp(x, y); api.confetti(vx, vy, 30); }
        else { banner("FART BOMB!", "match it to blow!", "#9df06a", 3); say(QUIPS.bombMade, "wow", true); api.sfx("sparkle"); }
      }

      // sounds / combo juice
      if (S.combo >= 2) {
        S.bestCombo = Math.max(S.bestCombo, S.combo);
        banner("Squishy combo x" + S.combo + "!", S.combo >= 4 ? "UNSTOPPABLE GOO!" : S.combo >= 3 ? "so squishy!" : "", ["#ffd84d", "#ff8fc7", "#5fd3ff", "#c7b3ff"][S.combo % 4], 2 + Math.min(S.combo, 4) * 0.5);
        api.sfx(S.combo >= 3 ? "sparkle" : "squish");
        if (S.combo >= 3) { say(QUIPS.combo, "wow"); api.sfx("wheek"); }
        api.haptic(20 + S.combo * 8);
        shake(3 + S.combo);
      } else if (!bombsHit) {
        api.sfx(n >= 4 ? "squish" : "pop"); api.haptic(12);
      }
      S.phase = "clear"; S.phaseT = bombsHit || rainbowsHit || bonus ? 0.32 : 0.2;
    }

    // gravity: compact columns, drop new blobs from above
    function collapse() {
      const g = S.grid;
      for (let c = 0; c < N; c++) {
        let w = N - 1;
        for (let r = N - 1; r >= 0; r--) {
          const p = g[I(c, r)];
          if (p) { if (w !== r) { g[I(c, w)] = p; g[I(c, r)] = null; } w--; }
        }
        const missing = w + 1;
        for (let r = w; r >= 0; r--) {
          g[I(c, r)] = newPiece((Math.random() * 6) | 0, c, r - missing - 0.4);
        }
      }
      S.phase = "fall";
    }
    function afterSettle() {
      const runs = findRuns();
      if (runs.length) { resolveRuns(runs, null); return; }
      S.combo = 0;
      if (S.timeUp) { endRound(); return; }
      if (!findMove()) { shuffle(); return; }
      S.phase = "idle"; S.idleT = 0; S.hint = null;
    }
    function shuffle() {
      const g = S.grid, pieces = g.filter(Boolean);
      for (let tries = 0; tries < 300; tries++) {
        for (let i = pieces.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = pieces[i]; pieces[i] = pieces[j]; pieces[j] = t; }
        pieces.forEach((p, i) => { g[i] = p; });
        if (tries > 150) pieces.forEach((p) => { if (p.sp === SP_NONE) p.k = (Math.random() * 6) | 0; });
        if (!findRuns().length && findMove()) break;
      }
      for (const p of pieces) { p.slide = { fx: p.x, fy: p.y, t: 0, d: 0.55 }; p.wob = 0.6; }
      banner("NO MOVES!", "shuffle shuffle!", "#5fd3ff", 5);
      say(QUIPS.shuffle, "wow", true);
      api.sfx("whoosh");
      S.phase = "shuffle";
    }
    function endRound() {
      S.phase = "ending"; S.phaseT = 1.7; S.sel = -1; S.hint = null;
      banner("TIME'S UP!", S.score + " points!", "#ff8fc7", 9);
      say(S.score > 3000 ? "I'm so squishy happy!" : "phew, sticky paws!", "happy", true);
      api.sfx("fanfare");
      const [vx, vy] = vp(W / 2, BY + BS * 0.4); api.confetti(vx, vy, 60);
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.phase = "over";
      S.shown = S.score; setHud();
      const sc = S.score;
      const coins = sc > 0 ? Math.min(200, Math.max(10, Math.round(sc / 40))) : 0;
      const earned = coins > 0 ? api.award(coins, { reason: "Squishy Swap" }) : 0;
      const hs = api.highscore(ID, sc);
      const quip = sc >= 6000 ? `${gName} is the Squish Champion of the carnival!` : sc >= 3500 ? `${gName} is covered in happy slime!` : sc >= 1500 ? `${gName} squished a LOT of blobs!` : sc > 0 ? `${gName} says: more squishing next time!` : `${gName} is waiting to squish!`;
      const text = `${quip} ${S.cleared} blobs squished${S.bestCombo >= 2 ? `, best combo x${S.bestCombo}` : ""}${S.bombs ? `, ${S.bombs} fart bomb${S.bombs === 1 ? "" : "s"}` : ""}. ${hs.isNew && sc > 0 ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && sc > 0 ? "New best!" : "Time's up!", text, score: sc });
      hud.classList.add("off");
      showPanel({ score: sc, earned, isNew: hs.isNew && sc > 0 });
    }

    /* ---------- update ---------- */
    function updatePieces(dt) {
      const g = S.grid; let moving = false;
      if (!g) return false;
      for (let r = N - 1; r >= 0; r--) for (let c = 0; c < N; c++) {
        const p = g[I(c, r)]; if (!p) continue;
        if (p.slide) {
          const s = p.slide; s.t += dt / s.d;
          const e = s.d > 0.3 ? easeInOut(Math.min(1, s.t)) : easeOutBack(Math.min(1, s.t));
          p.x = lerp(s.fx, c, e); p.y = lerp(s.fy, r, e);
          if (s.t >= 1) { p.slide = null; p.x = c; p.y = r; }
          moving = true;
        } else if (p.y < r) {
          p.x = c;
          // don't fall through the piece below while it is still falling
          const below = r + 1 < N ? g[I(c, r + 1)] : null;
          p.vy = Math.min(26, p.vy + 75 * dt);
          let ny = p.y + p.vy * dt;
          if (below && below.y < r + 1 && ny > below.y - 1) ny = below.y - 1;
          p.y = ny;
          if (p.y >= r) {
            p.y = r; p.sqA = Math.min(0.32, 0.06 + p.vy * 0.016); p.sqT = 0; p.vy = 0;
          }
          moving = true;
        } else { p.x = c; p.y = r; }
        p.sqT += dt;
        if (p.wob > 0) p.wob = Math.max(0, p.wob - dt * 2.2);
        if (p.born > 0) p.born = Math.max(0, p.born - dt * 2);
      }
      return moving;
    }

    function update(dt) {
      S.t += dt;
      const playing = isPlaying();
      if (playing && S.phase !== "intro") {
        S.timeLeft -= dt;
        if (S.timeLeft <= 5 && S.timeLeft > 0) {
          const s = Math.ceil(S.timeLeft);
          if (s !== S.lastTick) { S.lastTick = s; api.sfx("tick"); }
        }
        if (S.timeLeft <= 0 && !S.timeUp) { S.timeLeft = 0; S.timeUp = true; S.sel = -1; S.hint = null; }
      }
      const moving = updatePieces(dt);
      switch (S.phase) {
        case "swap": if (!moving) evaluateSwap(); break;
        case "back": if (!moving) { if (S.timeUp) endRound(); else { S.phase = "idle"; S.idleT = 0; } } break;
        case "clear": S.phaseT -= dt; if (S.phaseT <= 0) collapse(); break;
        case "fall": if (!moving) afterSettle(); break;
        case "shuffle": if (!moving) afterSettle(); break;
        case "idle":
          if (S.timeUp) { endRound(); break; }
          S.idleT += dt;
          if (S.idleT > HINT_AFTER && !S.hint) { S.hint = findMove(); if (S.hint) say(QUIPS.hint, null); }
          break;
        case "ending": S.phaseT -= dt; if (S.phaseT <= 0) finish(); break;
      }
      // score ticker
      if (S.shown < S.score) S.shown = Math.min(S.score, S.shown + Math.max(3, Math.ceil((S.score - S.shown) * dt * 8)));
      // fx
      for (const d of S.dying) d.t += dt;
      S.dying = S.dying.filter((d) => d.t < 0.25);
      for (const p of S.parts) {
        p.life += dt;
        if (p.type === "drop" || p.type === "star") { p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
        else if (p.type === "gas") { p.vx *= 1 - 2.5 * dt; p.vy = p.vy * (1 - 2.5 * dt) - 25 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      }
      S.parts = S.parts.filter((p) => p.life < p.max);
      if (S.parts.length > 500) S.parts.splice(0, S.parts.length - 500);
      for (const f of S.floats) f.t += dt;
      S.floats = S.floats.filter((f) => f.t < 1);
      for (const b of S.banners) b.t += dt;
      S.banners = S.banners.filter((b) => b.t < 1.3);
      if (S.bubble) { S.bubble.t += dt; if (S.bubble.t > 2.2) S.bubble = null; }
      if (S.moodT > 0) { S.moodT -= dt; if (S.moodT <= 0) S.mood = "happy"; }
      S.pigHop = Math.max(0, S.pigHop - dt * 2.5);
      S.shake = Math.max(0, S.shake - dt * 30);
      S.flash = Math.max(0, S.flash - dt);
      setHud();
    }

    /* ---------- draw ---------- */
    function drawPiece(p, cx, cy, scale, alpha) {
      const spr = sprites[p.sp === SP_RAINBOW ? 6 : p.k]; if (!spr) return;
      // squash and stretch on landing (anchored to the bottom)
      const s = p.sqA * Math.exp(-p.sqT * 8) * Math.cos(p.sqT * 24);
      let sx = 1 + s, sy = 1 - s;
      if (p.born > 0) { const b = 1 + Math.sin(p.born * Math.PI) * 0.35; sx *= b; sy *= b; }
      // gentle idle breathing
      const br = Math.sin(S.t * 3 + p.id * 0.7) * 0.025;
      sx *= 1 + br; sy *= 1 - br;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy + CS * 0.42 * scale);
      if (p.wob > 0) ctx.rotate(Math.sin(S.t * 40) * p.wob * 0.3);
      ctx.scale(sx * scale, sy * scale);
      if (p.sp === SP_RAINBOW) { ctx.translate(0, -CS * 0.42); ctx.rotate(Math.sin(S.t * 3) * 0.25); ctx.translate(0, CS * 0.42); }
      ctx.drawImage(spr, -CS * 0.6, -CS * 1.02, CS * 1.2, CS * 1.2);
      ctx.restore();
      if (p.sp === SP_BOMB && bombRing) {
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.translate(cx, cy); ctx.rotate(S.t * 1.6); const k = scale * (1 + Math.sin(S.t * 6) * 0.05);
        ctx.scale(k, k);
        const rs = CS * 1.05; ctx.drawImage(bombRing, -rs / 2, -rs / 2, rs, rs);
        ctx.restore();
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (bgCanvas) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bgCanvas, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      const shx = S.shake ? rnd(-S.shake, S.shake) : 0, shy = S.shake ? rnd(-S.shake, S.shake) : 0;
      ctx.translate(shx, shy);
      const g = S.grid;
      if (g) {
        // hint glow
        if (S.hint && S.phase === "idle") {
          const pulse = 0.5 + 0.5 * Math.sin(S.t * 7);
          for (const i of S.hint) {
            const x = cellX(i % N), y = cellY((i / N) | 0);
            ctx.save();
            ctx.fillStyle = `rgba(255,236,120,${0.35 + pulse * 0.45})`;
            rr(ctx, x - CS / 2 + 1, y - CS / 2 + 1, CS - 2, CS - 2, CS * 0.25); ctx.fill();
            ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,170,0,${0.5 + pulse * 0.5})`; ctx.stroke();
            ctx.restore();
          }
        }
        // selection
        if (S.sel >= 0) {
          const x = cellX(S.sel % N), y = cellY((S.sel / N) | 0), k = 1 + Math.sin(S.t * 9) * 0.05;
          ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
          ctx.fillStyle = "rgba(255,255,255,.85)"; rr(ctx, -CS / 2 + 1, -CS / 2 + 1, CS - 2, CS - 2, CS * 0.25); ctx.fill();
          ctx.lineWidth = 3.5; ctx.strokeStyle = INK; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -S.t * 20; ctx.stroke();
          ctx.restore();
        }
        ctx.save();
        ctx.beginPath(); ctx.rect(BX - 6, BY - 2, BS + 12, BS + 10); ctx.clip();
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          const p = g[I(c, r)]; if (!p) continue;
          if (p.y < -1) continue;
          let scale = 0.97;
          if (S.sel === I(c, r)) scale = 1.04 + Math.sin(S.t * 12) * 0.04;
          if (S.hint && S.phase === "idle" && S.hint.includes(I(c, r))) scale = 0.95 + Math.sin(S.t * 7) * 0.06;
          drawPiece(p, BX + (p.x + 0.5) * CS, BY + (p.y + 0.5) * CS, scale, 1);
        }
        // dying (popping) pieces
        for (const d of S.dying) {
          const k = d.t / 0.25;
          drawPiece(d.p, d.x, d.y, 0.97 * (1 + k * 0.5), 1 - k);
        }
        ctx.restore();
      }
      // particles
      for (const p of S.parts) {
        const k = p.life / p.max;
        ctx.save();
        if (p.type === "drop") {
          ctx.globalAlpha = 1 - k * k; ctx.fillStyle = p.col; ctx.strokeStyle = INK; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - k * 0.4), 0, TAU); ctx.fill(); ctx.stroke();
        } else if (p.type === "star") {
          ctx.globalAlpha = 1 - k; ctx.translate(p.x, p.y); ctx.rotate(p.life * 6);
          ctx.fillStyle = p.col; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath();
          for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5, rad = i % 2 ? p.r * 0.45 : p.r; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
          ctx.closePath(); ctx.fill(); ctx.stroke();
        } else if (p.type === "gas") {
          ctx.globalAlpha = 0.85 * (1 - k); ctx.fillStyle = p.col; ctx.strokeStyle = "rgba(43,22,64,.5)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.6 + k * 0.9), 0, TAU); ctx.fill(); ctx.stroke();
        } else if (p.type === "ring" || p.type === "splat") {
          ctx.globalAlpha = 1 - k; ctx.strokeStyle = p.col; ctx.lineWidth = p.type === "ring" ? 8 * (1 - k) + 2 : 4 * (1 - k) + 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, lerp(p.r, p.R, Math.sqrt(k)), 0, TAU); ctx.stroke();
        }
        ctx.restore();
      }
      if (S.flash > 0) { ctx.fillStyle = `rgba(157,240,106,${S.flash * 0.6})`; ctx.fillRect(-20, -20, W + 40, H + 40); }
      // score floats
      for (const f of S.floats) {
        const k = f.t, sc = k < 0.15 ? k / 0.15 : 1;
        ctx.save(); ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
        ctx.translate(f.x, f.y - k * 50); ctx.scale(sc, sc);
        txt(ctx, f.text, 0, 0, Math.round(CS * 0.55), f.col);
        ctx.restore();
      }
      // guinea + speech bubble
      if (gSize && S.phase !== "intro" && S.phase !== "over") drawGuinea();
      // banners
      S.banners.forEach((b) => {
        const k = b.t, sc = k < 0.2 ? easeOutBack(k / 0.2) : 1, a = k > 1.0 ? (1.3 - k) / 0.3 : 1;
        const y = BY + BS * 0.42 - k * 14;
        let size = 46;
        ctx.font = size + "px " + FONT;
        const tw = ctx.measureText(b.text).width + size * 0.3;
        if (tw > W - 28) size = Math.floor(size * (W - 28) / tw);
        ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(W / 2, y); ctx.scale(sc, sc); ctx.rotate(-0.04);
        txt(ctx, b.text, 0, 0, size, b.color, Math.max(6, size * 0.24));
        if (b.sub) txt(ctx, b.sub, 0, size * 0.85, Math.round(size * 0.45), "#fff", Math.max(4, size * 0.13));
        ctx.restore();
      });
    }
    function drawGuinea() {
      const mood = S.phase === "ending" ? "happy" : S.mood;
      const img = gImg[mood] && gImg[mood].complete ? gImg[mood] : gImg.happy;
      const hop = Math.sin(S.pigHop * Math.PI) * 14;
      const bob = Math.sin(S.t * 2.5) * 2;
      const w = gSize, h = gSize * 0.85;
      ctx.save();
      ctx.translate(gX + w / 2, gY + h - hop + bob);
      const sq = 1 + Math.sin(S.t * 2.5) * 0.02;
      ctx.scale(sq, 2 - sq);
      if (img.complete && img.naturalWidth) ctx.drawImage(img, -w / 2, -h, w, h);
      ctx.restore();
      if (S.bubble) {
        const b = S.bubble, k = b.t < 0.15 ? easeOutBack(b.t / 0.15) : 1, a = b.t > 1.9 ? (2.2 - b.t) / 0.3 : 1;
        const fs = clamp(Math.round(gSize * 0.17), 14, 20);
        ctx.font = fs + "px " + FONT;
        const tw = ctx.measureText(b.text).width;
        const maxW = W - (gX + w + 10) - 10;
        const bw = Math.min(maxW, tw + 24), bh = fs + 18;
        const bx = gX + w + 6, by = gY + h * 0.2;
        ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
        ctx.translate(bx, by + bh / 2); ctx.scale(k, k); ctx.translate(-bx, -(by + bh / 2));
        ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 3;
        rr(ctx, bx, by, bw, bh, 14); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + 2, by + bh * 0.55); ctx.lineTo(bx - 10, by + bh * 0.85); ctx.lineTo(bx + 4, by + bh * 0.8); ctx.fill();
        ctx.beginPath(); ctx.moveTo(bx + 0.5, by + bh * 0.55); ctx.lineTo(bx - 10, by + bh * 0.85); ctx.lineTo(bx + 2, by + bh * 0.82); ctx.stroke();
        ctx.fillStyle = INK; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        let s = b.text; while (ctx.measureText(s).width > bw - 20 && s.length > 3) s = s.slice(0, -2) + "…";
        ctx.fillText(s, bx + 12, by + bh / 2 + 1);
        ctx.restore();
      }
    }

    /* ---------- input ---------- */
    function cellFrom(e) {
      const b = cv.getBoundingClientRect();
      const x = e.clientX - b.left - BX, y = e.clientY - b.top - BY;
      const c = Math.floor(x / CS), r = Math.floor(y / CS);
      return { c, r, x: e.clientX, y: e.clientY, ok: inB(c, r) };
    }
    function onDown(e) {
      e.preventDefault();
      if (!isPlaying() || S.timeUp) return;
      const h = cellFrom(e);
      if (!h.ok) { S.sel = -1; return; }
      S.idleT = 0; if (S.hint) S.hint = null;
      S.drag = { id: e.pointerId, c: h.c, r: h.r, x: h.x, y: h.y, moved: false };
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onMove(e) {
      const d = S.drag; if (!d || d.id !== e.pointerId || d.moved) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < CS * 0.32) return;
      d.moved = true;
      let tc = d.c, tr = d.r;
      if (Math.abs(dx) > Math.abs(dy)) tc += dx > 0 ? 1 : -1; else tr += dy > 0 ? 1 : -1;
      if (inB(tc, tr)) { if (!trySwap(I(d.c, d.r), I(tc, tr))) S.sel = I(d.c, d.r); }
    }
    function onUp(e) {
      const d = S.drag; if (!d || d.id !== e.pointerId) return;
      S.drag = null;
      if (d.moved || !isPlaying() || S.timeUp) return;
      const i = I(d.c, d.r);
      if (S.sel >= 0 && adjacent(S.sel, i)) { const a = S.sel; if (!trySwap(a, i)) S.sel = i; }
      else if (S.sel === i) S.sel = -1;
      else { S.sel = i; api.sfx("click"); const p = S.grid[i]; if (p) { p.sqA = 0.15; p.sqT = 0; } }
    }
    function onCancel(e) { if (S.drag && S.drag.id === e.pointerId) S.drag = null; }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onCancel);

    let raf = 0, last = 0, alive = true;
    function frame(t) {
      if (!alive) return;
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);
    // test hook
    wrap._sq = { S, findMove, cell: (i) => { const b = cv.getBoundingClientRect(); return [b.left + cellX(i % N), b.top + cellY((i / N) | 0)]; }, CS: () => CS };

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
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
    id: ID, name: "Squishy Swap", icon: "🍡", place: "carnival", kind: "skill",
    blurb: "Swap squishy blobs, make matches, set off fart bombs!",
    mount,
  });
})();
