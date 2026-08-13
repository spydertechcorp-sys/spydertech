import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  return withAuth(req, async (req) => {
    try {
      const body = await req.json()
      
      const user = await prisma.user.update({
        where: { id: params.userId },
        data: {
          name: body.name,
          email: body.email,
          roleId: body.roleId,
          status: body.status,
          ...(body.password && { passwordHash: body.password })
        }
      })

      if (body.businessId) {
        // Upsert or create business member relationship
        await prisma.businessMember.upsert({
          where: {
            userId_businessId: {
              userId: user.id,
              businessId: body.businessId
            }
          },
          update: {
            role: body.businessRole || 'STAFF'
          },
          create: {
            userId: user.id,
            businessId: body.businessId,
            role: body.businessRole || 'STAFF'
          }
        })
      }

      await createAuditLog({
        userId: (req as any).user.id,
        action: 'UPDATE_USER',
        resource: 'User',
        resourceId: user.id,
        details: { message: `Updated user ${user.email}` },
      })

      return NextResponse.json({ user })
    } catch (error) {
      console.error('[UPDATE_USER_ERROR]', error)
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
  }, 'SUPER_ADMIN')
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  return withAuth(req, async (req) => {
    try {
      if ((req as any).user.id === params.userId) {
        return NextResponse.json({ error: 'No puedes eliminar tu propio usuario' }, { status: 400 })
      }

      await prisma.user.delete({
        where: { id: params.userId }
      })

      await createAuditLog({
        userId: (req as any).user.id,
        action: 'DELETE_USER',
        resource: 'User',
        resourceId: params.userId,
        details: `Deleted user ${params.userId}`,
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('[DELETE_USER_ERROR]', error)
      return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
    }
  }, 'SUPER_ADMIN')
}
