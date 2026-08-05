import { NextRequest, NextResponse } from "next/server";
import { deleteMediaAsset } from "@/features/media/services/media.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const deleted = await deleteMediaAsset(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete media asset error:", err);
    return NextResponse.json({ error: "Could not delete asset" }, { status: 500 });
  }
}
