'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUser({ roles, businesses }: { roles: any[], businesses: any[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      if (!res.ok) throw new Error(await res.text())
      
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md"
      >
        Nuevo Usuario +
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-black dark:hover:text-white">✕</button>
            <h2 className="font-heading text-2xl font-bold mb-6 text-gray-900 dark:text-white">Crear Usuario</h2>
            
            <form onSubmit={onSubmit} className="flex flex-col gap-4 font-mono text-xs">
              <label className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-gray-500 font-bold">Nombre Completo</span>
                <input name="name" required className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
              </label>
              
              <label className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-gray-500 font-bold">Email</span>
                <input type="email" name="email" required className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-gray-500 font-bold">Contraseña</span>
                <input type="text" name="password" placeholder="Opcional (default: defaultPassword123)" className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="uppercase tracking-widest text-gray-500 font-bold">Rol Global</span>
                <select name="roleId" required className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white appearance-none">
                  <option value="">Seleccionar rol...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - {r.label}</option>
                  ))}
                </select>
              </label>

              <hr className="border-gray-200 dark:border-white/10 my-2" />
              
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Asignar a Ecosistema (Opcional)</h3>

              <div className="flex gap-2 w-full">
                <label className="flex flex-col gap-1 flex-1">
                  <span className="uppercase tracking-widest text-gray-500 font-bold">Página / Negocio</span>
                  <select name="businessId" className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white appearance-none">
                    <option value="">Ninguno</option>
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </label>
                
                <label className="flex flex-col gap-1 flex-1">
                  <span className="uppercase tracking-widest text-gray-500 font-bold">Cargo / Rol</span>
                  <select name="businessRole" className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 text-gray-900 dark:text-white appearance-none">
                    <option value="OWNER">Propietario</option>
                    <option value="MANAGER">Manager</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </label>
              </div>

              <button disabled={loading} className="mt-4 bg-blue-600 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
