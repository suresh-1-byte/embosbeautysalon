import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type PermissionState = 'default' | 'granted' | 'denied' | 'loading';

export interface FCMSubscriptionState {
  permission: PermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

const FCM_VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY as string;

async function getFCMToken(): Promise<string | null> {
  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getMessaging, getToken } = await import('firebase/messaging');

    const firebaseConfig = {
      apiKey:            import.meta.env.VITE_FCM_API_KEY,
      authDomain:        import.meta.env.VITE_FCM_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FCM_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FCM_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FCM_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FCM_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js', { scope: '/' }
      ),
    });

    return token ?? null;
  } catch (err) {
    console.warn('FCM getToken error:', err);
    return null;
  }
}

export function useFCMSubscription(): FCMSubscriptionState {
  const [permission, setPermission] = useState<PermissionState>('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!('Notification' in window)) { setPermission('denied'); return; }
    const perm = Notification.permission as PermissionState;
    setPermission(perm);
    setIsSubscribed(perm === 'granted');
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const subscribe = useCallback(async () => {
    if (!('Notification' in window)) return;
    setIsLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as PermissionState);
      if (perm !== 'granted') return;

      const token = await getFCMToken();
      if (!token) { console.warn('No FCM token received'); return; }

      // Save token to Supabase
      await supabase.from('push_subscriptions').upsert(
        { endpoint: token, p256dh: 'fcm', auth: 'fcm' },
        { onConflict: 'endpoint' }
      );

      setIsSubscribed(true);
    } catch (err) {
      console.warn('FCM subscribe error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const { getApps } = await import('firebase/app');
      const { getMessaging, getToken, deleteToken } = await import('firebase/messaging');
      if (getApps().length > 0) {
        const messaging = getMessaging(getApps()[0]);
        const token = await getToken(messaging, { vapidKey: FCM_VAPID_KEY });
        if (token) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', token);
          await deleteToken(messaging);
        }
      }
      setIsSubscribed(false);
    } catch (err) {
      console.warn('FCM unsubscribe error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}
