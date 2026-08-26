import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || 'admin@snorkelinggilitrawangan.com';
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminSnorkeling2026!';
const SESSION_COOKIE_NAME = 'snorkeling_admin_session';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export async function verifyAdminCredentials(email: string, password: string):Promise<AdminUser | null> {
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return {
      email: ADMIN_EMAIL,
      name: 'Admin Trip Snorkeling',
      role: 'superadmin',
    };
  }
  return null;
}

export function createSessionToken(user: AdminUser): string {
  // Simple HMAC-like encoded token
  const payload = {
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function parseSessionToken(token: string): AdminUser | null {
  try {
    const json = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (json.exp && json.exp > Date.now()) {
      return {
        email: json.email,
        name: json.name,
        role: json.role,
      };
    }
  } catch (e) {
    // invalid token
  }
  return null;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  return parseSessionToken(sessionCookie.value);
}
