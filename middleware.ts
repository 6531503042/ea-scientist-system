import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth/cookies";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login"];

// Routes that start with these prefixes don't require authentication
const PUBLIC_PREFIXES = ["/_next", "/favicon.ico", "/public", "/api"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Skip specific public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for tokens
  const accessToken = getAccessTokenFromCookies(request.cookies);
  const refreshToken = getRefreshTokenFromCookies(request.cookies);
  const hasToken = !!(accessToken || refreshToken);

  // If going to login page while authenticated, redirect to home
  if (pathname === "/login" && hasToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access protected route without token, redirect to login
  if (!hasToken && !PUBLIC_ROUTES.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
