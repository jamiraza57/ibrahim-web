import type { Metadata } from "next";
import Link from "next/link";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, shipping, and caring for your jewelry.",
  alternates: { canonical: `${getEnv().NEXT_PUBLIC_SITE_URL}/faq` },
};

const FAQS = [
  {
    question: "How do I place an order?",
    answer:
      "Add any piece to your bag and check out with your delivery details. We currently accept Cash on Delivery only — you pay when your order arrives.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders ship within 2–3 business days and arrive within 3–7 business days, depending on your location. You'll be able to track the status of your order on the Track Order page once it's placed.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Yes — unworn items in their original packaging can be returned within 7 days of delivery. See our Refund Policy for the full details, including which items aren't eligible for return.",
  },
  {
    question: "Is my jewelry covered under warranty?",
    answer:
      "Every piece is quality-checked before it ships and covered against manufacturing defects. If something isn't right, contact us within 48 hours of delivery with photos and we'll make it right.",
  },
  {
    question: "How should I care for my jewelry?",
    answer:
      "Store pieces separately in a soft pouch, keep them away from perfume, lotion, and moisture, and have settings inspected once a year to keep stones secure.",
  },
  {
    question: "Do you offer custom or engraved pieces?",
    answer:
      "Reach out through the Contact page with what you have in mind — we regularly work with clients on custom sizing and engraving.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Support</span>
      <h1 className="mb-2 mt-2 font-display text-3xl sm:text-4xl">Frequently Asked Questions</h1>
      <p className="mb-10 text-secondary-text">
        Can&apos;t find what you&apos;re looking for?{" "}
        <Link href="/contact" className="text-gold hover:underline">
          Get in touch
        </Link>
        .
      </p>

      <div className="divide-y divide-gold/10 border-t border-gold/10">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="shrink-0 text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-secondary-text">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
