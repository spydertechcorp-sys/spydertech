import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import ProfileMenu from '@/components/ProfileMenu'

export default async function TenantAdminLayout({ children, params }: { children: ReactNode, params: { businessSlug: string } }) {
  const session = await getServerSession()
  if (!session?.user) redirect(`/login?redirect=/${params.businessSlug}/admin`)
  
  const business = await prisma.business.findUnique({ 
    where: { slug: params.businessSlug }, 
    include: { members: { where: { userId: session.user.id } } } 
  })
  if (!business) redirect('/not-found')
  if (!business.members.length && (session.user as any).role !== 'SUPER_ADMIN') redirect('/unauthorized')
  
  const root = `/${params.businessSlug}/admin`

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0c1015] text-gray-900 dark:text-gray-100 font-body selection:bg-accent/20 selection:text-accent transition-colors duration-500">
      
      {/* ─── SIDEBAR (CMS STYLE) ─── */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 flex flex-col h-screen sticky top-0 backdrop-blur-md">
        <Link href={root} className="px-6 py-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3 hover:bg-white dark:hover:bg-white/5 transition-colors">
          <span className="font-heading font-bold text-xl leading-none text-accent">✦</span>
          <div className="flex flex-col">
            <b className="font-heading text-sm font-semibold truncate max-w-[160px]">{business.name}</b>
            <small className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Owner Workspace</small>
          </div>
        </Link>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          <Link href={root} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Resumen
          </Link>
          <Link href={`${root}/editor`} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Live Preview (Editor)
          </Link>
          <div className="my-4 border-t border-gray-200 dark:border-white/10 mx-2" />
          <Link href={`${root}/menu`} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Categorías
          </Link>
          <Link href={`${root}/products`} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Productos
          </Link>
          <Link href={`${root}/promotions`} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Promociones
          </Link>
          <div className="my-4 border-t border-gray-200 dark:border-white/10 mx-2" />
          <Link href={`${root}/settings`} className="px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors hover:shadow-sm">
            Configuración
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/40">
          <Link 
            href={`/${params.businessSlug}`} 
            target="_blank" 
            className="flex items-center justify-between px-4 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-widest text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/20"
          >
            Ver Experiencia ↗
          </Link>
        </div>
      </aside>

      {/* ─── MAIN STAGE ─── */}
      <section className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0c1015]">
        <header className="h-16 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0c1015]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(203,162,88,0.8)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Estado: <b className="text-gray-900 dark:text-white">{business.status}</b>
            </span>
          </div>
          <ProfileMenu user={session.user} />
        </header>
        <main className="flex-1 overflow-x-hidden p-8">
          {children}
        </main>
      </section>

    </div>
  )
}
