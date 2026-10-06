// Minimal Service Worker for PWA installability
const CACHE_NAME = 'umut-unal-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser fetch normally, with basic fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
