/* Wheek World mini-game: Veggie Slice.
   Veggies get tossed up from the bottom of a carnival tent; swipe through them to slice them in half.
   Several in one swipe = combo bonus. Poop bombs (fuse lit!) must NOT be sliced: big fart cloud, lose a heart.
   A veggie that falls off the bottom also costs a heart. 3 hearts, 60 second round.
   Pays once per round: score * 1.1, capped at 200. */
(function () {
  "use strict";
  const ID = "veggie-slice", C = "g-vslice";
  const INK = "#2b1640";
  const FONT = '"Bagel Fat One","Arial Rounded MT Bold","Trebuchet MS",sans-serif';
  const TAU = Math.PI * 2;
  const ROUND = 60;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];

  function svgImg(svg) {
    if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return img;
  }
  function rr(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function txt(g, s, x, y, size, fill, lw) {
    g.font = size + "px " + FONT; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = lw || Math.max(4, size * 0.2); g.strokeStyle = INK; g.strokeText(s, x, y);
    g.fillStyle = fill; g.fillText(s, x, y);
  }
  function star(g, x, y, r, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0); g.beginPath();
    for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU - Math.PI / 2, rr2 = i % 2 ? r * 0.45 : r; g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
    g.closePath(); g.fill(); g.restore();
  }

  /* ---------- produce art (drawn at origin, size r) ---------- */
  function face(g, x, y, r, worried) {
    const ex = r * 0.24, er = Math.max(2.2, r * 0.09);
    g.fillStyle = "rgba(255,120,170,.55)";
    g.beginPath(); g.ellipse(x - r * 0.42, y + r * 0.14, r * 0.13, r * 0.08, 0, 0, TAU); g.ellipse(x + r * 0.42, y + r * 0.14, r * 0.13, r * 0.08, 0, 0, TAU); g.fill();
    g.fillStyle = INK;
    g.beginPath(); g.arc(x - ex, y, er, 0, TAU); g.arc(x + ex, y, er, 0, TAU); g.fill();
    g.fillStyle = "#fff";
    g.beginPath(); g.arc(x - ex + er * 0.35, y - er * 0.35, er * 0.38, 0, TAU); g.arc(x + ex + er * 0.35, y - er * 0.35, er * 0.38, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = Math.max(1.8, r * 0.06);
    g.beginPath();
    if (worried) { g.ellipse(x, y + r * 0.2, r * 0.07, r * 0.09, 0, 0, TAU); }
    else g.arc(x, y + r * 0.1, r * 0.1, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  }
  function shine(g, x, y, rx, ry) { g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(x, y, rx, ry, -0.6, 0, TAU); g.fill(); }

  function drawLettuce(g, r, gold) {
    const N = 11;
    g.beginPath();
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * TAU, a1 = ((i + 1) / N) * TAU, am = (a0 + a1) / 2;
      if (i === 0) g.moveTo(Math.cos(a0) * r * 0.9, Math.sin(a0) * r * 0.9);
      g.quadraticCurveTo(Math.cos(am) * r * 1.2, Math.sin(am) * r * 1.2, Math.cos(a1) * r * 0.9, Math.sin(a1) * r * 0.9);
    }
    g.closePath(); g.fillStyle = gold ? "#ffcf2e" : "#62c93c"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
    g.beginPath(); g.ellipse(0, r * 0.12, r * 0.64, r * 0.58, 0, 0, TAU); g.fillStyle = gold ? "#fff0a0" : "#a8ec6e"; g.fill(); g.lineWidth = 2.5; g.stroke();
    g.strokeStyle = gold ? "#e0a400" : "#4fae2f"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(0, r * 0.68); g.quadraticCurveTo(-r * 0.12, r * 0.2, -r * 0.42, -r * 0.2);
    g.moveTo(0, r * 0.68); g.quadraticCurveTo(r * 0.12, r * 0.2, r * 0.42, -r * 0.2); g.stroke();
    shine(g, -r * 0.5, -r * 0.55, r * 0.18, r * 0.1);
    face(g, 0, r * 0.08, r);
  }
  function drawCarrot(g, r) {
    g.fillStyle = "#4fbf3a"; g.strokeStyle = INK; g.lineWidth = 3;
    for (let i = -1; i <= 1; i++) { g.save(); g.translate(i * r * 0.18, -r * 0.7); g.rotate(i * 0.45); g.beginPath(); g.ellipse(0, -r * 0.3, r * 0.14, r * 0.36, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); }
    g.beginPath(); g.moveTo(-r * 0.52, -r * 0.55);
    g.quadraticCurveTo(-r * 0.48, r * 0.4, 0, r * 1.15); g.quadraticCurveTo(r * 0.48, r * 0.4, r * 0.52, -r * 0.55);
    g.quadraticCurveTo(0, -r * 0.88, -r * 0.52, -r * 0.55); g.closePath();
    g.fillStyle = "#ff9433"; g.fill(); g.lineWidth = 3.5; g.stroke();
    g.strokeStyle = "rgba(160,70,10,.55)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-r * 0.36, r * 0.3); g.lineTo(-r * 0.12, r * 0.33); g.moveTo(r * 0.3, r * 0.05); g.lineTo(r * 0.1, r * 0.08); g.moveTo(-r * 0.2, r * 0.68); g.lineTo(-r * 0.02, r * 0.7); g.stroke();
    shine(g, -r * 0.28, -r * 0.4, r * 0.1, r * 0.07);
    face(g, 0, -r * 0.2, r * 0.85);
  }
  function drawCucumber(g, r) {
    rr(g, -r * 1.08, -r * 0.55, r * 2.16, r * 1.1, r * 0.55);
    g.fillStyle = "#3da947"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
    g.strokeStyle = "#7fd86a"; g.lineWidth = Math.max(2, r * 0.08);
    g.beginPath(); g.moveTo(-r * 0.75, -r * 0.28); g.lineTo(r * 0.75, -r * 0.28); g.moveTo(-r * 0.7, r * 0.3); g.lineTo(r * 0.7, r * 0.3); g.stroke();
    g.fillStyle = "#1f7a35";
    [[-0.8, 0], [-0.45, -0.05], [0.6, 0.05], [0.85, -0.1], [-0.6, 0.4], [0.45, -0.4]].forEach(([a, b]) => { g.beginPath(); g.arc(a * r, b * r, Math.max(1.5, r * 0.05), 0, TAU); g.fill(); });
    shine(g, -r * 0.6, -r * 0.38, r * 0.18, r * 0.06);
    face(g, 0, -r * 0.02, r * 0.85);
  }
  function drawStrawberry(g, r) {
    g.beginPath(); g.moveTo(0, r * 1.0);
    g.bezierCurveTo(-r * 0.9, r * 0.45, -r * 1.05, -r * 0.62, -r * 0.42, -r * 0.7);
    g.quadraticCurveTo(0, -r * 0.84, r * 0.42, -r * 0.7);
    g.bezierCurveTo(r * 1.05, -r * 0.62, r * 0.9, r * 0.45, 0, r * 1.0); g.closePath();
    g.fillStyle = "#ff4466"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
    g.fillStyle = "#ffe27a";
    [[-0.55, -0.35], [0.55, -0.35], [-0.6, 0.15], [0.6, 0.15], [-0.3, 0.55], [0.3, 0.55], [0, 0.78], [-0.15, -0.5], [0.15, -0.5]].forEach(([a, b]) => { g.beginPath(); g.ellipse(a * r, b * r, r * 0.05, r * 0.08, a * 0.6, 0, TAU); g.fill(); });
    g.fillStyle = "#4fbf3a"; g.strokeStyle = INK; g.lineWidth = 2.5;
    for (let i = 0; i < 5; i++) { g.save(); g.translate(0, -r * 0.72); g.rotate((i / 5) * Math.PI - Math.PI * 0.9 + 0.3); g.beginPath(); g.ellipse(r * 0.25, 0, r * 0.26, r * 0.1, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); }
    shine(g, -r * 0.45, -r * 0.3, r * 0.12, r * 0.07);
    face(g, 0, -r * 0.08, r * 0.85);
  }
  function drawMelon(g, r) {
    g.save();
    g.beginPath(); g.ellipse(0, 0, r * 1.08, r * 0.92, 0, 0, TAU); g.fillStyle = "#56c25b"; g.fill(); g.clip();
    g.strokeStyle = "#20803a"; g.lineWidth = r * 0.14;
    for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(k * r * 0.34, -r); g.quadraticCurveTo(k * r * 0.34 + r * 0.12, -r * 0.3, k * r * 0.34 - r * 0.08, r * 0.2); g.quadraticCurveTo(k * r * 0.34 + r * 0.1, r * 0.6, k * r * 0.34, r); g.stroke(); }
    g.restore();
    g.beginPath(); g.ellipse(0, 0, r * 1.08, r * 0.92, 0, 0, TAU); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
    shine(g, -r * 0.55, -r * 0.45, r * 0.2, r * 0.1);
    g.fillStyle = "rgba(255,255,255,.25)"; rr(g, -r * 0.45, -r * 0.12, r * 0.9, r * 0.5, r * 0.25); g.fill();
    face(g, 0, 0, r);
  }
  function drawPepper(g, r, col) {
    g.beginPath(); g.moveTo(-r * 0.75, -r * 0.45);
    g.bezierCurveTo(-r * 1.02, r * 0.4, -r * 0.72, r * 0.98, -r * 0.3, r * 0.86);
    g.quadraticCurveTo(0, r * 1.02, r * 0.3, r * 0.86);
    g.bezierCurveTo(r * 0.72, r * 0.98, r * 1.02, r * 0.4, r * 0.75, -r * 0.45);
    g.quadraticCurveTo(0, -r * 0.82, -r * 0.75, -r * 0.45); g.closePath();
    g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
    g.strokeStyle = "rgba(43,22,64,.3)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(-r * 0.3, -r * 0.4); g.quadraticCurveTo(-r * 0.4, r * 0.3, -r * 0.3, r * 0.8); g.moveTo(r * 0.3, -r * 0.4); g.quadraticCurveTo(r * 0.4, r * 0.3, r * 0.3, r * 0.8); g.stroke();
    g.fillStyle = "#3f9a3a"; g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.ellipse(0, -r * 0.62, r * 0.3, r * 0.12, 0, 0, TAU); g.fill(); g.stroke();
    rr(g, -r * 0.09, -r * 1.0, r * 0.18, r * 0.4, r * 0.08); g.fill(); g.stroke();
    shine(g, -r * 0.5, -r * 0.2, r * 0.1, r * 0.18);
    face(g, 0, r * 0.05, r * 0.9);
  }
  function drawPoop(g, r, t) {
    // stink aura
    g.fillStyle = "rgba(150,230,90," + (0.18 + 0.08 * Math.sin(t * 8)) + ")";
    g.beginPath(); g.arc(0, r * 0.1, r * 1.35, 0, TAU); g.fill();
    // fuse
    const fx = r * 0.55, fy = -r * 1.25;
    g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(r * 0.05, -r * 0.72); g.quadraticCurveTo(r * 0.45, -r * 0.85, fx, fy); g.stroke();
    g.strokeStyle = "#e8c88a"; g.lineWidth = 2.2; g.stroke();
    const tiers = [[0, r * 0.52, r * 0.98, r * 0.42], [0, r * 0.06, r * 0.74, r * 0.36], [0, -r * 0.34, r * 0.5, r * 0.28]];
    for (const [x, y, a, b] of tiers) {
      g.beginPath(); g.ellipse(x, y, a, b, 0, 0, TAU); g.fillStyle = "#8a5530"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      g.fillStyle = "#a86c40"; g.beginPath(); g.ellipse(x - a * 0.3, y - b * 0.35, a * 0.4, b * 0.28, 0, 0, TAU); g.fill();
    }
    g.beginPath(); g.moveTo(-r * 0.2, -r * 0.55); g.quadraticCurveTo(r * 0.05, -r * 0.95, r * 0.18, -r * 0.58); g.fillStyle = "#8a5530"; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    // grumpy eyes
    const ex = r * 0.26, ey = r * 0.02;
    g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 2.2;
    g.beginPath(); g.ellipse(-ex, ey, r * 0.17, r * 0.19, 0, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(ex, ey, r * 0.17, r * 0.19, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(-ex + r * 0.04, ey + r * 0.04, r * 0.08, 0, TAU); g.arc(ex - r * 0.04, ey + r * 0.04, r * 0.08, 0, TAU); g.fill();
    g.lineWidth = 3.5; g.beginPath(); g.moveTo(-ex - r * 0.18, ey - r * 0.27); g.lineTo(-ex + r * 0.14, ey - r * 0.16); g.moveTo(ex + r * 0.18, ey - r * 0.27); g.lineTo(ex - r * 0.14, ey - r * 0.16); g.stroke();
    g.lineWidth = 2.5; g.beginPath(); g.arc(0, r * 0.5, r * 0.16, 1.15 * Math.PI, 1.85 * Math.PI); g.stroke();
    // spark
    const s = r * (0.22 + 0.08 * Math.sin(t * 40));
    g.fillStyle = "#ff9f43"; star(g, fx, fy, s * 1.4, t * 9);
    g.fillStyle = "#fff36b"; star(g, fx, fy, s * 0.8, -t * 11);
  }

  const TYPES = {
    lettuce: { draw: (g, r) => drawLettuce(g, r, false), sz: 1.0, flesh: "#e6ffc9", core: "#bdf28a", juice: ["#8ee05a", "#b6f27a", "#d4ff9e"] },
    gold: { draw: (g, r) => drawLettuce(g, r, true), sz: 1.0, flesh: "#fff6c2", core: "#ffe066", juice: ["#ffd84d", "#fff36b", "#ffe9a8"] },
    carrot: { draw: drawCarrot, sz: 0.95, flesh: "#ffc27a", core: "#ffa94d", juice: ["#ff9f43", "#ffbf73", "#ffd29a"] },
    cucumber: { draw: drawCucumber, sz: 0.85, flesh: "#ddf9b8", core: "#c0ec8a", juice: ["#a8ec6e", "#ddffb8", "#7be04a"] },
    strawberry: { draw: drawStrawberry, sz: 0.82, flesh: "#ffc0cf", core: "#ff8fa8", juice: ["#ff4466", "#ff7a93", "#ff9fb4"] },
    melon: { draw: drawMelon, sz: 1.2, flesh: "#ff6077", core: "#ff8a9a", juice: ["#ff4f6d", "#ff7a8f", "#ffb3c1"], seeds: true },
    pepper: { draw: (g, r, it) => drawPepper(g, r, it.col), sz: 0.95, flesh: "#fff0e0", core: "#ffe0c0", juice: ["#ff5a3b", "#ff8a6b", "#ffd84d"] },
  };
  const VEG = ["lettuce", "carrot", "cucumber", "strawberry", "melon", "pepper"];
  const NAMES = { lettuce: "lettuce", carrot: "carrot", cucumber: "cucumber", strawberry: "strawberry", melon: "watermelon", pepper: "pepper" };

  const CHEERS = ["WHEEK!!", "so juicy!", "chop chop!", "ninja guinea!", "yum yum!", "wheeeek!"];
  const EWWS = ["EWWW!", "who did that?!", "stinky!!", "not the poop!", "pee-yew!"];
  const HEART = '<svg viewBox="0 0 24 22" width="22" height="20"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';

  const CSS = `
.${C}{position:absolute;inset:0;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#4b2d8f}
.${C} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:2;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 10px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:4px;min-height:40px;white-space:nowrap}
.${C} .pill.tm{min-width:72px;justify-content:center}
.${C} .pill.tm.hurry{background:#ffb3c1;animation:${C}-throb .5s ease-in-out infinite}
.${C} .pill.lv{gap:1px;padding:2px 7px}
.${C} .pill.lv svg{transition:transform .3s,filter .3s,opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:56px;left:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:2;pointer-events:none}
.${C} .bump{animation:${C}-bump .25s}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.35);z-index:5;overflow:auto}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;padding:12px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1);margin:auto}
.${C} .panel .art{position:relative;height:104px;display:flex;align-items:flex-end;justify-content:center}
.${C} .panel .art .pig{animation:${C}-wob 1.2s ease-in-out infinite;transform-origin:50% 100%;position:relative;z-index:1}
.${C} .panel .art .v{position:absolute;font-size:34px;animation:${C}-fly 1.6s ease-in-out infinite}
.${C} .panel .art .v.a{left:8%;top:10px}
.${C} .panel .art .v.b{right:8%;top:4px;animation-delay:-.5s}
.${C} .panel .art .v.c{left:24%;top:-8px;font-size:26px;animation-delay:-1s}
.${C} .panel .art .v.d{right:24%;top:-12px;font-size:26px;animation-delay:-.2s}
.${C} .panel .art .slash{position:absolute;left:12%;right:12%;top:40px;height:6px;border-radius:6px;background:#fff;box-shadow:0 0 12px 4px #ff8fc7;transform:rotate(-14deg);opacity:.9}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:32px;margin:8px 0 6px;line-height:1;color:var(--ink);text-shadow:0 3px 0 var(--pink)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.3;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 12px}
.${C} .chip{background:#fff4cc;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C} .chip.bad{background:#e6f9cf}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:20px;margin:-2px 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ${C}-fly{0%,100%{transform:translateY(0) rotate(-10deg)}50%{transform:translateY(-10px) rotate(12deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.${C} *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<canvas></canvas>
      <div class="hud off"><div class="pill sc">🥬<b>0</b></div><div class="pill tm">⏱<b>60</b></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div>
      <div class="ov hide"></div>`;
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const hud = wrap.querySelector(".hud"), scEl = wrap.querySelector(".sc b"), tmEl = wrap.querySelector(".tm b"), tmPill = wrap.querySelector(".tm");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = wrap.querySelector(".ov");
    let x2El = null;
    try { document.fonts && document.fonts.load("40px " + FONT); } catch (e) { /* ignore */ }

    const gName = (api.guinea && api.guinea.name) || "Pudding";
    const gImg = { happy: svgImg(api.guineaSVG({ size: 200, mood: "happy" })), wow: svgImg(api.guineaSVG({ size: 200, mood: "wow" })), sad: svgImg(api.guineaSVG({ size: 200, mood: "sad" })) };

    let W = 1, H = 1, dpr = 1, R = 34, GS = 100;
    const S = {};
    const bunting = [];

    function reset() {
      Object.assign(S, {
        state: "intro", t: 0, left: ROUND, lives: 3, score: 0, sliced: 0, goldens: 0, bestCombo: 0, poops: 0, misses: 0,
        items: [], halves: [], parts: [], splats: [], floats: [], xs: [], trail: [], queue: [],
        waveT: 0.6, nextGold: rnd(12, 18), shake: 0, flash: 0, banner: null, endT: 0, awarded: false, reason: "",
        group: { n: 0, t: -9, x: 0, y: 0 }, cheer: 0, sad: 0, bubble: null, lastTick: 99, stall: 0,
      });
    }

    function resize() {
      const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      W = w; H = h;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      R = clamp(Math.min(W * 0.09, H * 0.055), 28, 46);
      GS = clamp(W * 0.27, 84, 130);
      bunting.length = 0;
      const n = Math.max(6, Math.round(W / 46));
      for (let i = 0; i < n; i++) bunting.push(["#ff8fc7", "#ffd84d", "#5fd3ff", "#7be04a", "#c7b3ff", "#ff9f43"][i % 6]);
    }

    /* ---------- helpers ---------- */
    function vp(x, y) { const r = cv.getBoundingClientRect(); return [r.left + x, r.top + y]; }
    function banner(text, sub, col) { S.banner = { text, sub, col, t: 0 }; }
    function floatT(x, y, text, col, size) {
      size = size || 24;
      ctx.font = size + "px " + FONT;
      const hw = ctx.measureText(text).width / 2 + 8;
      x = clamp(x, hw, Math.max(hw, W - hw)); y = clamp(y, 70, H - 30);
      S.floats.push({ x, y, text, col, size, t: 0, life: 1 });
    }
    function juice(x, y, cols, n, spd) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(0.25, 1) * (spd || 300); S.parts.push({ k: "drop", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, g: 900, r: rnd(3, 7), col: pick(cols), life: rnd(0.4, 0.8), t: 0 }); }
    }
    function sparkle(x, y, n) {
      for (let i = 0; i < n; i++) { const a = rnd(0, TAU), v = rnd(80, 280); S.parts.push({ k: "star", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 150, r: rnd(5, 10), col: pick(["#ffd84d", "#fff", "#ffe98a", "#ff8fc7"]), life: rnd(0.5, 1), t: 0, rot: rnd(0, TAU) }); }
    }
    function gasCloud(x, y, n, big) {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(30, big ? 260 : 120);
        S.parts.push({ k: "gas", x: x + rnd(-10, 10), y: y + rnd(-10, 10), vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, g: -30, r: rnd(12, big ? 30 : 18), grow: rnd(20, big ? 60 : 30), col: pick(["#9be36a", "#b6f27a", "#7fcf4a", "#cdeb8b", "#a3d65c"]), life: rnd(0.9, big ? 1.8 : 1.2), t: 0 });
      }
    }
    function shake(a) { S.shake = Math.max(S.shake, RM ? a * 0.2 : a); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function setHud() {
      scEl.textContent = S.score;
      const s = Math.max(0, Math.ceil(S.left));
      tmEl.textContent = s;
      tmPill.classList.toggle("hurry", s <= 5 && S.state === "play");
      hearts.forEach((h, i) => h.classList.toggle("gone", i >= S.lives));
    }
    function cheer(text, dur) { S.cheer = dur || 1.6; S.sad = 0; S.bubble = { text, t: 0, life: dur || 1.6 }; }
    function sadPig(text) { S.sad = 1.6; S.cheer = 0; S.bubble = { text, t: 0, life: 1.4 }; }

    /* ---------- UI ---------- */
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 96, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">🥬 ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="v a">🥕</span><span class="v b">🍉</span><span class="v c">🍓</span><span class="v d">🥒</span><div class="slash"></div><div class="pig">${svg}</div></div>
        <h2>${after ? (after.isNew ? "New best!" : "Again?!") : "Veggie Slice"}</h2>${lastLine}
        <p><b>Swipe</b> to slice the veggies! Don't let them drop, and <b>never</b> slice a 💩 poop bomb.</p>
        <div class="chips"><span class="chip">✨ 3+ in one swipe = combo</span><span class="chip">🌟 golden lettuce</span><span class="chip bad">💩 = fart!</span><span class="chip">❤️ 3 · ⏱ 60s</span></div>
        <button class="btn pink">${after ? "Play again!" : "Start!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "play";
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; wrap.appendChild(x2El); }
      setHud();
      banner("SLICE!", "swipe through the veggies", "#ff8fc7");
      cheer("let's chop!", 1.4);
      api.sfx("whoosh");
    }

    /* ---------- spawning ---------- */
    function launch(type) {
      const isPoop = type === "poop";
      const def = TYPES[type];
      const r = R * (isPoop ? 0.95 : def.sz);
      const x = rnd(W * 0.14, W * 0.86);
      const el = ROUND - S.left;
      const G = H * (1.0 + 0.3 * Math.min(1, el / ROUND));
      const peak = rnd(H * 0.2, H * 0.46);
      const y = H + r * 1.3;
      const vy = -Math.sqrt(2 * G * (y - peak));
      const tp = -vy / G;
      const tx = clamp(x + rnd(-W * 0.35, W * 0.35), W * 0.12, W * 0.88);
      const it = { type, x, y, vx: (tx - x) / (tp * 2), vy, G, r, rot: rnd(-0.4, 0.4), vr: rnd(-2.5, 2.5), sq: 1, t: 0, dead: false };
      if (type === "pepper") it.col = pick(["#ff3b3b", "#ffcf2e", "#ff8a1f"]);
      S.items.push(it);
      if (isPoop) api.sfx("tick");
      return it;
    }
    function wave() {
      const el = ROUND - S.left, p = el / ROUND;
      let n = 1 + Math.floor(rnd(0, 1.6 + p * 3.2));
      n = Math.min(n, 5);
      const poopChance = el < 4 ? 0 : 0.1 + p * 0.12;
      let poops = 0;
      for (let i = 0; i < n; i++) {
        let type = pick(VEG);
        if (poops < 2 && Math.random() < poopChance && n > 1 || (el > 4 && n === 1 && Math.random() < poopChance * 0.6)) { type = "poop"; poops++; }
        if (type !== "poop" && S.nextGold <= 0) { type = "gold"; S.nextGold = rnd(14, 20); }
        S.queue.push({ type, d: i * rnd(0.08, 0.2) });
      }
      api.sfx("whoosh");
      S.waveT = lerp(1.7, 0.95, p) + n * 0.16;
    }

    /* ---------- slicing ---------- */
    function segHit(ax, ay, bx, by, cx, cy, r) {
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      let t = l2 > 0 ? ((cx - ax) * dx + (cy - ay) * dy) / l2 : 0;
      t = clamp(t, 0, 1);
      const px = ax + dx * t - cx, py = ay + dy * t - cy;
      return px * px + py * py <= r * r;
    }
    function trySlice(ax, ay, bx, by) {
      if (S.state !== "play") return;
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 2) return;
      const ang = Math.atan2(by - ay, bx - ax);
      for (const it of S.items) {
        if (it.dead || it.y > H + it.r * 0.6) continue;
        const hr = it.type === "poop" ? it.r * 0.85 : it.r * 1.12;
        if (!segHit(ax, ay, bx, by, it.x, it.y, hr)) continue;
        it.dead = true;
        if (it.type === "poop") { poopBoom(it); if (S.state !== "play") return; continue; }
        sliceIt(it, ang);
      }
    }
    function sliceIt(it, ang) {
      const def = TYPES[it.type];
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      for (const side of [-1, 1]) {
        S.halves.push({ it, x: it.x + nx * side * it.r * 0.12, y: it.y + ny * side * it.r * 0.12, vx: it.vx * 0.5 + nx * side * rnd(90, 150) + Math.cos(ang) * 60, vy: Math.min(it.vy, 0) * 0.35 + ny * side * rnd(60, 120) - 80, ang, side, spin: 0, vs: side * rnd(2, 5), G: it.G * 1.2 });
      }
      juice(it.x, it.y, def.juice, 16, 320);
      if (S.splats.length > 24) S.splats.shift();
      S.splats.push({ x: it.x + rnd(-10, 10), y: it.y + rnd(-10, 10), r: it.r * rnd(0.9, 1.3), col: def.juice[0], t: 0, seed: Math.random() * 100, rot: rnd(0, TAU) });
      S.sliced++;
      const now = S.t;
      const g = S.group;
      if (now - g.t > 0.35) flushGroup();
      g.n++; g.t = now; g.x = it.x; g.y = it.y;
      if (it.type === "gold") {
        S.score += 10; S.goldens++;
        sparkle(it.x, it.y, 26);
        floatT(it.x, it.y - it.r, "GOLDEN +10!", "#ffd84d", 28);
        api.sfx("sparkle"); api.sfx("coin"); api.haptic(30);
        const [vx, vy] = vp(it.x, it.y); api.confetti(vx, vy, 30);
        cheer("GOLDEN!!", 1.6);
      } else {
        S.score += 1;
        floatT(it.x, it.y - it.r * 0.6, "+1", "#fff", 20);
        api.sfx(Math.random() < 0.5 ? "splat" : "squish"); api.haptic(12);
      }
      shake(2);
      setHud(); bump(scEl.parentNode);
    }
    function flushGroup() {
      const g = S.group, n = g.n;
      g.n = 0;
      if (n < 2) return;
      const bonus = n >= 3 ? n * 2 : 1;
      S.score += bonus;
      S.bestCombo = Math.max(S.bestCombo, n);
      if (n >= 3) {
        banner("COMBO x" + n + "!", "+" + bonus + " bonus", n >= 5 ? "#ffd84d" : "#5fd3ff");
        sparkle(g.x, g.y, 14 + n * 3);
        api.sfx(n >= 5 ? "bigwin" : "win"); api.haptic(40);
        const [vx, vy] = vp(g.x, g.y); api.confetti(vx, vy, 12 + n * 6);
        cheer(n >= 5 ? "MEGA WHEEK!!" : pick(CHEERS), 1.8);
        if (Math.random() < 0.6) api.sfx("wheek");
      } else {
        floatT(g.x, g.y - 40, "DOUBLE! +1", "#c7b3ff", 22);
        api.sfx("pop");
      }
      setHud(); bump(scEl.parentNode);
    }
    function poopBoom(it) {
      S.group.n = 0;
      S.lives--; S.poops++;
      S.flash = 0.45; shake(18);
      gasCloud(it.x, it.y, 34, true);
      juice(it.x, it.y, ["#8a5530", "#a86c40", "#6b3f22"], 18, 360);
      if (S.splats.length > 24) S.splats.shift();
      S.splats.push({ x: it.x, y: it.y, r: it.r * 1.5, col: "#8a5530", t: 0, seed: Math.random() * 100, rot: rnd(0, TAU) });
      api.sfx("fart"); S.splatT = 0.09;
      api.haptic(140);
      const [vx, vy] = vp(it.x, it.y); api.gas(vx, vy);
      floatT(it.x, it.y - it.r * 1.4, pick(["PFFFFT!", "BRAAAP!", "PHWOAR!"]), "#b6f27a", 34);
      sadPig(pick(EWWS));
      S.stall = 0.7;
      setHud(); bump(hearts[Math.max(0, S.lives)]);
      if (S.lives <= 0) endRound("Out of hearts!");
    }
    function missed(it) {
      S.group.n = 0;
      S.lives--; S.misses++;
      S.xs.push({ x: clamp(it.x, 30, W - 30), t: 0 });
      api.sfx("boop"); api.haptic(60); shake(5);
      floatT(it.x, H - 70, "the " + NAMES[it.type] + " got away!", "#ffb3c1", 18);
      sadPig("noo, my snack!");
      setHud(); bump(hearts[Math.max(0, S.lives)]);
      if (S.lives <= 0) endRound("Out of hearts!");
    }
    function endRound(reason) {
      if (S.state !== "play") return;
      flushGroup();
      S.state = "end"; S.endT = 0; S.reason = reason;
      S.trail.length = 0; down = false;
      banner(reason === "time" ? "TIME'S UP!" : "OUT OF HEARTS!", S.score + " points!", "#ffd84d");
      api.sfx(reason === "time" ? "fanfare" : "lose");
      if (reason === "time") cheer("what a chef!", 2);
      setHud();
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const sc = S.score;
      const coins = Math.min(200, Math.round(sc * 1.1));
      const earned = coins > 0 ? api.award(coins, { reason: "Veggie Slice" }) : 0;
      const hs = api.highscore(ID, sc);
      const quip = sc >= 120 ? `${gName} bows to the Veggie Ninja!` : sc >= 70 ? `${gName} is stuffed with salad!` : sc >= 30 ? `${gName} says: chop chop, nice work!` : sc > 0 ? `${gName} got a little snack.` : `${gName} is still hungry...`;
      const text = `${quip} ${S.sliced} sliced${S.bestCombo >= 3 ? `, best combo x${S.bestCombo}` : ""}${S.goldens ? `, ${S.goldens} golden` : ""}${S.poops ? `, ${S.poops} poop${S.poops > 1 ? "s" : ""} popped 💨` : ""}. ${hs.isNew && sc > 0 ? "New best! 🏆" : "Best: " + hs.best}`;
      api.done({ earned, title: hs.isNew && sc > 0 ? "New best!" : S.reason === "time" ? "Time's up!" : "Pfffft!", text, score: sc });
      hud.classList.add("off");
      showPanel({ score: sc, earned, isNew: hs.isNew && sc > 0 });
    }

    /* ---------- update ---------- */
    function update(dt) {
      S.t += dt;
      if (S.state === "play") {
        S.left -= dt;
        const s = Math.ceil(S.left);
        if (s <= 5 && s !== S.lastTick && s > 0) { S.lastTick = s; api.sfx("tick"); }
        if (S.left <= 0) { S.left = 0; endRound("time"); }
        S.nextGold -= dt;
        if (S.stall > 0) S.stall -= dt;
        else { S.waveT -= dt; if (S.waveT <= 0 && S.left > 1.2) wave(); }
        for (const q of S.queue) { q.d -= dt; if (q.d <= 0) { launch(q.type); q.done = true; } }
        S.queue = S.queue.filter((q) => !q.done);
        if (S.group.n && S.t - S.group.t > 0.35 && !down) flushGroup();
        if ((S.left | 0) !== (S.left + dt | 0)) setHud();
      }
      for (const it of S.items) {
        if (it.dead) continue;
        it.t += dt; it.vy += it.G * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.rot += it.vr * dt;
        it.sq = Math.max(0, it.sq - dt * 3);
        if (it.type === "poop" && Math.random() < dt * 20) S.parts.push({ k: "spark", x: it.x + it.r * 0.55, y: it.y - it.r * 1.25, vx: rnd(-90, 90), vy: rnd(-140, -20), g: 300, r: rnd(1.5, 3), col: pick(["#ffd84d", "#ff9f43", "#fff"]), life: rnd(0.2, 0.4), t: 0 });
        if (it.type === "gold" && Math.random() < dt * 14) S.parts.push({ k: "star", x: it.x + rnd(-it.r, it.r), y: it.y + rnd(-it.r, it.r), vx: 0, vy: -20, g: 0, r: rnd(3, 6), col: pick(["#fff", "#ffd84d"]), life: 0.5, t: 0, rot: 0 });
        if (it.vy > 0 && it.y > H + it.r * 1.6) {
          it.dead = true;
          if (S.state === "play" && it.type !== "poop" && it.type !== "gold") missed(it);
        }
      }
      S.items = S.items.filter((it) => !it.dead);
      for (const h of S.halves) { h.vy += h.G * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.spin += h.vs * dt; if (h.y > H + 120) h.dead = true; }
      S.halves = S.halves.filter((h) => !h.dead);
      for (const p of S.parts) {
        p.t += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.k === "gas") { p.r += p.grow * dt; p.vx *= 1 - dt * 2; p.vy *= 1 - dt * 1.5; }
        if (p.k === "star") p.rot += 6 * dt;
      }
      S.parts = S.parts.filter((p) => p.t < p.life);
      for (const s of S.splats) s.t += dt;
      S.splats = S.splats.filter((s) => s.t < 4);
      for (const x of S.xs) x.t += dt;
      S.xs = S.xs.filter((x) => x.t < 1.4);
      for (const f of S.floats) { f.t += dt; f.y -= 46 * dt; }
      S.floats = S.floats.filter((f) => f.t < f.life);
      const now = performance.now();
      S.trail = S.trail.filter((p) => now - p.t < 200);
      if (S.banner) { S.banner.t += dt; if (S.banner.t > 1.7 && S.state === "play") S.banner = null; }
      if (S.bubble) { S.bubble.t += dt; if (S.bubble.t > S.bubble.life) S.bubble = null; }
      S.cheer = Math.max(0, S.cheer - dt); S.sad = Math.max(0, S.sad - dt);
      S.shake = Math.max(0, S.shake - dt * 30);
      if (S.splatT > 0) { S.splatT -= dt; if (S.splatT <= 0) api.sfx("splat"); }
      S.flash = Math.max(0, S.flash - dt);
      if (S.state === "end") { S.endT += dt; if (S.endT > 2) finish(); }
    }

    /* ---------- drawing ---------- */
    function drawBackground() {
      const g = ctx;
      const sw = Math.max(34, W / 9);
      g.fillStyle = "#4b2d8f"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#5a3aa6";
      for (let x = -sw / 2; x < W + sw; x += sw * 2) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + sw, 0); g.lineTo(x + sw * 1.25, H); g.lineTo(x + sw * 0.25, H); g.closePath(); g.fill(); }
      const sp = g.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, Math.max(W, H) * 0.7);
      sp.addColorStop(0, "rgba(255,200,240,.28)"); sp.addColorStop(0.6, "rgba(255,200,240,0)"); sp.addColorStop(1, "rgba(20,8,40,.45)");
      g.fillStyle = sp; g.fillRect(0, 0, W, H);
      // bunting
      const top = 58, n = bunting.length, step = W / n;
      g.strokeStyle = INK; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(0, top); g.quadraticCurveTo(W / 2, top + 22, W, top); g.stroke();
      for (let i = 0; i < n; i++) {
        const x = step * (i + 0.5), u = x / W, y = top + 2 * u * (1 - u) * 22;
        g.save(); g.translate(x, y); g.rotate(Math.sin(S.t * 2 + i) * 0.06);
        g.beginPath(); g.moveTo(-step * 0.36, 0); g.lineTo(step * 0.36, 0); g.lineTo(0, 22); g.closePath();
        g.fillStyle = bunting[i]; g.fill(); g.lineWidth = 2.5; g.stroke(); g.restore();
      }
      // juice splats on the tent wall
      for (const s of S.splats) {
        const a = s.t < 3 ? 0.72 : 0.72 * (1 - (s.t - 3));
        const grow = Math.min(1, s.t * 10);
        g.save(); g.globalAlpha = Math.max(0, a); g.translate(s.x, s.y); g.rotate(s.rot); g.scale(grow, grow);
        g.fillStyle = s.col; g.beginPath();
        for (let i = 0; i <= 24; i++) { const an = (i / 24) * TAU, rr2 = s.r * (0.8 + 0.16 * Math.sin(i * 1.6 + s.seed) + 0.1 * Math.sin(i * 3.1 + s.seed * 2)); g.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2); }
        g.closePath(); g.fill();
        for (let i = 0; i < 5; i++) { const an = s.seed + i * 1.3; g.beginPath(); g.arc(Math.cos(an) * s.r * 1.3, Math.sin(an) * s.r * 1.3, s.r * 0.12, 0, TAU); g.fill(); }
        g.restore();
      }
    }
    function drawItem(it) {
      const g = ctx;
      g.save(); g.translate(it.x, it.y);
      const sq = it.sq;
      g.scale(1 - 0.18 * sq, 1 + 0.22 * sq);
      g.rotate(it.rot);
      if (it.type === "gold") { g.shadowColor = "#ffe066"; g.shadowBlur = 24; }
      if (it.type === "poop") drawPoop(g, it.r, S.t + it.x);
      else TYPES[it.type].draw(g, it.r, it);
      g.restore();
    }
    function drawHalf(h) {
      const g = ctx, it = h.it, def = TYPES[it.type], r = it.r;
      g.save(); g.translate(h.x, h.y); g.rotate(h.spin);
      g.rotate(h.ang);
      g.beginPath(); if (h.side < 0) g.rect(-r * 2, -r * 2, r * 4, r * 2); else g.rect(-r * 2, 0, r * 4, r * 2); g.clip();
      g.save(); g.rotate(-h.ang + it.rot); def.draw(g, r, it); g.restore();
      // the juicy cut face
      g.beginPath(); g.ellipse(0, 0, r * 0.88, r * 0.26, 0, 0, TAU); g.fillStyle = def.flesh; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      g.beginPath(); g.ellipse(0, 0, r * 0.55, r * 0.14, 0, 0, TAU); g.fillStyle = def.core; g.fill();
      if (def.seeds) { g.fillStyle = INK; for (const sx of [-0.5, -0.2, 0.15, 0.45]) { g.beginPath(); g.ellipse(sx * r, h.side * r * 0.08, r * 0.05, r * 0.035, 0, 0, TAU); g.fill(); } }
      g.restore();
    }
    function drawTrail() {
      const g = ctx, pts = S.trail, n = pts.length;
      if (n < 2) return;
      const now = performance.now();
      g.save(); g.lineCap = "round"; g.lineJoin = "round";
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < n; i++) {
          const a = pts[i - 1], b = pts[i];
          const life = 1 - (now - b.t) / 200;
          const w = Math.max(1, (pass ? 7 : 18) * life * (0.35 + 0.65 * (i / n)));
          g.strokeStyle = pass ? "rgba(255,255,255," + Math.min(1, life * 1.4) + ")" : "rgba(255,120,200," + life * 0.55 + ")";
          if (!pass && !RM) { g.shadowColor = "#ff8fc7"; g.shadowBlur = 18; }
          g.lineWidth = w;
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        }
        g.shadowBlur = 0;
      }
      g.restore();
    }
    function drawGuinea() {
      const g = ctx;
      const mood = S.sad > 0 ? "sad" : S.cheer > 0 ? "wow" : "happy";
      const img = gImg[mood];
      const gw = GS, gh = GS * 0.85;
      const target = S.state === "intro" || S.state === "over" ? 0.6 : S.cheer > 0 ? 1.02 : S.sad > 0 ? 0.48 : 0.64;
      S.peek = S.peek == null ? target : lerp(S.peek, target, Math.min(1, (1 / 60) * 10));
      const bob = Math.sin(S.t * 3) * 3 + (S.cheer > 0 ? Math.abs(Math.sin(S.t * 14)) * -8 : 0);
      const x = 4, y = H - gh * S.peek + bob;
      if (img.complete && img.naturalWidth) {
        g.save(); g.translate(x + gw / 2, y + gh); g.rotate(Math.sin(S.t * 2.2) * 0.05 + (S.cheer > 0 ? Math.sin(S.t * 16) * 0.06 : 0)); g.drawImage(img, -gw / 2, -gh, gw, gh); g.restore();
      }
      // little paws on the edge
      if (S.peek < 0.8) {
        g.fillStyle = "#ffc9b0"; g.strokeStyle = INK; g.lineWidth = 2.5;
        for (const px of [x + gw * 0.3, x + gw * 0.7]) { g.beginPath(); g.ellipse(px, H - 4, 9, 7, 0, Math.PI, TAU); g.fill(); g.stroke(); }
      }
      const b = S.bubble;
      if (b) {
        const a = b.t < 0.15 ? b.t / 0.15 : b.t > b.life - 0.3 ? (b.life - b.t) / 0.3 : 1;
        g.save(); g.globalAlpha = clamp(a, 0, 1);
        g.font = "17px " + FONT;
        const tw = g.measureText(b.text).width + 22, th = 34;
        const bx = Math.min(x + gw * 0.75, W - tw - 6), by = Math.max(70, y - th - 4);
        g.fillStyle = "#fff"; g.strokeStyle = INK; g.lineWidth = 3;
        rr(g, bx, by, tw, th, 14); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(bx + 10, by + th - 1); g.lineTo(bx - 4, by + th + 12); g.lineTo(bx + 24, by + th - 1); g.fill(); g.stroke();
        g.fillRect(bx + 9, by + th - 5, 16, 5);
        g.fillStyle = S.sad > 0 ? "#6b9a2e" : INK; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(b.text, bx + tw / 2, by + th / 2 + 1);
        g.restore();
      }
    }
    function drawBanner() {
      const b = S.banner; if (!b) return;
      const g = ctx, t = b.t;
      const s = t < 0.25 ? 0.4 + (t / 0.25) * 0.8 : t < 0.4 ? 1.2 - ((t - 0.25) / 0.15) * 0.2 : 1;
      const out = S.state === "play" && t > 1.4 ? 1 - (t - 1.4) / 0.3 : 1;
      g.save(); g.globalAlpha = clamp(out, 0, 1); g.translate(W / 2, H * 0.3); g.scale(s, s); g.rotate(Math.sin(t * 5) * 0.03);
      const size = Math.min(46, W * 0.9 / (b.text.length * 0.66 + 0.5));
      txt(g, b.text, 0, 0, size, b.col, Math.max(6, size * 0.22));
      if (b.sub) txt(g, b.sub, 0, size * 0.85, 17, "#fff", 5);
      g.restore();
    }
    function draw() {
      const g = ctx;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineJoin = "round"; g.lineCap = "round";
      g.save();
      if (S.shake > 0) g.translate(rnd(-S.shake, S.shake) * 0.6, rnd(-S.shake, S.shake) * 0.6);
      drawBackground();
      drawGuinea();
      for (const h of S.halves) drawHalf(h);
      for (const it of S.items) drawItem(it);
      for (const p of S.parts) {
        const a = 1 - p.t / p.life;
        g.globalAlpha = p.k === "gas" ? a * 0.7 : Math.min(1, a * 2);
        g.fillStyle = p.col;
        if (p.k === "star") star(g, p.x, p.y, p.r, p.rot);
        else if (p.k === "drop") { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
      }
      g.globalAlpha = 1;
      // missed X marks
      for (const x of S.xs) {
        const a = x.t > 1 ? 1 - (x.t - 1) / 0.4 : 1, s = x.t < 0.15 ? x.t / 0.15 * 1.3 : 1;
        g.save(); g.globalAlpha = a; g.translate(x.x, H - 40); g.scale(s, s); txt(g, "✖", 0, 0, 40, "#ff5a5f", 7); g.restore();
      }
      for (const f of S.floats) {
        const a = 1 - Math.max(0, (f.t - 0.7) / 0.3), s = f.t < 0.12 ? 0.5 + f.t / 0.12 * 0.6 : 1.1 - Math.min(0.1, f.t - 0.12);
        g.save(); g.globalAlpha = a; g.translate(f.x, f.y); g.scale(s, s); txt(g, f.text, 0, 0, f.size, f.col); g.restore();
      }
      g.restore();
      drawTrail();
      if (S.flash > 0) { g.fillStyle = "rgba(140,210,80," + Math.min(0.55, S.flash * 1.3) + ")"; g.fillRect(0, 0, W, H); }
      if (S.state === "end" || S.state === "over") { g.fillStyle = "rgba(43,22,64," + Math.min(0.3, (S.state === "over" ? 2 : S.endT) * 0.3) + ")"; g.fillRect(0, 0, W, H); }
      drawBanner();
    }

    /* ---------- loop & input ---------- */
    let raf = 0, last = 0, alive = true, down = false, pid = null, rect = null, lx = 0, ly = 0;
    function frame(t) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      let dt = last ? (t - last) / 1000 : 0; last = t;
      if (dt > 0.05) dt = 0.05;
      update(dt); draw();
    }
    function addPoint(x, y) {
      S.trail.push({ x, y, t: performance.now() });
      if (S.trail.length > 40) S.trail.shift();
    }
    function onDown(e) {
      e.preventDefault();
      if (S.state !== "play") return;
      down = true; pid = e.pointerId; rect = cv.getBoundingClientRect();
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      lx = e.clientX - rect.left; ly = e.clientY - rect.top;
      S.trail.length = 0; addPoint(lx, ly);
    }
    function onMove(e) {
      if (!down || e.pointerId !== pid || S.state !== "play") return;
      e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      const list = evs && evs.length ? evs : [e];
      for (const ev of list) {
        const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
        trySlice(lx, ly, x, y);
        lx = x; ly = y; addPoint(x, y);
        if (S.state !== "play") break;
      }
    }
    function onUp(e) {
      if (e.pointerId !== pid) return;
      down = false; pid = null;
      if (S.state === "play") flushGroup();
    }
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    resize();
    reset();
    showPanel(null);
    raf = requestAnimationFrame(frame);
    wrap._vs = S; // test hook

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointermove", onMove);
        cv.removeEventListener("pointerup", onUp);
        cv.removeEventListener("pointercancel", onUp);
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Veggie Slice", icon: "🔪", place: "carnival", kind: "skill",
    blurb: "Swipe to slice flying veggies. Don't slice the poop!",
    mount,
  });
})();
