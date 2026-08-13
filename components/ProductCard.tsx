'use client'
// components/ProductCard.tsx — SpyderTech product card

import Link from 'next/link'

interface Props {
  id: string
  name: string
  icon: string
  color: string
  tagline: string
  badge?: string
  delay?: number
}

export default function ProductCard({ id, name, icon, color, tagline, badge, delay = 0 }: Props) {
  return (
    <div className="product-card reveal" data-delay={String(delay + 1)}>
      {badge && (
        <div className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', fontSize: 9 }}>{badge}</div>
      )}
      <div
        className="product-icon-wrapper"
        style={{
          background: `${color}15`,
          borderColor: `${color}25`,
        }}
      >
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <h3 style={{
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        marginBottom: 'var(--space-2)',
        color: color,
      }}>
        {name}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
        {tagline}
      </p>
      <Link
        href={`/products/${id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color: color,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
          transition: 'gap 0.2s ease',
        }}
      >
        EXPLORAR →
      </Link>
    </div>
  )
}
