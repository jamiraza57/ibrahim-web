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

export const CUSTOMER_SESSION_COOKIE = "customer_session";
const CUSTOMER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30d, matches JWT TTL

export async function setCustomerSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearCustomerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
}

export async function getCustomerSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
}
