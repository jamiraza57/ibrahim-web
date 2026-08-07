import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { upsertPromoBannerSection } from "@/features/homepage/services/homepage-section.service";

const promoInputSchema = z.object({
  imageUrl: z.string().url(),
  heading: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = promoInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    const section = await upsertPromoBannerSection(parsed.data);
    return NextResponse.json({ data: section });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid banner config", issues: err.flatten() }, { status: 422 });
    }
    console.error("Update promo banner error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
