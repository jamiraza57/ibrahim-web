"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const STORAGE_KEY = "ibrahim_recently_viewed_v1";
const MAX_STORED = 12;
const MAX_SHOWN = 4;

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  salePrice: string | null;
  thumbnailUrl?: string;
  stock: number;
  isNewArrival: boolean;
}

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const existing = readStoredIds().filter((id) => id !== currentProductId);
    const updated = [currentProductId, ...existing].slice(0, MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const toShow = existing.slice(0, MAX_SHOWN);
    if (toShow.length === 0) return;

    let cancelled = false;
    fetch(`/api/v1/products?ids=${toShow.join(",")}`)
      .then((res) => res.json())
      .then((data: { items: RecentProduct[] }) => {
        if (!cancelled) {
          const order = new Map(toShow.map((id, i) => [id, i]));
          setProducts([...data.items].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <RevealOnScroll>
        <span className="eyebrow">Recently Viewed</span>
        <h2 className="mb-8 mt-2 font-display text-2xl">Continue Browsing</h2>
      </RevealOnScroll>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,220px))] justify-center gap-4 sm:gap-6">
        {products.map((product, i) => (
          <RevealOnScroll key={product.id} delay={i * 0.06}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice ?? undefined}
              thumbnailUrl={product.thumbnailUrl}
              isNewArrival={product.isNewArrival}
              stock={product.stock}
            />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
