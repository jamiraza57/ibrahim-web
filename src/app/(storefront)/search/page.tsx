import { queryStorefrontProducts, getFilterFacets, type SortOption } from "@/features/products/services/storefront-product.service";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterBar } from "@/features/products/components/FilterBar";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const [result, facets] = await Promise.all([
    queryStorefrontProducts({
      search: sp.q,
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
  ]);

  const paramsString = new URLSearchParams(sp as Record<string, string>).toString();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center sm:text-left">
        <span className="eyebrow">Collection</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Shop</h1>
      </div>

      <form className="mb-8">
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search rings, necklaces, watches…"
          className="w-full max-w-md rounded border border-gold/20 bg-transparent px-4 py-3 text-foreground placeholder:text-secondary-text/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </form>

      <FilterBar facets={facets} />

      <ProductGrid
        products={result.items}
        page={result.page}
        totalPages={result.totalPages}
        basePath="/search"
        searchParamsString={paramsString}
      />
    </div>
  );
}
