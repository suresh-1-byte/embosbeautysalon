// Supabase Edge Function: send-push
// Sends push notifications via Webpushr REST API
//
// Required secrets:
//   WEBPUSHR_API_KEY    = 58d95b51ddca957d7a80f3ea2153cb53
//   WEBPUSHR_AUTH_TOKEN = 121497
//
// Deploy:
//   npx supabase functions deploy send-push --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck

const WEBPUSHR_API_KEY    = Deno.env.get('WEBPUSHR_API_KEY')    ?? '';
const WEBPUSHR_AUTH_TOKEN = Deno.env.get('WEBPUSHR_AUTH_TOKEN') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!WEBPUSHR_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'WEBPUSHR_API_KEY secret not set.' }),
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

    const payload = {
      title,
      message: body,
      target_url: url.startsWith('http') ? url : `https://embosbeautysalon.in${url}`,
      icon: 'https://embosbeautysalon.in/logo.jpeg',
      auto_hide: 1,
    };

    const res = await fetch('https://api.webpushr.com/v1/notification/send/all', {
      method: 'POST',
      headers: {
        'webpushrKey':       WEBPUSHR_API_KEY,
        'webpushrAuthToken': WEBPUSHR_AUTH_TOKEN,
        'Content-Type':      'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('Webpushr response:', JSON.stringify(result));

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: result?.message ?? `HTTP ${res.status}` }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, result }),
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
