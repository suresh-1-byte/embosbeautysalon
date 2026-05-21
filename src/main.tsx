import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register the Web Push service worker and unregister any old ones
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (regs) => {
    for (const reg of regs) {
      const url = reg.active?.scriptURL ?? reg.installing?.scriptURL ?? '';
      if (!url.includes('/sw.js')) {
        await reg.unregister();
        console.log('Removed old SW:', url);
      }
    }
    // Register our VAPID service worker
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
