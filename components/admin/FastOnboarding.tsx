'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FastOnboarding({ plans, ownerRoleId }: { plans: any[], ownerRoleId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    businessName: '', businessSlug: '', planId: plans[0]?.id || '', theme: 'MODERN', 
    ownerName: '', ownerEmail: '', ownerPassword: ''
  })

  const set = (k: string, v: string) => setForm({ ...form, [k]: v })

  const autoSlug = (name: string) => {
    setForm(prev => ({ ...prev, businessName: name, businessSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Creando cuenta de propietario...')

    try {
      // 1. Create User
      const uRes = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.ownerName, email: form.ownerEmail, password: form.ownerPassword, roleId: ownerRoleId })
      })
      if (!uRes.ok) throw new Error((await uRes.json()).error || 'Error al crear usuario')
      const owner = await uRes.json()

      setMsg('Desplegando infraestructura del ecosistema...')

      // 2. Create Business & Assign Owner
      const bRes = await fetch('/api/admin/businesses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.businessName, slug: form.businessSlug, planId: form.planId, ownerId: owner.user.id })
      })
      if (!bRes.ok) throw new Error((await bRes.json()).error || 'Error al crear negocio')

      setMsg('Onboarding completado exitosamente.')
      setTimeout(() => router.push('/admin/businesses'), 1000)
    } catch (err: any) {
      setMsg(`Fallo: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm space-y-8">
      <section>
        <h2 className="text-[#ededed] font-heading text-xl mb-4 border-b border-white/10 pb-2">1. Propietario (Owner)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa]">Nombre
            <input required value={form.ownerName} onChange={e => set('ownerName', e.target.value)} className="bg-transparent border border-white/20 p-2 text-white" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa]">Email
            <input required type="email" value={form.ownerEmail} onChange={e => set('ownerEmail', e.target.value)} className="bg-transparent border border-white/20 p-2 text-white" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa] md:col-span-2">Contraseña Temporal
            <input required type="password" minLength={8} value={form.ownerPassword} onChange={e => set('ownerPassword', e.target.value)} className="bg-transparent border border-white/20 p-2 text-white" />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-[#ededed] font-heading text-xl mb-4 border-b border-white/10 pb-2">2. Ecosistema Digital</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa]">Nombre del Negocio
            <input required value={form.businessName} onChange={e => autoSlug(e.target.value)} className="bg-transparent border border-white/20 p-2 text-white" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa]">Slug (URL)
            <input required value={form.businessSlug} onChange={e => set('businessSlug', e.target.value)} className="bg-transparent border border-white/20 p-2 text-white" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#a1a1aa]">Plan Asignado
            <select required value={form.planId} onChange={e => set('planId', e.target.value)} className="bg-black border border-white/20 p-2 text-white">
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>
      </section>

      <footer className="pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-[#a1a1aa] text-xs font-mono">{msg}</span>
        <button disabled={loading} type="submit" className="bg-[#194bfb] hover:bg-[#0833cc] text-white px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors disabled:opacity-50">
          {loading ? 'Procesando...' : 'Desplegar Ecosistema →'}
        </button>
      </footer>
    </form>
  )
}
