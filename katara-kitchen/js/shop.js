// MINI MART — buy and place kitchen decor.
import { coin, mochi } from './art.js';
import { KITCHEN, room, itemPreview } from './kitchen-art.js';
import { state, save, spend } from './state.js';
import { sfx, music } from './audio.js';
import { confetti, sparkle, centerOf, hearts } from './fx.js';
import { shelfMinis } from './minis.js';
import { $, $$, register, topbar, modal, toast } from './ui.js';

const ORDER = ['stove', 'fridge', 'counter', 'window', 'wall', 'floor', 'rug', 'shelf', 'sign', 'lamp', 'plant', 'bed'];

register('shop', (root, { slot = 'stove' } = {}) => {
  const tb = topbar({ title: 'Mini Mart' });
  root.appendChild(tb);
  const el = document.createElement('div'); el.className = 'shop'; root.appendChild(el);
  el.innerHTML = `
    <div class="shop-preview"><div class="room-wrap">${room(state.decor, shelfMinis())}<div class="room-mochi"><div class="mochi-holder">${mochi({ mood: 'happy' })}</div></div></div></div>
    <div class="shop-side">
      <div class="shop-tabs">${ORDER.map(s => `<button class="chip" data-s="${s}">${KITCHEN[s].label}</button>`).join('')}</div>
      <div class="shop-grid"></div>
    </div>`;
  const redrawRoom = () => { $('.shop-preview .room', el).outerHTML = room(state.decor, shelfMinis()); };
  function render() {
    $$('.shop-tabs .chip', el).forEach(c => c.classList.toggle('on', c.dataset.s === slot));
    const items = KITCHEN[slot].items;
    const owned = state.owned[slot] || [];
    $('.shop-grid', el).innerHTML = Object.entries(items).map(([id, it]) => {
      const has = owned.includes(id) || it.price === 0;
      const on = state.decor[slot] === id;
      return `<button class="shop-item ${on ? 'on' : ''} ${has ? 'owned' : ''} ${!has && state.coins < it.price ? 'poor' : ''}" data-id="${id}">
        <div class="si-prev">${itemPreview(slot, id)}</div>
        <b>${it.name}</b>
        <span class="si-price">${on ? 'In kitchen' : has ? 'Place it' : `${coin()}${it.price}`}</span>
      </button>`;
    }).join('');
    $$('.shop-item', el).forEach(b => b.onclick = () => choose(b.dataset.id, b));
  }
  function choose(id, btn) {
    const it = KITCHEN[slot].items[id];
    const has = (state.owned[slot] || []).includes(id) || it.price === 0;
    if (has) {
      if (state.decor[slot] === id) return;
      state.decor[slot] = id; save(); sfx('pop'); redrawRoom(); render();
      const r = $(`.room .slot-${slot}`, el); if (r) { const c = centerOf(r); sparkle(c.x, c.y, 10); }
      return;
    }
    if (state.coins < it.price) {
      sfx('wrong'); btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
      toast(`You need <b>${it.price - state.coins}</b> more coins. Cook some orders!`, 2200);
      return;
    }
    const m = modal(`<div class="buy">
      <div class="buy-prev">${itemPreview(slot, id)}</div>
      <h2>${it.name}</h2>
      <p>Buy for <b class="gold">${coin()} ${it.price}</b> coins?</p>
      <div class="modal-actions"><button class="small-btn ghost" data-a="no">Not yet</button><button class="big-btn" data-a="yes">Buy it!</button></div></div>`);
    $('[data-a=no]', m).onclick = () => { sfx('tap'); m._close(); };
    $('[data-a=yes]', m).onclick = () => {
      if (!spend(it.price)) return;
      state.owned[slot] = [...new Set([...(state.owned[slot] || []), id])];
      state.decor[slot] = id; save();
      m._close(); sfx('buy'); confetti(70);
      redrawRoom(); render();
      const h = $('.shop-preview .room-mochi', el); const c = centerOf(h); hearts(c.x, c.y - 20, 6);
      toast(`<b>${it.name}</b> is in your kitchen!`, 2000);
    };
  }
  $$('.shop-tabs .chip', el).forEach(c => c.onclick = () => { sfx('tap'); slot = c.dataset.s; render(); });
  render();
  music('kitchen');
  return () => tb._off && tb._off();
});
