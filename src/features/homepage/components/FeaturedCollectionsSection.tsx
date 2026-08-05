import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { featuredCollectionsConfigSchema } from "../schemas/homepage-section.schema";

export async function FeaturedCollectionsSection({
  config,
}: {
  config: z.infer<typeof featuredCollectionsConfigSchema>;
}) {
  const collections = await prisma.collection.findMany({
    where: { id: { in: config.collectionIds }, status: true },
  });

  if (collections.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <RevealOnScroll>
        <h2 className="mb-8 text-center font-serif text-2xl text-white sm:text-3xl">{config.heading}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              data-cursor="hover"
              className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-gold/10"
            >
              {collection.bannerUrl && (
                <Image
                  src={collection.bannerUrl}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-transparent p-5">
                <span className="font-serif text-lg text-white">{collection.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
