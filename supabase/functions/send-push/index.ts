// Supabase Edge Function: send-push
// Native VAPID Web Push — no external libraries, pure Deno crypto.subtle
//
// Secrets required:
//   VAPID_PUBLIC_KEY   (base64url uncompressed P-256 public key, 87 chars)
//   VAPID_PRIVATE_KEY  (base64url P-256 private key, 43 chars)
//   VAPID_SUBJECT      (mailto: or https: URI)

// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT     = Deno.env.get('VAPID_SUBJECT')     ?? 'mailto:sureshkathirvel601@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── base64url helpers ─────────────────────────────────────────────────────────
const b64uDecode = (s: string): Uint8Array => {
  const pad = '='.repeat((4 - s.length % 4) % 4);
  return Uint8Array.from(atob((s + pad).replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
};
const b64uEncode = (buf: ArrayBuffer | Uint8Array): string =>
  btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// ── VAPID JWT ─────────────────────────────────────────────────────────────────
async function makeVapidJwt(audience: string): Promise<string> {
  const header  = b64uEncode(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64uEncode(new TextEncoder().encode(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 43200,
    sub: VAPID_SUBJECT,
  })));
  const sigInput = `${header}.${payload}`;

  const privKey = await importVapidPrivateKey();
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privKey,
    new TextEncoder().encode(sigInput)
  );
  // crypto.subtle returns raw R||S (64 bytes) for ECDSA — use directly
  return `${sigInput}.${b64uEncode(new Uint8Array(sig))}`;
}

async function importVapidPrivateKey(): Promise<CryptoKey> {
  const raw = VAPID_PRIVATE_KEY.trim();

  // Try JWK format first (if stored as JSON)
  if (raw.startsWith('{')) {
    return crypto.subtle.importKey(
      'jwk', JSON.parse(raw),
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, ['sign']
    );
  }

  // Try as base64url raw private key (32 bytes)
  const keyBytes = b64uDecode(raw);

  // Build JWK from raw key bytes + public key
  const pubBytes = b64uDecode(VAPID_PUBLIC_KEY);
  // pubBytes is uncompressed: 0x04 + x(32) + y(32)
  const x = b64uEncode(pubBytes.slice(1, 33));
  const y = b64uEncode(pubBytes.slice(33, 65));
  const d = b64uEncode(keyBytes.slice(0, 32));

  return crypto.subtle.importKey(
    'jwk',
    { kty: 'EC', crv: 'P-256', x, y, d, key_ops: ['sign'] },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
}

// ── AES-GCM Web Push encryption (RFC 8291 / aesgcm) ─────────────────────────
async function encryptPayload(
  sub: { p256dh: string; auth: string },
  plaintext: string
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const clientPublicKeyBytes = b64uDecode(sub.p256dh);
  const authBytes            = b64uDecode(sub.auth);
  const salt                 = crypto.getRandomValues(new Uint8Array(16));

  // Generate ephemeral server key pair
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
  );
  const serverPublicKey = new Uint8Array(
    await crypto.subtle.exportKey('raw', serverKeyPair.publicKey)
  );

  // Import client public key
  const clientPublicKey = await crypto.subtle.importKey(
    'raw', clientPublicKeyBytes, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  );

  // ECDH shared secret
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientPublicKey }, serverKeyPair.privateKey, 256
  );
  const sharedSecret = new Uint8Array(sharedBits);

  // PRK via HKDF-SHA-256 with auth as salt
  const prk = await hkdf(authBytes, sharedSecret,
    concat(new TextEncoder().encode('Content-Encoding: auth\0'), new Uint8Array(1)), 32);

  // Derive content encryption key (16 bytes) and nonce (12 bytes)
  const keyInfo   = buildInfo('aesgcm',   clientPublicKeyBytes, serverPublicKey);
  const nonceInfo = buildInfo('nonce',    clientPublicKeyBytes, serverPublicKey);

  const contentKey = await hkdf(salt, prk, keyInfo,   16);
  const nonce      = await hkdf(salt, prk, nonceInfo, 12);

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey('raw', contentKey, { name: 'AES-GCM' }, false, ['encrypt']);
  const padded  = concat(new Uint8Array(2), new TextEncoder().encode(plaintext)); // 2-byte padding length prefix
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, padded)
  );

  return { ciphertext: encrypted, salt, serverPublicKey };
}

function buildInfo(encoding: string, clientKey: Uint8Array, serverKey: Uint8Array): Uint8Array {
  const label = new TextEncoder().encode(`Content-Encoding: ${encoding}\0`);
  const prefix = new Uint8Array([0x41]); // 'A' — context type
  const clientLen = new Uint8Array(2); new DataView(clientLen.buffer).setUint16(0, clientKey.length);
  const serverLen = new Uint8Array(2); new DataView(serverLen.buffer).setUint16(0, serverKey.length);
  return concat(label, prefix, clientLen, clientKey, serverLen, serverKey);
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8
  ));
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) { out.set(a, offset); offset += a.length; }
  return out;
}

// ── Send one push notification ────────────────────────────────────────────────
async function sendOne(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const url      = new URL(sub.endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const jwt      = await makeVapidJwt(audience);

    const { ciphertext, salt, serverPublicKey } = await encryptPayload(sub, payload);

    // Build body: salt(16) + rs(4) + keylen(1) + serverPublicKey(65) + ciphertext
    const rs = new Uint8Array(4); new DataView(rs.buffer).setUint32(0, 4096);
    const body = concat(salt, rs, new Uint8Array([serverPublicKey.length]), serverPublicKey, ciphertext);

    const res = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        Authorization:      `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
        'Content-Type':     'application/octet-stream',
        'Content-Encoding': 'aesgcm',
        Encryption:         `salt=${b64uEncode(salt)}`,
        'Crypto-Key':       `dh=${b64uEncode(serverPublicKey)}`,
        TTL:                '86400',
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`Push failed ${res.status}:`, text.slice(0, 200));
      return { ok: false, status: res.status, error: `${res.status}: ${text.slice(0, 100)}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const msg = String(err);
    console.error('sendOne error:', msg);
    return { ok: false, status: 0, error: msg };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!VAPID_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: 'VAPID_PRIVATE_KEY secret not set.' }),
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
    const results = await Promise.all(subs.map(s => sendOne(s, payload)));

    const sent    = results.filter(r => r.ok).length;
    const errors  = results.filter(r => !r.ok).map(r => r.error).filter(Boolean);
    const expired = subs.filter((_, i) => results[i].status === 410 || results[i].status === 404);

    if (expired.length > 0) {
      await Promise.all(expired.map(s =>
        sb.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
      ));
    }

    console.log(`Push: ${sent}/${subs.length} delivered`);
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
