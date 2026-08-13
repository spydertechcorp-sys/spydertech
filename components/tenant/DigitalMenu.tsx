'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'

interface DigitalMenuProps {
  business: any
  menu?: any
  categories: any[]
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
}

export default function DigitalMenu({ business, menu, categories }: DigitalMenuProps) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id)
  const accentColor = '#facc15' // Forced Gold/Yellow

  return (
    <main className="min-h-[100svh] bg-black text-white font-body flex flex-col pb-32">
      
      {/* ─── HEADER (STREET VIBE) ─── */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="flex justify-between items-center px-4 py-4 md:px-8 max-w-5xl mx-auto w-full">
          
          <Link href={`/${business.slug}`} className="flex items-center gap-3 group">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform" />
            ) : (
              <div className="font-heading font-black text-2xl md:text-3xl tracking-tighter uppercase drop-shadow-md">{business.name}</div>
            )}
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Cart Button */}
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-black rounded-full font-black uppercase text-sm hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.4)]" style={{ backgroundColor: accentColor }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>{t.tenant.cart} (0)</span>
            </button>
          </div>
        </div>

        {/* ─── CATEGORY NAVIGATION (PILL STYLE) ─── */}
        <nav className="flex overflow-x-auto hide-scrollbar px-4 py-3 gap-3 max-w-5xl mx-auto w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest transition-all relative z-10 ${
                activeCategory === cat.id 
                  ? 'text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {activeCategory === cat.id && (
                <motion.div 
                  layoutId="activeCategoryPill" 
                  className="absolute inset-0 rounded-full -z-10 shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                  style={{ backgroundColor: accentColor }} 
                />
              )}
              {cat.name}
            </button>
          ))}
        </nav>
      </header>

      {/* ─── UPCOMING BANNER ─── */}
      {business.slug === 'mr-camaron' && (
        <div className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 text-center font-bold tracking-widest text-xs uppercase animate-pulse">
          🚀 ¡Muy pronto nuevos productos! 🚀
        </div>
      )}

      {/* ─── MENU CONTENT (STREET LIST) ─── */}
      <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full space-y-20">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.id} className="scroll-mt-40">
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-8 tracking-tighter uppercase flex items-center gap-4">
              {cat.name}
              <div className="h-[2px] bg-white/10 flex-1" />
            </h2>
            
            <div className="flex flex-col gap-6">
              {cat.products?.map((product: any) => {
                const isExplosive = product.slug === 'sabores-explosivos'
                const img = product.images?.[0] || product.image || '/demo/product_1.jpg'
                return (
                  <motion.article 
                    key={product.id} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, margin: "-50px" }} 
                    variants={fadeUp} 
                    className={`bg-[#111] border rounded-3xl p-4 md:p-5 flex gap-5 md:gap-6 transition-all duration-300 cursor-pointer group ${isExplosive ? 'border-red-500/50 shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'border-white/5 hover:border-white/10 hover:shadow-[0_20px_40px_-15px_rgba(250,204,21,0.15)]'}`}
                  >
                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-black relative overflow-hidden flex-shrink-0">
                      <img src={img} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div>
                        <h3 className={`font-heading font-black text-xl md:text-2xl uppercase tracking-tight leading-tight line-clamp-2 mb-2 transition-colors ${isExplosive ? 'explosive-text' : ''}`} style={!isExplosive ? { color: accentColor } : {}}>
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-2 mb-2 font-medium">
                          {product.description || 'Delicioso plato preparado con los mejores ingredientes.'}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-black text-2xl md:text-3xl tracking-tighter">${product.price.toLocaleString()}</span>
                        <button 
                          className="w-10 h-10 md:w-14 md:h-14 rounded-full font-bold transition-transform active:scale-90 flex items-center justify-center text-black shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                          style={{ backgroundColor: accentColor }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── FLOATING CART BUTTON (FAB) ─── */}
      <div className="fixed bottom-6 left-0 w-full px-4 z-50 pointer-events-none flex justify-center">
        <motion.button 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
          className="pointer-events-auto flex items-center justify-between gap-4 px-8 py-5 text-black rounded-full font-black uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(250,204,21,0.5)] w-full max-w-sm"
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-sm text-white shadow-inner">2</span>
            <span>Ver Pedido</span>
          </div>
          <span className="text-xl">${(30000).toLocaleString()}</span>
        </motion.button>
      </div>
    </main>
  )
}
