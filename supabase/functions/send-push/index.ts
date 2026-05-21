// Supabase Edge Function: send-push
// Native VAPID Web Push — pure Deno crypto, no external libraries
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT     = Deno.env.get('VAPID_SUBJECT')     ?? 'mailto:sureshkathirvel601@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function b64u(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function fromb64u(s: string): Uint8Array {
  const p = '='.repeat((4 - s.length % 4) % 4);
  return Uint8Array.from(atob((s+p).replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0));
}

async function importPrivateKey(): Promise<CryptoKey> {
  // VAPID_PRIVATE_KEY is a raw 32-byte P-256 scalar in base64url
  // VAPID_PUBLIC_KEY is an uncompressed P-256 point (0x04 + x + y) in base64url
  const privBytes = fromb64u(VAPID_PRIVATE_KEY);
  const pubBytes  = fromb64u(VAPID_PUBLIC_KEY);
  // pubBytes[0] = 0x04 (uncompressed), then 32 bytes x, 32 bytes y
  const x = b64u(pubBytes.slice(1, 33));
  const y = b64u(pubBytes.slice(33, 65));
  const d = b64u(privBytes.slice(0, 32));
  return crypto.subtle.importKey(
    'jwk',
    { kty:'EC', crv:'P-256', x, y, d, key_ops:['sign'] },
    { name:'ECDSA', namedCurve:'P-256' },
    false, ['sign']
  );
}

async function makeVapidJwt(audience: string): Promise<string> {
  const now = Math.floor(Date.now()/1000);
  const hdr = b64u(new TextEncoder().encode(JSON.stringify({typ:'JWT',alg:'ES256'})));
  const pld = b64u(new TextEncoder().encode(JSON.stringify({aud:audience,exp:now+43200,sub:VAPID_SUBJECT})));
  const msg = `${hdr}.${pld}`;
  const key = await importPrivateKey();
  const sig = await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'}, key, new TextEncoder().encode(msg));
  return `${msg}.${b64u(new Uint8Array(sig))}`;
}

// RFC 8291 aesgcm encryption
async function encrypt(sub: {p256dh:string;auth:string}, plaintext: string) {
  const clientPub = fromb64u(sub.p256dh);
  const authSalt  = fromb64u(sub.auth);
  const salt      = crypto.getRandomValues(new Uint8Array(16));

  const serverKP = await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
  const serverPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverKP.publicKey));

  const clientKey = await crypto.subtle.importKey('raw',clientPub,{name:'ECDH',namedCurve:'P-256'},false,[]);
  const shared    = new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:clientKey},serverKP.privateKey,256));

  // PRK = HKDF-SHA256(salt=auth, ikm=shared, info="Content-Encoding: auth\0")
  const prk = await hkdf(authSalt, shared, concat(te('Content-Encoding: auth\0'), new Uint8Array(1)), 32);

  const keyInfo   = buildInfo('aesgcm',   clientPub, serverPubRaw);
  const nonceInfo = buildInfo('nonce',    clientPub, serverPubRaw);
  const cek   = await hkdf(salt, prk, keyInfo,   16);
  const nonce = await hkdf(salt, prk, nonceInfo, 12);

  const aesKey = await crypto.subtle.importKey('raw',cek,{name:'AES-GCM'},false,['encrypt']);
  const padded = concat(new Uint8Array(2), te(plaintext));
  const ct     = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce},aesKey,padded));

  const rs = new Uint8Array(4); new DataView(rs.buffer).setUint32(0,4096,false);
  const body = concat(salt, rs, new Uint8Array([serverPubRaw.length]), serverPubRaw, ct);
  return { body, salt, serverPubRaw };
}

function buildInfo(enc: string, clientPub: Uint8Array, serverPub: Uint8Array): Uint8Array {
  const label = te(`Content-Encoding: ${enc}\0`);
  const cl = new Uint8Array(2); new DataView(cl.buffer).setUint16(0,clientPub.length,false);
  const sl = new Uint8Array(2); new DataView(sl.buffer).setUint16(0,serverPub.length,false);
  return concat(label, new Uint8Array([0x41]), cl, clientPub, sl, serverPub);
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, len: number): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey('raw',ikm,{name:'HKDF'},false,['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},k,len*8));
}

function concat(...a: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(a.reduce((n,x)=>n+x.length,0));
  let i=0; for(const x of a){out.set(x,i);i+=x.length;} return out;
}
const te = (s: string) => new TextEncoder().encode(s);

async function sendOne(sub: {endpoint:string;p256dh:string;auth:string}, payload: string): Promise<{ok:boolean;status:number;error?:string}> {
  try {
    const url = new URL(sub.endpoint);
    const aud = `${url.protocol}//${url.host}`;
    const jwt = await makeVapidJwt(aud);
    const { body, salt, serverPubRaw } = await encrypt(sub, payload);

    const res = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        Authorization:      `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
        'Content-Type':     'application/octet-stream',
        'Content-Encoding': 'aesgcm',
        Encryption:         `salt=${b64u(salt)}`,
        'Crypto-Key':       `dh=${b64u(serverPubRaw)}`,
        TTL:                '86400',
      },
      body,
    });
    if (!res.ok) {
      const txt = await res.text().catch(()=>'');
      return { ok:false, status:res.status, error:`${res.status}: ${txt.slice(0,120)}` };
    }
    return { ok:true, status:res.status };
  } catch(e) {
    return { ok:false, status:0, error:String(e) };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    if (!VAPID_PRIVATE_KEY) return new Response(JSON.stringify({error:'VAPID_PRIVATE_KEY not set'}),{status:500,headers:{...CORS,'Content-Type':'application/json'}});

    const { title, body, url='/' } = await req.json();
    if (!title||!body) return new Response(JSON.stringify({error:'title and body required'}),{status:400,headers:{...CORS,'Content-Type':'application/json'}});

    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data:subs, error:dbErr } = await sb.from('push_subscriptions').select('endpoint,p256dh,auth').neq('p256dh','fcm');

    if (dbErr) return new Response(JSON.stringify({error:dbErr.message}),{status:500,headers:{...CORS,'Content-Type':'application/json'}});
    if (!subs||subs.length===0) return new Response(JSON.stringify({success:true,sent:0,message:'No subscribers'}),{headers:{...CORS,'Content-Type':'application/json'}});

    const payload = JSON.stringify({title,body,url});
    const results = await Promise.all(subs.map(s=>sendOne(s,payload)));
    const sent    = results.filter(r=>r.ok).length;
    const errors  = results.filter(r=>!r.ok).map(r=>r.error);
    const expired = subs.filter((_,i)=>results[i].status===410||results[i].status===404);
    if (expired.length>0) await Promise.all(expired.map(s=>sb.from('push_subscriptions').delete().eq('endpoint',s.endpoint)));

    console.log(`Push: ${sent}/${subs.length}`, errors.length?errors:'');
    return new Response(JSON.stringify({success:true,sent,total:subs.length,errors}),{headers:{...CORS,'Content-Type':'application/json'}});
  } catch(e) {
    return new Response(JSON.stringify({error:String(e)}),{status:500,headers:{...CORS,'Content-Type':'application/json'}});
  }
});
