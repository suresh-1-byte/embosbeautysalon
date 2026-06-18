import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Render the app immediately — don't block on service worker
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker after the page has loaded and is idle
// This prevents SW registration from competing with first render
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.getRegistrations().then(async (regs) => {
      for (const reg of regs) {
        const url = reg.active?.scriptURL ?? reg.installing?.scriptURL ?? '';
        if (!url.includes('firebase-messaging-sw.js')) {
          await reg.unregister();
        }
      }
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .catch(() => {});
    });
  };

  // Use requestIdleCallback if available, otherwise defer with setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW, { timeout: 5000 });
  } else {
    window.addEventListener('load', () => setTimeout(registerSW, 3000));
  }
}
