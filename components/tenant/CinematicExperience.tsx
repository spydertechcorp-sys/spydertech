'use client'

import { useEffect, useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useRouter } from 'next/navigation'

interface ExperienceProps {
  business: any
  menu?: any
  categories?: any[]
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.5 }
  }
}
const textVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function CinematicExperience({ business }: ExperienceProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const isMrCamaron = business?.slug === 'mr-camaron'
  const accentColor = isMrCamaron ? '#ff4500' : '#facc15' // Orange for Mr Camaron, Gold default
  
  const [showButtons, setShowButtons] = useState(false)

  // 6 second preloader before showing buttons
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.main 
        key="cinematic"
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1 }}
        className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white flex flex-col justify-center items-center font-body"
      >
        
        {/* ─── BACKGROUND MEDIA (GUARANTEED CINEMATIC ANIMATION) ─── */}
        <div className="absolute inset-0 z-0 bg-[#0c1015] overflow-hidden">
          <motion.div
            initial={{ scale: 1.3, filter: "blur(20px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover object-center opacity-70"
            >
              {isMrCamaron ? (
                 <source src="https://assets.mixkit.co/videos/preview/mixkit-palm-tree-in-front-of-the-sun-119-large.mp4" type="video/mp4" />
              ) : (
                 <source src="https://assets.mixkit.co/videos/preview/mixkit-burger-with-bacon-and-cheese-on-a-wooden-board-10493-large.mp4" type="video/mp4" />
              )}
            </video>
          </motion.div>
        </div>

        {/* ─── CINEMATIC OVERLAY ─── */}
        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[4px]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-10"></div>

        {/* ─── MAIN CONTENT (CENTERED) ─── */}
        <motion.section 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-20 px-6 md:px-12 flex-grow flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto"
        >
          <motion.div variants={textVariant} animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="h-40 md:h-64 lg:h-72 w-auto object-contain mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]" />
            ) : (
              <div className="mb-6 font-heading text-4xl md:text-5xl font-black tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{business.name}</div>
            )}
          </motion.div>
          
          <motion.p variants={textVariant} className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] mb-4 font-black" style={{ color: accentColor }}>
            {isMrCamaron ? 'COCKTAIL BAR' : (business.description ? business.description.substring(0,25) + '...' : 'STREET FOOD & EXCELLENCE')}
          </motion.p>
          
          {!business.logo && (
            <motion.h1 variants={textVariant} className="font-heading text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl text-balance uppercase">
              {business.name}
            </motion.h1>
          )}
          
          <motion.p variants={textVariant} className="text-base md:text-xl opacity-80 max-w-xl mx-auto leading-relaxed font-body font-medium drop-shadow-md">
            {business.description || 'Auténtico sabor urbano. Hamburguesas premium, ambiente inigualable y la mejor experiencia de la ciudad.'}
          </motion.p>
        </motion.section>

        {/* ─── LINKTREE STYLE ACTION BUTTONS (APPEARS AFTER DELAY) ─── */}
        <AnimatePresence>
          {showButtons && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 flex flex-col items-center px-6 w-full max-w-sm gap-4 pb-12"
            >
              
              <button 
                onClick={() => router.push(`/${business.slug}/menu`)}
                className="w-full group flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <span>Ver Menú</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <a 
                href={business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '')}` : `/${business.slug}/menu`}
                target={business.whatsapp ? "_blank" : "_self"}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 backdrop-blur-md border border-[#25D366]/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all"
              >
                <span>Pedir por WhatsApp</span>
              </a>

              {business.address && (
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address + ' ' + (business.city || ''))}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-3 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md border border-blue-500/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all"
                >
                  <span>Cómo Llegar</span>
                </a>
              )}

              {business.instagram && (
                <a 
                  href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-3 bg-pink-500/20 hover:bg-pink-500/30 backdrop-blur-md border border-pink-500/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all"
                >
                  <span>Instagram</span>
                </a>
              )}
              
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </AnimatePresence>
  )
}
