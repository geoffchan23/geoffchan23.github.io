// What does each question reveal? Used to build tests and drills where
// no question can give away the answer to another (or to itself).
import { T } from '../../katara-kitchen/js/content.js';

// Words that identify a term by its NAME
export const NAME = {
  ecosystem: ['ecosystem'], abiotic: ['abiotic'], biotic: ['biotic'], organism: ['organism'], biodiversity: ['biodiversity', 'diversity'],
  apex: ['apex', 'predator'], tertiary: ['tertiary'], secondary: ['secondary consumer'], primary: ['primary consumer'],
  producer: ['producer', 'produce'], decomposer: ['decomposer', 'decompose'], thermo: ['thermodynamic'],
  psucc: ['primary succession'], ssucc: ['secondary succession'], sustain: ['sustainab', 'sustain'], matter: ['matter cycling', 'cycling', 'biogeochemical'],
  organic: ['organic'], traditional: ['traditional'], mono: ['monoculture'], poly: ['polyculture'],
  limiting: ['limiting', 'limit'], carrying: ['carrying capacity', 'carry'], eutro: ['eutrophication'],
};
// Words that identify a term by its MEANING
export const KEY = {
  abiotic: ['non-living', 'nonliving', 'not living'], biotic: ['living elements', 'living things are all'],
  organism: ['individual living'], biodiversity: ['different living things', 'different kinds of plants and animals'],
  apex: ['no natural predator', 'nothing that hunts', 'nothing hunts', 'no other animal hunts', 'top of the food chain'],
  tertiary: ['no natural predator', 'top of the food chain'],
  secondary: ['carnivore', 'eats meat'], primary: ['herbivore', 'eats plants', 'only eats plants', 'eats only grass'],
  producer: ["sun's energy", 'nutrients and oxygen'], decomposer: ['break down', 'breaks down', 'breaking down', 'decomposes'],
  thermo: ['created or destroyed', 'cannot be created'], psucc: ['replaces older species', 'replace older'],
  ssucc: ['devastation', 'reestablish', 'after a wildfire', 'after a big flood'],
  sustain: ['within our needs', 'for the future', 'in the future'], matter: ['recycle in an ecosystem', 'compounds recycle', 'reused'],
  organic: ['without using man-made', 'without man-made', 'man-made chemical'], traditional: ['modern machines', 'machines, fertilizers'],
  mono: ['only one type of crop', 'one type of crop', 'only corn'], poly: ['many different types of crops', 'many crops', 'crops together'],
  limiting: ['restricts the growth'], carrying: ['maximum population'], eutro: ['algae'], ecosystem: ['depend on each other'],
};
// Apex predator and tertiary consumer mean the same thing: one concept.
export const canon = (id) => (id === 'tertiary' ? 'apex' : id);

const norm = (s) => ' ' + String(s || '').toLowerCase().replace(/[’]/g, "'").replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ') + ' ';
const RX = new Map();
const rx = (w) => RX.get(w) || (RX.set(w, new RegExp(`(^|[^a-z])${norm(w).trim().replace(/-/g, '.')}`)), RX.get(w));
const has = (txt, w) => rx(w).test(norm(txt));
export const namesIn = (txt) => Object.keys(NAME).filter(id => (id === 'biotic' ? /(^|[^a])biotic/.test(norm(txt)) : NAME[id].some(w => has(txt, w))));
export const keysIn = (txt) => Object.keys(KEY).filter(id => KEY[id].some(w => has(txt, w)));
const C = (arr) => new Set(arr.filter(Boolean).map(canon));

export function visibleText(it) {
  if (it.type === 'match') return [...it.pairs.map(p => p.def), ...it.pairs.map(p => p.term)].join(' | ');
  return [it.prompt, ...(it.options || []).map(o => o.label)].join(' | ');
}
// Extra text a drill shows after answering (explanations, model answers)
function feedbackText(it) {
  return [it.fix, it.model, it.termId && T[it.termId] ? T[it.termId].def + ' ' + T[it.termId].tip : ''].join(' | ');
}

// ans: concepts this item tests.  shows: concepts whose meaning it reveals.
// names: concepts whose word appears on screen.
export function profile(it, { feedback = false } = {}) {
  const vis = visibleText(it);
  let ans, shows, names = namesIn(vis);
  if (it.type === 'match') {
    ans = it.pairs.map(p => p.termId); shows = [...ans, ...keysIn(vis)];
  } else if (it.type === 'mc' && (it.style === 'def' || it.style === 'scenario' || it.style === 'longopts')) {
    ans = [it.termId]; shows = [it.termId, ...keysIn(it.prompt), ...(it.style === 'longopts' ? namesIn(it.prompt) : [])];
  } else if (it.type === 'mc') { // custom fact questions
    ans = [it.termId]; const right = it.options.find(o => o.correct).label;
    shows = [it.termId, ...keysIn(it.prompt + ' ' + right), ...namesIn(it.prompt + ' ' + right)];
  } else if (it.type === 'tf') {
    ans = [it.termId]; shows = [it.termId, ...namesIn(it.prompt), ...keysIn(it.prompt)];
  } else if (it.type === 'sa-term') {
    ans = [it.termId]; shows = [it.termId, ...keysIn(it.prompt)];
  } else { // sa-list, sa-explain
    ans = [it.termId]; shows = [it.termId, ...keysIn(it.prompt)];
  }
  if (feedback) { const f = feedbackText(it); shows = [...shows, ...keysIn(f), ...namesIn(it.fix || '')]; names = [...names, ...namesIn(f)]; }
  return { ans: C(ans), shows: C(shows), names: C(names), type: it.type };
}
const meets = (a, b) => [...a].some(x => b.has(x));
// Does item A (seen first, or at the same time) give away item B?
export function givesAway(a, b) {
  if (meets(a.shows, b.ans)) return true;
  if (b.type === 'sa-term' && meets(a.names, b.ans)) return true; // the word to write is printed somewhere
  return false;
}
// Does an item give away its OWN answer?
export function selfLeak(it) {
  const own = (txt) => NAME[it.termId] && NAME[it.termId].some(w => has(txt, w));
  if (it.type === 'sa-term') return own(it.prompt);
  if (it.type === 'mc' && (it.style === 'def' || it.style === 'scenario')) return own(it.prompt);
  if (it.type === 'mc' && it.style === 'longopts') return own(it.options.find(o => o.correct).label);
  if (it.type === 'mc') return own(it.options.find(o => o.correct).label);
  if (it.type === 'match') return it.pairs.some(p => NAME[p.termId].some(w => has(p.def, w)));
  return false;
}
