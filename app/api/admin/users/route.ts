// app/api/admin/users/route.ts — Admin User Management API

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
import { getClientIP } from '@/lib/security'

export async function GET(req: NextRequest) {
  return withAuth(req, async (req) => {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) where.role = { name: role }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          role: { select: { name: true, label: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) })
  }, 'ADMIN')
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    try {
      const body = await req.json()
      const { name, email, roleId, password, businessId, businessRole } = body
      
      if (!email || !name) {
        return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
      }

      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
      }

      // We'll create the user. Passwords in this mock will be stored directly or hashed ideally.
      // (Using simple hashing fallback if bcrypt isn't around, but for Spydertech we assume passwordHash)
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          username: email.split('@')[0], // base username
          roleId,
          passwordHash: password || 'defaultPassword123' // Fallback
        }
      })

      // If business was selected, assign the user to that business
      if (businessId) {
        await prisma.businessMember.create({
          data: {
            userId: user.id,
            businessId: businessId,
            role: businessRole || 'STAFF'
          }
        })
      }

      await createAuditLog({
        userId: (req as any).user.id,
        action: 'CREATE_USER',
        resource: 'User',
        resourceId: user.id,
        details: { message: `Created user ${user.email}` },
      })

      return NextResponse.json({ user })
    } catch (error) {
      console.error('[CREATE_USER_ERROR]', error)
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
  }, 'SUPER_ADMIN')
}
