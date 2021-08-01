self.skipWaiting();
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('slcodepreview').then(function(cache) {
     return cache.addAll([
       './',
       'https://cdn.jsdelivr.net/gh/AssassinAguilar/Alertism/dist/V1.0.0/main.js',
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
