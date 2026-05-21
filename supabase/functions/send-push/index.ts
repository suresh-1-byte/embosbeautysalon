// Supabase Edge Function: send-push
// Sends Web Push notifications via VAPID using the web-push npm library
//
// Required secrets:
//   VAPID_PUBLIC_KEY   = BI0-mJbCgGV7YPXDOEYIUVhygUb8fyAPvmBYc8057nuuwuq_NZmn1kLRU7ZIqwIiu3TXYsWe0NmCOR2yLKWdwN8
//   VAPID_PRIVATE_KEY  = <your VAPID private key>
//   VAPID_SUBJECT      = mailto:sureshkathirvel601@gmail.com
//
// Deploy:
//   npx supabase functions deploy send-push --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck — Deno runtime

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://esm.sh/web-push@3.6.7';

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT     = Deno.env.get('VAPID_SUBJECT')     ?? 'mailto:sureshkathirvel601@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!VAPID_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: 'VAPID_PRIVATE_KEY secret not set.' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Set VAPID details once
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const { title, body, url = '/' } = await req.json();
    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'title and body are required' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all push subscriptions
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: subs, error: dbErr } = await sb
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth');

    if (dbErr) {
      return new Response(
        JSON.stringify({ error: dbErr.message }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    if (!subs || subs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No push subscribers yet' }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.stringify({ title, body, url });
    const expiredEndpoints: string[] = [];
    let sent = 0;

    // Send to all subscribers
    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
            { TTL: 86400 }
          );
          sent++;
        } catch (err: any) {
          console.error(`Failed for ${sub.endpoint}:`, err?.statusCode, err?.message);
          // 410 Gone or 404 = subscription expired, clean it up
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            expiredEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    // Remove expired subscriptions
    if (expiredEndpoints.length > 0) {
      await Promise.all(
        expiredEndpoints.map((ep) =>
          sb.from('push_subscriptions').delete().eq('endpoint', ep)
        )
      );
      console.log(`Removed ${expiredEndpoints.length} expired subscriptions`);
    }

    console.log(`Push sent to ${sent}/${subs.length} subscribers`);

    return new Response(
      JSON.stringify({ success: true, sent, total: subs.length }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('send-push error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
