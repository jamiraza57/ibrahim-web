import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/products/components/ProductCard";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { featuredProductsConfigSchema } from "../schemas/homepage-section.schema";

export async function FeaturedProductsSection({
  config,
  variant = "grid",
}: {
  config: z.infer<typeof featuredProductsConfigSchema>;
  /** "rail" gives a horizontal-scroll browsing feel so a second grid section
   * (e.g. Best Sellers right after New Arrivals) doesn't read as a repeat. */
  variant?: "grid" | "rail";
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
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Signature Pieces</span>
        <h2 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">{config.heading}</h2>
      </RevealOnScroll>
      <div
        className={
          variant === "rail"
            ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
            : "grid grid-cols-[repeat(auto-fit,minmax(140px,220px))] justify-center gap-4 sm:gap-6"
        }
      >
        {products.map((product, idx) => (
          <RevealOnScroll
            key={product.id}
            delay={idx * 0.06}
            className={variant === "rail" ? "w-[70%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]" : undefined}
          >
            <ProductCard
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price.toString()}
              salePrice={product.salePrice?.toString()}
              thumbnailUrl={product.images.find((i) => i.isThumbnail)?.url ?? product.images[0]?.url}
              isNewArrival={product.isNewArrival}
              stock={product.stock}
            />
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll className="mt-10 flex justify-center">
        <Link
          href="/products"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 text-sm tracking-wide text-secondary-text transition-colors hover:text-gold"
        >
          View All
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </RevealOnScroll>
    </section>
  );
}
