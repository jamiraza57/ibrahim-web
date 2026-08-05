import { prisma } from "@/lib/prisma";

const EXCLUDED_STATUSES = ["CANCELLED"] as const;

export async function getKpiSummary() {
  const orders = await prisma.order.findMany({
    where: { status: { notIn: [...EXCLUDED_STATUSES] } },
    select: { total: true, customerId: true },
  });

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;
  const uniqueCustomers = new Set(orders.map((o) => o.customerId)).size;

  return { revenue, orderCount, avgOrderValue, uniqueCustomers };
}

export interface RevenuePoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}

/**
 * Buckets orders by calendar day in application code rather than a DB-level
 * groupBy — keeps this portable across Prisma connectors (Mongo's groupBy
 * support has sharper edges than Postgres's) and the order volumes here don't
 * warrant DB-side aggregation.
 */
export async function getRevenueOverTime(days = 30): Promise<RevenuePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { status: { notIn: [...EXCLUDED_STATUSES] }, createdAt: { gte: since } },
    select: { total: true, createdAt: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number }>();

  // Pre-seed every day in range so the chart doesn't have gaps on quiet days.
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += order.total;
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({ date, ...v }));
}

export interface TopProduct {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { notIn: [...EXCLUDED_STATUSES] } }, productId: { not: null } },
    select: { productId: true, name: true, price: true, quantity: true },
  });

  const byProduct = new Map<string, TopProduct>();

  for (const item of items) {
    if (!item.productId) continue;
    const existing = byProduct.get(item.productId);
    if (existing) {
      existing.unitsSold += item.quantity;
      existing.revenue += item.price * item.quantity;
    } else {
      byProduct.set(item.productId, {
        productId: item.productId,
        name: item.name,
        unitsSold: item.quantity,
        revenue: item.price * item.quantity,
      });
    }
  }

  return Array.from(byProduct.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}
