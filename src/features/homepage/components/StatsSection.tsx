import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { statsConfigSchema } from "../schemas/homepage-section.schema";

export function StatsSection({ config }: { config: z.infer<typeof statsConfigSchema> }) {
  return (
    <section className="border-y border-gold/10 bg-surface-2/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:py-14">
        {config.items.map((item, i) => (
          <RevealOnScroll key={`${item.label}-${i}`} delay={i * 0.06} className="text-center">
            <div className="font-display text-2xl text-gradient-gold sm:text-3xl">{item.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-secondary-text sm:text-sm">
              {item.label}
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
