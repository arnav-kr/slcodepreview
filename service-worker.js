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
