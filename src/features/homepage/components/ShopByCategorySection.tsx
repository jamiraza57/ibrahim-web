import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { shopByCategoryConfigSchema } from "../schemas/homepage-section.schema";

// Deliberately a different rhythm from FeaturedCollectionsSection's uniform grid:
// the first category anchors a tall tile, the rest sit alongside it as a
// bento-style band so consecutive homepage sections don't all read as the
// same "centered heading + even grid" pattern.
export async function ShopByCategorySection({
  config,
}: {
  config: z.infer<typeof shopByCategoryConfigSchema>;
}) {
  const categories = await prisma.category.findMany({
    where: { id: { in: config.categoryIds }, status: true },
  });

  const [lead, ...rest] = categories;
  if (!lead) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Discover</span>
        <h2 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">{config.heading}</h2>
      </RevealOnScroll>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:grid-rows-2">
        <RevealOnScroll className="col-span-2 row-span-2">
          <CategoryTile category={lead} className="aspect-[4/3] md:aspect-auto md:h-full" />
        </RevealOnScroll>
        {rest.map((category, i) => (
          <RevealOnScroll key={category.id} delay={(i + 1) * 0.08}>
            <CategoryTile category={category} className="aspect-square" />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

function CategoryTile({
  category,
  className,
}: {
  category: { slug: string; name: string; imageUrl: string | null; bannerUrl: string | null };
  className?: string;
}) {
  const image = category.bannerUrl ?? category.imageUrl;
  return (
    <Link
      href={`/categories/${category.slug}`}
      data-cursor="hover"
      className={`lux-card group relative block overflow-hidden rounded-lg ${className ?? ""}`}
    >
      {image && (
        <Image
          src={image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-transparent p-4 sm:p-5">
        <span className="font-display text-base group-hover:text-gold sm:text-lg">{category.name}</span>
      </div>
    </Link>
  );
}
