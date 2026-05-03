const CACHE_NAME = "hamilton-arcade-v5-site";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./drag.js",
  "./wheel.js",
  "./wheel-state.js",
  "./wheel-math.js",
  "./wheel-canvas.js",
  "./audio.js",
  "./lyrics.json",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        if (response.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes("fonts.gstatic.com"))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
