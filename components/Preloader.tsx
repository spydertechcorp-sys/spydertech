"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import SpyderSymbol from "./SpyderSymbol"

export default function Preloader() {
  const [active, setActive] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const seen = sessionStorage.getItem("spydertech-intro")
    if (seen) return
    setActive(true)
    document.body.style.overflow = "hidden"
    const timeout = window.setTimeout(() => close(), reduceMotion ? 900 : 4400)
    return () => { window.clearTimeout(timeout); document.body.style.overflow = "" }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  function close() {
    sessionStorage.setItem("spydertech-intro", "1")
    setActive(false)
    document.body.style.overflow = ""
  }

  return <AnimatePresence>
    {active && <motion.section className="system-loader" exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: .85, ease: [.76, 0, .24, 1] } }}>
      <div className="system-loader__grid" aria-hidden="true" />
      <div className="system-loader__nodes" aria-hidden="true">
        {Array.from({ length: reduceMotion ? 5 : 14 }).map((_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>
      <motion.div className="system-loader__core" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .7, duration: .9 }}>
        <SpyderSymbol size={110} color="#d6ff38" />
      </motion.div>
      <motion.div className="system-loader__copy" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.55 }}>
        <span>SPYDERTECH</span>
        <strong>TU NEGOCIO.<br />TU TECNOLOGÍA.<br />TU SIGUIENTE NIVEL.</strong>
      </motion.div>
      <button onClick={close} className="system-loader__skip">Saltar <span>→</span></button>
    </motion.section>}
  </AnimatePresence>
}
