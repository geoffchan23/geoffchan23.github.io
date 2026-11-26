import { TERMS, T, qd, SCENARIOS, CUSTOM, TRUEFALSE, SORT_ITEMS, CHAINS } from './content.js';
import { state } from './state.js';

export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = (a) => a[Math.floor(Math.random() * a.length)];

// Higher weight = needs more practice
function weight(id) {
  const m = state.mastery[id];
  if (!m) return 2.2;
  return Math.max(0.35, 1.2 + m.w * 0.9 - m.s * 0.45);
}
function weightedPick(items, keyFn) {
  const ws = items.map(it => weight(keyFn(it)));
  let r = Math.random() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

// Distractor terms: prefer same group, never the "same as" twin
export function distractors(id, n, avoid = []) {
  const t = T[id];
  const bad = new Set([id, t.same, ...avoid, ...avoid.map(a => T[a] && T[a].same)].filter(Boolean));
  const same = shuffle(TERMS.filter(x => x.group === t.group && !bad.has(x.id)));
  const other = shuffle(TERMS.filter(x => x.group !== t.group && !bad.has(x.id)));
  return [...same.slice(0, Math.ceil(n * .67)), ...other].slice(0, n);
}

const mc = (prompt, correctLabel, wrongLabels, termId, extra = {}) => ({
  kind: 'mc', prompt, termId,
  options: shuffle([{ label: correctLabel, correct: true }, ...wrongLabels.map(l => ({ label: l, correct: false }))]),
  ...extra,
});

export function defToTerm(id, nOpts = 4, avoid = []) {
  const t = T[id];
  return mc(qd(id), t.term, distractors(id, nOpts - 1, avoid).map(x => x.term), id, { style: 'def' });
}
export function termToDef(id, nOpts = 3, avoid = []) {
  const t = T[id];
  return mc(`What does "${t.term}" mean?`, qd(id), distractors(id, nOpts - 1, avoid).map(x => qd(x.id)), id, { style: 'longopts' });
}
export function scenario(s, nOpts = 4, avoid = []) {
  const opts = s.opts ? s.opts.filter(o => o !== s.a) : distractors(s.a, nOpts - 1, avoid).map(x => x.id);
  return mc(s.q, T[s.a].term, opts.map(o => T[o].term), s.a, { style: 'scenario' });
}
export function custom(c) { return mc(c.q, c.a, c.w, c.t, { style: 'custom' }); }
export function trueFalse(tf) {
  return { kind: 'mc', tf: true, prompt: tf.q, termId: tf.t, options: [{ label: 'True', correct: tf.a }, { label: 'False', correct: !tf.a }] };
}

// Build a question from a pool of term ids, mixing styles.
export function makeQuestion(termIds, { allowLong = false, nOpts = 4, recent = [] } = {}) {
  const pool = termIds.filter(id => !recent.includes(id));
  const usable = pool.length ? pool : termIds;
  const id = weightedPick(usable, x => x);
  const scen = SCENARIOS.filter(s => s.a === id);
  const cus = CUSTOM.filter(c => c.t === id);
  const tfs = TRUEFALSE.filter(c => c.t === id);
  const roll = Math.random();
  if (roll < 0.38) return defToTerm(id, nOpts);
  if (roll < 0.68 && scen.length) return scenario(pick(scen), nOpts);
  if (roll < 0.8 && cus.length) return custom(pick(cus));
  if (roll < 0.92 && tfs.length) return trueFalse(pick(tfs));
  if (allowLong) return termToDef(id, 3);
  return defToTerm(id, nOpts);
}

export function sortRound(n = 5) {
  const bio = shuffle(SORT_ITEMS.filter(i => i.biotic)), abio = shuffle(SORT_ITEMS.filter(i => !i.biotic));
  const k = Math.random() < .5 ? Math.floor(n / 2) : Math.ceil(n / 2);
  return { kind: 'sort', termId: 'biotic', items: shuffle([...bio.slice(0, k), ...abio.slice(0, n - k)]) };
}
export function stackRound() {
  return { kind: 'stack', termId: 'producer', chain: pick(CHAINS) };
}
