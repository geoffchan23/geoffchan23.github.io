/* Wheek World: SUPER POWERS. Epic guineas get 1 power, Legendary 2, Mythic 3.
   Mutants always get their signature power first. Powers show as a glowing aura and badges. */
"use strict";

const POWERS = {
  coinsneeze: { n: "Coin Sneezes", ico: "🪙", d: "Boop its nose and it sneezes out COINS!" },
  lovemagnet: { n: "Love Magnet", ico: "💖", d: "Every boop gives DOUBLE Love while it's your buddy." },
  floaty: { n: "Zero Gravity", ico: "🌙", d: "Floats in the air like it's in space! Boops give +50% Love." },
  goldpoop: { n: "Golden Poops", ico: "✨", d: "On the farm its poops are GOLDEN and worth 10 coins each." },
  shopboss: { n: "Shop Boss", ico: "🏪", d: "While it lives on the farm, every farm shop earns 25% more." },
  selfclean: { n: "Self-Cleaning", ico: "🫧", d: "Never gets dirty and its fur never gets messy." },
  snackmagic: { n: "Snack Magic", ico: "🍓", d: "Snacks fill it up twice as much, and sometimes the snack comes back!" },
  champ: { n: "Game Champ", ico: "🏆", d: "+25% coins from every game while it's your buddy." },
  babymagic: { n: "Rare Babies", ico: "🍼", d: "Its babies are 3x more likely to be rare and magical." },
  dreamer: { n: "Sweet Dreams", ico: "🌟", d: "Dreams up a pile of coins every time it wakes from a nap." },
  aura: { n: "Happy Aura", ico: "🌈", d: "Every guinea you own stays happy for longer." },
  hype: { n: "Helper Hype", ico: "🤖", d: "Your Boop Helpers work 50% faster." },
};
const SIGNATURE = { golden: "coinsneeze", slime: "snackmagic", ghost: "selfclean", rainbow: "aura", galaxy: "floaty", disco: "lovemagnet" };
const POWER_KEYS = Object.keys(POWERS);
const PCACHE = {};
function powersOf(g) {
  if (!g || !g.genes) return [];
  const t = tierOf(g), n = t >= 5 ? 3 : t >= 4 ? 2 : t >= 3 ? 1 : 0;
  if (!n) return [];
  if (Array.isArray(g.pw) && g.pw.length === n) return g.pw;
  const key = JSON.stringify(g.genes) + ":" + (g.key || "") + ":" + n;
  let out = PCACHE[key];
  if (!out) {
    out = [];
    if (g.genes.m && SIGNATURE[g.genes.m]) out.push(SIGNATURE[g.genes.m]);
    const rnd = mulberry(hashStr("pow" + key));
    const rest = POWER_KEYS.filter(k => !out.includes(k));
    while (out.length < n) out.push(rest.splice(Math.floor(rnd() * rest.length), 1)[0]);
    PCACHE[key] = out;
  }
  if (g.id) g.pw = out.slice();   // real guineas keep their powers forever
  return out;
}
const hasPower = (g, k) => powersOf(g).includes(k);
const anyPower = (k, list = G.guineas) => list.some(g => hasPower(g, k));
const buddyPower = k => hasPower(activeG(), k);

function powerChips(g, big) {
  const p = powersOf(g); if (!p.length) return "";
  return `<span class="pw-chips${big ? " big" : ""}">${p.map(k => `<span class="pw-chip" title="${esc(POWERS[k].n)}">${POWERS[k].ico}${big ? ` ${esc(POWERS[k].n)}` : ""}</span>`).join("")}</span>`;
}
function powerCard(g) {
  const p = powersOf(g); if (!p.length) return "";
  const t = TIERS[tierOf(g)];
  return `<div class="card power-card" style="--tc:${t.c}"><h2 class="sec">⚡ Super Power${p.length > 1 ? "s" : ""} <small>(${t.n} guineas get ${p.length})</small></h2>${p.map(k => `<div class="pw-row"><span class="pw-ico">${POWERS[k].ico}</span><div><b>${esc(POWERS[k].n)}</b><small>${esc(POWERS[k].d)}</small></div></div>`).join("")}</div>`;
}
/* the glowing aura behind an epic+ guinea */
function auraHTML(g) { const t = tierOf(g); if (t < 3) return ""; return `<span class="pw-aura t${t}" style="--tc:${TIERS[t].c}" aria-hidden="true"></span>`; }
function powerToast(g) { const p = powersOf(g); if (!p.length) return; toast(p.map(k => `${POWERS[k].ico} ${POWERS[k].n}: ${POWERS[k].d}`).join("  "), "⚡"); }
