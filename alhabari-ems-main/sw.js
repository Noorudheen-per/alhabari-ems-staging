// Al Habari EMS — Service Worker
// Strategy: network-first with NO browser cache for HTML (always load the latest
// deployment), cache-first for icons/images. JS & CSS are versioned via ?v= query strings.
const CACHE_NAME = "alhabari-v2";   // <-- bump this string (v2 -> v3 ...) on a release to purge old caches
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, Supabase, OpenAI, Anthropic calls (always network)
  if (request.method !== "GET") return;
  if (url.hostname.includes("supabase.co") || url.hostname.includes("openai.com") || url.hostname.includes("anthropic.com")) return;

  // Network-first, NO browser cache, for HTML — always show the latest deployment
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put("/index.html", copy));
          return resp;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
    );
    return;
  }

  // Cache-first for icons, images, manifest (JS & CSS are cache-busted via ?v=)
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
      if (resp.ok && url.origin === self.location.origin) {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, copy));
      }
      return resp;
    }).catch(() => cached))
  );
});
