// lib/db.ts — Prisma Client singleton
// Prevents multiple instances during hot reload in development

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

/*
// ─── CLOUDFLARE D1 (EDGE) SETUP ───
// To deploy to Cloudflare Pages, uncomment this section and comment the block above:
import { PrismaD1 } from '@prisma/adapter-d1'
export const getEdgePrisma = (env: any) => {
  const adapter = new PrismaD1(env.DB)
  return new PrismaClient({ adapter })
}
*/

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
