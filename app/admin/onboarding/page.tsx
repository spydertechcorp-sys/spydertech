import { prisma } from '@/lib/db'
import FastOnboarding from '@/components/admin/FastOnboarding'

export default async function OnboardingPage() {
  const plans = await prisma.plan.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true } })
  const roles = await prisma.role.findMany({ where: { name: 'OWNER' } })
  const ownerRoleId = roles[0]?.id || ''

  return (
    <div className="w-full max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa] mb-3">
          Siguiente Nivel
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight text-[#ededed]">
          Business <span className="text-[#194bfb] italic">Onboarding.</span>
        </h1>
        <p className="font-body text-sm text-[#a1a1aa] max-w-2xl mt-4">
          Crea un nuevo ecosistema y su propietario asociado en menos de 30 segundos. El sistema se encarga de aislar el tenant, verificar permisos y publicar la experiencia.
        </p>
      </header>
      
      <FastOnboarding plans={plans} ownerRoleId={ownerRoleId} />
    </div>
  )
}
