"use client";

import { useState } from "react";
import { PackageSearch, CheckCircle2, Circle } from "lucide-react";
import { MagneticButton } from "@/components/shared/MagneticButton";

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"] as const;

interface TrackedOrder {
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: { name: string; quantity: number; price: string }[];
  history: { status: string; note: string | null; createdAt: string }[];
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setOrder(null);

    const res = await fetch("/api/v1/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setOrder(data);
    setStatus("idle");
  }

  const isTerminalNonDelivery = order?.status === "CANCELLED" || order?.status === "REFUNDED";
  const currentStepIndex = order ? STEPS.indexOf(order.status as (typeof STEPS)[number]) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Order Status</span>
      <h1 className="mb-2 mt-2 font-display text-3xl sm:text-4xl">Track Your Order</h1>
      <p className="mb-8 text-secondary-text">
        Enter your order number and the email you used at checkout to see the latest status.
      </p>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Order Number</label>
          <input
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. IB-10023"
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="sm:col-span-2">
          <MagneticButton type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Searching…" : "Track Order"}
          </MagneticButton>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {order && (
        <div className="lux-card mt-10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Order</p>
              <p className="font-display text-lg">{order.orderNumber}</p>
            </div>
            <p className="font-display text-lg text-gold">${order.total}</p>
          </div>

          {isTerminalNonDelivery ? (
            <p className="mt-6 text-sm text-secondary-text">
              This order is <span className="text-gold">{order.status.toLowerCase()}</span>. Contact us if you have
              questions.
            </p>
          ) : (
            <ol className="mt-8 flex flex-wrap gap-y-6">
              {STEPS.map((step, i) => {
                const reached = i <= currentStepIndex;
                return (
                  <li key={step} className="flex flex-1 min-w-[100px] flex-col items-center gap-2 text-center">
                    {reached ? (
                      <CheckCircle2 className="h-5 w-5 text-gold" />
                    ) : (
                      <Circle className="h-5 w-5 text-secondary-text/40" />
                    )}
                    <span className={`text-xs uppercase tracking-wide ${reached ? "text-gold" : "text-secondary-text/50"}`}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-8 space-y-2 border-t border-gold/10 pt-4 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-secondary-text">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!order && status === "idle" && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-secondary-text">
          <PackageSearch className="h-10 w-10 text-gold/40" />
          <p className="max-w-sm text-sm">
            Your order status and delivery progress will appear here once you look it up.
          </p>
        </div>
      )}
    </div>
  );
}
