import Link from 'next/link'

export default function AdminPlaceholderPage({ params }: { params: { slug: string[] } }) {
  const moduleName = params.slug.join('/').toUpperCase()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-[#194bfb]/10 flex items-center justify-center mb-6 border border-[#194bfb]/20">
        <span className="text-[#194bfb] text-2xl">⚡</span>
      </div>
      <h1 className="font-heading text-3xl font-medium tracking-tight text-[#ededed] mb-3">
        Módulo en Desarrollo
      </h1>
      <p className="font-body text-sm text-[#a1a1aa] max-w-md mb-8">
        La sección <strong className="text-white">/admin/{params.slug.join('/')}</strong> forma parte del roadmap de la fase 2. Estamos trabajando para liberar esta característica en la próxima actualización del piloto.
      </p>
      <Link 
        href="/admin" 
        className="px-6 py-3 bg-[#ededed] text-[#0a0a0a] font-mono text-[11px] uppercase tracking-widest hover:bg-white transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
