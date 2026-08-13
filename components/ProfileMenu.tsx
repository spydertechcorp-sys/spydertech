'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface ProfileMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono font-bold text-sm uppercase">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-text hidden md:block">
          {user?.name?.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-12 w-64 bg-black-surface border border-gray-subtle shadow-2xl z-50"
            >
              <div className="p-4 border-b border-gray-subtle">
                <div className="font-mono text-xs text-white truncate">{user?.name}</div>
                <div className="font-mono text-[10px] text-gray-muted truncate mt-1">{user?.email}</div>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <Link href="/dashboard" className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-gray-text hover:text-white hover:bg-black-deep transition-colors w-full text-left">
                  Mi Perfil
                </Link>
                <Link href="/dashboard/settings" className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-gray-text hover:text-white hover:bg-black-deep transition-colors w-full text-left">
                  Configuración
                </Link>
              </div>
              <div className="p-2 border-t border-gray-subtle">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-white hover:bg-accent transition-colors w-full text-left"
                >
                  Cerrar Sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
