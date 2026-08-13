'use client'
// components/admin/AdminTopbar.tsx — Admin top bar with search hint, user menu

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/clients': 'Clients',
  '/admin/team': 'Team',
  '/admin/orders': 'Orders',
  '/admin/plans': 'Plans',
  '/admin/products': 'Products',
  '/admin/services': 'Services',
  '/admin/promotions': 'Promotions',
  '/admin/ads': 'Campaigns & Ads',
  '/admin/crm': 'CRM / Leads',
  '/admin/content': 'Content / Blog',
  '/admin/menus': 'SpyderMenu',
  '/admin/projects': 'Projects',
  '/admin/tickets': 'Support Tickets',
  '/admin/legal': 'Legal / Business',
  '/admin/security': 'Security Center',
  '/admin/audit': 'Audit Logs',
  '/admin/settings': 'Settings',
  '/admin/analytics': 'Analytics',
  '/admin/notifications': 'Notifications',
}

interface Props {
  user: {
    name?: string
    email?: string
    image?: string
    role?: string
  }
}

export default function AdminTopbar({ user }: Props) {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pageTitle = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname?.startsWith(path))?.[1] || 'Admin'

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-title">
        <strong>{pageTitle}</strong>
        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>·</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>SpyderTech Admin</span>
      </div>

      <div className="admin-topbar-actions">
        {/* Ctrl+K hint */}
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Search...
          <span className="kbd">⌘K</span>
        </button>

        {/* Notifications */}
        <Link href="/admin/notifications" className="btn btn-ghost btn-icon" aria-label="Notifications" style={{ fontSize: 16 }}>
          🔔
        </Link>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent-glow)', border: '1px solid rgba(125,255,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--accent)',
            }}>
              {user.name?.charAt(0) || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{user.role}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-muted)', marginLeft: 2 }}>
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {userMenuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setUserMenuOpen(false)} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--carbon)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: 6, minWidth: 180,
                boxShadow: 'var(--shadow-lg)', zIndex: 99,
                animation: 'slideDown 0.15s var(--ease-out)',
              }}>
                <Link href="/admin/settings" style={{ display: 'block', padding: '8px 12px', borderRadius: 6, fontSize: 13, color: 'var(--text-secondary)', transition: 'all 0.1s' }} className="admin-nav-item">
                  ⚙️ Settings
                </Link>
                <Link href="/" style={{ display: 'block', padding: '8px 12px', borderRadius: 6, fontSize: 13, color: 'var(--text-secondary)', transition: 'all 0.1s' }} className="admin-nav-item">
                  🌐 View site
                </Link>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ width: '100%', textAlign: 'left', display: 'block', padding: '8px 12px', borderRadius: 6, fontSize: 13, color: 'var(--red)', transition: 'all 0.1s', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  🚪 Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
