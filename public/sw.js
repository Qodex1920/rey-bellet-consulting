const CACHE_NAME = 'site-static-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/main.js',
  '/favicon/favicon.ico',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Mise en cache des ressources');
        return cache.addAll(ASSETS);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mise en cache de la nouvelle ressource
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Utilisation du cache si hors ligne
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Retourne une page d'erreur personnalisée si la ressource n'est pas en cache
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
}); 