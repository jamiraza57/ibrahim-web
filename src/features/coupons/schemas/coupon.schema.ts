import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .max(50)
      .transform((v) => v.toUpperCase().trim()),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().positive("Value must be greater than 0"),
    minPurchase: z.number().nonnegative().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    expiresAt: z.string().datetime().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.type !== "PERCENTAGE" || data.value <= 100, {
    message: "Percentage discount cannot exceed 100",
    path: ["value"],
  });

export type CouponInput = z.infer<typeof couponSchema>;
