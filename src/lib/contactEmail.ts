type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const CONTACT_RECIPIENT_EMAIL = import.meta.env.VITE_CONTACT_RECIPIENT_EMAIL;
const CONTACT_FROM_EMAIL =
  import.meta.env.VITE_CONTACT_FROM_EMAIL ?? CONTACT_RECIPIENT_EMAIL;

const buildEmailBody = ({ name, email, phone, message }: ContactFormPayload) =>
  `New contact form submission from ${name}.\n\n` +
  `Email: ${email}\n` +
  `Phone: ${phone?.trim() || "N/A"}\n\n` +
  `Message:\n${message}`;

export const sendContactEmail = async (payload: ContactFormPayload) => {
  if (!RESEND_API_KEY) {
    throw new Error(
      "Missing VITE_RESEND_API_KEY. Please configure your Resend API key.",
    );
  }

  if (!CONTACT_RECIPIENT_EMAIL) {
    throw new Error(
      "Missing VITE_CONTACT_RECIPIENT_EMAIL. Please configure the inbox that should receive contact submissions.",
    );
  }

  if (!CONTACT_FROM_EMAIL) {
    throw new Error(
      "Missing VITE_CONTACT_FROM_EMAIL. Please configure a verified sender address.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_RECIPIENT_EMAIL],
      subject: `New contact form submission from ${payload.name}`,
      reply_to: payload.email,
      text: buildEmailBody(payload),
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      typeof result === "object" && result !== null && "message" in result
        ? String(result.message)
        : "Unable to deliver the message.";

    throw new Error(errorMessage);
  }

  return result;
};

export type { ContactFormPayload };
