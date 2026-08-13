'use client'

import { useState } from 'react'

export function TeamWidget() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const team = [
    { 
      name: 'Moisés García', 
      role: 'Co-fundador · Tecnología y Estrategia', 
      avatar: 'M',
      desc: 'Lidera la visión tecnológica y estratégica de SpyderTech, impulsando el desarrollo de productos digitales, innovación y soluciones orientadas al crecimiento de los negocios.'
    },
    { 
      name: 'Beatriz Solano', 
      role: 'Co-fundadora · Estrategia, Negocios y Dirección', 
      avatar: 'B',
      desc: 'Aporta una amplia experiencia en estrategia y gestión empresarial, orientando la visión de SpyderTech y ayudando a convertir oportunidades de negocio en soluciones sostenibles, competitivas y con proyección de crecimiento.'
    },
    { 
      name: 'Camila Gómez', 
      role: 'Co-fundadora · Estrategia Empresarial y Área Jurídica', 
      avatar: 'C',
      desc: 'Integra la perspectiva jurídica y empresarial de SpyderTech, aportando al desarrollo estructurado de los negocios y acompañando los procesos que requieren una visión estratégica y legal.'
    },
  ]

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl p-6 relative shadow-sm mt-6">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-black/5 dark:bg-white/5 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
      >
        ✕
      </button>
      <h3 className="font-heading font-bold text-lg mb-4 text-gray-900 dark:text-white">Equipo Principal</h3>
      <div className="space-y-6">
        {team.map((member) => (
          <div key={member.name} className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-200 dark:border-blue-800">
              {member.avatar}
            </div>
            <div>
              <p className="font-bold text-base text-gray-900 dark:text-white">{member.name}</p>
              <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono mb-2 font-bold">{member.role}</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {member.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PlansWidget() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 relative shadow-sm mt-6">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-black/5 dark:bg-white/5 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
      >
        ✕
      </button>
      <h3 className="font-heading font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Resumen de Planes
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Gestiona la oferta comercial desde el panel de planes. El ecosistema SpyderTech permite asginar límites de IA y catálogos ilimitados por tenant.
      </p>
      <div className="flex gap-2">
        <span className="bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-md text-xs font-mono font-bold text-gray-900 dark:text-white">CRECIMIENTO</span>
        <span className="bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-md text-xs font-mono font-bold text-gray-900 dark:text-white">LIDERAZGO</span>
      </div>
    </div>
  )
}
