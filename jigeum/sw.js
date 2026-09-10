// 지금 — 서비스워커
// 네트워크 우선. 인터넷이 되면 항상 최신을 가져오고, 안 되면 캐시로 연다.
// (캐시 우선으로 하면 고쳐서 올려도 폰에 옛날 화면이 계속 남는다)

const CACHE = 'jigeum-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', e => {
  // ⚠️ 'jigeum-' 로 시작하는 캐시만 지운다.
  // 같은 도메인에 오일장 폰앱이 같이 살고 있어서, 전부 지우면 그쪽 캐시까지 날아간다.
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(
        ks.filter(k => k.startsWith('jigeum-') && k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
