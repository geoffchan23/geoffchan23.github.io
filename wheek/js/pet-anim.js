/* Wheek World: the home guinea comes alive. Eating, playing, baths, brushing, medicine,
   petting (swipe) and lots of idle behaviours, with props flying around the room. */
"use strict";

const PA = { g: null, el: null, room: null, layer: null, wx: 0, chain: Promise.resolve(), queued: 0, busy: false, idleT: 0, blinkT: 0, napping: false, live: 0, purr: null };
const wait = ms => new Promise(r => setTimeout(r, ms));
const petSvg = () => PA.el && PA.el.querySelector("svg");
function pcls(c, ms) { const s = petSvg(); if (!s) return; s.classList.remove(c); void s.getBoundingClientRect(); s.classList.add(c); if (ms) setTimeout(() => { const t = petSvg(); if (t) t.classList.remove(c); }, ms); }
function puncls(...c) { const s = petSvg(); if (s) s.classList.remove(...c); }
const CRUMB = { hay: ["#e8c060", "#f3d27a"], pellets: ["#8a5a3c", "#a0703c"], lettuce: ["#7be04a", "#b6ec8a"], celery: ["#a8e06a", "#7cbf4a"], cucumber: ["#3f9a3a", "#d8f5b0"], carrot: ["#ff9b2e", "#ffb35c"], pepper: ["#ff5a3d", "#3f9a3a"], dandelion: ["#ffd84d", "#5cc24a"], strawberry: ["#ff5a6e", "#ffe9a0"], watermelon: ["#ff6b8a", "#3f9a3a", "#2b1640"], burrito: ["#e8c08a", "#8a5a3c", "#7be04a"], haycake: ["#fff6ea", "#ff8fc7", "#ffd84d"], goldlettuce: ["#ffd84d", "#fff3a8"], rainbowcarrot: ["#ff5a5f", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"] };
const LONG_FOOD = ["carrot", "celery", "cucumber", "rainbowcarrot", "dandelion"];

function paInit(g) {
  paStop();
  PA.g = g; PA.el = $("#pet"); PA.room = $(".room"); if (!PA.el || !PA.room) return;
  PA.layer = document.createElement("div"); PA.layer.className = "props"; PA.room.appendChild(PA.layer);
  PA.wx = 0; PA.busy = false; PA.queued = 0; PA.chain = Promise.resolve(); PA.napping = false;
  const live = ++PA.live;
  setupPetting(live);
  const blink = () => { if (PA.live !== live) return; if (!PA.busy && !PA.napping) { pcls("blink", 140); $$(".pal svg").forEach(s => { s.classList.add("blink"); setTimeout(() => s.classList.remove("blink"), 140); }); } PA.blinkT = setTimeout(blink, 2200 + Math.random() * 3200); };
  PA.blinkT = setTimeout(blink, 1500);
  const idle = () => { if (PA.live !== live) return; if (!PA.busy && !PA.petting && !document.hidden && !modalStack.length) runIdle(); PA.idleT = setTimeout(idle, 3200 + Math.random() * 3800); };
  PA.idleT = setTimeout(idle, 2500);
}
function paStop() { PA.live++; clearTimeout(PA.idleT); clearTimeout(PA.blinkT); stopPurr(); PA.el = null; }

/* ---------- geometry ---------- */
function roomRect() { return PA.room.getBoundingClientRect(); }
function partPt(sel, fy = .5) { const s = petSvg(); const e = s && s.querySelector(sel); if (!e) { const r = PA.el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .6]; } const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * fy]; }
const mouthVP = () => partPt(".mouth", .6);
const bodyVP = () => { const r = petSvg().getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .62]; };
const toRoom = ([x, y]) => { const r = roomRect(); return [x - r.left, y - r.top]; };
function furColor() { return FUR[PA.g.genes.c] ? FUR[PA.g.genes.c].c : "#f2a65a"; }

/* ---------- props ---------- */
function prop(html, [x, y], size = 46, cls = "") {
  const d = document.createElement("div"); d.className = "prop " + cls; d.innerHTML = html; d.style.fontSize = size + "px"; d.style.setProperty("--ps", size + "px");
  d.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
  PA.layer.appendChild(d); return d;
}
const T = (x, y, extra = "") => `translate(${x}px,${y}px) translate(-50%,-50%) ${extra}`;
function anim(el, frames, ms, easing = "ease-in-out") { if (!el || !el.animate) return Promise.resolve(); const a = el.animate(frames, { duration: reduceMotion ? 1 : ms, easing, fill: "forwards" }); return a.finished.then(() => { try { a.commitStyles(); } catch {} a.cancel(); }).catch(() => {}); }
function fly(el, [fx, fy], [tx, ty], ms = 550, arc = 70, spin = 0) {
  const mx = (fx + tx) / 2, my = Math.min(fy, ty) - arc;
  return anim(el, [{ transform: T(fx, fy, "scale(.7) rotate(0deg)") }, { transform: T(mx, my, `scale(1.05) rotate(${spin / 2}deg)`), offset: .5 }, { transform: T(tx, ty, `scale(1) rotate(${spin}deg)`) }], ms, "cubic-bezier(.3,.1,.4,1)");
}

/* ---------- serial queue so taps never tangle ---------- */
function enqueue(fn) {
  if (!PA.el) return;
  if (PA.queued >= 3) return;
  PA.queued++; wake();
  const live = PA.live;
  PA.chain = PA.chain.then(async () => { if (PA.live !== live) return; PA.busy = true; try { await walkTo(0, 300); await fn(); } catch (e) { console.error(e); } finally { PA.busy = false; PA.queued--; if (PA.live === live && petSvg()) puncls("munch", "chew", "stuffed", "sleepy", "happy-eyes", "walking", "giggle"); } });
}
function wake() { if (PA.napping) { PA.napping = false; puncls("napping"); say(pick(["*yawn* ...huh? I'm awake! Totally awake.", "Mmmph... five more minutes...", "WHAT? Who? Oh, it's you!"])); } }
async function walkTo(px, ms) {
  if (!PA.el) return;
  const sv = petSvg(), rr = roomRect(); if (sv) { const lim = Math.max(0, (rr.width - sv.getBoundingClientRect().width) / 2 - 4); px = clamp(px, -lim, lim); }
  const dx = px - PA.wx; if (Math.abs(dx) < 4) return;
  const t = ms || Math.min(1400, 250 + Math.abs(dx) * 5);
  PA.el.style.setProperty("--wt", t + "ms"); PA.el.style.setProperty("--wx", px + "px");
  PA.el.classList.toggle("face-r", dx > 0);
  pcls("walking"); await wait(t); puncls("walking");
  PA.wx = px;
}

/* ---------- EATING ---------- */
function animEat(id, fromVP, force) {
  enqueue(async () => {
    const g = PA.g, fav = g.fav === id, cols = CRUMB[id] || ["#c8a060"];
    const variant = force || (fav ? "fav" : weighted([{ v: "nibble", w: 30 }, { v: "gobble", w: 22 }, { v: "savor", w: 22 }, { v: "toss", w: 14 }, { v: "slurp", w: LONG_FOOD.includes(id) ? 40 : 0 }]).v);
    const m = toRoom(mouthVP()), r = roomRect();
    const from = fromVP ? toRoom(fromVP) : [r.width - 40, 40];
    const food = prop(itemIcon(id), from, 58, "food");
    if (variant === "fav") { pcls("happy-eyes"); pcls("popcorn", 700); play("wheek"); bits("dot", ...bodyVP(), 14, { c: ["#ffd84d", "#fff3a8", "#ff8fc7"], v: 4, up: 3, s: 3 }); await wait(350); }
    if (variant === "toss") {
      await fly(food, from, [m[0], m[1] - 10], 520, 60);
      for (let i = 0; i < 2; i++) { play("boop"); pcls("chomp", 220); await anim(food, [{ transform: T(m[0], m[1] - 10) }, { transform: T(m[0] + (i ? -8 : 8), m[1] - 90, `rotate(${i ? -200 : 200}deg)`), offset: .5 }, { transform: T(m[0], m[1] - 6, "rotate(360deg)") }], 520, "ease-in-out"); }
      floatText(...mouthVP(), "catch!", "#3d8bff", 20);
    } else if (variant === "slurp") {
      await fly(food, from, [m[0] + 42, m[1] + 2], 520, 50, 90);
    } else {
      await fly(food, from, m, 520, 70, variant === "gobble" ? 360 : 0);
    }
    // chewing
    pcls("munch"); pcls("chew");
    if (variant === "savor") pcls("happy-eyes");
    const bites = { nibble: 5, gobble: 2, savor: 3, toss: 3, slurp: 4, fav: 4 }[variant];
    const gap = { nibble: 230, gobble: 150, savor: 430, toss: 220, slurp: 300, fav: 200 }[variant];
    for (let i = 1; i <= bites; i++) {
      await wait(gap);
      const left = 1 - i / bites;
      if (variant === "slurp") food.style.transform = T(m[0] + 42 * left, m[1] + 2, `rotate(90deg) scale(${.6 + .4 * left})`);
      else food.style.transform = T(m[0], m[1] - 4, `scale(${.35 + .65 * left}) rotate(${(i % 2 ? -1 : 1) * 10}deg)`);
      play(i % 2 ? "chomp" : "munch"); pcls("chomp", 180); haptic(6);
      bits("sq", ...mouthVP(), variant === "gobble" ? 9 : 5, { c: cols, v: 2.6, up: 1.5, s: 4, dir: Math.random() < .5 ? Math.PI * .85 : Math.PI * .15, spread: 1.1 });
      if (variant === "savor") { hearts(...mouthVP(), 1); if (i === 2) floatText(...mouthVP(), "mmmm...", "#e8458f", 18); }
    }
    food.remove();
    puncls("munch");
    if (variant === "gobble") { pcls("stuffed"); floatText(...mouthVP(), "*CHOMP*", "#ff9f43", 22); await wait(700); puncls("stuffed"); if (Math.random() < .5) { play("burp"); floatText(...mouthVP(), "*burp*", "#6a5490", 20); } }
    puncls("chew");
    pcls("lick", 600); await wait(350);
    if (variant === "fav") { pcls("giggle"); hearts(...bodyVP(), 8); play("wheek"); await wait(700); puncls("giggle"); }
    puncls("happy-eyes");
  });
}

/* ---------- PLAYING ---------- */
const BALL_COLS = ["#ff5a5f", "#ffd84d", "#5fd3ff", "#7be04a", "#ff8fc7", "#c7b3ff"];
function animPlay(id) {
  enqueue(async () => {
    const r = roomRect(), floorY = r.height * .86, half = r.width / 2;
    if (id === "paperball") {
      const ball = prop(`<span class="pball"></span>`, [-30, floorY], 30);
      await anim(ball, [{ transform: T(-30, floorY) }, { transform: T(half - 70, floorY, "rotate(540deg)") }], 700, "ease-out");
      play("jump"); await walkTo(-50, 400); pcls("chomp", 200); play("boop");
      for (let i = 0; i < 2; i++) {
        const to = i % 2 ? 40 : r.width - 40, from = i % 2 ? r.width - 40 : half - 70;
        anim(ball, [{ transform: T(from, floorY) }, { transform: T(to, floorY, `rotate(${i % 2 ? -900 : 900}deg)`) }], 800, "cubic-bezier(.2,.7,.4,1)");
        floatText(r.left + half, r.top + floorY - 70, pick(["chase!", "get it!", "zoom!"]), "#3d8bff", 18);
        await walkTo((to - half) * .6, 750); pcls("popcorn", 600); play("jump"); await wait(400);
      }
      await anim(ball, [{ opacity: 1 }, { opacity: 0 }], 300); ball.remove();
    } else if (id === "chew") {
      const m = toRoom(mouthVP());
      const st = prop(`<span class="stick"></span>`, [m[0] + 70, m[1] - 30], 40);
      await fly(st, [m[0] + 70, m[1] - 30], [m[0], m[1]], 400, 20);
      pcls("munch"); pcls("chew");
      for (let i = 0; i < 6; i++) { await wait(200); play(i % 2 ? "chomp" : "munch"); pcls("chomp", 160); st.style.transform = T(m[0], m[1], `scaleX(${1 - i * .09}) rotate(${(i % 2 ? -1 : 1) * 6}deg)`); bits("sq", ...mouthVP(), 4, { c: ["#a0703c", "#c98a55", "#8a5226"], v: 3, s: 3.5 }); }
      st.remove(); puncls("munch", "chew"); floatText(...mouthVP(), "gnaw gnaw!", "#8a5226", 18);
    } else if (id === "squeaky") {
      const tx = half + 80;
      const toy = prop(itemIcon("squeaky"), [r.width + 40, floorY - 10], 44, "toy");
      await anim(toy, [{ transform: T(r.width + 40, floorY - 10) }, { transform: T(tx + 40, floorY - 90), offset: .4 }, { transform: T(tx, floorY - 10) }], 700, "ease-out");
      for (let i = 0; i < 3; i++) {
        await walkTo(i % 2 ? 0 : 50, 350); pcls("popcorn", 600); await wait(300);
        play("squeak"); haptic(10); toy.style.transform = T(tx, floorY - 4, "scale(1.3,.55)"); floatText(r.left + tx, r.top + floorY - 60, "SQUEAK!", "#ff5fa8", 20); await wait(160); toy.style.transform = T(tx, floorY - 10);
      }
      await anim(toy, [{ transform: T(tx, floorY - 10) }, { transform: T(tx - 140, -60, "rotate(-720deg)") }], 700, "ease-out"); toy.remove();
      say(pick(["SQUEAK SQUEAK! I WIN!", "Take THAT, carrot!", "Again! Throw it again!"]));
    } else if (id === "ballpit") {
      const balls = Array.from({ length: 26 }, (_, i) => { const x = 20 + Math.random() * (r.width - 40); const b = prop(`<span class="pball" style="--bc:${BALL_COLS[i % 6]}"></span>`, [x, -30], 26); anim(b, [{ transform: T(x, -30) }, { transform: T(x, floorY - Math.random() * 30), offset: .7 }, { transform: T(x + (Math.random() - .5) * 30, floorY - 24 - Math.random() * 40), offset: .85 }, { transform: T(x + (Math.random() - .5) * 40, floorY - Math.random() * 20) }], 900 + i * 40, "ease-in"); return b; });
      await wait(800);
      for (let i = 0; i < 3; i++) { pcls("popcorn", 650); play("jump"); bits("dot", ...bodyVP(), 6, { c: BALL_COLS, v: 5, s: 5, ring: true }); await wait(520); }
      say("BALL PIT PARTY!!! EVERYBODY!"); hearts(...bodyVP(), 8);
      await Promise.all(balls.map(b => anim(b, [{ opacity: 1 }, { opacity: 0 }], 500))); balls.forEach(b => b.remove());
    } else if (id === "tickle") {
      const b = toRoom(bodyVP());
      const f = prop("🪶", [b[0] + 60, b[1] - 20], 44);
      pcls("giggle"); pcls("happy-eyes");
      for (let i = 0; i < 6; i++) { f.style.transform = T(b[0] + (i % 2 ? -20 : 40), b[1] + (i % 3) * 12 - 10, `rotate(${i % 2 ? -35 : 25}deg)`); if (i % 2) { play("giggle"); floatText(...bodyVP(), pick(["hehe!", "HAHA!", "hihihi!", "STOP! hehe"]), "#ff5fa8", 18); } await wait(260); }
      f.remove();
    } else {
      play("wheek"); pcls("popcorn", 700); hearts(...bodyVP(), 6); await wait(700);
    }
    // bonus mood: zoomies or extra popcorn sometimes
    const roll = Math.random();
    if (roll < .3) await zoomies();
    else if (roll < .55) { pcls("popcorn", 700); play("jump"); floatText(...bodyVP(), "popcorn!", "#ff9f43", 20); await wait(700); }
    await walkTo(0);
  });
}
async function zoomies() {
  const r = roomRect(), lim = r.width * .32;
  play("zoom"); floatText(...bodyVP(), "ZOOMIES!", "#3d8bff", 22);
  for (const x of [lim, -lim, lim * .6, 0]) { await walkTo(x, 260); bits("dot", ...partPt(".foot-l"), 5, { c: ["#e8d6b0", "#d8c6a0"], v: 2, up: 1, s: 4, g: .05, life: 30 }); }
  pcls("popcorn", 650); await wait(650);
}

/* ---------- CARE ---------- */
function animCare(id) {
  enqueue(async () => {
    if (id === "soap") {
      const b = toRoom(bodyVP()), sv = petSvg().getBoundingClientRect();
      pcls("happy-eyes"); play("splash");
      const subs = Array.from({ length: 18 }, (_, i) => { const a = Math.random() * Math.PI * 2, rr = Math.random(); const x = b[0] + Math.cos(a) * sv.width * .38 * rr, y = b[1] - sv.height * .1 + Math.sin(a) * sv.height * .3 * rr; const s = prop(`<span class="suds"></span>`, [x, y], 18 + Math.random() * 26); s.style.transform = T(x, y, "scale(0)"); setTimeout(() => { s.style.transition = "transform .3s cubic-bezier(.3,1.6,.5,1)"; s.style.transform = T(x, y, "scale(1)"); }, i * 45); return { s, x, y }; });
      for (let i = 0; i < 3; i++) { await wait(300); play("scrub"); pcls("chomp", 200); }
      floatText(...bodyVP(), "scrub scrub!", "#5fd3ff", 18);
      // rinse
      for (let i = 0; i < 4; i++) { bits("dot", sv.left + sv.width * (.2 + Math.random() * .6), sv.top - 10, 8, { c: ["#5fd3ff", "#bfefff"], v: 1, up: -3, g: .35, s: 3.5, life: 40 }); await wait(120); }
      subs.forEach(({ s, x, y }, i) => setTimeout(() => { s.style.transform = T(x, y - 30, "scale(1.4)"); s.style.opacity = 0; if (i % 4 === 0) play("pop"); }, i * 40));
      await wait(800); subs.forEach(({ s }) => s.remove());
      // shake dry
      pcls("shakedry", 800); play("shake");
      for (let i = 0; i < 3; i++) { bits("dot", ...bodyVP(), 10, { c: ["#5fd3ff", "#bfefff", "#fff"], v: 6, up: 2, s: 3, dir: i % 2 ? Math.PI : 0, spread: 1.6 }); await wait(250); }
      bits("dot", ...bodyVP(), 14, { c: ["#ffd84d", "#fff"], v: 4, up: 3, s: 2.5, g: .05 }); floatText(...bodyVP(), "✨ squeaky clean!", "#3d8bff", 20);
    } else if (id === "brush") {
      const sv = petSvg().getBoundingClientRect(), r = roomRect();
      const y = sv.top - r.top + sv.height * .45, x0 = sv.left - r.left + sv.width * .2, x1 = sv.left - r.left + sv.width * .8;
      const br = prop("🪮", [x0, y], 44, "brush"); pcls("happy-eyes");
      for (let i = 0; i < 4; i++) { const a = i % 2 ? x1 : x0, bb = i % 2 ? x0 : x1; play("scrub"); await anim(br, [{ transform: T(a, y + (i % 2) * 14, "rotate(-20deg)") }, { transform: T(bb, y + (i % 2) * 14, "rotate(20deg)") }], 380); bits("dot", r.left + bb, r.top + y, 4, { c: [furColor(), "#fff"], v: 1.2, up: 1.5, g: -.02, s: 4, life: 60 }); }
      br.remove(); say(pick(["Ooh brushy brushy!", "I'm so FLUFFY!", "Do my butt next."])); hearts(...bodyVP(), 5);
    } else if (["gummies", "vitc", "youth"].includes(id)) {
      const r = roomRect(), m = toRoom(mouthVP());
      const pill = prop(itemIcon(id), [r.width - 40, 30], 40);
      await fly(pill, [r.width - 40, 30], m, 520, 60, 360); pill.remove();
      pcls("gulp", 450); play("gulp"); await wait(450);
      const b = toRoom(bodyVP()); const ring = prop(`<span class="aura"></span>`, b, 40);
      play("sparkle"); await anim(ring, [{ transform: T(b[0], b[1], "scale(.3)"), opacity: 1 }, { transform: T(b[0], b[1], "scale(5)"), opacity: 0 }], 800, "ease-out"); ring.remove();
      bits("dot", ...bodyVP(), 16, { c: ["#7be04a", "#fff3a8", "#ffd84d"], v: 3, up: 3, g: -.02, s: 3 }); hearts(...bodyVP(), 5);
      refreshPetLook();
    } else if (id === "sitter") {
      const b = toRoom(bodyVP()); const gr = prop("👵", [b[0] + 90, b[1] - 40], 58);
      for (let i = 0; i < 3; i++) { await anim(gr, [{ transform: T(b[0] + 90, b[1] - 40) }, { transform: T(b[0] + 70, b[1] - 50, "rotate(-12deg)") }, { transform: T(b[0] + 90, b[1] - 40) }], 300); hearts(...bodyVP(), 2); }
      await wait(400); gr.remove();
    } else { pcls("hop", 800); play("sparkle"); hearts(...bodyVP(), 6); await wait(700); }
  });
}
function refreshPetLook() { const s = petSvg(); if (!s || !PA.g) return; const keep = PA.el.className; PA.el.innerHTML = guineaSVG(PA.g, { size: 210, mood: mood(PA.g), cls: "idle" }); PA.el.className = keep; }

/* ---------- PETTING (swipe) and BOOPING (tap) ---------- */
let purrNodes = null;
function startPurr() {
  if (muted() || purrNodes) return; const a = getAC(); if (!a) return;
  const o = a.createOscillator(), lp = a.createBiquadFilter(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
  o.type = "sawtooth"; o.frequency.value = 55; lp.type = "lowpass"; lp.frequency.value = 260;
  lfo.frequency.value = 24; lg.gain.value = .05; g.gain.value = .0001; lfo.connect(lg).connect(g.gain);
  o.connect(lp).connect(g).connect(a.destination); o.start(); lfo.start();
  g.gain.setTargetAtTime(.06, a.currentTime, .1);
  purrNodes = { o, lfo, g, a };
}
function stopPurr() { if (!purrNodes) return; const { o, lfo, g, a } = purrNodes; purrNodes = null; try { g.gain.setTargetAtTime(.0001, a.currentTime, .08); o.stop(a.currentTime + .4); lfo.stop(a.currentTime + .4); } catch {} }
function setupPetting(live) {
  const el = PA.el; if (!el) return;
  let st = null;
  el.addEventListener("pointerdown", e => {
    if (PA.live !== live) return;
    getAC(); wake();
    try { el.setPointerCapture(e.pointerId); } catch {}
    st = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, petting: false, lx: e.clientX, ly: e.clientY, acc: 0, start: 0 };
  });
  el.addEventListener("pointermove", e => {
    if (!st) return;
    const d = Math.hypot(e.clientX - st.lx, e.clientY - st.ly); st.moved += d; st.lx = e.clientX; st.ly = e.clientY;
    if (!st.petting && st.moved > 14) {
      st.petting = true; st.start = performance.now(); PA.petting = true;
      pcls("petting"); startPurr(); say(pick(["Purrrrrr...", "Ooh yes. Right there.", "More pets. MORE.", "*happy rumble*", "You have the BEST hands."]));
      st.hand = prop("🤚", toRoom([e.clientX, e.clientY]), 46, "hand");
    }
    if (st.petting) {
      const [hx, hy] = toRoom([e.clientX, e.clientY]); st.hand.style.transform = T(hx, hy, `rotate(${(e.clientX - st.x) * .2}deg)`);
      const sv = petSvg(); if (sv) { const r = sv.getBoundingClientRect(); sv.style.setProperty("--tilt", clamp((e.clientX - (r.left + r.width / 2)) / r.width * 14, -8, 8) + "deg"); }
      st.acc += d;
      if (st.acc > 45) {
        st.acc = 0; hearts(e.clientX, e.clientY - 20, 1); haptic(4);
        const g = PA.g; g.joy = clamp(g.joy + .8, 0, 100); g.pets = (g.pets || 0) + 1; G.stats.pets = (G.stats.pets || 0) + 1; questProgress("pet");
        if (Math.random() < .08) bits("dot", e.clientX, e.clientY, 3, { c: [furColor(), "#fff"], v: 1, up: 1, g: -.02, s: 3, life: 50 });
        if (performance.now() - st.start > 3500 && !st.melted) { st.melted = true; pcls("melt"); say(pick(["*melts into a puddle of happy*", "I am... so... relaxed...", "This is my favourite thing EVER."])); play("heart"); }
        refreshStatBars(g); saveSoon(); tutMark("pet");
      }
    }
  });
  const end = e => {
    if (!st) return;
    const s = st; st = null;
    if (s.petting) {
      PA.petting = false; stopPurr(); if (s.hand) anim(s.hand, [{ opacity: 1 }, { opacity: 0 }], 250).then(() => s.hand.remove());
      puncls("petting", "melt"); const sv = petSvg(); if (sv) sv.style.removeProperty("--tilt");
      if (performance.now() - s.start > 1200) { floatText(...bodyVP(), pick(["♥ purrr", "*happy wheek*", "aaah ♥"]), "#e8458f", 20); play("wheek"); }
    } else if (e.type === "pointerup" && s.moved < 14) {
      boop(PA.g, PA.el, { clientX: s.x, clientY: s.y });
    }
  };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
}

/* ---------- IDLE LIFE ---------- */
function runIdle(force) {
  const g = PA.g, sleepy = g.pers === "sleepy", zoomy = g.pers === "zoomy" || g.pers === "dramatic";
  if (!force && (g.sick || mood(g) === "sad")) { if (Math.random() < .5) { pcls("look-" + pick(["l", "r"]), 1200); } return; }
  const k = weighted([{ k: "look", w: 24 }, { k: "ears", w: 12 }, { k: "sniff", w: 14 }, { k: "wander", w: 18 }, { k: "popcorn", w: zoomy ? 14 : 5 }, { k: "yawn", w: sleepy ? 12 : 5 }, { k: "nap", w: sleepy ? 9 : 2 }, { k: "groom", w: 9 }, { k: "zoomies", w: zoomy ? 5 : 1 }]).k;
  if (force) return runIdleK(force);
  runIdleK(k);
}
function runIdleK(k) {
  if (k === "look") pcls("look-" + pick(["l", "r"]), 1100);
  else if (k === "ears") pcls("earwiggle", 800);
  else if (k === "sniff") { pcls("sniff", 900); play("sniff"); }
  else if (k === "groom") { pcls("groom", 900); }
  else if (k === "yawn") { pcls("yawn", 1300); play("yawn"); }
  else if (k === "popcorn") { pcls("popcorn", 700); play("jump"); floatText(...bodyVP(), pick(["popcorn!", "wheee!", "boing!"]), "#ff9f43", 18); }
  else if (k === "wander") { PA.busy = true; const lim = roomRect().width * .26; walkTo(Math.round((Math.random() * 2 - 1) * lim)).then(() => PA.busy = false); }
  else if (k === "zoomies") { PA.busy = true; zoomies().then(() => PA.busy = false); }
  else if (k === "nap") {
    PA.napping = true; pcls("napping"); say(pick(["*snore* ...cucumbers... *snore*", "Zzzzz...", "*tiny snores*"]));
    const live = PA.live; let n = 0;
    const z = () => { if (PA.live !== live || !PA.napping) return; floatText(...partPt(".ear-r", .2), pick(["z", "Z", "z z"]), "#6a5490", 18 + (n % 3) * 4); if (++n < 7) setTimeout(z, 900); else wake(); };
    z();
  }
}
