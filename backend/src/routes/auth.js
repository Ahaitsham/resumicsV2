import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../index.js'
import { generateToken, authenticate } from '../middleware/auth.js'
import { sendPasswordResetEmail } from '../services/email.js'

const router = express.Router()

// ── POST /api/auth/register ───────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (exists) return res.status(409).json({ error: 'Email already registered. Please log in.' })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashed },
    })

    const token = generateToken(user)
    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user || !user.password)
      return res.status(401).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' })

    const token = generateToken(user)
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

// ── POST /api/auth/google ─────────────────────────────────────────
// Frontend sends the Google OAuth access_token
// We use it to fetch the user's profile from Google's userinfo endpoint
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Google token required' })

    // Fetch Google profile using the access token
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!profileRes.ok) {
      return res.status(401).json({ error: 'Invalid Google token. Please try again.' })
    }

    const profile = await profileRes.json()
    const { sub: googleId, email, name, picture } = profile

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google account.' })
    }

    // Find existing user or create new one
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email: email.toLowerCase() }] },
    })

    if (!user) {
      // New user — create account
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          googleId,
          isVerified: true,
        },
      })
    } else if (!user.googleId) {
      // Existing email account — link Google ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      })
    }

    const jwtToken = generateToken(user)
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: jwtToken,
    })
  } catch (err) {
    console.error('Google auth error:', err)
    res.status(500).json({ error: 'Google authentication failed. Please try again.' })
  }
})

// ── POST /api/auth/forgot-password ───────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    // Always respond the same to prevent email enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      })

      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken)
      } catch (emailErr) {
        console.error('Email send error:', emailErr.message)
        // Don't fail the request if email fails — log it and continue
      }
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Failed to process request. Please try again.' })
  }
})

// ── POST /api/auth/reset-password ────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password)
      return res.status(400).json({ error: 'Token and password required' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' })

    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    })

    res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Password reset failed. Please try again.' })
  }
})

// ── GET /api/auth/profile ─────────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
