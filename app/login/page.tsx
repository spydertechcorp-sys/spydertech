'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SpyderSymbol from '@/components/SpyderSymbol'

function LoginForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirect = searchParams?.get('redirect') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLockedOut) return
    
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        ...(step === 2 && { twoFactorCode }),
        redirect: false,
      })

      if (result?.error) {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)

        if (newAttempts >= 3) {
          setIsLockedOut(true)
          setError('ALERTA DE SEGURIDAD: LÍMITE DE INTENTOS EXCEDIDO. DESCONECTANDO...')
          setTimeout(() => {
            window.location.href = 'https://google.com'
          }, 3000)
          return
        }

        if (result.error === 'INVALID_2FA') {
          if (step === 1) {
            setStep(2) // Move to 2FA screen
            setFailedAttempts(0) // Reset attempts on successful password check
            setError('')
          } else {
            setError('Código de seguridad incorrecto.')
          }
        } else if (result.error === 'ACCOUNT_LOCKED') {
          setError('Tu cuenta está bloqueada temporalmente.')
        } else if (result.error === 'ACCOUNT_SUSPENDED') {
          setError('Tu cuenta ha sido suspendida. Contacta al administrador.')
        } else {
          setError('Credenciales incorrectas.')
        }
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      if (!isLockedOut && failedAttempts + 1 < 3) {
        setLoading(false)
      }
    }
  }

  if (isLockedOut) {
    return (
      <div className="min-h-screen w-full bg-red-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-red-900/50 animate-pulse pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-bounce">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white uppercase tracking-widest text-balance">
            Acceso Denegado
          </h1>
          <p className="font-mono text-red-300 font-bold uppercase tracking-[0.2em] max-w-md">
            Múltiples intentos fallidos detectados. Por motivos de seguridad, su conexión está siendo terminada.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0c1015] text-white flex overflow-hidden font-body selection:bg-blue-500/30">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-[blob_10s_infinite_alternate]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-[blob_12s_infinite_alternate-reverse]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full h-screen">
        
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-24 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-4 group w-max">
              <SpyderSymbol size={40} color="#3b82f6" className="group-hover:scale-110 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">SPYDERTECH</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Global Ecosystem</span>
              </div>
            </Link>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <h1 className="font-heading text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-white drop-shadow-lg">
              Bienvenido al <br/>Centro de Control
            </h1>
            <p className="font-mono text-sm uppercase tracking-widest text-blue-400 font-bold max-w-sm">
              Acceso restringido. Uso exclusivo para personal autorizado de SpyderTech y Propietarios de Negocios.
            </p>
          </div>

          <div className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistemas Operativos en Línea
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 lg:p-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-[#121822]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center justify-center gap-3 mb-10">
              <SpyderSymbol size={32} color="#3b82f6" />
              <div className="flex flex-col text-center">
                <span className="font-heading text-xl font-bold tracking-tight text-white">SPYDERTECH</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
              <h2 className="font-heading text-3xl font-bold text-white">
                {step === 1 ? 'Iniciar Sesión' : 'Verificación 2FA'}
              </h2>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                {step === 1 ? 'Ingresa tus credenciales de acceso' : 'Ingresa el código de seguridad (Ej: 0816)'}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-8">
                <p className="font-mono text-xs uppercase tracking-wider text-red-300 font-bold text-center drop-shadow-md">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {step === 1 ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-gray-300 font-bold ml-1">Correo Electrónico</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-body text-sm"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-gray-300 font-bold ml-1">Contraseña</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-body text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gray-300 font-bold ml-1">Código Doble Factor (2FA)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:bg-purple-500/10 transition-all font-body text-sm tracking-widest font-bold"
                      placeholder="0816"
                    />
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-[10px] text-gray-400 font-mono uppercase tracking-widest text-left mt-2 hover:text-white">← Volver</button>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-50 overflow-hidden mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? 'Verificando...' : (step === 1 ? 'Continuar →' : 'Verificar y Entrar')}
              </button>

            </form>

            <div className="mt-8 text-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-600">
                Solo el administrador puede crear nuevas cuentas.
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c1015]" />}>
      <LoginForm />
    </Suspense>
  )
}
