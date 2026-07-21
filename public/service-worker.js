// Trip Planner service worker — installable + offline after one visit.
// (Named service-worker.js, NOT sw.js: "sw" is the Southwest trip's slug.)
//
// Strategy:
//  - only same-origin GETs are handled; the research API lives on another
//    origin, so /api/* is structurally excluded (guarded explicitly anyway —
//    live data must never be served stale from this cache);
//  - /_astro/ assets are content-hashed and immutable -> cache-first;
//  - pages and everything else -> network-first with cache fallback, so a
//    fresh deploy always wins while a plane ride still gets the last copy.
const CACHE = "trip-planner-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.includes("/api/")) return;

  if (url.pathname.includes("/_astro/")) {
    event.respondWith(
      (async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
        return res;
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await caches.match(req);
        if (hit) return hit;
        throw err;
      }
    })(),
  );
});
