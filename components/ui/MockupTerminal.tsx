'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const ES_MESSAGES = [
  "> Analizando tendencias de mercado...",
  "> 45% de incremento en conversión detectado.",
  "> Optimizando experiencia de usuario (UX)...",
  "> Desplegando solución a escala global.",
  "> El ecosistema está listo para crecer."
]

const EN_MESSAGES = [
  "> Analyzing market trends...",
  "> 45% increase in conversion detected.",
  "> Optimizing User Experience (UX)...",
  "> Deploying solution globally.",
  "> The ecosystem is ready to scale."
]

const IT_MESSAGES = [
  "> Analizzando le tendenze del mercato...",
  "> Rilevato un aumento del 45% nella conversione.",
  "> Ottimizzazione dell'esperienza utente (UX)...",
  "> Distribuzione della soluzione su scala globale.",
  "> L'ecosistema è pronto per crescere."
]

export default function MockupTerminal() {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const messages = language === 'en' ? EN_MESSAGES : language === 'it' ? IT_MESSAGES : ES_MESSAGES

  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (isTyping) {
      const currentMessage = messages[currentIndex]
      if (displayedText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1))
        }, 50) // Typing speed
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000) // Pause at the end of typing
      }
    } else {
      timeout = setTimeout(() => {
        setDisplayedText('')
        setIsTyping(true)
        setCurrentIndex((prev) => (prev + 1) % messages.length)
      }, 500) // Pause before next message
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isTyping, currentIndex, messages])

  return (
    <div className="w-full h-full bg-[#0d1117] rounded-lg shadow-inner p-4 font-mono text-sm text-green-400 flex flex-col justify-end overflow-hidden relative border border-[#30363d]">
      <div className="absolute top-0 left-0 w-full p-2 bg-[#161b22] border-b border-[#30363d] flex gap-2 items-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>
        <span className="text-xs text-[#8b949e]">system_logs.sh</span>
      </div>
      
      <div className="mt-8 space-y-2 opacity-50">
        {messages.slice(Math.max(0, currentIndex - 2), currentIndex).map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      
      <div className="flex items-center gap-1 mt-2 text-green-300 font-semibold drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-2 h-4 bg-green-400 inline-block"
        />
      </div>
    </div>
  )
}
