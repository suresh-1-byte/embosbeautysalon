import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Unregister any old service workers (OneSignal, Firebase, VAPID) that conflict with Webpushr
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      const url = reg.active?.scriptURL ?? '';
      // Keep only the Webpushr service worker
      if (!url.includes('webpushr-sw.js')) {
        reg.unregister();
        console.log('Unregistered old SW:', url);
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
