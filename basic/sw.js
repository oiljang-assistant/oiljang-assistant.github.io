const CACHE_NAME = 'oiljang-basic-remote-v1';
const URLS_TO_CACHE = ['/basic/', '/basic/index.html', '/basic/icon-192.png', '/basic/icon-512.png', '/basic/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
