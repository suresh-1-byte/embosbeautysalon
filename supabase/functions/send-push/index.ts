// Supabase Edge Function: send-push
// Sends Web Push notifications via VAPID (no third-party service needed)
//
// Required secrets (set via Supabase dashboard or CLI):
//   VAPID_PUBLIC_KEY   = BI0-mJbCgGV7YPXDOEYIUVhygUb8fyAPvmBYc8057nuuwuq_NZmn1kLRU7ZIqwIiu3TXYsWe0NmCOR2yLKWdwN8
//   VAPID_PRIVATE_KEY  = <your VAPID private key>
//   VAPID_SUBJECT      = mailto:sureshkathirvel601@gmail.com
//
// Deploy:
//   npx supabase functions deploy send-push --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck — Deno runtime

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT     = Deno.env.get('VAPID_SUBJECT')     ?? 'mailto:admin@embosbeautysalon.in';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── VAPID helpers ─────────────────────────────────────────────────────────────

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function uint8ArrayToBase64Url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function buildVapidHeaders(audience: string): Promise<Record<string, string>> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 12 * 3600; // 12 hours

  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = { aud: audience, exp, sub: VAPID_SUBJECT };

  const encode = (obj: object) =>
    uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(obj)));

  const signingInput = `${encode(header)}.${encode(payload)}`;

  const privateKeyBytes = base64UrlToUint8Array(VAPID_PRIVATE_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${uint8ArrayToBase64Url(new Uint8Array(signature))}`;

  return {
    Authorization: `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
    'Content-Type': 'application/octet-stream',
    TTL: '86400',
  };
}

async function sendToSubscription(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: string
): Promise<{ ok: boolean; status: number; endpoint: string }> {
  try {
    const url = new URL(sub.endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const headers = await buildVapidHeaders(audience);

    // Encrypt payload using Web Push encryption (RFC 8291)
    const payloadBytes = new TextEncoder().encode(payload);

    // Generate client keys
    const serverKeyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
    );
    const serverPublicKeyRaw = new Uint8Array(
      await crypto.subtle.exportKey('raw', serverKeyPair.publicKey)
    );

    const clientPublicKey = await crypto.subtle.importKey(
      'raw', base64UrlToUint8Array(sub.p256dh),
      { name: 'ECDH', namedCurve: 'P-256' }, false, []
    );

    const sharedSecret = new Uint8Array(
      await crypto.subtle.deriveBits(
        { name: 'ECDH', public: clientPublicKey },
        serverKeyPair.privateKey, 256
      )
    );

    const authBytes = base64UrlToUint8Array(sub.auth);
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // HKDF to derive content encryption key and nonce
    const prk = await crypto.subtle.importKey('raw', sharedSecret, { name: 'HKDF' }, false, ['deriveBits']);

    const authInfo = new TextEncoder().encode('Content-Encoding: auth\0');
    const authIkm = new Uint8Array(
      await crypto.subtle.deriveBits(
        { name: 'HKDF', hash: 'SHA-256', salt: authBytes, info: authInfo },
        prk, 256
      )
    );

    const keyInfo = new Uint8Array([
      ...new TextEncoder().encode('Content-Encoding: aesgcm\0'),
      0x41, // 'A'
      ...serverPublicKeyRaw,
      ...base64UrlToUint8Array(sub.p256dh),
    ]);
    const nonceInfo = new Uint8Array([
      ...new TextEncoder().encode('Content-Encoding: nonce\0'),
      0x41,
      ...serverPublicKeyRaw,
      ...base64UrlToUint8Array(sub.p256dh),
    ]);

    const ikmKey = await crypto.subtle.importKey('raw', authIkm, { name: 'HKDF' }, false, ['deriveBits']);

    const contentKey = new Uint8Array(
      await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: keyInfo }, ikmKey, 128)
    );
    const nonce = new Uint8Array(
      await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: nonceInfo }, ikmKey, 96)
    );

    const aesKey = await crypto.subtle.importKey('raw', contentKey, { name: 'AES-GCM' }, false, ['encrypt']);

    // Pad payload
    const padded = new Uint8Array(2 + payloadBytes.length);
    padded.set(payloadBytes, 2);

    const encrypted = new Uint8Array(
      await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, padded)
    );

    // Build body: salt (16) + record size (4) + key length (1) + server public key (65) + encrypted
    const recordSize = new Uint8Array(4);
    new DataView(recordSize.buffer).setUint32(0, 4096, false);
    const keyLength = new Uint8Array([serverPublicKeyRaw.length]);

    const body = new Uint8Array([
      ...salt, ...recordSize, ...keyLength, ...serverPublicKeyRaw, ...encrypted,
    ]);

    const cryptoHeaders = {
      ...headers,
      'Content-Encoding': 'aesgcm',
      Encryption: `salt=${uint8ArrayToBase64Url(salt)}`,
      'Crypto-Key': `dh=${uint8ArrayToBase64Url(serverPublicKeyRaw)}`,
    };

    const res = await fetch(sub.endpoint, { method: 'POST', headers: cryptoHeaders, body });
    return { ok: res.ok, status: res.status, endpoint: sub.endpoint };
  } catch (err) {
    console.error('sendToSubscription error:', err);
    return { ok: false, status: 0, endpoint: sub.endpoint };
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!VAPID_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: 'VAPID_PRIVATE_KEY secret not set in Supabase Edge Function secrets.' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const { title, body, url = '/' } = await req.json();
    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'title and body are required' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all push subscriptions from Supabase
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

    // Send to all subscribers in parallel
    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );

    // Remove expired/invalid subscriptions (410 Gone or 404)
    const expired = results.filter((r) => r.status === 410 || r.status === 404);
    if (expired.length > 0) {
      await Promise.all(
        expired.map((r) => sb.from('push_subscriptions').delete().eq('endpoint', r.endpoint))
      );
    }

    const sent = results.filter((r) => r.ok).length;
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
