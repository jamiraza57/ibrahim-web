import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { swapSectionOrder } from "@/features/homepage/services/homepage-section.service";

const reorderSchema = z.object({ idA: z.string().cuid(), idB: z.string().cuid() });

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  await swapSectionOrder(parsed.data.idA, parsed.data.idB);
  return NextResponse.json({ success: true });
}
