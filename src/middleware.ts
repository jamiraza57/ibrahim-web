import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/jwt";
import { getEnv } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isLogoutRoute = pathname === "/api/v1/admin/logout";
  const isAdminApi =
    pathname.startsWith("/api/v1/admin") &&
    !pathname.startsWith("/api/v1/admin/login") &&
    !isLogoutRoute;

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();
  if (isLoginRoute || isLogoutRoute) return NextResponse.next();

  const { JWT_COOKIE_NAME } = getEnv();
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return redirectOrDeny(request, isAdminApi);
  }

  const session = await verifyAdminSession(token);
  if (!session) {
    return redirectOrDeny(request, isAdminApi);
  }

  return NextResponse.next();
}

function redirectOrDeny(request: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/:path*"],
};
