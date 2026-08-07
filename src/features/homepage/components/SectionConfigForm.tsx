"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import type { HomepageSectionType } from "../schemas/homepage-section.schema";

interface CollectionOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface SectionConfigFormProps {
  type: HomepageSectionType;
  initialConfig: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

const TAG_OPTIONS = ["isFeatured", "isNewArrival", "isBestSeller", "isTrending", "isOnSale"] as const;

export function SectionConfigForm({ type, initialConfig, onChange }: SectionConfigFormProps) {
  const [config, setConfig] = useState<Record<string, unknown>>(initialConfig);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (type === "FEATURED_COLLECTIONS") {
      fetch("/api/v1/admin/collections")
        .then((r) => r.json())
        .then(({ data }) => setCollections(data ?? []));
    }
    if (type === "SHOP_BY_CATEGORY") {
      fetch("/api/v1/admin/categories")
        .then((r) => r.json())
        .then(({ data }) => setCategories(data ?? []));
    }
  }, [type]);

  function set(key: string, value: unknown) {
    const next = { ...config, [key]: value };
    setConfig(next);
    onChange(next);
  }

  const inputClass = "w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground";

  if (type === "HERO") {
    return (
      <div className="space-y-3">
        <input placeholder="Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <input placeholder="Subheading (optional)" defaultValue={config.subheading as string} onChange={(e) => set("subheading", e.target.value)} className={inputClass} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="CTA Label (optional)" defaultValue={config.ctaLabel as string} onChange={(e) => set("ctaLabel", e.target.value)} className={inputClass} />
          <input placeholder="CTA Link (optional)" defaultValue={config.ctaHref as string} onChange={(e) => set("ctaHref", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Background Image</label>
          {config.backgroundImageUrl ? <p className="mb-2 truncate text-xs text-secondary-text">{config.backgroundImageUrl as string}</p> : null}
          <ImageUploader folder="ibrahim/homepage" onUploaded={(img) => set("backgroundImageUrl", img.url)} />
        </div>
      </div>
    );
  }

  if (type === "BANNER") {
    return (
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Banner Image</label>
          {config.imageUrl ? <p className="mb-2 truncate text-xs text-secondary-text">{config.imageUrl as string}</p> : null}
          <ImageUploader folder="ibrahim/homepage" onUploaded={(img) => set("imageUrl", img.url)} />
        </div>
        <input placeholder="Heading (optional)" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="CTA Label (optional)" defaultValue={config.ctaLabel as string} onChange={(e) => set("ctaLabel", e.target.value)} className={inputClass} />
          <input placeholder="CTA Link (optional)" defaultValue={config.ctaHref as string} onChange={(e) => set("ctaHref", e.target.value)} className={inputClass} />
        </div>
      </div>
    );
  }

  if (type === "STATS") {
    const items = (config.items as { value: string; label: string }[]) ?? [];
    function updateItem(i: number, key: "value" | "label", val: string) {
      const next = items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item));
      set("items", next);
    }
    function removeItem(i: number) {
      set("items", items.filter((_, idx) => idx !== i));
    }
    return (
      <div className="space-y-3">
        <p className="text-xs text-secondary-text">
          Enter real figures for this business only — e.g. years established, order count, or a shipping
          promise. Leave this section unpublished if you don&apos;t have a fact to put here yet.
        </p>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Value (e.g. 25+ Years)"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Label (e.g. Craftsmanship)"
              value={item.label}
              onChange={(e) => updateItem(i, "label", e.target.value)}
              className={inputClass}
            />
            <button type="button" onClick={() => removeItem(i)} className="px-2 text-destructive">
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("items", [...items, { value: "", label: "" }])}
          className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold"
        >
          + Add Stat
        </button>
      </div>
    );
  }

  if (type === "BRAND_STORY") {
    return (
      <div className="space-y-3">
        <input placeholder="Eyebrow (optional, e.g. Our Story)" defaultValue={config.eyebrow as string} onChange={(e) => set("eyebrow", e.target.value)} className={inputClass} />
        <input placeholder="Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <textarea placeholder="Body copy" defaultValue={config.body as string} onChange={(e) => set("body", e.target.value)} rows={4} className={inputClass} />
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Image</label>
          {config.imageUrl ? <p className="mb-2 truncate text-xs text-secondary-text">{config.imageUrl as string}</p> : null}
          <ImageUploader folder="ibrahim/homepage" onUploaded={(img) => set("imageUrl", img.url)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="CTA Label (optional, e.g. Our Story)" defaultValue={config.ctaLabel as string} onChange={(e) => set("ctaLabel", e.target.value)} className={inputClass} />
          <input placeholder="CTA Link (optional, e.g. /about)" defaultValue={config.ctaHref as string} onChange={(e) => set("ctaHref", e.target.value)} className={inputClass} />
        </div>
      </div>
    );
  }

  if (type === "SHOP_BY_CATEGORY") {
    const selected = (config.categoryIds as string[]) ?? [];
    return (
      <div className="space-y-3">
        <input placeholder="Section Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <p className="text-xs text-secondary-text">The first category picked becomes the large lead tile.</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => set("categoryIds", selected.includes(c.id) ? selected.filter((id) => id !== c.id) : [...selected, c.id])}
              className={`rounded-full px-3 py-1 text-xs ${selected.includes(c.id) ? "bg-gold text-gold-foreground" : "border border-gold/20 text-secondary-text"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "FEATURED_COLLECTIONS") {
    const selected = (config.collectionIds as string[]) ?? [];
    return (
      <div className="space-y-3">
        <input placeholder="Section Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => set("collectionIds", selected.includes(c.id) ? selected.filter((id) => id !== c.id) : [...selected, c.id])}
              className={`rounded-full px-3 py-1 text-xs ${selected.includes(c.id) ? "bg-gold text-gold-foreground" : "border border-gold/20 text-secondary-text"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "FEATURED_PRODUCTS") {
    return (
      <div className="space-y-3">
        <input placeholder="Section Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <select defaultValue={(config.tag as string) ?? "isFeatured"} onChange={(e) => set("tag", e.target.value)} className={`${inputClass} bg-background`}>
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t.replace("is", "")}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="How many products"
          defaultValue={(config.limit as number) ?? 8}
          onChange={(e) => set("limit", Number(e.target.value))}
          className={inputClass}
        />
      </div>
    );
  }

  if (type === "INSTAGRAM") {
    const urls = (config.imageUrls as string[]) ?? [];
    return (
      <div className="space-y-3">
        <input placeholder="Section Heading" defaultValue={config.heading as string} onChange={(e) => set("heading", e.target.value)} className={inputClass} />
        <div className="flex flex-wrap gap-2">
          {urls.map((url) => (
            <div key={url} className="h-16 w-16 overflow-hidden rounded border border-gold/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <ImageUploader folder="ibrahim/instagram" onUploaded={(img) => set("imageUrls", [...urls, img.url])} />
      </div>
    );
  }

  // TESTIMONIALS, NEWSLETTER, FOOTER need no configurable fields — content is
  // sourced from their own data (Testimonial table) or is static.
  return <p className="text-sm text-secondary-text">This section type has no extra settings — just toggle it visible.</p>;
}
