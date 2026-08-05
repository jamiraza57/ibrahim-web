"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span className="h-px w-6 bg-white" />
        <span className="h-px w-6 bg-white" />
        <span className="h-px w-6 bg-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[80vw] bg-secondary-background p-6 md:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="mb-8 text-2xl text-white"
              >
                ×
              </button>

              <nav className="flex flex-col gap-5">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base text-white hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-3 border-t border-gold/10 pt-4 text-sm text-secondary-text">
                  <Link href="/search" onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Search
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Wishlist
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Cart
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
