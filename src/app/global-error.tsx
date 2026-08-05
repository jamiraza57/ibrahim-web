"use client";

import "./globals.css";

// Only file allowed to render its own <html>/<body> — it replaces the root
// layout entirely, which only happens if the root layout itself throws.
// It doesn't render layout.tsx, so globals.css must be imported here too.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground antialiased">
        <p className="font-display text-2xl">Something went wrong</p>
        <p className="mt-2 max-w-sm text-sm text-secondary-text">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full border border-gold/40 px-8 py-3 text-sm text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
