"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export interface UploadedImage {
  url: string;
  pathname: string;
}

interface ImageUploaderProps {
  folder?: string;
  onUploaded: (image: UploadedImage) => void;
}

/**
 * Uploads directly from the browser to Vercel Blob storage. The upload() call
 * transparently exchanges a token with our /media/upload route first (which
 * never exposes BLOB_READ_WRITE_TOKEN to the client), then PUTs the file
 * bytes straight to Blob storage — the file never passes through our server.
 * Once that resolves, we record the asset metadata in our own MediaAsset
 * table so it shows up in the Media Library.
 */
export function ImageUploader({ folder = "products", onUploaded }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const blob = await upload(`${folder}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/v1/admin/media/upload",
      });

      await fetch("/api/v1/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname: blob.pathname,
          url: blob.url,
          folder,
          type: file.type.startsWith("video/") ? "video" : "image",
        }),
      });

      onUploaded({ url: blob.url, pathname: blob.pathname });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="text-sm text-secondary-text file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-background"
      />
      {isUploading && <p className="mt-1 text-xs text-secondary-text">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
