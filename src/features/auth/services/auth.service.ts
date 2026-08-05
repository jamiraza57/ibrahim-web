import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminSession } from "@/lib/auth/jwt";
import type { LoginInput } from "../schemas/login.schema";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

/** Constant-time-ish flow: always run bcrypt.compare even on unknown email to reduce
 * user-enumeration timing signal (compares against a dummy hash if user not found). */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOgxLD/0fTQlZ8gzR2xnpqoxlR8x8i9Aa";

export async function verifyAdminCredentials(input: LoginInput) {
  const user = await prisma.adminUser.findUnique({ where: { email: input.email } });

  const hashToCheck = user?.passwordHash ?? DUMMY_HASH;
  const isValid = await bcrypt.compare(input.password, hashToCheck);

  if (!user || !isValid) {
    throw new InvalidCredentialsError();
  }

  return signAdminSession({ sub: user.id, email: user.email, role: user.role });
}
