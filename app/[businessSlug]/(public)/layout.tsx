import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'

export async function generateMetadata({ params }: { params: { businessSlug: string } }): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { slug: params.businessSlug }, select: { name: true, description: true, coverImage: true, updatedAt: true, status: true } })
  if (!business || business.status !== 'ACTIVE') return { robots: { index: false, follow: false } }
  return { title: business.name, description: business.description || `Conoce ${business.name} y realiza tu pedido.`, alternates: { canonical: `/${params.businessSlug}` }, openGraph: { title: business.name, description: business.description || undefined, images: business.coverImage ? [business.coverImage] : undefined, type: 'website' } }
}

export default function TenantPublicLayout({ children }: { children: ReactNode }) {
  // We keep this layout clean. The public theme (CSS variables, fonts) 
  // will be injected at the page level based on the Business settings.
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      {children}
    </div>
  )
}
