/* Wheek World mini-game: Fart Rocket.
   Flappy-style: tap to toot upward through gaps between giant cucumbers and squishy stacks. */
(function () {
  "use strict";
  const ID = "fart-rocket", C = "g-fartrocket";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const GRAV = 1350, FLAP = 440;
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

  function drawCan(g) {
    // 60 x 74 bean can
    const body = () => rr(g, 8, 12, 44, 56, 6);
    blob(g, [body, ell(g, 30, 12, 22, 7)], "#c9ced8", 4);
    g.fillStyle = "#ff9f43"; g.fillRect(8, 24, 44, 32);
    g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(8, 24, 44, 32);
    g.fillStyle = "#ffd84d"; g.beginPath(); g.ellipse(30, 40, 16, 11, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = "#c2552a"; [[23, 38], [30, 43], [36, 37]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 4.5, 3, 0.4, 0, TAU); g.fill(); });
    g.fillStyle = "#e9ecf2"; g.beginPath(); g.ellipse(30, 12, 18, 5, 0, 0, TAU); g.fill();
    g.strokeStyle = "#9aa0b4"; g.lineWidth = 2; g.beginPath(); g.ellipse(30, 12, 13, 3.4, 0, 0, TAU); g.stroke();
    g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(12, 28, 4, 24);
    g.strokeStyle = INK; g.lineWidth = 4; body(); g.stroke();
  }
  function drawGoldBeans(g) {
    // 60 x 50 three golden beans
    const beans = [ell(g, 18, 30, 13, 9, 0.5), ell(g, 40, 32, 13, 9, -0.4), ell(g, 29, 18, 13, 9, 0.1)];
    blob(g, beans, "#ffd84d", 3.5);
    g.strokeStyle = "#e0a800"; g.lineWidth = 2.5;
    g.beginPath(); g.arc(18, 32, 5, 3.6, 5.2); g.stroke(); g.beginPath(); g.arc(40, 34, 5, 3.6, 5.2); g.stroke(); g.beginPath(); g.arc(29, 20, 5, 3.6, 5.2); g.stroke();
    g.fillStyle = "#fff"; [[14, 26], [36, 28], [25, 14]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 3, 2, -0.5, 0, TAU); g.fill(); });
  }

  const HUES = [["#ff8fc7", "#ffc2e0"], ["#ffd84d", "#fff0a8"], ["#5fd3ff", "#b8ecff"], ["#c7b3ff", "#e6dcff"], ["#7be04a", "#c6f5a6"], ["#ff9f43", "#ffd0a0"]];

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 12px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:5px;min-height:42px;white-space:nowrap}
.${C} .pill small{font-family:var(--body);font-weight:900;font-size:13px;opacity:.7}
.${C} .x2{background:var(--yellow);transform:rotate(-8deg);animation:${C}-throb 1s infinite}
.${C} .x2.hide{display:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(20,10,40,.35);z-index:5}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:18px 18px 20px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:120px;display:flex;align-items:center;justify-content:center;margin-top:-6px}
.${C} .panel .art svg{animation:${C}-fly 1.2s ease-in-out infinite}
.${C} .panel .art .puff{position:absolute;left:50%;top:60%;width:26px;height:26px;border-radius:50%;background:#9be36a;border:3px solid var(--ink);animation:${C}-puff 1.2s ease-out infinite}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--slime)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.35;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#f3edff;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-fly{0%,100%{transform:translateY(6px) rotate(8deg)}40%{transform:translateY(-14px) rotate(-14deg)}}
@keyframes ${C}-puff{0%{transform:translate(-70px,0) scale(.4);opacity:1}100%{transform:translate(-120px,20px) scale(1.6);opacity:0}}
@keyframes ${C}-throb{0%,100%{transform:scale(1) rotate(-8deg)}50%{transform:scale(1.12) rotate(-8deg)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill cn">🪙<b>0</b></div><div class="pill x2 hide">x2!</div><div class="pill bs"><small>BEST</small><b>0</b></div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), cnEl = wrap.querySelector(".cn b"), bsEl = wrap.querySelector(".bs b"), x2El = wrap.querySelector(".x2");
    const ov = wrap.querySelector(".ov");
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 240, mood: "happy", flip: true })), wow: svgImg(api.guineaSVG({ size: 240, mood: "wow", flip: true })), sad: svgImg(api.guineaSVG({ size: 240, mood: "sad", flip: true })) };
    const SPR = { can: sprite(60, 74, drawCan), beans: sprite(60, 50, drawGoldBeans) };

    /* ---------- fart synth (random pitch) ---------- */
    let ac = null;
    function toot(pitch, dur, vol) {
      if (api.muted) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === "suspended") ac.resume();
      } catch (e) { return; }
      const t = ac.currentTime;
      const o = ac.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(pitch * 1.35, t); o.frequency.exponentialRampToValueAtTime(pitch * 0.55, t + dur);
      const flt = ac.createBiquadFilter(); flt.type = "lowpass"; flt.frequency.value = pitch * 7; flt.Q.value = 5;
      const trem = ac.createGain(); trem.gain.value = 0.55;
      const lfo = ac.createOscillator(); lfo.frequency.value = rnd(16, 34);
      const lg = ac.createGain(); lg.gain.value = 0.45; lfo.connect(lg).connect(trem.gain);
      const env = ac.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(vol, t + 0.02); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(flt).connect(trem).connect(env).connect(ac.destination);
      o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    }

    let W = 1, H = 1, dpr = 1, u = 1, waterY = 1, gw = 80, gh = 68, px = 100, pw = 84;
    let sky = null;
    const S = {};
    const P = { y: 0, vy: 0, rot: 0, sqT: 9, tootT: 9 };
    let best = (api.highscore(ID, 0) || {}).best || 0;

    function reset() {
      Object.assign(S, { state: "intro", t: 0, gaps: 0, coins: 0, pillars: [], items: [], parts: [], floats: [], scroll: 0, nextX: 0, lastGapY: 0,
        mega: 0, gold: 0, shake: 0, flash: 0, banner: null, endT: 0, awarded: false, started: false, sinceCan: 0, sinceGold: 0, deadHow: "", idx: 0 });
      Object.assign(P, { y: waterY * 0.45, vy: 0, rot: 0, sqT: 9, tootT: 9 });
    }

    function resize() {
      W = Math.max(1, root.clientWidth); H = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      u = clamp(Math.min(H / 700, W / 360), 0.75, 1.5);
      waterY = H - 64 * u;
      gw = 84 * u; gh = gw * 0.85; px = Math.max(gw, W * 0.3); pw = 86 * u;
      sky = document.createElement("canvas"); sky.width = cv.width; sky.height = cv.height;
      const g = sky.getContext("2d"); g.scale(dpr, dpr);
      const gr = g.createLinearGradient(0, 0, 0, waterY);
      gr.addColorStop(0, "#3b2a6b"); gr.addColorStop(0.5, "#6a4fa3"); gr.addColorStop(0.85, "#86c9a0"); gr.addColorStop(1, "#b9ecb0");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255," + rnd(0.3, 0.9) + ")"; g.beginPath(); g.arc(rnd(0, W), rnd(0, waterY * 0.5), rnd(0.8, 2), 0, TAU); g.fill(); }
      const mx = W * 0.8, my = H * 0.14, mr = 34 * u;
      g.fillStyle = "rgba(255,250,200,.18)"; g.beginPath(); g.arc(mx, my, mr * 2, 0, TAU); g.fill();
      g.fillStyle = "#fff6c8"; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = "#e9dca0"; g.beginPath(); g.arc(mx - mr * 0.3, my - mr * 0.2, mr * 0.18, 0, TAU); g.arc(mx + mr * 0.25, my + mr * 0.3, mr * 0.12, 0, TAU); g.fill();
      if (S.state === "intro" || !S.state) P.y = waterY * 0.45;
    }

    /* ---------- UI ---------- */
    function setHud() { cnEl.textContent = S.coins; bsEl.textContent = Math.max(best, S.gaps); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function payout() { return Math.min(300, S.coins); }
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 110, mood: "wow", flip: true });
      const lastLine = after ? `<div class="last">🚀 ${after.gaps} gaps &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="puff"></span><span class="puff" style="animation-delay:-.4s"></span>${svg}</div>
        <h2>${after ? "Toot again?" : "Fart Rocket"}</h2>${lastLine}
        <p><b>Tap</b> to toot upward! Fly through the gaps. Don't fall in the swamp!</p>
        <div class="chips"><span class="chip">🥫 Beans = MEGA TOOT</span><span class="chip">✨ Gold beans x2</span></div>
        <button class="btn green">${after ? "Fly again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start(e) {
      if (e) e.stopPropagation();
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "ready"; S.nextX = W + 60 * u;
      hud.classList.remove("off");
      x2El.textContent = "x" + api.multiplier + "!";
      x2El.classList.toggle("hide", !(api.multiplier > 1));
      setHud();
    }

    /* ---------- fx ---------- */
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) { size = size || 24; x = clamp(x, text.length * size * 0.32 + 8, W - text.length * size * 0.32 - 8); S.floats.push({ x, y, text, col, size, t: 0, life: 0.9 }); }
    function gas(x, y, n, power) {
      for (let i = 0; i < n; i++) {
        S.parts.push({ k: "gas", x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: -rnd(80, 220) * power, vy: rnd(-50, 90) * power, g: -30, r: rnd(6, 11) * u * power, grow: rnd(16, 30) * u, col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#d2f08f"]), life: rnd(0.5, 0.9) * (power > 1 ? 1.4 : 1), t: 0 });
      }
    }
    function burst(x, y, cols, n, spd, k) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(0.3, 1) * (spd || 260);
        S.parts.push({ k: k || "dot", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 500, r: rnd(3, 7) * u, col: pick(cols), life: rnd(0.4, 0.9), t: 0, rot: rnd(0, TAU) });
      }
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- pillars ---------- */
    function gapSize() { return (S.idx < 5 ? 0.5 : lerp(0.45, 0.29, clamp((S.idx - 5) / 30, 0, 1))) * (waterY - 20 * u); }
    function spawnPillar() {
      const gs = gapSize(), top = 30 * u, bot = waterY - 20 * u;
      const lo = top + gs / 2 + 10 * u, hi = bot - gs / 2 - 10 * u;
      let cy = S.idx === 0 ? (lo + hi) / 2 : clamp(S.lastGapY + rnd(-1, 1) * (S.idx < 5 ? 0.12 : lerp(0.2, 0.4, clamp((S.idx - 5) / 20, 0, 1))) * (bot - top), lo, hi);
      S.lastGapY = cy;
      const type = S.idx % 3 === 2 ? "squish" : "cuke";
      const p = { x: S.nextX, cy, gs, type, seed: S.idx * 7 + 1, passed: false };
      S.pillars.push(p);
      S.sinceCan++; S.sinceGold++;
      if (S.idx >= 3 && S.sinceCan >= 6 && Math.random() < 0.3) { S.items.push({ k: "can", x: p.x + pw / 2, y: cy, ph: 0 }); S.sinceCan = 0; }
      else if (S.idx >= 2 && S.sinceGold >= 5 && Math.random() < 0.25) { S.items.push({ k: "beans", x: p.x + pw / 2, y: cy, ph: 0 }); S.sinceGold = 0; }
      S.idx++;
      S.nextX += lerp(300, 250, clamp(S.idx / 25, 0, 1)) * u;
    }
    function speed() { return lerp(150, 215, clamp(S.idx / 35, 0, 1)) * u * (S.mega > 0 ? 1.9 : 1); }

    function flap() {
      if (S.state === "ready") { S.state = "play"; banner("TOOT TOOT!", "", "#9be36a"); }
      if (S.state !== "play") return;
      P.vy = -FLAP * u; P.sqT = 0; P.tootT = 0;
      toot(rnd(70, 170), rnd(0.16, 0.3), 0.22);
      gas(px - gw * 0.42, P.y + gh * 0.12, 7, 1);
      if (Math.random() < 0.12) floatT(px - gw * 0.8, P.y + 10, pick(["pfft!", "toot!", "brrap!", "fffp!"]), "#d2f08f", 18);
    }

    function crash(how) {
      if (S.state !== "play") return;
      S.state = "dead"; S.endT = 0; S.deadHow = how;
      P.vy = how === "water" ? 0 : -300 * u;
      api.haptic(120); shake(16); S.flash = 0.3;
      if (how === "water") {
        api.sfx("splat"); burst(px, waterY, ["#86c9a0", "#b9ecb0", "#fff"], 26, 380);
        banner("SPLOOSH!", gName + " went for a swim", "#9be36a");
      } else {
        api.sfx("hit"); toot(55, 0.7, 0.3); burst(px + gw * 0.3, P.y, ["#fff", "#ffd84d"], 14, 300, "star");
        banner("SQUISH!", "bonk! right in the snoot", "#ff8fc7");
      }
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const coins = payout();
      const earned = coins > 0 ? api.award(coins, { reason: "Fart Rocket" }) : 0;
      const hs = api.highscore(ID, S.gaps);
      best = hs.best;
      const quip = S.gaps === 0 ? (S.deadHow === "water" ? `${gName} sank in the swamp. Tap to toot up!` : `${gName} bonked the snoot. Tap a bit gentler!`) : S.gaps < 5 ? `${gName} tooted through ${S.gaps} gap${S.gaps > 1 ? "s" : ""}. Warming up!` : S.gaps < 15 ? `${gName} tooted through ${S.gaps} gaps. Stinky skills!` : `${S.gaps} gaps! ${gName} is a legendary fart pilot!`;
      api.done({ earned, title: hs.isNew && S.gaps > 0 ? "New best!" : S.deadHow === "water" ? "Sploosh!" : "Squish!", text: `${quip} ${hs.isNew && S.gaps > 0 ? "New best! 🏆" : "Best: " + hs.best}`, score: S.gaps });
      hud.classList.add("off");
      showPanel({ gaps: S.gaps, earned });
    }

    function collect(it) {
      it.got = true;
      const [vx, vy] = vp(it.x, it.y);
      if (it.k === "can") {
        S.mega = 3; S.coins += 5;
        toot(48, 1.1, 0.35); api.sfx("bigwin"); api.haptic(60); shake(10);
        gas(px - gw * 0.4, P.y, 30, 2.2); api.gas(vx, vy);
        banner("MEGA TOOT!", "+5 🪙  zoooom!", "#9be36a");
      } else {
        S.gold = 10; api.sfx("sparkle"); api.confetti(vx, vy, 30);
        burst(it.x, it.y, ["#ffd84d", "#fff3b0", "#fff"], 18, 260, "star");
        banner("GOLDEN BEANS!", "x2 coins per gap!", "#ffd84d");
      }
      setHud(); bump(cnEl.parentNode);
    }

    /* ---------- update ---------- */
    function update(dt) {
      const sp = S.state === "play" ? speed() : S.state === "ready" || S.state === "intro" || S.state === "over" ? 70 * u : 0;
      S.scroll += sp * dt;
      if (S.state === "ready" || S.state === "intro" || S.state === "over") {
        P.y = waterY * 0.45 + Math.sin(performance.now() / 300) * 10 * u; P.rot = Math.sin(performance.now() / 300) * 0.08;
        if (S.state === "ready" && Math.random() < dt * 3) gas(px - gw * 0.4, P.y + gh * 0.12, 1, 0.6);
      } else if (S.state === "play") {
        S.t += dt;
        S.mega = Math.max(0, S.mega - dt); S.gold = Math.max(0, S.gold - dt);
        if (S.mega > 0) {
          // autopilot toward next gap while mega tooting
          const nxt = S.pillars.find((p) => p.x + pw > px - gw * 0.3);
          const ty = nxt ? nxt.cy : waterY * 0.45;
          P.vy = lerp(P.vy, (ty - P.y) * 5, Math.min(1, dt * 6));
          if (Math.random() < dt * 40) gas(px - gw * 0.45, P.y + gh * 0.1, 1, 1.8);
        } else P.vy += GRAV * u * dt;
        P.vy = Math.min(P.vy, 720 * u);
        P.y += P.vy * dt;
        if (P.y < gh * 0.5) { P.y = gh * 0.5; P.vy = Math.max(0, P.vy); }
        P.rot = lerp(P.rot, clamp(P.vy / (900 * u), -0.45, 0.9), Math.min(1, dt * 10));
        // spawn and move pillars
        S.nextX -= sp * dt;
        while (S.nextX < W + pw * 2) spawnPillar();
        const r = gw * 0.3; // forgiving hitbox
        for (const p of S.pillars) {
          p.x -= sp * dt;
          if (!p.passed && p.x + pw < px - r) {
            p.passed = true; S.gaps++;
            const v = (S.gold > 0 ? 2 : 1) * 2 + (S.gaps % 10 === 0 ? 10 : 0);
            S.coins += v;
            api.sfx(S.gaps % 10 === 0 ? "fanfare" : "coin");
            floatT(px, P.y - gh * 0.7, "+" + v, S.gold > 0 ? "#ffd84d" : "#fff", S.gold > 0 ? 28 : 22);
            if (S.gaps % 10 === 0) { banner(S.gaps + " GAPS!", "+10 bonus 🪙", "#5fd3ff"); const [vx, vy] = vp(px, P.y); api.confetti(vx, vy, 40); }
            if (S.gaps === best + 1 && best > 0) floatT(W / 2, H * 0.22, "NEW BEST!", "#ff8fc7", 30);
            setHud(); bump(cnEl.parentNode);
          }
          if (S.mega <= 0 && px + r > p.x + 6 * u && px - r < p.x + pw - 6 * u && (P.y - r < p.cy - p.gs / 2 || P.y + r * 0.9 > p.cy + p.gs / 2)) crash("pillar");
        }
        S.pillars = S.pillars.filter((p) => p.x > -pw - 20);
        for (const it of S.items) {
          it.x -= sp * dt; it.ph += dt;
          const dx = it.x - px, dy = it.y - P.y;
          if (!it.got && dx * dx + dy * dy < (gw * 0.55) ** 2) collect(it);
        }
        S.items = S.items.filter((i) => !i.got && i.x > -60);
        if (P.y + gh * 0.32 > waterY) crash("water");
      } else if (S.state === "dead") {
        S.endT += dt;
        if (S.deadHow === "water") { P.y = lerp(P.y, waterY + gh * 0.2, Math.min(1, dt * 4)); P.rot += dt * 0.5; }
        else { P.vy += GRAV * u * dt; P.y = Math.min(P.y + P.vy * dt, waterY + gh * 0.2); P.rot += dt * 8; }
        if (S.endT > 1.9) finish();
      }
      P.sqT += dt; P.tootT += dt;
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt - (p.k === "gas" ? sp * dt * 0.3 : 0); p.y += p.vy * dt;
        if (p.grow) { p.r += p.grow * dt; p.vx *= 1 - dt * 2; p.vy *= 1 - dt * 2; }
        if (p.k === "star") p.rot += dt * 6;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const f of S.floats) { f.t += dt; f.y -= 60 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.5 && S.state === "play") S.banner = null; }
      S.shake = Math.max(0, S.shake - dt * 40);
      S.flash = Math.max(0, S.flash - dt);
    }

    /* ---------- drawing ---------- */
    function silhouettes(par, baseY, col, spacing, size) {
      const g = ctx, off = S.scroll * par;
      g.fillStyle = col;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 10) { const wx = (x + off) / u; g.lineTo(x, baseY - (Math.sin(wx * 0.008 + par * 9) * 0.5 + 0.5) * 30 * u); }
      g.lineTo(W, H); g.closePath(); g.fill();
      const i0 = Math.floor(off / spacing) - 1, i1 = Math.ceil((off + W) / spacing) + 1;
      for (let i = i0; i <= i1; i++) {
        if (hash(i * 3 + par) < 0.3) continue;
        const x = i * spacing - off, s = size * (0.7 + hash(i + par) * 0.6);
        // twisty swamp tree
        g.beginPath(); g.moveTo(x - s * 0.12, baseY); g.quadraticCurveTo(x - s * 0.05, baseY - s * 0.6, x - s * 0.25, baseY - s); g.lineTo(x - s * 0.1, baseY - s * 1.02);
        g.quadraticCurveTo(x + s * 0.1, baseY - s * 0.6, x + s * 0.14, baseY); g.closePath(); g.fill();
        g.beginPath(); g.ellipse(x - s * 0.2, baseY - s * 1.05, s * 0.42, s * 0.2, -0.2, 0, TAU); g.fill();
        g.beginPath(); g.ellipse(x + s * 0.15, baseY - s * 0.95, s * 0.3, s * 0.15, 0.2, 0, TAU); g.fill();
        g.fillRect(x - s * 0.5, baseY - s * 1.0, 2, s * 0.35); g.fillRect(x + s * 0.3, baseY - s * 0.92, 2, s * 0.3);
      }
    }
    function cattails() {
      const g = ctx, off = S.scroll * 0.8, sp = 46 * u;
      const i0 = Math.floor(off / sp) - 1, i1 = Math.ceil((off + W) / sp) + 1;
      for (let i = i0; i <= i1; i++) {
        if (hash(i + 11) < 0.45) continue;
        const x = i * sp - off + hash(i) * 20, h = (40 + hash(i + 2) * 50) * u, sw = Math.sin(performance.now() / 700 + i) * 4;
        g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(x, waterY + 4); g.quadraticCurveTo(x, waterY - h * 0.5, x + sw, waterY - h); g.stroke();
        g.strokeStyle = "#4fa35a"; g.lineWidth = 3; g.stroke();
        g.fillStyle = "#8a5a2b"; g.strokeStyle = INK; g.lineWidth = 2.5; rr(g, x + sw - 5 * u, waterY - h - 8 * u, 10 * u, 24 * u, 5 * u); g.fill(); g.stroke();
      }
    }
    function water() {
      const g = ctx, t = performance.now() / 1000;
      const gr = g.createLinearGradient(0, waterY, 0, H); gr.addColorStop(0, "#4c9a6e"); gr.addColorStop(1, "#2c5a48");
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, waterY + Math.sin(x * 0.04 + t * 2 + S.scroll * 0.04) * 3 * u);
      g.lineTo(W, H); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      // lily pads
      const off = S.scroll, sp = 120 * u, i0 = Math.floor(off / sp) - 1, i1 = Math.ceil((off + W) / sp) + 1;
      for (let i = i0; i <= i1; i++) {
        if (hash(i + 4) < 0.4) continue;
        const x = i * sp - off + hash(i) * 40 * u, y = waterY + (14 + hash(i + 1) * 28) * u;
        g.fillStyle = "#6fd14a"; g.strokeStyle = INK; g.lineWidth = 2.5;
        g.beginPath(); g.ellipse(x, y, 20 * u, 7 * u, 0, 0.35, TAU - 0.1); g.lineTo(x, y); g.closePath(); g.fill(); g.stroke();
        if (hash(i + 8) > 0.7) { g.fillStyle = "#ff8fc7"; g.beginPath(); g.arc(x - 4 * u, y - 4 * u, 5 * u, 0, TAU); g.fill(); g.stroke(); }
      }
      // bubbles
      for (let i = 0; i < 6; i++) {
        const f = (t * 0.5 + i / 6) % 1, x = ((i * 97 + 30) % W);
        g.globalAlpha = 1 - f; g.strokeStyle = "#b9ecb0"; g.lineWidth = 2;
        g.beginPath(); g.arc(x, H - f * (H - waterY), (2 + f * 4) * u, 0, TAU); g.stroke();
      }
      g.globalAlpha = 1;
    }
    function fireflies() {
      const g = ctx, t = performance.now() / 1000;
      for (let i = 0; i < 10; i++) {
        const x = ((i * 137 - S.scroll * 0.3) % W + W) % W + Math.sin(t + i) * 12, y = waterY * (0.35 + 0.5 * hash(i)) + Math.cos(t * 1.3 + i) * 14;
        const a = 0.5 + Math.sin(t * 3 + i * 2) * 0.5;
        g.fillStyle = "rgba(255,240,140," + a * 0.35 + ")"; g.beginPath(); g.arc(x, y, 7, 0, TAU); g.fill();
        g.fillStyle = "rgba(255,250,200," + a + ")"; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill();
      }
    }
    function cuke(x, y0, y1, faceAtBottom, seed) {
      // vertical cucumber from y0 to y1; the cut/face end is nearest the gap
      const g = ctx, h = y1 - y0;
      g.save();
      rr(g, x, y0, pw, h, pw / 2);
      g.fillStyle = "#3fae3a"; g.fill(); g.strokeStyle = INK; g.lineWidth = 4.5; g.stroke();
      g.save(); rr(g, x, y0, pw, h, pw / 2); g.clip();
      g.fillStyle = "#6cc95a"; g.fillRect(x + pw * 0.18, y0, pw * 0.16, h);
      g.fillStyle = "#2c8a2a"; g.fillRect(x + pw * 0.72, y0, pw * 0.12, h);
      g.fillStyle = "#1f6e1c";
      for (let k = 0; k < h / (26 * u); k++) { const yy = y0 + k * 26 * u + hash(seed + k) * 12 * u; g.beginPath(); g.arc(x + pw * (0.3 + hash(seed + k * 3) * 0.45), yy, 2.6 * u, 0, TAU); g.fill(); }
      g.restore();
      // face near the gap
      const fy = faceAtBottom ? y1 - pw * 0.55 : y0 + pw * 0.55, cx = x + pw / 2;
      g.fillStyle = INK;
      g.beginPath(); g.arc(cx - pw * 0.17, fy, 4.5 * u, 0, TAU); g.arc(cx + pw * 0.17, fy, 4.5 * u, 0, TAU); g.fill();
      g.fillStyle = "#fff"; g.beginPath(); g.arc(cx - pw * 0.17 + 1.5, fy - 1.5, 1.6 * u, 0, TAU); g.arc(cx + pw * 0.17 + 1.5, fy - 1.5, 1.6 * u, 0, TAU); g.fill();
      g.strokeStyle = INK; g.lineWidth = 3; g.beginPath();
      const my = fy + (faceAtBottom ? 10 : 10) * u;
      g.arc(cx, my - 3 * u, 6 * u, 0.2, Math.PI - 0.2); g.stroke();
      g.fillStyle = "rgba(255,143,199,.7)"; g.beginPath(); g.ellipse(cx - pw * 0.3, fy + 6 * u, 5 * u, 3 * u, 0, 0, TAU); g.ellipse(cx + pw * 0.3, fy + 6 * u, 5 * u, 3 * u, 0, 0, TAU); g.fill();
      g.restore();
    }
    function squishStack(x, edgeY, gapY, seed) {
      // stack of squishies from the gap edge outward to the screen edge
      const g = ctx, dir = edgeY < gapY ? -1 : 1, sh = pw * 0.78;
      const n = Math.ceil(Math.abs(gapY - edgeY) / sh) + 1;
      for (let k = n - 1; k >= 0; k--) {
        const cy = gapY + dir * (k * sh + sh / 2), hue = HUES[Math.floor(hash(seed + k) * HUES.length)];
        const w = pw * (0.94 + hash(seed + k * 2) * 0.06), squ = 1 + Math.sin(performance.now() / 260 + k + seed) * 0.03;
        g.save(); g.translate(x + pw / 2, cy); g.scale(squ, 2 - squ);
        rr(g, -w / 2, -sh / 2, w, sh, sh * 0.45);
        g.fillStyle = hue[0]; g.fill(); g.strokeStyle = INK; g.lineWidth = 4.5; g.stroke();
        g.fillStyle = hue[1]; g.beginPath(); g.ellipse(-w * 0.22, -sh * 0.22, w * 0.14, sh * 0.08, -0.4, 0, TAU); g.fill();
        // kawaii face
        g.fillStyle = INK;
        g.beginPath(); g.arc(-w * 0.15, 0, 3.6 * u, 0, TAU); g.arc(w * 0.15, 0, 3.6 * u, 0, TAU); g.fill();
        g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-4 * u, 6 * u); g.quadraticCurveTo(-2 * u, 9 * u, 0, 6 * u); g.quadraticCurveTo(2 * u, 9 * u, 4 * u, 6 * u); g.stroke();
        g.fillStyle = "rgba(255,90,140,.45)"; g.beginPath(); g.ellipse(-w * 0.28, 5 * u, 5 * u, 3 * u, 0, 0, TAU); g.ellipse(w * 0.28, 5 * u, 5 * u, 3 * u, 0, 0, TAU); g.fill();
        if (k % 2 === 0) { g.fillStyle = hue[0]; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-w * 0.38, -sh * 0.32); g.lineTo(-w * 0.3, -sh * 0.62); g.lineTo(-w * 0.14, -sh * 0.42); g.fill(); g.stroke(); g.beginPath(); g.moveTo(w * 0.38, -sh * 0.32); g.lineTo(w * 0.3, -sh * 0.62); g.lineTo(w * 0.14, -sh * 0.42); g.fill(); g.stroke(); }
        g.restore();
      }
    }
    function drawPillar(p) {
      const top = p.cy - p.gs / 2, bot = p.cy + p.gs / 2;
      if (p.type === "cuke") { cuke(p.x, -pw, top, true, p.seed); cuke(p.x, bot, waterY + pw, false, p.seed + 50); }
      else { ctx.save(); ctx.beginPath(); ctx.rect(p.x - 20, 0, pw + 40, waterY); ctx.clip(); squishStack(p.x, 0, top, p.seed); squishStack(p.x, waterY, bot, p.seed + 30); ctx.restore(); }
    }
    function drawItem(it) {
      const g = ctx, y = it.y + Math.sin(it.ph * 3) * 6 * u;
      g.save(); g.translate(it.x, y); g.rotate(it.ph * 1.5);
      g.fillStyle = it.k === "can" ? "rgba(155,227,106,.35)" : "rgba(255,216,77,.4)";
      for (let i = 0; i < 8; i++) { g.rotate(TAU / 8); g.beginPath(); g.moveTo(0, 0); g.lineTo(-6 * u, 44 * u); g.lineTo(6 * u, 44 * u); g.closePath(); g.fill(); }
      g.restore();
      const s = it.k === "can" ? SPR.can : SPR.beans, w = (it.k === "can" ? 48 : 58) * u;
      g.save(); g.translate(it.x, y); g.rotate(Math.sin(it.ph * 4) * 0.2);
      g.drawImage(s.c, -w / 2, -w * s.h / s.w / 2, w, w * s.h / s.w); g.restore();
    }
    function drawGuinea() {
      const g = ctx;
      const st = P.sqT, wob = Math.exp(-st * 8) * Math.cos(st * 24) * 0.2;
      const dead = S.state === "dead" || (S.state === "over" && false);
      g.save(); g.translate(px, P.y); g.rotate(P.rot); g.scale(1 - wob, 1 + wob);
      if (S.mega > 0) {
        const grd = g.createRadialGradient(0, 0, 4, 0, 0, gw * 0.85);
        grd.addColorStop(0, "rgba(190,255,140,.8)"); grd.addColorStop(1, "rgba(190,255,140,0)");
        g.fillStyle = grd; g.beginPath(); g.arc(0, 0, gw * 0.85, 0, TAU); g.fill();
      }
      if (S.gold > 0) { g.strokeStyle = "rgba(255,216,77,.8)"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, gw * 0.62 + Math.sin(performance.now() / 120) * 3, 0, TAU); g.stroke(); }
      const img = dead ? gImg.sad : P.tootT < 0.3 || S.mega > 0 ? gImg.wow : gImg.happy;
      if (img.complete && img.naturalWidth) g.drawImage(img, -gw / 2, -gh * 0.6, gw, gh);
      // goggles strap for rocket vibes
      g.restore();
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
      const out = S.state === "play" && t > 1.2 ? 1 - (t - 1.2) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.36); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(50, W * 0.9 / (b.text.length * 0.7 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 18, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      if (sky) g.drawImage(sky, 0, 0, W, H);
      g.save();
      const sh = S.shake; if (sh > 0) g.translate(rnd(-sh, sh) * 0.6, rnd(-sh, sh) * 0.6);
      silhouettes(0.15, waterY - 40 * u, "#4b3a7a", 140 * u, 120 * u);
      silhouettes(0.35, waterY - 6 * u, "#3a6a5a", 190 * u, 90 * u);
      fireflies();
      for (const p of S.pillars) drawPillar(p);
      for (const it of S.items) drawItem(it);
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.8 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") drawStar(g, p.x, p.y, p.r, p.rot);
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); if (p.k === "gas") { g.strokeStyle = "rgba(43,22,64," + a * 0.5 + ")"; g.lineWidth = 2; g.stroke(); } }
      }
      g.globalAlpha = 1;
      drawGuinea();
      cattails();
      water();
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.6) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, (f.t - 0.12));
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      if (S.flash > 0) { g.fillStyle = "rgba(255,255,255," + S.flash * 1.5 + ")"; g.fillRect(0, 0, W, H); }
      // big gap counter
      if (S.state === "play" || S.state === "dead" || S.state === "ready") {
        const pulse = 1 + Math.max(0, 0.3 - (S.pillars.find((p) => p.passed) ? 0 : 0));
        txt(g, String(S.gaps), W / 2, 92, 56 * pulse > 56 ? 56 : 56, "#fff", 9);
      }
      if (S.state === "ready") {
        const b = 1 + Math.sin(performance.now() / 200) * 0.06;
        g.save(); g.translate(W / 2, H * 0.62); g.scale(b, b);
        txt(g, "TAP TO TOOT!", 0, 0, 34, "#9be36a", 7);
        txt(g, "👆", 0, 46, 36, "#fff", 1);
        g.restore();
      }
      if (S.state === "play" && (S.mega > 0 || S.gold > 0)) {
        let y = 128;
        const bar = (label, f, col) => {
          const w = 150, x = (W - w) / 2;
          g.fillStyle = "#fffdf8"; g.strokeStyle = INK; g.lineWidth = 3; rr(g, x, y, w, 24, 12); g.fill(); g.stroke();
          g.fillStyle = col; rr(g, x + 4, y + 4, Math.max(8, (w - 8) * f), 16, 8); g.fill();
          txt(g, label, W / 2, y + 12, 13, "#fff", 3); y += 30;
        };
        if (S.mega > 0) bar("💨 MEGA TOOT", S.mega / 3, "#9be36a");
        if (S.gold > 0) bar("✨ x2 COINS", S.gold / 10, "#ffd84d");
      }
      if (S.state === "dead" || S.state === "over") { g.fillStyle = "rgba(20,10,40," + Math.min(0.3, (S.endT || 2) * 0.3) + ")"; g.fillRect(0, 0, W, H); }
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
    function onDown(e) { e.preventDefault(); flap(); }
    function onKey(e) { if (e.repeat) return; if (e.key === " " || e.key === "ArrowUp" || e.key === "w") flap(); }
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    setHud();
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
        if (ac) { try { ac.close(); } catch (e) { /* ignore */ } ac = null; }
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Fart Rocket", icon: "💨", place: "swamp", kind: "skill",
    blurb: "Toot your way through the swamp!",
    mount,
  });
})();
