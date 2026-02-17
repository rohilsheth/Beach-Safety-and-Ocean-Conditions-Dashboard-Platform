import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_AUTH_COOKIE = 'admin_auth';
export const ADMIN_AUTH_VALUE = 'authenticated';

export function isAdminAuthenticated(): boolean {
  return cookies().get(ADMIN_AUTH_COOKIE)?.value === ADMIN_AUTH_VALUE;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
