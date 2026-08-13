export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db'
import CreateUser from '@/components/admin/CreateUser'
import EditUser from '@/components/admin/EditUser'

export default async function AdminUsersPage() {
  const [users, roles, businesses] = await Promise.all([
    prisma.user.findMany({
      include: {
        role: true,
        businesses: {
          include: { business: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.role.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.business.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-2">Usuarios</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Gestión global de personas en el sistema</p>
        </div>
        <CreateUser roles={roles} businesses={businesses} />
      </div>

      <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-transparent">
              <th className="p-6 font-semibold">Usuario</th>
              <th className="p-6 font-semibold">Rol Global</th>
              <th className="p-6 font-semibold">Ecosistemas Asignados</th>
              <th className="p-6 font-semibold">Estado</th>
              <th className="p-6 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-6 text-gray-900 dark:text-white">
                  <div className="font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      {user.name}
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 lowercase font-body">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="border border-gray-200 dark:border-white/20 rounded-md px-2 py-1 font-bold">
                    {user.role?.name || 'USER'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.businesses.length > 0 ? (
                      user.businesses.map(bm => (
                        <span key={bm.id} className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[10px]">
                          {bm.business.name} ({bm.role})
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Ninguno</span>
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-2 py-1 flex w-max items-center gap-2 ${user.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-600 dark:bg-green-400' : 'bg-red-500'}`} />
                    {user.status}
                  </span>
                </td>
                <td className="p-6 text-right space-x-4 font-bold">
                  <EditUser user={user} roles={roles} businesses={businesses} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
