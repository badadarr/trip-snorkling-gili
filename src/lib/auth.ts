import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || 'admin@skt.com';
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
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

export async function getAdminSession(req?: Request): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const parsed = parseSessionToken(sessionCookie.value);
      if (parsed) return parsed;
    }
  } catch (e) {
    // context error fallback
  }

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const parsed = parseSessionToken(token);
      if (parsed) return parsed;
    }

    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match && match[1]) {
        const parsed = parseSessionToken(decodeURIComponent(match[1]));
        if (parsed) return parsed;
      }
    }
  }

  return null;
}
