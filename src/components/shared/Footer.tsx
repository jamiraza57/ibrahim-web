import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-secondary-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <h3 className="mb-4 font-serif text-lg text-white">{siteConfig.name}</h3>
          <p className="text-sm text-secondary-text">{siteConfig.tagline}</p>
        </div>

        <nav className="flex flex-col gap-2">
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-secondary-text transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <NewsletterForm />
      </div>

      <div className="border-t border-gold/10 py-6 text-center text-xs text-secondary-text">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
