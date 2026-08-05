"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  couponCode: string | null;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  address: { line1: string; line2: string | null; city: string; state: string | null; postalCode: string; country: string; notes: string | null };
  items: { id: string; name: string; price: string; quantity: number }[];
  history: { id: string; status: string; note: string | null; createdAt: string }[];
}

const NEXT_STATUS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/admin/orders/${params.id}`);
    const { data } = await res.json();
    setOrder(data);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function transitionTo(newStatus: string) {
    setUpdating(true);
    const res = await fetch(`/api/v1/admin/orders/${params.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Could not update status");
    }
    await load();
    setUpdating(false);
  }

  if (!order) return <div className="p-8 text-secondary-text">Loading…</div>;

  return (
    <div className="max-w-4xl p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-white">{order.orderNumber}</h1>
        <div className="flex gap-2">
          {NEXT_STATUS[order.status]?.map((next) => (
            <button
              key={next}
              disabled={updating}
              onClick={() => transitionTo(next)}
              className="rounded bg-gold px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              Mark {next}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-gold/20 bg-card p-6">
          <h2 className="mb-3 font-serif text-lg text-white">Customer</h2>
          <p className="text-white">{order.customer.name}</p>
          <p className="text-sm text-secondary-text">{order.customer.email}</p>
          <p className="text-sm text-secondary-text">{order.customer.phone}</p>

          <h3 className="mb-1 mt-4 text-sm text-secondary-text">Shipping Address</h3>
          <p className="text-sm text-white">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}
            {order.address.state ? `, ${order.address.state}` : ""} {order.address.postalCode},{" "}
            {order.address.country}
          </p>
          {order.address.notes && <p className="mt-1 text-xs text-secondary-text">Note: {order.address.notes}</p>}
        </div>

        <div className="rounded border border-gold/20 bg-card p-6">
          <h2 className="mb-3 font-serif text-lg text-white">Payment</h2>
          <p className="text-sm text-white">Method: Cash on Delivery</p>
          <p className="text-sm text-white">Status: {order.paymentStatus}</p>
          {order.couponCode && <p className="text-sm text-white">Coupon: {order.couponCode}</p>}

          <div className="mt-4 space-y-1 border-t border-gold/10 pt-4 text-sm">
            <div className="flex justify-between text-secondary-text">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Discount</span>
              <span>-${order.discount}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Shipping</span>
              <span>${order.shipping}</span>
            </div>
            <div className="flex justify-between font-medium text-white">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded border border-gold/20 bg-card p-6">
        <h2 className="mb-3 font-serif text-lg text-white">Items</h2>
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gold/5 text-white">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-secondary-text">× {item.quantity}</td>
                <td className="py-2">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="mt-6 rounded border border-gold/20 bg-card p-6">
        <h2 className="mb-3 font-serif text-lg text-white">Timeline</h2>
        <ol className="space-y-3 border-l border-gold/20 pl-4">
          {order.history.map((h) => (
            <li key={h.id} className="text-sm">
              <span className="font-medium text-gold">{h.status}</span>{" "}
              <span className="text-secondary-text">{new Date(h.createdAt).toLocaleString()}</span>
              {h.note && <p className="text-secondary-text">{h.note}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
