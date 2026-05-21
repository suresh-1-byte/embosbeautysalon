import { useState, useEffect, useCallback } from 'react';

export type PermissionState = 'default' | 'granted' | 'denied' | 'loading';

export interface OneSignalState {
  permission: PermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

/** Wait for OneSignal to finish initialising (set up in main.tsx) */
async function getOneSignal() {
  try {
    const ready = (window as any).__oneSignalReady;
    if (ready) await ready;
    const OneSignal = (await import('react-onesignal')).default;
    return OneSignal;
  } catch {
    return null;
  }
}

export function useOneSignal(): OneSignalState {
  const [permission, setPermission] = useState<PermissionState>('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      // Native browser permission is the primary source of truth
      if ('Notification' in window) {
        const nativePerm = Notification.permission as PermissionState;
        setPermission(nativePerm);
        setIsSubscribed(nativePerm === 'granted');
      }

      // Refine with OneSignal's actual opted-in state
      const OneSignal = await getOneSignal();
      if (OneSignal) {
        // optedIn is a plain boolean property, NOT a Promise — do not await it
        const optedIn = OneSignal.User.PushSubscription.optedIn;
        if (optedIn !== undefined && optedIn !== null) {
          setIsSubscribed(!!optedIn);
        }
      }
    } catch {
      if ('Notification' in window) {
        setPermission(Notification.permission as PermissionState);
      } else {
        setPermission('denied');
      }
    }
  }, []);

  useEffect(() => {
    // Wait for OneSignal init then read state
    const timer = setTimeout(refresh, 1500);
    return () => clearTimeout(timer);
  }, [refresh]);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      // Wait for OneSignal to be ready before requesting permission
      const OneSignal = await getOneSignal();

      if (OneSignal) {
        // Let OneSignal handle the full permission + registration flow
        await OneSignal.Notifications.requestPermission();
      } else {
        // Fallback: native browser permission only
        await Notification.requestPermission();
      }

      await new Promise((r) => setTimeout(r, 1000));
      await refresh();
    } catch (err) {
      console.warn('OneSignal subscribe error:', err);
      await refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const OneSignal = await getOneSignal();
      if (OneSignal) {
        await OneSignal.User.PushSubscription.optOut();
      }
      await refresh();
    } catch (err) {
      console.warn('OneSignal unsubscribe error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}
