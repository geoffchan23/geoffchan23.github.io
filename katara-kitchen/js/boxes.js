// BLIND BOXES — Mochi Minis capsule series: shake, tear, reveal, collect.
import { blindBox, foilBag, food, coin, boxToken, mochi } from './art.js';
import { state, save, spend } from './state.js';
import { sfx, music } from './audio.js';
import { confetti, rain, sparkle, centerOf, wait } from './fx.js';
import { MINIS, M, RARITY, BOX_PRICE, DUP_REFUND, rollMini } from './minis.js';
import { $, $$, register, topbar, toast, modal } from './ui.js';

register('boxes', (root, { tab = 'box' } = {}) => {
  const tb = topbar({ title: 'Blind Boxes' });
  root.appendChild(tb);
  const el = document.createElement('div'); el.className = 'boxes'; root.appendChild(el);
  let busy = false;

  function render() {
    const have = MINIS.filter(m => state.minis[m.id]).length;
    if (!state.onboarded && state.tokens > 0) tab = 'box';
    el.innerHTML = `
      <div class="box-tabs"><button class="chip ${tab === 'box' ? 'on' : ''}" data-t="box">Open a box</button><button class="chip ${tab === 'col' ? 'on' : ''}" data-t="col">My Minis ${have}/${MINIS.length}</button></div>
      ${tab === 'box' ? boxTab() : colTab()}`;
    $$('.box-tabs .chip', el).forEach(c => c.onclick = () => { sfx('tap'); tab = c.dataset.t; render(); });
    if (tab === 'box') {
      const ob = $('.open-btn', el);
      if (ob) ob.onclick = () => buyAndOpen();
      $('.stage-box', el).onclick = () => { sfx('shake'); const b = $('.stage-box', el); b.classList.remove('jiggle'); void b.offsetWidth; b.classList.add('jiggle'); };
    } else {
      $$('.mini-card.has', el).forEach(c => c.onclick = () => showMini(c.dataset.id));
    }
  }

  function boxTab() {
    const canToken = state.tokens > 0, canBuy = state.coins >= BOX_PRICE;
    return `
      <div class="box-shop">
        <div class="series"><small>Mochi Minis</small><b>Bakery Series 1</b><span>21 tiny treats to collect · 1 SECRET</span></div>
        <div class="stage">
          <div class="rays"></div>
          <div class="stage-box">${blindBox()}</div>
          <div class="pedestal"></div>
          <div class="stage-mochi">${mochi({ mood: canToken ? 'star' : 'happy' })}</div>
        </div>
        <button class="big-btn open-btn ${canToken || canBuy ? '' : 'disabled'}">
          ${canToken ? `${boxToken()} Open free box (${state.tokens})` : canBuy ? `Buy &amp; open · ${coin()} ${BOX_PRICE}` : `Need ${coin()} ${BOX_PRICE}`}
        </button>
        ${!canToken && !canBuy ? `<p class="need">Cook more orders or win a Bake-Off to earn coins!</p>` : ''}
        <div class="odds">${Object.entries(RARITY).map(([k, r]) => `<div class="odd" style="--rc:${r.color}"><i></i><b>${r.name}</b><span>${r.odds}%</span></div>`).join('')}</div>
        <p class="odds-note">Duplicates give back ${DUP_REFUND} coins. Every 8 boxes guarantees a Super Rare or better!</p>
      </div>`;
  }

  function colTab() {
    return `<div class="collection">${Object.entries(RARITY).map(([rk, r]) => `
      <div class="col-group"><h4 style="--rc:${r.color}">${r.name}</h4><div class="col-grid">
      ${MINIS.filter(m => m.r === rk).map(m => {
        const n = state.minis[m.id] || 0;
        return `<button class="mini-card ${n ? 'has' : ''}" data-id="${m.id}" style="--rc:${r.color}">
          <div class="mc-img">${food(m.id, n ? '' : 'silhouette')}</div>
          <b>${n ? m.name : '???'}</b>${n > 1 ? `<span class="cnt">x${n}</span>` : ''}</button>`;
      }).join('')}</div></div>`).join('')}
      <p class="col-note">Your rarest minis show up on the shelf in your kitchen!</p></div>`;
  }

  function showMini(id) {
    const m = M[id], r = RARITY[m.r];
    const md = modal(`<div class="mini-show" style="--rc:${r.color}"><div class="ms-img">${food(id)}</div><div class="rarity-tag">${r.name}</div><h2>${m.name}</h2><p>You have ${state.minis[id]}!</p><button class="big-btn">Cute!</button></div>`);
    sfx('pop'); $('.big-btn', md).onclick = () => { sfx('tap'); md._close(); };
  }

  async function buyAndOpen() {
    if (busy) return;
    if (state.tokens > 0) { state.tokens--; save(); }
    else if (!spend(BOX_PRICE)) { sfx('wrong'); toast(`You need ${BOX_PRICE - state.coins} more coins!`); return; }
    busy = true;
    const tone = ['pink', 'mint', 'lilac'][Math.floor(Math.random() * 3)];
    const { mini, isNew } = rollMini();
    if (!state.onboarded) { state.onboarded = true; save(); }
    const r = RARITY[mini.r];
    const ov = document.createElement('div'); ov.className = 'unbox';
    ov.innerHTML = `
      <div class="ub-rays"></div>
      <div class="ub-hint">Tap the box to shake it!</div>
      <div class="ub-shakes"><i></i><i></i><i></i></div>
      <div class="ub-stage">
        <div class="ub-box drop">${blindBox('', tone)}</div>
        <div class="ub-bag hidden">${foilBag()}</div>
        <div class="ub-mini hidden"></div>
      </div>
      <div class="ub-info hidden"></div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    sfx('whoosh');
    music(null);
    const hint = $('.ub-hint', ov), box = $('.ub-box', ov), bag = $('.ub-bag', ov), stage = $('.ub-stage', ov);
    await wait(700);

    // Stage 1: shake 3 times
    await new Promise(res => {
      let shakes = 0;
      stage.onclick = () => {
        if (shakes >= 3) return;
        shakes++; sfx('shake');
        box.classList.remove('drop', 'jiggle'); void box.offsetWidth; box.classList.add('jiggle');
        $$('.ub-shakes i', ov)[shakes - 1].classList.add('on');
        const c = centerOf(box); sparkle(c.x, c.y, 8);
        if (navigator.vibrate) navigator.vibrate(30);
        if (shakes === 3) { stage.onclick = null; setTimeout(res, 450); }
      };
    });
    // lid pops, bag rises
    box.classList.add('open'); sfx('pop'); hint.textContent = '';
    $('.ub-shakes', ov).classList.add('hidden');
    await wait(500);
    bag.classList.remove('hidden'); bag.classList.add('rise');
    await wait(500);
    box.classList.add('away');
    hint.textContent = 'Tap the bag to tear it open!';

    // Stage 2: tear — the bag pulses through rarity colours, landing on the real one
    bag.style.setProperty('--glow', '#fff');
    await new Promise(res => {
      bag.onclick = async () => {
        bag.onclick = null; hint.textContent = '';
        const seq = ['#7fd8be', '#6fb6ff', '#b48cff', '#ffbf2e', '#ff6f9c'];
        const steps = 6 + r.rank * 2;
        for (let i = 0; i < steps; i++) {
          bag.style.setProperty('--glow', seq[i % seq.length]); bag.classList.remove('throb'); void bag.offsetWidth; bag.classList.add('throb');
          sfx('tick'); await wait(90 + i * 18);
        }
        bag.style.setProperty('--glow', r.color);
        sfx('rip'); bag.classList.add('tear');
        await wait(450);
        res();
      };
    });

    // Stage 3: reveal
    ov.style.setProperty('--rc', r.color);
    ov.classList.add('reveal', 'r-' + mini.r);
    bag.classList.add('hidden');
    const mm = $('.ub-mini', ov); mm.innerHTML = food(mini.id); mm.classList.remove('hidden'); mm.classList.add('spin-in');
    sfx(r.rank >= 2 ? 'rare' : 'reveal');
    const c = centerOf(mm);
    sparkle(c.x, c.y, 24, ['#fff', r.color, '#ffd24d']);
    if (r.rank >= 2) confetti(160 + r.rank * 30);
    if (mini.r === 'secret') rain(140);
    const info = $('.ub-info', ov);
    info.innerHTML = `
      <div class="rarity-tag">${r.name}</div>
      <h2>${mini.name}</h2>
      ${isNew ? '<div class="new-badge">NEW!</div>' : `<div class="dup">Already have it! +${DUP_REFUND} coins</div>`}
      <div class="modal-actions">
        <button class="small-btn ghost" data-a="done">Yay!</button>
        <button class="big-btn" data-a="again">${state.tokens > 0 ? `Open another (${state.tokens} free)` : `Open another · ${BOX_PRICE}`}</button>
      </div>`;
    await wait(500);
    info.classList.remove('hidden');
    if (mini.r === 'secret') { const s = document.createElement('div'); s.className = 'secret-msg'; s.textContent = 'You found the SECRET mini!!'; ov.appendChild(s); sfx('fanfare'); }
    const closeOv = () => { ov.classList.remove('in'); setTimeout(() => ov.remove(), 300); busy = false; music('kitchen'); };
    $('[data-a=done]', ov).onclick = () => { sfx('tap'); closeOv(); render(); };
    $('[data-a=again]', ov).onclick = () => {
      if (state.tokens <= 0 && state.coins < BOX_PRICE) { sfx('wrong'); toast(`You need ${BOX_PRICE - state.coins} more coins!`); return; }
      sfx('pop'); ov.remove(); busy = false; render(); buyAndOpen();
    };
  }

  render();
  music('kitchen');
  return () => { tb._off && tb._off(); const u = document.querySelector('.unbox'); if (u) u.remove(); };
});
