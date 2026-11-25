/* Wheek World data: items, shops, boxes, couriers, events, quests, achievements, people. */
"use strict";

const starPth = (x, y, r, f) => `<path d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="${f}" stroke="#2b1640" stroke-width="1.6"/>`;
const OLD = Object.fromEntries(OLD_OUTFITS.map(o => [o.id, o.svg]));

/* ---------- outfits (drawn on the guinea; viewBox 0 -26 200 198, head top ≈ y40, eyes y92, nose y106) ---------- */
const OUTFITS = [
  { id: "party", slot: "hat", name: "Party Hat", ico: "🥳", price: 60, svg: OLD.party },
  { id: "bow", slot: "hat", name: "Giant Bow", ico: "🎀", price: 80, svg: OLD.bow },
  { id: "strawhat", slot: "hat", name: "Strawberry Hat", ico: "🍓", price: 120, svg: OLD.strawhat },
  { id: "slimehelm", slot: "hat", name: "Slime Helmet", ico: "🟢", price: 200, svg: OLD.slimehelm },
  { id: "crown", slot: "hat", name: "Tiny Crown", ico: "👑", price: 400, svg: OLD.crown },
  { id: "boopcrown", slot: "hat", name: "Golden Boop Crown", ico: "💛", price: 0, special: true, svg: OLD.boopcrown },
  { id: "cowboy", slot: "hat", name: "Yeehaw Hat", ico: "🤠", price: 150, svg: `<path d="M70 44C68 8 132 8 130 44Z" fill="#b5713a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M70 36H130" stroke="#ff5fa8" stroke-width="6"/><path d="M38 46C50 36 70 46 100 46S150 36 162 46C152 56 130 52 100 52S48 56 38 46Z" fill="#c98448" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` },
  { id: "chef", slot: "hat", name: "Chef Hat", ico: "👨‍🍳", price: 130, svg: `<g fill="#fff" stroke="${K}" stroke-width="4"><circle cx="78" cy="16" r="16"/><circle cx="100" cy="6" r="19"/><circle cx="122" cy="16" r="16"/><rect x="72" y="20" width="56" height="26" rx="4"/></g><path d="M80 34h40" stroke="#e5e0d8" stroke-width="3"/>` },
  { id: "witch", slot: "hat", name: "Witchy Hat", ico: "🧙", price: 220, svg: `<path d="M72 46L112 -24Q116 -18 112 -14L128 46Z" fill="#7a4fd6" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M76 34L124 34L126 44L74 44Z" fill="#ffd84d" stroke="${K}" stroke-width="3"/><ellipse cx="100" cy="48" rx="52" ry="9" fill="#7a4fd6" stroke="${K}" stroke-width="4"/>${starPth(104, 10, 6, "#ffd84d")}` },
  { id: "froghat", slot: "hat", name: "Froggy Hat", ico: "🐸", price: 180, svg: `<path d="M56 54C56 14 144 14 144 54Z" fill="#7be04a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="76" cy="18" r="13" fill="#7be04a" stroke="${K}" stroke-width="4"/><circle cx="124" cy="18" r="13" fill="#7be04a" stroke="${K}" stroke-width="4"/><circle cx="76" cy="18" r="7" fill="#fff"/><circle cx="124" cy="18" r="7" fill="#fff"/><circle cx="78" cy="19" r="4" fill="${K}"/><circle cx="126" cy="19" r="4" fill="${K}"/><path d="M84 40q16 10 32 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="40" rx="6" ry="3.5" fill="#ff8fc7"/><ellipse cx="128" cy="40" rx="6" ry="3.5" fill="#ff8fc7"/>` },
  { id: "viking", slot: "hat", name: "Viking Helmet", ico: "🪓", price: 260, svg: `<path d="M64 26C50 18 40 0 46 -16C50 2 60 12 72 16Z" fill="#fff6ea" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M136 26C150 18 160 0 154 -16C150 2 140 12 128 16Z" fill="#fff6ea" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M62 50C62 6 138 6 138 50Z" fill="#b8c2cc" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M62 46H138" stroke="#8a96a3" stroke-width="7"/><path d="M100 10V46" stroke="#8a96a3" stroke-width="5"/><circle cx="80" cy="46" r="2.5" fill="${K}"/><circle cx="120" cy="46" r="2.5" fill="${K}"/>` },
  { id: "propeller", slot: "hat", name: "Propeller Cap", ico: "🚁", price: 170, svg: `<path d="M64 50C64 12 136 12 136 50Z" fill="#ff5a5f" stroke="${K}" stroke-width="4"/><path d="M82 16C86 30 86 40 84 50M118 16C114 30 114 40 116 50" stroke="#ffd84d" stroke-width="8"/><path d="M64 50C64 12 136 12 136 50Z" fill="none" stroke="${K}" stroke-width="4"/><path d="M100 14V2" stroke="${K}" stroke-width="4"/><g class="prop"><ellipse cx="84" cy="0" rx="16" ry="5" fill="#5fd3ff" stroke="${K}" stroke-width="3"/><ellipse cx="116" cy="0" rx="16" ry="5" fill="#5fd3ff" stroke="${K}" stroke-width="3"/></g><circle cx="100" cy="0" r="4" fill="#ffd84d" stroke="${K}" stroke-width="2.5"/>` },
  { id: "banana", slot: "hat", name: "Banana Hat", ico: "🍌", price: 90, svg: `<path d="M58 40C66 54 134 54 146 30C150 24 156 26 154 32C146 64 70 70 52 44C50 38 56 36 58 40Z" fill="#ffe066" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M150 28l6 -8" stroke="#6b4a1f" stroke-width="5" stroke-linecap="round"/><path d="M70 50q30 8 64 -8" stroke="#e8c330" stroke-width="3" fill="none"/>` },
  { id: "tophat", slot: "hat", name: "Fancy Top Hat", ico: "🎩", price: 300, svg: `<rect x="74" y="-8" width="52" height="50" rx="4" fill="#2b2140" stroke="${K}" stroke-width="4"/><rect x="74" y="26" width="52" height="9" fill="#ff5fa8"/><ellipse cx="100" cy="44" rx="40" ry="8" fill="#2b2140" stroke="${K}" stroke-width="4"/><path d="M82 -2v20" stroke="#fff" stroke-width="3" opacity=".3"/>` },
  { id: "flowers", slot: "hat", name: "Flower Crown", ico: "🌸", price: 140, svg: [[62, 50, "#ff8fc7"], [76, 40, "#ffd84d"], [92, 35, "#c7b3ff"], [108, 35, "#ff8fc7"], [124, 40, "#5fd3ff"], [138, 50, "#ffd84d"]].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-6" rx="4.5" ry="7" transform="rotate(${a})" fill="${c}" stroke="${K}" stroke-width="2"/>`).join("")}<circle r="3.5" fill="#fff3a8" stroke="${K}" stroke-width="1.5"/></g>`).join("") },
  { id: "halo", slot: "hat", name: "Angel Halo", ico: "😇", price: 350, svg: `<ellipse cx="100" cy="14" rx="34" ry="9" fill="none" stroke="#ffd84d" stroke-width="9"/><ellipse cx="100" cy="14" rx="34" ry="9" fill="none" stroke="${K}" stroke-width="2"/><ellipse cx="100" cy="14" rx="40" ry="14" fill="none" stroke="#fff3a8" stroke-width="2" opacity=".7"/>` },
  { id: "poophat", slot: "hat", name: "Swirly Poop Hat", ico: "💩", price: 111, svg: `<path d="M62 50C58 34 76 30 82 32C76 20 92 10 100 16C96 4 116 -6 112 10C126 8 132 22 124 30C142 30 144 50 130 52Z" fill="#9a6235" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M76 40q22 8 46 -4M86 26q14 4 26 -2" stroke="#7a4a22" stroke-width="3" fill="none"/><circle cx="88" cy="40" r="4" fill="#fff"/><circle cx="110" cy="40" r="4" fill="#fff"/><circle cx="89" cy="41" r="2" fill="${K}"/><circle cx="111" cy="41" r="2" fill="${K}"/>` },
  { id: "unicornhorn", slot: "hat", name: "Unicorn Horn", ico: "🦄", price: 0, special: true, svg: `<path d="M92 44L104 -20L114 44Z" fill="#fff6fb" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M95 30l16 -4M98 14l12 -3M101 0l8 -2" stroke="#ff8fc7" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="44" r="7" fill="#c7b3ff" stroke="${K}" stroke-width="2.5"/><circle cx="124" cy="44" r="7" fill="#ff8fc7" stroke="${K}" stroke-width="2.5"/>` },
  { id: "glasses", slot: "face", name: "Scholar Specs", ico: "🤓", price: 70, svg: OLD.glasses },
  { id: "stache", slot: "face", name: "Fancy Mustache", ico: "🥸", price: 75, svg: OLD.stache },
  { id: "shades", slot: "face", name: "Cool Shades", ico: "😎", price: 150, svg: OLD.shades },
  { id: "heartspecs", slot: "face", name: "Heart Glasses", ico: "😍", price: 160, svg: `<g fill="#ff5fa8" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"><path d="M74 108C58 98 52 90 56 82C60 76 70 78 74 84C78 78 88 76 92 82C96 90 90 98 74 108Z"/><path d="M126 108C110 98 104 90 108 82C112 76 122 78 126 84C130 78 140 76 144 82C148 90 142 98 126 108Z"/></g><path d="M92 86q8 -5 16 0" stroke="${K}" stroke-width="3.5" fill="none"/><path d="M62 84l5 -3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` },
  { id: "monocle", slot: "face", name: "Posh Monocle", ico: "🧐", price: 190, svg: `<circle cx="126" cy="92" r="17" fill="#fff" fill-opacity=".25" stroke="#ffd84d" stroke-width="5"/><circle cx="126" cy="92" r="17" fill="none" stroke="${K}" stroke-width="1.5"/><path d="M140 104C150 120 146 136 156 150" stroke="#ffd84d" stroke-width="2.5" fill="none"/>` },
  { id: "clownnose", slot: "face", name: "Honk Nose", ico: "🤡", price: 50, svg: `<circle cx="100" cy="105" r="11" fill="#ff3b3b" stroke="${K}" stroke-width="3.5"/><circle cx="96" cy="101" r="3.5" fill="#fff" opacity=".8"/>` },
  { id: "clothespin", slot: "face", name: "Stink-Proof Nose Clip", ico: "🧷", price: 66, svg: `<g transform="rotate(-20 100 104)"><rect x="92" y="88" width="16" height="30" rx="4" fill="#ff8fc7" stroke="${K}" stroke-width="3.5"/><path d="M92 104h16" stroke="${K}" stroke-width="3"/><circle cx="100" cy="98" r="2.5" fill="#c0c8d0" stroke="${K}" stroke-width="1.5"/></g>` },
  { id: "bowtie", slot: "neck", name: "Bow Tie", ico: "🎀", price: 65, svg: OLD.bowtie },
  { id: "necklace", slot: "neck", name: "Slime Bead Necklace", ico: "📿", price: 110, svg: OLD.necklace },
  { id: "scarf", slot: "neck", name: "Rainbow Scarf", ico: "🧣", price: 140, svg: OLD.scarf },
  { id: "bandana", slot: "neck", name: "Bandit Bandana", ico: "🤠", price: 85, svg: `<path d="M48 132C80 144 120 144 152 132L100 170Z" fill="#3d8bff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>${[[80, 142], [100, 146], [120, 142], [100, 158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/>`).join("")}` },
  { id: "medal", slot: "neck", name: "Gold Medal", ico: "🥇", price: 0, special: true, svg: `<path d="M84 130L96 152M116 130L104 152" stroke="#3d8bff" stroke-width="7"/><circle cx="100" cy="156" r="12" fill="#ffd84d" stroke="${K}" stroke-width="3.5"/><text x="100" y="161" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="13" fill="${K}">1</text>` },
  { id: "pearls", slot: "neck", name: "Fancy Pearls", ico: "🦪", price: 240, svg: Array.from({ length: 13 }, (_, i) => { const t = i / 12, x = 50 + t * 100, y = 132 + Math.sin(Math.PI * t) * 14; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#fffaf3" stroke="${K}" stroke-width="2"/>`; }).join("") },
];

/* ---------- consumables & stuff ---------- */
const ITEMS = [
  // food
  { id: "hay", name: "Hay Bundle", ico: "🌾", cat: "food", price: 4, food: 20, desc: "Crunchy, boring, important." },
  { id: "pellets", name: "Pellets", ico: "🟤", cat: "food", price: 6, food: 30, desc: "Tiny brown nuggets of nutrition." },
  { id: "lettuce", name: "Lettuce", ico: "🥬", cat: "food", price: 6, food: 22, joy: 4, desc: "Leafy and loud to eat." },
  { id: "celery", name: "Celery", ico: "🥢", art: "celery", cat: "food", price: 6, food: 18, joy: 5, desc: "Stringy. Guineas don't care." },
  { id: "cucumber", name: "Cucumber", ico: "🥒", art: "cucumber", cat: "food", price: 7, food: 20, joy: 6, desc: "Watery crunch." },
  { id: "carrot", name: "Carrot", ico: "🥕", art: "carrot", cat: "food", price: 8, food: 18, joy: 9, desc: "A treat, not a meal!" },
  { id: "pepper", name: "Bell Pepper", ico: "🫑", art: "pepper", cat: "food", price: 10, food: 18, health: 12, desc: "Vitamin C power!" },
  { id: "dandelion", name: "Dandelion", ico: "🌼", art: "dandelion", cat: "food", price: 9, food: 15, joy: 12, desc: "A fancy weed." },
  { id: "strawberry", name: "Strawberry", ico: "🍓", art: "strawberry", cat: "food", price: 12, food: 12, joy: 18, toot: .5, desc: "Sweet! Might cause toots." },
  { id: "watermelon", name: "Watermelon", ico: "🍉", cat: "food", price: 15, food: 20, joy: 20, desc: "Juicy chin dribbles." },
  { id: "burrito", name: "Bean Burrito", ico: "🌯", cat: "food", price: 20, food: 40, joy: 10, toot: 3, desc: "Guaranteed toot storm. You've been warned." },
  { id: "haycake", name: "Hay Birthday Cake", ico: "🎂", cat: "food", price: 45, food: 50, joy: 40, desc: "Every day is a birthday." },
  { id: "goldlettuce", name: "Golden Lettuce", ico: "✨", cat: "food", price: 0, rare: true, food: 100, joy: 60, health: 60, clean: 30, desc: "Legendary leafy. Fills everything." },
  { id: "rainbowcarrot", name: "Rainbow Carrot", ico: "🌈", cat: "food", price: 0, rare: true, food: 40, joy: 80, xp: 30, desc: "Tastes like every colour." },
  // care
  { id: "soap", name: "Bubble Bath", ico: "🧼", cat: "care", price: 12, clean: 60, joy: 5, desc: "Scrub-a-dub-wheek." },
  { id: "gummies", name: "Get-Well Gummies", ico: "💊", cat: "care", price: 45, cure: true, health: 50, desc: "Cures sickness. Tastes like grape." },
  { id: "vitc", name: "Vitamin C Drops", ico: "🍊", cat: "care", price: 80, health: 30, life: 1, desc: "+30 health and +1 day of life (max 5 per guinea)." },
  { id: "youth", name: "Fountain of Youth Smoothie", ico: "🥤", cat: "care", price: 1500, life: 4, health: 100, desc: "+4 whole days of life. Very rare, very slurpy." },
  { id: "sitter", name: "Granny Sitter (24h)", ico: "👵", cat: "care", price: 150, sitter: 24, desc: "Granny looks after everyone for 24 hours. Needs drop way slower." },
  // toys
  { id: "paperball", name: "Paper Ball", ico: "🧻", cat: "toy", price: 5, joy: 12, desc: "Rustly. Thrilling." },
  { id: "chew", name: "Chew Stick", ico: "🪵", cat: "toy", price: 8, joy: 15, desc: "Gnaw gnaw gnaw." },
  { id: "squeaky", name: "Squeaky Carrot Toy", ico: "🧸", cat: "toy", price: 25, joy: 30, desc: "SQUEAK SQUEAK SQUEAK." },
  { id: "ballpit", name: "Ball Pit Party", ico: "🎉", cat: "toy", price: 70, joy: 50, all: true, desc: "+50 fun for EVERY guinea you own!" },
  // breeding
  { id: "lovepotion", name: "Love Potion", ico: "💘", cat: "love", price: 120, desc: "Next date always works, and +1 extra baby." },
  { id: "mango", name: "Mutation Mango", ico: "🥭", cat: "love", price: 250, desc: "Next litter is WAY more likely to be rare and weird." },
  { id: "timesnail", name: "Time Snail", ico: "🐌", cat: "love", price: 90, desc: "Babies arrive in 5 minutes instead of hours." },
  // farm
  { id: "haybale", name: "Hay Bale (feeder)", ico: "🧺", cat: "farm", price: 35, hay: 12, desc: "Fills the farm hay rack with 12 meals. Farm guineas eat by themselves!" },
  { id: "seed_lettuce", name: "Lettuce Seeds", ico: "🌱", cat: "seed", price: 10, grow: 30, yields: ["lettuce", 3], desc: "Grows in 30 min. Gives 3 lettuce." },
  { id: "seed_carrot", name: "Carrot Seeds", ico: "🌱", cat: "seed", price: 15, grow: 60, yields: ["carrot", 3], desc: "Grows in 1 hour. Gives 3 carrots." },
  { id: "seed_straw", name: "Strawberry Seeds", ico: "🌱", cat: "seed", price: 25, grow: 120, yields: ["strawberry", 4], desc: "Grows in 2 hours. Gives 4 strawberries." },
  { id: "seed_melon", name: "Watermelon Seeds", ico: "🌱", cat: "seed", price: 40, grow: 240, yields: ["watermelon", 3], desc: "Grows in 4 hours. Gives 3 watermelons." },
  { id: "magicbean", name: "Magic Bean", ico: "🫘", cat: "seed", price: 60, grow: 360, yields: ["magic", 1], desc: "Grows in 6 hours into... something. Nobody knows!" },
  { id: "fertilizer", name: "Poop Fertilizer", ico: "💩", cat: "farm", price: 0, desc: "Made from 10 farm poops. Makes a plant finish growing instantly!" },
  // slime
  { id: "slimekit", name: "Slime Kit", ico: "🧪", cat: "slime", price: 15, desc: "Glue + activator. Makes 1 slime in the Slime Lab." },
  // junk & treasures
  { id: "sock", name: "Mystery Sock", ico: "🧦", cat: "junk", price: 0, sell: 3, desc: "Where did it come from? Where is its friend?" },
  { id: "fossil", name: "Fossilized Poop", ico: "🪨", cat: "junk", price: 0, sell: 120, desc: "Ancient. Valuable. Still smells a bit." },
  { id: "gem", name: "Swamp Gem", ico: "💎", cat: "junk", price: 0, sell: 250, desc: "Sparkly! Sell it at Squeakmart." },
  { id: "keepsake", name: "Rainbow Keepsake", ico: "🌟", cat: "junk", price: 0, sell: 0, desc: "A memory of a guinea you loved." },
];

/* ---------- home decor ---------- */
const WALLS = [
  { id: "w_lilac", name: "Lilac Dots", price: 0, css: "radial-gradient(#d8c6ff 3px, transparent 4px) 0 0/26px 26px, #ece2ff" },
  { id: "w_mint", name: "Mint Stripes", price: 120, css: "repeating-linear-gradient(90deg,#d9fbe6 0 22px,#c4f3d6 22px 44px)" },
  { id: "w_pink", name: "Bubblegum Hearts", price: 160, css: "radial-gradient(circle at 25% 25%,#ffb3d9 6px,transparent 7px) 0 0/40px 40px, #ffe3f1" },
  { id: "w_space", name: "Outer Space", price: 300, css: "radial-gradient(#fff 1.2px,transparent 2px) 0 0/34px 34px, radial-gradient(#fff 1px,transparent 1.6px) 17px 17px/34px 34px, linear-gradient(#2d1f7a,#140c3c)" },
  { id: "w_slime", name: "Slime Drip", price: 220, css: "radial-gradient(ellipse 14px 26px at 50% 0,#7be04a 99%,transparent) 0 0/44px 60px, #e4fbd5" },
  { id: "w_candy", name: "Candy Shop", price: 260, css: "repeating-linear-gradient(45deg,#fff 0 16px,#ffd1e8 16px 32px)" },
];
const FLOORS = [
  { id: "f_wood", name: "Wood Floor", price: 0, css: "repeating-linear-gradient(90deg,#e0b483 0 46px,#d4a574 46px 48px)" },
  { id: "f_hay", name: "Hay Floor", price: 80, css: "repeating-linear-gradient(20deg,#f3d27a 0 6px,#e8c060 6px 9px,#f7dc8c 9px 14px)" },
  { id: "f_check", name: "Checkerboard", price: 150, css: "conic-gradient(#fff 25%,#ffb3d9 0 50%,#fff 0 75%,#ffb3d9 0) 0 0/44px 44px" },
  { id: "f_grass", name: "Indoor Grass", price: 180, css: "repeating-linear-gradient(80deg,#7be04a 0 5px,#5cc22a 5px 8px)" },
  { id: "f_gold", name: "Gold Tiles", price: 500, css: "conic-gradient(#ffd84d 25%,#ffe680 0 50%,#ffd84d 0 75%,#ffe680 0) 0 0/40px 40px" },
];
const DECOR = [
  { id: "d_house", name: "Hidey House", ico: "🏠", price: 90 }, { id: "d_plant", name: "Potted Plant", ico: "🪴", price: 60 },
  { id: "d_couch", name: "Tiny Couch", ico: "🛋️", price: 140 }, { id: "d_teddy", name: "Giant Teddy", ico: "🧸", price: 120 },
  { id: "d_tv", name: "Guinea TV", ico: "📺", price: 200 }, { id: "d_disco", name: "Disco Ball", ico: "🪩", price: 260 },
  { id: "d_tub", name: "Bubble Tub", ico: "🛁", price: 180 }, { id: "d_guitar", name: "Rock Guitar", ico: "🎸", price: 150 },
  { id: "d_mush", name: "Mushroom Lamp", ico: "🍄", price: 110 }, { id: "d_art", name: "Fancy Painting", ico: "🖼️", price: 170 },
  { id: "d_cupcake", name: "Giant Cupcake", ico: "🧁", price: 130 }, { id: "d_toilet", name: "Golden Toilet", ico: "🚽", price: 777 },
  { id: "d_tent", name: "Tiny Circus Tent", ico: "🎪", price: 240 }, { id: "d_robot", name: "Robot Butler", ico: "🤖", price: 400 },
  { id: "d_volcano", name: "Slime Volcano", ico: "🌋", price: 450 }, { id: "d_trophy", name: "Big Trophy", ico: "🏆", price: 0, special: true },
  { id: "d_ufo", name: "Crashed UFO", ico: "🛸", price: 0, special: true }, { id: "d_unicorn", name: "Unicorn Statue", ico: "🦄", price: 0, special: true },
];

const ITEM = {};
OUTFITS.forEach(o => ITEM[o.id] = Object.assign({ cat: "outfit" }, o));
ITEMS.forEach(o => ITEM[o.id] = o);
WALLS.forEach(o => ITEM[o.id] = Object.assign({ cat: "wall", ico: "🎨" }, o));
FLOORS.forEach(o => ITEM[o.id] = Object.assign({ cat: "floor", ico: "🟫" }, o));
DECOR.forEach(o => ITEM[o.id] = Object.assign({ cat: "decor" }, o));

/* ---------- blind boxes ---------- */
const RARITY = {
  common: { n: "Common", c: "#9aa3ad", w: 60 }, rare: { n: "Rare", c: "#3d8bff", w: 27 }, epic: { n: "Epic", c: "#a24dff", w: 10 },
  legendary: { n: "Legendary", c: "#ff9f1a", w: 2.7 }, mythic: { n: "MYTHIC", c: "#ff3d9a", w: .3 },
};
const SQ_RARITY = { common: "common", rare: "rare", legendary: "legendary" };
const BOXES = [
  { id: "box_snack", name: "Snack Sack", ico: "🎒", price: 40, color: "#7be04a", desc: "3 random snacks. Maybe a GOLDEN one." },
  { id: "box_squishy", name: "Squishy Blind Box", ico: "📦", price: 120, color: "#ff8fc7", desc: "1 of 32 squishies. Collect them all!" },
  { id: "box_fashion", name: "Fashion Mystery Bag", ico: "👜", price: 180, color: "#c7b3ff", desc: "A random outfit. Some are box-only!" },
  { id: "box_decor", name: "Decor Surprise Crate", ico: "🧰", price: 220, color: "#5fd3ff", desc: "Random furniture for your hutch." },
  { id: "box_mega", name: "MEGA Mystery Box", ico: "🎁", price: 450, color: "#ffd84d", desc: "Anything. ANYTHING. Even 1,000 coins." },
];

/* ---------- couriers (hourly packages) ---------- */
const COURIERS = [
  { id: "pidge", name: "Pidge the Pigeon Post", ico: "🐦", line: "Coo-coo! Special delivery! Sign here with your paw.", w: 20 },
  { id: "toot", name: "Captain Toot's Fart Balloon", ico: "🎈", line: "PFFFFRRRT! Captain Toot has landed! Smells like adventure!", w: 14, bonus: "burrito" },
  { id: "slug", name: "Sir Slug Express", ico: "🐌", line: "Sorry I'm late. I left last Tuesday. Here's an extra thing.", w: 10, extra: true },
  { id: "fairy", name: "The Squishy Fairy", ico: "🧚", line: "*sparkle* A squishy for a squishy-lover! *sparkle*", w: 9, force: "squishy" },
  { id: "raccoon", name: "A Very Suspicious Raccoon", ico: "🦝", line: "Psst. I found this. Don't ask where. Don't ask why.", w: 12, junk: true },
  { id: "ufo", name: "UFO from Planet Wheek", ico: "🛸", line: "GREETINGS EARTH GUINEA. WE BRING SPACE GIFTS. WHEEK.", w: 7, alien: true },
  { id: "granny", name: "Grandma Wheek's Care Package", ico: "👵", line: "I knitted you something, dear. And packed snacks. Eat!", w: 12, force: "care" },
  { id: "bottle", name: "Message in a Slime Bottle", ico: "🍾", line: "A slimy bottle washed up on the shore! There's something inside!", w: 9 },
  { id: "duck", name: "Delivery Duck", ico: "🦆", line: "Quack. Package. Quack. Sign. Quack.", w: 12 },
  { id: "poopfairy", name: "The Poop Fairy", ico: "🧚‍♀️", line: "The Tooth Fairy is my cousin. I collect... something else. Here's a reward!", w: 6, coins: true },
];

/* ---------- hourly world events ---------- */
const WORLD_EVENTS = [
  { id: "golden", name: "Golden Hour", ico: "🌟", desc: "ALL games pay DOUBLE coins!", w: 14 },
  { id: "sale", name: "Mega Sale", ico: "🏷️", desc: "30% off everything in the shops!", w: 12 },
  { id: "love", name: "Love Is in the Air", ico: "💘", desc: "Guinea dates always work, and twins are more likely!", w: 10 },
  { id: "slimetide", name: "Slime Tide", ico: "🌊", desc: "Dr. Gloop pays DOUBLE for slime!", w: 10 },
  { id: "fartstorm", name: "Fart Storm", ico: "💨", desc: "Swamp games pay DOUBLE. Hold your nose!", w: 10 },
  { id: "babyboom", name: "Baby Boom", ico: "🍼", desc: "Pregnancies go 2x faster and rare babies are more likely!", w: 8 },
  { id: "merchant", name: "Merchant Visit", ico: "🧙‍♂️", desc: "A mysterious merchant is in Town Square with rare stuff!", w: 10 },
  { id: "squishyrain", name: "Squishy Rain", ico: "🌧️", desc: "Squishies are falling from the sky! Tap them on the Map!", w: 9 },
  { id: "parade", name: "Guinea Parade", ico: "🎺", desc: "Boops give DOUBLE fun and sometimes coins!", w: 9 },
  { id: "lucky", name: "Lucky Lettuce", ico: "🍀", desc: "The Wishing Well and Prize Wheel are extra lucky!", w: 8 },
];

/* ---------- people ---------- */
const NPCS = {
  nibbles: { name: "Mrs. Nibbles", ico: "👵", role: "Squeakmart owner", lines: ["Welcome, dearie! Fresh hay, crunchy veggies, all the good stuff!", "Back in my day, a carrot cost 1 coin. And we were GRATEFUL.", "Don't feed them only strawberries, dear. Trust me. The TOOTS."] },
  fernando: { name: "Fabulous Fernando", ico: "🕺", role: "Fluff Boutique designer", lines: ["Darling! Your guinea deserves to be FABULOUS!", "A hat is not a hat. It is a STATEMENT.", "This season, everyone is wearing... banana. Trust me."] },
  gus: { name: "Gacha Gus", ico: "🦝", role: "Blind Box Bonanza", lines: ["Step right up! What's inside? Even I don't know! That's the FUN!", "One more box. One more. The next one's a legendary, I can feel it!", "Don't ask where I get the boxes. Trash cans. I get them from trash cans."] },
  clover: { name: "Auntie Clover", ico: "🐰", role: "Guinea Adoption Center", lines: ["Every guinea deserves a loving home! And lots of veggies!", "Ooh, looking to grow your herd? I have just the cutie!", "If you ever need to rehome a guinea, I'll find them a lovely family."] },
  gloop: { name: "Dr. Gloop", ico: "🧑‍🔬", role: "Slime Scientist", lines: ["SCIENCE! But slimier!", "Make me a slime and I'll pay you! If it's rare... I'll pay you A LOT.", "I once made a slime so good it asked for a job."] },
  hoot: { name: "Dr. Hootsworth", ico: "🦉", role: "Guinea Vet", lines: ["Hoo's feeling poorly? Let me have a look.", "An apple a day keeps... me away. Actually, guineas need bell peppers.", "Remember: fed, clean, happy. That's the recipe for a long life."] },
  skunk: { name: "Toot McGee", ico: "🦨", role: "Carnival of Chance", lines: ["STEP RIGHT UP! Win big! Lose small! Smell... medium.", "The odds are good! Probably! I'm a skunk, not a math teacher!", "Feeling lucky? I'm feeling LUCKY. Also gassy."] },
  pixel: { name: "Pixel", ico: "🤖", role: "Arcade Burrow", lines: ["BEEP BOOP. HIGH SCORE DETECTED? NOT YET. TRY HARDER.", "INSERT GUINEA TO CONTINUE.", "MY FAVOURITE GAME IS LETTUCE CATCH. I HAVE NO HANDS."] },
  swampy: { name: "Old Swampy", ico: "🐸", role: "Stinky Swamp", lines: ["Ribbit. The swamp gives... and the swamp takes.", "Treasure's under the mud. So are the stink bombs. Ribbit.", "Breathe through your mouth, kid. Trust me."] },
  pidge: { name: "Postmaster Pidge", ico: "🐦", role: "Post Office", lines: ["Coo! Packages arrive every hour, rain or shine or fart storm!", "If you're away, I'll hold up to 3 packages. Then I eat them. Kidding! Mostly.", "Some couriers are weird. That raccoon? Not employed here."] },
  hayley: { name: "Farmer Hayley", ico: "👩‍🌾", role: "Guinea Farm", lines: ["Plant seeds, grow veggies, scoop poops. Farm life!", "Keep the hay rack full and the herd feeds itself!", "Poop is just fertilizer that hasn't found its purpose yet."] },
  butterfly: { name: "Flutter", ico: "🦋", role: "Rainbow Meadow keeper", lines: ["Everyone here was loved very much.", "The flowers grow a little brighter for each guinea who rests here.", "They're running through the softest grass now, eating all the dandelions."] },
  wisher: { name: "The Wishing Well", ico: "⛲", role: "Town Square", lines: ["Toss a coin... make a wish... *blub blub*", "I grant wishes. Sometimes. When I feel like it. *blub*"] },
  merchant: { name: "Zanzibar the Wanderer", ico: "🧙‍♂️", role: "Wandering Merchant", lines: ["Rare wares from far-off lands! Only here for one hour!", "This hat? Worn by the Guinea Queen herself. Probably."] },
};

const NEWS = [
  "LOCAL GUINEA EATS 14 CUCUMBERS, REFUSES TO APOLOGIZE",
  "Scientists confirm: boops are good for you",
  "Mysterious raccoon spotted delivering 'totally not stolen' packages",
  "Fart Storm forecast for later today. Experts say: open a window",
  "Dr. Gloop's slime asks for a pay raise",
  "Guinea popcorns so high it briefly enters orbit",
  "Toot McGee denies the carnival games are rigged: 'They're only a LITTLE rigged'",
  "Squeakmart runs out of strawberries AGAIN",
  "Report: 9 out of 10 guineas prefer lettuce. The 10th was asleep",
  "UFO lands in hay field. Aliens 'just wanted snacks'",
  "Wishing Well grants wish, immediately regrets it",
  "Swamp gem found inside a sock. Sock's whereabouts unknown",
  "Fabulous Fernando declares bananas 'the hat of the season'",
  "Sir Slug Express delivers package ordered in 1997",
  "Breaking: guinea discovers its own feet. Very excited",
];

/* ---------- daily quests ---------- */
const QUESTS = [
  { k: "play", n: 3, t: "Play 3 mini-games", r: 60 }, { k: "play", n: 6, t: "Play 6 mini-games", r: 120 },
  { k: "boop", n: 25, t: "Boop guineas 25 times", r: 40 }, { k: "feed", n: 5, t: "Feed your guineas 5 times", r: 50 },
  { k: "earn", n: 300, t: "Earn 300 coins", r: 80 }, { k: "earn", n: 800, t: "Earn 800 coins", r: 160 },
  { k: "package", n: 1, t: "Open a package", r: 40 }, { k: "slime", n: 1, t: "Make a slime", r: 50 },
  { k: "bath", n: 2, t: "Give 2 bubble baths", r: 40 }, { k: "box", n: 1, t: "Open a blind box", r: 50 },
  { k: "luck", n: 3, t: "Play 3 carnival games", r: 60 }, { k: "poop", n: 15, t: "Scoop 15 poops at the farm", r: 60, farm: true },
  { k: "harvest", n: 2, t: "Harvest 2 plants", r: 60, farm: true }, { k: "toy", n: 2, t: "Play with toys 2 times", r: 40 },
];
const STREAK_GIFTS = [
  { coins: 50 }, { coins: 75, item: ["lettuce", 3] }, { coins: 100, item: ["slimekit", 2] }, { coins: 125, item: ["box_snack", 1] },
  { coins: 150, item: ["squeaky", 1] }, { coins: 200, item: ["box_squishy", 1] }, { coins: 400, item: ["box_mega", 1] },
];

/* ---------- achievements ---------- */
const ACHIEVEMENTS = [
  { id: "boop100", n: "Boop Apprentice", d: "Boop 100 times", ico: "👆", test: () => G.stats.boops >= 100, r: 100 },
  { id: "boop1000", n: "Boop Master", d: "Boop 1,000 times", ico: "🫵", test: () => G.stats.boops >= 1000, r: 500, give: "boopcrown" },
  { id: "feed50", n: "Snack Dealer", d: "Feed 50 snacks", ico: "🥕", test: () => G.stats.fed >= 50, r: 150 },
  { id: "rich1k", n: "Coin Collector", d: "Have 1,000 coins at once", ico: "🪙", test: () => G.coins >= 1000, r: 100 },
  { id: "rich10k", n: "Guinea Tycoon", d: "Have 10,000 coins at once", ico: "💰", test: () => G.coins >= 10000, r: 1000 },
  { id: "earn5k", n: "Hard Worker", d: "Earn 5,000 coins total", ico: "💪", test: () => G.stats.earned >= 5000, r: 300 },
  { id: "games25", n: "Gamer Guinea", d: "Play 25 mini-games", ico: "🕹️", test: () => G.stats.games >= 25, r: 200 },
  { id: "games100", n: "Arcade Legend", d: "Play 100 mini-games", ico: "👾", test: () => G.stats.games >= 100, r: 600, give: "medal" },
  { id: "pkg10", n: "Mail Magnet", d: "Open 10 packages", ico: "📬", test: () => G.stats.packages >= 10, r: 200 },
  { id: "box10", n: "Box Addict", d: "Open 10 blind boxes", ico: "📦", test: () => G.stats.boxes >= 10, r: 250 },
  { id: "sq16", n: "Squishy Fan", d: "Collect 16 different squishies", ico: "🍡", test: () => Object.keys(G.squishies).length >= 16, r: 400 },
  { id: "sq32", n: "Squishy Royalty", d: "Collect ALL 32 squishies", ico: "👑", test: () => Object.keys(G.squishies).length >= 32, r: 2000, give: "d_unicorn" },
  { id: "slime5", n: "Goo Guru", d: "Make 5 slimes", ico: "🧪", test: () => G.stats.slimes >= 5, r: 150 },
  { id: "slime25", n: "Slime Scientist", d: "Make 25 slimes", ico: "🥼", test: () => G.stats.slimes >= 25, r: 500 },
  { id: "herd2", n: "Best Friends", d: "Have 2 guineas", ico: "👯", test: () => G.guineas.length >= 2, r: 100 },
  { id: "farm", n: "Farmer", d: "Buy the Guinea Farm", ico: "🌾", test: () => G.farm.level >= 1, r: 300 },
  { id: "herd10", n: "Guinea Rancher", d: "Have 10 guineas", ico: "🐹", test: () => G.guineas.length >= 10, r: 800 },
  { id: "herd25", n: "Guinea Empire", d: "Have 25 guineas", ico: "🏰", test: () => G.guineas.length >= 25, r: 3000 },
  { id: "baby1", n: "Grand-Guinea", d: "Have your first baby guinea", ico: "🍼", test: () => G.stats.babies >= 1, r: 200 },
  { id: "baby20", n: "Baby Factory", d: "Have 20 baby guineas", ico: "👶", test: () => G.stats.babies >= 20, r: 1000 },
  { id: "rare", n: "Ooh Shiny", d: "Own a Rare (or better) guinea", ico: "💎", test: () => G.guineas.some(g => tierOf(g) >= 2), r: 300 },
  { id: "mutant", n: "Weirdo Breeder", d: "Own a Golden, Slime, Ghost, Rainbow, Galaxy or Disco guinea", ico: "🧬", test: () => G.guineas.some(g => g.genes.m), r: 800 },
  { id: "gen3", n: "Family Tree", d: "Breed a 3rd-generation guinea", ico: "🌳", test: () => G.guineas.some(g => g.gen >= 3), r: 500 },
  { id: "poop100", n: "Poop Scooper", d: "Scoop 100 poops", ico: "💩", test: () => G.stats.poop >= 100, r: 250 },
  { id: "harvest10", n: "Green Paws", d: "Harvest 10 plants", ico: "🥬", test: () => G.stats.harvest >= 10, r: 250 },
  { id: "fart50", n: "Toot Connoisseur", d: "Witness 50 toots", ico: "💨", test: () => G.stats.toots >= 50, r: 150 },
  { id: "level10", n: "Big Cheese", d: "Reach keeper level 10", ico: "🧀", test: () => G.level >= 10, r: 500, give: "d_trophy" },
  { id: "streak7", n: "Loyal Keeper", d: "Visit 7 days in a row", ico: "📅", test: () => (G.daily.streak || 0) >= 7, r: 500 },
  { id: "jackpot", n: "JACKPOT!", d: "Win 500+ coins in one go", ico: "🎰", test: () => (G.stats.bigWin || 0) >= 500, r: 300 },
  { id: "dress", n: "Fashionista", d: "Own 10 outfits", ico: "👗", test: () => Object.keys(G.owned).filter(k => ITEM[k] && ITEM[k].cat === "outfit").length >= 10, r: 300 },
];

/* ---------- levels unlock ---------- */
const LEVEL_GIFTS = { 2: ["box_snack", 1], 3: ["slimekit", 3], 4: ["box_squishy", 1], 5: ["lovepotion", 1], 6: ["box_fashion", 1], 7: ["vitc", 1], 8: ["box_decor", 1], 10: ["box_mega", 1], 12: ["mango", 1], 15: ["box_mega", 2], 20: ["youth", 1] };
