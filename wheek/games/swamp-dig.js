/* Swamp Treasure Dig — Wheek World swamp "mines" game (luck).
   Pay an entry (10/25/50), dig mud tiles on a 5x5 grid. Safe tiles raise the cash-out multiplier,
   STINK BOMBS (1, 3 or 5; 3 by default) end the dig and lose the pot. Cash out any time.
   In 15% of digs a Golden Slug hides on one safe tile and doubles the pot when dug up.

   Multiplier after k safe digs with b bombs = 0.90 * prod_{i<k} (25-i)/(25-b-i)   (true odds, 10% cut)
   The Golden Slug gives some of that back. Node sim, 400k digs per cell (RTP by "cash out after N digs"):
     bombs 1:  1 dig 90.6% | 3 digs 91.7% | 5 digs 92.9% | 8 digs 94.3% | 12 digs 96.8%
     bombs 3:  1 dig 90.6% | 3 digs 91.9% | 5 digs 93.1% | 8 digs 95.3% | 12 digs 98.3%
     bombs 5:  1 dig 90.7% | 3 digs 91.8% | 5 digs 93.5% | 8 digs 95.2% | 12 digs 98.4%
   -> about 91-95% for normal play (an effective ~5-9% edge), never above 100% at sane cash-out points.
*/
(function () {
  "use strict";
  const EDGE = 0.9, SLUG_CHANCE = 0.15;
  const ENTRIES = [10, 25, 50];
  const BOMB_OPTS = [1, 3, 5];
  const INK = "#2b1640";
  const LOOT = ["🪙", "💎", "👑", "💍", "🦆", "🥾", "🐸", "🍄", "🦴", "🐚", "⭐", "🗝️", "🧦", "🐞"];
  const LOSE_LINES = [
    "KA-PFFFT! The swamp let one rip.",
    "Stink bomb! Even the frogs left.",
    "Pee-yew! That treasure smelled like eggs.",
    "BRAAAP! The mud has gas today.",
  ];
  const BOMB_SVG = `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <path d="M62 22 Q70 6 84 10" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="86" cy="10" r="7" fill="#ffd84d" stroke="${INK}" stroke-width="3"/>
    <rect x="50" y="18" width="20" height="14" rx="4" transform="rotate(25 60 25)" fill="#4b3a5c" stroke="${INK}" stroke-width="4"/>
    <circle cx="48" cy="58" r="34" fill="#7bc043" stroke="${INK}" stroke-width="5"/>
    <circle cx="36" cy="46" r="9" fill="#b6f07a"/>
    <path d="M30 60 l8 -6 M30 54 l8 6 M58 60 l8 -6 M58 54 l8 6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M38 74 Q48 66 58 74" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M10 30 q-6 -8 2 -14 M20 18 q-6 -8 2 -14" fill="none" stroke="#5ea832" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
  const SLUG_SVG = `<svg viewBox="0 0 120 80" width="100%" height="100%" aria-hidden="true">
    <path d="M8 66 Q10 44 40 46 L80 44 Q92 18 104 24 Q114 30 110 50 Q108 66 90 68 Z" fill="#ffd84d" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M20 60 Q50 56 88 60" fill="none" stroke="#f2a900" stroke-width="5" stroke-linecap="round"/>
    <path d="M94 26 L88 6 M104 24 L108 4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="88" cy="6" r="5" fill="${INK}"/><circle cx="108" cy="4" r="5" fill="${INK}"/>
    <circle cx="96" cy="40" r="3.5" fill="${INK}"/><path d="M92 50 Q98 54 104 49" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="20" fill="#ffb347" stroke="${INK}" stroke-width="5"/>
    <path d="M40 40 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M16 20 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#fff"/>
  </svg>`;

  const CSS = `
  .g-swamp{position:absolute;inset:0;overflow:hidden;font-family:var(--body);color:var(--ink);touch-action:none;background:#1d3b24}
  .g-swamp canvas.bg{position:absolute;inset:0;width:100%;height:100%}
  .g-swamp .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:56px 12px 14px}
  .g-swamp .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;justify-content:space-between;align-items:center;z-index:4;pointer-events:none}
  .g-swamp .pill{background:#fff;border:3px solid var(--ink);border-radius:999px;padding:4px 12px;font-family:var(--display);font-size:18px;box-shadow:0 3px 0 var(--ink);white-space:nowrap}
  .g-swamp .pill.info{background:#d9ffc2;font-size:15px}
  .g-swamp .pill.x2{background:var(--orange)}
  .g-swamp .hide{display:none!important}
  .g-swamp .meter{display:flex;align-items:stretch;gap:8px;width:100%;max-width:440px}
  .g-swamp .mult{flex:1;background:var(--card);border:4px solid var(--ink);border-radius:20px;box-shadow:0 5px 0 var(--ink);text-align:center;padding:4px 6px 6px}
  .g-swamp .mult .lbl{font-size:12px;font-weight:900;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.5px}
  .g-swamp .mult .val{font-family:var(--display);font-size:34px;line-height:1;color:var(--slime-dark)}
  .g-swamp .mult .val.bump{animation:gsw-bump .35s cubic-bezier(.2,1.8,.4,1)}
  .g-swamp .mult.pot .val{color:#c78a00}
  .g-swamp .mult .sub{font-size:12px;font-weight:900;color:var(--ink-soft)}
  .g-swamp .island{position:relative;padding:12px;border-radius:38px 46px 40px 50px;background:radial-gradient(ellipse at 50% 40%,#8a5a2b,#5e3a17 70%);border:4px solid var(--ink);box-shadow:0 8px 0 rgba(0,0,0,.35),inset 0 6px 0 rgba(255,255,255,.12)}
  .g-swamp .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
  .g-swamp .tile{position:relative;border:3.5px solid var(--ink);padding:0;cursor:pointer;
    border-radius:46% 54% 42% 58%/52% 44% 56% 48%;
    background:radial-gradient(circle at 30% 70%,#4a2a10 0 3px,transparent 4px),radial-gradient(circle at 72% 62%,#4a2a10 0 2.5px,transparent 3.5px),radial-gradient(circle at 36% 30%,#c08a52,#946132 45%,#6b4220);
    box-shadow:inset 0 -6px 0 rgba(43,22,64,.28),inset 4px 4px 0 rgba(255,255,255,.18),0 4px 0 var(--ink);transition:transform .1s}
  .g-swamp .tile:active{transform:scale(.92)}
  .g-swamp .tile .bub{position:absolute;width:10px;height:10px;border-radius:50%;border:2px solid rgba(43,22,64,.6);background:rgba(255,255,255,.35);left:60%;top:22%;animation:gsw-bub 3s ease-in-out infinite}
  .g-swamp .tile.dug{cursor:default;background:radial-gradient(ellipse at 50% 58%,#1e1006 0 38%,#3b220d 40%,#6b4220 72%);box-shadow:inset 0 6px 0 rgba(0,0,0,.35),0 4px 0 var(--ink)}
  .g-swamp .tile.dug .bub{display:none}
  .g-swamp .tile .item{position:absolute;inset:8%;display:flex;align-items:center;justify-content:center;font-size:30px;line-height:1;animation:gsw-rise .5s cubic-bezier(.2,1.8,.4,1) both}
  .g-swamp .tile.ghost .item{opacity:.45;animation:none;filter:grayscale(.4)}
  .g-swamp .tile.ghost.bombt .item{opacity:.9;filter:none}
  .g-swamp .tile.boom{background:radial-gradient(circle,#d6ff9a,#7bc043);z-index:2}
  .g-swamp .tile.slug{background:radial-gradient(circle,#fff6a8,#ffd84d 60%,#f2a900)}
  .g-swamp .tile.squish{animation:gsw-squish .22s ease-out}
  .g-swamp .grid.locked .tile{pointer-events:none}
  .g-swamp .cash{width:100%;max-width:440px;min-height:62px;font-size:24px;flex-direction:column;gap:0;line-height:1}
  .g-swamp .cash small{font-family:var(--body);font-size:12px;font-weight:900}
  .g-swamp .mud{position:absolute;width:14px;height:12px;border-radius:50%;background:#6b4220;border:2px solid var(--ink);pointer-events:none;z-index:5}
  .g-swamp .gascloud{position:absolute;inset:0;z-index:6;pointer-events:none}
  .g-swamp .gascloud b{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e3ffb0,#9ad65a 55%,#5ea832);border:4px solid #2f7d14;opacity:.9}
  .g-swamp .bigtxt{position:absolute;left:0;right:0;top:40%;text-align:center;z-index:7;font-family:var(--display);font-size:46px;color:#fff;-webkit-text-stroke:2.5px var(--ink);text-shadow:0 5px 0 var(--ink);pointer-events:none;animation:gsw-big 1.6s ease-out both;padding:0 10px}
  .g-swamp .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;z-index:8;background:rgba(10,30,15,.45)}
  .g-swamp .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 8px 0 var(--ink);padding:16px 16px 18px;max-width:370px;width:100%;text-align:center;animation:gsw-pop .45s cubic-bezier(.2,1.6,.4,1)}
  .g-swamp .panel h2{font-size:32px;color:var(--slime-dark);-webkit-text-stroke:1.2px var(--ink);text-shadow:0 3px 0 var(--ink);margin-bottom:4px}
  .g-swamp .panel p{margin:4px 0 10px;font-size:15px;line-height:1.3}
  .g-swamp .lbl2{font-size:13px;font-weight:900;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.5px;margin:6px 0 4px}
  .g-swamp .chips{display:flex;gap:8px;justify-content:center}
  .g-swamp .chip{min-width:66px;min-height:48px;border:3px solid var(--ink);border-radius:14px;background:#fff;font-family:var(--display);font-size:18px;box-shadow:0 4px 0 var(--ink);line-height:1.05;padding:2px 8px}
  .g-swamp .chip small{display:block;font-family:var(--body);font-weight:900;font-size:11px;color:var(--ink-soft)}
  .g-swamp .chip.on{background:var(--slime);transform:translateY(-3px);box-shadow:0 7px 0 var(--ink)}
  .g-swamp .chip[disabled]{opacity:.4}
  .g-swamp .legend{display:flex;justify-content:center;gap:14px;margin:4px 0 4px;font-size:13px;font-weight:900;align-items:center}
  .g-swamp .legend span{display:flex;align-items:center;gap:4px}
  .g-swamp .legend i{display:inline-block;width:34px;height:30px}
  .g-swamp .go{width:100%;margin-top:12px;font-size:22px;min-height:56px}
  @keyframes gsw-bub{0%,100%{transform:translateY(0) scale(.6);opacity:0}30%{opacity:1}70%{transform:translateY(-6px) scale(1);opacity:1}80%{transform:scale(1.4);opacity:0}}
  @keyframes gsw-rise{0%{transform:translateY(40%) scale(.2);opacity:0}100%{transform:none;opacity:1}}
  @keyframes gsw-squish{0%{transform:scale(1)}40%{transform:scale(1.15,.8)}100%{transform:scale(1)}}
  @keyframes gsw-bump{0%{transform:scale(1.5)}100%{transform:scale(1)}}
  @keyframes gsw-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes gsw-big{0%{transform:scale(.2) rotate(-8deg);opacity:0}20%{transform:scale(1.15) rotate(3deg);opacity:1}35%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}
  @keyframes gsw-puff{0%{transform:scale(.1);opacity:0}25%{opacity:.95}100%{transform:scale(1.25);opacity:0}}
  `;

  function multAfter(k, b) { let m = EDGE; for (let i = 0; i < k; i++) m *= (25 - i) / (25 - b - i); return m; }

  WW.registerGame({
    id: "swamp-dig",
    name: "Swamp Treasure Dig",
    icon: "💎",
    place: "swamp",
    kind: "luck",
    blurb: "Dig for loot, dodge the stink bombs, cash out!",
    mount(root, api) {
      const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = document.createElement("div");
      el.className = "g-swamp";
      el.innerHTML = `<style>${CSS}</style><canvas class="bg"></canvas>
        <div class="hud"><span class="pill coins">🪙 0</span><span class="pill x2 hide">x2!</span><span class="pill info">💣 3 stink bombs</span></div>
        <div class="wrap">
          <div class="meter"><div class="mult"><div class="lbl">Multiplier</div><div class="val mv">x1.00</div><div class="sub nx">next dig: x1.00</div></div>
            <div class="mult pot"><div class="lbl">Pot</div><div class="val pv">0</div><div class="sub risk">bomb chance 0%</div></div></div>
          <div class="island"><div class="grid locked"></div></div>
          <button class="btn green cash" disabled>CASH OUT<small>dig a tile first!</small></button>
        </div>`;
      root.appendChild(el);
      const $ = (s) => el.querySelector(s);
      const cv = $("canvas.bg"), ctx = cv.getContext("2d");
      const gridEl = $(".grid"), cashBtn = $(".cash"), mvEl = $(".mv"), pvEl = $(".pv"), nxEl = $(".nx"), riskEl = $(".risk"), infoEl = $(".info"), coinsEl = $(".coins");
      let alive = true, raf = 0;
      const timers = new Set();
      const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); };
      let entry = 10, bombs = 3, tiles = [], dug = 0, slugMul = 1, state = "intro", shown = 1, potShown = 0;
      let W = 0, H = 0, dpr = 1;
      const bubbles = [], flies = [];

      function showCoins() { coinsEl.textContent = "🪙 " + api.coins(); $(".x2").classList.toggle("hide", !(api.multiplier > 1)); }
      showCoins();
      const pot = () => Math.floor(entry * multAfter(dug, bombs) * slugMul);

      /* ---------- background ---------- */
      function layout() {
        W = root.clientWidth || 390; H = root.clientHeight || 700; dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        const size = Math.min(W - 48, 420, (H - 56 - 14 - 110 - 80) );
        gridEl.style.width = size + "px"; gridEl.style.height = size + "px";
        tiles.forEach((t) => { t.el.style.fontSize = ""; });
        gridEl.style.setProperty("--ts", (size / 5) + "px");
        el.querySelectorAll(".tile .item").forEach((i) => (i.style.fontSize = size / 5 * 0.5 + "px"));
      }
      for (let i = 0; i < 4; i++) flies.push({ a: Math.random() * 7, r: 20 + Math.random() * 30, cx: Math.random(), cy: Math.random() * 0.25 + 0.05, s: 2 + Math.random() * 2 });
      function drawBg(t) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#2b5a3a"); g.addColorStop(0.45, "#1f4a2c"); g.addColorStop(1, "#143320");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // far trees / mist
        ctx.fillStyle = "rgba(20,50,30,.8)";
        for (let i = 0; i < 7; i++) { const x = (i / 6) * W; ctx.beginPath(); ctx.ellipse(x, H * 0.08, 70, 60 + (i % 3) * 14, 0, 0, 7); ctx.fill(); }
        // swamp water with ripples
        const wy = H * 0.12;
        const wg = ctx.createLinearGradient(0, wy, 0, H);
        wg.addColorStop(0, "#4f8a3a"); wg.addColorStop(1, "#2f5e25");
        ctx.fillStyle = wg; ctx.fillRect(0, wy, W, H - wy);
        ctx.strokeStyle = "rgba(190,240,140,.18)"; ctx.lineWidth = 3;
        for (let i = 0; i < 9; i++) {
          const y = wy + 30 + i * (H / 9), x = ((i * 137 + t * 12) % (W + 120)) - 60;
          ctx.beginPath(); ctx.ellipse(x, y, 40, 6, 0, 0, Math.PI); ctx.stroke();
        }
        // lily pads
        [[0.08, 0.3], [0.92, 0.55], [0.1, 0.86], [0.88, 0.92]].forEach(([px, py], i) => {
          const x = px * W, y = py * H + Math.sin(t + i) * 3;
          ctx.fillStyle = "#6fcf4a"; ctx.strokeStyle = "#2b1640"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 22, 0.3, Math.PI * 2 - 0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
        });
        // bubbles
        if (Math.random() < 0.08 && bubbles.length < 14) bubbles.push({ x: Math.random() * W, y: wy + 20 + Math.random() * (H - wy - 20), r: 0, max: 5 + Math.random() * 12, pop: 0 });
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          if (b.r < b.max) b.r += 0.25; else b.pop += 0.08;
          ctx.globalAlpha = Math.max(0, 1 - b.pop);
          ctx.strokeStyle = "#2b1640"; ctx.lineWidth = 2.5; ctx.fillStyle = "rgba(170,230,110,.55)";
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (1 + b.pop * 0.6), 0, 7); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, 7); ctx.fill();
          ctx.globalAlpha = 1;
          if (b.pop >= 1) bubbles.splice(i, 1);
        }
        // cattails
        for (let i = 0; i < 5; i++) {
          const side = i % 2 ? W - 6 - (i * 7) : 6 + i * 7, base = H, top = H - 120 - i * 18;
          const sway = Math.sin(t * 1.3 + i) * 6;
          ctx.strokeStyle = "#3d7a2a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(side, base); ctx.quadraticCurveTo(side, (base + top) / 2, side + sway, top); ctx.stroke();
          ctx.fillStyle = "#7a4b22"; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.ellipse(side + sway, top + 10, 6, 16, 0, 0, 7); ctx.fill(); ctx.stroke();
        }
        // flies
        ctx.fillStyle = INK;
        flies.forEach((f) => {
          f.a += 0.05 * f.s;
          const x = f.cx * W + Math.cos(f.a) * f.r, y = f.cy * H + Math.sin(f.a * 1.7) * f.r * 0.5;
          ctx.beginPath(); ctx.arc(x, y, 2.5, 0, 7); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(x - 2, y - 3, 3, 2, -0.5, 0, 7); ctx.ellipse(x + 2, y - 3, 3, 2, 0.5, 0, 7); ctx.fill(); ctx.fillStyle = INK;
        });
      }

      /* ---------- board ---------- */
      function buildBoard(reveal) {
        gridEl.innerHTML = ""; tiles = [];
        const kinds = [];
        for (let i = 0; i < 25; i++) kinds.push(i < bombs ? "bomb" : "loot");
        if (Math.random() < SLUG_CHANCE) kinds[bombs] = "slug";
        for (let i = 24; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
        const size = parseFloat(gridEl.style.width) || 300;
        kinds.forEach((k, i) => {
          const b = document.createElement("button");
          b.className = "tile"; b.setAttribute("aria-label", "mud");
          b.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`;
          if (Math.random() < 0.35) { const bb = document.createElement("span"); bb.className = "bub"; bb.style.animationDelay = -Math.random() * 3 + "s"; b.appendChild(bb); }
          const t = { el: b, kind: k, dug: false, loot: LOOT[Math.floor(Math.random() * LOOT.length)], i };
          b.addEventListener("click", () => dig(t));
          gridEl.appendChild(b); tiles.push(t);
        });
        void size;
      }
      function setItem(t, html) {
        const it = document.createElement("span"); it.className = "item";
        it.style.fontSize = (parseFloat(gridEl.style.width) || 300) / 5 * 0.5 + "px";
        it.innerHTML = html; t.el.appendChild(it);
      }
      function updateMeter(bump) {
        const m = dug ? multAfter(dug, bombs) * slugMul : 1;
        const nextM = multAfter(dug + 1, bombs) * slugMul;
        const left = 25 - dug, risk = Math.round((bombs / left) * 100);
        // count up
        const from = shown, to = m, fromP = potShown, toP = state === "dig" ? pot() : 0;
        const t0 = performance.now();
        const step = () => {
          if (!alive) return;
          const p = Math.min(1, (performance.now() - t0) / 400);
          shown = from + (to - from) * p; potShown = Math.round(fromP + (toP - fromP) * p);
          mvEl.textContent = "x" + shown.toFixed(2); pvEl.textContent = potShown + "🪙";
          if (p < 1) requestAnimationFrame(step);
        };
        step();
        if (bump) { mvEl.classList.remove("bump"); void mvEl.offsetWidth; mvEl.classList.add("bump"); pvEl.classList.remove("bump"); void pvEl.offsetWidth; pvEl.classList.add("bump"); }
        nxEl.textContent = dug >= 25 - bombs ? "all treasure found!" : "next dig: x" + nextM.toFixed(2);
        riskEl.textContent = "💣 chance " + risk + "%";
        if (state === "dig" && dug > 0) { cashBtn.disabled = false; cashBtn.innerHTML = `CASH OUT ${pot()}🪙<small>keep it safe!</small>`; }
        else { cashBtn.disabled = true; cashBtn.innerHTML = `CASH OUT<small>${state === "dig" ? "dig a tile first!" : "…"}</small>`; }
      }
      function mudBurst(t, color) {
        const r = t.el.getBoundingClientRect(), base = el.getBoundingClientRect();
        const cx = r.left - base.left + r.width / 2, cy = r.top - base.top + r.height / 2;
        for (let i = 0; i < 9; i++) {
          const m = document.createElement("span"); m.className = "mud";
          if (color) m.style.background = color;
          m.style.left = cx - 7 + "px"; m.style.top = cy - 6 + "px";
          el.appendChild(m);
          const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
          const an = m.animate([{ transform: "translate(0,0) scale(1)" }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 30}px) scale(.8)`, offset: 0.5 }, { transform: `translate(${Math.cos(a) * d * 1.3}px,${Math.sin(a) * d + 40}px) scale(.3)`, opacity: 0 }], { duration: 600, easing: "ease-out" });
          an.onfinish = () => m.remove();
        }
      }
      function bigText(txt, color) {
        const b = document.createElement("div"); b.className = "bigtxt"; b.textContent = txt;
        if (color) b.style.color = color;
        el.appendChild(b); later(() => b.remove(), 1700);
      }
      function shake(a) {
        if (reduced) a *= 0.2;
        el.animate([0, 1, 2, 3, 4, 5].map((i) => ({ transform: i === 5 ? "none" : `translate(${(Math.random() - 0.5) * a}px,${(Math.random() - 0.5) * a}px)` })), { duration: 380 });
      }

      function dig(t) {
        if (state !== "dig" || t.dug) return;
        t.dug = true;
        t.el.classList.add("squish");
        api.haptic(15);
        const r = t.el.getBoundingClientRect();
        if (t.kind === "bomb") return explode(t);
        api.sfx("splat");
        mudBurst(t);
        dug++;
        later(() => {
          t.el.classList.add("dug");
          if (t.kind === "slug") {
            slugMul *= 2;
            t.el.classList.add("slug");
            setItem(t, SLUG_SVG);
            api.sfx("fanfare"); later(() => api.sfx("sparkle"), 300); api.haptic(60);
            api.confetti(r.left + r.width / 2, r.top + r.height / 2, 80);
            bigText("GOLDEN SLUG! POT x2!", "#ffd84d");
            shake(10);
          } else {
            setItem(t, t.loot);
            api.sfx(dug % 4 === 0 ? "coin" : "pop");
          }
          updateMeter(true);
          api.floatText(r.left + r.width / 2, r.top, "x" + (multAfter(dug, bombs) * slugMul).toFixed(2), "#7be04a");
          if (dug >= 25 - bombs) later(() => cashOut(true), 600);
        }, 140);
      }
      function explode(t) {
        state = "boom"; gridEl.classList.add("locked");
        api.sfx("hit");
        later(() => { api.sfx("fart"); }, 120);
        later(() => { api.sfx("lose"); }, 700);
        api.haptic(200);
        t.el.classList.add("dug", "boom");
        setItem(t, BOMB_SVG);
        mudBurst(t, "#8fd14f");
        shake(22);
        const r = t.el.getBoundingClientRect(), base = el.getBoundingClientRect();
        api.gas(r.left + r.width / 2, r.top + r.height / 2);
        // giant fart cloud
        const cloud = document.createElement("div"); cloud.className = "gascloud";
        const cx = r.left - base.left + r.width / 2, cy = r.top - base.top + r.height / 2;
        for (let i = 0; i < 22; i++) {
          const b = document.createElement("b");
          const s = 110 + Math.random() * 190, a = Math.random() * 7, d = 40 + Math.random() * Math.max(W, H) * 0.45;
          b.style.width = b.style.height = s + "px";
          b.style.left = cx + Math.cos(a) * d - s / 2 + "px"; b.style.top = cy + Math.sin(a) * d - s / 2 + "px";
          b.animate([{ transform: "scale(.1)", opacity: 0 }, { transform: "scale(1)", opacity: 0.92, offset: 0.25 }, { transform: "scale(1.3)", opacity: 0 }], { duration: 1800 + Math.random() * 600, delay: i * 40, easing: "ease-out", fill: "both" });
          cloud.appendChild(b);
        }
        el.appendChild(cloud);
        later(() => cloud.remove(), 2700);
        bigText("KA-PFFFT!", "#c9ff8a");
        later(() => { revealAll(); }, 700);
        const lost = pot();
        later(() => {
          api.done({ earned: 0, title: "Stink bomb! 💨", text: LOSE_LINES[Math.floor(Math.random() * LOSE_LINES.length)] + (dug ? ` You lost a ${lost}🪙 pot after ${dug} digs.` : ""), score: 0 });
        }, 2000);
        state = "over"; updateMeter(false);
      }
      function revealAll() {
        tiles.forEach((t, i) => {
          if (t.dug) return;
          later(() => {
            t.el.classList.add("dug", "ghost");
            if (t.kind === "bomb") { t.el.classList.add("bombt"); setItem(t, BOMB_SVG); }
            else if (t.kind === "slug") setItem(t, SLUG_SVG);
            else setItem(t, t.loot);
          }, i * 25);
        });
      }
      function cashOut(cleared) {
        if (state !== "dig" || dug === 0) return;
        state = "over"; gridEl.classList.add("locked");
        const p = pot();
        const got = api.award(p, { reason: "Swamp Treasure Dig" });
        showCoins();
        const big = p >= entry * 3;
        api.sfx(big ? "bigwin" : "win"); api.haptic(60);
        const r = cashBtn.getBoundingClientRect();
        api.confetti(r.left + r.width / 2, r.top, big ? 130 : 70);
        api.floatText(r.left + r.width / 2, r.top - 10, "+" + got, "#ffd84d");
        bigText(cleared ? "SWAMP CLEARED!" : "+" + got + "🪙", "#ffd84d");
        cashBtn.disabled = true; cashBtn.innerHTML = `BANKED ${got}🪙<small>nice digging!</small>`;
        later(revealAll, 400);
        const mult = (multAfter(dug, bombs) * slugMul).toFixed(2);
        later(() => api.done({ earned: got, title: cleared ? "Swamp cleared!" : "Cashed out!", text: `${dug} digs, x${mult} on your ${entry}🪙 entry.${slugMul > 1 ? " The Golden Slug doubled it!" : ""}`, score: got }), 1700);
      }
      cashBtn.addEventListener("click", () => cashOut(false));

      /* ---------- intro ---------- */
      let overlay = null;
      function intro() {
        state = "intro";
        if (!ENTRIES.some((e) => e <= api.coins())) {
          overlay = document.createElement("div"); overlay.className = "overlay";
          overlay.innerHTML = `<div class="panel"><h2>Too poor to dig!</h2><p>Come back with at least 10🪙.</p><button class="btn white go">Leave</button></div>`;
          el.appendChild(overlay); overlay.querySelector(".go").onclick = () => api.exit(); return;
        }
        if (entry > api.coins()) entry = ENTRIES.filter((e) => e <= api.coins()).pop();
        overlay = document.createElement("div"); overlay.className = "overlay";
        overlay.innerHTML = `<div class="panel"><h2>Swamp Treasure Dig</h2>
          <p>Dig up loot to grow your multiplier. Hit a <b>stink bomb</b> and you lose the pot. <b>Cash out</b> any time!</p>
          <div class="legend"><span><i>${BOMB_SVG}</i>= lose it all</span><span><i style="width:44px">${SLUG_SVG}</i>= pot x2!</span></div>
          <div class="lbl2">Entry</div><div class="chips ent"></div>
          <div class="lbl2">Stink bombs</div><div class="chips bmb"></div>
          <button class="btn green go"></button></div>`;
        el.appendChild(overlay);
        const ent = overlay.querySelector(".ent"), bmb = overlay.querySelector(".bmb"), go = overlay.querySelector(".go");
        const refresh = () => {
          ent.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", +c.dataset.v === entry));
          bmb.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", +c.dataset.v === bombs));
          go.textContent = `Start digging · ${entry}🪙`;
        };
        ENTRIES.forEach((v) => { const c = document.createElement("button"); c.className = "chip"; c.dataset.v = v; c.textContent = v + "🪙"; c.disabled = v > api.coins(); c.onclick = () => { entry = v; api.sfx("click"); refresh(); }; ent.appendChild(c); });
        BOMB_OPTS.forEach((v) => { const c = document.createElement("button"); c.className = "chip"; c.dataset.v = v; c.innerHTML = `${v}<small>${v === 1 ? "chill" : v === 3 ? "normal" : "spicy!"}</small>`; c.onclick = () => { bombs = v; api.sfx("click"); refresh(); }; bmb.appendChild(c); });
        go.onclick = start;
        refresh();
      }
      function start() {
        if (!api.spend(entry)) { api.sfx("buzz"); api.toast("Not enough coins!"); return; }
        api.sfx("coin"); showCoins();
        overlay.remove(); overlay = null;
        dug = 0; slugMul = 1; shown = 1; potShown = 0;
        infoEl.textContent = `💣 ${bombs} stink bomb${bombs > 1 ? "s" : ""}`;
        buildBoard();
        state = "dig"; gridEl.classList.remove("locked");
        updateMeter(false);
        api.sfx("splat");
        tiles.forEach((t, i) => t.el.animate([{ transform: "scale(0)" }, { transform: t.el.style.transform }], { duration: 350, delay: i * 18, easing: "cubic-bezier(.2,1.6,.4,1)", fill: "backwards" }));
      }

      let t0 = performance.now();
      function frame(now) {
        if (!alive) return;
        drawBg((now - t0) / 1000);
        raf = requestAnimationFrame(frame);
      }
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      layout();
      buildBoard();
      updateMeter(false);
      intro();
      raf = requestAnimationFrame(frame);
      el._swamp = { tiles: () => tiles, state: () => state };

      return {
        destroy() {
          alive = false;
          cancelAnimationFrame(raf);
          timers.forEach((t) => clearTimeout(t)); timers.clear();
          window.removeEventListener("resize", onResize);
          el.getAnimations ? el.getAnimations({ subtree: true }).forEach((a) => a.cancel()) : 0;
          el.remove();
        },
      };
    },
  });
})();
