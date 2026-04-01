// =============================================
// SERVICE WORKER - MEGANE_LEARN
// Mode hors ligne optimisé
// =============================================

const CACHE_NAME = 'megane-learn-v3';
const OFFLINE_URL = '/megane_convert/';

// Fichiers à mettre en cache (version hors ligne complète)
const urlsToCache = [
  '/megane_convert/',
  '/megane_convert/index.html',
  '/megane_convert/css/style.css',
  '/megane_convert/js/script.js',
  '/megane_convert/manifest.json',
  '/megane_convert/icons/icon-192.png',
  '/megane_convert/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// =============================================
// INSTALLATION : cache des fichiers essentiels
// =============================================
self.addEventListener('install', event => {
  console.log('[SW] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[SW] Erreur de cache:', err))
  );
  // Force l'activation immédiate du nouveau SW
  self.skipWaiting();
});

// =============================================
// ACTIVATION : nettoyage des anciens caches
// =============================================
self.addEventListener('activate', event => {
  console.log('[SW] Activation');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Suppression ancien cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  // Prend le contrôle immédiatement
  return self.clients.claim();
});

// =============================================
// INTERCEPTION DES REQUÊTES : stratégie "Cache puis réseau"
// =============================================
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Stratégie spéciale pour les fichiers locaux (hors ligne prioritaire)
  if (url.includes('/megane_convert/') && !url.includes('chrome-extension')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('[SW] Cache hit:', url);
            return response;
          }
          // Si pas en cache, on va chercher sur le réseau
          return fetch(event.request)
            .then(networkResponse => {
              // On met en cache la nouvelle ressource pour la prochaine fois
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return networkResponse;
            })
            .catch(err => {
              console.warn('[SW] Échec réseau, fallback:', url);
              // Fallback vers la page d'accueil si ressource introuvable
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
              }
              return new Response('Contenu non disponible hors ligne', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } 
  // Pour les ressources externes (Google Fonts, FontAwesome)
  else if (url.includes('fonts.googleapis.com') || url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request)
            .then(networkResponse => {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return networkResponse;
            });
        })
    );
  }
  // Pour tout le reste (requêtes non gérées, on laisse passer)
  else {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response('Ressource non disponible hors ligne', {
            status: 503
          });
        })
    );
  }
});

// =============================================
// GESTION DES NOTIFICATIONS (optionnel)
// =============================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
