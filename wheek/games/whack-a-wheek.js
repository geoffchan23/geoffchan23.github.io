/* Wheek World mini-game: Whack-a-Wheek.
   Guineas pop out of hay piles: boop them! Don't boop the grumpy cat or the stinky skunk. */
(function () {
  "use strict";
  const ID = "whack-a-wheek", C = "g-whack";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 45;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const easeOutBack = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

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
    r = Math.min(r, w / 2, h / 2);
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

  /* ---------- character art: 200 x 170 boxes like the guinea svg ---------- */
  function drawCat(g, angry) {
    const ears = [() => { g.beginPath(); g.moveTo(36, 70); g.lineTo(44, 10); g.lineTo(88, 46); g.closePath(); }, () => { g.beginPath(); g.moveTo(164, 70); g.lineTo(156, 10); g.lineTo(112, 46); g.closePath(); }];
    blob(g, [...ears, ell(g, 100, 100, 74, 62)], "#ff9f43", 5);
    g.fillStyle = "#ffc2e0"; g.beginPath(); g.moveTo(48, 58); g.lineTo(52, 26); g.lineTo(76, 46); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(152, 58); g.lineTo(148, 26); g.lineTo(124, 46); g.closePath(); g.fill();
    g.fillStyle = "#d9731f"; // stripes
    [[100, 44, 8, 16], [80, 48, 6, 12], [120, 48, 6, 12]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); });
    g.fillStyle = "#fff1e0"; g.beginPath(); g.ellipse(100, 128, 40, 28, 0, 0, TAU); g.fill();
    // grumpy eyes
    g.fillStyle = "#c6f26a"; g.strokeStyle = INK; g.lineWidth = 4;
    g.beginPath(); g.ellipse(70, 92, 15, angry ? 9 : 12, 0, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(130, 92, 15, angry ? 9 : 12, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(72, 93, 3.5, angry ? 7 : 9, 0, 0, TAU); g.ellipse(128, 93, 3.5, angry ? 7 : 9, 0, 0, TAU); g.fill();
    g.lineWidth = 7; g.beginPath(); g.moveTo(50, 70); g.lineTo(88, 84); g.moveTo(150, 70); g.lineTo(112, 84); g.stroke();
    g.fillStyle = "#ff7aa8"; g.lineWidth = 3.5; g.beginPath(); g.moveTo(92, 112); g.lineTo(108, 112); g.lineTo(100, 121); g.closePath(); g.fill(); g.stroke();
    g.lineWidth = 4;
    if (angry) {
      g.fillStyle = "#7a1f3a"; g.beginPath(); g.moveTo(80, 140); g.quadraticCurveTo(100, 122, 120, 140); g.quadraticCurveTo(100, 150, 80, 140); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.moveTo(86, 134); g.lineTo(90, 144); g.lineTo(94, 132); g.closePath(); g.moveTo(114, 134); g.lineTo(110, 144); g.lineTo(106, 132); g.closePath(); g.fill();
    } else { g.beginPath(); g.moveTo(84, 138); g.quadraticCurveTo(100, 128, 116, 138); g.stroke(); }
    g.lineWidth = 2.5; g.beginPath(); g.moveTo(60, 118); g.lineTo(20, 110); g.moveTo(60, 126); g.lineTo(22, 130); g.moveTo(140, 118); g.lineTo(180, 110); g.moveTo(140, 126); g.lineTo(178, 130); g.stroke();
  }
  function drawSkunk(g) {
    blob(g, [ell(g, 54, 44, 20, 22), ell(g, 146, 44, 20, 22), ell(g, 100, 100, 72, 62)], "#3a3150", 5);
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(88, 40); g.quadraticCurveTo(100, 30, 112, 40); g.lineTo(106, 96); g.quadraticCurveTo(100, 104, 94, 96); g.closePath(); g.fill();
    g.fillStyle = "#ff8fc7"; g.beginPath(); g.ellipse(54, 46, 9, 11, 0, 0, TAU); g.ellipse(146, 46, 9, 11, 0, 0, TAU); g.fill();
    g.fillStyle = "#fff6ea"; g.beginPath(); g.ellipse(100, 128, 34, 24, 0, 0, TAU); g.fill();
    // cheeky eyes (one winking)
    g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 3.5;
    g.beginPath(); g.arc(70, 92, 14, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(73, 94, 7, 0, TAU); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(76, 90, 2.5, 0, TAU); g.fill();
    g.lineWidth = 5; g.beginPath(); g.arc(130, 96, 11, Math.PI + 0.3, -0.3); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(100, 118, 9, 6, 0, 0, TAU); g.fill();
    g.lineWidth = 4; g.beginPath(); g.moveTo(84, 134); g.quadraticCurveTo(100, 146, 116, 132); g.stroke();
    g.fillStyle = "#ff7aa8"; g.beginPath(); g.ellipse(108, 142, 6, 5, 0.3, 0, Math.PI); g.fill();
  }
  function heartPath(g, x, y, s) {
    g.beginPath(); g.moveTo(x, y + s * 0.35);
    g.bezierCurveTo(x - s * 0.9, y - s * 0.3, x - s * 0.4, y - s * 0.9, x, y - s * 0.35);
    g.bezierCurveTo(x + s * 0.4, y - s * 0.9, x + s * 0.9, y - s * 0.3, x, y + s * 0.35); g.closePath();
  }

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:21px;display:flex;align-items:center;gap:5px;min-height:42px;white-space:nowrap}
.${C} .pill.sc{min-width:96px}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb2 .5s infinite}
.${C} .x2{background:var(--yellow);transform:rotate(-8deg);animation:${C}-throb 1s infinite}
.${C} .x2.hide{display:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(43,22,64,.3);z-index:5}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:18px 18px 20px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:110px;display:flex;align-items:flex-end;justify-content:center;gap:4px;margin-top:-6px;overflow:hidden}
.${C} .panel .art .pop{display:inline-block;animation:${C}-peek 1.6s ease-in-out infinite}
.${C} .panel .art .pop.e{font-size:46px;line-height:1}
.${C} .panel .art::after{content:"";position:absolute;left:0;right:0;bottom:0;height:22px;background:#f5c842;border-top:3px solid var(--ink);border-radius:50% 50% 0 0/100% 100% 0 0}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--sky)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.35;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#f3edff;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-peek{0%,100%{transform:translateY(60%)}30%,70%{transform:translateY(8%)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1) rotate(-8deg)}50%{transform:scale(1.12) rotate(-8deg)}}
@keyframes ${C}-throb2{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill x2 hide">x2!</div><div class="pill tm">⏱<b>${ROUND}</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm"), x2El = wrap.querySelector(".x2");
    const ov = wrap.querySelector(".ov");
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    // her guinea plus a few friends
    const guineas = [svgImg(api.guineaSVG({ size: 240, mood: "happy" }))];
    for (let i = 1; i <= 5; i++) guineas.push(svgImg(api.randomGuineaSVG(i * 7 + 3, { size: 240 })));
    const mine = { happy: guineas[0], wow: svgImg(api.guineaSVG({ size: 240, mood: "wow" })) };
    const SPR = { cat: sprite(200, 170, (g) => drawCat(g, false)), catMad: sprite(200, 170, (g) => drawCat(g, true)), skunk: sprite(200, 170, drawSkunk) };
    let goldSpr = null, pinSpr = null;
    function tinted(img, fn) {
      const c = document.createElement("canvas"); c.width = 600; c.height = 510;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0, 600, 510);
      // recolour while keeping the dark ink outline: "color" blend keeps luminance, then re-mask to the guinea's shape
      g.globalCompositeOperation = "color"; fn(g);
      g.globalCompositeOperation = "destination-in"; g.drawImage(img, 0, 0, 600, 510);
      g.globalCompositeOperation = "source-over";
      return c;
    }
    function ensureSpecial() {
      const img = guineas[0];
      if (goldSpr || !img.complete || !img.naturalWidth) return;
      goldSpr = tinted(img, (g) => {
        const gr = g.createLinearGradient(0, 0, 600, 510); gr.addColorStop(0, "#ffe14d"); gr.addColorStop(0.5, "#ffc61a"); gr.addColorStop(1, "#ffb000");
        g.fillStyle = gr; g.fillRect(0, 0, 600, 510);
      });
      { const g = goldSpr.getContext("2d"); g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(200, 190, 60, 26, -0.5, 0, TAU); g.fill(); g.fillStyle = "rgba(255,230,80,.25)"; g.fillRect(0, 0, 600, 510); }
      pinSpr = tinted(img, (g) => {
        const cols = ["#ff5a5f", "#ffd84d", "#7be04a", "#5fd3ff", "#c7b3ff", "#ff8fc7"];
        for (let i = 0; i < 12; i++) { g.fillStyle = cols[i % cols.length]; g.fillRect(0, 120 + i * 34, 600, 34); }
      });
    }

    let W = 1, H = 1, dpr = 1, cw = 100, boardTop = 70;
    let bg = null, moundSpr = null, moundBack = null;
    const holes = [];
    const S = {};
    let best = (api.highscore(ID, 0) || {}).best || 0;

    function reset() {
      Object.assign(S, { state: "intro", t: 0, timeLeft: ROUND, score: 0, combo: 0, bestCombo: 0, boops: 0, bonusCoins: 0, spawnT: 0.6, parts: [], floats: [], clouds: [], scratches: [],
        shake: 0, banner: null, endT: 0, awarded: false, pinCD: rnd(10, 16), goldCD: rnd(6, 12), lastSec: ROUND, catHits: 0, pinatas: 0, goldens: 0 });
      holes.forEach((h) => { h.who = null; h.t = 0; });
    }

    function resize() {
      W = Math.max(1, root.clientWidth); H = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      boardTop = 70;
      const availH = H - boardTop - 24;
      cw = Math.min((W - 20) / 3.12, availH / 3.1, 170);
      const rowH = Math.min(availH / 3, cw * 1.42);
      const gx = W / 2 - cw * 1.06;
      holes.length || [...Array(9)].forEach(() => holes.push({ who: null, t: 0 }));
      holes.forEach((h, i) => {
        const c = i % 3, r = (i / 3) | 0;
        h.cx = gx + c * cw * 1.06; h.cy = H - 26 - rowH * (2 - r); h.w = cw;
      });
      buildArt();
    }

    function buildArt() {
      bg = document.createElement("canvas"); bg.width = cv.width; bg.height = cv.height;
      const g = bg.getContext("2d"); g.scale(dpr, dpr); g.lineJoin = "round";
      // barn wall
      const wallH = Math.max(boardTop + 40, holes[0].cy - cw * 1.25);
      g.fillStyle = "#e86a6a"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#d65656";
      for (let x = 0; x < W; x += 40) g.fillRect(x, 0, 4, H);
      g.fillStyle = "rgba(255,255,255,.12)";
      for (let x = 12; x < W; x += 40) g.fillRect(x, 0, 6, H);
      // window with sky
      const wx = W * 0.22, wy = wallH * 0.6, ww = Math.min(100, W * 0.24);
      g.fillStyle = "#9fe3ff"; g.strokeStyle = INK; g.lineWidth = 4; rr(g, wx - ww / 2, wy - ww * 0.32, ww, ww * 0.64, 10); g.fill(); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.ellipse(wx - ww * 0.15, wy, ww * 0.18, ww * 0.08, 0, 0, TAU); g.fill();
      g.fillStyle = "#fffdf8"; g.fillRect(wx - 3, wy - ww * 0.32, 6, ww * 0.64); g.fillRect(wx - ww / 2, wy - 3, ww, 6);
      g.strokeStyle = INK; g.lineWidth = 4; rr(g, wx - ww / 2, wy - ww * 0.32, ww, ww * 0.64, 10); g.stroke();
      // sign
      const sx = W * 0.66, sy = wallH * 0.6, sw = Math.min(190, W * 0.5), shh = Math.min(64, wallH * 0.32);
      g.save(); g.translate(sx, sy); g.rotate(-0.04);
      g.fillStyle = "#c98d52"; g.strokeStyle = INK; g.lineWidth = 4; rr(g, -sw / 2, -shh / 2, sw, shh, 10); g.fill(); g.stroke();
      g.strokeStyle = "#a8743f"; g.lineWidth = 2; g.beginPath(); g.moveTo(-sw / 2 + 8, 0); g.lineTo(sw / 2 - 8, 0); g.stroke();
      g.fillStyle = "#6e4a2a"; g.beginPath(); g.arc(-sw / 2 + 10, -shh / 2 + 10, 3, 0, TAU); g.arc(sw / 2 - 10, -shh / 2 + 10, 3, 0, TAU); g.fill();
      txt(g, "BOOP ZONE", 0, 2, Math.min(26, sw / 7), "#ffd84d", 5);
      g.restore();
      // bunting
      const cols = ["#ffd84d", "#5fd3ff", "#7be04a", "#ff8fc7", "#c7b3ff"];
      g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(W / 2, 40, W, 6); g.stroke();
      for (let i = 0; i < 12; i++) {
        const t = (i + 0.5) / 12, x = t * W, y = 6 + (1 - (2 * t - 1) ** 2) * 17;
        g.fillStyle = cols[i % cols.length]; g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x + 10, y); g.lineTo(x, y + 18); g.closePath(); g.fill(); g.stroke();
      }
      // straw floor
      const fy = wallH;
      g.fillStyle = "#ffe08a"; g.fillRect(0, fy, W, H - fy);
      g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, fy); g.lineTo(W, fy); g.stroke();
      g.strokeStyle = "#e9b949"; g.lineWidth = 2.5;
      for (let i = 0; i < W * (H - fy) / 900; i++) { const x = rnd(0, W), y = rnd(fy + 6, H), a = rnd(-0.6, 0.6); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); g.stroke(); }
      // hay mounds
      const w = cw, h = cw * 0.36;
      moundSpr = sprite(w + 10, h + 10, (m) => {
        const p = () => { m.beginPath(); m.moveTo(5, h + 5); m.bezierCurveTo(5, h * 0.2, w * 0.3, 5, w / 2 + 5, 5); m.bezierCurveTo(w * 0.7 + 10, 5, w + 5, h * 0.2, w + 5, h + 5); m.closePath(); };
        blob(m, [p], "#f5c842", 3.5);
        m.save(); p(); m.clip();
        m.strokeStyle = "#d9a520"; m.lineWidth = 2.2;
        for (let i = 0; i < 26; i++) { const x = rnd(10, w), y = rnd(h * 0.2, h); m.beginPath(); m.moveTo(x, y); m.lineTo(x + rnd(-8, 8), y - rnd(6, 14)); m.stroke(); }
        m.fillStyle = "rgba(255,255,255,.4)"; m.beginPath(); m.ellipse(w * 0.35, h * 0.35, w * 0.16, h * 0.1, -0.3, 0, TAU); m.fill();
        m.restore();
        m.strokeStyle = "#f5c842"; m.lineWidth = 3;
        for (let i = 0; i < 8; i++) { const x = w * 0.2 + rnd(0, w * 0.65); m.beginPath(); m.moveTo(x, 10); m.lineTo(x + rnd(-6, 6), 0); m.stroke(); }
      });
      moundBack = sprite(w + 10, h * 0.7 + 10, (m) => {
        m.fillStyle = "#5a3a1a"; m.strokeStyle = INK; m.lineWidth = 3; m.beginPath(); m.ellipse(w / 2 + 5, h * 0.42, w * 0.4, h * 0.3, 0, 0, TAU); m.fill(); m.stroke();
        m.fillStyle = "#2b1a10"; m.beginPath(); m.ellipse(w / 2 + 5, h * 0.46, w * 0.32, h * 0.2, 0, 0, TAU); m.fill();
      });
    }

    /* ---------- UI ---------- */
    function setHud() {
      scEl.textContent = S.score;
      const sec = Math.max(0, Math.ceil(S.timeLeft));
      tmEl.textContent = sec;
      tmPill.classList.toggle("hurry", sec <= 10 && S.state === "play");
    }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function payout() { return Math.min(300, Math.round(S.score / 12) + S.bonusCoins); }
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 90, mood: "happy" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="pop e" style="animation-delay:-.8s">😾</span><span class="pop">${svg}</span><span class="pop e" style="animation-delay:-.4s">🦨</span></div>
        <h2>${after ? "Boop more?" : "Whack-a-Wheek"}</h2>${lastLine}
        <p><b>Tap</b> the guineas to boop them! Don't boop the <b>grumpy cat</b> or the <b>stinky skunk</b>.</p>
        <div class="chips"><span class="chip">✨ Golden = x10</span><span class="chip">🪅 Piñata: tap 5 times!</span></div>
        <button class="btn sky">${after ? "Play again!" : "Start!"}</button></div>`;
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
      x2El.textContent = "x" + api.multiplier + "!";
      x2El.classList.toggle("hide", !(api.multiplier > 1));
      setHud();
      banner("BOOP TIME!", "tap the guineas!", "#5fd3ff");
      api.sfx("wheek");
    }

    /* ---------- fx ---------- */
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 26; x = clamp(x, text.length * size * 0.32 + 8, W - text.length * size * 0.32 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 0.9 }); }
    function burst(x, y, cols, n, spd, k) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 260);
        S.parts.push({ k: k || "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, g: 700, r: rnd(3, 7), col: pick(cols), life: rnd(0.5, 0.9), t: 0, rot: rnd(0, TAU), vr: rnd(-8, 8) });
      }
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- moles ---------- */
    function diff() { return clamp(S.t / ROUND, 0, 1); }
    function spawn() {
      const d = diff();
      const free = holes.filter((h) => !h.who);
      const active = 9 - free.length;
      const maxActive = Math.round(lerp(3, 5, d));
      S.spawnT = lerp(0.7, 0.36, d) * rnd(0.7, 1.2);
      if (!free.length || active >= maxActive) return;
      const h = pick(free);
      let who = "guinea";
      const r = Math.random();
      if (S.pinCD <= 0 && !holes.some((q) => q.who === "pinata")) { who = "pinata"; S.pinCD = rnd(12, 18); }
      else if (S.goldCD <= 0 && r < 0.3) { who = "golden"; S.goldCD = rnd(8, 14); }
      else if (r < lerp(0.14, 0.24, d)) who = "cat";
      else if (r < lerp(0.14, 0.24, d) + 0.09) who = "skunk";
      const stay = who === "pinata" ? 3.2 : who === "golden" ? lerp(0.9, 0.7, d) : lerp(1.35, 0.7, d) * rnd(0.85, 1.15);
      Object.assign(h, { who, t: 0, phase: "up", stay, hit: false, taps: 0, img: pick(guineas), wob: 9, hitT: 9, gone: false });
    }
    function lift(h) {
      // 0..1 how far up the character is
      if (!h.who) return 0;
      const up = 0.18, down = h.hit ? 0.22 : 0.18;
      if (h.phase === "up") return easeOutBack(clamp(h.t / up, 0, 1));
      if (h.phase === "stay") return 1;
      return 1 - clamp(h.t / down, 0, 1) ** 2;
    }
    function updateHoles(dt) {
      for (const h of holes) {
        if (!h.who) continue;
        h.t += dt; h.wob += dt; h.hitT += dt;
        if (h.phase === "up" && h.t >= 0.18) { h.phase = "stay"; h.t = 0; }
        else if (h.phase === "stay" && h.t >= (h.hit ? (h.who === "cat" ? 0.6 : 0.25) : h.stay)) {
          h.phase = "down"; h.t = 0;
          if (!h.hit && (h.who === "guinea" || h.who === "golden")) { if (S.combo >= 5) floatT(h.cx, h.cy - cw * 0.7, "combo lost", "#ffe1e6", 16); S.combo = 0; }
          if (!h.hit && h.who === "pinata") floatT(h.cx, h.cy - cw * 0.8, "it got away!", "#fff", 18);
        } else if (h.phase === "down" && h.t >= 0.22) { h.who = null; }
      }
    }

    function tap(x, y) {
      if (S.state !== "play") return;
      let best2 = null, bd = 1e9;
      for (const h of holes) {
        const top = h.cy - cw * 1.1, dx = Math.abs(x - h.cx);
        if (dx < cw * 0.52 && y > top && y < h.cy + cw * 0.18) { const d = dx + Math.abs(y - (h.cy - cw * 0.4)); if (d < bd) { bd = d; best2 = h; } }
      }
      const h = best2;
      if (!h || !h.who || lift(h) < 0.35 || (h.hit && h.who !== "pinata") || h.phase === "down") {
        // whiff: little hay puff
        burst(x, y, ["#f5c842", "#ffe08a"], 4, 120, "straw");
        return;
      }
      const hx = h.cx, hy = h.cy - cw * 0.55;
      const mult = S.combo >= 15 ? 3 : S.combo >= 6 ? 2 : 1;
      if (h.who === "guinea" || h.who === "golden") {
        h.hit = true; h.t = 0; h.phase = "stay"; h.hitT = 0;
        S.combo++; S.bestCombo = Math.max(S.bestCombo, S.combo); S.boops++;
        const pts = (h.who === "golden" ? 100 : 10) * mult;
        S.score += pts;
        api.sfx(h.who === "golden" ? "bigwin" : "boop");
        burst(hx, hy, ["#ff8fc7", "#ff5a5f", "#fff"], h.who === "golden" ? 6 : 3, 160, "heart");
        S.parts.push({ k: "heart", x: hx, y: hy - 10, vx: 0, vy: -90, g: -40, r: 16, col: "#ff5a5f", life: 0.9, t: 0, rot: 0, vr: 0 });
        floatT(hx, hy - cw * 0.35, "+" + pts, h.who === "golden" ? "#ffd84d" : "#fff", h.who === "golden" ? 34 : 26);
        if (h.who === "golden") {
          S.goldens++; shake(8); api.haptic(50);
          const [vx, vy] = vp(hx, hy); api.confetti(vx, vy, 50);
          burst(hx, hy, ["#ffd84d", "#fff3b0", "#fff"], 24, 360, "star");
          banner("GOLDEN WHEEK!", "x10 points!", "#ffd84d");
        } else {
          if (Math.random() < 0.25) floatT(hx + rnd(-20, 20), hy - cw * 0.65, pick(["boop!", "wheek!", "hehe!", "squee!"]), pick(["#ff8fc7", "#5fd3ff", "#c7b3ff"]), 18);
          api.haptic(10);
        }
        if (S.combo === 6) { banner("COMBO x2!", "keep booping!", "#ff8fc7"); api.sfx("sparkle"); }
        if (S.combo === 15) { banner("COMBO x3!", "boop master!", "#ff9f43"); api.sfx("fanfare"); }
      } else if (h.who === "cat") {
        h.hit = true; h.t = 0; h.phase = "stay"; h.hitT = 0;
        S.score = Math.max(0, S.score - 20); S.combo = 0; S.catHits++;
        api.sfx("buzz"); api.haptic(90); shake(14);
        floatT(hx, hy - cw * 0.4, "HISSS! -20", "#ff5a5f", 28);
        S.scratches.push({ x: hx, y: hy, t: 0 });
      } else if (h.who === "skunk") {
        h.hit = true; h.t = 0; h.phase = "stay"; h.hitT = 0;
        S.score = Math.max(0, S.score - 5); S.combo = 0;
        api.sfx("fart"); api.haptic(60); shake(6);
        const [vx, vy] = vp(hx, hy); api.gas(vx, vy);
        // the cloud covers a 2x2 patch of the board around the skunk
        const idx = holes.indexOf(h), c = idx % 3, r = (idx / 3) | 0;
        const c0 = Math.min(c, 1), r0 = Math.min(r, 1);
        const a = holes[r0 * 3 + c0], b = holes[(r0 + 1) * 3 + c0 + 1];
        S.clouds.push({ x0: a.cx - cw * 0.55, y0: a.cy - cw * 1.05, x1: b.cx + cw * 0.55, y1: b.cy + cw * 0.12, t: 0, life: 2, seed: Math.random() * 100 });
      } else if (h.who === "pinata") {
        h.taps++; h.hitT = 0; h.stay = Math.max(h.stay, h.t + 0.8);
        api.sfx("hit"); shake(4); api.haptic(15);
        burst(hx, hy, ["#ff5a5f", "#ffd84d", "#7be04a", "#5fd3ff", "#c7b3ff"], 6, 220, "paper");
        floatT(hx, hy - cw * 0.5, ["WHACK!", "BONK!", "POW!", "SMACK!"][h.taps % 4], "#fff", 22);
        if (h.taps >= 5) {
          h.hit = true; h.t = 0; h.phase = "down";
          S.pinatas++; S.score += 150 * mult; S.bonusCoins += 15;
          api.sfx("bigwin"); shake(12); api.haptic(80);
          const [vx, vy] = vp(hx, hy); api.confetti(vx, vy, 80);
          for (let i = 0; i < 18; i++) { const a2 = rnd(0, TAU), v = rnd(200, 460); S.parts.push({ k: "coin", x: hx, y: hy, vx: Math.cos(a2) * v, vy: Math.sin(a2) * v - 250, g: 900, r: 9, col: "#ffd84d", life: rnd(0.9, 1.3), t: 0, rot: rnd(0, TAU), vr: rnd(-10, 10) }); }
          burst(hx, hy, ["#ff5a5f", "#ffd84d", "#7be04a", "#5fd3ff", "#c7b3ff", "#ff8fc7"], 30, 420, "paper");
          banner("PIÑATA POP!", "+150 points  +15 🪙", "#ff8fc7");
        }
      }
      setHud(); bump(scEl.parentNode);
    }

    function endRound() {
      if (S.state !== "play") return;
      S.state = "end"; S.endT = 0;
      banner("TIME'S UP!", "", "#5fd3ff"); api.sfx("fanfare");
      holes.forEach((h) => { if (h.who && h.phase !== "down") { h.phase = "down"; h.t = 0; } });
      setHud();
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const coins = payout();
      const earned = coins > 0 ? api.award(coins, { reason: "Whack-a-Wheek" }) : 0;
      const hs = api.highscore(ID, S.score);
      best = hs.best;
      const quip = S.catHits >= 3 ? `The cat is VERY grumpy now. ${S.boops} boops!` : S.pinatas ? `${S.boops} boops and ${S.pinatas} piñata${S.pinatas > 1 ? "s" : ""} popped!` : `${S.boops} guineas booped!`;
      api.done({ earned, title: hs.isNew && S.score > 0 ? "New best!" : "Time's up!", text: `${quip} Score ${S.score}. ${hs.isNew && S.score > 0 ? "New best! 🏆" : "Best: " + hs.best}`, score: S.score });
      hud.classList.add("off");
      showPanel({ score: S.score, earned });
    }

    function update(dt) {
      ensureSpecial();
      if (S.state === "play") {
        S.t += dt; S.timeLeft -= dt; S.pinCD -= dt; S.goldCD -= dt;
        S.spawnT -= dt; if (S.spawnT <= 0) spawn();
        const sec = Math.ceil(S.timeLeft);
        if (sec !== S.lastSec) { S.lastSec = sec; if (sec <= 5 && sec > 0) api.sfx("tick"); }
        if (S.timeLeft <= 0) { S.timeLeft = 0; endRound(); }
        setHud();
      } else if (S.state === "end") {
        S.endT += dt; if (S.endT > 1.8) finish();
      } else if (S.state === "intro" || S.state === "over") {
        // idle peeking for ambience
        S.spawnT -= dt;
        if (S.spawnT <= 0) { S.spawnT = rnd(0.8, 1.6); const free = holes.filter((h) => !h.who); if (free.length > 6) Object.assign(pick(free), { who: "guinea", t: 0, phase: "up", stay: rnd(0.8, 1.4), hit: false, taps: 0, img: pick(guineas), wob: 9, hitT: 9 }); }
      }
      updateHoles(dt);
      for (const p of S.parts) { p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += (p.vr || 0) * dt; }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 60 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      for (const c of S.clouds) c.t += dt;
      S.clouds = S.clouds.filter((c) => c.t < c.life);
      for (const s of S.scratches) s.t += dt;
      S.scratches = S.scratches.filter((s) => s.t < 0.6);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.5 && S.state === "play") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 40);
    }

    /* ---------- drawing ---------- */
    function drawChar(h) {
      const g = ctx, L = lift(h);
      if (L <= 0) return;
      const iw = cw * 0.86, ih = iw * 0.85;
      const clipB = h.cy - cw * 0.05, moundTop = h.cy - cw * 0.36 * 0.75;
      const baseY = clipB - L * (ih * 0.86 + (clipB - moundTop));
      const rise = h.cy - baseY - ih * 0.2;
      let sx = 1, sy = 1, rot = 0, img = null, dx = 0;
      const hit = h.hit && h.hitT < 0.4;
      if (hit) { const k = Math.exp(-h.hitT * 9) * Math.cos(h.hitT * 30); sx = 1 + k * 0.25; sy = 1 - k * 0.25; }
      if (h.phase === "up") { const k = 1 - clamp(h.t / 0.18, 0, 1); sy = 1 + k * 0.15; sx = 1 - k * 0.1; }
      if (h.who === "pinata") { rot = Math.sin(h.wob * 6) * 0.08; if (h.hitT < 0.3) dx = Math.sin(h.hitT * 60) * 8 * (1 - h.hitT / 0.3); }
      if (h.who === "cat" && h.hit) dx = Math.sin(h.hitT * 50) * 5;
      if (h.who === "guinea") img = h.hit && h.img === guineas[0] ? mine.wow : h.img;
      else if (h.who === "golden") img = goldSpr || guineas[0];
      else if (h.who === "pinata") img = pinSpr || guineas[0];
      else if (h.who === "cat") img = (h.hit ? SPR.catMad : SPR.cat).c;
      else if (h.who === "skunk") img = SPR.skunk.c;
      g.save();
      g.beginPath(); g.rect(h.cx - cw, clipB - cw * 2.5, cw * 2, cw * 2.5); g.clip();
      g.translate(h.cx + dx, baseY + ih); g.rotate(rot); g.scale(sx, sy);
      if (h.who === "golden") {
        const t = performance.now() / 1000;
        g.save(); g.translate(0, -ih * 0.5); g.rotate(t * 2); g.fillStyle = "rgba(255,230,90,.45)";
        for (let i = 0; i < 10; i++) { g.rotate(TAU / 10); g.beginPath(); g.moveTo(0, 0); g.lineTo(-8, iw * 0.75); g.lineTo(8, iw * 0.75); g.closePath(); g.fill(); }
        g.restore();
      }
      if (img && (img.naturalWidth || img.width)) {
        try { g.drawImage(img, -iw / 2, -ih, iw, ih); } catch (e) { /* image not ready */ }
      }
      if (h.who === "pinata") {
        // paper fringe hat and hit counter
        g.fillStyle = "#ff5a5f"; g.strokeStyle = INK; g.lineWidth = 3;
        g.beginPath(); g.moveTo(-iw * 0.12, -ih * 0.8); g.lineTo(0, -ih * 1.08); g.lineTo(iw * 0.12, -ih * 0.8); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = "#ffd84d"; g.beginPath(); g.arc(0, -ih * 1.08, 6, 0, TAU); g.fill(); g.stroke();
      }
      g.restore();
    }
    function drawOver(h) {
      const g = ctx, L = lift(h);
      if (L <= 0) return;
      const iw = cw * 0.86, ih = iw * 0.85;
      const clipB = h.cy - cw * 0.05, moundTop = h.cy - cw * 0.36 * 0.75;
      const baseY = clipB - L * (ih * 0.86 + (clipB - moundTop));
      const rise = h.cy - baseY - ih * 0.2;
      if (h.who === "pinata" && !h.hit && L > 0.6) {
        const n = 5 - h.taps;
        for (let i = 0; i < 5; i++) {
          const x = h.cx + (i - 2) * 15, y = h.cy - cw * 0.08;
          g.fillStyle = i < h.taps ? "#ffd84d" : "#fffdf8"; g.strokeStyle = INK; g.lineWidth = 2.5;
          g.beginPath(); g.arc(x, y, 5.5, 0, TAU); g.fill(); g.stroke();
        }
        if (n === 5) txt(g, "TAP x5!", h.cx, h.cy - rise - ih * 0.42, 16, "#ffd84d", 4);
      }
      if (h.who === "skunk" && !h.hit) {
        g.strokeStyle = "rgba(140,220,80,.8)"; g.lineWidth = 3;
        for (let i = -1; i <= 1; i += 2) { g.beginPath(); for (let k = 0; k < 5; k++) { const yy = baseY + ih * 0.2 - 4 - k * 5, xx = h.cx + i * iw * 0.3 + Math.sin(k * 1.4 + h.wob * 10) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      }
    }
    function drawPart(p) {
      const g = ctx, a = 1 - p.t / p.life;
      g.globalAlpha = Math.min(1, a * 2);
      if (p.k === "heart") { g.fillStyle = p.col; g.strokeStyle = INK; g.lineWidth = 2.5; heartPath(g, p.x, p.y, p.r * (p.r > 10 ? 1 + p.t : 1)); g.fill(); g.stroke(); }
      else if (p.k === "star") { g.fillStyle = p.col; g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.beginPath(); for (let i = 0; i < 8; i++) { const r2 = i % 2 ? p.r * 0.4 : p.r, a2 = (i / 8) * TAU; g.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2); } g.closePath(); g.fill(); g.restore(); }
      else if (p.k === "paper") { g.fillStyle = p.col; g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8); g.restore(); }
      else if (p.k === "straw") { g.strokeStyle = "#d9a520"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + Math.cos(p.rot) * 10, p.y + Math.sin(p.rot) * 10); g.stroke(); }
      else if (p.k === "coin") { const sx = Math.abs(Math.cos(p.rot)) * 0.8 + 0.2; g.save(); g.translate(p.x, p.y); g.scale(sx, 1); g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, p.r, 0, TAU); g.fill(); g.stroke(); g.fillStyle = "#f0b400"; g.beginPath(); g.arc(0, 0, p.r * 0.55, 0, TAU); g.fill(); g.restore(); }
      else { g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
      g.globalAlpha = 1;
    }
    function drawCloud(c) {
      const g = ctx, a = Math.min(1, c.t / 0.15, (c.life - c.t) / 0.35), t = performance.now() / 1000;
      g.save(); g.globalAlpha = 0.93 * a;
      const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2, rx = (c.x1 - c.x0) / 2, ry = (c.y1 - c.y0) / 2;
      for (let i = 0; i < 11; i++) {
        const ang = (i / 11) * TAU + c.seed, rr2 = i === 10 ? 0 : 0.55;
        const x = cx + Math.cos(ang) * rx * rr2 + Math.sin(t * 1.3 + i) * 6, y = cy + Math.sin(ang) * ry * rr2 + Math.cos(t * 1.1 + i) * 6;
        const r = Math.min(rx, ry) * (i === 10 ? 0.75 : 0.5) * (1 + Math.sin(t * 2 + i) * 0.05) * (0.7 + 0.3 * Math.min(1, c.t / 0.2));
        g.fillStyle = "#8fd35a"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        g.fillStyle = "#b6ec86"; g.beginPath(); g.arc(x - r * 0.2, y - r * 0.25, r * 0.55, 0, TAU); g.fill();
      }
      g.globalAlpha = a; txt(g, "PEE-YEW!", cx, cy, 30, "#e4fbd5", 6);
      g.restore();
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state === "play" && t > 1.2 ? 1 - (t - 1.2) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.5); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(50, W * 0.9 / (b.text.length * 0.7 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 18, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      if (bg) g.drawImage(bg, 0, 0, W, H);
      g.save();
      const sh = S.shake; if (sh > 0) g.translate(rnd(-sh, sh) * 0.6, rnd(-sh, sh) * 0.6);
      const mh = cw * 0.36;
      for (const h of holes) {
        if (moundBack) g.drawImage(moundBack.c, h.cx - cw * 0.47 - 5, h.cy - mh * 0.92, cw * 0.94 + 10, mh * 0.7 + 10);
        drawChar(h);
        if (moundSpr) g.drawImage(moundSpr.c, h.cx - cw * 0.47 - 5, h.cy - mh - 5 + mh * 0.25, cw * 0.94 + 10, mh + 10);
      }
      for (const h of holes) drawOver(h);
      for (const p of S.parts) drawPart(p);
      for (const c of S.clouds) drawCloud(c);
      for (const s of S.scratches) {
        g.save(); g.globalAlpha = 1 - s.t / 0.6; g.strokeStyle = "#ff5a5f"; g.lineWidth = 7; g.lineCap = "round";
        for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(s.x - 40 + i * 16, s.y - 40); g.lineTo(s.x + 30 + i * 16, s.y + 40); g.stroke(); }
        g.strokeStyle = "#fff"; g.lineWidth = 2.5;
        for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(s.x - 40 + i * 16, s.y - 40); g.lineTo(s.x + 30 + i * 16, s.y + 40); g.stroke(); }
        g.restore();
      }
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.6) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, (f.t - 0.12));
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.state === "play" && S.combo >= 3) {
        const mult = S.combo >= 15 ? 3 : S.combo >= 6 ? 2 : 1;
        txt(g, "🔥 " + S.combo + (mult > 1 ? "  x" + mult : ""), W / 2, 31, 20, mult > 1 ? "#ffd84d" : "#fff", 5);
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
    function onDown(e) { e.preventDefault(); const r = cv.getBoundingClientRect(); tap(e.clientX - r.left, e.clientY - r.top); }
    cv.addEventListener("pointerdown", onDown);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Whack-a-Wheek", icon: "🔨", place: "arcade", kind: "skill",
    blurb: "Boop the guineas, not the cat!",
    mount,
  });
})();
