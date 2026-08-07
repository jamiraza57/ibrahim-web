"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/features/cart/context/CartContext";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 text-center">
        <span className="eyebrow">Cart</span>
        <h1 className="mb-4 mt-2 font-display text-2xl">Your cart is empty</h1>
        <Link href="/" className="text-gold hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Cart</span>
      <h1 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">Your Cart</h1>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-wrap items-center gap-4 border-b border-gold/10 pb-4 sm:flex-nowrap"
            >
              {item.image && (
                <Image src={item.image} alt={item.name} width={72} height={72} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-display hover:text-gold">
                  {item.name}
                </Link>
                <p className="text-sm text-secondary-text">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 rounded border border-gold/20">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="flex h-8 w-8 items-center justify-center text-secondary-text hover:text-gold"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="flex h-8 w-8 items-center justify-center text-secondary-text hover:text-gold"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-sm text-destructive hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="lux-card h-fit rounded-lg p-6">
          <h2 className="mb-4 font-display text-lg">Order Summary</h2>
          <div className="flex items-center justify-between border-t border-gold/10 pt-4">
            <span className="text-secondary-text">Subtotal</span>
            <span className="text-lg text-gold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-secondary-text">Coupon codes and shipping are applied at checkout.</p>

          <Link href="/checkout" className="mt-6 block">
            <MagneticButton className="w-full">Proceed to Checkout</MagneticButton>
          </Link>
        </aside>
      </div>
    </div>
  );
}
