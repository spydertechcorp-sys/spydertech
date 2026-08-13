import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [], // Added in auth.ts (Node runtime)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.emailVerified = (user as any).emailVerified
        token.status = (user as any).status
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).emailVerified = token.emailVerified
        ;(session.user as any).status = token.status
      }
      return session
    },
  },
} satisfies NextAuthConfig
