/* Wheek World: the map, places, shops, farm, vet, meadow, post office, carnival extras, game host. */
"use strict";

const PLACES = {
  meadow: { name: "Rainbow Meadow", ico: "🌈", x: 22, y: 7, color: "#ffd1ec", npc: "butterfly", blurb: "Where loved guineas rest" },
  vet: { name: "Vet Clinic", ico: "🏥", x: 77, y: 8, color: "#d9f3ff", npc: "hoot", blurb: "Get well soon!" },
  squeakmart: { name: "Squeakmart", ico: "🛒", x: 22, y: 20, color: "#ffe9b3", npc: "nibbles", shop: true, blurb: "Food, care & toys" },
  boutique: { name: "Fluff Boutique", ico: "🎀", x: 78, y: 20, color: "#ffd6ec", npc: "fernando", shop: true, blurb: "Hats, outfits & decor" },
  boxes: { name: "Squishy Shop", ico: "🍡", x: 20, y: 36, color: "#e8dcff", npc: "gus", shop: true, blurb: "Collect all 32!" },
  post: { name: "Post Office", ico: "📮", x: 79, y: 36, color: "#ffe1e6", npc: "pidge", blurb: "Packages every hour" },
  home: { name: "My Hutch", ico: "🏠", x: 22, y: 49, color: "#fff1d6", blurb: "Home sweet home" },
  adopt: { name: "Adoption Center", ico: "🐹", x: 77, y: 48, color: "#e4fbd5", npc: "clover", blurb: "Find new guinea friends" },
  farm: { name: "Guinea Farm", ico: "🌾", x: 50, y: 61, color: "#fff3c4", npc: "hayley", blurb: "Grow your herd!" },
  arcade: { name: "Arcade Burrow", ico: "🕹️", x: 22, y: 75, color: "#dcd6ff", npc: "pixel", blurb: "Skill games" },
  carnival: { name: "Fun Fair", ico: "🎪", x: 77, y: 74, color: "#ffe1d0", npc: "skunk", blurb: "Skill games" },
  swamp: { name: "Stinky Swamp", ico: "🐸", x: 24, y: 90, color: "#d7ecc0", npc: "swampy", blurb: "Gross treasure" },
  lab: { name: "Slime Lab", ico: "🧪", x: 76, y: 90, color: "#d6ffe4", npc: "gloop", blurb: "Make & sell slime" },
};

/* ---------- MAP ---------- */
function mapSVG() {
  const H = 1180;
  const bld = (x, y, w, h, wall, roof, kind) => {
    const X = x - w / 2, Y = y - h;
    let r = "";
    if (kind === "tent") r = `<path d="M${X - 6} ${Y + 10}L${x} ${Y - h * .55}L${X + w + 6} ${Y + 10}Z" fill="${roof}" stroke="#2b1640" stroke-width="4" stroke-linejoin="round"/><path d="M${x} ${Y - h * .55}L${x - w * .18} ${Y + 10}M${x} ${Y - h * .55}L${x + w * .18} ${Y + 10}" stroke="#fff" stroke-width="5"/><path d="M${x} ${Y - h * .55}v-16l14 6-14 6" fill="#ffd84d" stroke="#2b1640" stroke-width="2.5"/>`;
    else if (kind === "dome") r = `<path d="M${X - 4} ${Y + 8}C${X} ${Y - h * .7} ${X + w} ${Y - h * .7} ${X + w + 4} ${Y + 8}Z" fill="${roof}" stroke="#2b1640" stroke-width="4"/><circle cx="${x}" cy="${Y - h * .38}" r="6" fill="#fff" stroke="#2b1640" stroke-width="2.5"/>`;
    else if (kind === "barn") r = `<path d="M${X - 8} ${Y + 8}L${X + w * .2} ${Y - h * .35}L${X + w * .8} ${Y - h * .35}L${X + w + 8} ${Y + 8}Z" fill="${roof}" stroke="#2b1640" stroke-width="4" stroke-linejoin="round"/>`;
    else r = `<path d="M${X - 8} ${Y + 8}L${x} ${Y - h * .45}L${X + w + 8} ${Y + 8}Z" fill="${roof}" stroke="#2b1640" stroke-width="4" stroke-linejoin="round"/>`;
    const door = `<path d="M${x - 9} ${y}v-18a9 9 0 0 1 18 0v18Z" fill="#8a5a3c" stroke="#2b1640" stroke-width="3"/>`;
    const win = kind === "tent" ? "" : `<rect x="${X + 8}" y="${Y + 14}" width="14" height="12" rx="3" fill="#bfefff" stroke="#2b1640" stroke-width="2.5"/><rect x="${X + w - 22}" y="${Y + 14}" width="14" height="12" rx="3" fill="#bfefff" stroke="#2b1640" stroke-width="2.5"/>`;
    return `<g><ellipse cx="${x}" cy="${y + 2}" rx="${w * .65}" ry="8" fill="#2b1640" opacity=".15"/><rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="6" fill="${wall}" stroke="#2b1640" stroke-width="4"/>${r}${win}${door}</g>`;
  };
  const P = PLACES, px = p => p.x * 4, py = p => p.y / 100 * H;
  const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="18" fill="#8a5a3c" stroke="#2b1640" stroke-width="2.5"/><circle cx="0" cy="-18" r="17" fill="#5cc24a" stroke="#2b1640" stroke-width="3"/><circle cx="-6" cy="-24" r="5" fill="#8fe070"/></g>`;
  const flower = (x, y, c) => `<g transform="translate(${x} ${y})"><circle r="3.5" fill="${c}"/><circle r="1.5" fill="#fff3a8"/></g>`;
  const r = mulberry(42);
  let trees = ""; for (let i = 0; i < 26; i++) { const x = r() < .5 ? 14 + r() * 50 : 336 + r() * 50, y = 60 + r() * 1050; trees += tree(x, y, .6 + r() * .5); }
  let flowers = ""; for (let i = 0; i < 70; i++) flowers += flower(20 + r() * 360, 20 + r() * 1140, pick(["#ff8fc7", "#ffd84d", "#c7b3ff", "#fff", "#5fd3ff"]));
  const road = [P.meadow, P.vet, P.squeakmart, P.boutique, P.boxes, P.post, P.home, P.adopt, P.farm, P.arcade, P.carnival, P.swamp, P.lab];
  const order = [P.meadow, P.squeakmart, P.boxes, P.home, P.arcade, P.swamp];
  const order2 = [P.vet, P.boutique, P.post, P.adopt, P.carnival, P.lab];
  const curve = arr => arr.map((p, i) => (i ? "L" : "M") + px(p) + " " + (py(p) + 18)).join("");
  return `<svg class="map-svg" viewBox="0 0 400 ${H}" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
    <defs>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe3ff"/><stop offset="1" stop-color="#5fc8f0"/></linearGradient>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8f5a0"/><stop offset=".5" stop-color="#a6e57a"/><stop offset="1" stop-color="#93d46a"/></linearGradient>
      <radialGradient id="swampG" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#8fbf4a"/><stop offset="1" stop-color="#5a7f2a"/></radialGradient>
    </defs>
    <rect width="400" height="${H}" fill="url(#sea)"/>
    ${Array.from({ length: 16 }, (_, i) => `<path class="wave" style="animation-delay:${(i % 4) * .6}s" d="M${(i * 53) % 380} ${60 + i * 70}q8 -6 16 0q8 6 16 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>`).join("")}
    <path d="M40 30C120 0 300 0 370 34C400 120 392 300 384 520C392 760 396 980 372 1130C300 1176 110 1178 30 1140C6 980 12 760 18 520C8 300 4 110 40 30Z" fill="url(#grass)" stroke="#2b1640" stroke-width="5"/>
    <path d="M40 30C120 0 300 0 370 34C400 120 392 300 384 520C392 760 396 980 372 1130C300 1176 110 1178 30 1140C6 980 12 760 18 520C8 300 4 110 40 30Z" fill="none" stroke="#fff7c4" stroke-width="10" opacity=".6" transform="translate(0 6)"/>
    <path d="M30 20C80 4 140 6 190 30C150 110 70 130 26 120Z" fill="#ffe8f6" opacity=".8"/>
    ${["#ff5a5f", "#ff9f43", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"].map((c, i) => `<path d="M${20 + i * 6} 140A${70 - i * 6} ${70 - i * 6} 0 0 1 ${160 - i * 6} 140" stroke="${c}" stroke-width="6" fill="none" opacity=".75"/>`).join("")}
    <circle cx="200" cy="${py({ y: 29 }) + 6}" r="70" fill="#efe3c8" stroke="#2b1640" stroke-width="4" opacity=".9"/>
    <circle cx="200" cy="${py({ y: 29 }) + 6}" r="54" fill="none" stroke="#d8c8a0" stroke-width="3" stroke-dasharray="8 8"/>
    <path d="${curve(order)}" stroke="#f2deb0" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${curve(order2)}" stroke="#f2deb0" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${road.map(p => `<path d="M200 ${py(P.farm) - 30}L${px(p)} ${py(p) + 18}" stroke="#f2deb0" stroke-width="14" fill="none" stroke-linecap="round" opacity="${[P.home, P.adopt, P.arcade, P.carnival].includes(p) ? 1 : 0}"/>`).join("")}
    <path d="M200 ${py({ y: 29 }) + 70}V${py(P.farm) - 40}" stroke="#f2deb0" stroke-width="18" stroke-linecap="round"/>
    <g opacity=".95">${Array.from({ length: 6 }, (_, i) => `<rect x="${112 + i * 30}" y="${py(P.farm) - 20}" width="24" height="90" rx="6" fill="${i % 2 ? "#c9a35a" : "#7cc04a"}" stroke="#2b1640" stroke-width="2.5"/>`).join("")}</g>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${104 + i * 26}" y="${py(P.farm) + 74}" width="6" height="22" fill="#fff" stroke="#2b1640" stroke-width="2"/>`).join("")}<path d="M104 ${py(P.farm) + 80}H294M104 ${py(P.farm) + 90}H294" stroke="#fff" stroke-width="3"/>
    <ellipse cx="110" cy="1080" rx="100" ry="70" fill="url(#swampG)" stroke="#2b1640" stroke-width="4"/>
    ${Array.from({ length: 7 }, (_, i) => `<circle class="bubble-swamp" style="animation-delay:${i * .5}s" cx="${50 + i * 18}" cy="${1060 + (i % 3) * 18}" r="${3 + (i % 3) * 2}" fill="#c8f08e" stroke="#2b1640" stroke-width="1.5"/>`).join("")}
    <path d="M60 1040q6 -20 2 -36M70 1044q10 -16 14 -34M150 1110q4 -20 -2 -34" stroke="#3f6a1a" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${flowers}${trees}
    ${bld(px(P.meadow) + 30, py(P.meadow) + 20, 0, 0, "#fff", "#fff", "none").replace(/<rect[^>]*\/>/, "")}
    ${bld(px(P.vet), py(P.vet) + 18, 70, 44, "#fff", "#5fd3ff", "dome")}<path d="M${px(P.vet) - 6} ${py(P.vet) - 40}h12M${px(P.vet)} ${py(P.vet) - 46}v12" stroke="#ff5a5f" stroke-width="5"/>
    ${bld(px(P.squeakmart), py(P.squeakmart) + 18, 78, 46, "#fff6d6", "#ff9f43")}
    ${bld(px(P.boutique), py(P.boutique) + 18, 72, 46, "#fff0f8", "#ff8fc7")}
    ${bld(px(P.boxes), py(P.boxes) + 18, 70, 44, "#f3edff", "#a98bff")}
    ${bld(px(P.post), py(P.post) + 18, 66, 44, "#ffecef", "#ff5a5f")}
    ${bld(px(P.home), py(P.home) + 18, 74, 46, "#fff1d6", "#c8693a")}
    ${bld(px(P.adopt), py(P.adopt) + 18, 76, 46, "#ecffe0", "#7be04a")}
    ${bld(px(P.farm), py(P.farm) - 14, 70, 50, "#ff6b5b", "#c8392b", "barn")}<path d="M${px(P.farm) - 14} ${py(P.farm) - 14}v-20h28v20" fill="none" stroke="#fff" stroke-width="3"/>
    ${bld(px(P.arcade), py(P.arcade) + 18, 74, 46, "#2d2a4a", "#5fd3ff", "dome")}
    ${bld(px(P.carnival), py(P.carnival) + 18, 80, 40, "#ffe0d0", "#ff5a5f", "tent")}
    ${bld(px(P.lab), py(P.lab) + 18, 72, 46, "#e6fff0", "#3fd6b0", "dome")}
    <g transform="translate(200 ${py({ y: 29 }) + 6})"><circle r="26" fill="#bfefff" stroke="#2b1640" stroke-width="4"/><circle r="16" fill="#5fd3ff"/><path class="fountain" d="M0 -6q-10 -24 -20 -6M0 -6q10 -24 20 -6M0 -6v-26" stroke="#bfefff" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="cloud c1"><ellipse cx="80" cy="200" rx="36" ry="14" fill="#fff" opacity=".85"/><ellipse cx="100" cy="190" rx="22" ry="14" fill="#fff" opacity=".85"/></g>
    <g class="cloud c2"><ellipse cx="300" cy="620" rx="40" ry="15" fill="#fff" opacity=".8"/><ellipse cx="318" cy="608" rx="22" ry="14" fill="#fff" opacity=".8"/></g>
    <g class="balloon"><text x="0" y="0" font-size="34">🎈</text></g>
  </svg>`;
}
function placeBadge(id) {
  if (id === "post" && G.packages.length) return G.packages.length;
  if (id === "vet") { const n = G.guineas.filter(g => g.sick).length; return n ? "🤒" : ""; }
  if (id === "farm") { if (!G.farm.level || !G.farm.grid) return ""; const p = farmPoops(), r = G.farm.grid.filter(s => s.plot && now() >= s.plot.ready).length; if (farmReadyCoins() >= 20) return "💰"; return r ? "🥬" : p >= 5 ? "💩" : ""; }
  if (id === "adopt" && G.nursery.length) return G.nursery.length;
  if (id === "home" && G.guineas.some(g => g.home === "hutch" && g.food < 30)) return "!";
  if (id === "lab" && eventOn("slimetide")) return "x2";
  return "";
}
VIEWS.map = (el) => {
  tutMark("map");
  const ev = currentEvent();
  const g = activeG();
  const pos = PLACES[G.flags.mapAt] || PLACES.home;
  el.innerHTML = `
    <div class="ticker"><div class="tk-in"><b>📰 WHEEK GAZETTE:</b> ${shuffle(NEWS).slice(0, 5).map(esc).join(" ✦ ")} ✦ ${esc(g.name.toUpperCase())} DECLARED "VERY GOOD GUINEA" BY EVERYONE</div></div>
    <div class="map-wrap" id="mapWrap">
      ${mapSVG()}
      ${Object.entries(PLACES).map(([id, p]) => { const b = placeBadge(id); return `<button class="lm" data-place="${id}" style="left:${p.x}%;top:${p.y}%;--lc:${p.color}"><span class="lm-ico">${p.ico}</span><span class="lm-name">${esc(p.name)}</span>${b !== "" ? `<span class="badge">${b}</span>` : ""}</button>`; }).join("")}
      ${ev.id === "merchant" ? `<button class="lm merchant" data-go="shop/merchant" style="left:50%;top:41%;--lc:#e8dcff"><span class="lm-ico">🧙‍♂️</span><span class="lm-name">Wandering Merchant</span><span class="badge">1h</span></button>` : ""}
      <div class="me" id="me" style="left:${pos.x}%;top:calc(${pos.y}% + 34px)">${guineaSVG(g, { size: 58, mood: "happy" })}</div>
    </div>`;
  const wrap = $("#mapWrap", el), me = $("#me", el);
  $$("[data-place]", el).forEach(b => b.onclick = () => walkTo(b.dataset.place, b));
  $$("[data-go]", el).forEach(b => b.onclick = () => { play("click"); go(b.dataset.go); });
  // keep current spot in view
  setTimeout(() => { const r = me.getBoundingClientRect(); if (r.top > innerHeight * .7 || r.top < 80) scrollTo({ top: r.top + scrollY - innerHeight / 2, behavior: "auto" }); }, 30);
  function walkTo(id, btn) {
    const p = PLACES[id]; play("jump"); haptic(10);
    me.classList.add("walking"); me.style.left = p.x + "%"; me.style.top = `calc(${p.y}% + 34px)`;
    G.flags.mapAt = id; saveSoon();
    setTimeout(() => { me.classList.remove("walking"); play("wheek"); go(id === "home" ? "home" : PLACES[id].shop ? "shop/" + id : "place/" + id); }, reduceMotion ? 50 : 650);
  }
  // squishy rain
  let rainIv = 0;
  if (ev.id === "squishyrain") {
    const h = hourIdx(); G.rainTaps = G.rainTaps && G.rainTaps.h === h ? G.rainTaps : { h, n: 0 };
    rainIv = setInterval(() => {
      if (G.rainTaps.n >= 25) return;
      const s = pick(SQUISHIES.filter(x => x.r !== "legendary"));
      const d = document.createElement("button"); d.className = "rain-sq"; d.innerHTML = squishySVG(s);
      d.style.left = (5 + Math.random() * 80) + "%"; d.style.top = (scrollY + 40) + "px"; d.style.animationDuration = (5 + Math.random() * 3) + "s";
      d.onpointerdown = e => { e.stopPropagation(); if (d._got) return; d._got = 1; G.rainTaps.n++; play("squish"); const [x, y] = centerOf(d); confetti(x, y, 12, false); addCoins(rint(4, 12), [x, y]); if (Math.random() < .04) { const sq = rollSquishy(); grant({ squishy: sq.id }); toast(`You caught a ${sq.name}!`, "🍡"); } d.remove(); };
      wrap.appendChild(d); setTimeout(() => d.remove(), 9000);
    }, 1400);
  }
  return () => clearInterval(rainIv);
};

/* ---------- generic place page ---------- */
function placeHeader(id, extra = "") {
  const p = PLACES[id] || { name: "Wandering Merchant", ico: "🧙‍♂️", color: "#e8dcff" };
  return `<header class="place-hd" style="--pc:${p.color}"><button class="back" data-back aria-label="Back to map">◀ Map</button><span class="ph-ico">${p.ico}</span><h1>${esc(p.name)}</h1>${extra}</header>`;
}
function wireCommon(el) {
  $$("[data-back]", el).forEach(b => b.onclick = () => { play("click"); go("map"); });
  $$("[data-go]", el).forEach(b => b.onclick = () => { play("click"); go(b.dataset.go); });
}
VIEWS.place = (el, id) => {
  const fn = PLACE_VIEWS[id]; if (!fn) { go("map"); return; }
  return fn(el);
};
const PLACE_VIEWS = {};

/* ---------- SHOPS ---------- */
const SHOPS = {
  squeakmart: { npc: "nibbles", tabs: [["food", "Food"], ["care", "Care"], ["toy", "Toys"], ["love", "Love"], ["farm", "Farm"], ["sell", "Sell"]] },
  boutique: { npc: "fernando", tabs: [["hat", "Hats"], ["face", "Face"], ["neck", "Neck"], ["back", "Back"], ["feet", "Feet"], ["salon", "Salon"], ["decor", "Furniture"], ["walldecor", "Wall art"], ["rug", "Rugs"], ["wall", "Wallpaper"], ["floor", "Floors"]] },
  boxes: { npc: "gus", tabs: [["common", "Common"], ["rare", "Rare"], ["legendary", "Legendary"]] },
  merchant: { npc: "merchant", tabs: [["rare", "Rare Wares"]] },
};
const MERCHANT = [["youth", 1200], ["mango", 180], ["goldlettuce", 150], ["unicornhorn", 900], ["d_ufo", 1200], ["rainbowcarrot", 80], ["halo", 280], ["vitc", 60]];
const shopTab = {};
function shopItems(shop, tab) {
  if (shop === "squeakmart") {
    if (tab === "farm") return ITEMS.filter(i => (i.cat === "farm" && i.price > 0) || i.cat === "seed" || i.cat === "slime");
    return ITEMS.filter(i => i.cat === tab && i.price > 0 && !i.rare);
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
  if (shop === "merchant") return MERCHANT.map(([id, p]) => Object.assign({}, ITEM[id], { price: p, mprice: true }));
  return [];
}
function hatOfHour() { const r = mulberry(hourIdx() * 17 + 3); const pool = OUTFITS.filter(o => o.price > 0); return pool[Math.floor(r() * pool.length)].id; }
function itemPrice(it, shop) {
  let p = it.mprice ? it.price : price(it);
  if (shop === "boutique" && it.id === hatOfHour()) p = Math.ceil(p * .75);
  return p;
}
VIEWS.shop = (el, shop) => {
  const S = SHOPS[shop]; if (!S) { go("map"); return; }
  if (shop === "merchant" && !eventOn("merchant")) { el.innerHTML = placeHeader("merchant") + `<div class="pad">${npcBox("merchant", "I have moved on to far-off lands... Look for me in another hour, maybe!")}</div>`; wireCommon(el); return; }
  const tab = shopTab[shop] || S.tabs[0][0];
  const sale = eventOn("sale");
  const items = tab === "sell" ? [] : shopItems(shop, tab);
  const ownedFlat = it => ((it.cat === "outfit" || it.cat === "wall" || it.cat === "floor" || it.cat === "rug") && G.owned[it.id]) || (it.cat === "squishy" && G.squishies[it.sq]);
  el.innerHTML = placeHeader(shop === "merchant" ? "merchant" : shop, sale && shop !== "merchant" ? `<span class="sale-tag">30% OFF!</span>` : "") + `
    <div class="pad">
      ${npcBox(S.npc)}
      ${undoButtonHTML()}
      ${shop === "boutique" ? `<div class="deal">⏰ Hat of the Hour: <b>${esc(ITEM[hatOfHour()].name)}</b> is 25% off for ${minsLeftInHour()} more minutes!</div>` : ""}
      ${S.tabs.length > 1 ? `<div class="tabs">${S.tabs.map(([k, n]) => `<button class="tab ${k === tab ? "on" : ""}" data-tab="${k}">${n}</button>`).join("")}</div>` : ""}
      ${tab === "sell" ? sellList() : `<div class="shop-grid">${items.map(it => {
        const p = itemPrice(it, shop), owned = ownedFlat(it), cnt = it.cat === "decor" ? G.owned[it.id] || 0 : G.inv[it.id] || 0;
        return `<div class="si-card ${owned ? "owned" : ""} ${it.cat === "box" ? "boxcard" : ""}" style="${it.color ? `--bc:${it.color}` : ""}">
          <div class="si-art">${it.cat === "box" ? `<span class="ii big">${it.ico}</span>` : itemIcon(it.id)}</div>
          <b class="si-n">${esc(it.name)}</b><small class="si-d">${esc(it.desc || (it.cat === "outfit" ? "Wear it in the Wardrobe" : it.cat === "decor" ? "Place it in your Hutch" : "Decorate your Hutch"))}</small>
          ${cnt && !owned ? `<span class="si-have">You have ${cnt}</span>` : ""}
          ${owned ? `<span class="si-own">✓ Owned</span>` : `<button class="btn small ${G.coins < p ? "white" : "green"}" data-buy="${it.id}" data-p="${p}">${COIN} ${fmt(p)}${it.price !== p ? ` <s>${it.price}</s>` : ""}</button>`}
        </div>`;
      }).join("")}</div>`}
    </div>`;
  wireCommon(el);
  $$("[data-tab]", el).forEach(b => b.onclick = () => { shopTab[shop] = b.dataset.tab; play("click"); render(); });
  wireUndo(el);
  $$("[data-buy]", el).forEach(b => b.onclick = () => buy(b.dataset.buy, +b.dataset.p, b, shop));
  $$("[data-sell]", el).forEach(b => b.onclick = () => { const id = b.dataset.sell, it = ITEM[id]; if (!has(id)) return; addItem(id, -1); addCoins(it.sell, b); play("coin"); render(); });
};
function sellList() {
  const ids = Object.keys(G.inv).filter(id => ITEM[id] && ITEM[id].sell > 0);
  if (!ids.length) return `<p class="muted center">Nothing to sell. Mrs. Nibbles buys socks, gems and fossils. Weird stuff comes in packages from that raccoon...</p>`;
  return `<div class="shop-grid">${ids.map(id => `<div class="si-card"><div class="si-art">${itemIcon(id)}</div><b class="si-n">${esc(ITEM[id].name)}</b><small class="si-d">You have ${G.inv[id]}</small><button class="btn small green" data-sell="${id}">Sell for ${COIN}${ITEM[id].sell}</button></div>`).join("")}</div>`;
}
function buy(id, p, btn, shop) {
  const it = ITEM[id];
  if (!spendCoins(p)) { btn.classList.add("nope"); setTimeout(() => btn.classList.remove("nope"), 400); return; }
  play("coin"); haptic(10); tutMark("shop");
  const [x, y] = centerOf(btn); confetti(x, y, 14, false);
  if (it.cat === "squishy") { recordBuy({ type: "squishy", sq: it.sq, id, price: p, name: it.name }); grant({ squishy: it.sq }); questProgress("squishy"); play("squish"); toast(`${it.name} joined your collection! (${Object.keys(G.squishies).length}/32)`, "🍡"); addXP(4); saveSoon(); checkAchievements(); render(); return; }
  if (it.cat === "box") { G.stats.boxes++; questProgress("box"); const rewards = openBoxRewards(id); rewards.forEach(grant); saveSoon(); revealSequence({ title: it.name, ico: "🦝", line: pick(NPCS.gus.lines), box: it.ico, rewards }, () => { checkAchievements(); render(); }); return; }
  if (it.cat === "outfit" || it.cat === "wall" || it.cat === "floor" || it.cat === "decor" || it.cat === "rug") { recordBuy({ type: it.cat === "decor" ? "decor" : "own", id, price: p, name: it.name }); own(id); toast(it.cat === "outfit" ? `${it.name} is yours! Try it on with Dress.` : `${it.name} is yours! Place it with ✏️ Decorate at home.`, it.ico || "🎀"); }
  else { addItem(id, 1); recordBuy({ type: "item", id, n: 1, price: p, name: it.name }); floatText(x, y - 30, "+1 " + it.name, "#2f7d14", 18); }
  addXP(2); saveSoon(); checkAchievements();
  render();
}

/* ---------- ADOPTION CENTER ---------- */
PLACE_VIEWS.adopt = (el) => {
  const st = adoptStock();
  const left = Math.ceil(((Math.floor(now() / (3 * HOUR)) + 1) * 3 * HOUR - now()) / MIN);
  el.innerHTML = placeHeader("adopt") + `<div class="pad">
    ${npcBox("clover")}
    <p class="room-note">🏠 Hutch: <b>${hutchList().length}/${HUTCH_CAP}</b> &nbsp; 🌾 Farm: <b>${G.farm.level ? farmList().length + "/" + farmCap() : "not bought yet"}</b></p>
    <h2 class="sec">Guineas looking for a home</h2><p class="muted">New guineas arrive in ${dur(left * MIN)}.</p>
    <div class="adopt-grid">${st.list.map((o, i) => { const sold = st.sold[o.key]; const tc = TIERS[tierOf(o)]; return `<div class="ad-card ${sold ? "sold" : ""}" style="--tc:${tc.c}">
      <div class="ad-art">${guineaSVG({ genes: o.genes, born: now() - 4 * DAY, life: 20 }, { size: 110 })}</div>
      <b>${esc(o.name)}</b> <span style="color:${SEX[o.sex].c}">${SEX[o.sex].ico} ${SEX[o.sex].n}</span>
      <small>${esc(coatName(o.genes))} · ${esc(PERSONALITIES[o.pers].n)}</small>${tierChip(o)}
      ${sold ? `<span class="si-own">Adopted! 💕</span>` : `<button class="btn small green" data-adopt="${i}">${COIN} ${fmt(o.price)}</button>`}</div>`; }).join("")}</div>
    ${G.nursery.length ? `<h2 class="sec">Nursery (${G.nursery.length})</h2><p class="muted">These babies were born when your homes were full. Make room, then bring them home!</p><div class="adopt-grid">${G.nursery.map((b, i) => `<div class="ad-card" style="--tc:${TIERS[tierOf(b)].c}"><div class="ad-art">${guineaSVG(b, { size: 100 })}</div><b>${esc(b.name)}</b> ${sexIco(b)}<small>${esc(coatName(b.genes))}</small>${tierChip(b)}<button class="btn small green" data-claim="${i}">Bring home</button><button class="btn small white" data-rehomen="${i}">Rehome +${rehomeValue(b)}</button></div>`).join("")}</div>` : ""}
    <div class="card note"><b>Need space?</b> Rehome a guinea from its page in Guineas. Auntie Clover finds them a loving family and the family sends you a thank-you gift of coins. ${G.farm.level ? "" : "Or buy the <b>Guinea Farm</b> for room for 8 more!"}</div>
  </div>`;
  wireCommon(el);
  $$("[data-adopt]", el).forEach(b => b.onclick = async () => {
    const o = st.list[+b.dataset.adopt]; const home = freeHome();
    if (!home) { play("buzz"); toast(G.farm.level ? "No room! Upgrade your farm or rehome someone." : "Your hutch is full! Buy the Guinea Farm for more room.", "🏠"); return; }
    if (!(await confirmBox(`Adopt ${esc(o.name)}?`, `${esc(o.name)} (${SEX[o.sex].n}, ${esc(coatName(o.genes))}) will live in your ${home}. Costs ${fmt(o.price)} coins.`, "Adopt!", "Not yet"))) return;
    if (!spendCoins(o.price)) return;
    st.sold[o.key] = 1; const g = adoptGuinea(o, home); recordBuy({ type: "adopt", gid: g.id, key: o.key, price: o.price, name: g.name + " (adopted)" }); play("fanfare"); confetti(innerWidth / 2, innerHeight / 2, 80);
    toast(`${g.name} moved into your ${home}!`, "🏠"); render();
  });
  $$("[data-claim]", el).forEach(b => b.onclick = () => { const home = freeHome(); if (!home) { play("buzz"); toast("Still no room! Rehome someone or upgrade the farm.", "🏠"); return; } const g = G.nursery.splice(+b.dataset.claim, 1)[0]; g.home = home; G.guineas.push(g); play("wheek"); toast(`${g.name} came home!`, "🏠"); saveSoon(); render(); });
  $$("[data-rehomen]", el).forEach(b => b.onclick = async () => { const g = G.nursery[+b.dataset.rehomen]; if (!(await confirmBox(`Rehome ${esc(g.name)}?`, `Auntie Clover will find ${esc(g.name)} a loving family. They'll send you ${rehomeValue(g)} coins as a thank-you.`, "Find a family", "Keep"))) return; G.nursery.splice(+b.dataset.rehomen, 1); addCoins(rehomeValue(g), b); play("heart"); render(); });
};

/* ---------- VET ---------- */
PLACE_VIEWS.vet = (el) => {
  const sick = G.guineas.filter(g => g.sick || g.health < 70);
  const cost = 60;
  el.innerHTML = placeHeader("vet") + `<div class="pad">
    ${npcBox("hoot", sick.length ? "Hoo-hoo! Let's get these little ones feeling better." : undefined)}
    <h2 class="sec">Patients</h2>
    ${sick.length ? `<div class="list">${sick.map(g => `<div class="row card"><div class="row-art">${guineaSVG(g, { size: 70, mood: "sad" })}</div><div class="row-txt"><b>${esc(g.name)}</b><small>${g.sick ? "🤒 Sick" : "😕 A bit run-down"} · Health ${Math.round(g.health)}%</small></div><button class="btn small green" data-treat="${g.id}">Treat ${COIN}${cost}</button></div>`).join("")}</div>` : `<p class="muted center">Everyone is healthy! Dr. Hootsworth is doing a crossword. 🦉</p>`}
    <h2 class="sec">Check-up</h2>
    <div class="list">${G.guineas.map(g => `<div class="row card"><div class="row-art">${guineaSVG(g, { size: 56, mood: mood(g) })}</div><div class="row-txt"><b>${esc(g.name)}</b><small>${STAGES[stageOf(g)]} · ${esc(ageLabel(g))}${g.preg ? " · 🤰 expecting" : ""}</small><div class="mini-bars">${["food", "joy", "clean", "health"].map(k => `<i title="${k}" style="--v:${Math.round(g[k])}%;--c:${g[k] > 60 ? "#7be04a" : g[k] > 30 ? "#ffd84d" : "#ff5a5f"}"></i>`).join("")}</div></div></div>`).join("")}</div>
    <h2 class="sec">Pharmacy</h2>
    <div class="shop-grid">${["gummies", "vitc", "sitter", "youth"].map(id => { const it = ITEM[id], p = price(it); return `<div class="si-card"><div class="si-art">${itemIcon(id)}</div><b class="si-n">${esc(it.name)}</b><small class="si-d">${esc(it.desc)}</small>${G.inv[id] ? `<span class="si-have">You have ${G.inv[id]}</span>` : ""}<button class="btn small green" data-buy="${id}" data-p="${p}">${COIN} ${fmt(p)}</button></div>`; }).join("")}</div>
    <div class="card note">💡 <b>Dr. Hootsworth's tip:</b> Guineas get sick when they're hungry, dirty or bored for a long time. Sick guineas lose life time! Golden Oldies (white eyebrows) are near the end of their life. Vitamin C adds days.</div>
  </div>`;
  wireCommon(el);
  $$("[data-treat]", el).forEach(b => b.onclick = () => { const g = G.guineas.find(x => x.id === b.dataset.treat); if (!spendCoins(cost)) return; g.sick = false; g.sickNote = 0; g.health = 100; play("sparkle"); const [x, y] = centerOf(b); hearts(x, y, 10); toast(`${g.name} feels all better!`, "💚"); addXP(10); saveSoon(); render(); });
  $$("[data-buy]", el).forEach(b => b.onclick = () => buy(b.dataset.buy, +b.dataset.p, b, "vet"));
};

/* ---------- RAINBOW MEADOW ---------- */
PLACE_VIEWS.meadow = (el) => {
  el.innerHTML = placeHeader("meadow") + `<div class="pad meadow">
    ${npcBox("butterfly")}
    ${G.memorial.length ? `<div class="mem-grid">${G.memorial.map((m, i) => `<div class="mem card"><div class="mem-art">${guineaSVG({ genes: m.genes, outfit: Object.assign({}, m.outfit, { hat: "halo" }), born: now() - 10 * DAY, life: 100 }, { size: 96, mood: "happy" })}</div><b>${esc(m.name)}</b><small>${Math.max(1, Math.round((m.died - m.born) / DAY))} days · ${m.kids || 0} babies · ${fmt(m.boops || 0)} boops</small><button class="btn small lilac" data-flower="${i}">🌷 ${m.flowers || 0}</button></div>`).join("")}</div>` : `<p class="muted center">The meadow is quiet and full of flowers. Guineas who have lived long, happy lives come to rest here. 🌈</p>`}
  </div>`;
  wireCommon(el);
  $$("[data-flower]", el).forEach(b => b.onclick = () => { const m = G.memorial[+b.dataset.flower]; m.flowers = (m.flowers || 0) + 1; play("heart"); const [x, y] = centerOf(b); hearts(x, y, 6); b.innerHTML = "🌷 " + m.flowers; saveSoon(); });
};

/* ---------- POST OFFICE ---------- */
PLACE_VIEWS.post = (el) => {
  el.innerHTML = placeHeader("post") + `<div class="pad">
    ${npcBox("pidge")}
    <div class="card next-pk">📬 Next delivery in <b>${minsLeftInHour()} min</b>. A new package arrives every hour (up to 3 wait for you).</div>
    <h2 class="sec">Waiting for you</h2>
    ${G.packages.length ? `<div class="list">${G.packages.map((p, i) => { const c = COURIERS.find(x => x.id === p.courier) || COURIERS[0]; return `<div class="row card"><span class="big-emoji sm">${c.ico}</span><div class="row-txt"><b>${p.welcome ? "Welcome Package" : esc(c.name)}</b><small>Arrived ${dur(now() - p.at)} ago</small></div><button class="btn small pink" data-open="${i}">Open 📦</button></div>`; }).join("")}</div>` : `<p class="muted center">No packages right now. Come back next hour!</p>`}
    <h2 class="sec">Couriers of Wheek World</h2>
    <div class="couriers">${COURIERS.map(c => `<div class="cr"><span>${c.ico}</span><small>${esc(c.name)}</small></div>`).join("")}</div>
  </div>`;
  wireCommon(el);
  $$("[data-open]", el).forEach(b => b.onclick = () => { openPackage(G.packages[+b.dataset.open]); setTimeout(() => ROUTE.name === "place" && render(), 50); });
};

/* ---------- GAME HALLS ---------- */
const HALLS = { arcade: "Free games! The better you play, the more coins you win.", carnival: "Free games of skill! Beat your best score for bigger prizes.", swamp: "Stinky games for brave guineas. Hold your nose!" };
function hallView(id) {
  return (el) => {
    const games = Object.values(WW.games).filter(g => g.place === id || (id === "arcade" && g.place === "lab"));
    const ev = currentEvent();
    const x2 = ev.id === "golden" || (ev.id === "fartstorm" && id === "swamp");
    el.innerHTML = placeHeader(id, x2 ? `<span class="sale-tag">x2 COINS!</span>` : "") + `<div class="pad">
      ${npcBox(PLACES[id].npc)}
      <p class="muted center">${HALLS[id]}</p>
      <div class="game-grid">${games.map(g => `<button class="game-tile" data-play="${g.id}"><span class="gt-ico">${g.icon}</span><b>${esc(g.name)}</b><small>${esc(g.blurb)}</small><span class="gt-kind ${g.kind}">${g.kind === "luck" ? "🎲 Luck" : "🎯 Skill"}</span>${G.best[g.id] ? `<span class="gt-best">Best: ${fmt(G.best[g.id])}</span>` : ""}</button>`).join("") || `<p class="muted">The games are still being set up! Come back soon.</p>`}</div>
    </div>`;
    wireCommon(el);
    $$("[data-play]", el).forEach(b => b.onclick = () => { play("click"); go("play/" + b.dataset.play); });
  };
}
PLACE_VIEWS.arcade = hallView("arcade");
PLACE_VIEWS.carnival = hallView("carnival");

/* ---------- SWAMP ---------- */
const fishCasts = () => (G.fish && G.fish.h === hourIdx()) ? G.fish.n : 0;
PLACE_VIEWS.swamp = (el) => {
  hallView("swamp")(el);
  const grid = $(".game-grid", el);
  if (grid) grid.insertAdjacentHTML("beforeend", `<button class="game-tile" id="fish"><span class="gt-ico">🎣</span><b>Swamp Fishing</b><small>Free! Cast a line. What's in the muck? (${Math.max(0, 5 - fishCasts())} casts left this hour)</small><span class="gt-kind luck">🎲 Luck</span></button>`);
  const f = $("#fish", el); if (f) f.onclick = () => {
    if (fishCasts() >= 5) { play("buzz"); toast("The fish are sleeping. Come back next hour!", "🎣"); return; }
    G.fish = { h: hourIdx(), n: fishCasts() + 1 }; play("whoosh");
    setTimeout(() => {
      const r = weighted([{ k: "sock", w: 30 }, { k: "coins", w: 35 }, { k: "boot", w: 15 }, { k: "fossil", w: 6 }, { k: "gem", w: 3 }, { k: "frog", w: 10 }, { k: "golden", w: 1 }]).k;
      const [x, y] = centerOf(f);
      if (r === "sock") { addItem("sock", 1); play("splat"); toast("You caught a soggy sock! (Sell it at Squeakmart)", "🧦"); }
      else if (r === "coins") { const c = rint(3, 12); addCoins(c, [x, y]); toast(`A muddy coin purse! +${c}`, "👛"); }
      else if (r === "boot") { play("fart"); gas(x, y); toast("An old boot. It smells like 1000 toots.", "🥾"); }
      else if (r === "fossil") { addItem("fossil", 1); play("win"); toast("A FOSSILIZED POOP! Worth 120 coins!", "🪨"); }
      else if (r === "gem") { addItem("gem", 1); play("bigwin"); confetti(x, y, 60); toast("A SWAMP GEM!!! Worth 250 coins!", "💎"); }
      else if (r === "frog") { play("wheek"); toast("You caught Old Swampy's cousin. He says hi and leaves.", "🐸"); }
      else { addCoins(100, [x, y]); play("bigwin"); confetti(x, y, 100); toast("THE GOLDEN TADPOLE! +100 coins!", "✨"); }
      saveSoon();
    }, 700);
  };
};

/* ---------- GAME HOST ---------- */
VIEWS.play = (el, id) => {
  const def = WW.games[id]; if (!def) { go("map"); return; }
  document.body.classList.add("in-game");
  el.innerHTML = `<div class="stage" id="stage"></div>`;
  const stage = $("#stage", el);
  const counted = { v: false };
  const count = () => { if (counted.v) return; counted.v = true; tutMark("game"); G.stats.games++; questProgress("play"); addXP(8); checkAchievements(); };
  const ev = currentEvent();
  const mult = ev.id === "golden" || (ev.id === "fartstorm" && def.place === "swamp") ? 2 : 1;
  let inst = null, ended = false;
  const g = activeG();
  const api = {
    coins: () => G.coins,
    spend(n) { if (G.coins < n) { play("buzz"); return false; } G.coins -= n; G.stats.spent += n; renderCoins(); count(); saveSoon(); return true; },
    award(n, opts = {}) { n = Math.max(0, Math.round(n * mult * keeperBonus())); if (!n) return 0; G.coins += n; G.stats.earned += n; G.daily.earned = (G.daily.earned || 0) + n; questProgress("earn", n); if (n > (G.stats.bigWin || 0)) G.stats.bigWin = n; renderCoins(); bumpCoins(); count(); saveSoon(); checkAchievements(); return n; },
    multiplier: mult,
    get muted() { return !!G.settings.muted; },
    best: gid => G.best[gid] || 0,
    sfx: play, confetti, gas, floatText, toast: m => toast(m, def.icon), haptic,
    guinea: Object.assign({ name: g.name, color: FUR[g.genes.c].c, color2: FUR[g.genes.c2].c }, { id: g.id, genes: g.genes }),
    guineaSVG(o = {}) { return guineaSVG(g, Object.assign({ size: 100, mood: o.mood || "", flip: o.flip }, o)); },
    randomGuineaSVG(seed, o = {}) { const r = mulberry(seed * 977 + 1); const gn = randGenes(r, { mut: .05 }); return guineaSVG({ id: "rg" + seed, genes: gn }, Object.assign({ size: 100 }, o)); },
    highscore(gid, score) { const b = G.best[gid] || 0; if (score > b) { G.best[gid] = score; saveSoon(); return { best: score, isNew: true }; } return { best: b, isNew: false }; },
    done(s = {}) {
      count(); if (ended) return; ended = true;
      const m = openModal(`<div class="center"><div class="big-emoji">${def.icon}</div><h2>${esc(s.title || "Round over!")}</h2>${s.text ? `<p class="mtext">${esc(s.text)}</p>` : ""}${keeperBonus() > 1 ? `<p class="muted">Includes your keeper level ${G.level} bonus: +${Math.round((keeperBonus() - 1) * 100)}%</p>` : ""}<div class="earned">${COIN}<b>+${fmt(s.earned || 0)}</b></div>${mult > 1 ? `<p class="kicker">x${mult} event bonus included!</p>` : ""}<div class="mrow"><button class="btn white" data-leave>Leave</button><button class="btn green" data-again>Play again</button></div></div>`, { sticky: true });
      if ((s.earned || 0) > 0) { play("win"); confetti(innerWidth / 2, innerHeight / 3, 50); }
      $("[data-again]", m.el).onclick = () => { m.close(); remount(); };
      $("[data-leave]", m.el).onclick = () => { m.close(); back(); };
    },
    exit() { back(); },
  };
  function mount() { stage.innerHTML = `<div class="game-root"></div>`; ended = false; counted.v = false; try { inst = def.mount($(".game-root", stage), api); } catch (e) { console.error(e); stage.innerHTML = `<div class="pad center"><h2>This game broke!</h2><p class="muted">${esc(e.message)}</p><button class="btn" onclick="history.back()">Back</button></div>`; } }
  function remount() { try { inst && inst.destroy && inst.destroy(); } catch (e) { console.error(e); } mount(); }
  mount();
  return () => { try { inst && inst.destroy && inst.destroy(); } catch (e) { console.error(e); } document.body.classList.remove("in-game"); checkAchievements(); };
};
