import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow public routes (login + static landing at "/")
  const publicRoutes = ['/login', '/'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check authentication token
  const token = request.cookies.get('token')?.value;

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    // ถ้าเป็น root ให้ redirect ไป dashboard หลัง login แทน
    const targetPath = request.nextUrl.pathname === '/' ? '/dashboard' : request.nextUrl.pathname;
    loginUrl.searchParams.set('redirect', targetPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
