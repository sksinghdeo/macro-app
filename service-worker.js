const CACHE_NAME = "macro-butler-v3-revision-build";
const APP_FILES = [
  "./",
  "./index.html",
  "./core_foods.json",
  "./brand_foods.json",
  "./restaurant_foods.json",
  "./ingredients_foods.json",
  "./custom_recipes.json",
  "./serving_units.json",
  "./food_categories.json",
  "./manifest.json",
  "./icon.PNG",
  "./macro-butler-logo.svg"
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
  const req = event.request;
  const url = new URL(req.url);

  if (url.hostname.includes("openfoodfacts.org")) {
    event.respondWith(fetch(req));
    return;
  }

  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
      return res;
    }).catch(() => caches.match("./index.html") || caches.match("./")));
    return;
  }

  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
    return res;
  }).catch(()=>cached)));
});
