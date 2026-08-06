import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const trackSchema = z.object({
  orderNumber: z.string().min(1).max(64),
  email: z.string().email(),
});

// Public order lookup — requires both the order number and the email used at
// checkout, so an order number alone (which appears in the URL of the
// order-success page) isn't enough to pull up someone else's order details.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`track-order:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: parsed.data.orderNumber.trim() },
    include: {
      customer: true,
      items: true,
      history: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order || order.customer.email.toLowerCase() !== parsed.data.email.trim().toLowerCase()) {
    return NextResponse.json({ error: "No order found with that order number and email." }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total.toString(),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price.toString() })),
    history: order.history.map((h) => ({ status: h.status, note: h.note, createdAt: h.createdAt })),
  });
}
