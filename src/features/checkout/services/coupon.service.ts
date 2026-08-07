import { prisma } from "@/lib/prisma";
import type { Coupon } from "@prisma/client";
import { formatPrice } from "@/lib/format";

export class InvalidCouponError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCouponError";
  }
}

export async function validateAndComputeDiscount(code: string, subtotal: number): Promise<{ coupon: Coupon; discount: number }> {
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) throw new InvalidCouponError("Coupon not found or inactive");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new InvalidCouponError("Coupon has expired");
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new InvalidCouponError("Coupon usage limit reached");
  }
  if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
    throw new InvalidCouponError(`Minimum purchase of ${formatPrice(Number(coupon.minPurchase))} required for this coupon`);
  }

  const discount =
    coupon.type === "PERCENTAGE" ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);

  return { coupon, discount: Math.min(discount, subtotal) };
}
