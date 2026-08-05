import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function recordUploadedAsset(input: {
  pathname: string;
  url: string;
  folder?: string;
  type: string;
}) {
  return prisma.mediaAsset.create({ data: input });
}

export async function listMediaAssets(folder?: string) {
  return prisma.mediaAsset.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteMediaAsset(id: string) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return null;

  // del() accepts the blob's public URL directly — no separate provider SDK
  // client/config needed the way Cloudinary required.
  await del(asset.url);

  return prisma.mediaAsset.delete({ where: { id } });
}
