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
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
} as const;
