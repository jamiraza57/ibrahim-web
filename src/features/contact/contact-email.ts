import { Resend } from "resend";
import { getResendConfig } from "@/lib/env";

let client: Resend | null = null;

function getResend() {
  if (!client) client = new Resend(getResendConfig().RESEND_API_KEY);
  return client;
}

export async function sendContactFormEmail(params: { name: string; email: string; message: string }) {
  const env = getResendConfig();

  await getResend().emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.RESEND_FROM_EMAIL,
    replyTo: params.email,
    subject: `New contact form message from ${params.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p><strong>From:</strong> ${params.name} (${params.email})</p>
        <p style="white-space: pre-line;">${params.message}</p>
      </div>
    `,
  });
}
