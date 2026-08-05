"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Coupons", href: "/admin/coupons" },
  { label: "Media Library", href: "/admin/media" },
  { label: "Homepage Builder", href: "/admin/homepage-builder" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Announcement Bar", href: "/admin/announcement-bar" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-card text-gold" : "text-secondary-text hover:bg-card hover:text-gold"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-gold/10 bg-secondary-background p-4 lg:hidden">
        <span className="font-serif text-lg text-white">Ibrahim Admin</span>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open admin menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span className="h-px w-6 bg-white" />
          <span className="h-px w-6 bg-white" />
          <span className="h-px w-6 bg-white" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-gold/10 bg-secondary-background p-6 lg:block">
        <div className="mb-8 font-serif text-lg text-white">Ibrahim Admin</div>
        <NavLinks />
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-secondary-background p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-lg text-white">Ibrahim Admin</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close admin menu" className="text-2xl text-white">
                ×
              </button>
            </div>
            <NavLinks onNavigate={() => setIsOpen(false)} />
            <div className="mt-6 border-t border-gold/10 pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
