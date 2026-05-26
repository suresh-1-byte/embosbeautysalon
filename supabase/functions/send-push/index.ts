// Supabase Edge Function: send-push
// Uses Firebase Admin SDK (npm:firebase-admin) for reliable FCM delivery
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FCM_PROJECT_ID      = Deno.env.get('FCM_PROJECT_ID')      ?? '';
const FCM_CLIENT_EMAIL    = Deno.env.get('FCM_CLIENT_EMAIL')    ?? '';
const FCM_PRIVATE_KEY_B64 = Deno.env.get('FCM_PRIVATE_KEY_B64') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OAuth2 access token using Google's token endpoint
// Uses fetch-based JWT signing compatible with Deno
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Build JWT header and payload
  const enc = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const header  = enc({ alg: 'RS256', typ: 'JWT' });
  const payload = enc({
    iss: FCM_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });

  const signingInput = `${header}.${payload}`;

  console.log('FCM_PRIVATE_KEY_B64 length:', FCM_PRIVATE_KEY_B64.length);
  
  const der = Uint8Array.from(atob(FCM_PRIVATE_KEY_B64), c => c.charCodeAt(0));
  console.log('DER key length:', der.length);

  const key = await crypto.subtle.importKey(
    'pkcs8',
    der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

  const jwt = `${signingInput}.${sigB64}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function sendFCMv1(token: string, title: string, body: string, url: string, accessToken: string): Promise<{ok:boolean;error?:string}> {
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
            },
            fcm_options: {
              link: url.startsWith('http') ? url : `https://embosbeautysalon.in${url}`,
            },
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { title, body, url = '/' } = await req.json();
    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: subs, error: dbErr } = await sb
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth');

    if (dbErr) {
      return new Response(JSON.stringify({ error: dbErr.message }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No subscribers' }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Get access token
    let accessToken: string | null = null;
    let tokenError: string | null = null;
    try {
      accessToken = await getAccessToken();
    } catch (e) {
      tokenError = String(e);
      console.error('Access token error:', tokenError);
    }

    const targetUrl = url.startsWith('http') ? url : `https://embosbeautysalon.in${url}`;
    let sent = 0;
    const errors: string[] = [];

    if (accessToken) {
      await Promise.all(subs.map(async (sub) => {
        // FCM v1 tokens (from Firebase getToken()) are stored as endpoint with p256dh='fcm-v1'
        if (sub.p256dh === 'fcm-v1') {
          const result = await sendFCMv1(sub.endpoint, title, body, targetUrl, accessToken!);
          if (result.ok) {
            sent++;
            console.log('FCM v1 sent ✅');
          } else {
            errors.push(result.error ?? 'FCM error');
            console.error('FCM v1 error:', result.error);
            // Clean up invalid tokens
            if (result.error?.includes('UNREGISTERED') || result.error?.includes('NOT_FOUND')) {
              await sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
            }
          }
        }
      }));
    }

    console.log(`Push: ${sent}/${subs.length} sent`);
    return new Response(
      JSON.stringify({ success: true, sent, total: subs.length, errors, tokenError }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('send-push error:', String(e));
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
