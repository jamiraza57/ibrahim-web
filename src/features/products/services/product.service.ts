import { prisma } from "@/lib/prisma";
import type { ProductInput } from "../schemas/product.schema";

export class DuplicateSkuOrSlugError extends Error {
  constructor(field: "sku" | "slug") {
    super(`A product with this ${field} already exists`);
    this.name = "DuplicateSkuOrSlugError";
  }
}

const PRODUCT_INCLUDE = {
  images: { orderBy: { position: "asc" as const } },
  categories: { include: { category: true } },
  collections: { include: { collection: true } },
};

export async function listProducts(params: {
  page?: number;
  pageSize?: number;
  status?: ProductInput["status"];
  search?: string;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const where = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { sku: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
}

async function assertUniqueSlugAndSku(input: ProductInput, excludeId?: string) {
  const [slugClash, skuClash] = await Promise.all([
    prisma.product.findFirst({ where: { slug: input.slug, NOT: excludeId ? { id: excludeId } : undefined } }),
    prisma.product.findFirst({ where: { sku: input.sku, NOT: excludeId ? { id: excludeId } : undefined } }),
  ]);
  if (slugClash) throw new DuplicateSkuOrSlugError("slug");
  if (skuClash) throw new DuplicateSkuOrSlugError("sku");
}

export async function createProduct(input: ProductInput) {
  await assertUniqueSlugAndSku(input);

  const { categoryIds, collectionIds, images, ...productData } = input;

  return prisma.product.create({
    data: {
      ...productData,
      images: { create: images },
      categories: { create: categoryIds.map((categoryId, position) => ({ categoryId, position })) },
      collections: { create: collectionIds.map((collectionId, position) => ({ collectionId, position })) },
    },
    include: PRODUCT_INCLUDE,
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  await assertUniqueSlugAndSku(input, id);

  const { categoryIds, collectionIds, images, ...productData } = input;

  // Replace relations atomically so a failed write never leaves the product
  // half-updated (e.g. new categories saved but old images still attached).
  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productCategory.deleteMany({ where: { productId: id } });
    await tx.productCollection.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        ...productData,
        images: { create: images },
        categories: { create: categoryIds.map((categoryId, position) => ({ categoryId, position })) },
        collections: { create: collectionIds.map((collectionId, position) => ({ collectionId, position })) },
      },
      include: PRODUCT_INCLUDE,
    });
  });
}

export async function deleteProduct(id: string) {
  // Product→OrderItem is onDelete: Restrict in the schema, so this throws (not
  // silently succeeds) if the product has ever been ordered — history stays intact.
  return prisma.product.delete({ where: { id } });
}
