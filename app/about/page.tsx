import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 pt-24">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 border border-accent/20">
        <span className="text-accent text-2xl">🕸️</span>
      </div>
      <h1 className="font-heading text-4xl font-medium tracking-tight text-white mb-4">
        About SpyderTech
      </h1>
      <p className="font-body text-base text-gray-text max-w-lg mb-8">
        Somos el motor detrás de la próxima generación de ecosistemas digitales. 
        Nuestra misión es conectar, escalar y transformar negocios a través de infraestructura inteligente.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-white text-black font-mono text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
