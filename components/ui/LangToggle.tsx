'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Language } from '@/lib/i18n/dictionaries'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LangToggle() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const langs: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'it', label: 'IT' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-9 rounded-md bg-secondary border border-subtle flex items-center justify-center text-xs font-bold text-primary hover:border-primary transition-colors focus:outline-none uppercase"
      >
        {language}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-16 bg-primary border border-subtle rounded-md shadow-lg overflow-hidden z-50"
          >
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code)
                  setIsOpen(false)
                }}
                className={`w-full text-center py-2 text-xs font-bold hover:bg-secondary transition-colors ${
                  language === l.code ? 'text-accent bg-secondary' : 'text-primary'
                }`}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
