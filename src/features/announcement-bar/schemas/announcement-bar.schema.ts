import { z } from "zod";

export const announcementBarSchema = z.object({
  text: z.string().min(1, "Announcement text is required").max(200),
  isActive: z.boolean(),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  type: z.enum(["SALE", "FLASH_SALE", "FREE_SHIPPING", "NEW_COLLECTION"]),
});

export type AnnouncementBarInput = z.infer<typeof announcementBarSchema>;
