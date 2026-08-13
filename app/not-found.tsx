'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SpyderSymbol from '@/components/SpyderSymbol'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1015] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 font-body text-gray-900 dark:text-gray-100 p-6">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03] dark:opacity-5">
        <SpyderSymbol size={800} />
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="font-heading font-black text-[120px] md:text-[180px] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 dark:from-white dark:to-gray-800 drop-shadow-sm mb-4"
        >
          404
        </motion.div>
        
        <div className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-bold mb-6">
          Señal Perdida
        </div>

        <h1 className="font-heading font-bold text-3xl md:text-5xl tracking-tight mb-6">
          Extraviado en la red.
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          La página que buscas no existe en este ecosistema o ha sido reubicada. Reconectemos con la base de datos principal.
        </p>

        {/* Terminal Error Panel */}
        <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm text-left w-full max-w-md mb-12 shadow-inner">
          <div className="flex gap-2 mb-2">
            <span className="text-red-500 font-bold">ERROR</span>
            <span className="text-gray-500">404</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 dark:text-gray-200">ROUTE_NOT_FOUND</span>
          </div>
          <div className="text-accent flex gap-2 items-center">
            <span>INTENTANDO_RECUPERACION</span>
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-accent inline-block"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl">
            Volver al Sistema →
          </Link>
          <Link href="/#planes" className="px-8 py-4 bg-transparent border-2 border-black/10 dark:border-white/10 text-gray-900 dark:text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            Ver Planes
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
