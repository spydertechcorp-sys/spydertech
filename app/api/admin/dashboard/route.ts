// app/api/admin/dashboard/route.ts — Dashboard metrics API

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalUsers,
      newUsersThisMonth,
      totalOrders,
      ordersThisMonth,
      activePromotions,
      recentActivity,
      usersByRole,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.promotion.count({ where: { isActive: true } }),
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.user.groupBy({
        by: ['roleId'],
        _count: true,
        where: { roleId: { not: null } },
      }),
    ])

    // Revenue from paid orders this month
    const revenueResult = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    })

    const revenueLastMonth = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
      _sum: { total: true },
    })

    return NextResponse.json({
      kpis: {
        totalUsers,
        newUsersThisMonth,
        totalOrders,
        ordersThisMonth,
        activePromotions,
        revenueThisMonth: revenueResult._sum.total || 0,
        revenueLastMonth: revenueLastMonth._sum.total || 0,
      },
      recentActivity: recentActivity.map(log => ({
        id: log.id,
        action: log.action,
        user: log.user?.name || 'Sistema',
        resource: log.resource,
        result: log.result,
        createdAt: log.createdAt,
      })),
    })
  }, 'MANAGER')
}
