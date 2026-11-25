// RECIPE BOOK — every vocabulary word as a flippable recipe card.
import { icon, heart, mochi } from './art.js';
import { masteryLevel } from './state.js';
import { sfx, music } from './audio.js';
import { TERMS, GROUPS } from './content.js';
import { $, $$, go, register, topbar, modal } from './ui.js';

register('book', (root, { group = 'basics' } = {}) => {
  const tb = topbar({ title: 'Recipe Book' });
  root.appendChild(tb);
  const el = document.createElement('div'); el.className = 'book'; root.appendChild(el);
  function render() {
    const list = TERMS.filter(t => t.group === group);
    el.innerHTML = `
      <div class="book-head">
        <div class="book-mochi">${mochi({ mood: 'wink' })}</div>
        <p>Tap a recipe card to flip it. Your teacher said: <b>don't memorize, just be familiar!</b></p>
      </div>
      <div class="book-tabs">${Object.entries(GROUPS).map(([k, g]) => `<button class="chip ${k === group ? 'on' : ''}" data-g="${k}" style="--gc:${g.color}">${g.name}</button>`).join('')}</div>
      <div class="recipe-grid">${list.map((t, i) => `
        <button class="recipe" data-i="${i}" style="--gc:${GROUPS[t.group].color}">
          <div class="rc-icon">${icon(t.icon)}</div><b>${t.term}</b>
          <div class="hearts">${[0, 1, 2].map(k => heart(k < masteryLevel(t.id))).join('')}</div>
        </button>`).join('')}</div>
      <button class="big-btn practice">Practice ${GROUPS[group].name} in a Bake-Off</button>`;
    $$('.chip', el).forEach(c => c.onclick = () => { sfx('tap'); group = c.dataset.g; render(); });
    $$('.recipe', el).forEach(b => b.onclick = () => { sfx('pop'); open(list, +b.dataset.i); });
    $('.practice', el).onclick = () => { sfx('pop'); go('bakeoff', { group }); };
  }
  function open(list, i) {
    const t = list[i];
    const m = modal(`<div class="flip-wrap">
      <div class="flip" style="--gc:${GROUPS[t.group].color}">
        <div class="face front"><div class="fc-icon">${icon(t.icon)}</div><h2>${t.term}</h2><small>tap to flip</small></div>
        <div class="face back">
          <h3>${t.term}</h3>
          <p class="fc-def">${t.def}.</p>
          <div class="fc-tip"><span class="fc-m">${mochi({ mood: 'happy', hat: false })}</span><div><b>Mochi's memory trick</b>${t.tip}</div></div>
          <p class="fc-ex"><b>Example:</b> ${t.ex}</p>
        </div>
      </div>
      <div class="flip-nav">
        <button class="icon-btn prev" ${i === 0 ? 'disabled' : ''}>‹</button>
        <button class="small-btn speak">Read it to me</button>
        <button class="icon-btn next" ${i === list.length - 1 ? 'disabled' : ''}>›</button>
      </div></div>`, { cls: 'flip-modal' });
    const f = $('.flip', m);
    f.onclick = () => { sfx('whoosh'); f.classList.toggle('flipped'); };
    const nav = (d) => { sfx('tap'); m._close(); setTimeout(() => open(list, i + d), 120); };
    $('.prev', m).onclick = () => i > 0 && nav(-1);
    $('.next', m).onclick = () => i < list.length - 1 && nav(1);
    $('.speak', m).onclick = () => {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(`${t.term}. ${t.def}. ${t.tip}`);
        u.rate = 0.95; u.pitch = 1.15; speechSynthesis.speak(u);
      } catch { /* no speech support */ }
      f.classList.add('flipped');
    };
  }
  render();
  music('kitchen');
  return () => { tb._off && tb._off(); try { speechSynthesis.cancel(); } catch { /* ignore */ } };
});
