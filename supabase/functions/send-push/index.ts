// Supabase Edge Function: send-push
// Sends push notifications via OneSignal REST API
//
// Required secrets (set via Supabase dashboard or CLI):
//   ONESIGNAL_APP_ID      = fe0dc2a4-2aac-441a-a0f6-dada64111bba
//   ONESIGNAL_REST_API_KEY = <your REST API key from OneSignal → Settings → Keys & IDs>
//
// Deploy command:
//   npx supabase functions deploy send-push --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck — Deno runtime, not Node. TS errors here are expected in VS Code.

const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID') ?? '';
const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    if (!ONESIGNAL_REST_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ONESIGNAL_REST_API_KEY secret not set. Add it via Supabase dashboard → Edge Functions → Secrets.' }),
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

    const payload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: { en: title },
      contents: { en: body },
      url,
      chrome_web_icon: 'https://hlvisrpopicrnhdgnhpr.supabase.co/storage/v1/object/public/assets/logo.jpeg',
      firefox_icon: 'https://hlvisrpopicrnhdgnhpr.supabase.co/storage/v1/object/public/assets/logo.jpeg',
      chrome_web_badge: 'https://hlvisrpopicrnhdgnhpr.supabase.co/storage/v1/object/public/assets/logo.jpeg',
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('OneSignal response:', JSON.stringify(result));

    if (result.errors) {
      console.error('OneSignal errors:', result.errors);
      return new Response(
        JSON.stringify({ success: false, errors: result.errors }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id, recipients: result.recipients }),
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
