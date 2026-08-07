import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: `${getEnv().NEXT_PUBLIC_SITE_URL}/refund-policy` },
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl">Refund Policy</h1>

      <div className="space-y-6 text-sm text-secondary-text">
        <p>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Returns</h2>
          <p>
            We accept returns within 7 days of delivery for unworn items in their original
            packaging with all tags attached. To start a return, contact us through the
            Contact page with your order number and reason for return.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Non-Returnable Items</h2>
          <p>
            Custom or engraved pieces cannot be returned unless there is a manufacturing
            defect. Earrings cannot be returned for hygiene reasons unless unopened in their
            original sealed packaging.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Refund Process</h2>
          <p>
            Once we receive and inspect your returned item, we will notify you of the
            approval status. Approved refunds for Cash on Delivery orders are issued via bank
            transfer to an account you provide, typically within 5–7 business days.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Damaged or Incorrect Items</h2>
          <p>
            If you receive a damaged or incorrect item, contact us within 48 hours of delivery
            with photos of the item and packaging, and we will arrange a replacement or refund
            at no cost to you.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Exchanges</h2>
          <p>
            We&apos;re happy to exchange an item for a different size or style of equal value,
            subject to availability. Contact us to arrange an exchange.
          </p>
        </section>
      </div>
    </div>
  );
}
