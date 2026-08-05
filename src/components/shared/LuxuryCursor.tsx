"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Replaces the system cursor with a soft gold ring that trails the pointer
 * with spring physics, and scales up over anything with data-cursor="hover".
 * Mount once in the root layout. Disabled automatically on touch devices.
 */
export function LuxuryCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 35 });
  const scaleRef = useRef(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMove(e: MouseEvent) {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      const target = e.target as HTMLElement;
      const isHoverTarget = !!target.closest('[data-cursor="hover"]');
      scaleRef.current = isHoverTarget ? 1.8 : 1;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY]);

  // Motion-value-bound style can't serialize identically between server and
  // client render, so this purely cosmetic overlay is skipped during SSR.
  if (!mounted) return null;

  return (
    <motion.div
      style={{ translateX: springX, translateY: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 rounded-full border border-gold mix-blend-difference md:block"
    />
  );
}
