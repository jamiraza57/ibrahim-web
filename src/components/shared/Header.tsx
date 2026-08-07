"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCart } from "@/features/cart/context/CartContext";
import { useWishlist } from "@/features/cart/context/WishlistContext";
import { MobileNav } from "./MobileNav";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hrefPath, hrefQuery] = href.split("?");
  const hrefCategory = new URLSearchParams(hrefQuery).get("category");
  const isActive =
    (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)) &&
    (hrefCategory ? searchParams.get("category") === hrefCategory : !searchParams.get("category"));

  return (
    <Link href={href as Route} data-cursor="hover" className="group relative text-sm tracking-wide text-secondary-text transition-colors hover:text-gold">
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

// Static fallback shown while NavLink's useSearchParams-based active state
// resolves (and during the static prerender pass, since useSearchParams
// requires a Suspense boundary) — same links, without the active underline.
function NavLinksFallback() {
  return (
    <>
      {siteConfig.navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href as Route}
          data-cursor="hover"
          className="text-sm tracking-wide text-secondary-text transition-colors hover:text-gold"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { productIds } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "border-gold/10 bg-background/85 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg tracking-wide sm:text-xl" data-cursor="hover">
          <span className="text-gradient-gold">{siteConfig.name}</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Suspense fallback={<NavLinksFallback />}>
            {siteConfig.navigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </Suspense>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/search" data-cursor="hover" aria-label="Search" className="text-secondary-text hover:text-gold">
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link href={"/wishlist" as Route} data-cursor="hover" aria-label="Wishlist" className="relative text-secondary-text hover:text-gold">
            <Heart className="h-[18px] w-[18px]" />
            {productIds.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-gold-foreground">
                {productIds.length}
              </span>
            )}
          </Link>
          <Link href="/cart" data-cursor="hover" aria-label="Cart" className="relative text-secondary-text hover:text-gold">
            <ShoppingBag className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-gold-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
