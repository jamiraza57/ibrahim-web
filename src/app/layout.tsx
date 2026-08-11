import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Fira_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/features/cart/context/CartContext";
import { WishlistProvider } from "@/features/cart/context/WishlistContext";
import { getSiteUrl } from "@/lib/env";
import { siteConfig } from "@/config/site";

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

const defaultTitle = "Ibrahim Jewels — Premium Non-Tarnish Jewelry";
const defaultDescription = "Premium non-tarnish jewelry, crafted to last.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: "%s | Ibrahim Jewels",
  },
  description: defaultDescription,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName: siteConfig.name,
    url: "/",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.png", width: 1280, height: 621, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = getSiteUrl();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: siteConfig.socials.map((s) => s.href),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${firaSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
