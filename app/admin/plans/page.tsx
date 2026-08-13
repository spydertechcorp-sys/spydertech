export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: 'asc' }
  })

  return (
    <div className="w-full">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
          Gestión de Negocio
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
          Planes y Pricing
        </h1>
      </header>

      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6 mb-6">
          <h2 className="font-heading text-2xl font-bold">Planes Activos</h2>
          <button className="font-bold text-xs uppercase tracking-widest bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md">
            + Nuevo Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white/50 dark:bg-black/50 border border-white/40 dark:border-white/10 rounded-2xl p-6 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="font-heading text-xl font-bold mb-2">{plan.name}</h3>
              <p className="font-mono text-sm opacity-70 mb-4">{plan.description}</p>
              <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-end">
                <span className="font-heading font-bold text-2xl">${plan.price.toLocaleString()}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 px-2 py-1 bg-black/5 dark:bg-white/10 rounded-md">
                  MENSUAL
                </span>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full border border-white/40 dark:border-white/10 border-dashed rounded-2xl p-16 text-center">
              <p className="font-mono text-[11px] uppercase tracking-widest opacity-50">No hay planes registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
