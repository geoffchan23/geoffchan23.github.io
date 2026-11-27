/* Wheek World: games you play WITH your guinea, right in the hutch.
   Tricks (copy the dance), Hide & Seek, Bubble Catch (drag your guinea), Treat Toss (flick treats). */
"use strict";
const HOME_GAMES = [
  { id: "tricks", ico: "🎭", name: "Guinea Tricks", how: g => `${g.name} shows a dance. Copy it by tapping the moves in the same order!`, cap: 120 },
  { id: "hide", ico: "🙈", name: "Hide & Seek", how: g => `${g.name} hides in a box. Watch the boxes move, then tap where ${g.name} is!`, cap: 120 },
  { id: "bubbles", ico: "🫧", name: "Bubble Catch", how: g => `Drag ${g.name} left and right to pop the falling bubbles. Dodge the stinky green ones!`, cap: 120 },
  { id: "toss", ico: "🥕", name: "Treat Toss", how: g => `Flick treats up to ${g.name}'s mouth while they wander around!`, cap: 120 },
];
let HG = null;

function openHomeGames(g) {
  const m = openModal(`<h2>Play with ${esc(g.name)}!</h2><p class="muted center">Free games. Win coins and make ${esc(g.name)} super happy!</p>
    <div class="hg-list">${HOME_GAMES.map(x => `<button class="hg-pick" data-hg="${x.id}"><span class="hg-ico">${x.ico}</span><span class="hg-txt"><b>${esc(x.name)}</b><small>${esc(x.how(g))}</small>${G.best["home-" + x.id] ? `<em>Best: ${fmt(G.best["home-" + x.id])}</em>` : ""}</span><span class="sg-go">PLAY</span></button>`).join("")}</div>`);
  $$("[data-hg]", m.el).forEach(b => b.onclick = () => { play("click"); m.close(); setTimeout(() => startHomeGame(b.dataset.hg), 250); });
}
function hgStop() {
  if (!HG) return;
  HG.alive = false; cancelAnimationFrame(HG.raf); HG.timers.forEach(clearTimeout); HG.intervals.forEach(clearInterval);
  if (HG.layer) HG.layer.remove(); if (HG.panel) HG.panel.remove();
  const v = $("#view"); if (v) v.classList.remove("hg"); const room = $(".room"); if (room) { room.classList.remove("hg-mode"); room.onpointerdown = room.onpointermove = room.onpointerup = null; }
  const s = petSvg(); if (s) s.classList.remove("hidden-pet");
  if (PA.el) { PA.el.style.setProperty("--wt", "300ms"); PA.el.style.setProperty("--wx", "0px"); PA.wx = 0; }
  PA.busy = false; HG = null;
}
function startHomeGame(id) {
  if (ROUTE.name !== "home") { go("home"); setTimeout(() => startHomeGame(id), 400); return; }
  hgStop(); const tray = $("#tray"); if (tray) tray.hidden = true;
  const def = HOME_GAMES.find(x => x.id === id), g = activeG();
  const room = $(".room"), view = $("#view");
  view.classList.add("hg"); room.classList.add("hg-mode");
  const layer = document.createElement("div"); layer.className = "hg-layer"; room.appendChild(layer);
  const panel = document.createElement("div"); panel.className = "hg-panel card";
  panel.innerHTML = `<div class="hg-hud"><b class="hg-title">${def.ico} ${esc(def.name)}</b><span class="hg-score">⭐ <b id="hgScore">0</b></span><span class="hg-info" id="hgInfo"></span><button class="btn small white" id="hgQuit">Quit</button></div><div class="hg-msg" id="hgMsg"></div><div class="hg-ctrl" id="hgCtrl"></div>`;
  view.appendChild(panel);
  wake(); PA.busy = true;
  HG = { id, def, g, room, layer, panel, score: 0, coins: 0, alive: true, timers: [], intervals: [], raf: 0 };
  $("#hgQuit", panel).onclick = () => { play("click"); hgFinish(true); };
  const H0 = HG; requestAnimationFrame(() => requestAnimationFrame(() => { if (HG === H0 && H0.alive) ({ tricks: gameTricks, hide: gameHide, bubbles: gameBubbles, toss: gameToss })[id](H0); }));
}
const hgWait = ms => new Promise(r => { if (!HG) return r(); HG.timers.push(setTimeout(r, ms)); });
function hgMsg(t, big) { const m = $("#hgMsg"); if (m) { m.innerHTML = t; m.classList.toggle("big", !!big); m.classList.remove("pop"); void m.offsetWidth; m.classList.add("pop"); } }
function hgScore(n, x, y, txt) { if (!HG) return; HG.score += n; const s = $("#hgScore"); if (s) s.textContent = fmt(HG.score); if (x != null && n) floatText(x, y, txt || (n > 0 ? "+" + n : String(n)), n > 0 ? "#2f7d14" : "#c0203a", 22); }
function hgFinish(quit) {
  if (!HG || HG.ending) return; HG.ending = true;
  const { def, g, score } = HG;
  const coins = Math.min(def.cap, Math.round(HG.coins));
  const paid = quit && !score ? 0 : Math.round(coins * keeperBonus() * (buddyPower("champ") ? 1.25 : 1));
  hgStop();
  tireOut(g, 8);
  if (paid) { addCoins(paid, centerOf($("#pet"))); }
  G.stats.homeGames = (G.stats.homeGames || 0) + 1; questProgress("homegame"); addXP(6);
  g.joy = clamp(g.joy + 15, 0, 100); refreshStatBars(g);
  const best = G.best["home-" + def.id] || 0; const isNew = score > best; if (isNew) G.best["home-" + def.id] = score;
  saveSoon(); checkAchievements();
  if (quit && !score) return;
  play(paid ? "win" : "pop"); if (paid) confetti(innerWidth / 2, innerHeight / 3, 50);
  const m = openModal(`<div class="center"><div class="big-emoji">${def.ico}</div><h2>${isNew ? "New best score!" : "Great playing!"}</h2><p class="mtext">Score: <b>${fmt(score)}</b>${best && !isNew ? ` (best ${fmt(best)})` : ""}. ${esc(g.name)} had SO much fun! +15 fun</p><div class="earned">${COIN}<b>+${fmt(paid)}</b></div>${keeperBonus() > 1 ? `<p class="muted">Includes keeper level bonus +${Math.round((keeperBonus() - 1) * 100)}%</p>` : ""}<div class="mrow"><button class="btn white" data-ok>Done</button><button class="btn green" data-again>Play again</button></div></div>`, { sticky: true });
  $("[data-ok]", m.el).onclick = () => { m.close(); if (ROUTE.name === "home") render(); };
  $("[data-again]", m.el).onclick = () => { m.close(); setTimeout(() => startHomeGame(def.id), 250); };
}

/* ---------- 1. GUINEA TRICKS (copy the dance) ---------- */
const TRICKS = [
  { k: "popcorn", ico: "🍿", n: "Popcorn", run: () => { pcls("popcorn", 650); play("jump"); } },
  { k: "spin", ico: "🌀", n: "Spin", run: () => { pcls("spin", 600); play("whoosh"); } },
  { k: "wheek", ico: "📢", n: "Wheek", run: () => { pcls("eager", 600); play("wheek"); floatText(...mouthVP(), "WHEEK!", "#ff5fa8", 20); } },
  { k: "sniff", ico: "👃", n: "Sniff", run: () => { pcls("sniff", 800); play("sniff"); } },
  { k: "ears", ico: "👂", n: "Ears", run: () => { pcls("earwiggle", 750); play("boop"); } },
  { k: "wiggle", ico: "💃", n: "Wiggle", run: () => { pcls("giggle"); setTimeout(() => puncls("giggle"), 650); play("giggle"); } },
];
async function gameTricks(H) {
  let seq = [], lives = 2, round = 0;
  const info = () => { $("#hgInfo").textContent = "❤️".repeat(lives) + " · Round " + (round + 1); };
  const ctrl = $("#hgCtrl");
  const avail = () => TRICKS.slice(0, round < 3 ? 4 : 6);
  const drawBtns = on => { ctrl.innerHTML = `<div class="trick-grid">${avail().map(t => `<button class="trick" data-tk="${t.k}" ${on ? "" : "disabled"}><span>${t.ico}</span>${t.n}</button>`).join("")}</div>`; };
  const flash = k => { const b = $(`[data-tk="${k}"]`); if (b) { b.classList.remove("lit"); void b.offsetWidth; b.classList.add("lit"); } };
  while (H.alive && round < 10) {
    info();
    if (seq.length < round + 2) seq.push(pick(avail()).k);
    drawBtns(false); hgMsg(`👀 Watch ${esc(H.g.name)}!`, true); await hgWait(900);
    const gap = Math.max(560, 900 - round * 40);
    for (const k of seq) { if (!H.alive) return; flash(k); TRICKS.find(t => t.k === k).run(); await hgWait(gap); }
    if (!H.alive) return;
    hgMsg("👉 Your turn! Copy the dance!", true); drawBtns(true);
    const ok = await new Promise(res => {
      let i = 0;
      $$("[data-tk]", ctrl).forEach(b => b.onclick = () => {
        const k = b.dataset.tk; flash(k); TRICKS.find(t => t.k === k).run();
        if (k !== seq[i]) { $$("[data-tk]", ctrl).forEach(x => x.disabled = true); return res(false); }
        if (++i >= seq.length) { $$("[data-tk]", ctrl).forEach(x => x.disabled = true); res(true); }
      });
    });
    if (!H.alive) return;
    if (ok) { round++; hgScore(seq.length * 10, ...bodyVP()); H.coins += 10 + round * 2; play("win"); hearts(...bodyVP(), 5); hgMsg(pick(["Perfect! 🎉", "You did it! 🌟", "Amazing dancing! 💃"]), true); await hgWait(1100); }
    else { lives--; play("lose"); pcls("look-l", 600); floatText(...bodyVP(), "?!", "#c0203a", 28); hgMsg(lives ? "Oops! Try that dance again." : "Out of tries!", true); await hgWait(1200); if (!lives) break; }
  }
  if (H.alive) hgFinish();
}

/* ---------- 2. HIDE & SEEK ---------- */
const HIDE_PROPS = ["📦", "🧺", "🪴", "🎁", "🛍️"];
const HIDE_JUNK = ["🧦", "🥔", "💩", "🧸", "🍌", "🦆"];
async function gameHide(H) {
  const r = roomRect(), floorY = r.height * .8;
  let round = 0;
  const ctrl = $("#hgCtrl"); ctrl.innerHTML = `<p class="muted center">Keep your eyes on the box ${esc(H.g.name)} jumps into!</p>`;
  while (H.alive && round < 6) {
    const n = [3, 3, 4, 4, 5, 5][round];
    $("#hgInfo").textContent = `Round ${round + 1} / 6`;
    const xs = Array.from({ length: n }, (_, i) => r.width * (i + .5) / n);
    const boxes = xs.map((x, i) => { const b = document.createElement("button"); b.className = "hide-box"; b.textContent = HIDE_PROPS[i % HIDE_PROPS.length]; b.style.transform = `translate(${x}px,${floorY}px) translate(-50%,-100%)`; b._x = x; H.layer.appendChild(b); return b; });
    const at = Math.floor(Math.random() * n);
    hgMsg(`${esc(H.g.name)} is hiding...`, true);
    await hgWait(500);
    await walkTo(xs[at] - r.width / 2, 450);
    pcls("popcorn", 600); play("jump"); await hgWait(350);
    const sv = petSvg(); if (sv) sv.classList.add("hidden-pet");
    boxes[at].classList.add("wobble"); play("squish"); await hgWait(500); boxes[at].classList.remove("wobble");
    // shuffle: swap pairs of boxes, the guinea stays inside its box
    const swaps = round === 0 ? 0 : round + 1, speed = Math.max(260, 520 - round * 45);
    for (let s = 0; s < swaps && H.alive; s++) {
      const a = Math.floor(Math.random() * n); let b = Math.floor(Math.random() * (n - 1)); if (b >= a) b++;
      const A = boxes[a], B = boxes[b], ax = A._x, bx = B._x;
      A.style.transition = B.style.transition = `transform ${speed}ms ease-in-out`;
      A.style.transform = `translate(${bx}px,${floorY}px) translate(-50%,-100%)`; B.style.transform = `translate(${ax}px,${floorY}px) translate(-50%,-100%)`;
      A._x = bx; B._x = ax; play("whoosh"); await hgWait(speed + 60);
    }
    if (!H.alive) return;
    hgMsg(`Where is ${esc(H.g.name)}? Tap a box!`, true);
    const t0 = performance.now();
    let tries = 0;
    const found = await new Promise(res => {
      boxes.forEach((b, i) => b.onclick = () => {
        if (b.classList.contains("open")) return;
        b.classList.add("open");
        if (i === at) { res(true); return; }
        tries++; play("fart"); const j = document.createElement("span"); j.className = "hide-junk"; j.textContent = pick(HIDE_JUNK); b.appendChild(j);
        floatText(...centerOf(b), "Nope!", "#c0203a", 20);
        if (tries >= 2) res(false); else hgMsg("Not there! One more try...", true);
      });
    });
    boxes.forEach(b => b.onclick = null);
    if (!H.alive) return;
    const bx = boxes[at]._x - r.width / 2; PA.wx = bx; PA.el.style.setProperty("--wt", "0ms"); PA.el.style.setProperty("--wx", bx + "px");
    if (sv) sv.classList.remove("hidden-pet");
    boxes[at].classList.add("open", "lift"); pcls("popcorn", 650); play(found ? "wheek" : "giggle");
    if (found) { const fast = Math.max(0, 6 - Math.floor((performance.now() - t0) / 800)); const pts = 20 + fast * 5 - tries * 10; hgScore(pts, ...bodyVP(), `Found me! +${pts}`); H.coins += 14 + fast * 2 - tries * 6; hearts(...bodyVP(), 5); }
    else floatText(...bodyVP(), "Here I was!", "#3d8bff", 20);
    await hgWait(1300);
    boxes.forEach(b => b.remove()); await walkTo(0, 300);
    round++;
  }
  if (H.alive) hgFinish();
}

/* ---------- 3. BUBBLE CATCH (drag your guinea) ---------- */
function gameBubbles(H) {
  const room = H.room, r = roomRect();
  const ctrl = $("#hgCtrl"); ctrl.innerHTML = `<p class="muted center">👆 Drag anywhere in the room to move ${esc(H.g.name)}. Pop 🫧 and ✨ bubbles, avoid 🤢 green ones!</p>`;
  hgMsg("Drag to move!", true);
  let target = 0, t0 = performance.now(), last = t0, spawnT = 0, left = 45;
  const bubbles = [];
  const svg0 = petSvg(); const petW = svg0 ? svg0.getBoundingClientRect().width : 150;
  const lim = Math.max(0, (r.width - petW) / 2 - 4);
  const setX = cx => { target = clamp(cx - r.left - r.width / 2, -lim, lim); };
  room.onpointerdown = e => { setX(e.clientX); }; room.onpointermove = e => { if (e.buttons || e.pointerType === "touch") setX(e.clientX); };
  PA.el.style.setProperty("--wt", "0ms");
  const step = t => {
    if (!H.alive) return;
    const dt = Math.min(50, t - last) / 1000; last = t;
    left = 45 - (t - t0) / 1000; $("#hgInfo").textContent = "⏱️ " + Math.max(0, Math.ceil(left)) + "s";
    PA.wx += (target - PA.wx) * Math.min(1, dt * 12); PA.el.style.setProperty("--wx", PA.wx.toFixed(1) + "px");
    const sv = petSvg(); if (sv) sv.classList.toggle("walking", Math.abs(target - PA.wx) > 6);
    spawnT -= dt;
    if (spawnT <= 0 && left > 1) {
      const el = (t - t0) / 1000; spawnT = Math.max(.35, 1.1 - el * .018);
      const kind = Math.random() < .12 ? "gold" : Math.random() < .22 + el * .004 ? "stink" : "norm";
      const size = kind === "gold" ? 38 : 30 + Math.random() * 22;
      const b = document.createElement("div"); b.className = "hg-bub " + kind; b.style.width = b.style.height = size + "px"; H.layer.appendChild(b);
      bubbles.push({ el: b, x: 20 + Math.random() * (r.width - 40), y: -size, vy: 55 + Math.random() * 30 + el * 2.2, ph: Math.random() * 6, size, kind });
    }
    const [hx, hy] = toRoom(partPt(".nose", .5)), reach = petW * .38;
    for (const b of bubbles) {
      if (b.dead) continue;
      b.y += b.vy * dt; const x = b.x + Math.sin(t / 500 + b.ph) * 14;
      b.el.style.transform = `translate(${x}px,${b.y}px) translate(-50%,-50%)`;
      if (Math.abs(b.y - (hy - petW * .2)) < 28 && Math.abs(x - hx) < reach) {
        b.dead = true; b.el.classList.add("pop"); setTimeout(() => b.el.remove(), 250);
        const vp = [x + r.left, b.y + r.top];
        if (b.kind === "stink") { play("fart"); gas(...vp, 14); hgScore(-3, ...vp); pcls("gassy", 700); }
        else if (b.kind === "gold") { play("sparkle"); bits("dot", ...vp, 12, { c: ["#ffd84d", "#fff"], v: 3, s: 3 }); hgScore(5, ...vp); H.coins += 5; pcls("popcorn", 600); }
        else { play("pop"); bits("dot", ...vp, 6, { c: ["#bfefff", "#fff"], v: 2.5, s: 2.5 }); hgScore(1, ...vp); H.coins += 1.4; if (Math.random() < .2) pcls("popcorn", 600); }
      } else if (b.y > r.height + 30) { b.dead = true; b.el.remove(); }
    }
    if (left <= 0 && bubbles.every(b => b.dead)) { hgFinish(); return; }
    H.raf = requestAnimationFrame(step);
  };
  H.raf = requestAnimationFrame(step);
}

/* ---------- 4. TREAT TOSS (flick treats) ---------- */
function gameToss(H) {
  const room = H.room, r = roomRect();
  const TREATS = ["strawberry", "carrot", "lettuce", "cucumber", "dandelion"];
  let left = 12, caught = 0, streak = 0, flying = null, wander = 0, nextMove = 0;
  const ctrl = $("#hgCtrl");
  const drawInfo = () => { $("#hgInfo").textContent = `🥕 ${left} left`; };
  ctrl.innerHTML = `<p class="muted center">👆 Grab the treat and flick it up to ${esc(H.g.name)}'s mouth!</p>`;
  hgMsg("Flick the treat!", true); drawInfo();
  let home = [r.width / 2, r.height - 34];
  let treat = null;
  const newTreat = () => { if (left <= 0 || !H.alive) return; const rr = roomRect(); home = [rr.width * .5 + (Math.random() - .5) * rr.width * .3, rr.height - 34]; treat = document.createElement("div"); treat.className = "toss-treat"; treat.innerHTML = itemIcon(pick(TREATS)); H.layer.appendChild(treat); treat._p = home.slice(); place(treat); };
  const place = el => { el.style.transform = `translate(${el._p[0]}px,${el._p[1]}px) translate(-50%,-50%)`; };
  let drag = null;
  room.onpointerdown = e => { if (!treat || flying) return; const [x, y] = toRoom([e.clientX, e.clientY]); if (Math.hypot(x - treat._p[0], y - treat._p[1]) > 70) return; drag = { pts: [[x, y, performance.now()]] }; try { room.setPointerCapture(e.pointerId); } catch {} };
  room.onpointermove = e => { if (!drag) return; const [x, y] = toRoom([e.clientX, e.clientY]); drag.pts.push([x, y, performance.now()]); if (drag.pts.length > 6) drag.pts.shift(); treat._p = [x, y]; place(treat); };
  room.onpointerup = () => {
    if (!drag) return; const pts = drag.pts; drag = null;
    const a = pts[0], b = pts[pts.length - 1], dt = Math.max(16, b[2] - a[2]);
    let vx = (b[0] - a[0]) / dt * 16, vy = (b[1] - a[1]) / dt * 16;
    if (vy > -4) { treat._p = home.slice(); place(treat); toast("Flick it UP towards " + H.g.name + "!", "👆"); return; }
    const sp = Math.hypot(vx, vy), max = 26; if (sp > max) { vx *= max / sp; vy *= max / sp; }
    flying = { el: treat, x: treat._p[0], y: treat._p[1], vx, vy }; treat = null; left--; drawInfo(); play("whoosh");
  };
  let last = performance.now();
  const step = t => {
    if (!H.alive) return;
    const f = Math.min(3, (t - last) / 16.7); last = t;
    // guinea wanders around, faster as you score
    if (t > nextMove) { nextMove = t + Math.max(700, 1700 - caught * 90); walkTo((Math.random() * 2 - 1) * r.width * .3, Math.max(450, 900 - caught * 40)); }
    if (flying) {
      flying.vy += .55 * f; flying.x += flying.vx * f; flying.y += flying.vy * f;
      flying.el.style.transform = `translate(${flying.x}px,${flying.y}px) translate(-50%,-50%) rotate(${flying.x * 2}deg)`;
      const [mx, my] = toRoom(mouthVP()), sv = petSvg(), w = sv ? sv.getBoundingClientRect().width : 150;
      if (Math.hypot(flying.x - mx, flying.y - my) < w * .2) {
        const el = flying.el; flying = null; el.remove(); caught++; streak++;
        const pts = 10 + Math.min(5, streak - 1) * 2; hgScore(pts, ...mouthVP(), streak > 1 ? `x${streak} streak! +${pts}` : `Caught! +${pts}`);
        H.coins += 8 + Math.min(4, streak - 1) * 1.5;
        pcls("munch"); pcls("chew"); play("chomp"); bits("sq", ...mouthVP(), 6, { c: ["#ff5a6e", "#7be04a", "#ff9b2e"], v: 2.5, s: 4 });
        setTimeout(() => puncls("munch", "chew"), 700);
        if (streak % 3 === 0) { pcls("popcorn", 650); play("wheek"); }
        H.timers.push(setTimeout(newTreat, 500));
      } else if (flying.y > r.height + 40 || flying.x < -40 || flying.x > r.width + 40) {
        flying.el.remove(); flying = null; streak = 0; play("splat"); floatText(r.left + r.width / 2, r.top + r.height * .6, pick(["Missed!", "Plop!", "So close!"]), "#c0203a", 20);
        H.timers.push(setTimeout(newTreat, 400));
      }
    }
    if (left <= 0 && !flying && !treat) { H.timers.push(setTimeout(() => { if (H.alive) hgFinish(); }, 600)); return; }
    H.raf = requestAnimationFrame(step);
  };
  newTreat(); H.raf = requestAnimationFrame(step);
}
