// app/api/admin/plans/route.ts — Admin Plans CRUD API
// GET: List all plans | POST: Create plan

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
import { getClientIP } from '@/lib/security'
import { z } from 'zod'

const planSchema = z.object({
  name:        z.string().min(2).max(100),
  slug:        z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  price:       z.number().min(0),
  currency:    z.string().default('COP'),
  isPopular:   z.boolean().optional().default(false),
  isActive:    z.boolean().optional().default(true),
  features:    z.string().optional(),
})

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, session) => {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ plans })
  }, 'MANAGER')
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, session) => {
    try {
      const body = await req.json()
      const data = planSchema.parse(body)
      const ip = await getClientIP()

      // Check slug uniqueness
      const existing = await prisma.plan.findUnique({ where: { slug: data.slug } })
      if (existing) {
        return NextResponse.json({ error: 'Ya existe un plan con este slug.' }, { status: 409 })
      }

      const plan = await prisma.plan.create({ data })

      await createAuditLog({
        userId: session.user.id,
        action: 'PLAN_CREATED',
        resource: 'plan',
        resourceId: plan.id,
        result: 'SUCCESS',
        details: { name: plan.name },
        ip,
      })

      return NextResponse.json({ plan }, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Datos inválidos.', details: error.errors }, { status: 400 })
      }
      throw error
    }
  }, 'MANAGER')
}
