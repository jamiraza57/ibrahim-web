import { prisma } from "@/lib/prisma";
import type { CategoryInput } from "../schemas/category.schema";

export class DuplicateSlugError extends Error {
  constructor() {
    super("A category with this slug already exists");
    this.name = "DuplicateSlugError";
  }
}

export class InvalidParentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParentError";
  }
}

async function assertNoCycle(categoryId: string, proposedParentId: string) {
  if (categoryId === proposedParentId) {
    throw new InvalidParentError("A category cannot be its own parent");
  }

  let current: string | null = proposedParentId;
  const visited = new Set<string>();

  while (current) {
    if (current === categoryId) {
      throw new InvalidParentError("This would create a circular category tree");
    }
    if (visited.has(current)) break; // already-broken data, bail rather than loop forever
    visited.add(current);

    const parent: { parentId: string | null } | null = await prisma.category.findUnique({
      where: { id: current },
      select: { parentId: true },
    });
    current = parent?.parentId ?? null;
  }
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { children: true },
  });
}

export async function getCategory(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(input: CategoryInput) {
  const existing = await prisma.category.findUnique({ where: { slug: input.slug } });
  if (existing) throw new DuplicateSlugError();

  return prisma.category.create({ data: input });
}

export async function updateCategory(id: string, input: CategoryInput) {
  const existing = await prisma.category.findFirst({
    where: { slug: input.slug, NOT: { id } },
  });
  if (existing) throw new DuplicateSlugError();

  if (input.parentId) {
    await assertNoCycle(id, input.parentId);
  }

  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteCategory(id: string) {
  // Self-relations under relationMode="prisma" can't use onDelete: SetNull, so
  // children are detached to top-level manually before the parent is removed.
  return prisma.$transaction([
    prisma.category.updateMany({ where: { parentId: id }, data: { parentId: null } }),
    prisma.category.delete({ where: { id } }),
  ]);
}
