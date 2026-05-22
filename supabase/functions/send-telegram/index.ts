// Supabase Edge Function: send-telegram
// Sends Telegram messages to all subscribers
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!BOT_TOKEN) {
      return new Response(JSON.stringify({ error: 'TELEGRAM_BOT_TOKEN not set' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const { title, body, url = 'https://embosbeautysalon.in' } = await req.json();
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
      .from('telegram_subscribers')
      .select('chat_id');

    if (dbErr) {
      return new Response(JSON.stringify({ error: dbErr.message }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No Telegram subscribers yet' }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const targetUrl = url.startsWith('http') ? url : `https://embosbeautysalon.in${url}`;
    const message = `🌸 <b>${title}</b>\n\n${body}\n\n<a href="${targetUrl}">View →</a>`;

    let sent = 0;
    const blocked: number[] = [];

    await Promise.all(subs.map(async (sub) => {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: sub.chat_id, text: message, parse_mode: 'HTML' }),
      });
      const result = await res.json();
      if (result.ok) {
        sent++;
      } else {
        console.error(`Failed for ${sub.chat_id}:`, result.description);
        // User blocked the bot — remove them
        if (result.error_code === 403) {
          blocked.push(sub.chat_id);
        }
      }
    }));

    // Clean up blocked users
    if (blocked.length > 0) {
      await Promise.all(blocked.map(id =>
        sb.from('telegram_subscribers').delete().eq('chat_id', id)
      ));
    }

    console.log(`Telegram: ${sent}/${subs.length} sent`);
    return new Response(
      JSON.stringify({ success: true, sent, total: subs.length }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('send-telegram error:', String(e));
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
