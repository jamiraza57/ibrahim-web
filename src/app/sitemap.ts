import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [products, categories, collections] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ where: { status: true }, select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ where: { status: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.5 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/refund-policy`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...collectionPages];
}
