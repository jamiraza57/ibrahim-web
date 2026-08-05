import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc" | "popularity";

export interface StorefrontProductFilters {
  categorySlug?: string;
  collectionSlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  stone?: string;
  color?: string;
  inStockOnly?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

const SORT_MAP: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  popularity: { isBestSeller: "desc" }, // proxy for popularity until real order-count aggregation lands
};

/**
 * The one query every storefront listing page (home, category, collection,
 * search) funnels through, so "published + not scheduled for the future" stays
 * enforced in exactly one place.
 */
export async function queryStorefrontProducts(filters: StorefrontProductFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;

  // MongoDB never wrote `publishAt` at all for products created without an
  // explicit publish date, so it's unset rather than stored as null — Prisma's
  // Mongo connector only matches bare `{ publishAt: null }` against fields
  // explicitly set to null, not unset ones, so `isSet: false` is required too.
  const where: Prisma.ProductWhereInput = {
    AND: [
      {
        status: "PUBLISHED",
        OR: [{ publishAt: { isSet: false } }, { publishAt: null }, { publishAt: { lte: new Date() } }],
      },
      ...(filters.categorySlug ? [{ categories: { some: { category: { slug: filters.categorySlug } } } }] : []),
      ...(filters.collectionSlug
        ? [{ collections: { some: { collection: { slug: filters.collectionSlug } } } }]
        : []),
      ...(filters.material ? [{ material: filters.material }] : []),
      ...(filters.stone ? [{ stone: filters.stone }] : []),
      ...(filters.color ? [{ color: filters.color }] : []),
      ...(filters.inStockOnly ? [{ stock: { gt: 0 } }] : []),
      ...(filters.minPrice || filters.maxPrice
        ? [
            {
              price: {
                ...(filters.minPrice ? { gte: filters.minPrice } : {}),
                ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
              },
            },
          ]
        : []),
      ...(filters.search
        ? [
            {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" as const } },
                { description: { contains: filters.search, mode: "insensitive" as const } },
                { material: { contains: filters.search, mode: "insensitive" as const } },
              ],
            },
          ]
        : []),
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" } } },
      orderBy: SORT_MAP[filters.sort ?? "newest"],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getStorefrontProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      OR: [{ publishAt: { isSet: false } }, { publishAt: null }, { publishAt: { lte: new Date() } }],
    },
    include: {
      images: { orderBy: { position: "asc" } },
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  });
}

export async function getFilterFacets() {
  const [materials, stones, colors] = await Promise.all([
    prisma.product.findMany({ where: { status: "PUBLISHED", material: { not: null } }, distinct: ["material"], select: { material: true } }),
    prisma.product.findMany({ where: { status: "PUBLISHED", stone: { not: null } }, distinct: ["stone"], select: { stone: true } }),
    prisma.product.findMany({ where: { status: "PUBLISHED", color: { not: null } }, distinct: ["color"], select: { color: true } }),
  ]);

  return {
    materials: materials.map((m) => m.material).filter(Boolean) as string[],
    stones: stones.map((s) => s.stone).filter(Boolean) as string[],
    colors: colors.map((c) => c.color).filter(Boolean) as string[],
  };
}
