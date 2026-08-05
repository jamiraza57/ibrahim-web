import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listMediaAssets, recordUploadedAsset } from "@/features/media/services/media.service";

const recordAssetSchema = z.object({
  pathname: z.string().min(1),
  url: z.string().url(),
  folder: z.string().optional(),
  type: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assets = await listMediaAssets(searchParams.get("folder") ?? undefined);
  return NextResponse.json({ data: assets });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recordAssetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const asset = await recordUploadedAsset(parsed.data);
  return NextResponse.json({ data: asset }, { status: 201 });
}
