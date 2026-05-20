// EMBOS Beauty Salon — Web Push Service Worker
// Handles background push notifications using the native Web Push API (no Firebase)

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Receive push notification
self.addEventListener('push', (event) => {
  let data = { title: 'EMBOS Beauty Salon', body: 'You have a new update!', url: '/' };
  
  try {
    if (event.data) {
      const text = event.data.text();
      // Try JSON first
      try {
        data = { ...data, ...JSON.parse(text) };
      } catch {
        // If not JSON, use as body text
        data.body = text;
      }
    }
  } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.jpeg',
      badge: '/logo.jpeg',
      data: { url: data.url },
      vibrate: [200, 100, 200],
      requireInteraction: false,
    })
  );
});

// Click notification → open/focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});
