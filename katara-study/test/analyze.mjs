// Independent giveaway checker: generates many tests/drills and scans the actual
// on-screen text for anything that names or explains another question's answer.
import './shim.mjs';
const { makeTest, makeDrill, makeQuizRun } = await import('../js/items.js');
const { TERMS: TT, GROUPS } = await import('../../katara-kitchen/js/content.js');
const { T } = await import('../../katara-kitchen/js/content.js');
const { namesIn, keysIn, canon, NAME } = await import('../js/reveal.js');
const norm = s => ' ' + String(s).toLowerCase().replace(/[^a-z' -]+/g, ' ') + ' ';
const ownName = (txt, id) => NAME[id].some(w => new RegExp(`(^|[^a-z])${w}`).test(norm(txt)));
// on-screen text that carries meaning (wrong options in "what does X mean" are unlabeled, so only the right one counts)
const shown = (it) => it.type === 'match' ? it.pairs.map(p => p.term + ' = ' + p.def).join(' | ')
  : it.type === 'mc' && it.style === 'longopts' ? it.prompt + ' | ' + it.options.find(o => o.correct).label
  : it.type === 'mc' ? it.prompt + ' | ' + it.options.find(o => o.correct).label : it.prompt;
const allWords = (it) => it.type === 'match' ? shown(it) : [it.prompt, ...(it.options || []).map(o => o.label)].join(' | ');
const after = (it) => [it.fix, it.model, it.termId ? T[it.termId].def + ' ' + T[it.termId].tip : ''].join(' ');
const ans = (it) => (it.type === 'match' ? it.pairs.map(p => p.termId) : [it.termId]).map(canon);
const reveals = (txt) => new Set([...keysIn(txt), ...namesIn(txt)].map(canon));

function check(items, ordered) {
  const out = [];
  items.forEach(it => {
    if (it.type === 'sa-term' && ownName(it.prompt, it.termId)) out.push(`self: "${it.prompt}" contains the word ${T[it.termId].term}`);
    if (it.type === 'mc' && ['def', 'scenario'].includes(it.style) && ownName(it.prompt, it.termId)) out.push(`self: "${it.prompt}" contains ${T[it.termId].term}`);
    if (it.type === 'mc' && ['longopts', 'custom'].includes(it.style) && ownName(it.options.find(o => o.correct).label, it.termId)) out.push(`self: answer "${it.options.find(o => o.correct).label}" contains ${T[it.termId].term}`);
    if (it.type === 'match') it.pairs.forEach(p => { if (ownName(p.def, p.termId)) out.push(`self: matching "${p.def}" contains ${p.term}`); });
  });
  for (let i = 0; i < items.length; i++) for (let j = 0; j < items.length; j++) {
    if (i === j || (ordered && j < i)) continue;
    const a = items[i], b = items[j];
    if (ordered && (a.round || 1) !== (b.round || 1)) continue; // later rounds are deliberate review
    // meaning-revealing text: TF statements and prompts that name a term count as revealing it
    let txt = a.type === 'tf' || (a.type === 'mc' && a.style === 'custom') ? shown(a) : '';
    let rev = new Set([...keysIn(shown(a)).map(canon), ...namesIn(txt).map(canon)]);
    if (a.type === 'match') rev = new Set([...a.pairs.map(p => canon(p.termId)), ...keysIn(shown(a)).map(canon)]);
    if (ordered) for (const x of [...keysIn(after(a)), ...namesIn(a.fix || '')].map(canon)) rev.add(x);
    ans(a).forEach(x => rev.delete(x));
    const hit = ans(b).filter(x => rev.has(x));
    if (hit.length) out.push(`cross: Q${i + 1} (${a.type}/${a.style || ""} "${shown(a).slice(0, 70)}") reveals ${hit} → Q${j + 1} (${b.type}) "${(b.prompt || 'matching').slice(0, 50)}"`);
    if (b.type === 'sa-term' && namesIn(allWords(a)).map(canon).includes(canon(b.termId))) out.push(`cross: Q${i + 1} prints "${T[b.termId].term}" which Q${j + 1} asks her to write`);
    if (ans(a).some(x => ans(b).includes(x)) && (a.round || 1) === (b.round || 1)) out.push(`dup: ${ans(a).filter(x => ans(b).includes(x))} tested twice`);
  }
  return out;
}
const N = +(process.argv[2] || 2000);
const runs = [['practice test', () => makeTest(), false], ...['mc', 'tf', 'sa', 'match'].map(k => [`${k} drill`, () => makeDrill(k), true]),
  ...['all', ...Object.keys(GROUPS)].map(g => [`bake-off ${g}`, () => { const r = makeQuizRun(10, TT.filter(t => g === 'all' || t.group === g).map(t => t.id)); return r.length === 10 ? r : null; }, true]),
  ['weak-words drill', () => makeDrill('weak', ['biotic', 'abiotic', 'secondary', 'primary', 'decomposer', 'poly']), true]];
let total = 0;
for (const [name, gen, ordered] of runs) {
  let bad = 0, fails = 0; const ex = {};
  for (let n = 0; n < N; n++) {
    const items = gen(); if (!items) { fails++; continue; }
    if (name === 'practice test') {
      const c = s => items.filter(x => x.section === s).reduce((a, x) => a + (x.type === 'match' ? x.pairs.length : 1), 0);
      if (c('mc') !== 4 || c('sa') !== 5 || c('match') !== 8 || c('tf') !== 4) { fails++; continue; }
    }
    const probs = check(items, ordered);
    if (probs.length) { bad++; probs.forEach(p => { const k = p.split(':')[0]; (ex[k] ||= []).length < 3 && ex[k].push(p); }); }
  }
  total += bad + fails;
  console.log(`${name.padEnd(17)} ${N} generated · giveaways in ${bad} · failed to build ${fails}`);
  Object.values(ex).flat().forEach(e => console.log('    ' + e));
}
process.exit(total ? 1 : 0);
