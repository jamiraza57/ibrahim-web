import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional().nullable(),
  position: z.number().int().default(0),
  isThumbnail: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().min(1),
  shortDescription: z.string().max(300).optional().nullable(),
  sku: z.string().min(1),
  barcode: z.string().optional().nullable(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  weight: z.number().positive().optional().nullable(),
  dimensions: z.object({ l: z.number(), w: z.number(), h: z.number() }).optional().nullable(),
  material: z.string().optional().nullable(),
  purity: z.string().optional().nullable(),
  stone: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "HIDDEN"]).default("DRAFT"),
  publishAt: z.string().datetime().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  metaTitle: z.string().max(160).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  categoryIds: z.array(z.string().cuid()).default([]),
  collectionIds: z.array(z.string().cuid()).default([]),
  images: z.array(productImageSchema).default([]),
}).refine(
  (data) => !data.salePrice || data.salePrice < data.price,
  { message: "Sale price must be lower than regular price", path: ["salePrice"] }
);

export type ProductInput = z.infer<typeof productSchema>;
