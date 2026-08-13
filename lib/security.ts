// lib/security.ts — Security helpers for SpyderTech 2.0

import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { headers } from 'next/headers'

const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5')
const LOCKOUT_MINUTES = parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15')

// ─── Rate Limiting (in-memory for dev, use Redis in production) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(identifier: string, limit = 60): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

// ─── Login Attempt Tracking ───────────────────────────────────────
export async function incrementLoginAttempts(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const attempts = (user.loginAttempts || 0) + 1
  const shouldLock = attempts >= MAX_ATTEMPTS

  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: attempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
        : user.lockedUntil,
    },
  })

  await createAuditLog({
    userId,
    action: 'AUTH_LOGIN_FAILED',
    resource: 'session',
    result: 'FAILURE',
    details: { attempts, locked: shouldLock },
  })
}

export async function resetLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { loginAttempts: 0, lockedUntil: null },
  })
}

// ─── Password Hashing ─────────────────────────────────────────────
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}



// ─── IP Detection ─────────────────────────────────────────────────
export async function getClientIP(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    '127.0.0.1'
  )
}

// ─── Suspicious Activity Detection ───────────────────────────────
export async function detectSuspiciousActivity(
  userId: string,
  action: string,
  ip: string
): Promise<boolean> {
  // Check for rapid successive actions from same IP
  const key = `suspicious:${ip}:${action}`
  const isRateLimited = !checkRateLimit(key, 10) // 10 per minute max

  if (isRateLimited) {
    await createAuditLog({
      userId,
      action: 'SECURITY_SUSPICIOUS_ACTIVITY',
      resource: action,
      result: 'WARNING',
      details: { ip, reason: 'rate_limit_exceeded' },
    })
    return true
  }

  return false
}

// ─── UUID generation (non-sequential IDs) ────────────────────────
export { v4 as generateId } from 'uuid'

// ─── Input sanitization ───────────────────────────────────────────
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 10000) // Limit length
}

// ─── Validate file upload ─────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido. Solo se aceptan imágenes.' }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'El archivo supera el tamaño máximo de 10MB.' }
  }
  return { valid: true }
}
