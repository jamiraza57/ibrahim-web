import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-background/60 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg tracking-wide text-white sm:text-xl" data-cursor="hover">
          {siteConfig.name}
        </Link>

        <nav className="hidden gap-8 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className="text-sm tracking-wide text-secondary-text transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/search" data-cursor="hover" aria-label="Search" className="text-secondary-text hover:text-gold">
            Search
          </Link>
          <Link href="/wishlist" data-cursor="hover" aria-label="Wishlist" className="text-secondary-text hover:text-gold">
            Wishlist
          </Link>
          <Link href="/cart" data-cursor="hover" aria-label="Cart" className="text-secondary-text hover:text-gold">
            Cart
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
