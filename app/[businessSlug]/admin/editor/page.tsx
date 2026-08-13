import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import EditorInterface from '@/components/tenant/EditorInterface'

export default async function TenantEditorPage({ params }: { params: { businessSlug: string } }) {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      categories: {
        include: { products: true }
      }
    }
  })

  if (!business) redirect('/not-found')

  return <EditorInterface business={business} />
}
