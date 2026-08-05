import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  avatarUrl: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  content: z.string().min(1, "Testimonial content is required").max(1000),
  isVisible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
