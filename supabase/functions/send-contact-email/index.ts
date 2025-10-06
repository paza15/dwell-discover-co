import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const CONTACT_RECIPIENT_EMAIL = Deno.env.get("CONTACT_RECIPIENT_EMAIL");
const CONTACT_FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") ?? CONTACT_RECIPIENT_EMAIL;

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
    console.error("Missing email configuration environment variables");
    return new Response(
      JSON.stringify({ error: "Server email configuration is incomplete." }),
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

  const emailBody = `New contact form submission from ${name}.\n\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || "N/A"}\n\n` +
    `Message:\n${message}`;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_RECIPIENT_EMAIL],
        subject: `New contact form submission from ${name}`,
        reply_to: email,
        text: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error", resendResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
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
