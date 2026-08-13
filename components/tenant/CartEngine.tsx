'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CartItem {
  id: string // Should be unique combination of product id + modifiers
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  modifiers?: { name: string; price: number }[]
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  total: number
  itemCount: number
  openCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export function CartProvider({ children, business }: { children: ReactNode, business: any }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (newItem: CartItem) => {
    setItems((current) => {
      const existing = current.find(i => i.id === newItem.id)
      if (existing) {
        return current.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i)
      }
      return [...current, newItem]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string) => setItems(current => current.filter(i => i.id !== id))
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(current => current.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const sendOrderToWhatsApp = async () => {
    if (items.length === 0) return
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id, items: items.map(item => ({ productId: item.productId, quantity: item.quantity })) })
      })
      if (!response.ok) throw new Error('No se pudo registrar el pedido')
    } catch {
      alert('No pudimos registrar tu pedido. Revisa tu conexión e inténtalo de nuevo.')
      return
    }
    let text = `*NUEVO PEDIDO - ${business.name}*\n\n`
    items.forEach(item => {
      text += `*${item.quantity} × ${item.name}* - $${(item.price * item.quantity).toLocaleString()}\n`
      if (item.modifiers && item.modifiers.length > 0) {
        text += `  _Extras: ${item.modifiers.map(m => m.name).join(', ')}_\n`
      }
      text += `\n`
    })
    text += `*Total estimado: $${total.toLocaleString()}*\n\n¿Podrían confirmar mi pedido?`
    const phone = String(business.whatsapp || '').replace(/\D/g, '')
    if (!phone) { alert('Este negocio aún no ha configurado WhatsApp.'); return }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const openCart = () => setIsOpen(true)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, itemCount, openCart }}>
      {children}
      
      {/* ─── FLOATING CART TRIGGER ─── */}
      <AnimatePresence>
        {itemCount > 0 && !isOpen && (
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-12 right-12 z-40 bg-white text-black px-8 py-5 flex items-center gap-6 hover:scale-105 transition-transform"
            style={{ borderRadius: '0' }}
          >
            <span className="font-heading text-lg font-bold uppercase tracking-tight">Mi Pedido</span>
            <span className="bg-black-deep text-white px-2 py-0.5 text-xs font-mono">{itemCount}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── CART DRAWER (EDITORIAL) ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black-deep/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="relative w-full max-w-lg bg-black-deep border-l border-gray-subtle h-full flex flex-col shadow-2xl"
            >
              <header className="px-12 py-10 border-b border-gray-subtle flex justify-between items-center">
                <h2 className="font-heading text-4xl text-white uppercase tracking-tighter">Pedido</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-text hover:text-white transition-colors">
                  <span className="font-mono text-[10px] tracking-widest uppercase border-b border-gray-text pb-0.5 hover:border-white">Cerrar</span>
                </button>
              </header>
              
              <div className="flex-1 overflow-y-auto px-12 py-8 space-y-8 hide-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <p className="text-gray-text font-mono text-sm tracking-widest uppercase">Vacío</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-4 border-b border-gray-subtle pb-8 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-heading text-xl text-white mb-1">{item.name}</h4>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.modifiers.map(mod => (
                              <span key={mod.name} className="font-mono text-[10px] text-gray-text tracking-widest uppercase border border-gray-subtle px-2 py-0.5">
                                + {mod.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="font-mono text-gray-text text-sm">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black-surface border border-gray-subtle px-4 py-2 mt-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-text hover:text-white transition-colors text-lg font-mono leading-none">-</button>
                        <span className="w-4 text-center text-white font-mono text-sm leading-none">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-text hover:text-white transition-colors text-lg font-mono leading-none">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <footer className="p-12 border-t border-gray-subtle bg-black-surface">
                <div className="flex justify-between items-end mb-10">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-text">Total</span>
                  <span className="font-heading text-5xl text-white tracking-tighter">${total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={sendOrderToWhatsApp}
                  disabled={items.length === 0}
                  className="w-full py-6 bg-white text-black font-heading font-bold text-xl uppercase tracking-tighter hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar WhatsApp →
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}
