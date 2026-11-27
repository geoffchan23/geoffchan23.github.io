/* Wheek World systems: new game, time simulation, economy, packages, boxes, breeding, farm, quests. */
"use strict";
BOXES.forEach(o => ITEM[o.id] = Object.assign({ cat: "box" }, o));

const FARM_LEVELS = [
  { n: "No farm", cap: 0, plots: 0, cost: 0 },
  { n: "Tiny Shed", cap: 8, plots: 3, cost: 2000 },
  { n: "Cozy Barn", cap: 16, plots: 5, cost: 5000 },
  { n: "Big Red Barn", cap: 30, plots: 8, cost: 12000 },
  { n: "Guinea Palace", cap: 50, plots: 12, cost: 25000 },
];
const HUTCH_CAP = 2;
const NURSERY_CAP = 8;

function newGame() {
  const pud = makeGuinea({ name: "Pudding", sex: "sow", genes: { c: "ginger", c2: "choc", p: "patches", h: "smooth", e: "dark", m: null }, life: 34, pers: "cuddly", fav: "strawberry", born: now() - 4 * DAY, food: 70, joy: 75, clean: 80 });
  return {
    v: 1, created: now(), last: now(), coins: 300, xp: 0, level: 1,
    guineas: [pud], active: pud.id, nursery: [], memorial: [],
    inv: { lettuce: 4, carrot: 3, strawberry: 2, pellets: 4, soap: 2, chew: 2, slimekit: 2 },
    owned: { w_lilac: 1, f_wood: 1, d_house: 1, d_plant: 1 }, home: { wall: "w_lilac", floor: "f_wood", decor: ["d_plant", null, "d_house", null] },
    farm: { level: 0, hay: 0, plots: [] },
    squishies: {}, slimes: [], coats: {},
    packages: [{ id: uid(), courier: "granny", at: now(), welcome: true }], lastPkgHour: Math.floor(now() / HOUR),
    eventSeen: -1, rainTaps: {},
    daily: { day: "", streak: 0, quests: [], spun: false, earned: 0 },
    stats: { boops: 0, fed: 0, earned: 0, spent: 0, games: 0, packages: 0, boxes: 0, slimes: 0, babies: 0, poop: 0, harvest: 0, toots: 0, bigWin: 0 },
    ach: {}, best: {}, settings: { muted: false, sitter: 0 }, flags: {},
  };
}
function migrate(s) {
  const d = newGame();
  for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
  for (const k of Object.keys(d.stats)) if (s.stats[k] === undefined) s.stats[k] = 0;
  s.guineas.forEach(g => { if (g.lost == null) g.lost = 0; if (!g.outfit) g.outfit = {}; if (g.tuftMask == null) { g.tuftMask = 0; addTuft(g, 3); } });
  while (s.home.decor.length < 6) s.home.decor.push(null);
  return s;
}

/* ---------- helpers ---------- */
/* Rewards grow as you level up: +3% per keeper level, up to +60%. */
const keeperBonus = () => 1 + Math.min(.6, ((G && G.level) || 1) - 1) * .03;
// squishies are bought directly now (no blind boxes)
const SQ_PRICE = { common: 60, rare: 180, legendary: 600 };
SQUISHIES.forEach(s => { ITEM["sq_" + s.id] = { id: "sq_" + s.id, sq: s.id, cat: "squishy", name: s.name, price: SQ_PRICE[s.r], ico: "🍡", desc: { common: "A squishy for your collection.", rare: "RARE squishy! Sparkly!", legendary: "LEGENDARY squishy! Super special!" }[s.r] }; });
const activeG = () => G.guineas.find(g => g.id === G.active) || G.guineas[0];
const hutchList = () => G.guineas.filter(g => g.home === "hutch");
const farmList = () => G.guineas.filter(g => g.home === "farm");
const farmCap = () => G.farm.level ? (typeof farmCapacity === "function" && G.farm.grid ? farmCapacity() : 4) : 0;
const roomIn = where => where === "hutch" ? HUTCH_CAP - hutchList().length : farmCap() - farmList().length;
function freeHome() { if (roomIn("hutch") > 0) return "hutch"; if (roomIn("farm") > 0) return "farm"; return null; }
const hourIdx = () => Math.floor(now() / HOUR);
function currentEvent() { const h = hourIdx(); const r = mulberry(h * 7919 + 13); return weighted(WORLD_EVENTS, r); }
const eventOn = id => currentEvent().id === id;
const minsLeftInHour = () => Math.ceil((HOUR - (now() % HOUR)) / MIN);
function price(it) { const p = it.price || 0; return eventOn("sale") ? Math.ceil(p * .7) : p; }
function addItem(id, n = 1) { G.inv[id] = (G.inv[id] || 0) + n; if (G.inv[id] <= 0) delete G.inv[id]; saveSoon(); }
const has = id => (G.inv[id] || 0) > 0;
function own(id) { const it = ITEM[id]; if (!it) return; if (it.cat === "outfit" || it.cat === "wall" || it.cat === "floor" || it.cat === "rug") G.owned[id] = 1; else if (it.cat === "decor") G.owned[id] = (G.owned[id] || 0) + 1; saveSoon(); }
function noteCoat(g) { const c = coatName(g.genes); if (!G.coats[c]) { G.coats[c] = { t: tierOf(g), at: now() }; } }

/* ---------- time simulation ---------- */
function tick() {
  const t = now(), hrs = Math.min((t - G.last) / HOUR, 24 * 30);
  G.last = t;
  // sim in chunks so long absences behave
  let left = hrs;
  const t0 = t - hrs * HOUR;
  while (left > 0) { const step = Math.min(left, .5); left -= step; SIM_NOW = t0 + (hrs - left) * HOUR; G.guineas.forEach(g => simGuinea(g, step)); }
  SIM_NOW = 0;
  sleepTick();
  // pregnancies
  for (const g of G.guineas.slice()) if (g.preg && t >= g.preg.due) giveBirth(g);
  // guineas grow up and grow old (they never die)
  for (const g of G.guineas) { const st = stageOf(g); if (!g.stage) g.stage = st; else if (g.stage !== st) { const from = g.stage; g.stage = st; if (G.flags.intro) queueEvent({ type: "grew", id: g.id, from, to: st }); } }
  if (!G.guineas.length) grandmaRescue();
  if (!G.guineas.find(g => g.id === G.active)) G.active = G.guineas[0].id;
  // packages: one per new hour, max 3 waiting, max PKG_PER_DAY a day
  const h = hourIdx();
  if (h > G.lastPkgHour) {
    const n = Math.min(3, h - G.lastPkgHour);
    for (let i = 0; i < n && G.packages.length < 3 && pkgsLeftToday() > 0; i++) { G.packages.push({ id: uid(), courier: weighted(COURIERS).id, at: t }); G.pkgDay.n++; }
    G.lastPkgHour = h;
    if (n) refreshBadges();
  }
  // hourly event announcement
  if (G.eventSeen !== h) { G.eventSeen = h; if (G.flags.intro) queueEvent({ type: "worldEvent" }); }
  // daily
  dailyCheck();
  // sickness note
  for (const g of G.guineas) if (g.sick && !g.sickNote) { g.sickNote = 1; queueEvent({ type: "sick", id: g.id }); }
  saveSoon();
}
const PKG_PER_DAY = 6;
function pkgsLeftToday() { const k = dayKey(); if (!G.pkgDay || G.pkgDay.d !== k) G.pkgDay = { d: k, n: 0 }; return Math.max(0, PKG_PER_DAY - G.pkgDay.n); }
const dayKey = (t = now()) => { const d = new Date(t); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
function dailyCheck() {
  const k = dayKey();
  if (G.daily.day === k) return;
  const y = dayKey(now() - DAY);
  G.daily.streak = G.daily.day === y ? (G.daily.streak || 0) + 1 : 1;
  G.daily.day = k; G.daily.spun = false; G.daily.earned = 0; G.daily.claimed = false;
  const pool = shuffle(QUESTS.filter(q => !q.farm || G.farm.level > 0));
  const picked = []; for (const q of pool) { if (picked.length >= 3) break; if (!picked.some(p => p.k === q.k)) picked.push(q); }
  G.daily.quests = picked.map(q => ({ k: q.k, n: q.n, t: q.t, r: Math.round(q.r * keeperBonus()), have: 0, done: false }));
  if (G.flags.intro) queueEvent({ type: "daily" });
}
function questProgress(k, n = 1) {
  if (!G || !G.daily || !G.daily.quests) return;
  for (const q of G.daily.quests) if (q.k === k && !q.done) {
    q.have = Math.min(q.n, q.have + n);
    if (q.have >= q.n) { q.done = true; setTimeout(() => { toast(`Quest done: ${q.t}! +${q.r} coins`, "📋"); addCoins(q.r, [innerWidth / 2, 120]); addXP(20); play("win"); }, 400); }
  }
  refreshBadges();
}
function checkAchievements() {
  if (!G) return;
  for (const a of ACHIEVEMENTS) if (!G.ach[a.id] && a.test()) {
    G.ach[a.id] = now();
    if (a.give) own(a.give);
    queueEvent({ type: "achievement", id: a.id });
  }
}

/* ---------- care actions ---------- */
function useOn(g, id) {
  const it = ITEM[id]; if (!it || !has(id)) return null;
  const res = { toot: 0, text: "" };
  if (it.cat === "food") {
    if (g.food >= 98 && !it.joy) return { full: true };
    const wasHungry = g.food < 70;
    const magic = hasPower(g, "snackmagic");
    g.food = clamp(g.food + (it.food || 0) * (magic ? 2 : 1), 0, 100);
    if (magic && Math.random() < .25) { res.refund = true; addItem(id, 1); setTimeout(() => toast(`Snack Magic! The ${it.name} came back!`, "🍓"), 900); } g.joy = clamp(g.joy + (it.joy || 0) + (g.fav === id ? 15 : 0), 0, 100);
    if (it.health) g.health = clamp(g.health + it.health, 0, 100);
    if (it.clean) g.clean = clamp(g.clean + it.clean, 0, 100);
    if (it.xp) addXP(it.xp);
    g.fed++; G.stats.fed++; questProgress("feed");
    res.toot = (it.toot || 0) + (g.pers === "gassy" ? .4 : 0);
    if (wasHungry) res.care = 3;
    res.fav = g.fav === id;
  } else if (it.cat === "care") {
    if (it.cure) { if (!g.sick && g.health > 90) return { pointless: true }; g.sick = false; g.sickNote = 0; }
    if (it.clean) { g.clean = clamp(g.clean + it.clean, 0, 100); questProgress("bath"); if (g.clean < 60) res.care = 3; }
    if (it.health) g.health = clamp(g.health + it.health, 0, 100);
    if (it.health && g.health > 40) g.sick = false;
    if (it.younger) { if (ageMs(g) <= AGE_ADULT + DAY) return { pointless: true }; g.born = Math.min(now() - AGE_ADULT, g.born + it.younger * DAY); g.stage = stageOf(g); res.text = `${g.name} looks ${it.younger} days younger!`; }
    if (it.joy) g.joy = clamp(g.joy + it.joy, 0, 100);
    if (it.sitter) { G.settings.sitter = Math.max(now(), G.settings.sitter || 0) + it.sitter * HOUR; res.text = "Granny is babysitting for 24 hours!"; }
  } else if (it.cat === "toy") {
    const targets = it.all ? G.guineas : [g];
    targets.forEach(t => t.joy = clamp(t.joy + it.joy, 0, 100));
    tireOut(g, 3);
    questProgress("toy"); if (g.joy < 60) res.care = 3;
  } else return null;
  addItem(id, -1); addXP(2); saveSoon();
  return res;
}

/* ---------- breeding ---------- */
function startDate(sow, boar) {
  const potion = has("lovepotion");
  const chance = potion || eventOn("love") ? 1 : .7;
  sow.lastMate = boar.lastMate = now();
  if (Math.random() > chance) { saveSoon(); return false; }
  if (potion) addItem("lovepotion", -1);
  let hrs = 3; if (eventOn("babyboom")) hrs = 1.5;
  let n = weighted([{ v: 1, w: 25 }, { v: 2, w: 40 }, { v: 3, w: 25 }, { v: 4, w: 10 }]).v;
  if (potion) n++; if (eventOn("love") && Math.random() < .3) n++;
  const mango = has("mango"); if (mango) addItem("mango", -1);
  sow.preg = { due: now() + hrs * HOUR, dad: boar.id, dadName: boar.name, dadGenes: boar.genes, dadGen: boar.gen || 1, n: Math.min(n, 5), mut: (mango ? 6 : 1) * (eventOn("babyboom") ? 2 : 1) * (hasPower(sow, "babymagic") || hasPower(boar, "babymagic") ? 3 : 1) };
  addXP(15); saveSoon();
  return true;
}
function giveBirth(mom) {
  const p = mom.preg; mom.preg = null;
  const babies = [];
  for (let i = 0; i < p.n; i++) {
    const genes = inherit(mom.genes, p.dadGenes, { mutBoost: p.mut || 1 });
    const b = makeGuinea({ genes, gen: Math.max(mom.gen || 1, p.dadGen || 1) + 1, parents: [mom.name, p.dadName], food: 90, joy: 90, clean: 100 });
    const where = (mom.home && roomIn(mom.home) > 0) ? mom.home : freeHome();
    if (where) { b.home = where; G.guineas.push(b); } else { b.home = "nursery"; G.nursery.push(b); }
    babies.push(b); noteCoat(b);
  }
  mom.kids = (mom.kids || 0) + babies.length;
  G.stats.babies += babies.length; addXP(25 * babies.length);
  queueEvent({ type: "birth", mom: mom.name, dad: p.dadName, ids: babies.map(b => b.id) });
  checkAchievements(); saveSoon();
}
function passAway(g) {
  G.guineas = G.guineas.filter(x => x !== g);
  G.memorial.unshift({ name: g.name, genes: g.genes, outfit: g.outfit, born: g.born, died: now(), sex: g.sex, kids: g.kids || 0, boops: g.boops || 0, pers: g.pers });
  addItem("keepsake", 1);
  queueEvent({ type: "passed", name: g.name, genes: g.genes, outfit: g.outfit, days: Math.floor((now() - g.born) / DAY), kids: g.kids || 0, boops: g.boops || 0 });
  saveSoon();
}
function grandmaRescue() {
  const b = makeGuinea({ name: pick(NAMES), born: now() - 2 * DAY, life: 24 });
  b.home = "hutch"; G.guineas.push(b); G.active = b.id; noteCoat(b);
  queueEvent({ type: "rescue", id: b.id });
}
function rehomeValue(g) { const t = TIERS[tierOf(g)]; const st = stageOf(g); return Math.round(t.v * (st === "baby" ? .5 : st === "kid" ? .8 : isOld(st) ? .7 : 1)); }

/* ---------- adoption center stock (refreshes every 3 hours) ---------- */
function adoptStock() {
  const slot = Math.floor(now() / (3 * HOUR));
  if (G.adopt && G.adopt.slot === slot) return G.adopt;
  const r = mulberry(slot * 31 + 7);
  const list = Array.from({ length: 4 }, (_, i) => {
    const genes = randGenes(r, { mut: .03 });
    const g = { genes, sex: r() < .5 ? "boar" : "sow", name: NAMES[Math.floor(r() * NAMES.length)], key: slot + "-" + i, pers: Object.keys(PERSONALITIES)[Math.floor(r() * 8)] };
    g.price = [300, 450, 900, 1800, 3500, 7000][tierOf(g)];
    return g;
  });
  if (!list.some(x => x.sex === "boar")) list[0].sex = "boar";
  G.adopt = { slot, list, sold: {} };
  return G.adopt;
}
function adoptGuinea(o, home) {
  const g = makeGuinea({ genes: o.genes, sex: o.sex, name: o.name, pers: o.pers, born: now() - (3.2 + Math.random()) * DAY, life: 18 + Math.random() * 7 });
  g.pw = powersOf(o).slice();
  g.home = home; G.guineas.push(g); noteCoat(g); addXP(30); checkAchievements(); saveSoon();
  return g;
}

/* ---------- boxes & packages ---------- */
const FOOD_POOL = () => [
  { id: "goldlettuce", w: 2 }, { id: "rainbowcarrot", w: 3 }, { id: "burrito", w: 8 }, { id: "haycake", w: 6 }, { id: "watermelon", w: 12 },
  { id: "strawberry", w: 14 }, { id: "lettuce", w: 12 }, { id: "carrot", w: 12 }, { id: "cucumber", w: 10 }, { id: "pepper", w: 10 }, { id: "dandelion", w: 10 }, { id: "pellets", w: 10 },
];
function rollSquishy(minR) {
  const r = Math.random();
  let rr = r < .04 ? "legendary" : r < .25 ? "rare" : "common";
  if (minR === "rare" && rr === "common") rr = "rare";
  const pool = SQUISHIES.filter(s => s.r === rr);
  const missing = pool.filter(s => !G.squishies[s.id]);
  const s = (missing.length && Math.random() < .6) ? pick(missing) : pick(pool);
  return s;
}
function rarityOfReward(rw) {
  if (rw.coins) return rw.coins >= 1000 ? "legendary" : rw.coins >= 300 ? "epic" : rw.coins >= 120 ? "rare" : "common";
  if (rw.squishy) { const s = SQUISHIES.find(x => x.id === rw.squishy); return s.r === "legendary" ? "legendary" : s.r === "rare" ? "epic" : "common"; }
  if (rw.guinea) return ["rare", "rare", "epic", "legendary", "mythic", "mythic"][tierOf(rw.guinea)];
  const it = ITEM[rw.item]; if (!it) return "common";
  if (it.special || it.id === "youth" || it.id === "goldlettuce" || it.id === "d_toilet" || it.id === "gem") return "legendary";
  if (it.rare || it.id === "fossil" || it.id === "mango" || it.cat === "box" || (it.price || 0) >= 200) return "epic";
  if ((it.price || 0) >= 60 || it.cat === "outfit" || it.cat === "decor") return "rare";
  return "common";
}
function rollOutfit(boxOnly) {
  const pool = OUTFITS.filter(o => o.price > 0 || (boxOnly && o.id === "unicornhorn"));
  if (boxOnly && Math.random() < .06) return "unicornhorn";
  return pick(pool).id;
}
function rollDecor() { if (Math.random() < .04) return "d_ufo"; return pick(DECOR.filter(d => d.price > 0 && d.price < 700).concat(Math.random() < .03 ? [ITEM.d_toilet] : [])).id; }
function openBoxRewards(boxId) {
  const out = [];
  if (boxId === "box_snack") for (let i = 0; i < 3; i++) out.push({ item: weighted(FOOD_POOL()).id, n: 1 });
  else if (boxId === "box_squishy") out.push({ squishy: rollSquishy().id });
  else if (boxId === "box_fashion") out.push({ item: rollOutfit(true), n: 1 });
  else if (boxId === "box_decor") out.push({ item: rollDecor(), n: 1 });
  else if (boxId === "box_mega") {
    const r = weighted([{ k: "coins", w: 25 }, { k: "boxes", w: 15 }, { k: "legsq", w: 10 }, { k: "outfit", w: 12 }, { k: "toilet", w: 5 }, { k: "youth", w: 5 }, { k: "guinea", w: 6 }, { k: "mythic", w: 2 }, { k: "love", w: 10 }, { k: "gold", w: 10 }]).k;
    if (r === "coins") out.push({ coins: rint(300, 1000) });
    else if (r === "boxes") out.push({ item: "box_squishy", n: 1 }, { item: "box_fashion", n: 1 }, { item: "box_snack", n: 1 });
    else if (r === "legsq") out.push({ squishy: pick(SQUISHIES.filter(s => s.r === "legendary")).id });
    else if (r === "outfit") out.push({ item: rollOutfit(true), n: 1 }, { item: rollOutfit(true), n: 1 });
    else if (r === "toilet") out.push({ item: "d_toilet", n: 1 });
    else if (r === "youth") out.push({ item: "youth", n: 1 });
    else if (r === "guinea") { const g = { genes: randGenes(Math.random, { mut: .25 }), sex: Math.random() < .5 ? "boar" : "sow", name: pick(NAMES) }; out.push({ guinea: g }); }
    else if (r === "mythic") out.push({ coins: 2500 });
    else if (r === "love") out.push({ item: "lovepotion", n: 1 }, { item: "mango", n: 1 }, { item: "timesnail", n: 1 });
    else out.push({ item: "goldlettuce", n: 2 }, { item: "rainbowcarrot", n: 2 });
  }
  return out;
}
function packageRewards(pk) {
  const c = COURIERS.find(x => x.id === pk.courier) || COURIERS[0];
  const out = [];
  if (pk.welcome) return [{ coins: 100 }, { squishy: rollSquishy().id }, { item: "haycake", n: 1 }];
  const roll = () => {
    const k = weighted([{ k: "coins", w: 30 }, { k: "food", w: 20 }, { k: "toy", w: 10 }, { k: "kits", w: 8 }, { k: "seeds", w: G.farm.level ? 8 : 0 }, { k: "box", w: 10 }, { k: "squishy", w: 6 }, { k: "outfit", w: 4 }, { k: "decor", w: 3 }, { k: "love", w: 3 }, { k: "gold", w: 2 }, { k: "vit", w: 3 }]).k;
    if (k === "coins") out.push({ coins: rint(25, 120) });
    else if (k === "food") for (let i = 0; i < rint(2, 4); i++) out.push({ item: weighted(FOOD_POOL()).id, n: 1 });
    else if (k === "toy") out.push({ item: pick(["paperball", "chew", "squeaky", "ballpit"]), n: 1 });
    else if (k === "kits") out.push({ item: "slimekit", n: 2 });
    else if (k === "seeds") out.push({ item: pick(["seed_lettuce", "seed_carrot", "seed_straw", "seed_melon", "magicbean"]), n: 2 });
    else if (k === "box") { out.push({ item: weighted(FOOD_POOL()).id, n: 1 }); out.push({ item: weighted(FOOD_POOL()).id, n: 1 }); }
    else if (k === "squishy") out.push({ squishy: rollSquishy().id });
    else if (k === "outfit") out.push({ item: rollOutfit(true), n: 1 });
    else if (k === "decor") out.push({ item: rollDecor(), n: 1 });
    else if (k === "love") out.push({ item: pick(["lovepotion", "timesnail", "mango"]), n: 1 });
    else if (k === "gold") out.push({ item: "goldlettuce", n: 1 });
    else out.push({ item: "vitc", n: 1 });
  };
  if (c.force === "squishy") out.push({ squishy: rollSquishy(Math.random() < .3 ? "rare" : null).id });
  else if (c.force === "care") { out.push({ item: "haycake", n: 1 }, { item: weighted(FOOD_POOL()).id, n: 2 }); if (Math.random() < .35) out.push({ item: pick(["scarf", "bow", "flowers", "pearls"]), n: 1 }); }
  else if (c.junk) { const r = Math.random(); if (r < .45) out.push({ item: "sock", n: 1 }); else if (r < .7) out.push({ item: "fossil", n: 1 }); else if (r < .85) out.push({ item: "gem", n: 1 }); else out.push({ coins: rint(150, 300) }); }
  else if (c.alien) { const r = Math.random(); if (r < .4) out.push({ item: "mango", n: 1 }); else if (r < .55) out.push({ item: "d_ufo", n: 1 }); else if (r < .65) out.push({ item: "unicornhorn", n: 1 }); else out.push({ coins: rint(100, 250) }); }
  else if (c.coins) out.push({ coins: rint(80, 250) });
  else roll();
  if (c.extra) roll();
  if (c.bonus) out.push({ item: c.bonus, n: 1 });
  if (pk.courier === "bottle") out.push({ item: "slimekit", n: 1 });
  return out;
}
function grant(rw) {
  if (rw.coins) { G.coins += rw.coins; G.stats.earned += rw.coins; renderCoins(); return; }
  if (rw.squishy) { const had = G.squishies[rw.squishy]; G.squishies[rw.squishy] = (had || 0) + 1; rw.dupe = !!had; if (had) { G.coins += 15; renderCoins(); } return; }
  if (rw.guinea) {
    const home = freeHome() || "nursery";
    const g = makeGuinea({ genes: rw.guinea.genes, sex: rw.guinea.sex, name: rw.guinea.name, born: now() - 3.3 * DAY, life: 20 + Math.random() * 6 });
    g.home = home; if (home === "nursery") G.nursery.push(g); else G.guineas.push(g); noteCoat(g); rw.where = home; return;
  }
  const it = ITEM[rw.item]; if (!it) return;
  if (it.cat === "outfit" || it.cat === "wall" || it.cat === "floor") { if (G.owned[it.id]) { rw.dupe = true; const refund = Math.max(25, Math.round((it.price || 200) * .5)); rw.refund = refund; G.coins += refund; renderCoins(); } else own(it.id); return; }
  if (it.cat === "decor") { own(it.id); return; }
  addItem(it.id, rw.n || 1);
}

/* ---------- farm ---------- */
function plotsCount() { return 0; }
function ensurePlots() { }
function plotReady(p) { return p.seed && now() >= p.ready; }
function harvest(i) {
  const p = G.farm.plots[i]; if (!plotReady(p)) return null;
  const it = ITEM[p.seed]; const [what, n] = it.yields; let out;
  if (what === "magic") {
    const r = weighted([{ k: "gold", w: 25 }, { k: "rainbow", w: 25 }, { k: "coins", w: 30 }, { k: "box", w: 15 }, { k: "mega", w: 5 }]).k;
    out = r === "gold" ? { item: "goldlettuce", n: 2 } : r === "rainbow" ? { item: "rainbowcarrot", n: 3 } : r === "coins" ? { coins: rint(100, 500) } : r === "box" ? { item: "box_squishy", n: 1 } : { item: "box_mega", n: 1 };
  } else out = { item: what, n: n + (Math.random() < .2 ? 1 : 0) };
  grant(out); p.seed = null; G.stats.harvest++; questProgress("harvest"); addXP(5); saveSoon();
  return out;
}
function farmPoops() { return farmList().reduce((s, g) => s + (g.poop || 0), 0); }

/* ---------- slime ---------- */
const SLIME_COLORS = [["#7be04a", "Classic Goo"], ["#ff8fc7", "Bubblegum"], ["#5fd3ff", "Ocean"], ["#c7b3ff", "Grape"], ["#ffd84d", "Banana"], ["#ff7a3d", "Lava"], ["#3fd6b0", "Mermaid"], ["#f4f4ff", "Cloud"], ["#4a3aa8", "Galaxy"], ["#2b2b2b", "Midnight"]];
const ADDINS = [["glitter", "Glitter", 0], ["beads", "Foam Beads", 0], ["eyes", "Googly Eyes", 0], ["hearts", "Hearts", 0], ["stars", "Stars", 0], ["gold", "Gold Flakes", 300], ["glow", "Glow Goo", 250], ["ducks", "Tiny Ducks", 200]];
function slimeOrder() {
  const h = hourIdx(), r = mulberry(h * 101 + 5);
  const col = SLIME_COLORS[Math.floor(r() * SLIME_COLORS.length)], add = ADDINS[Math.floor(r() * 5)];
  return { h, color: col[0], colorName: col[1], add: add[0], addName: add[1] };
}
function slimeBase(s) {
  let v = 18;
  for (const [k, , pr] of ADDINS) if (s.adds[k]) v += pr ? 22 : 7;
  const n = Object.values(s.adds).filter(Boolean).length; if (n >= 5) v += 15;
  if (s.color === "#4a3aa8" || s.color === "#2b2b2b") v += 6;
  return v;
}
const APPRAISE = [{ m: .5, w: 18, t: "Meh goo" }, { m: .8, w: 24, t: "Decent goo" }, { m: 1, w: 25, t: "Good goo" }, { m: 1.5, w: 16, t: "Great goo!" }, { m: 2, w: 10, t: "SUPERB GOO!" }, { m: 3, w: 4.5, t: "MASTERPIECE!" }, { m: 5, w: 2, t: "LEGENDARY SLIME!!" }, { m: 10, w: .5, t: "ULTRA RARE GOO!!!" }];
