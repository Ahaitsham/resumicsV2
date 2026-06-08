import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { prisma } from '../index.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

let _razorpay = null
function getRazorpay() {
  if (!_razorpay) {
    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret || keyId.includes('REPLACE')) {
      throw new Error('Razorpay keys not configured in backend/.env')
    }
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return _razorpay
}

const PRICE_PAISE = 4900

// ── POST /api/payment/create-order ────────────────────────────────
router.post('/create-order', authenticate, async (req, res) => {
  console.log('\n💳 create-order called:', { resumeId: req.body.resumeId, userId: req.user?.id })

  try {
    const { resumeId } = req.body

    // 1. Validate resumeId
    if (!resumeId || resumeId === 'new' || resumeId === 'local') {
      return res.status(400).json({
        error: 'Resume must be saved to the database before payment. Please go back and save your resume first.',
      })
    }

    // 2. Find resume in DB
    let resume
    try {
      resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user.id },
      })
    } catch (dbErr) {
      console.error('❌ DB error (is DATABASE_URL set correctly?):', dbErr.message)
      return res.status(500).json({
        error: 'Database error: ' + dbErr.message + '. Check DATABASE_URL in backend/.env',
      })
    }

    if (!resume) {
      console.error('❌ Resume not found:', { resumeId, userId: req.user.id })
      return res.status(404).json({
        error: 'Resume not found. Please go back to the builder, save your resume, then try again.',
      })
    }

    if (resume.isPaid) {
      return res.status(400).json({ error: 'This resume is already paid for. You can download it now.' })
    }

    // 3. Create Razorpay order
    let order
    try {
      const razorpay = getRazorpay()
      const receipt  = `res_${resumeId.slice(-12)}_${Date.now().toString().slice(-6)}`
      order = await razorpay.orders.create({
        amount:   PRICE_PAISE,
        currency: 'INR',
        receipt,
        notes: { resumeId, userId: req.user.id },
      })
      console.log('✅ Razorpay order created:', order.id)
    } catch (rzpErr) {
      console.error('❌ Razorpay error:', rzpErr.error || rzpErr.message)
      return res.status(500).json({
        error: 'Razorpay error: ' + (rzpErr.error?.description || rzpErr.message),
      })
    }

    // 4. Save payment record (non-fatal if DB fails here)
    try {
      const existing = await prisma.payment.findUnique({ where: { resumeId } })
      if (existing) {
        await prisma.payment.update({
          where: { resumeId },
          data: { razorpayOrderId: order.id, status: 'PENDING' },
        })
      } else {
        await prisma.payment.create({
          data: {
            userId:          req.user.id,
            resumeId,
            razorpayOrderId: order.id,
            amount:          PRICE_PAISE,
            currency:        'INR',
            status:          'PENDING',
          },
        })
      }
    } catch (dbErr) {
      console.warn('⚠️  Could not save payment record (non-fatal):', dbErr.message)
    }

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('❌ create-order unexpected error:', err)
    res.status(500).json({ error: err.message || 'Failed to create payment order' })
  }
})

// ── POST /api/payment/verify ──────────────────────────────────────
router.post('/verify', authenticate, async (req, res) => {
  console.log('\n✅ verify called:', { orderId: req.body.razorpay_order_id, resumeId: req.body.resumeId })
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, resumeId } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !resumeId) {
      return res.status(400).json({ error: 'Missing required payment verification fields' })
    }

    // Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSig !== razorpay_signature) {
      console.error('❌ Signature mismatch')
      return res.status(400).json({ error: 'Payment signature verification failed.' })
    }

    // Update payment record
    try {
      const existing = await prisma.payment.findUnique({ where: { resumeId } })
      if (existing) {
        await prisma.payment.update({
          where: { resumeId },
          data: { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'COMPLETED' },
        })
      }
    } catch (dbErr) {
      console.warn('⚠️  Could not update payment record:', dbErr.message)
    }

    // Unlock resume
    try {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { isPaid: true, paymentId: razorpay_payment_id },
      })
      console.log('✅ Resume unlocked:', resumeId)
    } catch (dbErr) {
      console.error('❌ Could not unlock resume:', dbErr.message)
    }

    res.json({ success: true, message: 'Payment verified. Resume unlocked!' })
  } catch (err) {
    console.error('❌ verify unexpected error:', err)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

// ── GET /api/payment/history ──────────────────────────────────────
router.get('/history', authenticate, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      include: { resume: { select: { personalInfo: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ payments })
  } catch {
    res.status(500).json({ error: 'Failed to fetch payment history' })
  }
})

export default router
