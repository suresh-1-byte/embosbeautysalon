import { useEffect, useRef, useState } from 'react';

export function useNotifications() {
  const prompted = useRef(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (prompted.current) return;
    prompted.current = true;

    const timer = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setShowBanner(false);
    try {
      await Notification.requestPermission();
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  const handleDismiss = () => setShowBanner(false);

  return { showBanner, handleAllow, handleDismiss };
}
