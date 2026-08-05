import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
];

/**
 * This route never sees the raw BLOB_READ_WRITE_TOKEN reach the client — it
 * exchanges the browser's upload request for a short-lived, scoped client
 * token via onBeforeGenerateToken, then the browser PUTs the file bytes
 * directly to Blob storage. Mirrors the same "server never proxies the file"
 * shape the old Cloudinary signed-upload flow used.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Asset metadata is recorded by the client immediately after upload()
        // resolves (see ImageUploader) rather than here, since this webhook
        // only fires from a publicly reachable deployment and would silently
        // never run against a localhost dev server.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("Blob upload token error:", err);
    return NextResponse.json({ error: "Could not authorize upload" }, { status: 400 });
  }
}
