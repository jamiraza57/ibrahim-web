import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/features/categories/schemas/category.schema";
import {
  listCategories,
  createCategory,
  DuplicateSlugError,
} from "@/features/categories/services/category.service";

// Auth is enforced by middleware for every /api/v1/admin/** route.

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json({ data: categories });
}

export async function POST(request: NextRequest) {
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
    const category = await createCategory(parsed.data);
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Create category error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
