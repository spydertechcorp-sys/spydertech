import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import DigitalMenu from '@/components/tenant/DigitalMenu'
import { CartProvider } from '@/components/tenant/CartEngine'

export default async function TenantMenuPage({ params }: { params: { businessSlug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      categories: {
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      }
    }
  })

  if (!business) {
    redirect('/not-found')
  }

  return (
    <main className="min-h-screen bg-black-deep text-white-off">
      <CartProvider business={business}>
        <DigitalMenu business={business} categories={business.categories} />
      </CartProvider>
    </main>
  )
}
