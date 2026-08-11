import { prisma } from "@/lib/prisma";
import {
  homepageSectionSchema,
  validateSectionConfig,
  heroConfigSchema,
  bannerConfigSchema,
  type HomepageSectionInput,
} from "../schemas/homepage-section.schema";
import type { z } from "zod";

export async function listAllSections() {
  return prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
}

export async function listVisibleSections() {
  return prisma.homepageSection.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
}

export async function createSection(input: HomepageSectionInput) {
  const validatedConfig = validateSectionConfig(input.type, input.config);
  return prisma.homepageSection.create({
    data: { type: input.type, order: input.order, isVisible: input.isVisible, config: validatedConfig },
  });
}

export async function updateSection(id: string, input: HomepageSectionInput) {
  const validatedConfig = validateSectionConfig(input.type, input.config);
  return prisma.homepageSection.update({
    where: { id },
    data: { type: input.type, order: input.order, isVisible: input.isVisible, config: validatedConfig },
  });
}

export async function deleteSection(id: string) {
  return prisma.homepageSection.delete({ where: { id } });
}

/** Swaps `order` between two sections so drag-free up/down controls work atomically. */
export async function swapSectionOrder(idA: string, idB: string) {
  const [a, b] = await Promise.all([
    prisma.homepageSection.findUniqueOrThrow({ where: { id: idA } }),
    prisma.homepageSection.findUniqueOrThrow({ where: { id: idB } }),
  ]);

  await prisma.$transaction([
    prisma.homepageSection.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.homepageSection.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
}

export { homepageSectionSchema };

/**
 * The slim `/admin/header-images` page only ever edits three known rows —
 * the hero banner, one mid-page promo banner, and the 3-image triptych — all
 * addressed by type (+ config.variant for the two BANNER rows) rather than by
 * id, so the admin page never needs an add/remove/reorder UI.
 */

export async function getHeroSection() {
  return prisma.homepageSection.findFirst({ where: { type: "HERO" } });
}

/**
 * Older rows were saved with the pre-carousel flat shape
 * (`{ heading, subheading, ctaLabel, ctaHref, backgroundImageUrl }`) instead of
 * `{ slides: [...3] }`. Wrap those into slide 1 (padded with 2 inactive slides)
 * so an admin's existing hero content survives the upgrade to a 3-slide carousel
 * instead of failing to parse and silently disappearing.
 */
export function normalizeHeroConfig(raw: unknown): z.infer<typeof heroConfigSchema> {
  const parsedAsSlides = heroConfigSchema.safeParse(raw);
  if (parsedAsSlides.success) return parsedAsSlides.data;

  const legacy = raw as {
    heading?: string;
    subheading?: string;
    ctaLabel?: string;
    ctaHref?: string;
    backgroundImageUrl?: string;
  } | null;

  const firstSlide = {
    imageUrl: legacy?.backgroundImageUrl,
    heading: legacy?.heading ?? "Timeless Elegance",
    subheading: legacy?.subheading,
    ctaLabel: legacy?.ctaLabel,
    ctaHref: legacy?.ctaHref,
    isActive: true,
  };

  return heroConfigSchema.parse({
    slides: [firstSlide, { heading: "Slide 2", isActive: false }, { heading: "Slide 3", isActive: false }],
  });
}

export async function upsertHeroSection(config: z.infer<typeof heroConfigSchema>) {
  const validated = heroConfigSchema.parse(config);
  const existing = await getHeroSection();
  if (existing) {
    return prisma.homepageSection.update({ where: { id: existing.id }, data: { config: validated } });
  }
  return prisma.homepageSection.create({ data: { type: "HERO", order: 0, config: validated } });
}

async function getBannerVariant(variant: "single" | "triptych") {
  const banners = await prisma.homepageSection.findMany({ where: { type: "BANNER" } });
  return banners.find((b) => ((b.config as { variant?: string })?.variant ?? "single") === variant) ?? null;
}

export async function getPromoBannerSection() {
  return getBannerVariant("single");
}

export async function upsertPromoBannerSection(config: Omit<z.infer<typeof bannerConfigSchema>, "variant" | "images">) {
  const validated = bannerConfigSchema.parse({ ...config, variant: "single" });
  const existing = await getPromoBannerSection();
  if (existing) {
    return prisma.homepageSection.update({ where: { id: existing.id }, data: { config: validated } });
  }
  return prisma.homepageSection.create({ data: { type: "BANNER", order: 1, config: validated } });
}

export async function getTriptychSection() {
  return getBannerVariant("triptych");
}

export async function upsertTriptychSection(images: [string, string, string]) {
  const validated = bannerConfigSchema.parse({ variant: "triptych", images });
  const existing = await getTriptychSection();
  if (existing) {
    return prisma.homepageSection.update({ where: { id: existing.id }, data: { config: validated } });
  }
  return prisma.homepageSection.create({ data: { type: "BANNER", order: 2, config: validated } });
}
