self.skipWaiting();
self.addEventListener('push', function(ev) {
  console.log('[Service Worker] Received a push message\n');
  let payload = ev.data.json()
  console.log(payload)
  if (payload.notification && payload.notification.title) {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: 'arnav.png',
      badge: 'arnav.png',
      image: payload.notification.image,
      data: payload.data
    })
  } else {
    console.log('[Service Worker] No notification payload, not showing notification')
  }
});
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('slcodepreview').then(function(cache) {
     return cache.addAll([
       '/',
       'index.html',
       'res/images/maskable/icon_192.png',
       'res/images/maskable/icon_512.png',
       'res/images/maskable/icon_384.png',
       'res/images/maskable/icon_128.png',
       'res/images/maskable/icon_96.png',
       'res/images/maskable/icon_72.png',
       'res/images/maskable/icon_48.png',
       'res/images/maskable/icon.png',
       'res/images/icon-192x192.png',
       'res/images/icon-256x256.png',
       'res/images/icon-384x384.png',
       'res/images/icon-512x512.png',
       'res/images/icon-192x192.png',
       'res/css/style.css',
       'res/js/script.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
