"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistHeart } from "@/features/cart/components/WishlistHeart";
import { QuickViewTrigger } from "./QuickView";
import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features/cart/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id?: string;
  slug: string;
  name: string;
  price: string | number;
  salePrice?: string | number | null;
  thumbnailUrl?: string;
  category?: string;
  badge?: string;
  isNewArrival?: boolean;
  stock?: number;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  salePrice,
  thumbnailUrl,
  category,
  badge,
  isNewArrival,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isOnSale = Boolean(salePrice && Number(salePrice) < Number(price));
  const percentOff = isOnSale ? Math.round((1 - Number(salePrice) / Number(price)) * 100) : 0;
  const isLowStock = typeof stock === "number" && stock > 0 && stock <= LOW_STOCK_THRESHOLD;
  const isOutOfStock = typeof stock === "number" && stock <= 0;
  const effectivePrice = Number(salePrice ?? price);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!id || isOutOfStock) return;
    addItem({ productId: id, slug, name, price: effectivePrice, image: thumbnailUrl }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${slug}`} data-cursor="hover" className="group block">
      <div className="lux-card relative aspect-square overflow-hidden rounded-lg">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isOnSale && (
            <span className="rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-gold-foreground">
              −{percentOff}%
            </span>
          )}
          {isNewArrival && (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur-sm">
              New
            </span>
          )}
          {badge && (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur-sm">
              {badge}
            </span>
          )}
          {isLowStock && (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest text-secondary-text backdrop-blur-sm">
              Only {stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest text-secondary-text backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        {id && (
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
            <WishlistHeart productId={id} />
            <QuickViewTrigger productId={id} />
          </div>
        )}
      </div>

      <div className="mt-3">
        {category && <p className="eyebrow mb-1">{category}</p>}
        <h3 className="font-display text-sm group-hover:text-gold">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-sm text-gold">{formatPrice(Number(salePrice))}</span>
              <span className="text-xs text-secondary-text line-through">
                {formatPrice(Number(price))}
              </span>
            </>
          ) : (
            <span className="text-sm text-secondary-text">{formatPrice(Number(price))}</span>
          )}
        </div>

        {id && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            data-cursor="hover"
            className="mt-3 w-full rounded-full border border-gold px-4 py-2 text-xs uppercase tracking-widest text-gold transition-colors duration-300 hover:bg-gold hover:text-gold-foreground disabled:cursor-not-allowed disabled:border-secondary-text/30 disabled:text-secondary-text/50 disabled:hover:bg-transparent"
          >
            {isOutOfStock ? "Sold Out" : added ? "Added ✓" : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
}
