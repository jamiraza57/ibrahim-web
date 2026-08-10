import { NextRequest, NextResponse } from "next/server";
import { customerSignupSchema } from "@/features/auth/schemas/customer-auth.schema";
import { registerCustomer, EmailAlreadyRegisteredError } from "@/features/auth/services/customer-auth.service";
import { setCustomerSessionCookie } from "@/lib/auth/cookies";
import { checkRateLimit } from "@/lib/rate-limit";

const SIGNUP_ATTEMPT_LIMIT = 5;
const SIGNUP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(`signup:${ip}`, SIGNUP_ATTEMPT_LIMIT, SIGNUP_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = customerSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const token = await registerCustomer(parsed.data);
    await setCustomerSessionCookie(token);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof EmailAlreadyRegisteredError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
