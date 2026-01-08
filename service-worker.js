const CACHE_NAME = 'sampleflow-v2'; // Bump this to v2 now
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// 1. Install & Force Activation
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the new service worker to become the active one immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Cleanup Old Caches (This kills the "Ghost" version)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch with Network-First fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
