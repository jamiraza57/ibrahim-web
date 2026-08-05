import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(7, "Enter a valid phone number"),
  }),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().max(200).optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State / Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required").default("Pakistan"),
    notes: z.string().max(500).optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart is empty"),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
