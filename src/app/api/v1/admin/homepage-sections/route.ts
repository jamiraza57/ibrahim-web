import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { homepageSectionSchema, createSection, listAllSections } from "@/features/homepage/services/homepage-section.service";

export async function GET() {
  const sections = await listAllSections();
  return NextResponse.json({ data: sections });
}

export async function POST(request: NextRequest) {
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
    const section = await createSection(parsed.data);
    return NextResponse.json({ data: section }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid section config", issues: err.flatten() }, { status: 422 });
    }
    console.error("Create homepage section error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
