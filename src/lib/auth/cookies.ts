import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2h, matches JWT TTL

export async function setAdminSessionCookie(token: string) {
  const { JWT_COOKIE_NAME } = getEnv();
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const { JWT_COOKIE_NAME } = getEnv();
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE_NAME);
}

export async function getAdminSessionToken(): Promise<string | undefined> {
  const { JWT_COOKIE_NAME } = getEnv();
  const cookieStore = await cookies();
  return cookieStore.get(JWT_COOKIE_NAME)?.value;
}
