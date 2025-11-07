import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const CONTACT_RECIPIENT_EMAIL = Deno.env.get("CONTACT_RECIPIENT_EMAIL");
const CONTACT_FROM_EMAIL =
  Deno.env.get("CONTACT_FROM_EMAIL") ?? CONTACT_RECIPIENT_EMAIL;

// Shown as the sender name
const BRAND_FROM = `iDeal Properties <${CONTACT_FROM_EMAIL}>`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  if (!RESEND_API_KEY || !CONTACT_RECIPIENT_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("Missing email env vars:", {
      hasResendKey: !!RESEND_API_KEY,
      hasRecipient: !!CONTACT_RECIPIENT_EMAIL,
      hasFrom: !!CONTACT_FROM_EMAIL,
    });

    return new Response(
      JSON.stringify({
        error: "Server email configuration is incomplete.",
        hint:
          "Check RESEND_API_KEY, CONTACT_RECIPIENT_EMAIL, CONTACT_FROM_EMAIL in Supabase.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let payload: ContactRequest;

  try {
    payload = await req.json();
  } catch (error) {
    console.error("Invalid JSON payload", error);
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const phone = payload.phone?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Missing required fields." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const internalText =
    `New contact form submission from ${name}.\n\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || "N/A"}\n\n` +
    `Message:\n${message}`;

  try {
    // 1) Send email to your inbox
    const internalRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: BRAND_FROM,
        to: [CONTACT_RECIPIENT_EMAIL],
        subject: `New contact form submission from ${name}`,
        reply_to: email,
        text: internalText,
      }),
    });

    const internalTextRes = await internalRes.text();

    if (!internalRes.ok) {
      console.error(
        "Resend internal email error:",
        internalRes.status,
        internalTextRes,
      );
      return new Response(
        JSON.stringify({
          error: "Failed to send internal email.",
          resend: internalTextRes,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2) Send confirmation email to sender
    const confirmText =
      `Hi ${name},\n\n` +
      `Thank you for contacting iDeal Properties. We’ve received your message and one of our agents will get back to you shortly.\n\n` +
      `Your message:\n${message}\n\n` +
      `If this is urgent, you can also reach us at ${CONTACT_RECIPIENT_EMAIL}.\n\n` +
      `Best regards,\n` +
      `iDeal Properties Team`;

    const confirmRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: BRAND_FROM,
        to: [email],
        subject: "We’ve received your message ✅",
        text: confirmText,
      }),
    });

    const confirmTextRes = await confirmRes.text();

    if (!confirmRes.ok) {
      console.error(
        "Resend confirmation email error:",
        confirmRes.status,
        confirmTextRes,
      );
      // Don't fail the whole thing if only confirmation fails.
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error while sending email", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
