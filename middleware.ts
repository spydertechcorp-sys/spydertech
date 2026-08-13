// middleware.ts — Route protection middleware for SpyderTech 2.0
// Protects admin and client routes, adds security headers

import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'X-XSS-Protection': '1; mode=block',
}

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req: NextRequest & { auth: any }) {
  const { pathname } = req.nextUrl
  const session = req.auth

  // ─── Add security headers to all responses ─────────────────
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Basic authentication enforcement for ANY admin route (Global or Tenant)
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/') || pathname.endsWith('/admin') || pathname.includes('/admin/')
  
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url))
  }

  // The actual Tenant Isolation (checking if user belongs to the business) 
  // will happen in the Server Components (app/[businessSlug]/admin/layout.tsx)
  // because the Edge Middleware cannot query the SQLite DB directly.

  // ─── Client dashboard — require authentication ──────────────
  if (pathname.startsWith('/dashboard')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url))
    }
  }

  // ─── Redirect authenticated users away from auth pages ──────
  if (['/login', '/register'].includes(pathname)) {
    if (session?.user) {
      const role = String((session.user as any).role).toUpperCase()
      if (['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OWNER'].includes(role)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/((?!api|_next/static|_next/image|favicon|public).*)',
  ],
}
