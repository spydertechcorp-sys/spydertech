import { prisma } from '@/lib/db'
import Link from 'next/link'
import CreateBusiness from '@/components/admin/CreateBusiness'

export default async function AdminBusinessesPage() {
  const [businesses, owners, plans] = await Promise.all([prisma.business.findMany({
    include: {
      plan: true,
      owner: true,
      _count: {
        select: {
          products: true,
          orders: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }), prisma.user.findMany({select:{id:true,name:true,email:true},orderBy:{name:'asc'}}), prisma.plan.findMany({where:{isActive:true},select:{id:true,name:true}})])

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter text-white mb-2">Ecosistemas</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-text">Gestión global de tenants</p>
        </div>
        <CreateBusiness owners={owners} plans={plans} />
      </div>

      <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-transparent">
              <th className="p-6 font-semibold">Negocio</th>
              <th className="p-6 font-semibold">Propietario</th>
              <th className="p-6 font-semibold">Plan</th>
              <th className="p-6 font-semibold">Estado</th>
              <th className="p-6 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {businesses.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-6 text-gray-900 dark:text-white">
                  <div className="font-bold">{biz.name}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">/{biz.slug}</div>
                </td>
                <td className="p-6">
                  {biz.owner?.name || 'Sin Asignar'}
                  <div className="text-[10px] lowercase text-gray-500 dark:text-gray-400 mt-1">{biz.owner?.email}</div>
                </td>
                <td className="p-6">
                  <span className="border border-gray-200 dark:border-white/20 rounded-md px-2 py-1">{biz.plan?.name || 'FREE'}</span>
                </td>
                <td className="p-6">
                  <span className={`px-2 py-1 flex w-max items-center gap-2 ${biz.status === 'ACTIVE' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${biz.status === 'ACTIVE' ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-500'}`} />
                    {biz.status}
                  </span>
                </td>
                <td className="p-6 text-right space-x-4 font-bold">
                  <Link href={`/${biz.slug}`} target="_blank" className="hover:text-blue-600 dark:hover:text-white transition-colors">Visitar</Link>
                  <Link href={`/${biz.slug}/admin`} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin</Link>
                </td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">No hay ecosistemas registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
