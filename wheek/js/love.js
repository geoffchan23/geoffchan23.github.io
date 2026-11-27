/* Wheek World: LOVE ❤️. A cookie-clicker style boop game on top of the home hutch.
   Boops and pets earn Love. Spend Love on boop upgrades and Boop Helpers (who earn Love by
   themselves, even while you're away). Total Love raises your Love Level: titles, coins,
   new boop effects and special outfits. Golden Hearts float by for bonuses. */
"use strict";

const fmtBig = n => { n = Math.floor(n); if (n < 1e4) return fmt(n); const u = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]]; for (const [v, s] of u) if (n >= v) return (n / v).toFixed(n / v < 100 ? 1 : 0).replace(/\.0$/, "") + s; return fmt(n); };
const LOVE_UPS = [
  { id: "f1", n: "Squishy Finger", ico: "👆", cost: 30, d: "+1 Love per boop", add: 1 },
  { id: "f2", n: "Double Boop", ico: "✌️", cost: 150, d: "Boops give DOUBLE Love", mult: 2 },
  { id: "f3", n: "Boop Gloves", ico: "🧤", cost: 600, d: "+5 Love per boop", add: 5 },
  { id: "f4", n: "Nose Seeker", ico: "👃", cost: 1500, d: "Nose boops give 10x (instead of 5x)", nose: 10 },
  { id: "f5", n: "Mega Boop", ico: "💥", cost: 5000, d: "Boops give DOUBLE Love again", mult: 2 },
  { id: "f6", n: "Combo Master", ico: "🔥", cost: 12000, d: "Combos go up to x5 (instead of x3)", combo: 5 },
  { id: "f7", n: "Golden Touch", ico: "✨", cost: 25000, d: "Golden Hearts appear twice as often", golden: 2 },
  { id: "f8", n: "Helper Hugs", ico: "🤗", cost: 60000, d: "All Boop Helpers make DOUBLE Love", helpers: 2 },
  { id: "f9", n: "Boop of Legends", ico: "🏆", cost: 200000, d: "Boops give TRIPLE Love", mult: 3 },
  { id: "f10", n: "Cosmic Finger", ico: "🌌", cost: 1000000, d: "Boops give 5x Love. Wow.", mult: 5 },
];
const LOVE_HELPERS = [
  { id: "feather", n: "Tickle Feather", ico: "🪶", cost: 15, lps: .2, d: "Gently tickles. Makes a little Love." },
  { id: "sock", n: "Sock Puppet", ico: "🧦", cost: 100, lps: 1, d: "Boops with its sock nose." },
  { id: "robo", n: "Robo-Booper", ico: "🤖", cost: 1100, lps: 8, d: "BEEP. BOOP. BOOP. BOOP." },
  { id: "fairy", n: "Boop Fairy", ico: "🧚", cost: 12000, lps: 47, d: "Sprinkles boops from above." },
  { id: "cloud", n: "Snuggle Cloud", ico: "☁️", cost: 130000, lps: 260, d: "A big fluffy hug, all day long." },
  { id: "ufo", n: "Alien Huggers", ico: "🛸", cost: 1400000, lps: 1400, d: "They came from space to boop." },
];
const LOVE_TITLES = ["Stranger", "Acquaintance", "Buddy", "Pal", "Good Friend", "Best Friend", "BFF", "Snuggle Buddy", "Heart Twins", "Soulmates", "Love Legends", "Boop Royalty", "Cosmic Cuddlers", "Galaxy of Love", "Infinite Love"];
const LOVE_EFFECTS = [
  { id: "hearts", n: "Hearts", ico: "💗", lv: 1 }, { id: "sparkle", n: "Sparkles", ico: "✨", lv: 2 }, { id: "bubbles", n: "Bubbles", ico: "🫧", lv: 4 },
  { id: "rainbow", n: "Rainbow", ico: "🌈", lv: 6 }, { id: "confetti", n: "Party", ico: "🎉", lv: 8 }, { id: "fireworks", n: "Fireworks", ico: "🎆", lv: 10 }, { id: "galaxy", n: "Galaxy", ico: "🌌", lv: 13 },
];
const LOVE_GIFTS = { 3: "freckles", 5: "boopcrown", 7: "heartspecs", 9: "angelwings", 11: "unicornhorn", 13: "halo", 15: "fairywings" };
const loveNeed = lv => lv <= 1 ? 0 : Math.round(100 * Math.pow(2.6, lv - 2));   // total Love needed to reach level lv
function L() { if (!G.love) G.love = { lp: 0, total: 0, ups: {}, helpers: {}, last: now(), level: 1, effect: "hearts", nextGold: now() + 2 * MIN, frenzy: 0, combo: 0, comboT: 0 }; return G.love; }
const loveHas = id => !!L().ups[id];
function lovePerBoop() {
  let v = 1; LOVE_UPS.forEach(u => { if (loveHas(u.id)) { if (u.add) v += u.add; if (u.mult) v *= u.mult; } });
  if (L().frenzy > now()) v *= 7;
  if (eventOn("parade")) v *= 2;
  if (buddyPower("lovemagnet")) v *= 2;
  if (buddyPower("floaty")) v *= 1.5;
  v *= 1 + sqPerk("love");
  return v;
}
function loveLps() {
  const l = L(); let v = 0; LOVE_HELPERS.forEach(h => v += (l.helpers[h.id] || 0) * h.lps);
  if (loveHas("f8")) v *= 2;
  if (anyPower("hype")) v *= 1.5;
  v *= 1 + sqPerk("helpers");
  const g = activeG(); if (g && g.joy > 70) v *= 1.2;   // happy guineas make helpers work harder
  return v;
}
const helperCost = h => Math.ceil(h.cost * Math.pow(1.15, L().helpers[h.id] || 0));
function addLove(n, x, y, txt) {
  const l = L(); l.lp += n; l.total += n;
  if (x != null) floatText(x, y, txt || `+${fmtBig(n)} ❤️`, "#e8458f", 20);
  while (l.total >= loveNeed(l.level + 1) && l.level < LOVE_TITLES.length) { l.level++; queueEvent({ type: "lovelevel", level: l.level }); }
  renderLovePill(); saveSoon();
}
/* called from boop(): returns nothing, adds Love with combo */
function loveBoop(x, y, nose) {
  const l = L(), t = now();
  const cap = loveHas("f6") ? 5 : 3;
  l.combo = t - (l.comboT || 0) < 900 ? Math.min(60, (l.combo || 0) + 1) : 1; l.comboT = t;
  const comboMult = 1 + (cap - 1) * Math.min(1, (l.combo - 1) / 40);
  let n = lovePerBoop() * comboMult; if (nose) n *= loveHas("f4") ? 10 : 5;
  n = Math.max(1, Math.round(n));
  addLove(n, x, y - 34, nose ? `NOSE! +${fmtBig(n)} ❤️` : undefined);
  loveEffect(x, y);
  const cp = $("#comboPill"); if (cp) { if (l.combo >= 5) { cp.hidden = false; cp.textContent = `🔥 x${comboMult.toFixed(1)}`; cp.classList.remove("pop"); void cp.offsetWidth; cp.classList.add("pop"); } }
  clearTimeout(l._ct); l._ct = setTimeout(() => { const c = $("#comboPill"); if (c) c.hidden = true; }, 1000);
}
function lovePet(x, y) { addLove(Math.max(1, Math.round(lovePerBoop() * .5)), x, y - 30); }
function loveEffect(x, y) {
  const e = L().effect || "hearts";
  if (e === "hearts") hearts(x, y - 10, 2);
  else if (e === "sparkle") bits("dot", x, y, 8, { c: ["#ffd84d", "#fff3a8", "#fff"], v: 3, s: 2.5, g: .05 });
  else if (e === "bubbles") bits("dot", x, y, 6, { c: ["#bfefff", "#e8fbff"], v: 1.5, up: 2.5, g: -.05, s: 6, ring: true, life: 60 });
  else if (e === "rainbow") bits("dot", x, y, 10, { c: ["#ff5a5f", "#ff9f43", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"], v: 3.5, s: 3.5 });
  else if (e === "confetti") confetti(x, y, 14, true);
  else if (e === "fireworks") { bits("dot", x, y - 20, 18, { c: ["#ff5fa8", "#ffd84d", "#5fd3ff", "#fff"], v: 5, s: 2.5, g: .08, up: 1 }); }
  else if (e === "galaxy") { bits("dot", x, y, 10, { c: ["#6a4fe0", "#c7b3ff", "#fff", "#ffd84d"], v: 2.5, s: 2.5, g: -.01 }); hearts(x, y - 10, 1); }
}
/* passive Love: runs every second on the home screen and catches up after time away */
function loveTick(showAway) {
  const l = L(), t = now(), dt = Math.min(8 * HOUR, Math.max(0, t - (l.last || t))) / 1000; l.last = t;
  const lps = loveLps(); if (!lps || dt <= 0) return;
  const gain = lps * dt;
  if (showAway && dt > 120 && gain >= 1) setTimeout(() => toast(`Your Boop Helpers made ${fmtBig(gain)} ❤️ while you were away!`, "💞"), 1500);
  addLove(gain);
}
function renderLovePill() {
  const p = $("#lovePill"); if (!p) return; const l = L();
  const need = loveNeed(l.level + 1), have = l.total - loveNeed(l.level), span = need - loveNeed(l.level);
  p.innerHTML = `<span class="lp-lv">Lv${l.level}</span><b>❤️ ${fmtBig(l.lp)}</b>${loveLps() ? `<small>+${fmtBig(loveLps() < 10 ? loveLps() * 10 : loveLps())}${loveLps() < 10 ? "/10s" : "/s"}</small>` : ""}<i style="width:${l.level >= LOVE_TITLES.length ? 100 : Math.min(100, have / span * 100)}%"></i>`;
}
/* home screen hooks: pill, orbiting helpers, golden hearts */
function loveHomeInit() {
  const room = $(".room"); if (!room) return () => {};
  const l = L();
  room.insertAdjacentHTML("beforeend", `<button class="love-pill" id="lovePill" aria-label="Boop Shop"></button><span class="combo-pill" id="comboPill" hidden></span><div class="orbit" id="orbit"></div>`);
  renderLovePill();
  $("#lovePill").onclick = () => { play("click"); openBoopShop(); };
  drawOrbit();
  loveTick(true);
  let n = 0;
  const iv = setInterval(() => {
    loveTick(); n++;
    // a helper gives a little boop now and then
    const owned = LOVE_HELPERS.filter(h => l.helpers[h.id]);
    if (owned.length && n % 3 === 0 && PA.el && !PA.busy) {
      const h = pick(owned), icons = $$(`.orbit [data-h="${h.id}"]`); const ic = icons.length ? pick(icons) : null;
      if (ic) { ic.classList.remove("zap"); void ic.offsetWidth; ic.classList.add("zap"); }
      const [bx, by] = bodyVP(); floatText(bx + (Math.random() - .5) * 80, by - 40, `+${fmtBig(loveLps() * 3)} ❤️`, "#e8458f", 16);
      if (Math.random() < .3) { pcls("squish", 400); play("boop"); }
    }
    // golden heart
    if (now() > (l.nextGold || 0) && !$(".golden-heart") && !HG && !modalStack.length) spawnGolden();
  }, 1000);
  return () => clearInterval(iv);
}
function drawOrbit() {
  const o = $("#orbit"); if (!o) return; const l = L();
  const icons = LOVE_HELPERS.flatMap(h => Array.from({ length: Math.min(2, l.helpers[h.id] || 0) }, () => h)).slice(-8);
  const span = (h, i) => `<span class="orb" data-h="${h.id}" style="animation-delay:${(i * .37) % 2}s">${h.ico}</span>`;
  o.innerHTML = `<div class="orb-side">${icons.filter((_, i) => i % 2 === 0).map(span).join("")}</div><div class="orb-side r">${icons.filter((_, i) => i % 2 === 1).map(span).join("")}</div>`;
}
function spawnGolden() {
  const l = L(), room = $(".room"); if (!room) return;
  l.nextGold = now() + (2.5 + Math.random() * 3.5) * MIN / (loveHas("f7") ? 2 : 1);
  const r = room.getBoundingClientRect();
  const gh = document.createElement("button"); gh.className = "golden-heart"; gh.textContent = "💛"; gh.setAttribute("aria-label", "Golden heart!");
  gh.style.top = (60 + Math.random() * (r.height * .4)) + "px";
  room.appendChild(gh); play("sparkle");
  gh.onclick = () => {
    gh.onclick = null; const [x, y] = centerOf(gh); gh.remove(); play("bigwin"); confetti(x, y, 50);
    if (Math.random() < .5) { l.frenzy = now() + 20000; toast("LOVE FRENZY! Boops give 7x Love for 20 seconds!", "💛"); floatText(x, y, "FRENZY x7!", "#ff9f1a", 28); }
    else { const n = Math.max(50, Math.round(loveLps() * 120 + lovePerBoop() * 30)); addLove(n, x, y, `+${fmtBig(n)} ❤️`); addCoins(10, [x, y]); }
    saveSoon();
  };
  setTimeout(() => gh.remove(), 13000);
}

/* ---------- Boop Shop ---------- */
let boopTab = "ups";
function openBoopShop() {
  const l = L();
  const m = openModal(`<div class="boop-shop"><div class="bs-head"><div class="bs-lv">Love Level <b>${l.level}</b><span>${LOVE_TITLES[l.level - 1]}</span></div>
    <div class="progress"><i id="bsBar"></i><span id="bsBarT"></span></div>
    <div class="bs-stats"><span>❤️ <b id="bsLp">${fmtBig(l.lp)}</b> Love</span><span>👆 ${fmtBig(lovePerBoop())}/boop</span><span>🤖 ${fmtBig(loveLps())}/sec</span></div></div>
    <div class="tabs scroll">${[["ups", "👆 Upgrades"], ["helpers", "🤖 Helpers"], ["effects", "✨ Effects"], ["levels", "🏅 Levels"]].map(([k, n]) => `<button class="tab" data-bt="${k}">${n}</button>`).join("")}</div>
    <div id="bsBody"></div></div>`, { cls: "boop-modal" });
  const draw = () => {
    const need = loveNeed(l.level + 1), base = loveNeed(l.level);
    $("#bsBar", m.el).style.width = (l.level >= LOVE_TITLES.length ? 100 : Math.min(100, (l.total - base) / (need - base) * 100)) + "%";
    $("#bsBarT", m.el).textContent = l.level >= LOVE_TITLES.length ? "MAX LOVE!" : `${fmtBig(l.total - base)} / ${fmtBig(need - base)} to Level ${l.level + 1}`;
    $("#bsLp", m.el).textContent = fmtBig(l.lp);
    $$("[data-bt]", m.el).forEach(b => b.classList.toggle("on", b.dataset.bt === boopTab));
    const body = $("#bsBody", m.el);
    if (boopTab === "ups") {
      const list = LOVE_UPS.filter((u, i) => !loveHas(u.id) && (i === 0 || loveHas(LOVE_UPS[i - 1].id) || l.total >= u.cost * .3)).slice(0, 4);
      const done = LOVE_UPS.filter(u => loveHas(u.id));
      body.innerHTML = `<div class="pick-list">${list.map(u => `<button class="pick ${l.lp >= u.cost ? "" : "cant"}" data-up="${u.id}"><span class="ii">${u.ico}</span><span><b>${esc(u.n)}</b><small>${esc(u.d)}</small></span><span class="pk-r">❤️${fmtBig(u.cost)}</span></button>`).join("") || `<p class="muted center">You bought every upgrade! Boop legend!</p>`}</div>
        ${done.length ? `<p class="muted center">Owned: ${done.map(u => u.ico).join(" ")}</p>` : ""}`;
    } else if (boopTab === "helpers") {
      const list = LOVE_HELPERS.filter((h, i) => i === 0 || l.helpers[LOVE_HELPERS[i - 1].id] || l.total >= h.cost * .4);
      body.innerHTML = `<p class="muted center">Helpers make Love every second, even when you're away (up to 8 hours). Happy guineas make them work 20% harder!</p><div class="pick-list">${list.map(h => `<button class="pick ${l.lp >= helperCost(h) ? "" : "cant"}" data-help="${h.id}"><span class="ii">${h.ico}</span><span><b>${esc(h.n)} <em class="own">x${l.helpers[h.id] || 0}</em></b><small>${esc(h.d)} +${h.lps} ❤️/sec each.</small></span><span class="pk-r">❤️${fmtBig(helperCost(h))}</span></button>`).join("")}</div>`;
    } else if (boopTab === "effects") {
      body.innerHTML = `<p class="muted center">Choose what comes out when you boop! Unlock more by raising your Love Level.</p><div class="ward-grid">${LOVE_EFFECTS.map(e => `<button class="ward-it ${l.effect === e.id ? "on" : ""} ${l.level >= e.lv ? "" : "locked"}" data-fx="${e.id}"><span class="dye-dot">${e.ico}</span><b>${esc(e.n)}</b><small>${l.level >= e.lv ? (l.effect === e.id ? "using" : "tap to use") : "Level " + e.lv}</small></button>`).join("")}</div>`;
    } else {
      body.innerHTML = `<div class="list">${LOVE_TITLES.map((t, i) => { const lv = i + 1, got = l.level >= lv, gift = LOVE_GIFTS[lv], fx = LOVE_EFFECTS.find(e => e.lv === lv && lv > 1); return `<div class="row card lvrow ${got ? "got" : ""}"><span class="lvn">${lv}</span><div class="row-txt"><b>${esc(t)}</b><small>${lv === 1 ? "Where it all begins" : `${fmtBig(loveNeed(lv))} total Love · ${COIN}${loveCoins(lv)}${fx ? ` · ${fx.ico} ${fx.n} boops` : ""}${gift && ITEM[gift] ? ` · ${ITEM[gift].ico} ${ITEM[gift].name}` : ""}`}</small></div><span>${got ? "✅" : "🔒"}</span></div>`; }).join("")}</div>`;
    }
    $$("[data-up]", m.el).forEach(b => b.onclick = () => { const u = LOVE_UPS.find(x => x.id === b.dataset.up); if (l.lp < u.cost) { play("buzz"); toast("Not enough Love yet! Keep booping!", "❤️"); return; } l.lp -= u.cost; l.ups[u.id] = 1; recordBuy({ type: "love", kind: "up", id: u.id, price: u.cost, name: u.n }); play("levelup"); confetti(...centerOf(b), 40); saveSoon(); draw(); renderLovePill(); });
    $$("[data-help]", m.el).forEach(b => b.onclick = () => { const h = LOVE_HELPERS.find(x => x.id === b.dataset.help), c = helperCost(h); if (l.lp < c) { play("buzz"); toast("Not enough Love yet! Keep booping!", "❤️"); return; } l.lp -= c; l.helpers[h.id] = (l.helpers[h.id] || 0) + 1; recordBuy({ type: "love", kind: "helper", id: h.id, price: c, name: h.n }); play("win"); confetti(...centerOf(b), 30); saveSoon(); draw(); renderLovePill(); drawOrbit(); checkAchievements(); });
    $$("[data-fx]", m.el).forEach(b => b.onclick = () => { const e = LOVE_EFFECTS.find(x => x.id === b.dataset.fx); if (l.level < e.lv) { play("buzz"); toast(`Reach Love Level ${e.lv} to unlock ${e.n}!`, "🔒"); return; } l.effect = e.id; play("sparkle"); const [x, y] = centerOf(b); loveEffect(x, y); saveSoon(); draw(); });
  };
  $$("[data-bt]", m.el).forEach(b => b.onclick = () => { boopTab = b.dataset.bt; play("click"); draw(); });
  const iv = setInterval(() => { if (!document.body.contains(m.el)) return clearInterval(iv); $("#bsLp", m.el).textContent = fmtBig(l.lp); }, 1000);
  draw();
}
const loveCoins = lv => Math.round(30 * lv * (1 + lv / 6));
EVENT_VIEWS.lovelevel = (e, done) => {
  const lv = e.level, coins = loveCoins(lv), gift = LOVE_GIFTS[lv], fx = LOVE_EFFECTS.find(x => x.lv === lv && lv > 1), g = activeG();
  addCoins(coins); if (gift && ITEM[gift]) own(gift);
  if (fx) L().effect = fx.id;
  play("levelup"); confetti(innerWidth / 2, innerHeight / 3, 120); hearts(innerWidth / 2, innerHeight / 2, 12);
  const m = openModal(`<div class="center"><p class="kicker">Love Level ${lv}!</p><div class="big-emoji">💞</div><h2>${esc(LOVE_TITLES[lv - 1])}</h2><p class="mtext">You and ${esc(g.name)} love each other even more! +${coins} coins${fx ? `<br>New boop effect: <b>${fx.ico} ${fx.n}</b>!` : ""}${gift && ITEM[gift] ? `<br>Special gift: <b>${ITEM[gift].ico} ${esc(ITEM[gift].name)}</b> (in the Wardrobe)` : ""}</p><div class="mrow"><button class="btn green" data-ok>Aww! 💗</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
};
