import express from 'express'
import { prisma } from '../index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate, requireAdmin)

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalUsers, newUsersToday, totalResumes, resumesToday, paymentsData, paymentsTodayData, totalDownloads, downloadsToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.resume.count(),
      prisma.resume.count({ where: { createdAt: { gte: today } } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: today } }, _sum: { amount: true } }),
      prisma.resume.count({ where: { isPaid: true } }),
      prisma.resume.count({ where: { isPaid: true, updatedAt: { gte: today } } }),
    ])

    res.json({
      totalUsers,
      newUsersToday,
      totalResumes,
      resumesToday,
      totalRevenue: paymentsData._sum.amount || 0,
      revenueToday: paymentsTodayData._sum.amount || 0,
      totalPayments: paymentsData._count,
      totalDownloads,
      downloadsToday,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 20
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { resumes: true, payments: true } },
      },
    })
    const total = await prisma.user.count()
    res.json({ users, total, page, pages: Math.ceil(total / limit) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 20
    const payments = await prisma.payment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        resume: { select: { personalInfo: true } },
      },
    })
    const total = await prisma.payment.count()
    res.json({ payments, total, page, pages: Math.ceil(total / limit) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

// GET /api/admin/revenue
router.get('/revenue', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const payments = await prisma.payment.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })

    // Group by day
    const dailyRevenue = {}
    payments.forEach(p => {
      const day = p.createdAt.toISOString().split('T')[0]
      dailyRevenue[day] = (dailyRevenue[day] || 0) + p.amount
    })

    res.json({ dailyRevenue, payments })
  } catch {
    res.status(500).json({ error: 'Failed to fetch revenue data' })
  }
})

export default router
