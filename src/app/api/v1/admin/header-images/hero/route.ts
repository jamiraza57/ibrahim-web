import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { heroConfigSchema } from "@/features/homepage/schemas/homepage-section.schema";
import { upsertHeroSection } from "@/features/homepage/services/homepage-section.service";

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = heroConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    const section = await upsertHeroSection(parsed.data);
    return NextResponse.json({ data: section });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid hero config", issues: err.flatten() }, { status: 422 });
    }
    console.error("Update hero section error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
