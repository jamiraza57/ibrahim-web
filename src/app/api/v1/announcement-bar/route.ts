import { NextRequest, NextResponse } from "next/server";
import { announcementBarSchema } from "@/features/announcement-bar/schemas/announcement-bar.schema";
import { getAnnouncementBar, upsertAnnouncementBar } from "@/features/announcement-bar/services/announcement-bar.service";
import { getAdminSessionToken } from "@/lib/auth/cookies";
import { verifyAdminSession } from "@/lib/auth/jwt";

// Public read — the storefront header fetches this on every request (cached at the edge).
export async function GET() {
  const bar = await getAnnouncementBar();
  return NextResponse.json({ data: bar });
}

// Admin-only write. Middleware already guards /api/v1/admin/**, but this route lives
// under the public /api/v1/announcement-bar path (so GET stays public), so we verify
// the session explicitly here for the PUT case.
export async function PUT(request: NextRequest) {
  const token = await getAdminSessionToken();
  const session = token ? await verifyAdminSession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = announcementBarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const updated = await upsertAnnouncementBar(parsed.data);
  return NextResponse.json({ data: updated });
}
