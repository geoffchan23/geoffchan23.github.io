/* Wheek World UI shell: router, top bar, nav, home hutch, event popups. */
"use strict";

const ROUTE = { name: "home", arg: null, inGame: false };
const VIEWS = {};
let viewCleanup = null;

function go(path) { if (location.hash !== "#/" + path) location.hash = "#/" + path; else render(); }
function back() { if (history.length > 1) history.back(); else go("map"); }
function parseHash() { const h = location.hash.replace(/^#\/?/, "") || "home"; const [name, ...rest] = h.split("/"); return { name, arg: rest.join("/") || null }; }
addEventListener("hashchange", () => {
  if (closeTopModal()) { /* back button closes popups first */ }
  render();
});
let lastRouteKey = "";
function render() {
  const r = parseHash();
  const key = r.name + "/" + (r.arg || ""), same = key === lastRouteKey; lastRouteKey = key;
  const keepY = same ? scrollY : 0;
  const keepX = same ? $$(".tabs.scroll").map(t => t.scrollLeft) : [];
  if (viewCleanup) { try { viewCleanup(); } catch (e) { console.error(e); } viewCleanup = null; }
  ROUTE.name = r.name; ROUTE.arg = r.arg; ROUTE.inGame = r.name === "play";
  document.body.dataset.route = r.name;
  const view = $("#view");
  const fn = VIEWS[r.name] || VIEWS.home;
  view.className = "view v-" + r.name;
  try { viewCleanup = fn(view, r.arg) || null; } catch (e) { console.error(e); view.innerHTML = `<div class="pad"><h2>Oops!</h2><p>Something went squelch. <button class="btn" onclick="go('home')">Go home</button></p></div>`; }
  renderTop(); renderNav();
  // stay where you were when the same screen redraws (e.g. switching Bag tabs)
  scrollTo(0, keepY);
  $$(".tabs.scroll").forEach((t, i) => { t.scrollLeft = keepX[i] || 0; const on = $(".tab.on", t); if (on) { const l = on.offsetLeft - t.offsetLeft, w = on.offsetWidth; if (l < t.scrollLeft || l + w > t.scrollLeft + t.clientWidth) t.scrollLeft = l - (t.clientWidth - w) / 2; } });
  setTimeout(pumpEvents, 300);
}

/* ---------- top bar & nav ---------- */
function renderTop() {
  const ev = currentEvent();
  const top = $("#top"); if (!top) return;
  const inGame = ROUTE.inGame;
  const lvPct = Math.round(G.xp / xpFor(G.level) * 100);
  top.innerHTML = `
    ${inGame ? `<button class="tb-back" id="leaveGame" aria-label="Leave game">◀</button>` : `<button class="tb-level" id="tbLevel" aria-label="Keeper level ${G.level}"><span class="lv">${G.level}</span><span class="lvbar"><i style="width:${lvPct}%"></i></span></button>`}
    <button class="tb-event" id="tbEvent" style="--ev:${evColor(ev.id)}"><span class="ei">${ev.ico}</span><span class="et">${esc(ev.name)}</span><span class="em">${minsLeftInHour()}m</span></button>
    <button class="coin-pill" id="coinPill" aria-label="Coins">${COIN}<b id="coinNum">${fmt(shownCoins || G.coins)}</b></button>
    ${inGame ? "" : `<button class="tb-quest" id="tbQuest" aria-label="Daily quests">📋${questBadge()}</button>`}`;
  shownCoins = shownCoins || G.coins; renderCoins();
  const lg = $("#leaveGame"); if (lg) lg.onclick = () => { play("click"); back(); };
  $("#tbEvent").onclick = () => { play("click"); showWorldEvent(); };
  const tq = $("#tbQuest"); if (tq) tq.onclick = () => { play("click"); showQuests(); };
  const tl = $("#tbLevel"); if (tl) tl.onclick = () => { play("click"); toast(`Keeper level ${G.level}. ${xpFor(G.level) - G.xp} XP to level ${G.level + 1}!`, "⭐"); };
}
const evColor = id => ({ golden: "#ffd84d", sale: "#ff8fc7", love: "#ff8fc7", slimetide: "#7be04a", fartstorm: "#b6e36a", babyboom: "#9fd8ff", merchant: "#c7b3ff", squishyrain: "#5fd3ff", parade: "#ffb36b", lucky: "#7be04a" }[id] || "#fff");
function questBadge() { const n = (G.daily.quests || []).filter(q => !q.done).length; return n ? `<span class="badge">${n}</span>` : ""; }
function renderNav() {
  const nav = $("#nav"); if (!nav) return;
  const pk = G.packages.length, needy = G.guineas.filter(g => g.sick || g.food < 25).length;
  const items = [["home", "🏠", "Home", pk], ["map", "🗺️", "World", 0], ["pets", "🐹", "Guineas", needy], ["bag", "🎒", "Bag", 0], ["book", "📖", "Book", 0]];
  const cur = ROUTE.name === "pet" || ROUTE.name === "date" ? "pets" : ROUTE.name === "place" || ROUTE.name === "shop" ? "map" : ROUTE.name;
  nav.innerHTML = items.map(([id, ico, label, b]) => `<button class="nv ${cur === id ? "on" : ""}" data-nav="${id}"><span class="ni">${ico}</span><span class="nl">${label}</span>${b ? `<span class="badge">${b}</span>` : ""}</button>`).join("");
  $$("[data-nav]", nav).forEach(b => b.onclick = () => { play("click"); go(b.dataset.nav); });
}
function refreshBadges() { if (!G) return; renderNav(); const tq = $("#tbQuest"); if (tq) tq.innerHTML = "📋" + questBadge(); }

/* ---------- shared bits ---------- */
function bar(label, v, ico) {
  const c = v > 60 ? "#7be04a" : v > 30 ? "#ffd84d" : "#ff5a5f";
  return `<div class="stat"><span class="si">${ico}</span><div class="sb"><i style="width:${Math.round(v)}%;background:${c}"></i></div><span class="sl">${label}</span></div>`;
}
function npcBox(id, line) {
  const n = NPCS[id];
  return `<div class="npc"><div class="npc-face">${n.ico}</div><div class="npc-talk"><b>${esc(n.name)}</b><span class="npc-role">${esc(n.role)}</span><p>${esc(line || pick(n.lines))}</p></div></div>`;
}
function itemIcon(id, big) {
  const it = ITEM[id]; if (!it) return "❓";
  if (it.art) { const a = SNACK_ART.find(s => s.id === it.art); if (a) return `<span class="ii art">${a.svg}</span>`; }
  if (it.cat === "outfit") return `<span class="ii outfit">${outfitPreview(it)}</span>`;
  if (it.cat === "wall" || it.cat === "floor") return `<span class="ii swatch" style="background:${it.css}"></span>`;
  return `<span class="ii">${it.ico}</span>`;
}
function outfitPreview(it) {
  return guineaSVG({ id: "preview", genes: { c: "cream", c2: "ginger", p: "solid", h: "smooth", e: "dark", m: null }, outfit: { [it.slot]: it.id } }, { size: 64, stage: "adult" });
}
function tierChip(g) { const t = TIERS[tierOf(g)]; return `<span class="tier" style="--tc:${t.c}">${t.n}</span>`; }
function sexIco(g) { const s = SEX[g.sex]; return `<span class="sex" style="color:${s.c}" aria-label="${s.n}">${s.ico}</span>`; }

/* ---------- HOME (the hutch) ---------- */
let boopState = { last: 0, combo: 0 };
VIEWS.home = (el) => {
  const g = activeG();
  const others = hutchList().filter(x => x.id !== g.id);
  const wall = ITEM[G.home.wall] || WALLS[0], floor = ITEM[G.home.floor] || FLOORS[0];
  const pk = G.packages[0];
  const courier = pk ? COURIERS.find(c => c.id === pk.courier) : null;
  const need = { food: g.food < 40, toy: g.joy < 40, care: g.clean < 40 || g.sick };
  const act = (k, ico, label, attr) => `<button class="act ${need[k] ? "need" : ""}" ${attr}><span>${ico}</span>${label}${need[k] ? `<i class="badge">!</i>` : ""}</button>`;
  el.innerHTML = `
    <section class="room" style="--wall:${wall.css};--floor:${floor.css}">
      <div class="wall"></div><div class="floor"></div>
      ${G.home.decor.map((d, i) => d && ITEM[d] ? `<div class="decor d${i}">${ITEM[d].ico}</div>` : "").join("")}
      ${others.map(o => `<button class="pal" data-pal="${o.id}" aria-label="Switch to ${esc(o.name)}">${guineaSVG(o, { size: 84, mood: mood(o) })}<span class="pal-n">${esc(o.name)}</span></button>`).join("")}
      <div class="pet-name"><span>${esc(g.name)}</span> ${sexIco(g)} ${tierChip(g)}</div>
      <div class="bubble" id="bubble">${esc(needLine(g))}</div>
      <button class="pet-main" id="pet" aria-label="Boop ${esc(g.name)}">${guineaSVG(g, { size: 210, mood: mood(g), cls: "idle" })}</button>
      ${G.stats.boops < 15 ? `<div class="tap-tip">👆 Tap ${esc(g.name)}!</div>` : ""}
      ${courier ? `<button class="courier" id="courier" aria-label="Open package"><span class="c-ico">${courier.ico}</span><span class="c-box">📦</span><span class="c-tip">Tap to open!</span></button>` : ""}
      ${G.settings.sitter > now() ? `<div class="sitter">👵 Granny sitting: ${dur(G.settings.sitter - now())}</div>` : ""}
    </section>
    <div id="suggest"></div>
    <section class="stats card mini">
      ${bar("Food", g.food, "🍽️")}${bar("Fun", g.joy, "🎈")}${bar("Clean", g.clean, "🫧")}${bar("Health", g.health, "❤️")}
    </section>
    <section class="actions">
      ${act("food", "🥕", "Feed", 'data-tray="food"')}
      ${act("toy", "🧸", "Play", 'data-tray="toy"')}
      ${act("care", "🛁", "Care", 'data-tray="care"')}
      <button class="act" id="dress"><span>👒</span>Dress</button>
      <button class="act" data-go="map"><span>🗺️</span>Go out</button>
    </section>
    <div class="sheet" id="tray" hidden></div>`;
  const petBtn = $("#pet", el);
  petBtn.addEventListener("pointerdown", e => boop(g, petBtn, e));
  $$("[data-pal]", el).forEach(b => b.onclick = () => { G.active = b.dataset.pal; play("wheek"); saveSoon(); render(); });
  $$("[data-tray]", el).forEach(b => b.onclick = () => { play("click"); openTray(b.dataset.tray, g); });
  $$("[data-go]", el).forEach(b => b.onclick = () => { play("click"); go(b.dataset.go); });
  $("#dress", el).onclick = () => { play("click"); openWardrobe(g); };
  const cr = $("#courier", el); if (cr) cr.onclick = () => openPackage(G.packages[0]);
  renderSuggest();
  const iv = setInterval(() => { const b = $("#bubble"); if (b && Math.random() < .5) { b.textContent = needLine(g); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); } if (g.pers === "gassy" && Math.random() < .15) toot(g, petBtn); }, 9000);
  const statIv = setInterval(() => { tick(); refreshStatBars(g); renderSuggest(); }, 30000);
  return () => { clearInterval(iv); clearInterval(statIv); };
};

/* ---------- "what should I do next?" helper ---------- */
const TUT = [
  { id: "boop", t: g => `Tap ${g.name} to give a boop!`, ico: "👆", act: () => { const p = $("#pet"); if (p) { p.classList.remove("nudge"); void p.offsetWidth; p.classList.add("nudge"); } } },
  { id: "feed", t: g => `Feed ${g.name} a snack`, ico: "🥕", act: g => openTray("food", g) },
  { id: "package", t: () => "Open your package!", ico: "📦", act: () => openPackage(G.packages[0]), skip: () => !G.packages.length },
  { id: "map", t: () => "Go out and explore the World", ico: "🗺️", go: "map" },
  { id: "game", t: () => "Play a game at the Arcade", ico: "🕹️", go: "place/arcade" },
  { id: "shop", t: () => "Buy something at Squeakmart", ico: "🛒", go: "shop/squeakmart" },
  { id: "bath", t: g => `Give ${g.name} a bubble bath`, ico: "🛁", act: g => openTray("care", g) },
  { id: "slime", t: () => "Make a slime at the Slime Lab", ico: "🧪", go: "place/lab" },
];
function tutMark(id) {
  G.tut = G.tut || {};
  if (G.tut[id] || G.tut.all) return;
  G.tut[id] = 1;
  setTimeout(() => {
    const left = TUT.filter(s => !G.tut[s.id]).length;
    if (!left) { G.tut.all = 1; addCoins(100, [innerWidth / 2, innerHeight / 3]); play("fanfare"); confetti(innerWidth / 2, innerHeight / 3, 120); toast("You finished First Steps! +100 coins", "🏆"); }
    else { addCoins(20, [innerWidth / 2, innerHeight / 3]); toast(`First step done! +20 coins (${TUT.length - left}/${TUT.length})`, "⭐"); }
    saveSoon(); renderSuggest();
  }, 600);
}
const QUEST_GO = { play: "place/arcade", luck: "place/carnival", boop: "home", feed: "home:food", bath: "home:care", toy: "home:toy", earn: "place/arcade", package: "place/post", slime: "place/lab", box: "shop/boxes", poop: "place/farm", harvest: "place/farm" };
function goQuest(k) {
  const r = QUEST_GO[k] || "map";
  if (r.startsWith("home")) { const t = r.split(":")[1]; if (ROUTE.name !== "home") go("home"); if (t) setTimeout(() => openTray(t, activeG()), ROUTE.name === "home" ? 50 : 350); else setTimeout(() => TUT[0].act(), 400); }
  else go(r);
}
function suggestion() {
  const g = activeG();
  if (g.sick) return { ico: "🤒", t: `${g.name} is sick! Take them to the Vet`, go: "place/vet", hot: true };
  G.tut = G.tut || {};
  if (!G.tut.all) { const s = TUT.find(s => !G.tut[s.id] && !(s.skip && s.skip())); if (s) return { ico: s.ico, t: s.t(g), go: s.go, act: s.act, label: "First steps" }; }
  if (G.packages.length) return { ico: "📦", t: "A package arrived! Open it!", act: () => openPackage(G.packages[0]) };
  if (g.food < 40) return { ico: "🥕", t: `${g.name} is hungry! Feed them`, act: () => openTray("food", g), hot: true };
  if (g.clean < 40) return { ico: "🛁", t: `${g.name} is stinky! Bath time`, act: () => openTray("care", g), hot: true };
  if (g.joy < 40) return { ico: "🧸", t: `${g.name} is bored! Play together`, act: () => openTray("toy", g), hot: true };
  const hungryOthers = G.guineas.filter(x => x !== g && (x.food < 30 || x.sick));
  if (hungryOthers.length) return { ico: "🐹", t: `${hungryOthers[0].name} needs you!`, go: "pet/" + hungryOthers[0].id };
  if (G.nursery.length) return { ico: "🍼", t: "Babies are waiting at the Adoption Center", go: "place/adopt" };
  if (!G.daily.spun) return { ico: "🎡", t: "Your FREE prize wheel spin is ready!", go: "place/wheel" };
  const q = (G.daily.quests || []).find(q => !q.done);
  if (q) return { ico: "📋", t: `Quest: ${q.t}`, act: () => goQuest(q.k), label: `${q.have}/${q.n}` };
  return { ico: "🗺️", t: "Go out and play games for coins!", go: "map" };
}
function renderSuggest() {
  const box = $("#suggest"); if (!box) return;
  const s = suggestion();
  box.innerHTML = `<button class="suggest ${s.hot ? "hot" : ""}"><span class="sg-ico">${s.ico}</span><span class="sg-t">${s.label ? `<small>${esc(s.label)}</small>` : ""}${esc(s.t)}</span><span class="sg-go">GO ▶</span></button>`;
  $("button", box).onclick = () => { play("click"); if (s.go) go(s.go); else if (s.act) s.act(activeG()); };
}
function petAnim(btn, cls, ms = 700) { const s = btn && btn.querySelector("svg"); if (!s) return; s.classList.remove("squish", "spin", "sneeze", "munch", "happy", "gassy", "hop"); void s.getBoundingClientRect(); s.classList.add(cls); clearTimeout(s._t); s._t = setTimeout(() => s.classList.remove(cls), ms); }
function say(text) { const b = $("#bubble"); if (!b) return; b.textContent = text; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
function toot(g, btn) {
  play("fart"); G.stats.toots++; const r = btn.getBoundingClientRect(); gas(r.left + r.width * .5, r.top + r.height * .8, 18);
  petAnim(btn, "gassy", 900); say(pick(["*TOOT* ...excuse me.", "PFFRRT! That one had a melody.", "*toot* It wasn't me. It was the floor.", "Pardon my wheek-squeak."]));
  checkAchievements();
}
function boop(g, btn, e) {
  getAC();
  const svg = btn.querySelector("svg"), r = svg.getBoundingClientRect();
  const x = e.clientX, y = e.clientY;
  const nose = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height * (132 / 198))) < r.width * .09;
  const t = performance.now();
  boopState.combo = t - boopState.last < 700 ? boopState.combo + 1 : 1; boopState.last = t;
  g.boops = (g.boops || 0) + 1; G.stats.boops++; questProgress("boop");
  const joyGain = eventOn("parade") ? 3 : 1.5; g.joy = clamp(g.joy + joyGain, 0, 100);
  haptic(8);
  if (nose) { play("sneeze"); petAnim(btn, "sneeze", 900); floatText(x, y - 30, "ACHOO!", "#5fd3ff", 26); say(pick(["ACHOO! Hey, that's my nose!", "*sneeze* Bless me.", "My nose is VERY boopable and VERY sneezy."])); confetti(x, y, 10, false); }
  else { play("boop"); petAnim(btn, boopState.combo % 5 === 0 ? "spin" : "squish", 500); hearts(x, y - 10, 2); floatText(x, y - 30, boopState.combo > 2 ? `BOOP x${boopState.combo}` : pick(["boop!", "bop!", "boink!", "squish!"]), "#e8458f", 20 + Math.min(14, boopState.combo)); }
  if (boopState.combo === 10) { play("giggle"); say("Hehehe! STOP! Okay don't stop!"); }
  if (boopState.combo === 25) { play("wheek"); confetti(x, y, 40); say("BOOP MANIA!!! I LOVE IT!"); }
  const coinChance = eventOn("parade") ? .12 : .035;
  if (g.joy > 60 && Math.random() < coinChance) { addCoins(rint(1, 5), [x, y]); }
  if (g.pers === "gassy" && Math.random() < .04) setTimeout(() => toot(g, btn), 300);
  refreshStatBars(g); saveSoon(); checkAchievements(); tutMark("boop");
  const tip = $(".tap-tip"); if (tip && G.stats.boops >= 15) tip.remove();
}
function refreshStatBars(g) {
  const s = $(".stats"); if (!s) return;
  const bars = $$(".stat", s); const vals = [g.food, g.joy, g.clean, g.health];
  bars.forEach((b, i) => { const v = vals[i], c = v > 60 ? "#7be04a" : v > 30 ? "#ffd84d" : "#ff5a5f"; const iEl = $("i", b); iEl.style.width = Math.round(v) + "%"; iEl.style.background = c; });
}
function openTray(cat, g) {
  const tray = $("#tray"); if (!tray) return;
  if (!tray.hidden && tray.dataset.cat === cat) { tray.hidden = true; return; }
  tray.dataset.cat = cat; tray.hidden = false;
  const title = { food: `Feed ${g.name}`, toy: `Play with ${g.name}`, care: `Take care of ${g.name}` }[cat];
  const ids = Object.keys(G.inv).filter(id => ITEM[id] && ITEM[id].cat === cat && G.inv[id] > 0);
  const brush = cat === "care" ? `<button class="tray-it" data-brush><span class="ii">🪮</span><b>Brush</b><small>free</small></button>` : "";
  const pet = cat === "toy" ? `<button class="tray-it" data-tickle><span class="ii">🪶</span><b>Tickle</b><small>free</small></button>` : "";
  tray.innerHTML = `<div class="sheet-hd"><b>${esc(title)}</b><span class="muted">Tap one!</span><button class="sheet-x" aria-label="Close">✕</button></div><div class="tray-in">${brush}${pet}${ids.map(id => `<button class="tray-it" data-use="${id}">${itemIcon(id)}<b>${esc(ITEM[id].name)}</b><small>x${G.inv[id]}</small></button>`).join("")}
    ${!ids.length ? `<div class="tray-empty">No ${cat === "food" ? "food" : cat === "toy" ? "toys" : "care stuff"} in your bag! <button class="btn small" data-go="shop/squeakmart">Go shopping</button></div>` : ""}</div>`;
  $$("[data-go]", tray).forEach(b => b.onclick = () => go(b.dataset.go));
  $(".sheet-x", tray).onclick = () => { play("click"); tray.hidden = true; };
  $$("[data-use]", tray).forEach(b => b.onclick = () => useItem(g, b.dataset.use, b));
  const br = $("[data-brush]", tray); if (br) br.onclick = () => {
    const last = g.brushed || 0; if (now() - last < 15 * MIN) { say("I'm already sooo fluffy. Try again later!"); play("buzz"); return; }
    g.brushed = now(); g.clean = clamp(g.clean + 15, 0, 100); g.joy = clamp(g.joy + 5, 0, 100); play("squish"); petAnim($("#pet"), "happy", 900);
    const [x, y] = centerOf($("#pet")); hearts(x, y, 5); say(pick(["Ooh brushy brushy!", "I'm so FLUFFY!", "Do my butt next."])); refreshStatBars(g); saveSoon();
  };
  const tk = $("[data-tickle]", tray); if (tk) tk.onclick = () => {
    const last = g.tickled || 0; if (now() - last < 10 * MIN) { say("Hehe... I'm all tickled out. Later!"); play("buzz"); return; }
    g.tickled = now(); g.joy = clamp(g.joy + 8, 0, 100); play("giggle"); petAnim($("#pet"), "spin", 700); say("HEHEHEHE! STOP! NO DON'T STOP!"); refreshStatBars(g); saveSoon();
  };
}
function useItem(g, id, btn) {
  const it = ITEM[id];
  const res = useOn(g, id);
  const pet = $("#pet"); const [x, y] = centerOf(pet);
  if (!res) return;
  if (res.full) { say(pick(["I'm SO full. My tummy is a balloon.", "No more! I'll pop!", "*burp* ...no thank you."])); play("burp"); return; }
  if (res.pointless) { say("I feel great! I don't need medicine."); play("buzz"); return; }
  if (res.maxed) { say("I've had all the vitamins I can have!"); play("buzz"); return; }
  if (it.cat === "food") {
    play(["carrot", "celery", "cucumber", "pepper", "lettuce"].includes(id) ? "crunch" : "nom"); petAnim(pet, "munch", 1200);
    say(res.fav ? `${it.name.toUpperCase()}!!! MY FAVOURITE!!!` : pick(["Nom nom nom!", "*crunch crunch*", "Mmm! More please!", `${it.name}? Yes please!`]));
    if (res.fav) { hearts(x, y, 10); play("wheek"); }
    if (id === "goldlettuce" || id === "rainbowcarrot") confetti(x, y, 60);
    const toots = Math.floor(res.toot) + (Math.random() < res.toot % 1 ? 1 : 0);
    for (let i = 0; i < toots; i++) setTimeout(() => toot(g, pet), 1300 + i * 900);
  } else if (it.cat === "care") {
    if (id === "soap") { play("squelch"); petAnim(pet, "happy", 1000); say("Splish splash! I'm SPARKLY!"); confetti(x, y, 25, false); }
    else { play("sparkle"); petAnim(pet, "hop", 800); say(res.text || "I feel SO much better!"); hearts(x, y, 6); }
  } else if (it.cat === "toy") { play("wheek"); petAnim(pet, "hop", 800); say(pick(["WHEEEE!", "This is the BEST toy EVER!", "Again! Again!"])); hearts(x, y, 6); }
  if (res.care) { addCoins(res.care, [x, y]); }
  if (res.text && it.cat !== "care") toast(res.text);
  refreshStatBars(g);
  const tray = $("#tray"); if (tray && !tray.hidden) { const c = tray.dataset.cat; tray.hidden = true; openTray(c, g); }
  if (it.cat === "food") tutMark("feed"); if (id === "soap") tutMark("bath");
  renderSuggest();
  checkAchievements();
}
function openWardrobe(g) {
  const owned = OUTFITS.filter(o => G.owned[o.id]);
  const slots = [["hat", "Hats"], ["face", "Face"], ["neck", "Neck"]];
  const m = openModal(`<h2>${esc(g.name)}'s Wardrobe</h2>
    <div class="ward-prev" id="wprev">${guineaSVG(g, { size: 150, mood: "happy" })}</div>
    ${owned.length ? slots.map(([s, n]) => `<h3 class="sub">${n}</h3><div class="chips">${owned.filter(o => o.slot === s).map(o => `<button class="chip ${g.outfit[s] === o.id ? "on" : ""}" data-wear="${o.id}">${o.ico} ${esc(o.name)}</button>`).join("") || `<span class="muted">Nothing yet</span>`}</div>`).join("") : `<p class="mtext">No outfits yet! Visit <b>Fluff Boutique</b> in town or open a Fashion Mystery Bag.</p>`}
    <div class="mrow"><button class="btn white" data-off>Take everything off</button><button class="btn pink" data-shop>Boutique</button></div>`, { onClose: () => { if (ROUTE.name === "home") render(); } });
  const refresh = () => { $("#wprev", m.el).innerHTML = guineaSVG(g, { size: 150, mood: "happy" }); $$("[data-wear]", m.el).forEach(b => b.classList.toggle("on", Object.values(g.outfit).includes(b.dataset.wear))); };
  $$("[data-wear]", m.el).forEach(b => b.onclick = () => { const o = ITEM[b.dataset.wear]; if (g.outfit[o.slot] === o.id) delete g.outfit[o.slot]; else g.outfit[o.slot] = o.id; play("pop"); refresh(); saveSoon(); });
  $("[data-off]", m.el).onclick = () => { g.outfit = {}; play("squish"); refresh(); saveSoon(); };
  $("[data-shop]", m.el).onclick = () => { m.close(); go("shop/boutique"); };
}

/* ---------- packages & reveal ---------- */
function openPackage(pk) {
  if (!pk) return;
  const c = COURIERS.find(x => x.id === pk.courier) || COURIERS[0];
  const rewards = packageRewards(pk);
  G.packages = G.packages.filter(p => p !== pk);
  G.stats.packages++; questProgress("package"); addXP(10); tutMark("package");
  rewards.forEach(grant); saveSoon(); refreshBadges();
  if (pk.courier === "toot") { play("fart"); gas(innerWidth / 2, innerHeight * .6, 26); }
  revealSequence({ title: pk.welcome ? "Welcome to Wheek World!" : c.name, ico: c.ico, line: pk.welcome ? "Welcome to Wheek World, dear! Here's a little something to get you started. Grandma loves you!" : c.line, box: "📦", rewards }, () => { if (ROUTE.name === "home") render(); checkAchievements(); });
}
function rewardCard(rw) {
  const rar = RARITY[rarityOfReward(rw)];
  let art = "", name = "", sub = "";
  if (rw.coins) { art = `<span class="ii big">${COIN}</span>`; name = `${fmt(rw.coins)} coins`; }
  else if (rw.squishy) { const s = SQUISHIES.find(x => x.id === rw.squishy); art = squishySVG(s); name = s.name; sub = rw.dupe ? "Duplicate! +15 coins" : "NEW for your collection!"; }
  else if (rw.guinea) { art = guineaSVG({ genes: rw.guinea.genes, born: now() - 4 * DAY, life: 20 }, { size: 120, mood: "happy" }); name = `${rw.guinea.name} the ${coatName(rw.guinea.genes)}`; sub = rw.where === "nursery" ? "No room! Waiting at the Adoption Center nursery." : `A new guinea! Lives in your ${rw.where}.`; }
  else { const it = ITEM[rw.item]; art = itemIcon(rw.item, true); name = (rw.n > 1 ? rw.n + "x " : "") + it.name; sub = rw.dupe ? `Already owned! +${rw.refund} coins instead` : it.cat === "outfit" ? "New outfit! Try it on." : it.cat === "decor" ? "New decor! Place it from your Bag." : ""; }
  return `<div class="rw" style="--rc:${rar.c}"><div class="rw-art">${art}</div><div class="rw-txt"><span class="rw-rar">${rar.n}</span><b>${esc(name)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div></div>`;
}
function revealSequence(o, after) {
  const best = o.rewards.reduce((b, rw) => Math.max(b, Object.keys(RARITY).indexOf(rarityOfReward(rw))), 0);
  const rarKey = Object.keys(RARITY)[best];
  const m = openModal(`<div class="reveal">
      <div class="rv-who">${o.ico ? `<span class="rv-ico">${o.ico}</span>` : ""}<div><b>${esc(o.title)}</b><p>${esc(o.line || "")}</p></div></div>
      <button class="rv-box" id="rvBox" style="--rc:${RARITY[rarKey].c}"><span class="rv-glow"></span><span class="rv-b">${o.box || "🎁"}</span><span class="rv-tap">Tap to open!</span></button>
      <div class="rv-items" id="rvItems" hidden>${o.rewards.map(rewardCard).join("")}</div>
      <div class="mrow" id="rvDone" hidden><button class="btn green" data-ok>Yay!</button></div>
    </div>`, { sticky: true, noClose: true, onClose: after });
  const box = $("#rvBox", m.el); let taps = 0;
  box.onclick = () => {
    taps++; play("shake"); haptic(20); box.classList.remove("shk"); void box.offsetWidth; box.classList.add("shk");
    box.style.setProperty("--k", taps);
    if (taps >= 3) {
      box.onclick = null; box.classList.add("boom"); play("open");
      const [x, y] = centerOf(box);
      setTimeout(() => {
        confetti(x, y, 50 + best * 30);
        if (best >= 3) { play("bigwin"); document.body.classList.add("flash"); setTimeout(() => document.body.classList.remove("flash"), 500); } else if (best >= 1) play("win"); else play("pop");
        box.hidden = true; $("#rvItems", m.el).hidden = false; $("#rvDone", m.el).hidden = false;
        $$(".rw", m.el).forEach((r, i) => { r.style.animationDelay = (i * .15) + "s"; });
      }, 350);
    }
  };
  $("[data-ok]", m.el).onclick = () => { play("click"); m.close(); };
}

/* ---------- event popups ---------- */
EVENT_VIEWS.level = (e, done) => {
  const gift = LEVEL_GIFTS[e.level];
  if (gift) addItem(gift[0], gift[1]);
  addCoins(50 + e.level * 10);
  play("levelup"); confetti(innerWidth / 2, innerHeight / 3, 120);
  const m = openModal(`<div class="center"><div class="big-emoji">⭐</div><h2>Level ${e.level}!</h2><p class="mtext">You're a level ${e.level} Guinea Keeper! +${50 + e.level * 10} coins${gift ? ` and <b>${gift[1]}x ${esc(ITEM[gift[0]].name)}</b>` : ""}!</p><div class="mrow"><button class="btn green" data-ok>Woohoo!</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.achievement = (e, done) => {
  const a = ACHIEVEMENTS.find(x => x.id === e.id);
  addCoins(a.r); play("fanfare"); confetti(innerWidth / 2, innerHeight / 3, 80);
  const m = openModal(`<div class="center"><div class="big-emoji">${a.ico}</div><p class="kicker">Trophy unlocked!</p><h2>${esc(a.n)}</h2><p class="mtext">${esc(a.d)}. +${a.r} coins${a.give ? ` and a special prize: <b>${esc(ITEM[a.give].name)}</b>!` : "!"}</p><div class="mrow"><button class="btn green" data-ok>Awesome!</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.worldEvent = (e, done) => { showWorldEvent(done); };
function showWorldEvent(done) {
  const ev = currentEvent();
  const m = openModal(`<div class="center"><p class="kicker">This hour in Wheek World</p><div class="big-emoji">${ev.ico}</div><h2>${esc(ev.name)}</h2><p class="mtext">${esc(ev.desc)}</p><p class="muted">Ends in ${minsLeftInHour()} minutes. Something new happens every hour!</p><div class="mrow">${ev.id === "merchant" ? `<button class="btn lilac" data-go="shop/merchant">Visit the Merchant</button>` : ev.id === "squishyrain" ? `<button class="btn sky" data-go="map">Go to the Map</button>` : ""}<button class="btn green" data-ok>Cool!</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
  const g = $("[data-go]", m.el); if (g) g.onclick = () => { m.close(); go(g.dataset.go); };
  play("sparkle");
}
EVENT_VIEWS.daily = (e, done) => {
  const day = ((G.daily.streak - 1) % 7);
  const gift = STREAK_GIFTS[day];
  addCoins(gift.coins); if (gift.item) addItem(gift.item[0], gift.item[1]);
  play("fanfare");
  const m = openModal(`<div class="center"><p class="kicker">Daily visit bonus</p><h2>Day ${G.daily.streak} streak!</h2>
    <div class="streak">${STREAK_GIFTS.map((s, i) => `<div class="sd ${i < day ? "got" : i === day ? "today" : ""}"><small>Day ${i + 1}</small><span>${s.item ? ITEM[s.item[0]].ico : "🪙"}</span><b>${s.coins}</b></div>`).join("")}</div>
    <p class="mtext">+${gift.coins} coins${gift.item ? ` and ${gift.item[1]}x ${esc(ITEM[gift.item[0]].name)}` : ""}! Come back tomorrow for more.</p>
    <h3 class="sub">Today's quests</h3>${questList()}
    <div class="mrow"><button class="btn green" data-ok>Let's go!</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close(); wireQuests(m);
};
function questList() { return `<div class="quests">${G.daily.quests.map(q => `<div class="q ${q.done ? "done" : ""}"><span class="qc">${q.done ? "✅" : "⬜"}</span><span class="qt">${esc(q.t)}<small>${Math.min(q.have, q.n)}/${q.n} · ${COIN}${q.r}</small></span>${q.done ? `<span class="qr">Done!</span>` : `<button class="btn small green qgo" data-qgo="${q.k}">Go ▶</button>`}</div>`).join("")}</div>`; }
function wireQuests(m) { $$("[data-qgo]", m.el).forEach(b => b.onclick = () => { play("click"); const k = b.dataset.qgo; m.close(); setTimeout(() => goQuest(k), 250); }); }
function showQuests() {
  const m = openModal(`<h2>Daily Quests</h2><p class="muted center">Do these for bonus coins! Tap Go to start one. New quests every day. Streak: ${G.daily.streak} day${G.daily.streak === 1 ? "" : "s"} 🔥</p>${questList()}<div class="mrow"><button class="btn green" data-ok>OK</button></div>`);
  $("[data-ok]", m.el).onclick = () => m.close(); wireQuests(m);
}
EVENT_VIEWS.birth = (e, done) => {
  const babies = e.ids.map(id => G.guineas.find(g => g.id === id) || G.nursery.find(g => g.id === id)).filter(Boolean);
  play("fanfare"); setTimeout(() => play("wheek"), 600);
  const m = openModal(`<div class="center"><p class="kicker">It's a litter!</p><h2>${esc(e.mom)} had ${babies.length} ${babies.length === 1 ? "baby" : "babies"}!</h2><p class="muted">Dad is ${esc(e.dad)}. Tap each blanket to meet them!</p>
    <div class="babies">${babies.map((b, i) => `<button class="baby" data-b="${i}" style="--tc:${TIERS[tierOf(b)].c}"><span class="blanket">🧺</span><span class="bb" hidden>${guineaSVG(b, { size: 96, mood: "happy" })}<b>${esc(b.name)}</b> ${sexIco(b)}<small>${esc(coatName(b.genes))}</small>${tierChip(b)}</span></button>`).join("")}</div>
    <div class="mrow"><button class="btn green" data-ok>So cute!</button></div></div>`, { onClose: () => { done(); if (ROUTE.name === "home" || ROUTE.name === "pets") render(); } });
  $$("[data-b]", m.el).forEach(b => b.onclick = () => {
    if (b.classList.contains("open")) return; b.classList.add("open"); $(".blanket", b).hidden = true; $(".bb", b).hidden = false;
    const bb = babies[+b.dataset.b], t = tierOf(bb); const [x, y] = centerOf(b);
    if (t >= 3) { play("bigwin"); confetti(x, y, 100); } else if (t >= 1) { play("win"); confetti(x, y, 40); } else { play("wheek"); hearts(x, y, 6); }
  });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.passed = (e, done) => {
  play("sad");
  const m = openModal(`<div class="center passed"><p class="kicker">Rainbow Meadow</p>
    <div class="ghost-pet">${guineaSVG({ genes: e.genes, outfit: e.outfit, born: now() - 10 * DAY, life: 100 }, { size: 140, mood: "sleepy" })}<span class="rainbow-arc"></span></div>
    <h2>${esc(e.name)} has gone to Rainbow Meadow</h2>
    <p class="mtext">${esc(e.name)} lived ${e.days} wonderful days${e.kids ? `, had ${e.kids} ${e.kids === 1 ? "baby" : "babies"}` : ""} and got ${fmt(e.boops)} boops. ${esc(e.name)} was very, very loved. 🌈</p>
    <p class="muted">${esc(e.name)} left you a Rainbow Keepsake. You can visit anytime in Rainbow Meadow.</p>
    <div class="mrow"><button class="btn lilac" data-ok>Goodbye, ${esc(e.name)} 💜</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.rescue = (e, done) => {
  const g = G.guineas.find(x => x.id === e.id);
  const m = openModal(`<div class="center"><div class="big-emoji">👵</div><h2>Grandma Wheek is here!</h2><p class="mtext">"Oh sweetie, your hutch is so quiet. I brought you someone special who needs a friend."</p>${g ? guineaSVG(g, { size: 140, mood: "happy" }) : ""}<p class="mtext">Meet <b>${g ? esc(g.name) : "your new friend"}</b>!</p><div class="mrow"><button class="btn green" data-ok>Hello!</button></div></div>`, { onClose: () => { done(); render(); } });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.elder = (e, done) => {
  const g = G.guineas.find(x => x.id === e.id); if (!g) return done();
  const m = openModal(`<div class="center">${guineaSVG(g, { size: 130, mood: "happy" })}<h2>${esc(g.name)} is a Golden Oldie now</h2><p class="mtext">${esc(g.name)} has white eyebrows and lots of wisdom. Golden Oldies don't have forever left, so give lots of boops, snacks and cuddles! Vitamin C Drops add extra days.</p><div class="mrow"><button class="btn green" data-ok>I'll take good care of ${esc(g.name)}</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
};
EVENT_VIEWS.sick = (e, done) => {
  const g = G.guineas.find(x => x.id === e.id); if (!g || !g.sick) return done();
  play("sad");
  const m = openModal(`<div class="center">${guineaSVG(g, { size: 130, mood: "sad" })}<h2>${esc(g.name)} is sick!</h2><p class="mtext">Being hungry, dirty or bored for too long made ${esc(g.name)} poorly. Sick guineas lose life time, so get them better fast! Use Get-Well Gummies or visit Dr. Hootsworth at the Vet.</p><div class="mrow"><button class="btn white" data-ok>Later</button><button class="btn green" data-vet>To the Vet!</button></div></div>`, { onClose: done });
  $("[data-ok]", m.el).onclick = () => m.close();
  $("[data-vet]", m.el).onclick = () => { m.close(); go("place/vet"); };
};
