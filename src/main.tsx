import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize OneSignal and expose the ready-promise on window so components
// can await it before calling subscription APIs.
(window as any).__oneSignalReady = (async () => {
  try {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID as string,
      allowLocalhostAsSecureOrigin: true,
      autoResubscribe: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notifyButton: { enable: false, prenotify: false, showCredit: false, text: {} as any },
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerParam: { scope: '/' },
    });
    return OneSignal;
  } catch {
    return null; // OneSignal unavailable — app works fine without it
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
