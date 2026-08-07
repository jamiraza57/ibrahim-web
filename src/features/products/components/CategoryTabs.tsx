"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryTabsProps {
  categories: { slug: string; name: string }[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  function hrefFor(slug: string): Route {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("page");
    const qs = params.toString();
    return (qs ? `/products?${qs}` : "/products") as Route;
  }

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2 sm:justify-start">
      <Link
        href={hrefFor("")}
        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
          active === "" ? "border-gold bg-gold text-gold-foreground" : "border-gold/20 text-secondary-text hover:border-gold/50 hover:text-gold"
        }`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={hrefFor(c.slug)}
          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
            active === c.slug ? "border-gold bg-gold text-gold-foreground" : "border-gold/20 text-secondary-text hover:border-gold/50 hover:text-gold"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
