"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/cart/components/WishlistButton";

interface QuickViewProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  salePrice: string | null;
  thumbnailUrl?: string;
  stock: number;
  isNewArrival: boolean;
  shortDescription: string | null;
  material: string | null;
}

export function QuickViewTrigger({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<QuickViewProduct | null>(null);
  const [loading, setLoading] = useState(false);

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setLoading(true);
    fetch(`/api/v1/products?ids=${productId}`)
      .then((res) => res.json())
      .then((data: { items: QuickViewProduct[] }) => setProduct(data.items[0] ?? null))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <button
        onClick={handleOpen}
        data-cursor="hover"
        aria-label="Quick view"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-secondary-text backdrop-blur-sm transition-colors hover:text-gold"
      >
        <Eye className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={product?.name ?? "Quick view"}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-1/2 z-[61] mx-auto max-w-2xl -translate-y-1/2 rounded-lg border border-gold/15 bg-secondary-background p-6 sm:p-8"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close quick view"
                className="absolute right-4 top-4 text-secondary-text hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>

              {loading || !product ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="aspect-square animate-pulse rounded-lg bg-card" />
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-card" />
                    <div className="h-6 w-2/3 animate-pulse rounded bg-card" />
                    <div className="h-4 w-1/4 animate-pulse rounded bg-card" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
                    {product.thumbnailUrl && (
                      <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    {product.material && <span className="eyebrow">{product.material}</span>}
                    <h2 className="mt-2 font-display text-2xl">{product.name}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg text-gold">${Number(product.salePrice).toLocaleString()}</span>
                          <span className="text-sm text-secondary-text line-through">
                            ${Number(product.price).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg text-gold">${Number(product.price).toLocaleString()}</span>
                      )}
                    </div>
                    {product.shortDescription && (
                      <p className="mt-3 text-sm text-secondary-text">{product.shortDescription}</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <AddToCartButton
                        productId={product.id}
                        slug={product.slug}
                        name={product.name}
                        price={Number(product.salePrice ?? product.price)}
                        image={product.thumbnailUrl}
                        inStock={product.stock > 0}
                      />
                      <WishlistButton productId={product.id} />
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="mt-4 inline-block text-sm text-secondary-text hover:text-gold hover:underline"
                    >
                      View full details →
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
