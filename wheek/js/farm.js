/* Wheek World: the Guinea Farm you build yourself. Buy homes, food stations, play gear,
   money-making shops and decorations, place them on the grid, and your farm guineas roam around. */
"use strict";

const FARM_PRICE = 800;
const FB = {
  // homes: room for more guineas
  shed: { n: "Starter Shed", ico: "🛖", cat: "home", price: 0, cap: 4, noSell: true, d: "Home for 4 guineas." },
  hutch: { n: "Cozy Hutch", ico: "🏠", cat: "home", price: 350, cap: 4, d: "Home for 4 more guineas." },
  cottage: { n: "Guinea Cottage", ico: "🏡", cat: "home", price: 1100, cap: 8, d: "Home for 8 more guineas." },
  village: { n: "Guinea Village", ico: "🏘️", cat: "home", price: 4500, cap: 20, w: 2, h: 2, d: "Home for 20 more guineas!" },
  palace: { n: "Guinea Palace", ico: "🏰", cat: "home", price: 15000, cap: 40, w: 2, h: 2, d: "Home for 40 more guineas. FANCY." },
  // food & care
  plot: { n: "Garden Plot", ico: "🌱", cat: "food", price: 80, d: "Grow free veggies from seeds." },
  hayrack: { n: "Hay Rack", ico: "🧺", cat: "food", price: 180, d: "Farm guineas feed themselves from it. Holds 30 meals." },
  fountain: { n: "Water Fountain", ico: "⛲", cat: "food", price: 260, d: "Farm guineas stay clean longer (up to 2 count)." },
  // fun: farm guineas stay happy longer (up to 5 count)
  tunnel: { n: "Play Tunnel", ico: "🕳️", cat: "fun", price: 120, d: "Farm guineas stay happy longer." },
  slide: { n: "Slide", ico: "🛝", cat: "fun", price: 220, d: "Farm guineas stay happy longer." },
  ballpit: { n: "Ball Pit", ico: "🎈", cat: "fun", price: 300, d: "Farm guineas stay happy longer." },
  tent: { n: "Popcorn Tent", ico: "🎪", cat: "fun", price: 420, d: "Farm guineas stay happy longer." },
  splash: { n: "Splash Pad", ico: "💦", cat: "fun", price: 480, d: "Farm guineas stay happy longer." },
  // shops: earn coins every hour, even when you're away
  stand: { n: "Veggie Stand", ico: "🥕", cat: "shop", price: 250, rate: 14, d: "Sells veggies to passers-by." },
  lemon: { n: "Lettuce-ade Stand", ico: "🥤", cat: "shop", price: 600, rate: 30, d: "Refreshing! Weird, but refreshing." },
  zoo: { n: "Petting Zoo", ico: "🎠", cat: "shop", price: 1000, rate: 6, perGuinea: true, d: "Visitors pay to pet your guineas. Earns more with more farm guineas!" },
  compost: { n: "Poop-to-Coins Factory", ico: "🏭", cat: "shop", price: 1400, rate: 55, d: "Turns poop into money. Science!" },
  slimestall: { n: "Slime Stall", ico: "🧪", cat: "shop", price: 1800, rate: 75, d: "Sells jars of goo." },
  cafe: { n: "Guinea Café", ico: "☕", cat: "shop", price: 4200, rate: 160, d: "Cucumber lattes. Very popular." },
  spa: { n: "Fluff Spa", ico: "💆", cat: "shop", price: 9000, rate: 320, d: "Fancy guinea pampering. Big money!" },
  // decorations
  tree: { n: "Apple Tree", ico: "🌳", cat: "decor", price: 40 }, pine: { n: "Pine Tree", ico: "🌲", cat: "decor", price: 40 },
  tulip: { n: "Tulips", ico: "🌷", cat: "decor", price: 20 }, sunflower: { n: "Sunflower", ico: "🌻", cat: "decor", price: 25 },
  cherry: { n: "Blossom", ico: "🌸", cat: "decor", price: 60 }, mushroom: { n: "Giant Mushroom", ico: "🍄", cat: "decor", price: 30 },
  rock: { n: "Rock", ico: "🪨", cat: "decor", price: 15 }, cactus: { n: "Cactus", ico: "🌵", cat: "decor", price: 30 },
  pond: { n: "Lily Pond", ico: "🪷", cat: "decor", price: 150 }, lamp: { n: "Lantern", ico: "🏮", cat: "decor", price: 70 },
  bench: { n: "Bench", ico: "🪑", cat: "decor", price: 60 }, flag: { n: "Flag", ico: "🚩", cat: "decor", price: 25 },
  snowman: { n: "Snowman", ico: "⛄", cat: "decor", price: 90 }, xmas: { n: "Festive Tree", ico: "🎄", cat: "decor", price: 200 },
  statue: { n: "Mystery Statue", ico: "🗿", cat: "decor", price: 260 }, rainbow: { n: "Rainbow Arch", ico: "🌈", cat: "decor", price: 400 },
  ferris: { n: "Mini Ferris Wheel", ico: "🎡", cat: "decor", price: 800, w: 2, h: 2 },
};
const FB_TABS = [["home", "🏠 Homes"], ["shop", "💰 Shops"], ["food", "🥕 Food"], ["fun", "🎈 Fun"], ["decor", "🌷 Decor"]];
const FARM_COLS = 6;
const shopRate = s => { const b = FB[s.t]; let r = b.rate * (1 + .6 * ((s.lv || 1) - 1)); if (b.perGuinea) r *= Math.max(1, farmList().length); if (anyPower("shopboss", farmList())) r *= 1.25; return r; };
const shopCapH = s => 6 + 2 * ((s.lv || 1) - 1);
const shopStored = s => Math.min(shopRate(s) * shopCapH(s), shopRate(s) * Math.max(0, now() - (s.last || now())) / HOUR);
const upgradeCost = s => Math.round(FB[s.t].price * .9 * Math.pow(1.75, (s.lv || 1) - 1));
function farmShops() { return (G.farm.grid || []).filter(s => FB[s.t] && FB[s.t].cat === "shop"); }
function farmReadyCoins() { return farmShops().reduce((a, s) => a + Math.floor(shopStored(s)), 0); }
function farmCapacity() { return (G.farm.grid || []).reduce((a, s) => a + (FB[s.t] && FB[s.t].cap || 0), 0); }
function farmCount(cat) { return (G.farm.grid || []).filter(s => FB[s.t] && FB[s.t].cat === cat).length; }
function farmCountT(t) { return (G.farm.grid || []).filter(s => s.t === t).length; }

/* set up / migrate */
function farmInit() {
  const F = G.farm;
  if (!F.level || F.grid) return;
  F.rows = F.rows || 10;
  F.grid = [];
  const add = (t, x, y) => F.grid.push({ id: uid(), t, x, y, lv: 1, last: now() });
  add("shed", 0, 0); add("stand", 2, 0); add("hayrack", 4, 0); add("tree", 5, 2);
  const oldPlots = (F.plots || []).length ? F.plots : [{ seed: null }, { seed: null }];
  oldPlots.slice(0, 6).forEach((p, i) => { add("plot", i % 6, 5 + Math.floor(i / 6)); F.grid[F.grid.length - 1].plot = p.seed ? { seed: p.seed, planted: p.planted, ready: p.ready } : null; });
  if (F.level >= 2) add("cottage", 0, 2);
  if (F.level >= 3) add("village", 2, 2);
  if (F.level >= 4) add("palace", 0, 7);
  F.hay = Math.max(F.hay || 0, 12);
  saveSoon();
}
function occupied(F) { const o = {}; (F.grid || []).forEach(s => { const b = FB[s.t] || {}; for (let dx = 0; dx < (b.w || 1); dx++) for (let dy = 0; dy < (b.h || 1); dy++) o[(s.x + dx) + "," + (s.y + dy)] = s; }); return o; }
function canPlace(t, x, y, ignore) {
  const b = FB[t], F = G.farm, occ = occupied(F);
  for (let dx = 0; dx < (b.w || 1); dx++) for (let dy = 0; dy < (b.h || 1); dy++) { const k = (x + dx) + "," + (y + dy); if (x + dx >= FARM_COLS || y + dy >= F.rows || (occ[k] && occ[k] !== ignore)) return false; }
  return true;
}

/* ---------- the farm screen ---------- */
const FUI = { mode: null, t: null, moving: null, tab: "shop" };
PLACE_VIEWS.farm = (el) => {
  if (!G.farm.level) return farmForSale(el);
  farmInit();
  const F = G.farm, herd = farmList();
  const W = Math.min(innerWidth - 24, 600), tile = Math.floor(W / FARM_COLS), H = tile * F.rows;
  const occ = occupied(F);
  const ready = farmReadyCoins();
  const placing = FUI.mode === "place" ? FB[FUI.t] : null, moving = FUI.mode === "move" ? F.grid.find(s => s.id === FUI.moving) : null;
  el.innerHTML = placeHeader("farm") + `<div class="pad farm-pad">
    <div class="farm-bar">
      <span class="fb-chip">🐹 ${herd.length}/${farmCapacity()}</span>
      <span class="fb-chip">🧺 ${F.hay} meals</span>
      <button class="btn small ${ready ? "green" : "white"}" data-collect ${ready ? "" : "disabled"}>💰 Collect ${ready ? fmt(ready * (eventOn("tips") ? 2 : 1)) : ""}</button>
      <button class="btn small pink" data-build>🔨 Build</button>
    </div>
    ${placing ? `<div class="place-banner"><span>Tap a <b>green square</b> to put your ${placing.ico} ${esc(placing.n)} there.</span> <button class="btn small white" data-cancel>Cancel</button></div>` : ""}
    ${moving ? `<div class="place-banner"><span>Tap a <b>green square</b> to move your ${FB[moving.t].ico} ${esc(FB[moving.t].n)}.</span> <button class="btn small white" data-cancel>Cancel</button></div>` : ""}
    <div class="farm-grid" id="fgrid" style="width:${tile * FARM_COLS}px;height:${H}px;--tile:${tile}px">
      ${(placing || moving) ? Array.from({ length: FARM_COLS * F.rows }, (_, i) => { const x = i % FARM_COLS, y = Math.floor(i / FARM_COLS); return canPlace(placing ? FUI.t : moving.t, x, y, moving) ? `<button class="fslot" data-slot="${x},${y}" style="left:${x * tile}px;top:${y * tile}px"></button>` : ""; }).join("") : ""}
      ${F.grid.map(s => structHTML(s, tile)).join("")}
      ${placing || moving ? "" : herd.map((g, i) => `<button class="fherd" data-pet="${g.id}" style="left:${(hashStr(g.id) % (FARM_COLS * tile - tile)) }px;top:${(hashStr(g.id + "y") % (H - tile))}px">${guineaSVG(g, { size: Math.round(tile * .9), mood: mood(g) })}</button>`).join("")}
      ${placing || moving ? "" : farmPoopHTML(tile, H, occ)}
    </div>
    ${undoButtonHTML()}
    ${!herd.length ? `<p class="muted center">No guineas live here yet. Open a guinea and tap "Move to farm", or adopt new ones!</p>` : ""}
    <p class="muted center">Tap anything you built to use it. Tap 💩 to scoop poop (+1 coin, 10 poops = fertilizer).</p>
    ${F.rows < 20 ? `<button class="btn white" data-land>🗺️ Buy more land (+2 rows) ${COIN} ${fmt(landCost())}</button>` : ""}
  </div>`;
  wireCommon(el);
  // guineas wander around the farm
  const iv = setInterval(() => { $$(".fherd", el).forEach(b => { if (Math.random() < .35) { b.style.left = Math.random() * (FARM_COLS * tile - tile) + "px"; b.style.top = Math.random() * (H - tile) + "px"; const s = b.querySelector("svg"); if (s) { s.classList.add("walking"); setTimeout(() => s.classList.remove("walking"), 1800); } } }); const rc = farmReadyCoins(); $$(".coin-bubble", el).forEach(cb => { const s = F.grid.find(x => x.id === cb.dataset.s); if (s) cb.textContent = "💰" + Math.floor(shopStored(s)); }); }, 2200);
  $$("[data-pet]", el).forEach(b => b.onclick = () => { play("wheek"); go("pet/" + b.dataset.pet); });
  $("[data-build]", el).onclick = () => { play("click"); buildSheet(); };
  const c = $("[data-cancel]", el); if (c) c.onclick = () => { FUI.mode = null; play("click"); render(); };
  const col = $("[data-collect]", el); if (col) col.onclick = () => collectAll(col);
  const land = $("[data-land]", el); if (land) land.onclick = () => { const lc = Math.round(landCost()); if (!spendCoins(lc)) return; F.rows += 2; recordBuy({ type: "land", price: lc, name: "More farm land" }); play("fanfare"); toast("More land! Two new rows to build on.", "🗺️"); render(); };
  $$("[data-slot]", el).forEach(b => b.onclick = () => placeAt(...b.dataset.slot.split(",").map(Number)));
  $$("[data-s]", el).forEach(b => b.onclick = e => { e.stopPropagation(); if (FUI.mode) return; structTap(F.grid.find(s => s.id === b.dataset.s), b); });
  $$("[data-poop]", el).forEach(b => b.onclick = () => scoopPoop(b));
  wireUndo(el);
  return () => clearInterval(iv);
};
const landCost = () => 600 * Math.pow(1.6, (G.farm.rows - 10) / 2);
function structHTML(s, tile) {
  const b = FB[s.t]; if (!b) return "";
  const w = (b.w || 1) * tile, h = (b.h || 1) * tile;
  let inner = `<span class="fs-ico" style="font-size:${Math.round(Math.min(w, h) * .62)}px">${b.ico}</span>`, extra = "";
  if (b.cat === "shop") { const st = Math.floor(shopStored(s)); extra = `<span class="fs-lv">Lv${s.lv || 1}</span>${st >= 1 ? `<span class="coin-bubble ${st >= shopRate(s) * shopCapH(s) - 1 ? "full" : ""}" data-s="${s.id}">💰${st}</span>` : ""}`; }
  if (s.t === "plot") {
    const p = s.plot;
    if (!p) inner = `<span class="fs-soil"></span><span class="fs-plus">+</span>`;
    else { const it = ITEM[p.seed], ready = now() >= p.ready, pct = ready ? 100 : Math.round((now() - p.planted) / (p.ready - p.planted) * 100); const crop = it.yields[0] === "magic" ? "🫘" : ITEM[it.yields[0]].ico; inner = `<span class="fs-soil"></span><span class="fs-crop" style="font-size:${Math.round(tile * (.28 + pct / 280))}px">${ready ? crop : "🌱"}</span>${ready ? `<span class="coin-bubble ready">✋</span>` : `<i class="fs-bar" style="width:${pct}%"></i>`}`; }
  }
  if (b.cap) extra += `<span class="fs-lv">🐹${b.cap}</span>`;
  return `<button class="fstruct c-${b.cat} ${s.t === "plot" && s.plot && now() >= s.plot.ready ? "ready" : ""}" data-s="${s.id}" style="left:${s.x * tile}px;top:${s.y * tile}px;width:${w}px;height:${h}px" aria-label="${esc(b.n)}">${inner}${extra}</button>`;
}
function farmPoopHTML(tile, H, occ) {
  const poops = farmList().flatMap(g => Array.from({ length: g.poop || 0 }, () => g.id)).slice(0, 30);
  const free = []; for (let y = 0; y < G.farm.rows; y++) for (let x = 0; x < FARM_COLS; x++) if (!occ[x + "," + y]) free.push([x, y]);
  if (!free.length) return "";
  // each poop gets its own spot: spread across free tiles, up to 4 per tile in the corners
  const order = free.map((f, i) => [f, hashStr("t" + i) % 997]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
  const half = tile / 2;
  const goldIds = new Set(farmList().filter(g => hasPower(g, "goldpoop")).map(g => g.id));
  return poops.slice(0, order.length * 4).map((id, k) => { const [x, y] = order[k % order.length], c = Math.floor(k / order.length); return `<button class="poop${goldIds.has(id) ? " gold" : ""}" data-poop="${id}" style="left:${x * tile + (c % 2) * half + 2}px;top:${y * tile + Math.floor(c / 2) * half + 2}px;width:${half - 4}px;height:${half - 4}px">💩</button>`; }).join("");
}
function scoopPoop(b) {
  const g = G.guineas.find(x => x.id === b.dataset.poop); if (!g || !g.poop) return;
  g.poop--; G.stats.poop++; G.farm.poopN = (G.farm.poopN || 0) + 1; questProgress("poop");
  const [x, y] = centerOf(b); play("splat"); b.remove();
  if (hasPower(g, "goldpoop")) { addCoins(10, [x, y]); floatText(x, y - 20, "Golden poop! +10", "#e0a800", 18); play("coin"); }
  else if (Math.random() < .01) { addCoins(50, [x, y]); toast("A GOLDEN POOP! +50 coins!", "✨"); play("bigwin"); } else addCoins(1, [x, y]);
  if (G.farm.poopN >= 10) { G.farm.poopN -= 10; addItem("fertilizer", 1); toast("10 poops = 1 Poop Fertilizer!", "💩"); }
  saveSoon(); checkAchievements();
}
function collectAll(btn) {
  let total = 0; const mult = eventOn("tips") ? 2 : 1;
  farmShops().forEach(s => { const c = Math.floor(shopStored(s)); if (c > 0) { total += c; s.last = now(); } });
  if (!total) return;
  addCoins(total * mult, btn); play("bigwin"); confetti(...centerOf(btn), 40); questProgress("collect");
  if (mult > 1) toast("Big Tips Hour! Double coins!", "💰");
  saveSoon(); setTimeout(render, 400);
}
function farmForSale(el) {
  el.innerHTML = placeHeader("farm") + `<div class="pad">
    ${npcBox("hayley", "This farm is up for sale! Build it however you like: homes for lots of guineas, play areas, gardens, and shops that make money even while you sleep!")}
    <div class="deed card"><div class="big-emoji">📜🌾</div><h2>Farm For Sale!</h2>
    <ul class="perks"><li>🛖 A <b>Starter Shed</b> for 4 guineas (build more homes for up to 100!)</li><li>🥕 A free <b>Veggie Stand</b> that earns coins every hour</li><li>💰 Build <b>shops</b> that make money while you're away</li><li>🛝 Slides, tunnels, ponds, trees and more to place</li><li>🌱 <b>Garden plots</b> to grow free food</li><li>💩 Farm guineas make poop you can sell. Yes really.</li></ul>
    <div class="price-big">${COIN} ${fmt(FARM_PRICE)}</div>
    <div class="progress"><i style="width:${Math.min(100, G.coins / FARM_PRICE * 100)}%"></i><span>${fmt(Math.min(G.coins, FARM_PRICE))} / ${fmt(FARM_PRICE)}</span></div>
    <button class="btn green big" data-buyfarm ${G.coins < FARM_PRICE ? "disabled" : ""}>Buy the Farm!</button>
    ${G.coins < FARM_PRICE ? `<p class="muted">Play games at the Arcade and Fun Fair to save up!</p>` : ""}</div></div>`;
  wireCommon(el);
  $("[data-buyfarm]", el).onclick = () => { if (!spendCoins(FARM_PRICE)) return; G.farm.level = 1; farmInit(); recordBuy({ type: "farm", price: FARM_PRICE, builtAt: G.stats.built || 0, name: "Guinea Farm" }); play("fanfare"); confetti(innerWidth / 2, innerHeight / 2, 150); addXP(100); checkAchievements(); toast("You bought the Guinea Farm! Tap 🔨 Build to add more.", "🌾"); render(); };
}

/* ---------- building ---------- */
function buildSheet() {
  const m = openModal(`<h2>🔨 Build</h2><p class="muted center">Pick something, then tap where it goes on your farm.</p>
    <div class="tabs scroll" id="fbTabs">${FB_TABS.map(([k, n]) => `<button class="tab ${FUI.tab === k ? "on" : ""}" data-fbt="${k}">${n}</button>`).join("")}</div><div id="fbList"></div>`, { cls: "build-modal" });
  const draw = () => {
    $$("[data-fbt]", m.el).forEach(b => b.classList.toggle("on", b.dataset.fbt === FUI.tab));
    const list = Object.entries(FB).filter(([k, b]) => b.cat === FUI.tab && b.price > 0);
    $("#fbList", m.el).innerHTML = `${FUI.tab === "shop" ? `<p class="muted center">Shops earn coins every hour, even when you're not playing. Come back and collect! Upgrade them to earn more.</p>` : FUI.tab === "fun" ? `<p class="muted center">Play gear keeps farm guineas happy for longer (${Math.min(5, farmCount("fun"))}/5 working).</p>` : ""}<div class="pick-list">${list.map(([k, b]) => `<button class="pick" data-fb="${k}"><span class="ii">${b.ico}</span><span><b>${esc(b.n)}</b><small>${esc(b.d || "Makes your farm prettier!")}${b.rate ? ` Earns ${b.perGuinea ? b.rate + " per guinea" : b.rate} coins/hour.` : ""}${b.w ? " (big: 2x2)" : ""}${farmCountT(k) ? ` You have ${farmCountT(k)}.` : ""}</small></span><span class="pk-r">${COIN}${fmt(b.price)}</span></button>`).join("")}</div>`;
    $$("[data-fb]", m.el).forEach(b => b.onclick = () => { const t = b.dataset.fb; if (G.coins < FB[t].price) { play("buzz"); toast("Not enough coins yet!", "🪙"); return; } FUI.mode = "place"; FUI.t = t; play("click"); m.close(); setTimeout(() => { render(); const g = $("#fgrid"); if (g) g.scrollIntoView({ block: "center" }); }, 250); });
  };
  $$("[data-fbt]", m.el).forEach(b => b.onclick = () => { FUI.tab = b.dataset.fbt; play("click"); draw(); });
  draw();
}
function placeAt(x, y) {
  const F = G.farm;
  if (FUI.mode === "move") { const s = F.grid.find(q => q.id === FUI.moving); if (s && canPlace(s.t, x, y, s)) { s.x = x; s.y = y; play("pop"); } FUI.mode = null; saveSoon(); render(); return; }
  const t = FUI.t, b = FB[t]; if (!b || !canPlace(t, x, y)) return;
  if (!spendCoins(b.price)) { FUI.mode = null; render(); return; }
  const nid = uid(); F.grid.push({ id: nid, t, x, y, lv: 1, last: now() });
  if (t === "hayrack") F.hay = (F.hay || 0) + 10;
  G.stats.built = (G.stats.built || 0) + 1; recordBuy({ type: "build", uid: nid, price: b.price, name: b.n }); questProgress("build"); addXP(10);
  play("fanfare"); haptic(20);
  FUI.mode = null; saveSoon(); checkAchievements(); render();
  setTimeout(() => { const el = $(`.fstruct[data-s="${F.grid[F.grid.length - 1].id}"]`); if (el) { el.classList.add("built"); confetti(...centerOf(el), 40); } }, 60);
  toast(`${b.n} built!${b.cat === "shop" ? " It earns coins every hour. Come back to collect!" : ""}`, b.ico);
}
function structTap(s, btn) {
  if (!s) return; const b = FB[s.t], F = G.farm;
  if (s.t === "plot") return plotTap(s, btn);
  let body = `<div class="center"><div class="big-emoji">${b.ico}</div><h2>${esc(b.n)}</h2><p class="mtext">${esc(b.d || "A lovely decoration.")}</p>`;
  if (b.cat === "shop") {
    const lv = s.lv || 1, st = Math.floor(shopStored(s));
    body += `<div class="card note shop-info"><div>Level <b>${lv}</b>/5 · earns <b>${fmt(shopRate(s))}</b> coins/hour</div><div>Holds up to ${shopCapH(s)} hours of coins (${fmt(shopRate(s) * shopCapH(s))}). Ready now: <b>${fmt(st)}</b></div>${b.perGuinea ? `<div>Farm guineas: ${farmList().length}</div>` : ""}</div>
      <div class="mrow"><button class="btn green" data-col ${st ? "" : "disabled"}>💰 Collect ${fmt(st * (eventOn("tips") ? 2 : 1))}</button>${lv < 5 ? `<button class="btn pink" data-up>⬆️ Upgrade ${COIN}${fmt(upgradeCost(s))}</button>` : `<span class="muted">Max level!</span>`}</div>
      ${lv < 5 ? `<p class="muted">Upgrading makes it earn ${fmt(shopRate({ t: s.t, lv: lv + 1 }) - shopRate(s))} more per hour and hold 2 more hours.</p>` : ""}`;
  }
  if (b.cap) body += `<p class="muted">Room for ${b.cap} guineas. Farm total: ${farmList().length}/${farmCapacity()}.</p>`;
  if (s.t === "hayrack") body += `<p class="mtext">🧺 ${F.hay} meals stored.</p><div class="mrow"><button class="btn green" data-hay>${has("haybale") ? `Add hay bale (${G.inv.haybale})` : `Buy hay bale ${COIN}${price(ITEM.haybale)}`}</button></div>`;
  body += `<div class="mrow">${b.noSell ? "" : `<button class="btn white small" data-move>↔️ Move</button><button class="btn white small" data-sell>Sell (+${fmt(Math.round(b.price * .5))})</button>`}<button class="btn white small" data-ok>Close</button></div></div>`;
  const m = openModal(body);
  $("[data-ok]", m.el).onclick = () => m.close();
  const col = $("[data-col]", m.el); if (col) col.onclick = () => { const st = Math.floor(shopStored(s)); if (!st) return; s.last = now(); addCoins(st * (eventOn("tips") ? 2 : 1), col); play("win"); questProgress("collect"); saveSoon(); m.close(); setTimeout(render, 300); };
  const up = $("[data-up]", m.el); if (up) up.onclick = () => { const c = upgradeCost(s); if (!spendCoins(c)) return; const st = Math.floor(shopStored(s)); if (st) addCoins(st); s.last = now(); s.lv = (s.lv || 1) + 1; recordBuy({ type: "upgrade", uid: s.id, price: c, name: b.n + " upgrade" }); play("levelup"); confetti(...centerOf(up), 50); toast(`${b.n} is now level ${s.lv}!`, "⬆️"); addXP(15); saveSoon(); m.close(); setTimeout(render, 300); };
  const hay = $("[data-hay]", m.el); if (hay) hay.onclick = () => { if (!has("haybale")) { if (!spendCoins(price(ITEM.haybale))) return; addItem("haybale", 1); } if (F.hay >= 30 * Math.max(1, farmCountT("hayrack"))) { toast("The hay rack is full!", "🧺"); return; } addItem("haybale", -1); F.hay += ITEM.haybale.hay; play("crunch"); saveSoon(); m.close(); render(); };
  const mv = $("[data-move]", m.el); if (mv) mv.onclick = () => { FUI.mode = "move"; FUI.moving = s.id; m.close(); setTimeout(render, 250); };
  const sl = $("[data-sell]", m.el); if (sl) sl.onclick = async () => {
    if (b.cap && farmCapacity() - b.cap < farmList().length) { play("buzz"); toast("Guineas live there! Build another home first or move them out.", "🏠"); return; }
    m.close(); if (!(await confirmBox(`Sell ${esc(b.n)}?`, `You'll get ${fmt(Math.round(b.price * .5))} coins back.`, "Sell", "Keep"))) return;
    if (b.cat === "shop") { const st = Math.floor(shopStored(s)); if (st) addCoins(st); }
    F.grid = F.grid.filter(q => q !== s); addCoins(Math.round(b.price * .5)); play("coin"); saveSoon(); render();
  };
}
function plotTap(s, btn) {
  const p = s.plot;
  if (p && now() >= p.ready) {
    const it = ITEM[p.seed]; const [what, n] = it.yields; let out;
    if (what === "magic") { const r = weighted([{ k: "gold", w: 25 }, { k: "rainbow", w: 25 }, { k: "coins", w: 35 }, { k: "youth", w: 3 }, { k: "sq", w: 12 }]).k; out = r === "gold" ? { item: "goldlettuce", n: 2 } : r === "rainbow" ? { item: "rainbowcarrot", n: 3 } : r === "coins" ? { coins: rint(100, 400) } : r === "youth" ? { item: "youth", n: 1 } : { squishy: rollSquishy().id }; }
    else out = { item: what, n: n + (Math.random() < .2 ? 1 : 0) };
    grant(out); s.plot = null; G.stats.harvest++; questProgress("harvest"); addXP(5);
    const [x, y] = centerOf(btn); play("win"); confetti(x, y, 30);
    floatText(x, y - 20, out.coins ? `+${out.coins} coins` : out.squishy ? "A squishy!" : `+${out.n} ${ITEM[out.item].name}`, "#2f7d14", 20); if (out.coins) coinRain(x, y, 10);
    saveSoon(); setTimeout(render, 450); return;
  }
  if (p) {
    if (has("fertilizer")) { addItem("fertilizer", -1); p.ready = now(); play("sparkle"); toast("Poop power! It grew instantly!", "💩"); saveSoon(); render(); }
    else { play("buzz"); toast(`Still growing: ${dur(p.ready - now())} to go. Poop Fertilizer makes it instant!`, "🌱"); }
    return;
  }
  const seeds = ITEMS.filter(q => q.cat === "seed");
  const m = openModal(`<h2>Plant something</h2><div class="pick-list">${seeds.map(q => `<button class="pick" data-seed="${q.id}"><span class="ii">${q.yields[0] === "magic" ? "🫘" : ITEM[q.yields[0]].ico}</span><span><b>${esc(q.name)}</b><small>${esc(q.desc)}</small></span><span class="pk-r">${has(q.id) ? `x${G.inv[q.id]}` : `${COIN}${price(q)}`}</span></button>`).join("")}</div>`);
  $$("[data-seed]", m.el).forEach(b => b.onclick = () => {
    const q = ITEM[b.dataset.seed];
    if (!has(q.id)) { if (!spendCoins(price(q))) return; addItem(q.id, 1); }
    addItem(q.id, -1); s.plot = { seed: q.id, planted: now(), ready: now() + q.grow * MIN }; play("pop"); saveSoon(); m.close(); render();
  });
}
