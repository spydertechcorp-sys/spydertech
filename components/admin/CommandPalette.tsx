'use client'
// components/admin/CommandPalette.tsx — Ctrl+K Command Palette

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const COMMANDS = [
  // Navigation
  { id: 'dash',       label: 'Dashboard',             icon: '◈',  href: '/admin',              group: 'Navigate' },
  { id: 'users',      label: 'Users',                 icon: '👤', href: '/admin/users',         group: 'Navigate' },
  { id: 'clients',    label: 'Clients',               icon: '🏢', href: '/admin/clients',       group: 'Navigate' },
  { id: 'plans',      label: 'Plans',                 icon: '⚡', href: '/admin/plans',         group: 'Navigate' },
  { id: 'products',   label: 'Products',              icon: '🛒', href: '/admin/products',      group: 'Navigate' },
  { id: 'services',   label: 'Services',              icon: '🔧', href: '/admin/services',      group: 'Navigate' },
  { id: 'promotions', label: 'Promotions',            icon: '🎯', href: '/admin/promotions',    group: 'Navigate' },
  { id: 'ads',        label: 'Campaigns / Ads',       icon: '📣', href: '/admin/ads',           group: 'Navigate' },
  { id: 'crm',        label: 'CRM / Leads',           icon: '🧲', href: '/admin/crm',           group: 'Navigate' },
  { id: 'content',    label: 'Content / Blog',        icon: '✏️', href: '/admin/content',       group: 'Navigate' },
  { id: 'menus',      label: 'SpyderMenu',            icon: '📋', href: '/admin/menus',         group: 'Navigate' },
  { id: 'orders',     label: 'Orders',                icon: '📦', href: '/admin/orders',        group: 'Navigate' },
  { id: 'tickets',    label: 'Support Tickets',       icon: '🎫', href: '/admin/tickets',       group: 'Navigate' },
  { id: 'security',   label: 'Security Center',       icon: '🔒', href: '/admin/security',      group: 'Navigate' },
  { id: 'audit',      label: 'Audit Logs',            icon: '📋', href: '/admin/audit',         group: 'Navigate' },
  { id: 'analytics',  label: 'Analytics',             icon: '📊', href: '/admin/analytics',     group: 'Navigate' },
  { id: 'settings',   label: 'Settings',              icon: '⚙️', href: '/admin/settings',      group: 'Navigate' },
  // Create actions
  { id: 'new-plan',   label: 'New Plan',              icon: '➕', href: '/admin/plans/new',      group: 'Create' },
  { id: 'new-prod',   label: 'New Product',           icon: '➕', href: '/admin/products/new',   group: 'Create' },
  { id: 'new-promo',  label: 'New Promotion',         icon: '➕', href: '/admin/promotions/new', group: 'Create' },
  { id: 'new-ad',     label: 'New Campaign/Ad',       icon: '➕', href: '/admin/ads/new',        group: 'Create' },
  { id: 'new-art',    label: 'New Article',           icon: '➕', href: '/admin/content/new',    group: 'Create' },
  { id: 'new-menu',   label: 'New Menu (SpyderMenu)', icon: '➕', href: '/admin/menus/new',      group: 'Create' },
  { id: 'new-svc',    label: 'New Service',           icon: '➕', href: '/admin/services/new',   group: 'Create' },
  // Site
  { id: 'site',       label: 'View public site',      icon: '🌐', href: '/',                     group: 'Site' },
  { id: 'portal',     label: 'Client portal',         icon: '👤', href: '/dashboard',            group: 'Site' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.group.toLowerCase().includes(query.toLowerCase())
  )

  const groups = Array.from(new Set(filtered.map(c => c.group)))

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const execute = useCallback((cmd: typeof COMMANDS[0]) => {
    close()
    router.push(cmd.href)
  }, [close, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (!open) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowDown') setSelected(prev => Math.min(prev + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setSelected(prev => Math.max(prev - 1, 0))
      if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected])
    }

    const handleCustomEvent = () => setOpen(prev => !prev)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('toggle-command-palette', handleCustomEvent)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('toggle-command-palette', handleCustomEvent)
    }
  }, [open, filtered, selected, close, execute])

  if (!open) return null

  return (
    <div className="command-palette-overlay" onClick={close}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="command-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            className="command-input"
            placeholder="Search commands..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            autoFocus
            aria-label="Search commands"
          />
          <span className="kbd">ESC</span>
        </div>

        {/* Results */}
        <div className="command-results">
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No commands found for "{query}"
            </div>
          ) : (
            groups.map(group => {
              const groupItems = filtered.filter(c => c.group === group)
              const globalOffset = filtered.findIndex(c => c.group === group)

              return (
                <div key={group}>
                  <div className="command-group-label">{group}</div>
                  {groupItems.map((cmd, localIndex) => {
                    const globalIndex = globalOffset + localIndex
                    return (
                      <button
                        key={cmd.id}
                        className={`command-item ${globalIndex === selected ? 'selected' : ''}`}
                        onClick={() => execute(cmd)}
                        onMouseEnter={() => setSelected(globalIndex)}
                        style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div className="command-item-icon">{cmd.icon}</div>
                        <span className="command-item-label">{cmd.label}</span>
                        {globalIndex === selected && (
                          <span className="command-item-shortcut">
                            <span className="kbd">↵</span>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span><span className="kbd">↑↓</span> Navigate</span>
          <span><span className="kbd">↵</span> Open</span>
          <span><span className="kbd">ESC</span> Close</span>
        </div>
      </div>
    </div>
  )
}
