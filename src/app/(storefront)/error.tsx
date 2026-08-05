"use client";

import { useEffect } from "react";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">We hit a snag</h1>
      <p className="mt-2 max-w-sm text-secondary-text">
        Please try again, or head back to browse the collection while we sort this out.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <MagneticButton onClick={reset}>Try Again</MagneticButton>
      </div>
    </div>
  );
}
