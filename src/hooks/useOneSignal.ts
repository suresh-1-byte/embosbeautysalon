import { useState, useEffect, useCallback } from 'react';

export type PermissionState = 'default' | 'granted' | 'denied' | 'loading';

export interface OneSignalState {
  permission: PermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function useOneSignal(): OneSignalState {
  const [permission, setPermission] = useState<PermissionState>('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      // Use native Notification API as primary source of truth
      if ('Notification' in window) {
        const nativePerm = Notification.permission as PermissionState;
        setPermission(nativePerm);
        setIsSubscribed(nativePerm === 'granted');
      }
      // Try OneSignal on top — optional
      const OneSignal = (await import('react-onesignal')).default;
      const optedIn = await OneSignal.User.PushSubscription.optedIn;
      if (optedIn !== undefined) setIsSubscribed(!!optedIn);
    } catch {
      if ('Notification' in window) {
        setPermission(Notification.permission as PermissionState);
      } else {
        setPermission('denied');
      }
    }
  }, []);

  useEffect(() => {
    // Give OneSignal a moment to initialise before reading state
    const timer = setTimeout(refresh, 1200);
    return () => clearTimeout(timer);
  }, [refresh]);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      // Request native browser permission first
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        // Then register with OneSignal
        try {
          await OneSignal.Notifications.requestPermission();
        } catch {
          // OneSignal may throw on localhost — native permission is enough
        }
      }
      await new Promise((r) => setTimeout(r, 800));
      await refresh();
    } catch (err) {
      console.warn('OneSignal subscribe error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      await OneSignal.User.PushSubscription.optOut();
      await refresh();
    } catch (err) {
      console.warn('OneSignal unsubscribe error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}
