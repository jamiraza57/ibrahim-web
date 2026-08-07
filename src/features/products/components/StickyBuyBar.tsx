"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/lib/format";

interface StickyBuyBarProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  inStock: boolean;
}

export function StickyBuyBar({ productId, slug, name, price, image, inStock }: StickyBuyBarProps) {
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAdd() {
    addItem({ productId, slug, name, price, image }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-gold/15 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden"
        >
          <div className="min-w-0">
            <p className="truncate text-sm">{name}</p>
            <p className="text-sm text-gold">{formatPrice(price)}</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            data-cursor="hover"
            className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-gold-foreground disabled:opacity-40"
          >
            {!inStock ? "Sold Out" : added ? "Added ✓" : "Add to Cart"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
