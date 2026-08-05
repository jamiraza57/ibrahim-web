import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/features/products/schemas/product.schema";
import {
  listProducts,
  createProduct,
  DuplicateSkuOrSlugError,
} from "@/features/products/services/product.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = await listProducts({
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 20),
    status: (searchParams.get("status") as never) ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  return NextResponse.json({ data: result.items, meta: result });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateSkuOrSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
