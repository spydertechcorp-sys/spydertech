// app/layout.tsx — Root Layout for SpyderTech 2.0

import type { Metadata, Viewport } from 'next'
import Preloader from '@/components/ui/Preloader'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SpyderTech — BUILD. GROW. PROTECT.',
    template: '%s · SpyderTech',
  },
  description: 'Digital Growth Company. Tecnología, Marketing, Marca y Estrategia Empresarial para hacer crecer tu negocio.',
  keywords: ['desarrollo web', 'marketing digital', 'SEO', 'branding', 'hosting', 'Colombia', 'SpyderTech'],
  authors: [{ name: 'SpyderTech', url: 'https://spydertech.online' }],
  creator: 'SpyderTech',
  publisher: 'SpyderTech',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://spydertech.online',
    siteName: 'SpyderTech',
    title: 'SpyderTech — BUILD. GROW. PROTECT.',
    description: 'Digital Growth Company. Tecnología, Marketing, Marca y Estrategia Empresarial para hacer crecer tu negocio.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpyderTech — BUILD. GROW. PROTECT.',
    description: 'Digital Growth Company. Tecnología, Marketing, Marca y Estrategia Empresarial.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#faf9f7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
