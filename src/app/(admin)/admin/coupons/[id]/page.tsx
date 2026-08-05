"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CouponForm } from "@/features/coupons/components/CouponForm";
import type { CouponInput } from "@/features/coupons/schemas/coupon.schema";

export default function EditCouponPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<CouponInput> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/admin/coupons/${params.id}`)
      .then((res) => res.json())
      .then(({ data }) => setInitialValues({ ...data, value: Number(data.value), minPurchase: data.minPurchase ? Number(data.minPurchase) : null }));
  }, [params.id]);

  async function handleUpdate(data: CouponInput) {
    setError(null);
    const res = await fetch(`/api/v1/admin/coupons/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not update coupon");
      return;
    }
    router.push("/admin/coupons");
  }

  if (!initialValues) return <div className="p-8 text-secondary-text">Loading…</div>;

  return (
    <div className="max-w-lg p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-2xl text-white">Edit Coupon</h1>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <CouponForm defaultValues={initialValues} onSubmit={handleUpdate} submitLabel="Save Changes" />
    </div>
  );
}
