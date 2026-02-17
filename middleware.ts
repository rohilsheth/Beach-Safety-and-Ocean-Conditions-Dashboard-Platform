import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_VALUE,
} from '@/lib/server/adminAuth';

/**
 * Middleware for Admin Authentication
 * Protects /admin routes with cookie-based authentication
 *
 * Login page: /admin/login
 * Credentials set via environment variable: ADMIN_PASSWORD
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE);
  const isAuthenticated = authCookie?.value === ADMIN_AUTH_VALUE;

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    if (isAuthenticated) {
      return NextResponse.next();
    }

    // Not authenticated - redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isProtectedApiRoute =
    pathname.startsWith('/api/admin/') ||
    pathname === '/api/analytics/stats' ||
    (pathname === '/api/custom-alerts' && request.method !== 'GET');

  if (isProtectedApiRoute && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/custom-alerts',
    '/api/analytics/stats',
  ],
};
