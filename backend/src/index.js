import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Load .env FIRST before anything else
dotenv.config()

// ── Startup validation ────────────────────────────────────────────
const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET']
const MISSING = REQUIRED_VARS.filter(
  v => !process.env[v] ||
       process.env[v].includes('REPLACE_ME') ||
       process.env[v].includes('user:password')
)
if (MISSING.length > 0) {
  console.warn('\n⚠️  WARNING: Missing or unconfigured environment variables:')
  MISSING.forEach(v => console.warn(`   - ${v}`))
  console.warn('   Edit backend/.env with your actual values.\n')
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot start in production with missing env vars. Exiting.')
    process.exit(1)
  }
}

const app = express()

// Prisma client (shared across routes)
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

// ── Middleware ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Rate limiting ─────────────────────────────────────────────────
const generalLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } })
const authLimit   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  message: { error: 'Too many auth attempts' } })
const aiLimit     = rateLimit({ windowMs: 60 * 1000,       max: 10,  message: { error: 'AI rate limit exceeded' } })

app.use('/api', generalLimit)
app.use('/api/auth', authLimit)
app.use('/api/ai', aiLimit)

// ── Routes ────────────────────────────────────────────────────────
import authRoutes    from './routes/auth.js'
import resumeRoutes  from './routes/resume.js'
import paymentRoutes from './routes/payment.js'
import aiRoutes      from './routes/ai.js'
import adminRoutes   from './routes/admin.js'

app.use('/api/auth',    authRoutes)
app.use('/api/resume',  resumeRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/ai',      aiRoutes)
app.use('/api/admin',   adminRoutes)

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() })
})

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ── Start server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 ResumeAI Pro backend running on http://localhost:${PORT}`)
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health: http://localhost:${PORT}/api/health\n`)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
