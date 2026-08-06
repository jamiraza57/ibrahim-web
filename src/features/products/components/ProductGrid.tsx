"use client";

import type { Route } from "next";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Prisma } from "@prisma/client";

type ProductWithImages = Prisma.ProductGetPayload<{ include: { images: true } }>;

interface ProductGridProps {
  products: ProductWithImages[];
  page: number;
  totalPages: number;
  basePath: string;
  searchParamsString: string;
}

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function ProductGrid({ products, page, totalPages, basePath, searchParamsString }: ProductGridProps) {
  const reduceMotion = useReducedMotion();

  if (products.length === 0) {
    return <p className="py-16 text-center text-secondary-text">No products match these filters.</p>;
  }

  function pageHref(p: number): Route {
    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}` as Route;
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
        initial={reduceMotion ? undefined : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={gridVariants}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={reduceMotion ? undefined : itemVariants}>
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
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                p === page
                  ? "bg-gold text-gold-foreground"
                  : "border border-gold/20 text-secondary-text hover:border-gold/50 hover:text-gold"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
