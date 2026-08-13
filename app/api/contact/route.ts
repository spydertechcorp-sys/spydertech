// app/api/contact/route.ts — Contact form / Lead capture API
// Creates lead in DB and notifies team

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendNewLeadNotification } from '@/lib/email'
import { checkRateLimit, getClientIP } from '@/lib/security'
import { z } from 'zod'

const schema = z.object({
  name:         z.string().min(2).max(100),
  company:      z.string().max(100).optional(),
  email:        z.string().email(),
  phone:        z.string().optional(),
  whatsapp:     z.string().optional(),
  city:         z.string().optional(),
  businessType: z.string().optional(),
  needs:        z.string().optional(),
  budget:       z.string().optional(),
  message:      z.string().max(2000).optional(),
  plan:         z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIP()

    // Rate limit: 3 contact submissions per 10 minutes per IP
    if (!checkRateLimit(`contact:${ip}`, 3)) {
      return NextResponse.json(
        { error: 'Demasiados envíos. Espera unos minutos.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const data = schema.parse(body)

    // En SpyderTech V2 los contactos se envían directo a correo o CRM externo
    console.log('[NUEVO LEAD ELITE]:', data)

    // Send email notification to team (non-blocking)
    const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@spydertech.online'
    sendNewLeadNotification(adminEmail, {
      name: data.name,
      email: data.email,
      company: data.company,
      needs: data.needs,
      budget: data.budget,
    }).catch(console.error)

    return NextResponse.json(
      {
        message: '¡Recibimos tu solicitud! Nos pondremos en contacto contigo en menos de 24 horas.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos.', details: error.errors }, { status: 400 })
    }
    console.error('[Contact]', error)
    return NextResponse.json({ error: 'Error interno. Intenta de nuevo.' }, { status: 500 })
  }
}
