// BAKE-OFF LIVE — a fast quiz show against rival animal chefs.
import { mochi, chefHead, CHEFS, coin, fireIcon, O, boxToken } from './art.js';
import { state, save, addCoins, record } from './state.js';
import { sfx, music } from './audio.js';
import { confetti, rain, sparkle, floatText, centerOf, wait } from './fx.js';
import { TERMS, T, GROUPS } from './content.js';
import { makeQuestion, shuffle } from './questions.js';
import { makeQuizRun } from '../../katara-study/js/items.js';
import { $, $$, go, register, topbar, esc } from './ui.js';

const NQ = 10;
const SHAPES = [
  { c: '#ff6b81', d: 'M20,34 C4,24 3,12 11,8 C16,5.5 19,9 20,11 C21,9 24,5.5 29,8 C37,12 36,24 20,34Z' },
  { c: '#5aa9ff', d: 'M20,3 L25,14 L37,15.5 L28,23.5 L30.5,35.5 L20,29.5 L9.5,35.5 L12,23.5 L3,15.5 L15,14Z' },
  { c: '#ffbf2e', d: 'M26,5 A16,16 0 1 0 36,26 A12,12 0 1 1 26,5Z' },
  { c: '#3fc79a', d: 'M10,30 C2,30 2,19 10,19 C10,11 20,8 24,14 C30,9 38,14 36,21 C41,22 40,30 34,30Z' },
];
const shape = (i) => `<svg viewBox="0 0 40 40" class="tile-shape"><path d="${SHAPES[i].d}" fill="#fff" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
const RIVALS = ['bunny', 'bear', 'frog', 'duck', 'panda'];

register('bakeoff', (root, { group = 'all' } = {}) => {
  let alive = true;
  const calm = state.settings.calm;
  const LIMIT = calm ? 45 : 20;
  const tb = topbar({ title: 'Bake-Off' });
  root.appendChild(tb);
  const el = document.createElement('div'); el.className = 'bakeoff'; root.appendChild(el);

  const players = [{ id: 'me', kind: 'mochi', name: 'Katara', score: 0, streak: 0, me: true, correct: 0 },
    ...shuffle(RIVALS).slice(0, 4).map((k, i) => ({ id: k, kind: k, name: CHEFS[k].name, score: 0, streak: 0, acc: [0.72, 0.64, 0.58, 0.5][i] + Math.random() * 0.06, speed: 0.3 + Math.random() * 0.4, correct: 0 }))];
  const me = players[0];

  /* ---------------- lobby ---------------- */
  function lobby() {
    music('quiz');
    const groups = [['all', 'Everything'], ...Object.entries(GROUPS).map(([k, v]) => [k, v.name])];
    el.innerHTML = `
      <div class="bo-lobby">
        <div class="bo-banner"><span>The Great</span><b>Mochi Bake-Off</b></div>
        <div class="bo-players">${players.map((p, i) => `<div class="bo-p" style="animation-delay:${i * .15}s">${chefHead(p.kind, p.me ? 'happy' : 'normal')}<b>${p.name}</b></div>`).join('')}</div>
        <p class="bo-rules">${NQ} questions. Answer <b>fast</b> for more points. Get a streak for bonus points! Top 3 win coins, 1st place wins a <b>blind box</b>!</p>
        <div class="bo-topic"><span>Topic:</span>${groups.map(([k, n]) => `<button class="chip ${k === group ? 'on' : ''}" data-g="${k}">${n}</button>`).join('')}</div>
        <button class="big-btn bo-start">Start the Bake-Off!</button>
      </div>`;
    $$('.chip', el).forEach(c => c.onclick = () => { group = c.dataset.g; sfx('tap'); $$('.chip', el).forEach(x => x.classList.toggle('on', x === c)); });
    $('.bo-start', el).onclick = () => { sfx('pop'); run(); };
  }

  /* ---------------- question loop ---------------- */
  async function run() {
    const ids = TERMS.filter(t => group === 'all' || t.group === group).map(t => t.id);
    // built so no question (or the answer shown after it) gives away a later one
    const qs = (makeQuizRun(NQ, ids) || []).map(it => it.type === 'tf'
      ? { kind: 'mc', tf: true, prompt: it.prompt, termId: it.termId, options: [{ label: 'True', correct: it.answer }, { label: 'False', correct: !it.answer }] }
      : { kind: 'mc', prompt: it.prompt, termId: it.termId, options: it.options, style: it.style });
    while (qs.length < NQ) qs.push(makeQuestion(ids, { allowLong: true, nOpts: 4, recent: qs.map(q => q.termId) }));
    for (let qi = 0; qi < NQ && alive; qi++) {
      const q = qs[qi];
      await askQuestion(q, qi);
      if (!alive) return;
      await scoreboard(qi);
    }
    if (alive) podium();
  }

  function askQuestion(q, qi) {
    return new Promise(async (resolve) => {
      el.innerHTML = `
        <div class="bo-q">
          <div class="bo-top"><span class="pill qnum">Question ${qi + 1} of ${NQ}</span><span class="pill answers-count">0 answers</span></div>
          <div class="bo-card"><div class="bo-peek">${chefHead('mochi', 'normal')}</div><div class="bo-prompt"></div><div class="bo-ready"><i></i></div></div>
          <div class="bo-mid"><div class="bo-timer hidden"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="tr-bg"/><circle cx="50" cy="50" r="44" class="tr-fg"/></svg><b>${LIMIT}</b></div></div>
          <div class="bo-tiles ${q.options.length === 2 ? 'two' : ''} ${q.style === 'longopts' ? 'long' : ''}"></div>
          <div class="bo-result"></div>
        </div>`;
      const pr = $('.bo-prompt', el);
      pr.textContent = q.prompt;
      pr.style.fontSize = q.prompt.length > 140 ? '1.05em' : q.prompt.length > 90 ? '1.2em' : '1.4em';
      sfx('whoosh');
      await wait(calm ? 2600 : 2000);
      if (!alive) return;
      $('.bo-ready', el).remove();
      // tiles
      const tiles = $('.bo-tiles', el);
      q.options.forEach((o, i) => {
        const b = document.createElement('button');
        const si = q.tf ? (o.label === 'True' ? 1 : 0) : i;
        b.className = 'tile'; b.style.setProperty('--tc', SHAPES[si].c); b.style.animationDelay = i * 0.06 + 's';
        b.innerHTML = `${shape(si)}<span>${esc(o.label)}</span>`;
        b.onclick = () => answer(i);
        tiles.appendChild(b);
      });
      const timerEl = $('.bo-timer', el); timerEl.classList.remove('hidden');
      const fg = $('.tr-fg', el), num = $('b', timerEl);
      const C = 2 * Math.PI * 44; fg.style.strokeDasharray = C;
      const t0 = performance.now();
      let done = false, npcAnswered = 0, raf, lastSec = LIMIT;
      // NPC answer times
      players.forEach(p => { if (!p.me) { p.ansT = (0.25 + p.speed * 0.5 + Math.random() * 0.35) * Math.min(LIMIT, 20); p.ok = Math.random() < p.acc; p.done = false; } });
      const tick = () => {
        if (!alive) return;
        const el2 = (performance.now() - t0) / 1000, left = Math.max(0, LIMIT - el2);
        fg.style.strokeDashoffset = C * (1 - left / LIMIT);
        num.textContent = Math.ceil(left);
        timerEl.classList.toggle('low', left <= 5);
        if (Math.ceil(left) !== lastSec) { lastSec = Math.ceil(left); if (left <= 5 && left > 0) sfx('tick'); }
        players.forEach(p => { if (!p.me && !p.done && el2 >= p.ansT) { p.done = true; npcAnswered++; $('.answers-count', el).textContent = `${npcAnswered + (done ? 1 : 0)} answer${npcAnswered + (done ? 1 : 0) === 1 ? "" : "s"}`; } });
        if (left <= 0) { if (!done) answer(-1); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      async function answer(i) {
        if (done) return; done = true; cancelAnimationFrame(raf);
        const elapsed = (performance.now() - t0) / 1000;
        const correct = i >= 0 && q.options[i].correct;
        const btns = $$('.tile', el);
        btns.forEach((b, k) => { b.disabled = true; if (k !== i) b.classList.add('dim'); });
        if (i >= 0) btns[i].classList.add('picked');
        $('.answers-count', el).textContent = `${npcAnswered + 1} answer${npcAnswered ? "s" : ""}`;
        // wait for remaining NPCs quickly (they "lock in")
        sfx('tap');
        await wait(500);
        if (!alive) return;
        // score NPCs
        players.forEach(p => {
          if (p.me) return;
          const ok = p.ok;
          if (ok) { p.streak++; p.correct++; p.gain = Math.round(500 + 500 * (1 - Math.min(p.ansT, LIMIT) / LIMIT)) + Math.min(5, p.streak - 1) * 100; }
          else { p.streak = 0; p.gain = 0; }
          p.score += p.gain;
        });
        // score me
        if (correct) { me.streak++; me.correct++; me.gain = Math.round(500 + 500 * (1 - elapsed / LIMIT)) + Math.min(5, me.streak - 1) * 100; }
        else { me.streak = 0; me.gain = 0; }
        me.score += me.gain;
        record(q.termId, correct);
        // reveal
        btns.forEach((b, k) => { b.classList.toggle('right', q.options[k].correct); if (q.options[k].correct) b.classList.remove('dim'); else b.classList.add('dim'); });
        const res = $('.bo-result', el);
        const right = q.options.find(o => o.correct).label;
        const t = T[q.termId];
        if (correct) {
          sfx('correct');
          res.className = 'bo-result show good';
          res.innerHTML = `<div class="br-head">Correct!</div><div class="br-pts">+${me.gain}</div>${me.streak >= 2 ? `<div class="br-streak">${fireIcon()}Answer streak ${me.streak}${me.streak >= 2 ? ` <small>+${Math.min(5, me.streak - 1) * 100} bonus</small>` : ''}</div>` : ''}`;
          const c = centerOf(btns[i]); sparkle(c.x, c.y, 18); floatText(`+${me.gain}`, c.x, c.y - 30, 'ft-gold');
          $('.bo-peek', el).innerHTML = chefHead('mochi', 'happy');
        } else {
          sfx('wrong');
          res.className = 'bo-result show bad';
          res.innerHTML = `<div class="br-head">${i < 0 ? "Time's up!" : 'Not quite!'}</div><div class="br-ans">Answer: <b>${esc(right)}</b></div>${t ? `<div class="br-tip">${t.tip}</div>` : ''}`;
          $('.bo-peek', el).innerHTML = chefHead('mochi', 'sad');
        }
        const nextBtn = document.createElement('button'); nextBtn.className = 'small-btn next-btn'; nextBtn.textContent = 'Next ›';
        res.appendChild(nextBtn);
        requestAnimationFrame(() => res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
        let moved = false;
        const move = () => { if (moved) return; moved = true; sfx('tap'); resolve(); };
        nextBtn.onclick = move;
        setTimeout(move, correct ? 2600 : 5200);
      }
    });
  }

  function scoreboard(qi) {
    return new Promise(async (resolve) => {
      const prevOrder = [...players].sort((a, b) => (b.score - b.gain) - (a.score - a.gain));
      const order = [...players].sort((a, b) => b.score - a.score);
      el.innerHTML = `<div class="bo-board"><h2>Scoreboard</h2><div class="rows"></div><button class="big-btn bo-next">${qi === NQ - 1 ? 'See the winners!' : 'Next question'}</button></div>`;
      const rows = $('.rows', el);
      prevOrder.forEach((p, idx) => {
        const r = document.createElement('div'); r.className = 'row' + (p.me ? ' me' : ''); r.dataset.id = p.id;
        r.innerHTML = `<span class="rank">${idx + 1}</span>${chefHead(p.kind, p.gain > 0 ? 'happy' : 'normal')}<b class="nm">${p.name}</b>${p.streak >= 2 ? `<span class="stk">${fireIcon()}${p.streak}</span>` : ''}<span class="gain">${p.gain ? '+' + p.gain : ''}</span><span class="sc">${p.score - p.gain}</span>`;
        rows.appendChild(r);
      });
      sfx('drum');
      await wait(700);
      if (!alive) return;
      // FLIP reorder
      const first = new Map($$('.row', rows).map(r => [r.dataset.id, r.getBoundingClientRect().top]));
      order.forEach((p, idx) => { const r = $(`.row[data-id="${p.id}"]`, rows); rows.appendChild(r); $('.rank', r).textContent = idx + 1; $('.sc', r).textContent = p.score; });
      $$('.row', rows).forEach(r => {
        const dy = first.get(r.dataset.id) - r.getBoundingClientRect().top;
        if (dy) r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.3,1.4,.5,1)' });
      });
      sfx('ding');
      const myRank = order.indexOf(me) + 1;
      if (myRank === 1) { const r = $('.row.me', rows); setTimeout(() => { const c = centerOf(r); sparkle(c.x, c.y, 16); }, 600); }
      let moved = false;
      const move = () => { if (moved) return; moved = true; sfx('pop'); resolve(); };
      $('.bo-next', el).onclick = move;
      setTimeout(move, 4200);
    });
  }

  async function podium() {
    music(null);
    const order = [...players].sort((a, b) => b.score - a.score);
    const place = order.indexOf(me) + 1;
    const reward = [150, 100, 70, 40, 40][place - 1] + me.correct * 10;
    el.innerHTML = `
      <div class="bo-podium">
        <h2>And the winners are...</h2>
        <div class="podium">
          ${[1, 0, 2].map(i => { const p = order[i]; return `<div class="pod pod${i + 1} ${p.me ? 'me' : ''}">
            <div class="pod-head">${chefHead(p.kind, 'happy')}<b>${p.name}</b><small>${p.score} pts</small></div>
            <div class="pod-block"><span>${i + 1}</span></div></div>`; }).join('')}
        </div>
        <div class="bo-final hidden">
          <div class="bf-mochi">${mochi({ mood: place === 1 ? 'star' : place <= 3 ? 'happy' : 'normal' })}</div>
          <div class="bf-text"><b>${place === 1 ? 'You WON the Bake-Off!' : place <= 3 ? `You got ${['', '1st', '2nd', '3rd'][place]} place!` : `You got ${place}th place. Keep practicing!`}</b>
          <span>${me.correct}/${NQ} correct · <span class="gold">+${reward} coins</span>${place === 1 ? ` · +1 blind box` : ''}</span></div>
          <div class="modal-actions"><button class="small-btn ghost" data-a="home">Kitchen</button><button class="big-btn" data-a="again">Play again</button></div>
        </div>
      </div>`;
    sfx('drum');
    for (const i of [2, 1, 0]) {
      await wait(i === 0 ? 1400 : 900);
      if (!alive) return;
      const pod = $(`.pod${i + 1}`, el); pod.classList.add('show'); sfx(i === 0 ? 'fanfare' : 'ding');
      if (i === 0) { music('podium'); confetti(160); }
    }
    await wait(900);
    if (!alive) return;
    state.stats.bakeoffs++; if (place === 1) { state.stats.wins++; state.tokens += 1; }
    save(); addCoins(reward);
    $('.bo-final', el).classList.remove('hidden');
    if (place <= 3) rain(90);
    $$('[data-a]', el).forEach(b => b.onclick = () => { sfx('pop'); b.dataset.a === 'again' ? go('bakeoff', { group }) : go('hub'); });
  }

  lobby();
  return () => { alive = false; tb._off && tb._off(); };
});
