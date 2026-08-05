import type { Route } from "next";
import Link from "next/link";
import { MagneticButton } from "@/components/shared/MagneticButton";

const suggestions: { label: string; href: Route }[] = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Shop All", href: "/search" },
  { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-[0.08] blur-3xl" />

      <div className="relative">
        <span className="eyebrow">Error 404</span>
        <p className="mt-4 font-display text-7xl text-gradient-gold sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">This piece has been moved</h1>
        <p className="mx-auto mt-2 max-w-sm text-secondary-text">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to
          something beautiful.
        </p>

        <Link href="/" className="mt-8 inline-block">
          <MagneticButton>Back to Home</MagneticButton>
        </Link>

        <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-gold/10 pt-6">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-sm tracking-wide text-secondary-text transition-colors hover:text-gold"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
