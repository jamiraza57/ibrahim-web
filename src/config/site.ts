export const siteConfig = {
  name: "Ibrahim",
  tagline: "Fine Jewelry",
  // WhatsApp number is intentionally blank — no confirmed number yet. The
  // floating WhatsApp button only renders once this is filled in with a real
  // one (see WhatsAppButton), so nothing fabricated ships in the meantime.
  whatsappNumber: "" as string,
  navigation: [
    { label: "Shop All", href: "/products" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Necklaces", href: "/products?category=necklaces" },
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Watches", href: "/products?category=watches" },
  ],
  footerShopLinks: [
    { label: "Shop All", href: "/products" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Track Order", href: "/track-order" },
  ],
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
  // No confirmed social profile URLs yet — leave empty rather than guess at
  // handles. Fill in real profile URLs here to have the footer show icons.
  socials: [] as { label: string; href: string }[],
} as const;
