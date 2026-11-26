/* Where's Pudding? — Wheek World carnival cup shuffle (FREE skill game, no coins in).
   Her guinea hides under a cup; watch the shuffle and tap the right cup. Every find starts a harder round
   (more cups, more and faster swaps, the Trickster Rat's sneaky swap in a fart cloud). A wrong cup costs
   one of 3 hearts and replays that round. Points per find = 3 + 2 x round; coins = points (cap 200),
   paid once with api.award when the hearts run out.
   Rough payouts: pure guessing ~10-20, a decent tracker reaching round 7-9 ~80-120, a great one 200.
*/
(function () {
  "use strict";
  const ID = "cup-shuffle", LIVES = 3, CAP = 200;
  const HEART = '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';
  // difficulty per round (1-based)
  function level(r) {
    return {
      n: r <= 2 ? 3 : r <= 5 ? 4 : 5,
      swaps: Math.min(17, 4 + r),
      d0: Math.max(300, 560 - 22 * r),
      d1: Math.max(150, 400 - 26 * r),
      rat: r >= 3 ? Math.min(0.6, 0.15 + 0.06 * r) : 0,
      dbl: r >= 8 ? Math.min(0.5, 0.12 * (r - 7)) : 0,
    };
  }
  const pts = (r) => 3 + 2 * r;
  const INK = "#2b1640";
  const JUNK = ["🧦", "💩", "🥕", "🐛", "🧀", "🍃", "🦴", "🧽", "🍪"];
  const WIN_LINES = ["Wheek! You found me!", "Eagle eyes! Pudding is SO proud.", "Found her! Snack time!", "Nothing gets past you!"];
  const LOSE_LINES = ["Just a stinky sock under there!", "Pudding was over here, giggling!", "The cups tricked you! Pfffbt.", "Wrong cup! Pudding did a little dance."];

  const CUP_SVG = `<svg viewBox="0 0 100 112" width="100%" height="100%" aria-hidden="true">
    <defs><linearGradient id="gcu-g" x1="0" x2="1"><stop offset="0" stop-color="#ff7a85"/><stop offset=".45" stop-color="#ff4d68"/><stop offset="1" stop-color="#c92a4f"/></linearGradient></defs>
    <path d="M8 98 L22 14 Q50 4 78 14 L92 98 Q50 110 8 98Z" fill="url(#gcu-g)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M14.5 60 Q50 70 85.5 60 L88.5 78 Q50 89 11.5 78Z" fill="#fff6e8" stroke="${INK}" stroke-width="3.5"/>
    <path d="M18 38 Q50 47 82 38" fill="none" stroke="#ffd84d" stroke-width="5"/>
    <circle cx="50" cy="71" r="5" fill="#ffd84d" stroke="${INK}" stroke-width="2.5"/>
    <ellipse cx="50" cy="13" rx="28" ry="7" fill="#ff8fa0" stroke="${INK}" stroke-width="4"/>
    <path d="M28 24 L22 88" stroke="#fff" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>
    <path d="M8 98 Q50 110 92 98" fill="none" stroke="#ffd84d" stroke-width="4"/>
  </svg>`;
  const RAT_SVG = `<svg viewBox="0 0 120 110" width="100%" height="100%" aria-hidden="true">
    <path d="M18 88 Q-6 70 10 52" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M18 88 Q-6 70 10 52" fill="none" stroke="#ff9cbc" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="60" cy="78" rx="40" ry="26" fill="#a7a3b8" stroke="${INK}" stroke-width="5"/>
    <circle cx="38" cy="30" r="15" fill="#a7a3b8" stroke="${INK}" stroke-width="5"/><circle cx="38" cy="30" r="8" fill="#ff9cbc"/>
    <circle cx="82" cy="30" r="15" fill="#a7a3b8" stroke="${INK}" stroke-width="5"/><circle cx="82" cy="30" r="8" fill="#ff9cbc"/>
    <path d="M30 52 Q60 22 90 52 Q98 70 60 82 Q22 70 30 52Z" fill="#bdb9cc" stroke="${INK}" stroke-width="5"/>
    <rect x="34" y="44" width="22" height="12" rx="5" fill="${INK}"/><rect x="64" y="44" width="22" height="12" rx="5" fill="${INK}"/><path d="M56 49 H64" stroke="${INK}" stroke-width="4"/>
    <circle cx="40" cy="47" r="2.5" fill="#fff"/><circle cx="70" cy="47" r="2.5" fill="#fff"/>
    <circle cx="60" cy="64" r="5" fill="#ff5a8a" stroke="${INK}" stroke-width="3"/>
    <path d="M48 70 Q60 80 72 70" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="55" y="72" width="5" height="7" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="60" y="72" width="5" height="7" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <path d="M40 64 L22 60 M40 68 L22 70 M80 64 L98 60 M80 68 L98 70" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  const CSS = `
  .g-cups{position:absolute;inset:0;overflow:hidden;font-family:var(--body);color:var(--ink);touch-action:none;
    background:radial-gradient(circle at 20% 30%,rgba(255,216,77,.25) 0 3px,transparent 4px) 0 0/70px 60px,radial-gradient(circle at 70% 60%,rgba(255,143,199,.3) 0 3px,transparent 4px) 0 0/90px 80px,radial-gradient(ellipse at 50% 55%,#7a3fb8 0,#47267a 55%,#2a1650 100%)}
  .g-cups .cups{position:absolute;inset:0;z-index:2}
  .g-cups .banner{position:absolute;left:50%;transform:translateX(-50%);z-index:1;font-family:var(--display);color:#ffd84d;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);white-space:nowrap;opacity:.9;pointer-events:none}
  .g-cups .tent{position:absolute;left:-10px;right:-10px;top:0;height:120px;
    background:repeating-linear-gradient(90deg,#ff4d68 0 36px,#fff6e8 36px 72px);border-bottom:4px solid var(--ink);
    -webkit-mask:radial-gradient(circle at 18px 100%,transparent 17px,#000 18px) 0 0/36px 100% repeat-x;mask:radial-gradient(circle at 18px 100%,transparent 17px,#000 18px) 0 0/36px 100% repeat-x}
  .g-cups .tentshade{position:absolute;left:0;right:0;top:0;height:120px;background:linear-gradient(rgba(43,22,64,.0),rgba(43,22,64,.25));pointer-events:none}
  .g-cups .lights{position:absolute;left:0;right:0;top:118px;height:30px;pointer-events:none}
  .g-cups .lights i{position:absolute;top:6px;width:12px;height:16px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;border:2.5px solid var(--ink);animation:gcu-blink 1.2s infinite}
  .g-cups .table{position:absolute;left:-20px;right:-20px;border-top:5px solid var(--ink);
    background:linear-gradient(#ffb347,#e8832a 30%,#c4661c);box-shadow:inset 0 10px 0 rgba(255,255,255,.25)}
  .g-cups .table:before{content:"";position:absolute;left:0;right:0;top:0;height:46px;z-index:1;background:repeating-linear-gradient(90deg,#5fd3ff 0 30px,#c7e9ff 30px 60px);border-bottom:4px solid var(--ink);
    -webkit-mask:radial-gradient(circle at 15px 31px,#000 15px,transparent 16px) 0 0/30px 100% repeat-x,linear-gradient(#000,#000) 0 0/100% 31px no-repeat;mask:radial-gradient(circle at 15px 31px,#000 15px,transparent 16px) 0 0/30px 100% repeat-x,linear-gradient(#000,#000) 0 0/100% 31px no-repeat}
  .g-cups .table:after{content:"";position:absolute;left:0;right:0;top:22px;bottom:0;background:repeating-linear-gradient(90deg,transparent 0 60px,rgba(43,22,64,.12) 60px 64px)}
  .g-cups .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;justify-content:space-between;align-items:center;z-index:6;pointer-events:none}
  .g-cups .pill{background:#fff;border:3px solid var(--ink);border-radius:999px;padding:4px 12px;font-family:var(--display);font-size:18px;box-shadow:0 3px 0 var(--ink);white-space:nowrap}
  .g-cups .pill.rd{background:var(--yellow)}
  .g-cups .pill.lv{display:flex;gap:1px;padding:3px 8px}
  .g-cups .pill.lv svg{display:block;transition:transform .3s,filter .3s,opacity .3s}
  .g-cups .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
  .g-cups .bump{animation:gcu-bump .3s}
  .g-cups .sheet .btn.go{font-size:24px}
  .g-cups .sheet .art{display:flex;justify-content:center;align-items:flex-end;gap:4px;height:84px}
  .g-cups .sheet .art .c{width:56px;height:62px}
  .g-cups .sheet .art .p{width:76px;animation:gcu-wiggle 1.4s ease-in-out infinite}
  .g-cups .tot{font-family:var(--display);font-size:24px;margin:2px 0 8px}
  .g-cups .pill.x2{background:var(--orange)}
  .g-cups .hide{display:none!important}
  .g-cups .sign{position:absolute;left:50%;top:62px;transform:translateX(-50%);z-index:5;max-width:86%;
    background:#fff6e8;border:4px solid var(--ink);border-radius:18px;box-shadow:0 5px 0 var(--ink);padding:8px 16px;
    font-family:var(--display);font-size:21px;text-align:center;line-height:1.1;width:max-content;max-width:90%}
  .g-cups .sign.pop{animation:gcu-pop .4s cubic-bezier(.2,1.6,.4,1)}
  .g-cups .sign.ratsign{background:#ffe1e6;white-space:normal;font-size:20px;width:min(340px,88%)}
  .g-cups .cup{position:absolute;left:0;top:0;will-change:transform}
  .g-cups .cup .shadow{position:absolute;left:8%;right:8%;bottom:-6%;height:16%;border-radius:50%;background:rgba(43,22,64,.35)}
  .g-cups .cup .under{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:flex-end;font-size:44px;line-height:1}
  .g-cups .cup .under svg{display:block}
  .g-cups .cup .body{position:absolute;left:0;right:0;bottom:-2%;height:104%;will-change:transform}
  .g-cups .cup.pickable{cursor:pointer}
  .g-cups .cup.pickable .body{animation:gcu-wiggle 1.4s ease-in-out infinite}
  .g-cups .cup.pickable:nth-child(2n) .body{animation-delay:-.5s}
  .g-cups .cup.pickable:nth-child(3n) .body{animation-delay:-.9s}
  .g-cups .rat{position:absolute;width:110px;height:100px;z-index:7;pointer-events:none;will-change:transform}
  .g-cups .cloud{position:absolute;z-index:6;pointer-events:none;opacity:0;transition:opacity .35s}
  .g-cups .cloud.on{opacity:.8}
  .g-cups .cloud b{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 35%,#d6ff9a,#8fd14f 55%,#5ea832);border:4px solid #2f7d14;animation:gcu-puff 1.1s ease-in-out infinite alternate}
  .g-cups .sheet{position:absolute;left:8px;right:8px;bottom:10px;z-index:8;background:var(--card);border:4px solid var(--ink);border-radius:24px;box-shadow:0 6px 0 var(--ink);padding:12px 14px 14px;text-align:center;max-width:460px;margin:0 auto;animation:gcu-up .35s cubic-bezier(.2,1.4,.4,1)}
  .g-cups .sheet h2{font-size:28px;color:var(--pink-deep);-webkit-text-stroke:1.2px var(--ink);text-shadow:0 3px 0 var(--ink)}
  .g-cups .sheet p{margin:4px 0 8px;font-size:15px;line-height:1.25}
  .g-cups .lbl{font-size:13px;font-weight:900;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.5px;margin:4px 0 4px}
  .g-cups .chips{display:flex;gap:8px;justify-content:center;margin-bottom:6px}
  .g-cups .chip{min-width:58px;min-height:46px;border:3px solid var(--ink);border-radius:14px;background:#fff;font-family:var(--display);font-size:18px;box-shadow:0 4px 0 var(--ink);padding:2px 8px;line-height:1.05}
  .g-cups .chip small{display:block;font-family:var(--body);font-weight:900;font-size:11px;color:var(--ink-soft)}
  .g-cups .chip.on{background:var(--yellow);transform:translateY(-3px);box-shadow:0 7px 0 var(--ink)}
  .g-cups .chip[disabled]{opacity:.4}
  .g-cups .go{width:100%;margin-top:6px;font-size:22px;min-height:56px}
  .g-cups .row{display:flex;gap:10px}
  .g-cups .row .btn{flex:1}
  .g-cups .msg{font-family:var(--display);font-size:24px;padding:6px 0}
  .g-cups .win{font-family:var(--display);font-size:44px;color:#ffd84d;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);line-height:1}
  @keyframes gcu-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
  @keyframes gcu-blink{0%,100%{background:#ffd84d}50%{background:#ff8fc7}}
  @keyframes gcu-pop{0%{transform:translateX(-50%) scale(.3)}100%{transform:translateX(-50%) scale(1)}}
  @keyframes gcu-up{0%{transform:translateY(120%)}100%{transform:translateY(0)}}
  @keyframes gcu-wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-3deg)}40%{transform:rotate(3deg)}60%{transform:rotate(0)}}
  @keyframes gcu-puff{0%{transform:scale(.92)}100%{transform:scale(1.08)}}
  @media (prefers-reduced-motion: reduce){.g-cups .cup.pickable .body{animation:none}}
  `;

  const ease = (p) => 0.5 - 0.5 * Math.cos(Math.PI * p);
  const easeOutBack = (p) => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

  WW.registerGame({
    id: ID,
    name: "Where's Pudding?",
    icon: "🥤",
    place: "carnival",
    kind: "skill",
    blurb: "Follow the cups! Each find gets trickier.",
    mount(root, api) {
      const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pigName = (api.guinea && api.guinea.name) || "Pudding";
      const el = document.createElement("div");
      el.className = "g-cups";
      el.innerHTML = `<style>${CSS}</style>
        <div class="tent"></div><div class="tentshade"></div><div class="lights"></div>
        <div class="banner">WHERE'S ${pigName.toUpperCase()}?</div><div class="table"></div>
        <div class="hud"><span class="pill lv">${HEART}${HEART}${HEART}</span><span class="pill rd">Round 1</span><span class="pill x2 hide">x2!</span><span class="pill sc">⭐ 0</span></div>
        <div class="sign hide"></div>
        <div class="cups"></div>
        <div class="cloud"></div>
        <div class="rat hide">${RAT_SVG}</div>`;
      root.appendChild(el);
      const $ = (s) => el.querySelector(s);
      const rdEl = $(".rd"), scEl = $(".sc"), hearts = [...el.querySelectorAll(".lv svg")], signEl = $(".sign"), cupsEl = $(".cups"), cloudEl = $(".cloud"), ratEl = $(".rat"), tableEl = $(".table"), banner = $(".banner");
      let alive = true, raf = 0;
      const timers = new Set();
      const wait = (ms) => new Promise((res) => { const id = setTimeout(() => { timers.delete(id); if (alive) res(); }, ms); timers.add(id); });
      const tweens = [];
      const tween = (dur, fn) => new Promise((res) => tweens.push({ t0: performance.now(), dur, fn, res }));

      let W = 0, H = 0, tableY = 0, cupW = 90, cupH = 100;
      let n = 3, round = 1, lives = LIVES, score = 0, found = 0, bestRound = 0, state = "intro";
      let cups = []; // {el, body, under, slot, x, y, s, z, lift, hasPig}
      let pigCup = null;

      // lights
      const lights = $(".lights");
      function setHud() {
        $(".x2").classList.toggle("hide", !(api.multiplier > 1));
        rdEl.textContent = "Round " + round; scEl.textContent = "⭐ " + score;
        hearts.forEach((h, i) => h.classList.toggle("gone", i >= lives));
      }
      function bump(e) { e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }

      function layout() {
        W = root.clientWidth || 390; H = root.clientHeight || 700;
        tableY = Math.round(Math.min(H * 0.66, H - 210));
        tableEl.style.top = tableY - Math.round(cupW * 0.12) + "px"; tableEl.style.bottom = "0";
        lights.innerHTML = "";
        const nl = Math.floor(W / 34);
        for (let i = 0; i < nl; i++) { const b = document.createElement("i"); b.style.left = (i * 34 + 10) + "px"; b.style.animationDelay = (i % 3) * -0.4 + "s"; lights.appendChild(b); }
        sizeCups();
        banner.style.top = Math.max(150, tableY - cupH * 2.75) + "px"; banner.style.fontSize = Math.min(40, W * 0.08) + "px";
        cups.forEach((c) => { c.x = slotX(c.slot); c.y = 0; render(c); });
        cloudEl.style.left = "0"; cloudEl.style.right = "0"; cloudEl.style.top = (tableY - cupH * 1.5) + "px"; cloudEl.style.height = cupH * 2.1 + "px";
      }
      function sizeCups() {
        const gap = Math.min((W - 20) / n, 150);
        cupW = Math.min(gap * 0.9, 128); cupH = cupW * 1.12;
        tableEl.style.top = tableY - Math.round(cupW * 0.12) + "px";
      }
      function ratY() { const sb = signEl.offsetTop + signEl.offsetHeight + 6; return Math.max(sb, tableY - cupH - 150); }
      function slotX(i) { const gap = Math.min((W - 20) / n, 150); return W / 2 + (i - (n - 1) / 2) * gap; }
      function render(c) {
        c.el.style.width = cupW + "px"; c.el.style.height = cupH + "px";
        const x = c.x - cupW / 2, y = tableY - cupH + c.y;
        c.el.style.transform = `translate(${x}px,${y}px) scale(${c.s})`;
        c.el.style.zIndex = String(Math.round(10 + c.z * 10));
        // never lift a cup up into the tent/sign on short screens
        const maxLift = Math.max(0.55, (tableY - cupH - 165) / (cupH * 0.95));
        c.body.style.transform = `translateY(${-Math.min(c.lift, maxLift) * cupH * 0.95}px) rotate(${c.rot || 0}deg)`;
        c.under.style.visibility = c.lift > 0.04 ? "visible" : "hidden"; // never let a hidden guinea peek out
      }
      function buildCups(pigSlot) {
        cupsEl.innerHTML = ""; cups = [];
        sizeCups();
        for (let i = 0; i < n; i++) {
          const d = document.createElement("div"); d.className = "cup";
          d.innerHTML = `<div class="shadow"></div><div class="under"></div><div class="body">${CUP_SVG}</div>`;
          cupsEl.appendChild(d);
          const c = { el: d, body: d.querySelector(".body"), under: d.querySelector(".under"), slot: i, x: slotX(i), y: 0, s: 1, z: 0, lift: 1.2, hasPig: i === pigSlot, rot: 0 };
          d.addEventListener("pointerdown", (e) => { e.preventDefault(); pick(c); });
          cups.push(c); render(c);
        }
        pigCup = cups[pigSlot];
        pigCup.under.innerHTML = api.guineaSVG({ size: cupW * 0.9, mood: "happy" });
      }

      /* ---------- bottom sheet ---------- */
      let sheet = null;
      function closeSheet() { if (sheet) { sheet.remove(); sheet = null; } }
      function openSheet(html) { closeSheet(); sheet = document.createElement("div"); sheet.className = "sheet"; sheet.innerHTML = html; el.appendChild(sheet); return sheet; }
      function introSheet() {
        state = "intro";
        const s = openSheet(`<h2>Where's ${pigName}?</h2>
          <p>${pigName} hides under a cup. <b>Watch the shuffle</b>, then tap her cup! Each round gets trickier. 3 misses and it's over.</p>
          <button class="btn green go">Start!</button>`);
        s.querySelector(".go").onclick = () => startRun();
      }
      function startRun() {
        api.sfx("click");
        round = 1; lives = LIVES; score = 0; found = 0; bestRound = 0;
        setHud();
        startRound();
      }
      function endRun() {
        state = "over";
        const coins = Math.min(CAP, score);
        const earned = coins > 0 ? api.award(coins, { reason: "Where's Pudding?" }) : 0;
        const hs = api.highscore(ID, score);
        const title = hs.isNew && score > 0 ? "New best!" : found >= 8 ? "Eagle eyes!" : found >= 4 ? "Sharp tracker!" : found ? "Good try!" : "Pfffbt!";
        const text = found
          ? `You found ${pigName} ${found} time${found === 1 ? "" : "s"} and reached round ${round}! Score ${score}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`
          : `The cups were too sneaky this time. ${pigName} says watch her cup like a hawk! Best: ${hs.best}`;
        api.done({ earned, title, text, score });
        api.sfx(found >= 4 ? "fanfare" : "lose");
        say(found ? `${pigName} had fun! 🎉` : "Pfffbt! Sneaky cups!");
        const s = openSheet(`<h2>${title}</h2><p>Found ${pigName} <b>${found}</b> time${found === 1 ? "" : "s"} · reached round <b>${round}</b></p>
          <div class="tot">⭐ ${score} &nbsp; 🪙 +${earned}</div>
          <button class="btn green go">Play again!</button>`);
        s.querySelector(".go").onclick = () => startRun();
      }

      /* ---------- round ---------- */
      function say(txt, cls) {
        signEl.className = "sign" + (cls ? " " + cls : "");
        signEl.innerHTML = txt;
        void signEl.offsetWidth; signEl.classList.add("pop");
      }
      async function startRound() {
        const L = level(round);
        n = L.n;
        state = "hide"; closeSheet(); setHud();
        const pigSlot = Math.floor(Math.random() * n);
        buildCups(pigSlot);
        cups.forEach((c) => { c.lift = 1.3; render(c); });
        say(`Round ${round}: ${n} cups!`);
        api.sfx("wheek");
        await tween(450, (p) => { pigCup.under.style.transform = `scale(${0.4 + 0.6 * easeOutBack(p)})`; });
        await wait(round <= 2 ? 650 : 400);
        // cups drop
        await tween(300, (p) => { const q = p * p; cups.forEach((c) => { c.lift = 1.3 * (1 - q); render(c); }); });
        api.sfx("hit"); api.haptic(25); shake(6);
        cups.forEach((c) => squash(c));
        await wait(380);
        // trickster rat?
        const rat = el._forceRat || Math.random() < L.rat;
        if (rat) {
          say(`🐀 TRICKSTER RAT is here!<br><span style="font-size:15px;font-family:var(--body);font-weight:900">He'll sneak an extra swap in a fart cloud!</span>`, "ratsign");
          ratEl.classList.remove("hide");
          await tween(500, (p) => { ratEl.style.transform = `translate(${W - 120 * easeOutBack(p)}px,${ratY()}px) rotate(${-10 + 10 * p}deg)`; });
          api.sfx("boop");
          await wait(1300);
          await tween(300, (p) => { ratEl.style.transform = `translate(${W - 120 + 140 * p}px,${ratY()}px)`; });
          ratEl.classList.add("hide");
        }
        say("Watch closely! 👀");
        await wait(400);
        await shuffle(rat, L);
        if (!alive) return;
        state = "pick";
        say(`Where's ${pigName}? Tap a cup!`);
        cups.forEach((c) => c.el.classList.add("pickable"));
        api.sfx("drum");
      }
      function swapPlan(count) {
        const plan = [];
        let last = "";
        for (let i = 0; i < count; i++) {
          let a, b, key;
          do { a = Math.floor(Math.random() * n); b = Math.floor(Math.random() * n); key = Math.min(a, b) + "-" + Math.max(a, b); } while (a === b || (key === last && Math.random() < 0.7));
          last = key; plan.push([a, b]);
        }
        return plan;
      }
      async function swap(sa, sb, dur, quiet) {
        const ca = cups.find((c) => c.slot === sa), cb = cups.find((c) => c.slot === sb);
        const xa = ca.x, xb = cb.x;
        const dist = Math.abs(sa - sb);
        const arc = cupH * (0.16 + 0.08 * dist);
        const front = Math.random() < 0.5 ? ca : cb;
        if (!quiet) api.sfx(dur < 320 ? "tick" : "whoosh");
        await tween(dur, (p) => {
          const e = ease(p), k = Math.sin(Math.PI * p);
          ca.x = xa + (xb - xa) * e; cb.x = xb + (xa - xb) * e;
          [ca, cb].forEach((c) => { const f = c === front ? 1 : -1; c.y = f * arc * k * 0.55; c.s = 1 + f * 0.12 * k; c.z = f * k; c.rot = (c === ca ? 1 : -1) * (xb > xa ? 1 : -1) * 8 * k; render(c); });
        });
        ca.slot = sb; cb.slot = sa;
        [ca, cb].forEach((c) => { c.y = 0; c.s = 1; c.z = 0; c.rot = 0; c.x = slotX(c.slot); render(c); });
      }
      async function shuffle(rat, L) {
        const count = L.swaps;
        const plan = swapPlan(count);
        const d0 = L.d0, d1 = L.d1;
        const ratAt = Math.floor(count * (0.45 + Math.random() * 0.3));
        for (let i = 0; i < plan.length; i++) {
          if (!alive) return;
          const dur = d0 + (d1 - d0) * (i / Math.max(1, plan.length - 1));
          if (rat && i === ratAt) await ratSwap();
          // at 5 cups and high heat, sometimes two disjoint swaps at once
          const [a, b] = plan[i];
          if (n === 5 && i > 2 && Math.random() < L.dbl) {
            const free = [0, 1, 2, 3, 4].filter((s) => s !== a && s !== b);
            const c1 = free[Math.floor(Math.random() * free.length)];
            const rest = free.filter((s) => s !== c1);
            const c2 = rest[Math.floor(Math.random() * rest.length)];
            await Promise.all([swap(a, b, dur), swap(c1, c2, dur, true)]);
          } else await swap(a, b, dur);
        }
      }
      async function ratSwap() {
        api.sfx("fart"); api.haptic(60); shake(10);
        const r = el.getBoundingClientRect();
        api.gas(r.left + W / 2, r.top + tableY - cupH * 0.5);
        buildCloud();
        cloudEl.classList.add("on");
        say("PFFFRRRT! Sneaky swap!", "ratsign");
        ratEl.classList.remove("hide");
        const y = tableY - cupH * 1.1;
        const run = tween(1500, (p) => { ratEl.style.transform = `translate(${-120 + (W + 140) * p}px,${y}px) scaleX(-1) rotate(${Math.sin(p * 40) * 6}deg)`; });
        await wait(350);
        let a = Math.floor(Math.random() * n), b;
        if (Math.random() < 0.5) a = pigCup.slot; // the rat loves messing with Pudding
        do { b = Math.floor(Math.random() * n); } while (b === a);
        await swap(a, b, 520, true);
        await run;
        ratEl.classList.add("hide");
        cloudEl.classList.remove("on");
        say("Watch closely! 👀");
        await wait(300);
      }
      function buildCloud() {
        cloudEl.innerHTML = "";
        const ch = cupH * 2.1;
        cloudEl.style.top = (tableY - cupH * 1.55) + "px"; cloudEl.style.height = ch + "px";
        for (let i = 0; i < 9; i++) {
          const b = document.createElement("b");
          const s = ch * (0.55 + Math.random() * 0.4);
          b.style.width = b.style.height = s + "px";
          b.style.left = (i / 8) * (W + 40) - s / 2 - 10 + "px";
          b.style.top = (ch - s) / 2 + (Math.random() - 0.5) * ch * 0.3 + "px";
          b.style.animationDelay = -Math.random() + "s";
          cloudEl.appendChild(b);
        }
      }
      function squash(c) {
        tween(380, (p) => { const k = Math.sin(p * Math.PI * 2) * (1 - p); c.body.style.transform = `translateY(0) scale(${1 + 0.12 * k},${1 - 0.12 * k})`; c.body.style.transformOrigin = "50% 100%"; });
      }
      let shakeAmt = 0;
      function shake(a) { shakeAmt = Math.max(shakeAmt, reduced ? a * 0.2 : a); }

      async function pick(c) {
        if (state !== "pick") return;
        state = "reveal";
        cups.forEach((k) => k.el.classList.remove("pickable"));
        api.sfx("click"); api.haptic(15);
        const win = c === pigCup;
        cups.forEach((k) => { if (k !== pigCup) k.under.textContent = JUNK[Math.floor(Math.random() * JUNK.length)]; });
        cups.forEach((k) => { k.under.style.fontSize = cupW * 0.42 + "px"; });
        if (win) pigCup.under.innerHTML = api.guineaSVG({ size: cupW * 0.9, mood: "happy" });
        else pigCup.under.innerHTML = api.guineaSVG({ size: cupW * 0.9, mood: "wow" });
        await tween(380, (p) => { c.lift = easeOutBack(p) * 1.05; render(c); });
        if (!alive) return;
        const r = c.el.getBoundingClientRect();
        if (win) {
          api.sfx("wheek");
          await wait(250);
          const got = pts(round);
          score += got; found++; bestRound = round;
          api.sfx(round >= 5 ? "bigwin" : "win"); api.haptic(50);
          api.confetti(r.left + r.width / 2, r.top + r.height / 2, round >= 5 ? 110 : 60);
          api.floatText(r.left + r.width / 2, r.top, "+" + got + "⭐", "#ffd84d");
          shake(8);
          setHud(); bump(scEl);
          say(WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)]);
          await wait(1300);
          if (!alive) return;
          round++;
          const nx = level(round);
          if (nx.n > n) say(`Level up! Now ${nx.n} cups! 🥤`);
          else say(`Round ${round}: faster! 💨`);
          setHud(); bump(rdEl);
          api.sfx("whoosh");
          await tween(320, (p) => { cups.forEach((k) => { k.lift = Math.max(k.lift, 1.3 * p); render(k); }); });
          await wait(600);
          if (!alive) return;
          startRound();
        } else {
          api.sfx("buzz");
          await wait(450);
          await tween(380, (p) => { pigCup.lift = easeOutBack(p) * 1.05; render(pigCup); });
          api.sfx(Math.random() < 0.5 ? "fart" : "lose"); api.haptic(80);
          api.gas(r.left + r.width / 2, r.top + r.height * 0.6);
          lives--; setHud(); bump(hearts[Math.max(0, lives)]);
          say(LOSE_LINES[Math.floor(Math.random() * LOSE_LINES.length)]);
          await wait(1500);
          if (!alive) return;
          if (lives <= 0) { endRun(); return; }
          say(`${lives} heart${lives === 1 ? "" : "s"} left. Try round ${round} again!`);
          await wait(1100);
          if (!alive) return;
          startRound();
        }
      }

      /* ---------- loop ---------- */
      function frame(now) {
        if (!alive) return;
        for (let i = tweens.length - 1; i >= 0; i--) {
          const t = tweens[i]; const p = Math.min(1, (now - t.t0) / t.dur);
          t.fn(p);
          if (p >= 1) { tweens.splice(i, 1); t.res(); }
        }
        if (shakeAmt > 0.3) { el.style.transform = `translate(${(Math.random() - 0.5) * shakeAmt}px,${(Math.random() - 0.5) * shakeAmt}px)`; shakeAmt *= 0.85; }
        else if (shakeAmt) { shakeAmt = 0; el.style.transform = ""; }
        raf = requestAnimationFrame(frame);
      }
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      layout();
      buildCups(1);
      cups.forEach((c) => { c.lift = 1.3; render(c); });
      say(`Find ${pigName}!`);
      setHud();
      introSheet();
      raf = requestAnimationFrame(frame);
      el._cups = { cups: () => cups, pig: () => pigCup, state: () => state };

      return {
        destroy() {
          alive = false;
          cancelAnimationFrame(raf);
          timers.forEach((t) => clearTimeout(t)); timers.clear();
          tweens.length = 0;
          window.removeEventListener("resize", onResize);
          el.remove();
        },
      };
    },
  });
})();
