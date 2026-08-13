import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIP } from '@/lib/security'

const orderSchema = z.object({
  businessId: z.string().min(1),
  type: z.enum(['WHATSAPP', 'DINE_IN', 'DELIVERY']).default('WHATSAPP'),
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(30),
})

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIP()
    if (!checkRateLimit(`order:${ip}`, 12)) return NextResponse.json({ error: 'Demasiados pedidos. Intenta nuevamente en un momento.' }, { status: 429 })
    const input = orderSchema.parse(await request.json())
    const products = await prisma.product.findMany({ where: { businessId: input.businessId, id: { in: input.items.map(item => item.productId) }, isAvailable: true } })
    if (products.length !== new Set(input.items.map(item => item.productId)).size) return NextResponse.json({ error: 'Uno o más productos ya no están disponibles.' }, { status: 409 })
    const byId = new Map(products.map(product => [product.id, product]))
    const items = input.items.map(item => {
      const product = byId.get(item.productId)!
      return { productId: product.id, name: product.name, price: product.price, quantity: item.quantity, total: product.price * item.quantity }
    })
    const order = await prisma.order.create({ data: { businessId: input.businessId, type: input.type, customerName: input.customerName, customerPhone: input.customerPhone, notes: input.notes, total: items.reduce((sum, item) => sum + item.total, 0), items: { create: items } }, select: { id: true, orderNumber: true, total: true } })
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Datos de pedido inválidos.' }, { status: 400 })
    console.error('[ORDER_CREATE]', error)
    return NextResponse.json({ error: 'No fue posible registrar el pedido.' }, { status: 500 })
  }
}
