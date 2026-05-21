// Supabase Edge Function: send-push
// Sends push notifications via Firebase Cloud Messaging (FCM) V1 API
//
// Required secrets:
//   FCM_PROJECT_ID   = gen-lang-client-0013050577
//   FCM_CLIENT_EMAIL = firebase-adminsdk-fbsvc@gen-lang-client-0013050577.iam.gserviceaccount.com
//   FCM_PRIVATE_KEY  = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
//
// Deploy:
//   npx supabase functions deploy send-push --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FCM_PROJECT_ID   = Deno.env.get('FCM_PROJECT_ID')   ?? '';
const FCM_CLIENT_EMAIL = Deno.env.get('FCM_CLIENT_EMAIL') ?? '';
const FCM_PRIVATE_KEY  = Deno.env.get('FCM_PRIVATE_KEY')  ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── JWT for Google OAuth2 (service account) ───────────────────────────────────
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const payload = btoa(JSON.stringify({
    iss: FCM_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');

  const sigInput = `${header}.${payload}`;

  // Import RSA private key
  const pemBody = FCM_PRIVATE_KEY
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '')
    .trim();

  const keyBytes = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(sigInput)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');

  const jwt = `${sigInput}.${sigB64}`;

  // Exchange JWT for access token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── Send one FCM notification ─────────────────────────────────────────────────
async function sendFCM(token: string, title: string, body: string, url: string, accessToken: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          webpush: {
            notification: {
              title, body,
              icon: 'https://embosbeautysalon.in/logo.jpeg',
              badge: 'https://embosbeautysalon.in/logo.jpeg',
              click_action: url,
            },
            fcm_options: { link: url },
          },
          data: { url },
        },
      }),
    }
  );

  if (res.ok) return { ok: true };
  const err = await res.json().catch(() => ({}));
  return { ok: false, error: err?.error?.message ?? `HTTP ${res.status}` };
}

// ── Main ──────────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!FCM_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: 'FCM_PRIVATE_KEY secret not set.' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const { title, body, url = 'https://embosbeautysalon.in' } = await req.json();
    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'title and body are required' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Get FCM access token
    const accessToken = await getAccessToken();

    // Fetch all FCM tokens from Supabase
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: subs, error: dbErr } = await sb
      .from('push_subscriptions')
      .select('endpoint')
      .eq('p256dh', 'fcm'); // FCM tokens have p256dh='fcm'

    if (dbErr) {
      return new Response(
        JSON.stringify({ error: dbErr.message }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    if (!subs || subs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No FCM subscribers yet' }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const results = await Promise.all(
      subs.map(s => sendFCM(s.endpoint, title, body, url, accessToken))
    );

    const sent   = results.filter(r => r.ok).length;
    const errors = results.filter(r => !r.ok).map(r => r.error);

    // Clean up invalid tokens
    const invalid = subs.filter((_, i) =>
      results[i].error?.includes('UNREGISTERED') ||
      results[i].error?.includes('INVALID_ARGUMENT')
    );
    if (invalid.length > 0) {
      await Promise.all(invalid.map(s =>
        sb.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
      ));
    }

    console.log(`FCM push: ${sent}/${subs.length} sent`, errors.length ? errors : '');

    return new Response(
      JSON.stringify({ success: true, sent, total: subs.length, errors }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('send-push error:', String(err));
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
