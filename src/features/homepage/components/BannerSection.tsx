"use client";

import { useRef } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { bannerConfigSchema } from "../schemas/homepage-section.schema";

export function BannerSection({ config }: { config: z.infer<typeof bannerConfigSchema> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-8%", "8%"]);

  if (!config.imageUrl) return null;

  const content = (
    <div ref={containerRef} className="lux-card group relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:aspect-[16/9]">
      <motion.div style={{ y }} className="absolute inset-0 -top-[8%] h-[116%]">
        <Image src={config.imageUrl} alt={config.heading ?? ""} fill className="object-cover" />
      </motion.div>
      {(config.heading || config.ctaLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background/85 via-background/30 to-background/50 px-4 text-center">
          {config.heading && (
            <h2 className="font-display text-3xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl">
              {config.heading}
            </h2>
          )}
          {config.ctaLabel && (
            <span className="mt-6 rounded-full border border-gold bg-background/40 px-7 py-2.5 text-sm tracking-widest text-gold backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold group-hover:text-gold-foreground">
              {config.ctaLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <RevealOnScroll>{config.ctaHref ? <Link href={config.ctaHref as Route}>{content}</Link> : content}</RevealOnScroll>
    </section>
  );
}
