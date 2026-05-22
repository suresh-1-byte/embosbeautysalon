// Supabase Edge Function: telegram-webhook
// Handles incoming Telegram messages — saves chat_id when user sends /start
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

Deno.serve(async (req: Request) => {
  // Allow all requests — Telegram webhook doesn't send auth headers
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) return new Response('ok');

    const chatId   = message.chat?.id;
    const text     = message.text ?? '';
    const name     = message.from?.first_name ?? '';
    const username = message.from?.username ?? '';

    if (!chatId) return new Response('ok');

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (text.startsWith('/start')) {
      // Save subscriber
      await sb.from('telegram_subscribers').upsert(
        { chat_id: chatId, name, username },
        { onConflict: 'chat_id' }
      );

      await sendMessage(chatId,
        `🌸 <b>Welcome to EMBOS Beauty Salon!</b>\n\n` +
        `Hi ${name}! You're now subscribed to our updates.\n\n` +
        `You'll receive notifications about:\n` +
        `✨ New offers & packages\n` +
        `💅 Bridal & Korean beauty updates\n` +
        `📅 Booking confirmations\n\n` +
        `Visit us: <a href="https://embosbeautysalon.in">embosbeautysalon.in</a>`
      );
    } else if (text.startsWith('/stop')) {
      await sb.from('telegram_subscribers').delete().eq('chat_id', chatId);
      await sendMessage(chatId, 'You have been unsubscribed. Send /start to subscribe again.');
    } else {
      await sendMessage(chatId,
        `Send /start to subscribe to EMBOS Beauty Salon notifications.\nSend /stop to unsubscribe.`
      );
    }

    return new Response('ok');
  } catch (e) {
    console.error('telegram-webhook error:', e);
    return new Response('ok'); // Always return 200 to Telegram
  }
});
