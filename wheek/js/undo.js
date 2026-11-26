/* Wheek World: undo your last purchase (full refund), as long as the thing hasn't been used up. */
"use strict";
function recordBuy(rec) {
  rec.at = now();
  if (rec.type === "build") rec.builtBefore = (G.stats.built || 0) - 1;
  G.lastBuy = rec; saveSoon();
  showUndoBar(rec);
}
function undoLabel(rec) { return rec.type === "love" ? `❤️${fmtBig(rec.price)}` : `🪙${fmt(rec.price)}`; }
function showUndoBar(rec) {
  let bar = $("#undoBar");
  if (!bar) { bar = document.createElement("div"); bar.id = "undoBar"; document.body.appendChild(bar); }
  bar.innerHTML = `<span>Bought <b>${esc(rec.name)}</b></span><button class="btn small white" id="undoBtn">↩️ Undo</button>`;
  bar.classList.remove("show"); void bar.offsetWidth; bar.classList.add("show");
  $("#undoBtn", bar).onclick = () => { bar.classList.remove("show"); undoBuy(); };
  clearTimeout(bar._t); bar._t = setTimeout(() => bar.classList.remove("show"), 7000);
}
function undoButtonHTML() {
  const r = G.lastBuy; if (!r) return "";
  return `<button class="undo-link" data-undo>↩️ Undo last buy: ${esc(r.name)} (${undoLabel(r)} back)</button>`;
}
function wireUndo(el) { $$("[data-undo]", el).forEach(b => b.onclick = () => { play("click"); undoBuy(); }); }
function undoBuy() {
  const r = G.lastBuy; if (!r) { toast("Nothing to undo!", "↩️"); return; }
  const fail = msg => { play("buzz"); toast(msg, "↩️"); };
  const it = ITEM[r.id];
  switch (r.type) {
    case "item": if ((G.inv[r.id] || 0) < (r.n || 1)) return fail(`Can't undo: the ${r.name} was already used.`); addItem(r.id, -(r.n || 1)); break;
    case "own":
      delete G.owned[r.id];
      G.guineas.forEach(g => { for (const k of Object.keys(g.outfit || {})) if (g.outfit[k] === r.id) delete g.outfit[k]; });
      if (G.home.wall === r.id) G.home.wall = "w_lilac"; if (G.home.floor === r.id) G.home.floor = "f_wood"; if (G.home.rug === r.id) G.home.rug = null;
      break;
    case "decor":
      G.owned[r.id] = (G.owned[r.id] || 1) - 1; if (G.owned[r.id] <= 0) delete G.owned[r.id];
      { let extra = G.home.decor.filter(d => d === r.id).length - (G.owned[r.id] || 0); for (let i = G.home.decor.length - 1; i >= 0 && extra > 0; i--) if (G.home.decor[i] === r.id) { G.home.decor[i] = null; extra--; } }
      break;
    case "squishy": if (!G.squishies[r.sq]) return fail("Can't undo that one."); G.squishies[r.sq]--; if (G.squishies[r.sq] <= 0) delete G.squishies[r.sq]; break;
    case "build": {
      const s = (G.farm.grid || []).find(q => q.id === r.uid); if (!s) return fail("Can't undo: it's not on the farm any more.");
      const b = FB[s.t]; if (b.cap && farmCapacity() - b.cap < farmList().length) return fail("Can't undo: guineas live there now!");
      if (b.cat === "shop") { const st = Math.floor(shopStored(s)); if (st) addCoins(st); }
      G.farm.grid = G.farm.grid.filter(q => q !== s); if (s.t === "hayrack") G.farm.hay = Math.max(0, G.farm.hay - 10);
      break;
    }
    case "upgrade": { const s = (G.farm.grid || []).find(q => q.id === r.uid); if (!s || (s.lv || 1) <= 1) return fail("Can't undo that upgrade."); s.lv--; break; }
    case "land": if ((G.farm.grid || []).some(s => s.y >= G.farm.rows - 2)) return fail("Can't undo: you built on the new land!"); G.farm.rows -= 2; break;
    case "farm": if (farmList().length || (G.stats.built || 0) !== r.builtAt) return fail("Can't undo: your farm is already in use!"); G.farm.level = 0; G.farm.grid = null; break;
    case "adopt": {
      const g = G.guineas.find(x => x.id === r.gid); if (!g) return fail("Can't undo: that guinea isn't here any more.");
      if (G.guineas.length <= 1) return fail("Can't undo your only guinea!");
      G.guineas = G.guineas.filter(x => x !== g); if (G.active === g.id) G.active = G.guineas[0].id; if (G.adopt && G.adopt.sold) delete G.adopt.sold[r.key];
      break;
    }
    case "addin": delete G.owned["addin_" + r.id]; if (typeof LAB !== "undefined") LAB.adds[r.id] = false; break;
    case "love": {
      const l = L();
      if (r.kind === "up") { delete l.ups[r.id]; } else { if (!l.helpers[r.id]) return fail("Can't undo that."); l.helpers[r.id]--; }
      l.lp += r.price; G.lastBuy = null; play("pop"); toast(`Undone! ${fmtBig(r.price)} ❤️ back.`, "↩️"); saveSoon(); render(); return;
    }
    default: return fail("That can't be undone.");
  }
  G.coins += r.price; G.stats.spent = Math.max(0, (G.stats.spent || 0) - r.price); renderCoins();
  G.lastBuy = null; play("pop"); toast(`Undone! ${fmt(r.price)} coins back.`, "↩️"); saveSoon(); render();
}
