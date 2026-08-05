import type { Route } from "next";
import Link from "next/link";
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

export function ProductGrid({ products, page, totalPages, basePath, searchParamsString }: ProductGridProps) {
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
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
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

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`rounded px-3 py-1 text-sm ${
                p === page ? "bg-gold text-background" : "border border-gold/20 text-white"
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
