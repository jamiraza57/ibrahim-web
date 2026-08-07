import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { brandStoryConfigSchema } from "../schemas/homepage-section.schema";

export function BrandStorySection({ config }: { config: z.infer<typeof brandStoryConfigSchema> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <RevealOnScroll className="lux-card relative order-2 aspect-[4/5] overflow-hidden rounded-lg md:order-1">
          <Image src={config.imageUrl} alt={config.heading} fill className="object-cover" />
        </RevealOnScroll>
        <RevealOnScroll className="order-1 md:order-2">
          <span className="eyebrow">{config.eyebrow}</span>
          <h2 className="mb-5 mt-2 font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
            {config.heading}
          </h2>
          <p className="max-w-md text-secondary-text sm:text-lg">{config.body}</p>
          {config.ctaLabel && config.ctaHref && (
            <Link
              href={config.ctaHref as Route}
              data-cursor="hover"
              className="mt-8 inline-block rounded-full border border-gold/40 px-8 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
            >
              {config.ctaLabel}
            </Link>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
