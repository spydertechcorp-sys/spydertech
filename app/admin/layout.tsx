import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import Link from 'next/link'
import SpyderSymbol from '@/components/SpyderSymbol'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  if (!session?.user) redirect('/login?redirect=/admin')
  
  const role = String((session.user as any).role).toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') redirect('/unauthorized')

  return (
    <div className="relative min-h-screen w-full bg-[#f3f6fd] dark:bg-[#0c1015] text-[#1f2937] dark:text-[#f3f4f6] font-body flex items-center justify-center overflow-hidden transition-colors duration-500">
      
      {/* ─── ANIMATED BACKGROUND BLOBS (CodePen Style) ─── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-[blob_10s_infinite_alternate]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-[blob_12s_infinite_alternate-reverse]" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-[blob_14s_infinite_alternate]" />

      {/* ─── GLASS WINDOW APP CONTAINER ─── */}
      <div className="relative z-10 w-[95vw] h-[90vh] max-w-7xl bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex overflow-hidden">
        
        {/* ─── SIDEBAR ─── */}
        <aside className="w-64 flex-shrink-0 border-r border-black/5 dark:border-white/5 bg-white/30 dark:bg-white/5 flex flex-col">
          <Link href="/admin" className="px-6 py-6 border-b border-black/5 dark:border-white/5 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
            <SpyderSymbol size={24} color="#2563eb" className="group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold tracking-tight">SPYDERTECH</span>
              <small className="font-mono text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400">Headquarters</small>
            </div>
          </Link>
          
          <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
            <Link href="/admin" className="px-4 py-3 rounded-xl font-bold text-sm text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm transition-all flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Dashboard
            </Link>
            <Link href="/admin/businesses" className="px-4 py-3 rounded-xl font-bold text-sm text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm transition-all flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Ecosistemas
            </Link>
            <Link href="/admin/users" className="px-4 py-3 rounded-xl font-bold text-sm text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm transition-all flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Usuarios
            </Link>
            <Link href="/admin/plans" className="px-4 py-3 rounded-xl font-bold text-sm text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm transition-all flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Planes
            </Link>
            <LogoutButton />
          </nav>
          
          <div className="p-6 border-t border-black/5 dark:border-white/5 flex items-center gap-3 bg-white/20 dark:bg-black/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400 leading-tight">
              Todos los sistemas<br/>operando
            </span>
          </div>
        </aside>

        {/* ─── MAIN STAGE ─── */}
        <section className="flex-1 flex flex-col min-w-0 bg-white/30 dark:bg-black/20 relative z-20">
          <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-8 bg-white/50 dark:bg-black/30 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
              <span className="opacity-50">Control Global /</span> <span>{role}</span>
            </span>
            <Link href="/" className="font-bold text-xs uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-md">
              Ver ecosistema ↗
            </Link>
          </header>
          <main className="flex-1 overflow-y-auto p-8 md:p-10">
            {children}
          </main>
        </section>

      </div>
    </div>
  )
}
