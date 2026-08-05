import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story and craftsmanship behind Ibrahim Fine Jewelry.",
  alternates: { canonical: `${getEnv().NEXT_PUBLIC_SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-6 font-serif text-3xl text-white sm:text-4xl">Our Story</h1>

      <div className="space-y-6 text-secondary-text">
        <p>
          Ibrahim was founded on a simple belief: fine jewelry should be an heirloom, not a
          trend. Every piece we create is designed to be worn for decades and passed down for
          generations.
        </p>
        <p>
          We work with trusted artisans and source materials responsibly, pairing traditional
          craftsmanship with modern design sensibilities. From engagement rings to everyday
          pieces, each item goes through a careful quality process before it reaches you.
        </p>
        <p>
          We ship across Pakistan and internationally, with every order backed by our quality
          guarantee and hassle-free returns policy.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gold/10 bg-card p-6 text-center">
          <p className="font-serif text-2xl text-gold">Ethically Sourced</p>
          <p className="mt-2 text-sm text-secondary-text">Every material traceable to origin</p>
        </div>
        <div className="rounded-lg border border-gold/10 bg-card p-6 text-center">
          <p className="font-serif text-2xl text-gold">Handcrafted</p>
          <p className="mt-2 text-sm text-secondary-text">Made by artisans, not machines</p>
        </div>
        <div className="rounded-lg border border-gold/10 bg-card p-6 text-center">
          <p className="font-serif text-2xl text-gold">Guaranteed</p>
          <p className="mt-2 text-sm text-secondary-text">Quality checked before it ships</p>
        </div>
      </div>
    </div>
  );
}
