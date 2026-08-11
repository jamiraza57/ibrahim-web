import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: `${getSiteUrl()}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl">Terms of Service</h1>

      <div className="space-y-6 text-sm text-secondary-text">
        <p>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Orders</h2>
          <p>
            All orders are subject to acceptance and product availability. Prices are listed
            in USD unless otherwise stated and may change without notice, though a price
            change never affects an order already placed. Orders are currently fulfilled on a
            Cash on Delivery basis — payment is collected at the time of delivery.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Product Descriptions</h2>
          <p>
            We do our best to describe and photograph every piece accurately, including
            material, purity, and stone details. Minor variations in color or finish can
            occur due to the handcrafted nature of fine jewelry and photography/screen
            differences.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Cancellations</h2>
          <p>
            Orders can be cancelled before they are marked as shipped by contacting us through
            the Contact page with your order number. Once an order has shipped, our Refund
            Policy applies instead.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Intellectual Property</h2>
          <p>
            All content on this site — including product photography, descriptions, and
            branding — is the property of Ibrahim and may not be reproduced without
            permission.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Limitation of Liability</h2>
          <p>
            We are not liable for indirect or consequential damages arising from the use of
            this site or the products purchased through it, beyond the value of the order
            itself.
          </p>
        </section>
      </div>
    </div>
  );
}
