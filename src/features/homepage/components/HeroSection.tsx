import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { heroConfigSchema } from "../schemas/homepage-section.schema";

export function HeroSection({ config }: { config: z.infer<typeof heroConfigSchema> }) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 text-center sm:px-6">
      {config.backgroundImageUrl && (
        <Image src={config.backgroundImageUrl} alt="" fill priority className="object-cover" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-background/40" />

      <RevealOnScroll className="relative z-10 mx-auto max-w-xl">
        <span className="eyebrow">Ibrahim Fine Jewelry</span>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
          <span className="text-gradient-gold">{config.heading}</span>
        </h1>
        {config.subheading && (
          <p className="mx-auto mt-5 max-w-md text-secondary-text sm:text-lg">{config.subheading}</p>
        )}
        {config.ctaLabel && config.ctaHref && (
          <Link href={config.ctaHref as Route} className="mt-8 inline-block">
            <MagneticButton>{config.ctaLabel}</MagneticButton>
          </Link>
        )}
      </RevealOnScroll>
    </section>
  );
}
