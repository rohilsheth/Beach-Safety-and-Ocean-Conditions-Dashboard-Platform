import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_AUTH_COOKIE } from '@/lib/server/adminAuth';

export async function POST() {
  try {
    // Delete the auth cookie
    cookies().set(ADMIN_AUTH_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
