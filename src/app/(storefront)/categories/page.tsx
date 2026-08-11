import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Ibrahim jewelry by category.",
  alternates: { canonical: `${getSiteUrl()}/categories` },
};

export default async function CategoriesIndexPage() {
  const categories = await prisma.category.findMany({
    where: { status: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Explore</span>
      <h1 className="mb-2 mt-2 font-display text-3xl sm:text-4xl">All Categories</h1>
      <p className="mb-10 max-w-2xl text-secondary-text">
        Rings, necklaces, bracelets, earrings, watches, and more — find exactly what you&apos;re
        looking for.
      </p>

      {categories.length === 0 ? (
        <p className="py-16 text-center text-secondary-text">No categories available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <RevealOnScroll key={category.id} delay={i * 0.05}>
              <Link
                href={`/categories/${category.slug}`}
                data-cursor="hover"
                className="lux-card group relative block aspect-square overflow-hidden rounded-lg"
              >
                {category.imageUrl || category.bannerUrl ? (
                  <Image
                    src={category.imageUrl ?? category.bannerUrl!}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-card to-secondary-background" />
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/85 to-transparent p-4">
                  <span className="font-display text-sm group-hover:text-gold sm:text-base">{category.name}</span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
