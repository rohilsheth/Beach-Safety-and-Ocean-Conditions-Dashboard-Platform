import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_VALUE,
} from '@/lib/server/adminAuth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (!configuredPassword) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_PASSWORD is not configured' },
        { status: 500 }
      );
    }

    // Check password against environment variable
    if (typeof password === 'string' && password === configuredPassword) {
      // Set secure HTTP-only cookie
      cookies().set(ADMIN_AUTH_COOKIE, ADMIN_AUTH_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
