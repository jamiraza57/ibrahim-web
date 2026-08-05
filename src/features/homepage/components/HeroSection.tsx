import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { JewelryShowcase } from "@/components/three/JewelryShowcase";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { heroConfigSchema } from "../schemas/homepage-section.schema";

export function HeroSection({ config }: { config: z.infer<typeof heroConfigSchema> }) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden px-4 sm:px-6">
      {config.backgroundImageUrl && (
        <Image
          src={config.backgroundImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      {/* Soft radial glow behind the 3D piece so it doesn't float on flat black */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-gold opacity-20 blur-3xl md:translate-x-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <RevealOnScroll className="text-center md:text-left">
          <span className="eyebrow">Ibrahim Fine Jewelry</span>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient-gold">{config.heading}</span>
          </h1>
          {config.subheading && (
            <p className="mx-auto mt-5 max-w-md text-secondary-text sm:text-lg md:mx-0">{config.subheading}</p>
          )}
          {config.ctaLabel && config.ctaHref && (
            <Link href={config.ctaHref as Route} className="mt-8 inline-block">
              <MagneticButton>{config.ctaLabel}</MagneticButton>
            </Link>
          )}
        </RevealOnScroll>

        {/* The 3D piece is the centerpiece on desktop; shorter and simplified on mobile
            so it doesn't dominate a small viewport or tax lower-powered phones as hard. */}
        <div className="h-[280px] w-full sm:h-[380px] md:h-[480px]">
          <JewelryShowcase />
        </div>
      </div>
    </section>
  );
}
