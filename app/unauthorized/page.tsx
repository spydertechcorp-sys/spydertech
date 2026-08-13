'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SpyderSymbol from '@/components/SpyderSymbol'

export default function UnauthorizedPage() {
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
        <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        
        <div className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-red-500 font-bold mb-6">
          Acceso Denegado
        </div>

        <h1 className="font-heading font-bold text-3xl md:text-5xl tracking-tight mb-6">
          Autorización Requerida
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Tus credenciales actuales no tienen los permisos necesarios para acceder a esta área del sistema.
        </p>

        {/* Terminal Error Panel */}
        <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm text-left w-full max-w-md mb-12 shadow-inner">
          <div className="flex gap-2 mb-2">
            <span className="text-red-500 font-bold">SECURITY</span>
            <span className="text-gray-500">401</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 dark:text-gray-200">UNAUTHORIZED_ACCESS</span>
          </div>
          <div className="text-red-500 flex gap-2 items-center">
            <span>PERMISO_DENEGADO</span>
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-red-500 inline-block"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/login" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl">
            Iniciar Sesión →
          </Link>
          <Link href="/" className="px-8 py-4 bg-transparent border-2 border-black/10 dark:border-white/10 text-gray-900 dark:text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            Volver al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
