"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface MediaAsset {
  id: string;
  url: string;
  folder: string | null;
  type: string;
  createdAt: string;
}

export default function AdminMediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  async function load() {
    const res = await fetch("/api/v1/admin/media");
    const { data } = await res.json();
    setAssets(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this asset? This removes it from storage too.")) return;
    await fetch(`/api/v1/admin/media/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-2xl text-white">Media Library</h1>

      <div className="mb-8">
        <ImageUploader folder="ibrahim/library" onUploaded={load} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {assets.map((asset) => (
          <div key={asset.id} className="group relative aspect-square overflow-hidden rounded border border-gold/10">
            {asset.type === "video" ? (
              <video src={asset.url} className="h-full w-full object-cover" muted />
            ) : (
              <Image src={asset.url} alt="" fill className="object-cover" />
            )}
            <button
              onClick={() => handleDelete(asset.id)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="col-span-full py-12 text-center text-secondary-text">No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
