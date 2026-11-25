/* Art carried over from Pudding's Slime Quest: squishies, outfits, snacks. */
const K = "#2b1640";
const SQUISHIES = [
  { id: "mochi", name: "Mochi Bean", shape: "blob", c: "#ffe3ef", r: "common" },
  { id: "toast", name: "Toast Bob", shape: "toast", c: "#f5c27a", r: "common" },
  { id: "berry", name: "Strawberry Squish", shape: "berry", c: "#ff6b8a", r: "common" },
  { id: "cat", name: "Slime Cat", shape: "cat", c: "#9be86a", r: "common" },
  { id: "cloud", name: "Cloud Lump", shape: "cloud", c: "#dff3ff", r: "common" },
  { id: "frog", name: "Gummy Frog", shape: "frog", c: "#7fd6a0", r: "common" },
  { id: "bunny", name: "Boba Bunny", shape: "bunny", c: "#e9d3ff", r: "common" },
  { id: "avo", name: "Avocado Baby", shape: "pear", c: "#b6d96a", r: "common" },
  { id: "potato", name: "Grumpy Potato", shape: "blob", c: "#d9b07a", r: "common", face: "grump" },
  { id: "peach", name: "Peach Butt", shape: "peach", c: "#ffb38a", r: "common" },
  { id: "galaxy", name: "Galaxy Slime", shape: "blob", c: "#6a4fe0", r: "rare", sparkle: true },
  { id: "disco", name: "Disco Toast", shape: "toast", c: "#c9a7ff", r: "rare", sparkle: true },
  { id: "ghost", name: "Spooky Bean", shape: "cloud", c: "#f4f4ff", r: "rare", face: "oo" },
  { id: "pinkcat", name: "Bubblegum Cat", shape: "cat", c: "#ff9bd2", r: "rare", sparkle: true },
  { id: "gold", name: "Golden Pudding", shape: "pig", c: "#ffd84d", r: "legendary", sparkle: true },
  { id: "rainbow", name: "Rainbow Promise Blob", shape: "blob", c: "#fffdf8", r: "legendary", rainbow: true, sparkle: true },
];
const P = {
  blob: "M18 70C10 40 30 24 50 24S90 40 82 70C78 84 22 84 18 70Z",
  toast: "M24 42C12 40 14 18 32 20C40 12 60 12 68 20C86 18 88 40 76 42L76 80Q76 86 70 86L30 86Q24 86 24 80Z",
  berry: "M50 88C22 72 14 46 26 34C36 24 46 30 50 34C54 30 64 24 74 34C86 46 78 72 50 88Z",
  cloud: "M26 78C12 78 10 58 24 56C22 38 44 32 52 44C58 30 82 34 78 54C92 56 92 78 76 78Z",
  pear: "M50 14C62 14 64 32 70 42C84 58 80 88 50 88C20 88 16 58 30 42C36 32 38 14 50 14Z",
  peach: "M50 32C32 14 10 34 18 58C24 78 44 88 50 82C56 88 76 78 82 58C90 34 68 14 50 32Z",
};
function squishySVG(s, locked) {
  const INK = "#2b1640", c = locked ? "#d8ccf2" : s.c;
  let back = "", main = `<path d="${P.blob}"/>`, extra = "", fy = 56, eyes = true;
  switch (s.shape) {
    case "cat": back = `<path d="M22 46L24 14L46 30Z"/><path d="M78 46L76 14L54 30Z"/>`; break;
    case "bunny": back = `<ellipse cx="38" cy="22" rx="8" ry="20" transform="rotate(-12 38 22)"/><ellipse cx="62" cy="22" rx="8" ry="20" transform="rotate(12 62 22)"/>`; break;
    case "pig": back = `<path d="M26 40L28 20L44 30Z"/><path d="M74 40L72 20L56 30Z"/>`; fy = 50;
      if (!locked) extra = `<ellipse cx="50" cy="64" rx="10" ry="7" fill="#ffb3c7" stroke="${INK}" stroke-width="3"/><circle cx="46.5" cy="64" r="1.8" fill="${INK}"/><circle cx="53.5" cy="64" r="1.8" fill="${INK}"/>`; break;
    case "toast": main = `<path d="${P.toast}"/>`; fy = 56; break;
    case "berry": main = `<path d="${P.berry}"/>`; fy = 54;
      if (!locked) extra = `<path d="M36 30L44 21L50 28L56 21L64 30L50 35Z" fill="#5cc24a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` + [[34, 46], [66, 46], [42, 72], [58, 72], [50, 80], [30, 58], [70, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#ffe9a0"/>`).join(""); break;
    case "cloud": main = `<path d="${P.cloud}"/>`; fy = 62; break;
    case "frog": back = `<circle cx="34" cy="32" r="13"/><circle cx="66" cy="32" r="13"/>`; eyes = false;
      if (!locked) extra = `<circle cx="34" cy="31" r="6" fill="#fff"/><circle cx="66" cy="31" r="6" fill="#fff"/><circle cx="35" cy="32" r="3.2" fill="${INK}"/><circle cx="67" cy="32" r="3.2" fill="${INK}"/>`; break;
    case "pear": main = `<path d="${P.pear}"/>`; fy = s.pit === false ? 54 : 46;
      if (!locked && s.pit !== false) extra = `<circle cx="50" cy="70" r="11" fill="#a0612f" stroke="${INK}" stroke-width="3"/><circle cx="46" cy="66" r="3" fill="#c98a55"/>`; break;
    case "peach": main = `<path d="${P.peach}"/>`; fy = 58;
      if (!locked) extra = `<path d="M50 30C50 20 60 13 70 15C66 24 58 29 50 30Z" fill="#5cc24a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M50 36C46 50 46 66 50 80" stroke="#e07c55" stroke-width="3" fill="none" stroke-linecap="round"/>`; break;
  }
  let rb = "";
  if (s.rainbow && !locked) { fy = 44; rb = [["#ff5a5f", 28], ["#ff9f43", 23], ["#ffd43b", 18], ["#51cf66", 13], ["#4dabf7", 8]].map(([col, r]) => `<path d="M${50 - r} 76A${r} ${r} 0 0 1 ${50 + r} 76" stroke="${col}" stroke-width="5" fill="none"/>`).join(""); }
  if (s.id === "galaxy" && !locked) rb = `<circle cx="34" cy="70" r="1.6" fill="#fff"/><circle cx="66" cy="38" r="1.3" fill="#fff"/><circle cx="72" cy="66" r="1.8" fill="#fff"/><circle cx="28" cy="46" r="1.2" fill="#fff"/>`;
  let face = "";
  if (locked) face = `<text x="50" y="${fy + 8}" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="26" fill="#a493cc">?</text>`;
  else {
    const ex = 9;
    if (s.face === "grump") face = `<path d="M${50 - ex - 4} ${fy - 2}l7 2M${50 + ex + 4} ${fy - 2}l-7 2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M45 ${fy + 9}q5 -4 10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    else if (s.face === "sleepy") face = `<path d="M${50 - ex - 4} ${fy}q4 3 8 0M${50 + ex - 4} ${fy}q4 3 8 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M47 ${fy + 8}q3 2 6 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><text x="74" y="30" font-family="Bagel Fat One, sans-serif" font-size="14" fill="${INK}">z</text>`;
    else if (s.face === "oo") face = `<ellipse cx="${50 - ex}" cy="${fy}" rx="3.5" ry="5" fill="${INK}"/><ellipse cx="${50 + ex}" cy="${fy}" rx="3.5" ry="5" fill="${INK}"/><ellipse cx="50" cy="${fy + 10}" rx="3.5" ry="4.5" fill="${INK}"/>`;
    else {
      if (eyes) face += `<circle cx="${50 - ex}" cy="${fy}" r="3.8" fill="${INK}"/><circle cx="${50 + ex}" cy="${fy}" r="3.8" fill="${INK}"/><circle cx="${50 - ex + 1.3}" cy="${fy - 1.4}" r="1.2" fill="#fff"/><circle cx="${50 + ex + 1.3}" cy="${fy - 1.4}" r="1.2" fill="#fff"/>`;
      face += `<path d="M46 ${fy + 6}q2 3 4 0q2 3 4 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    face += `<ellipse cx="${50 - ex - 7}" cy="${fy + 6}" rx="4.5" ry="2.6" fill="#ff7aa8" opacity=".55"/><ellipse cx="${50 + ex + 7}" cy="${fy + 6}" rx="4.5" ry="2.6" fill="#ff7aa8" opacity=".55"/>`;
  }
  const spark = s.sparkle && !locked ? [[12, 22, 6], [88, 30, 5], [90, 78, 4]].map(([x, y, r]) => `<path d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="#ffd84d" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`).join("") : "";
  return `<svg class="sq" viewBox="0 0 100 100" aria-hidden="true">${!locked && s.back ? s.back : ""}<g fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round">${back}${main}</g><path d="M30 40q6 -8 14 -9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>${rb}${!locked && s.front ? s.front : ""}${extra}${face}${spark}</svg>`;
}
const starP = (x, y, r, f) => `<path d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="${f}"/>`;
SQUISHIES.push(
  { series: 2, id: "sleepy", name: "Sleepy Dumpling", shape: "blob", c: "#fff1d6", r: "common", face: "sleepy" },
  { series: 2, id: "banana", name: "Banana Bean", shape: "pear", c: "#ffe066", r: "common", pit: false },
  { series: 2, id: "blueberry", name: "Blueberry Bun", shape: "berry", c: "#7d8cff", r: "common" },
  { series: 2, id: "marsh", name: "Marshmallow Cube", shape: "toast", c: "#ffffff", r: "common", front: `<path d="M30 30C38 22 62 22 70 30" stroke="#e0b07a" stroke-width="6" fill="none" stroke-linecap="round"/>` },
  { series: 2, id: "pickle", name: "Pickle Pal", shape: "pear", c: "#8cc152", r: "common", pit: false, front: [[40, 30], [60, 36], [32, 62], [68, 66], [50, 80], [36, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#6fa83c"/>`).join("") },
  { series: 2, id: "candy", name: "Cotton Candy Cloud", shape: "cloud", c: "#ffc2e2", r: "common", front: `<path d="M40 48q8 -6 16 0M58 70q8 -6 16 0" stroke="#9fd8ff" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { series: 2, id: "jellyfrog", name: "Grape Jelly Frog", shape: "frog", c: "#b98cff", r: "common" },
  { series: 2, id: "melon", name: "Melon Cat", shape: "cat", c: "#c9f29b", r: "common", front: `<path d="M34 30q-6 24 0 48M50 26v54M66 30q6 24 0 48" stroke="#8fd45b" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>` },
  { series: 2, id: "tofu", name: "Tofu Bunny", shape: "bunny", c: "#fbfbf4", r: "common" },
  { series: 2, id: "dino", name: "Dino Egg", shape: "pear", c: "#f3ead2", r: "common", pit: false, front: [[40, 28, 5], [62, 40, 4], [30, 64, 6], [70, 70, 5], [48, 82, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fd08a"/>`).join("") },
  { series: 2, id: "lava", name: "Lava Slime", shape: "blob", c: "#ff7a3d", r: "rare", sparkle: true, front: `<path d="M26 44q6 -4 10 2q4 -8 10 -2" stroke="#ffd84d" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="72" cy="40" r="4" fill="#ffd84d"/>` },
  { series: 2, id: "mermaid", name: "Mermaid Peach", shape: "peach", c: "#6fe0d0", r: "rare", sparkle: true },
  { series: 2, id: "unicorn", name: "Unicorn Bunny", shape: "bunny", c: "#fff6fb", r: "rare", sparkle: true, back: `<path d="M50 0L43 26L57 26Z" fill="#ffd84d" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`, front: `<path d="M32 30q4 -6 8 0M60 30q4 -6 8 0" stroke="#ff9bd2" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { series: 2, id: "ghosttoast", name: "Ghost Toast", shape: "toast", c: "#eef0ff", r: "rare", face: "oo" },
  { series: 2, id: "tinypud", name: "Tiny Pudding", shape: "pig", c: "#f2a65a", r: "legendary", sparkle: true, front: `<path d="M50 28C57 28 59 48 59 62S55 80 50 80 41 76 41 62 43 28 50 28Z" fill="#fff6ea"/><path d="M22 52C26 38 36 30 44 30C40 42 34 52 24 60Z" fill="#8a4a2a"/>` },
  { series: 2, id: "starblob", name: "Star Promise Blob", shape: "blob", c: "#5b6cf0", r: "legendary", sparkle: true, front: [[30, 46, 4], [66, 36, 3], [74, 62, 4], [28, 70, 3], [50, 76, 3.5], [42, 34, 2.5]].map(([x, y, r]) => starP(x, y, r, "#fff3a8")).join("") },
);
const OLD_OUTFITS = [
  { id: "party", slot: "hat", name: "Party Hat", svg: `<g transform="rotate(-12 100 40)"><path d="M78 46L100 -6L122 46Z" fill="#5fd3ff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M86 28H114M92 14H108" stroke="#ff8fc7" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="-8" r="8" fill="#ffd84d" stroke="${K}" stroke-width="4"/></g>` },
  { id: "bow", slot: "hat", name: "Giant Bow", svg: `<g transform="translate(142 40) rotate(18)"><path d="M0 0L-28 -16L-28 16Z" fill="#ff8fc7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M0 0L28 -16L28 16Z" fill="#ff8fc7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle r="8" fill="#ff5fa8" stroke="${K}" stroke-width="4"/></g>` },
  { id: "strawhat", slot: "hat", name: "Strawberry Hat", req: { fed: "strawberry", n: 10 }, text: "Feed Pudding 10 strawberries", svg: `<path d="M56 56C56 14 144 14 144 56C120 46 80 46 56 56Z" fill="#ff5a6e" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>${[[78, 34], [100, 26], [122, 34], [90, 44], [112, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#ffe9a0"/>`).join("")}<path d="M84 22L100 6L116 22L100 18Z" fill="#5cc24a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` },
  { id: "slimehelm", slot: "hat", name: "Slime Helmet", req: { slimes: 1 }, text: "Save a slime in the Slime Lab", svg: `<path d="M44 74C40 18 160 18 156 74C150 68 148 86 140 86S132 66 126 66C116 62 84 62 74 66C68 66 68 90 60 90S52 68 44 74Z" fill="#7be04a" fill-opacity=".88" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M68 40q16 -14 40 -14" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>` },
  { id: "crown", slot: "hat", name: "Tiny Crown", req: { bestPct: 90 }, text: "Finish a quiz round with 90% right on the first try", svg: `<path d="M72 46L68 12L86 28L100 6L114 28L132 12L128 46Z" fill="#ffd84d" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="100" cy="36" r="5" fill="#ff5fa8" stroke="${K}" stroke-width="2.5"/><circle cx="83" cy="38" r="3.5" fill="#5fd3ff"/><circle cx="117" cy="38" r="3.5" fill="#5fd3ff"/>` },
  { id: "boopcrown", slot: "hat", name: "Golden Boop Crown", req: { boops: 100 }, text: "Boop Pudding 100 times", svg: `<path d="M62 48L54 2L80 24L100 -10L120 24L146 2L138 48Z" fill="#ffd84d" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M100 42C88 32 90 20 100 26C110 20 112 32 100 42Z" fill="#ff5fa8" stroke="${K}" stroke-width="3"/>${starP(60, -6, 7, "#fff3a8")}${starP(142, -4, 6, "#fff3a8")}` },
  { id: "glasses", slot: "face", name: "Scholar Specs", svg: `<g fill="#ffffff" fill-opacity=".25" stroke="${K}" stroke-width="4"><circle cx="74" cy="92" r="17"/><circle cx="126" cy="92" r="17"/></g><path d="M91 90q9 -7 18 0" stroke="${K}" stroke-width="4" fill="none"/>` },
  { id: "stache", slot: "face", name: "Fancy Mustache", svg: `<path d="M100 110C92 103 80 103 73 111C69 117 60 116 60 109C59 121 75 125 86 118C92 115 96 113 100 113C104 113 108 115 114 118C125 125 141 121 140 109C140 116 131 117 127 111C120 103 108 103 100 110Z" fill="${K}"/>` },
  { id: "shades", slot: "face", name: "Cool Shades", req: { correct: 25 }, text: "Get 25 quiz answers right on the first try", svg: `<g fill="${K}"><rect x="54" y="80" width="40" height="25" rx="10"/><rect x="106" y="80" width="40" height="25" rx="10"/></g><path d="M94 88H106" stroke="${K}" stroke-width="4"/><path d="M61 86H72M113 86H124" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` },
  { id: "bowtie", slot: "neck", name: "Bow Tie", svg: `<g transform="translate(100 142)"><path d="M0 0L-22 -12L-22 12Z" fill="#5fd3ff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M0 0L22 -12L22 12Z" fill="#5fd3ff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle r="6" fill="#ffd84d" stroke="${K}" stroke-width="3"/></g>` },
  { id: "necklace", slot: "neck", name: "Slime Bead Necklace", req: { fedTotal: 30 }, text: "Feed Pudding 30 snacks", svg: Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 52 + t * 96, y = 128 + Math.sin(Math.PI * t) * 16; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${["#7be04a", "#ff8fc7", "#ffd84d", "#c7b3ff"][i % 4]}" stroke="${K}" stroke-width="2.5"/>`; }).join("") },
  { id: "scarf", slot: "neck", name: "Rainbow Scarf", req: { streak: 10 }, text: "Get 10 quiz answers in a row", svg: `<defs><linearGradient id="rbScarf" x1="0" x2="1"><stop offset="0" stop-color="#ff5a5f"/><stop offset=".25" stop-color="#ffd43b"/><stop offset=".5" stop-color="#51cf66"/><stop offset=".75" stop-color="#4dabf7"/><stop offset="1" stop-color="#845ef7"/></linearGradient></defs><path d="M28 130C70 146 130 146 172 130L174 146C130 162 70 162 26 146Z" fill="url(#rbScarf)" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M138 148L146 176L160 172L154 144Z" fill="#845ef7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` },
  { id: "disco", slot: "fur", name: "Disco Fur", req: { boops: 500 }, text: "Boop Pudding 500 times (yes, really)", svg: "" },
];
const SNACK_ART = [
  { id: "strawberry", name: "Strawberry", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 36C8 29 5 18 10 13C14 9 18 11 20 13C22 11 26 9 30 13C35 18 32 29 20 36Z" fill="#ff5a6e" stroke="${K}" stroke-width="2.5"/><path d="M13 12L17 7L20 10L23 7L27 12L20 14Z" fill="#5cc24a" stroke="${K}" stroke-width="2" stroke-linejoin="round"/><g fill="#ffe9a0"><circle cx="15" cy="19" r="1.2"/><circle cx="25" cy="19" r="1.2"/><circle cx="20" cy="25" r="1.2"/><circle cx="16" cy="28" r="1"/><circle cx="24" cy="28" r="1"/></g></svg>` },
  { id: "celery", name: "Celery", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 38L14 14L22 14L24 38Z" fill="#a8e06a" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><path d="M18 36L17 16M21 36L20 16" stroke="#7cbf4a" stroke-width="1.5"/><path d="M12 14C8 6 14 2 16 8C16 2 24 2 22 8C26 2 32 8 26 14Z" fill="#5cc24a" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/></svg>` },
  { id: "cucumber", name: "Cucumber", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="#3f9a3a" stroke="${K}" stroke-width="2.5"/><circle cx="20" cy="20" r="11.5" fill="#d8f5b0"/><g fill="#fffbe0" stroke="#9fd08a" stroke-width=".8"><ellipse cx="20" cy="14" rx="1.6" ry="2.6"/><ellipse cx="25" cy="22" rx="2.6" ry="1.6"/><ellipse cx="15" cy="22" rx="2.6" ry="1.6"/><ellipse cx="20" cy="26" rx="1.6" ry="2.2"/></g></svg>` },
  { id: "pepper", name: "Bell Pepper", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 12C12 8 6 14 7 22C8 32 14 36 20 34C26 36 32 32 33 22C34 14 28 8 20 12Z" fill="#ff5a3d" stroke="${K}" stroke-width="2.5"/><path d="M20 12C20 8 22 5 26 4" stroke="#3f9a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M12 18q-2 6 0 11" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/></svg>` },
  { id: "dandelion", name: "Dandelion", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 38V20" stroke="#5cc24a" stroke-width="3"/><path d="M20 32C14 30 12 26 12 26C16 26 19 28 20 30" fill="#5cc24a" stroke="${K}" stroke-width="1.5"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<ellipse cx="${(20 + Math.cos(a) * 7).toFixed(1)}" cy="${(14 + Math.sin(a) * 7).toFixed(1)}" rx="4" ry="2" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(20 + Math.cos(a) * 7).toFixed(1)} ${(14 + Math.sin(a) * 7).toFixed(1)})" fill="#ffd84d" stroke="${K}" stroke-width="1"/>`; }).join("")}<circle cx="20" cy="14" r="4.5" fill="#ffb020" stroke="${K}" stroke-width="1.5"/></svg>` },
  { id: "carrot", name: "Carrot", svg: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 12L26 12L21 38Q20 40 19 38Z" fill="#ff9b2e" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 18h4M18 25h4M18 31h3" stroke="#d9731a" stroke-width="2" stroke-linecap="round"/><path d="M20 12C16 4 12 4 12 4C16 6 18 8 19 12M20 12C20 4 22 2 22 2C22 6 21 9 21 12M21 12C26 6 30 6 30 6C26 8 23 10 22 12" stroke="#5cc24a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>` },
];
