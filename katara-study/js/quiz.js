// Renders one test item. mode 'test' = just record answers (like the real test);
// mode 'drill' = check right away and explain.
import { mochi } from '../../katara-kitchen/js/art.js';
import { T } from '../../katara-kitchen/js/content.js';
import { record } from '../../katara-kitchen/js/state.js';
import { sfx } from '../../katara-kitchen/js/audio.js';
import { sparkle, centerOf } from '../../katara-kitchen/js/fx.js';
import { esc } from '../../katara-kitchen/js/ui.js';
import { checkTerm, checkList, checkExplain, grade, correctText } from './items.js';

const KICKER = { mc: 'Multiple Choice', tf: 'True or False', 'sa-term': 'Short Answer · Write the word', 'sa-list': 'Short Answer · Give examples', 'sa-explain': 'Short Answer · Explain', match: 'Matching' };
const L = 'ABCD';
const $ = (s, r) => r.querySelector(s), $$ = (s, r) => [...r.querySelectorAll(s)];

export function explainHTML(item) {
  const t = item.termId && T[item.termId];
  let h = '';
  if (item.type === 'tf' && item.fix) h += `<p class="fix"><b>Why:</b> ${esc(item.fix)}</p>`;
  if (t) h += `<div class="why"><span class="why-m">${mochi({ mood: 'happy', glasses: true, hat: false })}</span><div><b>${t.term}</b>: ${esc(t.def)}.<br><i>${esc(t.tip)}</i></div></div>`;
  return h;
}

let _q = 0; const uidq = () => `${Date.now().toString(36)}${++_q}`;
export function renderItem(el, item, { mode = 'drill', onChange = () => { }, onDone = () => { } } = {}) {
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  const drill = mode === 'drill';
  el.innerHTML = `<div class="q-card q-${item.type}">
    <div class="q-kicker">${KICKER[item.type]}</div>
    ${item.type === 'match' ? '' : `<div class="q-prompt">${item.type === 'sa-term' ? `<small>Write the vocabulary word that matches:</small>` : ''}${esc(item.prompt)}</div>`}
    <div class="q-body"></div>
    <div class="q-feedback hidden"></div>
  </div>`;
  const body = $('.q-body', el), fb = $('.q-feedback', el);
  let locked = false;

  const finish = (ok, extra = '') => {
    locked = true;
    const g = grade(item);
    if (item.type !== 'match') record(item.termId, !!ok);
    sfx(ok ? 'correct' : 'wrong');
    if (ok) { const c = centerOf(el.querySelector('.q-card')); sparkle(c.x, c.y - 40, 12); }
    fb.className = 'q-feedback ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<div class="fb-head">${ok ? pick(['Correct!', 'Yes! Nice!', 'You got it!', 'Perfect!']) : 'Not quite'}</div>
      ${extra}${!ok && item.type !== 'sa-explain' && item.type !== 'match' ? `<p class="fb-ans">Answer: <b>${esc(correctText(item))}</b></p>` : ''}
      ${explainHTML(item)}
      <button class="big-btn next">Next ›</button>`;
    $('.next', fb).onclick = () => { sfx('tap'); onDone(g); };
    setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  };

  if (item.type === 'mc' || item.type === 'tf') {
    const opts = item.type === 'mc' ? item.options.map(o => o.label) : ['True', 'False'];
    body.innerHTML = `<div class="opts ${item.type === 'tf' ? 'tf' : ''}">${opts.map((o, i) => `<button class="opt ${item.resp === (item.type === 'tf' ? i === 0 : i) ? 'sel' : ''}" data-i="${i}"><span class="ol">${item.type === 'tf' ? (i ? 'F' : 'T') : L[i]}</span><span class="otx">${esc(o)}</span></button>`).join('')}</div>`;
    $$('.opt', body).forEach(b => b.onclick = () => {
      if (locked) return;
      const i = +b.dataset.i;
      item.resp = item.type === 'tf' ? i === 0 : i;
      $$('.opt', body).forEach(x => x.classList.toggle('sel', x === b));
      sfx('tap'); onChange();
      if (drill) {
        const ok = grade(item).pts === 1;
        const right = item.type === 'tf' ? (item.answer ? 0 : 1) : item.options.findIndex(o => o.correct);
        $$('.opt', body).forEach((x, k) => { x.classList.toggle('right', k === right); x.classList.toggle('wrong', k === i && !ok); x.disabled = true; });
        finish(ok);
      }
    });
  }

  else if (item.type === 'sa-term') {
    body.innerHTML = `<input class="sa-input" type="text" name="ans-${uidq()}" id="ans-${uidq()}" placeholder="Type the word..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="${esc(item.resp || '')}">
      ${drill ? `<div class="sa-actions"><button class="small-btn ghost hint">Hint</button><button class="big-btn check">Check</button></div>` : ''}`;
    const inp = $('input', body);
    inp.value = item.resp || ''; // set explicitly: Safari can carry text over from the previous box
    inp.oninput = () => { item.resp = inp.value; onChange(); };
    if (drill) {
      let hints = 0;
      $('.hint', body).onclick = () => {
        hints++; sfx('tap');
        const w = item.display;
        const shown = w.split(' ').map((p, k) => p.split('').map((c, j) => (j < hints ? c : '_')).join(' ')).join('   ');
        $('.hint', body).textContent = shown;
      };
      const check = () => {
        if (locked || !inp.value.trim()) return;
        const r = checkTerm(item, inp.value); inp.disabled = true;
        inp.classList.add(r.ok ? 'ok' : 'no');
        finish(r.ok, r.ok && !r.exact ? `<p class="fb-ans">Watch the spelling: <b>${esc(item.display)}</b></p>` : r.close ? `<p class="fb-ans">So close! Check the spelling.</p>` : '');
      };
      $('.check', body).onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
      setTimeout(() => inp.focus(), 100);
    }
  }

  else if (item.type === 'sa-list' || item.type === 'sa-explain') {
    body.innerHTML = `<textarea class="sa-input" name="ans-${uidq()}" autocomplete="off" rows="${item.type === 'sa-explain' ? 4 : 2}" placeholder="${item.type === 'sa-explain' ? 'Write your answer in full sentences...' : 'Type your examples...'}" spellcheck="true">${esc(item.resp || '')}</textarea>
      ${drill ? `<div class="sa-actions"><button class="big-btn check">Check</button></div>` : ''}
      ${item.type === 'sa-explain' ? `<p class="sa-tip">Tip: use the vocabulary words in your answer, just like on the test.</p>` : ''}`;
    const ta = $('textarea', body);
    ta.value = item.resp || '';
    const grow = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 6 + 'px'; };
    ta.oninput = () => { item.resp = ta.value; grow(); onChange(); };
    requestAnimationFrame(grow);
    if (drill) {
      $('.check', body).onclick = () => {
        if (locked || !ta.value.trim()) return;
        ta.disabled = true;
        if (item.type === 'sa-list') {
          const r = checkList(item, ta.value);
          finish(r.ok, `<p class="fb-ans">${r.found.length ? `I found: <b>${r.found.join(', ')}</b>. ` : ''}${r.ok ? '' : `You need ${item.need}.`}</p>`);
        } else {
          selfCheck(fb, item, ta.value, (ok) => { item.self = ok; finish(ok, `<p class="fb-ans"><b>Model answer:</b> ${esc(item.model)}</p>`); });
        }
      };
    }
  }

  else if (item.type === 'match') {
    item.resp = item.resp || {};
    let sel = null; // selected row index
    const draw = () => {
      const used = new Set(Object.values(item.resp));
      body.innerHTML = `<p class="m-help">Tap a definition, then tap the word that matches it. Tap a filled box to clear it.</p>
        <div class="bank">${item.bank.map(id => `<button class="chip-w ${used.has(id) ? 'used' : ''}" data-id="${id}">${T[id].term}</button>`).join('')}</div>
        <ol class="m-rows">${item.pairs.map((p, i) => `<li class="m-row ${sel === i ? 'sel' : ''}" data-i="${i}">
          <span class="m-num">${i + 1}</span>
          <span class="m-slot ${item.resp[i] ? 'filled' : ''}">${item.resp[i] ? T[item.resp[i]].term : '______'}</span>
          <span class="m-def">${esc(p.def)}</span></li>`).join('')}</ol>
        ${drill ? `<div class="sa-actions"><button class="big-btn check" ${Object.keys(item.resp).length < item.pairs.length ? 'disabled' : ''}>Check my matches</button></div>` : ''}`;
      $$('.m-row', body).forEach(r => r.onclick = (e) => {
        if (locked) return;
        const i = +r.dataset.i;
        if (e.target.closest('.m-slot') && item.resp[i]) { delete item.resp[i]; sel = i; sfx('tap'); onChange(); return draw(); }
        sel = sel === i ? null : i; sfx('tap'); draw();
      });
      $$('.chip-w', body).forEach(c => c.onclick = () => {
        if (locked) return;
        const id = c.dataset.id;
        let target = sel;
        if (target == null) target = item.pairs.findIndex((_, i) => !item.resp[i]);
        if (target < 0) return;
        for (const k of Object.keys(item.resp)) if (item.resp[k] === id) delete item.resp[k];
        item.resp[target] = id; sfx('pop');
        const next = item.pairs.findIndex((_, i) => !item.resp[i]);
        sel = next >= 0 ? next : null;
        onChange(); draw();
      });
      const ck = $('.check', body);
      if (ck) ck.onclick = () => {
        if (locked) return;
        locked = true; el.querySelector('.q-card').classList.add('checked');
        let pts = 0;
        $$('.m-row', body).forEach((r, i) => {
          const ok = item.resp[i] === item.pairs[i].termId; if (ok) pts++;
          record(item.pairs[i].termId, ok);
          r.classList.add(ok ? 'right' : 'wrong');
          if (!ok) r.insertAdjacentHTML('beforeend', `<span class="m-fix">Answer: <b>${item.pairs[i].term}</b></span>`);
        });
        ck.remove();
        const all = pts === item.pairs.length;
        sfx(all ? 'correct' : pts >= item.pairs.length / 2 ? 'ding' : 'wrong');
        fb.className = 'q-feedback ' + (all ? 'good' : 'bad');
        fb.innerHTML = `<div class="fb-head">${pts} / ${item.pairs.length} matched${all ? '! Perfect!' : ''}</div><button class="big-btn next">Next ›</button>`;
        $('.next', fb).onclick = () => { sfx('tap'); onDone({ pts, max: item.pairs.length }); };
        setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      };
    };
    draw();
  }
}

// Short-answer "explain" self-check: shows keywords found + model answer, she decides.
export function selfCheck(container, item, text, done) {
  const r = checkExplain(item, text);
  container.className = 'q-feedback self';
  container.innerHTML = `
    <div class="fb-head">Check your answer</div>
    <div class="sc-cols">
      <div class="sc-box"><small>Your answer</small><p>${esc(text || '(blank)')}</p></div>
      <div class="sc-box model"><small>A full-marks answer</small><p>${esc(item.model)}</p></div>
    </div>
    <div class="keys"><small>Key ideas:</small>${item.keys.map((g, i) => `<span class="key ${r.hits[i] ? 'hit' : ''}">${r.hits[i] ? '✓ ' : ''}${esc(g[0])}</span>`).join('')}</div>
    <p class="sc-q">Did your answer say the same main ideas? ${r.suggest ? '<b>Mochi thinks yes!</b>' : '<b>Mochi thinks some ideas are missing.</b>'}</p>
    <div class="sa-actions"><button class="small-btn sc-no ${!r.suggest ? 'suggest' : ''}">Not quite</button><button class="big-btn sc-yes ${r.suggest ? 'suggest' : ''}">I got it!</button></div>`;
  container.querySelector('.sc-yes').onclick = () => done(true);
  container.querySelector('.sc-no').onclick = () => done(false);
}

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
