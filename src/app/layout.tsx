import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/features/cart/context/CartContext";
import { WishlistProvider } from "@/features/cart/context/WishlistContext";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(getEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Ibrahim — Fine Jewelry",
    template: "%s | Ibrahim",
  },
  description: "Luxury jewelry, crafted to last.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
