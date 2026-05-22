// Supabase Edge Function: send-push
// Sends push via FCM v1 API (for Chrome/Android) and VAPID (for Firefox/Edge)
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FCM_PROJECT_ID   = Deno.env.get('FCM_PROJECT_ID')   ?? '';
const FCM_CLIENT_EMAIL = Deno.env.get('FCM_CLIENT_EMAIL') ?? '';
const FCM_PRIVATE_KEY  = Deno.env.get('FCM_PRIVATE_KEY')  ?? '';
const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT     = Deno.env.get('VAPID_SUBJECT')     ?? 'mailto:sureshkathirvel601@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── FCM v1 API (for Chrome/Android) ──────────────────────────────────────────

async function getFCMAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const payload = btoa(JSON.stringify({
    iss: FCM_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');

  const sigInput = `${header}.${payload}`;
  const pemBody = FCM_PRIVATE_KEY.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','').replace(/\n/g,'').trim();
  const keyBytes = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey('pkcs8', keyBytes, { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const jwt = `${sigInput}.${sigB64}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`FCM OAuth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sendFCM(fcmToken: string, title: string, body: string, url: string, accessToken: string): Promise<{ok:boolean;error?:string}> {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: { title, body },
        webpush: {
          notification: {
            title, body,
            icon: 'https://embosbeautysalon.in/logo.jpeg',
            badge: 'https://embosbeautysalon.in/logo.jpeg',
            requireInteraction: false,
          },
          fcm_options: { link: url.startsWith('http') ? url : `https://embosbeautysalon.in${url}` },
        },
        data: { url },
      },
    }),
  });
  if (res.ok) return { ok: true };
  const err = await res.json().catch(() => ({}));
  return { ok: false, error: err?.error?.message ?? `HTTP ${res.status}` };
}

// ── VAPID Web Push (for Firefox/Edge/Safari) ──────────────────────────────────

function b64u(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function fromb64u(s: string): Uint8Array {
  const p = '='.repeat((4 - s.length % 4) % 4);
  return Uint8Array.from(atob((s+p).replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0));
}

async function sendVapid(sub: {endpoint:string;p256dh:string;auth:string}, payload: string): Promise<{ok:boolean;status:number;error?:string}> {
  try {
    const privBytes = fromb64u(VAPID_PRIVATE_KEY);
    const pubBytes  = fromb64u(VAPID_PUBLIC_KEY);
    const x = b64u(pubBytes.slice(1,33)), y = b64u(pubBytes.slice(33,65)), d = b64u(privBytes.slice(0,32));
    const privKey = await crypto.subtle.importKey('jwk',{kty:'EC',crv:'P-256',x,y,d,key_ops:['sign']},{name:'ECDSA',namedCurve:'P-256'},false,['sign']);

    const url = new URL(sub.endpoint);
    const aud = `${url.protocol}//${url.host}`;
    const now = Math.floor(Date.now()/1000);
    const hdr = b64u(new TextEncoder().encode(JSON.stringify({typ:'JWT',alg:'ES256'})));
    const pld = b64u(new TextEncoder().encode(JSON.stringify({aud,exp:now+43200,sub:VAPID_SUBJECT})));
    const msg = `${hdr}.${pld}`;
    const sig = await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},privKey,new TextEncoder().encode(msg));
    const jwt = `${msg}.${b64u(new Uint8Array(sig))}`;

    // Encrypt payload
    const clientPub = fromb64u(sub.p256dh);
    const authSalt  = fromb64u(sub.auth);
    const salt      = crypto.getRandomValues(new Uint8Array(16));
    const serverKP  = await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
    const serverPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw',serverKP.publicKey));
    const clientKey = await crypto.subtle.importKey('raw',clientPub,{name:'ECDH',namedCurve:'P-256'},false,[]);
    const shared    = new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:clientKey},serverKP.privateKey,256));

    const te = (s:string) => new TextEncoder().encode(s);
    const cat = (...a:Uint8Array[]) => { const o=new Uint8Array(a.reduce((n,x)=>n+x.length,0)); let i=0; for(const x of a){o.set(x,i);i+=x.length;} return o; };
    const hkdf = async(salt:Uint8Array,ikm:Uint8Array,info:Uint8Array,len:number) => {
      const k=await crypto.subtle.importKey('raw',ikm,{name:'HKDF'},false,['deriveBits']);
      return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},k,len*8));
    };
    const prk = await hkdf(authSalt,shared,cat(te('Content-Encoding: auth\0'),new Uint8Array(1)),32);
    const cl=new Uint8Array(2);new DataView(cl.buffer).setUint16(0,clientPub.length,false);
    const sl=new Uint8Array(2);new DataView(sl.buffer).setUint16(0,serverPubRaw.length,false);
    const keyInfo   = cat(te('Content-Encoding: aesgcm\0'),new Uint8Array([0x41]),cl,clientPub,sl,serverPubRaw);
    const nonceInfo = cat(te('Content-Encoding: nonce\0'),new Uint8Array([0x41]),cl,clientPub,sl,serverPubRaw);
    const cek=await hkdf(salt,prk,keyInfo,16), nonce=await hkdf(salt,prk,nonceInfo,12);
    const aesKey=await crypto.subtle.importKey('raw',cek,{name:'AES-GCM'},false,['encrypt']);
    const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce},aesKey,cat(new Uint8Array(2),te(payload))));
    const rs=new Uint8Array(4);new DataView(rs.buffer).setUint32(0,4096,false);
    const body=cat(salt,rs,new Uint8Array([serverPubRaw.length]),serverPubRaw,ct);

    const res = await fetch(sub.endpoint, {
      method:'POST',
      headers:{
        Authorization:`vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
        'Content-Type':'application/octet-stream',
        'Content-Encoding':'aesgcm',
        Encryption:`salt=${b64u(salt)}`,
        'Crypto-Key':`dh=${b64u(serverPubRaw)}`,
        TTL:'86400',
      },
      body,
    });
    if(!res.ok){const txt=await res.text().catch(()=>'');return{ok:false,status:res.status,error:`${res.status}: ${txt.slice(0,120)}`};}
    return{ok:true,status:res.status};
  } catch(e){return{ok:false,status:0,error:String(e)};}
}

// ── Main ──────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { title, body, url='/' } = await req.json();
    if (!title||!body) return new Response(JSON.stringify({error:'title and body required'}),{status:400,headers:{...CORS,'Content-Type':'application/json'}});

    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data:subs, error:dbErr } = await sb.from('push_subscriptions').select('endpoint,p256dh,auth');
    if (dbErr) return new Response(JSON.stringify({error:dbErr.message}),{status:500,headers:{...CORS,'Content-Type':'application/json'}});
    if (!subs||subs.length===0) return new Response(JSON.stringify({success:true,sent:0,message:'No subscribers'}),{headers:{...CORS,'Content-Type':'application/json'}});

    // Get FCM access token once for all Chrome subscribers
    let fcmToken: string | null = null;
    const chromeSubs = subs.filter(s => s.endpoint.includes('fcm.googleapis.com'));
    if (chromeSubs.length > 0 && FCM_PRIVATE_KEY) {
      try { fcmToken = await getFCMAccessToken(); } catch(e) { console.error('FCM token error:', e); }
    }

    const targetUrl = url.startsWith('http') ? url : `https://embosbeautysalon.in${url}`;
    const payload = JSON.stringify({ title, body, url: targetUrl });

    let sent = 0;
    const errors: string[] = [];

    await Promise.all(subs.map(async (sub) => {
      const isChrome = sub.endpoint.includes('fcm.googleapis.com');

      if (isChrome && fcmToken) {
        // Extract FCM token from endpoint URL
        const fcmRegistrationToken = sub.endpoint.split('/').pop();
        if (!fcmRegistrationToken) return;
        const result = await sendFCM(fcmRegistrationToken, title, body, targetUrl, fcmToken);
        if (result.ok) { sent++; console.log('FCM sent ✅'); }
        else { errors.push(result.error ?? 'FCM error'); console.error('FCM error:', result.error); }
      } else {
        // VAPID for Firefox, Edge, Safari
        const result = await sendVapid(sub, payload);
        if (result.ok) { sent++; console.log('VAPID sent ✅'); }
        else {
          errors.push(result.error ?? 'VAPID error');
          if (result.status === 410 || result.status === 404) {
            await sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
          }
        }
      }
    }));

    console.log(`Push: ${sent}/${subs.length} sent`);
    return new Response(JSON.stringify({success:true,sent,total:subs.length,errors}),{headers:{...CORS,'Content-Type':'application/json'}});
  } catch(e) {
    console.error('send-push error:', String(e));
    return new Response(JSON.stringify({error:String(e)}),{status:500,headers:{...CORS,'Content-Type':'application/json'}});
  }
});
