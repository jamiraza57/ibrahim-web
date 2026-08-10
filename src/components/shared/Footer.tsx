import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-secondary-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-5">
        <div className="sm:col-span-2 md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Image src="/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <h3 className="font-serif text-lg text-gradient-gold">{siteConfig.name}</h3>
          </div>
          <p className="max-w-xs text-sm text-secondary-text">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-xs text-sm text-secondary-text">
            Each piece is finished by hand and inspected before it ships. Have a question about an
            order or a custom design?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Reach out
            </Link>{" "}
            or email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-gold hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>

          {siteConfig.socials.length > 0 && (
            <div className="mt-6 flex gap-4">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-text transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          <span className="eyebrow mb-2">Shop</span>
          {siteConfig.navigation.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-secondary-text transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2">
          <span className="eyebrow mb-2">Company</span>
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-secondary-text transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          {siteConfig.footerShopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-secondary-text transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <span className="eyebrow mb-3 block">Stay Updated</span>
          <NewsletterForm />
        </div>
      </div>

      <div className="hairline" />

      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-4 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-secondary-text">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-secondary-text sm:justify-end">
          {siteConfig.legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-gold">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gold/5 bg-background/40 py-3 text-center text-[11px] uppercase tracking-widest text-secondary-text">
        Cash on Delivery · Insured Shipping · Quality Guaranteed
      </div>
    </footer>
  );
}
