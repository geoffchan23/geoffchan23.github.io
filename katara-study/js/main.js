// Katara's Test Prep — study-first companion to Mochi's Mini Kitchen.
import { mochi, icon, heart, coin, star } from '../../katara-kitchen/js/art.js';
import { TERMS, T, GROUPS } from '../../katara-kitchen/js/content.js';
import { state, save, addCoins, record, masteryLevel } from '../../katara-kitchen/js/state.js';
import { sfx, unlock } from '../../katara-kitchen/js/audio.js';
import { confetti, rain, flyCoins, centerOf } from '../../katara-kitchen/js/fx.js';
import { $, $$, go, register, topbar, modal, toast, esc, screens } from '../../katara-kitchen/js/ui.js';
import { shuffle, pick } from '../../katara-kitchen/js/questions.js';
import { SECTIONS, makeTest, makeMC, makeSA, makeMatch, makeTFItem, pickTerms, weakTerms, grade, answered, correctText, checkExplain } from './items.js';
import { renderItem, selfCheck, explainHTML } from './quiz.js';

if (!state.tests) state.tests = [];
const GAME = '/katara-kitchen/';
const readiness = () => Math.round(100 * TERMS.reduce((a, t) => a + masteryLevel(t.id), 0) / (TERMS.length * 3));
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const tb = (title) => topbar({ title, back: 'home', showTokens: false });

/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */
register('home', (root) => {
  const bar = topbar({ title: '', back: null, showTokens: false });
  root.appendChild(bar);
  const r = readiness();
  const weak = weakTerms();
  const tests = state.tests.slice(-6);
  const best = state.tests.reduce((a, t) => Math.max(a, t.pct), 0);
  const el = document.createElement('div'); el.className = 'scr-home';
  el.innerHTML = `
    <section class="hero">
      <div class="hero-m">${mochi({ mood: r >= 80 ? 'star' : 'happy', glasses: true, hat: false })}</div>
      <div class="hero-txt">
        <small>Katara's</small><h1>Science Test Prep</h1>
        <p>${r >= 85 ? "You're ready! Keep it fresh with one more practice test." : r >= 50 ? 'Great progress! Practice your weak words next.' : "Let's get ready for your ecosystems test, one question at a time!"}</p>
      </div>
      <div class="ring" style="--p:${r}"><div><b>${r}%</b><small>ready</small></div></div>
    </section>

    <button class="test-card" data-go="test">
      <div class="tc-left"><span class="tc-tag">Most like the real test</span><b>Take a Practice Test</b>
        <div class="tc-format">${SECTIONS.map(s => `<span style="--c:${s.color}">${s.n} ${s.name.toLowerCase()}</span>`).join('')}</div>
        ${state.tests.length ? `<small>Last score: <b>${state.tests[state.tests.length - 1].pct}%</b> · Best: <b>${best}%</b></small>` : '<small>21 questions · no timer · graded at the end</small>'}</div>
      <div class="tc-art">${icon('producer')}</div>
    </button>

    <h3 class="h-sec">Practice one section</h3>
    <div class="drills">
      ${SECTIONS.map(s => `<button class="drill-card" data-drill="${s.key}" style="--c:${s.color}"><span class="dc-badge">${s.short}</span><b>${s.name}</b><small>${{ mc: '8 questions, 4 choices', sa: 'Type the word, give examples, explain', match: 'Match 8 words to definitions', tf: '8 statements, with why' }[s.key]}</small></button>`).join('')}
    </div>

    <div class="extras">
      <button class="extra-card ec-weak" data-drill="weak"><div class="ec-ico">${heart(true)}</div><div><b>My Weak Words</b><small>${weak.length ? `${weak.length} word${weak.length === 1 ? '' : 's'} to practice` : 'None yet! Take a test to find them.'}</small></div></button>
      <button class="extra-card ec-cards" data-go="cards"><div class="ec-ico">${icon('ladybug')}</div><div><b>Flashcards</b><small>All ${TERMS.length} words with memory tricks</small></div></button>
    </div>

    ${tests.length ? `<h3 class="h-sec">My practice tests</h3>
    <div class="history">${tests.map(t => `<div class="hbar"><div class="hb-fill" style="height:${Math.max(6, t.pct)}%;background:${t.pct >= 90 ? '#7fd8be' : t.pct >= 70 ? '#ffd24d' : '#ff9eb8'}"></div><b>${t.pct}%</b><small>${fmtDate(t.date)}</small></div>`).join('')}</div>` : ''}

    <h3 class="h-sec">Word mastery</h3>
    <div class="mastery">${Object.entries(GROUPS).map(([g, info]) => {
      const ts = TERMS.filter(t => t.group === g);
      const p = Math.round(100 * ts.reduce((a, t) => a + masteryLevel(t.id), 0) / (ts.length * 3));
      return `<div class="mg"><span>${info.name}</span><div class="mg-bar"><i style="width:${p}%;background:${info.color}"></i></div><b>${p}%</b></div>`;
    }).join('')}</div>

    <a class="game-link" href="${GAME}"><span>${mochi({ mood: 'yum' })}</span><div><b>Done studying? Play Mochi's Mini Kitchen</b><small>Every correct answer here earns coins for your kitchen!</small></div><i>›</i></a>`;
  root.appendChild(el);
  $$('[data-go]', el).forEach(b => b.onclick = () => { unlock(); sfx('pop'); go(b.dataset.go); });
  $$('[data-drill]', el).forEach(b => b.onclick = () => {
    unlock(); sfx('pop');
    if (b.dataset.drill === 'weak' && !weak.length) return toast('No weak words yet. Take a practice test first!');
    go('drill', { kind: b.dataset.drill });
  });
  return () => bar._off && bar._off();
});

/* ------------------------------------------------------------------ */
/* PRACTICE TEST                                                       */
/* ------------------------------------------------------------------ */
register('test', (root) => {
  const bar = tb('Practice Test'); root.appendChild(bar);
  const items = makeTest();
  let page = 0; // 0..items.length (last = review)
  const el = document.createElement('div'); el.className = 'scr-test'; root.appendChild(el);
  // point slots for the progress strip
  const slots = items.flatMap((it, i) => it.type === 'match' ? it.pairs.map((_, k) => ({ i, k })) : [{ i }]);
  const secOf = (it) => SECTIONS.find(s => s.key === it.section);
  const numberOf = (i) => items.slice(0, i).reduce((a, it) => a + (it.type === 'match' ? it.pairs.length : 1), 0) + 1;

  function strip() {
    return `<div class="strip">${slots.map(s => {
      const it = items[s.i], sec = secOf(it);
      const done = it.type === 'match' ? !!(it.resp && it.resp[s.k]) : answered(it);
      return `<i class="${done ? 'done' : ''} ${s.i === page ? 'cur' : ''}" style="--c:${sec.color}"></i>`;
    }).join('')}</div>`;
  }
  function show() {
    window.scrollTo(0, 0);
    if (page >= items.length) return review();
    const it = items[page], sec = secOf(it);
    const inSec = items.filter(x => x.section === it.section);
    const k = inSec.indexOf(it) + 1;
    el.innerHTML = `${strip()}
      <div class="sec-head" style="--c:${sec.color}"><span>Part ${'ABCD'[SECTIONS.indexOf(sec)]} · ${sec.name}</span><small>${it.type === 'match' ? `Questions ${numberOf(page)}–${numberOf(page) + 7}` : `Question ${numberOf(page)} of 21${inSec.length > 1 ? ` · ${k} of ${inSec.length} in this part` : ''}`}</small></div>
      <div class="item-host"></div>
      <div class="test-nav"><button class="small-btn ghost back" ${page === 0 ? 'disabled' : ''}>‹ Back</button><button class="big-btn next">${page === items.length - 1 ? 'Review answers' : 'Next ›'}</button></div>`;
    renderItem($('.item-host', el), it, { mode: 'test', onChange: () => { $('.strip', el).outerHTML = strip(); } });
    $('.back', el).onclick = () => { sfx('tap'); page--; show(); };
    $('.next', el).onclick = () => { sfx('tap'); page++; show(); };
  }
  function review() {
    const missing = items.map((it, i) => ({ it, i })).filter(x => !answered(x.it));
    el.innerHTML = `${strip()}
      <div class="review">
        <div class="rv-m">${mochi({ mood: missing.length ? 'wow' : 'happy', glasses: true, hat: false })}</div>
        <h2>Ready to hand it in?</h2>
        <div class="rv-secs">${SECTIONS.map(s => { const its = items.filter(x => x.section === s.key); const a = its.filter(answered).length; return `<div style="--c:${s.color}"><b>${s.name}</b><span>${a}/${its.length} answered</span></div>`; }).join('')}</div>
        ${missing.length ? `<p class="rv-warn">You skipped ${missing.length} question${missing.length > 1 ? 's' : ''}. On a real test, always write <i>something</i>!</p>
          <div class="rv-jump">${missing.map(x => `<button class="chip" data-p="${x.i}">Question ${numberOf(x.i)}</button>`).join('')}</div>` : '<p>Every question answered. Nice!</p>'}
        <div class="test-nav"><button class="small-btn ghost back">‹ Back</button><button class="big-btn submit">Submit test</button></div>
      </div>`;
    $$('[data-p]', el).forEach(b => b.onclick = () => { sfx('tap'); page = +b.dataset.p; show(); });
    $('.back', el).onclick = () => { sfx('tap'); page = items.length - 1; show(); };
    $('.submit', el).onclick = () => { sfx('pop'); selfGrade(0); };
  }
  // Mark the "explain" short answers together, like a teacher would
  function selfGrade(n) {
    const ex = items.filter(it => it.type === 'sa-explain');
    if (n >= ex.length) return results();
    window.scrollTo(0, 0);
    const it = ex[n];
    el.innerHTML = `<div class="sg-head"><b>Marking your short answers</b><small>${n + 1} of ${ex.length}</small></div>
      <div class="q-card"><div class="q-kicker">Short Answer · Explain</div><div class="q-prompt">${esc(it.prompt)}</div><div class="q-feedback"></div></div>`;
    selfCheck($('.q-feedback', el), it, it.resp, (ok) => { it.self = ok; sfx(ok ? 'correct' : 'tap'); selfGrade(n + 1); });
  }
  function results() {
    window.scrollTo(0, 0);
    const per = SECTIONS.map(s => { const its = items.filter(x => x.section === s.key); const g = its.map(grade); return { s, pts: g.reduce((a, x) => a + x.pts, 0), max: g.reduce((a, x) => a + x.max, 0) }; });
    const pts = per.reduce((a, x) => a + x.pts, 0), max = per.reduce((a, x) => a + x.max, 0);
    const pct = Math.round(100 * pts / max);
    // update mastery
    items.forEach(it => {
      if (it.type === 'match') it.pairs.forEach((p, k) => record(p.termId, (it.resp || {})[k] === p.termId));
      else record(it.termId, grade(it).pts === 1);
    });
    state.tests.push({ date: Date.now(), pct, pts, max, secs: per.map(x => [x.s.key, x.pts, x.max]) });
    if (state.tests.length > 30) state.tests.shift();
    const coins = pts * 5;
    const bonus = pct >= 90;
    if (bonus) state.tokens += 1;
    save(); addCoins(coins);
    const missed = [];
    items.forEach((it, i) => {
      if (it.type === 'match') it.pairs.forEach((p, k) => { const got = (it.resp || {})[k]; if (got !== p.termId) missed.push({ n: numberOf(i) + k, q: p.def, yours: got ? T[got].term : '(blank)', right: p.term, termId: p.termId, sec: 'Matching' }); });
      else if (grade(it).pts < 1) missed.push({ n: numberOf(i), q: it.prompt, yours: yourText(it), right: correctText(it), termId: it.termId, sec: secOf(it).name, fix: it.fix, item: it });
    });
    const msg = pct >= 95 ? 'WOW! You are SO ready!' : pct >= 85 ? 'Amazing work! Almost perfect!' : pct >= 70 ? 'Good job! A little more practice and you\'ll ace it.' : pct >= 50 ? 'Nice try! Let\'s practice the ones you missed.' : 'That\'s okay! Practice makes perfect. Let\'s review.';
    el.innerHTML = `
      <div class="results-s">
        <div class="rs-top">
          <div class="rs-m">${mochi({ mood: pct >= 85 ? 'star' : pct >= 60 ? 'happy' : 'normal', glasses: true, hat: false })}</div>
          <div class="rs-score"><b>${pts}<span>/${max}</span></b><div class="rs-pct">${pct}%</div></div>
        </div>
        <p class="rs-msg">${msg}</p>
        <div class="rs-secs">${per.map(x => `<div class="rs-sec" style="--c:${x.s.color}"><span>${x.s.name}</span><div class="mg-bar"><i style="width:${100 * x.pts / x.max}%;background:${x.s.color}"></i></div><b>${x.pts}/${x.max}</b></div>`).join('')}</div>
        <div class="rs-reward">${coin()}<span><b>+${coins} coins</b> for Mochi's kitchen${bonus ? ' · <b>+1 free blind box</b> for scoring 90%+!' : ''}</span></div>
        ${missed.length ? `<h3 class="h-sec">Let's fix these (${missed.length})</h3>
        <div class="missed">${missed.map(m => `<div class="miss">
          <div class="mi-head"><span class="mi-n">#${m.n}</span><small>${m.sec}</small></div>
          <p class="mi-q">${esc(m.q)}</p>
          <div class="mi-ans"><span class="yours">Your answer: ${esc(m.yours)}</span><span class="right">${m.item && m.item.type === 'sa-explain' ? 'Full-marks answer' : 'Correct'}: <b>${esc(m.right)}</b></span></div>
          ${m.fix ? `<p class="fix">${esc(m.fix)}</p>` : ''}
          ${m.termId ? `<p class="mi-tip"><b>${T[m.termId].term}:</b> ${esc(T[m.termId].tip)}</p>` : ''}</div>`).join('')}</div>` : '<p class="perfect">Perfect score! Every single answer was right!</p>'}
        <div class="test-nav col">
          ${missed.length ? `<button class="big-btn alt b-fix">Practice my mistakes</button>` : ''}
          <button class="big-btn b-again">Take another practice test</button>
          <button class="small-btn ghost b-home">Back to Test Prep</button>
        </div>
      </div>`;
    sfx(pct >= 70 ? 'fanfare' : 'ding');
    if (pct >= 70) confetti(pct >= 90 ? 180 : 90);
    if (pct >= 95) rain(100);
    const fx = $('.b-fix', el); if (fx) fx.onclick = () => { sfx('pop'); go('drill', { kind: 'mixed', ids: [...new Set(missed.map(m => m.termId).filter(Boolean))] }); };
    $('.b-again', el).onclick = () => { sfx('pop'); go('test'); };
    $('.b-home', el).onclick = () => { sfx('tap'); go('home'); };
  }
  show();
  return () => bar._off && bar._off();
});
function yourText(it) {
  if (it.resp == null || it.resp === '') return '(blank)';
  if (it.type === 'mc') return it.options[it.resp].label;
  if (it.type === 'tf') return it.resp ? 'True' : 'False';
  return String(it.resp);
}

/* ------------------------------------------------------------------ */
/* DRILLS                                                              */
/* ------------------------------------------------------------------ */
const DRILL_NAME = { mc: 'Multiple Choice', sa: 'Short Answer', match: 'Matching', tf: 'True or False', weak: 'Weak Words', mixed: 'Fix My Mistakes' };
register('drill', (root, { kind = 'mc', ids = null } = {}) => {
  const bar = tb(DRILL_NAME[kind]); root.appendChild(bar);
  const el = document.createElement('div'); el.className = 'scr-drill'; root.appendChild(el);
  const pool = kind === 'weak' ? weakTerms() : ids;
  let queue = [];
  const N = 8;
  if (kind === 'mc') queue = pickTerms(N, pool || undefined).map(makeMC);
  else if (kind === 'tf') { const seen = new Set(); let tries = 0; while (queue.length < N && tries++ < 60) { const q = makeTFItem(Math.random() < .5 ? pick(pickTerms(3)) : null); if (!seen.has(q.prompt)) { seen.add(q.prompt); queue.push(q); } } }
  else if (kind === 'sa') { const kinds = shuffle(['term', 'term', 'term', 'explain', 'explain', 'list', 'list', 'term']); queue = pickTerms(N).map((id, i) => makeSA(id, kinds[i])); }
  else if (kind === 'match') queue = [makeMatch(8)];
  else { // weak / mixed: rotate types over the chosen words, twice through
    const base = pool && pool.length ? pool : pickTerms(6);
    const order = shuffle([...base, ...base]).slice(0, Math.max(6, Math.min(12, base.length * 2)));
    const makers = [makeMC, (id) => makeSA(id, 'term'), makeTFItem, makeMC, (id) => makeSA(id)];
    queue = order.map((id, i) => makers[i % makers.length](id));
    if (base.length >= 4) queue.splice(Math.floor(queue.length / 2), 0, makeMatch(Math.min(8, base.length), base));
  }
  let i = 0, pts = 0, max = 0, streak = 0;
  function show() {
    window.scrollTo(0, 0);
    if (i >= queue.length) return done();
    el.innerHTML = `<div class="d-top"><div class="d-prog"><i style="width:${100 * i / queue.length}%"></i></div><span>${i + 1} / ${queue.length}</span>${streak >= 2 ? `<span class="streak">${streak} in a row!</span>` : ''}</div><div class="item-host"></div>`;
    renderItem($('.item-host', el), queue[i], {
      mode: 'drill', onDone: (g) => {
        pts += g.pts; max += g.max; streak = g.pts === g.max ? streak + 1 : 0;
        i++; show();
      },
    });
  }
  function done() {
    const pct = max ? Math.round(100 * pts / max) : 0;
    const coins = pts * 3;
    addCoins(coins);
    el.innerHTML = `<div class="d-done">
      <div class="rs-m">${mochi({ mood: pct >= 80 ? 'star' : pct >= 50 ? 'happy' : 'normal', glasses: true, hat: false })}</div>
      <h2>${pct >= 90 ? 'Fantastic!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good practice!' : 'Keep going, you\'re learning!'}</h2>
      <div class="rs-score"><b>${pts}<span>/${max}</span></b><div class="rs-pct">${pct}%</div></div>
      <div class="rs-reward">${coin()}<span><b>+${coins} coins</b> for Mochi's kitchen</span></div>
      <div class="test-nav col"><button class="big-btn b-again">Practice again</button><button class="big-btn alt b-test">Take a practice test</button><button class="small-btn ghost b-home">Back to Test Prep</button></div></div>`;
    sfx(pct >= 70 ? 'fanfare' : 'ding'); if (pct >= 80) confetti(100);
    $('.b-again', el).onclick = () => { sfx('pop'); go('drill', { kind, ids }); };
    $('.b-test', el).onclick = () => { sfx('pop'); go('test'); };
    $('.b-home', el).onclick = () => { sfx('tap'); go('home'); };
  }
  show();
  return () => bar._off && bar._off();
});

/* ------------------------------------------------------------------ */
/* FLASHCARDS                                                          */
/* ------------------------------------------------------------------ */
register('cards', (root, { group = 'all', reverse = false } = {}) => {
  const bar = tb('Flashcards'); root.appendChild(bar);
  const el = document.createElement('div'); el.className = 'scr-cards'; root.appendChild(el);
  let deck = shuffle(TERMS.filter(t => group === 'all' || t.group === group)), known = 0;
  const total = deck.length;
  function show() {
    if (!deck.length) {
      el.innerHTML = `<div class="d-done"><div class="rs-m">${mochi({ mood: 'love', glasses: true, hat: false })}</div><h2>You went through all ${total} cards!</h2>
        <div class="test-nav col"><button class="big-btn b-again">Shuffle again</button><button class="big-btn alt b-quiz">Quiz me on these</button><button class="small-btn ghost b-home">Back</button></div></div>`;
      sfx('fanfare'); confetti(80);
      $('.b-again', el).onclick = () => go('cards', { group, reverse });
      $('.b-quiz', el).onclick = () => go('drill', { kind: 'mixed', ids: TERMS.filter(t => group === 'all' || t.group === group).map(t => t.id) });
      $('.b-home', el).onclick = () => go('home');
      return;
    }
    const t = deck[0];
    el.innerHTML = `
      <div class="fc-opts">
        <select class="grp"><option value="all">All words</option>${Object.entries(GROUPS).map(([k, g]) => `<option value="${k}" ${k === group ? 'selected' : ''}>${g.name}</option>`).join('')}</select>
        <label><input type="checkbox" class="rev" ${reverse ? 'checked' : ''}> Show definition first</label>
      </div>
      <div class="fc-count">${known} known · ${deck.length} to go</div>
      <div class="flip-wrap"><div class="flip" style="--gc:${GROUPS[t.group].color}">
        <div class="face front">${reverse
          ? `<p class="fc-def big">${esc(t.def)}.</p><small>What's the word? Tap to flip</small>`
          : `<div class="fc-icon">${icon(t.icon)}</div><h2>${t.term}</h2><small>tap to flip</small>`}</div>
        <div class="face back"><h3>${t.term}</h3><p class="fc-def">${esc(t.def)}.</p>
          <div class="fc-tip"><span class="fc-m">${mochi({ mood: 'happy', glasses: true, hat: false })}</span><div><b>Memory trick</b>${esc(t.tip)}</div></div>
          <p class="fc-ex"><b>Example:</b> ${esc(t.ex)}</p></div>
      </div></div>
      <div class="fc-btns"><button class="small-btn learn">Still learning</button><button class="small-btn speak">Read aloud</button><button class="big-btn know">I know it!</button></div>`;
    const f = $('.flip', el);
    f.onclick = () => { sfx('whoosh'); f.classList.toggle('flipped'); };
    $('.learn', el).onclick = () => { sfx('tap'); deck.push(deck.shift()); show(); };
    $('.know', el).onclick = () => { sfx('correct'); deck.shift(); known++; show(); };
    $('.speak', el).onclick = () => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(`${t.term}. ${t.def}.`); u.rate = .95; speechSynthesis.speak(u); } catch { } };
    $('.grp', el).onchange = (e) => go('cards', { group: e.target.value, reverse }, { instant: true });
    $('.rev', el).onchange = (e) => { reverse = e.target.checked; show(); };
  }
  show();
  return () => { bar._off && bar._off(); try { speechSynthesis.cancel(); } catch { } };
});

/* ------------------------------------------------------------------ */
document.addEventListener('pointerdown', () => unlock(), { once: true });
const qs = new URLSearchParams(location.search);
const start = qs.get('screen');
go(start && screens[start] ? start : 'home', { kind: qs.get('kind') || undefined }, { instant: true });
