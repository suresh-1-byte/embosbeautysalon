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
const ADMIN_EMAIL = 'embossbeautysalon2023@gmail.com';
// Use a real-looking sender address — Gmail/Outlook spam-filter "noreply@" heavily
const FROM_EMAIL = 'EMBOS Beauty Salon <hello@embosbeautysalon.in>';

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
      subject = `New Booking: ${booking.name} - ${booking.service} on ${booking.date}`;
      html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Booking</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #f0e0e0;">
        <tr><td style="background:linear-gradient(135deg,#F4C2C2,#ADD8E6);padding:28px;text-align:center;">
          <p style="margin:0 0 4px;color:#1a1a2e;font-size:12px;letter-spacing:2px;text-transform:uppercase;">EMBOS Beauty Salon</p>
          <h1 style="margin:0;color:#1a1a2e;font-size:22px;">New Booking Request</h1>
        </td></tr>
        <tr><td style="padding:28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;width:130px;font-size:14px;">Customer</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;font-weight:bold;color:#1a1a2e;font-size:14px;">${booking.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;font-size:14px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#1a1a2e;font-size:14px;">${booking.phone}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;font-size:14px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#1a1a2e;font-size:14px;">${booking.email}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;font-size:14px;">Service</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;font-weight:bold;color:#1a1a2e;font-size:14px;">${booking.service}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;font-size:14px;">Date</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#1a1a2e;font-size:14px;">${booking.date}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#888;font-size:14px;">Time</td><td style="padding:10px 0;border-bottom:1px solid #f0e0e0;color:#1a1a2e;font-size:14px;">${booking.time_slot}</td></tr>
            <tr><td style="padding:10px 0;${booking.notes ? 'border-bottom:1px solid #f0e0e0;' : ''}color:#888;font-size:14px;">Location</td><td style="padding:10px 0;${booking.notes ? 'border-bottom:1px solid #f0e0e0;' : ''}color:#1a1a2e;font-size:14px;">${booking.location === 'home' ? 'Home Service' : 'Salon Visit'}</td></tr>
            ${booking.notes ? `<tr><td style="padding:10px 0;color:#888;font-size:14px;">Notes</td><td style="padding:10px 0;color:#1a1a2e;font-size:14px;font-style:italic;">${booking.notes}</td></tr>` : ''}
          </table>
          <p style="margin:20px 0 0;padding:14px;background:#fff8f8;border-left:3px solid #F4C2C2;color:#888;font-size:13px;border-radius:4px;">Action required: Log in to the admin panel to confirm or cancel this booking.</p>
        </td></tr>
        <tr><td style="background:#1a1a2e;padding:18px;text-align:center;">
          <p style="margin:0;color:#aaa;font-size:12px;">EMBOS Beauty Salon &amp; Studio · Valasaravakkam, Chennai</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    } else if (type === 'booking_confirmed') {
      // Email to customer when admin confirms
      subject = `Booking Confirmed: ${booking.service} on ${booking.date} - EMBOS Salon`;
      html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking Confirmed</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #f0e0e0;">
        <tr><td style="background:linear-gradient(135deg,#F4C2C2,#ADD8E6);padding:28px;text-align:center;">
          <p style="margin:0 0 4px;color:#1a1a2e;font-size:12px;letter-spacing:2px;text-transform:uppercase;">EMBOS Beauty Salon</p>
          <h1 style="margin:0;color:#1a1a2e;font-size:22px;">Booking Confirmed</h1>
        </td></tr>
        <tr><td style="padding:28px;">
          <p style="margin:0 0 16px;color:#1a1a2e;font-size:16px;">Hi <strong>${booking.name}</strong>,</p>
          <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.6;">Your appointment at EMBOS Beauty Salon &amp; Studio has been confirmed. We look forward to seeing you!</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:2px solid #F4C2C2;border-radius:10px;overflow:hidden;">
            <tr><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;color:#888;font-size:14px;width:120px;">Service</td><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;font-weight:bold;color:#1a1a2e;font-size:14px;">${booking.service}</td></tr>
            <tr><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;color:#888;font-size:14px;">Date</td><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;color:#1a1a2e;font-size:14px;">${booking.date}</td></tr>
            <tr><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;color:#888;font-size:14px;">Time</td><td style="padding:12px 16px;border-bottom:1px solid #f9e8e8;color:#1a1a2e;font-size:14px;">${booking.time_slot}</td></tr>
            <tr><td style="padding:12px 16px;color:#888;font-size:14px;">Location</td><td style="padding:12px 16px;color:#1a1a2e;font-size:14px;">${booking.location === 'home' ? 'Home Service' : 'EMBOS Salon, Valasaravakkam, Chennai'}</td></tr>
          </table>
          <p style="margin:20px 0 6px;color:#888;font-size:13px;">Questions? WhatsApp us at <a href="https://wa.me/919176160204" style="color:#c47a7a;text-decoration:none;">+91 91761 60204</a></p>
          <p style="margin:0;color:#888;font-size:13px;">148, 3rd Main Rd, Ashtalakshmi Nagar, Valasaravakkam, Chennai 600116</p>
        </td></tr>
        <tr><td style="background:#1a1a2e;padding:18px;text-align:center;">
          <p style="margin:0;color:#aaa;font-size:12px;">EMBOS Beauty Salon &amp; Studio · Valasaravakkam, Chennai</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    } else if (type === 'bulk_offer') {
      // Bulk email to all subscribers when admin sends an offer
      // Subject: no emoji prefix — plain subject lines land in inbox more reliably
      subject = `${booking.title} — EMBOS Beauty Salon`;
      const offerUrl = booking.url
        ? (booking.url.startsWith('http') ? booking.url : `https://embosbeautysalon.in${booking.url}`)
        : 'https://embosbeautysalon.in';
      html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${booking.title}</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #f0e0e0;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#F4C2C2,#ADD8E6);padding:32px;text-align:center;">
            <p style="margin:0 0 6px;color:#1a1a2e;font-size:13px;letter-spacing:2px;text-transform:uppercase;">EMBOS Beauty Salon &amp; Studio</p>
            <h1 style="margin:0;color:#1a1a2e;font-size:24px;font-weight:bold;">${booking.title}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${booking.imageUrl ? `<img src="${booking.imageUrl}" alt="${booking.title}" style="width:100%;max-height:320px;object-fit:cover;border-radius:10px;margin-bottom:20px;display:block;" />` : ''}
            <p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.7;">${booking.body}</p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
              <a href="${offerUrl}" style="display:inline-block;padding:14px 36px;background:#F4C2C2;color:#1a1a2e;font-weight:bold;border-radius:50px;text-decoration:none;font-size:15px;font-family:Georgia,serif;">Book Now</a>
            </td></tr></table>
            <p style="margin:0;color:#888;font-size:13px;">Questions? WhatsApp us at <a href="https://wa.me/919176160204" style="color:#c47a7a;text-decoration:none;">+91 91761 60204</a></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;color:#aaa;font-size:12px;">EMBOS Beauty Salon &amp; Studio</p>
            <p style="margin:0 0 4px;color:#666;font-size:11px;">148, 3rd Main Rd, Ashtalakshmi Nagar, Valasaravakkam, Chennai 600116</p>
            <p style="margin:8px 0 0;color:#555;font-size:11px;">You are receiving this because you subscribed on our website. To unsubscribe, reply with "unsubscribe".</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

      // Send individually — batching multiple recipients in one call triggers spam filters
      let sent = 0;
      for (const recipientEmail of emails) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: FROM_EMAIL,
            reply_to: ADMIN_EMAIL,
            to: [recipientEmail],
            subject,
            html,
            headers: {
              'List-Unsubscribe': `<mailto:${ADMIN_EMAIL}?subject=unsubscribe>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              'X-Entity-Ref-ID': `embos-offer-${Date.now()}-${sent}`,
            },
          }),
        });
        sent++;
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
