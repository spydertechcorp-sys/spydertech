'use client'
// components/ParticleField.tsx — Subtle floating particles for hero

import { useEffect, useRef } from 'react'

interface Props {
  count?: number
}

export default function ParticleField({ count = 30 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear existing
    container.innerHTML = ''

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'

      const size = Math.random() * 2 + 1
      const left = Math.random() * 100
      const duration = Math.random() * 15 + 10
      const delay = Math.random() * 10
      const dx = (Math.random() - 0.5) * 100

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --dx: ${dx}px;
        opacity: ${Math.random() * 0.5 + 0.2};
      `

      container.appendChild(particle)
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      className="hero-particles"
      aria-hidden="true"
    />
  )
}
