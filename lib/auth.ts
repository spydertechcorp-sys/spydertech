// lib/auth.ts — NextAuth.js v5 Configuration (Edge Runtime Compatible)
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { compare } from 'bcrypt-ts'
import { z } from 'zod'
import { createAuditLog } from '@/lib/audit'
import { checkRateLimit, incrementLoginAttempts, resetLoginAttempts } from '@/lib/security'
import { authConfig } from './auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  twoFactorCode: z.string().optional(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials, req) {
        try {
          const { email, password, twoFactorCode } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
          })

          if (!user || !user.passwordHash) return null

          if (user.lockedUntil && user.lockedUntil > new Date()) throw new Error('ACCOUNT_LOCKED')
          if (user.status === 'SUSPENDED') throw new Error('ACCOUNT_SUSPENDED')

          const isValid = await compare(password, user.passwordHash)
          if (!isValid) {
            await incrementLoginAttempts(user.id)
            return null
          }

          // Check 2FA if the user has one configured
          if (user.twoFactorCode) {
            if (!twoFactorCode || twoFactorCode !== user.twoFactorCode) {
              throw new Error('INVALID_2FA')
            }
          }

          await resetLoginAttempts(user.id)
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role?.name || 'CLIENT',
            emailVerified: user.emailVerified,
            status: user.status,
          }
        } catch (error) {
          if (error instanceof z.ZodError) return null
          throw error
        }
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      await createAuditLog({ userId: user.id!, action: 'AUTH_LOGIN', resource: 'session', result: 'SUCCESS' })
    },
    async signOut(event) {
      // NextAuth emits either a JWT or a database session depending on strategy.
      // Keep the audit trail without assuming the shape of the event payload.
      const token = (event as { token?: { id?: string } }).token
      if (token?.id) {
        await createAuditLog({ userId: token.id as string, action: 'AUTH_LOGOUT', resource: 'session', result: 'SUCCESS' })
      }
    },
  },
})

export { auth as getServerSession }
