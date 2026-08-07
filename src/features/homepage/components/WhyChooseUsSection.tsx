import { Banknote, ShieldCheck, Gem, Truck } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

// Reuses the same trust line already shown in the Footer, rather than inventing
// new guarantees (e.g. a specific certification or resize policy) we can't verify.
const ITEMS = [
  { icon: Banknote, label: "Cash on Delivery" },
  { icon: ShieldCheck, label: "Insured Shipping" },
  { icon: Gem, label: "Quality Guaranteed" },
  { icon: Truck, label: "Nationwide Delivery" },
];

export function WhyChooseUsSection() {
  return (
    <section className="border-y border-gold/10 bg-surface-2/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:py-14">
        {ITEMS.map((item, i) => (
          <RevealOnScroll key={item.label} delay={i * 0.06} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-widest text-secondary-text sm:text-sm">{item.label}</span>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
