// Supabase Edge Function: send-confirmation-email
//
// Called from the admin dashboard the moment a booking is marked
// "confirmed". Sends the applicant a branded confirmation email with
// their session details via Resend, so you never have to type this
// out by hand again.
//
// Deploy with: supabase functions deploy send-confirmation-email
// Requires a secret set first: supabase secrets set RESEND_API_KEY=re_xxxxx

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Resend's free tier only lets you send FROM their shared test domain
// (onboarding@resend.dev) until you verify your own domain. Update this
// once rcsbadmintoncoaching.com (or whatever domain you use) is verified
// in your Resend dashboard — see the README for that step.
const FROM_EMAIL = "Rc's — Racquets Cult <onboarding@resend.dev>";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function buildEmailHtml({ student_name, membership_tier, session_date, session_time }: {
  student_name: string;
  membership_tier: string;
  session_date: string;
  session_time: string;
}) {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; padding: 40px 32px; color: #0A0A0A; background: #ffffff;">
      <p style="text-transform: uppercase; letter-spacing: 0.25em; font-size: 11px; color: #C5A059; margin: 0 0 16px; font-family: Helvetica, Arial, sans-serif;">
        Rc's — Racquets Cult
      </p>
      <h1 style="font-size: 26px; margin: 0 0 24px; font-weight: 700;">
        You're confirmed, ${student_name}.
      </h1>
      <p style="line-height: 1.7; font-size: 14px; color: #333333; font-family: Helvetica, Arial, sans-serif; margin: 0 0 24px;">
        Your ${membership_tier} coaching session with Rc is booked. Details below.
      </p>
      <table style="width: 100%; margin: 0 0 28px; font-size: 14px; font-family: Helvetica, Arial, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Date</td>
          <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${session_date}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666666; border-bottom: 1px solid #eeeeee;">Time</td>
          <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eeeeee;">${session_time}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666666;">Track</td>
          <td style="padding: 10px 0; text-align: right;">${membership_tier}</td>
        </tr>
      </table>
      <p style="line-height: 1.7; font-size: 13px; color: #666666; font-family: Helvetica, Arial, sans-serif; margin: 0;">
        Questions? Reply to this email, or reach us directly at
        rcsbadminton@gmail.com / +91 7709221174.
      </p>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured on the server." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const body = await req.json();
    const { student_name, student_email, membership_tier, session_date, session_time } = body;

    if (!student_email) {
      return new Response(JSON.stringify({ error: "Missing student_email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: student_email,
        subject: "You're confirmed — Rc's Racquets Cult",
        html: buildEmailHtml({ student_name, membership_tier, session_date, session_time }),
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      return new Response(JSON.stringify({ error: resendData }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});
