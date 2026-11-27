/* Wheek World: shops restock every day at midnight, like a real village shop.
   Each day every shop gets a random mix. Some things are rare finds (💎) and some are limited (⏳ today only!).
   Basics (hay, pellets, lettuce, soap, medicine) are always in stock so nobody goes hungry.
   The Recycle Bin buys back things you don't need. */
"use strict";

/* ---------- limited-time items (only show up some days) ---------- */
const LIMITED_DECOR = [
  { id: "d_carousel", name: "Tiny Carousel", ico: "🎠", price: 380 }, { id: "d_dino", name: "Dino Skeleton", ico: "🦕", price: 520 },
  { id: "d_mermaid", name: "Mermaid Statue", ico: "🧜‍♀️", price: 460 }, { id: "d_planet", name: "Planet Lamp", ico: "🪐", price: 350 },
  { id: "d_donut", name: "Giant Donut", ico: "🍩", price: 240 }, { id: "d_flamingo", name: "Flamingo Friend", ico: "🦩", price: 180 },
  { id: "d_pumpkin", name: "Pumpkin House", ico: "🎃", price: 260 }, { id: "d_pinata", name: "Guinea Piñata", ico: "🪅", price: 200 },
  { id: "d_dragon", name: "Dragon Statue", ico: "🐉", price: 600 }, { id: "d_crystal", name: "Magic Crystal Ball", ico: "🔮", price: 420 },
  { id: "d_cake", name: "Ten-Layer Cake", ico: "🎂", price: 300 }, { id: "d_tree", name: "Bonsai Tree", ico: "🌳", price: 280 },
  { id: "d_shooting", name: "Shooting Star Sticker", ico: "🌠", price: 210, wall: true }, { id: "d_butterfly", name: "Butterfly Frame", ico: "🦋", price: 190, wall: true },
  { id: "d_moon", name: "Glowing Moon", ico: "🌙", price: 240, wall: true },
].map(d => Object.assign({ limited: true }, d));
const LIMITED_WALLS = [
  { id: "w_aurora", name: "Aurora Lights", price: 420, limited: true, css: "linear-gradient(160deg,#1b2a6b 0%,#2f7a8a 35%,#7be0b0 55%,#c7b3ff 75%,#1b2a6b 100%)" },
  { id: "w_lollipop", name: "Lollipop Swirl", price: 300, limited: true, css: "repeating-conic-gradient(from 0deg at 50% 50%,#ff9fd0 0 15deg,#fff 15deg 30deg,#8fd3ff 30deg 45deg,#fff 45deg 60deg)" },
];
const LIMITED_FLOORS = [
  { id: "f_rainbow", name: "Rainbow Tiles", price: 380, limited: true, css: "linear-gradient(90deg,#ff9fd0 0 16%,#ffd28a 16% 33%,#fff08a 33% 50%,#a6f0c6 50% 66%,#8fd3ff 66% 83%,#cdb6ff 83%)" },
  { id: "f_stars", name: "Starry Night Floor", price: 340, limited: true, css: "radial-gradient(#fff3a8 1.5px,transparent 2.2px) 0 0/22px 22px, radial-gradient(#fff 1px,transparent 1.6px) 11px 11px/22px 22px, #2d1f7a" },
];
LIMITED_DECOR.forEach(d => { DECOR.push(d); ITEM[d.id] = Object.assign({ cat: "decor" }, d); });
LIMITED_WALLS.forEach(d => { WALLS.push(d); ITEM[d.id] = Object.assign({ cat: "wall", ico: "🎨" }, d); });
LIMITED_FLOORS.forEach(d => { FLOORS.push(d); ITEM[d.id] = Object.assign({ cat: "floor", ico: "🟫" }, d); });

const BASICS = { food: ["hay", "pellets", "lettuce"], care: ["soap", "gummies"], farm: ["haybale", "seed_lettuce", "slimekit"] };
const STOCK_N = {
  squeakmart: { food: 5, care: 3, toy: 3, love: 2, farm: 4 },
  boutique: { hat: 5, face: 4, neck: 4, back: 3, feet: 3, salon: 4, decor: 6, walldecor: 3, rug: 3, wall: 3, floor: 3 },
  boxes: { common: 6, rare: 3, legendary: 1 },
};

const restockIn = () => { const d = new Date(); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); return m - d; };
function isRareStock(it) {
  if (it.cat === "squishy") return SQUISHIES.find(s => s.id === it.sq).r !== "common";
  return (it.price || 0) >= 350 && ["outfit", "decor", "wall", "floor", "rug", "dye"].includes(it.cat);
}
function stockPool(shop, tab) {
  if (shop === "squeakmart") {
    const basics = BASICS[tab] || [];
    if (tab === "farm") return ITEMS.filter(i => ((i.cat === "farm" && i.price > 0) || i.cat === "seed" || i.cat === "slime") && !basics.includes(i.id));
    return ITEMS.filter(i => i.cat === tab && i.price > 0 && !i.rare && !basics.includes(i.id));
  }
  if (shop === "boutique") {
    if (["hat", "face", "neck", "back", "feet"].includes(tab)) return OUTFITS.filter(o => o.slot === tab && o.price > 0).map(o => ITEM[o.id]);
    if (tab === "salon") return ITEMS.filter(i => i.cat === "dye");
    if (tab === "decor") return DECOR.filter(d => d.price > 0 && !d.wall).map(d => ITEM[d.id]);
    if (tab === "walldecor") return DECOR.filter(d => d.price > 0 && d.wall).map(d => ITEM[d.id]);
    if (tab === "rug") return RUGS.map(d => ITEM[d.id]);
    if (tab === "wall") return WALLS.filter(d => d.price > 0).map(d => ITEM[d.id]);
    return FLOORS.filter(d => d.price > 0).map(d => ITEM[d.id]);
  }
  if (shop === "boxes") return SQUISHIES.filter(q => q.r === tab).map(q => ITEM["sq_" + q.id]);
  return [];
}
const STOCK_CACHE = {};
/* today's stock for one shop tab: [{...item, _tag}] */
function todayStock(shop, tab) {
  const day = dayKey(), key = day + "|" + shop + "|" + tab;
  if (STOCK_CACHE[key]) return STOCK_CACHE[key];
  const rnd = mulberry(hashStr(key + "|wheek"));
  const n = (STOCK_N[shop] || {})[tab] || 4;
  const pool = stockPool(shop, tab);
  const out = [];
  // limited items: at most one per tab, and only some days
  const lim = pool.filter(it => it.limited), normal = pool.filter(it => !it.limited);
  if (lim.length && rnd() < .55) out.push(Object.assign({}, lim[Math.floor(rnd() * lim.length)], { _tag: "limited" }));
  // the legendary squishy is only in stock some days
  const want = shop === "boxes" && tab === "legendary" ? (rnd() < .5 ? 1 : 0) : n;
  const bag = normal.map(it => ({ it, w: isRareStock(it) ? .35 : 1 }));
  while (out.length < want && bag.length) {
    let tot = bag.reduce((a, b) => a + b.w, 0), r = rnd() * tot, i = 0;
    for (; i < bag.length - 1; i++) { r -= bag[i].w; if (r <= 0) break; }
    const { it } = bag.splice(i, 1)[0];
    out.push(Object.assign({}, it, { _tag: isRareStock(it) ? "rare" : "" }));
  }
  const basics = shop === "squeakmart" ? (BASICS[tab] || []).map(id => Object.assign({}, ITEM[id], { _tag: "basic" })) : [];
  return (STOCK_CACHE[key] = basics.concat(out));
}
function limitedToday() {
  const n = [];
  for (const [shop, tabs] of Object.entries(STOCK_N)) for (const tab of Object.keys(tabs)) todayStock(shop, tab).forEach(it => { if (it._tag === "limited") n.push(it); });
  return n;
}
function stockBanner(shop) {
  if (!STOCK_N[shop]) return "";
  const lim = limitedToday().length;
  return `<div class="stock-banner"><b>🗓️ New stock every day!</b> Today's items leave in <b>${dur(restockIn())}</b>. <span class="sb-key"><span class="tag lim">⏳ Today only</span> <span class="tag rare">💎 Rare find</span></span>${lim ? `<small>${lim} limited item${lim > 1 ? "s" : ""} in town today!</small>` : ""}</div>`;
}
function stockTag(it) {
  if (it._tag === "limited") return `<span class="tag lim">⏳ Today only</span>`;
  if (it._tag === "rare") return `<span class="tag rare">💎 Rare find</span>`;
  if (it._tag === "basic") return `<span class="tag basic">Always here</span>`;
  return "";
}

/* ---------- Recycle Bin ---------- */
const RECYCLE_RATE = .3;
function recycleEntries() {
  const out = [];
  const wornIds = new Set(G.guineas.flatMap(g => Object.values(g.outfit || {})));
  // junk & treasures sell for their full value
  for (const id of Object.keys(G.inv)) { const it = ITEM[id]; if (!it || !G.inv[id]) continue;
    if (it.sell > 0) out.push({ k: "inv", id, n: G.inv[id], v: it.sell, grp: "junk" });
    else if ((it.price || 0) > 0 && it.cat !== "box") out.push({ k: "inv", id, n: G.inv[id], v: Math.max(1, Math.floor(it.price * RECYCLE_RATE)), grp: "stuff" });
  }
  for (const id of Object.keys(G.owned)) { const it = ITEM[id]; if (!it || !(it.price > 0)) continue;
    if (it.cat === "outfit" && !wornIds.has(id)) out.push({ k: "own", id, n: 1, v: Math.floor(it.price * RECYCLE_RATE), grp: "deco" });
    else if (it.cat === "decor") { const spare = (G.owned[id] || 0) - G.home.decor.filter(d => d === id).length; if (spare > 0) out.push({ k: "decor", id, n: spare, v: Math.floor(it.price * RECYCLE_RATE), grp: "deco" }); }
    else if ((it.cat === "wall" && G.home.wall !== id) || (it.cat === "floor" && G.home.floor !== id) || (it.cat === "rug" && G.home.rug !== id)) out.push({ k: "own", id, n: 1, v: Math.floor(it.price * RECYCLE_RATE), grp: "deco" });
  }
  for (const [sq, c] of Object.entries(G.squishies)) if (c > 1) { const s = SQUISHIES.find(x => x.id === sq); if (s) out.push({ k: "sq", id: "sq_" + sq, sq, n: c - 1, v: Math.floor(SQ_PRICE[s.r] * RECYCLE_RATE), grp: "sq" }); }
  return out;
}
function recycleList() {
  const all = recycleEntries();
  const head = `<div class="recycle-head card"><span class="big-emoji sm">♻️</span><div><b>The Recycle Bin</b><small>Mrs. Nibbles buys back stuff you don't need for ${Math.round(RECYCLE_RATE * 100)}% of the price (treasures like gems and fossils pay full price!). Things you're wearing or using are safe. Changed your mind? You can undo it.</small></div></div>`;
  if (!all.length) return head + `<p class="muted center">Nothing to recycle right now. Spare clothes, decor, snacks, toys and duplicate squishies show up here.</p>`;
  const GRP = [["junk", "Treasures & junk"], ["stuff", "Snacks, toys & supplies"], ["deco", "Clothes & decor you're not using"], ["sq", "Spare squishies (duplicates)"]];
  return head + GRP.map(([g, t]) => { const L = all.filter(e => e.grp === g); return L.length ? `<h2 class="sec">${t}</h2><div class="shop-grid">${L.map(e => `<div class="si-card"><div class="si-art">${itemIcon(e.id)}</div><b class="si-n">${esc(ITEM[e.id].name)}</b><small class="si-d">${e.n > 1 ? `You have ${e.n} spare` : "1 spare"}</small><button class="btn small sky" data-recycle="${e.k}:${e.id}">♻️ ${COIN} ${fmt(e.v)}</button></div>`).join("")}</div>` : ""; }).join("");
}
async function doRecycle(key, btn) {
  const [k, id] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
  const e = recycleEntries().find(x => x.k === k && x.id === id); if (!e) return;
  const it = ITEM[id];
  if (e.v >= 40 && !(await confirmBox(`Recycle ${esc(it.name)}?`, `Mrs. Nibbles will give you <b>${fmt(e.v)} coins</b> for it.`, "♻️ Recycle", "Keep it"))) return;
  if (k === "inv") addItem(id, -1);
  else if (k === "own") delete G.owned[id];
  else if (k === "decor") { G.owned[id]--; if (G.owned[id] <= 0) delete G.owned[id]; }
  else if (k === "sq") G.squishies[e.sq]--;
  addCoins(e.v, btn); play("coin"); haptic(10);
  recordBuy({ type: "recycle", k, id, sq: e.sq, price: e.v, name: it.name, verb: "Recycled" });
  questProgress("recycle"); saveSoon(); render();
}
