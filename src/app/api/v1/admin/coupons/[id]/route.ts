import { NextRequest, NextResponse } from "next/server";
import { couponSchema } from "@/features/coupons/schemas/coupon.schema";
import {
  getCoupon,
  updateCoupon,
  deleteCoupon,
  DuplicateCouponCodeError,
} from "@/features/coupons/services/coupon-admin.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const coupon = await getCoupon(id);
  if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: coupon });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const coupon = await updateCoupon(id, parsed.data);
    return NextResponse.json({ data: coupon });
  } catch (err) {
    if (err instanceof DuplicateCouponCodeError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Update coupon error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await deleteCoupon(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete coupon error:", err);
    return NextResponse.json({ error: "Could not delete coupon" }, { status: 500 });
  }
}
