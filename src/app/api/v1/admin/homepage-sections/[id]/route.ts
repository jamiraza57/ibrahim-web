import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { homepageSectionSchema, updateSection, deleteSection } from "@/features/homepage/services/homepage-section.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = homepageSectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const section = await updateSection(id, parsed.data);
    return NextResponse.json({ data: section });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid section config", issues: err.flatten() }, { status: 422 });
    }
    console.error("Update homepage section error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await deleteSection(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete homepage section error:", err);
    return NextResponse.json({ error: "Could not delete section" }, { status: 500 });
  }
}
