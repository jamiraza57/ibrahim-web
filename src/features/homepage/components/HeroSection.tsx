import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { JewelryShowcase } from "@/components/three/JewelryShowcase";
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

      {/* Soft radial glow behind the 3D piece so it doesn't float on flat black */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full opacity-30 blur-3xl md:translate-x-0"
        style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="text-center md:text-left">
          <h1 className="bg-gradient-to-r from-white via-gold to-white bg-[length:200%_auto] bg-clip-text font-serif text-4xl leading-tight text-transparent [animation:shine_6s_linear_infinite] sm:text-5xl md:text-6xl">
            {config.heading}
          </h1>
          {config.subheading && (
            <p className="mx-auto mt-5 max-w-md text-secondary-text sm:text-lg md:mx-0">{config.subheading}</p>
          )}
          {config.ctaLabel && config.ctaHref && (
            <Link href={config.ctaHref as Route} className="mt-8 inline-block">
              <MagneticButton>{config.ctaLabel}</MagneticButton>
            </Link>
          )}
        </div>

        {/* The 3D piece is the centerpiece on desktop; shorter and simplified on mobile
            so it doesn't dominate a small viewport or tax lower-powered phones as hard. */}
        <div className="h-[280px] w-full sm:h-[380px] md:h-[480px]">
          <JewelryShowcase />
        </div>
      </div>

      <style>{`
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}
