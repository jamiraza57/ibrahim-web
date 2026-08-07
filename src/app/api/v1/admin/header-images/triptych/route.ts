import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { upsertTriptychSection } from "@/features/homepage/services/homepage-section.service";

const triptychInputSchema = z.object({
  images: z.tuple([z.string().url(), z.string().url(), z.string().url()]),
});

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = triptychInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    const section = await upsertTriptychSection(parsed.data.images);
    return NextResponse.json({ data: section });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid triptych config", issues: err.flatten() }, { status: 422 });
    }
    console.error("Update triptych section error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
