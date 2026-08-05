import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/features/products/schemas/product.schema";
import {
  getProduct,
  updateProduct,
  deleteProduct,
  DuplicateSkuOrSlugError,
} from "@/features/products/services/product.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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
    const product = await updateProduct(id, parsed.data);
    return NextResponse.json({ data: product });
  } catch (err) {
    if (err instanceof DuplicateSkuOrSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Could not delete — this product has order history and must be archived instead" },
      { status: 409 }
    );
  }
}
