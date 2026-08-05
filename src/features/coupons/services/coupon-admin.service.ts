import { prisma } from "@/lib/prisma";
import type { CouponInput } from "../schemas/coupon.schema";

export class DuplicateCouponCodeError extends Error {
  constructor() {
    super("A coupon with this code already exists");
    this.name = "DuplicateCouponCodeError";
  }
}

export async function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCoupon(id: string) {
  return prisma.coupon.findUnique({ where: { id } });
}

export async function createCoupon(input: CouponInput) {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw new DuplicateCouponCodeError();
  return prisma.coupon.create({ data: input });
}

export async function updateCoupon(id: string, input: CouponInput) {
  const existing = await prisma.coupon.findFirst({ where: { code: input.code, NOT: { id } } });
  if (existing) throw new DuplicateCouponCodeError();
  return prisma.coupon.update({ where: { id }, data: input });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}
