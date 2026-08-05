"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-2xl text-foreground">Something went wrong</p>
      <p className="mt-2 max-w-sm text-secondary-text">
        This admin page ran into an error. You can try again or head back to the dashboard.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border border-gold/40 px-8 py-3 text-sm text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
      >
        Try Again
      </button>
    </div>
  );
}
