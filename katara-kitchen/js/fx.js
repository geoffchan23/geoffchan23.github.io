// Visual effects: confetti canvas, floating text, flying coins, sparkles.
let cv, cx, parts = [], raf = 0;
function ensure() {
  if (cv) return;
  cv = document.createElement('canvas'); cv.className = 'fx-canvas';
  document.body.appendChild(cv); cx = cv.getContext('2d');
  const rs = () => { const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); };
  rs(); addEventListener('resize', rs);
}
const COLORS = ['#ff8fb1', '#ffd24d', '#7fd8be', '#8ec9ff', '#c7b5ff', '#ffb37f', '#fff'];
function loop() {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts) {
    p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    cx.save(); cx.globalAlpha = Math.min(1, p.life / 25); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
    if (p.shape === 'rect') cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
    else if (p.shape === 'star') { star(p.s); }
    else if (p.shape === 'heart') { heart(p.s); }
    else { cx.beginPath(); cx.arc(0, 0, p.s / 2, 0, 7); cx.fill(); }
    cx.restore();
  }
  if (parts.length) raf = requestAnimationFrame(loop); else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
}
function star(s) { cx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * .22 : s * .55, a = i * Math.PI / 5 - Math.PI / 2; cx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } cx.closePath(); cx.fill(); }
function heart(s) { const k = s / 30; cx.beginPath(); cx.moveTo(0, 9 * k); cx.bezierCurveTo(-15 * k, -2 * k, -8 * k, -14 * k, 0, -6 * k); cx.bezierCurveTo(8 * k, -14 * k, 15 * k, -2 * k, 0, 9 * k); cx.fill(); }
function start() { if (!raf) raf = requestAnimationFrame(loop); }

export function confetti(n = 120, { x = innerWidth / 2, y = innerHeight * 0.35, spread = 1 } = {}) {
  ensure();
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (4 + Math.random() * 9) * spread;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, g: 0.28, drag: 0.985, rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
      s: 7 + Math.random() * 8, c: COLORS[i % COLORS.length], life: 90 + Math.random() * 60, shape: ['rect', 'rect', 'circle', 'star', 'heart'][i % 5] });
  }
  start();
}
export function rain(n = 80) {
  ensure();
  for (let i = 0; i < n; i++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .5, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3,
    g: 0.05, drag: 0.995, rot: Math.random() * 6, vr: (Math.random() - .5) * .2, s: 8 + Math.random() * 8, c: COLORS[i % COLORS.length], life: 200, shape: ['rect', 'star', 'heart', 'circle'][i % 4] });
  start();
}
export function sparkle(x, y, n = 14, colors = ['#fff', '#ffd24d', '#ff8fb1']) {
  ensure();
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, v = 2 + Math.random() * 4;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.02, drag: 0.93, rot: 0, vr: 0.1, s: 8 + Math.random() * 10, c: colors[i % colors.length], life: 40 + Math.random() * 20, shape: 'star' }); }
  start();
}
export function hearts(x, y, n = 6) {
  ensure();
  for (let i = 0; i < n; i++) parts.push({ x: x + (Math.random() - .5) * 40, y, vx: (Math.random() - .5) * 1.5, vy: -2 - Math.random() * 2, g: -0.01, drag: 0.99, rot: 0, vr: 0, s: 16 + Math.random() * 12, c: ['#ff6f9c', '#ff9ec0', '#ffb3c7'][i % 3], life: 70, shape: 'heart' });
  start();
}

export function floatText(text, x, y, cls = '') {
  const el = document.createElement('div'); el.className = 'float-text ' + cls; el.textContent = text;
  el.style.left = x + 'px'; el.style.top = y + 'px'; document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}
export function centerOf(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

// coins fly from a point to the coin counter
export function flyCoins(from, n, coinSvg, onEach) {
  const target = document.querySelector('.coin-pill .ico-coin') || document.querySelector('.coin-pill');
  if (!target) return;
  const to = centerOf(target);
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div'); el.className = 'fly-coin'; el.innerHTML = coinSvg;
    el.style.left = from.x + 'px'; el.style.top = from.y + 'px'; document.body.appendChild(el);
    const dx = (Math.random() - .5) * 120, dy = -40 - Math.random() * 60;
    const anim = el.animate([
      { transform: 'translate(-50%,-50%) scale(.4)', offset: 0 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, offset: .35 },
      { transform: `translate(calc(-50% + ${to.x - from.x}px), calc(-50% + ${to.y - from.y}px)) scale(.6)`, offset: 1 },
    ], { duration: 700 + i * 60, easing: 'cubic-bezier(.5,0,.6,1)', delay: i * 40 });
    anim.onfinish = () => { el.remove(); onEach && onEach(i); const p = document.querySelector('.coin-pill'); if (p) { p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); } };
  }
}
export const wait = (ms) => new Promise(r => setTimeout(r, ms));
