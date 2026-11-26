// Scoring tests: perfect tests must score 21/21, wrong answers 0, typed answers graded fairly,
// and hearts must go up for words she gets right.
import './shim.mjs';
const I = await import('../js/items.js');
const { T, TERMS } = await import('../../katara-kitchen/js/content.js');
const S = await import('../../katara-kitchen/js/state.js');
let fails = 0; const ok = (c, msg) => { if (!c) { fails++; if (fails < 25) console.log('FAIL:', msg); } };

const answerRight = (it) => {
  if (it.type === 'mc') it.resp = it.options.findIndex(o => o.correct);
  else if (it.type === 'tf') it.resp = it.answer;
  else if (it.type === 'sa-term') it.resp = it.display;
  else if (it.type === 'sa-list') { const pickd = []; for (const w of it.ok) if (!pickd.some(p => p.startsWith(w) || w.startsWith(p))) pickd.push(w); it.resp = pickd.slice(0, it.need).join(' and '); }
  else if (it.type === 'sa-explain') { it.resp = it.model; it.self = I.checkExplain(it, it.model).suggest; }
  else if (it.type === 'match') it.resp = Object.fromEntries(it.pairs.map((p, i) => [i, p.termId]));
};
const answerWrong = (it) => {
  if (it.type === 'mc') it.resp = it.options.findIndex(o => !o.correct);
  else if (it.type === 'tf') it.resp = !it.answer;
  else if (it.type === 'sa-term') it.resp = TERMS.find(t => t.id !== it.termId && t.id !== T[it.termId].same).term;
  else if (it.type === 'sa-list') it.resp = 'I do not know';
  else if (it.type === 'sa-explain') { it.resp = 'not sure'; it.self = false; }
  else if (it.type === 'match') it.resp = Object.fromEntries(it.pairs.map((p, i) => [i, it.pairs[(i + 1) % it.pairs.length].termId]));
};
const total = (items) => items.map(I.grade).reduce((a, g) => ({ pts: a.pts + g.pts, max: a.max + g.max }), { pts: 0, max: 0 });

for (let n = 0; n < 1500; n++) {
  const t = I.makeTest();
  t.forEach(answerRight); const g = total(t);
  ok(g.pts === 21 && g.max === 21, `perfect test scored ${g.pts}/${g.max}: ` + t.filter(x => I.grade(x).pts < I.grade(x).max).map(x => x.type + ' ' + (x.prompt || '') + ' resp=' + JSON.stringify(x.resp)).join(' || '));
  ok(t.every(I.answered), 'perfect test has unanswered items');
  // explain model answers should be recognised by Mochi's keyword check
  t.filter(x => x.type === 'sa-explain').forEach(x => ok(I.checkExplain(x, x.model).suggest, `model answer not recognised: ${x.prompt}`));
  const t2 = I.makeTest(); t2.forEach(answerWrong); const g2 = total(t2);
  ok(g2.pts === 0, `all-wrong test scored ${g2.pts}: ` + t2.filter(x => I.grade(x).pts).map(x => x.type + ' ' + x.prompt + ' resp=' + JSON.stringify(x.resp)).join(' || '));
  const t3 = I.makeTest(); ok(total(t3).pts === 0, 'blank test scored points');
  ok(t3.filter(x => !I.answered(x)).length === t3.length, 'blank items counted as answered');
}

// typed vocabulary words
const term = (id, typed) => I.checkTerm(I.makeSATerm(id), typed).ok;
for (const t of TERMS) {
  ok(term(t.id, t.term), `exact "${t.term}" rejected`);
  ok(term(t.id, t.term.toLowerCase() + ' '), `lowercase "${t.term}" rejected`);
  ok(term(t.id, t.term.toUpperCase()), `uppercase "${t.term}" rejected`);
  for (const o of TERMS) if (o.id !== t.id && o.id !== t.same) ok(!term(t.id, o.term), `"${o.term}" wrongly accepted for ${t.term}`);
}
const cases = [['biotic', 'biotc', true], ['biotic', 'abiotic', false], ['abiotic', 'biotic', false], ['abiotic', 'abiotik', true], ['eutro', 'eutrofication', true],
  ['eutro', 'eutrophicaton', true], ['decomposer', 'decomposers', true], ['producer', 'producers', true], ['producer', 'producer', true], ['apex', 'tertiary consumer', true],
  ['tertiary', 'apex predator', true], ['mono', 'polyculture', false], ['poly', 'monoculture', false], ['psucc', 'secondary succession', false], ['ssucc', 'primary succession', false],
  ['psucc', 'primary sucession', true], ['organism', 'organic', false], ['organism', 'orgenism', true], ['thermo', '1st law of thermodynamics', true], ['matter', 'biogeochemical cycling', true],
  ['carrying', 'carying capacity', true], ['limiting', 'limiting factors', true], ['biodiversity', 'bio diversity', true], ['secondary', 'primary consumer', false], ['primary', 'secondary consumer', false],
  ['biotic', '', false], ['biotic', 'b', false], ['sustain', 'sustainibility', true], ['ecosystem', 'eco system', true], ['traditional', 'organic farming', false]];
for (const [id, typed, want] of cases) ok(term(id, typed) === want, `typed "${typed}" for ${T[id].term}: expected ${want ? 'right' : 'wrong'}`);

// example lists
const list = (q, typed) => I.checkList(I.makeSAList(I.LISTS.find(l => l.q.startsWith(q))), typed).ok;
const lcases = [['Name TWO abiotic', 'sun and water', true], ['Name TWO abiotic', 'Sunlight, rocks', true], ['Name TWO abiotic', 'water', false], ['Name TWO abiotic', 'trees and fish', false],
  ['Name TWO biotic', 'trees and fish', true], ['Name TWO biotic', 'Frogs, bacteria', true], ['Name TWO biotic', 'rocks and water', false], ['Name TWO decomposers', 'worms and mushrooms', true],
  ['Name TWO decomposers', 'worm, fungi', true], ['Give ONE example of a producer', 'grass', true], ['Give ONE example of a producer', 'a rabbit', false],
  ['Give ONE example of a primary consumer', 'rabbit', true], ['Give ONE example of a primary consumer', 'deer', true], ['Give ONE example of a primary consumer', 'eagle', false],
  ['Give ONE example of an apex predator', 'eagle', true], ['Give ONE example of an apex predator', 'sharks', true], ['Name TWO things that can be limiting', 'food and water', true]];
for (const [q, typed, want] of lcases) ok(list(q, typed) === want, `list "${q}" typed "${typed}": expected ${want}`);

// hearts: right answers raise hearts, a single miss doesn't wipe them out
S.state.mastery = {};
ok(S.masteryLevel('biotic') === 0, 'unseen word has hearts');
S.record('biotic', true); ok(S.masteryLevel('biotic') === 1, '1 right should be 1 heart');
S.record('biotic', true); S.record('biotic', true); ok(S.masteryLevel('biotic') === 3, '3 right should be 3 hearts');
S.record('biotic', false); ok(S.masteryLevel('biotic') === 2, 'one miss after 3 right should leave 2 hearts');
S.record('biotic', true); S.record('biotic', true); ok(S.masteryLevel('biotic') === 2, 'after miss, 2 right = 2 of last 3');
S.record('biotic', true); ok(S.masteryLevel('biotic') === 3, 'back to 3');
// old save format converts sensibly
S.state.mastery.old = { r: 5, w: 1, s: 3, seen: 6 }; ok(S.masteryLevel('old') === 3, 'old save with streak 3 should be 3 hearts');
S.state.mastery.old2 = { r: 2, w: 3, s: 0, seen: 5 }; ok(S.masteryLevel('old2') === 0, 'old save ending in a miss');
console.log(fails ? `${fails} FAILURES` : 'grading: all checks passed (4,500 tests, 23x23 word pairs, typo + list cases, hearts)');
process.exit(fails ? 1 : 0);
