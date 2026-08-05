"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/features/cart/context/CartContext";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 text-center">
        <h1 className="mb-4 font-serif text-2xl text-white">Your cart is empty</h1>
        <Link href="/" className="text-gold hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-2xl text-white">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-wrap items-center gap-4 border-b border-gold/10 pb-4 sm:flex-nowrap">
            {item.image && (
              <Image src={item.image} alt={item.name} width={72} height={72} className="rounded object-cover" />
            )}
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="text-white hover:text-gold">
                {item.name}
              </Link>
              <p className="text-sm text-secondary-text">${item.price.toLocaleString()}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-16 rounded border border-gold/20 bg-transparent px-2 py-1 text-center text-white"
            />
            <button onClick={() => removeItem(item.productId)} className="text-sm text-red-400 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gold/10 pt-6">
        <span className="text-lg text-white">Subtotal</span>
        <span className="text-lg text-gold">${subtotal.toLocaleString()}</span>
      </div>

      <Link href="/checkout" className="mt-6 block">
        <MagneticButton className="w-full">Proceed to Checkout</MagneticButton>
      </Link>
    </div>
  );
}
