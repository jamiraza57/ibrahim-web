import { Search, ShoppingBag, PackageCheck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

// Describes the site's actual checkout flow (browse → order → pay on delivery),
// not an in-person consultation process this store doesn't offer.
const STEPS = [
  { icon: Search, title: "Browse & Select", body: "Explore the collection and pick the piece that's right for you." },
  { icon: ShoppingBag, title: "Place Your Order", body: "Check out with your delivery details — no payment due yet." },
  { icon: PackageCheck, title: "Pay on Delivery", body: "Inspect your order at your doorstep and pay in cash on arrival." },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Ordering</span>
        <h2 className="mb-10 mt-2 font-display text-2xl sm:text-3xl">How It Works</h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <RevealOnScroll key={step.title} delay={i * 0.08} className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-surface">
              <step.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
            </span>
            <h3 className="font-display text-lg">{step.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-secondary-text">{step.body}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
