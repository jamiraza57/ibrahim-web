import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

const ORDER_INCLUDE = {
  customer: true,
  address: true,
  items: true,
  history: { orderBy: { createdAt: "asc" as const } },
};

export async function listOrders(params: { status?: OrderStatus; page?: number; pageSize?: number; search?: string }) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const where = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { orderNumber: { contains: params.search, mode: "insensitive" as const } },
            { customer: { email: { contains: params.search, mode: "insensitive" as const } } },
            { customer: { phone: { contains: params.search } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export class InvalidStatusTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot move an order from ${from} to ${to}`);
    this.name = "InvalidStatusTransitionError";
  }
}

export async function updateOrderStatus(id: string, newStatus: OrderStatus, note?: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) throw new Error("Order not found");

  const allowedTransitions = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowedTransitions.includes(newStatus)) {
    throw new InvalidStatusTransitionError(order.status, newStatus);
  }

  return prisma.$transaction(async (tx) => {
    // Cancelling releases reserved stock back to the catalog. Every other
    // transition just moves the order through fulfillment.
    if (newStatus === "CANCELLED") {
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
        }
      }
    }

    if (newStatus === "DELIVERED" && order.paymentMethod === "COD") {
      // COD is collected on delivery — mark it paid the moment fulfillment completes.
      await tx.order.update({ where: { id }, data: { paymentStatus: "PAID" } });
    }

    return tx.order.update({
      where: { id },
      data: {
        status: newStatus,
        history: { create: { status: newStatus, note } },
      },
      include: ORDER_INCLUDE,
    });
  });
}
