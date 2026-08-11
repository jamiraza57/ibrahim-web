import { z } from "zod";
import { objectIdSchema } from "@/lib/validation";

export const heroSlideSchema = z.object({
  imageUrl: z.string().url().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  badge: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const heroConfigSchema = z.object({
  slides: z.array(heroSlideSchema).length(3),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;

// `variant` distinguishes the fixed homepage's two BANNER-type uses: a single
// promo banner (imageUrl) vs. the 3-image triptych strip (images). Kept as one
// schema (not a new HomepageSectionType) to avoid a Prisma enum migration —
// old rows saved before `variant` existed default to "single" and still parse.
export const bannerConfigSchema = z
  .object({
    variant: z.enum(["single", "triptych"]).default("single"),
    imageUrl: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    heading: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
  })
  .refine((v) => v.variant !== "single" || !!v.imageUrl, {
    message: "imageUrl is required for the single banner variant",
  })
  .refine((v) => v.variant !== "triptych" || (v.images && v.images.length === 3), {
    message: "images must have exactly 3 entries for the triptych variant",
  });

export const statsConfigSchema = z.object({
  items: z
    .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
    .min(1, "Add at least one stat"),
});

export const brandStoryConfigSchema = z.object({
  eyebrow: z.string().default("Our Story"),
  heading: z.string().min(1),
  body: z.string().min(1),
  imageUrl: z.string().url(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const shopByCategoryConfigSchema = z.object({
  heading: z.string().default("Shop by Category"),
  categoryIds: z.array(objectIdSchema).min(1, "Pick at least one category"),
});

export const featuredCollectionsConfigSchema = z.object({
  heading: z.string().default("Shop by Collection"),
  collectionIds: z.array(objectIdSchema).min(1, "Pick at least one collection"),
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
  STATS: statsConfigSchema,
  BRAND_STORY: brandStoryConfigSchema,
  SHOP_BY_CATEGORY: shopByCategoryConfigSchema,
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
    "STATS",
    "BRAND_STORY",
    "SHOP_BY_CATEGORY",
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
