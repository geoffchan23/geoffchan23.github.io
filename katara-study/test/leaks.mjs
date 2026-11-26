// Concept signatures used to detect giveaways.
// NAME: words that identify a term by name. KEY: words that identify it by meaning.
export const NAME = {
  ecosystem: ['ecosystem'], abiotic: ['abiotic'], biotic: ['biotic'], organism: ['organism'], biodiversity: ['biodiversity', 'diversity'],
  apex: ['apex', 'predator'], tertiary: ['tertiary'], secondary: ['secondary consumer'], primary: ['primary consumer'],
  producer: ['producer', 'produce'], decomposer: ['decomposer', 'decompose'], thermo: ['thermodynamic'],
  psucc: ['primary succession'], ssucc: ['secondary succession'], sustain: ['sustainab', 'sustain'], matter: ['matter cycling', 'cycling', 'biogeochemical'],
  organic: ['organic'], traditional: ['traditional'], mono: ['monoculture'], poly: ['polyculture'],
  limiting: ['limiting', 'limit'], carrying: ['carrying capacity', 'carry'], eutro: ['eutrophication'],
};
export const KEY = {
  abiotic: ['non-living', 'nonliving', 'not living'], biotic: ['living elements', 'living things are all'],
  organism: ['individual living'], biodiversity: ['different living things', 'different kinds of plants and animals'],
  apex: ['no natural predator', 'nothing hunts', 'no other animal hunts', 'top of the food chain'], tertiary: ['no natural predator', 'top of the food chain'],
  secondary: ['carnivore', 'eats meat'], primary: ['herbivore', 'eats plants', 'only eats plants'],
  producer: ["sun's energy", 'nutrients and oxygen'], decomposer: ['break down', 'breaks down', 'breaking down', 'decomposes'],
  thermo: ['created or destroyed', 'cannot be created'], psucc: ['replaces older species', 'replace older'], ssucc: ['devastation', 'reestablish', 'after a wildfire', 'after a big flood'],
  sustain: ['within our needs', 'for the future'], matter: ['recycle in an ecosystem', 'compounds recycle', 'reused'],
  organic: ['without using man-made', 'without man-made', 'man-made chemical'], traditional: ['modern machines', 'machines, fertilizers'],
  mono: ['only one type of crop', 'one type of crop', 'only corn'], poly: ['many different types of crops', 'many crops', 'crops together'],
  limiting: ['restricts the growth'], carrying: ['maximum population'], eutro: ['algae'], ecosystem: ['depend on each other'],
};
export const TWIN = { apex: 'tertiary', tertiary: 'apex' };
const norm = s => ' ' + String(s).toLowerCase().replace(/[’]/g, "'").replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ') + ' ';
const has = (txt, w) => { const t = norm(txt), x = norm(w).trim(); return new RegExp(`(^|[^a-z])${x.replace(/[-]/g, '.')}`).test(t); };
// biotic must not match inside abiotic
const hasName = (txt, id) => NAME[id].some(w => id === 'biotic' ? /(^|[^a-z])biotic/.test(norm(txt)) && !/^ *$/.test(norm(txt).replace(/abiotic/g, '').match(/(^|[^a-z])biotic/) ? '' : 'x') : has(txt, w));
export const namesIn = (txt) => Object.keys(NAME).filter(id => id === 'biotic' ? /(^|[^a])biotic/.test(norm(txt)) : NAME[id].some(w => has(txt, w)));
export const keysIn = (txt) => Object.keys(KEY).filter(id => KEY[id].some(w => has(txt, w)));
export const fam = (id) => [id, TWIN[id]].filter(Boolean);
