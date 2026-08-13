'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className="px-4 py-3 rounded-xl font-bold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:shadow-sm transition-all flex items-center gap-3 w-full text-left mt-auto"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Cerrar Sesión
    </button>
  )
}
