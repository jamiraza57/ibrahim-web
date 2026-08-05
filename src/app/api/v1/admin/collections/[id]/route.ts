import { NextRequest, NextResponse } from "next/server";
import { collectionSchema } from "@/features/collections/schemas/collection.schema";
import {
  getCollection,
  updateCollection,
  deleteCollection,
  DuplicateCollectionSlugError,
} from "@/features/collections/services/collection.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const collection = await getCollection(id);
  if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: collection });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = collectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const collection = await updateCollection(id, parsed.data);
    return NextResponse.json({ data: collection });
  } catch (err) {
    if (err instanceof DuplicateCollectionSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Update collection error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await deleteCollection(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete collection error:", err);
    return NextResponse.json({ error: "Could not delete collection" }, { status: 500 });
  }
}
