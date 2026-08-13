import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando siembra de base de datos...')

  // Limpiar base de datos
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.businessMember.deleteMany()
  await prisma.business.deleteMany()
  await prisma.user.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.role.deleteMany()

  // 1. Roles y Planes
  const ownerRole = await prisma.role.create({
    data: { name: 'OWNER', label: 'Propietario', isSystem: true }
  })

  const superAdminRole = await prisma.role.create({
    data: { name: 'SUPER_ADMIN', label: 'Super Administrador', isSystem: true }
  })

  const planCrecimiento = await prisma.plan.create({
    data: {
      name: 'Crecimiento',
      slug: 'crecimiento',
      description: 'El plan definitivo para escalar',
      price: 1200000,
      currency: 'COP',
      isActive: true,
      isPopular: true
    }
  })

  // 2. Usuarios
  const hash = await bcrypt.hash('password123', 10)

  const pepito = await prisma.user.create({
    data: {
      name: 'Pepito Pérez',
      email: 'pepito@gmail.com',
      passwordHash: hash,
      roleId: ownerRole.id,
      emailVerified: new Date()
    }
  })

  const sushiOwner = await prisma.user.create({
    data: {
      name: 'Sr. Sushi',
      email: 'sushi@example.com',
      passwordHash: hash,
      roleId: ownerRole.id,
      emailVerified: new Date()
    }
  })

  const spyderAdmin = await prisma.user.create({
    data: {
      name: 'SpyderTech Admin',
      email: 'admin@spydertech.online',
      passwordHash: hash,
      roleId: superAdminRole.id,
      emailVerified: new Date()
    }
  })

  // 3. Negocios DEMO
  const pepitosBusiness = await prisma.business.create({
    data: {
      name: "Pepito's Fast Food (DEMO)",
      slug: 'pepitos',
      description: 'Las mejores hamburguesas de la ciudad.',
      introText: 'HECHO PARA COMER. DISEÑADO PARA RECORDAR.',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-burger-on-a-grill-5460/1080p.mp4',
      theme: 'STREET',
      status: 'ACTIVE',
      planId: planCrecimiento.id,
      ownerId: pepito.id,
      whatsapp: '573000000000'
    }
  })

  await prisma.businessMember.create({
    data: { userId: pepito.id, businessId: pepitosBusiness.id, role: 'OWNER' }
  })

  const sushiBusiness = await prisma.business.create({
    data: {
      name: 'Sushi House (DEMO)',
      slug: 'sushi',
      description: 'El verdadero sabor oriental.',
      introText: 'ARTE EN CADA CORTE.',
      theme: 'MINIMAL',
      status: 'ACTIVE',
      planId: planCrecimiento.id,
      ownerId: sushiOwner.id
    }
  })

  await prisma.businessMember.create({
    data: { userId: sushiOwner.id, businessId: sushiBusiness.id, role: 'OWNER' }
  })

  // 4. Categorías Pepito's
  const catHamburguesas = await prisma.category.create({
    data: { businessId: pepitosBusiness.id, name: 'Hamburguesas', slug: 'hamburguesas', sortOrder: 1 }
  })

  const catBebidas = await prisma.category.create({
    data: { businessId: pepitosBusiness.id, name: 'Bebidas', slug: 'bebidas', sortOrder: 2 }
  })

  // 5. Productos Pepito's
  await prisma.product.create({
    data: {
      businessId: pepitosBusiness.id,
      categoryId: catHamburguesas.id,
      name: 'La Monstruosa',
      slug: 'la-monstruosa',
      description: 'Doble carne angus, triple queso cheddar, tocineta crujiente y pan artesanal.',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop',
      isFeatured: true,
      badge: 'MÁS VENDIDA'
    }
  })

  await prisma.product.create({
    data: {
      businessId: pepitosBusiness.id,
      categoryId: catBebidas.id,
      name: 'Gaseosa Importada',
      slug: 'gaseosa',
      description: 'Refrescante bebida helada.',
      price: 8000,
    }
  })

  console.log('✅ Base de datos sembrada correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
