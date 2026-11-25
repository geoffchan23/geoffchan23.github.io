import { mochi, coin, boxToken, soundIcon, homeIcon } from './art.js';
import { state, save, onChange } from './state.js';
import { sfx, refreshMusic, stopMusic } from './audio.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const app = $('#app');
let cleanup = null;
export const screens = {};
export const register = (name, fn) => { screens[name] = fn; };

/* ---------------- transitions ---------------- */
const iris = $('#iris');
$('.iris-face', iris).innerHTML = mochi({ mood: 'happy' });
let navigating = false;
export async function go(name, params = {}, { instant = false } = {}) {
  if (navigating) return;
  navigating = true;
  if (!instant) {
    iris.classList.remove('open'); iris.classList.add('closing'); sfx('whoosh');
    await new Promise(r => setTimeout(r, 380));
  }
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  app.innerHTML = ''; app.className = 'screen-' + name;
  window.scrollTo(0, 0);
  try { cleanup = screens[name](app, params) || null; } catch (e) { console.error(e); }
  if (!instant) {
    iris.classList.remove('closing'); iris.classList.add('open');
    await new Promise(r => setTimeout(r, 420));
    iris.classList.remove('open');
  }
  navigating = false;
}

/* ---------------- shared UI ---------------- */
export function topbar({ title = '', back = 'hub', showTokens = true } = {}) {
  const el = document.createElement('header');
  el.className = 'topbar';
  el.innerHTML = `
    ${back ? `<button class="icon-btn home-btn" aria-label="Back to kitchen">${homeIcon()}</button>` : '<span class="tb-spacer"></span>'}
    <div class="tb-title">${title}</div>
    <div class="tb-right">
      ${showTokens ? `<button class="pill token-pill" aria-label="Blind box tokens">${boxToken()}<b>${state.tokens}</b></button>` : ''}
      <div class="pill coin-pill">${coin()}<b>${state.coins}</b></div>
      <button class="icon-btn sound-btn" aria-label="Toggle sound">${soundIcon(state.settings.sound)}</button>
    </div>`;
  if (back) $('.home-btn', el).onclick = () => { sfx('tap'); go(back); };
  const tp = $('.token-pill', el); if (tp) tp.onclick = () => { sfx('tap'); go('boxes'); };
  $('.sound-btn', el).onclick = () => {
    state.settings.sound = !state.settings.sound; state.settings.music = state.settings.sound; save();
    $('.sound-btn', el).innerHTML = soundIcon(state.settings.sound);
    if (state.settings.music) refreshMusic(); else stopMusic();
    sfx('tap');
  };
  const off = onChange(s => {
    const c = $('.coin-pill b', el); if (c) c.textContent = s.coins;
    const t = $('.token-pill b', el); if (t) t.textContent = s.tokens;
  });
  el._off = off;
  return el;
}

export function modal(html, { cls = '', onClose, dismiss = true } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap ' + cls;
  wrap.innerHTML = `<div class="modal" role="dialog">${html}</div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('in'));
  const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 250); onClose && onClose(); };
  if (dismiss) wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  wrap._close = close;
  return wrap;
}

export function toast(html, ms = 2600, cls = '') {
  const t = document.createElement('div'); t.className = 'toast ' + cls; t.innerHTML = html.trim().startsWith('<svg') ? html : `<div>${html}</div>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, ms);
}

// Mochi with a speech bubble
export function say(container, text, { mood = 'normal', ms = 0 } = {}) {
  let b = $('.bubble', container);
  if (!b) { b = document.createElement('div'); b.className = 'bubble'; container.appendChild(b); }
  b.innerHTML = text; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  const m = $('.mochi-holder', container);
  if (m) m.innerHTML = mochi({ mood });
  if (ms) { clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('pop'), ms); }
}

