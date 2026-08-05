import { Resend } from "resend";
import { getEnv } from "@/lib/env";

let client: Resend | null = null;

function getResend() {
  if (!client) client = new Resend(getEnv().RESEND_API_KEY);
  return client;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  customerName: string;
  total: string;
  itemLines: { name: string; quantity: number; price: string }[];
}) {
  const env = getEnv();

  const itemsHtml = params.itemLines
    .map((i) => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>$${i.price}</td></tr>`)
    .join("");

  await getResend().emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: params.to,
    subject: `Order Confirmed — ${params.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color:#050505;">Thank you, ${params.customerName}</h1>
        <p>Your order <strong>${params.orderNumber}</strong> has been received.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <thead><tr><th align="left">Item</th><th align="left">Qty</th><th align="left">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>Total: $${params.total}</strong></p>
      </div>
    `,
  });
}
