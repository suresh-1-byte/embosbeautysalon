// Supabase Edge Function: send-email
// Sends booking confirmation emails via Resend API
//
// Required secret:
//   RESEND_API_KEY = re_xxxxxxxxxxxx  (from resend.com)
//
// Deploy:
//   npx supabase functions deploy send-email --project-ref hlvisrpopicrnhdgnhpr

// @ts-nocheck — Deno runtime

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const ADMIN_EMAIL = 'sureshkathirvel601@gmail.com';
const FROM_EMAIL = 'EMBOS Salon <noreply@embosbeautysalon.in>';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY secret not set' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const { type, booking } = await req.json();

    let subject = '';
    let html = '';

    if (type === 'new_booking') {
      // Email to admin when new booking arrives
      subject = `📅 New Booking — ${booking.name} (${booking.service})`;
      html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #F4C2C2, #ADD8E6); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 24px;">New Booking Request</h1>
            <p style="color: #555; margin: 8px 0 0;">EMBOS Beauty Salon & Studio</p>
          </div>
          <div style="padding: 32px; background: #fafafa; border: 1px solid #f0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888; width: 140px;">👤 Customer</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; font-weight: bold; color: #1a1a2e;">${booking.name}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">📞 Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #1a1a2e;">${booking.phone}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">✉️ Email</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #1a1a2e;">${booking.email}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">💅 Service</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; font-weight: bold; color: #1a1a2e;">${booking.service}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">📅 Date</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #1a1a2e;">${booking.date}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">🕐 Time</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #1a1a2e;">${booking.time_slot}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #888;">📍 Location</td><td style="padding: 10px 0; border-bottom: 1px solid #f0e0e0; color: #1a1a2e;">${booking.location === 'home' ? '🚗 Home Service' : '🏠 Salon Visit'}</td></tr>
              ${booking.notes ? `<tr><td style="padding: 10px 0; color: #888;">📝 Notes</td><td style="padding: 10px 0; color: #1a1a2e; font-style: italic;">${booking.notes}</td></tr>` : ''}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #fff3f3; border-radius: 8px; border-left: 4px solid #F4C2C2;">
              <p style="margin: 0; color: #888; font-size: 14px;">⚡ Action required: Log in to admin panel to confirm or cancel this booking.</p>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background: #1a1a2e; border-radius: 0 0 12px 12px;">
            <p style="color: #aaa; margin: 0; font-size: 12px;">EMBOS Beauty Salon & Studio · Valasaravakkam, Chennai</p>
          </div>
        </div>
      `;
    } else if (type === 'booking_confirmed') {
      // Email to customer when admin confirms
      subject = `✅ Booking Confirmed — ${booking.service} on ${booking.date}`;
      html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #F4C2C2, #ADD8E6); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 24px;">Booking Confirmed! ✨</h1>
            <p style="color: #555; margin: 8px 0 0;">We look forward to seeing you</p>
          </div>
          <div style="padding: 32px; background: #fafafa;">
            <p style="color: #1a1a2e; font-size: 16px;">Hi <strong>${booking.name}</strong>,</p>
            <p style="color: #555;">Your appointment at EMBOS Beauty Salon & Studio has been confirmed!</p>
            <div style="background: white; border: 2px solid #F4C2C2; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 8px 0; color: #1a1a2e;"><strong>💅 Service:</strong> ${booking.service}</p>
              <p style="margin: 8px 0; color: #1a1a2e;"><strong>📅 Date:</strong> ${booking.date}</p>
              <p style="margin: 8px 0; color: #1a1a2e;"><strong>🕐 Time:</strong> ${booking.time_slot}</p>
              <p style="margin: 8px 0; color: #1a1a2e;"><strong>📍 Location:</strong> ${booking.location === 'home' ? 'Home Service' : 'EMBOS Salon, Valasaravakkam'}</p>
            </div>
            <p style="color: #888; font-size: 14px;">Questions? WhatsApp us at <a href="https://wa.me/919176160204" style="color:#F4C2C2;">+91 91761 60204</a></p>
            <p style="color: #888; font-size: 14px; margin-top: 8px;">📍 148, 3rd Main Rd, Ashtalakshmi Nagar, Valasaravakkam, Chennai 600116</p>
          </div>
          <div style="padding: 20px; text-align: center; background: #1a1a2e; border-radius: 0 0 12px 12px;">
            <p style="color: #aaa; margin: 0; font-size: 12px;">EMBOS Beauty Salon & Studio · Valasaravakkam, Chennai</p>
          </div>
        </div>
      `;
    } else if (type === 'bulk_offer') {
      // Bulk email to all subscribers when admin sends an offer
      subject = `✨ ${booking.title} — EMBOS Beauty Salon`;
      html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #F4C2C2, #ADD8E6); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 26px;">${booking.title}</h1>
            <p style="color: #555; margin: 8px 0 0;">EMBOS Beauty Salon & Studio</p>
          </div>
          <div style="padding: 32px; background: #fafafa;">
            <p style="color: #1a1a2e; font-size: 16px; line-height: 1.6;">${booking.body}</p>
            <div style="text-align: center; margin-top: 28px;">
              <a href="${booking.url || 'https://embos.in'}" style="display:inline-block;padding:14px 32px;background:#F4C2C2;color:#1a1a2e;font-weight:bold;border-radius:50px;text-decoration:none;font-size:15px;">View Offer →</a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background: #1a1a2e; border-radius: 0 0 12px 12px;">
            <p style="color: #aaa; margin: 0; font-size: 12px;">EMBOS Beauty Salon & Studio · Valasaravakkam, Chennai</p>
            <p style="color: #666; margin: 6px 0 0; font-size: 11px;">You subscribed on our website. Reply to unsubscribe.</p>
          </div>
        </div>
      `;
    }

    // For bulk_offer: fetch all email subscribers and send to each
    if (type === 'bulk_offer') {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const sb = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      const { data: subscribers } = await sb.from('email_subscribers').select('email, name');
      const emails = (subscribers ?? []).map((s: any) => s.email).filter(Boolean);

      if (emails.length === 0) {
        return new Response(JSON.stringify({ success: true, sent: 0, message: 'No email subscribers yet' }), {
          headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      // Resend supports up to 50 recipients per call — send in batches
      const BATCH = 50;
      let sent = 0;
      for (let i = 0; i < emails.length; i += BATCH) {
        const batch = emails.slice(i, i + BATCH);
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({ from: FROM_EMAIL, to: batch, subject, html }),
        });
        sent += batch.length;
      }

      return new Response(JSON.stringify({ success: true, sent }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        reply_to: ADMIN_EMAIL,
        // new_booking  → only admin
        // booking_confirmed → only the customer (they already know admin email)
        to: type === 'new_booking' ? [ADMIN_EMAIL] : [booking.email],
        subject,
        html,
      }),
    });

    const result = await res.json();
    console.log('Resend result:', JSON.stringify(result));

    if (result.error) {
      return new Response(JSON.stringify({ success: false, error: result.error }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('send-email error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
