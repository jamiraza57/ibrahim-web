"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface HeroConfig {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImageUrl?: string;
}

interface PromoConfig {
  imageUrl?: string;
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface TriptychConfig {
  images?: string[];
}

const EMPTY_HERO: HeroConfig = { heading: "Timeless Elegance" };
const EMPTY_PROMO: PromoConfig = {};
const EMPTY_TRIPTYCH: TriptychConfig = { images: ["", "", ""] };

export default function HeaderImagesPage() {
  const [hero, setHero] = useState<HeroConfig>(EMPTY_HERO);
  const [promo, setPromo] = useState<PromoConfig>(EMPTY_PROMO);
  const [triptych, setTriptych] = useState<TriptychConfig>(EMPTY_TRIPTYCH);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/header-images")
      .then((res) => res.json())
      .then(({ data }) => {
        if (data.hero) setHero(data.hero);
        if (data.promo) setPromo(data.promo);
        if (data.triptych?.images) setTriptych({ images: data.triptych.images });
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveHero() {
    setSaving("hero");
    setMessage(null);
    const res = await fetch("/api/v1/admin/header-images/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    setSaving(null);
    setMessage(res.ok ? "Hero banner saved." : "Could not save hero banner.");
  }

  async function savePromo() {
    if (!promo.imageUrl) {
      setMessage("Upload a promo banner image first.");
      return;
    }
    setSaving("promo");
    setMessage(null);
    const res = await fetch("/api/v1/admin/header-images/promo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promo),
    });
    setSaving(null);
    setMessage(res.ok ? "Promo banner saved." : "Could not save promo banner.");
  }

  async function saveTriptych() {
    const images = triptych.images ?? [];
    if (images.length !== 3 || images.some((i) => !i)) {
      setMessage("Upload all 3 triptych images first.");
      return;
    }
    setSaving("triptych");
    setMessage(null);
    const res = await fetch("/api/v1/admin/header-images/triptych", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    setSaving(null);
    setMessage(res.ok ? "Triptych images saved." : "Could not save triptych images.");
  }

  function setTriptychImage(index: number, url: string) {
    setTriptych((prev) => {
      const images = [...(prev.images ?? ["", "", ""])];
      images[index] = url;
      return { images };
    });
  }

  if (loading) return <div className="p-4 text-secondary-text sm:p-8">Loading…</div>;

  return (
    <div className="max-w-3xl p-4 sm:p-8">
      <span className="eyebrow">Homepage</span>
      <h1 className="mt-1 font-display text-2xl text-foreground">Header Images</h1>
      <p className="mt-2 text-sm text-secondary-text">
        These are the only images and text you can edit on the homepage — everything else (new
        arrivals, best sellers, categories) follows your Products and Categories automatically.
      </p>

      {message && <p className="mt-4 text-sm text-gold">{message}</p>}

      <section className="mt-8 rounded border border-gold/20 bg-card p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Hero Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Background Image</label>
            <ImageUploader folder="homepage" onUploaded={(img) => setHero((h) => ({ ...h, backgroundImageUrl: img.url }))} />
            {hero.backgroundImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.backgroundImageUrl} alt="" className="mt-3 h-32 w-full rounded object-cover" />
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Heading</label>
            <input
              value={hero.heading}
              onChange={(e) => setHero((h) => ({ ...h, heading: e.target.value }))}
              className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Subheading (optional)</label>
            <input
              value={hero.subheading ?? ""}
              onChange={(e) => setHero((h) => ({ ...h, subheading: e.target.value }))}
              className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Button Label (optional)</label>
              <input
                value={hero.ctaLabel ?? ""}
                onChange={(e) => setHero((h) => ({ ...h, ctaLabel: e.target.value }))}
                className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Button Link (optional)</label>
              <input
                value={hero.ctaHref ?? ""}
                onChange={(e) => setHero((h) => ({ ...h, ctaHref: e.target.value }))}
                placeholder="/products"
                className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
              />
            </div>
          </div>
          <button
            onClick={saveHero}
            disabled={saving === "hero"}
            className="rounded bg-gold px-6 py-2 text-sm font-medium text-gold-foreground disabled:opacity-50"
          >
            {saving === "hero" ? "Saving…" : "Save Hero Banner"}
          </button>
        </div>
      </section>

      <section className="mt-6 rounded border border-gold/20 bg-card p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Promo Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Banner Image</label>
            <ImageUploader folder="homepage" onUploaded={(img) => setPromo((p) => ({ ...p, imageUrl: img.url }))} />
            {promo.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={promo.imageUrl} alt="" className="mt-3 h-32 w-full rounded object-cover" />
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Heading (optional)</label>
            <input
              value={promo.heading ?? ""}
              onChange={(e) => setPromo((p) => ({ ...p, heading: e.target.value }))}
              className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Button Label (optional)</label>
              <input
                value={promo.ctaLabel ?? ""}
                onChange={(e) => setPromo((p) => ({ ...p, ctaLabel: e.target.value }))}
                className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-text">Button Link (optional)</label>
              <input
                value={promo.ctaHref ?? ""}
                onChange={(e) => setPromo((p) => ({ ...p, ctaHref: e.target.value }))}
                placeholder="/products"
                className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
              />
            </div>
          </div>
          <button
            onClick={savePromo}
            disabled={saving === "promo"}
            className="rounded bg-gold px-6 py-2 text-sm font-medium text-gold-foreground disabled:opacity-50"
          >
            {saving === "promo" ? "Saving…" : "Save Promo Banner"}
          </button>
        </div>
      </section>

      <section className="mt-6 rounded border border-gold/20 bg-card p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg text-foreground">Triptych Images</h2>
        <p className="mb-4 text-sm text-secondary-text">Three side-by-side lifestyle images shown on the homepage.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="mb-1 block text-sm text-secondary-text">Image {i + 1}</label>
              <ImageUploader folder="homepage" onUploaded={(img) => setTriptychImage(i, img.url)} />
              {triptych.images?.[i] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={triptych.images[i]} alt="" className="mt-3 h-32 w-full rounded object-cover" />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={saveTriptych}
          disabled={saving === "triptych"}
          className="mt-4 rounded bg-gold px-6 py-2 text-sm font-medium text-gold-foreground disabled:opacity-50"
        >
          {saving === "triptych" ? "Saving…" : "Save Triptych Images"}
        </button>
      </section>
    </div>
  );
}
