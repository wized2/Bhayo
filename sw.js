/* Team Bhayo service worker: works offline, and only re-downloads what changed.
 *
 * - Shell, fonts, icons and avatars are saved on first visit (precache).
 * - Everything else on this site (photos, pages) is served from the saved copy instantly,
 *   then checked against the server in the background. An unchanged file costs one tiny
 *   "304 Not Modified" reply; a changed file replaces the saved copy for the next visit.
 * - Offline, navigation falls back to the saved page.
 * Bump VERSION only when you change the PRECACHE list below.
 */
const VERSION = 'v1';
const CACHE = 'bhayo-' + VERSION;
const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'fonts/plus-jakarta-sans.woff2',
  'fonts/material-symbols.woff2',
  'img/majid.jpg',
  'img/ajmal.jpg',
  'img/mubeen.jpg',
  'img/rashid.jpg',
  'img/umar.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('bhayo-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function revalidate(request, cache) {
  // no-cache = always ask the server, but it can answer 304 so nothing is re-downloaded
  return fetch(request, { cache: 'no-cache' }).then((res) => {
    if (res && res.status === 200 && res.type === 'basic') cache.put(request, res.clone());
    return res;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave third-party requests alone
  if (url.pathname.endsWith('/sw.js')) return;

  const isPage = req.mode === 'navigate';
  const key = isPage ? new Request(new URL('index.html', self.registration.scope).href) : req;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(key, { ignoreSearch: true });
    if (hit) {
      // saved copy now; refresh in the background (never blocks, never throws)
      event.waitUntil(revalidate(isPage ? key : req, cache).catch(() => {}));
      return hit;
    }
    try {
      return await revalidate(isPage ? key : req, cache);
    } catch (err) {
      if (isPage) {
        const fallback = await cache.match('index.html');
        if (fallback) return fallback;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});

// The page asks us to save all gallery photos so they work offline too.
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'warm' || !Array.isArray(data.urls)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const u of data.urls) {
      try {
        const url = new URL(u, self.registration.scope);
        if (url.origin !== self.location.origin) continue;
        if (await cache.match(url.href)) continue;
        const res = await fetch(url.href);
        if (res.status === 200) await cache.put(url.href, res);
      } catch (e) { /* offline or missing: try again next visit */ }
    }
  })());
});
