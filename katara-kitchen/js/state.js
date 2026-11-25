import { DEFAULT_DECOR } from './kitchen-art.js';

const KEY = 'mochi-mini-kitchen-v1';
const fresh = () => ({
  v: 1, coins: 120, tokens: 1, decor: { ...DEFAULT_DECOR },
  owned: Object.fromEntries(Object.entries(DEFAULT_DECOR).map(([k, v]) => [k, [v]])),
  minis: {}, stars: {}, best: {}, mastery: {}, pity: 0,
  settings: { sound: true, music: true, calm: false },
  stats: { orders: 0, bakeoffs: 0, wins: 0, boxes: 0, correct: 0, answered: 0 },
  onboarded: false, lastDaily: '',
});

let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch { S = fresh(); }
// forward-fill any missing fields from older saves
S = { ...fresh(), ...S, settings: { ...fresh().settings, ...(S.settings || {}) }, stats: { ...fresh().stats, ...(S.stats || {}) } };
for (const k of Object.keys(DEFAULT_DECOR)) { if (!S.owned[k]) S.owned[k] = [DEFAULT_DECOR[k]]; if (!S.decor[k]) S.decor[k] = DEFAULT_DECOR[k]; }

const listeners = new Set();
export const state = S;
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode etc. */ }
  listeners.forEach(fn => fn(S));
}
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function addCoins(n) { S.coins = Math.max(0, S.coins + Math.round(n)); save(); }
export function spend(n) { if (S.coins < n) return false; S.coins -= n; save(); return true; }

export function record(termId, correct) {
  if (!termId) return;
  const m = S.mastery[termId] || (S.mastery[termId] = { r: 0, w: 0, s: 0, seen: 0 });
  m.seen++;
  if (correct) { m.r++; m.s++; } else { m.w++; m.s = 0; }
  S.stats.answered++; if (correct) S.stats.correct++;
  save();
}
// 0..3 hearts of mastery
export function masteryLevel(termId) {
  const m = S.mastery[termId];
  if (!m) return 0;
  if (m.s >= 4) return 3;
  if (m.s >= 2) return 2;
  if (m.r >= 1) return 1;
  return 0;
}
export function resetAll() { try { localStorage.removeItem(KEY); } catch { } location.reload(); }
export const today = () => new Date().toISOString().slice(0, 10);
