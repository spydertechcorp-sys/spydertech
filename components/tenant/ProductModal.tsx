'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCart } from './CartEngine'

export default function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    const cartItemId = product.id

    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Product Panel (Fullscreen mobile, Drawer desktop) */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full md:w-[600px] h-full bg-black-deep border-l border-gray-subtle shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
        >
          ✕
        </button>

        {/* Hero Image */}
        <div className="relative w-full h-[40vh] md:h-[50vh] flex-shrink-0">
          {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[radial-gradient(circle_at_70%_20%,#f5b552,transparent_20%),linear-gradient(135deg,#7c2d12,#1c0d08)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/20 to-transparent" />
        </div>

        {/* Content Scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-6 hide-scrollbar relative z-10 -mt-12">
          
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter text-white">
              {product.name}
            </h2>
            <span className="font-mono text-xl font-bold text-accent mt-2">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="font-mono text-gray-text text-sm leading-relaxed mb-12">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center justify-between border-t border-b border-gray-subtle py-6 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-white">Cantidad</span>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-subtle flex items-center justify-center text-white hover:border-white transition-colors"
              >
                -
              </button>
              <span className="font-mono text-lg text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-subtle flex items-center justify-center text-white hover:border-white transition-colors"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-6 bg-black-surface border-t border-gray-subtle flex-shrink-0">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-5 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors flex justify-between px-8 items-center"
          >
            <span>Agregar al pedido</span>
            <span>{formatPrice(product.price * quantity)}</span>
          </button>
        </div>

      </motion.div>
    </div>
  )
}
