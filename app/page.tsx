"use client"

import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { LangToggle } from "@/components/ui/LangToggle"
import MockupTerminal from "@/components/ui/MockupTerminal"

// Fade Up Variant for Scroll Reveals
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="bg-primary min-h-screen text-primary font-body overflow-hidden">
      
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-subtle transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-xl tracking-tight text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold">S</span>
            SPYDERTECH
          </Link>
          <div className="hidden md:flex gap-8 items-center font-body text-sm font-medium text-secondary">
            <Link href="#soluciones" className="hover:text-accent transition-colors">{t.nav.solutions}</Link>
            <Link href="#productos" className="hover:text-accent transition-colors">{t.nav.products}</Link>
            <Link href="#planes" className="hover:text-accent transition-colors">{t.nav.pricing}</Link>
            <div className="h-4 w-[1px] bg-subtle mx-2" />
            <ThemeToggle />
            <LangToggle />
            <Link href="/login" className="btn-primary py-2 px-4 rounded-md text-sm">{t.nav.login}</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 bg-secondary relative overflow-hidden border-b border-subtle transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start text-left">
            <motion.span custom={0} initial="hidden" animate="visible" variants={fadeUp} className="inline-block py-1.5 px-3 rounded-full bg-accent/10 text-accent font-medium text-xs mb-6 border border-accent/20">
              {t.hero.badge}
            </motion.span>
            
            <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-5xl md:text-6xl lg:text-[4.5rem] font-heading font-bold tracking-tight leading-[1.05] mb-6">
              {t.hero.title1}<br/>
              <span className="text-accent">{t.hero.title2}</span>
            </motion.h1>
            
            <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-lg md:text-xl text-secondary max-w-lg mb-8 leading-relaxed">
              {t.hero.desc}
            </motion.p>
            
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#planes" className="btn-primary w-full sm:w-auto">
                {t.hero.cta1}
              </Link>
              <Link href="#soluciones" className="btn-secondary w-full sm:w-auto">
                {t.hero.cta2}
              </Link>
            </motion.div>
          </div>
          
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="relative w-full h-[400px] lg:h-[500px] rounded-2xl bg-primary border border-subtle shadow-2xl p-2 hidden lg:flex flex-col group">
             <div className="w-full h-8 border-b border-subtle flex items-center px-4 gap-2 bg-secondary rounded-t-xl transition-colors">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="flex-1 bg-primary rounded-b-xl flex items-center justify-center relative overflow-hidden transition-colors">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="relative z-10 flex flex-col gap-4 w-3/4 transform group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-1/3 h-6 bg-secondary border border-subtle rounded-md"></motion.div>
                  <div className="flex gap-4">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="flex-1 h-24 bg-accent/5 border border-accent/20 rounded-lg backdrop-blur-sm"></motion.div>
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="flex-1 h-24 bg-accent/5 border border-accent/20 rounded-lg backdrop-blur-sm"></motion.div>
                  </div>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-full h-40 rounded-lg overflow-hidden shadow-inner">
                    <MockupTerminal />
                  </motion.div>
                </div>
             </div>
          </motion.div>

        </div>
      </section>

      {/* ─── SOLUCIONES ─── */}
      <section id="soluciones" className="py-24 px-6 bg-primary transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t.solutions.title}</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">{t.solutions.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(t.solutions.items).map(([key, item], index) => {
              const icons: Record<string, React.ReactNode> = {
                marketing: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
                software: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
                pos: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                gastro: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12z"/><path d="M14 2v20"/><path d="M10 2v20"/><path d="M14 10H6"/><path d="M14 14H6"/></svg>,
                corp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
                legal: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              }
              return (
                <motion.div 
                  key={key} 
                  custom={index % 3} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  variants={fadeUp} 
                  className="p-8 rounded-xl border border-subtle bg-secondary shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-150 group-hover:rotate-12 duration-500">
                    {icons[key]}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary border border-subtle flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent/30 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] mb-6 transition-all duration-300 relative z-10">
                    {icons[key]}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 relative z-10">{item.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed relative z-10">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTOS ─── */}
      <section id="productos" className="py-24 px-6 bg-secondary border-y border-subtle transition-colors duration-300 relative overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -top-40 -right-40 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t.products.title}</h2>
              <p className="text-secondary text-lg max-w-2xl">{t.products.desc}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
              <Link href="/pepitos" className="btn-outline whitespace-nowrap bg-primary hover:bg-secondary">
                {t.products.demo}
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SPYDER MENU */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-primary rounded-2xl border border-subtle overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="p-8 md:p-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">M</div>
                  <h3 className="font-heading font-bold text-2xl">Spyder Menu</h3>
                </div>
                <p className="text-secondary mb-6">{t.products.menuDesc}</p>
              </div>
              <Link href="/mr-camaron" className="bg-secondary p-0 border-t border-subtle h-64 flex items-center justify-center relative overflow-hidden group-hover:opacity-90 transition-opacity">
                <img src="/demo/mockup_menu.png" alt="Spyder Menu en Mr. Camarón" className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </Link>
            </motion.div>

            {/* SPYDER POS */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="bg-primary rounded-2xl border border-subtle overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="p-8 md:p-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">P</div>
                  <h3 className="font-heading font-bold text-2xl">Spyder POS & Stock</h3>
                </div>
                <p className="text-secondary mb-6">{t.products.posDesc}</p>
              </div>
              <a href="http://refugioalcarbon.online" target="_blank" className="bg-secondary p-0 border-t border-subtle h-64 flex items-center justify-center relative overflow-hidden group-hover:opacity-90 transition-opacity">
                <img src="/demo/mockup_pos.png" alt="Spyder POS en Refugio al Carbón" className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </a>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ─── PLANES ─── */}
      <section id="planes" className="py-24 px-6 bg-primary transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">{t.pricing.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            
            {/* PLAN 1 */}
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-subtle rounded-xl p-8 bg-secondary flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-heading font-bold text-xl mb-2 text-primary">{t.pricing.plans.presencia.name}</h3>
              <p className="text-tertiary text-sm mb-6 min-h-[60px]">{t.pricing.plans.presencia.desc}</p>
              <div className="mb-8">
                <span className="text-2xl font-bold">{t.pricing.plans.presencia.price}</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-secondary mb-8 flex-1">
                {t.pricing.plans.presencia.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="text-accent mt-0.5 font-bold">✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/elite?plan=presencia" className="btn-outline bg-primary w-full mt-auto">
                {t.pricing.select}
              </Link>
            </motion.div>

            {/* PLAN 2 (DESTACADO) */}
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-accent rounded-xl p-8 bg-primary flex flex-col shadow-xl relative transform xl:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 text-xs font-bold rounded-full shadow-md">
                {t.pricing.recommended}
              </div>
              <h3 className="font-heading font-bold text-xl mb-2 text-accent">{t.pricing.plans.impulso.name}</h3>
              <p className="text-secondary text-sm mb-6 min-h-[60px]">{t.pricing.plans.impulso.desc}</p>
              <div className="mb-8">
                <span className="text-2xl font-bold">{t.pricing.plans.impulso.price}</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-secondary mb-8 flex-1">
                <li className="font-bold text-primary border-b border-subtle pb-2 mb-2">{t.pricing.plans.impulso.includes}</li>
                {t.pricing.plans.impulso.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="text-accent mt-0.5 font-bold">✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/elite?plan=impulso" className="btn-primary w-full mt-auto shadow-lg shadow-accent/30">
                {t.pricing.select}
              </Link>
            </motion.div>

            {/* PLAN 3 */}
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-subtle rounded-xl p-8 bg-secondary flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-heading font-bold text-xl mb-2 text-primary">{t.pricing.plans.crecimiento.name}</h3>
              <p className="text-tertiary text-sm mb-6 min-h-[60px]">{t.pricing.plans.crecimiento.desc}</p>
              <div className="mb-8">
                <span className="text-2xl font-bold">{t.pricing.plans.crecimiento.price}</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-secondary mb-8 flex-1">
                <li className="font-bold text-primary border-b border-subtle pb-2 mb-2">{t.pricing.plans.crecimiento.includes}</li>
                {t.pricing.plans.crecimiento.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="text-accent mt-0.5 font-bold">✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/elite?plan=crecimiento" className="btn-outline bg-primary w-full mt-auto">
                {t.pricing.select}
              </Link>
            </motion.div>

            {/* PLAN 4 */}
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-gray-800 rounded-xl p-8 bg-gray-900 text-white flex flex-col shadow-lg dark:border-accent/40 dark:bg-black">
              <h3 className="font-heading font-bold text-xl mb-2 text-white">{t.pricing.plans.elite.name}</h3>
              <p className="text-gray-400 text-sm mb-6 min-h-[60px]">{t.pricing.plans.elite.desc}</p>
              <div className="mb-8">
                <span className="text-2xl font-bold text-white">{t.pricing.plans.elite.price}</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-gray-300 mb-8 flex-1">
                {t.pricing.plans.elite.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="text-white mt-0.5 font-bold">✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/elite?plan=personalizado" className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors mt-auto text-sm">
                {t.pricing.custom}
              </Link>
            </motion.div>

          </div>
          
          <div className="mt-10 text-center text-xs text-tertiary">
            {t.pricing.note}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 bg-secondary border-t border-subtle transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-secondary">
          <div>© 2026 SPYDERTECH. TODOS LOS DERECHOS RESERVADOS.</div>
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-primary transition-colors">{t.nav.login}</Link>
            <Link href="/elite" className="hover:text-primary transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
