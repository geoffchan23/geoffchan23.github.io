/* Wheek World service worker: everything is cached so the game works offline. */
const CACHE = "wheek-6f293bd02a";
const FILES = ["./", "index.html", "manifest.webmanifest", "css/app.css", "css/base.css", "js/art-legacy.js", "js/cloud.js", "js/core.js", "js/data.js", "js/guinea.js", "js/main.js", "js/pet-anim.js", "js/systems.js", "js/ui-main.js", "js/ui-pets.js", "js/ui-world.js", "games/cup-shuffle.js", "games/fart-rocket.js", "games/guinea-races.js", "games/hay-or-nay.js", "games/lettuce-catch.js", "games/popcorn-hop.js", "games/scratch-snack.js", "games/slime-plinko.js", "games/slime-slots.js", "games/squishy-claw.js", "games/squishy-match.js", "games/swamp-dig.js", "games/whack-a-wheek.js", "fonts/BagelFatOne.woff2", "fonts/Nunito.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("wheek-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; }).catch(() => caches.match("./"))));
});
