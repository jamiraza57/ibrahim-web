import { NextRequest, NextResponse } from "next/server";
import { testimonialSchema } from "@/features/testimonials/schemas/testimonial.schema";
import { listTestimonials, createTestimonial } from "@/features/testimonials/services/testimonial.service";

export async function GET() {
  const testimonials = await listTestimonials();
  return NextResponse.json({ data: testimonials });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const testimonial = await createTestimonial(parsed.data);
  return NextResponse.json({ data: testimonial }, { status: 201 });
}
