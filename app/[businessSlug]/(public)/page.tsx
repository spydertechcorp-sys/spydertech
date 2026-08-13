import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import CinematicExperience from '@/components/tenant/CinematicExperience'

export default async function TenantPublicPage({ params }: { params: { businessSlug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      },
      menus: true
    }
  })

  if (!business || business.status === 'SUSPENDED') {
    notFound()
  }

  // Filter out empty categories for the view
  const activeCategories = business.categories.filter(c => c.products.length > 0)

  return (
    <CinematicExperience 
      business={business} 
      menu={business.menus[0]} 
      categories={activeCategories} 
    />
  )
}
