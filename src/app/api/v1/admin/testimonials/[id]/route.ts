import { NextRequest, NextResponse } from "next/server";
import { testimonialSchema } from "@/features/testimonials/schemas/testimonial.schema";
import {
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/features/testimonials/services/testimonial.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: testimonial });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

  const testimonial = await updateTestimonial(id, parsed.data);
  return NextResponse.json({ data: testimonial });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  await deleteTestimonial(id);
  return NextResponse.json({ success: true });
}
