// Mochi's Mini Kitchen — hand-built SVG art library.
// Every graphic in the game is drawn here so the whole thing shares one
// soft, chunky, cocoa-outlined kawaii style.

export const O = '#5a3d36'; // outline cocoa
const W = 'stroke-linejoin="round" stroke-linecap="round"';
let _uid = 0;
export const uid = (p = 'u') => `${p}${++_uid}`;

export const svg = (vb, inner, cls = '', extra = '') =>
  `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${extra}>${inner}</svg>`;

const st = (w = 3) => `stroke="${O}" stroke-width="${w}" ${W}`;

// tiny kawaii face used on food minis
export function face(cx, cy, s = 1, mood = 'smile') {
  const e = 3.2 * s, dx = 8 * s;
  let eyes;
  if (mood === 'happy') {
    eyes = `<path d="M${cx - dx - 3 * s},${cy} q${3 * s},${-4 * s} ${6 * s},0 M${cx + dx - 3 * s},${cy} q${3 * s},${-4 * s} ${6 * s},0" fill="none" ${st(2.2 * s)}/>`;
  } else {
    eyes = `<ellipse cx="${cx - dx}" cy="${cy}" rx="${e * .8}" ry="${e}" fill="#3a2723"/><ellipse cx="${cx + dx}" cy="${cy}" rx="${e * .8}" ry="${e}" fill="#3a2723"/>
    <circle cx="${cx - dx + 1 * s}" cy="${cy - 1.2 * s}" r="${1.1 * s}" fill="#fff"/><circle cx="${cx + dx + 1 * s}" cy="${cy - 1.2 * s}" r="${1.1 * s}" fill="#fff"/>`;
  }
  return `<g class="kface">${eyes}
    <ellipse cx="${cx - dx - 4 * s}" cy="${cy + 4.5 * s}" rx="${3.2 * s}" ry="${2 * s}" fill="#ff8fab" opacity=".55"/>
    <ellipse cx="${cx + dx + 4 * s}" cy="${cy + 4.5 * s}" rx="${3.2 * s}" ry="${2 * s}" fill="#ff8fab" opacity=".55"/>
    <path d="M${cx - 2.6 * s},${cy + 2.6 * s} q${1.3 * s},${2.2 * s} ${2.6 * s},0 q${1.3 * s},${2.2 * s} ${2.6 * s},0" fill="none" ${st(1.8 * s)}/></g>`;
}

/* ------------------------------------------------------------------ */
/*  MOCHI — the chubby loaf cat chef                                   */
/* ------------------------------------------------------------------ */
const FUR = '#e6e1ec', FUR2 = '#f7f4fa', STRIPE = '#b9b1c6', PINK = '#ffb3c7';

function mochiEyes(mood) {
  const L = 84, R = 136, Y = 112;
  const open = (x, big = 1) => `
    <ellipse cx="${x}" cy="${Y}" rx="${9.5 * big}" ry="${11.5 * big}" fill="#3a2723"/>
    <circle cx="${x + 3.2}" cy="${Y - 4.6 * big}" r="${3.8 * big}" fill="#fff"/>
    <circle cx="${x - 3}" cy="${Y + 4.4 * big}" r="${1.7 * big}" fill="#fff"/>`;
  const arc = (x) => `<path d="M${x - 9},${Y + 2} Q${x},${Y - 9} ${x + 9},${Y + 2}" fill="none" ${st(4)}/>`;
  const shut = (x) => `<path d="M${x - 9},${Y - 1} Q${x},${Y + 7} ${x + 9},${Y - 1}" fill="none" ${st(3.6)}/>`;
  const heart = (x) => `<path d="M${x},${Y + 9} C${x - 15},${Y - 1} ${x - 9},${Y - 13} ${x},${Y - 5} C${x + 9},${Y - 13} ${x + 15},${Y - 1} ${x},${Y + 9}Z" fill="#ff5d8f" ${st(2.4)}/><circle cx="${x - 4}" cy="${Y - 4}" r="2.2" fill="#fff"/>`;
  const star = (x) => `<path d="M${x},${Y - 12} L${x + 3.5},${Y - 3.5} L${x + 12},${Y - 2.5} L${x + 5.5},${Y + 3.5} L${x + 7.5},${Y + 12} L${x},${Y + 7.5} L${x - 7.5},${Y + 12} L${x - 5.5},${Y + 3.5} L${x - 12},${Y - 2.5} L${x - 3.5},${Y - 3.5}Z" fill="#ffd34d" ${st(2.2)}/>`;
  switch (mood) {
    case 'happy': case 'yum': return arc(L) + arc(R);
    case 'sleep': return shut(L) + shut(R);
    case 'love': return heart(L) + heart(R);
    case 'star': return star(L) + star(R);
    case 'wink': return open(L) + arc(R);
    case 'wow': return open(L, 1.18) + open(R, 1.18);
    case 'sad': return open(L) + open(R) +
      `<path d="M72,96 L92,101 M148,96 L128,101" ${st(3)} fill="none"/>
       <path d="M74,124 q-4,9 0,12 q4,-3 0,-12z" fill="#8fd3ff" ${st(1.6)}/>`;
    default: return open(L) + open(R);
  }
}

function mochiMouth(mood) {
  switch (mood) {
    case 'wow': return `<ellipse cx="110" cy="134" rx="5.5" ry="6.5" fill="#c4505f" ${st(2.4)}/>`;
    case 'sad': return `<path d="M102,136 Q110,129 118,136" fill="none" ${st(2.6)}/>`;
    case 'yum': return `<path d="M101,129 Q105,135 110,130 Q115,135 119,129" fill="none" ${st(2.6)}/><path d="M106,133 q4,9 8,0" fill="#ff7a93" ${st(2)}/>`;
    case 'sleep': return `<path d="M104,131 q6,4 12,0" fill="none" ${st(2.4)}/>`;
    default: return `<path d="M101,129 Q105,135 110,130 Q115,135 119,129" fill="none" ${st(2.6)}/>`;
  }
}

export function mochi({ mood = 'normal', hat = true, glasses = false, cls = '' } = {}) {
  const clip = uid('mc');
  const body = 'M40,150 C34,104 58,64 110,64 C162,64 186,104 180,150 C178,172 150,181 110,181 C70,181 42,172 40,150Z';
  return svg('0 0 220 200', `
  <defs><clipPath id="${clip}"><path d="${body}"/></clipPath></defs>
  <ellipse cx="110" cy="187" rx="72" ry="9" fill="${O}" opacity=".13"/>
  <g class="m-tail">
    <path d="M168,160 C205,160 214,126 196,108" fill="none" stroke="${O}" stroke-width="19" stroke-linecap="round"/>
    <path d="M168,160 C205,160 214,126 196,108" fill="none" stroke="${FUR}" stroke-width="12" stroke-linecap="round"/>
    <path d="M203,128 l-11,-2 M207,141 l-11,-3" stroke="${STRIPE}" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="m-body">
    <path d="M50,104 Q44,70 54,46 Q58,38 66,44 L104,74 Z" fill="${FUR}" ${st(4)}/>
    <path d="M170,104 Q176,70 166,46 Q162,38 154,44 L116,74 Z" fill="${FUR}" ${st(4)}/>
    <path d="M58,90 Q55,70 60,56 L88,76Z" fill="${PINK}"/>
    <path d="M162,90 Q165,70 160,56 L132,76Z" fill="${PINK}"/>
    <path d="${body}" fill="${FUR}" ${st(4)}/>
    <g clip-path="url(#${clip})">
      <ellipse cx="160" cy="76" rx="30" ry="22" fill="#ffd9bd"/>
      <ellipse cx="110" cy="138" rx="40" ry="26" fill="${FUR2}"/>
      <path d="M176,118 q-10,2 -14,9 M180,132 q-10,2 -14,9 M44,120 q10,2 14,9" stroke="${STRIPE}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="110" cy="190" rx="70" ry="14" fill="${O}" opacity=".06"/>
    </g>
    <path d="${body}" fill="none" ${st(4)}/>
    <g class="m-face">
      ${mochiEyes(mood)}
      <ellipse cx="68" cy="130" rx="10.5" ry="6.5" fill="#ff9eb8" opacity=".75"/>
      <ellipse cx="152" cy="130" rx="10.5" ry="6.5" fill="#ff9eb8" opacity=".75"/>
      <path d="M105,121 Q110,118 115,121 Q112.5,126 110,126 Q107.5,126 105,121Z" fill="#ff8fab" ${st(1.6)}/>
      ${mochiMouth(mood)}
      <path d="M56,121 L38,117 M56,128 L38,130 M164,121 L182,117 M164,128 L182,130" ${st(2.4)}/>
    </g>
    <ellipse cx="86" cy="178" rx="15" ry="8.5" fill="${FUR2}" ${st(3)}/>
    <ellipse cx="134" cy="178" rx="15" ry="8.5" fill="${FUR2}" ${st(3)}/>
    <path d="M82,175 v5 M90,175 v5 M130,175 v5 M138,175 v5" ${st(2)}/>
  </g>
  ${glasses ? `<g class="m-glasses"><circle cx="84" cy="112" r="17" fill="#fff" fill-opacity=".25" ${st(3.4)}/><circle cx="136" cy="112" r="17" fill="#fff" fill-opacity=".25" ${st(3.4)}/>
    <path d="M101,110 q9,-6 18,0 M67,108 l-12,-4 M153,108 l12,-4" fill="none" ${st(3.4)}/><path d="M74,102 q5,-4 10,-3 M126,102 q5,-4 10,-3" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>` : ''}
  ${hat ? `<g class="m-hat" transform="rotate(-9 110 60)">
    <path d="M80,58 C62,56 62,28 84,30 C86,8 134,8 136,30 C158,28 158,56 140,58 Z" fill="#fff" ${st(3.6)}/>
    <path d="M94,36 q6,-8 12,-2" fill="none" stroke="#e8e2ee" stroke-width="3" stroke-linecap="round"/>
    <rect x="80" y="54" width="60" height="16" rx="6" fill="#fff" ${st(3.6)}/>
    <path d="M110,66 c-6,-4 -6,-9 -2.5,-9 c1.4,0 2.2,1 2.5,2 c.3,-1 1.1,-2 2.5,-2 c3.5,0 3.5,5 -2.5,9z" fill="#ff7aa2"/>
  </g>` : ''}
  `, `mochi ${cls} mood-${mood}`);
}

/* ------------------------------------------------------------------ */
/*  Rival chef heads (Bake-Off contestants) + small Mochi head         */
/* ------------------------------------------------------------------ */
export const CHEFS = {
  mochi: { name: 'Katara & Mochi', color: '#e6e1ec' },
  bunny: { name: 'Bun Bun', color: '#ffffff' },
  bear: { name: 'Waffles', color: '#d9a27a' },
  frog: { name: 'Pickle', color: '#9ad97a' },
  duck: { name: 'Sir Quacks', color: '#ffe071' },
  panda: { name: 'Dumpling', color: '#ffffff' },
};

export function chefHead(kind = 'mochi', mood = 'normal') {
  const c = CHEFS[kind].color;
  let ears = '', extra = '', snout = '';
  const eyeY = 60;
  if (kind === 'mochi') {
    ears = `<path d="M22,52 L22,22 Q24,15 31,20 L50,36Z" fill="${c}" ${st()}/><path d="M78,52 L78,22 Q76,15 69,20 L50,36Z" fill="${c}" ${st()}/>
    <path d="M27,44 L27,27 L41,36Z" fill="${PINK}"/><path d="M73,44 L73,27 L59,36Z" fill="${PINK}"/>`;
    snout = `<path d="M47,66 q3,-2 6,0 q-1.5,3 -3,3 q-1.5,0 -3,-3z" fill="#ff8fab"/><path d="M45,70 q2.5,3.5 5,0 q2.5,3.5 5,0" fill="none" ${st(2)}/>
    <path d="M22,64 l-10,-2 M22,69 l-10,1 M78,64 l10,-2 M78,69 l10,1" ${st(1.8)}/>`;
  } else if (kind === 'bunny') {
    ears = `<path d="M34,36 C26,4 40,-2 44,30Z" fill="#fff" ${st()}/><path d="M66,36 C74,4 60,-2 56,30Z" fill="#fff" ${st()}/>
    <path d="M36,30 C32,12 38,8 41,28Z" fill="${PINK}"/><path d="M64,30 C68,12 62,8 59,28Z" fill="${PINK}"/>`;
    snout = `<path d="M47,67 q3,-2 6,0 q-1.5,3 -3,3 q-1.5,0 -3,-3z" fill="#ff8fab"/><path d="M50,70 v3 M46,74 q4,3 8,0" fill="none" ${st(2)}/>`;
  } else if (kind === 'bear') {
    ears = `<circle cx="24" cy="34" r="12" fill="${c}" ${st()}/><circle cx="76" cy="34" r="12" fill="${c}" ${st()}/><circle cx="24" cy="34" r="6" fill="#f2c4a2"/><circle cx="76" cy="34" r="6" fill="#f2c4a2"/>`;
    snout = `<ellipse cx="50" cy="71" rx="12" ry="9" fill="#f6dcc6" ${st(2.4)}/><ellipse cx="50" cy="67" rx="4.5" ry="3" fill="${O}"/><path d="M50,70 v3 M46,74 q4,3 8,0" fill="none" ${st(1.8)}/>`;
  } else if (kind === 'frog') {
    ears = `<circle cx="32" cy="36" r="13" fill="${c}" ${st()}/><circle cx="68" cy="36" r="13" fill="${c}" ${st()}/>`;
    extra = `<path d="M36,72 q14,10 28,0" fill="none" ${st(2.4)}/>`;
  } else if (kind === 'duck') {
    extra = `<path d="M50,24 q-6,-12 2,-14 q-2,8 4,10" fill="${c}" ${st(2.4)}/>`;
    snout = `<path d="M36,68 Q50,60 64,68 Q50,80 36,68Z" fill="#ff9f43" ${st(2.4)}/>`;
  } else if (kind === 'panda') {
    ears = `<circle cx="24" cy="34" r="12" fill="#3d3236" ${st()}/><circle cx="76" cy="34" r="12" fill="#3d3236" ${st()}/>`;
    extra = `<ellipse cx="35" cy="60" rx="9" ry="11" fill="#3d3236" transform="rotate(25 35 60)"/><ellipse cx="65" cy="60" rx="9" ry="11" fill="#3d3236" transform="rotate(-25 65 60)"/>`;
    snout = `<ellipse cx="50" cy="69" rx="4" ry="2.6" fill="${O}"/><path d="M46,73 q4,3 8,0" fill="none" ${st(1.8)}/>`;
  }
  const eyeCol = '#3a2723';
  const eyes = mood === 'happy'
    ? `<path d="M30,${eyeY} q6,-7 12,0 M58,${eyeY} q6,-7 12,0" fill="none" stroke="${kind === 'panda' ? '#fff' : O}" stroke-width="3.2" stroke-linecap="round"/>`
    : mood === 'sad'
      ? `<path d="M30,${eyeY - 4} l10,3 M70,${eyeY - 4} l-10,3" ${st(2.4)}/><circle cx="36" cy="${eyeY + 2}" r="4" fill="${eyeCol}"/><circle cx="64" cy="${eyeY + 2}" r="4" fill="${eyeCol}"/>`
      : `${kind === 'panda' ? `<circle cx="36" cy="${eyeY}" r="6" fill="#fff"/><circle cx="64" cy="${eyeY}" r="6" fill="#fff"/>` : ''}<ellipse cx="36" cy="${eyeY}" rx="4.2" ry="5" fill="#3a2723"/><ellipse cx="64" cy="${eyeY}" rx="4.2" ry="5" fill="#3a2723"/>
       <circle cx="37.6" cy="${eyeY - 2}" r="1.8" fill="#fff"/><circle cx="65.6" cy="${eyeY - 2}" r="1.8" fill="#fff"/>`;
  return svg('0 0 100 100', `
    ${ears}
    <ellipse cx="50" cy="62" rx="35" ry="30" fill="${c}" ${st()}/>
    ${extra}
    ${kind === 'frog' ? `<circle cx="32" cy="36" r="13" fill="${c}"/><circle cx="68" cy="36" r="13" fill="${c}"/><path d="M19,40 a13,13 0 0 1 26,-6 M55,34 a13,13 0 0 1 26,6" fill="none" ${st()}/>` : ''}
    ${kind === 'frog'
      ? (mood === 'happy' ? `<path d="M26,37 q6,-7 12,0 M62,37 q6,-7 12,0" fill="none" ${st(3)}/>` : `<circle cx="32" cy="37" r="5.5" fill="#3a2723"/><circle cx="68" cy="37" r="5.5" fill="#3a2723"/><circle cx="34" cy="35" r="2" fill="#fff"/><circle cx="70" cy="35" r="2" fill="#fff"/>`)
      : eyes}
    <ellipse cx="25" cy="72" rx="6" ry="4" fill="#ff8fab" opacity=".6"/><ellipse cx="75" cy="72" rx="6" ry="4" fill="#ff8fab" opacity=".6"/>
    ${snout}
    ${kind === 'frog'
      ? `<g transform="translate(50 30) scale(.62) translate(-50 -30)"><path d="M36,34 C26,32 28,16 40,18 C42,6 58,6 60,18 C72,16 74,32 64,34Z" fill="#fff" ${st(3.6)}/></g>`
      : `<path d="M35,38 C24,36 26,18 39,20 C41,7 59,7 61,20 C74,18 76,36 65,38Z" fill="#fff" ${st(2.6)}/><path d="M35,34 h30 v6 a3,3 0 0 1 -3,3 h-24 a3,3 0 0 1 -3,-3z" fill="#fff" ${st(2.4)}/>`}
  `, `chef-head chef-${kind}`);
}

/* ------------------------------------------------------------------ */
/*  UI icons                                                           */
/* ------------------------------------------------------------------ */
export function coin(cls = '') {
  return svg('0 0 40 40', `
    <circle cx="20" cy="21" r="16" fill="#e8a83a" ${st(2.6)}/>
    <circle cx="20" cy="19" r="16" fill="#ffd24d" ${st(2.6)}/>
    <circle cx="20" cy="19" r="11" fill="none" stroke="#f0b53a" stroke-width="2"/>
    <ellipse cx="20" cy="22" rx="4.6" ry="3.8" fill="#e8a83a"/>
    <circle cx="14.5" cy="16.5" r="2.2" fill="#e8a83a"/><circle cx="18.2" cy="13.6" r="2.2" fill="#e8a83a"/>
    <circle cx="21.8" cy="13.6" r="2.2" fill="#e8a83a"/><circle cx="25.5" cy="16.5" r="2.2" fill="#e8a83a"/>
    <path d="M10,13 q3,-5 8,-6" fill="none" stroke="#fff6c9" stroke-width="2.4" stroke-linecap="round"/>
  `, 'ico-coin ' + cls);
}

export function star(filled = true, cls = '') {
  return svg('0 0 40 40', `<path d="M20,3 L25,14 L37,15.5 L28,23.5 L30.5,35.5 L20,29.5 L9.5,35.5 L12,23.5 L3,15.5 L15,14Z"
    fill="${filled ? '#ffd24d' : '#efe6dc'}" ${st(2.6)}/>${filled ? '<path d="M14,15 l3,-1" stroke="#fff6c9" stroke-width="2.4" stroke-linecap="round"/>' : ''}`, 'ico-star ' + cls);
}

export function heart(filled = true, cls = '') {
  return svg('0 0 40 40', `<path d="M20,34 C4,24 3,12 11,8 C16,5.5 19,9 20,11 C21,9 24,5.5 29,8 C37,12 36,24 20,34Z"
    fill="${filled ? '#ff6f9c' : '#efe6dc'}" ${st(2.6)}/>${filled ? '<circle cx="13" cy="14" r="2.4" fill="#fff"/>' : ''}`, 'ico-heart ' + cls);
}

export function soundIcon(on) {
  return svg('0 0 40 40', `<path d="M7,15 h6 l8,-7 v24 l-8,-7 h-6z" fill="#fff" ${st(2.6)}/>
  ${on ? `<path d="M26,14 q4,6 0,12 M30,10 q8,10 0,20" fill="none" ${st(2.6)}/>` : `<path d="M26,15 l8,10 M34,15 l-8,10" ${st(2.6)}/>`}`, 'ico-sound');
}

export function homeIcon() {
  return svg('0 0 40 40', `<path d="M6,20 L20,7 L34,20 V33 H24 V24 H16 V33 H6Z" fill="#fff" ${st(2.6)}/><path d="M27,9 v6" ${st(3)}/>`, 'ico-home');
}

export function clockIcon() {
  return svg('0 0 40 40', `<circle cx="20" cy="21" r="14" fill="#fff" ${st(2.6)}/><path d="M20,13 V21 L26,24" fill="none" ${st(2.6)}/><path d="M14,5 h12" ${st(3)}/>`, 'ico-clock');
}

export function fireIcon(cls = '') {
  return svg('0 0 60 70', `
    <path d="M30,66 C10,66 4,50 10,38 C12,46 18,48 18,48 C14,32 22,16 34,6 C32,20 44,26 48,38 C50,30 48,26 48,26 C58,38 56,66 30,66Z" fill="#ff7a3d" ${st(2.6)}/>
    <path d="M30,62 C20,62 16,54 20,46 C22,50 26,51 26,51 C24,42 30,34 34,30 C34,40 42,44 42,52 C42,58 38,62 30,62Z" fill="#ffd24d"/>
  `, 'ico-fire ' + cls);
}

export function lockIcon() {
  return svg('0 0 40 40', `<path d="M13,18 v-5 a7,7 0 0 1 14,0 v5" fill="none" ${st(3)}/><rect x="9" y="17" width="22" height="17" rx="5" fill="#ffd24d" ${st(2.6)}/><circle cx="20" cy="25" r="2.6" fill="${O}"/>`, 'ico-lock');
}

export function extinguisher() {
  return svg('0 0 50 70', `<rect x="12" y="20" width="22" height="44" rx="9" fill="#ff5a5a" ${st(2.6)}/>
  <rect x="17" y="12" width="12" height="10" rx="2" fill="#bbb" ${st(2.4)}/><path d="M29,15 h10 l6,-5" fill="none" ${st(3)}/>
  <rect x="15" y="34" width="16" height="12" rx="3" fill="#fff" ${st(2)}/><path d="M17,26 q3,-3 6,0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`, 'ico-ext');
}

export function boxToken(cls = '') {
  return svg('0 0 40 40', `
    <path d="M7,15 L20,9 L33,15 L33,31 L20,37 L7,31Z" fill="#ff9ec0" ${st(2.4)}/>
    <path d="M7,15 L20,21 L33,15 M20,21 V37" fill="none" ${st(2.4)}/>
    <path d="M20,21 L33,15 L33,31 L20,37Z" fill="#ff7aa8" ${st(2.4)}/>
    <text x="13.5" y="31" font-family="Fredoka, sans-serif" font-weight="700" font-size="11" fill="#fff">?</text>
    <path d="M11,13 L13,6 L17,11 M29,13 L27,6 L23,11" fill="#ff9ec0" ${st(2)}/>`, 'ico-token ' + cls);
}

/* ------------------------------------------------------------------ */
/*  Blind box + foil bag                                               */
/* ------------------------------------------------------------------ */
export function blindBox(cls = '', tone = 'pink') {
  const T = {
    pink: ['#ffb3cf', '#ff8fb8', '#ffd6e6'],
    mint: ['#a9ead2', '#7fd8be', '#d8f7ea'],
    lilac: ['#d6c8ff', '#b9a5ff', '#ece5ff'],
  }[tone];
  return svg('0 0 200 220', `
    <ellipse cx="100" cy="208" rx="70" ry="8" fill="${O}" opacity=".14"/>
    <g class="bb-box">
      <path d="M30,80 L100,108 L100,200 L30,172Z" fill="${T[0]}" ${st(4)}/>
      <path d="M170,80 L100,108 L100,200 L170,172Z" fill="${T[1]}" ${st(4)}/>
      <g opacity=".5"><circle cx="48" cy="120" r="4" fill="#fff"/><circle cx="72" cy="150" r="5" fill="#fff"/><circle cx="56" cy="166" r="3" fill="#fff"/>
      <circle cx="150" cy="130" r="4" fill="#fff"/><circle cx="128" cy="160" r="5" fill="#fff"/></g>
      <text x="66" y="160" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="46" fill="#fff" stroke="${O}" stroke-width="3" paint-order="stroke" transform="skewY(22) translate(0 -52)">?</text>
      <g transform="translate(134 128) skewY(-22)">
        <rect x="-26" y="0" width="52" height="30" rx="8" fill="#fff" ${st(2.6)}/>
        <text x="0" y="13" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="10" fill="${O}">MOCHI</text>
        <text x="0" y="25" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="10" fill="#ff6f9c">MINIS</text>
      </g>
    </g>
    <g class="bb-lid">
      <path d="M22,74 L100,44 L178,74 L100,104Z" fill="${T[2]}" ${st(4)}/>
      <path d="M22,74 L22,86 L100,116 L100,104Z" fill="${T[0]}" ${st(4)}/>
      <path d="M178,74 L178,86 L100,116 L100,104Z" fill="${T[1]}" ${st(4)}/>
      <path d="M70,62 L72,34 L90,52 M130,62 L128,34 L110,52" fill="${T[2]}" ${st(3.4)}/>
      <path d="M75,56 L76,42 L84,51 M125,56 L124,42 L116,51" fill="${PINK}"/>
      <path d="M100,62 c-8,-5 -8,-12 -3,-12 c2,0 3,1.4 3,2.6 c0,-1.2 1,-2.6 3,-2.6 c5,0 5,7 -3,12z" fill="#ff6f9c"/>
    </g>
  `, 'blind-box ' + cls);
}

export function foilBag(cls = '') {
  const g = uid('fg');
  return svg('0 0 160 200', `
    <defs><linearGradient id="${g}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f4f1ff"/><stop offset=".35" stop-color="#c9c3e6"/><stop offset=".55" stop-color="#fbe3f1"/>
      <stop offset=".75" stop-color="#bfe8ff"/><stop offset="1" stop-color="#e8e2ff"/></linearGradient></defs>
    <path d="M24,22 h112 l-4,160 h-104z" fill="url(#${g})" ${st(4)}/>
    <path d="M24,22 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l4,6" fill="url(#${g})" ${st(3)}/>
    <path d="M28,182 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l4,4" fill="url(#${g})" ${st(3)}/>
    <path d="M40,40 q10,60 0,120" stroke="#fff" stroke-width="6" opacity=".7" fill="none" stroke-linecap="round"/>
    <path d="M24,44 h112" stroke="${O}" stroke-width="2" stroke-dasharray="6 5" opacity=".55"/>
    <circle cx="80" cy="108" r="28" fill="#fff" opacity=".85" ${st(3)}/>
    <text x="80" y="122" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="38" fill="#ff6f9c">?</text>
  `, 'foil-bag ' + cls);
}

/* ------------------------------------------------------------------ */
/*  FOODS — dishes for orders and blind-box minis (viewBox 0 0 100 100) */
/* ------------------------------------------------------------------ */
const sprinkles = (pts) => pts.map(([x, y, r, c]) =>
  `<rect x="${x - 3}" y="${y - 1.2}" width="6" height="2.4" rx="1.2" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('');
const SPR = ['#7fd8be', '#ffd24d', '#8ec9ff', '#c7b5ff', '#fff'];

export const FOODS = {
  cupcake: () => `
    <path d="M27,58 L73,58 L66,90 L34,90Z" fill="#8ec9ff" ${st()}/>
    <path d="M38,60 L41,89 M50,60 V89 M62,60 L59,89" stroke="#6aaee8" stroke-width="2.4"/>
    <path d="M27,58 L73,58 L66,90 L34,90Z" fill="none" ${st()}/>
    <path d="M22,60 C13,58 16,43 28,44 C26,30 42,24 50,31 C58,22 78,28 73,43 C86,44 86,60 76,60Z" fill="#ffb3c7" ${st()}/>
    <path d="M32,44 q8,-6 16,-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    ${sprinkles([[36, 52, 20, SPR[0]], [60, 48, -30, SPR[1]], [48, 42, 60, SPR[2]], [66, 55, 10, SPR[3]], [42, 35, -20, SPR[1]]])}
    <path d="M52,24 q2,-9 9,-12" fill="none" ${st(2.4)}/><circle cx="51" cy="26" r="7" fill="#ff5a6e" ${st(2.6)}/><circle cx="48.5" cy="24" r="2" fill="#fff"/>
    ${face(50, 72, .9)}`,
  donut: () => `
    <path fill-rule="evenodd" d="M50,16 a34,32 0 1 1 -.1,0z M50,40 a10,9 0 1 0 .1,0z" fill="#f0c38e" ${st()}/>
    <path fill-rule="evenodd" d="M50,20 c10,0 14,2 20,6 c6,4 9,6 10,14 c1,7 4,10 0,18 c-4,8 -10,12 -18,14 c-6,2 -14,2 -22,-1 c-8,-3 -12,-8 -15,-16 c-2,-6 0,-10 2,-16 c3,-8 8,-12 12,-14 c4,-3 7,-5 11,-5z M50,39 a11.5,10.5 0 1 0 .1,0z" fill="#ff9ec0" ${st(2.6)}/>
    ${sprinkles([[34, 34, 30, SPR[0]], [64, 30, -20, SPR[1]], [72, 52, 70, SPR[2]], [30, 56, -60, SPR[3]], [50, 28, 0, SPR[4]], [58, 66, 40, SPR[0]], [40, 66, -10, SPR[1]]])}
    ${face(50, 50, .7, 'happy')}`,
  croissant: () => `
    <path d="M12,66 C10,50 22,44 30,50 L36,62 Z" fill="#f5b963" ${st()}/>
    <path d="M88,66 C90,50 78,44 70,50 L64,62 Z" fill="#f5b963" ${st()}/>
    <path d="M26,52 C26,36 38,32 44,40 L46,64 L32,66 Z" fill="#f7c579" ${st()}/>
    <path d="M74,52 C74,36 62,32 56,40 L54,64 L68,66 Z" fill="#f7c579" ${st()}/>
    <path d="M38,64 C34,36 44,26 50,26 C56,26 66,36 62,64 C58,70 42,70 38,64Z" fill="#ffd08a" ${st()}/>
    <path d="M44,34 q6,-4 12,0" stroke="#fff3d6" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${face(50, 52, .8)}`,
  macaron: () => `
    <ellipse cx="50" cy="66" rx="32" ry="15" fill="#c7b5ff" ${st()}/>
    <path d="M20,62 q4,6 8,0 q4,6 8,0 q4,6 8,0 q4,6 8,0 q4,6 8,0 q4,6 8,0 q4,6 8,0" fill="none" ${st(2.2)}/>
    <rect x="20" y="49" width="60" height="12" rx="6" fill="#fff4e0" ${st()}/>
    <path d="M18,48 C18,30 82,30 82,48 C82,56 18,56 18,48Z" fill="#d6c8ff" ${st()}/>
    <path d="M30,40 q10,-6 22,-4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    ${face(50, 45, .8)}`,
  cookie: () => `
    <path fill-rule="evenodd" d="M50,18 C70,18 84,32 84,52 C84,56 82,58 80,58 C76,56 72,60 74,64 C76,68 72,72 70,74 C64,80 58,84 50,84 C30,84 16,70 16,50 C16,32 30,18 50,18Z" fill="#e8b06e" ${st()}/>
    <circle cx="34" cy="38" r="4.5" fill="#6b4434"/><circle cx="58" cy="32" r="4" fill="#6b4434"/><circle cx="30" cy="62" r="4" fill="#6b4434"/>
    <circle cx="62" cy="70" r="3.6" fill="#6b4434"/><circle cx="70" cy="44" r="3.4" fill="#6b4434"/>
    ${face(48, 52, .9)}`,
  pancakes: () => `
    <ellipse cx="50" cy="84" rx="38" ry="8" fill="#fff" ${st()}/>
    <rect x="18" y="64" width="64" height="16" rx="8" fill="#f2b56b" ${st()}/>
    <rect x="16" y="50" width="68" height="16" rx="8" fill="#f7c27c" ${st()}/>
    <rect x="18" y="36" width="64" height="16" rx="8" fill="#f2b56b" ${st()}/>
    <path d="M20,40 C30,32 70,32 80,40 L80,46 C76,50 74,58 70,58 C66,58 66,50 60,50 C54,50 56,62 50,62 C44,62 46,48 40,48 C34,48 34,54 28,54 C22,54 22,46 20,44Z" fill="#c9773a" ${st(2.4)}/>
    <rect x="42" y="27" width="16" height="10" rx="3" fill="#fff1a8" ${st(2.4)}/>
    ${face(50, 72, .75, 'happy')}`,
  sushi: () => `
    <ellipse cx="50" cy="76" rx="34" ry="10" fill="#eef4f2"/>
    <path d="M18,62 C18,48 82,48 82,62 L82,70 C82,82 18,82 18,70Z" fill="#fff" ${st()}/>
    <path d="M14,52 C14,36 86,36 86,52 C86,60 14,60 14,52Z" fill="#ff9a6b" ${st()}/>
    <path d="M30,42 l6,12 M46,40 l5,14 M62,41 l4,13" stroke="#ffd3bf" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="42" y="38" width="16" height="42" rx="2" fill="#3e5248" ${st(2.6)}/>
    ${face(30, 68, .7)}`,
  boba: () => `
    <path d="M58,8 L50,40" stroke="#ff7aa2" stroke-width="7" stroke-linecap="round"/><path d="M58,8 L50,40" fill="none" ${st(1)} opacity=".0"/>
    <path d="M26,38 C26,22 74,22 74,38Z" fill="#fff" opacity=".7" ${st()}/>
    <path d="M24,38 H76 L70,90 H30Z" fill="#f1d7bd" ${st()}/>
    <path d="M27,52 H73 L70,90 H30Z" fill="#e6bf98"/>
    ${[[36, 82], [46, 85], [56, 83], [64, 80], [40, 74], [52, 76], [61, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#4a3030"/><circle cx="${x - 1.4}" cy="${y - 1.4}" r="1.3" fill="#fff" opacity=".6"/>`).join('')}
    <path d="M24,38 H76 L70,90 H30Z" fill="none" ${st()}/>
    <rect x="20" y="34" width="60" height="8" rx="4" fill="#ffb3c7" ${st(2.6)}/>
    ${face(50, 58, .85)}`,
  bread: () => `
    <path d="M14,72 C10,48 28,30 50,30 C72,30 90,48 86,72 Z" fill="#e7a35a" ${st()}/>
    <rect x="14" y="62" width="72" height="24" rx="8" fill="#f2bb73" ${st()}/>
    <path d="M32,44 q6,-6 10,2 M48,40 q6,-6 10,2 M64,44 q6,-6 10,2" fill="none" stroke="#fde4b4" stroke-width="3.4" stroke-linecap="round"/>
    ${face(50, 72, .85)}`,
  onigiri: () => `
    <path d="M50,14 C60,14 88,62 86,74 C84,86 16,86 14,74 C12,62 40,14 50,14Z" fill="#fff" ${st()}/>
    <path d="M30,62 h40 v22 h-40z" fill="#3e5248" ${st(2.6)}/>
    <circle cx="44" cy="32" r="3" fill="#ff8f8f"/><circle cx="56" cy="34" r="2.4" fill="#ff8f8f"/>
    ${face(50, 48, .85)}`,
  shortcake: () => `
    <path d="M14,44 L60,26 L86,38 L86,74 L40,88 L14,78Z" fill="#fff" ${st()}/>
    <path d="M14,44 L40,54 L86,38 M40,54 V88" fill="none" ${st()}/>
    <path d="M14,56 L40,66 L40,72 L14,62Z M40,66 L86,50 L86,56 L40,72Z" fill="#ff9eb8"/>
    <path d="M14,44 L40,54 L40,88 L14,78Z" fill="#ffe7a8" opacity=".5"/>
    <path d="M40,54 L86,38 L86,74 L40,88Z" fill="#ffe7a8" opacity=".5"/>
    <path d="M14,56 L40,66 L86,50 M14,62 L40,72 L86,56" fill="none" stroke="#ff7aa0" stroke-width="2"/>
    <path d="M14,44 L60,26 L86,38 L86,74 L40,88 L14,78Z M14,44 L40,54 L86,38 M40,54 V88" fill="none" ${st()}/>
    <path d="M48,30 C40,18 60,12 60,26 C60,34 52,36 48,30Z" fill="#ff5a6e" ${st(2.6)}/><path d="M50,18 l4,-6 l3,6" fill="#7fd8be" ${st(2)}/>
    ${face(62, 66, .75)}`,
  ramen: () => `
    <path d="M26,30 L70,12 M30,36 L76,22" stroke="#d99a5b" stroke-width="5" stroke-linecap="round"/><path d="M26,30 L70,12 M30,36 L76,22" stroke="${O}" stroke-width="1" opacity="0"/>
    <path d="M10,48 H90 C90,72 74,88 50,88 C26,88 10,72 10,48Z" fill="#ff8f6b" ${st()}/>
    <path d="M18,62 q10,-4 20,0 q10,4 20,0 q10,-4 20,0" stroke="#ffd2c0" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="48" rx="40" ry="10" fill="#ffe0a8" ${st()}/>
    <path d="M22,48 q6,-6 12,0 q6,6 12,0 q6,-6 12,0 q6,6 12,0" stroke="#f6c45a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="34" cy="45" rx="9" ry="6" fill="#fff" ${st(2.2)}/><circle cx="34" cy="45" r="3.6" fill="#ffc23d"/>
    <circle cx="64" cy="45" r="7" fill="#fff" ${st(2.2)}/><path d="M64,45 m-3,0 a3,3 0 1 1 3,3" fill="none" stroke="#ff7aa2" stroke-width="2.2"/>
    ${face(50, 70, .85)}`,
  pie: () => `
    <path d="M10,58 C10,46 90,46 90,58 L84,78 C80,86 20,86 16,78Z" fill="#e7a35a" ${st()}/>
    <ellipse cx="50" cy="56" rx="38" ry="14" fill="#c84b6b" ${st()}/>
    <path d="M24,48 L76,64 M24,62 L70,46 M36,44 L58,68 M60,44 L40,68" stroke="#f5c27d" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="50" cy="56" rx="38" ry="14" fill="none" ${st()}/>
    <path d="M14,58 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0 q4,4 8,0" fill="none" stroke="#f5c27d" stroke-width="3"/>
    ${face(50, 74, .75)}`,
  dumplings: () => `
    <ellipse cx="50" cy="80" rx="40" ry="10" fill="#8ec9ff" ${st()}/>
    ${[[30, 62], [70, 62], [50, 50]].map(([x, y], i) => `
      <path d="M${x - 20},${y + 10} C${x - 20},${y - 14} ${x + 20},${y - 14} ${x + 20},${y + 10} C${x + 10},${y + 16} ${x - 10},${y + 16} ${x - 20},${y + 10}Z" fill="#fff6e8" ${st()}/>
      <path d="M${x - 10},${y - 2} q2,-4 4,0 M${x - 2},${y - 5} q2,-4 4,0 M${x + 6},${y - 2} q2,-4 4,0" fill="none" ${st(2)}/>
      ${face(x, y + 5, .55, i === 2 ? 'happy' : 'smile')}`).join('')}`,
  pizza: () => `
    <path d="M14,24 C36,12 64,12 86,24 L50,90Z" fill="#ffd36b" ${st()}/>
    <path d="M14,24 C36,12 64,12 86,24 L80,34 C60,24 40,24 20,34Z" fill="#e7a35a" ${st()}/>
    <path d="M24,40 q8,4 4,10 q-4,6 6,8 M66,40 q-6,6 0,10" fill="none" stroke="#ffb02e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="38" cy="40" r="6" fill="#e5484d" ${st(2.2)}/><circle cx="62" cy="44" r="5.5" fill="#e5484d" ${st(2.2)}/><circle cx="50" cy="66" r="5" fill="#e5484d" ${st(2.2)}/>
    <path d="M44,52 l4,2 M56,58 l-3,3" stroke="#5fb760" stroke-width="3" stroke-linecap="round"/>
    ${face(50, 50, .7, 'happy')}`,
  layercake: () => `
    <ellipse cx="50" cy="88" rx="40" ry="7" fill="#fff" ${st()}/>
    <path d="M14,52 V80 C14,90 86,90 86,80 V52Z" fill="#c7b5ff" ${st()}/>
    <path d="M14,62 C14,70 86,70 86,62 M14,72 C14,80 86,80 86,72" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M14,66 C14,74 86,74 86,66 V72 C86,80 14,80 14,72Z" fill="#7fd8be" opacity=".8"/>
    <path d="M14,56 C14,64 86,64 86,56 V62 C86,70 14,70 14,62Z" fill="#ffd24d" opacity=".8"/>
    <path d="M14,52 V80 C14,90 86,90 86,80 V52" fill="none" ${st()}/>
    <ellipse cx="50" cy="52" rx="36" ry="10" fill="#ffb3c7" ${st()}/>
    <path d="M16,54 c0,8 6,8 6,0 M30,58 c0,10 6,10 6,0 M46,60 c0,7 6,7 6,0 M62,59 c0,10 6,10 6,0 M76,56 c0,7 6,7 6,0" fill="#ffb3c7" ${st(2.4)}/>
    <rect x="34" y="24" width="6" height="22" rx="2" fill="#8ec9ff" ${st(2.2)}/><rect x="47" y="20" width="6" height="26" rx="2" fill="#ff9ec0" ${st(2.2)}/><rect x="60" y="24" width="6" height="22" rx="2" fill="#ffd24d" ${st(2.2)}/>
    <path d="M37,22 q-3,-6 0,-10 q3,4 0,10 M50,18 q-3,-6 0,-10 q3,4 0,10 M63,22 q-3,-6 0,-10 q3,4 0,10" fill="#ff9f43"/>
    ${face(50, 72, .85)}`,
  tart: () => `
    <path d="M10,56 L18,80 C22,86 78,86 82,80 L90,56Z" fill="#f2bb73" ${st()}/>
    <path d="M12,62 l6,16 M26,62 l3,20 M40,62 l1,22 M60,62 l-1,22 M74,62 l-3,20 M88,62 l-6,16" stroke="#e29b4f" stroke-width="2.4"/>
    <ellipse cx="50" cy="56" rx="40" ry="12" fill="#fff3c4" ${st()}/>
    <circle cx="30" cy="52" r="7" fill="#ff5a6e" ${st(2.2)}/><circle cx="48" cy="48" r="6" fill="#5b6cff" ${st(2.2)}/>
    <circle cx="66" cy="52" r="7" fill="#7fd86b" ${st(2.2)}/><circle cx="40" cy="60" r="5.5" fill="#ffb347" ${st(2.2)}/><circle cx="60" cy="61" r="5.5" fill="#ff5a6e" ${st(2.2)}/>
    <path d="M26,49 l3,0 M64,49 l3,0" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    ${face(50, 74, .7)}`,
  pudding: () => `
    <ellipse cx="50" cy="86" rx="40" ry="8" fill="#fff" ${st()}/>
    <path d="M24,40 L76,40 L84,84 L16,84Z" fill="#ffd77a" ${st()}/>
    <path d="M24,40 C24,30 76,30 76,40 L78,50 C70,54 66,48 60,52 C54,56 50,48 44,52 C38,56 32,50 22,52Z" fill="#a8581f" ${st()}/>
    <path d="M50,26 q4,-10 10,-12" fill="none" ${st(2.2)}/><circle cx="50" cy="28" r="6.5" fill="#ff5a6e" ${st(2.4)}/><circle cx="48" cy="26" r="1.8" fill="#fff"/>
    ${face(50, 66, .9)}`,
  waffle: () => `
    <rect x="14" y="20" width="72" height="66" rx="14" fill="#ffcf5c" ${st()}/>
    <path d="M32,20 V86 M50,20 V86 M68,20 V86 M14,38 H86 M14,56 H86 M14,72 H86" stroke="#e6a92f" stroke-width="4"/>
    <rect x="14" y="20" width="72" height="66" rx="14" fill="none" ${st()}/>
    <rect x="38" y="30" width="22" height="14" rx="4" fill="#fff6c2" ${st(2.4)}/>
    <path d="M20,26 l10,10" stroke="#fff7d1" stroke-width="3" stroke-linecap="round"/>
    ${face(50, 64, .9, 'happy')}`,
  icecream: () => `
    <path d="M32,56 L50,94 L68,56Z" fill="#f0b766" ${st()}/>
    <path d="M38,62 L60,80 M46,58 L64,70 M62,62 L42,80" stroke="#d48f3a" stroke-width="2.2"/>
    <circle cx="50" cy="50" r="18" fill="#ffb3c7" ${st()}/>
    <circle cx="36" cy="36" r="15" fill="#c9f0dd" ${st()}/>
    <circle cx="62" cy="34" r="15" fill="#fff1b8" ${st()}/>
    <circle cx="49" cy="18" r="13" fill="#d6c8ff" ${st()}/>
    <circle cx="50" cy="6" r="5" fill="#ff5a6e" ${st(2.2)}/>
    ${face(50, 52, .7)}`,
  teacup: () => `
    <ellipse cx="50" cy="90" rx="40" ry="7" fill="#fff" ${st()}/>
    <path d="M78,58 C94,56 94,78 76,76" fill="none" ${st(5)}/><path d="M78,58 C94,56 94,78 76,76" fill="none" stroke="#ffb3c7" stroke-width="2"/>
    <path d="M30,32 L26,14 Q27,9 32,12 L44,24Z M70,32 L74,14 Q73,9 68,12 L56,24Z" fill="${FUR}" ${st(2.6)}/>
    <ellipse cx="50" cy="38" rx="26" ry="20" fill="${FUR}" ${st()}/>
    <ellipse cx="36" cy="38" rx="3.4" ry="4.2" fill="#3a2723"/><ellipse cx="64" cy="38" rx="3.4" ry="4.2" fill="#3a2723"/>
    <circle cx="37" cy="36.4" r="1.3" fill="#fff"/><circle cx="65" cy="36.4" r="1.3" fill="#fff"/>
    <ellipse cx="30" cy="45" rx="5" ry="3" fill="#ff9eb8" opacity=".8"/><ellipse cx="70" cy="45" rx="5" ry="3" fill="#ff9eb8" opacity=".8"/>
    <path d="M46,44 q2,3 4,0 q2,3 4,0" fill="none" ${st(1.8)}/>
    <path d="M18,50 H82 L76,80 C74,88 26,88 24,80Z" fill="#fff" ${st()}/>
    <path d="M26,58 h48" stroke="#ffb3c7" stroke-width="4"/>
    ${[30, 50, 70].map(x => `<path d="M${x},70 c-4,-3 -4,-7 -1.5,-7 c1,0 1.5,.8 1.5,1.6 c0,-.8 .5,-1.6 1.5,-1.6 c2.5,0 2.5,4 -1.5,7z" fill="#ff6f9c"/>`).join('')}
    <path d="M18,50 H82" ${st()}/>`,
};

export const food = (key, cls = '') => svg('0 0 100 100', FOODS[key](), 'food food-' + key + ' ' + cls);

/* ------------------------------------------------------------------ */
/*  NATURE + TERM ICONS (viewBox 0 0 100 100)                          */
/* ------------------------------------------------------------------ */
const eyes2 = (x1, x2, y, r = 3) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="#3a2723"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#3a2723"/><circle cx="${x1 + r * .35}" cy="${y - r * .4}" r="${r * .35}" fill="#fff"/><circle cx="${x2 + r * .35}" cy="${y - r * .4}" r="${r * .35}" fill="#fff"/>`;
const cheeks = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="4" ry="2.6" fill="#ff8fab" opacity=".6"/><ellipse cx="${x2}" cy="${y}" rx="4" ry="2.6" fill="#ff8fab" opacity=".6"/>`;

export const ICONS = {
  sun: () => `${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="47" y="6" width="6" height="14" rx="3" fill="#ffb02e" ${st(2.2)} transform="rotate(${a} 50 50)"/>`).join('')}
    <circle cx="50" cy="50" r="24" fill="#ffd24d" ${st()}/>${face(50, 50, 1)}`,
  water: () => `<path d="M50,10 C62,30 78,46 78,62 C78,78 66,90 50,90 C34,90 22,78 22,62 C22,46 38,30 50,10Z" fill="#8ec9ff" ${st()}/>
    <path d="M34,58 q0,-10 8,-16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>${face(50, 66, 1)}`,
  rock: () => `<path d="M14,76 C10,58 22,36 42,32 C56,22 76,30 82,46 C92,56 90,76 80,80 C60,86 30,86 14,76Z" fill="#b8b2c2" ${st()}/>
    <path d="M30,44 q8,-6 16,-4 M62,42 l6,6" stroke="#dcd7e3" stroke-width="3.4" fill="none" stroke-linecap="round"/>${face(50, 64, 1)}`,
  wind: () => `<path d="M12,38 H62 C76,38 76,18 62,20 C56,21 54,26 56,30" fill="none" stroke="#8ec9ff" stroke-width="9" stroke-linecap="round"/>
    <path d="M12,38 H62 C76,38 76,18 62,20 C56,21 54,26 56,30" fill="none" ${st(2.4)} opacity=".0"/>
    <path d="M12,58 H76 C92,58 92,82 76,80 C70,79 68,74 70,70" fill="none" stroke="#b9dcff" stroke-width="9" stroke-linecap="round"/>
    <path d="M20,76 H44" stroke="#d9ecff" stroke-width="8" stroke-linecap="round"/>`,
  thermo: () => `<rect x="40" y="10" width="20" height="58" rx="10" fill="#fff" ${st()}/><circle cx="50" cy="74" r="16" fill="#ff6b6b" ${st()}/>
    <rect x="46" y="30" width="8" height="40" rx="4" fill="#ff6b6b"/><path d="M60,24 h8 M60,36 h8 M60,48 h8" ${st(2.6)}/>${face(50, 75, .6)}`,
  rain: () => `<path d="M24,58 C10,58 10,38 26,38 C28,22 50,18 58,30 C70,22 88,30 84,46 C94,50 90,62 80,62 Z" fill="#fff" ${st()}/>
    <path d="M30,74 l-4,10 M50,72 l-4,12 M70,74 l-4,10" stroke="#8ec9ff" stroke-width="5" stroke-linecap="round"/>${face(52, 48, .85)}`,
  fish: () => `<path d="M74,50 L92,34 L90,66Z" fill="#ff9a6b" ${st()}/>
    <path d="M12,50 C24,26 62,24 78,50 C62,76 24,74 12,50Z" fill="#ffb37f" ${st()}/>
    <path d="M44,34 q8,16 0,32" stroke="#ff9a6b" stroke-width="3" fill="none"/>${eyes2(28, 28, 46, 4)}<ellipse cx="30" cy="56" rx="4" ry="2.4" fill="#ff8fab" opacity=".7"/>`,
  tree: () => `<rect x="42" y="56" width="16" height="32" rx="4" fill="#b07a54" ${st()}/>
    <path d="M50,10 C70,10 82,24 80,38 C90,46 86,66 70,66 H30 C14,66 10,46 20,38 C18,24 30,10 50,10Z" fill="#7fd86b" ${st()}/>
    <path d="M30,30 q6,-10 16,-10" stroke="#b7f0a8" stroke-width="4" fill="none" stroke-linecap="round"/>${face(50, 44, 1)}`,
  mushroom: () => `<path d="M38,54 h24 l4,30 c0,4 -32,4 -32,0z" fill="#fff4e0" ${st()}/>
    <path d="M10,56 C10,26 90,26 90,56 C90,62 10,62 10,56Z" fill="#ff6b6b" ${st()}/>
    <circle cx="30" cy="42" r="6" fill="#fff"/><circle cx="56" cy="34" r="5" fill="#fff"/><circle cx="72" cy="48" r="4.5" fill="#fff"/>${face(50, 70, .7)}`,
  bee: () => `<ellipse cx="38" cy="30" rx="14" ry="10" fill="#e8f6ff" ${st(2.6)} transform="rotate(-20 38 30)"/><ellipse cx="62" cy="30" rx="14" ry="10" fill="#e8f6ff" ${st(2.6)} transform="rotate(20 62 30)"/>
    <ellipse cx="50" cy="58" rx="30" ry="24" fill="#ffd24d" ${st()}/>
    <path d="M38,36 q-4,22 0,44 M62,36 q4,22 0,44" stroke="${O}" stroke-width="7" fill="none" opacity=".85"/>
    <path d="M80,58 l10,0" ${st(3)}/>${eyes2(32, 46, 54, 3)}`,
  flower: () => `<path d="M50,56 V90 M50,76 q14,-12 22,-6 q-8,12 -22,6" fill="#7fd86b" ${st()}/>
    ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="22" rx="12" ry="15" fill="#ff9ec0" ${st(2.6)} transform="rotate(${a} 50 40)"/>`).join('')}
    <circle cx="50" cy="40" r="13" fill="#ffd24d" ${st()}/>${face(50, 40, .6)}`,
  worm: () => `<path d="M14,70 C24,40 40,40 46,62 C52,84 70,82 78,52" fill="none" stroke="${O}" stroke-width="20" stroke-linecap="round"/>
    <path d="M14,70 C24,40 40,40 46,62 C52,84 70,82 78,52" fill="none" stroke="#ffaaa0" stroke-width="13" stroke-linecap="round"/>
    <path d="M36,46 v8 M54,74 v8" stroke="#ff8f86" stroke-width="3"/>${eyes2(72, 84, 50, 3)}`,
  grass: () => `<path d="M10,88 C14,60 20,44 26,30 C28,52 30,70 32,88 M28,88 C32,56 40,36 50,14 C54,40 56,64 56,88 M52,88 C58,62 66,46 78,34 C76,56 74,74 74,88 M70,88 C76,70 82,60 92,52 C90,68 88,80 88,88Z" fill="#8fd86b" ${st()}/>
    <rect x="6" y="84" width="88" height="8" rx="4" fill="#b07a54" ${st(2.6)}/>${face(50, 66, .8)}`,
  rabbit: () => `<path d="M34,40 C24,6 42,2 44,36Z M66,40 C76,6 58,2 56,36Z" fill="#fff" ${st()}/><path d="M37,34 C32,14 39,12 41,32Z M63,34 C68,14 61,12 59,32Z" fill="${PINK}"/>
    <ellipse cx="50" cy="62" rx="30" ry="26" fill="#fff" ${st()}/>${eyes2(39, 61, 58, 4)}${cheeks(31, 69, 68)}
    <path d="M47,66 q3,-2 6,0 q-3,4 -6,0z" fill="#ff8fab"/><path d="M50,68 v3 M46,72 q4,3 8,0" fill="none" ${st(2)}/>`,
  fox: () => `<path d="M18,40 L22,10 L44,30Z M82,40 L78,10 L56,30Z" fill="#ff9248" ${st()}/><path d="M24,32 L26,18 L36,28Z M76,32 L74,18 L64,28Z" fill="#fff"/>
    <path d="M14,46 C14,26 86,26 86,46 C86,66 64,84 50,88 C36,84 14,66 14,46Z" fill="#ff9248" ${st()}/>
    <path d="M24,58 C34,60 44,70 50,88 C56,70 66,60 76,58 C70,78 56,86 50,88 C44,86 30,78 24,58Z" fill="#fff"/>
    ${eyes2(36, 64, 50, 4)}<ellipse cx="50" cy="78" rx="5" ry="3.4" fill="${O}"/>`,
  eagle: () => `<path d="M10,58 C20,40 30,40 36,48 M90,58 C80,40 70,40 64,48" fill="#a57452" ${st()}/>
    <path d="M22,62 C22,38 78,38 78,62 C78,82 64,92 50,92 C36,92 22,82 22,62Z" fill="#a57452" ${st()}/>
    <path d="M28,40 C28,16 72,16 72,40 C72,54 28,54 28,40Z" fill="#fff" ${st()}/>
    ${eyes2(40, 60, 34, 3.6)}<path d="M44,42 h12 l-6,10z" fill="#ffc23d" ${st(2.4)}/>`,
  algae: () => `<path d="M20,90 C10,70 30,60 20,40 C14,30 22,20 26,14 M50,90 C40,66 60,56 50,30 C46,20 52,12 56,8 M78,90 C70,72 88,62 80,44" fill="none" stroke="${O}" stroke-width="14" stroke-linecap="round"/>
    <path d="M20,90 C10,70 30,60 20,40 C14,30 22,20 26,14 M50,90 C40,66 60,56 50,30 C46,20 52,12 56,8 M78,90 C70,72 88,62 80,44" fill="none" stroke="#7fd8a0" stroke-width="8" stroke-linecap="round"/>
    ${face(50, 56, .7)}`,
  minnow: () => `<path d="M68,50 L86,38 L84,62Z" fill="#8ec9ff" ${st()}/><path d="M18,50 C28,32 56,32 70,50 C56,68 28,68 18,50Z" fill="#b9dcff" ${st()}/>${eyes2(32, 32, 47, 3.4)}
    <circle cx="82" cy="24" r="4" fill="#e8f6ff" ${st(2)}/><circle cx="90" cy="14" r="2.6" fill="#e8f6ff" ${st(1.6)}/>`,
  shark: () => `<path d="M48,30 L58,8 L66,32Z" fill="#8a9bb0" ${st()}/><path d="M80,52 L96,36 L94,70Z" fill="#8a9bb0" ${st()}/>
    <path d="M6,56 C18,28 70,26 84,52 C70,76 18,78 6,56Z" fill="#a9b8ca" ${st()}/>
    <path d="M10,60 C24,74 60,74 78,60 C60,66 26,68 10,60Z" fill="#fff"/>
    ${eyes2(26, 26, 50, 3.6)}<path d="M14,62 q6,4 12,0" fill="none" ${st(2)}/>`,
  berries: () => `<path d="M50,26 C50,12 58,6 66,6 M50,26 C40,16 30,18 26,22" fill="none" stroke="#5fb760" stroke-width="4" stroke-linecap="round"/>
    <circle cx="36" cy="52" r="16" fill="#6a6bff" ${st()}/><circle cx="64" cy="50" r="16" fill="#ff5a7e" ${st()}/><circle cx="50" cy="72" r="16" fill="#8f5bff" ${st()}/>
    <circle cx="31" cy="47" r="3" fill="#fff" opacity=".7"/><circle cx="59" cy="45" r="3" fill="#fff" opacity=".7"/>${face(50, 74, .55)}`,
  mouse: () => `<circle cx="28" cy="36" r="16" fill="#cfc8d6" ${st()}/><circle cx="72" cy="36" r="16" fill="#cfc8d6" ${st()}/><circle cx="28" cy="36" r="9" fill="${PINK}"/><circle cx="72" cy="36" r="9" fill="${PINK}"/>
    <path d="M50,88 C30,88 20,72 24,58 C28,44 72,44 76,58 C80,72 70,88 50,88Z" fill="#cfc8d6" ${st()}/>${eyes2(40, 60, 64, 3.6)}
    <circle cx="50" cy="74" r="3.6" fill="#ff8fab"/><path d="M38,74 l-14,-2 M62,74 l14,-2" ${st(1.8)}/>`,
  snake: () => `<path d="M14,80 C14,64 40,64 52,72 C66,82 86,76 84,60 C82,46 60,52 48,46 C34,40 36,22 54,20" fill="none" stroke="${O}" stroke-width="20" stroke-linecap="round"/>
    <path d="M14,80 C14,64 40,64 52,72 C66,82 86,76 84,60 C82,46 60,52 48,46 C34,40 36,22 54,20" fill="none" stroke="#9ad97a" stroke-width="13" stroke-linecap="round"/>
    <circle cx="58" cy="20" r="11" fill="#9ad97a" ${st()}/>${eyes2(55, 63, 18, 2.6)}<path d="M68,24 l8,2 l-3,3 M76,26 l3,-3" fill="none" stroke="#ff6b6b" stroke-width="2"/>`,
  owl: () => `<path d="M22,30 L30,14 L40,26 M78,30 L70,14 L60,26" fill="#9b7653" ${st()}/>
    <path d="M18,52 C18,26 82,26 82,52 V70 C82,86 18,86 18,70Z" fill="#b48a62" ${st()}/>
    <ellipse cx="50" cy="70" rx="20" ry="14" fill="#efd7b4"/>
    <circle cx="36" cy="46" r="12" fill="#fff" ${st(2.6)}/><circle cx="64" cy="46" r="12" fill="#fff" ${st(2.6)}/>${eyes2(36, 64, 46, 5)}
    <path d="M46,54 h8 l-4,7z" fill="#ffc23d" ${st(2)}/>`,
  ladybug: () => `<circle cx="50" cy="28" r="12" fill="#3d3236" ${st()}/>
    <ellipse cx="50" cy="58" rx="30" ry="28" fill="#ff5a5a" ${st()}/><path d="M50,32 V86" ${st()}/>
    <circle cx="36" cy="50" r="5" fill="#3d3236"/><circle cx="66" cy="52" r="5" fill="#3d3236"/><circle cx="38" cy="70" r="4.5" fill="#3d3236"/><circle cx="62" cy="72" r="4.5" fill="#3d3236"/>
    <circle cx="45" cy="26" r="2.6" fill="#fff"/><circle cx="55" cy="26" r="2.6" fill="#fff"/>`,
  sprout: () => `<path d="M10,82 C16,66 34,62 42,70 C52,58 76,58 90,82Z" fill="#b8b2c2" ${st()}/>
    <path d="M50,70 V40" ${st(4)}/><path d="M50,48 C36,48 28,38 28,28 C40,28 50,34 50,48Z M50,42 C62,42 74,34 74,22 C62,22 50,28 50,42Z" fill="#7fd86b" ${st()}/>${face(50, 78, .6)}`,
  regrow: () => `<rect x="14" y="62" width="26" height="22" rx="4" fill="#8a6a52" ${st()}/><ellipse cx="27" cy="62" rx="13" ry="4" fill="#c99b75" ${st(2.4)}/>
    <path d="M10,86 H90" ${st(4)}/><path d="M66,86 V58" ${st(4)}/><path d="M66,66 C54,66 48,58 48,50 C58,50 66,54 66,66Z M66,60 C76,60 84,54 84,44 C74,44 66,48 66,60Z" fill="#7fd86b" ${st()}/>
    <path d="M24,52 q-4,-8 2,-14 q2,8 6,6 q0,-8 6,-10" fill="none" stroke="#aaa" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
  recycle: () => `${[0, 120, 240].map(a => `<g transform="rotate(${a} 50 54)"><path d="M34,30 C42,18 58,18 66,30" fill="none" stroke="#5fc98f" stroke-width="10" stroke-linecap="round"/><path d="M62,18 L72,32 L56,34Z" fill="#5fc98f"/></g>`).join('')}
    <path d="M50,40 C60,40 64,50 60,62 C56,70 44,70 40,62 C36,50 40,40 50,40Z" fill="#7fd86b" ${st(2.6)}/>`,
  cycle: () => `<circle cx="50" cy="50" r="30" fill="none" stroke="#c7b5ff" stroke-width="10" stroke-dasharray="40 7"/>
    <path d="M74,24 L84,38 L68,40Z M26,76 L16,62 L32,60Z" fill="#9b84ff" ${st(2)}/>
    <circle cx="50" cy="20" r="8" fill="#8ec9ff" ${st(2.4)}/><circle cx="80" cy="56" r="8" fill="#7fd86b" ${st(2.4)}/><circle cx="20" cy="44" r="8" fill="#ffb37f" ${st(2.4)}/><circle cx="50" cy="80" r="8" fill="#b8b2c2" ${st(2.4)}/>`,
  carrot: () => `<path d="M50,24 C40,10 30,14 30,14 C36,18 42,24 46,28 M50,24 C50,8 58,4 58,4 C58,12 56,20 54,28 M52,26 C62,14 72,16 72,16 C66,22 60,26 56,30" fill="#7fd86b" ${st(2.6)}/>
    <path d="M34,34 C40,24 64,24 66,36 C66,50 56,76 48,92 C42,74 30,48 34,34Z" fill="#ff9248" ${st()}/>
    <path d="M40,46 h8 M44,62 h6" ${st(2.4)}/>${face(51, 42, .65)}`,
  tractor: () => `<rect x="18" y="40" width="44" height="26" rx="6" fill="#ff6b6b" ${st()}/><path d="M40,40 V18 H64 L68,40Z" fill="#8ec9ff" ${st()}/>
    <rect x="62" y="48" width="26" height="18" rx="5" fill="#ff6b6b" ${st()}/><rect x="74" y="34" width="6" height="14" fill="#888" ${st(2)}/>
    <circle cx="34" cy="72" r="16" fill="#3d3236" ${st()}/><circle cx="34" cy="72" r="7" fill="#ffd24d"/><circle cx="78" cy="76" r="10" fill="#3d3236" ${st()}/><circle cx="78" cy="76" r="4" fill="#ffd24d"/>`,
  corn: () => `<path d="M50,90 C34,82 30,60 36,40 C42,52 46,64 50,90Z M50,90 C66,82 70,60 64,40 C58,52 54,64 50,90Z" fill="#7fd86b" ${st()}/>
    <path d="M50,10 C62,10 64,30 62,56 C60,72 40,72 38,56 C36,30 38,10 50,10Z" fill="#ffd24d" ${st()}/>
    <path d="M42,24 h16 M41,34 h18 M41,44 h18 M42,54 h16 M46,14 v48 M54,14 v48" stroke="#f0b53a" stroke-width="2.4"/>${face(50, 38, .55)}`,
  veggies: () => `<g transform="translate(-14 4) scale(.7)">${'' }</g>
    <circle cx="70" cy="62" r="18" fill="#ff5a5a" ${st()}/><path d="M64,44 l6,4 l6,-4 l-2,6 l-8,0z" fill="#7fd86b" ${st(2)}/>
    <path d="M18,80 C14,56 28,40 34,40 C40,40 50,54 44,80Z" fill="#9b6bd6" ${st()}/><path d="M28,40 q6,-10 12,0" fill="#7fd86b" ${st(2.4)}/>
    <path d="M40,86 C36,72 46,54 56,48 C64,60 62,76 52,88Z" fill="#7fd86b" ${st()}/><path d="M48,84 q2,-14 8,-30" stroke="#5fb760" stroke-width="3" fill="none"/>
    ${face(70, 64, .55)}`,
  gauge: () => `<path d="M14,70 A36,36 0 0 1 86,70" fill="none" stroke="#e9e1d8" stroke-width="14" stroke-linecap="round"/>
    <path d="M14,70 A36,36 0 0 1 50,34" fill="none" stroke="#ffb02e" stroke-width="14" stroke-linecap="round"/>
    <path d="M14,70 A36,36 0 0 1 86,70" fill="none" ${st(2.4)} opacity=".0"/>
    <path d="M50,70 L40,40" ${st(5)}/><circle cx="50" cy="70" r="7" fill="#ff6b6b" ${st(2.4)}/>
    <path d="M26,86 h48" ${st(4)}/>`,
  basket: () => `<path d="M30,44 C30,20 70,20 70,44" fill="none" ${st(5)}/>
    <circle cx="36" cy="44" r="10" fill="#ff5a5a" ${st(2.4)}/><circle cx="52" cy="40" r="10" fill="#ffd24d" ${st(2.4)}/><circle cx="66" cy="46" r="10" fill="#7fd86b" ${st(2.4)}/>
    <path d="M14,50 H86 L78,88 H22Z" fill="#e7a35a" ${st()}/><path d="M20,62 H80 M22,74 H78 M36,50 L38,88 M50,50 V88 M64,50 L62,88" stroke="#c9843f" stroke-width="2.6"/>
    <path d="M14,50 H86 L78,88 H22Z" fill="none" ${st()}/>`,
  lake: () => `<ellipse cx="50" cy="62" rx="42" ry="24" fill="#8ec9ff" ${st()}/>
    <ellipse cx="50" cy="60" rx="34" ry="17" fill="#7fd86b" opacity=".9"/>
    <circle cx="34" cy="56" r="6" fill="#5fb760"/><circle cx="58" cy="54" r="8" fill="#5fb760"/><circle cx="70" cy="64" r="5" fill="#5fb760"/><circle cx="44" cy="68" r="5" fill="#5fb760"/>
    <path d="M30,30 q4,-10 8,0 M50,26 q4,-10 8,0" fill="none" ${st(2.4)}/>
    ${face(50, 62, .7, 'smile').replace('M', 'M')}`,
  bolt: () => `<path d="M58,6 L22,54 H46 L38,94 L80,40 H54Z" fill="#ffd24d" ${st()}/><path d="M50,22 l-12,18" stroke="#fff6c9" stroke-width="3.4" stroke-linecap="round"/>`,
  crown: () => `<path d="M14,70 L10,28 L32,48 L50,20 L68,48 L90,28 L86,70Z" fill="#ffd24d" ${st()}/><rect x="14" y="68" width="72" height="14" rx="4" fill="#ffc23d" ${st()}/>
    <circle cx="50" cy="56" r="6" fill="#ff6f9c" ${st(2.2)}/><circle cx="28" cy="60" r="4" fill="#8ec9ff" ${st(2)}/><circle cx="72" cy="60" r="4" fill="#7fd8be" ${st(2)}/>`,
  pond: () => `<path d="M8,70 C8,52 92,52 92,70 C92,84 8,84 8,70Z" fill="#8ec9ff" ${st()}/>
    <path d="M70,30 a12,12 0 1 1 -.1,0" fill="#ffd24d" ${st(2.4)}/>
    <ellipse cx="30" cy="68" rx="12" ry="5" fill="#7fd86b" ${st(2.2)}/><path d="M18,62 V34 M24,62 V40" stroke="#5fb760" stroke-width="4" stroke-linecap="round"/><ellipse cx="18" cy="32" rx="3" ry="7" fill="#a57452"/>
    <circle cx="62" cy="68" r="6" fill="#9ad97a" ${st(2)}/><circle cx="60" cy="66" r="1.4" fill="${O}"/><circle cx="65" cy="66" r="1.4" fill="${O}"/>`,
  many: () => `<g transform="translate(2 6) scale(.48)">${''}</g>`,
};
// Composite icons built from others
ICONS.many = () => `<g transform="translate(0 0) scale(.5)">${ICONS.fish()}</g><g transform="translate(50 0) scale(.5)">${ICONS.flower()}</g>
  <g transform="translate(0 50) scale(.5)">${ICONS.bee()}</g><g transform="translate(50 50) scale(.5)">${ICONS.mushroom()}</g>`;
ICONS.apex = () => `<g transform="translate(10 18) scale(.8)">${ICONS.eagle()}</g><g transform="translate(26 -2) scale(.48)">${ICONS.crown()}</g>`;
ICONS.abiotic = () => `<g transform="translate(-2 -2) scale(.6)">${ICONS.sun()}</g><g transform="translate(38 40) scale(.6)">${ICONS.rock()}</g>`;
ICONS.biotic = () => `<g transform="translate(-2 -2) scale(.6)">${ICONS.tree()}</g><g transform="translate(38 40) scale(.6)">${ICONS.fish()}</g>`;
ICONS.decomposer = () => `<g transform="translate(-4 -4) scale(.66)">${ICONS.mushroom()}</g><g transform="translate(34 38) scale(.62)">${ICONS.worm()}</g>`;
ICONS.producer = () => `<g transform="translate(46 -4) scale(.5)">${ICONS.sun()}</g><g transform="translate(4 20) scale(.78)">${ICONS.flower()}</g>`;

export const icon = (key, cls = '') => svg('0 0 100 100', ICONS[key](), 'icon icon-' + key + ' ' + cls);
