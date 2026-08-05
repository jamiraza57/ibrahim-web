import { NextRequest, NextResponse } from "next/server";
import { getKpiSummary, getRevenueOverTime, getTopProducts } from "@/features/analytics/services/analytics.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 30);

  const [kpis, revenueOverTime, topProducts] = await Promise.all([
    getKpiSummary(),
    getRevenueOverTime(days),
    getTopProducts(5),
  ]);

  return NextResponse.json({ data: { kpis, revenueOverTime, topProducts } });
}
