import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: `${getEnv().NEXT_PUBLIC_SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl">Privacy Policy</h1>

      <div className="space-y-6 text-sm text-secondary-text">
        <p>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Information We Collect</h2>
          <p>
            When you place an order, we collect your name, email address, phone number, and
            shipping address. This information is used solely to process and deliver your
            order, and to contact you about it if needed. We do not require an account to
            shop with us — orders are processed as a guest.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">How We Use Your Information</h2>
          <p>
            Your contact and shipping details are used to fulfill your order, send order
            confirmations and status updates, and respond to any customer service inquiries
            you raise with us. If you subscribe to our newsletter, we use your email to send
            occasional updates about new collections and offers — you can unsubscribe at any
            time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Data Sharing</h2>
          <p>
            We share order information with our payment processing and delivery partners only
            to the extent necessary to fulfill your order. We do not sell your personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Data Retention</h2>
          <p>
            Order records are retained to comply with tax and accounting obligations and to
            support any future customer service needs related to that order.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Your Rights</h2>
          <p>
            You can request a copy of the personal data we hold about you, or request its
            deletion, by contacting us through our Contact page. We will respond within a
            reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif text-lg text-foreground">Contact</h2>
          <p>Questions about this policy can be sent through our Contact page.</p>
        </section>
      </div>
    </div>
  );
}
