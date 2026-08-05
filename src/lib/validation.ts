import { z } from "zod";

/**
 * Every model's id is a MongoDB ObjectId (`@db.ObjectId` in schema.prisma),
 * not a cuid — validate accordingly wherever a request body references one.
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
