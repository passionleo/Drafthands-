// DraftHands PWA Service Worker
const CACHE_NAME = 'drafthands-pwa-v3';

// Core static assets to precache on installation (production/offline shell)
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png'
];

// Installation event - precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[DraftHands SW] Precache non-blocking notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation event - prune old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[DraftHands SW] Removing outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - safe network-first with graceful cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests and http/https schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // NEVER intercept Vite dev server internal assets, HMR, source files, or backend API routes
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/api/') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    url.pathname.includes('hot-update') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx')
  ) {
    return; // Pass straight to network without intercepting
  }

  // 1. Navigation requests (HTML pages) -> Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          // Return a minimal offline response rather than throwing
          return new Response(
            '<!doctype html><html><body style="background:#020617;color:#f8fafc;font-family:sans-serif;text-align:center;padding:40px;"><h2>DraftHands Offline</h2><p>Please check your connection and reload.</p><button onclick="window.location.reload()" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Reload</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Static public assets (images, icons, manifest) -> Cache-first with network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => {
          // Return empty fallback instead of null to prevent TypeError: Failed to convert value to 'Response'
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        });
      })
    );
    return;
  }
});
