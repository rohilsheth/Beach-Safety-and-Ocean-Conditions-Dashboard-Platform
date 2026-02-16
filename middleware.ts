import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Admin Authentication
 * Protects /admin routes with HTTP Basic Authentication
 *
 * Credentials are set via environment variable:
 * ADMIN_PASSWORD=your_secure_password
 */
export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Check credentials
      // Username: admin
      // Password: from environment variable
      if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }

    // Authentication failed or not provided
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="San Mateo County Beach Safety Admin"',
      },
    });
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: '/admin/:path*',
};
