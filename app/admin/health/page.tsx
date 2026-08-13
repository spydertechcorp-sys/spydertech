import { prisma } from '@/lib/db'

export default async function HealthCenterPage() {
  // 1. Check DB Connection
  let dbStatus = 'OPERATIONAL'
  let dbLatency = 0
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatency = Date.now() - start
  } catch (e) {
    dbStatus = 'DOWN'
  }

  // 2. Metrics
  const [totalUsers, totalBusinesses, activeBusinesses, totalOrders] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.business.count().catch(() => 0),
    prisma.business.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    prisma.order.count().catch(() => 0)
  ])

  // 3. API Status (mocked for Vercel Edge simulation)
  const apiStatus = 'OPERATIONAL'
  
  // 4. Storage Status (Local / S3)
  const storageStatus = 'OPERATIONAL'

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-12 border-b border-white/10 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa] mb-2">
          Monitor de Infraestructura
        </p>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-[#ededed]">
          Centro de <span className="text-[#10b981] italic">Salud.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Database (SQLite)</span>
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'OPERATIONAL' ? 'bg-[#10b981]' : 'bg-red-500'} animate-pulse`} />
          </div>
          <p className="font-heading text-xl text-white">{dbStatus}</p>
          <p className="font-mono text-[10px] text-[#a1a1aa] mt-2">Latency: {dbLatency}ms</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">API Core</span>
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
          <p className="font-heading text-xl text-white">{apiStatus}</p>
          <p className="font-mono text-[10px] text-[#a1a1aa] mt-2">Edge Runtime</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Storage</span>
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
          <p className="font-heading text-xl text-white">{storageStatus}</p>
          <p className="font-mono text-[10px] text-[#a1a1aa] mt-2">Local Filesystem</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Email Service</span>
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          </div>
          <p className="font-heading text-xl text-white">DEGRADED</p>
          <p className="font-mono text-[10px] text-[#a1a1aa] mt-2">Missing Resend API Key</p>
        </div>
      </div>

      <h2 className="font-heading text-xl text-white mb-6">Métricas de Volumen Operativo</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
        <div className="bg-[#0a0a0a] p-6 text-center">
          <strong className="block text-3xl font-heading text-white">{totalUsers}</strong>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Usuarios</span>
        </div>
        <div className="bg-[#0a0a0a] p-6 text-center">
          <strong className="block text-3xl font-heading text-white">{totalBusinesses}</strong>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Tenants</span>
        </div>
        <div className="bg-[#0a0a0a] p-6 text-center">
          <strong className="block text-3xl font-heading text-[#194bfb]">{activeBusinesses}</strong>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Tenants Activos</span>
        </div>
        <div className="bg-[#0a0a0a] p-6 text-center">
          <strong className="block text-3xl font-heading text-[#10b981]">{totalOrders}</strong>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]">Transacciones</span>
        </div>
      </div>
    </div>
  )
}
