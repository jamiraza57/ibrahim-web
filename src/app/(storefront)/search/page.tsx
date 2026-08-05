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
      <form className="mb-8">
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search rings, necklaces, watches…"
          className="w-full max-w-md rounded border border-gold/20 bg-transparent px-4 py-3 text-white"
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
