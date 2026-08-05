"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, type CouponInput } from "../schemas/coupon.schema";

interface CouponFormProps {
  defaultValues?: Partial<CouponInput>;
  onSubmit: (data: CouponInput) => Promise<void>;
  submitLabel: string;
}

export function CouponForm({ defaultValues, onSubmit, submitLabel }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "", type: "PERCENTAGE", value: 10, isActive: true, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-secondary-text">Code</label>
        <input
          {...register("code")}
          placeholder="SUMMER25"
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 uppercase text-white"
        />
        {errors.code && <p className="mt-1 text-sm text-red-400">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Type</label>
          <select
            {...register("type")}
            className="w-full rounded border border-gold/20 bg-background px-3 py-2 text-white"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Value</label>
          <input
            type="number"
            step="0.01"
            {...register("value", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
          />
          {errors.value && <p className="mt-1 text-sm text-red-400">{errors.value.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Minimum Purchase</label>
          <input
            type="number"
            step="0.01"
            {...register("minPurchase", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Usage Limit</label>
          <input
            type="number"
            {...register("usageLimit", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Expires At</label>
        <input
          type="datetime-local"
          {...register("expiresAt")}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isActive")} id="isActive" />
        <label htmlFor="isActive" className="text-sm text-secondary-text">
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-gold px-6 py-2 font-medium text-background disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
