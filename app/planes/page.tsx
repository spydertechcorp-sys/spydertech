'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SpyderSymbol from '@/components/SpyderSymbol'

const plans = [
  {
    slug: 'presencia',
    name: 'Presencia',
    price: '$350.000–$450.000 COP',
    desc: 'Una base digital sólida para existir con claridad.',
    features: ['Landing Page Premium', 'Diseño Responsive', 'Integración WhatsApp', 'Formulario Básico']
  },
  {
    slug: 'impulso',
    name: 'Impulso',
    price: '$650.000–$850.000 COP',
    desc: 'Presencia, catálogo y caminos para convertir interés en pedidos.',
    features: ['Todo en Presencia', 'Catálogo Interactivo', 'Panel Administrable', 'Botones de Pago'],
    isPopular: true
  },
  {
    slug: 'crecimiento',
    name: 'Crecimiento',
    price: '$1.000.000–$1.300.000 COP',
    desc: 'Un sistema más amplio para adquisición, automatización y medición.',
    features: ['Todo en Impulso', 'CRM Básico', 'Métricas Avanzadas', 'SEO Optimizado']
  },
  {
    slug: 'elite',
    name: 'Élite',
    price: 'Personalizado',
    desc: 'Para construir un ecosistema que no cabe en un plan estándar.',
    features: ['Desarrollo a Medida', 'Apps Móviles', 'Infraestructura Dedicada', 'Soporte 24/7']
  }
]

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0c1015] text-gray-900 dark:text-gray-100 font-body relative overflow-hidden transition-colors duration-500 pt-24 pb-32">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-5 pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center mb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4 font-bold">
            INVERSIÓN QUE EVOLUCIONA
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Elige un punto de partida.<br/>
            <span className="text-gray-400 dark:text-gray-500 italic font-medium">No un límite.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Nuestros planes están diseñados para escalar junto con tu visión. Comienza donde estás, llega a donde quieres.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-black/40 backdrop-blur-xl border ${plan.isPopular ? 'border-accent' : 'border-gray-200 dark:border-white/10'} rounded-3xl p-8 flex flex-col hover:-translate-y-2 transition-transform shadow-lg`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white font-bold font-mono text-[10px] uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                  Más Popular
                </div>
              )}
              <span className="font-mono text-4xl font-black text-gray-200 dark:text-gray-800 absolute top-6 right-6 opacity-50">
                0{i+1}
              </span>
              <h2 className="font-heading font-bold text-2xl mb-2">{plan.name}</h2>
              <div className="text-accent font-bold mb-4 font-mono text-sm min-h-[40px] flex items-center">
                {plan.price}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 min-h-[60px]">
                {plan.desc}
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href={`/elite?plan=${plan.slug}`}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex justify-center transition-all ${plan.isPopular ? 'bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/20' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}
              >
                {i === 3 ? 'Diseñar ecosistema' : 'Empezar ahora'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
