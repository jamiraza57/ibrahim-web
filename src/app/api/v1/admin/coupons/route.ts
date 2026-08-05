import { NextRequest, NextResponse } from "next/server";
import { couponSchema } from "@/features/coupons/schemas/coupon.schema";
import { listCoupons, createCoupon, DuplicateCouponCodeError } from "@/features/coupons/services/coupon-admin.service";

export async function GET() {
  const coupons = await listCoupons();
  return NextResponse.json({ data: coupons });
}

export async function POST(request: NextRequest) {
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
    const coupon = await createCoupon(parsed.data);
    return NextResponse.json({ data: coupon }, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateCouponCodeError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Create coupon error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
