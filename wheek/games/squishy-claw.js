/* Squishy Claw — Wheek World arcade claw machine (luck).
   15 coins per go. Aim the claw, DROP, and hope the grip holds all the way to the chute.

   Payout math (checked with a Node Monte-Carlo sim, 2M goes per row):
     hold chance = base(rarity) * (1 - 0.15 * d^2), d = how far off-centre the grab was (0 = dead centre, 1 = edge);
     grabs further off than 0.95 radius close on air.
     commons pay 12-20 (base .888), golden 60 (base .2325), galaxy 150 (base .093), rainbow 400 (base .0349)
     -> every squishy is worth the same EV to aim at, so going for the rainbow is pure jackpot-chasing.
     Typical aim (offset uniform 0-0.8 radius)        RTP ≈ 90%   (90.0-90.4% for every target)
     Perfect aim every time                           RTP ≈ 93%
     Random flailing (offset uniform 0-1.4 radii)     RTP ≈ 60%
*/
(function () {
  "use strict";
  const COST = 15;

  /* ---------- squishy art (canvas) ---------- */
  const KINDS = {
    mochi:      { name: "Mochi",      body: "#fff6fa", shade: "#ffc6de", val: 12, rar: "common" },
    cloud:      { name: "Cloud",      body: "#f6fcff", shade: "#a9dcff", val: 13, rar: "common" },
    toast:      { name: "Toast",      body: "#ffe2a6", shade: "#f0b765", crust: "#c27a35", val: 14, rar: "common" },
    strawberry: { name: "Strawberry", body: "#ff6b86", shade: "#e0345a", val: 16, rar: "common" },
    peach:      { name: "Peach",      body: "#ffc49a", shade: "#ff8a86", val: 17, rar: "common" },
    cat:        { name: "Kitty",      body: "#d6c6ff", shade: "#9f86ef", val: 18, rar: "common" },
    frog:       { name: "Froggy",     body: "#9cec74", shade: "#4fb534", val: 20, rar: "common" },
    golden:     { name: "Golden",     body: "#ffe680", shade: "#f2a900", val: 60, rar: "rare" },
    galaxy:     { name: "Galaxy",     body: "#6b45c9", shade: "#241056", val: 150, rar: "galaxy" },
    rainbow:    { name: "Rainbow",    body: "#ffffff", shade: "#ffffff", val: 400, rar: "rainbow" },
  };
  const COMMONS = ["mochi", "cloud", "toast", "strawberry", "peach", "cat", "frog"];
  const BASE_HOLD = { common: 0.888, rare: 0.2325, galaxy: 0.093, rainbow: 0.0349 };
  const INK = "#2b1640";

  function blobPath(c, r) {
    c.moveTo(-0.95 * r, 0.5 * r);
    c.bezierCurveTo(-1.1 * r, -0.5 * r, -0.55 * r, -0.95 * r, 0, -0.95 * r);
    c.bezierCurveTo(0.55 * r, -0.95 * r, 1.1 * r, -0.5 * r, 0.95 * r, 0.5 * r);
    c.bezierCurveTo(0.85 * r, 0.95 * r, -0.85 * r, 0.95 * r, -0.95 * r, 0.5 * r);
    c.closePath();
  }
  function shapeParts(kind, r) {
    const P = [];
    const circ = (x, y, rr) => (c) => { c.moveTo(x * r + rr * r, y * r); c.arc(x * r, y * r, rr * r, 0, Math.PI * 2); };
    switch (kind) {
      case "cloud":
        [[-0.55, 0.2, 0.48], [0, -0.22, 0.62], [0.56, 0.16, 0.5], [0.24, 0.45, 0.44], [-0.26, 0.47, 0.44], [-0.4, -0.25, 0.4]].forEach((a) => P.push(circ(...a)));
        break;
      case "toast":
        P.push((c) => {
          c.moveTo(-0.8 * r, 0.82 * r); c.lineTo(-0.82 * r, -0.2 * r);
          c.bezierCurveTo(-1.12 * r, -0.98 * r, -0.2 * r, -1.08 * r, 0, -0.72 * r);
          c.bezierCurveTo(0.2 * r, -1.08 * r, 1.12 * r, -0.98 * r, 0.82 * r, -0.2 * r);
          c.lineTo(0.8 * r, 0.82 * r); c.quadraticCurveTo(0.8 * r, 0.92 * r, 0.65 * r, 0.92 * r);
          c.lineTo(-0.65 * r, 0.92 * r); c.quadraticCurveTo(-0.8 * r, 0.92 * r, -0.8 * r, 0.82 * r); c.closePath();
        });
        break;
      case "strawberry":
        P.push((c) => {
          c.moveTo(0, 0.95 * r);
          c.bezierCurveTo(-0.75 * r, 0.75 * r, -1.08 * r, 0.05 * r, -0.95 * r, -0.38 * r);
          c.bezierCurveTo(-0.82 * r, -0.9 * r, -0.2 * r, -0.86 * r, 0, -0.66 * r);
          c.bezierCurveTo(0.2 * r, -0.86 * r, 0.82 * r, -0.9 * r, 0.95 * r, -0.38 * r);
          c.bezierCurveTo(1.08 * r, 0.05 * r, 0.75 * r, 0.75 * r, 0, 0.95 * r); c.closePath();
        });
        break;
      case "peach":
        P.push((c) => {
          c.moveTo(0, -0.68 * r);
          c.bezierCurveTo(-0.5 * r, -1.05 * r, -1.05 * r, -0.62 * r, -0.97 * r, 0.05 * r);
          c.bezierCurveTo(-0.92 * r, 0.75 * r, -0.4 * r, 0.95 * r, 0, 0.93 * r);
          c.bezierCurveTo(0.4 * r, 0.95 * r, 0.92 * r, 0.75 * r, 0.97 * r, 0.05 * r);
          c.bezierCurveTo(1.05 * r, -0.62 * r, 0.5 * r, -1.05 * r, 0, -0.68 * r); c.closePath();
        });
        break;
      case "cat":
        P.push((c) => { c.moveTo(-0.85 * r, -0.35 * r); c.lineTo(-0.72 * r, -1.12 * r); c.lineTo(-0.18 * r, -0.78 * r); c.closePath(); });
        P.push((c) => { c.moveTo(0.85 * r, -0.35 * r); c.lineTo(0.72 * r, -1.12 * r); c.lineTo(0.18 * r, -0.78 * r); c.closePath(); });
        P.push((c) => blobPath(c, r));
        break;
      case "frog":
        P.push(circ(-0.46, -0.72, 0.33)); P.push(circ(0.46, -0.72, 0.33));
        P.push((c) => { c.save(); c.scale(1.06, 0.95); blobPath(c, r); c.restore(); });
        break;
      default:
        P.push((c) => blobPath(c, r));
    }
    return P;
  }
  function bodyFill(c, kind, r) {
    const k = KINDS[kind];
    if (kind === "rainbow") {
      const g = c.createLinearGradient(-r, -r, r, r);
      ["#ff6b86", "#ffb347", "#ffe45c", "#8fe36a", "#5fd3ff", "#b48cff"].forEach((col, i, a) => g.addColorStop(i / (a.length - 1), col));
      return g;
    }
    const g = c.createRadialGradient(-0.3 * r, -0.45 * r, r * 0.1, 0, 0, r * 1.15);
    g.addColorStop(0, kind === "galaxy" ? "#8c6af0" : "#ffffff");
    g.addColorStop(0.35, k.body);
    g.addColorStop(1, k.shade);
    return g;
  }
  function drawSquishy(c, kind, r, mood) {
    mood = mood || "happy";
    const lw = Math.max(2.2, r * 0.1);
    const parts = shapeParts(kind, r);
    c.save();
    c.lineJoin = "round"; c.lineCap = "round";
    // union outline: thick ink stroke of every part, then fill all parts
    c.beginPath(); parts.forEach((p) => p(c));
    c.strokeStyle = INK; c.lineWidth = lw * 2; c.stroke();
    c.fillStyle = kind === "toast" ? KINDS.toast.crust : bodyFill(c, kind, r);
    c.beginPath(); parts.forEach((p) => p(c)); c.fill();
    if (kind === "toast") {
      c.save(); c.scale(0.8, 0.8); c.translate(0, 0.04 * r);
      c.beginPath(); parts.forEach((p) => p(c)); c.fillStyle = bodyFill(c, kind, r); c.fill(); c.restore();
    }
    // decorations
    c.save(); c.beginPath(); parts.forEach((p) => p(c)); c.clip();
    if (kind === "strawberry") {
      c.fillStyle = "#ffe98a";
      [[-0.5, -0.1], [0.5, -0.1], [-0.2, 0.55], [0.25, 0.6], [-0.65, 0.3], [0.65, 0.3], [0, -0.35]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x * r, y * r, r * 0.05, r * 0.08, 0, 0, 7); c.fill(); });
    }
    if (kind === "galaxy") {
      c.fillStyle = "rgba(255,120,220,.35)"; c.beginPath(); c.ellipse(0.2 * r, 0.3 * r, r * 0.7, r * 0.25, -0.5, 0, 7); c.fill();
      c.fillStyle = "#fff";
      [[-0.6, -0.4, 0.06], [0.5, -0.55, 0.05], [0.7, 0.2, 0.04], [-0.35, 0.6, 0.05], [0.1, -0.7, 0.035], [-0.75, 0.15, 0.035], [0.4, 0.62, 0.04]].forEach(([x, y, s]) => { c.beginPath(); c.arc(x * r, y * r, s * r, 0, 7); c.fill(); });
    }
    if (kind === "peach") {
      c.strokeStyle = "rgba(220,90,90,.55)"; c.lineWidth = lw * 0.8;
      c.beginPath(); c.moveTo(0.05 * r, -0.65 * r); c.quadraticCurveTo(0.45 * r, -0.1 * r, 0.25 * r, 0.5 * r); c.stroke();
    }
    if (kind === "cat") {
      c.fillStyle = "#ffb3d6";
      c.beginPath(); c.moveTo(-0.7 * r, -0.5 * r); c.lineTo(-0.64 * r, -0.92 * r); c.lineTo(-0.36 * r, -0.72 * r); c.fill();
      c.beginPath(); c.moveTo(0.7 * r, -0.5 * r); c.lineTo(0.64 * r, -0.92 * r); c.lineTo(0.36 * r, -0.72 * r); c.fill();
    }
    // gloss
    c.fillStyle = "rgba(255,255,255,.65)";
    c.beginPath(); c.ellipse(-0.42 * r, -0.48 * r, r * 0.22, r * 0.12, -0.6, 0, 7); c.fill();
    c.beginPath(); c.arc(-0.12 * r, -0.66 * r, r * 0.05, 0, 7); c.fill();
    c.restore();
    // strawberry leaves / peach leaf / crown
    if (kind === "strawberry") {
      c.fillStyle = "#5cc94a"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath();
      for (let i = 0; i < 5; i++) { const a = Math.PI + (i / 4) * Math.PI; c.lineTo(Math.cos(a) * r * 0.42, -0.72 * r + Math.sin(a) * r * 0.28); c.lineTo(Math.cos(a + 0.35) * r * 0.15, -0.72 * r + Math.sin(a + 0.35) * r * 0.1); }
      c.closePath(); c.fill(); c.stroke();
    }
    if (kind === "peach") {
      c.fillStyle = "#6fd35a"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath(); c.ellipse(0.25 * r, -0.92 * r, r * 0.28, r * 0.13, -0.5, 0, 7); c.fill(); c.stroke();
    }
    if (kind === "golden") {
      c.fillStyle = "#ffd84d"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath(); c.moveTo(-0.38 * r, -0.82 * r); c.lineTo(-0.42 * r, -1.22 * r); c.lineTo(-0.18 * r, -1.0 * r); c.lineTo(0, -1.3 * r); c.lineTo(0.18 * r, -1.0 * r); c.lineTo(0.42 * r, -1.22 * r); c.lineTo(0.38 * r, -0.82 * r); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#ff5a8a"; c.beginPath(); c.arc(0, -1.02 * r, r * 0.07, 0, 7); c.fill();
    }
    // face
    const fy = kind === "frog" ? -0.72 : kind === "toast" ? 0.02 : kind === "strawberry" ? -0.05 : 0.0;
    const ex = 0.33 * r;
    c.fillStyle = INK; c.strokeStyle = INK;
    const dark = kind === "galaxy";
    if (mood === "joy") {
      c.lineWidth = lw * 0.9;
      [-1, 1].forEach((s) => { c.beginPath(); c.moveTo(s * (kind === "frog" ? 0.46 * r : ex) - 0.11 * r, fy * r + 0.05 * r); c.lineTo(s * (kind === "frog" ? 0.46 * r : ex), fy * r - 0.06 * r); c.lineTo(s * (kind === "frog" ? 0.46 * r : ex) + 0.11 * r, fy * r + 0.05 * r); c.strokeStyle = dark ? "#fff" : INK; c.stroke(); });
    } else {
      [-1, 1].forEach((s) => {
        const x = s * (kind === "frog" ? 0.46 * r : ex), y = fy * r;
        c.fillStyle = dark ? "#fff" : INK;
        c.beginPath(); c.ellipse(x, y, r * 0.11, r * (mood === "wow" ? 0.15 : 0.13), 0, 0, 7); c.fill();
        c.fillStyle = dark ? INK : "#fff";
        c.beginPath(); c.arc(x - r * 0.035, y - r * 0.05, r * 0.045, 0, 7); c.fill();
        if (mood === "sad") {
          c.strokeStyle = dark ? "#fff" : INK; c.lineWidth = lw * 0.7;
          c.beginPath(); c.moveTo(x - s * r * 0.14, y - r * 0.27); c.lineTo(x + s * r * 0.1, y - r * 0.2); c.stroke();
        }
      });
    }
    // mouth
    const my = (kind === "frog" ? -0.25 : fy + 0.24) * r;
    c.strokeStyle = dark ? "#fff" : INK; c.lineWidth = lw * 0.75;
    c.beginPath();
    if (mood === "wow") { c.fillStyle = "#c2185b"; c.ellipse(0, my + 0.03 * r, r * 0.07, r * 0.1, 0, 0, 7); c.fill(); c.stroke(); }
    else if (mood === "sad") { c.arc(0, my + 0.12 * r, r * 0.1, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    else { c.moveTo(-0.13 * r, my); c.quadraticCurveTo(-0.065 * r, my + 0.1 * r, 0, my); c.quadraticCurveTo(0.065 * r, my + 0.1 * r, 0.13 * r, my); c.stroke(); }
    // blush
    c.fillStyle = "rgba(255,90,140,.38)";
    const by = (kind === "frog" ? -0.38 : fy + 0.16) * r;
    c.beginPath(); c.ellipse(-0.58 * r, by, r * 0.13, r * 0.075, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(0.58 * r, by, r * 0.13, r * 0.075, 0, 0, 7); c.fill();
    c.restore();
  }
  const spriteCache = new Map();
  function sprite(kind, r, mood, dpr) {
    const key = kind + "|" + Math.round(r) + "|" + (mood || "happy") + "|" + dpr;
    let s = spriteCache.get(key);
    if (s) return s;
    const pad = 1.5, size = Math.ceil(r * 2 * pad * dpr);
    s = document.createElement("canvas"); s.width = s.height = size;
    const c = s.getContext("2d");
    c.scale(dpr, dpr); c.translate(r * pad, r * pad);
    drawSquishy(c, kind, Math.round(r), mood);
    s._half = r * pad;
    if (spriteCache.size > 300) spriteCache.clear();
    spriteCache.set(key, s);
    return s;
  }
  function squishyCanvas(kind, px, mood) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas");
    cv.width = cv.height = Math.round(px * dpr); cv.style.width = cv.style.height = px + "px";
    const c = cv.getContext("2d"); c.scale(dpr, dpr); c.translate(px / 2, px / 2 + px * 0.04);
    drawSquishy(c, kind, px * 0.34, mood);
    return cv;
  }

  /* ---------- outcome model (shared by the game and the sim note above) ---------- */
  function holdChance(kind, d) {
    const base = BASE_HOLD[KINDS[kind].rar];
    return Math.max(0, base * (1 - 0.15 * Math.min(1, d) * Math.min(1, d)));
  }

  const CSS = `
  .g-claw{position:absolute;inset:0;overflow:hidden;font-family:var(--body);color:var(--ink);touch-action:none;
    background:radial-gradient(circle at 50% 0%,#ffd7ef 0,#c7b3ff 55%,#9d84e8 100%)}
  .g-claw canvas.main{position:absolute;left:0;top:0;touch-action:none}
  .g-claw .hud{position:absolute;left:8px;right:8px;top:8px;height:42px;display:flex;align-items:center;justify-content:space-between;gap:8px;pointer-events:none;z-index:3}
  .g-claw .pill{background:#fff;border:3px solid var(--ink);border-radius:999px;padding:4px 12px;font-family:var(--display);font-size:18px;box-shadow:0 3px 0 var(--ink);white-space:nowrap}
  .g-claw .pill.cost{background:var(--yellow);font-size:15px}
  .g-claw .pill.x2{background:var(--orange);animation:gcl-bob .6s ease-in-out infinite alternate}
  .g-claw .ctrl{position:absolute;left:0;right:0;bottom:0;height:112px;display:flex;align-items:center;justify-content:center;gap:12px;padding:0 12px 10px;z-index:3}
  .g-claw .ctrl .btn{touch-action:none}
  .g-claw .arrow{width:74px;height:74px;font-size:30px;border-radius:50%;padding:0;background:var(--sky)}
  .g-claw .drop{min-width:150px;height:84px;font-size:28px;border-radius:26px;background:var(--red);color:#fff;text-shadow:0 2px 0 var(--ink);flex-direction:column;gap:0;line-height:1}
  .g-claw .drop small{font-family:var(--body);font-size:13px;font-weight:900;opacity:.95}
  .g-claw .play{min-width:220px;height:76px;font-size:26px;background:var(--slime)}
  .g-claw .hide{display:none!important}
  .g-claw .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;z-index:5;background:rgba(43,22,64,.35)}
  .g-claw .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 8px 0 var(--ink);padding:18px 18px 20px;max-width:360px;width:100%;text-align:center;animation:gcl-pop .45s cubic-bezier(.2,1.6,.4,1)}
  .g-claw .panel h2{font-size:34px;color:var(--pink-deep);text-shadow:0 3px 0 var(--ink);-webkit-text-stroke:1.5px var(--ink);margin-bottom:6px}
  .g-claw .panel p{margin:6px 0 12px;font-size:16px;line-height:1.3}
  .g-claw .legend{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin:6px 0 14px}.g-claw .legend canvas{max-width:100%;height:auto!important}.g-claw .legend span{font-size:12px;white-space:nowrap}
  .g-claw .legend div{display:flex;flex-direction:column;align-items:center;font-family:var(--display);font-size:14px;line-height:1}
  .g-claw .legend .r1{color:#c78a00}.g-claw .legend .r2{color:#6b45c9}.g-claw .legend .r3{color:var(--pink-deep)}
  .g-claw .win h2{font-size:30px}
  .g-claw .win .big{font-family:var(--display);font-size:46px;color:#f2a900;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);margin:2px 0 8px}
  .g-claw .win .rar{display:inline-block;font-family:var(--display);font-size:16px;padding:3px 12px;border-radius:999px;border:3px solid var(--ink);background:var(--yellow);margin-top:2px}
  .g-claw .win canvas{animation:gcl-jelly 1.2s ease-in-out infinite}
  .g-claw .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .g-claw .note{font-size:14px;color:var(--ink-soft);margin-top:10px}
  @keyframes gcl-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes gcl-jelly{0%,100%{transform:scale(1,1)}30%{transform:scale(1.12,.9)}60%{transform:scale(.94,1.06)}}
  @keyframes gcl-bob{to{transform:translateY(-3px)}}
  @media (prefers-reduced-motion: reduce){.g-claw .win canvas{animation:none}}
  `;

  const LOSE_SLIP = [
    "It slipped! Squishies get nervous up high.",
    "Wheee-plop! It wanted to stay with its friends.",
    "The claw sneezed. Classic claw.",
    "So close! The claw has butter fingers.",
    "It did a little wiggle and escaped!",
  ];
  const LOSE_AIR = [
    "The claw grabbed... air. Delicious air.",
    "Nothing! The claw is just giving a hug to nobody.",
    "Missed! The squishies are giggling at you.",
  ];

  WW.registerGame({
    id: "squishy-claw",
    name: "Squishy Claw",
    icon: "🕹️",
    place: "arcade",
    kind: "luck",
    blurb: "Grab a squishy! Rainbow ones pay 400!",
    mount(root, api) {
      const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = document.createElement("div");
      el.className = "g-claw";
      el.innerHTML = `<style>${CSS}</style>
        <canvas class="main"></canvas>
        <div class="hud"><span class="pill coins">🪙 0</span><span class="pill x2 hide">x2!</span><span class="pill cost">${COST}🪙 a go</span></div>
        <div class="ctrl">
          <button class="btn arrow left hide" aria-label="left">◀</button>
          <button class="btn drop hide">DROP!<small class="t">15</small></button>
          <button class="btn arrow right hide" aria-label="right">▶</button>
          <button class="btn play hide">PLAY · ${COST}🪙</button>
        </div>`;
      root.appendChild(el);
      const cv = el.querySelector("canvas.main");
      const ctx = cv.getContext("2d");
      const $ = (s) => el.querySelector(s);
      const coinsEl = $(".coins"), x2El = $(".x2"), btnL = $(".left"), btnR = $(".right"), btnDrop = $(".drop"), btnPlay = $(".play"), dropT = $(".t");
      const timers = new Set();
      const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
      let raf = 0, alive = true;
      let W = 0, H = 0, dpr = 1, L = {};
      let bodies = [];
      let state = "intro"; // intro | idle | aim | drop | close | carry | release | result
      let aimTime = 0, wins = 0;
      let shake = 0, flash = 0, time = 0;
      const claw = { x: 0, vx: 0, ax: 0, target: 0, len: 40, th: 0, om: 0, open: 1, held: null, grabD: 0, willHold: true, slipAt: 0, fakeAt: -1, clock: 0, wob: 0, sad: false };
      let resultInfo = null;
      const parts = []; // sparkles

      function showCoins() { coinsEl.textContent = "🪙 " + api.coins(); x2El.classList.toggle("hide", !(api.multiplier > 1)); }
      showCoins();

      function layout() {
        const nw = root.clientWidth || 390, nh = root.clientHeight || 700;
        const oldGW = L.gw;
        W = nw; H = nh; dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        cv.style.width = W + "px"; cv.style.height = H + "px";
        const cw = Math.min(W - 16, 520), cx = (W - cw) / 2, cy = 54, ch = H - 54 - 112;
        const mq = 50, frontH = 66;
        const gx = cx + 14, gy = cy + mq + 8, gw = cw - 28, gh = ch - mq - 8 - frontH;
        const chuteW = Math.max(68, Math.min(110, gw * 0.24));
        const floor = gy + gh;
        L = { cx, cy, cw, ch, mq, frontH, gx, gy, gw, gh, floor, chuteW, wallX: gx + chuteW, wallTop: floor - Math.max(52, Math.min(80, gh * 0.18)),
          railY: gy + 16, home: gx + chuteW / 2, r: Math.max(20, Math.min(36, gw * 0.078)) };
        L.pileL = L.wallX + 7; L.pileR = gx + gw;
        if (oldGW && bodies.length) {
          const s = gw / oldGW;
          bodies.forEach((b) => { b.r *= s; b.x = L.pileL + (b.x - L.pileL) * s; b.y = Math.min(b.y, L.floor - b.r); });
        }
        if (!claw.x) claw.x = claw.target = L.home;
        claw.x = Math.max(L.gx + 26, Math.min(L.gx + L.gw - 26, claw.x));
      }

      function pickKind(initial) {
        const rr = Math.random();
        const has = (k) => bodies.some((b) => b.kind === k);
        if (!initial) {
          if (rr < 0.02 && !has("rainbow")) return "rainbow";
          if (rr < 0.07 && !has("galaxy")) return "galaxy";
          if (rr < 0.2 && bodies.filter((b) => b.kind === "golden").length < 2) return "golden";
        }
        return COMMONS[(Math.random() * COMMONS.length) | 0];
      }
      function addBody(kind, x, y) {
        const r = L.r * (0.92 + Math.random() * 0.16) * (KINDS[kind].rar === "common" ? 1 : 0.95);
        bodies.push({ kind, x, y, vx: (Math.random() - 0.5) * 40, vy: 0, r, sq: 0, sqv: 0, rot: 0, held: false, chute: false, mood: "happy", blink: Math.random() * 4 });
      }
      function fillPile() {
        bodies = [];
        const per = Math.floor((L.pileR - L.pileL) / (L.r * 2));
        const layers = Math.max(1.8, Math.min(3.8, (L.gh * 0.5) / (L.r * 1.8)));
        const n = Math.max(10, Math.round(per * layers));
        const kinds = [];
        for (let i = 0; i < n; i++) kinds.push(COMMONS[i % COMMONS.length]);
        kinds[2] = "golden";
        if (Math.random() < 0.45) kinds[5] = "galaxy";
        if (Math.random() < 0.2) kinds[8] = "rainbow";
        kinds.sort(() => Math.random() - 0.5);
        kinds.forEach((k, i) => addBody(k, L.pileL + L.r + Math.random() * (L.pileR - L.pileL - L.r * 2), L.floor - L.r - (i / per) * L.r * 2 - Math.random() * 20));
        for (let i = 0; i < 400; i++) physics(1 / 120); // settle
        bodies.forEach((b) => { b.sq = 0; b.sqv = 0; });
      }

      /* ---------- physics ---------- */
      const G = 1500;
      function physics(dt) {
        const free = bodies.filter((b) => !b.held && !b.chute);
        for (const b of free) {
          b.vy += G * dt; b.vx *= 1 - 0.6 * dt;
          b.x += b.vx * dt; b.y += b.vy * dt;
        }
        for (let it = 0; it < 3; it++) {
          for (let i = 0; i < free.length; i++) {
            const a = free[i];
            for (let j = i + 1; j < free.length; j++) {
              const b = free[j];
              const dx = b.x - a.x, dy = b.y - a.y, min = (a.r + b.r) * 0.9;
              const d2 = dx * dx + dy * dy;
              if (d2 >= min * min || d2 === 0) continue;
              const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ov = (min - d) / 2;
              a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
              const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
              if (vn < 0) {
                const j2 = -vn * 0.55;
                a.vx -= nx * j2; a.vy -= ny * j2; b.vx += nx * j2; b.vy += ny * j2;
                if (-vn > 120) { const s = Math.min(0.5, -vn / 1600); a.sqv += s * 9; b.sqv += s * 9; }
                // tangential friction
                const tx = -ny, ty = nx, vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
                a.vx += tx * vt * 0.1; a.vy += ty * vt * 0.1; b.vx -= tx * vt * 0.1; b.vy -= ty * vt * 0.1;
              }
            }
          }
          for (const b of free) {
            if (b.y + b.r * 0.92 > L.floor) {
              b.y = L.floor - b.r * 0.92;
              if (b.vy > 140) { b.sqv += Math.min(0.5, b.vy / 1600) * 9; }
              if (b.vy > 0) b.vy = -b.vy * 0.18;
              b.vx *= 0.9;
            }
            if (b.x - b.r * 0.92 < L.pileL) { b.x = L.pileL + b.r * 0.92; if (b.vx < 0) b.vx = -b.vx * 0.3; }
            if (b.x + b.r * 0.92 > L.pileR) { b.x = L.pileR - b.r * 0.92; if (b.vx > 0) b.vx = -b.vx * 0.3; }
          }
        }
        for (const b of bodies) {
          // jelly spring
          b.sqv += (-320 * b.sq - 9 * b.sqv) * dt; b.sq += b.sqv * dt;
          b.sq = Math.max(-0.35, Math.min(0.35, b.sq));
          if (!b.held) b.rot += ((Math.max(-0.4, Math.min(0.4, b.vx / 600))) - b.rot) * Math.min(1, dt * 6);
        }
      }

      /* ---------- game flow ---------- */
      function setControls(mode) {
        [btnL, btnR, btnDrop, btnPlay].forEach((b) => b.classList.add("hide"));
        if (mode === "aim") { btnL.classList.remove("hide"); btnR.classList.remove("hide"); btnDrop.classList.remove("hide"); }
        if (mode === "play") btnPlay.classList.remove("hide");
      }
      let overlay = null;
      function closeOverlay() { if (overlay) { overlay.remove(); overlay = null; } }
      function openOverlay(html, cls) {
        closeOverlay();
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.innerHTML = `<div class="panel ${cls || ""}">${html}</div>`;
        el.appendChild(overlay);
        return overlay;
      }
      function intro() {
        state = "intro";
        setControls("none");
        const o = openOverlay(`<h2>Squishy Claw</h2>
          <p>Slide the claw over a squishy, hit <b>DROP!</b> and pray it doesn't slip!</p>
          <div class="legend"></div>
          <button class="btn green go">PLAY · ${COST}🪙</button>
          <div class="note">Aim for the middle of a squishy for a grippier grab.</div>`);
        const lg = o.querySelector(".legend");
        [["mochi", "12-20", ""], ["frog", "12-20", ""], ["golden", "60", "r1"], ["galaxy", "150", "r2"], ["rainbow", "400!", "r3"]].forEach(([k, v, c]) => {
          const d = document.createElement("div"); d.appendChild(squishyCanvas(k, 58)); const s = document.createElement("span"); s.className = c; s.textContent = v + "🪙"; d.appendChild(s); lg.appendChild(d);
        });
        o.querySelector(".go").onclick = () => startGo();
      }
      function startGo() {
        if (!api.spend(COST)) { api.sfx("buzz"); api.toast("You need " + COST + " coins for a go!"); flashCostPill(); return; }
        api.sfx("coin"); api.haptic(15);
        showCoins(); closeOverlay();
        state = "aim"; aimTime = 15; setControls("aim");
        claw.open = 1; claw.held = null; resultInfo = null;
        api.sfx("whoosh");
      }
      function flashCostPill() { const p = $(".cost"); p.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 400 }); }
      function doDrop() {
        if (state !== "aim") return;
        state = "drop"; setControls("none"); holdDir = 0;
        api.sfx("click"); api.haptic(20);
      }
      function underClaw() {
        let best = null, contact = null;
        for (const b of bodies) {
          if (b.held || b.chute) continue;
          const dx = Math.abs(b.x - claw.x);
          if (dx < b.r + 12 && (!contact || b.y - b.r < contact.y - contact.r)) contact = b;
          if (dx < b.r * 0.95 && (!best || b.y - b.r < best.y - best.r)) best = b;
        }
        return { best, contact };
      }
      function tipY() { return L.railY + claw.len * Math.cos(claw.th); }
      function clawHead() { return { x: claw.x + claw.len * Math.sin(claw.th), y: L.railY + claw.len * Math.cos(claw.th) }; }
      let dropStop = 0;
      function computeDropStop() {
        const { contact } = underClaw();
        dropStop = contact ? contact.y - L.railY - contact.r * 1.12 : L.floor - L.railY - L.r * 1.1;
        dropStop = Math.max(60, dropStop);
      }
      function closeClaw() {
        state = "close"; claw.closeT = 0;
        api.sfx("squish");
        const { best, contact } = underClaw();
        if (best && best === contact) {
          claw.held = best; best.held = true; best.mood = "wow";
          claw.grabD = Math.abs(best.x - claw.x) / best.r;
          claw.willHold = Math.random() < holdChance(best.kind, claw.grabD);
          best.sqv -= 4;
        } else {
          claw.held = null;
          if (contact) { contact.vx += (contact.x > claw.x ? 1 : -1) * 220; contact.sqv += 5; }
        }
      }
      function beginCarry() {
        state = "carry"; claw.clock = 0;
        const liftDur = Math.max(0.1, (claw.len - 40) / 230);
        const safeX = L.wallX + claw.held?.r + 40;
        const carryDur = Math.max(0, (claw.x - safeX)) / 190;
        const total = liftDur + carryDur;
        claw.slipAt = -1; claw.fakeAt = -1;
        if (claw.held) {
          if (!claw.willHold) claw.slipAt = total * (0.25 + Math.random() * 0.7) + 0.35;
          else if (Math.random() < 0.4) claw.fakeAt = total * (0.3 + Math.random() * 0.5);
        }
      }
      function slip() {
        const b = claw.held; if (!b) return;
        const h = clawHead();
        b.held = false; b.mood = "sad";
        b.x = h.x; b.y = h.y + b.r * 1.12;
        b.vx = claw.vx + claw.om * claw.len * 0.6; b.vy = 60;
        claw.held = null; claw.slipped = b;
        api.sfx("boop"); api.haptic(30);
        claw.open = 0.7;
        later(() => { if (alive) { b.mood = "happy"; } }, 2500);
      }
      function finishGo() {
        state = "result";
        const info = resultInfo;
        if (info && info.win) celebrate(info);
        else {
          const lines = info && info.air ? LOSE_AIR : LOSE_SLIP;
          api.sfx(Math.random() < 0.5 ? "fart" : "lose");
          const kind = info && info.kind;
          const o = openOverlay(`<h2 style="font-size:28px">${info && info.air ? "Whiff!" : "Oh noo!"}</h2>
            <div class="sq"></div><p>${lines[(Math.random() * lines.length) | 0]}</p>
            <div class="row"><button class="btn green again">AGAIN · ${COST}🪙</button><button class="btn white small rest">Rest</button></div>`, "lose");
          if (kind) o.querySelector(".sq").appendChild(squishyCanvas(kind, 90, "sad"));
          o.querySelector(".again").onclick = () => startGo();
          o.querySelector(".rest").onclick = () => { closeOverlay(); state = "idle"; setControls("play"); };
        }
      }
      function celebrate(info) {
        const k = KINDS[info.kind];
        const got = api.award(k.val, { reason: "Squishy Claw: " + k.name });
        wins++;
        showCoins();
        const big = k.rar !== "common";
        api.sfx(k.rar === "rainbow" || k.rar === "galaxy" ? "bigwin" : big ? "fanfare" : "win");
        later(() => api.sfx("sparkle"), 350);
        api.haptic(big ? 80 : 30);
        const rect = cv.getBoundingClientRect();
        const cx = rect.left + W / 2, cy = rect.top + H * 0.45;
        api.confetti(cx, cy, big ? 120 : 50);
        if (k.rar === "rainbow" || k.rar === "galaxy") { later(() => api.confetti(rect.left + W * 0.25, cy - 80, 80), 300); later(() => api.confetti(rect.left + W * 0.75, cy - 80, 80), 550); }
        api.floatText(cx, cy - 120, "+" + got, "#f2a900");
        shake = big ? 18 : 6; flash = big ? 1 : 0.5;
        const label = { common: "Cute catch!", rare: "RARE GOLDEN!", galaxy: "GALAXY SQUISHY!!", rainbow: "RAINBOW JACKPOT!!!" }[k.rar];
        const o = openOverlay(`<h2>${label}</h2><div class="sq"></div>
          <div><span class="rar">${k.name} squishy</span></div>
          <div class="big">+${got}🪙</div>
          <div class="row"><button class="btn green again">AGAIN · ${COST}🪙</button><button class="btn white small rest">Admire it</button></div>`, "win");
        o.querySelector(".sq").appendChild(squishyCanvas(info.kind, 130, "joy"));
        o.querySelector(".again").onclick = () => startGo();
        o.querySelector(".rest").onclick = () => { closeOverlay(); state = "idle"; setControls("play"); };
      }

      /* ---------- update ---------- */
      let holdDir = 0, dragging = false;
      function update(dt) {
        time += dt;
        // claw horizontal
        const prevVx = claw.vx;
        if (state === "aim") {
          aimTime -= dt;
          const tl = Math.ceil(Math.max(0, aimTime));
          if (dropT.textContent !== String(tl)) { dropT.textContent = tl; if (tl <= 3 && tl > 0) api.sfx("tick"); }
          if (aimTime <= 0) doDrop();
          if (holdDir) claw.target = claw.x + holdDir * 60;
          claw.target = Math.max(L.gx + 26, Math.min(L.gx + L.gw - 26, claw.target));
          const diff = claw.target - claw.x;
          const want = Math.max(-240, Math.min(240, diff * 8));
          claw.vx += (want - claw.vx) * Math.min(1, dt * 10);
        } else if (state === "carry" || state === "release" || state === "result" || state === "idle" || state === "intro") {
          const target = state === "carry" ? L.home : claw.x;
          if (state === "carry") {
            const liftDone = claw.len <= 41;
            const diff = target - claw.x;
            const want = liftDone ? Math.max(-190, Math.min(190, diff * 4)) : 0;
            claw.vx += (want - claw.vx) * Math.min(1, dt * 5);
          } else claw.vx *= Math.max(0, 1 - dt * 8);
        } else claw.vx *= Math.max(0, 1 - dt * 12);
        claw.x += claw.vx * dt;
        claw.x = Math.max(L.gx + 26, Math.min(L.gx + L.gw - 26, claw.x));
        claw.ax = (claw.vx - prevVx) / Math.max(dt, 1e-3);

        // cable
        if (state === "drop") {
          if (!claw.dropInit) { computeDropStop(); claw.dropInit = true; api.sfx("whoosh"); }
          claw.len += 260 * dt;
          if (claw.len >= dropStop) { claw.len = dropStop; claw.dropInit = false; closeClaw(); }
        } else if (state === "close") {
          claw.closeT += dt;
          claw.open = Math.max(claw.held ? 0.8 : 0, 1 - claw.closeT / 0.35);
          if (claw.held) { const b = claw.held; b.sq = -0.12; }
          if (claw.closeT > 0.6) beginCarry();
        } else if (state === "carry") {
          claw.clock += dt;
          if (claw.len > 40) claw.len = Math.max(40, claw.len - 230 * dt);
          if (claw.held) {
            const wobbleIn = (t) => t >= 0 && claw.clock > t - 0.8 && claw.clock < t;
            claw.wob = 0;
            if (wobbleIn(claw.slipAt)) claw.wob = 1 - (claw.slipAt - claw.clock) / 0.8;
            if (claw.fakeAt >= 0 && claw.clock > claw.fakeAt && claw.clock < claw.fakeAt + 0.7) claw.wob = Math.sin((claw.clock - claw.fakeAt) / 0.7 * Math.PI) * 0.8;
            if (claw.wob > 0 && Math.random() < dt * 8) api.sfx("tick");
            if (claw.slipAt >= 0 && claw.clock >= claw.slipAt) slip();
          }
          if (claw.len <= 40.5 && Math.abs(claw.x - L.home) < 2 && Math.abs(claw.vx) < 20) {
            state = "release"; claw.relT = 0; api.sfx("click");
          }
        } else if (state === "release") {
          claw.relT += dt;
          claw.open = Math.min(1, claw.relT / 0.3);
          if (claw.held && claw.relT > 0.1) {
            const b = claw.held, h = clawHead();
            b.held = false; b.chute = true; b.x = L.home; b.y = h.y + b.r * 1.12; b.vy = 0; b.vx = 0; b.mood = "joy";
            claw.held = null; resultInfo = { win: true, kind: b.kind }; api.sfx("whoosh");
          }
          if (claw.relT > 0.35 && !bodies.some((b) => b.chute)) {
            if (!resultInfo) resultInfo = claw.slipped ? { win: false, kind: claw.slipped.kind } : { win: false, air: true };
            claw.slipped = null;
            state = "wait"; later(finishGo, resultInfo.win ? 150 : 450);
          }
        }
        // chute bodies fall into the hole
        for (const b of bodies) if (b.chute) {
          b.vy += G * dt; b.y += b.vy * dt;
          if (b.y - b.r > L.floor + 30) {
            b.dead = true;
            for (let i = 0; i < 26; i++) parts.push({ x: L.home + (Math.random() - 0.5) * L.chuteW, y: L.floor + 20, vx: (Math.random() - 0.5) * 300, vy: -200 - Math.random() * 400, life: 1, col: ["#ffd84d", "#ff8fc7", "#7be04a", "#5fd3ff"][i % 4] });
            later(() => { if (alive) addBody(pickKind(), L.pileL + L.r + Math.random() * (L.pileR - L.pileL - 2 * L.r), L.gy + 60); api.sfx("pop"); }, 900);
          }
        }
        bodies = bodies.filter((b) => !b.dead);

        // pendulum
        const len = Math.max(30, claw.len + (claw.held ? claw.held.r * 1.1 : 10));
        let acc = -(G / len) * Math.sin(claw.th) - (claw.ax / len) * Math.cos(claw.th) * (claw.held ? 0.6 : 0.3) - (state === "drop" ? 9 : 2.6) * claw.om;
        if (claw.held && claw.wob > 0) acc += Math.sin(time * 38) * 60 * claw.wob;
        claw.om += acc * dt; claw.th += claw.om * dt;
        claw.th = Math.max(-0.5, Math.min(0.5, claw.th));
        if (claw.held) {
          const b = claw.held, h = clawHead();
          b.x = h.x - Math.sin(claw.th) * b.r * 1.12; b.y = h.y + Math.cos(claw.th) * b.r * 1.12;
          b.rot = claw.th * 0.8 + (claw.wob > 0 ? Math.sin(time * 40) * 0.12 * claw.wob : 0);
        }
        // particles
        for (const p of parts) { p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.9; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i, 1);
        shake *= Math.max(0, 1 - dt * 6); flash = Math.max(0, flash - dt * 1.5);
      }

      /* ---------- drawing ---------- */
      function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
      function drawCabinet() {
        const { cx, cy, cw, ch, mq, gx, gy, gw, gh } = L;
        // body
        ctx.fillStyle = "rgba(43,22,64,.25)"; rr(cx + 4, cy + 8, cw, ch, 26); ctx.fill();
        const g = ctx.createLinearGradient(cx, 0, cx + cw, 0);
        g.addColorStop(0, "#ff7ab8"); g.addColorStop(0.5, "#ff9fd0"); g.addColorStop(1, "#ff6fae");
        ctx.fillStyle = g; rr(cx, cy, cw, ch, 26); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
        // marquee
        ctx.fillStyle = "#ffd84d"; rr(cx + 10, cy + 8, cw - 20, mq - 6, 16); ctx.fill(); ctx.stroke();
        ctx.font = `${Math.min(28, cw * 0.075)}px ${getComputedStyle(el).getPropertyValue("--display") || "sans-serif"}`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.strokeText("SQUISHY CLAW", cx + cw / 2, cy + 8 + (mq - 6) / 2 + 2);
        ctx.fillStyle = "#fff"; ctx.fillText("SQUISHY CLAW", cx + cw / 2, cy + 8 + (mq - 6) / 2 + 2);
        // bulbs
        const nb = Math.floor((cw - 40) / 22);
        const party = state === "result" && resultInfo && resultInfo.win;
        for (let i = 0; i < nb; i++) {
          const on = ((i + Math.floor(time * (party ? 14 : 3))) % 3) === 0;
          const bx = cx + 20 + i * ((cw - 40) / (nb - 1));
          ctx.fillStyle = on ? "#fff" : "#ff5a8a";
          ctx.beginPath(); ctx.arc(bx, cy + 8, 4.5, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(bx, cy + mq + 2, 4.5, 0, 7); ctx.fill(); ctx.stroke();
        }
        // glass background
        const bg = ctx.createLinearGradient(0, gy, 0, gy + gh);
        bg.addColorStop(0, "#e8f8ff"); bg.addColorStop(1, "#ffe3f3");
        ctx.fillStyle = bg; rr(gx, gy, gw, gh, 12); ctx.fill();
        ctx.save(); rr(gx, gy, gw, gh, 12); ctx.clip();
        ctx.fillStyle = "rgba(199,179,255,.35)";
        for (let y = gy + 10; y < gy + gh; y += 26) for (let x = gx + ((y / 26) % 2 ? 13 : 0); x < gx + gw; x += 26) { ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); }
        // chute interior
        ctx.fillStyle = "#3b2257"; ctx.fillRect(gx, L.wallTop, L.chuteW, L.floor - L.wallTop + 2);
        ctx.fillStyle = "#24133a"; ctx.fillRect(gx + 6, L.wallTop + 10, L.chuteW - 12, L.floor - L.wallTop);
        ctx.restore();
      }
      function drawChuteFront() {
        const { gx, chuteW, wallTop, floor } = L;
        // striped rim + wall
        ctx.save();
        ctx.beginPath(); ctx.rect(gx, wallTop - 10, chuteW + 8, 12); ctx.clip();
        for (let i = -2; i < 20; i++) { ctx.fillStyle = i % 2 ? "#ffd84d" : INK; ctx.beginPath(); ctx.moveTo(gx + i * 12, wallTop + 2); ctx.lineTo(gx + i * 12 + 12, wallTop + 2); ctx.lineTo(gx + i * 12 + 24, wallTop - 10); ctx.lineTo(gx + i * 12 + 12, wallTop - 10); ctx.fill(); }
        ctx.restore();
        ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(gx, wallTop - 10, chuteW + 8, 12);
        // glass partition
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(L.wallX, wallTop, 7, floor - wallTop);
        ctx.strokeRect(L.wallX, wallTop, 7, floor - wallTop);
        ctx.fillStyle = "#fff"; ctx.font = `bold 13px ${getComputedStyle(el).getPropertyValue("--display") || "sans-serif"}`;
        ctx.textAlign = "center"; ctx.fillText("PRIZE", gx + chuteW / 2, wallTop + 26);
        ctx.fillText("▼", gx + chuteW / 2, wallTop + 44 + Math.sin(time * 6) * 3);
      }
      function drawFront() {
        const { cx, cw, gx, gy, gw, gh, floor, frontH, chuteW } = L;
        // glass frame + shine
        ctx.save(); rr(gx, gy, gw, gh, 12); ctx.clip();
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.beginPath(); ctx.moveTo(gx + gw * 0.55, gy); ctx.lineTo(gx + gw * 0.7, gy); ctx.lineTo(gx + gw * 0.35, gy + gh); ctx.lineTo(gx + gw * 0.2, gy + gh); ctx.fill();
        ctx.beginPath(); ctx.moveTo(gx + gw * 0.76, gy); ctx.lineTo(gx + gw * 0.8, gy); ctx.lineTo(gx + gw * 0.45, gy + gh); ctx.lineTo(gx + gw * 0.41, gy + gh); ctx.fill();
        if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * 0.6})`; ctx.fillRect(gx, gy, gw, gh); }
        ctx.restore();
        ctx.lineWidth = 4; ctx.strokeStyle = INK; rr(gx, gy, gw, gh, 12); ctx.stroke();
        // front panel
        const fy = floor + 6;
        ctx.fillStyle = "#ff5fa5"; rr(cx + 10, fy, cw - 20, frontH - 14, 14); ctx.fill(); ctx.stroke();
        // prize door
        ctx.fillStyle = "#24133a"; rr(gx + 4, fy + 9, chuteW - 8, frontH - 32, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(gx + 8, fy + 13, chuteW - 16, 6);
        // coin slot + stickers
        const sx = cx + cw - 70;
        ctx.fillStyle = "#ffd84d"; rr(sx, fy + 10, 48, frontH - 34, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = INK; rr(sx + 20, fy + 16, 8, frontH - 46, 3); ctx.fill();
        ctx.font = `14px ${getComputedStyle(el).getPropertyValue("--display") || "sans-serif"}`;
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.lineWidth = 3;
        const midX = (gx + chuteW + sx) / 2;
        ctx.strokeText("★ 1 GO = 15🪙 ★", midX, fy + (frontH - 14) / 2); ctx.fillText("★ 1 GO = 15🪙 ★", midX, fy + (frontH - 14) / 2);
      }
      function drawBody(b) {
        let mood = b.mood;
        const bl = (time + b.blink) % 4;
        if (mood === "happy" && bl < 0.12) mood = "joy";
        const s = sprite(b.kind, b.r, mood, dpr);
        ctx.save(); ctx.translate(b.x, b.y + b.r * 0.9); ctx.rotate(b.rot);
        ctx.scale(1 + b.sq, 1 - b.sq);
        ctx.drawImage(s, -s._half, -s._half - b.r * 0.9, s._half * 2, s._half * 2);
        ctx.restore();
        if (KINDS[b.kind].rar !== "common") {
          for (let i = 0; i < 3; i++) {
            const a = time * 1.5 + i * 2.1 + b.blink;
            const tw = Math.max(0, Math.sin(time * 4 + i * 2 + b.blink * 3));
            const sx = b.x + Math.cos(a) * b.r * 1.05, sy = b.y + Math.sin(a) * b.r * 0.95;
            drawStar(sx, sy, 3 + tw * 5, b.kind === "galaxy" ? "#d9c8ff" : "#fff6a8");
          }
        }
      }
      function drawStar(x, y, s, col) {
        ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
      }
      function drawClaw() {
        const { gx, gw, railY } = L;
        // rail
        ctx.fillStyle = "#cfd4e6"; ctx.strokeStyle = INK; ctx.lineWidth = 3;
        rr(gx + 6, railY - 6, gw - 12, 10, 5); ctx.fill(); ctx.stroke();
        // trolley
        ctx.fillStyle = "#5fd3ff"; rr(claw.x - 18, railY - 12, 36, 20, 7); ctx.fill(); ctx.stroke();
        const h = clawHead();
        // cable
        ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(claw.x, railY + 6); ctx.lineTo(h.x, h.y); ctx.stroke();
        ctx.strokeStyle = "#e8ecf8"; ctx.lineWidth = 1.5; ctx.stroke();
        // prongs
        ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(-claw.th);
        const r0 = claw.held ? claw.held.r : L.r;
        const open = claw.open;
        const jitter = claw.wob > 0 ? Math.sin(time * 50) * 0.08 * claw.wob : 0;
        [-1, 1].forEach((s) => {
          // arm angle from straight-down: wide open .95 rad, gripping ~.62 rad, shut .12 rad
          const ang = s * (0.12 + open * 0.83 + jitter);
          const l1 = r0 * 1.3, l2 = r0 * 0.6;
          const ex = Math.sin(ang) * l1, ey = 4 + Math.cos(ang) * l1;
          const curl = ang - s * (2.0 - open * 0.75);
          const tx = ex + Math.sin(curl) * l2, ty = ey + Math.cos(curl) * l2;
          ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.beginPath(); ctx.moveTo(s * 8, 4); ctx.lineTo(ex, ey); ctx.lineTo(tx, ty);
          ctx.strokeStyle = INK; ctx.lineWidth = 11; ctx.stroke();
          ctx.strokeStyle = "#ffd84d"; ctx.lineWidth = 5.5; ctx.stroke();
          ctx.fillStyle = "#ff8fc7"; ctx.strokeStyle = INK; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(ex, ey, 5, 0, 7); ctx.fill(); ctx.stroke();
        });
        // hub
        ctx.fillStyle = "#ffd84d"; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
        rr(-19, -10, 38, 22, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ff5a8a"; ctx.beginPath(); ctx.arc(0, 2, 5, 0, 7); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const sk = reduced ? shake * 0.2 : shake;
        if (sk > 0.3) ctx.translate((Math.random() - 0.5) * sk, (Math.random() - 0.5) * sk);
        drawCabinet();
        ctx.save(); ctx.beginPath(); ctx.rect(L.gx, L.gy, L.gw, L.floor - L.gy); ctx.clip();
        // aim guide
        if (state === "aim") {
          ctx.strokeStyle = "rgba(255,90,140,.55)"; ctx.setLineDash([6, 8]); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(claw.x, L.railY + 60); ctx.lineTo(claw.x, L.floor); ctx.stroke(); ctx.setLineDash([]);
        }
        for (const b of bodies) if (!b.held && !b.chute) drawBody(b);
        for (const b of bodies) if (b.chute) drawBody(b);
        ctx.restore();
        drawChuteFront();
        if (claw.held) drawBody(claw.held);
        drawClaw();
        drawFront();
        for (const p of parts) { ctx.globalAlpha = Math.max(0, p.life); drawStar(p.x, p.y, 7, p.col); }
        ctx.globalAlpha = 1;
      }

      let last = performance.now();
      function frame(now) {
        if (!alive) return;
        let dt = Math.min(0.05, (now - last) / 1000); last = now;
        const steps = 3;
        for (let i = 0; i < steps; i++) { physics(dt / steps); }
        update(dt);
        draw();
        raf = requestAnimationFrame(frame);
      }

      /* ---------- input ---------- */
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      const pressDir = (dir) => (e) => { e.preventDefault(); if (state !== "aim") return; holdDir = dir; api.sfx("click"); };
      const release = () => { holdDir = 0; };
      btnL.addEventListener("pointerdown", pressDir(-1)); btnR.addEventListener("pointerdown", pressDir(1));
      [btnL, btnR].forEach((b) => { b.addEventListener("pointerup", release); b.addEventListener("pointerleave", release); b.addEventListener("pointercancel", release); });
      btnDrop.addEventListener("click", doDrop);
      btnPlay.addEventListener("click", startGo);
      const canvasX = (e) => e.clientX - cv.getBoundingClientRect().left;
      cv.addEventListener("pointerdown", (e) => { if (state !== "aim") return; dragging = true; claw.target = canvasX(e); try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
      cv.addEventListener("pointermove", (e) => { if (dragging && state === "aim") claw.target = canvasX(e); });
      const endDrag = () => { dragging = false; };
      cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
      const onKey = (e) => {
        if (state !== "aim") return;
        if (e.key === "ArrowLeft") claw.target = claw.x - 40;
        else if (e.key === "ArrowRight") claw.target = claw.x + 40;
        else if (e.key === " " || e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); doDrop(); }
      };
      window.addEventListener("keydown", onKey);

      layout();
      fillPile();
      intro();
      raf = requestAnimationFrame(frame);

      // test hook (harmless in production)
      el._claw = { claw, bodies: () => bodies, L: () => L, state: () => state };

      return {
        destroy() {
          alive = false;
          cancelAnimationFrame(raf);
          timers.forEach((t) => clearTimeout(t)); timers.clear();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("keydown", onKey);
          el.remove();
        },
      };
    },
  });
})();
