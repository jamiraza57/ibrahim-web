"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export function WishlistHeart({ productId }: { productId: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      data-cursor="hover"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
        active
          ? "bg-gold text-gold-foreground"
          : "bg-background/70 text-secondary-text hover:text-gold"
      }`}
    >
      <Heart className="h-4 w-4" fill={active ? "currentColor" : "none"} />
    </button>
  );
}
