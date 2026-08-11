"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MagneticButton } from "@/components/shared/MagneticButton";
import type { HeroSlide } from "../schemas/homepage-section.schema";

const AUTOPLAY_MS = 6000;

const textVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const activeSlides = useMemo(() => {
    const active = slides.filter((s) => s.isActive);
    return active.length > 0 ? active : slides.slice(0, 1);
  }, [slides]);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % activeSlides.length) + activeSlides.length) % activeSlides.length);
    },
    [activeSlides.length]
  );

  useEffect(() => {
    if (isPaused || reducedMotion || activeSlides.length <= 1) return;
    timerRef.current = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, isPaused, reducedMotion, activeSlides.length, goTo]);

  const slide = activeSlides[index];
  if (!slide) return null;

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative -mt-[var(--header-offset,88px)] h-screen min-h-[560px] w-full overflow-hidden bg-background"
    >
      <span className="sr-only" aria-live="polite">
        Slide {index + 1} of {activeSlides.length}: {slide.heading}
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {slide.imageUrl && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: reducedMotion ? 1 : 1.08 }}
              transition={{ duration: AUTOPLAY_MS / 1000 + 1, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.imageUrl}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
              />
            </motion.div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/25 to-background/45" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            className="mx-auto max-w-xl"
          >
            {slide.badge && (
              <motion.span variants={itemVariants} className="eyebrow inline-block rounded-full border border-gold/30 px-4 py-1.5">
                {slide.badge}
              </motion.span>
            )}
            <motion.h1
              variants={itemVariants}
              className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl"
            >
              <span className="text-gradient-gold">{slide.heading}</span>
            </motion.h1>
            {slide.subheading && (
              <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-md text-secondary-text sm:text-lg">
                {slide.subheading}
              </motion.p>
            )}
            {slide.ctaLabel && slide.ctaHref && (
              <motion.div variants={itemVariants} className="mt-8">
                <Link href={slide.ctaHref as Route} className="inline-block">
                  <MagneticButton>{slide.ctaLabel}</MagneticButton>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            data-cursor="hover"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold/30 bg-background/30 p-2.5 text-foreground backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:left-6"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            data-cursor="hover"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold/30 bg-background/30 p-2.5 text-foreground backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:right-6"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 sm:bottom-10">
            <span className="text-xs tracking-widest text-secondary-text">
              {String(index + 1).padStart(2, "0")} / {String(activeSlides.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              {activeSlides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className="relative h-[3px] w-10 overflow-hidden rounded-full bg-foreground/20"
                >
                  {i === index && !isPaused && !reducedMotion && (
                    <motion.span
                      key={index}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                      className="absolute inset-y-0 left-0 bg-gold"
                    />
                  )}
                  {i === index && (isPaused || reducedMotion) && <span className="absolute inset-0 bg-gold" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
