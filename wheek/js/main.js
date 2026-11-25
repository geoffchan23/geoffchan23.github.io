/* Wheek World boot. */
"use strict";
(function boot() {
  const saved = loadSave();
  G = saved ? migrate(saved) : newGame();
  initFx();
  tick();
  G.guineas.forEach(noteCoat);
  if (!location.hash) history.replaceState(null, "", "#/home");
  render();
  if (!G.flags.intro) intro();
  else setTimeout(pumpEvents, 600);

  let lastHour = hourIdx();
  setInterval(() => {
    tick(); renderTop();
    const h = hourIdx();
    if (h !== lastHour) { lastHour = h; refreshBadges(); if (ROUTE.name === "home" && !modalStack.length && $("#tray") && $("#tray").hidden) render(); }
  }, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { tick(); if (!ROUTE.inGame && !modalStack.length) render(); } });
  addEventListener("pointerdown", () => getAC(), { once: true });

  startCloud();
  // PWA
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); window.__installPrompt = e; });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) toast("Wheek World got an update! It'll be ready next time you open it.", "🎁"); });
      });
    }).catch(() => {});
  }
})();

function intro() {
  const g = activeG();
  const slides = [
    { art: guineaSVG(g, { size: 170, mood: "happy" }), t: "Welcome to Wheek World!", p: `This is <b>${esc(g.name)}</b>, your guinea pig! ${esc(g.name)} loves boops, snacks and being VERY dramatic.` },
    { art: `<div class="big-emoji">🗺️</div>`, t: "A whole world to explore", p: "Play games at the Arcade and Carnival to win coins. Shop for snacks, hats and blind boxes. Make slime. Visit the Stinky Swamp (hold your nose)." },
    { art: `<div class="big-emoji">💕🌾</div>`, t: "Grow your herd", p: "Adopt more guineas, send them on dates and raise babies. Some babies are super rare! Save up to buy the <b>Guinea Farm</b>." },
    { art: `<div class="big-emoji">📦⏰</div>`, t: "Something new every hour", p: "A weird courier brings a package every hour, and something wild happens in the world. Come back often!" },
  ];
  let i = 0;
  const m = openModal(`<div class="intro center"><div id="inArt"></div><h2 id="inT"></h2><p class="mtext" id="inP"></p><div class="dots" id="inDots"></div><div class="mrow"><button class="btn green big" id="inNext">Next</button></div></div>`, { sticky: true, noClose: true, onClose: () => { G.flags.intro = true; save(); queueEvent({ type: "daily" }); G.daily.streak = Math.max(1, G.daily.streak); } });
  const show = () => {
    const s = slides[i];
    $("#inArt", m.el).innerHTML = s.art; $("#inT", m.el).textContent = s.t; $("#inP", m.el).innerHTML = s.p;
    $("#inDots", m.el).innerHTML = slides.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("");
    $("#inNext", m.el).textContent = i === slides.length - 1 ? "Let's play! 🐹" : "Next";
  };
  show();
  $("#inNext", m.el).onclick = () => { getAC(); play(i === slides.length - 1 ? "fanfare" : "wheek"); if (++i >= slides.length) { m.close(); confetti(innerWidth / 2, innerHeight / 2, 100); } else show(); };
}
