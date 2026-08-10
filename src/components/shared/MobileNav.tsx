"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useCart } from "@/features/cart/context/CartContext";
import { useWishlist } from "@/features/cart/context/WishlistContext";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { productIds } = useWishlist();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span className="h-px w-6 bg-foreground" />
        <span className="h-px w-6 bg-foreground" />
        <span className="h-px w-6 bg-foreground" />
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
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[80vw] border-l border-gold/10 bg-secondary-background p-6 md:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="mb-8 text-2xl text-secondary-text hover:text-gold"
              >
                ×
              </button>

              <nav className="flex flex-col gap-5">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={() => setIsOpen(false)}
                    className="font-serif text-lg hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-3 border-t border-gold/10 pt-4 text-sm text-secondary-text">
                  <Link href="/search" onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Search
                  </Link>
                  <Link href={"/account" as Route} onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Account
                  </Link>
                  <Link href={"/wishlist" as Route} onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Wishlist{productIds.length > 0 ? ` (${productIds.length})` : ""}
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)} className="hover:text-gold">
                    Cart{itemCount > 0 ? ` (${itemCount})` : ""}
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
