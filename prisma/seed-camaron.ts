import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  let owner = await prisma.user.findFirst()
  let plan = await prisma.plan.findFirst()

  if (!owner) {
    owner = await prisma.user.create({ data: { name: 'Admin', email: 'admin@mr.com', emailVerified: new Date(), role: { connect: { name: 'OWNER' } } } })
  }
  if (!plan) {
    plan = await prisma.plan.create({ data: { name: 'Pro', slug: 'pro', price: 0 } })
  }

  await prisma.business.deleteMany({ where: { slug: 'mr-camaron' } })

  const business = await prisma.business.create({
    data: {
      name: 'Mr. Camarón',
      slug: 'mr-camaron',
      planId: plan.id,
      ownerId: owner.id,
      status: 'ACTIVE',
      theme: 'MODERN',
      primaryColor: '#ff4500', // Naranja Tropical
      logo: '/demo/mr-camaron-logo.png', // Placeholder
      description: 'Coctelería y sabores explosivos. La mejor experiencia tropical de la ciudad.',
    }
  })

  // Crear categorías
  const cCocteles = await prisma.category.create({ data: { name: 'Cócteles', slug: 'cocteles', businessId: business.id } })
  const cBebidas = await prisma.category.create({ data: { name: 'Bebidas', slug: 'bebidas', businessId: business.id } })
  const cParaCompartir = await prisma.category.create({ data: { name: 'Para Compartir', slug: 'para-compartir', businessId: business.id } })
  const cPostres = await prisma.category.create({ data: { name: 'Postres', slug: 'postres', businessId: business.id } })

  // Crear Productos
  await prisma.product.create({
    data: {
      name: 'Cóctel Estrella',
      slug: 'coctel-estrella',
      description: 'Nuestro cóctel insignia. Sabor inigualable tropical.',
      price: 15000,
      businessId: business.id,
      categoryId: cCocteles.id,
      image: '/demo/coctel_estrella.jpg'
    }
  })

  await prisma.product.create({
    data: {
      name: 'Bebida con Cerveza',
      slug: 'bebida-cerveza',
      description: 'Refrescante mezcla con cerveza fría.',
      price: 18000,
      businessId: business.id,
      categoryId: cBebidas.id,
    }
  })

  await prisma.product.create({
    data: {
      name: 'Sabores Explosivos',
      slug: 'sabores-explosivos',
      description: 'Nuestra famosa bandeja tropical. Mezcla de frutas, gomitas y sabores picantes y dulces.',
      price: 20000,
      businessId: business.id,
      categoryId: cParaCompartir.id,
      image: '/demo/bandeja_explosiva.jpg'
    }
  })

  await prisma.product.create({
    data: {
      name: 'Oblea',
      slug: 'oblea',
      description: 'Oblea tradicional con arequipe.',
      price: 2500,
      businessId: business.id,
      categoryId: cPostres.id,
    }
  })

  console.log('Mr. Camarón sembrado con éxito.')
}

seed().catch(console.error).finally(() => prisma.$disconnect())
