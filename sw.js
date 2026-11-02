// Service Worker: holt die eigenen Dateien bei jedem Aufruf frisch vom Server.
// Ist kein Netz da, nimmt er die zuletzt geladene Version aus dem Cache.
const CACHE = 'wichtelbriefe-v1';
const DATEIEN = [
  './',
  './index.html',
  './styles.css',
  './favicon.svg',
  './apple-touch-icon.png',
  './js/app.js',
  './js/logik.js',
  './js/datenquelle.js',
  './js/checkliste.js',
  './js/config.js',
  './js/vorschau.js',
];

self.addEventListener('install', (ereignis) => {
  ereignis.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(DATEIEN)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (ereignis) => {
  ereignis.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (ereignis) => {
  const url = new URL(ereignis.request.url);
  // Apps Script und Google Fonts nicht anfassen, nur die eigenen Dateien.
  if (ereignis.request.method !== 'GET' || url.origin !== self.location.origin) return;
  ereignis.respondWith(
    fetch(ereignis.request)
      .then((antwort) => {
        const kopie = antwort.clone();
        caches.open(CACHE).then((cache) => cache.put(ereignis.request, kopie));
        return antwort;
      })
      .catch(() => caches.match(ereignis.request)),
  );
});
