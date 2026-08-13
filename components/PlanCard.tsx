'use client'
// components/PlanCard.tsx — Interactive plan card with hover expand animation

import Link from 'next/link'
import { useState } from 'react'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  tagline: string
  priceMin: number
  priceMax: number
  currency: string
  isPopular: boolean
  badge?: string
  features: PlanFeature[]
}

interface Props {
  plan: Plan
  delay?: number
}

export default function PlanCard({ plan, delay = 0 }: Props) {
  const [hovered, setHovered] = useState(false)

  const formatCOP = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

  const whatsappMsg = encodeURIComponent(
    `Hola SpyderTech, quiero información sobre el Plan ${plan.name} (${formatCOP(plan.priceMin)} – ${formatCOP(plan.priceMax)}).`
  )

  return (
    <div
      className={`plan-card reveal ${plan.isPopular ? 'popular' : ''}`}
      data-delay={String(delay + 1)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-8px) scale(1.01)' : plan.isPopular ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: hovered
          ? plan.isPopular
            ? 'linear-gradient(135deg, rgba(125,255,107,0.08), var(--black-card))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.03), var(--black-card))'
          : 'var(--black-card)',
      }}
    >
      {/* Background glow on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${plan.isPopular ? 'rgba(125,255,107,0.12)' : 'rgba(255,255,255,0.04)'} 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }} />

      {plan.badge && (
        <div className="plan-badge">{plan.badge}</div>
      )}

      <div className="plan-name">{plan.name}</div>
      <p className="plan-tagline">{plan.tagline}</p>

      <div className="plan-price">
        <div className="plan-price-label">DESDE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span className="plan-price-amount" style={{
            color: plan.isPopular ? 'var(--accent)' : 'var(--text-primary)',
            fontSize: hovered ? 40 : 36,
            transition: 'font-size 0.3s ease',
          }}>
            {formatCOP(plan.priceMin)}
          </span>
          <span className="plan-price-period">/ mes</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Hasta {formatCOP(plan.priceMax)} según alcance
        </div>
      </div>

      <div className="plan-divider" />

      <div className="plan-features">
        {plan.features.map((feat, i) => (
          <div
            key={i}
            className="plan-feature"
            style={{
              opacity: hovered ? 1 : feat.included ? 1 : 0.5,
              transform: hovered ? 'translateX(0)' : 'translateX(0)',
              transition: `all 0.3s ease ${i * 0.04}s`,
            }}
          >
            <svg
              className={`plan-feature-icon ${feat.included ? 'included' : 'excluded'}`}
              viewBox="0 0 16 16"
              fill="none"
            >
              {feat.included ? (
                <>
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                  <path d="M10 6L6 10M6 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
              )}
            </svg>
            <span style={{ color: feat.included ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
              {feat.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <a
          href={`https://wa.me/573243755032?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-lg ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
          style={{ justifyContent: 'center' }}
          onClick={() => {
            fetch('/api/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ event: 'plan_cta_click', page: '/', metadata: { plan: plan.id } }),
            }).catch(() => {})
          }}
        >
          COMENZAR →
        </a>
        <Link
          href={`/contact?plan=${plan.id}`}
          className="btn btn-ghost btn-sm"
          style={{ justifyContent: 'center', fontSize: 12 }}
        >
          Solicitar propuesta personalizada
        </Link>
      </div>
    </div>
  )
}
