import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const staticRoutes = ['', '/soluciones', '/productos', '/planes', '/blog'].map(path => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1 : .8 }))
  const businesses = await prisma.business.findMany({ where: { status: 'ACTIVE' }, select: { slug: true, updatedAt: true } })
  return [...staticRoutes, ...businesses.flatMap(business => [{ url: `${base}/${business.slug}`, lastModified: business.updatedAt, changeFrequency: 'daily' as const, priority: .9 }, { url: `${base}/${business.slug}/menu`, lastModified: business.updatedAt, changeFrequency: 'daily' as const, priority: .8 }])]
}
