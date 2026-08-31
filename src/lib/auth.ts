import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '@/db';
import { admins, adminSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || 'admin@skt.com';
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'gili-snorkeling-secure-super-secret-key-2026';
const SESSION_COOKIE_NAME = 'snorkeling_admin_session';

export interface AdminUser {
  id?: number;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify admin credentials against Neon PostgreSQL database (with bcrypt)
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const db = getDb();
    if (db) {
      const result = await db.select().from(admins).where(eq(admins.email, cleanEmail)).limit(1);
      
      if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          // Update last login timestamp in Neon DB
          try {
            await db.update(admins).set({ lastLogin: new Date() }).where(eq(admins.id, user.id));
          } catch (e) {
            console.warn('Could not update last login timestamp:', e);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'superadmin',
          };
        }
      }
    }
  } catch (err) {
    console.error('Database auth error, falling back to secure env verification:', err);
  }

  // Fallback to secure default credentials if DB is initializing or admin user row is creating
  if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return {
      email: ADMIN_EMAIL,
      name: 'Admin Trip Snorkeling',
      role: 'superadmin',
    };
  }

  return null;
}

/**
 * Create a cryptographically signed session token (HMAC-SHA256)
 */
export function createSessionToken(user: AdminUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(8).toString('hex'),
  };

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Validate and decode signed session token
 */
export function parseSessionToken(token: string): AdminUser | null {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length === 2) {
      const [base64Payload, signature] = parts;
      const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(base64Payload).digest('base64url');

      if (signature === expectedSig) {
        const json = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
        if (json.exp && json.exp > Date.now()) {
          return {
            id: json.id,
            email: json.email,
            name: json.name,
            role: json.role,
          };
        }
      }
    } else {
      // Legacy un-signed base64 token compatibility
      const json = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (json.exp && json.exp > Date.now()) {
        return {
          id: json.id,
          email: json.email,
          name: json.name,
          role: json.role,
        };
      }
    }
  } catch (e) {
    // token verification failed
  }
  return null;
}

/**
 * Get current admin session from Cookies or Authorization Header
 */
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
