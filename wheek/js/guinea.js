/* Guineas: genetics, drawing, names, aging, needs, breeding. */
"use strict";

const FUR = {
  ginger: { n: "Ginger", c: "#f2a65a" }, cream: { n: "Cream", c: "#fff1d6" }, choc: { n: "Chocolate", c: "#8a5a3c" },
  black: { n: "Black", c: "#3d2c2c" }, white: { n: "Snow", c: "#fffaf3" }, golden: { n: "Golden", c: "#ffcc55" },
  lilac: { n: "Lilac", c: "#c4b6d6" }, red: { n: "Red", c: "#c8693a" }, buff: { n: "Buff", c: "#e8c08a" }, slate: { n: "Slate", c: "#7b8796" },
};
const FUR_IDS = Object.keys(FUR);
const PATTERNS = { solid: { n: "Self", r: 0 }, patches: { n: "Patchy", r: 0 }, dutch: { n: "Dutch", r: 1 }, himi: { n: "Himalayan", r: 1 }, roan: { n: "Roan", r: 1 }, brindle: { n: "Brindle", r: 1 } };
const HAIR = { smooth: { n: "Smooth", r: 0 }, teddy: { n: "Teddy", r: 1 }, aby: { n: "Abyssinian", r: 1 }, lion: { n: "Lionhead", r: 2 }, peru: { n: "Peruvian", r: 2 }, skinny: { n: "Skinny", r: 3 } };
const EYES = { dark: { n: "Dark eyes", r: 0, c: "#2b1640" }, ruby: { n: "Ruby eyes", r: 1, c: "#c0203a" }, blue: { n: "Blue eyes", r: 2, c: "#2a6fdb" } };
const MUTANTS = { golden: { n: "Golden", r: 4, w: 30 }, slime: { n: "Slime", r: 4, w: 26 }, ghost: { n: "Ghost", r: 4, w: 22 }, rainbow: { n: "Rainbow", r: 5, w: 12 }, galaxy: { n: "Galaxy", r: 5, w: 8 }, disco: { n: "Disco", r: 6, w: 2 } };
const TIERS = [
  { n: "Common", c: "#9aa3ad", v: 80 }, { n: "Uncommon", c: "#5cc24a", v: 150 }, { n: "Rare", c: "#3d8bff", v: 350 },
  { n: "Epic", c: "#a24dff", v: 800 }, { n: "Legendary", c: "#ff9f1a", v: 2000 }, { n: "Mythic", c: "#ff3d9a", v: 5000 },
];
const PERSONALITIES = {
  greedy: { n: "Greedy", d: "Thinks about snacks 100% of the time." },
  sleepy: { n: "Sleepy", d: "Professional napper." },
  sassy: { n: "Sassy", d: "Has opinions. Many opinions." },
  dramatic: { n: "Dramatic", d: "Everything is the BEST or the WORST." },
  gassy: { n: "Gassy", d: "Toots. A lot. Proudly." },
  cuddly: { n: "Cuddly", d: "Wants boops. Needs boops." },
  zoomy: { n: "Zoomy", d: "Popcorns at random. Cannot sit still." },
  nerdy: { n: "Nerdy", d: "Reads books upside down. Wears glasses on its butt." },
};
const NAMES = ["Biscuit", "Nugget", "Mochi", "Peanut", "Waffles", "Sir Squeaks", "Toot", "Pickles", "Bean", "Cinnamon", "Oreo", "Marshmallow", "Sprinkles", "Nibbles", "Pumpkin", "Tofu", "Dumpling", "Pebble", "Muffin", "Snickers", "Coco", "Taco", "Noodle", "Fudge", "Ziggy", "Bubbles", "Hazel", "Clover", "Ginger Snap", "Potato", "Lord Fluffington", "Princess Poot", "Captain Wheek", "Squishy", "Gizmo", "Bonbon", "Pancake", "Jellybean", "Popcorn", "Butterscotch", "Meatball", "Sushi", "Kiwi", "Mango", "Turnip", "Radish", "Parsnip", "Snoot", "Wiggles", "Fluffernutter", "Gumdrop", "Twinkie", "Scooter", "Pip", "Wombat", "Barnaby", "Doris", "Gertrude", "Kevin", "Gary", "Linda", "Duchess", "Baron Von Toot", "Señor Squeak", "Mr. Tumbles", "Tater Tot", "Cheeto", "Pretzel", "Lentil", "Chickpea", "Bagel", "Croissant", "Fig", "Olive", "Wasabi", "Nacho", "Smudge", "Patches", "Sundae", "Truffle", "Cupcake", "Brownie", "Snowball", "Puddle", "Slurpee", "Goober", "Blorp", "Zoomer", "Rocket", "Comet", "Nebula", "Pixel", "Glitter", "Sparkle Butt", "Stinky Pete", "Professor Nibs", "Queen Wheekie", "Sir Poops-a-Lot", "Lettuce Larry", "Cucumber Carl"];
/* fur dyes from the Fluff Salon (worn over natural colour; mutants keep their magic look) */
const DYES = { pink: { n: "Bubblegum Pink", c: "#ff9fd0" }, blue: { n: "Sky Blue", c: "#8fd3ff" }, mint: { n: "Minty Green", c: "#a6f0c6" }, lavender: { n: "Lavender", c: "#cdb6ff" }, sunshine: { n: "Sunshine Yellow", c: "#ffe066" }, peach: { n: "Peachy", c: "#ffb98a" }, rainbow: { n: "Rainbow", c: "#ff9fd0" } };
/* messy fur tufts: 10 spots along the top of the body; combing removes them */
const TUFT_SPOTS = Array.from({ length: 10 }, (_, i) => { const a = (-168 + i * 17.3) * Math.PI / 180; return [100 + Math.cos(a) * 84, 100 + Math.sin(a) * 60, (a * 180 / Math.PI) + 90]; });
const SEX = { boar: { n: "Boy", ico: "♂", c: "#3d8bff" }, sow: { n: "Girl", ico: "♀", c: "#ff5fa8" } };

function randGenes(rnd = Math.random, opts = {}) {
  const w = (o) => weighted(Object.entries(o).map(([k, v]) => ({ k, w: v })), rnd).k;
  const g = {
    c: FUR_IDS[Math.floor(rnd() * FUR_IDS.length)],
    c2: FUR_IDS[Math.floor(rnd() * FUR_IDS.length)],
    p: w({ solid: 18, patches: 30, dutch: 14, himi: 10, roan: 12, brindle: 12 }),
    h: w({ smooth: 46, teddy: 16, aby: 18, lion: 8, peru: 9, skinny: 3 }),
    e: w({ dark: 80, ruby: 14, blue: 6 }),
    m: null,
  };
  if (g.c2 === g.c) g.c2 = g.c === "white" ? "ginger" : "white";
  const mutChance = opts.mut != null ? opts.mut : .015;
  if (rnd() < mutChance) g.m = weighted(Object.entries(MUTANTS).map(([k, v]) => ({ k, w: v.w })), rnd).k;
  return g;
}
function rarityScore(g) { return PATTERNS[g.p].r + HAIR[g.h].r + EYES[g.e].r + (g.m ? MUTANTS[g.m].r : 0); }
function tierOf(gn) { const s = rarityScore(gn.genes || gn); return s >= 10 ? 5 : s >= 7 ? 4 : s >= 5 ? 3 : s >= 3 ? 2 : s >= 1 ? 1 : 0; }
function coatName(g) {
  const parts = [];
  if (g.m) parts.push(MUTANTS[g.m].n); else { parts.push(FUR[g.c].n); if (g.p !== "solid" && g.p !== "patches") parts.push(PATTERNS[g.p].n); }
  parts.push(HAIR[g.h].n);
  return parts.join(" ");
}

function inherit(a, b, opts = {}) {
  const from = () => Math.random() < .5 ? a : b;
  const g = { c: from().c, c2: from().c2, p: from().p, h: from().h, e: from().e, m: null };
  const mut = opts.mutBoost || 1;
  if (Math.random() < .1 * mut) g.c = pick(FUR_IDS);
  if (Math.random() < .08 * mut) g.p = pick(Object.keys(PATTERNS));
  if (Math.random() < .06 * mut) g.h = randGenes().h;
  if (Math.random() < .04 * mut) g.e = randGenes().e;
  if (a.m && Math.random() < .35) g.m = a.m;
  if (!g.m && b.m && Math.random() < .35) g.m = b.m;
  if (!g.m && Math.random() < .025 * mut) g.m = weighted(Object.entries(MUTANTS).map(([k, v]) => ({ k, w: v.w }))).k;
  if (g.c2 === g.c) g.c2 = g.c === "white" ? "choc" : "white";
  return g;
}

/* ---------- drawing ---------- */
let svgN = 0;
function shadeHex(hex, amt) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function bodyPath(hair, seed) {
  const N = 72, pts = [], rnd = mulberry(seed || 7);
  for (let i = 0; i < N; i++) {
    const t = i / N * Math.PI * 2 - Math.PI / 2; // start at top
    const top = Math.sin(t) < 0;
    let rx = 86, ry = top ? 61 : 58;
    let k = 1;
    const ang = (t + Math.PI * 2.5) % (Math.PI * 2); // 0 at top
    if (hair === "aby") k += .09 * Math.pow(Math.max(0, Math.sin(t * 9 + 1)), 4) + rnd() * .015;
    else if (hair === "teddy") k += .035 * Math.abs(Math.sin(t * 16)) + rnd() * .012;
    else if (hair === "lion" && top) k += .13 * Math.pow(Math.max(0, Math.sin(t * 11)), 3) * Math.min(1, -Math.sin(t) * 1.6);
    else if (hair === "peru" && !top) { k += .04 * Math.abs(Math.sin(t * 7)); ry += 10; rx += 6; }
    const x = 100 + Math.cos(t) * rx * k, y = 100 + Math.sin(t) * ry * k;
    pts.push([x, y]);
  }
  const mid = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
  let d = ""; const m0 = mid(pts[N - 1], pts[0]); d += `M${m0[0].toFixed(1)} ${m0[1].toFixed(1)}`;
  for (let i = 0; i < N; i++) { const m = mid(pts[i], pts[(i + 1) % N]); d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; }
  return d + "Z";
}
const BODY_CACHE = {};
function cachedBody(h, seed) { const k = h + ":" + (seed % 5); return BODY_CACHE[k] || (BODY_CACHE[k] = bodyPath(h, (seed % 5) + 3)); }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* Returns SVG markup for a guinea. g: guinea object (or {genes}); opts: {size, mood, flip, cls, noOutfit, age} */
function guineaSVG(g, opts = {}) {
  const gn = g.genes || g, id = "gq" + (++svgN), seed = hashStr(g.id || JSON.stringify(gn));
  const stage = opts.stage || (g.born ? stageOf(g) : "adult");
  let base = FUR[gn.c].c, patch = FUR[gn.c2].c, ear = shadeHex(patch, -.1);
  const skinny = gn.h === "skinny";
  if (skinny) { base = "#ffc9c2"; patch = "#f5a8a0"; ear = "#f29a92"; }
  const dye = !gn.m && g.dye && DYES[g.dye] ? g.dye : null;
  if (dye) { base = DYES[dye].c; ear = shadeHex(base, -.18); }
  let defs = "", over = "", glow = "";
  let bodyFill = base;
  if (gn.m === "golden") { defs += `<linearGradient id="${id}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="#ffcc33"/><stop offset="1" stop-color="#e09a00"/></linearGradient>`; bodyFill = `url(#${id}gd)`; ear = "#e8a800"; patch = "#ffe680"; }
  if (gn.m === "rainbow") { defs += `<linearGradient id="${id}rb" x1="0" y1="0" x2="1" y2="0">${["#ff5a5f", "#ff9f43", "#ffd43b", "#51cf66", "#4dabf7", "#845ef7"].map((c, i) => `<stop offset="${(i / 5).toFixed(2)}" stop-color="${c}"/>`).join("")}</linearGradient>`; bodyFill = `url(#${id}rb)`; ear = "#845ef7"; }
  if (gn.m === "galaxy") { defs += `<radialGradient id="${id}gx" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#6a4fe0"/><stop offset=".6" stop-color="#2d1f7a"/><stop offset="1" stop-color="#140c3c"/></radialGradient>`; bodyFill = `url(#${id}gx)`; ear = "#4a3aa8"; patch = "#7a5af0"; }
  if (gn.m === "slime") { defs += `<radialGradient id="${id}sl" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#c8ffa8"/><stop offset=".6" stop-color="#7be04a"/><stop offset="1" stop-color="#3f9a1a"/></radialGradient>`; bodyFill = `url(#${id}sl)`; ear = "#5cc22a"; patch = "#a8f070"; }
  if (gn.m === "ghost") { bodyFill = "#f1f0ff"; ear = "#d8d4ff"; patch = "#ffffff"; glow = `<ellipse cx="100" cy="100" rx="100" ry="74" fill="#c7b3ff" opacity=".35"/>`; }
  if (gn.m === "disco") { defs += `<linearGradient id="${id}dc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fc7"/><stop offset=".5" stop-color="#5fd3ff"/><stop offset="1" stop-color="#ffd84d"/></linearGradient>`; bodyFill = `url(#${id}dc)`; ear = "#ff5fa8"; }
  if (dye === "rainbow") { defs += `<linearGradient id="${id}dy" x1="0" y1="0" x2="1" y2="1">${["#ff9fd0", "#ffd28a", "#fff08a", "#a6f0c6", "#8fd3ff", "#cdb6ff"].map((c, i) => `<stop offset="${(i / 5).toFixed(2)}" stop-color="${c}"/>`).join("")}</linearGradient>`; bodyFill = `url(#${id}dy)`; }
  const body = cachedBody(gn.h, seed);
  defs += `<clipPath id="${id}c"><path d="${body}"/></clipPath>`;
  const rnd = mulberry(seed);
  // pattern layers (clipped to body)
  let pat = "";
  if (!gn.m && !skinny) {
    if (gn.p === "patches") pat = `<path d="M30 84C40 58 62 48 82 48C72 70 62 94 40 108C32 104 28 94 30 84Z" fill="${patch}"/><path d="M168 94C162 74 150 60 134 54C140 74 150 90 170 110Z" fill="${shadeHex(patch, .6)}" opacity=".9"/><ellipse cx="${150 + rnd() * 20}" cy="${130 + rnd() * 10}" rx="30" ry="22" fill="${patch}"/>`;
    else if (gn.p === "dutch") pat = `<rect x="0" y="118" width="200" height="60" fill="#fffaf3"/><path d="M100 40C110 40 114 70 116 100L84 100C86 70 90 40 100 40Z" fill="#fffaf3"/>`;
    else if (gn.p === "himi") { bodyFill = "#fffaf3"; pat = `<ellipse cx="100" cy="108" rx="22" ry="16" fill="${patch}" opacity=".85"/>`; ear = patch; }
    else if (gn.p === "roan") pat = Array.from({ length: 36 }, () => `<circle cx="${(20 + rnd() * 160).toFixed(0)}" cy="${(45 + rnd() * 110).toFixed(0)}" r="${(2 + rnd() * 3).toFixed(1)}" fill="#fffaf3" opacity=".8"/>`).join("");
    else if (gn.p === "brindle") pat = Array.from({ length: 9 }, (_, i) => `<path d="M${20 + i * 20} 40q${8 - rnd() * 16} 60 ${-4 + rnd() * 8} 130" stroke="${patch}" stroke-width="${5 + rnd() * 5}" fill="none" opacity=".75" stroke-linecap="round"/>`).join("");
  }
  if (gn.m === "galaxy") pat = Array.from({ length: 22 }, () => { const x = 20 + rnd() * 160, y = 45 + rnd() * 110, r = .8 + rnd() * 2; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff"/>`; }).join("") + `<path d="M40 120q50 -40 120 -20" stroke="#c7b3ff" stroke-width="10" fill="none" opacity=".25"/>`;
  if (gn.m === "slime") pat = `<circle cx="60" cy="70" r="10" fill="#e4ffd0" opacity=".6"/><circle cx="140" cy="130" r="7" fill="#e4ffd0" opacity=".5"/><circle cx="120" cy="60" r="4" fill="#fff" opacity=".7"/>`;
  if (gn.m === "rainbow") pat = `<path d="M100 40C110 40 116 70 118 100C120 130 112 156 100 156S80 130 82 100C84 70 90 40 100 40Z" fill="#fff" opacity=".35"/>`;
  if (gn.m === "ghost") pat = `<path d="M18 140q14 18 28 0q14 18 28 0q14 18 28 0q14 18 28 0q14 18 28 0q14 18 28 0" fill="#ffffff" stroke="none"/>`;
  if (g.glitter) pat += Array.from({ length: 26 }, () => { const x = 22 + rnd() * 156, y = 46 + rnd() * 108, r = 1 + rnd() * 1.8; return `<path class="glit" d="M${x.toFixed(0)} ${(y - r * 2).toFixed(1)}l${(r * .6).toFixed(1)} ${(r * 1.4).toFixed(1)}l${(r * 1.4).toFixed(1)} ${(r * .6).toFixed(1)}l${(-r * 1.4).toFixed(1)} ${(r * .6).toFixed(1)}l${(-r * .6).toFixed(1)} ${(r * 1.4).toFixed(1)}l${(-r * .6).toFixed(1)} ${(-r * 1.4).toFixed(1)}l${(-r * 1.4).toFixed(1)} ${(-r * .6).toFixed(1)}l${(r * 1.4).toFixed(1)} ${(-r * .6).toFixed(1)}z" fill="${pick(["#fff", "#fff3a8", "#ffd1ec"])}"/>`; }).join("");
  // muzzle blaze (most patterns)
  const blaze = (!skinny && !gn.m && gn.p !== "himi") || gn.m === "golden" ? `<path d="M100 76C108 76 112 90 113 102C114 114 108 122 100 122S86 114 87 102C88 90 92 76 100 76Z" fill="${shadeHex(gn.m === "golden" ? "#ffcc33" : base, .55)}" opacity=".9"/>` : "";
  const wrinkles = skinny ? `<path d="M60 70q10 -6 20 0M120 70q10 -6 20 0M40 120q10 6 20 0M140 120q10 6 20 0" stroke="#d98a82" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M95 58l2 -12M101 58l0 -13M107 58l-2 -12" stroke="#c98a6a" stroke-width="2.5" stroke-linecap="round"/>` : "";
  const peruFringe = gn.h === "peru" ? `<path d="M52 60C66 40 88 34 100 50C112 34 134 40 148 60C136 56 126 62 118 70C112 60 106 58 100 66C94 58 88 60 82 70C74 62 64 56 52 60Z" fill="${gn.m ? patch : shadeHex(base, -.08)}" stroke="#2b1640" stroke-width="4" stroke-linejoin="round"/>` : "";
  const eyeC = EYES[gn.e].c;
  const baby = stage === "baby" || stage === "kid";
  const er = baby ? 11 : 9;
  const elder = isOld(stage), ancient = stage === "ancient";
  // grey hairs: older guineas' fur fades towards silver
  if (elder && !gn.m && !skinny) { const k = ancient ? .42 : .24; const mix = (a, b) => { const p = x => parseInt(x, 16); const A = [1, 3, 5].map(i => p(a.substr(i, 2))), B = [1, 3, 5].map(i => p(b.substr(i, 2))); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); }; if (bodyFill === base) bodyFill = mix(base, "#e9e6ef"); base = mix(base, "#e9e6ef"); patch = mix(patch, "#e9e6ef"); ear = mix(ear, "#d9d4e2"); }
  const sick = g.sick;
  const fur = shadeHex(typeof bodyFill === "string" && bodyFill[0] === "#" ? bodyFill : base, -.05);
  const outfit = opts.noOutfit ? "" : outfitLayers(g.outfit);
  const backL = opts.noOutfit ? "" : slotLayer(g.outfit, "back"), feetL = opts.noOutfit ? "" : slotLayer(g.outfit, "feet");
  const tuftFill = typeof bodyFill === "string" && bodyFill[0] === "#" ? bodyFill : (dye ? DYES[dye].c : patch);
  const mask = opts.noTufts ? 0 : (g.tuftMask || 0);
  const tufts = mask ? `<g class="tufts">${TUFT_SPOTS.map(([x, y, a], i) => (mask >> i) & 1 ? `<path class="tuft" data-t="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})" d="M-8 3L-6 -9L-2 -2L0 -14L3 -2L8 -11L8 3Z" fill="${tuftFill}" stroke="#2b1640" stroke-width="3" stroke-linejoin="round"/>` : "").join("")}</g>` : "";
  const mood = opts.mood || "";
  const sc = opts.stage ? (stage === "baby" ? .62 : stage === "kid" ? .8 : 1) : growScale(g);
  const preg = g.preg ? ' transform="translate(100 160) scale(1.07 1.02) translate(-100 -160)"' : "";
  const flip = opts.flip ? ` transform="translate(200 0) scale(-1 1)"` : "";
  const size = opts.size || 160;
  return `<svg class="gp ${mood} ${gn.m === "disco" ? "disco" : ""} ${opts.cls || ""}" viewBox="0 -26 200 198" width="${size}" height="${Math.round(size * .99)}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>
  <ellipse cx="100" cy="164" rx="${70 * sc}" ry="8" fill="#2b1640" opacity=".15"/>
  <g${flip}><g transform="translate(100 164) scale(${sc}) translate(-100 -164)"><g class="body"${preg}>
    ${glow}${backL}
    <g class="ear ear-l"><ellipse cx="52" cy="56" rx="21" ry="15" transform="rotate(-32 52 56)" fill="${ear}" stroke="#2b1640" stroke-width="5"/><ellipse cx="54" cy="58" rx="10" ry="6" transform="rotate(-32 54 58)" fill="#ffb3c7"/></g>
    <g class="ear ear-r"><ellipse cx="148" cy="56" rx="21" ry="15" transform="rotate(32 148 56)" fill="${ear}" stroke="#2b1640" stroke-width="5"/><ellipse cx="146" cy="58" rx="10" ry="6" transform="rotate(32 146 58)" fill="#ffb3c7"/></g>
    <path d="${body}" fill="${bodyFill}"/>
    <g clip-path="url(#${id}c)">${pat}${blaze}</g>
    ${gn.m === "ghost" ? "" : `<path d="${body}" fill="none" stroke="#2b1640" stroke-width="5"/>`}
    ${gn.m === "ghost" ? `<path d="${body}" fill="none" stroke="#8f80c8" stroke-width="4" stroke-dasharray="2 0"/>` : ""}
    ${tufts}${wrinkles}${peruFringe}
    <ellipse class="foot foot-l" cx="70" cy="160" rx="12" ry="6" fill="#ffc9b0" stroke="#2b1640" stroke-width="4"/>
    <ellipse class="foot foot-r" cx="130" cy="160" rx="12" ry="6" fill="#ffc9b0" stroke="#2b1640" stroke-width="4"/>${feetL}
    <g class="eyes-n"><circle cx="74" cy="92" r="${er}" fill="${eyeC}"/><circle cx="126" cy="92" r="${er}" fill="${eyeC}"/>${gn.e !== "dark" ? `<circle cx="74" cy="92" r="${er * .45}" fill="#2b1640"/><circle cx="126" cy="92" r="${er * .45}" fill="#2b1640"/>` : ""}<circle cx="77.5" cy="88.5" r="${er / 3}" fill="#fff"/><circle cx="129.5" cy="88.5" r="${er / 3}" fill="#fff"/><circle cx="71" cy="96" r="1.4" fill="#fff"/><circle cx="123" cy="96" r="1.4" fill="#fff"/>${elder ? `<path d="M${74 - er - 1} 91a${er + 1} ${er + 1} 0 0 1 ${2 * er + 2} 0z" fill="${typeof bodyFill === "string" && bodyFill[0] === "#" ? bodyFill : base}" stroke="#2b1640" stroke-width="3"/><path d="M${126 - er - 1} 91a${er + 1} ${er + 1} 0 0 1 ${2 * er + 2} 0z" fill="${typeof bodyFill === "string" && bodyFill[0] === "#" ? bodyFill : base}" stroke="#2b1640" stroke-width="3"/>` : ""}</g>
    <g class="eyes-h" fill="none" stroke="#2b1640" stroke-width="5.5" stroke-linecap="round"><path d="M64 96q10 -13 20 0"/><path d="M116 96q10 -13 20 0"/></g>
    <g class="eyes-o" fill="none" stroke="#2b1640" stroke-width="5.5" stroke-linecap="round"><path d="M66 86l14 8l-14 8"/><path d="M134 86l-14 8l14 8"/></g>
    <g class="eyes-s" fill="none" stroke="#2b1640" stroke-width="5" stroke-linecap="round"><path d="M64 92q10 6 20 0"/><path d="M116 92q10 6 20 0"/></g>
    <g class="eyes-sad"><circle cx="74" cy="94" r="${er}" fill="${eyeC}"/><circle cx="126" cy="94" r="${er}" fill="${eyeC}"/><circle cx="77" cy="90" r="3" fill="#fff"/><circle cx="129" cy="90" r="3" fill="#fff"/><path d="M62 80l18 -6M138 80l-18 -6" stroke="#2b1640" stroke-width="4" stroke-linecap="round"/><path d="M68 106q-3 8 0 12q3 -4 0 -12z" fill="#5fd3ff"/></g>
    ${elder ? `<path d="M60 74q14 -10 26 -2M114 72q12 -8 26 2" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M60 74q14 -10 26 -2M114 72q12 -8 26 2" stroke="#2b1640" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".4"/>` : ""}
    <ellipse class="cheek" cx="58" cy="112" rx="11" ry="7" fill="${sick ? "#9bdc52" : "#ff8fb1"}" opacity=".75"/>
    <ellipse class="cheek" cx="142" cy="112" rx="11" ry="7" fill="${sick ? "#9bdc52" : "#ff8fb1"}" opacity=".75"/>
    <path class="nose" d="M92 104Q100 98 108 104Q100 113 92 104Z" fill="#ff7aa8" stroke="#2b1640" stroke-width="3.5" stroke-linejoin="round"/>
    <path class="mouth" d="M89 117q5.5 7 11 0q5.5 7 11 0" stroke="#2b1640" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse class="mouth-open" cx="100" cy="121" rx="8" ry="6" fill="#8a2448" stroke="#2b1640" stroke-width="3"/>
    <path class="tongue" d="M95 121q5 12 10 0z" fill="#ff7aa8" stroke="#2b1640" stroke-width="2.5" stroke-linejoin="round"/>
    ${ancient ? `<path d="M90 124q10 22 20 0q-4 6 -10 6q-6 0 -10 -6z" fill="#f4f2f8" stroke="#2b1640" stroke-width="2.5" stroke-linejoin="round"/>` : ""}
    <g class="whisk"><path class="wh-l" d="M84 108l-26 -4M84 113l-26 4" stroke="${elder ? "#9a94a8" : "#2b1640"}" stroke-width="${elder ? 2.6 : 2}" stroke-linecap="round" opacity=".7"/><path class="wh-r" d="M116 108l26 -4M116 113l26 4" stroke="${elder ? "#9a94a8" : "#2b1640"}" stroke-width="${elder ? 2.6 : 2}" stroke-linecap="round" opacity=".7"/></g>
    ${ancient && !(g.outfit && g.outfit.face) && !opts.noOutfit ? `<g fill="#ffffff" fill-opacity=".2" stroke="#8a6a3a" stroke-width="3"><circle cx="74" cy="93" r="13"/><circle cx="126" cy="93" r="13"/><path d="M87 92q13 -6 26 0" fill="none"/></g>` : ""}
    ${sick ? `<g transform="translate(140 66) rotate(30)"><rect x="-14" y="-6" width="28" height="12" rx="5" fill="#ffd9b0" stroke="#2b1640" stroke-width="2.5"/><path d="M-3 -3v6M3 -3v6" stroke="#d9a070" stroke-width="2"/></g>` : ""}
    ${outfit}
    <circle class="nose-hit" cx="100" cy="106" r="15" fill="transparent"/>
  </g></g></g>${gn.m === "golden" || gn.m === "galaxy" || gn.m === "rainbow" || gn.m === "disco" ? sparkles(rnd) : ""}</svg>`;
}
/* Games draw guineas onto canvases as images, where the page CSS can't reach, so bake the face rules in. */
function standaloneSVG(svg, mood) {
  const show = { happy: "eyes-h", wow: "eyes-o", sleepy: "eyes-s", sad: "eyes-sad" }[mood || ""];
  const id = "sg" + (++svgN), p = ":where(#" + id + ") ";  // zero-specificity: page CSS still wins when the SVG is in the page
  const css = ["eyes-h", "eyes-o", "eyes-s", "eyes-sad", "mouth-open", "tongue"].map(c => p + "." + c).join(",") + "{display:none}" + (show ? `${p}.eyes-n{display:none}${p}.${show}{display:inline}` : "");
  return svg.replace(/^<svg /, `<svg id="${id}" `).replace(/<defs>/, `<defs><style>${css}</style>`);
}
function sparkles(rnd) {
  return Array.from({ length: 3 }, (_, i) => { const x = [18, 182, 172][i], y = [20, 30, 150][i], r = 7 - i; return `<path class="spk" style="animation-delay:${(i * .4).toFixed(1)}s" d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="#ffd84d" stroke="#2b1640" stroke-width="1.6"/>`; }).join("");
}
function slotLayer(o, slot) { const it = o && o[slot] && ITEM[o[slot]]; return it && it.svg ? `<g class="slot-${slot}">${it.svg}</g>` : ""; }
function outfitLayers(o) {
  if (!o) return "";
  return ["neck", "face", "hat"].map(s => { const it = o[s] && ITEM[o[s]]; return it && it.svg ? it.svg : ""; }).join("");
}

/* ---------- life ---------- */
const STAGES = { baby: "Baby", kid: "Kid", adult: "Adult", elder: "Golden Oldie", ancient: "Wise Old Legend" };
/* Guineas grow up and grow old, but never die. */
const AGE_KID = 1 * DAY, AGE_ADULT = 3 * DAY, AGE_ELDER = 14 * DAY, AGE_ANCIENT = 40 * DAY;
const isOld = st => st === "elder" || st === "ancient";
function ageMs(g) { return now() - g.born; }
function lifeLeft(g) { return g.born + g.life * DAY - (g.lost || 0) * HOUR - now(); }
function stageOf(g) {
  const a = ageMs(g);
  if (a < AGE_KID) return "baby";
  if (a < AGE_ADULT) return "kid";
  if (a < AGE_ELDER) return "adult";
  if (a < AGE_ANCIENT) return "elder";
  return "ancient";
}
/* babies grow a little bigger every hour until they're grown up */
function growScale(g) { if (!g.born) return 1; const t = Math.min(1, Math.max(0, ageMs(g) / AGE_ADULT)); return .56 + .44 * (1 - Math.pow(1 - t, 1.6)); }
function nextStageIn(g) { const a = ageMs(g); for (const t of [AGE_KID, AGE_ADULT, AGE_ELDER, AGE_ANCIENT]) if (a < t) return t - a; return 0; }
function ageLabel(g) { const d = ageMs(g) / DAY; return d < 1 ? Math.max(1, Math.floor(d * 24)) + " hours old" : Math.floor(d) + (Math.floor(d) === 1 ? " day old" : " days old"); }

function makeGuinea(o = {}) {
  const genes = o.genes || randGenes(Math.random, { mut: o.mut });
  return {
    id: uid(), name: o.name || pick(NAMES), sex: o.sex || (Math.random() < .5 ? "boar" : "sow"), genes,
    born: o.born || now(), life: o.life || (16 + Math.random() * 8), lost: 0,
    food: o.food ?? 80, joy: o.joy ?? 80, clean: o.clean ?? 90, health: 100,
    pers: o.pers || pick(Object.keys(PERSONALITIES)), fav: o.fav || pick(["strawberry", "carrot", "cucumber", "pepper", "dandelion", "lettuce", "watermelon", "celery"]),
    outfit: o.outfit || {}, boops: 0, fed: 0, gen: o.gen || 1, parents: o.parents || null,
    home: o.home || "hutch", preg: null, lastMate: 0, sick: false, poop: 0, lastPoop: now(), kids: 0, tuftMask: (1 << 1) | (1 << 4) | (1 << 7),
  };
}

/* needs decay per hour */
function simGuinea(g, hrs, farm) {
  if (hrs <= 0) return;
  const st = stageOf(g);
  let food = st === "baby" ? 7 : 5.5, joy = 4, clean = 2.4;
  if (g.home === "farm" && G.farm.grid) { joy *= 1 - Math.min(.6, .12 * Math.min(5, G.farm.grid.filter(s => FB[s.t] && FB[s.t].cat === "fun").length)); clean *= 1 - Math.min(.5, .25 * G.farm.grid.filter(s => s.t === "fountain").length); }
  if (g.sleep) { food *= .6; joy *= .3; clean *= .5; }
  if (typeof sqPerk === "function") { food *= 1 - sqPerk("food"); joy *= 1 - sqPerk("joy"); clean *= 1 - sqPerk("clean"); }
  if (typeof hasPower === "function") { if (hasPower(g, "selfclean")) clean = 0; if (anyPower("aura")) joy *= .6; }
  if (g.pers === "greedy") food *= 1.2;
  if (g.pers === "cuddly") joy *= 1.2;
  if (G.settings.sitter && G.settings.sitter > now()) { food *= .25; joy *= .25; clean *= .25; }
  // farm hay rack auto-feeds
  if (g.home === "farm" && G.farm.hay > 0 && (!G.farm.grid || G.farm.grid.some(s => s.t === "hayrack")) && g.food - food * hrs < 55) {
    const need = Math.min(G.farm.hay, Math.ceil((60 - (g.food - food * hrs)) / 30));
    if (need > 0) { G.farm.hay -= need; g.food = Math.min(100, g.food + need * 30); }
  }
  g.food = clamp(g.food - food * hrs, 0, 100);
  g.joy = clamp(g.joy - joy * hrs, 0, 100);
  g.clean = clamp(g.clean - clean * hrs, 0, 100);
  const bad = (g.food < 12) + (g.clean < 12) + (g.joy < 8);
  if (bad) g.health = clamp(g.health - bad * 3 * hrs, 0, 100);
  else g.health = clamp(g.health + 4 * hrs, 0, 100);
  if (g.health < 40) g.sick = true;
  if (g.sick) g.lost = (g.lost || 0) + hrs * 1.5;
  simSleep(g, hrs);
  // fur gets messy: a new tuft every ~90 minutes
  g.tuftT = (g.tuftT || 0) + hrs;
  while (g.tuftT >= 1.5) { g.tuftT -= 1.5; if (!clean) continue; addTuft(g); }
  // poop! one every 40 minutes, max 8 waiting per guinea
  if (g.home === "farm") {
    const p = Math.floor((now() - g.lastPoop) / (40 * MIN));
    if (p > 0) { g.poop = Math.min(8, (g.poop || 0) + p); g.lastPoop += p * 40 * MIN; }
  } else g.lastPoop = now();
}
function addTuft(g, n = 1) { for (let k = 0; k < n; k++) { const free = TUFT_SPOTS.map((_, i) => i).filter(i => !((g.tuftMask || 0) >> i & 1)); if (!free.length) return; g.tuftMask = (g.tuftMask || 0) | (1 << pick(free)); } }
const tuftCount = g => { let n = 0, m = g.tuftMask || 0; while (m) { n += m & 1; m >>= 1; } return n; };
function mood(g) {
  if (g.sleep) return "sleepy";
  if (g.sick) return "sad";
  const m = Math.min(g.food, g.joy, g.clean);
  if (m < 25) return "sad";
  if (m > 75) return "happy";
  return "";
}
function needLine(g) {
  const P = g.pers;
  if (g.sick) return pick(["I feel icky... can we go to the Vet?", "*weak wheek* I need medicine...", "My tummy is doing backflips. Not the fun kind."]);
  if (g.preg) return pick(["There are BABIES in my tummy! Tiny ones!", "I'm eating for five. Snacks please.", "The babies are kicking. Or farting. Hard to tell."]);
  if (g.food < 30) return pick(P === "dramatic" ? ["I am STARVING. This is the WORST DAY OF MY LIFE.", "I haven't eaten in like... 20 minutes. Tragic."] : ["WHEEK WHEEK WHEEK! (That means FOOD.)", "My tummy is rumbling louder than my toots.", "Feed me or I'll toot on your pillow."]);
  if (g.sleep) return pick(["Zzzzz...", "*tiny snores*", "*snore* ...cucumbers... *snore*"]);
  if ((g.energy ?? 80) < 25) return pick(["*yaaawn* I'm getting sleeeepy...", "My eyes keep closing by themselves...", "Can we do something calm? I'm sooo tired.", "*yawn* ...what were we doing?"]);
  if (g.clean < 30) return pick(["I smell like a sock that ate a sock.", "Bath please. I'm crusty.", "There's hay in places hay should not be."]);
  if (g.joy < 30) return pick(["I'm bored. Boop me? Play with me?", "*sad wheek* Nobody plays with me...", "I need fun! Games! Boops! Anything!"]);
  if (isOld(stageOf(g)) && Math.random() < .45) return pick(["Back in my day, hay was HAY. Not this fancy stuff.", "*creaky stretch* Ooh, my little paws.", "Have I told you about the Great Cucumber of '22?", "I'm not old. I'm VINTAGE.", "Young ones these days, always zooming...", "A nap sounds lovely right about now.", "When I was a baby I was THIS small. Imagine!"]);
  if (stageOf(g) === "baby" && Math.random() < .5) return pick(["*tiny wheek*", "Is that a GIANT? Oh, it's you!", "I'm gonna be SO big one day.", "Milk? No? Lettuce? OK!"]);
  const lines = {
    greedy: ["Is that a snack? Is EVERYTHING a snack?", "I dreamed I was a cucumber. It was delicious."],
    sleepy: ["*yawn* Five more minutes...", "I nap professionally. Also amateurly."],
    sassy: ["I'm not saying I'm the best guinea. But I am.", "Boop me again. I dare you."],
    dramatic: ["This is the BEST moment of my ENTIRE LIFE!", "I love you more than lettuce. And that's A LOT."],
    gassy: ["*toot* ...that was the floor.", "Pull my paw. Go on. Pull it."],
    cuddly: ["Boops are my favourite food.", "Hold me. Squish me. Love me."],
    zoomy: ["ZOOM ZOOM POPCORN POPCORN!", "I just ran 40 laps. Want to see 40 more?"],
    nerdy: ["Did you know guinea pigs aren't pigs OR from Guinea? Wild.", "I read a whole book today. I ate it, but I read it first."],
  };
  return pick(lines[P] || lines.cuddly);
}
function canMate(g) {
  return stageOf(g) === "adult" && !g.preg && !g.sick && g.health > 50 && now() - (g.lastMate || 0) > (g.sex === "sow" ? 10 : 4) * HOUR;
}
