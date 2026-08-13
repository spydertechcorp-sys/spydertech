import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const businessUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(), description: z.string().max(1000).nullable().optional(),
  introText: z.string().max(240).nullable().optional(), videoUrl: z.string().url().nullable().optional(),
  logo: z.string().url().nullable().optional(), coverImage: z.string().url().nullable().optional(),
  whatsapp: z.string().max(40).nullable().optional(), address: z.string().max(240).nullable().optional(),
  instagram: z.string().url().nullable().optional(), primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), theme: z.enum(['MODERN','CINEMATIC','LUXURY','NEON','MINIMAL','STREET','PLAYFUL']).optional(),
  animationLevel: z.enum(['MINIMAL','BALANCED','CINEMATIC']).optional(), introEnabled: z.boolean().optional(), status: z.enum(['DRAFT','SETUP','ACTIVE','SUSPENDED','EXPIRED']).optional()
})

export async function PATCH(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = businessUpdateSchema.parse(await request.json())

    // 1. Verificación Estricta de Tenant
    const isSuperAdmin = (session.user as any).role === 'SUPER_ADMIN'
    
    let isMember = false
    if (!isSuperAdmin) {
      const membership = await prisma.businessMember.findFirst({
        where: {
          userId: session.user.id,
          businessId: params.businessId
        }
      })
      isMember = !!membership
    }

    if (!isMember && !isSuperAdmin) {
      return NextResponse.json({ error: 'Acceso Denegado. Violación de Tenant Isolation.' }, { status: 403 })
    }

    // 2. Actualización en DB
    const updatedBusiness = await prisma.business.update({
      where: { id: params.businessId },
      data: {
        ...body
      }
    })

    return NextResponse.json(updatedBusiness)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
    console.error('[BUSINESS_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
