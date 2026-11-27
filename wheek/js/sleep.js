/* Wheek World: energy and sleep. Guineas get tired from playing and fall asleep, and they also take
   little naps at random times of the day (babies, old guineas and sleepy ones nap the most). */
"use strict";

const SLEEP_RATE = 60;          // energy gained per hour asleep
const TIRED_AT = 12;            // falls asleep by itself at this energy
let SIM_NOW = 0;                // the time being simulated inside tick() (catch-up after being away)
const simNow = () => SIM_NOW || now();
const isAsleep = g => !!(g && g.sleep);

function energyDrain(g) {
  const st = stageOf(g);
  let d = 5;
  if (st === "baby") d = 7; else if (st === "kid") d = 6; else if (isOld(st)) d = 6.5;
  if (g.pers === "sleepy") d *= 1.25;
  if (g.pers === "zoomy") d *= .85;
  return d;
}
/* called from simGuinea for each slice of time */
function simSleep(g, hrs) {
  if (g.energy == null) g.energy = 80;
  const t = simNow();
  if (g.sleep) {
    g.energy = Math.min(100, g.energy + SLEEP_RATE * (1 + sqPerk("energy")) * hrs);
    if (g.energy >= (g.sleep.target || 100)) { g.sleep = null; g.wokeAt = t; g.sleepBoops = 0; g.justWoke = 1; if (hasPower(g, "dreamer")) g.dreamGift = (g.dreamGift || 0) + rint(20, 45); }
  } else {
    g.energy = Math.max(0, g.energy - energyDrain(g) * hrs);
    if (g.energy <= TIRED_AT && t - (g.wokeAt || 0) > 20 * MIN) fallAsleep(g, "tired", t);
  }
}
/* random naps: each guinea plans at most one nap per hour, at a random minute */
function napChance(g) {
  const st = stageOf(g);
  let c = .22;
  if (st === "baby" || st === "kid") c = .45;
  if (isOld(st)) c = .45;
  if (g.pers === "sleepy") c += .25;
  if (g.pers === "zoomy") c -= .1;
  return c;
}
let lastTouchAt = 0;
addEventListener("pointerdown", () => { lastTouchAt = Date.now(); }, true);
function sleepTick() {
  const h = hourIdx(), t = now();
  for (const g of G.guineas) {
    if (g.energy == null) g.energy = 80;
    if (g.napH !== h) { g.napH = h; g.napAt = Math.random() < napChance(g) ? h * HOUR + (5 + Math.random() * 50) * MIN : 0; }
    if (g.napAt && t >= g.napAt && !g.sleep) {
      const busyHere = ROUTE.name === "home" && g.id === G.active && (Date.now() - lastTouchAt < 45000 || modalStack.length || (typeof HG !== "undefined" && HG));
      if (busyHere) continue;                       // don't nod off in the middle of a game with her; try again soon
      g.napAt = 0;
      if (g.energy < 85 && t - (g.wokeAt || 0) > 30 * MIN) fallAsleep(g, "nap", t);
    }
  }
}
function fallAsleep(g, why, t = now()) {
  if (g.sleep) return;
  const target = why === "nap" ? Math.min(100, g.energy + rint(15, 30)) : 100;
  g.sleep = { why, at: t, target };
  g.sleepBoops = 0;
  saveSoon();
  if (typeof sleepUISync === "function") sleepUISync(g, "fell");
}
function wakeUp(g, how) {
  if (!g || !g.sleep) return false;
  g.sleep = null; g.wokeAt = now(); g.sleepBoops = 0;
  saveSoon();
  if (typeof sleepUISync === "function") sleepUISync(g, how || "woke");
  return true;
}
const sleepLeft = g => g.sleep ? Math.max(MIN, ((g.sleep.target || 100) - g.energy) / SLEEP_RATE * HOUR) : 0;
/* playing tires guineas out */
function tireOut(g, n) { if (!g || g.sleep) return; g.energy = Math.max(0, (g.energy ?? 80) - n); if (g.energy <= TIRED_AT && now() - (g.wokeAt || 0) > 20 * MIN) setTimeout(() => { if (!g.sleep && g.energy <= TIRED_AT) { fallAsleep(g, "tired"); } }, 1500); }

/* ---------- home screen ---------- */
const SLEEP_LINES = ["Zzzzz...", "*tiny snores*", "*snore* ...cucumbers... *snore*", "Mmmm... five more minutes...", "*dreaming about a giant strawberry*", "Zzz... wheek... zzz...", "*snuffle snuffle* zzz"];
const SLEEP_BOOP_LINES = ["Mmmph... *snore*", "Hehe... *still asleep*", "Five more minutes...", "*sleepy wheek*", "Zzz... boop... zzz..."];
const WAKE_LINES = { boop: ["*YAWN* You booped me awake! OK OK, I'm up!", "Mmm? Oh, it's you! Hi!"], woke: ["*big stretch* Good morning! Or afternoon. Whatever time it is!", "*YAWN* That was the BEST nap.", "I'm awake! I was just resting my eyes."], action: ["*yawn* Did somebody say SNACKS?", "Huh? I'm awake! Totally awake!"], button: ["*YAWN* Okay, okay, I'm up!", "*stretches all four paws* Hello!"] };
const SL = { g: null, iv: 0, zt: 0, shown: null };
function sleepHomeInit(g) {
  sleepHomeStop();
  SL.g = g; SL.shown = null;
  sleepUISync(g, "init");
  // fall asleep / wake up while she's watching
  SL.iv = setInterval(() => { if (ROUTE.name !== "home") return; sleepTick(); sleepUISync(SL.g, "poll"); }, 5000);
  return sleepHomeStop;
}
function sleepHomeStop() { clearInterval(SL.iv); clearTimeout(SL.zt); SL.g = null; }
function sleepUISync(g, why) {
  if (!SL.g || g !== SL.g || ROUTE.name !== "home") return;
  const room = $(".room"); if (!room) return;
  const asleep = isAsleep(g);
  renderSuggest();
  if (asleep) {
    if (!$(".doze-veil", room)) { const veil = document.createElement("div"); veil.className = "doze-veil"; room.prepend(veil); }
    room.classList.add("dozing");
    if (SL.shown !== true) {
      SL.shown = true; PA.napping = true;
      const s = petSvg(); if (s) { s.classList.remove("happy", "sad", "wow"); s.classList.add("napping"); }
      say(g.sleep.why === "tired" ? `*YAWN* ${g.name} is all tired out... Zzz` : pick(SLEEP_LINES));
      if (why === "fell") { play("yawn"); refreshStatBars(g); }
      zLoop();
    }
  } else {
    const v = $(".doze-veil", room); if (v) v.remove();
    room.classList.remove("dozing");
    if (SL.shown === true) {
      PA.napping = false;
      const s = petSvg(); if (s) s.classList.remove("napping");
      pcls("yawn", 1300); play("yawn");
      say(pick(WAKE_LINES[why] || WAKE_LINES.woke));
      refreshStatBars(g);
    } else if (g.justWoke && why === "init") { g.justWoke = 0; say(pick(WAKE_LINES.woke)); }
    SL.shown = false;
    if (g.dreamGift) { const n = g.dreamGift; g.dreamGift = 0; setTimeout(() => { if (!petSvg()) { g.dreamGift = n; return; } addCoins(n, bodyVP()); play("sparkle"); say(`🌟 I had a dream about coins... and they were REAL! +${n}`); }, 1200); }
  }
}
function zLoop() {
  clearTimeout(SL.zt);
  const step = () => {
    if (!SL.g || !isAsleep(SL.g) || !petSvg()) return;
    if (!modalStack.length && !document.hidden) { const [x, y] = partPt(".ear-r", .2); floatText(x + 8, y, pick(["z", "Z", "z z", "Zzz"]), "#6a5490", 16 + Math.floor(Math.random() * 10)); }
    if (Math.random() < .12) say(pick(SLEEP_LINES));
    SL.zt = setTimeout(step, 1400 + Math.random() * 900);
  };
  SL.zt = setTimeout(step, 600);
}
/* booping a sleeping guinea: still counts (and still earns Love), but enough boops wake them */
function sleepBoop(g, btn, x, y) {
  g.sleepBoops = (g.sleepBoops || 0) + 1;
  play("boop"); petAnim(btn, "squish", 500);
  const s = petSvg(); if (s) s.classList.add("napping");
  floatText(x, y - 24, pick(["z", "zz", "mmm"]), "#6a5490", 18);
  if (g.sleepBoops >= 10) { wakeUp(g, "boop"); return; }
  if (g.sleepBoops % 3 === 0) say(pick(SLEEP_BOOP_LINES) + (g.sleepBoops >= 6 ? " (almost awake!)" : ""));
}
