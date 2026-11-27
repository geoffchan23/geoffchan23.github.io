/* Wheek World mini-game: Guinea Conga.
   Her guinea leads a conga line of baby guineas around a grassy garden grid (snake mechanic).
   Swipe anywhere (or tap beside her, or use the arrow keys) to turn. Veggies add a baby to the line,
   the golden strawberry is a big bonus. Bumping the fence or the line ends the round with a toot.
   Rounds end on a crash or after 90 seconds.
   Pays once per round: veggies * 5 + golden berries * 12 (+15 for dancing the full 90s), capped at 200. */
(function () {
  "use strict";
  const ID = "conga-line", C = "g-conga";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 90;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  // The guinea SVG hides/shows its eye layers with app CSS classes. An <img> cannot see app CSS,
  // so embed the same mood rules inside the SVG before turning it into an image.
  const MOOD_CSS = "<style>.eyes-h,.eyes-o,.eyes-s,.eyes-sad,.mouth-open{display:none}" +
    ".happy .eyes-n,.wow .eyes-n,.sad .eyes-n,.munch .eyes-n{display:none}" +
    ".happy .eyes-h,.munch .eyes-h{display:inline}.wow .eyes-o{display:inline}.sad .eyes-sad{display:inline}" +
    ".munch .mouth{display:none}.munch .mouth-open{display:inline}</style>";
  function svgImg(svg, mood) {
    if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    if (mood && !/class="/.test(svg.slice(0, svg.indexOf(">")))) svg = svg.replace("<svg", '<svg class="' + mood + '"');
    else if (mood && !new RegExp("class=\"[^\"]*\\b" + mood + "\\b").test(svg.slice(0, svg.indexOf(">")))) svg = svg.replace('class="', 'class="' + mood + " ");
    svg = svg.replace(/(<svg[^>]*>)/, "$1" + MOOD_CSS);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    // where the body top (y=38) and feet (y=164) sit inside the picture, from its viewBox
    const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
    const v = vb ? vb.split(/[\s,]+/).map(Number) : [0, 0, 200, 170];
    img._top = (38 - v[1]) / v[3]; img._feet = (164 - v[1]) / v[3];
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
  function drawStar(g, x, y, r, rot) {
    g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
    for (let i = 0; i < 10; i++) { const r2 = i % 2 ? r * 0.45 : r, a = (i / 10) * TAU - Math.PI / 2; g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); }
    g.closePath(); g.fill(); g.restore();
  }

  const VEG = [
    { e: "🥕", bits: ["#ff9f43", "#ffb86b", "#5bbf3a"], name: "carrot" },
    { e: "🥬", bits: ["#7be04a", "#b6f27a", "#4fae2c"], name: "lettuce" },
    { e: "🥒", bits: ["#5bbf3a", "#cdeb8b", "#2f7d14"], name: "cucumber" },
    { e: "🫑", bits: ["#ff5a5f", "#ff8f8f", "#5bbf3a"], name: "pepper" },
    { e: "🥦", bits: ["#4fae2c", "#7be04a", "#2f7d14"], name: "broccoli" },
    { e: "🌽", bits: ["#ffd84d", "#fff0a8", "#7be04a"], name: "corn" },
  ];
  const NOMS = ["NOM!", "CRUNCH!", "YUM!", "MUNCH!", "WHEEK!", "NOMNOM!"];
  const TOOTS = ["TOOT!", "PFFRRT!", "BRAAP!", "PFFT!"];
  const FENCE_LINES = ["Fence: 1, Guineas: 0.", "Somebody tooted!", "Ouchie on the nosey!"];
  const TANGLE_LINES = ["The conga line got tangled!", "Oops, conga collision!", "Who tooted in the line?!"];

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#c9f0a8}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 10px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:4px;min-height:38px;white-space:nowrap}
.${C} .pill small{font-family:var(--body);font-weight:900;font-size:12px;color:var(--ink-soft)}
.${C} .pill.tm{min-width:74px;justify-content:center}
.${C} .pill.tm.hurry{background:#ffe1e6;animation:${C}-throb .5s ease-in-out infinite}
.${C} .x2{position:absolute;top:52px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.3);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:14px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .art{display:flex;align-items:flex-end;justify-content:center;height:96px;gap:0;margin-top:2px}
.${C} .panel .art > div{animation:${C}-conga .5s ease-in-out infinite alternate;transform-origin:50% 100%;margin-left:-10px}
.${C} .panel .art > div:nth-child(2){animation-delay:-.12s}.${C} .panel .art > div:nth-child(3){animation-delay:-.24s}.${C} .panel .art > div:nth-child(4){animation-delay:-.36s}
.${C} .panel .art svg{display:block}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:32px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--pink)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#fff4cc;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-conga{from{transform:rotate(-8deg) translateY(0)}to{transform:rotate(8deg) translateY(-6px)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill bb">🐹<b>0</b><small>babies</small></div><div class="pill sc">⭐<b>0</b></div><div class="pill tm">⏱<b>${ROUND}</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), ov = wrap.querySelector(".ov");
    const bbEl = wrap.querySelector(".bb b"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const lead = {};
    ["happy", "wow", "munch", "sad"].forEach((m) => { lead[m] = svgImg(api.guineaSVG({ size: 160, mood: m }), m); });
    const BABY_SEEDS = [11, 23, 37, 41, 58, 64, 79, 86, 93, 105];
    const babies = BABY_SEEDS.map((s, i) => svgImg(api.randomGuineaSVG(s, { size: 120, mood: i % 3 === 0 ? "happy" : "" }), i % 3 === 0 ? "happy" : ""));

    let W = 1, H = 1, dpr = 1, cell = 30, bx = 0, by = 0, cols = 11, rows = 18, HUDH = 54;
    let boardCv = null;
    const S = {};

    /* ---------- layout ---------- */
    function pickGrid() {
      const aw = W - 32, ah = H - HUDH - 34;
      const target = clamp(Math.min(aw / 11, ah / 12), 26, 46);
      cols = clamp(Math.floor(aw / target), 9, 20);
      rows = clamp(Math.floor(ah / target), 9, 22);
    }
    function layout() {
      const aw = W - 32, ah = H - HUDH - 34; // 20px of fence + 12px margins
      cell = Math.floor(Math.min(aw / cols, ah / rows));
      bx = Math.round((W - cols * cell - 20) / 2);
      by = Math.round(HUDH + 4 + (ah - rows * cell) / 2);
      buildBoard();
    }
    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      if (!S.state || S.state === "intro" || S.state === "over") pickGrid();
      layout();
    }
    function buildBoard() {
      const pad = 10;
      const bw = cols * cell + pad * 2, bh = rows * cell + pad * 2;
      boardCv = document.createElement("canvas");
      boardCv.width = Math.ceil(bw * dpr); boardCv.height = Math.ceil(bh * dpr);
      const g = boardCv.getContext("2d");
      g.scale(dpr, dpr); g.lineJoin = "round"; g.lineCap = "round";
      // fence frame
      rr(g, 2, 2, bw - 4, bh - 4, 18); g.fillStyle = "#d9935a"; g.fill();
      g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
      g.save(); rr(g, 2, 2, bw - 4, bh - 4, 18); g.clip();
      g.strokeStyle = "rgba(43,22,64,.28)"; g.lineWidth = 2;
      for (let x = 14; x < bw; x += 16) { g.beginPath(); g.moveTo(x, 2); g.lineTo(x, pad - 1); g.moveTo(x, bh - pad + 1); g.lineTo(x, bh - 2); g.stroke(); }
      for (let y = 14; y < bh; y += 16) { g.beginPath(); g.moveTo(2, y); g.lineTo(pad - 1, y); g.moveTo(bw - pad + 1, y); g.lineTo(bw - 2, y); g.stroke(); }
      g.restore();
      // grass checkerboard
      g.save(); rr(g, pad, pad, cols * cell, rows * cell, 10); g.clip();
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        g.fillStyle = (x + y) % 2 ? "#8fdc63" : "#9fe673";
        g.fillRect(pad + x * cell, pad + y * cell, cell, cell);
      }
      // little tufts and flowers (deterministic)
      let s = 1234;
      const r1 = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      for (let i = 0; i < cols * rows * 0.35; i++) {
        const x = pad + r1() * cols * cell, y = pad + r1() * rows * cell, k = r1();
        if (k < 0.75) {
          g.strokeStyle = "#6cc443"; g.lineWidth = 2;
          g.beginPath(); g.moveTo(x - 3, y + 3); g.lineTo(x - 4, y - 3); g.moveTo(x, y + 3); g.lineTo(x, y - 5); g.moveTo(x + 3, y + 3); g.lineTo(x + 4, y - 3); g.stroke();
        } else {
          const col = pick(["#fff", "#ffd84d", "#ff8fc7", "#c7b3ff"]);
          g.fillStyle = col;
          for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.3, 0, TAU); g.fill(); }
          g.fillStyle = "#ffb000"; g.beginPath(); g.arc(x, y, 1.8, 0, TAU); g.fill();
        }
      }
      g.restore();
      rr(g, pad, pad, cols * cell, rows * cell, 10); g.lineWidth = 3.5; g.strokeStyle = INK; g.stroke();
    }

    /* ---------- state ---------- */
    function reset() {
      Object.assign(S, {
        state: "intro", t: 0, time: ROUND, prog: 0, stepT: 0.25, dir: "right", queue: [], segs: [], grow: 0,
        food: null, gold: null, eaten: 0, goldens: 0, score: 0, combo: 0, lastEat: -99, bestCombo: 0,
        parts: [], floats: [], banner: null, shake: 0, munchT: 0, wowT: 0, crash: null, endT: 0, awarded: false,
        why: "", tootT: 0, readyT: 0, turned: false, nextGold: 4, flash: 0, lastSec: ROUND, bonk: 0,
      });
      const sy = Math.floor(rows / 2), sx = Math.min(4, cols - 4);
      for (let i = 0; i < 3; i++) S.segs.push({ x: sx - i, y: sy, px: sx - i - 1, py: sy, k: i ? (i - 1) % babies.length : -1, born: -1 });
      placeFood();
    }
    const occupied = (x, y) => S.segs.some((s) => s.x === x && s.y === y);
    function freeCell(minDist) {
      const h = S.segs[0];
      for (let tries = 0; tries < 400; tries++) {
        const x = (Math.random() * cols) | 0, y = (Math.random() * rows) | 0;
        if (occupied(x, y)) continue;
        if (S.food && S.food.x === x && S.food.y === y) continue;
        if (S.gold && S.gold.x === x && S.gold.y === y) continue;
        if (Math.abs(x - h.x) + Math.abs(y - h.y) < minDist && tries < 300) continue;
        return { x, y };
      }
      return null;
    }
    function placeFood() {
      const c = freeCell(3);
      S.food = c ? { x: c.x, y: c.y, v: pick(VEG), t: 0 } : null;
    }
    function placeGold() {
      const c = freeCell(4);
      if (!c) return;
      S.gold = { x: c.x, y: c.y, t: 0, life: 8 };
      api.sfx("sparkle");
      floatT(cx(c.x), cy(c.y) - cell * 0.8, "GOLDEN!", "#ffd84d", 22);
    }
    const cx = (gx) => bx + 10 + (gx + 0.5) * cell;
    const cy = (gy) => by + 10 + (gy + 0.5) * cell;
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }
    function banner(text, sub, col, dur) { S.banner = { text, sub, col, t: 0, dur: dur || 1.6 }; }
    function floatT(x, y, text, col, size) { size = size || 24; x = clamp(x, text.length * size * 0.3 + 8, W - text.length * size * 0.3 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 1 }); }
    function burst(x, y, cols2, n, spd) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 220); S.parts.push({ k: "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, g: 600, r: rnd(2.5, 5.5), col: pick(cols2), life: rnd(0.4, 0.75), t: 0 }); }
    }
    function sparkle(x, y, n) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(70, 240); S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 100, r: rnd(5, 10), col: pick(["#ffd84d", "#fff", "#ffe98a", "#ff8fc7"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) }); }
    }
    function gasCloud(x, y, n, big) {
      for (let i = 0; i < n; i++) S.parts.push({ k: "gas", x: x + rnd(-10, 10), y: y + rnd(-8, 8), vx: rnd(-70, 70), vy: rnd(-70, -10), g: -25, r: rnd(8, 14) * (big ? 1.4 : 1), grow: rnd(18, 34), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.9, 1.5), t: 0 });
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function setHud() {
      bbEl.textContent = S.segs.length - 1;
      scEl.textContent = S.score;
      tmEl.textContent = Math.max(0, Math.ceil(S.time));
      tmPill.classList.toggle("hurry", S.state === "play" && S.time <= 10);
    }

    /* ---------- UI ---------- */
    function showPanel(after) {
      const art = `<div>${api.guineaSVG({ size: 78, mood: after && after.crash ? "sad" : "happy" })}</div>` +
        [3, 5, 8].map((s) => `<div>${api.randomGuineaSVG(BABY_SEEDS[s], { size: 52 })}</div>`).join("");
      const lastLine = after ? `<div class="last">🐹 ${after.babies} babies &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art">${art}</div>
        <h2>${after ? (after.isNew ? "New best!" : after.crash ? "Toot! Bonk!" : "What a dance!") : "Guinea Conga"}</h2>${lastLine}
        <p><b>Swipe</b> to steer ${gName}'s conga line. Eat veggies to add <b>babies</b>. Don't bump the fence or your line!</p>
        <div class="chips"><span class="chip">🥕 = new baby</span><span class="chip">🍓 golden = bonus</span><span class="chip">⏱ ${ROUND}s</span></div>
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      pickGrid(); layout();
      reset();
      S.state = "ready"; S.readyT = 1.1;
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud();
      banner("READY...", "swipe to steer", "#ff8fc7", 1.1);
      api.sfx("drum");
    }

    /* ---------- gameplay ---------- */
    function turn(d) {
      if (S.state !== "play" && S.state !== "ready") return;
      const last = S.queue.length ? S.queue[S.queue.length - 1] : S.dir;
      const a = DIRS[d], b = DIRS[last];
      if (a[0] === b[0] && a[1] === b[1]) return;
      if (a[0] === -b[0] && a[1] === -b[1]) return;
      if (S.queue.length < 3) S.queue.push(d);
      S.turned = true;
    }
    function speedStep() { return clamp(0.25 - S.eaten * 0.0045 - (ROUND - S.time) * 0.0007, 0.125, 0.25); }
    function eat(isGold) {
      const h = S.segs[0], x = cx(h.x), y = cy(h.y);
      S.grow += 1;
      S.munchT = 0.45;
      if (S.t - S.lastEat < 3.5) S.combo = Math.min(5, S.combo + 1); else S.combo = 1;
      S.lastEat = S.t; S.bestCombo = Math.max(S.bestCombo, S.combo);
      if (isGold) {
        S.goldens++; S.gold = null;
        const pts = 50 * S.combo; S.score += pts;
        api.sfx("bigwin"); api.haptic(40);
        sparkle(x, y, 28); burst(x, y, ["#ffd84d", "#fff0a8", "#ff5a5f"], 14, 260);
        const [vx, vy] = vp(x, y); api.confetti(vx, vy, 40);
        banner("GOLDEN BERRY!", "+" + pts + " sparkly points", "#ffd84d");
        floatT(x, y - cell * 0.6, "+" + pts, "#ffd84d", 28);
        shake(4); S.flash = 0.18;
      } else {
        S.eaten++;
        const f = S.food;
        const pts = 10 * S.combo; S.score += pts;
        api.sfx(S.combo >= 3 ? "sparkle" : "nom"); api.haptic(15);
        if (Math.random() < 0.4) api.sfx("wheek");
        burst(x, y, f.v.bits, 12, 200);
        floatT(x, y - cell * 0.6, S.combo >= 2 ? "+" + pts + " x" + S.combo : pick(NOMS), S.combo >= 2 ? "#ff8fc7" : "#fff", S.combo >= 2 ? 24 : 22);
        if (S.combo >= 3) banner("CONGA x" + S.combo + "!", "speedy snacking!", "#ff8fc7", 1.2);
        shake(2);
        placeFood();
        S.nextGold--;
        if (!S.gold && S.nextGold <= 0) { placeGold(); S.nextGold = 4 + ((Math.random() * 3) | 0); }
        const n = S.segs.length;
        if (n > 1 && (n % 10 === 0)) { banner(n + " IN A LINE!", "best conga ever!", "#5fd3ff"); api.sfx("fanfare"); }
      }
      S.wowT = 0;
      setHud(); bump(bbEl.parentNode); bump(scEl.parentNode);
    }
    function step() {
      // arrival: head has just reached its cell
      const h = S.segs[0];
      if (S.food && S.food.x === h.x && S.food.y === h.y) eat(false);
      if (S.gold && S.gold.x === h.x && S.gold.y === h.y) eat(true);
      // pick direction
      while (S.queue.length) { const d = S.queue.shift(); const a = DIRS[d], b = DIRS[S.dir]; if (!(a[0] === -b[0] && a[1] === -b[1])) { S.dir = d; break; } }
      const [dx, dy] = DIRS[S.dir];
      const nx = h.x + dx, ny = h.y + dy;
      const growing = S.grow > 0;
      let hit = null;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) hit = "fence";
      else {
        const n = S.segs.length - (growing ? 0 : 1);
        for (let i = 1; i < n; i++) if (S.segs[i].x === nx && S.segs[i].y === ny) { hit = "line"; break; }
      }
      if (hit) { crash(hit, dx, dy); return; }
      const tail = S.segs[S.segs.length - 1];
      const tx = tail.x, ty = tail.y;
      for (const s of S.segs) { s.px = s.x; s.py = s.y; }
      for (let i = S.segs.length - 1; i > 0; i--) { S.segs[i].x = S.segs[i - 1].px; S.segs[i].y = S.segs[i - 1].py; }
      h.x = nx; h.y = ny;
      if (growing) {
        S.grow--;
        const k = (S.segs.length - 1) % babies.length;
        S.segs.push({ x: tx, y: ty, px: tx, py: ty, k, born: S.t });
        floatT(cx(tx), cy(ty) - cell * 0.5, "wheek!", "#c7b3ff", 16);
      }
      // look ahead for the leader's face: snack nearby = wow
      const near = (o) => o && Math.abs(o.x - nx) + Math.abs(o.y - ny) <= 2;
      const ax = nx + dx, ay = ny + dy;
      const danger = ax < 0 || ay < 0 || ax >= cols || ay >= rows || S.segs.some((s, i) => i > 0 && s.x === ax && s.y === ay);
      S.wowT = near(S.food) || near(S.gold) || danger ? 0.4 : S.wowT;
      S.stepT = speedStep();
    }
    function crash(why, dx, dy) {
      S.state = "crash"; S.why = why; S.endT = 0; S.prog = 0;
      S.crash = { dx, dy, t: 0 };
      const h = S.segs[0], x = cx(h.x), y = cy(h.y);
      api.sfx("hit"); api.haptic(90);
      S.tootT = 0.16;
      shake(12);
      // the toot cloud puffs out behind her
      gasCloud(x - dx * cell * 0.9, y - dy * cell * 0.9 + cell * 0.2, 14, false);
      for (const s of S.segs.slice(1)) if (Math.random() < 0.5) gasCloud(cx(s.x), cy(s.y), 3, false);
      const [vx, vy] = vp(x, y); api.gas(vx, vy);
      floatT(x - dx * cell, y - cell * 1.4, pick(TOOTS), "#b6f27a", 30);
      burst(x + dx * cell * 0.5, y + dy * cell * 0.5, ["#fff", "#ffd84d"], 10, 200);
      banner(why === "fence" ? "BONK!" : "TANGLED!", pick(why === "fence" ? FENCE_LINES : TANGLE_LINES), "#b6f27a", 9);
      S.flash = 0.25;
    }
    function timeUp() {
      S.state = "crash"; S.why = "time"; S.endT = 0; S.crash = null;
      api.sfx("fanfare"); banner("TIME'S UP!", "what a conga line!", "#ffd84d", 9);
      const [vx, vy] = vp(W / 2, H * 0.35); api.confetti(vx, vy, 60);
      sparkle(W / 2, H * 0.3, 20);
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const survived = S.why === "time";
      const coins = Math.min(200, Math.round(S.eaten * 5 + S.goldens * 12 + (survived ? 15 : 0)));
      const earned = coins > 0 ? api.award(coins, { reason: "Guinea Conga" }) : 0;
      const hs = api.highscore(ID, S.score);
      const nb = S.segs.length - 1;
      const quip = nb >= 25 ? `${gName} led the longest conga in Wheek World!` : nb >= 14 ? `${gName} is a conga queen!` : nb >= 6 ? `${gName}'s babies love to dance!` : `${gName} wants to dance again!`;
      const how = survived ? "Danced the whole 90 seconds!" : S.why === "fence" ? "Bonked the fence (and tooted)." : "Got tangled in the line (and tooted).";
      const text = `${quip} ${how} ${nb} babies, ${S.score} points${S.goldens ? ", " + S.goldens + " golden berr" + (S.goldens === 1 ? "y" : "ies") : ""}. ${hs.isNew && S.score > 0 ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && S.score > 0 ? "New best!" : survived ? "Time's up!" : "Toot! Bonk!", text, score: S.score });
      hud.classList.add("off");
      showPanel({ babies: nb, earned, isNew: hs.isNew && S.score > 0, crash: !survived });
    }

    function update(dt) {
      S.t += dt;
      if (S.state === "ready") {
        S.readyT -= dt;
        if (S.readyT <= 0) { S.state = "play"; S.prog = 0; S.stepT = speedStep(); banner("CONGA!", "", "#7be04a", 0.9); api.sfx("whoosh"); }
      } else if (S.state === "play") {
        S.time -= dt;
        const sec = Math.ceil(S.time);
        if (sec !== S.lastSec) { S.lastSec = sec; if (sec <= 10 && sec > 0) api.sfx("tick"); setHud(); }
        if (S.time <= 0) { S.time = 0; setHud(); timeUp(); }
        else {
          S.prog += dt / S.stepT;
          let guard = 0;
          while (S.prog >= 1 && S.state === "play" && guard++ < 3) { S.prog -= 1; step(); }
        }
      } else if (S.state === "crash") {
        S.endT += dt;
        if (S.crash) S.crash.t += dt;
        if (S.tootT > 0) { S.tootT -= dt; if (S.tootT <= 0) api.sfx("fart"); }
        if (S.endT > 2) finish();
      }
      if (S.food) S.food.t += dt;
      if (S.gold && S.state === "play") {
        S.gold.t += dt;
        if (S.gold.t > S.gold.life) { burst(cx(S.gold.x), cy(S.gold.y), ["#ffd84d", "#fff"], 8, 120); S.gold = null; }
        else if (Math.random() < dt * 6) S.parts.push({ k: "star", x: cx(S.gold.x) + rnd(-cell * 0.5, cell * 0.5), y: cy(S.gold.y) + rnd(-cell * 0.5, cell * 0.3), vx: 0, vy: -30, g: 0, r: rnd(3, 5), col: pick(["#fff", "#ffd84d"]), life: 0.6, t: 0, rot: 0 });
      }
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 1.5; }
        if (p.k === "star") p.rot += 6 * dt;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 46 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > S.banner.dur) S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 30);
      S.munchT = Math.max(0, S.munchT - dt);
      S.wowT = Math.max(0, S.wowT - dt);
      S.flash = Math.max(0, S.flash - dt);
    }

    /* ---------- drawing ---------- */
    function segPos(s, i, p) {
      // smooth glide between cells, plus a wiggle sideways to the direction of travel
      let x = lerp(cx(s.px), cx(s.x), p), y = lerp(cy(s.py), cy(s.y), p);
      let mx = s.x - s.px, my = s.y - s.py;
      if (!mx && !my) { mx = DIRS[S.dir][0]; my = DIRS[S.dir][1]; }
      const dancing = S.state === "play" || S.state === "ready";
      const ph = S.t * 9 - i * 0.85;
      const wig = dancing ? Math.sin(ph) * cell * 0.09 : 0;
      x += -my * wig; y += mx * wig;
      const hop = dancing && S.state === "play" ? Math.abs(Math.sin((p + i * 0.5) * Math.PI)) * cell * 0.1 : 0;
      return { x, y, mx, my, ph, hop };
    }
    // draws a guinea image with its feet at (x, y); returns the y of the top of its head
    function drawGuineaImg(img, x, y, size, rot, sx, sy2, flip) {
      if (!img.complete || !img.naturalWidth) return y - size * 0.6;
      const ar = img.naturalHeight / img.naturalWidth;
      const w = size, h = size * ar;
      const g = ctx;
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(sx * (flip ? -1 : 1), sy2);
      g.drawImage(img, -w / 2, -h * img._feet, w, h);
      g.restore();
      return y - h * (img._feet - img._top) * sy2;
    }
    function drawFood() {
      const g = ctx;
      if (S.food) {
        const f = S.food, x = cx(f.x), y = cy(f.y);
        const pop = Math.min(1, f.t / 0.25), s = pop < 1 ? 0.3 + pop * 0.9 : 1 + Math.sin(S.t * 5) * 0.06;
        g.fillStyle = "rgba(43,22,64,.18)"; g.beginPath(); g.ellipse(x, y + cell * 0.32, cell * 0.32, cell * 0.1, 0, 0, TAU); g.fill();
        g.save(); g.translate(x, y - Math.abs(Math.sin(S.t * 3)) * cell * 0.08); g.scale(s, s); g.rotate(Math.sin(S.t * 2.4) * 0.12);
        g.fillStyle = "#000"; g.font = Math.round(cell * 0.78) + "px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(f.v.e, 0, 2);
        g.restore();
      }
      if (S.gold) {
        const o = S.gold, x = cx(o.x), y = cy(o.y), left = o.life - o.t;
        if (left > 2 || Math.floor(S.t * 8) % 2 === 0) {
          const pop = Math.min(1, o.t / 0.3), s = (pop < 1 ? 0.3 + pop * 0.9 : 1 + Math.sin(S.t * 7) * 0.08) * cell / 36;
          g.save(); g.translate(x, y); g.globalAlpha = 0.45; g.fillStyle = "#fff6b0";
          g.beginPath(); g.arc(0, 0, cell * (0.62 + Math.sin(S.t * 6) * 0.06), 0, TAU); g.fill(); g.globalAlpha = 1;
          g.scale(s, s); g.rotate(Math.sin(S.t * 3) * 0.15);
          // berry body
          g.beginPath(); g.moveTo(0, 15); g.bezierCurveTo(-16, 4, -16, -10, -7, -11); g.bezierCurveTo(-3, -12, 3, -12, 7, -11); g.bezierCurveTo(16, -10, 16, 4, 0, 15); g.closePath();
          const gr = g.createLinearGradient(-12, -12, 12, 14); gr.addColorStop(0, "#fff3a8"); gr.addColorStop(0.5, "#ffcc33"); gr.addColorStop(1, "#e09a00");
          g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
          g.fillStyle = "#fff8d8";
          [[-6, -4], [0, -6], [6, -4], [-3, 2], [3, 2], [0, 8]].forEach(([a, b]) => { g.beginPath(); g.ellipse(a, b, 1.3, 2, 0, 0, TAU); g.fill(); });
          g.fillStyle = "#7be04a"; g.beginPath(); g.moveTo(-9, -11); g.lineTo(-3, -17); g.lineTo(0, -12); g.lineTo(3, -17); g.lineTo(9, -11); g.lineTo(0, -9); g.closePath(); g.fill(); g.lineWidth = 2.5; g.stroke();
          g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-6, -5, 2.5, 3.5, -0.5, 0, TAU); g.fill();
          g.restore();
          // countdown ring
          g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 3;
          g.beginPath(); g.arc(x, y, cell * 0.58, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(left / o.life, 0, 1)); g.stroke();
        }
      }
    }
    function drawLine() {
      const g = ctx, segs = S.segs;
      if (!segs.length) return;
      const p = S.state === "play" ? clamp(S.prog, 0, 1) : S.state === "ready" ? 0 : 1;
      const pos = segs.map((s, i) => segPos(s, i, p));
      if (S.crash && S.crash.t < 0.5) { const b = Math.sin(clamp(S.crash.t / 0.25, 0, 1) * Math.PI) * cell * 0.28; pos[0].x += S.crash.dx * b; pos[0].y += S.crash.dy * b; }
      // shadows
      g.fillStyle = "rgba(43,22,64,.16)";
      pos.forEach((q, i) => { const r = (i ? 0.36 : 0.46) * cell; g.beginPath(); g.ellipse(q.x, q.y + cell * 0.3, r, r * 0.32, 0, 0, TAU); g.fill(); });
      // conga sash connecting everyone (paws on hips!)
      if (pos.length > 1) {
        g.lineJoin = "round"; g.lineCap = "round";
        g.beginPath(); pos.forEach((q, i) => (i ? g.lineTo(q.x, q.y + cell * 0.12 - q.hop) : g.moveTo(q.x, q.y + cell * 0.12 - q.hop)));
        g.strokeStyle = INK; g.lineWidth = cell * 0.22 + 5; g.stroke();
        g.strokeStyle = "#ff8fc7"; g.lineWidth = cell * 0.22; g.stroke();
        g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = cell * 0.06;
        g.setLineDash([cell * 0.15, cell * 0.25]); g.stroke(); g.setLineDash([]);
      }
      // babies, tail first so the line overlaps nicely
      for (let i = segs.length - 1; i >= 1; i--) {
        const s = segs[i], q = pos[i];
        const age = s.born >= 0 ? S.t - s.born : 9;
        const grow = age < 0.35 ? 0.2 + (age / 0.35) * 1.0 : age < 0.5 ? 1.2 - (age - 0.35) / 0.15 * 0.2 : 1;
        const sq = Math.sin(q.ph * 2) * 0.06;
        const dizzy = S.state === "crash" || S.state === "over" ? Math.sin(S.t * 14 + i) * 0.2 : 0;
        drawGuineaImg(babies[s.k], q.x, q.y + cell * 0.36 - q.hop, cell * 1.08 * grow, Math.sin(q.ph) * 0.14 + q.mx * 0.08 + dizzy, 1 + sq, 1 - sq, q.mx < 0);
      }
      // leader
      const q = pos[0];
      const mood = S.state === "crash" && S.why !== "time" || S.state === "over" && S.why !== "time" ? "sad" : S.munchT > 0 ? "munch" : S.wowT > 0 || S.state === "ready" ? "wow" : "happy";
      const sq = S.munchT > 0 ? Math.sin(S.munchT * 40) * 0.1 : Math.sin(q.ph * 2) * 0.05;
      const crashSq = S.crash && S.crash.t < 0.4 ? 0.2 * (1 - S.crash.t / 0.4) : 0;
      const headY = drawGuineaImg(lead[mood], q.x, q.y + cell * 0.4 - q.hop, cell * 1.42, Math.sin(q.ph) * 0.1 + q.mx * 0.1, 1 + sq + crashSq, 1 - sq - crashSq, q.mx < 0);
      // a little crown so she stands out as the leader
      const cw = cell * 0.36, top = headY + cell * 0.12;
      g.save(); g.translate(q.x, top); g.rotate(Math.sin(q.ph) * 0.15);
      g.beginPath(); g.moveTo(-cw, 0); g.lineTo(-cw, -cw * 0.9); g.lineTo(-cw * 0.45, -cw * 0.4); g.lineTo(0, -cw * 1.1); g.lineTo(cw * 0.45, -cw * 0.4); g.lineTo(cw, -cw * 0.9); g.lineTo(cw, 0); g.closePath();
      g.fillStyle = "#ffd84d"; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke();
      g.fillStyle = "#ff5a5f"; g.beginPath(); g.arc(0, -cw * 0.35, cw * 0.18, 0, TAU); g.fill();
      g.restore();
      // dizzy stars after a crash
      if (S.state === "crash" && S.why !== "time" || S.state === "over" && S.why !== "time") {
        for (let k = 0; k < 3; k++) {
          const a = S.t * 4 + k * TAU / 3;
          g.fillStyle = "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 1.5;
          drawStar(g, q.x + Math.cos(a) * cell * 0.55, top - cell * 0.2 + Math.sin(a) * cell * 0.15, cell * 0.14, a);
        }
      }
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.22 ? 0.4 + (t / 0.22) * 0.8 : t < 0.36 ? 1.2 - ((t - 0.22) / 0.14) * 0.2 : 1;
      const out = t > b.dur - 0.3 ? (b.dur - t) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, by + rows * cell * 0.3 + 10); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(44, W * 0.9 / (b.text.length * 0.68 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) { const ss = Math.min(18, W * 0.9 / (b.sub.length * 0.55)); txt(g, b.sub, 0, size * 0.85, ss, "#fff", 5); }
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      // background: soft lilac sky with dots
      const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, "#d9c9ff"); sk.addColorStop(1, "#c4f0a2");
      g.fillStyle = sk; g.fillRect(0, 0, W, H);
      g.save();
      if (S.shake > 0) g.translate(rnd(-S.shake, S.shake) * 0.6, rnd(-S.shake, S.shake) * 0.6);
      if (boardCv) {
        g.fillStyle = "rgba(43,22,64,.9)"; rr(g, bx + 2, by + 7, cols * cell + 16, rows * cell + 16, 18); g.fill();
        g.drawImage(boardCv, bx, by, boardCv.width / dpr, boardCv.height / dpr);
      }
      drawFood();
      drawParts(true);
      if (S.segs && S.segs.length) drawLine();
      drawParts(false);
      drawHint();
      g.globalAlpha = 1;
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.7) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, f.t - 0.12);
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = (S.why ? "rgba(155,217,106," : "rgba(255,246,176,") + S.flash * 1.6 + ")"; g.fillRect(0, 0, W, H); }
      if (S.state === "crash" || S.state === "over") { g.fillStyle = "rgba(43,22,64," + Math.min(0.25, (S.state === "over" ? 2 : S.endT) * 0.25) + ")"; g.fillRect(0, 0, W, H); }
      drawBanner();
    }
    function drawHint() {
      if (S.turned || (S.state !== "play" && S.state !== "ready") || S.t < 1.2) return;
      const g = ctx, y = by + rows * cell - 14, s = 1 + Math.sin(S.t * 6) * 0.06;
      g.save(); g.translate(W / 2, y); g.scale(s, s);
      txt(g, "👆 SWIPE to turn!", 0, 0, Math.min(22, W / 16), "#fff", 5);
      g.restore();
    }
    function drawParts(gasOnly) {
      const g = ctx;
      for (const p of S.parts) {
        if ((p.k === "gas") !== gasOnly) continue;
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.6 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else if (p.k === "gas") { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); g.strokeStyle = "rgba(47,125,20,.5)"; g.lineWidth = 2; g.stroke(); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
      }
      g.globalAlpha = 1;
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
    let ptr = null;
    function onDown(e) {
      e.preventDefault();
      ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onMove(e) {
      if (!ptr || e.pointerId !== ptr.id) return;
      const dx = e.clientX - ptr.x, dy = e.clientY - ptr.y;
      const th = Math.max(18, cell * 0.55);
      if (Math.abs(dx) < th && Math.abs(dy) < th) return;
      turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
      ptr.x = e.clientX; ptr.y = e.clientY; ptr.moved = true;
    }
    function onUp(e) {
      if (!ptr || e.pointerId !== ptr.id) return;
      const moved = ptr.moved; ptr = null;
      if (moved || (S.state !== "play" && S.state !== "ready") || !S.segs.length) return;
      // a tap turns toward where you tapped (relative to the leader)
      const r = cv.getBoundingClientRect(), h = S.segs[0];
      const p = S.state === "play" ? clamp(S.prog, 0, 1) : 0;
      const hx = lerp(cx(h.px), cx(h.x), p), hy = lerp(cy(h.py), cy(h.y), p);
      const tx = e.clientX - r.left - hx, ty = e.clientY - r.top - hy;
      const cur = S.queue.length ? S.queue[S.queue.length - 1] : S.dir;
      if (cur === "left" || cur === "right") turn(ty < 0 ? "up" : "down");
      else turn(tx < 0 ? "left" : "right");
    }
    function onCancel() { ptr = null; }
    const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right" };
    function onKey(e) {
      const d = KEYS[e.key];
      if (d && (S.state === "play" || S.state === "ready")) { e.preventDefault(); turn(d); }
    }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
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
    wrap._conga = { S, turn, grid: () => ({ cols, rows, cell, bx, by }) }; // test hook

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
    id: ID, name: "Guinea Conga", icon: "🐹", place: "arcade", kind: "skill",
    blurb: "Lead a wiggly conga line of baby guineas. Don't bump!",
    mount,
  });
})();
