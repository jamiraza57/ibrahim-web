import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().max(2000).optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  status: z.boolean().default(true),
  metaTitle: z.string().max(160).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
