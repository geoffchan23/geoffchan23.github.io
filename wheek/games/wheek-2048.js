/* Wheek World mini-game: Guinea Merge 2048.
   Swipe (or arrow keys) to slide every tile on a 4x4 board. Two of the same SQUISH into the next
   step of the evolution ladder: seed > sprout > lettuce > carrot > strawberry > baby guinea >
   teen guinea > guinea in a hat > royal guinea > golden guinea > cosmic disco guinea (2048).
   A round ends when no moves remain, after 150 moves, or when the 2 minute clock runs out.
   Pays by best tile plus score, capped at 200. */
(function () {
  "use strict";
  const ID = "wheek-2048", C = "g-w2048";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const MOVES = 150, TIME = 120, SLIDE = 110;
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const pick = (a) => a[(Math.random() * a.length) | 0];

  /* ---------- art ---------- */
  const SW = 'stroke="' + INK + '" stroke-linejoin="round" stroke-linecap="round"';
  function face(x, y, s, big) {
    const e = 6 * s, r = (big ? 3.4 : 2.7) * s;
    return `<circle cx="${x - e}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + e}" cy="${y}" r="${r}" fill="${INK}"/>
      <circle cx="${x - e + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/><circle cx="${x + e + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/>
      <path d="M${x - 2.6 * s} ${y + 3.6 * s}Q${x} ${y + 6.4 * s} ${x + 2.6 * s} ${y + 3.6 * s}" fill="none" stroke="${INK}" stroke-width="${1.9 * s}" stroke-linecap="round"/>
      <ellipse cx="${x - e - 3.5 * s}" cy="${y + 4 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#ff7aa8" opacity=".6"/><ellipse cx="${x + e + 3.5 * s}" cy="${y + 4 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#ff7aa8" opacity=".6"/>`;
  }
  function spark(x, y, r, fill) {
    return `<path d="M${x} ${y - r}Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  }
  // a front-facing guinea blob; o = {body, patch, s, ty, eyes:"big"|"cool"|"star"|null, under, over, tuft}
  function guinea(o) {
    const s = o.s || 1, ty = o.ty == null ? 58 : o.ty;
    const big = o.eyes === "big";
    const er = big ? 6.6 : 5;
    let eyes = "";
    if (o.eyes === "cool") {
      eyes = `<path d="M28 52h18v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8z M54 52h18v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8z" fill="${INK}"/>
        <path d="M44 54h12" stroke="${INK}" stroke-width="3"/><path d="M31 55l4 0" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M57 55l4 0" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`;
    } else if (o.eyes === "star") {
      const st = (cx, cy) => `<path d="M${cx} ${cy - 10}L${cx + 3} ${cy - 3}L${cx + 10} ${cy - 2}L${cx + 4.5} ${cy + 3}L${cx + 6} ${cy + 10}L${cx} ${cy + 6}L${cx - 6} ${cy + 10}L${cx - 4.5} ${cy + 3}L${cx - 10} ${cy - 2}L${cx - 3} ${cy - 3}Z" fill="#ffd84d" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
      eyes = st(37, 57) + st(63, 57) + `<path d="M46 57h8" stroke="${INK}" stroke-width="3"/>`;
    } else {
      eyes = `<circle cx="38" cy="57" r="${er}" fill="${INK}"/><circle cx="62" cy="57" r="${er}" fill="${INK}"/>
        <circle cx="${39.8}" cy="${55}" r="${er * 0.38}" fill="#fff"/><circle cx="${63.8}" cy="${55}" r="${er * 0.38}" fill="#fff"/>` +
        (big ? `<circle cx="36" cy="59.5" r="1.3" fill="#fff"/><circle cx="60" cy="59.5" r="1.3" fill="#fff"/>` : "");
    }
    return `<g transform="translate(50 ${ty}) scale(${s}) translate(-50 -58)">
      ${o.under || ""}
      <ellipse cx="29" cy="35" rx="9" ry="7" fill="${o.patch}" stroke="${INK}" stroke-width="3.5"/>
      <ellipse cx="71" cy="35" rx="9" ry="7" fill="${o.patch}" stroke="${INK}" stroke-width="3.5"/>
      <ellipse cx="36" cy="86" rx="7" ry="4.5" fill="#ffb3cf" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="64" cy="86" rx="7" ry="4.5" fill="#ffb3cf" stroke="${INK}" stroke-width="3"/>
      <path d="M50 30C75 30 89 46 89 63C89 80 73 86 50 86S11 80 11 63C11 46 25 30 50 30Z" fill="${o.body}" stroke="${INK}" stroke-width="4"/>
      <path d="M19 52C23 40 34 33 45 33C41 46 33 57 21 65C18 61 18 56 19 52Z" fill="${o.patch}"/>
      <path d="M50 30C75 30 89 46 89 63C89 80 73 86 50 86S11 80 11 63C11 46 25 30 50 30Z" fill="none" stroke="${INK}" stroke-width="4"/>
      ${o.tuft ? `<path d="M46 31Q44 22 50 20Q48 26 54 25Q52 29 52 31" fill="${o.patch}" stroke="${INK}" stroke-width="3"/>` : ""}
      ${eyes}
      <ellipse cx="27" cy="68" rx="5" ry="3" fill="#ff7aa8" opacity=".55"/><ellipse cx="73" cy="68" rx="5" ry="3" fill="#ff7aa8" opacity=".55"/>
      <path d="M46 67Q50 64 54 67Q50 72 46 67Z" fill="#ff7aa8" stroke="${INK}" stroke-width="2.6"/>
      <path d="M44 74Q47 77 50 74Q53 77 56 74" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      ${o.over || ""}
    </g>`;
  }
  const svgWrap = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;

  function buildArt(gc, gc2) {
    return [
      // 0: seed
      svgWrap(`<path d="M50 16C68 32 76 54 70 70C64 84 36 84 30 70C24 54 32 32 50 16Z" fill="#c98a4b" ${SW} stroke-width="4"/>
        <path d="M50 24C46 40 46 60 50 78" fill="none" stroke="#9a5f2a" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="40" cy="40" rx="4" ry="8" fill="#fff" opacity=".5" transform="rotate(20 40 40)"/>${face(50, 60, 0.9)}`),
      // 1: sprout
      svgWrap(`<path d="M50 70C50 58 50 50 50 40" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
        <path d="M50 70C50 58 50 50 50 40" stroke="#5cc23a" stroke-width="4" stroke-linecap="round"/>
        <path d="M50 44C40 26 22 26 16 32C24 46 40 48 50 44Z" fill="#7be04a" ${SW} stroke-width="3.5"/>
        <path d="M50 40C58 20 78 18 86 24C78 42 60 44 50 40Z" fill="#9cf06a" ${SW} stroke-width="3.5"/>
        <path d="M14 88C18 70 34 64 50 64S82 70 86 88Z" fill="#a8643a" ${SW} stroke-width="4"/>${face(50, 77, 0.85)}`),
      // 2: lettuce
      svgWrap(`<path d="M50 12C58 12 62 18 68 18C76 18 80 26 84 32C90 38 90 46 88 52C92 60 88 68 84 72C82 80 74 86 66 86C60 90 54 90 50 88C44 90 38 90 32 86C24 86 18 80 16 72C10 68 8 60 12 52C10 46 10 38 16 32C20 26 24 18 32 18C38 18 42 12 50 12Z" fill="#5cc23a" ${SW} stroke-width="4"/>
        <path d="M50 24C62 24 74 34 76 48C78 64 66 78 50 78S22 64 24 48C26 34 38 24 50 24Z" fill="#9cf06a" stroke="#3f9a25" stroke-width="3"/>
        <path d="M50 26V40M38 32L44 42M62 32L56 42" stroke="#3f9a25" stroke-width="3" stroke-linecap="round"/>${face(50, 56, 1)}`),
      // 3: carrot
      svgWrap(`<path d="M46 28C42 16 32 12 26 14C30 22 38 28 46 30Z" fill="#5cc23a" ${SW} stroke-width="3.5"/>
        <path d="M54 28C58 16 68 12 74 14C70 22 62 28 54 30Z" fill="#7be04a" ${SW} stroke-width="3.5"/>
        <path d="M50 30C48 18 50 10 50 8C52 12 54 20 50 30Z" fill="#7be04a" ${SW} stroke-width="3.5"/>
        <path d="M30 34C40 26 60 26 70 34C70 50 60 74 52 90C51 92 49 92 48 90C40 74 30 50 30 34Z" fill="#ff9f43" ${SW} stroke-width="4"/>
        <path d="M36 64l7 -2M58 70l-6 -1M60 46l-6 1" stroke="#c96a1c" stroke-width="3" stroke-linecap="round"/>${face(50, 45, 0.95)}`),
      // 4: strawberry
      svgWrap(`<path d="M50 90C28 78 16 58 20 42C24 30 38 26 50 30C62 26 76 30 80 42C84 58 72 78 50 90Z" fill="#ff4d6d" ${SW} stroke-width="4"/>
        <g fill="#ffe680" stroke="${INK}" stroke-width="1.2"><ellipse cx="32" cy="50" rx="2" ry="3"/><ellipse cx="68" cy="50" rx="2" ry="3"/><ellipse cx="36" cy="68" rx="2" ry="3"/><ellipse cx="64" cy="68" rx="2" ry="3"/><ellipse cx="50" cy="78" rx="2" ry="3"/><ellipse cx="28" cy="38" rx="1.8" ry="2.6"/><ellipse cx="72" cy="38" rx="1.8" ry="2.6"/></g>
        <path d="M50 34L40 24L32 30L36 20L28 16L42 18L50 10L58 18L72 16L64 20L68 30L60 24Z" fill="#5cc23a" ${SW} stroke-width="3.5"/>
        <ellipse cx="34" cy="40" rx="3" ry="6" fill="#fff" opacity=".45" transform="rotate(30 34 40)"/>${face(50, 54, 1)}`),
      // 5: baby guinea (her colours)
      svgWrap(guinea({ body: gc, patch: gc2, s: 0.82, ty: 62, eyes: "big", tuft: true })),
      // 6: teen guinea
      svgWrap(guinea({ body: "#fff6ea", patch: "#3b2a20", s: 0.96, ty: 57, eyes: "cool",
        over: `<path d="M60 75Q66 78 70 73" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>` })),
      // 7: guinea in a hat
      svgWrap(guinea({ body: "#e08a4a", patch: "#fff3e0", s: 0.86, ty: 64,
        over: `<ellipse cx="50" cy="33" rx="25" ry="6" fill="${INK}"/><path d="M35 33V6h30v27Z" fill="${INK}"/><rect x="35" y="22" width="30" height="7" fill="#ff8fc7"/>
          <path d="M40 10v8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>` })),
      // 8: royal guinea
      svgWrap(`<path d="M6 96L18 46Q50 34 82 46L94 96Z" fill="#8a4fd8" ${SW} stroke-width="4"/><path d="M10 92h80" stroke="#fff" stroke-width="7"/><g fill="${INK}"><circle cx="22" cy="92" r="1.6"/><circle cx="40" cy="92" r="1.6"/><circle cx="58" cy="92" r="1.6"/><circle cx="76" cy="92" r="1.6"/></g>` +
        guinea({ body: "#fff3d6", patch: "#c8693a", s: 0.86, ty: 62,
          over: `<path d="M32 34L34 12L43 24L50 8L57 24L66 12L68 34Z" fill="#ffd84d" ${SW} stroke-width="3.5"/><circle cx="50" cy="26" r="3.5" fill="#ff4d6d" stroke="${INK}" stroke-width="2"/><circle cx="39" cy="29" r="2.4" fill="#5fd3ff" stroke="${INK}" stroke-width="1.8"/><circle cx="61" cy="29" r="2.4" fill="#5fd3ff" stroke="${INK}" stroke-width="1.8"/>` })),
      // 9: golden guinea
      svgWrap(guinea({ body: "#ffd23f", patch: "#f39a1c", s: 0.9, ty: 58,
        over: `<path d="M28 44Q32 40 36 44" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>` }) +
        spark(14, 18, 9, "#fff8c2") + spark(87, 24, 7, "#fff") + spark(88, 82, 6, "#fff8c2") + spark(11, 76, 5, "#fff")),
      // 10: cosmic disco guinea
      svgWrap(`<path d="M8 74A42 42 0 0 1 92 74" fill="none" stroke="#ff5a5f" stroke-width="5"/><path d="M14 74A36 36 0 0 1 86 74" fill="none" stroke="#ffd84d" stroke-width="5"/><path d="M20 74A30 30 0 0 1 80 74" fill="none" stroke="#7be04a" stroke-width="5"/><path d="M26 74A24 24 0 0 1 74 74" fill="none" stroke="#5fd3ff" stroke-width="5"/>
        <circle cx="50" cy="9" r="8" fill="#e8e4ff" stroke="${INK}" stroke-width="3"/><path d="M42 9h16M50 1v16M44 4l12 10M56 4l-12 10" stroke="#9a8acc" stroke-width="1.6"/><path d="M50 1V-6" stroke="${INK}" stroke-width="2"/>` +
        guinea({ body: "#c7b3ff", patch: "#ff8fc7", s: 0.86, ty: 62, eyes: "star", tuft: true }) +
        spark(12, 22, 6, "#fff") + spark(89, 30, 7, "#ffd84d") + spark(90, 88, 5, "#fff")),
    ];
  }
  const TIERS = [
    { name: "Seed", bg: "#fff1c9", fx: "#c98a4b" },
    { name: "Sprout", bg: "#e4f8d2", fx: "#7be04a" },
    { name: "Lettuce", bg: "#d4f5b8", fx: "#5cc23a" },
    { name: "Carrot", bg: "#ffe0bd", fx: "#ff9f43" },
    { name: "Strawberry", bg: "#ffd3dc", fx: "#ff4d6d" },
    { name: "Baby Guinea", bg: "#ffe3f1", fx: "#ff8fc7" },
    { name: "Teen Guinea", bg: "#cdeeff", fx: "#5fd3ff" },
    { name: "Hat Guinea", bg: "#e3d8ff", fx: "#c7b3ff" },
    { name: "Royal Guinea", bg: "#fff0a8", fx: "#8a4fd8" },
    { name: "Golden Guinea", bg: "#ffb703", fx: "#ffd23f" },
    { name: "Cosmic Disco Guinea", bg: "#3b1d6e", fx: "#ff8fc7" },
  ];
  const MERGE_WORDS = ["SQUISH!", "MERGE!", "SPLORT!", "SMOOSH!", "NOM!", "SQUELCH!"];
  const MULTI = { 2: "DOUBLE SQUISH!", 3: "TRIPLE GOO!", 4: "MEGA MUSH!" };
  const BUMPS = ["pfft!", "nope!", "stuck!", "bonk!"];

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);display:flex;flex-direction:column;touch-action:none;-webkit-user-select:none;user-select:none}
.${C} .hud{flex:none;display:flex;gap:6px;padding:8px 8px 0;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-16px)}
.${C} .pill{flex:1;min-width:0;background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 8px;font-family:var(--display);font-size:20px;display:flex;align-items:center;justify-content:center;gap:4px;min-height:42px;white-space:nowrap;transition:background .2s}
.${C} .pill small{font-family:var(--body);font-weight:900;font-size:12px;color:var(--ink-soft)}
.${C} .pill.low{background:#ffd3dc;animation:${C}-throb .6s ease-in-out infinite}
.${C} .mid{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;touch-action:none}
.${C} .board{position:relative;background:#a98ad8;border:4px solid var(--ink);border-radius:20px;box-shadow:0 6px 0 var(--ink),inset 0 -6px 0 rgba(43,22,64,.18);touch-action:none}
.${C} .cell{position:absolute;background:rgba(255,255,255,.28);border-radius:14px;box-shadow:inset 0 3px 0 rgba(43,22,64,.12)}
.${C} .tile{position:absolute;left:0;top:0;transition:transform ${SLIDE}ms cubic-bezier(.3,.7,.4,1);will-change:transform;z-index:1}
.${C} .tile.nt{transition:none}
.${C} .tile.dying{z-index:0}
.${C} .in{position:relative;width:100%;height:100%;border:3.5px solid var(--ink);border-radius:15px;box-shadow:0 4px 0 var(--ink);overflow:visible}
.${C} .in .art{position:absolute;inset:5%;pointer-events:none}
.${C} .in .num{position:absolute;right:-5px;bottom:-7px;background:#fff;border:2.5px solid var(--ink);border-radius:999px;padding:0 5px;font-family:var(--display);font-size:calc(var(--cs) * .17);line-height:1.35;min-width:1.5em;text-align:center;z-index:2}
.${C} .in.big .num{font-size:calc(var(--cs) * .14)}
.${C} .in.cosmic{background:radial-gradient(circle at 20% 80%,#ffffff 0 1.5px,transparent 2px),radial-gradient(circle at 80% 15%,#ffffff 0 1.5px,transparent 2px),radial-gradient(circle at 70% 70%,#ffd84d 0 1.5px,transparent 2px),#3b1d6e}
.${C} .in.spawn{animation:${C}-spawn .26s ${SLIDE * 0.6}ms cubic-bezier(.2,1.6,.4,1) backwards}
.${C} .in.pop{animation:${C}-pop .3s cubic-bezier(.2,1.5,.45,1)}
.${C} .in.sh{animation:${C}-sh .17s ease-out}
.${C} .in.sv{animation:${C}-sv .17s ease-out}
.${C} .ladder{flex:none;display:flex;justify-content:center;align-items:flex-end;gap:2px;padding:4px 6px 10px}
.${C} .lad{position:relative;flex:0 1 34px;min-width:0;aspect-ratio:1;border:2.5px solid var(--ink);border-radius:9px;background:#fff;opacity:.42;filter:grayscale(.85) brightness(1.1);transition:opacity .3s,filter .3s,transform .3s}
.${C} .lad .art{position:absolute;inset:4%}
.${C} .lad.on{opacity:1;filter:none}
.${C} .lad.cur{transform:translateY(-5px) scale(1.12);box-shadow:0 3px 0 var(--ink)}
.${C} .lad.cosmic.on{background:#3b1d6e}
.${C} .lab{flex:none;text-align:center;font-family:var(--display);font-size:15px;line-height:1.1;padding:2px 8px 0;margin-bottom:6px;min-height:19px;color:var(--ink)}
.${C} .lab small{font-family:var(--body);font-weight:900;font-size:12px;color:var(--ink-soft)}
.${C} canvas.fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4}
.${C} .banner{position:absolute;left:0;right:0;top:38%;text-align:center;pointer-events:none;z-index:5;font-family:var(--display);font-size:38px;line-height:1;color:#fff;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);opacity:0}
.${C} .banner .bx{display:inline-block;max-width:92%;background:rgba(43,22,64,.5);border-radius:24px;padding:10px 16px 12px}
.${C} .banner small{display:block;font-size:18px;margin-top:4px;-webkit-text-stroke:1px var(--ink);text-shadow:0 2px 0 var(--ink)}
.${C} .banner .bart{width:72px;height:72px;margin:0 auto 6px;border:3px solid var(--ink);border-radius:16px;position:relative;box-shadow:0 0 0 4px var(--yellow),0 6px 0 4px var(--ink);transform:rotate(-6deg)}
.${C} .banner .bart .art{position:absolute;inset:5%}
.${C} .banner.go{animation:${C}-ban 1.3s ease-out forwards}
.${C} .x2{position:absolute;top:58px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:3;pointer-events:none}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(43,22,64,.35);z-index:6;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:350px;padding:12px 14px 16px;text-align:center;animation:${C}-in .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .hero{display:flex;align-items:flex-end;justify-content:center;gap:6px;height:96px}
.${C} .panel .hero .pig{animation:${C}-wob 1.2s ease-in-out infinite;transform-origin:50% 100%}
.${C} .panel .hero .tl{width:70px;height:70px;border:3px solid var(--ink);border-radius:15px;position:relative;box-shadow:0 4px 0 var(--ink);margin-bottom:6px}
.${C} .panel .hero .tl .art{position:absolute;inset:5%}
.${C} .panel .hero .tl.cosmic{background:#3b1d6e}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:30px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--yellow)}
.${C} .panel p{margin:0 0 8px;font-size:15.5px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .steps{display:grid;grid-template-columns:repeat(6,1fr);gap:4px 3px;margin:4px 0 10px}
.${C} .step{position:relative;aspect-ratio:1;border:2.5px solid var(--ink);border-radius:9px}
.${C} .step .art{position:absolute;inset:5%}
.${C} .step b{position:absolute;right:-4px;bottom:-6px;background:#fff;border:2px solid var(--ink);border-radius:99px;font-family:var(--display);font-weight:400;font-size:10px;padding:0 3px;line-height:1.3}
.${C} .step.cosmic{background:#3b1d6e}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#fff4cc;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:56px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
.${C}.short .panel .hero{height:70px}
.${C}.short .panel .hero .pig svg{width:70px;height:60px}
.${C}.short .panel .hero .tl{width:56px;height:56px}
.${C}.short .panel h2{font-size:26px;margin:4px 0}
.${C}.short .steps{margin:2px 0 8px}
.${C}.short .chips{margin:0 0 8px}
.${C}.short .panel .btn{min-height:50px}
@keyframes ${C}-spawn{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes ${C}-pop{0%{transform:scale(.7)}45%{transform:scale(1.28,1.1)}70%{transform:scale(.92,1.06)}100%{transform:scale(1)}}
@keyframes ${C}-sh{0%{transform:scale(1.14,.86)}100%{transform:scale(1)}}
@keyframes ${C}-sv{0%{transform:scale(.86,1.14)}100%{transform:scale(1)}}
@keyframes ${C}-ban{0%{opacity:0;transform:scale(.4)}15%{opacity:1;transform:scale(1.15)}25%{transform:scale(1)}75%{opacity:1;transform:translateY(-10px)}100%{opacity:0;transform:translateY(-36px)}}
@keyframes ${C}-in{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const ART = buildArt((api.guinea && api.guinea.color) || "#f2a65a", (api.guinea && api.guinea.color2) || "#8a4a2a");
    const artBox = (k, cls, extra) => `<div class="${cls}${k === 10 ? " cosmic" : ""}" style="background:${TIERS[k].bg}">${extra || ""}<div class="art">${ART[k]}</div></div>`;

    let ladderHTML = "";
    for (let k = 0; k < 11; k++) ladderHTML += artBox(k, "lad");
    let cellsHTML = "";
    for (let i = 0; i < 16; i++) cellsHTML += '<div class="cell"></div>';
    wrap.innerHTML = `<div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill mv"><b>${MOVES}</b><small>moves</small></div><div class="pill tm">⏱<b>2:00</b></div></div>
      <div class="mid"><div class="board">${cellsHTML}</div></div>
      <div class="lab"></div>
      <div class="ladder">${ladderHTML}</div>
      <canvas class="fx"></canvas><div class="banner"></div><div class="ov hide"></div>`;
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), mvEl = wrap.querySelector(".mv b"), tmEl = wrap.querySelector(".tm b");
    const tmPill = wrap.querySelector(".tm"), mvPill = wrap.querySelector(".mv");
    const mid = wrap.querySelector(".mid"), board = wrap.querySelector(".board"), cells = [...wrap.querySelectorAll(".cell")];
    const labEl = wrap.querySelector(".lab"), lads = [...wrap.querySelectorAll(".lad")];
    const cv = wrap.querySelector("canvas.fx"), ctx = cv.getContext("2d");
    const banEl = wrap.querySelector(".banner"), ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };

    let W = 1, H = 1, dpr = 1, B = 300, gap = 8, cs = 64;
    let raf = 0, last = 0, dead = false;
    const S = { state: "intro" };
    let grid = [], tiles = new Set(), pend = null, nextId = 1;
    let parts = [], floats = [];

    /* ---------- layout ---------- */
    function posOf(r, c) { return [gap + c * (cs + gap), gap + r * (cs + gap)]; }
    function place(t, instant) {
      const [x, y] = posOf(t.r, t.c);
      if (instant) t.el.classList.add("nt");
      t.el.style.transform = `translate(${x}px,${y}px)`;
      if (instant) { void t.el.offsetWidth; t.el.classList.remove("nt"); }
    }
    function resize() {
      W = Math.max(1, wrap.clientWidth); H = Math.max(1, wrap.clientHeight);
      wrap.classList.toggle("short", H < 640);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const mw = mid.clientWidth, mh = mid.clientHeight;
      B = Math.floor(clamp(Math.min(mw - 20, mh - 22, 470), 200, 470));
      gap = Math.max(6, Math.round(B * 0.028));
      cs = (B - 8 - gap * 5) / 4; // board border 4px each side
      board.style.width = board.style.height = B + "px";
      board.style.setProperty("--cs", cs + "px");
      cells.forEach((el, i) => {
        const [x, y] = posOf((i / 4) | 0, i % 4);
        el.style.cssText = `left:${x}px;top:${y}px;width:${cs}px;height:${cs}px`;
      });
      tiles.forEach((t) => { t.el.style.width = t.el.style.height = cs + "px"; place(t, true); });
    }

    /* ---------- tiles ---------- */
    function tierOf(v) { return Math.round(Math.log2(v)) - 1; }
    function paintTile(t) {
      const k = tierOf(t.v);
      t.inEl.className = "in" + (k >= 9 ? " big" : "") + (k === 10 ? " cosmic" : "");
      t.inEl.style.background = k === 10 ? "" : TIERS[k].bg;
      t.inEl.innerHTML = `<div class="art">${ART[k]}</div><div class="num">${t.v}</div>`;
    }
    function makeTile(r, c, v, anim) {
      const el = document.createElement("div"); el.className = "tile";
      const inEl = document.createElement("div"); el.appendChild(inEl);
      const t = { id: nextId++, r, c, v, el, inEl };
      el.style.width = el.style.height = cs + "px";
      paintTile(t);
      place(t, true);
      board.appendChild(el);
      if (anim) restartAnim(inEl, anim);
      tiles.add(t);
      grid[r][c] = t;
      return t;
    }
    function restartAnim(el, cls) {
      el.classList.remove("spawn", "pop", "sh", "sv");
      void el.offsetWidth;
      el.classList.add(cls);
    }
    function empties() {
      const out = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!grid[r][c]) out.push([r, c]);
      return out;
    }
    function spawn(anim) {
      const e = empties(); if (!e.length) return null;
      const [r, c] = pick(e);
      return makeTile(r, c, Math.random() < 0.1 ? 4 : 2, anim ? "spawn" : null);
    }
    function canMove() {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const t = grid[r][c]; if (!t) return true;
        if (c < 3 && grid[r][c + 1] && grid[r][c + 1].v === t.v) return true;
        if (r < 3 && grid[r + 1][c] && grid[r + 1][c].v === t.v) return true;
      }
      return false;
    }
    function flush() {
      if (!pend) return;
      clearTimeout(pend.t); timers.delete(pend.t);
      const f = pend.fn; pend = null; f();
    }

    /* ---------- move ---------- */
    // dir: 0 up, 1 right, 2 down, 3 left
    function slide(dir) {
      const merges = []; let moved = false;
      const ng = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
      for (let i = 0; i < 4; i++) {
        const line = [];
        for (let j = 0; j < 4; j++) {
          // j = 0 is the far edge in the move direction
          let r, c;
          if (dir === 0) { r = j; c = i; } else if (dir === 2) { r = 3 - j; c = i; }
          else if (dir === 3) { r = i; c = j; } else { r = i; c = 3 - j; }
          line.push([r, c]);
        }
        let k = 0, lastT = null;
        for (const [r, c] of line) {
          const t = grid[r][c]; if (!t) continue;
          if (lastT && lastT.v === t.v && !lastT.justMerged) {
            lastT.justMerged = true;
            t.r = lastT.r; t.c = lastT.c;
            merges.push({ keep: lastT, die: t });
            moved = true;
          } else {
            const [nr, nc] = line[k++];
            if (nr !== r || nc !== c) moved = true;
            t.r = nr; t.c = nc;
            ng[nr][nc] = t;
            lastT = t;
          }
        }
      }
      if (!moved) return null;
      grid = ng;
      for (const m of merges) { m.keep.justMerged = false; m.keep.v *= 2; m.die.dying = true; tiles.delete(m.die); }
      return merges;
    }

    function doMove(dir) {
      if (S.state !== "play") return;
      flush();
      const before = new Map();
      tiles.forEach((t) => before.set(t, [t.r, t.c]));
      const merges = slide(dir);
      if (!merges) { bonk(dir); return; }
      S.moves--;
      const axis = dir === 1 || dir === 3 ? "sh" : "sv";
      const all = [...before.keys()];
      for (const t of all) {
        const b = before.get(t);
        if (b[0] !== t.r || b[1] !== t.c) { place(t); restartAnim(t.inEl, axis); }
      }
      for (const m of merges) m.die.el.classList.add("dying");
      let gained = 0, topK = -1;
      for (const m of merges) { gained += m.keep.v; topK = Math.max(topK, tierOf(m.keep.v)); }
      S.score += gained;
      if (merges.length) { S.combo++; S.merges += merges.length; } else S.combo = 0;
      spawn(true);
      api.sfx(merges.length ? "pop" : "whoosh");
      if (merges.length) api.haptic(merges.length > 1 ? 30 : 15);
      setHud();
      pend = {
        fn: () => {
          for (const m of merges) {
            m.die.el.remove();
            paintTile(m.keep);
            restartAnim(m.keep.inEl, "pop");
            const [x, y] = tileCenter(m.keep);
            const k = tierOf(m.keep.v);
            burst(x, y, TIERS[k].fx, 10 + k * 2);
            floatT(x, y - cs * 0.3, merges.length === 1 && Math.random() < 0.15 ? pick(MERGE_WORDS) : "+" + m.keep.v, "#fff", Math.round(clamp(cs * 0.3, 16, 30)));
          }
          if (merges.length) afterMerge(merges.length, topK);
          checkEnd();
        },
      };
      pend.t = later(() => flush(), SLIDE + 10);
    }
    function afterMerge(n, topK) {
      shake(Math.min(10, 1.5 + n * 1.5 + topK * 0.4));
      if (topK > S.bestK) {
        S.bestK = topK;
        setLadder(true);
        if (topK >= 3) {
          banner(TIERS[topK].name.toUpperCase() + "!", topK >= 5 ? pick(["wheek wheek!", "it's alive!", "so squishy!", "new friend!"]) : "new evolution!", topK);
          api.sfx(topK >= 5 ? "wheek" : "sparkle");
          if (topK >= 5) later(() => api.sfx("fanfare"), 250);
          const br = board.getBoundingClientRect();
          api.confetti(br.left + br.width / 2, br.top + br.height * 0.4, 20 + topK * 4);
          return;
        }
      }
      if (n >= 2) { banner(MULTI[Math.min(4, n)], null); api.sfx("squish"); }
      else if (S.combo >= 5 && S.combo % 5 === 0) { banner("COMBO x" + S.combo + "!", pick(["keep squishing!", "goo-tastic!", "slurp!"])); api.sfx("sparkle"); }
      else if (topK >= 4) api.sfx(topK >= 5 ? "wheek" : "nom");
      else api.sfx(topK >= 2 ? "nom" : "squish");
    }
    function bonk(dir) {
      api.sfx("boop");
      const v = [[0, -1], [1, 0], [0, 1], [-1, 0]][dir];
      S.nudge = { x: v[0] * 8, y: v[1] * 8, t: 0 };
      S.combo = 0;
      if (Math.random() < 0.35) {
        api.sfx("fart");
        const cx = bx() + B / 2, cy = by() + B / 2;
        gasPuff(cx + v[0] * B * 0.45, cy + v[1] * B * 0.45);
        floatT(cx, cy, pick(BUMPS), "#b6f27a", 26);
      }
    }
    function checkEnd() {
      if (S.state !== "play") return;
      if (S.moves <= 0) endRound("moves");
      else if (!canMove()) endRound("stuck");
    }

    /* ---------- fx ---------- */
    function bx() { return board.getBoundingClientRect().left - wrap.getBoundingClientRect().left + 4; }
    function by() { return board.getBoundingClientRect().top - wrap.getBoundingClientRect().top + 4; }
    function tileCenter(t) { const [x, y] = posOf(t.r, t.c); return [bx() + x + cs / 2, by() + y + cs / 2]; }
    function burst(x, y, col, n) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), sp = rnd(80, 260);
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80, r: rnd(3, 7), col: i % 4 === 0 ? "#fff" : col, life: rnd(0.45, 0.8), t: 0, g: 520 });
      }
    }
    function gasPuff(x, y) {
      for (let i = 0; i < 9; i++) parts.push({ x: x + rnd(-14, 14), y: y + rnd(-10, 10), vx: rnd(-40, 40), vy: rnd(-60, -20), r: rnd(9, 16), col: "#a6e85a", life: rnd(0.6, 1), t: 0, g: -20, gas: true });
    }
    function floatT(x, y, s, col, size) { floats.push({ x, y, s, col, size, t: 0 }); }
    function shake(a) { S.shake = Math.max(S.shake || 0, RM ? a * 0.2 : a); }
    function banner(big, small, k) {
      const art = k != null && k >= 3 ? `<div class="bart${k === 10 ? " cosmic" : ""}" style="background:${TIERS[k].bg}"><div class="art">${ART[k]}</div></div>` : "";
      banEl.innerHTML = `<div class="bx">${art}${big}${small ? `<small>${small}</small>` : ""}</div>`;
      banEl.style.fontSize = big.length > 14 ? "28px" : "38px";
      banEl.classList.remove("go"); void banEl.offsetWidth; banEl.classList.add("go");
    }

    /* ---------- HUD ---------- */
    function fmtT(s) { s = Math.max(0, Math.ceil(s)); return ((s / 60) | 0) + ":" + String(s % 60).padStart(2, "0"); }
    function setHud() {
      scEl.textContent = S.score;
      mvEl.textContent = S.moves;
      mvPill.classList.toggle("low", S.moves <= 15 && S.state === "play");
      tmEl.textContent = fmtT(S.time);
      tmPill.classList.toggle("low", S.time <= 10 && S.state === "play");
    }
    function setLadder(bounce) {
      lads.forEach((el, k) => {
        el.classList.toggle("on", k <= S.bestK);
        el.classList.toggle("cur", k === S.bestK);
      });
      const nk = Math.min(10, S.bestK + 1);
      labEl.innerHTML = S.bestK >= 10 ? "COSMIC DISCO! 🪩" : `<small>next:</small> ${TIERS[nk].name} <small>(${2 ** (nk + 1)})</small>`;
      if (bounce && lads[S.bestK]) { lads[S.bestK].animate([{ transform: "translateY(-5px) scale(1.12)" }, { transform: "translateY(-14px) scale(1.4)" }, { transform: "translateY(-5px) scale(1.12)" }], { duration: 400, easing: "ease-out" }); }
    }

    /* ---------- round flow ---------- */
    function clearBoard() {
      tiles.forEach((t) => t.el.remove());
      board.querySelectorAll(".tile").forEach((el) => el.remove());
      tiles = new Set();
      grid = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
    }
    function showPanel(after) {
      let hero;
      if (after) {
        hero = `<div class="pig">${api.guineaSVG({ size: 92, mood: after.k >= 6 ? "wow" : "happy" })}</div>${artBox(after.k, "tl")}`;
      } else {
        hero = `<div class="pig">${api.guineaSVG({ size: 92, mood: "wow" })}</div>${artBox(10, "tl")}`;
      }
      let steps = "";
      if (!after) for (let k = 0; k < 11; k++) steps += artBox(k, "step", `<b>${2 ** (k + 1)}</b>`);
      const lastLine = after ? `<div class="last">${TIERS[after.k].name} &nbsp;⭐ ${after.score} &nbsp;🪙 ${after.earned}</div>` : "";
      const body = after
        ? `<p>${after.text}</p>`
        : `<p><b>Swipe</b> to slide all the tiles. Two the same <b>SQUISH</b> into the next thing!</p><div class="steps">${steps}</div>`;
      ov.innerHTML = `<div class="panel"><div class="hero">${hero}</div>
        <h2>${after ? (after.isNew ? "New best!" : after.title) : "Guinea Merge 2048"}</h2>${lastLine}${body}
        <div class="chips"><span class="chip">🐾 ${MOVES} moves</span><span class="chip">⏱ 2 minutes</span><span class="chip">🪙 bigger tile = more</span></div>
        <button class="btn green">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      flush();
      clearBoard();
      Object.assign(S, { state: "play", score: 0, moves: MOVES, time: TIME, bestK: 0, combo: 0, merges: 0, shake: 0, nudge: null, endT: 0, awarded: false, lastTick: 99 });
      parts = []; floats = [];
      spawn(true); spawn(true);
      S.bestK = Math.max(...[...tiles].map((t) => tierOf(t.v)));
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud(); setLadder(false);
      banner("SWIPE!", "squish the same ones");
      api.sfx("whoosh");
    }
    function endRound(why) {
      if (S.state !== "play") return;
      S.state = "end";
      setHud();
      if (why === "stuck") { banner("NO MOVES!", "board's full of goo"); api.sfx("fart"); const cx = bx() + B / 2, cy = by() + B / 2; gasPuff(cx, cy); const r = board.getBoundingClientRect(); api.gas(r.left + r.width / 2, r.top + r.height / 2); shake(8); }
      else if (why === "moves") { banner("OUT OF MOVES!", "paws are tired"); api.sfx("drum"); }
      else { banner("TIME'S UP!", "wheek!"); api.sfx("buzz"); }
      S.why = why;
      later(finish, 1500);
    }
    function finish() {
      if (S.awarded || dead) return;
      S.awarded = true; S.state = "over";
      const k = S.bestK, score = S.score;
      const tierPay = [0, 2, 6, 14, 26, 42, 62, 86, 115, 150, 200][k];
      const coins = Math.min(200, Math.round(tierPay + score / 60));
      const earned = coins > 0 ? api.award(coins, { reason: "Guinea Merge 2048" }) : 0;
      const hs = api.highscore(ID, score);
      const tn = TIERS[k].name;
      const quip = k >= 10 ? `COSMIC DISCO GUINEA! ${gName} can't stop dancing!` : k >= 8 ? `A ${tn}! ${gName} is bowing.` : k >= 5 ? `You grew a ${tn}! ${gName} wants to be friends.` : k >= 3 ? `You made a ${tn}. Nom nom! Next time, guineas!` : `${gName} says squish bigger next time!`;
      const text = `${quip} Score ${score}. ${hs.isNew && score > 0 ? "New best! 🏆" : "Best: " + hs.best}`;
      const title = S.why === "stuck" ? "Board's full!" : S.why === "moves" ? "Out of moves!" : "Time's up!";
      api.done({ earned, title: hs.isNew && score > 0 ? "New best!" : title, text, score });
      hud.classList.add("off");
      if (earned > 0) api.sfx(k >= 7 ? "bigwin" : "coin");
      showPanel({ k, score, earned, text, title, isNew: hs.isNew && score > 0 });
    }

    /* ---------- input ---------- */
    let ptr = null;
    function onDown(e) {
      if (S.state !== "play" || ptr) return;
      ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, fired: false };
      try { wrap.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    }
    function swipeDir(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0); }
    function onMove(e) {
      if (!ptr || e.pointerId !== ptr.id || ptr.fired) return;
      const dx = e.clientX - ptr.x, dy = e.clientY - ptr.y;
      if (Math.hypot(dx, dy) > 26) { ptr.fired = true; doMove(swipeDir(dx, dy)); }
    }
    function onUp(e) {
      if (!ptr || e.pointerId !== ptr.id) return;
      const dx = e.clientX - ptr.x, dy = e.clientY - ptr.y;
      if (!ptr.fired && Math.hypot(dx, dy) > 14) doMove(swipeDir(dx, dy));
      ptr = null;
    }
    function onKey(e) {
      const m = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3, W: 0, D: 1, S: 2, A: 3 }[e.key];
      if (m == null || S.state !== "play") return;
      e.preventDefault();
      doMove(m);
    }
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", resize);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }

    /* ---------- loop ---------- */
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (S.state === "play") {
        S.time -= dt;
        const sec = Math.ceil(S.time);
        if (sec !== S.lastTick) {
          S.lastTick = sec; tmEl.textContent = fmtT(S.time);
          tmPill.classList.toggle("low", S.time <= 10);
          if (sec <= 5 && sec > 0) api.sfx("tick");
        }
        if (S.time <= 0) { flush(); endRound("time"); }
      }
      // board shake + nudge
      let ox = 0, oy = 0;
      if (S.shake > 0.1) { ox += rnd(-S.shake, S.shake); oy += rnd(-S.shake, S.shake); S.shake *= Math.pow(0.0015, dt); } else S.shake = 0;
      if (S.nudge) { S.nudge.t += dt; const p = S.nudge.t / 0.22; if (p >= 1) S.nudge = null; else { const f = Math.sin(p * Math.PI) * (1 - p * 0.3); ox += S.nudge.x * f; oy += S.nudge.y * f; } }
      board.style.transform = ox || oy ? `translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px)` : "";
      // particles
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (parts.length || floats.length) {
        parts = parts.filter((p) => (p.t += dt) < p.life);
        for (const p of parts) {
          p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.gas) { p.vx *= 0.96; p.r += dt * 14; }
          const a = 1 - p.t / p.life;
          ctx.globalAlpha = p.gas ? a * 0.7 : Math.min(1, a * 1.6);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.gas ? 1 : 0.6 + a * 0.4), 0, TAU);
          ctx.fillStyle = p.col; ctx.fill();
          ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
        }
        floats = floats.filter((f) => (f.t += dt) < 0.9);
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
        for (const f of floats) {
          const a = 1 - f.t / 0.9, sc = f.t < 0.12 ? 0.6 + f.t / 0.12 * 0.5 : 1.1 - Math.min(0.1, (f.t - 0.12));
          ctx.globalAlpha = Math.min(1, a * 2);
          ctx.font = Math.round(f.size * sc) + "px " + FONT;
          const y = f.y - f.t * 50;
          ctx.lineWidth = Math.max(4, f.size * 0.22); ctx.strokeStyle = INK; ctx.strokeText(f.s, f.x, y);
          ctx.fillStyle = f.col; ctx.fillText(f.s, f.x, y);
        }
        ctx.globalAlpha = 1;
      }
    }

    clearBoard();
    resize();
    S.bestK = -1; setLadder(false); labEl.innerHTML = "";
    showPanel(null);
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        dead = true;
        cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t)); timers.clear();
        pend = null;
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID,
    name: "Guinea Merge 2048",
    icon: "🔢",
    place: "arcade",
    kind: "skill",
    blurb: "Squish seeds into guineas. Reach the Cosmic Disco Guinea!",
    mount,
  });
})();
