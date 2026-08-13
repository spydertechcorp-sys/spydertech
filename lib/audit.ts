// lib/audit.ts — Audit Log System for SpyderTech 2.0

import { prisma } from '@/lib/db'

interface AuditLogInput {
  userId?: string
  businessId?: string
  action: string
  resource?: string
  resourceId?: string
  result?: 'SUCCESS' | 'FAILURE' | 'WARNING'
  details?: Record<string, any>
  ip?: string
  userAgent?: string
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        businessId: input.businessId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        result: input.result || 'SUCCESS',
        details: input.details ? JSON.stringify(input.details) : null,
      },
    })
  } catch (error) {
    // Audit log failures should never crash the application
    console.error('[AuditLog] Failed to create audit log:', error)
  }
}

// Predefined audit actions for consistency
export const AuditAction = {
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_LOGIN_FAILED: 'AUTH_LOGIN_FAILED',
  AUTH_PASSWORD_RESET: 'AUTH_PASSWORD_RESET',
  AUTH_EMAIL_VERIFIED: 'AUTH_EMAIL_VERIFIED',
  AUTH_2FA_ENABLED: 'AUTH_2FA_ENABLED',
  AUTH_2FA_DISABLED: 'AUTH_2FA_DISABLED',

  // Users
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  USER_ACTIVATED: 'USER_ACTIVATED',

  // Plans
  PLAN_CREATED: 'PLAN_CREATED',
  PLAN_UPDATED: 'PLAN_UPDATED',
  PLAN_DELETED: 'PLAN_DELETED',

  // Products
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',

  // Services
  SERVICE_CREATED: 'SERVICE_CREATED',
  SERVICE_UPDATED: 'SERVICE_UPDATED',
  SERVICE_DELETED: 'SERVICE_DELETED',

  // Promotions
  PROMOTION_CREATED: 'PROMOTION_CREATED',
  PROMOTION_UPDATED: 'PROMOTION_UPDATED',
  PROMOTION_DELETED: 'PROMOTION_DELETED',

  // Orders
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_UPDATED: 'ORDER_UPDATED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',

  // Settings
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',

  // Security
  SECURITY_SUSPICIOUS_ACTIVITY: 'SECURITY_SUSPICIOUS_ACTIVITY',
  SECURITY_ACCOUNT_LOCKED: 'SECURITY_ACCOUNT_LOCKED',

  // Menus
  MENU_CREATED: 'MENU_CREATED',
  MENU_UPDATED: 'MENU_UPDATED',
  MENU_PUBLISHED: 'MENU_PUBLISHED',

  // Content
  ARTICLE_CREATED: 'ARTICLE_CREATED',
  ARTICLE_PUBLISHED: 'ARTICLE_PUBLISHED',
  ARTICLE_DELETED: 'ARTICLE_DELETED',

  // Team
  TEAM_MEMBER_CREATED: 'TEAM_MEMBER_CREATED',
  TEAM_MEMBER_UPDATED: 'TEAM_MEMBER_UPDATED',
  TEAM_MEMBER_DELETED: 'TEAM_MEMBER_DELETED',
} as const
