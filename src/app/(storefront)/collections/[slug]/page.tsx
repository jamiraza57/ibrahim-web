import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { queryStorefrontProducts, getFilterFacets, type SortOption } from "@/features/products/services/storefront-product.service";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterBar } from "@/features/products/components/FilterBar";
import { getEnv } from "@/lib/env";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

async function getCollection(slug: string) {
  return prisma.collection.findFirst({ where: { slug, status: true } });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.metaTitle ?? collection.name,
    description: collection.metaDescription ?? collection.description ?? undefined,
    alternates: { canonical: `${getEnv().NEXT_PUBLIC_SITE_URL}/collections/${slug}` },
    openGraph: { images: collection.bannerUrl ? [collection.bannerUrl] : undefined },
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const collection = await getCollection(slug);
  if (!collection) notFound();

  const [result, facets] = await Promise.all([
    queryStorefrontProducts({
      collectionSlug: slug,
      sort: sp.sort as SortOption | undefined,
      material: sp.material,
      stone: sp.stone,
      color: sp.color,
      inStockOnly: sp.inStockOnly === "true",
      page: sp.page ? Number(sp.page) : 1,
    }),
    getFilterFacets(),
  ]);

  const paramsString = new URLSearchParams(sp as Record<string, string>).toString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description ?? undefined,
    url: `${getEnv().NEXT_PUBLIC_SITE_URL}/collections/${slug}`,
    hasPart: {
      "@type": "ItemList",
      itemListElement: result.items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${getEnv().NEXT_PUBLIC_SITE_URL}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="mb-2 font-serif text-3xl text-white">{collection.name}</h1>
      {collection.description && (
        <p className="mb-8 max-w-2xl text-secondary-text">{collection.description}</p>
      )}

      <FilterBar facets={facets} />

      <ProductGrid
        products={result.items}
        page={result.page}
        totalPages={result.totalPages}
        basePath={`/collections/${slug}`}
        searchParamsString={paramsString}
      />
    </div>
  );
}
