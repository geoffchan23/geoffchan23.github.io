import { mochi, coin, food, chefHead, icon, blindBox, heart } from './art.js';
import { room } from './kitchen-art.js';
import { state, save, today, resetAll, masteryLevel } from './state.js';
import { sfx, music, unlock, refreshMusic, stopMusic } from './audio.js';
import { hearts, confetti, centerOf } from './fx.js';
import { TERMS, GROUPS } from './content.js';
import { shelfMinis } from './minis.js';
import { $, $$, go, register, topbar, modal, say, screens } from './ui.js';
import './rush.js';
import './bakeoff.js';
import './book.js';
import './shop.js';
import './boxes.js';

/* ---------------- TITLE ---------------- */
register('title', (root) => {
  root.innerHTML = `
    <div class="title-screen">
      <div class="title-sky">${Array.from({ length: 14 }, (_, i) => `<span class="sprinkle s${i % 5}" style="left:${(i * 71) % 100}%;animation-delay:${(i * .37) % 4}s;animation-duration:${5 + (i % 4)}s"></span>`).join('')}</div>
      <div class="title-float f1">${food('cupcake')}</div><div class="title-float f2">${food('donut')}</div>
      <div class="title-float f3">${food('macaron')}</div><div class="title-float f4">${food('boba')}</div>
      <div class="title-float f5">${blindBox('', 'mint')}</div><div class="title-float f6">${food('croissant')}</div>
      <div class="logo">
        <div class="logo-small">Katara's</div>
        <h1><span>Mochi's</span><span class="l2">Mini Kitchen</span></h1>
        <div class="logo-sub">a cozy ecosystems cook-off</div>
      </div>
      <div class="title-mochi">${mochi({ mood: 'happy' })}</div>
      <button class="big-btn play-btn">Let's Cook!</button>
      <div class="title-foot">Study for the Science Test, earn coins, open blind boxes &amp; build your dream kitchen</div>
    </div>`;
  const m = $('.title-mochi', root);
  m.onclick = () => { unlock(); sfx('meow'); m.innerHTML = mochi({ mood: 'love' }); const c = centerOf(m); hearts(c.x, c.y - 40, 6); setTimeout(() => m.innerHTML = mochi({ mood: 'happy' }), 1200); };
  $('.play-btn', root).onclick = () => { unlock(); sfx('pop'); music('kitchen'); go('hub'); };
});

/* ---------------- HUB ---------------- */
const HUB_LINES = [
  'Hi Katara! Ready to cook up some science?',
  'Every right answer = more coins for our kitchen!',
  "Let's open a blind box! I hope it's a secret one...",
  'Psst... the Recipe Book has memory tricks!',
  'I believe in you! You are going to ace this test.',
  "Mmm, I smell an A+ baking!",
];

register('hub', (root) => {
  const tb = topbar({ title: '', back: null });
  root.appendChild(tb);
  const wrap = document.createElement('div');
  wrap.className = 'hub';
  const daily = state.lastDaily !== today();
  wrap.innerHTML = `
    <div class="hub-stage">
      <div class="hub-sign"><span>Mochi's</span> Mini Kitchen</div>
      <div class="room-wrap">${room(state.decor, shelfMinis())}
        <div class="room-mochi"><div class="mochi-holder">${mochi({ mood: 'normal' })}</div></div>
        <button class="deco-btn" aria-label="Decorate">${icon('crown')}<span>Decorate</span></button>
      </div>
    </div>
    <div class="hub-menu">
      <button class="menu-card mc-study" data-go="study">
        <div class="mc-art">${mochi({ mood: 'happy', glasses: true, hat: false })}</div>
        <div class="mc-text"><b>Test Prep</b><small>Practice tests just like the real one. Earn coins for your kitchen!</small></div>
      </button>
      <button class="menu-card mc-rush" data-go="rushmap">
        <div class="mc-art">${food('ramen')}${food('cupcake')}</div>
        <div class="mc-text"><b>Order Rush</b><small>Cook orders by answering questions. Don't let the kitchen catch fire!</small></div>
      </button>
      <button class="menu-card mc-quiz" data-go="bakeoff">
        <div class="mc-art heads">${chefHead('bunny')}${chefHead('mochi', 'happy')}${chefHead('bear')}</div>
        <div class="mc-text"><b>Bake-Off Live!</b><small>Race the rival chefs. Faster answers = more points!</small></div>
      </button>
      <button class="menu-card mc-box" data-go="boxes">
        <div class="mc-art">${blindBox()}</div>
        <div class="mc-text"><b>Blind Boxes</b><small>Unbox Mochi Minis! Can you find the secret one?</small></div>
        ${state.tokens > 0 ? `<span class="badge">${state.tokens} free</span>` : ''}
      </button>
      <button class="menu-card mc-book" data-go="book">
        <div class="mc-art">${icon('producer')}</div>
        <div class="mc-text"><b>Recipe Book</b><small>Learn every word with Mochi's memory tricks.</small></div>
      </button>
      <button class="menu-card mc-shop" data-go="shop">
        <div class="mc-art">${coin()}</div>
        <div class="mc-text"><b>Mini Mart</b><small>Spend coins on ovens, fridges, rugs and more.</small></div>
      </button>
      <button class="menu-card mc-set" data-go="settings">
        <div class="mc-art">${heart()}</div>
        <div class="mc-text"><b>Progress</b><small>See what you've mastered & change settings.</small></div>
      </button>
    </div>`;
  root.appendChild(wrap);

  const holder = $('.room-mochi', wrap);
  say(holder, state.onboarded ? HUB_LINES[Math.floor(Math.random() * HUB_LINES.length)] : "Hi Katara! I'm Mochi! I left you a <b>free blind box</b>. Let's open it!", { mood: 'happy', ms: 5200 });
  let moodT;
  holder.onclick = () => {
    sfx(Math.random() < .5 ? 'meow' : 'purr');
    const c = centerOf(holder); hearts(c.x, c.y - 30, 5);
    const t = TERMS[Math.floor(Math.random() * TERMS.length)];
    say(holder, `<b>${t.term}</b>: ${t.tip}`, { mood: ['love', 'happy', 'wink', 'yum'][Math.floor(Math.random() * 4)], ms: 5200 });
    clearTimeout(moodT); moodT = setTimeout(() => { const m = $('.mochi-holder', holder); if (m) m.innerHTML = mochi({ mood: 'normal' }); }, 2400);
  };
  // occasional idle moods
  const idle = setInterval(() => {
    const m = $('.mochi-holder', holder); if (!m || $('.bubble.pop', holder)) return;
    const mood = ['wink', 'happy', 'sleep', 'normal', 'yum'][Math.floor(Math.random() * 5)];
    m.innerHTML = mochi({ mood }); setTimeout(() => { if (m.isConnected) m.innerHTML = mochi({ mood: 'normal' }); }, 1600);
  }, 5000);

  $$('.menu-card', wrap).forEach(b => b.onclick = () => {
    sfx('pop');
    if (b.dataset.go === 'settings') return openProgress();
    if (b.dataset.go === 'study') { location.href = '/katara-study/'; return; }
    go(b.dataset.go);
  });
  $('.deco-btn', wrap).onclick = () => { sfx('pop'); go('shop'); };
  music('kitchen');

  if (daily && state.onboarded) {
    setTimeout(() => {
      state.lastDaily = today(); state.tokens += 1; save();
      const m = modal(`<div class="daily">
        <div class="daily-mochi">${mochi({ mood: 'love' })}</div>
        <h2>Daily Treat!</h2><p>Welcome back, Katara! Here's a <b>free blind box</b> for studying today.</p>
        <div class="daily-box">${blindBox('wiggle', 'lilac')}</div>
        <button class="big-btn">Yay! Thank you Mochi!</button></div>`);
      sfx('fanfare'); confetti(80);
      $('.big-btn', m).onclick = () => { sfx('pop'); m._close(); };
    }, 700);
  } else if (!state.lastDaily) { state.lastDaily = today(); save(); }

  return () => { clearInterval(idle); tb._off && tb._off(); };
});

/* ---------------- PROGRESS / SETTINGS ---------------- */
function openProgress() {
  const mastered = TERMS.filter(t => masteryLevel(t.id) >= 3).length;
  const acc = state.stats.answered ? Math.round(100 * state.stats.correct / state.stats.answered) : 0;
  const rows = Object.entries(GROUPS).map(([g, info]) => `
    <div class="prog-group"><h4 style="--gc:${info.color}">${info.name}</h4>
    ${TERMS.filter(t => t.group === g).map(t => `<div class="prog-row"><span>${t.term}</span><span class="hearts">${[0, 1, 2].map(i => heart(i < masteryLevel(t.id))).join('')}</span></div>`).join('')}</div>`).join('');
  const m = modal(`<div class="progress">
    <h2>Katara's Progress</h2>
    <div class="prog-stats">
      <div><b>${mastered}/${TERMS.length}</b><small>words mastered</small></div>
      <div><b>${acc}%</b><small>accuracy</small></div>
      <div><b>${state.stats.orders}</b><small>orders served</small></div>
      <div><b>${Object.keys(state.minis).length}</b><small>minis found</small></div>
    </div>
    <p class="prog-hint">3 hearts = answered right 4 times in a row. Mochi gives you more practice on words without hearts!</p>
    <div class="prog-list">${rows}</div>
    <div class="settings">
      <label><input type="checkbox" data-k="sound" ${state.settings.sound ? 'checked' : ''}> Sound effects</label>
      <label><input type="checkbox" data-k="music" ${state.settings.music ? 'checked' : ''}> Music</label>
      <label><input type="checkbox" data-k="calm" ${state.settings.calm ? 'checked' : ''}> Calm mode (no timers)</label>
    </div>
    <div class="modal-actions"><button class="small-btn ghost reset">Reset all progress</button><button class="big-btn done">Done</button></div>
  </div>`, { cls: 'tall' });
  $$('input[type=checkbox]', m).forEach(cb => cb.onchange = () => {
    state.settings[cb.dataset.k] = cb.checked; save();
    if (cb.dataset.k === 'music') { if (cb.checked) refreshMusic(); else stopMusic(); }
    sfx('tap');
  });
  $('.done', m).onclick = () => { sfx('tap'); m._close(); };
  $('.reset', m).onclick = () => { if (confirm('Erase ALL coins, minis, kitchen items and progress? This cannot be undone.')) resetAll(); };
}

/* ---------------- boot ---------------- */
document.addEventListener('pointerdown', () => unlock(), { once: true });
const start = new URLSearchParams(location.search).get('screen');
const qs = new URLSearchParams(location.search);
go(start && screens[start] ? start : 'title', { shift: +(qs.get('shift') || 0) }, { instant: true });
