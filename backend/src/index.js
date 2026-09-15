import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import authRoutes from './routes/auth.js'
import resumeRoutes from './routes/resume.js'
import paymentRoutes from './routes/payment.js'
import aiRoutes from './routes/ai.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

// ─────────────────────────────────────────────────────────────
// Startup validation
// ─────────────────────────────────────────────────────────────

const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET']

const MISSING = REQUIRED_VARS.filter(
  (v) =>
    !process.env[v] ||
    process.env[v].includes('REPLACE_ME') ||
    process.env[v].includes('user:password')
)

if (MISSING.length > 0) {
  console.warn(
    '\n⚠️ WARNING: Missing or unconfigured env vars:',
    MISSING.join(', ')
  )

  if (process.env.NODE_ENV === 'production') {
    console.error(
      '❌ Cannot start in production with missing env vars.'
    )

    process.exit(1)
  }
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────

const app = express()

app.set('trust proxy', 1)

// ─────────────────────────────────────────────────────────────
// Prisma
// ─────────────────────────────────────────────────────────────

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['warn', 'error']
      : ['error'],
})

// ─────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'https://www.resumics.online',
]

// Add FRONTEND_URL from environment variables
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean)
    .forEach((url) => {
      if (!ALLOWED_ORIGINS.includes(url)) {
        ALLOWED_ORIGINS.push(url)
      }
    })
}

console.log('✅ CORS allowed origins:', ALLOWED_ORIGINS)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin header
    // Example: Postman, curl, server-to-server requests
    if (!origin) {
      return callback(null, true)
    }

    const cleanOrigin = origin.replace(/\/$/, '')

    if (ALLOWED_ORIGINS.includes(cleanOrigin)) {
      return callback(null, true)
    }

    console.warn('🚫 CORS blocked origin:', origin)
    console.warn('Allowed origins:', ALLOWED_ORIGINS)

    return callback(
      new Error(`CORS: origin "${origin}" not allowed`)
    )
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

// Explicit preflight handling
app.options('*', cors(corsOptions))

// ─────────────────────────────────────────────────────────────
// Security
// ─────────────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

// ─────────────────────────────────────────────────────────────
// Logging
// ─────────────────────────────────────────────────────────────

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
)

// ─────────────────────────────────────────────────────────────
// Body parsing
// ─────────────────────────────────────────────────────────────

app.use(
  express.json({
    limit: '10mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
  })
)

// ─────────────────────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────────────────────

const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: 'Too many requests',
  },
})

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: 'Too many auth attempts',
  },
})

const aiLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'AI rate limit exceeded',
  },
})

app.use('/api', generalLimit)
app.use('/api/auth', authLimit)
app.use('/api/ai', aiLimit)

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/admin', adminRoutes)

// ─────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: ALLOWED_ORIGINS,
  })
})

// ─────────────────────────────────────────────────────────────
// 404
// ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  })
})

// ─────────────────────────────────────────────────────────────
// Global error handler
// ─────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)

  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({
      error: 'Request blocked by CORS policy',
    })
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',

    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
})

// ─────────────────────────────────────────────────────────────
// Local / Railway server
// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `\n🚀 Resumics backend running on port ${PORT}`
    )

    console.log(
      `   Mode: ${process.env.NODE_ENV || 'development'}`
    )

    console.log(
      `   Health: http://localhost:${PORT}/api/health\n`
    )
  })
}

// ─────────────────────────────────────────────────────────────
// Graceful shutdown
// ─────────────────────────────────────────────────────────────

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing Prisma connection...')

  await prisma.$disconnect()

  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing Prisma connection...')

  await prisma.$disconnect()

  process.exit(0)
})

// ─────────────────────────────────────────────────────────────
// Vercel export
// ─────────────────────────────────────────────────────────────

export default app