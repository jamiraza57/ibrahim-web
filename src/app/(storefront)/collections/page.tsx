import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse every curated Ibrahim collection.",
  alternates: { canonical: `${getSiteUrl()}/collections` },
};

export default async function CollectionsIndexPage() {
  const collections = await prisma.collection.findMany({
    where: { status: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Explore</span>
      <h1 className="mb-2 mt-2 font-display text-3xl sm:text-4xl">All Collections</h1>
      <p className="mb-10 max-w-2xl text-secondary-text">
        Curated groupings of our finest pieces, from seasonal edits to gifting favorites.
      </p>

      {collections.length === 0 ? (
        <p className="py-16 text-center text-secondary-text">No collections available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => (
            <RevealOnScroll key={collection.id} delay={i * 0.06}>
              <Link
                href={`/collections/${collection.slug}`}
                data-cursor="hover"
                className="lux-card group relative block aspect-[4/5] overflow-hidden rounded-lg"
              >
                {collection.bannerUrl ? (
                  <Image
                    src={collection.bannerUrl}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-card to-secondary-background" />
                )}
                <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-background/85 to-transparent p-5">
                  <span className="font-display text-lg group-hover:text-gold">{collection.name}</span>
                  {collection.description && (
                    <span className="mt-1 line-clamp-2 text-xs text-secondary-text">{collection.description}</span>
                  )}
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
