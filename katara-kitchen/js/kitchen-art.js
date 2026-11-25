// Decoratable kitchen: every shop item is drawn here in local coordinates,
// then placed into slot positions inside a 400x300 room.
import { O, uid, svg, food, mochi } from './art.js';

const W = 'stroke-linejoin="round" stroke-linecap="round"';
const st = (w = 3) => `stroke="${O}" stroke-width="${w}" ${W}`;
const knob = (x, y, c = '#fff') => `<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" ${st(2)}/>`;

// ----- wallpapers: return {defs, fill}
const WALLS = {
  cream: { name: 'Vanilla Cream', price: 0, make: (id) => ({ defs: `<pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#fff3e2"/><circle cx="6" cy="6" r="1.6" fill="#f6dfc4"/><circle cx="18" cy="18" r="1.6" fill="#f6dfc4"/></pattern>` }) },
  stripes: { name: 'Bubblegum Stripes', price: 80, make: (id) => ({ defs: `<pattern id="${id}" width="28" height="10" patternUnits="userSpaceOnUse"><rect width="28" height="10" fill="#ffe3ec"/><rect width="12" height="10" fill="#ffcadb"/></pattern>` }) },
  gingham: { name: 'Mint Picnic', price: 100, make: (id) => ({ defs: `<pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#f1fbf6"/><rect width="12" height="24" fill="#b9ecd8" opacity=".55"/><rect width="24" height="12" fill="#b9ecd8" opacity=".55"/></pattern>` }) },
  dots: { name: 'Lemon Drops', price: 100, make: (id) => ({ defs: `<pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#fff8d6"/><circle cx="6" cy="6" r="4" fill="#ffe27a"/><circle cx="19" cy="19" r="4" fill="#ffe27a"/></pattern>` }) },
  strawberry: { name: 'Berry Patch', price: 150, make: (id) => ({ defs: `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fff1f4"/>
      <g transform="translate(10 10)"><path d="M0,-3 C-6,-3 -7,4 0,9 C7,4 6,-3 0,-3Z" fill="#ff6f86"/><path d="M-3,-4 l3,2 l3,-2 l-1,3 h-4z" fill="#7fd86b"/></g>
      <g transform="translate(30 30)"><path d="M0,-3 C-6,-3 -7,4 0,9 C7,4 6,-3 0,-3Z" fill="#ff6f86"/><path d="M-3,-4 l3,2 l3,-2 l-1,3 h-4z" fill="#7fd86b"/></g>
      <circle cx="30" cy="10" r="1.6" fill="#ffc1cf"/><circle cx="10" cy="30" r="1.6" fill="#ffc1cf"/></pattern>` }) },
  stars: { name: 'Dreamy Lilac', price: 150, make: (id) => ({ defs: `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#ebe4ff"/>
      <path d="M11,5 l2,5 l5,.5 l-4,3.5 l1.2,5 l-4.2,-2.6 l-4.2,2.6 l1.2,-5 l-4,-3.5 l5,-.5z" fill="#fff" opacity=".9"/>
      <circle cx="32" cy="30" r="2.4" fill="#d3c6ff"/><circle cx="36" cy="8" r="1.4" fill="#fff"/></pattern>` }) },
};

const FLOORS = {
  wood: { name: 'Honey Wood', price: 0, make: (id) => `<pattern id="${id}" width="60" height="20" patternUnits="userSpaceOnUse"><rect width="60" height="20" fill="#e9b984"/><path d="M0,19.5 H60 M40,0 V20" stroke="#d29d66" stroke-width="2"/><path d="M8,8 q8,-3 16,0" stroke="#f3cb9b" stroke-width="2" fill="none"/></pattern>` },
  checker: { name: 'Strawberry Checks', price: 120, make: (id) => `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fff"/><rect width="20" height="20" fill="#ffc4d6"/><rect x="20" y="20" width="20" height="20" fill="#ffc4d6"/></pattern>` },
  mint: { name: 'Mint Tiles', price: 120, make: (id) => `<pattern id="${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#c8f1e1"/><rect x="2" y="2" width="26" height="26" rx="5" fill="#a9e7d0"/></pattern>` },
  terrazzo: { name: 'Sprinkle Terrazzo', price: 160, make: (id) => `<pattern id="${id}" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#fbf6ef"/>
      <circle cx="8" cy="10" r="3" fill="#ffb3c7"/><circle cx="30" cy="8" r="2.4" fill="#8ec9ff"/><circle cx="42" cy="30" r="3" fill="#ffd24d"/><circle cx="18" cy="36" r="2.6" fill="#7fd8be"/><circle cx="34" cy="44" r="2" fill="#c7b5ff"/><path d="M22,22 l5,2" stroke="#ff9ec0" stroke-width="2.4" stroke-linecap="round"/></pattern>` },
};

// ----- objects: draw() in local coords
const ITEMS = {
  window: {
    basic: { name: 'Sunny Window', price: 0, draw: () => `
      <rect x="0" y="0" width="110" height="80" rx="8" fill="#fff" ${st()}/>
      <rect x="8" y="8" width="94" height="64" rx="4" fill="#bfe6ff"/>
      <path d="M22,40 c-8,0 -8,-12 2,-11 c2,-8 14,-8 16,0 c8,0 8,11 0,11z" fill="#fff"/>
      <path d="M70,58 c-6,0 -6,-9 1,-8 c2,-6 10,-6 12,0 c6,0 6,8 0,8z" fill="#fff"/>
      <path d="M55,8 V72 M8,40 H102" stroke="#fff" stroke-width="6"/>
      <rect x="8" y="8" width="94" height="64" rx="4" fill="none" ${st(2.4)}/>
      <rect x="-6" y="76" width="122" height="9" rx="4" fill="#fff" ${st()}/>` },
    round: { name: 'Porthole Window', price: 120, draw: () => `
      <circle cx="55" cy="42" r="40" fill="#ffd9a8" ${st()}/><circle cx="55" cy="42" r="31" fill="#ffd1e3" ${st(2.4)}/>
      <circle cx="68" cy="34" r="9" fill="#fff4b0"/><path d="M28,58 q14,-14 28,0 q12,-10 26,0 v8 h-54z" fill="#9fe0b4"/>
      <circle cx="55" cy="42" r="31" fill="none" ${st(2.4)}/>
      ${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="55" cy="6" r="2.6" fill="#fff" ${st(1.6)} transform="rotate(${a} 55 42)"/>`).join('')}` },
    arch: { name: 'Cottage Arch', price: 180, draw: () => `
      <path d="M8,82 V36 A47,36 0 0 1 102,36 V82Z" fill="#c9ecff" ${st()}/>
      <path d="M20,82 q14,-24 34,-14 q14,-16 38,4 v10z" fill="#a6e3a0"/>
      <path d="M55,4 V82 M8,48 H102" stroke="#fff" stroke-width="5"/>
      <path d="M8,82 V36 A47,36 0 0 1 102,36 V82Z" fill="none" ${st()}/>
      <path d="M0,6 Q12,46 2,86 L-8,86 L-8,6Z M110,6 Q98,46 108,86 L118,86 L118,6Z" fill="#ff9ec0" ${st(2.6)}/>
      <rect x="-12" y="0" width="134" height="8" rx="4" fill="#c99b75" ${st(2.4)}/>
      <rect x="-6" y="80" width="122" height="9" rx="4" fill="#fff" ${st()}/>
      <path d="M24,80 h14 l-2,-12 h-10z M72,80 h14 l-2,-12 h-10z" fill="#ff9248" ${st(2)}/>
      <circle cx="31" cy="64" r="6" fill="#7fd86b" ${st(2)}/><path d="M79,68 l-4,-10 M79,68 l4,-10 M79,68 v-12" stroke="#5fb760" stroke-width="3" stroke-linecap="round"/>` },
    night: { name: 'Starry Night View', price: 220, draw: () => `
      <rect x="-4" y="0" width="118" height="84" rx="10" fill="#fff" ${st()}/>
      <rect x="5" y="8" width="100" height="68" rx="5" fill="#3d3a78"/>
      <circle cx="80" cy="28" r="10" fill="#fff4b0"/><circle cx="85" cy="25" r="9" fill="#3d3a78"/>
      ${[[20, 20], [40, 34], [58, 16], [28, 52], [64, 46], [92, 56], [14, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}
      <path d="M5,76 V64 q16,-10 30,0 q18,-14 36,0 q16,-8 34,0 V76z" fill="#2c2a5c"/>
      <rect x="12" y="62" width="6" height="8" fill="#ffd24d"/><rect x="58" y="60" width="6" height="8" fill="#ffd24d"/>
      <path d="M55,8 V76" stroke="#fff" stroke-width="5"/>
      <rect x="5" y="8" width="100" height="68" rx="5" fill="none" ${st(2.4)}/>
      <rect x="-8" y="80" width="126" height="9" rx="4" fill="#fff" ${st()}/>` },
  },
  sign: {
    none: { name: 'Nothing', price: 0, draw: () => '' },
    clock: { name: 'Kitty Clock', price: 120, draw: () => `
      <path d="M40,44 q-1,8 5,12" fill="none" stroke="${O}" stroke-width="6" stroke-linecap="round" class="clock-tail"/>
      <path d="M22,12 L22,-2 L32,6 M58,12 L58,-2 L48,6" fill="#3d3236" ${st(2.4)}/>
      <circle cx="40" cy="24" r="22" fill="#3d3236" ${st()}/><circle cx="40" cy="24" r="16" fill="#fff"/>
      <path d="M40,24 V13 M40,24 L48,28" ${st(2.4)}/><circle cx="40" cy="24" r="2" fill="${O}"/>
      <circle cx="33" cy="20" r="2" fill="#ff9ec0"/><circle cx="47" cy="20" r="2" fill="#ff9ec0"/>` },
    menu: { name: 'Chalk Menu', price: 150, draw: () => `
      <path d="M16,-6 L40,-14 L64,-6" fill="none" ${st(2)}/>
      <rect x="0" y="-6" width="80" height="54" rx="6" fill="#4f6b5c" stroke="#c99b75" stroke-width="5"/>
      <rect x="0" y="-6" width="80" height="54" rx="6" fill="none" ${st(2)}/>
      <text x="40" y="9" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="10" font-weight="700" fill="#fff">TODAY</text>
      <text x="40" y="22" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="8" fill="#ffd9e6">Ecosystem Soup</text>
      <text x="40" y="32" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="8" fill="#d6f5e8">Food Chain Cake</text>
      <text x="40" y="42" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="8" fill="#fff3b0">Biome Buns</text>` },
    neon: { name: 'Neon Mochi Sign', price: 250, draw: () => `
      <rect x="-6" y="0" width="92" height="40" rx="10" fill="#3a2d4f" ${st(2.4)}/>
      <text x="40" y="27" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="20" font-weight="700" fill="#ffd9ec" stroke="#ff5fa8" stroke-width="1.2" class="neon-text" style="filter: drop-shadow(0 0 3px #ff5fa8) drop-shadow(0 0 6px #ff5fa8)">Mochi's</text>
      <path d="M70,10 c-3,-2 -3,-5 -1,-5 c.8,0 1,.6 1,1 c0,-.4 .4,-1 1,-1 c2,0 2,3 -1,5z" fill="#7ff3ff" style="filter: drop-shadow(0 0 3px #3fe0ff)"/>` },
  },
  shelf: {
    wood: { name: 'Little Wood Shelf', price: 0, slots: 3, draw: () => `
      <rect x="0" y="40" width="100" height="9" rx="3" fill="#c99b75" ${st(2.6)}/>
      <path d="M14,49 l4,10 M86,49 l-4,10" ${st(3)}/>` },
    cubby: { name: 'Pastel Cubbies', price: 180, slots: 4, draw: () => `
      <rect x="-2" y="2" width="104" height="50" rx="6" fill="#ffe0ea" ${st(2.6)}/>
      ${[0, 1, 2, 3].map(i => `<rect x="${2 + i * 25}" y="6" width="22" height="42" rx="4" fill="${['#ffc4d6', '#c8f1e1', '#fff1b8', '#ddd2ff'][i]}"/>`).join('')}
      <rect x="-2" y="2" width="104" height="50" rx="6" fill="none" ${st(2.6)}/>` },
    glass: { name: 'Twinkle Cabinet', price: 320, slots: 5, draw: () => `
      <rect x="-8" y="-2" width="116" height="56" rx="8" fill="#fff" ${st(2.6)}/>
      <rect x="-3" y="3" width="106" height="46" rx="5" fill="#e6f6ff"/>
      <path d="M8,6 l10,40 M30,6 l6,24" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
      <path d="M-3,6 q13,8 26,0 q13,8 26,0 q13,8 26,0 q13,8 26,0" fill="none" stroke="#a69a8f" stroke-width="1.2"/>
      ${[10, 36, 62, 88].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 8 : 7}" r="2.6" fill="${['#ffd24d', '#ff9ec0', '#8ec9ff', '#7fd8be'][i]}" class="twinkle" style="animation-delay:${i * .3}s"/>`).join('')}
      <rect x="-3" y="3" width="106" height="46" rx="5" fill="none" ${st(2)}/>` },
  },
  lamp: {
    none: { name: 'Nothing', price: 0, draw: () => '' },
    pendant: { name: 'Peach Pendant', price: 90, draw: () => `
      <path d="M20,0 V30" ${st(2.4)}/><path d="M2,48 C2,26 38,26 38,48Z" fill="#ffb37f" ${st()}/>
      <ellipse cx="20" cy="50" rx="7" ry="5" fill="#fff6c2" ${st(2)}/><path d="M-10,60 L50,60 L20,50Z" fill="#fff6c2" opacity=".25"/>` },
    cloud: { name: 'Cloud Lamp', price: 160, draw: () => `
      <path d="M20,0 V22" ${st(2.4)}/>
      <path d="M2,46 C-8,46 -8,30 4,30 C4,18 20,14 26,24 C34,16 48,24 44,34 C52,36 50,46 42,46Z" fill="#fff" ${st()}/>
      <circle cx="16" cy="38" r="1.8" fill="${O}"/><circle cx="30" cy="38" r="1.8" fill="${O}"/><path d="M21,41 q2,2 4,0" fill="none" ${st(1.6)}/>
      <path d="M8,52 v6 M22,52 v8 M36,52 v6" stroke="#8ec9ff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` },
    lights: { name: 'Fairy Lights', price: 140, wide: true, draw: () => `
      <path d="M0,4 Q50,30 100,6 Q150,30 200,6 Q250,30 300,6 Q350,30 400,4" fill="none" stroke="#7a6a60" stroke-width="1.6"/>
      ${Array.from({ length: 19 }, (_, i) => { const x = 10 + i * 20.5; const y = 6 + Math.abs(Math.sin((x / 100) * Math.PI)) * 14; return `<ellipse cx="${x}" cy="${y + 5}" rx="3.4" ry="4.6" fill="${['#ffd24d', '#ff9ec0', '#8ec9ff', '#7fd8be', '#c7b5ff'][i % 5]}" class="twinkle" style="animation-delay:${(i % 5) * .25}s" ${st(1.2)}/>`; }).join('')}` },
  },
  fridge: {
    basic: { name: 'Cozy Fridge', price: 0, draw: () => `
      <rect x="0" y="0" width="80" height="148" rx="12" fill="#fbfbfb" ${st()}/>
      <path d="M0,54 H80" ${st()}/><rect x="64" y="18" width="6" height="26" rx="3" fill="#ddd" ${st(2)}/><rect x="64" y="66" width="6" height="40" rx="3" fill="#ddd" ${st(2)}/>
      <circle cx="22" cy="26" r="6" fill="#ff9ec0" ${st(2)}/><rect x="14" y="74" width="26" height="30" rx="2" fill="#fff6c2" ${st(2)} transform="rotate(-6 27 89)"/>
      <path d="M18,84 h16 M18,92 h12" stroke="#c99b75" stroke-width="2" transform="rotate(-6 27 89)"/>
      <rect x="6" y="144" width="12" height="6" rx="2" fill="${O}"/><rect x="62" y="144" width="12" height="6" rx="2" fill="${O}"/>` },
    mint: { name: 'Mint Retro Fridge', price: 220, draw: () => `
      <path d="M0,30 C0,6 10,0 40,0 C70,0 80,6 80,30 V140 C80,146 76,148 70,148 H10 C4,148 0,146 0,140Z" fill="#a9ead2" ${st()}/>
      <path d="M0,58 H80" ${st()}/><rect x="60" y="22" width="12" height="7" rx="3" fill="#e6e6e6" ${st(2)}/><rect x="60" y="72" width="12" height="7" rx="3" fill="#e6e6e6" ${st(2)}/>
      <rect x="22" y="12" width="36" height="10" rx="5" fill="#fff" ${st(1.8)}/><text x="40" y="20" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="7" font-weight="700" fill="#4fb895">CHILL</text>
      <path d="M8,10 q10,-6 22,-6" stroke="#d8f7ea" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="20" cy="96" r="7" fill="#ffd24d" ${st(2)}/><path d="M16,95 l3,3 l5,-6" fill="none" ${st(1.6)}/>` },
    pink: { name: 'Sweetheart Fridge', price: 280, draw: () => `
      <rect x="0" y="0" width="80" height="148" rx="16" fill="#ffc4d6" ${st()}/>
      <path d="M0,56 H80" ${st()}/><rect x="10" y="20" width="5" height="24" rx="2.5" fill="#fff" ${st(1.8)}/><rect x="10" y="66" width="5" height="40" rx="2.5" fill="#fff" ${st(1.8)}/>
      <path d="M50,32 c-9,-6 -9,-14 -3.5,-14 c2,0 3.5,1.6 3.5,3 c0,-1.4 1.5,-3 3.5,-3 c5.5,0 5.5,8 -3.5,14z" fill="#ff5f8f" ${st(1.8)}/>
      <rect x="30" y="70" width="34" height="40" rx="3" fill="#fff" ${st(2)} transform="rotate(5 47 90)"/>
      <circle cx="47" cy="88" r="9" fill="#e6e1ec" ${st(1.6)} transform="rotate(5 47 90)"/><circle cx="44" cy="87" r="1.4" fill="${O}"/><circle cx="50" cy="87" r="1.4" fill="${O}"/>
      <circle cx="26" cy="122" r="5" fill="#8ec9ff" ${st(1.8)}/><circle cx="60" cy="126" r="5" fill="#ffd24d" ${st(1.8)}/>` },
    double: { name: 'Lilac Double Door', price: 360, draw: () => `
      <rect x="-6" y="0" width="92" height="148" rx="10" fill="#ddd2ff" ${st()}/>
      <path d="M40,0 V100 M-6,100 H86" ${st()}/><rect x="31" y="30" width="5" height="40" rx="2.5" fill="#fff" ${st(1.8)}/><rect x="44" y="30" width="5" height="40" rx="2.5" fill="#fff" ${st(1.8)}/>
      <rect x="2" y="16" width="22" height="30" rx="4" fill="#9b8be0" ${st(2)}/><path d="M13,26 v10" stroke="#bfe6ff" stroke-width="3" stroke-linecap="round"/>
      <rect x="20" y="112" width="40" height="6" rx="3" fill="#fff" ${st(1.8)}/>
      <path d="M60,20 l4,-6 l4,6 M56,60 c-4,-3 -4,-6 -1.5,-6 c.8,0 1.5,.7 1.5,1.4 c0,-.7 .7,-1.4 1.5,-1.4 c2.5,0 2.5,3 -1.5,6z" fill="#ff9ec0" ${st(1.4)}/>` },
  },
  stove: {
    basic: { name: 'Trusty Oven', price: 0, draw: () => `
      <rect x="0" y="6" width="90" height="88" rx="8" fill="#fff" ${st()}/>
      <rect x="-4" y="0" width="98" height="12" rx="4" fill="#e9e3dc" ${st()}/>
      ${[16, 32, 58, 74].map(x => knob(x, 22, '#ffb3c7')).join('')}
      <rect x="12" y="34" width="66" height="44" rx="6" fill="#3d3236" ${st()}/><rect x="18" y="40" width="54" height="32" rx="4" fill="#5a4a50"/>
      <path d="M22,44 l10,24" stroke="#7a6a70" stroke-width="3" stroke-linecap="round"/><rect x="24" y="30" width="42" height="5" rx="2.5" fill="#ccc" ${st(1.6)}/>
      <path d="M22,-12 h46 v10 c0,4 -46,4 -46,0z" fill="#ff9ec0" ${st(2.6)}/><path d="M18,-12 h54" ${st(3)}/>
      <path d="M36,-18 q2,-6 0,-10 M50,-18 q2,-6 0,-10" fill="none" stroke="#cfc8d6" stroke-width="2.4" stroke-linecap="round" class="steam"/>` },
    pink: { name: 'Pink Retro Range', price: 260, draw: () => `
      <rect x="0" y="6" width="90" height="88" rx="14" fill="#ff9ec0" ${st()}/>
      <rect x="-4" y="0" width="98" height="12" rx="5" fill="#fff" ${st()}/>
      ${[18, 34, 56, 72].map(x => knob(x, 21)).join('')}
      <circle cx="45" cy="58" r="22" fill="#fff" ${st()}/><circle cx="45" cy="58" r="16" fill="#ffd7a8" ${st(2)}/>
      ${food('cupcake').replace('<svg', '<svg x="33" y="46" width="24" height="24"')}
      <path d="M8,30 h74" stroke="#fff" stroke-width="2.4" opacity=".7"/>
      <path d="M24,-14 C24,-26 66,-26 66,-14 v4 h-42z" fill="#a9ead2" ${st(2.6)}/><circle cx="45" cy="-26" r="4" fill="#fff" ${st(2)}/>` },
    pizza: { name: 'Brick Pizza Oven', price: 340, draw: () => `
      <rect x="-4" y="54" width="98" height="40" rx="6" fill="#c99b75" ${st()}/>
      <path d="M4,94 V64 M30,94 V64 M60,94 V64 M86,94 V64" stroke="#a87a55" stroke-width="2.4"/>
      <path d="M0,56 C0,0 90,0 90,56Z" fill="#e88d6b" ${st()}/>
      <path d="M10,30 h14 M30,18 h14 M54,16 h12 M66,32 h14 M18,44 h12 M60,44 h14" stroke="#c96b4c" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M24,56 C24,28 66,28 66,56Z" fill="#3d3236" ${st()}/>
      <path d="M34,56 c-4,-8 2,-12 4,-18 c2,6 6,6 6,0 c6,6 8,12 4,18z" fill="#ffb02e" class="flame"/><path d="M40,56 c-2,-4 1,-6 2,-9 c2,3 4,5 2,9z" fill="#ffe27a"/>` },
    lilac: { name: 'Double Dream Oven', price: 400, draw: () => `
      <rect x="0" y="-30" width="90" height="124" rx="10" fill="#ddd2ff" ${st()}/>
      ${[0, 1].map(i => `<rect x="12" y="${-20 + i * 56}" width="66" height="42" rx="6" fill="#3d3236" ${st(2.6)}/><rect x="18" y="${-14 + i * 56}" width="54" height="30" rx="4" fill="#ffd7a8" opacity=".85"/>
        <rect x="24" y="${-26 + i * 56}" width="42" height="5" rx="2.5" fill="#fff" ${st(1.6)}/>`).join('')}
      ${food('bread').replace('<svg', '<svg x="34" y="-14" width="22" height="22"')}
      ${food('pie').replace('<svg', '<svg x="33" y="42" width="24" height="24"')}
      <path d="M12,84 h66" stroke="#fff" stroke-width="2.4"/>` },
  },
  counter: {
    basic: { name: 'Butcher Block', price: 0, draw: () => `
      <rect x="0" y="10" width="170" height="68" rx="4" fill="#fff6e8" ${st()}/>
      <rect x="-4" y="0" width="178" height="13" rx="4" fill="#e3ad73" ${st()}/>
      <path d="M57,13 V78 M113,13 V78" ${st()}/>${[44, 70, 100, 126].map(x => knob(x, 40, '#e3ad73')).join('')}
      <path d="M20,-2 h22 v-16 a11,11 0 0 0 -22,0z" fill="#fff" ${st(2.4)}/><path d="M24,-18 h14" stroke="#ff9ec0" stroke-width="3"/>
      <text x="31" y="-6" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="6" font-weight="700" fill="${O}">FLOUR</text>` },
    mixer: { name: 'Mint Mixer Counter', price: 200, draw: () => `
      <rect x="0" y="10" width="170" height="68" rx="4" fill="#a9ead2" ${st()}/>
      <rect x="-4" y="0" width="178" height="13" rx="4" fill="#fff" ${st()}/>
      <path d="M85,13 V78" ${st()}/>${[70, 100].map(x => knob(x, 40)).join('')}
      <g transform="translate(30 -56)">
        <path d="M6,56 h44 l-4,-4 h-36z" fill="#ff9ec0" ${st(2.4)}/><path d="M36,52 V20 C36,6 30,2 18,2 C6,2 0,10 0,18 C0,26 8,28 16,26 H36" fill="#ff9ec0" ${st(2.6)}/>
        <path d="M2,30 C2,52 34,52 34,30Z" fill="#e6e6e6" ${st(2.4)}/><path d="M18,26 V40" ${st(2)}/><circle cx="12" cy="12" r="2.6" fill="#fff"/>
      </g>
      ${food('macaron').replace('<svg', '<svg x="110" y="-24" width="26" height="26"')}
      ${food('cookie').replace('<svg', '<svg x="134" y="-22" width="24" height="24"')}` },
    cakestand: { name: 'Cake Stand Counter', price: 260, draw: () => `
      <rect x="0" y="10" width="170" height="68" rx="4" fill="#fff1b8" ${st()}/>
      <rect x="-4" y="0" width="178" height="13" rx="4" fill="#ff9ec0" ${st()}/>
      <path d="M57,13 V78 M113,13 V78" ${st()}/>${[44, 70, 100, 126].map(x => knob(x, 40)).join('')}
      <path d="M30,0 l6,-14 h20 l6,14z" fill="#fff" ${st(2.4)}/><ellipse cx="46" cy="-15" rx="28" ry="4" fill="#fff" ${st(2.4)}/>
      ${food('layercake').replace('<svg', '<svg x="27" y="-52" width="38" height="40"')}
      <path d="M120,0 v-24 a12,8 0 0 1 24,0 v24z" fill="#e6f6ff" opacity=".9" ${st(2.4)}/><rect x="126" y="-32" width="12" height="6" rx="3" fill="#ff9ec0" ${st(2)}/>
      ${food('cookie').replace('<svg', '<svg x="122" y="-20" width="20" height="20"')}` },
    display: { name: 'Bakery Display Case', price: 360, draw: () => `
      <rect x="0" y="40" width="170" height="38" rx="4" fill="#ffc4d6" ${st()}/>
      <path d="M0,40 V-6 C0,-14 170,-14 170,-6 V40" fill="#e9f7ff" opacity=".85" ${st()}/>
      <path d="M0,16 H170" ${st(2.4)}/>
      ${['croissant', 'donut', 'cupcake', 'tart', 'macaron'].map((k, i) => food(k).replace('<svg', `<svg x="${6 + i * 33}" y="-12" width="28" height="28"`)).join('')}
      ${['bread', 'pie', 'shortcake', 'cookie', 'pudding'].map((k, i) => food(k).replace('<svg', `<svg x="${6 + i * 33}" y="14" width="28" height="28"`)).join('')}
      <path d="M14,-6 l18,40 M120,-6 l10,22" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <rect x="-4" y="38" width="178" height="8" rx="4" fill="#fff" ${st(2.4)}/>
      <path d="M10,56 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0 q8,6 16,0" fill="none" stroke="#fff" stroke-width="3"/>` },
  },
  plant: {
    none: { name: 'Nothing', price: 0, draw: () => '' },
    monstera: { name: 'Happy Monstera', price: 70, draw: () => `
      <path d="M18,22 C4,20 0,6 6,0 C14,4 18,12 18,22Z M18,22 C32,18 36,4 30,-2 C22,2 18,10 18,22Z M18,22 C14,8 18,-6 20,-10 C24,-2 22,12 18,22Z" fill="#6fcf73" ${st(2.2)}/>
      <path d="M6,22 h24 l-3,18 h-18z" fill="#ff9248" ${st(2.4)}/><circle cx="14" cy="30" r="1.4" fill="${O}"/><circle cx="22" cy="30" r="1.4" fill="${O}"/><path d="M16,33 q2,2 4,0" fill="none" ${st(1.4)}/>` },
    herbs: { name: 'Herb Trio', price: 90, draw: () => `
      ${[0, 1, 2].map(i => `<g transform="translate(${i * 14 - 4} 0)"><path d="M6,24 c-6,-10 0,-18 0,-18 c0,0 6,8 0,18 M6,24 c4,-10 10,-10 10,-10 c0,6 -4,10 -10,10" fill="#7fd86b" ${st(1.8)}/>
      <rect x="0" y="24" width="12" height="14" rx="2" fill="${['#8ec9ff', '#ffb3c7', '#fff1b8'][i]}" ${st(2)}/></g>`).join('')}` },
    cactus: { name: 'Cactus Buddies', price: 110, draw: () => `
      <path d="M8,26 V8 a5,5 0 0 1 10,0 V26 M18,16 h4 v-6 a3,3 0 0 1 6,0 v10 c0,4 -4,6 -10,6" fill="#8fd86b" ${st(2.2)}/>
      <circle cx="13" cy="2" r="3" fill="#ff9ec0" ${st(1.6)}/><circle cx="11" cy="14" r="1.2" fill="${O}"/><circle cx="15" cy="14" r="1.2" fill="${O}"/>
      <path d="M2,26 h30 l-3,14 h-24z" fill="#c7b5ff" ${st(2.4)}/>` },
  },
  rug: {
    none: { name: 'Nothing', price: 0, draw: () => '' },
    berry: { name: 'Strawberry Rug', price: 80, draw: () => `
      <ellipse cx="90" cy="26" rx="92" ry="26" fill="#ff8fa8" ${st()}/><ellipse cx="90" cy="26" rx="78" ry="19" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 7"/>
      ${[[40, 20], [70, 32], [110, 18], [140, 30], [90, 12]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#fff4b0"/>`).join('')}` },
    cat: { name: 'Kitty Face Rug', price: 140, draw: () => `
      <path d="M40,10 L46,-14 L64,4 M140,10 L134,-14 L116,4" fill="#cfc8d6" ${st()}/>
      <ellipse cx="90" cy="24" rx="88" ry="28" fill="#e6e1ec" ${st()}/>
      <ellipse cx="62" cy="20" rx="5" ry="6" fill="${O}"/><ellipse cx="118" cy="20" rx="5" ry="6" fill="${O}"/>
      <path d="M84,28 q6,6 12,0" fill="none" ${st(2.4)}/><ellipse cx="46" cy="32" rx="9" ry="5" fill="#ff9eb8" opacity=".7"/><ellipse cx="134" cy="32" rx="9" ry="5" fill="#ff9eb8" opacity=".7"/>` },
    rainbow: { name: 'Rainbow Rug', price: 160, draw: () => `
      ${['#ff8fa8', '#ffb37f', '#ffe27a', '#9be3a5', '#8ec9ff', '#c7b5ff'].map((c, i) => `<ellipse cx="90" cy="26" rx="${92 - i * 13}" ry="${26 - i * 3.7}" fill="${c}" ${i === 0 ? st() : ''}/>`).join('')}` },
  },
  bed: {
    cushion: { name: 'Comfy Cushion', price: 0, draw: () => `
      <ellipse cx="40" cy="30" rx="40" ry="14" fill="#8ec9ff" ${st()}/><ellipse cx="40" cy="26" rx="30" ry="8" fill="#b9dcff"/>
      <path d="M14,24 l4,4 M66,24 l-4,4" ${st(2)}/>` },
    cake: { name: 'Cake Bed', price: 180, draw: () => `
      <path d="M2,22 V36 C2,48 78,48 78,36 V22Z" fill="#ffe7a8" ${st()}/>
      <path d="M2,30 C2,38 78,38 78,30" fill="none" stroke="#ff9eb8" stroke-width="4"/>
      <ellipse cx="40" cy="22" rx="38" ry="11" fill="#fff" ${st()}/>
      <path d="M4,24 c0,8 6,8 6,0 M20,30 c0,8 6,8 6,0 M54,30 c0,8 6,8 6,0 M70,24 c0,8 6,8 6,0" fill="#fff" ${st(2.2)}/>
      <circle cx="68" cy="8" r="6" fill="#ff5a6e" ${st(2.2)}/>` },
    basket: { name: 'Woven Basket', price: 140, draw: () => `
      <path d="M0,18 H80 L72,44 H8Z" fill="#e3ad73" ${st()}/><path d="M4,28 H76 M6,36 H74 M20,18 L22,44 M40,18 V44 M60,18 L58,44" stroke="#c9843f" stroke-width="2.2"/>
      <path d="M0,18 H80 L72,44 H8Z" fill="none" ${st()}/><ellipse cx="40" cy="18" rx="38" ry="7" fill="#ffc4d6" ${st(2.4)}/>
      <path d="M8,14 q32,-10 64,0" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 4"/>` },
  },
};

export const KITCHEN = {
  wall: { label: 'Wallpaper', items: WALLS },
  floor: { label: 'Floor', items: FLOORS },
  window: { label: 'Window', items: ITEMS.window },
  sign: { label: 'Wall Art', items: ITEMS.sign },
  shelf: { label: 'Mini Shelf', items: ITEMS.shelf },
  lamp: { label: 'Lighting', items: ITEMS.lamp },
  fridge: { label: 'Fridge', items: ITEMS.fridge },
  stove: { label: 'Oven', items: ITEMS.stove },
  counter: { label: 'Counter', items: ITEMS.counter },
  plant: { label: 'Plant', items: ITEMS.plant },
  rug: { label: 'Rug', items: ITEMS.rug },
  bed: { label: "Mochi's Bed", items: ITEMS.bed },
};

export const DEFAULT_DECOR = { wall: 'cream', floor: 'wood', window: 'basic', sign: 'none', shelf: 'wood', lamp: 'none', fridge: 'basic', stove: 'basic', counter: 'basic', plant: 'none', rug: 'none', bed: 'cushion' };

// slot placements in the 400x300 room
const POS = {
  window: [145, 10], sign: [296, 8], shelf: [288, 62], lamp: [104, 0], fridge: [16, 66],
  stove: [126, 120], counter: [222, 136], plant: [352, 98], rug: [110, 240], bed: [296, 242],
};

// Preview tile for the shop: draws one item centered in a box
export function itemPreview(slot, id) {
  if (slot === 'wall') {
    const pid = uid('wp'); const w = WALLS[id].make(pid);
    return svg('0 0 100 80', `<defs>${w.defs}</defs><rect x="4" y="4" width="92" height="72" rx="10" fill="url(#${pid})" ${st()}/>`, 'item-prev');
  }
  if (slot === 'floor') {
    const pid = uid('fl');
    return svg('0 0 100 80', `<defs>${FLOORS[id].make(pid)}</defs><path d="M4,30 L96,30 L96,70 Q96,76 90,76 H10 Q4,76 4,70Z" fill="url(#${pid})" ${st()}/><rect x="4" y="26" width="92" height="6" rx="3" fill="#fff" ${st(2)}/>`, 'item-prev');
  }
  const it = KITCHEN[slot].items[id];
  if (!it.draw() ) return svg('0 0 100 80', `<circle cx="50" cy="40" r="22" fill="none" stroke="#d9cfc4" stroke-width="4" stroke-dasharray="6 6"/><path d="M38,28 L62,52" stroke="#d9cfc4" stroke-width="4" stroke-linecap="round"/>`, 'item-prev');
  const VB = {
    window: '-20 -10 150 105', sign: '-14 -22 108 96', shelf: '-14 -10 128 74', lamp: it.wide ? '0 0 200 34' : '-16 -4 76 70',
    fridge: '-14 -8 108 166', stove: '-12 -36 114 136', counter: '-10 -70 190 152', plant: '-6 -14 46 58', rug: '-6 -18 192 76', bed: '-6 -2 92 52',
  }[slot];
  let inner = it.draw();
  if (slot === 'shelf') inner += shelfMinis(slot, it.slots, ['cupcake', 'donut', 'boba', 'teacup', 'macaron'].slice(0, it.slots), id);
  return svg(VB, inner, 'item-prev');
}

function shelfMinis(_s, n, minis, shelfId) {
  const span = shelfId === 'glass' ? 104 : 100;
  const start = shelfId === 'glass' ? -2 : 0;
  const step = span / n;
  const y = shelfId === 'wood' ? 16 : shelfId === 'cubby' ? 18 : 18;
  return minis.slice(0, n).map((k, i) => food(k).replace('<svg', `<svg x="${start + i * step + step / 2 - 13}" y="${y}" width="26" height="26" class="shelf-mini"`)).join('');
}

// Full room render. minis = array of food keys for the shelf.
export function room(decor = DEFAULT_DECOR, minis = []) {
  const d = { ...DEFAULT_DECOR, ...decor };
  const wid = uid('wall'), fid = uid('floor');
  const wall = WALLS[d.wall].make(wid);
  const place = (slot) => {
    const it = KITCHEN[slot].items[d[slot]];
    if (!it) return '';
    const [x, y] = it.wide ? [0, 0] : POS[slot];
    let inner = it.draw();
    if (slot === 'shelf') inner += shelfMinis(slot, it.slots, minis, d.shelf);
    return `<g class="slot slot-${slot}" data-slot="${slot}" transform="translate(${x} ${y})">${inner}</g>`;
  };
  return svg('0 0 400 300', `
    <defs>${wall.defs}${FLOORS[d.floor].make(fid)}
      <radialGradient id="${wid}v" cx=".5" cy=".35" r=".8"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7a5040" stop-opacity=".16"/></radialGradient></defs>
    <rect width="400" height="210" fill="url(#${wid})"/>
    <rect y="206" width="400" height="94" fill="url(#${fid})"/>
    <rect y="200" width="400" height="9" fill="#fff" ${st(2.4)}/>
    ${place('window')}${place('sign')}${place('shelf')}
    ${place('rug')}${place('fridge')}${place('stove')}${place('counter')}${place('plant')}${place('bed')}
    ${place('lamp')}
    <rect width="400" height="300" fill="url(#${wid}v)" pointer-events="none"/>
  `, 'room');
}

export { mochi };
