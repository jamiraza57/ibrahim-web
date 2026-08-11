import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Shipping Policy",
  alternates: { canonical: `${getSiteUrl()}/shipping-policy` },
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl">Shipping Policy</h1>

      <div className="space-y-6 text-sm text-secondary-text">
        <p>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Processing Time</h2>
          <p>
            Orders are inspected, packaged, and dispatched within 2–3 business days of being placed.
            You&apos;ll receive updates as your order moves through Confirmed, Processing, Packed, and
            Shipped stages — check anytime on the Track Order page.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Delivery Time</h2>
          <p>
            Delivery typically takes 3–7 business days depending on your location. Remote areas may
            take a little longer. All shipments are insured for their full value.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Shipping Charges</h2>
          <p>
            Shipping costs, if any, are calculated at checkout and shown before you confirm your
            order. We regularly run promotions offering complimentary shipping — any applicable
            discount is reflected automatically.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Cash on Delivery</h2>
          <p>
            We currently accept Cash on Delivery only — you pay in cash when your order is handed to
            you. No online payment is required at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Packaging</h2>
          <p>
            Every order arrives in signature Ibrahim packaging, sealed and ready to gift or keep.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Order Issues</h2>
          <p>
            If your order hasn&apos;t arrived within the expected window, or arrives damaged, contact
            us through the Contact page with your order number and we&apos;ll sort it out promptly.
          </p>
        </section>
      </div>
    </div>
  );
}
