import { prisma } from "@/lib/prisma";
import type { AnnouncementBarInput } from "../schemas/announcement-bar.schema";

/**
 * The store has exactly one announcement bar configuration. Rather than a
 * fragile "well-known id" constant, we always operate on the first row and
 * create it lazily on first write so there's nothing to seed manually.
 */
export async function getAnnouncementBar() {
  return prisma.announcementBar.findFirst();
}

export async function upsertAnnouncementBar(input: AnnouncementBarInput) {
  const existing = await prisma.announcementBar.findFirst();

  if (!existing) {
    return prisma.announcementBar.create({ data: input });
  }

  return prisma.announcementBar.update({
    where: { id: existing.id },
    data: input,
  });
}
