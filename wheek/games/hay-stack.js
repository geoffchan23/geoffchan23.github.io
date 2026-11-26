/* Wheek World mini-game: Hay Stack Tower.
   A hay bale swings side to side; tap to drop it on the stack. Overhang gets trimmed,
   perfect drops build a combo (and widen the bale). Three complete misses and the round is over.
   Pays by height: bales * 2.5 + perfects * 1.5, capped at 200. */
(function () {
  "use strict";
  const ID = "hay-stack", C = "g-hay";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
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
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",") + ")"; }
  // sky palettes by height (in bales): [top, bottom]
  const SKY = [[0, "#6fd0ff", "#d4f4ff"], [14, "#5fb8ff", "#ffe9a8"], [24, "#7a5cc9", "#ff9f6b"], [34, "#2a1a5e", "#a8477a"], [44, "#120a30", "#2b1a5c"]];
  function skyAt(h) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const a = SKY[i], b = SKY[i + 1];
      if (h <= b[0]) { const t = clamp((h - a[0]) / (b[0] - a[0]), 0, 1); return [mix(a[1], b[1], t), mix(a[2], b[2], t)]; }
    }
    return [SKY[SKY.length - 1][1], SKY[SKY.length - 1][2]];
  }

  const EEKS = ["eek!", "so high!", "don't look down!", "wheek?!", "my tummy!", "mama!", "is this safe?", "hold still!"];
  const PERFECTS = ["PERFECT!", "SPOT ON!", "NEAT!", "WOW!", "BULLSEYE!"];
  const MISSES = ["WHOOPS!", "PFFFT!", "OOPSIE!", "NOOO!"];
  const HEART = '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:5px;min-height:40px;white-space:nowrap}
.${C} .pill small{font-family:var(--body);font-weight:900;font-size:13px;color:var(--ink-soft)}
.${C} .pill.lv{gap:1px;padding:2px 8px}
.${C} .pill.lv svg{transition:transform .3s,filter .3s,opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:56px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .tap{position:absolute;left:20px;right:20px;bottom:14px;text-align:center;font-family:var(--display);font-size:20px;color:#fff;-webkit-text-stroke:1.5px var(--ink);text-shadow:0 3px 0 var(--ink);pointer-events:none;z-index:2;animation:${C}-throb 1s ease-in-out infinite;transition:opacity .4s}
.${C} .tap.off{opacity:0}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.3);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:14px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .art{position:relative;height:120px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
.${C} .panel .art .pig{animation:${C}-wob 1.2s ease-in-out infinite;transform-origin:50% 100%;margin-bottom:-6px;position:relative;z-index:1}
.${C} .panel .art .bales{display:flex;flex-direction:column;align-items:center}
.${C} .panel .art .bale{height:16px;border:3px solid var(--ink);border-radius:6px;background:repeating-linear-gradient(90deg,#f6cf55 0 8px,#ecbd3c 8px 10px);margin-top:-3px;position:relative}
.${C} .panel .art .bale:after{content:"";position:absolute;top:-3px;bottom:-3px;left:22%;right:22%;border-left:4px solid #b5562e;border-right:4px solid #b5562e}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:32px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--yellow)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#fff4cc;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill ht">🌾<b>0</b><small>bales</small></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div>
      <div class="tap off">TAP TO DROP!</div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), htEl = wrap.querySelector(".ht b"), tapEl = wrap.querySelector(".tap");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 200, mood: "happy" })), wow: svgImg(api.guineaSVG({ size: 200, mood: "wow" })), sad: svgImg(api.guineaSVG({ size: 200, mood: "sad" })) };

    let W = 1, H = 1, dpr = 1, BH = 32, SW = 200, gw = 64, gh = 54, ground = 1, gap = 80;
    const S = {};
    const stars = [];
    for (let i = 0; i < 70; i++) stars.push({ x: Math.random(), y: Math.random(), r: rnd(0.8, 2.2), ph: rnd(0, TAU) });
    let clouds = [], birds = [];

    function reset() {
      Object.assign(S, {
        state: "intro", t: 0, lives: 3, stack: [], mover: null, fall: null, debris: [], parts: [], floats: [],
        cam: 0, camT: 0, combo: 0, bestCombo: 0, perfects: 0, wob: 0, shake: 0, banner: null, nextT: 0, dir: 1,
        endT: 0, awarded: false, bubble: null, sadT: 0, flash: 0, hop: null, gx: 0, misses: 0, maxH: 0,
      });
      S.stack.push({ x: W / 2, w: SW, seed: 1 });
      S.gx = W / 2;
      clouds = []; birds = [];
      for (let i = 0; i < 40; i++) clouds.push({ x: rnd(-0.1, 1.1), wy: 150 + i * rnd(110, 170), s: rnd(0.55, 1), v: rnd(4, 14) * (Math.random() < 0.5 ? -1 : 1) });
      for (let i = 0; i < 12; i++) birds.push({ wy: 400 + i * rnd(260, 420), x: rnd(0, 1), v: rnd(50, 90) * (Math.random() < 0.5 ? -1 : 1), ph: rnd(0, TAU) });
    }

    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      const oldW = W;
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      BH = clamp(Math.min(W * 0.085, H * 0.055), 26, 40);
      SW = clamp(W * 0.52, 150, 260);
      gw = clamp(BH * 2, 56, 78); gh = gw * 0.85;
      gap = gh + 18;
      ground = H - Math.max(46, H * 0.07);
      if (S.stack && oldW > 1 && oldW !== W) {
        const dx = (W - oldW) / 2;
        S.stack.forEach((b) => (b.x += dx));
        if (S.mover) S.mover.x += dx;
        S.gx += dx;
      }
    }

    /* ---------- helpers ---------- */
    const height = () => S.stack.length - 1; // bales stacked on top of the base
    const topW = () => S.stack[S.stack.length - 1];
    const sy = (wy) => ground - wy + S.cam; // world y (up) to screen y
    function camTarget() {
      const topY = S.stack.length * BH;
      return Math.max(0, topY - (ground - H * 0.56));
    }
    function speed() { const n = height(); return W * Math.min(1.5, 0.36 + 0.014 * n + (n > 30 ? 0.01 * (n - 30) : 0)); }
    function limits(w) { const out = Math.min(w * 0.3, 50); return [w / 2 - out, W - w / 2 + out]; }
    function spawnMover() {
      const t = topW(); const [a, b] = limits(t.w);
      S.dir = -S.dir;
      S.mover = { x: S.dir > 0 ? a : b, w: t.w, dir: S.dir, seed: S.stack.length + 1, bob: 0 };
    }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 26; x = clamp(x, text.length * size * 0.3 + 8, W - text.length * size * 0.3 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 1 }); }
    function burst(x, y, cols, n, spd) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 240); S.parts.push({ k: "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 100, g: 700, r: rnd(2.5, 6), col: pick(cols), life: rnd(0.4, 0.8), t: 0 }); }
    }
    function straws(x, y, n) {
      for (let i = 0; i < n; i++) S.parts.push({ k: "straw", x: x + rnd(-10, 10), y, vx: rnd(-160, 160), vy: rnd(-260, -60), g: 600, r: rnd(6, 11), rot: rnd(0, TAU), vr: rnd(-10, 10), col: pick(["#f6cf55", "#e3b23c", "#fff0a8"]), life: rnd(0.6, 1), t: 0 });
    }
    function sparkle(x, y, n) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(80, 260); S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120, r: rnd(5, 10), col: pick(["#ffd84d", "#fff", "#ffe98a", "#ff8fc7"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) }); }
    }
    function gas(x, y, n) {
      for (let i = 0; i < n; i++) S.parts.push({ k: "gas", x: x + rnd(-12, 12), y: y + rnd(-8, 8), vx: rnd(-60, 60), vy: rnd(-60, -10), g: -20, r: rnd(9, 16), grow: rnd(16, 30), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b"]), life: rnd(0.8, 1.3), t: 0 });
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function setHud() {
      htEl.textContent = height();
      hearts.forEach((h, i) => h.classList.toggle("gone", i >= S.lives));
    }

    /* ---------- UI ---------- */
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 92, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">🌾 ${after.h} bales &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><div class="pig">${svg}</div><div class="bales"><div class="bale" style="width:84px"></div><div class="bale" style="width:110px;margin-left:14px"></div><div class="bale" style="width:130px"></div></div></div>
        <h2>${after ? (after.isNew ? "New best!" : "Again?!") : "Hay Stack Tower"}</h2>${lastLine}
        <p><b>Tap</b> to drop the swinging hay bale. Line it up! Hay that hangs over gets <b>chopped off</b>.</p>
        <div class="chips"><span class="chip">✨ Perfect = combo</span><span class="chip">❤️ 3 misses</span></div>
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "aim";
      S.cam = 0;
      hud.classList.remove("off"); tapEl.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      spawnMover();
      setHud();
      banner("STACK IT!", "tap to drop", "#ffd84d");
      api.sfx("whoosh");
    }

    /* ---------- gameplay ---------- */
    function drop() {
      if (S.state !== "aim" || !S.mover) return;
      const m = S.mover, t = topW();
      tapEl.classList.add("off");
      const tol = Math.max(5, t.w * 0.045);
      const dx = m.x - t.x;
      let outcome, nx = m.x, nw = m.w, cut = null;
      if (Math.abs(dx) <= tol) { outcome = "perfect"; nx = t.x; }
      else {
        const l = Math.max(m.x - m.w / 2, t.x - t.w / 2), r = Math.min(m.x + m.w / 2, t.x + t.w / 2);
        const ov2 = r - l;
        if (ov2 < Math.max(6, t.w * 0.06)) outcome = "miss";
        else {
          outcome = "hit"; nw = ov2; nx = (l + r) / 2;
          // the chopped-off bit
          const side = dx > 0 ? 1 : -1;
          const cw = m.w - ov2;
          cut = { x: side > 0 ? r + cw / 2 : l - cw / 2, w: cw, side };
        }
      }
      const n = S.stack.length;
      S.fall = { x: m.x, w: m.w, wy: n * BH + gap, vy: 0, outcome, nx, nw, cut, seed: m.seed, delay: 0.07 };
      S.mover = null;
      S.state = "fall";
      // her hop
      const y0 = n * BH, y1 = outcome === "miss" ? n * BH : (n + 1) * BH;
      S.hop = { t: 0, d: 0.46, y0, y1, x0: S.gx, x1: outcome === "miss" ? S.gx : nx, arc: gap + BH * 0.9 };
      api.sfx("jump");
      if (Math.random() < 0.35) api.sfx("wheek");
    }
    function land() {
      const f = S.fall; S.fall = null;
      const n = S.stack.length;
      const yS = sy(n * BH);
      if (f.outcome === "miss") return; // handled at contact time
      S.stack.push({ x: f.nx, w: f.nw, seed: f.seed });
      S.maxH = Math.max(S.maxH, height());
      S.wob = Math.min(1, S.wob + (f.outcome === "perfect" ? 0.35 : 0.6));
      if (f.cut) {
        S.debris.push({ x: f.cut.x, wy: n * BH + BH / 2, w: f.cut.w, vx: f.cut.side * rnd(70, 140), vy: rnd(40, 140), rot: 0, vr: f.cut.side * rnd(3, 6), seed: f.seed });
        straws(f.cut.side > 0 ? f.nx + f.nw / 2 : f.nx - f.nw / 2, yS, 8);
      }
      if (f.outcome === "perfect") {
        S.combo++; S.perfects++; S.bestCombo = Math.max(S.bestCombo, S.combo);
        api.sfx(S.combo >= 3 ? "sparkle" : "pop"); api.haptic(20);
        sparkle(f.nx, yS - BH / 2, 14 + S.combo * 2);
        floatT(f.nx, yS + BH * 0.7, S.combo >= 2 ? "PERFECT x" + S.combo : pick(PERFECTS), "#ffd84d", 26 + Math.min(10, S.combo * 2));
        if (S.combo % 3 === 0) {
          const top = topW();
          const grow = Math.min(SW, top.w * 1.12);
          if (grow > top.w + 1) {
            top.w = grow; api.sfx("bigwin"); banner("BALE GROWS!", S.combo + " perfect in a row!", "#7be04a");
            sparkle(top.x, yS - BH / 2, 24);
            const [vx, vy] = vp(top.x, yS); api.confetti(vx, vy, 30);
          } else { api.sfx("bigwin"); banner("COMBO " + S.combo + "!", "you're a hay hero!", "#ff8fc7"); }
        }
      } else {
        if (S.combo >= 3) floatT(f.nx, yS + BH * 1.8, "combo over", "#ffb3d4", 18);
        S.combo = 0;
        api.sfx("squish"); api.haptic(15);
        straws(f.nx, yS, 6);
        if (f.nw < BH * 1.4) floatT(f.nx, yS + BH * 1.8, "tiny!", "#ffb3d4", 22);
      }
      shake(f.outcome === "perfect" ? 2 : 4);
      const h = height();
      if (h > 0 && h % 10 === 0) {
        banner(h + " BALES HIGH!", h >= 30 ? "is that SPACE?!" : h >= 20 ? "the birds are jealous" : "keep stacking!", "#5fd3ff");
        api.sfx("fanfare");
        const [vx, vy] = vp(W / 2, H * 0.3); api.confetti(vx, vy, 60);
      }
      if (h >= 8 && Math.random() < 0.4) S.bubble = { text: pick(EEKS), t: 0 };
      setHud(); bump(htEl.parentNode);
      S.nextT = 0.22;
      S.camT = camTarget();
    }
    function missHit() {
      // bale goes past the tower: becomes debris, fart, lose a heart
      const f = S.fall; S.fall = null;
      const t = topW();
      const side = f.x >= t.x ? 1 : -1;
      S.debris.push({ x: f.x, wy: f.wy + BH / 2, w: f.w, vx: side * rnd(40, 90), vy: f.vy, rot: 0, vr: side * rnd(1.5, 3.5), seed: f.seed });
      S.lives--; S.combo = 0; S.misses++; S.sadT = 1.4; S.flash = 0.2;
      api.sfx("fart"); api.haptic(80); shake(10);
      const ySc = sy(S.stack.length * BH);
      gas(S.gx - gw * 0.3, ySc - gh * 0.3, 12);
      const [vx, vy] = vp(S.gx, ySc - gh * 0.5); api.gas(vx, vy);
      floatT(f.x, ySc - gap, pick(MISSES), "#b6f27a", 30);
      bump(hearts[Math.max(0, S.lives)]);
      setHud();
      if (S.lives <= 0) { endRound(); return; }
      S.nextT = 0.55;
    }
    function endRound() {
      S.state = "end"; S.endT = 0;
      banner("TIMBER-ish!", height() + " bales high!", "#ffd84d");
      api.sfx("lose");
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const h = height();
      const coins = Math.min(200, Math.round(h * 2.5 + S.perfects * 1.5));
      const earned = coins > 0 ? api.award(coins, { reason: "Hay Stack Tower" }) : 0;
      const hs = api.highscore(ID, h);
      const quip = h >= 40 ? `${gName} can see the moon from up there!` : h >= 25 ? `${gName} is officially a sky guinea!` : h >= 12 ? `${gName} had a great view (and wobbly knees).` : h > 0 ? `${gName} says: higher next time!` : `${gName} is still on the ground. Phew?`;
      const text = `${quip} ${h} bales, ${S.perfects} perfect${S.perfects === 1 ? "" : "s"}${S.bestCombo >= 3 ? `, best combo ${S.bestCombo}` : ""}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && h > 0 ? "New best!" : "Tower toppled!", text, score: h });
      hud.classList.add("off"); tapEl.classList.add("off");
      showPanel({ h, earned, isNew: hs.isNew && h > 0 });
    }

    function update(dt) {
      for (const c of clouds) { c.x += c.v * dt / Math.max(300, W); if (c.x > 1.25) c.x = -0.25; if (c.x < -0.25) c.x = 1.25; }
      for (const b of birds) { b.x += b.v * dt / Math.max(300, W); if (b.x > 1.2) b.x = -0.2; if (b.x < -0.2) b.x = 1.2; }
      if (S.state === "aim" || S.state === "fall" || S.state === "end") S.t += dt;
      if (S.mover) {
        const m = S.mover, [a, b] = limits(m.w);
        m.x += m.dir * speed() * dt;
        if (m.x > b) { m.x = b; m.dir = -1; }
        if (m.x < a) { m.x = a; m.dir = 1; }
        m.bob += dt;
      }
      if (S.fall) {
        const f = S.fall;
        if (f.delay > 0) f.delay -= dt;
        else {
          f.vy += 2800 * dt; f.wy -= f.vy * dt;
          const landY = S.stack.length * BH;
          if (f.wy <= landY) { f.wy = landY; if (f.outcome === "miss") missHit(); else land(); }
        }
      }
      if (S.hop) {
        const h = S.hop; h.t += dt;
        const p = Math.min(1, h.t / h.d);
        S.gx = lerp(h.x0, h.x1, p);
        if (p >= 1) { S.hop = null; if (S.state !== "end" && S.state !== "over") { burst(S.gx, sy(h.y1), ["#f6cf55", "#fff0a8"], 5, 120); } }
      } else {
        // walk back toward the middle of the top bale
        const t = topW(); if (t) S.gx = lerp(S.gx, t.x, Math.min(1, dt * 4));
      }
      if (S.state === "fall" && !S.fall && !S.hop) {
        S.nextT -= dt;
        if (S.nextT <= 0) { S.state = "aim"; spawnMover(); }
      }
      if (S.state === "end") { S.endT += dt; if (S.endT > 2) finish(); }
      // camera
      S.cam = lerp(S.cam, S.camT, Math.min(1, dt * 4));
      // debris
      for (const d of S.debris) { d.vy += 1400 * dt; d.wy -= d.vy * dt; d.x += d.vx * dt; d.rot += d.vr * dt; if (sy(d.wy) > H + 120) d.dead = true; }
      S.debris = S.debris.filter((d) => !d.dead);
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 1.5; }
        if (p.k === "star" || p.k === "straw") p.rot += (p.vr || 6) * dt;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 50 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.9 && S.state !== "end") S.banner = null; }
      if (S.bubble) { S.bubble.t += dt; if (S.bubble.t > 1.5) S.bubble = null; }
      S.wob = Math.max(0, S.wob - dt * 1.3);
      S.shake = Math.max(0, S.shake - dt * 30);
      S.sadT = Math.max(0, S.sadT - dt);
      S.flash = Math.max(0, S.flash - dt);
      // nervous sweat
      if ((S.state === "aim" || S.state === "fall") && height() >= 12 && Math.random() < dt * Math.min(3, 0.6 + (height() - 12) * 0.08)) {
        const gy = sy(S.stack.length * BH) - gh * 0.85;
        S.parts.push({ k: "drop", x: S.gx + rnd(-gw * 0.35, gw * 0.35), y: gy, vx: rnd(-40, 40), vy: rnd(-120, -60), g: 600, r: rnd(3, 5), col: "#7fd8ff", life: 0.8, t: 0 });
      }
    }

    /* ---------- drawing ---------- */
    function drawBale(g, cx, bottom, w, h, seed, rot) {
      g.save(); g.translate(cx, bottom - h / 2); if (rot) g.rotate(rot);
      const x = -w / 2, y = -h / 2;
      rr(g, x, y, w, h, Math.min(8, h * 0.25));
      g.fillStyle = "#f3c94b"; g.fill();
      g.save(); g.clip();
      g.fillStyle = "#fbe07a"; g.fillRect(x, y, w, h * 0.32);
      g.fillStyle = "#d9a52c"; g.fillRect(x, y + h * 0.78, w, h * 0.22);
      g.strokeStyle = "rgba(160,110,20,.55)"; g.lineWidth = 1.6;
      let s = seed * 9301 + 49297;
      const r1 = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      for (let i = 0; i < w / 7; i++) {
        const px = x + r1() * w, py = y + 4 + r1() * (h - 8), l = 6 + r1() * 10;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + l, py + (r1() - 0.5) * 3); g.stroke();
      }
      // twine bands
      const bands = w > 60 ? [0.26, 0.74] : [0.5];
      bands.forEach((b) => { const bx = x + w * b; g.fillStyle = "#b5562e"; g.fillRect(bx - 3, y, 6, h); g.fillStyle = "rgba(255,255,255,.3)"; g.fillRect(bx - 2, y, 1.5, h); });
      g.restore();
      rr(g, x, y, w, h, Math.min(8, h * 0.25));
      g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      // tufts sticking out on top
      g.strokeStyle = "#e3b23c"; g.lineWidth = 2.2;
      for (let i = 0; i < Math.max(2, w / 22); i++) {
        const px = x + 6 + r1() * (w - 12);
        g.beginPath(); g.moveTo(px, y + 1); g.lineTo(px + (r1() - 0.5) * 8, y - 4 - r1() * 4); g.stroke();
      }
      g.restore();
    }
    function drawCloud(x, y, s) {
      const g = ctx; g.save(); g.translate(x, y); g.scale(s, s);
      const parts = [[0, 0, 34, 20], [30, 6, 26, 16], [-30, 8, 24, 14], [8, -14, 24, 18]];
      g.strokeStyle = INK; g.lineWidth = 6; parts.forEach(([a, b, c, d]) => { g.beginPath(); g.ellipse(a, b, c, d, 0, 0, TAU); g.stroke(); });
      g.fillStyle = "#fff"; parts.forEach(([a, b, c, d]) => { g.beginPath(); g.ellipse(a, b, c, d, 0, 0, TAU); g.fill(); });
      g.restore();
    }
    function drawBird(x, y, ph) {
      const g = ctx, f = Math.sin(performance.now() / 110 + ph) * 7;
      g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.moveTo(x - 12, y - f); g.quadraticCurveTo(x - 5, y - 4, x, y + 2); g.quadraticCurveTo(x + 5, y - 4, x + 12, y - f); g.stroke();
    }
    function drawStar(g, x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      for (let i = 0; i < 8; i++) { const r2 = i % 2 ? r * 0.4 : r, a = (i / 8) * TAU; g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); }
      g.closePath(); g.fill(); g.restore();
    }
    function drawBackground() {
      const g = ctx;
      const camH = S.cam / BH; // in bales
      const [top, bot] = skyAt(camH + 6);
      const sk = g.createLinearGradient(0, 0, 0, H);
      sk.addColorStop(0, top); sk.addColorStop(1, bot);
      g.fillStyle = sk; g.fillRect(0, 0, W, H);
      const space = clamp((camH - 22) / 14, 0, 1);
      if (space > 0) {
        const t = performance.now() / 1000;
        for (const s of stars) {
          const yy = ((s.y * H + S.cam * 0.08) % H + H) % H;
          g.globalAlpha = space * (0.55 + 0.45 * Math.sin(t * 2 + s.ph));
          g.fillStyle = "#fff"; g.beginPath(); g.arc(s.x * W, yy, s.r, 0, TAU); g.fill();
        }
        g.globalAlpha = 1;
        // moon
        const my = H * 0.2 + (camH - 30) * 2;
        g.globalAlpha = space;
        g.fillStyle = "#fff6c8"; g.strokeStyle = INK; g.lineWidth = 3.5;
        g.beginPath(); g.arc(W * 0.8, my, 26, 0, TAU); g.fill(); g.stroke();
        g.fillStyle = "#e9dca0"; [[-8, -6, 6], [9, 5, 5], [-3, 11, 3.5]].forEach(([a, b, r]) => { g.beginPath(); g.arc(W * 0.8 + a, my + b, r, 0, TAU); g.fill(); });
        g.globalAlpha = 1;
      } else {
        // sun (sets as you climb)
        const sunY = H * 0.16 + camH * 6;
        if (sunY < H + 40) {
          g.fillStyle = "rgba(255,216,77,.35)"; g.beginPath(); g.arc(W * 0.82, sunY, 46, 0, TAU); g.fill();
          g.fillStyle = camH > 12 ? "#ffb347" : "#ffd84d"; g.strokeStyle = INK; g.lineWidth = 4;
          g.beginPath(); g.arc(W * 0.82, sunY, 28, 0, TAU); g.fill(); g.stroke();
        }
      }
      // parallax clouds + birds
      const par = 0.6;
      for (const c of clouds) {
        const y = ground - c.wy + S.cam * par;
        if (y < -60 || y > H + 60) continue;
        g.globalAlpha = 1 - space * 0.7;
        drawCloud(c.x * W, y, c.s * clamp(W / 400, 0.75, 1.2));
      }
      g.globalAlpha = 1;
      for (const b of birds) {
        const y = ground - b.wy + S.cam * 0.8;
        if (y < -20 || y > H + 20 || space > 0.6) continue;
        drawBird(b.x * W, y + Math.sin(performance.now() / 600 + b.ph) * 6, b.ph);
      }
    }
    function drawGround() {
      const g = ctx, gy = sy(0);
      if (gy > H + 10) return;
      // hills
      g.fillStyle = "#95dd7f"; g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, gy);
      for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, gy - 30 - Math.sin(x / W * 6 + 1) * 12);
      g.lineTo(W, gy); g.closePath(); g.fill(); g.stroke();
      // barn
      const bx = W * 0.1, bw = Math.min(70, W * 0.16), bh = bw * 0.8;
      if (W > 300) {
        g.fillStyle = "#e5484d"; g.strokeStyle = INK; g.lineWidth = 3.5;
        g.beginPath(); g.moveTo(bx, gy); g.lineTo(bx, gy - bh); g.lineTo(bx + bw / 2, gy - bh - bw * 0.4); g.lineTo(bx + bw, gy - bh); g.lineTo(bx + bw, gy); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = "#fff"; rr(g, bx + bw * 0.3, gy - bh * 0.55, bw * 0.4, bh * 0.55, 3); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(bx + bw * 0.3, gy - bh * 0.55); g.lineTo(bx + bw * 0.7, gy); g.moveTo(bx + bw * 0.7, gy - bh * 0.55); g.lineTo(bx + bw * 0.3, gy); g.stroke();
      }
      // grass
      g.fillStyle = "#6fd14a"; g.fillRect(0, gy, W, H - gy + 4);
      g.strokeStyle = INK; g.lineWidth = 3.5; g.beginPath(); g.moveTo(0, gy); g.lineTo(W, gy); g.stroke();
      g.fillStyle = "#5bbf3a";
      for (let x = 8; x < W; x += 26) { g.beginPath(); g.moveTo(x, gy + 10); g.lineTo(x + 4, gy + 2); g.lineTo(x + 8, gy + 10); g.fill(); }
    }
    function drawRuler() {
      // little flags every 5 bales on the left edge
      const g = ctx;
      const lo = Math.max(1, Math.floor((S.cam - 40) / BH / 5)), hi = Math.ceil((S.cam + H) / BH / 5) + 1;
      for (let k = lo; k <= hi; k++) {
        const h = k * 5, y = sy(h * BH + BH);
        if (y < 96 || y > H) continue;
        const reached = height() >= h;
        g.strokeStyle = INK; g.lineWidth = 3;
        g.beginPath(); g.moveTo(10, y); g.lineTo(10, y - 26); g.stroke();
        g.fillStyle = reached ? (h % 10 === 0 ? "#ff8fc7" : "#7be04a") : "rgba(255,255,255,.6)";
        g.beginPath(); g.moveTo(11, y - 26); g.lineTo(40, y - 19); g.lineTo(11, y - 12); g.closePath(); g.fill(); g.stroke();
        txt(g, String(h), 22, y - 34, 14, "#fff", 3.5);
      }
    }
    function drawTower() {
      const g = ctx, n = S.stack.length, t = performance.now() / 1000;
      const first = Math.max(0, Math.floor((S.cam - 10) / BH) - 1);
      for (let i = first; i < n; i++) {
        const b = S.stack[i];
        const y = sy(i * BH);
        if (y - BH > H + 4) continue;
        if (y < -BH) break;
        const k = n > 1 ? Math.pow(i / (n - 1), 1.6) : 0;
        const off = S.wob * Math.sin(t * 20) * 6 * k;
        drawBale(g, b.x + off, y, b.w, BH, b.seed || i + 3, 0);
      }
    }
    function drawGuinea() {
      const g = ctx, n = S.stack.length, h = height();
      let wy = n * BH;
      if (S.hop) { const p = Math.min(1, S.hop.t / S.hop.d); wy = lerp(S.hop.y0, S.hop.y1, p) + S.hop.arc * 4 * p * (1 - p); }
      const y = sy(wy);
      const t = performance.now() / 1000;
      const tremble = (h >= 15 && !S.hop && S.state !== "over") ? Math.sin(t * 46) * Math.min(2.2, 0.6 + (h - 15) * 0.06) : 0;
      const wobOff = S.wob * Math.sin(t * 20) * 6;
      const x = S.gx + tremble + (S.hop ? 0 : wobOff);
      let sx = 1, syy = 1;
      if (S.hop) { const p = S.hop.t / S.hop.d; if (p < 0.15) { sx = 1.1; syy = 0.9; } else if (p < 0.85) { sx = 0.92; syy = 1.1; } }
      const img = S.sadT > 0 || S.state === "end" || S.state === "over" && S.misses >= 3 ? gImg.sad : h >= 8 || S.hop ? gImg.wow : gImg.happy;
      // shadow
      if (!S.hop) { g.fillStyle = "rgba(43,22,64,.18)"; g.beginPath(); g.ellipse(x, y + 1, gw * 0.36, 4, 0, 0, TAU); g.fill(); }
      g.save(); g.translate(x, y + gh * 0.07); g.rotate(S.hop ? Math.sin(S.hop.t * 14) * 0.08 : tremble * 0.02); g.scale(sx, syy);
      if (img.complete && img.naturalWidth) g.drawImage(img, -gw / 2, -gh, gw, gh);
      g.restore();
      // speech bubble
      if (S.bubble && !S.hop) {
        const b = S.bubble, a = Math.min(1, b.t * 6, (1.5 - b.t) * 4);
        g.save(); g.globalAlpha = clamp(a, 0, 1);
        g.font = "800 15px " + FONT;
        const tw = g.measureText(b.text).width + 18;
        const right = x + gw * 0.3 + tw < W - 6;
        const bx = right ? x + gw * 0.3 : x - gw * 0.3 - tw, by = y - gh - 26;
        g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 3;
        rr(g, bx, by, tw, 28, 12); g.fill(); g.stroke();
        g.beginPath(); const tx = right ? bx + 12 : bx + tw - 12; g.moveTo(tx - 5, by + 27); g.lineTo(tx + (right ? -8 : 8), by + 40); g.lineTo(tx + 5, by + 27); g.fill(); g.stroke();
        g.fillStyle = "#fff"; g.fillRect(tx - 4, by + 24, 8, 4);
        g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(b.text, bx + tw / 2, by + 15);
        g.restore();
      }
    }
    function drawMover() {
      const g = ctx;
      if (S.mover) {
        const m = S.mover, n = S.stack.length;
        const y = sy(n * BH + gap) + Math.sin(m.bob * 5) * 2;
        // guide line + rope
        g.strokeStyle = "rgba(255,255,255,.55)"; g.setLineDash([5, 7]); g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(m.x, y); g.lineTo(m.x, sy(n * BH)); g.stroke(); g.setLineDash([]);
        g.strokeStyle = INK; g.lineWidth = 3;
        g.beginPath(); g.moveTo(m.x - m.w * 0.25, y - BH); g.lineTo(m.x, y - BH - 22); g.lineTo(m.x + m.w * 0.25, y - BH); g.moveTo(m.x, y - BH - 22); g.lineTo(m.x, -10); g.stroke();
        g.fillStyle = "#cfd4e6"; g.beginPath(); g.arc(m.x, y - BH - 22, 5, 0, TAU); g.fill(); g.stroke();
        drawBale(g, m.x, y, m.w, BH, m.seed, Math.sin(m.bob * 3) * 0.02);
      }
      if (S.fall) { const f = S.fall; drawBale(g, f.x, sy(f.wy), f.w, BH, f.seed, 0); }
      for (const d of S.debris) drawBale(g, d.x, sy(d.wy) + BH / 2, d.w, BH, d.seed, d.rot);
    }
    function drawCombo() {
      if (S.combo < 2 || (S.state !== "aim" && S.state !== "fall")) return;
      const g = ctx;
      g.save(); g.translate(W - 50, 86); g.rotate(0.06);
      txt(g, "🔥" + S.combo, 0, 0, 22, "#ff9f43", 5);
      txt(g, "perfect", 0, 20, 13, "#ffd84d", 3.5);
      g.restore();
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state !== "end" && t > 1.6 ? 1 - (t - 1.6) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.24); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(44, W * 0.92 / (b.text.length * 0.68 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 17, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      drawBackground();
      g.save();
      if (S.shake > 0) g.translate(rnd(-S.shake, S.shake) * 0.6, rnd(-S.shake, S.shake) * 0.6);
      drawGround();
      drawRuler();
      drawTower();
      drawMover();
      drawGuinea();
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.75 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else if (p.k === "straw") { g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.strokeStyle = p.col; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-p.r, 0); g.lineTo(p.r, 0); g.stroke(); g.restore(); }
        else if (p.k === "drop") { g.beginPath(); g.moveTo(p.x, p.y - p.r * 1.8); g.quadraticCurveTo(p.x + p.r, p.y, p.x, p.y + p.r); g.quadraticCurveTo(p.x - p.r, p.y, p.x, p.y - p.r * 1.8); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); if (p.k === "dot") { g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); } }
      }
      g.globalAlpha = 1;
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.7) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, f.t - 0.12);
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = "rgba(155,217,106," + S.flash * 1.6 + ")"; g.fillRect(0, 0, W, H); }
      drawCombo();
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
    function onDown(e) { e.preventDefault(); drop(); }
    function onKey(e) {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") { if (S.state === "aim") { e.preventDefault(); drop(); } }
    }
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    S.camT = 0;
    showPanel(null);
    raf = requestAnimationFrame(frame);
    wrap._hay = S; // test hook

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
    id: ID, name: "Hay Stack Tower", icon: "🌾", place: "carnival", kind: "skill",
    blurb: "Stack hay bales sky-high. Line them up!",
    mount,
  });
})();
