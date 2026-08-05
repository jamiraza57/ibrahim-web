import { prisma } from "@/lib/prisma";
import type { TestimonialInput } from "../schemas/testimonial.schema";

export async function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { order: "asc" } });
}

export async function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(input: TestimonialInput) {
  return prisma.testimonial.create({ data: input });
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  return prisma.testimonial.update({ where: { id }, data: input });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}
