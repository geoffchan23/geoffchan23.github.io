/* Wheek World: guinea list & detail, dates, bag, book, settings, slime lab. */
"use strict";

/* ---------- GUINEAS ---------- */
function petCard(g) {
  const st = stageOf(g);
  const status = [isAsleep(g) ? "💤 Asleep" : "", g.preg ? `🤰 ${dur(g.preg.due - now())}` : "", g.sick ? "🤒 Sick" : "", isOld(st) ? "👴 " + STAGES[st] : "", G.active === g.id ? "⭐ Buddy" : ""].filter(Boolean).join(" · ");
  return `<button class="pet-card card" data-pet="${g.id}" style="--tc:${TIERS[tierOf(g)].c}">
    <div class="pc-art">${guineaSVG(g, { size: 86, mood: mood(g) })}</div>
    <div class="pc-txt"><b>${esc(g.name)} ${sexIco(g)}</b><small>${STAGES[st]} · ${esc(coatName(g.genes))}</small>${tierChip(g)}${powerChips(g)}
      <div class="mini-bars">${["food", "joy", "clean", "health"].map(k => `<i style="--v:${Math.round(g[k])}%;--c:${g[k] > 60 ? "#7be04a" : g[k] > 30 ? "#ffd84d" : "#ff5a5f"}"></i>`).join("")}</div>
      ${status ? `<span class="pc-status">${status}</span>` : ""}</div></button>`;
}
VIEWS.pets = (el) => {
  const h = hutchList(), f = farmList();
  el.innerHTML = `<div class="pad">
    <h1 class="page-t">My Guineas <span class="count">${G.guineas.length}</span></h1>
    <h2 class="sec">🏠 Hutch <span class="count">${h.length}/${HUTCH_CAP}</span></h2>
    <div class="pet-list">${h.map(petCard).join("") || `<p class="muted">Empty hutch!</p>`}</div>
    <h2 class="sec">🌾 Farm ${G.farm.level ? `<span class="count">${f.length}/${farmCap()}</span>` : ""}</h2>
    ${G.farm.level ? `<div class="pet-list">${f.map(petCard).join("") || `<p class="muted">No guineas on the farm yet. Open a guinea and tap "Move to farm".</p>`}</div>` : `<button class="card cta" data-go="place/farm">🌾 <b>Buy the Guinea Farm</b> to keep lots more guineas and build money-making shops! <span>${COIN} ${fmt(FARM_PRICE)}</span></button>`}
    ${G.nursery.length ? `<button class="card cta" data-go="place/adopt">🍼 <b>${G.nursery.length} babies</b> waiting in the nursery at the Adoption Center!</button>` : ""}
    <div class="row-btns"><button class="btn pink" data-go="date">💕 Guinea Date</button><button class="btn sky" data-go="place/adopt">🐹 Adopt more</button></div>
    ${G.memorial.length ? `<button class="card cta" data-go="place/meadow">🌈 Rainbow Meadow: ${G.memorial.length} loved guinea${G.memorial.length > 1 ? "s" : ""}</button>` : ""}
  </div>`;
  $$("[data-pet]", el).forEach(b => b.onclick = () => { play("wheek"); go("pet/" + b.dataset.pet); });
  $$("[data-go]", el).forEach(b => b.onclick = () => { play("click"); go(b.dataset.go); });
};
VIEWS.pet = (el, id) => {
  const g = G.guineas.find(x => x.id === id); if (!g) { go("pets"); return; }
  const st = stageOf(g), P = PERSONALITIES[g.pers];
  const fav = ITEM[g.fav] || ITEM.lettuce;
  el.innerHTML = `<div class="pad">
    <button class="back" data-back>◀ Guineas</button>
    <div class="pet-hero card" style="--tc:${TIERS[tierOf(g)].c}">
      <button class="ph-art ${hasPower(g, "floaty") ? "floaty" : ""}" id="pet">${auraHTML(g)}${guineaSVG(g, { size: 190, mood: mood(g), cls: "idle" })}</button>
      <h1>${esc(g.name)} ${sexIco(g)}</h1>${tierChip(g)}
      <p class="muted">${esc(coatName(g.genes))} · ${EYES[g.genes.e].n}</p>
    </div>
    ${powerCard(g)}
    <div class="facts card">
      <div><span>Age</span><b>${STAGES[st]}, ${esc(ageLabel(g))}</b></div>
      <div><span>Personality</span><b>${esc(P.n)}</b><small>${esc(P.d)}</small></div>
      <div><span>Favourite food</span><b>${fav.ico} ${esc(fav.name)}</b></div>
      <div><span>Lives in</span><b>${g.home === "hutch" ? "🏠 Hutch" : "🌾 Farm"}</b></div>
      <div><span>Generation</span><b>${g.gen || 1}${g.parents ? ` (child of ${esc(g.parents[0])} & ${esc(g.parents[1])})` : ""}</b></div>
      <div><span>Boops received</span><b>${fmt(g.boops || 0)}</b></div>
      ${g.kids ? `<div><span>Babies</span><b>${g.kids}</b></div>` : ""}
      ${g.preg ? `<div><span>Expecting</span><b>🤰 ${g.preg.n > 1 ? "babies" : "a baby"} in ${dur(g.preg.due - now())}</b><small>Dad: ${esc(g.preg.dadName)}</small></div>` : ""}
      ${isOld(st) ? `<div><span>${STAGES[st]}</span><b>👴 Silver fur, sleepy eyes, lots of stories</b><small>Old guineas nap more and love gentle boops. They never leave you.</small></div>` : ""}
      ${nextStageIn(g) ? `<div><span>Next birthday stage</span><b>${STAGES[{ baby: "kid", kid: "adult", adult: "elder", elder: "ancient" }[st]]} in ${dur(nextStageIn(g))}</b><small>${st === "baby" || st === "kid" ? "Growing bigger every hour! Adults can go on dates." : "Guineas grow old but never die."}</small></div>` : ""}
    </div>
    <div class="stats card">${bar("Food", g.food, "🍽️")}${bar("Fun", g.joy, "🎈")}${bar("Clean", g.clean, "🫧")}${bar("Health", g.health, "❤️")}${bar(isAsleep(g) ? `Energy (sleeping, ${dur(sleepLeft(g))})` : "Energy", g.energy ?? 80, isAsleep(g) ? "💤" : "⚡")}</div>
    <div class="row-btns wrap">
      ${G.active !== g.id ? `<button class="btn green" data-buddy>⭐ Make my buddy</button>` : `<button class="btn green" data-go="home">🏠 Play at home</button>`}
      <button class="btn white" data-rename>✏️ Rename</button>
      ${g.home === "hutch" && G.farm.level ? `<button class="btn sky" data-move="farm">Move to farm</button>` : ""}
      ${g.home === "farm" ? `<button class="btn sky" data-move="hutch">Move to hutch</button>` : ""}
      ${st === "adult" && !g.preg ? `<button class="btn pink" data-date>💕 Find a date</button>` : ""}
      <button class="btn white" data-feed>🥕 Feed</button>
      <button class="btn white" data-rehome>💌 Rehome</button>
    </div>
  </div>`;
  $("[data-back]", el).onclick = () => { play("click"); back(); };
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  const pb = $("#pet", el); pb.addEventListener("pointerdown", e => { play("boop"); g.boops = (g.boops || 0) + 1; G.stats.boops++; questProgress("boop"); g.joy = clamp(g.joy + 1.5, 0, 100); petAnim(pb, "squish", 500); hearts(e.clientX, e.clientY, 2); saveSoon(); });
  const bd = $("[data-buddy]", el); if (bd) bd.onclick = () => { G.active = g.id; play("wheek"); toast(`${g.name} is your buddy now! They'll play games with you.`, "⭐"); saveSoon(); render(); };
  $("[data-rename]", el).onclick = async () => { const n = await promptBox("New name", g.name, 18); if (n) { g.name = n; play("pop"); saveSoon(); render(); } };
  $$("[data-move]", el).forEach(b => b.onclick = () => { const to = b.dataset.move; if (roomIn(to) <= 0) { play("buzz"); toast(`The ${to} is full!`, "🏠"); return; } g.home = to; g.lastPoop = now(); play("whoosh"); toast(`${g.name} moved to the ${to}!`, to === "farm" ? "🌾" : "🏠"); saveSoon(); render(); });
  const dt = $("[data-date]", el); if (dt) dt.onclick = () => go("date/" + g.id);
  $("[data-feed]", el).onclick = () => { G.active = g.id; saveSoon(); go("home"); setTimeout(() => openTray("food", g), 350); };
  $("[data-rehome]", el).onclick = async () => {
    if (G.guineas.length <= 1) { play("buzz"); toast("You can't rehome your only guinea!", "💌"); return; }
    const v = rehomeValue(g);
    if (!(await confirmBox(`Rehome ${esc(g.name)}?`, `Auntie Clover will find ${esc(g.name)} a loving new family. They'll send a thank-you gift of <b>${v} coins</b>. This can't be undone!`, "Find a family", "Keep " + esc(g.name)))) return;
    G.guineas = G.guineas.filter(x => x !== g); if (G.active === g.id) G.active = G.guineas[0].id;
    addCoins(v, [innerWidth / 2, innerHeight / 2]); play("heart"); toast(`${g.name} has a lovely new family!`, "💌"); saveSoon(); go("pets");
  };
};

/* ---------- DATES ---------- */
VIEWS.date = (el, firstId) => {
  const adults = G.guineas.filter(g => stageOf(g) === "adult" && !g.preg);
  const sows = adults.filter(g => g.sex === "sow"), boars = adults.filter(g => g.sex === "boar");
  let sow = G.guineas.find(g => g.id === firstId && g.sex === "sow") || null, boar = G.guineas.find(g => g.id === firstId && g.sex === "boar") || null;
  const draw = () => {
    const ok = sow && boar && canMate(sow) && canMate(boar) && sow.joy > 40 && boar.joy > 40;
    const why = !sow || !boar ? "Pick one girl and one boy." : !canMate(sow) ? `${sow.name} needs a rest (or is sick/expecting).` : !canMate(boar) ? `${boar.name} needs a rest.` : sow.joy <= 40 || boar.joy <= 40 ? "They need to be happier first! (Fun over 40)" : eventOn("love") ? "💘 Love is in the air! This date WILL work!" : has("lovepotion") ? "💘 Love Potion ready: this date will work, +1 baby!" : "70% chance of babies. A Love Potion makes it 100%.";
    const pc = (g, sel) => `<button class="dc ${sel ? "on" : ""} ${canMate(g) ? "" : "tired"}" data-pick="${g.id}">${guineaSVG(g, { size: 70, mood: mood(g) })}<b>${esc(g.name)}</b><small>${canMate(g) ? esc(coatName(g.genes)) : g.sick ? "sick" : "resting " + dur((g.lastMate || 0) + (g.sex === "sow" ? 10 : 4) * HOUR - now())}</small></button>`;
    el.innerHTML = `<div class="pad">
      <button class="back" data-back>◀ Guineas</button>
      <h1 class="page-t">💕 Guinea Date</h1>
      <div class="date-stage card"><div class="ds-slot">${sow ? guineaSVG(sow, { size: 110, mood: "happy" }) : `<span class="ds-empty">♀</span>`}</div><span class="ds-heart">💗</span><div class="ds-slot">${boar ? guineaSVG(boar, { size: 110, mood: "happy", flip: true }) : `<span class="ds-empty">♂</span>`}</div></div>
      <p class="center ${ok ? "" : "muted"}">${esc(why)}</p>
      <button class="btn pink big" id="goDate" ${ok ? "" : "disabled"}>Go on a date! 🌹</button>
      ${!sows.length || !boars.length ? `<div class="card note">You need an adult <b style="color:${SEX.sow.c}">girl ♀</b> and an adult <b style="color:${SEX.boar.c}">boy ♂</b>. Adopt one at the <a href="#/place/adopt">Adoption Center</a>! Babies grow up into adults after 3 days.</div>` : ""}
      <h2 class="sec" style="color:${SEX.sow.c}">Girls ♀</h2><div class="date-row">${sows.map(g => pc(g, sow === g)).join("") || `<p class="muted">No adult girls</p>`}</div>
      <h2 class="sec" style="color:${SEX.boar.c}">Boys ♂</h2><div class="date-row">${boars.map(g => pc(g, boar === g)).join("") || `<p class="muted">No adult boys</p>`}</div>
      <p class="muted center">Babies inherit fur, patterns, hair and eyes from both parents. Sometimes a WEIRD mutation pops up: Golden, Slime, Ghost, Rainbow, Galaxy... or the legendary Disco guinea! 🥭 Mutation Mangos make weird babies way more likely.</p>
    </div>`;
    $("[data-back]", el).onclick = () => back();
    $$("[data-pick]", el).forEach(b => b.onclick = () => { const g = G.guineas.find(x => x.id === b.dataset.pick); if (g.sex === "sow") sow = g; else boar = g; play("pop"); draw(); });
    const gd = $("#goDate", el); if (gd) gd.onclick = () => {
      gd.disabled = true;
      const stage = $(".date-stage", el); stage.classList.add("dating"); play("heart"); const [x, y] = centerOf(stage);
      const hv = setInterval(() => hearts(x + (Math.random() - .5) * 120, y, 3), 250);
      setTimeout(() => {
        clearInterval(hv);
        const ok = startDate(sow, boar);
        if (ok) { play("fanfare"); confetti(x, y, 80); const m = openModal(`<div class="center"><div class="big-emoji">🤰</div><h2>It worked!</h2><p class="mtext">${esc(sow.name)} is expecting babies! They'll arrive in about <b>${dur(sow.preg.due - now())}</b>. Come back to meet them!</p>${has("timesnail") ? `<button class="btn sky" data-snail>🐌 Use Time Snail (babies in 5 min)</button>` : ""}<div class="mrow"><button class="btn green" data-ok>Yay!</button></div></div>`, { onClose: () => go("pets") }); $("[data-ok]", m.el).onclick = () => m.close(); const sn = $("[data-snail]", m.el); if (sn) sn.onclick = () => { addItem("timesnail", -1); sow.preg.due = now() + 5 * MIN; saveSoon(); play("sparkle"); toast("Time Snail activated! Babies in 5 minutes!", "🐌"); m.close(); }; }
        else { play("fart"); gas(x, y, 20); G.stats.toots++; const m = openModal(`<div class="center"><div class="big-emoji">💨</div><h2>Awkward...</h2><p class="mtext">${esc(boar.name)} tooted at dinner and ${esc(sow.name)} was NOT impressed. Try again after they rest a bit!</p><div class="mrow"><button class="btn green" data-ok>Oh well</button></div></div>`, { onClose: () => draw() }); $("[data-ok]", m.el).onclick = () => m.close(); }
      }, 2200);
    };
  };
  draw();
};

/* ---------- BAG ---------- */
let bagTab = "food";
VIEWS.bag = (el) => {
  const tabs = [["food", "🥕 Food"], ["care", "🧼 Care"], ["toy", "🧸 Toys"], ["box", "🎁 Boxes"], ["love", "💘 Love"], ["farm", "🌱 Farm"], ["junk", "💎 Treasure"], ["outfit", "👒 Outfits"], ["decor", "🛋️ Decor"]];
  let body = "";
  if (bagTab === "outfit") {
    const owned = OUTFITS.filter(o => G.owned[o.id]);
    body = owned.length ? `<button class="btn pink big" data-ward>👒 Dress up ${esc(activeG().name)}</button><div class="bag-grid" style="margin-top:14px">${owned.map(o => `<button class="bag-it" data-ward><div class="si-art">${itemIcon(o.id)}</div><b>${esc(o.name)}</b></button>`).join("")}</div>` : emptyBag("No outfits yet!", "Buy hats and glasses at Fluff Boutique.", "shop/boutique", "🎀 Go to Fluff Boutique");
  } else if (bagTab === "decor") {
    const dec = DECOR.filter(d => G.owned[d.id]);
    const walls = WALLS.filter(w => G.owned[w.id]), floors = FLOORS.filter(w => G.owned[w.id]);
    const rugs = RUGS.filter(r => G.owned[r.id]);
    body = `<p class="muted center">Tap a spot to choose what goes there. Buy more at Fluff Boutique!</p><h3 class="sub">Floor spots</h3><div class="slots">${G.home.decor.slice(0, 4).map((d, i) => `<button class="slot" data-slot="${i}">${d ? ITEM[d].ico : "➕"}<small>${["Back left", "Back right", "Front left", "Front right"][i]}</small></button>`).join("")}</div>
      <h3 class="sub">Wall spots</h3><div class="slots two">${[4, 5].map(i => { const d = G.home.decor[i]; return `<button class="slot" data-slot="${i}">${d ? ITEM[d].ico : "➕"}<small>${i === 4 ? "Wall left" : "Wall right"}</small></button>`; }).join("")}</div>
      <h3 class="sub">Squishy shelf</h3><p class="muted">Squishies on your shelf give bonuses and do funny things when you squish them at home.</p><div class="slots">${sqHome().items.map((id, i) => `<button class="slot" data-sqslot="${i}">${id && sqDef(id) ? `<span class="slot-sq">${squishySVG(sqDef(id))}</span>` : "➕"}<small>Spot ${i + 1}</small></button>`).join("")}</div>
      <h3 class="sub">Rug</h3><div class="chips"><button class="chip ${!G.home.rug ? "on" : ""}" data-rug="">No rug</button>${rugs.map(r => `<button class="chip ${G.home.rug === r.id ? "on" : ""}" data-rug="${r.id}"><span class="sw" style="background:${r.css}"></span>${esc(r.name)}</button>`).join("")}</div>
      <h3 class="sub">Wallpaper</h3><div class="chips">${walls.map(w => `<button class="chip ${G.home.wall === w.id ? "on" : ""}" data-wall="${w.id}"><span class="sw" style="background:${w.css}"></span>${esc(w.name)}</button>`).join("")}</div>
      <h3 class="sub">Floor</h3><div class="chips">${floors.map(w => `<button class="chip ${G.home.floor === w.id ? "on" : ""}" data-floor="${w.id}"><span class="sw" style="background:${w.css}"></span>${esc(w.name)}</button>`).join("")}</div>
      <h3 class="sub">Your furniture</h3>${dec.length ? `<p class="muted">Tap a spot above to put furniture in your hutch.</p><div class="bag-grid">${dec.map(d => `<div class="bag-it"><span class="ii big">${d.ico}</span><b>${esc(d.name)}</b>${G.owned[d.id] > 1 ? `<small>x${G.owned[d.id]}</small>` : ""}</div>`).join("")}</div>` : emptyBag("No furniture yet!", "Fluff Boutique sells couches, disco balls and even a golden toilet.", "shop/boutique", "🎀 Go to Fluff Boutique")}`;
  } else {
    const ids = Object.keys(G.inv).filter(id => ITEM[id] && G.inv[id] > 0 && (ITEM[id].cat === bagTab || (bagTab === "farm" && (ITEM[id].cat === "seed" || ITEM[id].cat === "slime"))));
    const where = { box: ["shop/boxes", "🍡 Go to the Squishy Shop"], junk: ["place/swamp", "🎣 Go fishing in the Swamp"] }[bagTab] || ["shop/squeakmart", "🛒 Go to Squeakmart"];
    body = ids.length ? `<p class="muted center">Tap something to use it!</p><div class="bag-grid">${ids.map(id => { const it = ITEM[id]; return `<button class="bag-it" data-item="${id}">${it.cat === "box" ? `<span class="ii big">${it.ico}</span>` : `<div class="si-art">${itemIcon(id)}</div>`}<b>${esc(it.name)}</b><small>x${G.inv[id]}</small><span class="btn small ${it.cat === "box" ? "pink" : "green"}">${bagVerb(it)}</span></button>`; }).join("")}</div>` : emptyBag("Nothing here yet!", "", where[0], where[1]);
  }
  el.innerHTML = `<div class="pad"><h1 class="page-t">🎒 My Bag</h1>${undoButtonHTML()}<div class="tabs scroll">${tabs.map(([k, n]) => `<button class="tab ${k === bagTab ? "on" : ""}" data-btab="${k}">${n}</button>`).join("")}</div>${body}</div>`;
  $$("[data-btab]", el).forEach(b => b.onclick = () => { bagTab = b.dataset.btab; play("click"); render(); });
  wireUndo(el);
  $$("[data-ward]", el).forEach(b => b.onclick = () => openWardrobe(activeG()));
  $$("[data-item]", el).forEach(b => b.onclick = () => { play("click"); itemSheet(b.dataset.item); });
  $$("[data-go]", el).forEach(b => b.onclick = () => { play("click"); go(b.dataset.go); });
  $$("[data-wall]", el).forEach(b => b.onclick = () => { G.home.wall = b.dataset.wall; play("pop"); saveSoon(); render(); });
  $$("[data-floor]", el).forEach(b => b.onclick = () => { G.home.floor = b.dataset.floor; play("pop"); saveSoon(); render(); });
  $$("[data-rug]", el).forEach(b => b.onclick = () => { G.home.rug = b.dataset.rug || null; play("pop"); saveSoon(); render(); });
  $$("[data-slot]", el).forEach(b => b.onclick = () => {
    const i = +b.dataset.slot; const wallSpot = i >= 4; const dec = DECOR.filter(d => G.owned[d.id] && !!d.wall === wallSpot);
    const used = id => G.home.decor.filter(x => x === id).length;
    const m = openModal(`<h2>Pick decor</h2><div class="bag-grid">${dec.map(d => `<button class="bag-it" data-place="${d.id}" ${used(d.id) >= G.owned[d.id] && G.home.decor[i] !== d.id ? "disabled" : ""}><span class="ii big">${d.ico}</span><b>${esc(d.name)}</b></button>`).join("") || `<p class="muted">${wallSpot ? "No wall art yet! Buy some in the Wall art tab at Fluff Boutique." : "No furniture yet!"}</p>`}</div><div class="mrow"><button class="btn white" data-clear>Empty this spot</button></div>`);
    $$("[data-place]", m.el).forEach(x => x.onclick = () => { G.home.decor[i] = x.dataset.place; play("pop"); saveSoon(); m.close(); render(); });
    $("[data-clear]", m.el).onclick = () => { G.home.decor[i] = null; saveSoon(); m.close(); render(); };
  });
};

function emptyBag(title, text, route, label) { return `<div class="empty card"><b>${esc(title)}</b>${text ? `<p>${esc(text)}</p>` : ""}<button class="btn green" data-go="${route}">${label}</button></div>`; }
function bagVerb(it) {
  if (it.cat === "food") return "Feed";
  if (it.cat === "care" || it.cat === "toy") return "Use";
  if (it.cat === "box") return "Open!";
  if (it.cat === "seed" || it.id === "fertilizer") return "Plant";
  if (it.id === "haybale") return "Fill rack";
  if (it.cat === "slime") return "Make slime";
  if (it.cat === "love") return "Use on a date";
  if (it.sell) return "Sell";
  return "Look";
}
function openBoxFromBag(id) { if (!has(id)) return; addItem(id, -1); G.stats.boxes++; questProgress("box"); const rewards = openBoxRewards(id); rewards.forEach(grant); saveSoon(); revealSequence({ title: ITEM[id].name, ico: "🎁", line: "What could it be?!", box: ITEM[id].ico, rewards }, () => { checkAchievements(); render(); }); }
function itemSheet(id) {
  const it = ITEM[id], g = activeG();
  if (it.cat === "box") return openBoxFromBag(id);
  let btn = "", go2 = null, run = null;
  if (["food", "care", "toy"].includes(it.cat)) { btn = `${it.cat === "food" ? "🥕 Feed" : "✨ Use on"} ${esc(g.name)}`; run = () => { go("home"); setTimeout(() => useItem(activeG(), id), 450); }; }
  else if (it.cat === "seed" || it.id === "fertilizer" || it.id === "haybale") { btn = G.farm.level ? "🌾 Go to the Farm" : "🌾 Buy the Farm first"; go2 = "place/farm"; }
  else if (it.cat === "slime") { btn = "🧪 Go to the Slime Lab"; go2 = "place/lab"; }
  else if (it.cat === "love") { btn = "💕 Go to Guinea Date"; go2 = "date"; }
  else if (it.sell) { btn = `🛒 Sell at Squeakmart (${it.sell} coins)`; run = () => { shopTab.squeakmart = "sell"; go("shop/squeakmart"); }; }
  const m = openModal(`<div class="center"><div class="sheet-art">${itemIcon(id)}</div><h2>${esc(it.name)}</h2><p class="mtext">${esc(it.desc || "")}</p><p class="muted">You have ${G.inv[id]}</p><div class="mrow">${btn ? `<button class="btn green" data-a>${btn}</button>` : ""}<button class="btn white" data-ok>Close</button></div></div>`);
  $("[data-ok]", m.el).onclick = () => m.close();
  const a = $("[data-a]", m.el); if (a) a.onclick = () => { play("click"); m.close(); setTimeout(() => { if (run) run(); else go(go2); }, 200); };
}

/* ---------- BOOK ---------- */
let bookTab = "squishies";
VIEWS.book = (el) => {
  const tabs = [["squishies", "🍡 Squishies"], ["coats", "🧬 Guinea Types"], ["trophies", "🏆 Trophies"], ["stats", "📊 Stats"], ["settings", "⚙️ Settings"]];
  let body = "";
  if (bookTab === "squishies") {
    const n = Object.keys(G.squishies).length;
    body = `<p class="center"><b>${n}/32</b> collected. Buy them at the Squishy Shop (new ones every day!), or find them in packages and Squishy Rain. Tap one to see its home power.</p><div class="sq-grid">${SQUISHIES.map(s => { const c = G.squishies[s.id]; return `<button class="sq-cell ${c ? "" : "locked"}" data-sq="${s.id}">${squishySVG(s, !c)}<small>${c ? esc(s.name) : "???"}</small>${c > 1 ? `<span class="badge">${c}</span>` : ""}</button>`; }).join("")}</div>`;
  } else if (bookTab === "coats") {
    const list = Object.entries(G.coats).sort((a, b) => b[1].t - a[1].t);
    body = `<p class="center"><b>${list.length}</b> guinea types discovered. Breed and adopt to find more! There are hundreds.</p><div class="list">${list.map(([n, v]) => `<div class="row card"><span class="tier" style="--tc:${TIERS[v.t].c}">${TIERS[v.t].n}</span><b>${esc(n)}</b></div>`).join("")}</div>
      <div class="card note"><b>Rarity guide:</b> Fancy hair (Teddy, Abyssinian, Lionhead, Peruvian, Skinny), ruby or blue eyes and special patterns make a guinea rarer. Mutations (Golden, Slime, Ghost, Rainbow, Galaxy, Disco) are super rare!</div>`;
  } else if (bookTab === "trophies") {
    const got = ACHIEVEMENTS.filter(a => G.ach[a.id]).length;
    body = `<p class="center"><b>${got}/${ACHIEVEMENTS.length}</b> trophies</p><div class="trophies">${ACHIEVEMENTS.map(a => `<div class="tr ${G.ach[a.id] ? "got" : ""}"><span>${G.ach[a.id] ? a.ico : "🔒"}</span><b>${esc(a.n)}</b><small>${esc(a.d)}</small><em>${COIN}${a.r}</em></div>`).join("")}</div>`;
  } else if (bookTab === "stats") {
    const s = G.stats;
    body = `<div class="facts card">${[["Keeper level", G.level], ["Coins earned", fmt(s.earned)], ["Boops", fmt(s.boops)], ["Snacks fed", fmt(s.fed)], ["Games played", fmt(s.games)], ["Packages opened", s.packages], ["Blind boxes opened", s.boxes], ["Slimes made", s.slimes], ["Babies born", s.babies], ["Poops scooped", s.poop], ["Toots witnessed", s.toots], ["Biggest win", fmt(s.bigWin)], ["Days played", Math.max(1, Math.ceil((now() - G.created) / DAY))]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>`;
  } else {
    body = `<div class="settings">
      <button class="btn white" data-mute>${G.settings.muted ? "🔇 Sound is OFF" : "🔊 Sound is ON"}</button>
      ${cloudSettingsHTML()}
      ${window.__installPrompt ? `<button class="btn green" data-install>📲 Install Wheek World app</button>` : `<p class="muted">To install: open this page in Chrome, tap ⋮ then "Add to Home screen" or "Install app".</p>`}
      <div class="card note"><b>Backup your save</b><p>Your game is saved on this phone. Copy a backup code to keep it safe, or to move to another phone.</p><div class="row-btns"><button class="btn small sky" data-export>Copy backup code</button><button class="btn small white" data-import>Restore from code</button></div></div>
      <button class="btn white small" data-help>❓ How to play</button>
      <button class="btn white small danger" data-reset>Start over (delete everything)</button>
      <p class="muted center">Wheek World v1 · made with love for a guinea fan 💜</p></div>`;
  }
  el.innerHTML = `<div class="pad"><h1 class="page-t">📖 Wheekipedia</h1><div class="tabs scroll">${tabs.map(([k, n]) => `<button class="tab ${k === bookTab ? "on" : ""}" data-ktab="${k}">${n}</button>`).join("")}</div>${body}</div>`;
  $$("[data-ktab]", el).forEach(b => b.onclick = () => { bookTab = b.dataset.ktab; play("click"); render(); });
  $$("[data-sqslot]", el).forEach(b => b.onclick = () => { play("click"); sqPicker(+b.dataset.sqslot); });
  $$("[data-sq]", el).forEach(b => b.onclick = () => { const s = SQUISHIES.find(x => x.id === b.dataset.sq); if (!G.squishies[s.id]) { play("buzz"); return; } play("squish"); toast(`${s.name}: ${sqFxText(s.id)} ${sqPerkText(s.id)}`, "🍡"); const svg = $("svg", b); svg.classList.remove("squash"); void svg.getBoundingClientRect(); svg.classList.add("squash"); });
  const mu = $("[data-mute]", el); if (mu) mu.onclick = () => { G.settings.muted = !G.settings.muted; saveSoon(); render(); play("click"); };
  wireCloudSettings(el);
  const ins = $("[data-install]", el); if (ins) ins.onclick = async () => { const p = window.__installPrompt; window.__installPrompt = null; p.prompt(); try { await p.userChoice; } catch {} render(); };
  const ex = $("[data-export]", el); if (ex) ex.onclick = async () => { const code = btoa(unescape(encodeURIComponent(JSON.stringify(G)))); try { await navigator.clipboard.writeText(code); toast("Backup code copied! Paste it somewhere safe.", "💾"); } catch { const m = openModal(`<h2>Backup code</h2><p class="muted">Copy all of this:</p><textarea class="text-in code" readonly>${code}</textarea>`); $("textarea", m.el).select(); } };
  const im = $("[data-import]", el); if (im) im.onclick = () => { const m = openModal(`<h2>Restore save</h2><p class="muted">Paste a backup code. This replaces your current game!</p><textarea class="text-in code" id="imp"></textarea><div class="mrow"><button class="btn green" data-do>Restore</button></div>`); $("[data-do]", m.el).onclick = () => { try { const s = JSON.parse(decodeURIComponent(escape(atob($("#imp", m.el).value.trim())))); if (!s.guineas) throw 0; G = migrate(s); save(); m.close(); toast("Save restored!", "💾"); go("home"); } catch { toast("That code didn't work.", "❌"); } }; };
  const hp = $("[data-help]", el); if (hp) hp.onclick = () => showHelp();
  const rs = $("[data-reset]", el); if (rs) rs.onclick = async () => { if (!(await confirmBox("Start over?", "This deletes ALL your guineas, coins and stuff forever!", "Delete everything", "No way!"))) return; if (!(await confirmBox("Are you REALLY sure?", "There's no undo. Pudding will miss you.", "Yes, start over", "Keep my game"))) return; G = newGame(); save(); location.hash = "#/home"; location.reload(); };
};
function showHelp() {
  const m = openModal(`<h2>How to play</h2><div class="help">
    <p>🐹 <b>Look after your guineas.</b> Feed them, give baths and play. Hungry, dirty or bored guineas get sick.</p>
    <p>🪙 <b>Earn coins</b> in the Arcade, Carnival and Swamp, by making slime in the Slime Lab, scooping farm poop, and caring for hungry guineas.</p>
    <p>📦 <b>Packages arrive every hour</b> from weird couriers. Something new happens in the world every hour too!</p>
    <p>💕 <b>Breed guineas</b> with Guinea Dates. Babies can be rare. Mutations are SUPER rare.</p>
    <p>🌾 <b>Buy the Farm</b> to keep lots more guineas, grow veggies and get poop.</p>
    <p>🎂 Guineas grow up! Babies get bigger every hour. After 2 weeks they become Golden Oldies with silver fur, and later Wise Old Legends. They never die.</p>
    <p>😴 Tired guineas take naps, any time of day. Let them sleep to fill their energy.</p>
    <p>📋 Do daily quests and come back every day for streak gifts!</p></div><div class="mrow"><button class="btn green" data-ok>Got it!</button></div>`);
  $("[data-ok]", m.el).onclick = () => m.close();
}

/* ---------- SLIME LAB ---------- */
const LAB = { color: "#7be04a", adds: { glitter: true, eyes: true }, name: "" };
const NAME_A = ["Sir", "Grandma", "Captain", "Baby", "Professor", "Lady", "Big", "Tiny", "Mega", "Duke", "Auntie", "Lord"];
const NAME_B = ["Gloop", "Squelch", "Wobble", "Goober", "Jiggle", "Blorp", "Snotty", "Splorch", "Noodle", "Slurp", "Booger", "Gloopy"];
const NAME_C = ["ington", "-a-tron", " McSlime", " the Third", " Supreme", "ella", "y Pants", " of the Jar", " Jr.", "zilla"];
const slimeName = () => `${pick(NAME_A)} ${pick(NAME_B)}${pick(NAME_C)}`;
function jarSVG(sl) {
  const c = sl.color, a = sl.adds || {};
  let dots = "";
  if (a.glitter) dots += [[22, 46], [38, 52], [30, 60], [44, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join("");
  if (a.gold) dots += [[26, 58], [40, 48], [34, 66]].map(([x, y]) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#ffd84d" transform="rotate(30 ${x} ${y})"/>`).join("");
  if (a.beads) dots += [[20, 56], [34, 46], [42, 58]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="${["#fff", "#ffd84d", "#ff8fc7"][i]}" stroke="${K}" stroke-width="1"/>`).join("");
  if (a.hearts) dots += `<path d="M30 64c-4-3-4-6-2-6c1 0 2 1 2 2c0-1 1-2 2-2c2 0 2 3-2 6z" fill="#ff5fa8"/>`;
  if (a.ducks) dots += `<text x="38" y="66" font-size="9">🦆</text>`;
  if (a.eyes) dots += `<circle cx="26" cy="50" r="5" fill="#fff" stroke="${K}" stroke-width="1.5"/><circle cx="38" cy="50" r="5" fill="#fff" stroke="${K}" stroke-width="1.5"/><circle cx="27" cy="52" r="2.4" fill="${K}"/><circle cx="37" cy="52" r="2.4" fill="${K}"/>`;
  const glow = a.glow ? `<path d="M14 36C20 32 26 40 32 36S44 32 50 36V66Q50 70 46 70H18Q14 70 14 66Z" fill="#eaff7a" opacity=".35"/>` : "";
  return `<svg viewBox="0 0 64 76" aria-hidden="true"><rect x="16" y="4" width="32" height="10" rx="3" fill="#c7b3ff" stroke="${K}" stroke-width="3"/><path d="M12 18Q12 14 16 14H48Q52 14 52 18V66Q52 72 46 72H18Q12 72 12 66Z" fill="#ffffff" fill-opacity=".6" stroke="${K}" stroke-width="3"/><path d="M14 36C20 32 26 40 32 36S44 32 50 36V66Q50 70 46 70H18Q14 70 14 66Z" fill="${c}"/>${glow}${dots}<path d="M18 22V40" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg>`;
}
let lab = null;
function stopLab() { if (lab) { cancelAnimationFrame(lab.raf); removeEventListener("resize", lab.size); lab = null; } }
function makeAdds() {
  const r = () => Math.random() * Math.PI * 2, f = () => Math.sqrt(Math.random()) * .78;
  return {
    glitter: Array.from({ length: 55 }, () => ({ a: r(), f: f(), ph: Math.random() * 6, c: pick(["#ffffff", "#fff3a8", "#ffd1ec"]) })),
    gold: Array.from({ length: 30 }, () => ({ a: r(), f: f(), ph: Math.random() * 6, rot: Math.random() * 3 })),
    beads: Array.from({ length: 18 }, () => ({ a: r(), f: f(), c: pick(["#ffffff", "#ffd84d", "#ff8fc7", "#5fd3ff", "#c7b3ff"]), s: 4 + Math.random() * 4 })),
    hearts: Array.from({ length: 9 }, () => ({ a: r(), f: f(), s: 6 + Math.random() * 4, rot: (Math.random() - .5) })),
    stars: Array.from({ length: 9 }, () => ({ a: r(), f: f(), s: 5 + Math.random() * 4, rot: Math.random() })),
    ducks: Array.from({ length: 5 }, () => ({ a: r(), f: f() * .8, rot: (Math.random() - .5) * .6 })),
  };
}
function initLab(cv) {
  stopLab();
  const N = 48;
  lab = { cv, ctx: cv.getContext("2d"), N, pts: Array.from({ length: N }, () => ({ r: 0, v: 0 })), R: 100, cx: 0, cy: 0, hx: 0, hy: 0, vx: 0, vy: 0, grab: null, eyes: [{ ox: 0, oy: 0, vx: 0, vy: 0 }, { ox: 0, oy: 0, vx: 0, vy: 0 }], t: 0, raf: 0, adds: makeAdds() };
  lab.size = () => {
    if (!lab) return;
    const d = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * d; cv.height = h * d; lab.ctx.setTransform(d, 0, 0, d, 0, 0);
    lab.w = w; lab.h = h; lab.R = Math.min(w * .3, h * .34); lab.hx = w / 2; lab.hy = h * .52;
    lab.cx = lab.hx; lab.cy = lab.hy; lab.pts.forEach(p => { p.r = lab.R; p.v = 0; });
  };
  lab.size(); addEventListener("resize", lab.size);
  // only grab the finger when it lands ON the slime; anywhere else the page scrolls as normal
  cv.addEventListener("touchstart", e => { if (!lab) return; const t = e.touches[0]; const p = labPolar(t); if (p.d < rAt(p.a) * 1.15) e.preventDefault(); }, { passive: false });
  cv.addEventListener("pointerdown", labDown); cv.addEventListener("pointermove", labMove);
  cv.addEventListener("pointerup", labUp); cv.addEventListener("pointercancel", labUp);
  lab.raf = requestAnimationFrame(labStep);
}
function rAt(a) { const L = lab, N = L.N; let u = (a / (Math.PI * 2)) * N; u = ((u % N) + N) % N; const i = Math.floor(u), j = (i + 1) % N, f = u - i; return L.pts[i].r * (1 - f) + L.pts[j].r * f; }
function labPolar(e) { const r = lab.cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; const dx = x - lab.cx, dy = (y - lab.cy) / .85; let a = Math.atan2(dy, dx); if (a < 0) a += Math.PI * 2; return { x, y, a, d: Math.hypot(dx, dy) }; }
function labDown(e) { const p = labPolar(e); getAC(); if (p.d < rAt(p.a) * 1.2) { lab.grab = { ...p, sx: p.x, sy: p.y, t: performance.now(), max: p.d, snd: false }; try { lab.cv.setPointerCapture(e.pointerId); } catch {} e.preventDefault(); } }
function labMove(e) { const g = lab && lab.grab; if (!g) return; const p = labPolar(e); Object.assign(g, { x: p.x, y: p.y, a: p.a, d: Math.min(p.d, lab.R * 2.4) }); g.max = Math.max(g.max, g.d); if (g.d > lab.R * 1.5 && !g.snd) { g.snd = true; play("stretch"); } }
function labUp(e) {
  const g = lab && lab.grab; if (!g) return;
  const moved = Math.hypot(g.x - g.sx, g.y - g.sy);
  if (moved < 10 && performance.now() - g.t < 400) { lab.pts.forEach((p, i) => { const ang = i / lab.N * Math.PI * 2; let d = Math.abs(ang - g.a); d = Math.min(d, Math.PI * 2 - d); p.v -= lab.R * .16 * Math.exp(-(d * d) / .18); }); lab.vy += 4; play("squelch"); floatText(e.clientX, e.clientY - 10, pick(["squish!", "sploosh!", "blorp!", "squelch!", "splat!"]), "#2f7d14", 22); }
  else if (g.max > lab.R * 1.45) { play("thwop"); floatText(e.clientX, e.clientY - 10, pick(["THWOP!", "boing!", "sproing!"]), "#e8458f", 24); }
  lab.grab = null;
}
function labStep() {
  const L = lab; if (!L) return;
  L.t++;
  const { pts, N, R, ctx } = L, g = L.grab;
  const tx = g ? L.hx + (g.x - L.hx) * .12 : L.hx, ty = g ? L.hy + (g.y - L.hy) * .12 : L.hy;
  L.vx += (tx - L.cx) * .08; L.vy += (ty - L.cy) * .08; L.vx *= .82; L.vy *= .82; L.cx += L.vx; L.cy += L.vy;
  for (let i = 0; i < N; i++) {
    const p = pts[i], a = pts[(i + N - 1) % N].r, b = pts[(i + 1) % N].r;
    const idle = reduceMotion ? 0 : Math.sin(L.t / 22 + i * .5) * .05;
    p.v += (R - p.r) * .05 + (a + b - 2 * p.r) * .22 + idle;
    if (g) { const ang = i / N * Math.PI * 2; let d = Math.abs(ang - g.a); d = Math.min(d, Math.PI * 2 - d); const w = Math.exp(-(d * d) / (2 * .3 * .3)); if (g.d > R * .9) p.v += (R + (g.d - R) * w - p.r) * .25 * w; }
  }
  for (const p of pts) { p.v *= .86; p.r = Math.max(R * .35, Math.min(R * 2.6, p.r + p.v)); }
  ctx.clearRect(0, 0, L.w, L.h);
  ctx.fillStyle = "rgba(43,22,64,.14)"; ctx.beginPath(); ctx.ellipse(L.hx, L.hy + R * .95, R * 1.15, R * .16, 0, 0, 6.29); ctx.fill();
  const xy = pts.map((p, i) => { const a = i / N * Math.PI * 2; return [L.cx + Math.cos(a) * p.r, L.cy + Math.sin(a) * p.r * .85]; });
  const mid = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
  const path = () => { ctx.beginPath(); const m0 = mid(xy[N - 1], xy[0]); ctx.moveTo(m0[0], m0[1]); for (let i = 0; i < N; i++) { const m = mid(xy[i], xy[(i + 1) % N]); ctx.quadraticCurveTo(xy[i][0], xy[i][1], m[0], m[1]); } ctx.closePath(); };
  const col = LAB.color, gr = ctx.createRadialGradient(L.cx - R * .35, L.cy - R * .4, R * .1, L.cx, L.cy, R * 1.5);
  gr.addColorStop(0, shadeHex(col, .45)); gr.addColorStop(.55, col); gr.addColorStop(1, shadeHex(col, -.35));
  if (LAB.adds.glow) { ctx.save(); ctx.shadowColor = "#eaff7a"; ctx.shadowBlur = 30 + Math.sin(L.t / 15) * 10; path(); ctx.fillStyle = gr; ctx.fill(); ctx.restore(); }
  path(); ctx.fillStyle = gr; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = K; ctx.stroke();
  ctx.save(); path(); ctx.clip();
  const pos = (a, f) => { const r = rAt(a) * f; return [L.cx + Math.cos(a) * r, L.cy + Math.sin(a) * r * .85]; };
  const A = LAB.adds, ad = L.adds;
  if (A.beads) for (const b of ad.beads) { const [x, y] = pos(b.a, b.f); ctx.fillStyle = b.c; ctx.strokeStyle = "rgba(43,22,64,.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, b.s, 0, 6.29); ctx.fill(); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(x - b.s * .3, y - b.s * .3, b.s * .3, 0, 6.29); ctx.fill(); }
  if (A.hearts) for (const h of ad.hearts) { const [x, y] = pos(h.a, h.f); ctx.save(); ctx.translate(x, y); ctx.rotate(h.rot); ctx.fillStyle = "#ff5fa8"; heartPath(ctx, h.s); ctx.fill(); ctx.restore(); }
  if (A.stars) for (const s of ad.stars) { const [x, y] = pos(s.a, s.f); ctx.save(); ctx.translate(x, y); ctx.rotate(s.rot + L.t / 120); ctx.fillStyle = "#fff3a8"; ctx.strokeStyle = K; ctx.lineWidth = 1.5; starPath(ctx, s.s); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (A.ducks) for (const s of ad.ducks) { const [x, y] = pos(s.a, s.f); ctx.save(); ctx.translate(x, y); ctx.rotate(s.rot + Math.sin(L.t / 20) * .1); ctx.font = "18px sans-serif"; ctx.textAlign = "center"; ctx.fillText("🦆", 0, 6); ctx.restore(); }
  if (A.gold) for (const s of ad.gold) { const [x, y] = pos(s.a, s.f); const z = 3 + Math.max(0, Math.sin(L.t / 11 + s.ph)) * 3; ctx.save(); ctx.translate(x, y); ctx.rotate(s.rot); ctx.fillStyle = "#ffd84d"; ctx.strokeStyle = "#b88a00"; ctx.lineWidth = 1; ctx.fillRect(-z / 2, -z / 2, z, z); ctx.strokeRect(-z / 2, -z / 2, z, z); ctx.restore(); }
  if (A.glitter) for (const s of ad.glitter) { const [x, y] = pos(s.a, s.f), z = 1.2 + Math.max(0, Math.sin(L.t / 9 + s.ph)) * 2.2; ctx.fillStyle = s.c; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-z / 2, -z / 2, z, z); ctx.restore(); }
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.ellipse(L.cx - R * .38, L.cy - R * .45, R * .26, R * .11, -.5, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.arc(L.cx - R * .08, L.cy - R * .58, R * .05, 0, 6.29); ctx.fill();
  if (A.eyes) {
    const avg = (rAt(Math.PI * 1.25) + rAt(Math.PI * 1.75)) / 2 / R, er = R * .17;
    [[-.33, -.18], [.33, -.18]].forEach(([fx, fy], k) => {
      const ex = L.cx + fx * R * avg, ey = L.cy + fy * R * avg, e = L.eyes[k];
      e.vx += -L.vx * .45 - e.ox * .06; e.vy += .55 - L.vy * .45 - e.oy * .06; e.vx *= .86; e.vy *= .86; e.ox += e.vx; e.oy += e.vy;
      const len = Math.hypot(e.ox, e.oy), mx = er * .48; if (len > mx) { e.ox *= mx / len; e.oy *= mx / len; e.vx *= -.4; e.vy *= -.4; }
      ctx.fillStyle = "#fff"; ctx.strokeStyle = K; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 6.29); ctx.fill(); ctx.stroke();
      ctx.fillStyle = K; ctx.beginPath(); ctx.arc(ex + e.ox, ey + e.oy, er * .5, 0, 6.29); ctx.fill();
    });
    ctx.strokeStyle = K; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(L.cx, L.cy + R * .12 * avg, R * .16, .2, Math.PI - .2); ctx.stroke();
  }
  L.raf = requestAnimationFrame(labStep);
}
PLACE_VIEWS.lab = (el) => {
  if (!LAB.name) LAB.name = slimeName();
  const ord = slimeOrder();
  const tide = eventOn("slimetide");
  const unlocked = k => { const a = ADDINS.find(x => x[0] === k); return !a[2] || G.owned["addin_" + k]; };
  el.innerHTML = placeHeader("lab", tide ? `<span class="sale-tag">x2 SLIME TIDE</span>` : "") + `<div class="pad">
    ${npcBox("gloop")}
    <div class="order card">📋 <b>Order of the Hour:</b> a <span class="dot" style="background:${ord.color}"></span><b>${esc(ord.colorName)}</b> slime with <b>${esc(ord.addName)}</b>. Pays <b>3x!</b> <small>(${minsLeftInHour()}m left)</small></div>
    <div class="lab-box card">
      <canvas id="slimeCv" class="slime-cv" aria-label="Your slime. Tap to poke, drag to stretch."></canvas>
      <p class="hint center">Tap to poke. Drag to stretch!</p>
      <h3 class="sub">Colour</h3>
      <div class="swatches">${SLIME_COLORS.map(([c, n]) => `<button class="swatch ${LAB.color === c ? "on" : ""}" data-col="${c}" style="background:${c}" aria-label="${n}"></button>`).join("")}</div>
      <h3 class="sub">Mix-ins</h3>
      <div class="chips">${ADDINS.map(([k, n, pr]) => unlocked(k) ? `<button class="chip ${LAB.adds[k] ? "on" : ""}" data-add="${k}">${esc(n)}</button>` : `<button class="chip locked" data-unlock="${k}">🔒 ${esc(n)} ${COIN}${pr}</button>`).join("")}</div>
      <div class="name-row"><input class="text-in" id="slimeName" maxlength="32" value="${esc(LAB.name)}"><button class="btn small white" id="rename">🎲</button></div>
      <button class="btn green big" id="make">${has("slimekit") ? `Make it! (uses 1 🧪, you have ${G.inv.slimekit})` : `Buy Slime Kit & make it ${COIN}${price(ITEM.slimekit)}`}</button>
    </div>
    <h2 class="sec">Slime Shelf <span class="count">${G.slimes.length}/12</span></h2>
    ${G.slimes.length ? `<div class="jars">${G.slimes.map((s, i) => `<div class="jar card"><button class="jar-art" data-jar="${i}">${jarSVG(s)}</button><b>${esc(s.name)}</b><button class="btn small pink" data-sellslime="${i}">Sell to Dr. Gloop</button></div>`).join("")}</div>` : `<p class="muted center">Make a slime to start your shelf! Dr. Gloop buys slime: the more mix-ins, the more it's worth. And sometimes he goes CRAZY for one...</p>`}
  </div>`;
  wireCommon(el);
  initLab($("#slimeCv", el));
  $$("[data-col]", el).forEach(b => b.onclick = () => { LAB.color = b.dataset.col; $$("[data-col]", el).forEach(x => x.classList.toggle("on", x === b)); play("squelch"); if (lab) lab.vy -= 6; });
  $$("[data-add]", el).forEach(b => b.onclick = () => { const k = b.dataset.add; LAB.adds[k] = !LAB.adds[k]; b.classList.toggle("on", LAB.adds[k]); play("pop"); if (lab) { lab.vy -= 5; if (k !== "eyes" && k !== "glow") lab.adds[k] = makeAdds()[k]; } });
  $$("[data-unlock]", el).forEach(b => b.onclick = () => { const k = b.dataset.unlock, a = ADDINS.find(x => x[0] === k); if (!spendCoins(a[2])) return; G.owned["addin_" + k] = 1; recordBuy({ type: "addin", id: k, price: a[2], name: a[1] }); LAB.adds[k] = true; play("unlock"); toast(`${a[1]} unlocked forever!`, "🧪"); saveSoon(); render(); });
  const ni = $("#slimeName", el); ni.oninput = () => LAB.name = ni.value;
  $("#rename", el).onclick = () => { LAB.name = slimeName(); ni.value = LAB.name; play("giggle"); };
  $("#make", el).onclick = () => {
    if (G.slimes.length >= 12) { play("buzz"); toast("Your shelf is full! Sell a slime first.", "🧪"); return; }
    if (!has("slimekit")) { if (!spendCoins(price(ITEM.slimekit))) return; addItem("slimekit", 1); }
    addItem("slimekit", -1);
    const name = (LAB.name || "").trim() || slimeName();
    G.slimes.push({ color: LAB.color, adds: { ...LAB.adds }, name, h: hourIdx() });
    G.stats.slimes++; questProgress("slime"); addXP(8); tutMark("slime");
    play("thwop"); setTimeout(() => play("win"), 200); confetti(innerWidth / 2, innerHeight / 2, 80);
    toast(`${name} is in a jar!`, "🧪"); LAB.name = slimeName(); saveSoon(); checkAchievements(); render();
  };
  $$("[data-jar]", el).forEach(b => b.onclick = () => { const s = G.slimes[+b.dataset.jar]; Object.assign(LAB, { color: s.color, adds: { ...s.adds } }); play("squelch"); render(); });
  $$("[data-sellslime]", el).forEach(b => b.onclick = () => sellSlime(+b.dataset.sellslime));
  return () => stopLab();
};
function sellSlime(i) {
  const s = G.slimes[i]; if (!s) return;
  const ord = slimeOrder();
  const base = slimeBase(s);
  // the appraisal is locked to the slime, so backing out and trying again can't re-roll the price
  if (s.ap == null || !APPRAISE[s.ap]) { s.ap = APPRAISE.indexOf(weighted(APPRAISE)); saveSoon(); }
  const roll = APPRAISE[s.ap], seen = !!s.apSeen;
  const matches = s.color === ord.color && s.adds[ord.add];
  let mult = roll.m * (matches ? 3 : 1) * (eventOn("slimetide") ? 2 : 1);
  const value = Math.max(5, Math.round(base * mult));
  const m = openModal(`<div class="center appraise"><p class="kicker">Dr. Gloop is examining...</p><div class="ap-jar">${jarSVG(s)}</div><h2>${esc(s.name)}</h2><div class="ap-num" id="apNum">🔍</div><p class="mtext" id="apTxt">Hmmmm... *sniff* *poke* *lick*...</p><div class="mrow" id="apDone" hidden><button class="btn white" data-keep>Keep it</button><button class="btn green" data-ok>Sell it!</button></div></div>`, { onClose: () => clearInterval(iv) });
  let k = 0; const num = $("#apNum", m.el);
  let iv = 0;
  if (seen) reveal(true);
  else { play("drum"); iv = setInterval(() => { num.textContent = COIN_TXT(rint(5, base * 3)); play("tick"); if (++k > 14) { clearInterval(iv); reveal(); } }, 90); }
  function reveal(quiet) {
    s.apSeen = 1; saveSoon();
    num.innerHTML = `${COIN}<b>${fmt(value)}</b>`; num.classList.add("pop");
    $("#apDone", m.el).hidden = false;
    if (quiet) { $("#apTxt", m.el).innerHTML = `<b>${esc(roll.t)}</b>${matches ? " + ORDER MATCH x3!" : ""}${eventOn("slimetide") ? " + SLIME TIDE x2!" : ""}<br><small>Dr. Gloop already checked this one.</small>`; play("pop"); return; }
    $("#apTxt", m.el).innerHTML = `<b>${esc(roll.t)}</b>${matches ? " + ORDER MATCH x3!" : ""}${eventOn("slimetide") ? " + SLIME TIDE x2!" : ""}`;
    if (roll.m >= 3 || value >= 150) { play("bigwin"); confetti(innerWidth / 2, innerHeight / 2, 140); document.body.classList.add("flash"); setTimeout(() => document.body.classList.remove("flash"), 500); } else if (roll.m >= 1.5 || matches) play("win"); else play("pop");
    $("#apDone", m.el).hidden = false;
  }
  $("[data-keep]", m.el).onclick = () => { play("click"); m.close(); };
  $("[data-ok]", m.el).onclick = () => { G.slimes.splice(i, 1); if (value > (G.stats.bigWin || 0)) G.stats.bigWin = value; addCoins(value, [innerWidth / 2, innerHeight / 2]); addXP(5); m.close(); setTimeout(render, 250); };
}
const COIN_TXT = n => "🪙 " + n;
