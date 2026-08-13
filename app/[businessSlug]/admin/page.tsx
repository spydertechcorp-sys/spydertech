import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TenantDashboard({ params }: { params: { businessSlug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      plan: true,
      _count: { select: { products: true, orders: true, categories: true } }
    }
  })
  if (!business) redirect('/not-found')
  
  const session = await getServerSession()
  const name = session?.user?.name?.split(' ')[0] || 'Equipo'
  const root = `/${params.businessSlug}/admin`

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto">
      
      {/* ─── HEADER ─── */}
      <header className="mb-16 relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-text mb-4">
          Resumen / Workspace
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
          Hola, {name}.<br/>
          <span className="text-gray-muted italic">Tu negocio está en línea.</span>
        </h1>
        
        <div className="mt-8">
          <Link href={`${root}/editor`} className="btn-primary">
            Abrir Live Preview →
          </Link>
        </div>
      </header>

      {/* ─── METRICS ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-border border border-gray-border mb-16">
        <div className="bg-white p-8 flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">Catálogo</span>
          <strong className="font-heading text-5xl font-medium tracking-tighter mb-2">{business._count.products}</strong>
          <small className="font-body text-sm text-gray-text">Productos publicados</small>
        </div>
        <div className="bg-white p-8 flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">Pedidos</span>
          <strong className="font-heading text-5xl font-medium tracking-tighter mb-2">{business._count.orders}</strong>
          <small className="font-body text-sm text-gray-text">Órdenes registradas</small>
        </div>
        <div className="bg-white p-8 flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">Estructura</span>
          <strong className="font-heading text-5xl font-medium tracking-tighter mb-2">{business._count.categories}</strong>
          <small className="font-body text-sm text-gray-text">Categorías activas</small>
        </div>
      </section>

      {/* ─── QUICK ACTIONS ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link href={`${root}/products`} className="group block border border-gray-border bg-white p-8 hover:border-black-deep hover:shadow-sm transition-all">
          <small className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">01 / Contenido</small>
          <h2 className="font-heading text-2xl font-medium mb-3">Productos y precios</h2>
          <p className="text-sm text-gray-text mb-8">Edita fotografías, precios y descripciones de lo que ofreces.</p>
          <div className="font-mono text-sm text-accent group-hover:translate-x-1 transition-transform w-fit">→</div>
        </Link>
        
        <Link href={`${root}/menu`} className="group block border border-gray-border bg-ivory p-8 hover:border-black-deep hover:bg-white transition-all">
          <small className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">02 / Experiencia</small>
          <h2 className="font-heading text-2xl font-medium mb-3">Ordena tu menú</h2>
          <p className="text-sm text-gray-text mb-8">Da forma al recorrido visual de elección de tu cliente.</p>
          <div className="font-mono text-sm text-black-deep group-hover:translate-x-1 transition-transform w-fit">→</div>
        </Link>
        
        <Link href={`${root}/settings`} className="group block border border-gray-border bg-white p-8 hover:border-black-deep hover:shadow-sm transition-all">
          <small className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-6">03 / Identidad</small>
          <h2 className="font-heading text-2xl font-medium mb-3">Ajustes Generales</h2>
          <p className="text-sm text-gray-text mb-8">Colores, logo, tipografía y horarios de atención.</p>
          <div className="font-mono text-sm text-accent group-hover:translate-x-1 transition-transform w-fit">→</div>
        </Link>

      </section>

    </div>
  )
}
