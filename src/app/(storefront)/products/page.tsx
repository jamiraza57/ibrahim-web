import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { queryStorefrontProducts, getFilterFacets, type SortOption } from "@/features/products/services/storefront-product.service";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterBar } from "@/features/products/components/FilterBar";
import { CategoryTabs } from "@/features/products/components/CategoryTabs";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Shop All",
  alternates: { canonical: `${getSiteUrl()}/products` },
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const [result, facets, categories] = await Promise.all([
    queryStorefrontProducts({
      categorySlug: sp.category,
      sort: sp.sort as SortOption | undefined,
      material: sp.material,
      stone: sp.stone,
      color: sp.color,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      inStockOnly: sp.inStockOnly === "true",
      page: sp.page ? Number(sp.page) : 1,
    }),
    getFilterFacets(),
    prisma.category.findMany({
      where: { parentId: null, status: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
  ]);

  const paramsString = new URLSearchParams(sp as Record<string, string>).toString();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 2xl:max-w-[1600px]">
      <div className="mb-8 text-center">
        <span className="eyebrow">Collection</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Shop All Jewelry</h1>
      </div>

      <CategoryTabs categories={categories} />

      <FilterBar facets={facets} />

      <ProductGrid
        products={result.items}
        page={result.page}
        totalPages={result.totalPages}
        basePath="/products"
        searchParamsString={paramsString}
      />
    </div>
  );
}
