/* ═══════════════════════════════════════════════
   MEGANE_LEARN — Service Worker (sw.js)
   PWA complète - Cache stratégique pour performances optimales
   Fonctionne hors ligne, démarrage instantané
═══════════════════════════════════════════════ */

const CACHE_NAME = 'megane-learn-v2';
const OFFLINE_URL = '/offline.html';

// Ressources à mettre en cache dès l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/manifest.json',
  '/offline.html'
];

// Ressources optionnelles (chargées au besoin)
const OPTIONAL_URLS = [
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.gstatic.com/'
];

// ──────────────────────────────────────────────
// INSTALLATION - Pré-cache des ressources essentielles
// ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pré-cache des ressources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Force l'activation immédiate du nouveau SW
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Erreur de pré-cache:', err);
      })
  );
});

// ──────────────────────────────────────────────
// ACTIVATION - Nettoyage des anciens caches
// ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prend le contrôle de toutes les pages ouvertes
      return self.clients.claim();
    })
  );
});

// ──────────────────────────────────────────────
// STRATÉGIE DE CACHE OPTIMISÉE
// ──────────────────────────────────────────────
// - Cache First pour les assets statiques (démarrage rapide)
// - Network First pour les données (si besoin)
// - Stale While Revalidate pour les polices
// ──────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorer les requêtes non GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes vers les API externes non essentielles
  if (url.pathname.includes('/analytics') || url.pathname.includes('/tracking')) {
    return;
  }
  
  // ── STRATÉGIE 1: Cache First pour les assets locaux
  // HTML, CSS, JS, manifest, icônes locales
  if (PRECACHE_URLS.some(path => event.request.url.includes(path)) ||
      event.request.url.includes('/css/') ||
      event.request.url.includes('/js/') ||
      event.request.url.includes('/icons/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Retour du cache immédiatement
            return cachedResponse;
          }
          // Si pas dans cache, récupérer du réseau et mettre en cache
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Si hors ligne et pas dans cache, retourner page offline
              if (event.request.destination === 'document') {
                return caches.match(OFFLINE_URL);
              }
              return new Response('Offline', { status: 503 });
            });
        })
    );
    return;
  }
  
  // ── STRATÉGIE 2: Stale While Revalidate pour les polices et CDN
  // Récupère du cache immédiatement, met à jour en arrière-plan
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.log('[SW] Erreur réseau pour ressource CDN:', err);
            // Si pas de cache et erreur, retourner null
            return null;
          });
        
        // Retourne la réponse du cache si disponible, sinon attend le réseau
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetchPromise;
      })
    );
    return;
  }
  
  // ── STRATÉGIE 3: Network First pour les autres requêtes
  // Essaie le réseau d'abord, fallback sur cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mettre en cache les réponses valides
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback sur le cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si c'est une requête de document, retourner la page offline
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }
        
        return new Response('Ressource non disponible hors ligne', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// ──────────────────────────────────────────────
// GESTION DES NOTIFICATIONS (optionnel)
// ──────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nouvelle mise à jour disponible',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'MEGANE_LEARN', options)
  );
});

// ──────────────────────────────────────────────
// MISE À JOUR - Notification de nouvelle version
// ──────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Envoi d'un message aux clients pour indiquer qu'une mise à jour est disponible
self.addEventListener('controllerchange', () => {
  console.log('[SW] Nouveau contrôleur actif');
});