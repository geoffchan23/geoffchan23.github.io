/* Wheek World core: helpers, save, sound, particles, UI primitives. */
"use strict";

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const HOUR = 3600e3, DAY = 24 * HOUR, MIN = 60e3;
const now = () => Date.now();
function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function weighted(list, rnd = Math.random) { const tot = list.reduce((s, x) => s + x.w, 0); let r = rnd() * tot; for (const x of list) { if ((r -= x.w) < 0) return x; } return list[list.length - 1]; }
const fmt = n => Math.round(n).toLocaleString("en-US");
function dur(ms) {
  ms = Math.max(0, ms); const m = Math.ceil(ms / MIN);
  if (m < 60) return m + "m"; const h = Math.floor(m / 60); if (h < 24) return h + "h " + (m % 60 ? (m % 60) + "m" : "");
  const d = Math.floor(h / 24); return d + "d " + (h % 24) + "h";
}
const uid = () => Math.random().toString(36).slice(2, 9) + now().toString(36).slice(-3);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COIN = `<svg class="coin-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#ffd84d" stroke="#2b1640" stroke-width="2.2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#e0a800" stroke-width="1.6"/><path d="M9.5 10.5c0-1.4 5-1.4 5 0v3c0 1.4-5 1.4-5 0" fill="#ffb3c7" stroke="#2b1640" stroke-width="1.3"/><path d="M8 8l1.5 1.5M16 8l-1.5 1.5" stroke="#2b1640" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const coinTxt = n => `${COIN}<b>${fmt(n)}</b>`;

/* ---------- save ---------- */
const SAVE_KEY = "wheek-world-save-v1";
let G = null;
let saveT = 0;
function loadSave() { try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
function save() { clearTimeout(saveT); try { G.savedAt = now(); localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) { console.warn("save failed", e); } }
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(save, 500); }
addEventListener("pagehide", () => G && save());
document.addEventListener("visibilitychange", () => { if (document.hidden && G) save(); });

/* ---------- sound ---------- */
let AC = null, noiseBuf = null;
function getAC() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); return AC; } catch { return null; } }
const muted = () => G && G.settings && G.settings.muted;
function tone(freq, start, d, type = "sine", vol = .15, to) {
  if (muted()) return; const a = getAC(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + start;
  o.type = type; o.frequency.setValueAtTime(freq, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d * .8);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .05);
}
function noise(d, type, f0, f1, vol, start = 0) {
  if (muted()) return; const a = getAC(); if (!a) return;
  if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
  const t = a.currentTime + start, src = a.createBufferSource(); src.buffer = noiseBuf;
  const f = a.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + d); f.Q.value = 2;
  const g = a.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + d + .05);
}
const sfx = {
  coin() { tone(988, 0, .08, "square", .06); tone(1319, .07, .22, "square", .06); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .09, .28, "triangle", .14)); },
  bigwin() { [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(f, i * .075, .4, "square", .06)); [0, .3, .6].forEach(s => noise(.25, "highpass", 6000, 3000, .08, s)); },
  lose() { tone(330, 0, .25, "sawtooth", .07, 250); tone(250, .22, .5, "sawtooth", .07, 110); },
  pop() { noise(.12, "highpass", 1800, 700, .5); tone(700, 0, .12, "sine", .2, 150); },
  boop() { const f = 700 + Math.random() * 500; tone(f, 0, .12, "sine", .15, f * 1.7); },
  squish() { tone(500, 0, .22, "sine", .18, 140); },
  click() { tone(1100, 0, .04, "square", .04, 900); },
  tick() { tone(1900, 0, .025, "square", .035); },
  whoosh() { noise(.35, "bandpass", 400, 2400, .25); },
  wheek() { [0, .17, .34].forEach((s, i) => tone(950 + i * 80, s, .15, "sine", .13, 2000 + i * 150)); },
  jump() { tone(380, 0, .16, "square", .07, 900); },
  hit() { tone(220, 0, .2, "square", .1, 70); noise(.1, "lowpass", 1200, 200, .3); },
  splat() { noise(.2, "lowpass", 1500, 180, .45); tone(170, 0, .16, "sine", .15, 80); },
  drum() { [0, .09, .18, .27, .36, .45, .54].forEach((s, i) => { tone(110, s, .07, "triangle", .2); if (i % 2) noise(.05, "highpass", 3000, 2000, .1, s); }); },
  fanfare() { [[523, 0], [523, .14], [523, .28], [698, .42], [880, .62], [1047, .8]].forEach(([f, s]) => tone(f, s, .3, "square", .06)); },
  nom() { [0, .16, .32, .48].forEach(s => noise(.08, "lowpass", 900, 300, .35, s)); },
  crunch() { [0, .13, .26, .39].forEach(s => noise(.06, "highpass", 3500, 1800, .3, s)); },
  sparkle() { [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, i * .05, .25, "sine", .06)); },
  buzz() { tone(110, 0, .3, "square", .09, 90); },
  sneeze() { tone(480, 0, .45, "sine", .1, 950); noise(.28, "bandpass", 2800, 1100, .5, .45); },
  giggle() { [0, 1, 2, 3, 4, 5].forEach(i => tone(i % 2 ? 1500 : 1200, i * .07, .06, "sine", .12)); },
  squelch() { noise(.2, "lowpass", 1500, 180, .45); tone(170, 0, .16, "sine", .15, 80); },
  stretch() { tone(120, 0, .35, "sawtooth", .05, 260); },
  thwop() { tone(220, 0, .25, "sine", .2, 60); noise(.15, "lowpass", 900, 150, .3); },
  unlock() { [660, 880, 1320].forEach((f, i) => tone(f, i * .1, .3, "triangle", .12)); },
  open() { noise(.3, "bandpass", 800, 3000, .3); [784, 988, 1319, 1568].forEach((f, i) => tone(f, .2 + i * .06, .3, "triangle", .1)); },
  shake() { [0, .08, .16, .24].forEach(s => noise(.06, "bandpass", 600, 900, .25, s)); },
  heart() { tone(660, 0, .15, "sine", .12, 990); tone(880, .12, .25, "sine", .12, 1320); },
  levelup() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * .1, .35, "triangle", .13)); },
  sad() { [440, 415, 392, 370].forEach((f, i) => tone(f, i * .35, .5, "sine", .08)); },
  burp() { tone(95, 0, .45, "sawtooth", .12, 65); },
  squeak() { const f = 900 + Math.random() * 500; tone(f, 0, .16, "square", .06, f * 1.6); tone(f * 1.3, .1, .12, "sine", .08, f); },
  gulp() { tone(260, 0, .18, "sine", .2, 120); noise(.08, "lowpass", 700, 200, .25, .08); },
  splash() { noise(.45, "bandpass", 1800, 500, .35); [0, .08, .16].forEach(s => tone(600 + Math.random() * 600, s, .08, "sine", .05, 1600)); },
  scrub() { [0, .12, .24, .36].forEach(s => noise(.09, "highpass", 4000, 2500, .18, s)); },
  sniff() { [0, .1, .2].forEach(s => noise(.05, "bandpass", 2600, 1800, .12, s)); },
  yawn() { tone(520, 0, .8, "sine", .08, 260); },
  zoom() { tone(300, 0, .5, "square", .04, 1400); },
  chomp() { const f = 2400 + Math.random() * 1600; noise(.05, "highpass", f, f * .6, .3); },
  munch() { noise(.07, "lowpass", 800 + Math.random() * 500, 250, .35); },
  fart() {
    if (muted()) return; const a = getAC(); if (!a) return;
    const t = a.currentTime, d = .35 + Math.random() * .65, base = 55 + Math.random() * 70;
    const o = a.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(base * 1.5, t); o.frequency.exponentialRampToValueAtTime(base * .6, t + d);
    const lfo = a.createOscillator(); lfo.frequency.value = 14 + Math.random() * 26;
    const lg = a.createGain(); lg.gain.value = base * .45; lfo.connect(lg).connect(o.frequency);
    const trem = a.createGain(); trem.gain.value = 0; const tg = a.createGain(); tg.gain.value = .5; lfo.connect(tg).connect(trem.gain);
    const f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 500 + Math.random() * 500; f.Q.value = 6;
    const g = a.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .03); g.gain.setValueAtTime(.5, t + d * .7); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(f).connect(trem).connect(g).connect(a.destination); o.start(t); lfo.start(t); o.stop(t + d + .05); lfo.stop(t + d + .05);
  },
};
function play(name) { try { (sfx[name] || sfx.click)(); } catch {} }
const haptic = ms => { try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch {} };

/* ---------- particles (overlay canvas) ---------- */
const FX = { cv: null, ctx: null, bits: [], on: false };
function initFx() {
  FX.cv = document.getElementById("fx"); FX.ctx = FX.cv.getContext("2d");
  const size = () => { const d = devicePixelRatio || 1; FX.cv.width = innerWidth * d; FX.cv.height = innerHeight * d; FX.ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener("resize", size);
}
const GOO = ["#7be04a", "#ff8fc7", "#c7b3ff", "#ffd84d", "#5fd3ff", "#ff9f43"];
function runFx() { if (!FX.on) { FX.on = true; requestAnimationFrame(stepFx); } }
function confetti(x, y, n = 60, stars = true) {
  if (reduceMotion) n = Math.min(n, 12);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 8;
    FX.bits.push({ k: stars && Math.random() < .28 ? "star" : "goo", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, g: .3, life: 70 + Math.random() * 40, c: pick(GOO), s: 5 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - .5) * .3 });
  }
  runFx();
}
function gas(x, y, n = 16) {
  for (let i = 0; i < (reduceMotion ? 5 : n); i++) FX.bits.push({ k: "gas", x: x + (Math.random() - .5) * 30, y, vx: (Math.random() - .5) * 2.4, vy: -.6 - Math.random() * 1.4, g: 0, life: 70 + Math.random() * 40, s: 8 + Math.random() * 10, grow: .5 + Math.random() * .5, rot: 0, vr: 0 });
  runFx();
}
function hearts(x, y, n = 6) {
  for (let i = 0; i < n; i++) FX.bits.push({ k: "heart", x: x + (Math.random() - .5) * 40, y, vx: (Math.random() - .5) * 2, vy: -1.5 - Math.random() * 2, g: -.01, life: 60 + Math.random() * 30, s: 8 + Math.random() * 6, rot: (Math.random() - .5) * .5, vr: 0, c: pick(["#ff5fa8", "#ff8fc7", "#ff3d7f"]) });
  runFx();
}
function coinRain(x, y, n = 14) {
  const pill = document.getElementById("coinPill");
  const r = pill ? pill.getBoundingClientRect() : { left: innerWidth - 60, top: 10, width: 40, height: 30 };
  const tx = r.left + 18, ty = r.top + r.height / 2;
  for (let i = 0; i < Math.min(n, 30); i++) FX.bits.push({ k: "coin", x: x + (Math.random() - .5) * 30, y: y + (Math.random() - .5) * 30, vx: (Math.random() - .5) * 9, vy: -4 - Math.random() * 5, g: .25, life: 999, t: 0, delay: 18 + i * 2, tx, ty, s: 9, rot: 0, vr: 0 });
  runFx();
}
/* small physical bits: crumbs, water drops, fur fluff, wood chips, sparkles */
function bits(kind, x, y, n, opts = {}) {
  if (reduceMotion) n = Math.min(n, 4);
  const cols = [].concat(opts.c || "#fff");
  for (let i = 0; i < n; i++) {
    const a = opts.dir != null ? opts.dir + (Math.random() - .5) * (opts.spread || 1.4) : Math.random() * Math.PI * 2, v = (opts.v || 3) * (.5 + Math.random());
    FX.bits.push({ k: opts.sq ? "sq" : "dot", ring: opts.ring, x: x + (Math.random() - .5) * (opts.w || 10), y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opts.up || 2), g: opts.g ?? .25, life: opts.life || 40 + Math.random() * 20, c: pick(cols), s: (opts.s || 3) * (.6 + Math.random() * .8), rot: Math.random() * 3, vr: (Math.random() - .5) * .3 });
  }
  runFx();
}
function starPath(c, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, a = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); }
function heartPath(c, s) { c.beginPath(); c.moveTo(0, s * .35); c.bezierCurveTo(-s, -s * .3, -s * .5, -s, 0, -s * .45); c.bezierCurveTo(s * .5, -s, s, -s * .3, 0, s * .35); c.closePath(); }
function stepFx() {
  const c = FX.ctx; c.clearRect(0, 0, innerWidth, innerHeight);
  FX.bits = FX.bits.filter(b => b.life > 0);
  let pinged = false;
  for (const b of FX.bits) {
    if (b.k === "coin") {
      b.t++;
      if (b.t < b.delay) { b.vy += b.g; b.vx *= .96; b.x += b.vx; b.y += b.vy; }
      else { b.x += (b.tx - b.x) * .2; b.y += (b.ty - b.y) * .2; if (Math.hypot(b.tx - b.x, b.ty - b.y) < 8) { b.life = 0; if (!pinged) { pinged = true; bumpCoins(); } continue; } }
      c.save(); c.translate(b.x, b.y); c.scale(Math.abs(Math.cos(b.t / 5)) * .8 + .2, 1);
      c.fillStyle = "#ffd84d"; c.strokeStyle = "#2b1640"; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, b.s, 0, 6.29); c.fill(); c.stroke();
      c.strokeStyle = "#e0a800"; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, b.s * .6, 0, 6.29); c.stroke(); c.restore();
      continue;
    }
    b.vy += b.g; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.life--;
    c.save(); c.translate(b.x, b.y); c.rotate(b.rot);
    if (b.k === "gas") {
      b.s += b.grow; c.globalAlpha = Math.min(.55, b.life / 90);
      c.fillStyle = "#9bdc52"; c.beginPath(); c.arc(0, 0, b.s, 0, 6.29); c.fill();
      c.fillStyle = "#c8f08e"; c.beginPath(); c.arc(-b.s * .3, -b.s * .3, b.s * .45, 0, 6.29); c.fill();
    } else if (b.k === "dot" || b.k === "sq") {
      c.globalAlpha = Math.min(1, b.life / 25); c.fillStyle = b.c; c.strokeStyle = "rgba(43,22,64,.55)"; c.lineWidth = 1.2;
      if (b.k === "dot") { c.beginPath(); c.arc(0, 0, b.s, 0, 6.29); c.fill(); if (b.ring) c.stroke(); }
      else { c.fillRect(-b.s / 2, -b.s / 2, b.s, b.s); c.strokeRect(-b.s / 2, -b.s / 2, b.s, b.s); }
    } else if (b.k === "heart") {
      c.globalAlpha = Math.min(1, b.life / 30); c.fillStyle = b.c; c.strokeStyle = "#2b1640"; c.lineWidth = 2; heartPath(c, b.s); c.fill(); c.stroke();
    } else {
      c.globalAlpha = Math.min(1, b.life / 30); c.lineWidth = 2.5; c.strokeStyle = "#2b1640";
      if (b.k === "star") { c.fillStyle = "#ffd84d"; starPath(c, b.s * 1.1); c.fill(); c.stroke(); }
      else { c.fillStyle = b.c; c.beginPath(); c.ellipse(0, 0, b.s, b.s * .78, 0, 0, 6.29); c.fill(); c.stroke(); c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.arc(-b.s * .35, -b.s * .25, b.s * .22, 0, 6.29); c.fill(); }
    }
    c.restore();
  }
  if (FX.bits.length) requestAnimationFrame(stepFx); else { FX.on = false; c.clearRect(0, 0, innerWidth, innerHeight); }
}
function centerOf(el) { if (!el) return [innerWidth / 2, innerHeight / 2]; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

/* ---------- floating text, toasts ---------- */
function floatText(x, y, text, color = "#ff5fa8", size = 22) {
  const d = document.createElement("div"); d.className = "floater"; d.textContent = text;
  d.style.left = clamp(x, 60, innerWidth - 60) + "px"; d.style.top = y + "px"; d.style.color = color; d.style.fontSize = size + "px";
  d.style.setProperty("--dx", ((Math.random() - .5) * 60) + "px");
  document.body.appendChild(d); setTimeout(() => d.remove(), 1200);
}
const toastQ = []; let toastOn = false;
function toast(text, icon = "✨") { toastQ.push([text, icon]); if (!toastOn) nextToast(); }
function nextToast() {
  const t = toastQ.shift(); if (!t) { toastOn = false; return; } toastOn = true;
  let el = document.getElementById("toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.innerHTML = `<span class="ti">${t[1]}</span><span>${esc(t[0])}</span>`; el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
  setTimeout(() => { el.classList.remove("show"); setTimeout(nextToast, 250); }, 2600);
}

/* ---------- coins & xp ---------- */
let shownCoins = 0, coinAnim = 0;
function renderCoins() {
  const el = document.getElementById("coinNum"); if (!el) return;
  cancelAnimationFrame(coinAnim);
  const from = shownCoins, to = G.coins, t0 = performance.now();
  const step = t => { const k = Math.min(1, (t - t0) / 600); shownCoins = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = fmt(shownCoins); if (k < 1) coinAnim = requestAnimationFrame(step); };
  coinAnim = requestAnimationFrame(step);
}
function bumpCoins() { const p = document.getElementById("coinPill"); if (p) { p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); } play("coin"); }
function addCoins(n, from, reason) {
  n = Math.round(n); if (!n) return 0;
  G.coins = Math.max(0, G.coins + n);
  if (n > 0) { G.stats.earned = (G.stats.earned || 0) + n; G.daily.earned = (G.daily.earned || 0) + n; questProgress("earn", n); }
  if (n > 0 && from) { const [x, y] = Array.isArray(from) ? from : centerOf(from); coinRain(x, y, Math.min(24, 4 + Math.floor(n / 10))); floatText(x, y - 20, "+" + fmt(n), "#e0a800", 26); }
  renderCoins(); saveSoon(); checkAchievements();
  return n;
}
function spendCoins(n) { if (G.coins < n) { play("buzz"); toast("Not enough coins! Play games to earn more.", "🪙"); return false; } G.coins -= n; G.stats.spent = (G.stats.spent || 0) + n; renderCoins(); saveSoon(); return true; }
const xpFor = lv => 60 + (lv - 1) * 45;
function addXP(n) {
  G.xp += n;
  while (G.xp >= xpFor(G.level)) { G.xp -= xpFor(G.level); G.level++; queueEvent({ type: "level", level: G.level }); }
  renderTop(); saveSoon();
}

/* ---------- modal ---------- */
const modalStack = [];
function openModal(html, opts = {}) {
  const root = document.getElementById("modals");
  const wrap = document.createElement("div"); wrap.className = "modal-wrap" + (opts.cls ? " " + opts.cls : "");
  wrap.innerHTML = `<div class="modal card" role="dialog" aria-modal="true">${opts.noClose ? "" : `<button class="modal-x" aria-label="Close">✕</button>`}${html}</div>`;
  root.appendChild(wrap); modalStack.push(wrap);
  const close = () => closeModal(wrap, opts.onClose);
  wrap._close = close; wrap._sticky = !!(opts.sticky || opts.noClose);
  const x = $(".modal-x", wrap); if (x) x.onclick = () => { play("click"); close(); };
  if (!opts.noClose && !opts.sticky) wrap.addEventListener("pointerdown", e => { if (e.target === wrap) close(); });
  requestAnimationFrame(() => wrap.classList.add("in"));
  return { el: $(".modal", wrap), close };
}
function closeModal(wrap, cb) {
  if (!wrap || wrap._closing) return; wrap._closing = true;
  wrap.classList.remove("in"); wrap.classList.add("out");
  const i = modalStack.indexOf(wrap); if (i >= 0) modalStack.splice(i, 1);
  setTimeout(() => { wrap.remove(); if (cb) cb(); pumpEvents(); }, 220);
}
function closeTopModal() { const w = modalStack[modalStack.length - 1]; if (w && w._close && !w._sticky) { w._close(); return true; } return false; }
function confirmBox(title, text, yes = "Yes", no = "No") {
  return new Promise(res => {
    const m = openModal(`<h2>${title}</h2><p class="mtext">${text}</p><div class="mrow"><button class="btn white" data-no>${no}</button><button class="btn green" data-yes>${yes}</button></div>`, { onClose: () => res(false) });
    $("[data-yes]", m.el).onclick = () => { play("click"); res(true); m.close(); };
    $("[data-no]", m.el).onclick = () => { play("click"); m.close(); };
  });
}
function promptBox(title, value, max = 20) {
  return new Promise(res => {
    let done = false;
    const m = openModal(`<h2>${title}</h2><input class="text-in" maxlength="${max}" value="${esc(value)}"><div class="mrow"><button class="btn white" data-no>Cancel</button><button class="btn green" data-yes>OK</button></div>`, { onClose: () => { if (!done) res(null); } });
    const inp = $("input", m.el); setTimeout(() => inp.focus(), 250);
    const ok = () => { done = true; res(inp.value.trim()); m.close(); };
    $("[data-yes]", m.el).onclick = ok; inp.onkeydown = e => { if (e.key === "Enter") ok(); };
    $("[data-no]", m.el).onclick = () => m.close();
  });
}

/* ---------- event queue: births, deaths, level ups, packages shown one at a time ---------- */
const EVQ = [];
let evBusy = false;
function queueEvent(e) { EVQ.push(e); setTimeout(pumpEvents, 50); }
function pumpEvents() {
  if (evBusy || modalStack.length || !EVQ.length || ROUTE.inGame) return;
  const e = EVQ.shift(); evBusy = true;
  const done = () => { evBusy = false; setTimeout(pumpEvents, 120); };
  try { (EVENT_VIEWS[e.type] || (() => done()))(e, done); } catch (err) { console.error(err); done(); }
}
const EVENT_VIEWS = {};
