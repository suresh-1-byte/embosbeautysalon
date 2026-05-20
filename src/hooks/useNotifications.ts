import { useEffect, useRef, useState } from 'react';
import OneSignal from 'react-onesignal';

export function useNotifications() {
  const prompted = useRef(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (prompted.current) return;
    prompted.current = true;

    const timer = setTimeout(async () => {
      try {
        const permission = await OneSignal.Notifications.permission;
        if (!permission) {
          setShowBanner(true);
        }
      } catch {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setShowBanner(false);
    try {
      await OneSignal.Notifications.requestPermission();
    } catch (err) {
      console.warn('OneSignal permission error:', err);
    }
  };

  const handleDismiss = () => setShowBanner(false);

  return { showBanner, handleAllow, handleDismiss };
}
