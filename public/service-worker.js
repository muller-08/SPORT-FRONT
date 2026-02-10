/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'sport-app-v1.0.1';
const RUNTIME_CACHE = 'sport-app-runtime-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des fichiers essentiels');
        return cache.addAll(urlsToCache.filter(url => url !== '/static/css/main.css' && url !== '/static/js/main.js'))
          .catch((error) => {
            console.warn('[SW] Erreur lors du cache initial (normal en dev):', error);
            return Promise.resolve();
          });
      })
      .then(() => {
        console.log('[SW] Installation terminée - activation forcée');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée - prise de contrôle');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('chrome-extension://') ||
      event.request.url.includes('sockjs-node')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && 
            (response.type === 'basic' || response.type === 'cors')) {
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((error) => {
              console.error('[SW] Erreur mise en cache runtime:', error);
            });
        }

        return response;
      })
      .catch(() => {
        console.log('[SW] Réseau échoué, utilisation du cache pour:', event.request.url);
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Contenu non disponible hors ligne', {
              status: 503,
              statusText: 'Service indisponible',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING reçu');
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker chargé et prêt');