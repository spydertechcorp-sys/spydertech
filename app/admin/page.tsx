import { prisma } from '@/lib/db'
import Link from 'next/link'
import { TeamWidget, PlansWidget } from '@/components/admin/DashboardWidgets'

export default async function SuperAdminPage() {
  const [businessesCount, usersCount, activeCount, businesses] = await Promise.all([
    prisma.business.count(),
    prisma.user.count(),
    prisma.business.count({ where: { status: 'ACTIVE' } }),
    prisma.business.findMany({ 
      take: 8, 
      orderBy: { createdAt: 'desc' },
      include: { owner: true, plan: true }
    })
  ])

  return (
    <div className="w-full">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa] mb-3">
          Vista General / En Tiempo Real
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight text-[#ededed]">
          El sistema <span className="text-[#a1a1aa] italic">está despierto.</span>
        </h1>
      </header>

      {/* ─── METRICS ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Ecosistemas</span>
          <strong className="font-heading text-4xl font-bold tracking-tighter mb-1 text-gray-900 dark:text-white">{businessesCount}</strong>
          <span className="font-body text-xs text-gray-500 dark:text-gray-400">Negocios registrados</span>
        </div>
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Operando</span>
          <strong className="font-heading text-4xl font-bold tracking-tighter mb-1 text-gray-900 dark:text-white">{activeCount}</strong>
          <span className="font-body text-xs text-gray-500 dark:text-gray-400">Publicados y activos</span>
        </div>
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Personas</span>
          <strong className="font-heading text-4xl font-bold tracking-tighter mb-1 text-gray-900 dark:text-white">{usersCount}</strong>
          <span className="font-body text-xs text-gray-500 dark:text-gray-400">Usuarios en la plataforma</span>
        </div>
      </section>

      {/* ─── FEED ─── */}
      <section className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-sm">
        <div className="flex items-end justify-between border-b border-black/5 dark:border-white/10 pb-6 mb-6">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Actividad Reciente</span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Nuevos Ecosistemas</h2>
          </div>
          <Link href="/admin/businesses" className="font-bold text-xs uppercase tracking-widest bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md">
            Gestionar →
          </Link>
        </div>

        {businesses.length ? (
          <div className="flex flex-col gap-2">
            {businesses.map(b => (
              <Link 
                key={b.id} 
                href={`/${b.slug}/admin`} 
                className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-center p-4 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors group border border-transparent hover:border-white/40 dark:hover:border-white/10"
              >
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-gray-900 dark:text-white">{b.name}</span>
                  <small className="font-mono text-[10px] text-gray-500 dark:text-gray-400">/{b.slug}</small>
                </div>
                <span className="font-body text-sm opacity-80 text-gray-900 dark:text-gray-200">{b.owner?.name || 'Sin propietario'}</span>
                <span className="font-body text-sm opacity-80 text-gray-900 dark:text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {b.plan?.name || 'Sin plan'}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full ${b.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-black/10 dark:border-white/10'}`}>
                    {b.status}
                  </span>
                  <span className="font-mono text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-white/40 dark:border-white/10 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center bg-white/20 dark:bg-black/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20 mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <p className="font-mono text-[11px] uppercase tracking-widest opacity-50 mb-2">No hay datos</p>
            <p className="font-body text-sm opacity-70">Todavía no existen ecosistemas en la plataforma.</p>
          </div>
        )}
      </section>

      {/* ─── EXTRA WIDGETS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamWidget />
        <PlansWidget />
      </div>
    </div>
  )
}
