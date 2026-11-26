// Play every drill in WebKit answering everything right; the end screen must show a perfect score.
const pw = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
(async () => {
  const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(root, p); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
  const base = `http://localhost:${srv.address().port}`;
  const b = await pw.webkit.launch(); const pg = await (await b.newContext({ ...pw.devices['iPhone 13'] })).newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  let fails = 0; const fail = (m) => { fails++; console.log('FAIL', m); };
  await pg.goto(base + '/katara-study/');
  // seed some weak words so the weak-words drill has something to do
  await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('mochi-mini-kitchen-v1', JSON.stringify({ mastery: { biotic: { r: 0, w: 1, s: 0, seen: 1, h: [false] }, abiotic: { r: 0, w: 1, s: 0, seen: 1, h: [false] }, poly: { r: 0, w: 1, s: 0, seen: 1, h: [false] }, decomposer: { r: 0, w: 1, s: 0, seen: 1, h: [false] } } })); });
  for (const kind of ['mc', 'tf', 'sa', 'match', 'weak']) {
    await pg.goto(base + `/katara-study/?screen=drill&kind=${kind}&debug`); await pg.waitForTimeout(500);
    const n = await pg.evaluate(() => window.__drill.length);
    let maxPts = 0, sawRound2 = false;
    for (let i = 0; i < n; i++) {
      const it = await pg.evaluate((i) => { const x = window.__drill[i]; return { type: x.type, correct: x.type === 'mc' ? x.options.findIndex(o => o.correct) : x.type === 'tf' ? x.answer : null, display: x.display, ok: x.ok, need: x.need, model: x.model, pairs: x.pairs && x.pairs.map(p => p.term), roundStart: x.roundStart }; }, i);
      if (it.roundStart) sawRound2 = !!(await pg.$('.round2'));
      if (it.type === 'mc') await (await pg.$$('.opt'))[it.correct].tap();
      else if (it.type === 'tf') await (await pg.$$('.opt'))[it.correct ? 0 : 1].tap();
      else if (it.type === 'sa-term') { const before = await pg.$eval('.sa-input', e => e.value); if (before) fail(`${kind} Q${i + 1}: box starts with "${before}"`); await pg.tap('.sa-input'); await pg.keyboard.type(it.display); await pg.tap('.check'); }
      else if (it.type === 'sa-list') { const pick = []; for (const w of it.ok) if (!pick.some(p => p.startsWith(w) || w.startsWith(p))) pick.push(w); await pg.tap('.sa-input'); await pg.keyboard.type(pick.slice(0, it.need).join(', ')); await pg.tap('.check'); }
      else if (it.type === 'sa-explain') { await pg.tap('.sa-input'); await pg.keyboard.type(it.model); await pg.tap('.check'); await pg.waitForTimeout(200); await pg.tap('.sc-yes', { force: true }); }
      else if (it.type === 'match') {
        for (let r = 0; r < it.pairs.length; r++) { await pg.tap(`.m-row[data-i="${r}"] .m-def`); for (const c of await pg.$$('.chip-w')) if ((await c.textContent()).trim() === it.pairs[r]) { await c.tap(); break; } }
        await pg.tap('.check');
      }
      maxPts += it.type === 'match' ? it.pairs.length : 1;
      await pg.waitForTimeout(250);
      const head = await pg.$eval('.fb-head', e => e.textContent).catch(() => '(no feedback shown)');
      if (/not quite|\(no feedback/i.test(head)) fail(`${kind} Q${i + 1} (${it.type}) marked "${head}" for a correct answer`);
      await pg.tap('.q-feedback .next'); await pg.waitForTimeout(200);
    }
    await pg.waitForTimeout(500);
    const score = await pg.$eval('.rs-score b', e => e.textContent.replace(/\s/g, '')).catch(() => '?');
    if (score !== `${maxPts}/${maxPts}`) fail(`${kind} drill: end screen shows ${score}, expected ${maxPts}/${maxPts}`);
    else console.log(`${kind.padEnd(5)} drill: ${n} questions, ${score} ✓${kind === 'weak' ? (sawRound2 ? ' (Round 2 header shown)' : ' (NO Round 2 header!)') : ''}`);
    if (kind === 'weak' && !sawRound2) fails++;
    await pg.screenshot({ path: path.join(__dirname, `e2e_drill_${kind}.png`) });
  }
  console.log('page errors:', JSON.stringify(errs)); if (errs.length) fails++;
  await b.close(); srv.close(); process.exit(fails ? 1 : 0);
})();
