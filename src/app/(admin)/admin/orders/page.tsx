"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  customer: { name: string; email: string };
}

const STATUS_OPTIONS = ["", "PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    fetch(`/api/v1/admin/orders?${params}`)
      .then((res) => res.json())
      .then(({ data, meta }) => {
        setOrders(data ?? []);
        setTotalPages(meta?.totalPages ?? 1);
      });
  }, [status, search, page]);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-2xl text-white">Orders</h1>

      <div className="mb-4 flex gap-4">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by order #, email, phone…"
          className="w-full max-w-sm rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-secondary-text">
            <th className="py-2">Order #</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
            <th className="py-2">Payment</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gold/5 text-white">
              <td className="py-2">
                <Link href={`/admin/orders/${o.id}`} className="text-gold hover:underline">
                  {o.orderNumber}
                </Link>
              </td>
              <td className="py-2">
                {o.customer.name}
                <div className="text-xs text-secondary-text">{o.customer.email}</div>
              </td>
              <td className="py-2">${o.total}</td>
              <td className="py-2">{o.status}</td>
              <td className="py-2">{o.paymentStatus}</td>
              <td className="py-2 text-secondary-text">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-secondary-text">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded px-3 py-1 text-sm ${p === page ? "bg-gold text-background" : "border border-gold/20 text-white"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
