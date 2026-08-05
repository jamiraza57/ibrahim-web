"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CouponForm } from "@/features/coupons/components/CouponForm";
import type { CouponInput } from "@/features/coupons/schemas/coupon.schema";

interface CouponRow {
  id: string;
  code: string;
  type: string;
  value: string;
  usedCount: number;
  usageLimit: number | null;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/v1/admin/coupons");
    const { data } = await res.json();
    setCoupons(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: CouponInput) {
    setError(null);
    const res = await fetch("/api/v1/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not create coupon");
      return;
    }
    setShowForm(false);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/v1/admin/coupons/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-white">Coupons</h1>
        <button onClick={() => setShowForm((v) => !v)} className="rounded bg-gold px-4 py-2 text-sm font-medium text-background">
          {showForm ? "Cancel" : "New Coupon"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 max-w-lg rounded border border-gold/20 bg-card p-6">
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <CouponForm onSubmit={handleCreate} submitLabel="Create Coupon" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-secondary-text">
            <th className="py-2">Code</th>
            <th className="py-2">Discount</th>
            <th className="py-2">Used</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b border-gold/5 text-white">
              <td className="py-2 font-mono">{c.code}</td>
              <td className="py-2">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
              <td className="py-2">
                {c.usedCount}
                {c.usageLimit ? ` / ${c.usageLimit}` : ""}
              </td>
              <td className="py-2">{c.isActive ? "Active" : "Inactive"}</td>
              <td className="py-2">
                <Link href={`/admin/coupons/${c.id}`} className="mr-4 text-gold hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {coupons.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-secondary-text">
                No coupons yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
