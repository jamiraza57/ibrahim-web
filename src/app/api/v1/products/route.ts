import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { objectIdSchema } from "@/lib/validation";

// Public lookup for a small set of products by id — powers client-side
// features (like the localStorage-backed wishlist) that only have ids to
// work with, without exposing a full listing/search endpoint.
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => objectIdSchema.safeParse(id).success)
    .slice(0, 50);

  if (ids.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" } } },
  });

  const items = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price.toString(),
    salePrice: product.salePrice?.toString() ?? null,
    thumbnailUrl: product.images.find((i) => i.isThumbnail)?.url ?? product.images[0]?.url,
    inStock: product.stock > 0,
  }));

  return NextResponse.json({ items });
}
