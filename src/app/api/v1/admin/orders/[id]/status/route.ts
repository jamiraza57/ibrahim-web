import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatus, InvalidStatusTransitionError } from "@/features/orders/services/order-management.service";

const statusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  note: z.string().max(500).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const order = await updateOrderStatus(id, parsed.data.status, parsed.data.note);
    return NextResponse.json({ data: order });
  } catch (err) {
    if (err instanceof InvalidStatusTransitionError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Order status update error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
