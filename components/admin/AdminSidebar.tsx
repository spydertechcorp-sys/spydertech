'use client'
// components/admin/AdminSidebar.tsx — Command Center Sidebar

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SpyderSymbol from '@/components/SpyderSymbol'

interface NavSection {
  label: string
  items: NavItem[]
}

interface NavItem {
  href: string
  icon: string
  label: string
  roles?: string[]
  badge?: string
}

const NAV: NavSection[] = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/admin', icon: '◈', label: 'Dashboard' },
      { href: '/admin/onboarding', icon: '🚀', label: 'Fast Onboarding', roles: ['SUPER_ADMIN'] },
      { href: '/admin/analytics', icon: '📊', label: 'Analytics' },
      { href: '/admin/notifications', icon: '🔔', label: 'Notifications' },
    ],
  },
  {
    label: 'PEOPLE',
    items: [
      { href: '/admin/users', icon: '👤', label: 'Users', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { href: '/admin/clients', icon: '🏢', label: 'Clients' },
      { href: '/admin/team', icon: '✦', label: 'Team' },
    ],
  },
  {
    label: 'COMMERCE',
    items: [
      { href: '/admin/orders', icon: '📦', label: 'Orders' },
      { href: '/admin/plans', icon: '⚡', label: 'Plans' },
      { href: '/admin/products', icon: '🛒', label: 'Products' },
      { href: '/admin/services', icon: '🔧', label: 'Services' },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { href: '/admin/promotions', icon: '🎯', label: 'Promotions' },
      { href: '/admin/ads', icon: '📣', label: 'Campaigns / Ads' },
      { href: '/admin/crm', icon: '🧲', label: 'CRM / Leads' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { href: '/admin/content', icon: '✏️', label: 'Content / Blog' },
      { href: '/admin/menus', icon: '📋', label: 'Menus (SpyderMenu)' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/admin/projects', icon: '📁', label: 'Projects' },
      { href: '/admin/tickets', icon: '🎫', label: 'Support Tickets' },
      { href: '/admin/legal', icon: '⚖', label: 'Legal / Business', roles: ['SUPER_ADMIN', 'ADMIN', 'LEGAL'] },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/admin/health', icon: '💓', label: 'Platform Health', roles: ['SUPER_ADMIN'] },
      { href: '/admin/security', icon: '🔒', label: 'Security Center', roles: ['SUPER_ADMIN'] },
      { href: '/admin/audit', icon: '📋', label: 'Audit Logs', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { href: '/admin/settings', icon: '⚙️', label: 'Settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
]

interface Props {
  userRole: string
}

export default function AdminSidebar({ userRole }: Props) {
  const pathname = usePathname()

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  }

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      {/* Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SpyderSymbol size={24} />
          <div>
            <div className="admin-sidebar-logo">SPYDER<span>TECH</span></div>
            <div className="admin-sidebar-badge">COMMAND CENTER</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav" aria-label="Admin menu">
        {NAV.map(section => {
          const visibleItems = section.items.filter(canAccess)
          if (visibleItems.length === 0) return null

          return (
            <div key={section.label}>
              <div className="admin-nav-section-label">{section.label}</div>
              {visibleItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-item" style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 14 }}>🌐</span>
          <span style={{ fontSize: 12 }}>Ver sitio público</span>
        </Link>
        <Link href="/dashboard" className="admin-nav-item">
          <span style={{ fontSize: 14 }}>👤</span>
          <span style={{ fontSize: 12 }}>Portal cliente</span>
        </Link>
      </div>
    </aside>
  )
}
