import { prisma } from "@/lib/prisma";
import type { CollectionInput } from "../schemas/collection.schema";

export class DuplicateCollectionSlugError extends Error {
  constructor() {
    super("A collection with this slug already exists");
    this.name = "DuplicateCollectionSlugError";
  }
}

export async function listCollections() {
  return prisma.collection.findMany({ orderBy: { name: "asc" } });
}

export async function getCollection(id: string) {
  return prisma.collection.findUnique({ where: { id } });
}

export async function createCollection(input: CollectionInput) {
  const existing = await prisma.collection.findUnique({ where: { slug: input.slug } });
  if (existing) throw new DuplicateCollectionSlugError();
  return prisma.collection.create({ data: input });
}

export async function updateCollection(id: string, input: CollectionInput) {
  const existing = await prisma.collection.findFirst({ where: { slug: input.slug, NOT: { id } } });
  if (existing) throw new DuplicateCollectionSlugError();
  return prisma.collection.update({ where: { id }, data: input });
}

export async function deleteCollection(id: string) {
  return prisma.collection.delete({ where: { id } });
}
