import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required — must include a database name and ?retryWrites=true&w=majority"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_COOKIE_NAME: z.string().default("admin_session"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required — create a Blob store in the Vercel dashboard's Storage tab"),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid or missing environment variables:\n${missing}\n\nCheck .env against .env.example.`
    );
  }
  return parsed.data;
}

// Validated lazily so `next build` on CI without secrets doesn't crash import-time;
// actual usage sites call getEnv() which throws with a precise, non-silent error.
let cached: z.infer<typeof envSchema> | null = null;
export function getEnv() {
  if (!cached) cached = loadEnv();
  return cached;
}
