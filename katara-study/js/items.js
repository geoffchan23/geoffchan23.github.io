// Question bank + generators + grading for Katara's Test Prep.
// Mirrors the real test: multiple choice, short answer, matching, true/false.
import { TERMS, T, SCENARIOS, CUSTOM, TRUEFALSE } from '../../katara-kitchen/js/content.js';
import { defToTerm, termToDef, scenario, custom, shuffle, pick } from '../../katara-kitchen/js/questions.js';
import { state } from '../../katara-kitchen/js/state.js';

export const SECTIONS = [
  { key: 'mc', name: 'Multiple Choice', short: 'MC', n: 4, color: '#ff8fb1' },
  { key: 'sa', name: 'Short Answer', short: 'SA', n: 5, color: '#8ec9ff' },
  { key: 'match', name: 'Matching', short: 'Match', n: 8, color: '#7fd8be' },
  { key: 'tf', name: 'True or False', short: 'T/F', n: 4, color: '#ffd24d' },
];

/* ------------------------------------------------------------------ */
/* Extra content for short answer                                      */
/* ------------------------------------------------------------------ */
// Alternate accepted spellings / names when she types a term
const ALIASES = {
  apex: ['apex predator', 'tertiary consumer', 'apex'],
  tertiary: ['tertiary consumer', 'apex predator', 'tertiary'],
  producer: ['producers', 'producer', 'plants'],
  thermo: ['first law of thermodynamics', '1st law of thermodynamics', 'law of thermodynamics', 'first law'],
  matter: ['matter cycling', 'biogeochemical cycling', 'matter cycle'],
  decomposer: ['decomposer', 'decomposers'],
  organic: ['organic farming', 'organic'],
  traditional: ['traditional farming', 'traditional'],
  limiting: ['limiting factor', 'limiting factors'],
};

export const EXPLAIN = [
  { q: 'Which is better for the environment: monoculture or polyculture? Explain why.', t: 'poly',
    model: 'Polyculture is better. Growing many different types of crops together creates a healthier and stronger environment. Monoculture only grows one type of crop.',
    keys: [['polyculture', 'poly'], ['many', 'different', 'variety', 'lots', 'more than one'], ['healthier', 'healthy', 'stronger', 'strong', 'biodiversity', 'better']], need: 3 },
  { q: 'Which is better for nature: organic farming or traditional farming? Explain why.', t: 'organic',
    model: 'Organic farming is better for nature because it grows food without man-made chemicals and keeps nature healthy. Traditional farming uses machines, fertilizers and chemicals.',
    keys: [['organic'], ['chemical', 'pesticide', 'spray', 'fertilizer'], ['healthy', 'nature', 'environment', 'safe']], need: 3 },
  { q: 'What is the difference between primary succession and secondary succession?', t: 'ssucc',
    model: 'Primary succession is when a new species replaces older species over a period of time. Secondary succession is when living things reestablish an ecosystem after some type of devastation (like a fire or flood).',
    keys: [['replace', 'new species', 'take over'], ['devastation', 'disaster', 'fire', 'flood', 'destroy', 'damage'], ['reestablish', 'come back', 'comes back', 'regrow', 'grow back', 'rebuild', 'return']], need: 2 },
  { q: 'What does the First Law of Thermodynamics say?', t: 'thermo',
    model: 'Energy cannot be created or destroyed. It only changes form (like sun energy moving into plants, then animals).',
    keys: [['energy'], ['created', 'made', 'create'], ['destroyed', 'destroy']], need: 3 },
  { q: 'What is an ecosystem?', t: 'ecosystem',
    model: 'An ecosystem is made up of biotic (living) and abiotic (non-living) components that depend on each other to survive.',
    keys: [['biotic', 'living', 'alive'], ['abiotic', 'non living', 'nonliving', 'not living'], ['depend', 'each other', 'together', 'survive', 'need']], need: 3 },
  { q: 'Why do "apex predator" and "tertiary consumer" mean the same thing?', t: 'apex',
    model: 'Both are at the top of the food chain and have no natural predator. Nothing hunts them.',
    keys: [['no natural predator', 'no predator', 'nothing eats', 'nothing hunts', 'no one eats', 'not eaten'], ['top', 'highest']], need: 1 },
  { q: 'What is eutrophication? What happens to the lake?', t: 'eutro',
    model: 'Eutrophication is excessive (too much) algae growth in a lake, which strangles the lake.',
    keys: [['algae'], ['too much', 'excessive', 'lots', 'a lot', 'overgrow', 'grows'], ['strangle', 'kill', 'chok', 'die', 'hurt', 'suffocat', 'harm']], need: 3 },
  { q: 'What is a limiting factor? Give an example.', t: 'limiting',
    model: 'A limiting factor is anything (a condition, resource or variable) that restricts the growth, abundance or distribution of a population. Example: not enough water, food or space.',
    keys: [['limit', 'restrict', 'stop', 'control', 'keeps'], ['population', 'growth', 'grow', 'how many'], ['food', 'water', 'space', 'sunlight', 'shelter', 'light', 'predator', 'disease', 'temperature']], need: 3 },
  { q: 'What is carrying capacity?', t: 'carrying',
    model: 'Carrying capacity is the maximum population size of a species that an environment can support over time without running out of materials.',
    keys: [['maximum', 'max', 'most', 'biggest', 'largest'], ['population', 'number', 'how many', 'species'], ['support', 'running out', 'run out', 'sustain', 'hold']], need: 3 },
  { q: 'What does a decomposer do?', t: 'decomposer',
    model: "A decomposer breaks down animals' waste and dead biotic (living) things.",
    keys: [['break down', 'breaks down', 'decompose', 'eat', 'breaking down'], ['waste', 'poop', 'dead', 'died']], need: 2 },
  { q: 'What do producers give an ecosystem, and where does their energy come from?', t: 'producer',
    model: "Producers (plants) provide nutrients and oxygen to an ecosystem. They get their energy from the sun.",
    keys: [['nutrient', 'food'], ['oxygen'], ['sun']], need: 3 },
  { q: 'What is sustainability?', t: 'sustain',
    model: 'Sustainability means living within our needs so that we are able to sustain life for the future.',
    keys: [['need', 'only what', 'within'], ['future', 'later', 'next generation']], need: 2 },
  { q: 'What is matter cycling? What is another name for it?', t: 'matter',
    model: 'Matter cycling is how matter like elements and compounds recycle in an ecosystem. It is also called biogeochemical cycling.',
    keys: [['recycle', 'cycle', 'reuse', 'around'], ['biogeochemical']], need: 2 },
  { q: 'What is the difference between biotic and abiotic?', t: 'biotic',
    model: 'Biotic things are living (like trees and fish). Abiotic things are non-living (like water, rocks and sunlight).',
    keys: [['living', 'alive', 'life'], ['non living', 'nonliving', 'not living', 'not alive', 'dead']], need: 2 },
  { q: 'What is the difference between a primary consumer and a secondary consumer?', t: 'secondary',
    model: 'A primary consumer is a herbivore (eats plants). A secondary consumer is a carnivore (eats meat / other animals).',
    keys: [['herbivore', 'plant'], ['carnivore', 'meat', 'animal']], need: 2 },
  { q: 'What is biodiversity?', t: 'biodiversity',
    model: 'Biodiversity means lots of different living things in an ecosystem.',
    keys: [['different', 'many', 'variety', 'lots', 'kinds', 'types'], ['living', 'organism', 'species', 'plants', 'animals']], need: 2 },
];

export const LISTS = [
  { q: 'Name TWO abiotic (non-living) parts of an ecosystem.', t: 'abiotic', need: 2,
    ok: ['sun', 'sunlight', 'light', 'water', 'rock', 'stone', 'air', 'wind', 'soil', 'dirt', 'temperature', 'rain', 'sand', 'oxygen', 'snow', 'mineral', 'weather', 'climate', 'heat', 'ice', 'cloud', 'mud', 'carbon dioxide'],
    model: 'Examples: sunlight, water, rocks, air, soil, temperature, wind.' },
  { q: 'Name TWO biotic (living) parts of an ecosystem.', t: 'biotic', need: 2,
    ok: ['tree', 'grass', 'fish', 'frog', 'bird', 'mushroom', 'fungi', 'fungus', 'bacteria', 'insect', 'bug', 'plant', 'animal', 'flower', 'bee', 'worm', 'deer', 'rabbit', 'bunny', 'human', 'person', 'people', 'algae', 'moss', 'bear', 'fox', 'snake', 'mouse', 'owl', 'eagle', 'hawk', 'squirrel', 'ant', 'spider', 'cat', 'dog', 'butterfly', 'ladybug', 'shark', 'whale', 'duck', 'turtle', 'lizard', 'wolf', 'lion', 'cow', 'horse', 'bush', 'shrub', 'seaweed', 'lily pad', 'cactus', 'weed'],
    model: 'Examples: trees, grass, fish, frogs, birds, mushrooms, bacteria.' },
  { q: 'Name TWO decomposers.', t: 'decomposer', need: 2,
    ok: ['worm', 'earthworm', 'mushroom', 'fungi', 'fungus', 'bacteria', 'beetle', 'slug', 'snail', 'millipede', 'mold', 'termite', 'woodlouse', 'pill bug', 'maggot', 'fly'],
    model: 'Examples: worms, mushrooms (fungi), bacteria, beetles, slugs.' },
  { q: 'Name TWO things that can be limiting factors.', t: 'limiting', need: 2,
    ok: ['food', 'water', 'space', 'sunlight', 'light', 'shelter', 'predator', 'disease', 'temperature', 'oxygen', 'nutrient', 'soil', 'mate', 'territory', 'weather', 'climate', 'competition', 'habitat'],
    model: 'Examples: food, water, space, sunlight, shelter, predators, disease.' },
  { q: 'Give ONE example of a producer.', t: 'producer', need: 1,
    ok: ['grass', 'tree', 'plant', 'flower', 'algae', 'moss', 'bush', 'shrub', 'seaweed', 'cactus', 'sunflower', 'corn', 'clover', 'fern', 'kelp', 'vegetable', 'lettuce', 'carrot', 'wheat', 'oak', 'lily pad', 'berry', 'berries', 'leaf', 'leaves', 'weed'],
    model: 'Examples: grass, trees, flowers, algae.' },
  { q: 'Give ONE example of a primary consumer (herbivore).', t: 'primary', need: 1,
    ok: ['rabbit', 'bunny', 'deer', 'cow', 'horse', 'mouse', 'grasshopper', 'caterpillar', 'sheep', 'goat', 'squirrel', 'giraffe', 'elephant', 'koala', 'panda', 'zebra', 'hamster', 'guinea pig', 'snail', 'beaver', 'moose', 'cricket', 'butterfly', 'bee', 'hippo', 'kangaroo', 'chipmunk', 'turtle', 'manatee', 'bison', 'buffalo', 'llama', 'camel', 'pig', 'duck', 'slug', 'insect', 'minnow', 'zooplankton'],
    model: 'Examples: rabbit, deer, mouse, grasshopper, cow.' },
  { q: 'Give ONE example of an apex predator.', t: 'apex', need: 1,
    ok: ['eagle', 'hawk', 'lion', 'tiger', 'shark', 'orca', 'killer whale', 'wolf', 'bear', 'owl', 'crocodile', 'alligator', 'polar bear', 'grizzly', 'jaguar', 'leopard', 'cougar', 'puma', 'falcon', 'human', 'python', 'anaconda', 'komodo'],
    model: 'Examples: eagle, hawk, shark, lion, wolf, orca.' },
];

// Corrections for the false statements, shown after answering
export const TF_FIX = {
  'Abiotic means living.': 'Abiotic means NON-living. Biotic means living.',
  'A primary consumer is a carnivore.': 'A primary consumer is a HERBIVORE. A secondary consumer is a carnivore.',
  'Energy can be created out of nothing.': 'Energy cannot be created or destroyed (First Law of Thermodynamics).',
  'Polyculture means growing only one type of crop.': 'Polyculture is MANY crops together. Monoculture is only one.',
  'Organic farming uses man-made chemicals.': 'Organic farming grows food WITHOUT man-made chemicals.',
  'An organism is a big group of many living things.': 'An organism is ONE individual living thing.',
  'A limiting factor helps a population grow forever.': 'A limiting factor RESTRICTS how much a population can grow.',
  'Sustainability means using up everything as fast as we can.': 'Sustainability means living within our needs so there is enough for the future.',
};
// Extra auto-made T/F: pair a term with the wrong definition
function makeTF() {
  if (Math.random() < 0.7) { const tf = pick(TRUEFALSE); return { type: 'tf', prompt: tf.q, answer: tf.a, termId: tf.t, fix: TF_FIX[tf.q] }; }
  const t = pick(TERMS);
  if (Math.random() < 0.5) return { type: 'tf', prompt: `${t.term}: ${lower(t.def)}.`, answer: true, termId: t.id };
  const others = TERMS.filter(x => x.id !== t.id && x.id !== t.same && x.group === t.group);
  const o = pick(others.length ? others : TERMS.filter(x => x.id !== t.id && x.id !== t.same));
  return { type: 'tf', prompt: `${t.term}: ${lower(o.def)}.`, answer: false, termId: t.id, fix: `That's the definition of ${o.term}. ${t.term} means: ${lower(t.def)}.` };
}
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/* ------------------------------------------------------------------ */
/* Weighted term picking (weak words come up more)                     */
/* ------------------------------------------------------------------ */
export function weight(id) {
  const m = state.mastery[id];
  if (!m) return 2;
  return Math.max(0.3, 1.2 + m.w * 1.0 - m.s * 0.45);
}
export function pickTerms(n, pool = TERMS.map(t => t.id), avoid = []) {
  const out = []; let cand = pool.filter(id => !avoid.includes(id));
  while (out.length < n && cand.length) {
    const ws = cand.map(weight); let r = Math.random() * ws.reduce((a, b) => a + b, 0), k = 0;
    for (; k < cand.length - 1; k++) { r -= ws[k]; if (r <= 0) break; }
    const id = cand[k]; out.push(id);
    cand = cand.filter(x => x !== id && x !== T[id].same);
  }
  return out;
}
export function weakTerms() {
  return TERMS.filter(t => { const m = state.mastery[t.id]; return m && m.w > 0 && m.s < 2; }).map(t => t.id);
}

/* ------------------------------------------------------------------ */
/* Generators                                                          */
/* ------------------------------------------------------------------ */
const fromMC = (q) => ({ type: 'mc', prompt: q.prompt, options: q.options, termId: q.termId });
export function makeMC(id) {
  const sc = SCENARIOS.filter(s => s.a === id), cu = CUSTOM.filter(c => c.t === id);
  const r = Math.random();
  if (r < 0.35 && sc.length) return fromMC(scenario(pick(sc)));
  if (r < 0.5 && cu.length) return fromMC(custom(pick(cu)));
  if (r < 0.7) return fromMC(termToDef(id, 4));
  return fromMC(defToTerm(id, 4));
}
export function makeSATerm(id) {
  const t = T[id];
  return { type: 'sa-term', prompt: t.def, termId: id, answers: ALIASES[id] || [t.term], display: t.term };
}
export function makeSAList(item) { return { type: 'sa-list', prompt: item.q, termId: item.t, ok: item.ok, need: item.need, model: item.model }; }
export function makeSAExplain(item) { return { type: 'sa-explain', prompt: item.q, termId: item.t, model: item.model, keys: item.keys, need: item.need }; }
export function makeSA(id, kind) {
  kind = kind || pick(['term', 'term', 'explain', 'list']);
  if (kind === 'explain') { const e = EXPLAIN.filter(x => x.t === id); return makeSAExplain(e.length ? pick(e) : pick(EXPLAIN)); }
  if (kind === 'list') { const l = LISTS.filter(x => x.t === id); return makeSAList(l.length ? pick(l) : pick(LISTS)); }
  return makeSATerm(id);
}
export function makeMatch(n = 8, pool) {
  const ids = pickTerms(n, pool);
  return { type: 'match', termId: null, pairs: shuffle(ids).map(id => ({ termId: id, term: T[id].term, def: T[id].def })), bank: shuffle(ids) };
}
export function makeTFItem(id) {
  if (id) {
    const own = TRUEFALSE.filter(x => x.t === id);
    if (own.length && Math.random() < 0.6) { const tf = pick(own); return { type: 'tf', prompt: tf.q, answer: tf.a, termId: tf.t, fix: TF_FIX[tf.q] }; }
    const t = T[id];
    if (Math.random() < 0.5) return { type: 'tf', prompt: `${t.term}: ${lower(t.def)}.`, answer: true, termId: id };
    const o = pick(TERMS.filter(x => x.id !== id && x.id !== t.same));
    return { type: 'tf', prompt: `${t.term}: ${lower(o.def)}.`, answer: false, termId: id, fix: `That's the definition of ${o.term}. ${t.term} means: ${lower(t.def)}.` };
  }
  return makeTF();
}

// A full practice test in the real test's format
export function makeTest() {
  const items = [];
  pickTerms(4).forEach(id => items.push({ ...makeMC(id), section: 'mc' }));
  // short answer: 2 write-the-word, 2 explain, 1 list — one explain is often the farming question
  const saIds = pickTerms(2);
  saIds.forEach(id => items.push({ ...makeSATerm(id), section: 'sa' }));
  const ex = shuffle(EXPLAIN).sort((a, b) => weight(b.t) - weight(a.t) + (Math.random() - .5) * 2);
  const farm = Math.random() < 0.5 ? [EXPLAIN[Math.random() < 0.5 ? 0 : 1]] : [];
  const exPick = [...farm, ...ex.filter(e => !farm.includes(e))].slice(0, 2);
  exPick.forEach(e => items.push({ ...makeSAExplain(e), section: 'sa' }));
  items.push({ ...makeSAList(pick(LISTS)), section: 'sa' });
  items.push({ ...makeMatch(8), section: 'match' });
  const seen = new Set();
  while (items.filter(i => i.section === 'tf').length < 4) {
    const tf = makeTF(); if (seen.has(tf.prompt)) continue; seen.add(tf.prompt);
    items.push({ ...tf, section: 'tf' });
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Grading                                                             */
/* ------------------------------------------------------------------ */
export const norm = (s) => String(s || '').toLowerCase().replace(/1st/g, 'first').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const squash = (s) => norm(s).replace(/ /g, '').replace(/s$/, '');
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
// Is a typed term right? Forgives small typos, but never accepts a DIFFERENT real term (biotic vs abiotic).
export function checkTerm(item, typed) {
  const a = squash(typed);
  if (!a) return { ok: false, close: false };
  const all = TERMS.flatMap(t => (ALIASES[t.id] || [t.term]).map(x => ({ id: t.id, s: squash(x) })));
  const own = (item.answers).map(squash);
  let best = Infinity; for (const o of own) best = Math.min(best, lev(a, o));
  // closest term overall
  let bestOther = Infinity;
  for (const x of all) if (!own.includes(x.s)) bestOther = Math.min(bestOther, lev(a, x.s));
  const len = Math.max(...own.map(o => o.length));
  const allow = len <= 5 ? 1 : Math.min(3, Math.floor(len / 6) + 1);
  if (best === 0) return { ok: true, exact: true };
  if (best <= allow && best < bestOther) return { ok: true, exact: false };
  return { ok: false, close: best <= allow + 2 };
}
export function checkList(item, typed) {
  const txt = ' ' + norm(typed) + ' ';
  const found = [];
  for (const w of item.ok) {
    const n = norm(w);
    if (txt.includes(' ' + n + ' ') || txt.includes(' ' + n + 's ') || txt.includes(' ' + n + 'es ')) {
      if (!found.some(f => f.startsWith(n) || n.startsWith(f))) found.push(n);
    }
  }
  return { ok: found.length >= item.need, found };
}
export function checkExplain(item, typed) {
  const txt = ' ' + norm(typed) + ' ';
  const hits = item.keys.map(group => group.find(p => txt.includes(' ' + norm(p))) || null);
  const n = hits.filter(Boolean).length;
  return { suggest: n >= item.need, hits, n };
}

// Points for an answered item: {pts, max}
export function grade(item) {
  const r = item.resp;
  switch (item.type) {
    case 'mc': return { pts: r != null && item.options[r].correct ? 1 : 0, max: 1 };
    case 'tf': return { pts: r != null && r === item.answer ? 1 : 0, max: 1 };
    case 'sa-term': return { pts: checkTerm(item, r).ok ? 1 : 0, max: 1 };
    case 'sa-list': return { pts: checkList(item, r).ok ? 1 : 0, max: 1 };
    case 'sa-explain': return { pts: (item.self ?? checkExplain(item, r).suggest) ? 1 : 0, max: 1 };
    case 'match': { const m = r || {}; return { pts: item.pairs.filter((p, i) => m[i] === p.termId).length, max: item.pairs.length }; }
  }
  return { pts: 0, max: 1 };
}
export const answered = (item) => {
  const r = item.resp;
  if (item.type === 'match') return r && Object.keys(r).length === item.pairs.length;
  if (item.type.startsWith('sa')) return !!(r && String(r).trim());
  return r != null;
};
export function correctText(item) {
  switch (item.type) {
    case 'mc': return item.options.find(o => o.correct).label;
    case 'tf': return item.answer ? 'True' : 'False';
    case 'sa-term': return item.display;
    case 'sa-list': return item.model;
    case 'sa-explain': return item.model;
  }
  return '';
}
