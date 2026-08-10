import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { verifyCustomerSession } from "@/lib/auth/jwt";
import { getCustomerSessionToken } from "@/lib/auth/cookies";
import { LogoutButton } from "@/components/shared/LogoutButton";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function AccountPage() {
  // Middleware already guards this route, so a session is guaranteed here —
  // this lookup is just for the customer's name/orders, not an auth check.
  const token = await getCustomerSessionToken();
  const session = token ? await verifyCustomerSession(token) : null;
  if (!session) return null;

  const customer = await prisma.customer.findUnique({ where: { id: session.sub } });
  const orders = await prisma.order.findMany({
    where: { customerId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl">
            {customer ? `Welcome, ${customer.name}` : "Your Account"}
          </h1>
        </div>
        <LogoutButton endpoint="/api/v1/auth/logout" redirectTo={"/account/login" as Route} />
      </div>

      <h2 className="mb-4 font-display text-lg">Order History</h2>

      {orders.length === 0 ? (
        <p className="lux-card rounded-lg p-6 text-secondary-text">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="text-gold hover:underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-success/${order.orderNumber}` as Route}
              className="lux-card block rounded-lg p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-foreground">{order.orderNumber}</span>
                <span className="text-xs uppercase tracking-widest text-gold">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-secondary-text">
                <span>
                  {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                  {order.createdAt.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="text-foreground">{formatPrice(Number(order.total))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
