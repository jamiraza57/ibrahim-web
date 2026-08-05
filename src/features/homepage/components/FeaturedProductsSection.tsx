import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/products/components/ProductCard";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { featuredProductsConfigSchema } from "../schemas/homepage-section.schema";

export async function FeaturedProductsSection({
  config,
}: {
  config: z.infer<typeof featuredProductsConfigSchema>;
}) {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", [config.tag]: true },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: config.limit,
  });

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <RevealOnScroll>
        <h2 className="mb-8 text-center font-serif text-2xl text-white sm:text-3xl">{config.heading}</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price.toString()}
              salePrice={product.salePrice?.toString()}
              thumbnailUrl={product.images.find((i) => i.isThumbnail)?.url ?? product.images[0]?.url}
            />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
