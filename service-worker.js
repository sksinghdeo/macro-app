const CACHE_NAME = "macro-logger-vnext-premium-neon-20260430";
const APP_FILES = [
  "./",
  "./index.html",
  "./core_foods.json",
  "./brand_foods.json",
  "./restaurant_foods.json",
  "./manifest.json",
  "./icon.PNG",
  "./logo_bc_v4.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
