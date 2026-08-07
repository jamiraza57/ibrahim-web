import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/features/checkout/schemas/checkout.schema";
import {
  createOrder,
  InsufficientStockError,
  ProductUnavailableError,
} from "@/features/checkout/services/checkout.service";
import { InvalidCouponError } from "@/features/checkout/services/coupon.service";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

// Cash on Delivery only — this store takes no online payment method.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many checkout attempts. Please slow down." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const order = await createOrder(parsed.data);

    // Fire-and-forget: the order is already committed, so an email failure
    // (bad API key, Resend outage) must never surface as a checkout failure —
    // that would make the customer resubmit and place a duplicate order.
    sendOrderConfirmationEmail({
      to: parsed.data.customer.email,
      orderNumber: order.orderNumber,
      customerName: parsed.data.customer.name,
      total: order.total.toString(),
      itemLines: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price.toString(),
      })),
    }).catch((err) => {
      console.error(`Order confirmation email failed for ${order.orderNumber}:`, err);
    });

    return NextResponse.json({ data: { orderNumber: order.orderNumber } });
  } catch (err) {
    if (err instanceof InsufficientStockError || err instanceof ProductUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err instanceof InvalidCouponError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Something went wrong processing your order" }, { status: 500 });
  }
}
