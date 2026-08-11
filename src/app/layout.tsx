import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Fira_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/features/cart/context/CartContext";
import { WishlistProvider } from "@/features/cart/context/WishlistContext";
import { getSiteUrl } from "@/lib/env";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Ibrahim Jewels — Premium Non-Tarnish Jewelry",
    template: "%s | Ibrahim Jewels",
  },
  description: "Premium non-tarnish jewelry, crafted to last.",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${firaSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
