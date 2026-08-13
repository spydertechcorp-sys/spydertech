'use client'
// components/Navbar.tsx — Glassmorphism scroll-reactive navbar

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SpyderSymbol from './SpyderSymbol'

const NAV_LINKS = [
  { href: '/soluciones', label: 'Solutions' },
  { href: '/productos', label: 'Products' },
  { href: '/elite', label: 'Growth' },
  { href: '/planes', label: 'Business' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu on route change
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Prevent scroll when menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Navegación principal">
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo" aria-label="SpyderTech - inicio">
            <div className="navbar-logo-icon">
              <SpyderSymbol size={32} />
            </div>
            <span className="navbar-logo-text">
              SPYDER<span>TECH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav" aria-label="Links de navegación">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname?.startsWith(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/contact" className="btn btn-primary btn-sm">
              START A PROJECT →
            </Link>

            {/* Mobile hamburger */}
            <button
              className="navbar-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span style={menuOpen ? { transform: 'rotate(45deg) translateY(6px)', width: '22px' } : {}} />
              <span style={menuOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}} />
              <span style={menuOpen ? { transform: 'rotate(-45deg) translateY(-6px)', width: '22px' } : {}} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link href="/login" className="btn btn-secondary btn-lg" style={{ justifyContent: 'center' }}>
            Login
          </Link>
          <Link href="/contact" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
            START A PROJECT →
          </Link>
        </div>
      </div>
    </>
  )
}
