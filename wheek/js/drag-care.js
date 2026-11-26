/* Wheek World: hands-on care. Drag food or medicine to your guinea's mouth, drag the comb
   through messy fur (tufts come out one by one), drag the sponge to scrub up a bubble bath. */
"use strict";
let DRAG = null;
const PILLS = ["gummies", "vitc", "youth"];

function dragKind(id) {
  if (id === "comb") return "comb";
  if (id === "soap") return "sponge";
  if (PILLS.includes(id)) return "pill";
  return ITEM[id] && ITEM[id].cat === "food" ? "food" : null;
}
function trayDragStart(e, id, btn) {
  const kind = dragKind(id); if (!kind || !PA.el || DRAG) return;
  e.preventDefault(); getAC(); wake();
  const g = activeG();
  const html = kind === "comb" ? `<span class="ii">🪮</span>` : kind === "sponge" ? `<span class="ii">🧽</span>` : itemIcon(id);
  const ghost = document.createElement("div"); ghost.className = "drag-ghost k-" + kind; ghost.innerHTML = html;
  document.body.appendChild(ghost);
  DRAG = { id, kind, g, ghost, btn, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, moved: 0, near: false, suds: [], combed: 0, strokes: 0, acc: 0, smooth: false };
  PA.busy = true;
  btn.classList.add("dragging");
  try { btn.setPointerCapture(e.pointerId); } catch {}
  btn.addEventListener("pointermove", dragMove); btn.addEventListener("pointerup", dragEnd); btn.addEventListener("pointercancel", dragEnd);
  moveGhost(e.clientX, e.clientY);
}
function ghostPt() { return [DRAG.x, DRAG.y - (DRAG.kind === "food" || DRAG.kind === "pill" ? 46 : 30)]; }
function moveGhost(x, y) {
  DRAG.x = x; DRAG.y = y;
  const [gx, gy] = ghostPt();
  DRAG.ghost.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%) rotate(${DRAG.kind === "comb" ? -25 + Math.sin(DRAG.moved / 20) * 12 : 0}deg) scale(${DRAG.near ? 1.15 : 1})`;
}
function overBody(x, y) { const s = petSvg(); if (!s) return false; const r = s.getBoundingClientRect(); return x > r.left + r.width * .08 && x < r.right - r.width * .08 && y > r.top + r.height * .12 && y < r.bottom - r.height * .08; }
function lookAt(x) { const s = petSvg(); if (!s) return; const r = s.getBoundingClientRect(); const c = r.left + r.width / 2; s.classList.toggle("look-l", x < c - r.width * .2); s.classList.toggle("look-r", x > c + r.width * .2); }

function dragMove(e) {
  if (!DRAG) return;
  const d = Math.hypot(e.clientX - DRAG.x, e.clientY - DRAG.y); DRAG.moved += d;
  moveGhost(e.clientX, e.clientY);
  const [gx, gy] = ghostPt(), g = DRAG.g, s = petSvg(); if (!s) return;
  if (DRAG.kind === "food" || DRAG.kind === "pill") {
    lookAt(gx);
    const [mx, my] = mouthVP(), w = s.getBoundingClientRect().width;
    const near = Math.hypot(gx - mx, gy - my) < w * .24;
    if (near !== DRAG.near) { DRAG.near = near; s.classList.toggle("eager", near); if (near) { play("boop"); haptic(8); } }
  } else if (DRAG.kind === "comb") {
    if (!overBody(gx, gy)) { s.classList.remove("petting"); return; }
    s.classList.add("petting");
    const r = s.getBoundingClientRect(); s.style.setProperty("--tilt", clamp((gx - (r.left + r.width / 2)) / r.width * 12, -7, 7) + "deg");
    // pull out any tuft the comb teeth pass over
    $$(".tuft", s).forEach(t => { if (t._gone) return; const tr = t.getBoundingClientRect(); const tx = tr.left + tr.width / 2, ty = tr.top + tr.height / 2; if (Math.hypot(gx - tx, gy - ty) < r.width * .11) combTuft(t, tx, ty); });
    DRAG.acc += d;
    if (DRAG.acc > 70) { DRAG.acc = 0; DRAG.strokes++; play("comb"); bits("dot", gx, gy, 2, { c: ["#fff", "#fff3a8"], v: .8, up: 1, g: -.02, s: 2.5, life: 40 }); g.joy = clamp(g.joy + .6, 0, 100); if (!tuftCount(g) && !DRAG.smooth) { DRAG.smooth = true; say(pick(["Ahh, I'm already silky smooth!", "Mmm, comb comb comb...", "So relaxing..."])); } }
  } else if (DRAG.kind === "sponge") {
    if (!overBody(gx, gy)) return;
    s.classList.add("happy-eyes");
    DRAG.acc += d;
    if (DRAG.acc > 34 && DRAG.suds.length < 14) {
      DRAG.acc = 0;
      if (!DRAG.suds.length && !has("soap")) { play("buzz"); toast("No Bubble Bath left! Buy some at Squeakmart.", "🧼"); return dragEnd(); }
      const [rx, ry] = toRoom([gx + (Math.random() - .5) * 24, gy + (Math.random() - .5) * 20]);
      const sud = prop(`<span class="suds"></span>`, [rx, ry], 18 + Math.random() * 22); sud.style.transform = T(rx, ry, "scale(0)");
      requestAnimationFrame(() => { sud.style.transition = "transform .25s cubic-bezier(.3,1.6,.5,1)"; sud.style.transform = T(rx, ry, "scale(1)"); });
      DRAG.suds.push({ s: sud, x: rx, y: ry });
      if (DRAG.suds.length % 3 === 1) play("scrub");
      const p = Math.round(DRAG.suds.length / 14 * 100);
      DRAG.ghost.dataset.p = p; DRAG.ghost.style.setProperty("--p", p + "%");
      if (DRAG.suds.length >= 14) dragEnd();
    }
  }
}
function combTuft(t, x, y) {
  t._gone = true;
  const g = DRAG.g, i = +t.dataset.t;
  g.tuftMask = (g.tuftMask || 0) & ~(1 << i);
  t.classList.add("combed");
  setTimeout(() => t.remove(), 450);
  play("comb"); haptic(10);
  bits("dot", x, y, 6, { c: [furColor(), "#fff"], v: 1.6, up: 2, g: -.03, s: 4, life: 70 });
  floatText(x, y - 10, pick(["fluff!", "scritch!", "tug!", "pop!"]), "#a24dff", 17);
  g.clean = clamp(g.clean + 3, 0, 100); g.joy = clamp(g.joy + 2, 0, 100);
  G.stats.combed = (G.stats.combed || 0) + 1; questProgress("comb");
  DRAG.combed++;
  if (!tuftCount(g)) {
    setTimeout(() => {
      const [bx, by] = bodyVP(); play("sparkle"); bits("dot", bx, by - 20, 18, { c: ["#ffd84d", "#fff", "#fff3a8"], v: 3.5, up: 3, g: -.01, s: 3 });
      floatText(bx, by - 60, "✨ So fluffy! ✨", "#a24dff", 24); g.clean = clamp(g.clean + 8, 0, 100);
      addCoins(5, [bx, by]); say(pick(["I'm SO FLUFFY! Look at me!", "I feel like a brand new guinea!", "Silky smooth! Thank you!"]));
      const sv = petSvg(); if (sv) { sv.classList.add("shine"); setTimeout(() => { const s2 = petSvg(); if (s2) s2.classList.remove("shine"); }, 1600); }
    }, 300);
  }
  refreshStatBars(g); saveSoon();
}
async function dragEnd(e) {
  if (!DRAG) return;
  const D = DRAG; DRAG = null;
  const { btn, ghost, kind, id, g } = D;
  btn.classList.remove("dragging");
  btn.removeEventListener("pointermove", dragMove); btn.removeEventListener("pointerup", dragEnd); btn.removeEventListener("pointercancel", dragEnd);
  const s = petSvg(); if (s) { s.classList.remove("eager", "look-l", "look-r", "petting", "happy-eyes"); s.style.removeProperty("--tilt"); }
  const [gx, gy] = [D.x, D.y - (kind === "food" || kind === "pill" ? 46 : 30)];
  const back = () => { const [bx, by] = centerOf(btn); ghost.style.transition = "transform .3s ease-in, opacity .3s"; ghost.style.transform = `translate(${bx}px,${by}px) translate(-50%,-50%) scale(.5)`; ghost.style.opacity = 0; setTimeout(() => ghost.remove(), 320); };
  PA.busy = false;
  if (kind === "food" || kind === "pill") {
    if (D.near) {
      ghost.remove();
      useItem(g, id, null, [gx, gy]);
    } else {
      back();
      if (D.moved < 12) dragHint(kind, btn);
    }
  } else if (kind === "comb") {
    ghost.style.transition = "opacity .25s"; ghost.style.opacity = 0; setTimeout(() => ghost.remove(), 260);
    if (D.moved < 12) dragHint(kind, btn);
    else if (D.combed && tuftCount(g)) say(pick([`${tuftCount(g)} more messy bit${tuftCount(g) > 1 ? "s" : ""}! Keep combing!`, "Ooh, that feels nice. More?"]));
    tutMark("comb");
  } else if (kind === "sponge") {
    ghost.style.transition = "opacity .25s"; ghost.style.opacity = 0; setTimeout(() => ghost.remove(), 260);
    if (D.suds.length >= 4) {
      useOn(g, "soap"); tutMark("bath");
      enqueue(() => bathFinish(D.suds));
      say(pick(["Splish splash! Bubbles!", "Scrub-a-dub-wheek!", "Behind the ears too!"]));
      refreshStatBars(g);
    } else {
      D.suds.forEach(({ s }) => { s.style.opacity = 0; setTimeout(() => s.remove(), 300); });
      if (D.moved < 12) dragHint(kind, btn); else toast("Keep scrubbing to make lots of bubbles!", "🧽");
    }
  }
  renderSuggest();
}
function dragHint(kind, btn) {
  const g = activeG();
  const txt = { food: `Drag it onto ${g.name}'s mouth!`, pill: `Drag it onto ${g.name}'s mouth!`, comb: `Drag the comb across ${g.name}'s fur!`, sponge: `Scrub ${g.name} by dragging the sponge around!` }[kind];
  toast(txt, "👆");
  // show the motion with a ghost hand
  const [bx, by] = centerOf(btn), [mx, my] = kind === "food" || kind === "pill" ? mouthVP() : bodyVP();
  const h = document.createElement("div"); h.className = "drag-ghost hint"; h.textContent = "👆"; document.body.appendChild(h);
  h.animate([{ transform: `translate(${bx}px,${by}px) translate(-50%,-30%)`, opacity: 0 }, { opacity: 1, offset: .15 }, { transform: `translate(${mx}px,${my + 30}px) translate(-50%,-30%)`, opacity: 1, offset: .7 }, { transform: `translate(${mx + (kind === "comb" || kind === "sponge" ? 60 : 0)}px,${my + 30}px) translate(-50%,-30%)`, opacity: 0 }], { duration: 1500, easing: "ease-in-out" }).finished.then(() => h.remove());
}
async function bathFinish(subs) {
  const sv = petSvg(); if (!sv) return;
  const r = sv.getBoundingClientRect();
  for (let i = 0; i < 4; i++) { bits("dot", r.left + r.width * (.2 + Math.random() * .6), r.top - 10, 8, { c: ["#5fd3ff", "#bfefff"], v: 1, up: -3, g: .35, s: 3.5, life: 40 }); await wait(120); }
  play("splash");
  subs.forEach(({ s, x, y }, i) => setTimeout(() => { s.style.transform = T(x, y - 30, "scale(1.4)"); s.style.opacity = 0; if (i % 4 === 0) play("pop"); }, i * 40));
  await wait(700); subs.forEach(({ s }) => s.remove());
  pcls("shakedry", 800); play("shake");
  for (let i = 0; i < 3; i++) { bits("dot", ...bodyVP(), 10, { c: ["#5fd3ff", "#bfefff", "#fff"], v: 6, up: 2, s: 3, dir: i % 2 ? Math.PI : 0, spread: 1.6 }); await wait(250); }
  bits("dot", ...bodyVP(), 14, { c: ["#ffd84d", "#fff"], v: 4, up: 3, s: 2.5, g: .05 }); floatText(...bodyVP(), "✨ squeaky clean!", "#3d8bff", 20);
}
