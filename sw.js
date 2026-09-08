const CACHE = "lrra-sms-v2";
const CORE = ["index.html","admin.html","teacher.html","parent.html","hr.html","transport.html","finance.html","assets/css/style.css","assets/js/data.js","assets/js/app.js","manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  // Network-first: always try the latest deployed file first (so new pushes
  // show up immediately for everyone online), falling back to the cached
  // copy only if the network request fails (offline use).
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
