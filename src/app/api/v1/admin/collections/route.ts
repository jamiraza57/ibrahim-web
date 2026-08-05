import { NextRequest, NextResponse } from "next/server";
import { collectionSchema } from "@/features/collections/schemas/collection.schema";
import {
  listCollections,
  createCollection,
  DuplicateCollectionSlugError,
} from "@/features/collections/services/collection.service";

export async function GET() {
  const collections = await listCollections();
  return NextResponse.json({ data: collections });
}

export async function POST(request: NextRequest) {
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
    const collection = await createCollection(parsed.data);
    return NextResponse.json({ data: collection }, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateCollectionSlugError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Create collection error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
