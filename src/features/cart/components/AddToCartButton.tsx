"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { MagneticButton } from "@/components/shared/MagneticButton";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  inStock: boolean;
}

export function AddToCartButton({ productId, slug, name, price, image, inStock }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, slug, name, price, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!inStock) {
    return (
      <button disabled className="rounded-full border border-gold/20 px-8 py-3 text-secondary-text">
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-16 rounded border border-gold/20 bg-transparent px-2 py-3 text-center text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <MagneticButton onClick={handleAdd} data-cursor="hover">
        {added ? "Added ✓" : "Add to Cart"}
      </MagneticButton>
    </div>
  );
}
