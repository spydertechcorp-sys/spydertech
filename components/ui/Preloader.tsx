'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Preloader() {
  const { t } = useLanguage()
  const [stage, setStage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Premium loading sequence
    const t1 = setTimeout(() => setStage(1), 500)
    const t2 = setTimeout(() => setStage(2), 1500)
    const t3 = setTimeout(() => {
      setStage(3)
      setTimeout(() => setIsVisible(false), 1000)
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary overflow-hidden"
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-6">
            
            {/* Logo Mark Reveal */}
            <motion.div 
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: stage >= 1 ? 1 : 0, rotate: stage >= 1 ? 0 : -45, opacity: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center mb-8 shadow-2xl shadow-accent/20"
            >
              <span className="font-heading font-bold text-3xl">S</span>
            </motion.div>

            {/* Typewriter text reveal */}
            <div className="h-8 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {stage === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-xs uppercase tracking-[0.3em] text-secondary"
                  >
                    Inicializando sistemas...
                  </motion.div>
                )}
                {stage === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-heading font-bold text-xl md:text-2xl tracking-widest uppercase text-primary"
                  >
                    SpyderTech
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-[2px] bg-secondary mt-8 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: stage === 0 ? '10%' : stage === 1 ? '60%' : '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="h-full bg-accent"
              />
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
