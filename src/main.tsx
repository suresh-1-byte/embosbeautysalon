import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize OneSignal safely — errors here must never crash the app
try {
  const OneSignal = (await import('react-onesignal')).default;
  OneSignal.init({
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID as string,
    allowLocalhostAsSecureOrigin: true,
    autoResubscribe: true,
    notifyButton: { enable: false, prenotify: false, showCredit: false, text: {} },
    serviceWorkerParam: { scope: '/' },
  }).catch(() => {/* non-fatal */});
} catch {
  // OneSignal unavailable — app works fine without it
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
