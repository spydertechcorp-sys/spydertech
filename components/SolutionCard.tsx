'use client'
// components/SolutionCard.tsx — Interactive solution ecosystem card

import { useRef } from 'react'
import Link from 'next/link'

interface Props {
  icon: string
  category: string
  name: string
  desc: string
  tags: string[]
  color?: string
  delay?: number
}

export default function SolutionCard({ icon, category, name, desc, tags, color = 'rgba(125,255,107,0.06)', delay = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
    card.style.setProperty('--card-glow', color)
  }

  return (
    <div
      ref={cardRef}
      className="solution-card reveal"
      data-delay={String(delay + 1)}
      onMouseMove={handleMouseMove}
    >
      <span className="solution-icon">{icon}</span>
      <div className="solution-category">{category}</div>
      <h3 className="solution-name">{name}</h3>
      <p className="solution-desc">{desc}</p>
      <div className="solution-tags">
        {tags.map(tag => (
          <span key={tag} className="solution-tag">{tag}</span>
        ))}
      </div>
      <Link
        href={`/solutions#${category.toLowerCase()}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-5)', fontSize: 13, fontWeight: 600, color: 'var(--accent)', transition: 'gap 0.2s ease' }}
        className="solution-link"
      >
        VER SERVICIOS
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
