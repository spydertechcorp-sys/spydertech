// app/api/auth/register/route.ts — User Registration API
// Creates new user with email verification

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/security'
import { createAuditLog } from '@/lib/audit'
import { checkRateLimit, getClientIP } from '@/lib/security'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIP()

    // Rate limit: 5 registrations per 5 minutes per IP
    if (!checkRateLimit(`register:${ip}`, 5)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera unos minutos.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const data = schema.parse(body)

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este correo electrónico.' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        phone: data.phone,
        status: 'ACTIVE',
      },
    })

    // Audit log
    await createAuditLog({
      userId: user.id,
      action: 'USER_CREATED',
      resource: 'user',
      resourceId: user.id,
      result: 'SUCCESS',
      ip,
    })

    return NextResponse.json(
      { message: 'Cuenta creada exitosamente.' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos.', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[Register]', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
