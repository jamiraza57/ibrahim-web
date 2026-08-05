import { z } from "zod";

export const heroConfigSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  backgroundImageUrl: z.string().url().optional(),
});

export const bannerConfigSchema = z.object({
  imageUrl: z.string().url(),
  heading: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const featuredCollectionsConfigSchema = z.object({
  heading: z.string().default("Shop by Collection"),
  collectionIds: z.array(z.string().cuid()).min(1, "Pick at least one collection"),
});

export const featuredProductsConfigSchema = z.object({
  heading: z.string().default("Featured Pieces"),
  tag: z.enum(["isFeatured", "isNewArrival", "isBestSeller", "isTrending", "isOnSale"]),
  limit: z.number().int().min(1).max(24).default(8),
});

export const instagramConfigSchema = z.object({
  heading: z.string().default("Follow @Ibrahim"),
  imageUrls: z.array(z.string().url()).min(1),
});

export const emptyConfigSchema = z.object({}).catchall(z.never()).default({});

export const CONFIG_SCHEMA_BY_TYPE = {
  HERO: heroConfigSchema,
  BANNER: bannerConfigSchema,
  FEATURED_COLLECTIONS: featuredCollectionsConfigSchema,
  FEATURED_PRODUCTS: featuredProductsConfigSchema,
  TESTIMONIALS: emptyConfigSchema,
  NEWSLETTER: emptyConfigSchema,
  INSTAGRAM: instagramConfigSchema,
  FOOTER: emptyConfigSchema,
} as const;

export type HomepageSectionType = keyof typeof CONFIG_SCHEMA_BY_TYPE;

export const homepageSectionSchema = z.object({
  type: z.enum([
    "HERO",
    "BANNER",
    "FEATURED_COLLECTIONS",
    "FEATURED_PRODUCTS",
    "TESTIMONIALS",
    "NEWSLETTER",
    "INSTAGRAM",
    "FOOTER",
  ]),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;

export function validateSectionConfig(type: HomepageSectionType, config: unknown) {
  return CONFIG_SCHEMA_BY_TYPE[type].parse(config);
}
