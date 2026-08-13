// lib/rbac.ts — Role-Based Access Control for SpyderTech 2.0
// All authorization checks happen SERVER-SIDE

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'MARKETING' | 'LEGAL' | 'SUPPORT' | 'CLIENT'

// Role hierarchy — higher index = higher privilege
const ROLE_HIERARCHY: RoleName[] = ['CLIENT', 'SUPPORT', 'LEGAL', 'MARKETING', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']

export function isRoleAtLeast(userRole: RoleName, minRole: RoleName): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(minRole)
}

// ─── Server-side session helpers ─────────────────────────────────

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function requireRole(minRole: RoleName) {
  const session = await requireAuth()
  const userRole = (session.user as any).role as RoleName
  if (!isRoleAtLeast(userRole, minRole)) {
    redirect('/unauthorized')
  }
  return session
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

export async function requireSuperAdmin() {
  return requireRole('SUPER_ADMIN')
}

// ─── Permission check (granular) ──────────────────────────────────

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  })

  if (!user?.role) return false

  // Super admin has all permissions
  if (user.role.name === 'SUPER_ADMIN') return true

  // The current schema intentionally has role-level access only. Do not claim
  // granular permissions until the Permission/RolePermission models exist.
  return false
}

// ─── API Route protection middleware ─────────────────────────────

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>,
  minRole?: RoleName
): Promise<NextResponse> {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userRole = (session.user as any).role as RoleName

  if (minRole && !isRoleAtLeast(userRole, minRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return handler(req, session)
}

// ─── Resource ownership check ─────────────────────────────────────

export async function canAccessResource(
  userId: string,
  resourceOwnerId: string,
  minRole: RoleName = 'MANAGER'
): Promise<boolean> {
  if (userId === resourceOwnerId) return true

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  })

  if (!user?.role) return false
  return isRoleAtLeast(user.role.name as RoleName, minRole)
}
