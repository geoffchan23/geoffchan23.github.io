// ORDER RUSH — Overcooked-style kitchen. Every order ticket is a question;
// tap the right ingredient jar to cook it before the customer runs out of patience.
import { mochi, food, icon, coin, star, fireIcon, lockIcon, clockIcon, extinguisher, O } from './art.js';
import { state, save, addCoins, record } from './state.js';
import { sfx, music, setTempo } from './audio.js';
import { confetti, sparkle, floatText, centerOf, flyCoins, wait } from './fx.js';
import { TERMS, T, qd, GROUPS, CHAIN_ROLES } from './content.js';
import { makeQuestion, sortRound, stackRound, shuffle, pick } from './questions.js';
import { $, $$, go, register, topbar, modal, toast, esc } from './ui.js';

export const SHIFTS = [
  { id: 's1', name: 'Ecosystem Café', sub: 'Biotic, abiotic & friends', groups: ['basics'], specials: ['sort'], dish: 'cupcake', color: '#7fd8be' },
  { id: 's2', name: 'Food Chain Diner', sub: 'Who eats who?', groups: ['chain'], specials: ['stack'], dish: 'ramen', color: '#ffb37f' },
  { id: 's3', name: 'Succession Bakery', sub: 'Change & cycles', groups: ['change', 'basics'], specials: [], dish: 'bread', color: '#c7b5ff' },
  { id: 's4', name: 'Farm-to-Table Bistro', sub: 'Farming & populations', groups: ['farm', 'pop'], specials: [], dish: 'pizza', color: '#ffd24d' },
  { id: 's5', name: 'Grand Finale Feast', sub: 'Everything! Test day practice', groups: Object.keys(GROUPS), specials: ['sort', 'stack'], dish: 'layercake', color: '#ff9ec0' },
];
const STARS = [90, 200, 320];
const SHIFT_SECS = 150;
const CALM_ORDERS = 12;
const DISHES = ['cupcake', 'donut', 'croissant', 'macaron', 'cookie', 'pancakes', 'sushi', 'boba', 'bread', 'onigiri', 'shortcake', 'ramen', 'pie', 'dumplings', 'pizza', 'tart', 'pudding', 'waffle', 'icecream'];
const JARS = [
  { fill: '#fff1d6', lid: '#ff9ec0' }, { fill: '#ffc4d6', lid: '#7fd8be' },
  { fill: '#c8f1c0', lid: '#ffd24d' }, { fill: '#cfe6ff', lid: '#c7b5ff' },
];
const isUnlocked = (i) => i === 0 || (state.stars[SHIFTS[i - 1].id] || 0) >= 1;

/* ------------------------------------------------------------------ */
/* Shift map                                                           */
/* ------------------------------------------------------------------ */
register('rushmap', (root) => {
  const tb = topbar({ title: 'Order Rush' });
  root.appendChild(tb);
  const el = document.createElement('div');
  el.className = 'rushmap';
  el.innerHTML = `
    <div class="map-intro">
      <div class="map-mochi">${mochi({ mood: 'happy' })}</div>
      <div class="map-bubble">Orders are coming in! Tap the <b>jar</b> with the right answer to cook each dish. Wrong jar? <b>Fire!</b> Tap it out fast!</div>
    </div>
    <div class="map-path">
      ${SHIFTS.map((s, i) => {
        const st = state.stars[s.id] || 0, un = isUnlocked(i);
        return `<button class="shift-card ${un ? '' : 'locked'}" data-i="${i}" style="--sc:${s.color}">
          <div class="shift-num">${i + 1}</div>
          <div class="shift-dish">${un ? food(s.dish) : lockIcon()}</div>
          <div class="shift-info"><b>${s.name}</b><small>${un ? s.sub : `Earn 1 star in ${SHIFTS[i - 1].name}`}</small>
            <div class="shift-stars">${[0, 1, 2].map(k => star(k < st)).join('')}</div>
            ${state.best[s.id] ? `<small class="best">Best: ${state.best[s.id]}</small>` : ''}</div>
        </button>`;
      }).join('')}
    </div>
    <p class="map-foot">${state.settings.calm ? 'Calm mode is ON: no timers, 12 orders per shift.' : 'Each shift lasts 2½ minutes. Turn on Calm mode in Progress for no timers.'}</p>`;
  root.appendChild(el);
  $$('.shift-card', el).forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    if (!isUnlocked(i)) { sfx('wrong'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
    sfx('pop'); go('rush', { shift: i });
  });
  music('kitchen');
  return () => tb._off && tb._off();
});

/* ------------------------------------------------------------------ */
/* Art bits specific to the station                                    */
/* ------------------------------------------------------------------ */
const potSvg = () => `<svg viewBox="0 0 200 150" class="pot-svg">
  <ellipse cx="100" cy="142" rx="80" ry="7" fill="${O}" opacity=".12"/>
  <rect x="2" y="56" width="34" height="16" rx="8" fill="#ff8fb1" stroke="${O}" stroke-width="4"/>
  <rect x="164" y="56" width="34" height="16" rx="8" fill="#ff8fb1" stroke="${O}" stroke-width="4"/>
  <path d="M26,48 H174 V112 C174,132 156,140 100,140 C44,140 26,132 26,112Z" fill="#ffb3c7" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M40,64 V108" stroke="#ffd6e2" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="100" cy="48" rx="76" ry="15" fill="#fff4e0" stroke="${O}" stroke-width="4.5"/>
  <ellipse class="pot-soup" cx="100" cy="50" rx="66" ry="10" fill="#ffe4a8"/>
  <g class="pot-bubbles"><circle cx="70" cy="50" r="5" fill="#fff8e0"/><circle cx="110" cy="47" r="4" fill="#fff8e0"/><circle cx="135" cy="52" r="3.4" fill="#fff8e0"/></g>
  <g class="pot-face"><ellipse cx="80" cy="96" rx="5" ry="6" fill="#3a2723"/><ellipse cx="120" cy="96" rx="5" ry="6" fill="#3a2723"/>
  <circle cx="82" cy="93.5" r="2" fill="#fff"/><circle cx="122" cy="93.5" r="2" fill="#fff"/>
  <ellipse cx="68" cy="106" rx="7" ry="4" fill="#ff7aa2" opacity=".5"/><ellipse cx="132" cy="106" rx="7" ry="4" fill="#ff7aa2" opacity=".5"/>
  <path d="M94,104 q3,4 6,0 q3,4 6,0" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/></g>
</svg>`;

const jarSvg = (j) => `<svg viewBox="0 0 120 130" class="jar-svg" preserveAspectRatio="xMidYMid meet">
  <rect x="22" y="4" width="76" height="22" rx="7" fill="${j.lid}" stroke="${O}" stroke-width="4"/>
  <path d="M30,8 h40" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>
  <path d="M14,40 C14,28 24,24 34,24 H86 C96,24 106,28 106,40 V112 C106,122 98,126 88,126 H32 C22,126 14,122 14,112Z" fill="#f4fbff" stroke="${O}" stroke-width="4"/>
  <path d="M18,62 Q60,54 102,62 V112 C102,119 96,122 88,122 H32 C24,122 18,119 18,112Z" fill="${j.fill}"/>
  <path d="M26,40 V100" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>
</svg>`;

/* ------------------------------------------------------------------ */
/* Gameplay                                                            */
/* ------------------------------------------------------------------ */
register('rush', (root, { shift: si = 0 }) => {
  const S = SHIFTS[si];
  const calm = state.settings.calm;
  const termIds = TERMS.filter(t => S.groups.includes(t.group)).map(t => t.id);
  const G = {
    time: SHIFT_SECS, score: 0, served: 0, missed: 0, streak: 0, best: 0, made: 0,
    tickets: [], active: null, spawnCd: 0, fire: 0, busy: false, over: false, paused: false,
    recent: [], missedTerms: new Set(), wrongs: 0, nextId: 1, lastDish: '',
  };

  root.innerHTML = `
  <div class="rush ${calm ? 'calm' : ''}" style="--sc:${S.color}">
    <div class="rush-hud">
      <button class="icon-btn pause-btn" aria-label="Pause"><svg viewBox="0 0 40 40"><rect x="10" y="9" width="7" height="22" rx="3" fill="#fff" stroke="${O}" stroke-width="2.6"/><rect x="23" y="9" width="7" height="22" rx="3" fill="#fff" stroke="${O}" stroke-width="2.6"/></svg></button>
      <div class="hud-timer">${clockIcon()}<b>${calm ? `0/${CALM_ORDERS}` : fmt(SHIFT_SECS)}</b></div>
      <div class="hud-score">
        <div class="hud-coins">${coin()}<b>0</b></div>
        <div class="star-bar"><div class="star-fill"></div>${STARS.map((v, i) => `<span class="sb-star" style="left:${(v / STARS[2]) * 100}%">${star(false)}</span>`).join('')}</div>
      </div>
      <div class="hud-streak"></div>
    </div>
    <div class="ticket-rail"></div>
    <div class="order-board"><div class="ob-label"></div><div class="ob-q"></div></div>
    <div class="station">
      <div class="st-mochi">${mochi({ mood: 'normal' })}</div>
      <div class="st-pot">${potSvg()}<div class="pot-steam"><i></i><i></i><i></i></div><div class="pot-fire hidden"></div><div class="pot-dish"></div></div>
      <div class="st-pass"><div class="pass-label">PASS</div><div class="pass-slot"></div></div>
    </div>
    <div class="answer-area"></div>
    <div class="tip-bubble"></div>
    <div class="fire-cover hidden"><div class="fc-msg">${extinguisher()}<span>FIRE! Tap the flames to put them out!</span></div></div>
  </div>`;
  const R = $('.rush', root);
  const rail = $('.ticket-rail', R), ans = $('.answer-area', R), pot = $('.st-pot', R);
  const tipB = $('.tip-bubble', R);
  if (new URLSearchParams(location.search).has('debug')) window.__G = G;
  const setMochi = (mood) => { $('.st-mochi', R).innerHTML = mochi({ mood }); };

  /* ---------- tickets ---------- */
  function newTicket() {
    G.made++;
    const specialTurn = S.specials.length && G.made % 4 === 0;
    let q;
    if (specialTurn) q = pick(S.specials) === 'sort' ? sortRound(5) : stackRound();
    else q = makeQuestion(termIds, { nOpts: 4, recent: G.recent });
    if (q.termId && q.kind === 'mc') { G.recent.push(q.termId); while (G.recent.length > Math.min(6, termIds.length - 2)) G.recent.shift(); }
    let dish = pick(DISHES); while (dish === G.lastDish) dish = pick(DISHES); G.lastDish = dish;
    if (q.kind === 'sort') dish = 'onigiri'; if (q.kind === 'stack') dish = 'layercake';
    const max = q.kind === 'mc' ? (q.tf ? 32 : 45) : 70;
    const t = { id: G.nextId++, q, dish, max, patience: max, wrong: new Set(), step: 0, errors: 0 };
    const label = q.kind === 'sort' ? 'Pantry Sort!' : q.kind === 'stack' ? 'Food Chain Cake!' : q.tf ? 'True or False?' : q.style === 'def' ? 'Name it!' : q.style === 'scenario' ? 'Who am I?' : 'Fill the blank';
    t.label = label;
    const el = document.createElement('button');
    el.className = 'ticket enter' + (q.kind !== 'mc' ? ' special' : '');
    el.innerHTML = `<div class="tk-pin"></div><div class="tk-num">#${t.id}</div><div class="tk-dish">${food(dish)}</div><div class="tk-label">${label}</div><div class="tk-bar"><i></i></div>`;
    el.onclick = () => { if (G.busy || G.fire) return; sfx('tap'); activate(t); };
    t.el = el; rail.appendChild(el);
    setTimeout(() => el.classList.remove('enter'), 450);
    G.tickets.push(t);
    sfx('order');
    if (!G.active) activate(t);
  }

  function activate(t) {
    G.active = t;
    if (!G.fire) tipB.classList.remove('show');
    G.tickets.forEach(x => x.el.classList.toggle('active', x === t));
    renderOrder();
  }

  function fitText(el, txt) {
    el.textContent = txt;
    el.style.fontSize = txt.length > 150 ? '0.78em' : txt.length > 110 ? '0.88em' : txt.length > 70 ? '0.96em' : '1.08em';
  }

  function renderOrder() {
    const t = G.active;
    const lab = $('.ob-label', R), qEl = $('.ob-q', R);
    ans.innerHTML = '';
    if (!t) { lab.textContent = ''; qEl.textContent = 'Waiting for orders...'; return; }
    lab.innerHTML = `<span>${t.label}</span> ${food(t.dish)}`;
    const q = t.q;
    if (q.kind === 'mc') {
      fitText(qEl, q.prompt);
      ans.className = 'answer-area jars n' + q.options.length;
      q.options.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'jar' + (t.wrong.has(i) ? ' used' : '');
        b.innerHTML = `${jarSvg(JARS[i % 4])}<span class="jar-label">${esc(o.label)}</span>`;
        if (o.label.length > 22) b.classList.add('long');
        b.onclick = () => pickJar(t, i, b);
        ans.appendChild(b);
      });
    } else if (q.kind === 'sort') {
      qEl.innerHTML = `Sort each pantry item: is it <b>biotic</b> (living) or <b>abiotic</b> (non-living)?`;
      ans.className = 'answer-area sort';
      const it = q.items[t.step];
      ans.innerHTML = `
        <button class="bowl bowl-bio" data-b="1"><span class="bowl-art">${bowlSvg('#c8f1c0')}</span><b>Biotic</b><small>living</small></button>
        <div class="sort-item pop-in"><div class="si-icon">${icon(it.icon)}</div><b>${it.name}</b>
          <div class="sort-dots">${q.items.map((_, k) => `<i class="${k < t.step ? 'done' : k === t.step ? 'cur' : ''}"></i>`).join('')}</div></div>
        <button class="bowl bowl-abio" data-b="0"><span class="bowl-art">${bowlSvg('#cfe6ff')}</span><b>Abiotic</b><small>non-living</small></button>`;
      $$('.bowl', ans).forEach(b => b.onclick = () => pickSort(t, b.dataset.b === '1', b));
    } else if (q.kind === 'stack') {
      qEl.innerHTML = `Build the <b>food chain cake</b>! Tap from the <b>bottom</b> (producer) up to the <b>top</b> (tertiary consumer).`;
      ans.className = 'answer-area stack';
      if (!t.order) t.order = shuffle(q.chain.map((c, i) => ({ ...c, lvl: i })));
      ans.innerHTML = `
        <div class="cake-tower">${q.chain.map((c, i) => `<div class="layer l${i} ${i < t.step ? 'on' : ''}"><span>${i < t.step ? `${c.name} · ${CHAIN_ROLES[i]}` : CHAIN_ROLES[i]}</span></div>`).reverse().join('')}<div class="cake-plate"></div></div>
        <div class="chain-cards">${t.order.map(c => `<button class="chain-card ${c.lvl < t.step ? 'placed' : ''}" data-l="${c.lvl}">${icon(c.icon)}<b>${c.name}</b></button>`).join('')}</div>`;
      $$('.chain-card', ans).forEach(b => b.onclick = () => pickStack(t, +b.dataset.l, b));
    }
  }

  const bowlSvg = (c) => `<svg viewBox="0 0 120 70"><path d="M6,14 H114 C114,46 92,66 60,66 C28,66 6,46 6,14Z" fill="${c}" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="14" rx="54" ry="9" fill="#fff" stroke="${O}" stroke-width="4"/><path d="M22,30 q8,16 26,22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;

  /* ---------- answering ---------- */
  function pickJar(t, i, btn) {
    if (G.busy || G.fire || G.over || t.wrong.has(i)) return;
    const o = t.q.options[i];
    if (o.correct) {
      G.busy = true;
      flyBlob(btn, JARS[i % 4].fill).then(() => serve(t));
      sfx('pop'); btn.classList.add('chosen');
    } else {
      t.wrong.add(i); btn.classList.add('used', 'shake');
      if (t.wrong.size === 1) { record(t.q.termId, false); G.missedTerms.add(t.q.termId); }
      t.errors++;
      const named = TERMS.find(x => x.term === o.label);
      // don't explain a word that another waiting order is asking for
      const waiting = named && G.tickets.some(x => x !== t && x.q.termId && (x.q.termId === named.id || x.q.termId === named.same));
      if (named && !waiting) { G.recent.push(named.id); if (named.same) G.recent.push(named.same); }
      tip(named && !waiting ? `Oops! <b>${named.term}</b> means: ${qd(named.id).charAt(0).toLowerCase() + qd(named.id).slice(1)}.` : 'Not quite! Try another jar.');
      wrongAnswer(t);
    }
  }

  function pickSort(t, saidBio, btn) {
    if (G.busy || G.fire || G.over) return;
    const it = t.q.items[t.step];
    t.tried = t.tried || {};
    if (!t.tried[t.step]) { t.tried[t.step] = true; record(it.biotic ? 'biotic' : 'abiotic', it.biotic === saidBio); }
    if (it.biotic === saidBio) {
      sfx('pop'); btn.classList.add('gulp'); setTimeout(() => btn.classList.remove('gulp'), 300);
      const c = centerOf(btn); sparkle(c.x, c.y, 8);
      t.step++;
      if (t.step >= t.q.items.length) { G.busy = true; flyBlob($('.sort-item', ans), '#c8f1c0').then(() => serve(t)); }
      else renderOrder();
    } else {
      t.errors++; btn.classList.add('shake'); setTimeout(() => btn.classList.remove('shake'), 500);
      G.missedTerms.add(it.biotic ? 'biotic' : 'abiotic');
      tip(`${it.name} is <b>${it.biotic ? 'BIOTIC' : 'ABIOTIC'}</b>: it's ${it.biotic ? 'a living thing' : 'not alive'}!`);
      wrongAnswer(t);
    }
  }

  function pickStack(t, lvl, btn) {
    if (G.busy || G.fire || G.over || lvl < t.step) return;
    t.tried = t.tried || {};
    if (!t.tried[t.step]) { t.tried[t.step] = true; record(['producer', 'primary', 'secondary', 'tertiary'][t.step], lvl === t.step); }
    if (lvl === t.step) {
      sfx('pop'); const c = centerOf(btn); sparkle(c.x, c.y, 8);
      t.step++;
      if (t.step >= 4) { G.busy = true; renderOrder(); setTimeout(() => flyBlob($('.cake-tower', ans), '#ffb3c7').then(() => serve(t)), 350); }
      else renderOrder();
    } else {
      t.errors++; btn.classList.add('shake'); setTimeout(() => btn.classList.remove('shake'), 500);
      const need = CHAIN_ROLES[t.step];
      const hints = ['The producer is the plant. It makes food from the sun!', 'The primary consumer is the herbivore. It eats the plant!', 'The secondary consumer is the carnivore. It eats the herbivore!', 'The tertiary consumer is at the top. No natural predator!'];
      G.missedTerms.add(['producer', 'primary', 'secondary', 'tertiary'][t.step]);
      tip(`Next layer: <b>${need}</b>. ${hints[t.step]}`);
      wrongAnswer(t);
    }
  }

  function wrongAnswer(t) {
    sfx('wrong'); G.streak = 0; updateStreak();
    t.patience = Math.max(3, t.patience - 5);
    setMochi('wow');
    if (navigator.vibrate) navigator.vibrate(60);
    startFire();
  }

  function tip(html) {
    tipB.innerHTML = `<span class="tb-m">${mochi({ mood: 'wow', hat: false })}</span><div>${html}</div>`; tipB.classList.remove('show'); void tipB.offsetWidth; tipB.classList.add('show');
    clearTimeout(tipB._t); tipB._t = setTimeout(() => tipB.classList.remove('show'), 4200);
  }

  /* ---------- fire! ---------- */
  function startFire() {
    G.fire = calm ? 2 : 3;
    const f = $('.pot-fire', R);
    f.innerHTML = `${fireIcon('fl a')}${fireIcon('fl b')}${fireIcon('fl c')}`;
    f.classList.remove('hidden'); f.style.setProperty('--fs', 1);
    $('.fire-cover', R).classList.remove('hidden');
    R.classList.add('on-fire');
    sfx('fire');
  }
  function tapFire(e) {
    if (!G.fire) return;
    G.fire--;
    sfx('puff');
    const x = e.clientX || centerOf(pot).x, y = e.clientY || centerOf(pot).y;
    puff(x, y);
    const f = $('.pot-fire', R);
    f.style.setProperty('--fs', Math.max(.25, G.fire / (calm ? 2 : 3)));
    if (G.fire <= 0) {
      f.classList.add('hidden'); f.innerHTML = '';
      $('.fire-cover', R).classList.add('hidden'); R.classList.remove('on-fire');
      sfx('sizzle'); setMochi('normal');
      floatText('Phew!', centerOf(pot).x, centerOf(pot).y - 40, 'ft-blue');
    }
  }
  function puff(x, y) {
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('div'); p.className = 'puff';
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.setProperty('--dx', (Math.random() - .5) * 120 + 'px'); p.style.setProperty('--dy', (Math.random() - .7) * 100 + 'px');
      document.body.appendChild(p); setTimeout(() => p.remove(), 700);
    }
  }
  $('.fire-cover', R).addEventListener('pointerdown', tapFire);
  tipB.addEventListener('pointerdown', () => { if (!G.fire) tipB.classList.remove('show'); });

  /* ---------- cooking + serving ---------- */
  function flyBlob(fromEl, color) {
    return new Promise(res => {
      const a = centerOf(fromEl), b = centerOf(pot);
      const blob = document.createElement('div'); blob.className = 'blob';
      blob.style.background = color; blob.style.left = a.x + 'px'; blob.style.top = a.y + 'px';
      document.body.appendChild(blob);
      const dx = b.x - a.x, dy = b.y - a.y - 30;
      blob.animate([
        { transform: 'translate(-50%,-50%) scale(1)' },
        { transform: `translate(calc(-50% + ${dx / 2}px), calc(-50% + ${dy / 2 - 80}px)) scale(1.2)`, offset: .5 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.5)` },
      ], { duration: 480, easing: 'cubic-bezier(.4,0,.6,1)' }).onfinish = () => { blob.remove(); res(); };
    });
  }

  async function serve(t) {
    tipB.classList.remove('show');
    setMochi('yum');
    pot.classList.add('cooking'); sfx('sizzle');
    await wait(650);
    pot.classList.remove('cooking');
    if (G.over) return;
    const base = t.q.kind === 'mc' ? (t.q.tf ? 15 : 20) : 35;
    const tipAmt = Math.round(10 * (t.patience / t.max)) - t.errors * 3;
    G.streak++; G.best = Math.max(G.best, G.streak);
    const combo = G.streak >= 6 ? 10 : G.streak >= 3 ? 5 : 0;
    const earned = Math.max(5, base + tipAmt + combo);
    G.score += earned; G.served++;
    if (t.q.kind === 'mc' && t.wrong.size === 0) record(t.q.termId, true);
    state.stats.orders++;

    // dish pops out and slides to the pass
    const d = $('.pot-dish', R);
    d.innerHTML = food(t.dish); d.className = 'pot-dish show';
    sfx('bell');
    const c = centerOf(pot);
    sparkle(c.x, c.y - 30, 14);
    floatText(`+${earned}`, c.x, c.y - 70, 'ft-gold');
    if (combo) setTimeout(() => floatText(`Combo x${G.streak}!`, c.x, c.y - 110, 'ft-pink'), 200);
    flyCoins({ x: c.x, y: c.y - 40 }, Math.min(6, 2 + Math.floor(earned / 10)), coin(), () => sfx('coin'));
    setTimeout(() => { d.className = 'pot-dish to-pass'; }, 450);
    setTimeout(() => {
      d.className = 'pot-dish'; d.innerHTML = '';
      const ps = $('.pass-slot', R); ps.innerHTML = food(t.dish); ps.classList.remove('slide'); void ps.offsetWidth; ps.classList.add('slide');
    }, 900);

    removeTicket(t, 'done');
    updateHud(); updateStreak();
    setMochi('happy');
    setTimeout(() => { if (!G.fire) setMochi('normal'); }, 1200);
    G.busy = false;
    if (calm && G.served >= CALM_ORDERS) return endShift();
    if (G.tickets.length === 0) { G.spawnCd = 0; newTicket(); }
    else if (calm && G.tickets.length < 2) newTicket();
  }

  function removeTicket(t, how) {
    G.tickets = G.tickets.filter(x => x !== t);
    t.el.classList.add(how === 'done' ? 'served' : 'stormed');
    t.el.onclick = null;
    setTimeout(() => t.el.remove(), 500);
    if (G.active === t) { G.active = null; if (G.tickets[0]) activate(G.tickets[0]); else renderOrder(); }
  }

  function expire(t) {
    G.missed++; G.streak = 0; updateStreak();
    if (t.q.kind === 'mc') { if (t.wrong.size === 0) record(t.q.termId, false); G.missedTerms.add(t.q.termId); }
    let answer = '';
    if (t.q.kind === 'mc') answer = t.q.options.find(o => o.correct).label;
    toast(`${food(t.dish)}<div><b>Order #${t.id} walked out!</b>${answer ? `<br>The answer was <b>${esc(answer)}</b>` : ''}</div>`, 3000, 'toast-miss');
    sfx('wrong'); setMochi('sad');
    setTimeout(() => { if (!G.fire) setMochi('normal'); }, 1400);
    removeTicket(t, 'storm');
    if (!G.tickets.length) newTicket();
  }

  /* ---------- HUD ---------- */
  function fmt(s) { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
  function updateHud() {
    $('.hud-coins b', R).textContent = G.score;
    $('.star-fill', R).style.width = Math.min(100, (G.score / STARS[2]) * 100) + '%';
    $$('.sb-star', R).forEach((s, i) => { const on = G.score >= STARS[i]; if (on && !s.classList.contains('on')) { s.classList.add('on'); s.innerHTML = star(true); sfx('star'); const c = centerOf(s); sparkle(c.x, c.y, 10); } });
    if (calm) $('.hud-timer b', R).textContent = `${G.served}/${CALM_ORDERS}`;
  }
  function updateStreak() {
    const h = $('.hud-streak', R);
    h.innerHTML = G.streak >= 2 ? `${fireIcon('streak-fire')}<b>${G.streak}</b>` : '';
    h.classList.toggle('hot', G.streak >= 3);
  }

  /* ---------- main loop ---------- */
  let last = performance.now(), raf = 0, hurry = false, lastTickSec = -1;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!G.paused && !G.over && !document.hidden) {
      if (!calm) {
        G.time -= dt;
        const tEl = $('.hud-timer', R);
        $('b', tEl).textContent = fmt(G.time);
        if (G.time <= 15 && !hurry) { hurry = true; tEl.classList.add('hurry'); setTempo(1.25); toast('<b>15 seconds left! Hurry!</b>', 1600, 'toast-hurry'); }
        if (hurry && Math.ceil(G.time) !== lastTickSec) { lastTickSec = Math.ceil(G.time); if (G.time > 0) sfx(lastTickSec % 2 ? 'tick' : 'tock'); }
        if (G.time <= 0) { endShift(); return; }
        G.spawnCd -= dt;
        if (G.tickets.length < 3 && G.spawnCd <= 0) { newTicket(); G.spawnCd = 9; }
        for (const t of [...G.tickets]) {
          if (!(G.busy && t === G.active)) t.patience -= dt * (G.fire && t === G.active ? 0.5 : 1);
          const p = Math.max(0, t.patience / t.max);
          const bar = $('.tk-bar i', t.el);
          bar.style.width = p * 100 + '%';
          bar.style.background = p > .5 ? '#7fd86b' : p > .25 ? '#ffc23d' : '#ff6b6b';
          t.el.classList.toggle('angry', p < .25);
          if (t.patience <= 0 && !(G.busy && t === G.active)) expire(t);
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- end of shift ---------- */
  async function endShift() {
    if (G.over) return;
    G.over = true; cancelAnimationFrame(raf); setTempo(1);
    R.classList.remove('on-fire'); $('.fire-cover', R).classList.add('hidden');
    sfx('bell');
    const banner = document.createElement('div'); banner.className = 'times-up';
    banner.innerHTML = `<span>${calm ? 'Shift complete!' : "Time's up!"}</span>`;
    R.appendChild(banner);
    await wait(1600);
    banner.remove();
    const stars = STARS.filter(v => G.score >= v).length;
    const prevStars = state.stars[S.id] || 0;
    const firstThree = stars === 3 && prevStars < 3;
    state.stars[S.id] = Math.max(prevStars, stars);
    state.best[S.id] = Math.max(state.best[S.id] || 0, G.score);
    if (firstThree) state.tokens += 1;
    save();
    addCoins(G.score);
    music('podium');
    const missed = [...G.missedTerms].filter(Boolean).map(id => T[id]).filter(Boolean);
    const unlockedNext = si < SHIFTS.length - 1 && prevStars === 0 && stars >= 1;
    const m = modal(`<div class="results">
      <h2>${S.name}</h2>
      <div class="res-stars">${[0, 1, 2].map(i => `<span class="rs" data-i="${i}">${star(false)}</span>`).join('')}</div>
      <div class="res-mochi">${mochi({ mood: stars >= 2 ? 'star' : stars === 1 ? 'happy' : 'sad' })}</div>
      <div class="res-msg">${['Oh no! Let\'s practice and try again!', 'Nice cooking, chef!', 'Amazing! The customers love you!', 'PERFECT! 3 stars, Chef Katara!'][stars]}</div>
      <div class="res-stats">
        <div><b>${G.served}</b><small>served</small></div><div><b>${G.missed}</b><small>walked out</small></div>
        <div><b>${G.best}</b><small>best streak</small></div><div class="gold"><b>+${G.score}</b><small>coins</small></div>
      </div>
      ${firstThree ? `<div class="res-bonus">First time 3 stars! <b>+1 free blind box</b></div>` : ''}
      ${unlockedNext ? `<div class="res-bonus mint">New shift unlocked: <b>${SHIFTS[si + 1].name}</b>!</div>` : ''}
      ${missed.length ? `<div class="study"><h4>Mochi's study list</h4>${missed.map(t => `<div class="study-row"><span class="sr-ico">${icon(t.icon)}</span><div><b>${t.term}</b><small>${t.def}</small></div></div>`).join('')}</div>`
        : G.served ? `<div class="study perfect">No mistakes! You know these words!</div>` : ''}
      <div class="modal-actions">
        <button class="small-btn ghost" data-a="map">Shifts</button>
        <button class="big-btn" data-a="again">Play again</button>
        ${si < SHIFTS.length - 1 && isUnlocked(si + 1) ? `<button class="big-btn alt" data-a="next">Next shift</button>` : ''}
      </div></div>`, { cls: 'tall', dismiss: false });
    // star reveal
    for (let i = 0; i < 3; i++) {
      await wait(450);
      if (i < stars) { const s = $(`.rs[data-i="${i}"]`, m); s.innerHTML = star(true); s.classList.add('pop'); sfx('star'); const c = centerOf(s); sparkle(c.x, c.y, 16); }
    }
    if (stars >= 2) confetti(140);
    $$('[data-a]', m).forEach(b => b.onclick = () => {
      sfx('pop'); m._close();
      if (b.dataset.a === 'again') go('rush', { shift: si });
      else if (b.dataset.a === 'next') go('rush', { shift: si + 1 });
      else go('rushmap');
    });
  }

  /* ---------- pause ---------- */
  $('.pause-btn', R).onclick = () => {
    if (G.over) return;
    G.paused = true; sfx('tap');
    const m = modal(`<div class="pause"><div class="pause-mochi">${mochi({ mood: 'sleep' })}</div><h2>Paused</h2>
      <div class="modal-actions col"><button class="big-btn" data-a="go">Keep cooking</button><button class="small-btn ghost" data-a="quit">Quit shift</button></div></div>`, { dismiss: false });
    $('[data-a=go]', m).onclick = () => { sfx('pop'); m._close(); G.paused = false; last = performance.now(); };
    $('[data-a=quit]', m).onclick = () => { m._close(); G.over = true; go('rushmap'); };
  };

  if (window.__G) window.__newTicket = newTicket;
  /* ---------- start! ---------- */
  const intro = document.createElement('div'); intro.className = 'ready-go';
  R.appendChild(intro);
  music(null);
  (async () => {
    for (const w of ['Ready?', 'Cook!']) {
      intro.innerHTML = `<span>${w}</span>`; sfx(w === 'Cook!' ? 'bell' : 'tick');
      await wait(800);
    }
    intro.remove();
    if (G.over) return;
    music('rush');
    newTicket(); setTimeout(() => !G.over && !calm && newTicket(), 2500);
    G.spawnCd = 10;
    last = performance.now(); raf = requestAnimationFrame(frame);
  })();

  return () => { G.over = true; cancelAnimationFrame(raf); setTempo(1); };
});
