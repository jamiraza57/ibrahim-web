import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { bannerConfigSchema } from "../schemas/homepage-section.schema";

export function BannerSection({ config }: { config: z.infer<typeof bannerConfigSchema> }) {
  const content = (
    <div className="lux-card group relative aspect-[21/9] w-full overflow-hidden rounded-lg sm:aspect-[3/1]">
      <Image
        src={config.imageUrl}
        alt={config.heading ?? ""}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {(config.heading || config.ctaLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background/85 via-background/35 to-background/50 px-4 text-center">
          {config.heading && (
            <h2 className="font-display text-2xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-4xl">
              {config.heading}
            </h2>
          )}
          {config.ctaLabel && (
            <span className="mt-4 rounded-full border border-gold bg-background/40 px-6 py-2 text-sm tracking-wide text-gold backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold group-hover:text-gold-foreground">
              {config.ctaLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <RevealOnScroll>{config.ctaHref ? <Link href={config.ctaHref as Route}>{content}</Link> : content}</RevealOnScroll>
    </section>
  );
}
