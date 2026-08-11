import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, verifyCustomerSession } from "@/lib/auth/jwt";
import { getJwtConfig } from "@/lib/env";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isLogoutRoute = pathname === "/api/v1/admin/logout";
  const isAdminApi =
    pathname.startsWith("/api/v1/admin") &&
    !pathname.startsWith("/api/v1/admin/login") &&
    !isLogoutRoute;

  if (isAdminRoute || isAdminApi) {
    if (isLoginRoute || isLogoutRoute) return NextResponse.next();

    const { JWT_COOKIE_NAME } = getJwtConfig();
    const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminSession(token) : null;

    if (!session) return redirectOrDeny(request, isAdminApi, "/admin/login");
    return NextResponse.next();
  }

  const isAccountRoute = pathname.startsWith("/account");
  const isAccountAuthRoute = pathname === "/account/login" || pathname === "/account/register";

  if (isAccountRoute && !isAccountAuthRoute) {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const session = token ? await verifyCustomerSession(token) : null;

    if (!session) return redirectOrDeny(request, false, "/account/login");
    return NextResponse.next();
  }

  return NextResponse.next();
}

function redirectOrDeny(request: NextRequest, isApi: boolean, loginPath: string) {
  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/:path*", "/account/:path*"],
};
