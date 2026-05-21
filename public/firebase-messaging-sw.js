// Firebase Cloud Messaging Service Worker
// EMBOS Beauty Salon & Studio

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDY5mK4fg8_tascdPS4xwrIc_wpIscVDAI',
  authDomain: 'gen-lang-client-0013050577.firebaseapp.com',
  projectId: 'gen-lang-client-0013050577',
  storageBucket: 'gen-lang-client-0013050577.firebasestorage.app',
  messagingSenderId: '710020479709',
  appId: '1:710020479709:web:8a86048301de2f25753934',
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
