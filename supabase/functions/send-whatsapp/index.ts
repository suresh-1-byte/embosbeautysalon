// Supabase Edge Function: send-whatsapp
// Sends WhatsApp messages to all subscribers via PayPerWA
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYPERWA_API_KEY = Deno.env.get('PAYPERWA_API_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!PAYPERWA_API_KEY) {
      return new Response(JSON.stringify({ error: 'PAYPERWA_API_KEY not set' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const { title, body, url = 'https://embosbeautysalon.in', template_name = 'embos_updates', variables = [] } = await req.json();
    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all WhatsApp subscribers
    const { data: subs, error: dbErr } = await sb
      .from('whatsapp_subscribers')
      .select('phone');

    if (dbErr) {
      return new Response(JSON.stringify({ error: dbErr.message }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No WhatsApp subscribers yet' }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const templateName = template_name;
    // PayPerWA expects variables as array of objects with 'text' key
    const rawVars = variables.length > 0 ? variables : [title, body];
    const templateVars = rawVars.map((v: string) => ({ type: 'text', text: String(v) }));

    let sent = 0;
    const failed: string[] = [];

    await Promise.all(subs.map(async (sub) => {
      try {
        // Ensure phone has + prefix — PayPerWA requires +91XXXXXXXXXX format
        const phone = sub.phone.startsWith('+') ? sub.phone : `+${sub.phone}`;

        const res = await fetch('https://payperwa.com/api/v1/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PAYPERWA_API_KEY}`,
          },
          body: JSON.stringify({
            to: phone,
            template_name: templateName,
            language: 'en',
            variables: templateVars,
          }),
        });

        const result = await res.json();
        console.log(`PayPerWA response for ${sub.phone}:`, JSON.stringify(result));
        if (res.ok && result.success) {
          sent++;
        } else {
          console.error(`Failed for ${sub.phone}:`, JSON.stringify(result));
          failed.push(`${sub.phone}: ${result.error || result.message || JSON.stringify(result)}`);
        }
      } catch (e) {
        console.error(`Error for ${sub.phone}:`, String(e));
        failed.push(sub.phone);
      }
    }));

    console.log(`WhatsApp: ${sent}/${subs.length} sent`);
    return new Response(
      JSON.stringify({ success: true, sent, total: subs.length, failed }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('send-whatsapp error:', String(e));
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
