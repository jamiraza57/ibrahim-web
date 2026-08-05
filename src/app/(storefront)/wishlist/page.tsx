"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/features/cart/context/WishlistContext";
import { ProductCard } from "@/features/products/components/ProductCard";
import { MagneticButton } from "@/components/shared/MagneticButton";

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  salePrice: string | null;
  thumbnailUrl?: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/v1/products?ids=${productIds.join(",")}`)
      .then((res) => res.json())
      .then((data: { items: WishlistProduct[] }) => {
        if (!cancelled) setProducts(data.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (!loading && products.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <Heart className="h-10 w-10 text-gold/40" />
        <span className="eyebrow mt-6">Wishlist</span>
        <h1 className="mb-4 mt-2 font-display text-2xl sm:text-3xl">Your wishlist is empty</h1>
        <p className="mb-8 max-w-sm text-secondary-text">
          Save the pieces you love by tapping the heart icon, and they&apos;ll appear here.
        </p>
        <Link href="/search">
          <MagneticButton>Explore the Collection</MagneticButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center sm:text-left">
        <span className="eyebrow">Saved</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Your Wishlist</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: productIds.length || 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice ?? undefined}
              thumbnailUrl={product.thumbnailUrl}
              badge={!product.inStock ? "Out of Stock" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
