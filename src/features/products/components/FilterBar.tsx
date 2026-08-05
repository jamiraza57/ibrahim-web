"use client";

import type { Route } from "next";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FilterBarProps {
  facets: { materials: string[]; stones: string[]; colors: string[] };
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

export function FilterBar({ facets }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // any filter change resets pagination
    router.push(`${pathname}?${params.toString()}` as Route);
  }

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded border border-gold/20 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {facets.materials.length > 0 && (
        <select
          defaultValue={searchParams.get("material") ?? ""}
          onChange={(e) => updateParam("material", e.target.value)}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Materials</option>
          {facets.materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}

      {facets.stones.length > 0 && (
        <select
          defaultValue={searchParams.get("stone") ?? ""}
          onChange={(e) => updateParam("stone", e.target.value)}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Stones</option>
          {facets.stones.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {facets.colors.length > 0 && (
        <select
          defaultValue={searchParams.get("color") ?? ""}
          onChange={(e) => updateParam("color", e.target.value)}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Colors</option>
          {facets.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      <label className="flex items-center gap-2 text-sm text-secondary-text">
        <input
          type="checkbox"
          defaultChecked={searchParams.get("inStockOnly") === "true"}
          onChange={(e) => updateParam("inStockOnly", e.target.checked ? "true" : "")}
        />
        In stock only
      </label>
    </div>
  );
}
