import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/config/shipping";
import { generateOrderNumber } from "@/features/orders/services/order-number";
import { validateAndComputeDiscount } from "./coupon.service";
import type { CheckoutInput } from "../schemas/checkout.schema";

const MAX_ORDER_NUMBER_ATTEMPTS = 5;

function isOrderNumberCollision(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    (err.meta?.target as string[] | undefined)?.includes("orderNumber") === true
  );
}

export class InsufficientStockError extends Error {
  constructor(productName: string) {
    super(`Not enough stock for "${productName}"`);
    this.name = "InsufficientStockError";
  }
}

export class ProductUnavailableError extends Error {
  constructor() {
    super("One or more items in your cart are no longer available");
    this.name = "ProductUnavailableError";
  }
}

/**
 * Builds an order entirely from server-trusted data. The client only ever
 * sends productId + quantity — price, stock, and coupon math are always
 * recomputed here so a tampered client request can't discount or misprice
 * an order.
 */
export async function buildOrder(input: CheckoutInput) {
  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  if (products.length !== productIds.length) {
    throw new ProductUnavailableError();
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemsData = input.items.map((item) => {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) throw new InsufficientStockError(product.name);

    const unitPrice = Number(product.salePrice ?? product.price);
    subtotal += unitPrice * item.quantity;

    return {
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity: item.quantity,
      image: product.images[0]?.url,
    };
  });

  let discount = 0;
  let couponCode: string | null = null;
  if (input.couponCode) {
    const result = await validateAndComputeDiscount(input.couponCode, subtotal);
    discount = result.discount;
    couponCode = result.coupon.code;
  }

  const shipping = calculateShipping(subtotal - discount);
  const total = subtotal - discount + shipping;

  return { orderItemsData, subtotal, discount, shipping, total, couponCode };
}

export async function createOrder(input: CheckoutInput) {
  const { orderItemsData, subtotal, discount, shipping, total, couponCode } = await buildOrder(input);

  for (let attempt = 1; attempt <= MAX_ORDER_NUMBER_ATTEMPTS; attempt++) {
    try {
      return await runOrderTransaction({ input, orderItemsData, subtotal, discount, shipping, total, couponCode });
    } catch (err) {
      if (isOrderNumberCollision(err) && attempt < MAX_ORDER_NUMBER_ATTEMPTS) continue;
      throw err;
    }
  }
  throw new Error("Unreachable");
}

function runOrderTransaction(params: {
  input: CheckoutInput;
  orderItemsData: Awaited<ReturnType<typeof buildOrder>>["orderItemsData"];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
}) {
  const { input, orderItemsData, subtotal, discount, shipping, total, couponCode } = params;

  return prisma.$transaction(async (tx) => {
    // Composite dedup key isn't a real unique constraint (email+phone isn't
    // declared unique in the schema), so `upsert`'s where clause can't target
    // it — look the customer up first and create only if absent.
    const customer =
      (await tx.customer.findFirst({
        where: { email: input.customer.email, phone: input.customer.phone },
      })) ?? (await tx.customer.create({ data: input.customer }));

    const address = await tx.address.create({
      data: { ...input.address, customerId: customer.id },
    });

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        couponCode: couponCode ?? undefined,
        customerId: customer.id,
        addressId: address.id,
        items: { create: orderItemsData },
        history: { create: { status: "PENDING", note: "Order placed — Cash on Delivery" } },
      },
      include: { items: true },
    });

    // Decrement stock now — released back via the order-cancellation flow if needed.
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (couponCode) {
      await tx.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } });
    }

    return order;
  });
}
