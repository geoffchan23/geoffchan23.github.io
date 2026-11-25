// Network-first so updates show up right away; cache is the offline fallback.
const CACHE = 'katara-study-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (!url.startsWith(self.location.origin) && !url.includes('fonts.g')) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
    return res;
  }).catch(() => caches.match(e.request)));
});
