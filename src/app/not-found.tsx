import Link from "next/link";

// Rendered inside the root layout's existing <html>/<body> — it must NOT
// declare its own, or the browser drops the duplicate tags and the page
// loses all its styling (only global-error.tsx replaces the root layout).
export default function RootNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center text-foreground">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-[0.08] blur-3xl" />
      <div className="relative">
        <p className="font-display text-7xl text-gradient-gold sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl">Page Not Found</h1>
        <p className="mx-auto mt-2 max-w-sm text-secondary-text">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-gold/40 px-8 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
