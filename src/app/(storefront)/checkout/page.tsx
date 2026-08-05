"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/features/cart/context/CartContext";
import { MagneticButton } from "@/components/shared/MagneticButton";

const checkoutFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { country: "Pakistan" },
  });

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) return;

    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: values.name, email: values.email, phone: values.phone },
          address: {
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
            notes: values.notes,
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: values.couponCode || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }

      clear();
      router.push(`/order-success/${json.data.orderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 text-center text-secondary-text">
        Your cart is empty — nothing to check out.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Checkout</span>
      <h1 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">Complete Your Order</h1>

      <div className="grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:col-span-2">
          <h2 className="font-display text-lg">Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-secondary-text">Full Name</label>
              <input {...register("name")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Email</label>
              <input {...register("email")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Phone</label>
              <input {...register("phone")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <h2 className="pt-4 font-display text-lg">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-secondary-text">Address Line 1</label>
              <input {...register("line1")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.line1 && <p className="mt-1 text-sm text-destructive">{errors.line1.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-secondary-text">Address Line 2 (optional)</label>
              <input {...register("line2")} placeholder="Apartment, suite, floor…" className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">City</label>
              <input {...register("city")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">State / Province</label>
              <input {...register("state")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.state && <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Postal Code</label>
              <input {...register("postalCode")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.postalCode && <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Country</label>
              <input {...register("country")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
              {errors.country && <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-secondary-text">Delivery Notes (optional)</label>
              <textarea {...register("notes")} rows={2} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none" />
            </div>
          </div>

          <h2 className="pt-4 font-display text-lg">Payment</h2>
          <p className="rounded border border-gold/20 bg-card px-4 py-3 text-sm text-secondary-text">
            Cash on Delivery — pay when your order arrives.
          </p>

          <h2 className="pt-4 font-display text-lg">Coupon</h2>
          <input
            {...register("couponCode")}
            placeholder="Have a coupon code?"
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none"
          />

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <MagneticButton type="submit" disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "Placing Order…" : "Place Order (Cash on Delivery)"}
          </MagneticButton>
        </form>

        <aside className="lux-card h-fit rounded-lg p-6">
          <h2 className="mb-4 font-display text-lg">Order Summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-secondary-text">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gold/10 pt-4 text-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-xs text-secondary-text">
            Shipping and any coupon discount are calculated after you place the order.
          </p>
        </aside>
      </div>
    </div>
  );
}
