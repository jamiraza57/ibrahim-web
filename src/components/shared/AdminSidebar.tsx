"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingBag,
  Ticket,
  Image as ImageIcon,
  LayoutTemplate,
  Quote,
  BarChart3,
  Megaphone,
  ChevronsLeft,
  ChevronsRight,
  Store,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Homepage Builder", href: "/admin/homepage-builder", icon: LayoutTemplate },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Announcement Bar", href: "/admin/announcement-bar", icon: Megaphone },
];

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href as Route}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-card text-gold" : "text-secondary-text hover:bg-card hover:text-gold"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-gold/10 bg-secondary-background p-4 lg:hidden">
        <span className="font-serif text-lg text-gradient-gold">Ibrahim Admin</span>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open admin menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span className="h-px w-6 bg-foreground" />
          <span className="h-px w-6 bg-foreground" />
          <span className="h-px w-6 bg-foreground" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 flex-col border-r border-gold/10 bg-secondary-background p-4 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
          collapsed ? "w-20" : "w-60"
        }`}
      >
        <div className={`mb-8 flex items-center px-2 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <span className="font-serif text-lg text-gradient-gold">Ibrahim Admin</span>}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-secondary-text hover:text-gold"
          >
            {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks collapsed={collapsed} />
        </div>

        <div className="mt-6 border-t border-gold/10 pt-4">
          <Link
            href="/"
            title={collapsed ? "View store" : undefined}
            className={`flex items-center gap-3 rounded px-3 py-2 text-sm text-secondary-text hover:text-gold ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Store className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>View store</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-secondary-background p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-lg text-gradient-gold">Ibrahim Admin</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close admin menu" className="text-2xl text-secondary-text hover:text-gold">
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
