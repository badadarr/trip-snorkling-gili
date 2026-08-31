// Middleware disabled — no locale routing needed (Indonesian only)
// Keep file to prevent Next.js from using default middleware behavior

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Match only internationalized pathnames, excluding api, admin, _next, favicon, and static files
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};
