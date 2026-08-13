// app/api/analytics/route.ts — Analytics event tracking
// Records user events for dashboard analytics

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { getClientIP } from '@/lib/security'
import { z } from 'zod'

const schema = z.object({
  event: z.enum([
    'page_view', 'plan_view', 'product_view', 'cta_click',
    'menu_open', 'whatsapp_click', 'form_started', 'form_submitted',
    'checkout_started', 'purchase', 'plan_cta_click',
  ]),
  page: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const session = await auth()
    const ip = await getClientIP()

    // Don't track internal/admin traffic
    const userRole = (session?.user as any)?.role
    if (['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ ok: true })
    }

    // En SpyderTech V2 la analítica se maneja a nivel tenant en el dashboard
    // No usamos AnalyticsEvent global
    console.log(`[ANALYTICS] ${data.event} - ${data.page}`)

    return NextResponse.json({ ok: true })
  } catch {
    // Analytics failures should be silent
    return NextResponse.json({ ok: true })
  }
}
