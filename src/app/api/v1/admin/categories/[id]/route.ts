import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/features/categories/schemas/category.schema";
import {
  getCategory,
  updateCategory,
  deleteCategory,
  DuplicateSlugError,
  InvalidParentError,
} from "@/features/categories/services/category.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: category });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const category = await updateCategory(id, parsed.data);
    return NextResponse.json({ data: category });
  } catch (err) {
    if (err instanceof DuplicateSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err instanceof InvalidParentError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Update category error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Could not delete category" }, { status: 500 });
  }
}
