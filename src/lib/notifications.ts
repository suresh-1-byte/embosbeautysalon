import { supabase } from './supabase';

/** Wraps a promise with a timeout. Resolves with null if it exceeds ms. */
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/**
 * Send a push notification to ALL OneSignal subscribers.
 */
export async function sendPushToAll(
  title: string,
  body: string,
  url = '/'
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await withTimeout(
      supabase.functions.invoke('send-push', { body: { title, body, url } }),
      15000
    );
    if (!result) return { success: false, error: 'Request timed out — try again' };
    const { data, error } = result;
    if (error) return { success: false, error: error.message };
    console.log('Push sent:', data);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Send bulk offer email to ALL email subscribers.
 * Called from Admin Push tab when sending a notification.
 */
export async function sendBulkOfferEmail(
  title: string,
  body: string,
  url = '/'
): Promise<{ success: boolean; sent?: number; error?: string }> {
  try {
    const result = await withTimeout(
      supabase.functions.invoke('send-email', {
        body: { type: 'bulk_offer', booking: { title, body, url } },
      }),
      15000
    );
    if (!result) return { success: false, error: 'Email timed out — try again' };
    const { data, error } = result;
    if (error) return { success: false, error: error.message };
    return { success: true, sent: data?.sent ?? 0 };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Send email notification via Resend (through Edge Function).
 * type: 'new_booking' → email to admin
 * type: 'booking_confirmed' → email to customer + admin
 */
export async function sendBookingEmail(
  type: 'new_booking' | 'booking_confirmed',
  booking: {
    name: string; phone: string; email: string;
    service: string; date: string; time_slot: string;
    location: string; notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await withTimeout(
      supabase.functions.invoke('send-email', { body: { type, booking } }),
      15000
    );
    if (!result) return { success: false, error: 'Email timed out — try again' };
    const { data, error } = result;
    if (error) return { success: false, error: error.message };
    console.log('Email sent:', data);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Show a local browser notification via the active service worker.
 */
export async function showLocalNotification(title: string, body: string): Promise<void> {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body, icon: '/logo.jpeg', badge: '/logo.jpeg',
      vibrate: [200, 100, 200], requireInteraction: false, tag: 'embos-notification',
    });
  } catch {
    try { new Notification(title, { body, icon: '/logo.jpeg' }); } catch {}
  }
}

/**
 * Send a Telegram message to ALL Telegram subscribers.
 */
export async function sendTelegramToAll(
  title: string,
  body: string,
  url = '/'
): Promise<{ success: boolean; sent?: number; error?: string }> {
  try {
    const result = await withTimeout(
      supabase.functions.invoke('send-telegram', { body: { title, body, url } }),
      15000
    );
    if (!result) return { success: false, error: 'Telegram timed out' };
    const { data, error } = result;
    if (error) return { success: false, error: error.message };
    return { success: true, sent: data?.sent ?? 0 };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
