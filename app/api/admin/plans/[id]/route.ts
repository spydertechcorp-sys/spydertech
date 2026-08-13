// app/api/admin/plans/[id]/route.ts — Admin Plan by ID API
// GET: Get plan | PATCH: Update plan | DELETE: Delete plan

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
import { getClientIP } from '@/lib/security'
import { z } from 'zod'

const updateSchema = z.object({
  name:        z.string().min(2).max(100).optional(),
  slug:        z.string().min(2).max(100).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(2000).optional(),
  price:       z.number().min(0).optional(),
  currency:    z.string().optional(),
  isPopular:   z.boolean().optional(),
  isActive:    z.boolean().optional(),
  features:    z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async () => {
    const plan = await prisma.plan.findUnique({
      where: { id: params.id },
    })
    if (!plan) return NextResponse.json({ error: 'Plan no encontrado.' }, { status: 404 })
    return NextResponse.json({ plan })
  }, 'MANAGER')
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (req, session) => {
    try {
      const body = await req.json()
      const data = updateSchema.parse(body)
      const ip = await getClientIP()

      const plan = await prisma.plan.update({
        where: { id: params.id },
        data,
      })

      await createAuditLog({
        userId: session.user.id,
        action: 'PLAN_UPDATED',
        resource: 'plan',
        resourceId: plan.id,
        result: 'SUCCESS',
        details: { changes: Object.keys(data) },
        ip,
      })

      return NextResponse.json({ plan })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Datos inválidos.', details: error.errors }, { status: 400 })
      }
      throw error
    }
  }, 'MANAGER')
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, async (req, session) => {
    const ip = await getClientIP()

    // Check if plan has active businesses
    const businessesCount = await prisma.business.count({ where: { planId: params.id } })
    if (businessesCount > 0) {
      return NextResponse.json({ error: 'No se puede eliminar un plan con ecosistemas activos.' }, { status: 409 })
    }

    await prisma.plan.delete({ where: { id: params.id } })

    await createAuditLog({
      userId: session.user.id,
      action: 'PLAN_DELETED',
      resource: 'plan',
      resourceId: params.id,
      result: 'SUCCESS',
      ip,
    })

    return NextResponse.json({ message: 'Plan eliminado.' })
  }, 'ADMIN')
}
