'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function EliteFormContent() {
  const searchParams = useSearchParams()
  const planSlug = searchParams.get('plan') || 'elite'
  const isCustom = planSlug === 'elite'
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const planNames: Record<string, string> = {
    presencia: 'Plan Presencia',
    impulso: 'Plan Impulso',
    crecimiento: 'Plan Crecimiento',
    elite: 'Ecosistema Élite'
  }
  
  const selectedPlanName = planNames[planSlug] || 'Ecosistema Personalizado'

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsDone(true)
    }, 2000)
  }

  return (
    <div className="w-full max-w-3xl relative z-10">
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-12 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            
            <div className="flex justify-between items-center mb-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Paso {step} de 3 — Setup
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white">
                {selectedPlanName}
              </div>
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h1 className="font-heading text-4xl md:text-5xl text-white font-bold tracking-tight mb-4">
                  Cuéntanos sobre tu negocio.
                </h1>
                <div className="space-y-6">
                  <input type="text" required placeholder="Nombre de la empresa" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                  <input type="text" required placeholder="Tipo de negocio (Ej: Restaurante, Retail)" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                  <input type="text" required placeholder="Ciudad principal" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h1 className="font-heading text-4xl md:text-5xl text-white font-bold tracking-tight mb-4">
                  ¿Qué necesitas resolver?
                </h1>
                <div className="space-y-6">
                  <textarea required placeholder="Describe brevemente tus objetivos principales..." className="w-full h-32 bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500 resize-none" />
                  {isCustom && (
                    <select required className="w-full bg-black border-b border-white/20 py-4 text-lg font-heading text-gray-300 focus:outline-none focus:border-accent transition-colors appearance-none">
                      <option value="" disabled selected>Presupuesto aproximado...</option>
                      <option value="1-3">$1.000.000 - $3.000.000 COP</option>
                      <option value="3-5">$3.000.000 - $5.000.000 COP</option>
                      <option value="5+">Más de $5.000.000 COP</option>
                    </select>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h1 className="font-heading text-4xl md:text-5xl text-white font-bold tracking-tight mb-4">
                  ¿Cómo te contactamos?
                </h1>
                <div className="space-y-6">
                  <input type="text" required placeholder="Tu nombre completo" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                  <input type="email" required placeholder="Correo electrónico" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                  <input type="tel" required placeholder="Número de WhatsApp" className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-heading text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-500" />
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button type="button" onClick={handlePrev} className="px-8 py-4 border border-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:border-white transition-colors">
                  ← Atrás
                </button>
              )}
              
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="flex-1 bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors shadow-lg">
                  Siguiente →
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50">
                  {isSubmitting ? 'Procesando...' : 'Finalizar Configuración'}
                </button>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl"
          >
            <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(203,162,88,0.3)]">
              <span className="text-3xl font-bold">✓</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-white font-bold tracking-tight mb-6">
              Todo listo.
            </h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto mb-12">
              Hemos recibido tu solicitud para el <strong>{selectedPlanName}</strong>. Nuestro equipo se pondrá en contacto contigo muy pronto.
            </p>
            <Link href="/" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg">
              Volver al inicio
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function EliteFormPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.05]">
        <div className="w-[600px] h-[600px] bg-accent/30 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

      <Link href="/" className="absolute top-8 left-8 font-heading font-bold text-xl tracking-tight text-white uppercase z-50 hover:opacity-70 transition-opacity">
        SPYDER<span className="text-accent">TECH</span>
      </Link>

      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        <EliteFormContent />
      </Suspense>
    </main>
  )
}
