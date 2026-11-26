// End-to-end in WebKit (Safari's engine): take real practice tests by tapping and typing,
// then check the score screen, the review list and the hearts.
// Usage: node e2e.cjs <right|wrong|mixed> <runs>
const pw = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(root, p);
    fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
  }).listen(0);
  const base = `http://localhost:${srv.address().port}`;
  const mode = process.argv[2] || 'right', runs = +(process.argv[3] || 3);
  const b = await pw.webkit.launch(); const ctx = await b.newContext({ ...pw.devices['iPhone 13'] }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  let fails = 0; const fail = (m) => { fails++; console.log('FAIL', m); };
  await pg.goto(base + '/katara-study/'); await pg.evaluate(() => localStorage.clear());

  for (let run = 0; run < runs; run++) {
    await pg.goto(base + '/katara-study/?screen=test&debug'); await pg.waitForTimeout(500);
    const items = await pg.evaluate(() => window.__test.map(it => ({
      type: it.type, correct: it.type === 'mc' ? it.options.findIndex(o => o.correct) : it.type === 'tf' ? it.answer : null,
      display: it.display, ok: it.ok, need: it.need, model: it.model, pairs: it.pairs && it.pairs.map(p => p.term),
    })));
    const rightAt = (i) => mode === 'right' || (mode === 'mixed' && i % 2 === 0);
    let expect = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i], right = rightAt(i);
      if (it.type === 'mc') { const opts = await pg.$$('.opt'); await opts[right ? it.correct : (it.correct + 1) % opts.length].tap(); expect += right ? 1 : 0; }
      else if (it.type === 'tf') { const trueBtn = right ? it.correct : !it.correct; await (await pg.$$('.opt'))[trueBtn ? 0 : 1].tap(); expect += right ? 1 : 0; }
      else if (it.type === 'sa-term') {
        const before = await pg.$eval('.sa-input', e => e.value + ' [attr=' + e.getAttribute('value') + '] resps=' + JSON.stringify(window.__test.filter(x => x.type === 'sa-term').map(x => x.resp)) + ' same=' + (window.__test.filter(x => x.type === 'sa-term')[0] === window.__test.filter(x => x.type === 'sa-term')[1]));
        await pg.tap('.sa-input'); await pg.keyboard.type(right ? it.display.toLowerCase() : 'banana'); expect += right ? 1 : 0;
        if (process.env.DEBUG) console.log('  sa-term Q' + (i + 1), 'box before typing:', JSON.stringify(before), 'after:', JSON.stringify(await pg.$eval('.sa-input', e => e.value)), 'prompt:', await pg.$eval('.q-prompt', e => e.innerText.slice(0, 60)));
      }
      else if (it.type === 'sa-list') {
        const pick = []; for (const w of it.ok) if (!pick.some(p => p.startsWith(w) || w.startsWith(p))) pick.push(w);
        await pg.tap('.sa-input'); await pg.keyboard.type(right ? pick.slice(0, it.need).join(', ') : 'no idea'); expect += right ? 1 : 0;
      }
      else if (it.type === 'sa-explain') { await pg.tap('.sa-input'); await pg.keyboard.type(right ? it.model : 'not sure'); expect += right ? 1 : 0; }
      else if (it.type === 'match') {
        for (let r = 0; r < it.pairs.length; r++) {
          await pg.tap(`.m-row[data-i="${r}"] .m-def`);
          const target = it.pairs[(r + (right ? 0 : 1)) % it.pairs.length];
          for (const c of await pg.$$('.chip-w')) if ((await c.textContent()).trim() === target) { await c.tap(); break; }
        }
        const filled = await pg.$$eval('.m-slot.filled', e => e.length);
        if (filled !== 8) fail(`matching: only ${filled}/8 boxes filled`);
        expect += right ? 8 : 0;
      }
      await pg.tap('.test-nav .next'); await pg.waitForTimeout(120);
    }
    const warn = await pg.$('.rv-warn'); if (warn) fail('review screen says questions were skipped: ' + await warn.textContent());
    await pg.tap('.submit'); await pg.waitForTimeout(400);
    // self-mark the explain answers the way she would
    const explainIdx = items.map((it, i) => it.type === 'sa-explain' ? i : -1).filter(i => i >= 0);
    for (const i of explainIdx) { await pg.tap(rightAt(i) ? '.sc-yes' : '.sc-no', { force: true }); await pg.waitForTimeout(400); }
    await pg.waitForTimeout(900);
    const score = await pg.$eval('.rs-score b', e => e.textContent.replace(/\s/g, ''));
    const secs = await pg.$$eval('.rs-sec', es => es.map(e => e.querySelector('span').textContent + ' ' + e.querySelector('b').textContent));
    if (score !== `${expect}/21`) fail(`run ${run + 1} (${mode}): screen shows ${score}, expected ${expect}/21 · ${secs.join(', ')}`);
    else console.log(`run ${run + 1} (${mode}): ${score} ✓  ${secs.join(' · ')}`);
    const missed = await pg.$$eval('.miss', e => e.length);
    if (missed !== 21 - expect) fail(`"Let's fix these" lists ${missed}, expected ${21 - expect}: ` + (await pg.$$eval(".miss", es => es.map(e => e.innerText.replace(/\s+/g, " ")).join(" || "))));
  }

  await pg.goto(base + '/katara-study/'); await pg.waitForTimeout(500);
  const hist = await pg.evaluate(() => { const m = JSON.parse(localStorage.getItem('mochi-mini-kitchen-v1')).mastery; return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.h])); });
  if (mode === 'right') { const bad = Object.entries(hist).filter(([, h]) => h.some(x => !x)); if (bad.length) fail('words marked wrong after all-right tests: ' + bad.map(x => x[0]).join(',')); }
  if (mode === 'wrong') { const bad = Object.entries(hist).filter(([, h]) => h.some(x => x)); if (bad.length) fail('words marked right after all-wrong tests: ' + bad.map(x => x[0]).join(',')); }
  for (const d of await pg.$$('.mg-d summary')) await d.tap();
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: path.join(__dirname, `e2e_${mode}_home.png`), fullPage: true });
  console.log('words tracked:', Object.keys(hist).length, '· page errors:', JSON.stringify(errs));
  if (errs.length) fails++;
  await b.close(); srv.close(); process.exit(fails ? 1 : 0);
})();
