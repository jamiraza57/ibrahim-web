import { prisma } from "@/lib/prisma";
import {
  homepageSectionSchema,
  validateSectionConfig,
  type HomepageSectionInput,
} from "../schemas/homepage-section.schema";

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
