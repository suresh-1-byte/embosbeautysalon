// Firebase Cloud Messaging Service Worker — EMBOS Beauty Salon
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDY5mK4fg8_tascdPS4xwrIc_wpIscVDAI',
  projectId: 'gen-lang-client-0013050577',
  messagingSenderId: '710020479709',
  appId: '1:710020479709:web:8a86048301de2f25753934',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'EMBOS Beauty Salon';
  const body  = payload.notification?.body  ?? '';
  const url   = payload.data?.url ?? '/';
  self.registration.showNotification(title, {
    body,
    icon: '/logo.jpeg',
    badge: '/logo.jpeg',
    data: { url },
    vibrate: [200, 100, 200],
    tag: 'embos-push',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
