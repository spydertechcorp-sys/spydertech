// components/Footer.tsx — SpyderTech 2.0 Footer

import Link from 'next/link'
import SpyderSymbol from './SpyderSymbol'

const FOOTER_LINKS = {
  Solutions: [
    { label: 'Digital', href: '/solutions#digital' },
    { label: 'Growth', href: '/solutions#growth' },
    { label: 'Brand', href: '/solutions#brand' },
    { label: 'Business', href: '/solutions#business' },
  ],
  Products: [
    { label: 'SpyderMenu', href: '/products/spydermenu' },
    { label: 'SpyderGrowth', href: '/products/spydergrowth' },
    { label: 'SpyderEDU', href: '/products/spyderedu' },
    { label: 'SpyderGame', href: '/products/spydergame' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
    { label: 'Client Portal', href: '/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'Legal Notice', href: '/legal/notice' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* CTA Block */}
      <div className="footer-cta">
        <div className="footer-cta-glow" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--space-4)' }}>Ready to grow?</p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 'var(--space-6)', maxWidth: 700, margin: '0 auto var(--space-6)' }}>
            Turn your digital presence into a
            <span style={{ color: 'var(--accent)' }}> growth machine.</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-8)' }}>
            <Link href="/contact" className="btn btn-primary btn-xl">
              START A PROJECT →
            </Link>
            <a
              href="https://wa.me/573243755032?text=Hola+SpyderTech,+quiero+información+sobre+sus+servicios."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-xl"
            >
              WHATSAPP
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
              <SpyderSymbol size={28} />
              <span className="footer-brand-name">SPYDERTECH</span>
            </div>
            <p className="footer-brand-desc">
              Digital Growth Company. Tecnología, Marketing, Marca y Orientación Empresarial para hacer crecer negocios reales en Colombia y Latinoamérica.
            </p>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <a href="mailto:hola@spydertech.online" style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.15s' }} className="footer-link">
                hola@spydertech.online
              </a>
              <a href="tel:+573243755032" className="footer-link" style={{ fontSize: 13 }}>
                +57 324 375 5032
              </a>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Barranquilla, Colombia</span>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <nav key={section} aria-label={section}>
              <h3 className="footer-col-title">{section}</h3>
              {links.map(link => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 SpyderTech. All rights reserved.</span>
          <span className="footer-system-label">A SPYDERTECH SYSTEM</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link href="/legal/privacy" className="footer-link" style={{ fontSize: 12 }}>Privacy</Link>
            <Link href="/legal/terms" className="footer-link" style={{ fontSize: 12 }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
