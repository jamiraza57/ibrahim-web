"use client";

import { useWishlist } from "../context/WishlistContext";

export function WishlistButton({ productId }: { productId: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      onClick={() => toggle(productId)}
      data-cursor="hover"
      aria-pressed={active}
      className={`rounded-full border px-4 py-3 text-sm transition-colors ${
        active ? "border-gold bg-gold text-background" : "border-gold/20 text-secondary-text hover:border-gold"
      }`}
    >
      {active ? "Wishlisted ♥" : "Add to Wishlist"}
    </button>
  );
}
