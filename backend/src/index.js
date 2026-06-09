import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

// ── Startup validation ────────────────────────────────────────────
const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET']
const MISSING = REQUIRED_VARS.filter(
  v => !process.env[v] ||
       process.env[v].includes('REPLACE_ME') ||
       process.env[v].includes('user:password')
)
if (MISSING.length > 0) {
  console.warn('\n⚠️  WARNING: Missing or unconfigured env vars:', MISSING.join(', '))
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot start in production with missing env vars.')
    process.exit(1)
  }
}

const app = express()

app.set('trust proxy', 1)

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

// ── CORS — allow multiple origins ────────────────────────────────
// Supports localhost dev + deployed Vercel URL + any preview URLs
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
]

// Add production URL(s) from env
if (process.env.FRONTEND_URL) {
  // Support comma-separated list: "https://a.vercel.app,https://custom.com"
  process.env.FRONTEND_URL.split(',').forEach(url => {
    const trimmed = url.trim().replace(/\/$/, '') // remove trailing slash
    if (trimmed) ALLOWED_ORIGINS.push(trimmed)
  })
}

console.log('✅ CORS allowed origins:', ALLOWED_ORIGINS)

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, Railway health checks)
    if (!origin) return callback(null, true)
    // Strip trailing slash from incoming origin for comparison
    const clean = origin.replace(/\/$/, '')
    if (ALLOWED_ORIGINS.includes(clean)) {
      callback(null, true)
    } else {
      console.warn('🚫 CORS blocked origin:', origin)
      console.warn('   Allowed origins:', ALLOWED_ORIGINS)
      callback(new Error(`CORS: origin "${origin}" not allowed`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Handle preflight for all routes
app.options('*', cors())

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Rate limiting ─────────────────────────────────────────────────
const generalLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } })
const authLimit    = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  message: { error: 'Too many auth attempts' } })
const aiLimit      = rateLimit({ windowMs: 60 * 1000,       max: 10,  message: { error: 'AI rate limit exceeded' } })

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
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    allowedOrigins: ALLOWED_ORIGINS,
  })
})

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  // Don't leak CORS error details to client
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ error: 'Request blocked by CORS policy' })
  }
  console.error('❌ Error:', err.message)
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 Resumics backend on http://localhost:${PORT}`)
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health: http://localhost:${PORT}/api/health\n`)
})



process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})