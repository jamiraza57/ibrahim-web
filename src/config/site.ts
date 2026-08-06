export const siteConfig = {
  name: "Ibrahim",
  tagline: "Fine Jewelry",
  navigation: [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Rings", href: "/categories/rings" },
    { label: "Necklaces", href: "/categories/necklaces" },
    { label: "Bracelets", href: "/categories/bracelets" },
    { label: "Earrings", href: "/categories/earrings" },
    { label: "Watches", href: "/categories/watches" },
    { label: "Gifts", href: "/collections/gifts" },
  ],
  footerShopLinks: [
    { label: "All Collections", href: "/collections" },
    { label: "All Categories", href: "/categories" },
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
