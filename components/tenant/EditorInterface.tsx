'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EditorInterface({ business }: { business: any }) {
  const [activeTab, setActiveTab] = useState('BRANDING') // BRANDING, MENU, SETTINGS
  const [previewMode, setPreviewMode] = useState('DESKTOP') // DESKTOP, MOBILE

  // In a real app, this would use a form library and sync with the iframe via postMessage or a global store
  const [formData, setFormData] = useState({
    name: business.name,
    introText: business.introText || 'Hecho para comer. Diseñado para recordar.',
    videoUrl: business.videoUrl || '',
    theme: business.theme
  })

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error: ${error.error || 'No se pudo guardar'}`)
        return
      }

      alert('Borrador guardado exitosamente.')
    } catch (error) {
      alert('Error de conexión.')
    }
  }

  const handlePublish = async () => {
    await handleSave()
    // Refresh iframe or page
    window.location.reload()
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-black-deep">
      
      {/* ─── CONTROLS PANEL (LEFT) ─── */}
      <div className="w-[400px] flex-shrink-0 border-r border-gray-subtle flex flex-col bg-black-surface">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-subtle">
          <button 
            onClick={() => setActiveTab('BRANDING')}
            className={`flex-1 py-4 text-[10px] font-mono tracking-widest uppercase ${activeTab === 'BRANDING' ? 'text-white border-b border-white' : 'text-gray-muted hover:text-white'}`}
          >
            Marca
          </button>
          <button 
            onClick={() => setActiveTab('MENU')}
            className={`flex-1 py-4 text-[10px] font-mono tracking-widest uppercase ${activeTab === 'MENU' ? 'text-white border-b border-white' : 'text-gray-muted hover:text-white'}`}
          >
            Menú
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex-1 py-4 text-[10px] font-mono tracking-widest uppercase ${activeTab === 'SETTINGS' ? 'text-white border-b border-white' : 'text-gray-muted hover:text-white'}`}
          >
            Ajustes
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
          
          {activeTab === 'BRANDING' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-2">Nombre del Negocio</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black-deep border border-gray-subtle p-3 text-white font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-2">Frase de Introducción</label>
                <input 
                  type="text" 
                  value={formData.introText}
                  onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                  className="w-full bg-black-deep border border-gray-subtle p-3 text-white font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-2">URL del Video Background</label>
                <input 
                  type="text" 
                  value={formData.videoUrl}
                  placeholder="https://..."
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-black-deep border border-gray-subtle p-3 text-white font-mono text-xs focus:outline-none focus:border-accent"
                />
                <p className="mt-2 text-[10px] font-mono text-gray-muted">Se reproducirá en bucle detrás del logo inicial.</p>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-muted mb-2">Tema Base</label>
                <select 
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full bg-black-deep border border-gray-subtle p-3 text-white font-mono text-xs focus:outline-none focus:border-accent appearance-none"
                >
                  <option value="CINEMATIC">Cinematic</option>
                  <option value="MINIMAL">Minimal</option>
                  <option value="STREET">Street Food</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === 'MENU' && (
            <div className="text-center py-12 text-gray-muted font-mono text-xs">
              Módulo de menú en construcción. <br/><br/> Permite arrastrar y soltar categorías, cambiar precios y subir fotos.
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-subtle bg-black-surface flex gap-4">
          <button 
            onClick={handleSave}
            className="flex-1 py-3 border border-gray-subtle text-gray-text hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            Guardar Borrador
          </button>
          <button 
            onClick={handlePublish}
            className="flex-1 py-3 bg-white text-black hover:bg-accent font-mono font-bold text-[10px] uppercase tracking-widest transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* ─── LIVE PREVIEW PANEL (RIGHT) ─── */}
      <div className="flex-1 bg-black-deep flex flex-col">
        {/* Device Toggle */}
        <div className="h-14 border-b border-gray-subtle flex items-center justify-center gap-8">
          <button 
            onClick={() => setPreviewMode('DESKTOP')}
            className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${previewMode === 'DESKTOP' ? 'text-white' : 'text-gray-muted hover:text-white'}`}
          >
            Desktop
          </button>
          <button 
            onClick={() => setPreviewMode('MOBILE')}
            className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${previewMode === 'MOBILE' ? 'text-white' : 'text-gray-muted hover:text-white'}`}
          >
            Mobile
          </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden relative">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-subtle/20 to-black-deep pointer-events-none" />

          <motion.div 
            layout
            initial={false}
            animate={{ 
              width: previewMode === 'DESKTOP' ? '100%' : '390px',
              height: previewMode === 'DESKTOP' ? '100%' : '844px'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative bg-black-surface border border-gray-subtle shadow-2xl overflow-hidden ${previewMode === 'MOBILE' ? 'rounded-[3rem] border-[8px] border-gray-border' : 'rounded-lg'}`}
          >
            {/* In a real implementation, we pass ?preview=true or use a global store to instantly sync state */}
            <iframe 
              src={`/${business.slug}`} 
              className="w-full h-full border-0"
              title="Live Preview"
            />
          </motion.div>
        </div>
      </div>

    </div>
  )
}
