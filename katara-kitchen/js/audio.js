// Tiny WebAudio synth: all sound effects and music are generated live,
// so there are no audio files to load.
import { state } from './state.js';

let ctx, master, musicBus, sfxBus, noiseBuf;
function ensure() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
  musicBus = ctx.createGain(); musicBus.gain.value = 0.32; musicBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.7; sfxBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}
export function unlock() { ensure(); }
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function tone(freq, t, dur, { type = 'triangle', vol = 0.3, bus, slide = 0, attack = 0.005 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus || sfxBus); o.start(t); o.stop(t + dur + 0.02);
}
function noise(t, dur, { vol = 0.2, freq = 2000, type = 'bandpass', bus, q = 1 } = {}) {
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus || sfxBus); s.start(t); s.stop(t + dur + 0.02);
}

const SFX = {
  tap: (t) => tone(880, t, 0.06, { type: 'sine', vol: 0.18 }),
  pop: (t) => { tone(500, t, 0.09, { type: 'sine', vol: 0.35, slide: 2.2 }); },
  correct: (t) => { [76, 79, 84].forEach((m, i) => tone(mtof(m), t + i * 0.07, 0.22, { type: 'triangle', vol: 0.3 })); tone(mtof(88), t + 0.21, 0.35, { type: 'sine', vol: 0.18 }); },
  wrong: (t) => { tone(220, t, 0.18, { type: 'square', vol: 0.12, slide: 0.7 }); tone(196, t + 0.15, 0.25, { type: 'square', vol: 0.1, slide: 0.6 }); },
  coin: (t) => { tone(mtof(88), t, 0.07, { type: 'square', vol: 0.12 }); tone(mtof(95), t + 0.06, 0.18, { type: 'square', vol: 0.12 }); },
  whoosh: (t) => noise(t, 0.3, { vol: 0.25, freq: 900, q: 0.7 }),
  sizzle: (t) => noise(t, 0.6, { vol: 0.16, freq: 5000, type: 'highpass' }),
  fire: (t) => { noise(t, 0.5, { vol: 0.3, freq: 300, type: 'lowpass' }); tone(120, t, 0.4, { type: 'sawtooth', vol: 0.08, slide: 0.5 }); },
  puff: (t) => noise(t, 0.25, { vol: 0.35, freq: 1500, q: 0.5 }),
  ding: (t) => { tone(mtof(96), t, 0.6, { type: 'sine', vol: 0.25 }); tone(mtof(103), t + 0.02, 0.5, { type: 'sine', vol: 0.12 }); },
  tick: (t) => tone(1500, t, 0.03, { type: 'square', vol: 0.06 }),
  tock: (t) => tone(1000, t, 0.03, { type: 'square', vol: 0.06 }),
  shake: (t) => { noise(t, 0.12, { vol: 0.3, freq: 700, q: 2 }); noise(t + 0.12, 0.12, { vol: 0.25, freq: 900, q: 2 }); },
  rip: (t) => noise(t, 0.35, { vol: 0.35, freq: 3000, q: 0.6 }),
  meow: (t) => { const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(600, t); o.frequency.linearRampToValueAtTime(950, t + 0.12); o.frequency.linearRampToValueAtTime(520, t + 0.38);
    f.type = 'bandpass'; f.frequency.setValueAtTime(1200, t); f.frequency.linearRampToValueAtTime(2200, t + 0.12); f.frequency.linearRampToValueAtTime(900, t + 0.38); f.Q.value = 3;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(f); f.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.45); },
  purr: (t) => { for (let i = 0; i < 6; i++) noise(t + i * 0.09, 0.07, { vol: 0.12, freq: 180, type: 'lowpass' }); },
  fanfare: (t) => { [72, 76, 79, 84, 79, 84, 88].forEach((m, i) => tone(mtof(m), t + i * 0.09, i === 6 ? 0.6 : 0.14, { type: 'square', vol: 0.11 })); },
  reveal: (t) => { [60, 64, 67, 72, 76, 79, 84, 88, 91, 96].forEach((m, i) => tone(mtof(m), t + i * 0.045, 0.3, { type: 'triangle', vol: 0.16 })); },
  rare: (t) => { [84, 88, 91, 96, 100, 103].forEach((m, i) => { tone(mtof(m), t + i * 0.08, 0.5, { type: 'sine', vol: 0.18 }); }); noise(t, 1.2, { vol: 0.08, freq: 8000, type: 'highpass' }); },
  buy: (t) => { [79, 84, 91].forEach((m, i) => tone(mtof(m), t + i * 0.06, 0.2, { type: 'square', vol: 0.1 })); },
  drum: (t) => { for (let i = 0; i < 16; i++) noise(t + i * 0.06, 0.05, { vol: 0.1 + i * 0.012, freq: 200, type: 'lowpass' }); },
  star: (t) => { tone(mtof(91), t, 0.3, { type: 'triangle', vol: 0.22 }); tone(mtof(98), t + 0.08, 0.4, { type: 'sine', vol: 0.15 }); },
  order: (t) => { tone(mtof(84), t, 0.1, { type: 'sine', vol: 0.2 }); tone(mtof(91), t + 0.1, 0.18, { type: 'sine', vol: 0.2 }); },
  bell: (t) => { tone(mtof(93), t, 0.9, { type: 'sine', vol: 0.3 }); tone(mtof(105), t, 0.6, { type: 'sine', vol: 0.08 }); },
};

export function sfx(name) {
  if (!state.settings.sound) return;
  if (!ensure()) return;
  try { SFX[name] && SFX[name](ctx.currentTime + 0.005); } catch { }
}

/* ---------------- music sequencer ---------------- */
const _ = null;
const TRACKS = {
  kitchen: { bpm: 112, lead: [
    76, _, 79, _, 81, _, 79, 76, _, _, 74, _, 76, _, _, _, 72, _, 74, _, 76, _, 79, _, 77, _, 76, _, 74, _, _, _,
    76, _, 79, _, 84, _, 83, 81, _, _, 79, _, 81, _, _, _, 79, _, 77, _, 76, _, 74, _, 72, _, _, _, _, _, _, _],
    bass: [48, _, _, _, 55, _, _, _, 53, _, _, _, 60, _, _, _, 45, _, _, _, 52, _, _, _, 43, _, _, _, 50, _, _, _,
      48, _, _, _, 55, _, _, _, 53, _, _, _, 57, _, _, _, 55, _, _, _, 50, _, _, _, 48, _, _, _, 55, _, _, _], hat: 2, kick: 8, leadType: 'triangle' },
  rush: { bpm: 150, lead: [
    72, _, 76, _, 79, _, 76, _, 77, _, 81, _, 79, _, 76, _, 74, _, 77, _, 81, _, 77, _, 79, 77, 76, 74, 72, _, _, _,
    72, _, 76, _, 79, _, 84, _, 81, _, 79, _, 77, _, 76, _, 74, _, 76, 77, 79, _, 74, _, 72, _, _, _, 79, _, _, _],
    bass: [48, _, 60, _, 48, _, 60, _, 53, _, 65, _, 53, _, 65, _, 50, _, 62, _, 50, _, 62, _, 55, _, 67, _, 55, _, 67, _,
      48, _, 60, _, 48, _, 60, _, 53, _, 65, _, 53, _, 65, _, 55, _, 67, _, 55, _, 67, _, 48, _, 60, _, 55, _, 43, _], hat: 2, kick: 4, leadType: 'square' },
  quiz: { bpm: 126, lead: [
    69, _, 72, _, 76, _, 72, _, 69, _, 72, _, 76, _, 72, _, 67, _, 71, _, 74, _, 71, _, 67, _, 71, _, 74, _, 71, _,
    65, _, 69, _, 72, _, 69, _, 65, _, 69, _, 72, _, 69, _, 64, _, 68, _, 71, _, 74, _, 76, _, 74, _, 71, _, 68, _],
    bass: [45, _, _, _, 45, _, _, _, 45, _, _, _, 45, _, _, _, 43, _, _, _, 43, _, _, _, 43, _, _, _, 43, _, _, _,
      41, _, _, _, 41, _, _, _, 41, _, _, _, 41, _, _, _, 40, _, _, _, 40, _, _, _, 40, _, _, _, 40, _, _, _], hat: 1, kick: 4, leadType: 'triangle' },
  podium: { bpm: 120, lead: [
    72, _, 72, 74, 76, _, 72, _, 77, _, 76, _, 74, _, _, _, 74, _, 74, 76, 77, _, 74, _, 79, _, 77, _, 76, _, _, _,
    84, _, 81, _, 79, _, 76, _, 77, _, 79, _, 81, _, _, _, 79, _, 77, _, 76, _, 74, _, 72, _, _, _, _, _, _, _],
    bass: [48, _, _, _, 52, _, _, _, 53, _, _, _, 55, _, _, _, 50, _, _, _, 53, _, _, _, 55, _, _, _, 48, _, _, _,
      45, _, _, _, 48, _, _, _, 53, _, _, _, 55, _, _, _, 55, _, _, _, 55, _, _, _, 48, _, _, _, 48, _, _, _], hat: 2, kick: 8, leadType: 'square' },
};

let cur = null, wanted = null, timer = null, step = 0, nextT = 0, tempo = 1;
export function music(name) {
  wanted = name;
  if (cur === name) return;
  stopMusic(); cur = name;
  if (!name || !state.settings.music) return;
  if (!ensure()) return;
  step = 0; nextT = ctx.currentTime + 0.08; tempo = 1;
  timer = setInterval(schedule, 25);
}
export function setTempo(x) { tempo = x; }
export function stopMusic() { clearInterval(timer); timer = null; cur = null; }
export function refreshMusic() { const n = wanted; stopMusic(); if (n) music(n); }
export const currentMusic = () => cur;
function schedule() {
  const tr = TRACKS[cur]; if (!tr || !ctx) return;
  const sp = 60 / (tr.bpm * tempo) / 4;
  while (nextT < ctx.currentTime + 0.12) {
    const i = step % tr.lead.length;
    const l = tr.lead[i], b = tr.bass[i % tr.bass.length];
    if (l) tone(mtof(l), nextT, sp * 1.8, { type: tr.leadType, vol: tr.leadType === 'square' ? 0.07 : 0.16, bus: musicBus });
    if (b) tone(mtof(b), nextT, sp * 3, { type: 'triangle', vol: 0.22, bus: musicBus });
    if (i % tr.hat === 0) noise(nextT, 0.03, { vol: i % 4 === 2 ? 0.07 : 0.035, freq: 9000, type: 'highpass', bus: musicBus });
    if (i % tr.kick === 0) tone(110, nextT, 0.12, { type: 'sine', vol: 0.35, slide: 0.4, bus: musicBus });
    nextT += sp; step++;
  }
}
