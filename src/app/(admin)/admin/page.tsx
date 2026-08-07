import Link from "next/link";
import {
  getKpiSummary,
  getRevenueOverTime,
  getRecentOrders,
  getLowStockProducts,
} from "@/features/analytics/services/analytics.service";
import { RevenueChart } from "@/features/analytics/components/RevenueChart";
import { formatPrice } from "@/lib/format";

// KPI/order/stock data must be fresh on every load, not baked in at build time.
export const dynamic = "force-dynamic";

const KPI_CARDS = [
  { key: "revenue" as const, label: "Total Revenue", format: (v: number) => formatPrice(v) },
  { key: "orderCount" as const, label: "Orders", format: (v: number) => v.toLocaleString() },
  { key: "avgOrderValue" as const, label: "Avg Order Value", format: (v: number) => formatPrice(v) },
  { key: "uniqueCustomers" as const, label: "Customers", format: (v: number) => v.toLocaleString() },
];

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-gold/20 text-gold",
  SHIPPED: "bg-gold/10 text-gold",
  PACKED: "bg-surface-2 text-foreground",
  PROCESSING: "bg-surface-2 text-foreground",
  CONFIRMED: "bg-surface-2 text-secondary-text",
  PENDING: "bg-surface-2 text-secondary-text",
  CANCELLED: "bg-destructive/20 text-destructive",
  REFUNDED: "bg-destructive/20 text-destructive",
};

export default async function AdminDashboardPage() {
  const [kpis, revenueOverTime, recentOrders, lowStockProducts] = await Promise.all([
    getKpiSummary(),
    getRevenueOverTime(30),
    getRecentOrders(5),
    getLowStockProducts(5),
  ]);

  return (
    <div className="p-4 sm:p-8">
      <span className="eyebrow">Overview</span>
      <h1 className="mt-1 font-display text-2xl text-foreground">Dashboard</h1>

      <div className="mb-8 mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div key={card.key} className="lux-card rounded-lg p-4 sm:p-6">
            <p className="text-xs text-secondary-text sm:text-sm">{card.label}</p>
            <p className="mt-1 font-display text-xl text-gold sm:text-2xl">{card.format(kpis[card.key])}</p>
          </div>
        ))}
      </div>

      <div className="lux-card mb-8 rounded-lg p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Revenue — Last 30 Days</h2>
        <div className="h-64 w-full sm:h-80">
          <RevenueChart data={revenueOverTime} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lux-card rounded-lg p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between border-b border-gold/5 pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="text-foreground hover:text-gold">
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-secondary-text">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[order.status] ?? "bg-surface-2 text-secondary-text"}`}>
                    {order.status}
                  </span>
                  <span className="text-foreground">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
            {recentOrders.length === 0 && <li className="text-sm text-secondary-text">No orders yet.</li>}
          </ul>
        </div>

        <div className="lux-card rounded-lg p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Low Stock</h2>
            <Link href="/admin/products" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="flex items-center justify-between border-b border-gold/5 pb-3 text-sm last:border-0 last:pb-0">
                <Link href={`/admin/products/${product.id}`} className="text-foreground hover:text-gold">
                  {product.name}
                </Link>
                <span className={product.stock === 0 ? "text-destructive" : "text-gold"}>
                  {product.stock} left
                </span>
              </li>
            ))}
            {lowStockProducts.length === 0 && <li className="text-sm text-secondary-text">All products well stocked.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
