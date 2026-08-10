export const siteConfig = {
  name: "Ibrahim Jewels",
  tagline: "Premium Non-Tarnish Jewelry",
  email: "ibrahimjewels13@gmail.com",
  whatsappNumber: "923012905744",
  navigation: [
    { label: "Shop All", href: "/products" },
    { label: "Necklaces", href: "/products?category=necklaces" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Handcuffs", href: "/products?category=handcuffs" },
    { label: "Zircon Set", href: "/products?category=zircon-set" },
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
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/ij_ibrahim_jewels?igsh=aGFkZTg1a3NwYzBk" },
    { label: "Facebook", href: "https://www.facebook.com/share/1DVsefQEJa/" },
    { label: "TikTok", href: "https://tiktok.com/@ij_jewels" },
  ] as { label: string; href: string }[],
} as const;
