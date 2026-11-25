/* Squishy Match — Wheek World arcade memory game (skill, free).
   Level 1: 4x4 (7 pairs + Wild Slime + Fart Card). Level 2: 4x5 (9 pairs + Wild Slime + Fart Card).
   Wild Slime matches anything (and slurps up that card's twin too). The Fart Card reshuffles every
   face-down card when flipped. Fewer moves = more coins: level 1 pays up to 80 + 20 speed bonus,
   level 2 up to 100 + 20 speed bonus, min 10 each, round capped at 200. One api.award at the end.
*/
(function () {
  "use strict";
  /* ---------- squishy art (canvas) ---------- */
  const KINDS = {
    mochi:      { name: "Mochi",      body: "#fff6fa", shade: "#ffc6de", val: 12, rar: "common" },
    cloud:      { name: "Cloud",      body: "#f6fcff", shade: "#a9dcff", val: 13, rar: "common" },
    toast:      { name: "Toast",      body: "#ffe2a6", shade: "#f0b765", crust: "#c27a35", val: 14, rar: "common" },
    strawberry: { name: "Strawberry", body: "#ff6b86", shade: "#e0345a", val: 16, rar: "common" },
    peach:      { name: "Peach",      body: "#ffc49a", shade: "#ff8a86", val: 17, rar: "common" },
    cat:        { name: "Kitty",      body: "#d6c6ff", shade: "#9f86ef", val: 18, rar: "common" },
    frog:       { name: "Froggy",     body: "#9cec74", shade: "#4fb534", val: 20, rar: "common" },
    golden:     { name: "Golden",     body: "#ffe680", shade: "#f2a900", val: 60, rar: "rare" },
    galaxy:     { name: "Galaxy",     body: "#6b45c9", shade: "#241056", val: 150, rar: "galaxy" },
    rainbow:    { name: "Rainbow",    body: "#ffffff", shade: "#ffffff", val: 400, rar: "rainbow" },
  };
  const INK = "#2b1640";

  function blobPath(c, r) {
    c.moveTo(-0.95 * r, 0.5 * r);
    c.bezierCurveTo(-1.1 * r, -0.5 * r, -0.55 * r, -0.95 * r, 0, -0.95 * r);
    c.bezierCurveTo(0.55 * r, -0.95 * r, 1.1 * r, -0.5 * r, 0.95 * r, 0.5 * r);
    c.bezierCurveTo(0.85 * r, 0.95 * r, -0.85 * r, 0.95 * r, -0.95 * r, 0.5 * r);
    c.closePath();
  }
  function shapeParts(kind, r) {
    const P = [];
    const circ = (x, y, rr) => (c) => { c.moveTo(x * r + rr * r, y * r); c.arc(x * r, y * r, rr * r, 0, Math.PI * 2); };
    switch (kind) {
      case "cloud":
        [[-0.55, 0.2, 0.48], [0, -0.22, 0.62], [0.56, 0.16, 0.5], [0.24, 0.45, 0.44], [-0.26, 0.47, 0.44], [-0.4, -0.25, 0.4]].forEach((a) => P.push(circ(...a)));
        break;
      case "toast":
        P.push((c) => {
          c.moveTo(-0.8 * r, 0.82 * r); c.lineTo(-0.82 * r, -0.2 * r);
          c.bezierCurveTo(-1.12 * r, -0.98 * r, -0.2 * r, -1.08 * r, 0, -0.72 * r);
          c.bezierCurveTo(0.2 * r, -1.08 * r, 1.12 * r, -0.98 * r, 0.82 * r, -0.2 * r);
          c.lineTo(0.8 * r, 0.82 * r); c.quadraticCurveTo(0.8 * r, 0.92 * r, 0.65 * r, 0.92 * r);
          c.lineTo(-0.65 * r, 0.92 * r); c.quadraticCurveTo(-0.8 * r, 0.92 * r, -0.8 * r, 0.82 * r); c.closePath();
        });
        break;
      case "strawberry":
        P.push((c) => {
          c.moveTo(0, 0.95 * r);
          c.bezierCurveTo(-0.75 * r, 0.75 * r, -1.08 * r, 0.05 * r, -0.95 * r, -0.38 * r);
          c.bezierCurveTo(-0.82 * r, -0.9 * r, -0.2 * r, -0.86 * r, 0, -0.66 * r);
          c.bezierCurveTo(0.2 * r, -0.86 * r, 0.82 * r, -0.9 * r, 0.95 * r, -0.38 * r);
          c.bezierCurveTo(1.08 * r, 0.05 * r, 0.75 * r, 0.75 * r, 0, 0.95 * r); c.closePath();
        });
        break;
      case "peach":
        P.push((c) => {
          c.moveTo(0, -0.68 * r);
          c.bezierCurveTo(-0.5 * r, -1.05 * r, -1.05 * r, -0.62 * r, -0.97 * r, 0.05 * r);
          c.bezierCurveTo(-0.92 * r, 0.75 * r, -0.4 * r, 0.95 * r, 0, 0.93 * r);
          c.bezierCurveTo(0.4 * r, 0.95 * r, 0.92 * r, 0.75 * r, 0.97 * r, 0.05 * r);
          c.bezierCurveTo(1.05 * r, -0.62 * r, 0.5 * r, -1.05 * r, 0, -0.68 * r); c.closePath();
        });
        break;
      case "cat":
        P.push((c) => { c.moveTo(-0.85 * r, -0.35 * r); c.lineTo(-0.72 * r, -1.12 * r); c.lineTo(-0.18 * r, -0.78 * r); c.closePath(); });
        P.push((c) => { c.moveTo(0.85 * r, -0.35 * r); c.lineTo(0.72 * r, -1.12 * r); c.lineTo(0.18 * r, -0.78 * r); c.closePath(); });
        P.push((c) => blobPath(c, r));
        break;
      case "frog":
        P.push(circ(-0.46, -0.72, 0.33)); P.push(circ(0.46, -0.72, 0.33));
        P.push((c) => { c.save(); c.scale(1.06, 0.95); blobPath(c, r); c.restore(); });
        break;
      default:
        P.push((c) => blobPath(c, r));
    }
    return P;
  }
  function bodyFill(c, kind, r) {
    const k = KINDS[kind];
    if (kind === "rainbow") {
      const g = c.createLinearGradient(-r, -r, r, r);
      ["#ff6b86", "#ffb347", "#ffe45c", "#8fe36a", "#5fd3ff", "#b48cff"].forEach((col, i, a) => g.addColorStop(i / (a.length - 1), col));
      return g;
    }
    const g = c.createRadialGradient(-0.3 * r, -0.45 * r, r * 0.1, 0, 0, r * 1.15);
    g.addColorStop(0, kind === "galaxy" ? "#8c6af0" : "#ffffff");
    g.addColorStop(0.35, k.body);
    g.addColorStop(1, k.shade);
    return g;
  }
  function drawSquishy(c, kind, r, mood) {
    mood = mood || "happy";
    const lw = Math.max(2.2, r * 0.1);
    const parts = shapeParts(kind, r);
    c.save();
    c.lineJoin = "round"; c.lineCap = "round";
    // union outline: thick ink stroke of every part, then fill all parts
    c.beginPath(); parts.forEach((p) => p(c));
    c.strokeStyle = INK; c.lineWidth = lw * 2; c.stroke();
    c.fillStyle = kind === "toast" ? KINDS.toast.crust : bodyFill(c, kind, r);
    c.beginPath(); parts.forEach((p) => p(c)); c.fill();
    if (kind === "toast") {
      c.save(); c.scale(0.8, 0.8); c.translate(0, 0.04 * r);
      c.beginPath(); parts.forEach((p) => p(c)); c.fillStyle = bodyFill(c, kind, r); c.fill(); c.restore();
    }
    // decorations
    c.save(); c.beginPath(); parts.forEach((p) => p(c)); c.clip();
    if (kind === "strawberry") {
      c.fillStyle = "#ffe98a";
      [[-0.5, -0.1], [0.5, -0.1], [-0.2, 0.55], [0.25, 0.6], [-0.65, 0.3], [0.65, 0.3], [0, -0.35]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x * r, y * r, r * 0.05, r * 0.08, 0, 0, 7); c.fill(); });
    }
    if (kind === "galaxy") {
      c.fillStyle = "rgba(255,120,220,.35)"; c.beginPath(); c.ellipse(0.2 * r, 0.3 * r, r * 0.7, r * 0.25, -0.5, 0, 7); c.fill();
      c.fillStyle = "#fff";
      [[-0.6, -0.4, 0.06], [0.5, -0.55, 0.05], [0.7, 0.2, 0.04], [-0.35, 0.6, 0.05], [0.1, -0.7, 0.035], [-0.75, 0.15, 0.035], [0.4, 0.62, 0.04]].forEach(([x, y, s]) => { c.beginPath(); c.arc(x * r, y * r, s * r, 0, 7); c.fill(); });
    }
    if (kind === "peach") {
      c.strokeStyle = "rgba(220,90,90,.55)"; c.lineWidth = lw * 0.8;
      c.beginPath(); c.moveTo(0.05 * r, -0.65 * r); c.quadraticCurveTo(0.45 * r, -0.1 * r, 0.25 * r, 0.5 * r); c.stroke();
    }
    if (kind === "cat") {
      c.fillStyle = "#ffb3d6";
      c.beginPath(); c.moveTo(-0.7 * r, -0.5 * r); c.lineTo(-0.64 * r, -0.92 * r); c.lineTo(-0.36 * r, -0.72 * r); c.fill();
      c.beginPath(); c.moveTo(0.7 * r, -0.5 * r); c.lineTo(0.64 * r, -0.92 * r); c.lineTo(0.36 * r, -0.72 * r); c.fill();
    }
    // gloss
    c.fillStyle = "rgba(255,255,255,.65)";
    c.beginPath(); c.ellipse(-0.42 * r, -0.48 * r, r * 0.22, r * 0.12, -0.6, 0, 7); c.fill();
    c.beginPath(); c.arc(-0.12 * r, -0.66 * r, r * 0.05, 0, 7); c.fill();
    c.restore();
    // strawberry leaves / peach leaf / crown
    if (kind === "strawberry") {
      c.fillStyle = "#5cc94a"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath();
      for (let i = 0; i < 5; i++) { const a = Math.PI + (i / 4) * Math.PI; c.lineTo(Math.cos(a) * r * 0.42, -0.72 * r + Math.sin(a) * r * 0.28); c.lineTo(Math.cos(a + 0.35) * r * 0.15, -0.72 * r + Math.sin(a + 0.35) * r * 0.1); }
      c.closePath(); c.fill(); c.stroke();
    }
    if (kind === "peach") {
      c.fillStyle = "#6fd35a"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath(); c.ellipse(0.25 * r, -0.92 * r, r * 0.28, r * 0.13, -0.5, 0, 7); c.fill(); c.stroke();
    }
    if (kind === "golden") {
      c.fillStyle = "#ffd84d"; c.strokeStyle = INK; c.lineWidth = lw * 0.8;
      c.beginPath(); c.moveTo(-0.38 * r, -0.82 * r); c.lineTo(-0.42 * r, -1.22 * r); c.lineTo(-0.18 * r, -1.0 * r); c.lineTo(0, -1.3 * r); c.lineTo(0.18 * r, -1.0 * r); c.lineTo(0.42 * r, -1.22 * r); c.lineTo(0.38 * r, -0.82 * r); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#ff5a8a"; c.beginPath(); c.arc(0, -1.02 * r, r * 0.07, 0, 7); c.fill();
    }
    // face
    const fy = kind === "frog" ? -0.72 : kind === "toast" ? 0.02 : kind === "strawberry" ? -0.05 : 0.0;
    const ex = 0.33 * r;
    c.fillStyle = INK; c.strokeStyle = INK;
    const dark = kind === "galaxy";
    if (mood === "joy") {
      c.lineWidth = lw * 0.9;
      [-1, 1].forEach((s) => { c.beginPath(); c.moveTo(s * (kind === "frog" ? 0.46 * r : ex) - 0.11 * r, fy * r + 0.05 * r); c.lineTo(s * (kind === "frog" ? 0.46 * r : ex), fy * r - 0.06 * r); c.lineTo(s * (kind === "frog" ? 0.46 * r : ex) + 0.11 * r, fy * r + 0.05 * r); c.strokeStyle = dark ? "#fff" : INK; c.stroke(); });
    } else {
      [-1, 1].forEach((s) => {
        const x = s * (kind === "frog" ? 0.46 * r : ex), y = fy * r;
        c.fillStyle = dark ? "#fff" : INK;
        c.beginPath(); c.ellipse(x, y, r * 0.11, r * (mood === "wow" ? 0.15 : 0.13), 0, 0, 7); c.fill();
        c.fillStyle = dark ? INK : "#fff";
        c.beginPath(); c.arc(x - r * 0.035, y - r * 0.05, r * 0.045, 0, 7); c.fill();
        if (mood === "sad") {
          c.strokeStyle = dark ? "#fff" : INK; c.lineWidth = lw * 0.7;
          c.beginPath(); c.moveTo(x - s * r * 0.14, y - r * 0.27); c.lineTo(x + s * r * 0.1, y - r * 0.2); c.stroke();
        }
      });
    }
    // mouth
    const my = (kind === "frog" ? -0.25 : fy + 0.24) * r;
    c.strokeStyle = dark ? "#fff" : INK; c.lineWidth = lw * 0.75;
    c.beginPath();
    if (mood === "wow") { c.fillStyle = "#c2185b"; c.ellipse(0, my + 0.03 * r, r * 0.07, r * 0.1, 0, 0, 7); c.fill(); c.stroke(); }
    else if (mood === "sad") { c.arc(0, my + 0.12 * r, r * 0.1, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    else { c.moveTo(-0.13 * r, my); c.quadraticCurveTo(-0.065 * r, my + 0.1 * r, 0, my); c.quadraticCurveTo(0.065 * r, my + 0.1 * r, 0.13 * r, my); c.stroke(); }
    // blush
    c.fillStyle = "rgba(255,90,140,.38)";
    const by = (kind === "frog" ? -0.38 : fy + 0.16) * r;
    c.beginPath(); c.ellipse(-0.58 * r, by, r * 0.13, r * 0.075, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(0.58 * r, by, r * 0.13, r * 0.075, 0, 0, 7); c.fill();
    c.restore();
  }
  function squishyCanvas(kind, px, mood) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas");
    cv.width = cv.height = Math.round(px * dpr); cv.style.width = cv.style.height = px + "px";
    const c = cv.getContext("2d"); c.scale(dpr, dpr); c.translate(px / 2, px / 2 + px * 0.04);
    drawSquishy(c, kind, px * 0.34, mood);
    return cv;
  }


  const CSS = `
  .g-match{position:absolute;inset:0;overflow:hidden;font-family:var(--body);color:var(--ink);touch-action:none;
    background:radial-gradient(circle at 50% 30%,#fff3fb 0,#ffd3ec 40%,#c7b3ff 100%)}
  .g-match .dots{position:absolute;inset:0;background:radial-gradient(rgba(255,255,255,.55) 3px,transparent 3.5px) 0 0/28px 28px;pointer-events:none}
  .g-match .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;justify-content:space-between;align-items:center;z-index:4;pointer-events:none}
  .g-match .pill{background:#fff;border:3px solid var(--ink);border-radius:999px;padding:4px 10px;font-family:var(--display);font-size:16px;box-shadow:0 3px 0 var(--ink);white-space:nowrap}
  .g-match .pill.lv{background:var(--lilac)}
  .g-match .pill.earn{background:var(--yellow)}
  .g-match .pill.bump{animation:gmt-bump .35s cubic-bezier(.2,1.8,.4,1)}
  .g-match .board{position:absolute;display:grid;gap:8px}
  .g-match .card{position:relative;perspective:700px;cursor:pointer;touch-action:manipulation}
  .g-match .inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.3,1.5,.5,1)}
  .g-match .card.up .inner{transform:rotateY(180deg)}
  .g-match .face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border:4px solid var(--ink);border-radius:16px;box-shadow:0 5px 0 var(--ink);display:flex;align-items:center;justify-content:center;overflow:hidden}
  .g-match .back{background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.5) 0 10%,transparent 11%),repeating-linear-gradient(45deg,#b59cff 0 10px,#a48af5 10px 20px)}
  .g-match .back:before{content:"";position:absolute;left:-4px;right:-4px;top:-4px;height:30%;background:radial-gradient(circle at 20% 100%,#7be04a 0 9px,transparent 10px),radial-gradient(circle at 62% 100%,#7be04a 0 12px,transparent 13px),#7be04a;border-bottom:3px solid var(--ink);border-radius:0 0 45% 55%/0 0 40% 60%}
  .g-match .back b{font-family:var(--display);font-size:34px;color:#fff;-webkit-text-stroke:2px var(--ink);text-shadow:0 3px 0 var(--ink);position:relative;top:8%}
  .g-match .front{transform:rotateY(180deg);background:#fffdf8}
  .g-match .front.wild{background:radial-gradient(circle,#eaffd5,#b8f08f)}
  .g-match .front.fart{background:radial-gradient(circle,#f3ffd6,#c9ef8a)}
  .g-match .front .tag{position:absolute;bottom:4px;left:0;right:0;text-align:center;font-family:var(--display);font-size:12px;letter-spacing:.3px}
  .g-match .card.gone{pointer-events:none}
  .g-match .card.gone{animation:gmt-gone .55s cubic-bezier(.3,1.6,.5,1) forwards}
  .g-match .card.wrong .inner{animation:gmt-shake .4s}
  .g-match .card.peek .inner{transform:rotateY(180deg)}
  .g-match .spark{position:absolute;width:14px;height:14px;border-radius:50%;border:2.5px solid var(--ink);pointer-events:none;z-index:6}
  .g-match .combo{white-space:pre-line;position:absolute;left:0;right:0;text-align:center;z-index:7;font-family:var(--display);font-size:36px;line-height:1.1;padding:0 12px;color:#fff;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);pointer-events:none;animation:gmt-big 1.3s ease-out both}
  .g-match .gas{position:absolute;inset:0;z-index:8;pointer-events:none}
  .g-match .gas b{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e3ffb0,#9ad65a 55%,#5ea832);border:4px solid #2f7d14}
  .g-match .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;z-index:9;background:rgba(43,22,64,.35)}
  .g-match .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 8px 0 var(--ink);padding:16px 16px 18px;max-width:360px;width:100%;text-align:center;animation:gmt-pop .45s cubic-bezier(.2,1.6,.4,1)}
  .g-match .panel h2{font-size:32px;color:var(--pink-deep);-webkit-text-stroke:1.2px var(--ink);text-shadow:0 3px 0 var(--ink);margin-bottom:4px}
  .g-match .panel p{margin:6px 0 10px;font-size:15px;line-height:1.3}
  .g-match .specials{display:flex;gap:12px;justify-content:center;margin:6px 0 12px}
  .g-match .specials div{display:flex;flex-direction:column;align-items:center;font-size:13px;font-weight:900;width:110px;line-height:1.15}
  .g-match .big{font-family:var(--display);font-size:42px;color:#ffd84d;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);margin:4px 0}
  .g-match .go{width:100%;font-size:22px;min-height:56px;margin-top:6px}
  @keyframes gmt-gone{0%{transform:scale(1)}35%{transform:scale(1.18,.86)}60%{transform:scale(.9,1.1)}99%{transform:scale(.05);visibility:visible}100%{transform:scale(0);visibility:hidden}}
  @keyframes gmt-shake{0%,100%{transform:rotateY(180deg) translateX(0)}25%{transform:rotateY(180deg) translateX(-6px) rotate(-3deg)}75%{transform:rotateY(180deg) translateX(6px) rotate(3deg)}}
  @keyframes gmt-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes gmt-bump{0%{transform:scale(1.35)}100%{transform:scale(1)}}
  @keyframes gmt-big{0%{transform:scale(.2);opacity:0}20%{transform:scale(1.15);opacity:1}35%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-40px)}}
  `;
  const LEVELS = [{ cols: 4, rows: 4, pairs: 7, base: 80 }, { cols: 4, rows: 5, pairs: 9, base: 100 }];
  const PAIR_KINDS = ["mochi", "cloud", "toast", "strawberry", "peach", "cat", "frog", "golden", "galaxy", "rainbow"];
  const COLORS = { mochi: "#ffc6de", cloud: "#a9dcff", toast: "#f0b765", strawberry: "#ff6b86", peach: "#ff8a86", cat: "#b9a5ff", frog: "#7be04a", golden: "#ffd84d", galaxy: "#6b45c9", rainbow: "#5fd3ff" };

  function wildCanvas(px) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas"); cv.width = cv.height = Math.round(px * dpr); cv.style.width = cv.style.height = px + "px";
    const c = cv.getContext("2d"); c.scale(dpr, dpr); c.translate(px / 2, px / 2);
    const r = px * 0.34;
    c.lineJoin = "round";
    const path = () => {
      c.beginPath(); c.moveTo(-r, 0.1 * r);
      c.bezierCurveTo(-r, -0.9 * r, r, -0.9 * r, r, 0.1 * r);
      c.lineTo(r, 0.55 * r); c.quadraticCurveTo(0.85 * r, 0.95 * r, 0.7 * r, 0.55 * r); c.quadraticCurveTo(0.5 * r, 1.15 * r, 0.3 * r, 0.6 * r);
      c.quadraticCurveTo(0.05 * r, 0.9 * r, -0.15 * r, 0.6 * r); c.quadraticCurveTo(-0.45 * r, 1.2 * r, -0.6 * r, 0.6 * r); c.quadraticCurveTo(-0.85 * r, 0.85 * r, -r, 0.55 * r); c.closePath();
    };
    path(); c.lineWidth = r * 0.2; c.strokeStyle = INK; c.stroke();
    const g = c.createRadialGradient(-0.3 * r, -0.4 * r, 2, 0, 0, r * 1.2); g.addColorStop(0, "#e6ffcf"); g.addColorStop(0.4, "#8fe36a"); g.addColorStop(1, "#3fa42a");
    path(); c.fillStyle = g; c.fill();
    c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.ellipse(-0.45 * r, -0.4 * r, r * 0.2, r * 0.1, -0.6, 0, 7); c.fill();
    c.fillStyle = INK;
    [[-0.32, 0.18], [0.32, -0.02]].forEach(([x, s]) => { c.beginPath(); c.ellipse(x * r, -0.05 * r, r * (0.12 + s), r * (0.14 + s), 0, 0, 7); c.fill(); });
    c.fillStyle = "#fff"; c.beginPath(); c.arc(-0.36 * r, -0.12 * r, r * 0.07, 0, 7); c.arc(0.28 * r, -0.1 * r, r * 0.05, 0, 7); c.fill();
    c.strokeStyle = INK; c.lineWidth = r * 0.08; c.lineCap = "round"; c.beginPath(); c.arc(0, 0.2 * r, r * 0.2, 0.15, Math.PI - 0.15); c.stroke();
    c.fillStyle = "#ff7aa8"; c.beginPath(); c.ellipse(0.04 * r, 0.42 * r, r * 0.09, r * 0.12, 0, 0, 7); c.fill(); c.stroke();
    return cv;
  }
  function fartCanvas(px) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas"); cv.width = cv.height = Math.round(px * dpr); cv.style.width = cv.style.height = px + "px";
    const c = cv.getContext("2d"); c.scale(dpr, dpr); c.translate(px / 2, px / 2 + px * 0.02);
    const r = px * 0.32;
    const circles = [[-0.55, 0.2, 0.48], [0, -0.22, 0.62], [0.56, 0.16, 0.5], [0.24, 0.45, 0.44], [-0.26, 0.47, 0.44]];
    c.beginPath(); circles.forEach(([x, y, s]) => { c.moveTo(x * r + s * r, y * r); c.arc(x * r, y * r, s * r, 0, 7); });
    c.lineWidth = r * 0.2; c.strokeStyle = INK; c.stroke(); c.fillStyle = "#a6dc63"; c.fill();
    c.fillStyle = "rgba(255,255,255,.5)"; c.beginPath(); c.ellipse(-0.3 * r, -0.4 * r, r * 0.22, r * 0.1, -0.5, 0, 7); c.fill();
    c.strokeStyle = INK; c.lineWidth = r * 0.09; c.lineCap = "round";
    [-1, 1].forEach((s) => { c.beginPath(); c.moveTo(s * 0.42 * r, -0.05 * r); c.lineTo(s * 0.22 * r, 0.03 * r); c.lineTo(s * 0.42 * r, 0.11 * r); c.stroke(); });
    c.beginPath(); c.ellipse(0, 0.3 * r, r * 0.16, r * 0.12, 0, 0, 7); c.fillStyle = INK; c.fill();
    c.strokeStyle = "#5ea832"; c.lineWidth = r * 0.1;
    [-0.7, 0, 0.7].forEach((x) => { c.beginPath(); c.moveTo(x * r, -1.0 * r); c.quadraticCurveTo(x * r - 0.15 * r, -1.15 * r, x * r, -1.3 * r); c.stroke(); });
    return cv;
  }

  WW.registerGame({
    id: "squishy-match",
    name: "Squishy Match",
    icon: "🃏",
    place: "arcade",
    kind: "skill",
    blurb: "Flip cards, match squishies, beware the Fart Card!",
    mount(root, api) {
      const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = document.createElement("div");
      el.className = "g-match";
      el.innerHTML = `<style>${CSS}</style><div class="dots"></div>
        <div class="hud"><span class="pill lv">Level 1</span><span class="pill mv">Moves 0</span><span class="pill tm">⏱ 0:00</span><span class="pill earn">🪙 0</span></div>
        <div class="board"></div>`;
      root.appendChild(el);
      const $ = (s) => el.querySelector(s);
      const board = $(".board"), lvEl = $(".lv"), mvEl = $(".mv"), tmEl = $(".tm"), earnEl = $(".earn");
      let alive = true, raf = 0;
      const timers = new Set();
      const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); };
      let level = 0, cards = [], first = null, lock = true, moves = 0, combo = 0, earned = 0, levelStart = 0, elapsed = 0, running = false, cardW = 80, cardH = 100;
      const levelCoins = [];

      function bump(e) { e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }
      function setHud() {
        lvEl.textContent = "Level " + (level + 1);
        mvEl.textContent = "Moves " + moves;
        earnEl.textContent = "🪙 " + earned;
      }
      function layout() {
        const W = root.clientWidth || 390, H = root.clientHeight || 700;
        const L = LEVELS[level];
        const gap = W < 420 ? 8 : 12;
        const top = 58, availW = Math.min(W - 24, 520), availH = H - top - 14;
        cardW = Math.min((availW - gap * (L.cols - 1)) / L.cols, ((availH - gap * (L.rows - 1)) / L.rows) / 1.22);
        cardH = cardW * 1.22;
        const bw = cardW * L.cols + gap * (L.cols - 1), bh = cardH * L.rows + gap * (L.rows - 1);
        board.style.gap = gap + "px";
        board.style.gridTemplateColumns = `repeat(${L.cols},${cardW}px)`;
        board.style.gridAutoRows = cardH + "px";
        board.style.left = (W - bw) / 2 + "px"; board.style.top = top + Math.max(0, (availH - bh) / 2) + "px";
      }
      function makeCard(kind) {
        const d = document.createElement("div"); d.className = "card";
        const special = kind === "wild" || kind === "fart";
        d.innerHTML = `<div class="inner"><div class="face back"><b>?</b></div><div class="face front ${special ? kind : ""}"></div></div>`;
        const front = d.querySelector(".front");
        const px = Math.min(cardW, cardH) * 0.98;
        if (kind === "wild") { front.appendChild(wildCanvas(px)); front.insertAdjacentHTML("beforeend", `<span class="tag">WILD</span>`); }
        else if (kind === "fart") { front.appendChild(fartCanvas(px)); front.insertAdjacentHTML("beforeend", `<span class="tag">FART!</span>`); }
        else {
          front.style.background = `radial-gradient(circle at 50% 45%,#fff 0 40%,${COLORS[kind]}55 100%)`;
          front.appendChild(squishyCanvas(kind, px * 1.05));
        }
        const c = { el: d, kind, up: false, gone: false };
        d.addEventListener("click", () => flip(c));
        return c;
      }
      function startLevel() {
        const L = LEVELS[level];
        layout();
        const kinds = PAIR_KINDS.slice().sort(() => Math.random() - 0.5).slice(0, L.pairs);
        const deck = [];
        kinds.forEach((k) => deck.push(k, k));
        deck.push("wild", "fart");
        for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
        board.innerHTML = ""; cards = deck.map(makeCard);
        cards.forEach((c, i) => {
          board.appendChild(c.el);
          c.el.animate([{ transform: "translateY(-40px) scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 380, delay: i * 30, easing: "cubic-bezier(.2,1.6,.4,1)", fill: "backwards" });
        });
        moves = 0; combo = 0; first = null; setHud();
        lock = true;
        // quick peek!
        later(() => { cards.forEach((c) => c.el.classList.add("peek")); api.sfx("whoosh"); comboText("Peek!"); }, 700 + cards.length * 30);
        later(() => { cards.forEach((c) => c.el.classList.remove("peek")); api.sfx("whoosh"); lock = false; running = true; levelStart = performance.now(); elapsed = 0; }, 2200 + cards.length * 30);
      }
      function comboText(t, color) {
        const b = document.createElement("div"); b.className = "combo"; b.textContent = t;
        b.style.top = (root.clientHeight || 700) * 0.4 + "px";
        if (color) b.style.color = color;
        el.appendChild(b); later(() => b.remove(), 1350);
      }
      function sparks(c, color) {
        const r = c.el.getBoundingClientRect(), base = el.getBoundingClientRect();
        const cx = r.left - base.left + r.width / 2, cy = r.top - base.top + r.height / 2;
        for (let i = 0; i < 12; i++) {
          const s = document.createElement("span"); s.className = "spark";
          s.style.background = i % 3 ? color : "#fff";
          s.style.left = cx - 7 + "px"; s.style.top = cy - 7 + "px";
          el.appendChild(s);
          const a = (i / 12) * Math.PI * 2, d = 50 + Math.random() * 40;
          const an = s.animate([{ transform: "scale(1)" }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`, opacity: 0 }], { duration: 600, easing: "cubic-bezier(.2,.8,.4,1)" });
          an.onfinish = () => s.remove();
        }
      }
      function up(c) { c.up = true; c.el.classList.add("up"); }
      function down(c) { c.up = false; c.el.classList.remove("up"); }
      function pop(c, delay) {
        c.gone = true;
        later(() => { c.el.classList.add("gone"); sparks(c, COLORS[c.kind] || "#7be04a"); }, delay || 0);
      }
      function flip(c) {
        if (lock || c.up || c.gone) return;
        api.sfx("click"); api.haptic(10);
        up(c);
        if (c.kind === "fart") return fart(c);
        if (!first) { first = c; return; }
        const a = first, b = c; first = null; moves++; setHud(); bump(mvEl);
        const wild = a.kind === "wild" || b.kind === "wild";
        if (wild || a.kind === b.kind) {
          lock = true;
          combo++;
          later(() => {
            api.sfx("squish"); later(() => api.sfx("pop"), 120);
            pop(a); pop(b, 60);
            if (wild) {
              const other = a.kind === "wild" ? b : a;
              const twin = cards.find((x) => x !== other && x.kind === other.kind && !x.gone);
              if (twin) { up(twin); pop(twin, 450); later(() => api.sfx("nom"), 450); }
              comboText("WILD SLIME! Slurp!", "#9cec74");
            } else if (combo >= 2) { comboText("Combo x" + combo + "!", "#ffd84d"); api.sfx("sparkle"); }
            const r = b.el.getBoundingClientRect();
            api.floatText(r.left + r.width / 2, r.top, wild ? "SLURP!" : "Squish!", "#ff8fc7");
            later(() => { lock = false; checkDone(); }, wild ? 650 : 350);
          }, 380);
        } else {
          combo = 0; lock = true;
          later(() => { a.el.classList.add("wrong"); b.el.classList.add("wrong"); api.sfx("boop"); }, 450);
          later(() => { a.el.classList.remove("wrong"); b.el.classList.remove("wrong"); down(a); down(b); lock = false; }, 950);
        }
      }
      function fart(c) {
        lock = true; moves++; setHud(); combo = 0;
        const pending = first; first = null;
        later(() => {
          api.sfx("fart"); api.haptic(120);
          later(() => api.sfx("fart"), 260);
          const r = c.el.getBoundingClientRect();
          api.gas(r.left + r.width / 2, r.top + r.height / 2);
          comboText("PFFFRRRT!\nRESHUFFLE!", "#c9ff8a");
          gasCloud(c);
          if (!reduced) el.animate([0, 1, 2, 3, 4, 5, 6].map((i) => ({ transform: i === 6 ? "none" : `translate(${(Math.random() - 0.5) * 18}px,${(Math.random() - 0.5) * 18}px)` })), { duration: 500 });
          if (pending) down(pending);
          pop(c, 300);
        }, 450);
        later(() => reshuffle(), 1100);
        later(() => { lock = false; checkDone(); }, 1900);
      }
      function gasCloud(c) {
        const g = document.createElement("div"); g.className = "gas";
        const r = c.el.getBoundingClientRect(), base = el.getBoundingClientRect();
        const cx = r.left - base.left + r.width / 2, cy = r.top - base.top + r.height / 2;
        const W = root.clientWidth || 390, H = root.clientHeight || 700;
        for (let i = 0; i < 18; i++) {
          const b = document.createElement("b");
          const s = 100 + Math.random() * 170, a = Math.random() * 7, d = 30 + Math.random() * Math.max(W, H) * 0.42;
          b.style.width = b.style.height = s + "px";
          b.style.left = cx + Math.cos(a) * d - s / 2 + "px"; b.style.top = cy + Math.sin(a) * d - s / 2 + "px";
          b.animate([{ transform: "scale(.1)", opacity: 0 }, { transform: "scale(1)", opacity: 0.85, offset: 0.3 }, { transform: "scale(1.3)", opacity: 0 }], { duration: 1500 + Math.random() * 500, delay: i * 35, easing: "ease-out", fill: "both" });
          g.appendChild(b);
        }
        el.appendChild(g); later(() => g.remove(), 2300);
      }
      function reshuffle() {
        // FLIP-animate all face-down cards into new random slots
        const movable = cards.filter((c) => !c.gone && !c.up);
        const before = new Map(movable.map((c) => [c, c.el.getBoundingClientRect()]));
        const slots = movable.map((c) => Array.prototype.indexOf.call(board.children, c.el));
        const shuffled = movable.slice();
        for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
        const order = Array.prototype.slice.call(board.children);
        slots.forEach((s, i) => { order[s] = shuffled[i].el; });
        order.forEach((n) => board.appendChild(n));
        api.sfx("whoosh");
        movable.forEach((c) => {
          const a = before.get(c), b = c.el.getBoundingClientRect();
          const dx = a.left - b.left, dy = a.top - b.top;
          c.el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: `translate(${dx / 2}px,${dy / 2 - 40}px) rotate(${(Math.random() - 0.5) * 40}deg) scale(1.08)` }, { transform: "none" }], { duration: 650, easing: "ease-in-out" });
        });
      }
      function checkDone() {
        if (cards.some((c) => !c.gone && c.kind !== "wild" && c.kind !== "fart")) return;
        if (!running) return;
        running = false; lock = true;
        cards.filter((c) => !c.gone).forEach((c, i) => { up(c); pop(c, 300 + i * 150); });
        const L = LEVELS[level];
        const secs = Math.round(elapsed);
        const extra = Math.max(0, moves - L.pairs);
        const moveCoins = Math.max(10, Math.round(L.base - 4 * extra));
        const speed = Math.max(0, Math.min(20, Math.round(20 - (secs - (level ? 30 : 20)) * 0.5)));
        let gain = moveCoins + speed;
        gain = Math.min(gain, 200 - earned);
        earned += gain; levelCoins.push(gain); setHud(); bump(earnEl);
        api.sfx("win");
        const r = board.getBoundingClientRect();
        api.confetti(r.left + r.width / 2, r.top + r.height / 2, 60);
        later(() => {
          const last = level === LEVELS.length - 1;
          const o = overlay(`<h2>${last ? "All matched!" : "Level clear!"}</h2>
            <p>${moves} moves · ${secs}s</p><div class="big">+${gain}🪙</div>
            <p style="font-size:13px">${moveCoins}🪙 for moves${speed ? ` + ${speed}🪙 speed bonus` : ""}</p>
            <button class="btn green go">${last ? "Collect!" : "Level 2 →"}</button>`);
          o.querySelector(".go").onclick = () => {
            o.remove();
            if (last) finish();
            else { level++; startLevel(); }
          };
        }, 900);
      }
      function finish() {
        const got = earned > 0 ? api.award(earned, { reason: "Squishy Match" }) : 0;
        const hs = api.highscore("squishy-match", earned);
        api.sfx(earned >= 120 ? "bigwin" : "fanfare");
        const r = el.getBoundingClientRect();
        api.confetti(r.left + r.width / 2, r.top + r.height * 0.4, 120);
        api.done({ earned: got, title: earned >= 150 ? "Squish master!" : "Squishy Match!", text: `Level 1: ${levelCoins[0]}🪙 · Level 2: ${levelCoins[1]}🪙${hs.isNew ? " · New best!" : ""}`, score: earned });
      }
      function overlay(html) {
        const o = document.createElement("div"); o.className = "overlay";
        o.innerHTML = `<div class="panel">${html}</div>`; el.appendChild(o); return o;
      }
      function intro() {
        const o = overlay(`<h2>Squishy Match</h2><p>Flip two cards. Find matching squishies! Fewer moves = more coins.</p>
          <div class="specials"><div class="sw"></div><div class="sf"></div></div>
          <button class="btn green go">Start! (free)</button>`);
        const sw = o.querySelector(".sw"), sf = o.querySelector(".sf");
        sw.appendChild(wildCanvas(70)); sw.insertAdjacentHTML("beforeend", "<span>Wild Slime matches anything!</span>");
        sf.appendChild(fartCanvas(70)); sf.insertAdjacentHTML("beforeend", "<span>Fart Card shuffles the cards!</span>");
        o.querySelector(".go").onclick = () => { o.remove(); api.sfx("click"); startLevel(); };
      }
      function frame(now) {
        if (!alive) return;
        if (running) {
          elapsed = (now - levelStart) / 1000;
          const s = Math.floor(elapsed);
          const t = "⏱ " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
          if (tmEl.textContent !== t) tmEl.textContent = t;
        }
        raf = requestAnimationFrame(frame);
      }
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      layout();
      setHud();
      intro();
      raf = requestAnimationFrame(frame);
      el._match = { cards: () => cards, lock: () => lock };

      return {
        destroy() {
          alive = false;
          cancelAnimationFrame(raf);
          timers.forEach((t) => clearTimeout(t)); timers.clear();
          window.removeEventListener("resize", onResize);
          el.remove();
        },
      };
    },
  });
})();
