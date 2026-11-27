/* Wheek World: squishies on the home shelf. Tap to boop, hold to squish (slow-rise!), drag to pull and
   let go to SNAP. Every squishy feels different and does something special to your guinea, and while it
   sits on the shelf it gives a small bonus to every guinea. Buy more shelf spots in the Squishy Shop. */
"use strict";

const SQ_SLOT_PRICES = [0, 0, 300, 650, 1100, 1800];   // spots 1-2 free, then 3..6
const SQ_SLOTS_MAX = 6;
const SQ_FX = {
  antigrav: { t: "Zero gravity! Your guinea floats up into the air!", ico: "🪐" },
  sleep: { t: "So soft and cosy your guinea falls fast asleep!", ico: "😴" },
  ghost: { t: "Your guinea turns see-through like a spooky ghost!", ico: "👻" },
  disco: { t: "DISCO PARTY! The lights flash and your guinea dances!", ico: "🪩" },
  rainbow: { t: "Your guinea's fur turns every colour of the rainbow!", ico: "🌈" },
  toot: { t: "Squeeze it and your guinea does a giant TOOT!", ico: "💨" },
  hop: { t: "Your guinea hops around like a frog!", ico: "🐸" },
  zoom: { t: "Your guinea gets the ZOOMIES!", ico: "💨" },
  nibble: { t: "Looks so yummy your guinea tries to nibble it (+food)!", ico: "😋" },
  giant: { t: "Your guinea puffs up GIANT like a mochi!", ico: "🎈" },
  tiny: { t: "Your guinea shrinks down teeny tiny!", ico: "🤏" },
  meow: { t: "Your guinea thinks it's a cat. Meow?", ico: "🐱" },
  golden: { t: "Your guinea turns to GOLD and drops coins!", ico: "🪙" },
  roar: { t: "RAWR! Your guinea does a dino roar!", ico: "🦖" },
  lava: { t: "Spicy! Your guinea goes red-hot and steams!", ico: "🔥" },
  bubbles: { t: "Bubbles everywhere! Your guinea gets a little cleaner.", ico: "🫧" },
  sour: { t: "SOUR! Your guinea makes the funniest face!", ico: "😝" },
  toast: { t: "POP! Your guinea jumps up like toast!", ico: "🍞" },
  sparkle: { t: "Magic sparkles and a big burst of Love!", ico: "✨" },
};
const SQ_PERK = {
  food: { t: "Food goes down slower", ico: "🍽️" }, joy: { t: "Fun goes down slower", ico: "🎈" }, clean: { t: "Clean goes down slower", ico: "🫧" },
  love: { t: "More Love per boop", ico: "💖" }, energy: { t: "Naps recharge faster", ico: "⚡" }, helpers: { t: "Boop Helpers work faster", ico: "🤖" },
};
/* fx, perk, and feel: soft (squish depth), rise (ms to slow-rise back), stretch (how far it pulls), pitch */
const SQ_HOME = {
  mochi: ["giant", "love"], toast: ["toast", "food"], berry: ["nibble", "food"], cat: ["meow", "joy"], cloud: ["antigrav", "energy"],
  frog: ["hop", "joy"], bunny: ["zoom", "joy"], avo: ["nibble", "food"], potato: ["tiny", "clean"], peach: ["toot", "joy"],
  galaxy: ["antigrav", "love"], disco: ["disco", "joy"], ghost: ["ghost", "clean"], pinkcat: ["meow", "love"],
  gold: ["golden", "helpers"], rainbow: ["rainbow", "love"],
  sleepy: ["sleep", "energy"], banana: ["nibble", "food"], blueberry: ["nibble", "food"], marsh: ["sleep", "energy"],
  pickle: ["sour", "food"], candy: ["antigrav", "energy"], jellyfrog: ["hop", "joy"], melon: ["nibble", "food"],
  tofu: ["giant", "clean"], dino: ["roar", "joy"], lava: ["lava", "energy"], mermaid: ["bubbles", "clean"],
  unicorn: ["sparkle", "love"], ghosttoast: ["ghost", "clean"], tinypud: ["golden", "helpers"], starblob: ["antigrav", "love"],
};
const SHAPE_FEEL = {
  blob: { soft: .55, rise: 2200, stretch: 1.9, pitch: 1 }, toast: { soft: .35, rise: 500, stretch: 1.35, pitch: 1.3 },
  berry: { soft: .45, rise: 900, stretch: 1.5, pitch: 1.2 }, cat: { soft: .4, rise: 450, stretch: 1.6, pitch: 1.6 },
  cloud: { soft: .65, rise: 2800, stretch: 1.3, pitch: .8 }, frog: { soft: .4, rise: 300, stretch: 2.1, pitch: 1.4 },
  bunny: { soft: .45, rise: 700, stretch: 1.7, pitch: 1.5 }, pear: { soft: .5, rise: 1300, stretch: 1.55, pitch: .95 },
  peach: { soft: .5, rise: 1100, stretch: 1.6, pitch: .9 }, pig: { soft: .45, rise: 1000, stretch: 1.6, pitch: 1.1 },
};
const sqDef = id => SQUISHIES.find(s => s.id === id);
function sqInfo(id) {
  const s = sqDef(id); if (!s) return null;
  const [fx, perk] = SQ_HOME[id] || ["sparkle", "love"];
  const f = Object.assign({}, SHAPE_FEEL[s.shape] || SHAPE_FEEL.blob);
  const h = hashStr("feel" + id); f.pitch *= .85 + (h % 30) / 100; f.rise *= .8 + ((h >> 5) % 40) / 100;
  const pv = s.r === "legendary" ? .15 : s.r === "rare" ? .1 : .05;
  return { s, fx, perk, pv, feel: f };
}
function sqHome() { if (!G.sqHome) G.sqHome = { slots: 2, items: [] }; while (G.sqHome.items.length < G.sqHome.slots) G.sqHome.items.push(null); return G.sqHome; }
/* passive bonus from everything on the shelf (each type capped at 30%) */
function sqPerk(kind) {
  if (!G || !G.sqHome) return 0;
  let v = 0; for (const id of G.sqHome.items) { if (!id) continue; const i = sqInfo(id); if (i && i.perk === kind) v += i.pv; }
  return Math.min(.3, v);
}
const sqFxText = id => { const i = sqInfo(id); return i ? `${SQ_FX[i.fx].ico} ${SQ_FX[i.fx].t}` : ""; };
const sqPerkText = id => { const i = sqInfo(id); return i ? `${SQ_PERK[i.perk].ico} On your shelf: ${SQ_PERK[i.perk].t} (+${Math.round(i.pv * 100)}%)` : ""; };

/* ---------- the shelf in the home room ---------- */
function shelfHTML() {
  const H = sqHome();
  const cells = H.items.map((id, i) => {
    const info = id && sqInfo(id);
    return info ? `<button class="sqh" data-sqh="${i}" aria-label="${esc(info.s.name)}"><span class="sqh-body">${squishySVG(info.s)}</span></button>` : `<button class="sqh empty" data-sqadd="${i}" aria-label="Put a squishy here">＋</button>`;
  });
  if (H.slots < SQ_SLOTS_MAX) cells.push(`<button class="sqh locked" data-sqbuy aria-label="Buy another shelf spot">🔒<small>${fmt(SQ_SLOT_PRICES[H.slots])}</small></button>`);
  return `<div class="sq-shelf" id="sqShelf" style="--n:${cells.length}">${cells.join("")}</div>`;
}
const SQH = { live: 0, cd: {}, taps: {} };
function sqShelfInit(g, room) {
  const live = ++SQH.live;
  $$("[data-sqadd]", room).forEach(b => b.onclick = () => { play("click"); sqPicker(+b.dataset.sqadd); });
  const bb = $("[data-sqbuy]", room); if (bb) bb.onclick = () => { play("click"); buySqSlot(); };
  $$("[data-sqh]", room).forEach(b => wireSquishy(b, g, live));
}
function wireSquishy(btn, g, live) {
  const id = sqHome().items[+btn.dataset.sqh], info = sqInfo(id); if (!info) return;
  const body = $(".sqh-body", btn), F = info.feel;
  let st = null, holdT = 0;
  const set = (sx, sy, rot = 0, tx = 0, ty = 0) => { body.style.transform = `translate(${tx}px,${ty}px) rotate(${rot}rad) scale(${sx},${sy}) rotate(${-rot}rad)`; };
  const cancelAnims = () => body.getAnimations().forEach(a => a.cancel());
  btn.addEventListener("pointerdown", e => {
    if (SQH.live !== live) return;
    e.preventDefault(); e.stopPropagation(); getAC();
    try { btn.setPointerCapture(e.pointerId); } catch {}
    cancelAnims();
    const r = btn.getBoundingClientRect();
    st = { id: e.pointerId, x0: e.clientX, y0: e.clientY, cx: r.left + r.width / 2, cy: r.top + r.height / 2, mode: "tap", t0: performance.now(), sq: 0, raf: 0 };
    clearTimeout(holdT);
    holdT = setTimeout(() => { if (st && st.mode === "tap") { st.mode = "hold"; squeakTone(F.pitch * .8, .12); squeezeLoop(); } }, 170);
  });
  function squeezeLoop() {
    if (!st || st.mode !== "hold") return;
    st.sq = Math.min(1, st.sq + .045);
    const k = F.soft * easeOut(st.sq);
    set(1 + k * .55, 1 - k, 0, 0, k * 10);
    if (Math.random() < .25) haptic(4);
    st.raf = requestAnimationFrame(squeezeLoop);
  }
  btn.addEventListener("pointermove", e => {
    if (!st || e.pointerId !== st.id) return;
    const dx = e.clientX - st.x0, dy = e.clientY - st.y0, d = Math.hypot(dx, dy);
    if (st.mode !== "pull" && d > 12) { st.mode = "pull"; cancelAnimationFrame(st.raf); squeakTone(F.pitch * 1.2, .08); }
    if (st.mode === "pull") {
      const max = 26 + 38 * (F.stretch - 1), pull = Math.min(d, max * 2.2), k = pull / 70 * (F.stretch - 1);
      const a = Math.atan2(dy, dx);
      st.pull = { a, k: Math.min(F.stretch - 1, k), tx: Math.cos(a) * Math.min(pull, max) * .5, ty: Math.sin(a) * Math.min(pull, max) * .5 };
      set(1 + st.pull.k, 1 / (1 + st.pull.k * .7), a, st.pull.tx, st.pull.ty);
      if (st.pull.k > (F.stretch - 1) * .95 && !st.maxed) { st.maxed = 1; haptic(10); squeakTone(F.pitch * 1.6, .06); }
    }
  });
  const end = e => {
    if (!st || e.pointerId !== st.id) return;
    clearTimeout(holdT); cancelAnimationFrame(st.raf);
    const s = st; st = null;
    const [cx, cy] = centerOf(btn);
    if (s.mode === "pull" && s.pull) {                     // SNAP back with a wobble
      const { a, k, tx, ty } = s.pull, frames = [];
      for (let i = 0; i <= 24; i++) { const t = i / 24, f = Math.exp(-t * 5) * Math.cos(t * 22); frames.push({ transform: `translate(${tx * f}px,${ty * f}px) rotate(${a}rad) scale(${1 + k * f},${1 / (1 + k * .7 * f)}) rotate(${-a}rad)` }); }
      body.animate(frames, { duration: 650, easing: "linear" }).finished.then(() => body.style.transform = "").catch(() => {});
      body.style.transform = "";
      play("pop"); squeakTone(F.pitch * .7, .14, 1.4); haptic(15);
      bits("dot", cx + tx, cy + ty, 10, { c: [info.s.c, "#fff"], v: 3, up: 2, s: 4, life: 35 });
      sqAct(g, id, cx, cy, "pull", k / Math.max(.01, F.stretch - 1));
    } else if (s.mode === "hold") {                        // slow rise
      const k = F.soft * easeOut(s.sq);
      const from = `translate(0px,${k * 10}px) scale(${1 + k * .55},${1 - k})`;
      body.animate([{ transform: from }, { transform: `translate(0px,${k * 4}px) scale(${1 + k * .3},${1 - k * .55})`, offset: .35 }, { transform: "translate(0,0) scale(1.04,.97)", offset: .9 }, { transform: "none" }], { duration: F.rise * (.5 + s.sq * .7), easing: "cubic-bezier(.2,.7,.3,1)" }).finished.then(() => body.style.transform = "").catch(() => {});
      body.style.transform = "";
      play("squish"); squeakTone(F.pitch * .55, .35, .7);
      bits("dot", cx, cy, 6, { c: [info.s.c, "#fff"], v: 1.2, up: 1, g: -.02, s: 3, life: 50 });
      sqAct(g, id, cx, cy, "squeeze", s.sq);
    } else {                                               // boop
      const frames = []; for (let i = 0; i <= 16; i++) { const t = i / 16, f = Math.exp(-t * 6) * Math.sin(t * 18); frames.push({ transform: `scale(${1 + .22 * f},${1 - .22 * f})` }); }
      body.animate(frames, { duration: 420 }).finished.catch(() => {});
      body.style.transform = "";
      squeakTone(F.pitch * 1.1, .09); haptic(6);
      sqAct(g, id, cx, cy, "tap", .3);
    }
  };
  btn.addEventListener("pointerup", end); btn.addEventListener("pointercancel", end); btn.addEventListener("lostpointercapture", end);
}
const easeOut = t => 1 - Math.pow(1 - t, 2.2);
function squeakTone(p, d, drop = 1.25) { const f = 520 * p; tone(f, 0, d, "sine", .1, f * drop); tone(f * 2, 0, d * .6, "triangle", .03, f * 2 * drop); }

/* every touch gives Love; squeezes, pulls and every 3rd boop set off the squishy's special effect */
function sqAct(g, id, x, y, kind, power) {
  questProgress("squishhome");
  G.stats.sqhome = (G.stats.sqhome || 0) + 1;
  if (typeof loveBoop === "function") loveBoop(x, y - 20, false);
  SQH.taps[id] = (SQH.taps[id] || 0) + 1;
  if (kind === "tap" && SQH.taps[id] % 3) { saveSoon(); return; }
  if (kind !== "tap" && power < .25) { saveSoon(); return; }
  const t = performance.now(); if (SQH.cd[id] && t - SQH.cd[id] < 7000) { saveSoon(); return; }
  SQH.cd[id] = t;
  const info = sqInfo(id); if (!info) return;
  sqEffect(g, info.fx, info);
  saveSoon(); checkAchievements();
}
function petEl() { return $("#pet"); }
function fxClass(cls, ms) { const p = petEl(); if (!p) return; p.classList.remove(cls); void p.offsetWidth; p.classList.add(cls); clearTimeout(p["_t" + cls]); p["_t" + cls] = setTimeout(() => { const q = petEl(); if (q) q.classList.remove(cls); }, ms); }
function sqEffect(g, fx, info) {
  const p = petEl(); if (!p) return;
  const [bx, by] = centerOf(p);
  const asleep = isAsleep(g);
  if (asleep && fx !== "sleep" && fx !== "bubbles" && fx !== "sparkle") { say("*snore* ...squishy... *snore*"); return; }
  switch (fx) {
    case "antigrav": fxClass("zerog", 6200); play("zoom"); say(pick(["Whoaaa! I'm FLOATING!", "Houston, we have a guinea!", "Zero gravity! Wheeeee!"])); for (let i = 0; i < 5; i++) setTimeout(() => bits("dot", bx + (Math.random() - .5) * 120, by + 40, 3, { c: ["#c7b3ff", "#fff"], v: .6, up: 1.5, g: -.03, s: 3, life: 60 }), i * 400); break;
    case "sleep": if (!asleep) { fallAsleep(g, "nap"); g.sleep.target = Math.min(100, g.energy + 20); } else say("Zzz... so... squishy..."); break;
    case "ghost": fxClass("ghosty", 6000); play("whoosh"); say(pick(["Boooo! I'm a ghost guinea!", "OoooOOoo! Can you see me?"])); break;
    case "disco": { fxClass("dancing", 6000); const room = $(".room"); if (room) { room.classList.add("disco-room"); setTimeout(() => room.classList.remove("disco-room"), 6000); } play("fanfare"); say("DISCO PARTY! 🕺"); for (let i = 0; i < 6; i++) setTimeout(() => confetti(bx + (Math.random() - .5) * 160, by - 60, 12, true), i * 700); break; }
    case "rainbow": fxClass("rainbowfur", 7000); play("sparkle"); say("Look at my fur! I'm EVERY colour!"); break;
    case "toot": toot(g, p); break;
    case "hop": for (let i = 0; i < 3; i++) setTimeout(() => { pcls("popcorn", 650); play("jump"); }, i * 520); say("Ribbit! I mean... wheek!"); break;
    case "zoom": if (typeof zoomies === "function" && !PA.busy) { PA.busy = true; zoomies().then(() => PA.busy = false); } say("ZOOMIES!!!"); break;
    case "nibble": { pcls("munch", 1400); play("munch"); g.food = clamp(g.food + 3, 0, 100); refreshStatBars(g); say(pick(["Nom nom... wait, this isn't food!", "*nibble* ...squishy. Not crunchy.", "Tastes like... squish?"])); bits("dot", bx, by, 6, { c: [info.s.c, "#fff"], v: 2, up: 2, s: 3, life: 35 }); break; }
    case "giant": fxClass("giant", 4200); play("squish"); say("I'm a BIG mochi now!"); break;
    case "tiny": fxClass("tiny", 4200); play("pop"); say("*teeny tiny wheek*"); break;
    case "meow": pcls("popcorn", 650); tone(700, 0, .25, "sine", .1, 950); tone(950, .2, .3, "sine", .08, 600); say(pick(["...meow?", "Mrrrow! Wait, what?", "I'm a cat now. Meow. Wheek. Meow."])); break;
    case "golden": { fxClass("goldfur", 7000); play("bigwin"); say("I'm GOLDEN! Ka-ching!"); const now2 = now(); if (now2 - (G.sqGoldAt || 0) > 10 * MIN) { G.sqGoldAt = now2; addCoins(rint(8, 20), [bx, by]); } else coinRain(bx, by, 8); break; }
    case "roar": fxClass("roar", 900); tone(140, 0, .5, "sawtooth", .12, 90); floatText(bx, by - 80, "RAWR!", "#3f9a3a", 34); say("RAWR! I'm a dino-guinea!"); break;
    case "lava": fxClass("hot", 5000); play("whoosh"); gas(bx, by - 60, 10); say(pick(["HOT HOT HOT! Spicy squishy!", "I'm a lava guinea!"])); break;
    case "bubbles": bits("dot", bx, by, 22, { c: ["#bfefff", "#e8fbff"], v: 2.5, up: 3, g: -.05, s: 7, ring: true, life: 90 }); play("splash"); g.clean = clamp(g.clean + 5, 0, 100); refreshStatBars(g); if (!asleep) say("Bubbles! Blub blub!"); break;
    case "sour": { const s = petSvg(); if (s) { s.classList.add("wow"); setTimeout(() => { const t = petSvg(); if (t) t.classList.remove("wow"); }, 1600); } fxClass("sour", 1600); play("buzz"); say("SOURRRR! *pucker face*"); break; }
    case "toast": fxClass("toastpop", 1100); play("jump"); say("POP! I'm toast!"); break;
    case "sparkle": confetti(bx, by - 40, 50); play("sparkle"); for (let i = 0; i < 5; i++) setTimeout(() => typeof loveBoop === "function" && loveBoop(bx + (Math.random() - .5) * 100, by - 40, false), i * 120); if (!asleep) say("✨ Magic! ✨"); break;
  }
}

/* ---------- choosing squishies & buying spots ---------- */
function sqPicker(slot) {
  const H = sqHome();
  const owned = Object.entries(G.squishies).filter(([, c]) => c > 0).map(([id]) => id).filter(id => sqDef(id));
  if (!owned.length) {
    confirmBox("No squishies yet!", "Buy squishies at the Squishy Shop, then put them on your shelf. Each one does something special to your guinea!", "Go to the Squishy Shop", "Later").then(y => y && go("shop/boxes"));
    return;
  }
  const placed = id => H.items.filter(x => x === id).length;
  const cur = H.items[slot];
  const m = openModal(`<h2>Pick a squishy</h2><p class="muted">Squishies on your shelf do something special when you squish them, and give a bonus to all your guineas.</p>
    <div class="sqp-list">${owned.map(id => { const i = sqInfo(id), free = G.squishies[id] - placed(id) + (cur === id ? 1 : 0); return `<button class="sqp card ${free <= 0 ? "used" : ""} ${cur === id ? "on" : ""}" data-pick="${id}" ${free <= 0 ? "disabled" : ""}><span class="sqp-art">${squishySVG(i.s)}</span><span class="sqp-t"><b>${esc(i.s.name)}</b><small>${esc(sqFxText(id))}</small><small class="pk">${esc(sqPerkText(id))}</small>${free <= 0 ? `<small class="pk">Already on your shelf</small>` : ""}</span></button>`; }).join("")}</div>
    <div class="mrow">${cur ? `<button class="btn white" data-clear>Take it off the shelf</button>` : ""}<button class="btn green" data-done>Done</button></div>`);
  $$("[data-pick]", m.el).forEach(b => b.onclick = () => { H.items[slot] = b.dataset.pick; play("squish"); saveSoon(); m.close(); questProgress("squishhome", 0); setTimeout(render, 230); });
  const c = $("[data-clear]", m.el); if (c) c.onclick = () => { H.items[slot] = null; play("pop"); saveSoon(); m.close(); setTimeout(render, 230); };
  $("[data-done]", m.el).onclick = () => m.close();
}
async function buySqSlot() {
  const H = sqHome(); if (H.slots >= SQ_SLOTS_MAX) return;
  const p = SQ_SLOT_PRICES[H.slots];
  if (!(await confirmBox("Another squishy spot?", `Add spot #${H.slots + 1} to your squishy shelf for <b>${fmt(p)} coins</b>. More squishies = more bonuses for your guineas!`, `Buy for ${fmt(p)}`, "Not now"))) return;
  if (!spendCoins(p)) return;
  H.slots++; H.items.push(null); play("coin"); confetti(innerWidth / 2, innerHeight * .6, 30);
  recordBuy({ type: "sqslot", price: p, name: `Squishy spot #${H.slots}` });
  saveSoon(); render();
}

/* the Shelf tab in the Squishy Shop */
function shelfShopHTML() {
  const H = sqHome(), next = H.slots < SQ_SLOTS_MAX ? SQ_SLOT_PRICES[H.slots] : 0;
  const perks = Object.keys(SQ_PERK).map(k => [k, sqPerk(k)]).filter(([, v]) => v > 0);
  return `<div class="card shelf-shop"><h2 class="sec">🏠 Your squishy shelf</h2>
    <p>Put squishies on the shelf in your hutch. <b>Tap</b> to boop, <b>hold</b> to squish, <b>pull</b> and let go to SNAP! Every squishy does something special to your guinea, and gives a bonus while it's on the shelf.</p>
    <div class="shelf-preview">${H.items.map(id => `<span class="sp-cell">${id && sqDef(id) ? squishySVG(sqDef(id)) : "＋"}</span>`).join("")}</div>
    <p class="muted">${H.slots} of ${SQ_SLOTS_MAX} spots${perks.length ? ` · Bonuses now: ${perks.map(([k, v]) => `${SQ_PERK[k].ico} +${Math.round(v * 100)}%`).join(" ")}` : ""}</p>
    <div class="mrow">${next ? `<button class="btn green" data-sqbuy>+1 spot ${COIN} ${fmt(next)}</button>` : `<span class="si-own">All 6 spots unlocked!</span>`}<button class="btn sky" data-gohome>🏠 Squish!</button></div></div>`;
}
