import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signCustomerSession } from "@/lib/auth/jwt";
import type { CustomerLoginInput, CustomerSignupInput } from "../schemas/customer-auth.schema";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("An account with this email already exists");
    this.name = "EmailAlreadyRegisteredError";
  }
}

/** Same constant-time-ish flow as admin auth: always run bcrypt.compare, even
 * against a dummy hash, so an unknown email doesn't respond measurably faster. */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOgxLD/0fTQlZ8gzR2xnpqoxlR8x8i9Aa";

const BCRYPT_ROUNDS = 12;

export async function registerCustomer(input: CustomerSignupInput) {
  const existing = await prisma.customer.findFirst({ where: { email: input.email } });

  if (existing?.passwordHash) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  // A guest Customer row from a past checkout may already exist for this
  // email (no password) — claim it instead of creating a duplicate, so past
  // orders placed as a guest line up under the new account.
  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: { name: input.name, phone: input.phone, passwordHash },
      })
    : await prisma.customer.create({
        data: { name: input.name, email: input.email, phone: input.phone, passwordHash },
      });

  return signCustomerSession({ sub: customer.id, email: customer.email });
}

export async function verifyCustomerCredentials(input: CustomerLoginInput) {
  const customer = await prisma.customer.findFirst({
    where: { email: input.email, passwordHash: { not: null } },
  });

  const hashToCheck = customer?.passwordHash ?? DUMMY_HASH;
  const isValid = await bcrypt.compare(input.password, hashToCheck);

  if (!customer || !isValid) {
    throw new InvalidCredentialsError();
  }

  return signCustomerSession({ sub: customer.id, email: customer.email });
}
