"use client";

import { useEffect, useState } from "react";
import { RevenueChart } from "@/features/analytics/components/RevenueChart";

interface AnalyticsData {
  kpis: { revenue: number; orderCount: number; avgOrderValue: number; uniqueCustomers: number };
  revenueOverTime: { date: string; revenue: number; orders: number }[];
  topProducts: { productId: string; name: string; unitsSold: number; revenue: number }[];
}

const KPI_CARDS = [
  { key: "revenue" as const, label: "Total Revenue", format: (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
  { key: "orderCount" as const, label: "Orders", format: (v: number) => v.toLocaleString() },
  { key: "avgOrderValue" as const, label: "Avg Order Value", format: (v: number) => `$${v.toFixed(2)}` },
  { key: "uniqueCustomers" as const, label: "Customers", format: (v: number) => v.toLocaleString() },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/v1/admin/analytics?days=${days}`)
      .then((res) => res.json())
      .then(({ data }) => setData(data));
  }, [days]);

  if (!data) return <div className="p-4 text-secondary-text sm:p-8">Loading…</div>;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Insights</span>
          <h1 className="mt-1 font-display text-2xl text-foreground">Analytics</h1>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div key={card.key} className="lux-card rounded-lg p-4 sm:p-6">
            <p className="text-xs text-secondary-text sm:text-sm">{card.label}</p>
            <p className="mt-1 font-display text-xl text-gold sm:text-2xl">{card.format(data.kpis[card.key])}</p>
          </div>
        ))}
      </div>

      <div className="lux-card mb-8 rounded-lg p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Revenue Over Time</h2>
        <div className="h-64 w-full sm:h-80">
          <RevenueChart data={data.revenueOverTime} />
        </div>
      </div>

      <div className="lux-card rounded-lg p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-secondary-text">
                <th className="py-2">Product</th>
                <th className="py-2">Units Sold</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p) => (
                <tr key={p.productId} className="border-b border-gold/5 text-foreground">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.unitsSold}</td>
                  <td className="py-2">${p.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {data.topProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-secondary-text">
                    No sales yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
