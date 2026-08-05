import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "@/lib/env";

export interface AdminSessionPayload {
  sub: string; // AdminUser.id
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
}

const ACCESS_TOKEN_TTL = "2h";

function getSecretKey() {
  const { JWT_SECRET } = getEnv();
  return new TextEncoder().encode(JWT_SECRET);
}

export async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as AdminSessionPayload["role"],
    };
  } catch {
    return null;
  }
}
