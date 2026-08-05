import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "@/features/orders/services/order-management.service";
import type { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = await listOrders({
    status: (searchParams.get("status") as OrderStatus) || undefined,
    search: searchParams.get("search") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 20),
  });

  return NextResponse.json({ data: result.items, meta: result });
}
