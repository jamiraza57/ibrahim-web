"use client";

import { useEffect, useRef } from "react";

/**
 * Pins the announcement bar + header together at the top of the viewport so
 * the header can truly float over page content (the homepage hero in
 * particular) instead of just sitting above it in flow. Measures its own
 * rendered height — which changes depending on whether the announcement bar
 * is active — and publishes it as `--header-offset` so every page can reserve
 * the right amount of top padding without hardcoding a pixel value.
 */
export function FixedHeaderStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setOffset = () => {
      document.documentElement.style.setProperty("--header-offset", `${el.offsetHeight}px`);
    };

    setOffset();
    const observer = new ResizeObserver(setOffset);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-50">
      {children}
    </div>
  );
}
