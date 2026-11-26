/* Wheek World mini-game: Snack Chef.
   Guinea customers line up at the snack shack with an order bubble. Tap the veggies they want into the
   bowl (order doesn't matter, amounts do). When the bowl matches an order it zooms to that customer.
   Fast service = tips. Three grumpy customers who give up and leave end the round early. Free to play. */
(function () {
  "use strict";
  const ID = "snack-chef", C = "g-chef";
  const ROUND = 75;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];

  const INGS = [
    { k: "lettuce", e: "🥬", bg: "#c8f7a0" },
    { k: "carrot", e: "🥕", bg: "#ffd2a6" },
    { k: "berry", e: "🍓", bg: "#ffc2d4" },
    { k: "cuke", e: "🥒", bg: "#b8ecb0" },
    { k: "pepper", e: "🫑", bg: "#d9f5a8" },
    { k: "apple", e: "🍎", bg: "#ffb9b0" },
  ];
  const EMO = {}; INGS.forEach((i) => (EMO[i.k] = i.e));
  const YUMS = ["YUM!", "NOM NOM!", "WHEEK!", "TASTY!", "PERFECT!", "SO GOOD!"];
  const OOPS = ["Nobody ordered that!", "Ew, wrong snack!", "Splat!", "Oopsie!"];
  const HEART = '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M12 20S2 13.5 2 7.5A5 5 0 0 1 12 5a5 5 0 0 1 10 2.5C22 13.5 12 20 12 20Z" fill="#ff5a5f" stroke="#2b1640" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="7" cy="8" rx="2" ry="1.4" fill="#fff" opacity=".7"/></svg>';

  const CSS = `
.${C}{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;color:var(--ink);font-family:var(--body);touch-action:none;-webkit-user-select:none;user-select:none;background:#fff1d6}
.${C} .shop{position:relative;flex:1 1 auto;min-height:0;overflow:hidden;background:repeating-linear-gradient(90deg,#ffe3f1 0 28px,#fff6fb 28px 56px)}
.${C} .shop.shk{animation:${C}-shake .35s}
.${C} .awn{position:absolute;left:0;right:0;top:0;height:46px;background:repeating-linear-gradient(90deg,#ff5a7a 0 36px,#fff6e8 36px 72px);border-bottom:4px solid var(--ink)}
.${C} .awn:after{content:"";position:absolute;left:0;right:0;bottom:-18px;height:18px;background:radial-gradient(circle at 18px 0,#ff5a7a 15px,transparent 16px) 0 0/72px 18px repeat-x,radial-gradient(circle at 54px 0,#fff6e8 15px,transparent 16px) 0 0/72px 18px repeat-x;filter:drop-shadow(0 3px 0 var(--ink))}
.${C} .sign{position:absolute;left:50%;top:76px;top:max(104px,22%);transform:translateX(-50%) rotate(-2deg);background:var(--yellow);border:4px solid var(--ink);border-radius:16px;box-shadow:0 4px 0 var(--ink);padding:4px 16px;font-family:var(--display);font-size:24px;white-space:nowrap}
.${C} .sign small{display:block;font-family:var(--body);font-weight:900;font-size:12px;text-align:center;margin-top:-2px}
.${C}.short .sign{display:none}
.${C} .counter{position:absolute;left:0;right:0;bottom:0;height:38px;z-index:3;border-top:5px solid var(--ink);background:linear-gradient(#ffc36b 0 8px,#e8832a 8px,#c4661c)}
.${C} .counter:after{content:"";position:absolute;left:0;right:0;top:12px;bottom:0;background:repeating-linear-gradient(90deg,transparent 0 46px,rgba(43,22,64,.15) 46px 50px)}
.${C} .cu{position:absolute;left:0;bottom:28px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;z-index:2;will-change:transform}
.${C} .pig{position:relative;width:var(--s)}
.${C} .pig svg{display:block;width:100%;height:auto}
.${C} .pig.mad{animation:${C}-mad .18s infinite}
.${C} .pig.yay{animation:${C}-yay .5s ease-out}
.${C} .emo{position:absolute;right:-8px;top:-6px;font-size:26px;line-height:1;transition:transform .2s;transform:scale(0)}
.${C} .emo.on{transform:scale(1)}
.${C} .bub{position:relative;background:#fff;border:3px solid var(--ink);border-radius:16px;box-shadow:0 3px 0 var(--ink);padding:4px 6px 6px;margin-bottom:10px;transform:scale(0);transform-origin:50% 120%;transition:transform .35s cubic-bezier(.2,1.6,.4,1)}
.${C} .cu.here .bub{transform:scale(1)}
.${C} .bub:after{content:"";position:absolute;left:50%;bottom:-11px;width:14px;height:14px;margin-left:-8px;background:#fff;border-right:3px solid var(--ink);border-bottom:3px solid var(--ink);transform:rotate(45deg)}
.${C} .its{display:grid;justify-content:center;gap:0 1px;font-size:calc(var(--it) * .78);line-height:1.15;position:relative;z-index:1}
.${C} .it{display:block;width:var(--it);height:var(--it);text-align:center;line-height:var(--it);border-radius:50%;position:relative}
.${C} .it.ok{background:#c9f7a8}
.${C} .it.ok:after{content:"✓";position:absolute;right:-3px;bottom:-4px;font-size:13px;font-weight:900;color:#fff;background:#2f9e14;border:2px solid var(--ink);border-radius:50%;width:16px;height:16px;line-height:13px}
.${C} .dish{height:11px;margin:-6px 6px 5px;border:3px solid var(--ink);border-top-width:2px;border-radius:0 0 30px 30px;background:var(--lilac)}
.${C} .bar{height:11px;border:2.5px solid var(--ink);border-radius:99px;background:#efe8f7;overflow:hidden}
.${C} .bar i{display:block;height:100%;width:100%;border-radius:99px;transform-origin:0 50%}
.${C} .kit{flex:none;position:relative;z-index:4;background:var(--card);border-top:4px solid var(--ink);padding:6px 10px calc(10px + var(--safe-bottom,0px))}
.${C} .brow{display:flex;gap:10px;align-items:flex-end;margin-bottom:8px}
.${C} .bowl{position:relative;flex:1;height:64px}
.${C} .bowl .bd{position:absolute;left:12%;right:12%;bottom:0;height:34px;background:linear-gradient(#d9cbff,#a98ff0);border:4px solid var(--ink);border-radius:6px 6px 60px 60px/6px 6px 40px 40px;box-shadow:0 3px 0 var(--ink)}
.${C} .bowl .bd:before{content:"";position:absolute;left:10px;top:5px;width:30%;height:5px;border-radius:9px;background:rgba(255,255,255,.6)}
.${C} .bowl .in{position:absolute;left:0;right:0;bottom:16px;display:flex;justify-content:center;gap:2px;font-size:32px;line-height:1;z-index:1}
.${C} .bowl .in span{display:inline-block;animation:${C}-plop .3s cubic-bezier(.2,1.6,.4,1)}
.${C} .bowl .hint{position:absolute;left:0;right:0;bottom:4px;text-align:center;font-size:13px;font-weight:900;color:#fff;z-index:2;text-shadow:0 1px 0 var(--ink),0 -1px 0 var(--ink),1px 0 0 var(--ink),-1px 0 0 var(--ink)}
.${C} .bowl.splat{animation:${C}-splat .45s}
.${C} .bin{width:58px;height:58px;min-height:58px;padding:0;font-size:26px;flex:none}
.${C} .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.${C} .ing{height:clamp(52px,9.5vh,84px);border:4px solid var(--ink);border-radius:18px;box-shadow:0 5px 0 var(--ink);font-size:34px;line-height:1;padding:0;display:flex;align-items:center;justify-content:center;transition:transform .06s,box-shadow .06s;touch-action:none}
.${C} .ing.dn{transform:translateY(4px);box-shadow:0 1px 0 var(--ink)}
.${C} .ing span{display:inline-block;pointer-events:none}
.${C} .ing.dn span{transform:scale(1.18)}
.${C} .hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:6px;align-items:center;justify-content:space-between;pointer-events:none;z-index:6;transition:opacity .3s,transform .3s}
.${C} .hud.off{opacity:0;transform:translateY(-20px)}
.${C} .pill{background:var(--card);border:3px solid var(--ink);border-radius:999px;box-shadow:0 3px 0 var(--ink);padding:2px 11px;font-family:var(--display);font-size:20px;display:flex;align-items:center;gap:4px;min-height:40px;white-space:nowrap}
.${C} .pill.sc{min-width:80px}
.${C} .pill.tm.hurry{background:var(--pink);animation:${C}-throb .5s infinite}
.${C} .pill.lv{gap:1px;padding:2px 7px}
.${C} .pill.lv svg{transition:transform .3s,filter .3s,opacity .3s}
.${C} .pill.lv svg.gone{filter:grayscale(1);opacity:.35;transform:scale(.75) rotate(-20deg)}
.${C} .x2{position:absolute;top:58px;right:10px;background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:1px 8px;font-family:var(--display);font-size:17px;transform:rotate(-8deg);box-shadow:0 3px 0 var(--ink);z-index:6;pointer-events:none}
.${C} .streak{position:absolute;top:58px;left:10px;z-index:6;font-family:var(--display);font-size:20px;color:var(--orange);-webkit-text-stroke:1.5px var(--ink);pointer-events:none;transform:rotate(4deg)}
.${C} .bump{animation:${C}-bump .25s}
.${C} .pop{position:absolute;z-index:8;pointer-events:none;font-family:var(--display);white-space:nowrap;transform:translate(-50%,-50%);-webkit-text-stroke:1.5px var(--ink);text-shadow:0 3px 0 var(--ink);animation:${C}-float 1s ease-out forwards}
.${C} .fly{position:absolute;z-index:9;pointer-events:none;font-size:32px;line-height:1;transform:translate(-50%,-50%)}
.${C} .spark{position:absolute;z-index:8;pointer-events:none;width:10px;height:10px;border-radius:50%;border:2px solid var(--ink)}
.${C} .banner{position:absolute;left:0;right:0;top:38%;z-index:7;text-align:center;pointer-events:none;font-family:var(--display);font-size:42px;line-height:1;-webkit-text-stroke:2px var(--ink);text-shadow:0 4px 0 var(--ink);animation:${C}-ban 1.8s forwards}
.${C} .banner small{display:block;font-size:18px;color:#fff;-webkit-text-stroke:1px var(--ink);text-shadow:0 2px 0 var(--ink);margin-top:6px}
.${C} .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(43,22,64,.32);z-index:20}
.${C} .ov.hide{display:none}
.${C} .panel{background:var(--card);border:4px solid var(--ink);border-radius:26px;box-shadow:0 7px 0 var(--ink);width:100%;max-width:340px;max-height:100%;overflow:auto;padding:14px 16px 18px;text-align:center;animation:${C}-pop .45s cubic-bezier(.2,1.6,.4,1)}
.${C} .panel .art{position:relative;height:126px;display:flex;align-items:flex-end;justify-content:center}
.${C} .panel .art .g{position:relative;animation:${C}-bob 1.4s ease-in-out infinite}
.${C} .panel .art .hat{position:absolute;left:50%;top:-30px;width:64px;height:44px;margin-left:-32px}
.${C} .panel .art .fl{position:absolute;font-size:30px;animation:${C}-orbit 2.4s ease-in-out infinite}
.${C} .panel h2{font-family:var(--display);font-weight:400;font-size:34px;margin:6px 0 6px;line-height:1;text-shadow:0 3px 0 var(--yellow)}
.${C} .panel p{margin:0 0 10px;font-size:16px;line-height:1.35;color:var(--ink-soft)}
.${C} .panel p b{color:var(--ink)}
.${C} .chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 14px}
.${C} .chip{background:#f3edff;border:2.5px solid var(--ink);border-radius:999px;padding:3px 10px;font-size:13px;font-weight:800}
.${C}.tiny .panel .art{height:98px}.${C}.tiny .panel .art .g>svg:not(.hat){width:80px;height:68px}.${C}.tiny .panel .art .hat{width:50px;height:34px;margin-left:-25px;top:-24px}.${C}.tiny .panel h2{font-size:30px}.${C}.tiny .panel p{font-size:15px}
.${C} .panel .btn{font-size:24px;min-width:200px;min-height:58px}
.${C} .panel .last{font-family:var(--display);font-size:22px;margin:0 0 8px}
@keyframes ${C}-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ${C}-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}
@keyframes ${C}-orbit{0%,100%{transform:translateY(0) rotate(-10deg)}50%{transform:translateY(-14px) rotate(12deg)}}
@keyframes ${C}-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes ${C}-bump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes ${C}-plop{0%{transform:translateY(-26px) scale(.5)}100%{transform:none}}
@keyframes ${C}-splat{0%{transform:none}20%{transform:scale(1.2,.7)}45%{transform:rotate(-8deg)}70%{transform:rotate(6deg)}100%{transform:none}}
@keyframes ${C}-float{0%{opacity:0;transform:translate(-50%,-30%) scale(.5)}15%{opacity:1;transform:translate(-50%,-60%) scale(1.15)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-190%) scale(1)}}
@keyframes ${C}-ban{0%{opacity:0;transform:scale(.4)}14%{opacity:1;transform:scale(1.15)}24%{transform:scale(1)}82%{opacity:1}100%{opacity:0;transform:scale(1)}}
@keyframes ${C}-mad{0%,100%{transform:translateX(0)}50%{transform:translateX(3px) rotate(2deg)}}
@keyframes ${C}-yay{0%{transform:none}35%{transform:translateY(-18px) scale(1.08,.95)}70%{transform:translateY(0) scale(1.1,.9)}100%{transform:none}}
@keyframes ${C}-shake{0%,100%{transform:none}25%{transform:translate(-6px,3px)}50%{transform:translate(5px,-3px)}75%{transform:translate(-3px,2px)}}
@media (prefers-reduced-motion: reduce){.${C} .shop.shk,.${C} .pig.mad{animation:none}.${C} .panel .art *{animation:none}}
`;
  const HAT = '<svg class="hat" viewBox="0 0 64 44"><path d="M14 40 L14 26 C2 24 2 6 16 8 C18 -2 46 -2 48 8 C62 6 62 24 50 26 L50 40 Z" fill="#fff" stroke="#2b1640" stroke-width="4" stroke-linejoin="round"/><path d="M14 32 H50" stroke="#2b1640" stroke-width="3"/></svg>';

  function mount(root, api) {
    const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const wrap = document.createElement("div"); wrap.className = C; root.appendChild(wrap);
    wrap.innerHTML = `<div class="shop"><div class="awn"></div><div class="sign">🥗 SNACK SHACK<small>fresh bowls for hungry guineas</small></div><div class="custs"></div><div class="counter"></div>
        <div class="hud off"><div class="pill sc">⭐<b>0</b></div><div class="pill tm">⏱<b>${ROUND}</b></div><div class="pill lv">${HEART}${HEART}${HEART}</div></div></div>
      <div class="kit"><div class="brow"><div class="bowl"><div class="bd"></div><div class="in"></div><div class="hint">tap veggies!</div></div><button class="btn white bin" aria-label="empty bowl">🗑️</button></div>
        <div class="grid">${INGS.map((i) => `<button class="ing" data-k="${i.k}" style="background:${i.bg}" aria-label="${i.k}"><span>${i.e}</span></button>`).join("")}</div></div>
      <div class="ov hide"></div>`;
    const $ = (s) => wrap.querySelector(s);
    const shop = $(".shop"), custsEl = $(".custs"), hud = $(".hud"), scEl = $(".sc b"), tmEl = $(".tm b"), tmPill = $(".tm");
    const hearts = [...wrap.querySelectorAll(".lv svg")], ov = $(".ov"), bowlEl = $(".bowl"), inEl = $(".bowl .in"), hintEl = $(".bowl .hint"), binBtn = $(".bin");
    const gName = (api.guinea && api.guinea.name) || "Pudding";

    let W = 360, SH = 300, slotW = 120, pigS = 90;
    let custs = [], bowl = [], jobs = [], extras = [];
    const S = {};
    function reset() {
      custs.forEach((c) => c.el.remove());
      custs = []; bowl = []; jobs = [];
      extras.forEach((e) => e.remove()); extras = [];
      Object.assign(S, { state: "intro", t: 0, timeLeft: ROUND, score: 0, lives: 3, served: 0, tips: 0, streak: 0, bestStreak: 0, angry: 0, oops: 0,
        spawnT: 0.4, first: true, lock: 0, awarded: false, lastSec: ROUND, rush: false, why: "" });
      renderBowl();
    }
    const later = (sec, fn) => jobs.push({ t: sec, fn });

    function resize() {
      W = Math.max(1, shop.clientWidth); SH = Math.max(1, shop.clientHeight);
      slotW = W / 3;
      pigS = Math.round(clamp(Math.min(slotW * 0.8, SH * 0.27), 64, 124));
      wrap.style.setProperty("--s", pigS + "px");
      wrap.style.setProperty("--it", Math.round(clamp((slotW - 20) / 3, 24, 36)) + "px");
      wrap.classList.toggle("tiny", root.clientHeight < 640);
      wrap.classList.toggle("short", SH < 360);
      custs.forEach((c) => { c.el.style.width = slotW + "px"; if (c.state === "here") c.x = slotX(c.slot); });
    }
    const slotX = (i) => slotW * (i + 0.5);

    /* ---------- fx ---------- */
    function rel(el) { const a = el.getBoundingClientRect(), b = wrap.getBoundingClientRect(); return [a.left - b.left + a.width / 2, a.top - b.top + a.height / 2, a]; }
    function pop(x, y, text, col, size) {
      const d = document.createElement("div"); d.className = "pop"; d.textContent = text;
      x = clamp(x, text.length * (size || 26) * 0.3 + 6, wrap.clientWidth - text.length * (size || 26) * 0.3 - 6);
      d.style.cssText = `left:${x}px;top:${y}px;color:${col || "#fff"};font-size:${size || 26}px`;
      wrap.appendChild(d); extras.push(d);
      later(1.05, () => d.remove());
    }
    function sparks(x, y, cols, n) {
      for (let i = 0; i < n; i++) {
        const d = document.createElement("div"); d.className = "spark"; d.style.cssText = `left:${x - 5}px;top:${y - 5}px;background:${pick(cols)}`;
        wrap.appendChild(d); extras.push(d);
        const a = rnd(0, Math.PI * 2), v = rnd(45, 120);
        d.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v - 15}px) scale(.3)`, opacity: 0 }], { duration: rnd(450, 750), easing: "cubic-bezier(.2,.8,.4,1)", fill: "forwards" });
        later(0.8, () => d.remove());
      }
    }
    function banner(text, sub, col) {
      const old = wrap.querySelector(".banner"); if (old) old.remove();
      const d = document.createElement("div"); d.className = "banner"; d.style.color = col || "#ffd84d";
      d.innerHTML = text + (sub ? `<small>${sub}</small>` : "");
      shop.appendChild(d); extras.push(d);
      if (S.state === "play") later(1.85, () => d.remove());
      return d;
    }
    function shake() { if (RM) return; shop.classList.remove("shk"); void shop.offsetWidth; shop.classList.add("shk"); }
    function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    function vp(x, y) { const r = wrap.getBoundingClientRect(); return [r.left + x, r.top + y]; }

    /* ---------- HUD ---------- */
    function setHud() {
      scEl.textContent = S.score;
      const sec = Math.max(0, Math.ceil(S.timeLeft));
      tmEl.textContent = sec;
      tmPill.classList.toggle("hurry", sec <= 10 && S.state === "play");
      hearts.forEach((h, i) => h.classList.toggle("gone", i >= S.lives));
      let st = wrap.querySelector(".streak");
      if (S.streak >= 3 && S.state === "play") {
        if (!st) { st = document.createElement("div"); st.className = "streak"; shop.appendChild(st); }
        st.textContent = "🔥 " + S.streak + " in a row!";
      } else if (st) st.remove();
    }

    /* ---------- bowl ---------- */
    function renderBowl() {
      inEl.innerHTML = bowl.map((k) => `<span>${EMO[k]}</span>`).join("");
      if (bowl.length) { const last = inEl.lastChild; if (last) last.style.animation = ""; }
      [...inEl.children].forEach((s, i) => { if (i < bowl.length - 1) s.style.animation = "none"; });
      hintEl.style.display = bowl.length ? "none" : "";
      inEl.style.fontSize = bowl.length >= 4 ? "28px" : "32px";
      updateTicks();
    }
    function counts(arr) { const m = {}; arr.forEach((k) => (m[k] = (m[k] || 0) + 1)); return m; }
    function contains(order, b) { const o = counts(order), q = counts(b); return Object.keys(q).every((k) => (o[k] || 0) >= q[k]); }
    function same(order, b) { return order.length === b.length && contains(order, b); }
    function live() { return custs.filter((c) => c.state === "here"); }
    function updateTicks() {
      custs.forEach((c) => {
        const ok = contains(c.order, bowl) && bowl.length > 0;
        const q = ok ? counts(bowl) : {};
        c.itEls.forEach((el, i) => { const k = c.order[i]; const on = ok && q[k] > 0; if (on) q[k]--; el.classList.toggle("ok", on); });
      });
    }

    function press(k, btn) {
      if (S.state !== "play" || S.lock > 0) return;
      const L = live();
      if (!L.length) { api.sfx("boop"); const [x, y] = rel(bowlEl); pop(x, y - 30, "Wait for a customer!", "#fff", 18); return; }
      if (btn) {
        const [bx, by] = rel(btn), [tx, ty] = rel(bowlEl);
        const f = document.createElement("div"); f.className = "fly"; f.textContent = EMO[k]; f.style.left = bx + "px"; f.style.top = by + "px";
        wrap.appendChild(f); extras.push(f);
        f.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${(tx - bx) * 0.5}px),calc(-50% + ${(ty - by) * 0.5 - 50}px)) scale(1.2)` }, { transform: `translate(calc(-50% + ${tx - bx}px),calc(-50% + ${ty - by - 10}px)) scale(.8)` }], { duration: 200, easing: "ease-in", fill: "forwards" });
        later(0.2, () => f.remove());
      }
      bowl.push(k);
      const exact = L.filter((c) => same(c.order, bowl)).sort((a, b) => a.pat / a.patMax - b.pat / b.patMax);
      if (exact.length) { renderBowl(); serve(exact[0]); return; }
      if (L.some((c) => contains(c.order, bowl))) { api.sfx("pop"); api.haptic(8); renderBowl(); return; }
      oops();
    }
    function oops() {
      S.oops++; S.streak = 0; S.lock = 0.45;
      renderBowl();
      api.sfx("splat"); later(0.12, () => api.sfx("fart")); api.haptic(50);
      bowlEl.classList.remove("splat"); void bowlEl.offsetWidth; bowlEl.classList.add("splat");
      const [x, y] = rel(bowlEl);
      sparks(x, y - 10, ["#9be36a", "#b6f27a", "#7fcf4a"], 12);
      pop(x, y - 40, pick(OOPS), "#b6f27a", 22);
      later(0.3, () => { bowl = []; renderBowl(); });
      setHud();
    }
    function emptyBowl() {
      if (S.state !== "play" || !bowl.length) return;
      api.sfx("whoosh"); bowl = []; renderBowl();
    }

    /* ---------- customers ---------- */
    function orderLen(d) {
      const r = Math.random();
      if (d < 0.2) return r < 0.85 ? 2 : 3;
      if (d < 0.5) return r < 0.45 ? 2 : r < 0.92 ? 3 : 4;
      if (d < 0.8) return r < 0.2 ? 2 : r < 0.75 ? 3 : 4;
      return r < 0.45 ? 3 : 4;
    }
    function makeOrder(n) {
      const o = [];
      for (let i = 0; i < n; i++) {
        let k = pick(INGS).k;
        if (o.includes(k) && Math.random() < 0.7) k = pick(INGS.filter((g) => !o.includes(g.k))).k;
        o.push(k);
      }
      return o;
    }
    function spawn() {
      const used = custs.map((c) => c.slot);
      const free = [0, 1, 2].filter((i) => !used.includes(i));
      if (!free.length) return false;
      const slot = pick(free), d = clamp(S.t / 70, 0, 1);
      const order = makeOrder(orderLen(d));
      const seed = (Math.random() * 99999) | 0;
      const el = document.createElement("div"); el.className = "cu"; el.style.width = slotW + "px";
      const cols = order.length === 4 ? 2 : order.length;
      el.innerHTML = `<div class="bub"><div class="its" style="grid-template-columns:repeat(${cols},auto)">${order.map((k) => `<span class="it">${EMO[k]}</span>`).join("")}</div><div class="dish"></div><div class="bar"><i></i></div></div>
        <div class="pig">${api.randomGuineaSVG(seed, { size: 110, flip: slot === 2 })}<span class="emo"></span></div>`;
      custsEl.appendChild(el);
      const side = slot === 0 ? -1 : slot === 2 ? 1 : (Math.random() < 0.5 ? -1 : 1);
      const patMax = lerp(17, 8, d) + order.length * 1.9;
      const c = { el, slot, order, side, x: slotX(slot) + side * (slotW * 1.6 + 30), state: "walk", walk: 0, pat: patMax, patMax,
        barEl: el.querySelector(".bar i"), pigEl: el.querySelector(".pig"), emoEl: el.querySelector(".emo"), itEls: [...el.querySelectorAll(".it")], mood: "" };
      custs.push(c);
      place(c, 0);
      return true;
    }
    function place(c, bob) { c.el.style.transform = `translate(${c.x - slotW / 2}px,${bob}px)`; }
    function setEmo(c, e) { if (c.mood === e) return; c.mood = e; c.emoEl.textContent = e; c.emoEl.classList.toggle("on", !!e); }
    function serve(c) {
      c.state = "served";
      const frac = c.pat / c.patMax;
      const n = c.order.length;
      const base = 10 * n;
      const tip = frac > 0.6 ? Math.round(5 + 10 * (frac - 0.6) / 0.4) : 0;
      S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak);
      const sb = Math.min(10, Math.max(0, S.streak - 1) * 2);
      S.score += base + tip + sb; S.served++; if (tip) S.tips++;
      // the bowl zooms over
      const [bx, by] = rel(bowlEl), [cx, cy] = rel(c.pigEl);
      const f = document.createElement("div"); f.className = "fly"; f.innerHTML = `<span style="font-size:30px">🥣</span>`; f.style.left = bx + "px"; f.style.top = by + "px";
      wrap.appendChild(f); extras.push(f);
      f.animate([{ transform: "translate(-50%,-50%) scale(1.4)" }, { transform: `translate(calc(-50% + ${(cx - bx) * 0.5}px),calc(-50% + ${(cy - by) * 0.5 - 60}px)) scale(1.6) rotate(180deg)` }, { transform: `translate(calc(-50% + ${cx - bx}px),calc(-50% + ${cy - by}px)) scale(.6) rotate(360deg)` }], { duration: 320, easing: "ease-in-out", fill: "forwards" });
      later(0.32, () => f.remove());
      bowl = []; renderBowl();
      api.sfx("whoosh");
      later(0.3, () => {
        api.sfx("nom"); later(0.12, () => api.sfx(tip ? "coin" : "pop"));
        if (tip >= 12) later(0.25, () => api.sfx("wheek"));
        c.pigEl.classList.remove("mad"); c.pigEl.classList.add("yay");
        setEmo(c, tip ? "😍" : "😋");
        c.el.querySelector(".bub").style.transform = "scale(0)";
        const [px, py] = rel(c.pigEl);
        pop(px, py - pigS * 0.55, "+" + (base + sb), "#fff", 28);
        if (tip) later(0.25, () => pop(px, py - pigS * 0.95, "+" + tip + " TIP!", "#ffd84d", 22));
        else pop(px, py - pigS * 0.95, pick(YUMS), "#ff8fc7", 18);
        sparks(px, py - pigS * 0.45, ["#ffd84d", "#ff8fc7", "#7be04a", "#5fd3ff"], tip ? 16 : 9);
        if (tip >= 12) { const [vx, vy] = vp(px, py); api.confetti(vx, vy, 30); }
        if (S.streak > 0 && S.streak % 5 === 0) { banner("🔥 " + S.streak + " IN A ROW!", "streak bonus!", "#ff9f43"); api.sfx("sparkle"); }
        bump(scEl.parentNode); setHud();
        later(0.7, () => leave(c));
      });
      api.haptic(20);
    }
    function angry(c) {
      c.state = "angry";
      S.lives--; S.angry++; S.streak = 0;
      setEmo(c, "😤");
      c.el.querySelector(".bub").style.transform = "scale(0)";
      api.sfx("buzz"); later(0.15, () => api.sfx("fart")); api.haptic(90); shake();
      const [px, py] = rel(c.pigEl);
      sparks(px, py, ["#9be36a", "#b6f27a", "#cdeb8b"], 14);
      const [vx, vy] = vp(px, py); api.gas(vx, vy);
      pop(px, py - pigS * 0.6, pick(["HMPH!", "TOO SLOW!", "GRR!", "STINKY SERVICE!"]), "#b6f27a", 22);
      bump(hearts[Math.max(0, S.lives)]);
      setHud();
      if (S.lives <= 0) endRound("lives");
      else later(0.45, () => leave(c));
      updateTicks();
      if (bowl.length && !live().some((o) => contains(o.order, bowl))) later(0.5, () => { if (bowl.length && !live().some((o) => contains(o.order, bowl))) { bowl = []; renderBowl(); } });
    }
    function leave(c) { if (c.state === "gone") return; c.state = "leave"; c.walk = 0; }

    /* ---------- flow ---------- */
    function showPanel(after) {
      const svg = api.guineaSVG({ size: 100, mood: after ? "happy" : "wow" });
      const lastLine = after ? `<div class="last">⭐ ${after.score} &nbsp; 🪙 ${after.earned}</div>` : "";
      ov.innerHTML = `<div class="panel"><div class="art"><span class="fl" style="left:8%;top:30px">🥬</span><span class="fl" style="left:76%;top:18px;animation-delay:-.8s">🥕</span><span class="fl" style="left:84%;top:70px;animation-delay:-1.4s">🍓</span><span class="fl" style="left:2%;top:78px;animation-delay:-.4s">🥒</span><div class="g">${HAT}${svg}</div></div>
        <h2>${after ? (after.title) : "Snack Chef"}</h2>${lastLine}
        <p>${after ? after.line : `Hungry guineas want snack bowls! <b>Tap the veggies</b> in their bubble and the bowl zooms to them.`}</p>
        ${after ? "" : `<div class="chips"><span class="chip">⚡ Fast = tips</span><span class="chip">😤 3 grumpy = out</span><span class="chip">⏱ ${ROUND}s</span></div>`}
        <button class="btn green">${after ? "Play again!" : "Open the shack!"}</button></div>`;
      ov.classList.remove("hide");
      ov.querySelector("button").addEventListener("click", start);
    }
    let x2El = null;
    function start() {
      api.sfx("click");
      ov.classList.add("hide");
      reset();
      S.state = "play";
      hud.classList.remove("off");
      if (x2El) { x2El.remove(); x2El = null; }
      if (api.multiplier > 1) { x2El = document.createElement("div"); x2El.className = "x2"; x2El.textContent = "x" + api.multiplier + "!"; shop.appendChild(x2El); }
      setHud();
      banner("OPEN!", "customers coming!", "#7be04a");
      api.sfx("whoosh");
    }
    function endRound(why) {
      if (S.state !== "play") return;
      S.state = "end"; S.why = why;
      if (why === "lives") { banner("CLOSED!", "too many grumpy guineas", "#b6f27a"); api.sfx("lose"); }
      else { banner("TIME'S UP!", S.served + " bowls served!", "#5fd3ff"); api.sfx("fanfare"); }
      custs.forEach((c) => { if (c.state === "here") { setEmo(c, "🥺"); c.pigEl.classList.remove("mad"); } });
      setHud();
      later(1.9, finish);
    }
    function finish() {
      if (S.awarded) return;
      S.awarded = true; S.state = "over";
      const coins = Math.min(200, Math.round(S.score / 8));
      const earned = coins > 0 ? api.award(coins, { reason: "Snack Chef" }) : 0;
      const hs = api.highscore(ID, S.score);
      const quip = S.why === "lives"
        ? (S.served ? `Three guineas stomped off grumpy! ${gName} served ${S.served} bowls first.` : `Three grumpy guineas stomped off! Tap the veggies in their bubbles to fill the bowl.`)
        : S.served >= 26 ? `${gName} is a SUPER CHEF! ${S.served} bowls served!` : S.served ? `${gName} served ${S.served} snack bowls!` : `No bowls served... the customers had a nap.`;
      const text = `${quip}${S.tips ? ` ${S.tips} tips!` : ""} Score ${S.score}. ${hs.isNew ? "New best! 🏆" : "Best: " + hs.best}`;
      const title = S.why === "lives" ? "Kitchen closed!" : hs.isNew ? "New best!" : "Shift over!";
      api.done({ earned, title, text, score: S.score });
      if (S.served >= 10) api.sfx("bigwin");
      hud.classList.add("off");
      custs.forEach((c) => leave(c));
      showPanel({ score: S.score, earned, title, line: `${quip}${S.tips ? ` <b>${S.tips} tips!</b>` : ""}${hs.isNew ? " <b>New best! 🏆</b>" : ""}` });
    }

    function update(dt) {
      for (let i = jobs.length - 1; i >= 0; i--) { const j = jobs[i]; j.t -= dt; if (j.t <= 0) { jobs.splice(i, 1); j.fn(); } }
      if (S.state === "play") {
        S.t += dt; S.timeLeft -= dt; S.lock = Math.max(0, S.lock - dt);
        const d = clamp(S.t / 70, 0, 1);
        const sec = Math.ceil(S.timeLeft);
        if (sec !== S.lastSec) { S.lastSec = sec; if (sec <= 5 && sec > 0) api.sfx("tick"); setHud(); }
        if (!S.rush && S.t > 35) { S.rush = true; banner("RUSH HOUR!", "faster, chef!", "#ff8fc7"); api.sfx("drum"); }
        S.spawnT -= dt;
        if (S.spawnT <= 0) {
          if (spawn()) { S.spawnT = S.first ? 1.4 : lerp(3.4, 1.3, d) * rnd(0.8, 1.2); S.first = false; }
          else S.spawnT = 0.5;
        }
        if (S.timeLeft <= 0) { S.timeLeft = 0; endRound("time"); }
      }
      for (const c of custs) {
        if (c.state === "walk") {
          const tx = slotX(c.slot);
          c.walk += dt;
          const step = 520 * dt;
          if (Math.abs(tx - c.x) <= step) {
            c.x = tx; c.state = "here"; c.el.classList.add("here");
            api.sfx(Math.random() < 0.35 ? "wheek" : "boop");
            updateTicks();
          } else c.x += Math.sign(tx - c.x) * step;
          place(c, -Math.abs(Math.sin(c.walk * 14)) * 7);
        } else if (c.state === "here") {
          if (S.state === "play") {
            c.pat -= dt;
            const f = clamp(c.pat / c.patMax, 0, 1);
            c.barEl.style.transform = `scaleX(${f})`;
            c.barEl.style.background = `hsl(${Math.round(f * 110)},85%,52%)`;
            setEmo(c, f < 0.28 ? "💢" : f < 0.55 ? "😟" : "");
            c.pigEl.classList.toggle("mad", f < 0.28);
            if (c.pat <= 0) angry(c);
          }
          place(c, 0);
        } else if (c.state === "leave") {
          c.walk += dt;
          c.x += c.side * 560 * dt;
          place(c, -Math.abs(Math.sin(c.walk * 14)) * 7);
          if (c.x < -slotW || c.x > W + slotW) { c.state = "gone"; c.el.remove(); }
        }
      }
      custs = custs.filter((c) => c.state !== "gone");
      if (S.state === "play") { const st = wrap.querySelector(".streak"); if (st && S.streak < 3) st.remove(); }
    }

    /* ---------- loop & input ---------- */
    let raf = 0, last = 0, alive = true;
    function frame(t) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      let dt = last ? (t - last) / 1000 : 0; last = t;
      if (dt > 0.05) dt = 0.05;
      update(dt * (wrap._chef.speed || 1));
    }
    const ingBtns = [...wrap.querySelectorAll(".ing")];
    const onIng = (e) => {
      e.preventDefault();
      const b = e.currentTarget;
      b.classList.add("dn");
      press(b.dataset.k, b);
    };
    const onUp = (e) => e.currentTarget.classList.remove("dn");
    ingBtns.forEach((b) => { b.addEventListener("pointerdown", onIng); b.addEventListener("pointerup", onUp); b.addEventListener("pointerleave", onUp); b.addEventListener("pointercancel", onUp); });
    const onBin = (e) => { e.preventDefault(); emptyBowl(); };
    binBtn.addEventListener("pointerdown", onBin);
    const KEYS = { "1": "lettuce", "2": "carrot", "3": "berry", "4": "cuke", "5": "pepper", "6": "apple" };
    function onKey(e) {
      if (KEYS[e.key]) press(KEYS[e.key], ingBtns.find((b) => b.dataset.k === KEYS[e.key]));
      else if (e.key === "Backspace" || e.key === "Delete") emptyBowl();
    }
    window.addEventListener("keydown", onKey);
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => resize()); ro.observe(root); }
    window.addEventListener("resize", resize);

    // tiny test hook (harmless in production)
    wrap._chef = { speed: 1, S, custs: () => custs.filter((c) => c.state === "here").map((c) => ({ order: c.order.slice(), f: c.pat / c.patMax })), bowl: () => bowl.slice(), press: (k) => press(k, ingBtns.find((b) => b.dataset.k === k)), start };

    reset();
    resize();
    showPanel(null);
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        alive = false;
        cancelAnimationFrame(raf);
        jobs = [];
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        if (ro) ro.disconnect();
        wrap.remove(); style.remove();
      },
    };
  }

  WW.registerGame({
    id: ID, name: "Snack Chef", icon: "🥗", place: "carnival", kind: "skill",
    blurb: "Build snack bowls for hungry guineas. Fast service = tips!",
    mount,
  });
})();
