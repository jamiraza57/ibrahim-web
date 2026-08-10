import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/auth/cookies";

export async function POST() {
  await clearCustomerSessionCookie();
  return NextResponse.json({ success: true });
}
