import { SignJWT, jwtVerify } from "jose";
import { getJwtConfig } from "@/lib/env";

export interface AdminSessionPayload {
  sub: string; // AdminUser.id
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
}

const ACCESS_TOKEN_TTL = "2h";

function getSecretKey() {
  const { JWT_SECRET } = getJwtConfig();
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

export interface CustomerSessionPayload {
  sub: string; // Customer.id
  email: string;
}

// Customers expect to stay signed in far longer than an admin's back-office session.
const CUSTOMER_ACCESS_TOKEN_TTL = "30d";

export async function signCustomerSession(payload: CustomerSessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(CUSTOMER_ACCESS_TOKEN_TTL)
    .sign(getSecretKey());
}

export async function verifyCustomerSession(token: string): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || !payload.email) return null;
    return {
      sub: payload.sub as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
