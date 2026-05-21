// Firebase Cloud Messaging Service Worker
// EMBOS Beauty Salon & Studio

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDrwIVXQUb-mcup4kFqLxJuIYsjo-b-AVU',
  authDomain: 'totemic-fulcrum-462908-k8.firebaseapp.com',
  projectId: 'gen-lang-client-0013050577',
  storageBucket: 'totemic-fulcrum-462908-k8.firebasestorage.app',
  messagingSenderId: '722488200636',
  appId: '1:722488200636:web:7f1c7357f2c88504476fb9',
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Background push received:', payload);

  const { title, body, icon } = payload.notification ?? {};
  const url = payload.data?.url ?? '/';

  self.registration.showNotification(title ?? 'EMBOS Beauty Salon', {
    body: body ?? '',
    icon: icon ?? '/logo.jpeg',
    badge: '/logo.jpeg',
    data: { url },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: 'embos-push',
  });
});

// Click → open/focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) return client.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});
