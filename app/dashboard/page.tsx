import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function DashboardRedirect() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Si es SuperAdmin, llevar al SuperAdmin
  if ((session.user as any).role === 'SUPER_ADMIN') {
    redirect('/admin')
  }

  // Si es Dueño, buscar su negocio y redirigir a su panel
  const membership = await prisma.businessMember.findFirst({
    where: { userId: session.user.id },
    include: { business: true }
  })

  if (membership?.business) {
    redirect(`/${membership.business.slug}/admin`)
  }

  // Si no tiene negocio asociado, mostrar página de error o onboarding
  return (
    <div className="min-h-screen bg-black-deep text-white-off flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-4xl mb-4 uppercase tracking-tighter">Sin Ecosistema</h1>
        <p className="font-mono text-xs tracking-widest uppercase text-gray-text mb-8">
          Tu cuenta no está asociada a ningún negocio. Contacta a soporte para que configuren tu ecosistema.
        </p>
        <a href="/" className="font-mono text-[10px] tracking-widest text-white uppercase hover:text-accent border-b border-white pb-1 hover:border-accent">Volver al Inicio</a>
      </div>
    </div>
  )
}
