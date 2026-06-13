import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, ArrowLeft, Loader2, CheckCircle, Lock,
  CreditCard, Shield, Zap, Target, Edit, AlertCircle, RefreshCw
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { ResumeTemplate } from '../components/resume/ResumeTemplates'
import { useResumeStore, useAuthStore } from '../store'
import { paymentAPI, resumeAPI } from '../lib/api'
import { generatePDF } from '../lib/pdfGenerator.jsx'
import toast from 'react-hot-toast'

// Load the Razorpay checkout.js script once and cache the promise
let razorpayScriptPromise = null
function loadRazorpayScript() {
  if (razorpayScriptPromise) return razorpayScriptPromise
  razorpayScriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => {
      razorpayScriptPromise = null // allow retry
      reject(new Error('Failed to load Razorpay. Check your internet connection.'))
    }
    document.body.appendChild(script)
  })
  return razorpayScriptPromise
}

export default function PreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getResumeData, selectedTemplate, atsScore, isPaid, setPaymentStatus } = useResumeStore()
  const { user } = useAuthStore()

  const [loading, setLoading]               = useState(false)
  const [showPayModal, setShowPayModal]     = useState(false)
  const [payLoading, setPayLoading]         = useState(false)
  const [resumeData, setResumeData]         = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [payError, setPayError]             = useState('')

  // ── Load resume from backend (or use local store data) ────────
  useEffect(() => {
    const localData = getResumeData()
    setResumeData(localData)
    if (id && id !== 'new' && id !== 'local') loadResume(id)
  }, [id])

  const loadResume = async (resumeId) => {
    setLoading(true)
    try {
      const res = await resumeAPI.get(resumeId)
      setResumeData(res.data.resume)
      if (res.data.resume.isPaid) setPaymentStatus(true, res.data.resume.paymentId)
    } catch {
      // fallback to local store data silently
    } finally {
      setLoading(false)
    }
  }

  // ── Razorpay checkout flow ────────────────────────────────────
  const handleRazorpay = useCallback(async () => {
    setPayError('')
    setPayLoading(true)

    try {
      // Step 1 — load the Razorpay checkout script
      await loadRazorpayScript()

      // Step 2 — create an order on our backend
      const orderRes = await paymentAPI.createOrder(id)
      const { orderId, amount, currency, keyId } = orderRes.data

      if (!orderId) throw new Error('Failed to create order. Please try again.')

      // Step 3 — open Razorpay modal
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,          // in paise
        currency,        // INR
        name: 'Resumics',
        description: 'ATS-Optimized Resume — ₹49',
        image: '/favicon.svg',
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '',
        },
        notes: { resumeId: id },
        theme: { color: '#4F46E5' },

        // Show international cards block explicitly
        config: {
          display: {
            blocks: {
              international: {
                name: 'Pay with International Card',
                instruments: [{ method: 'card' }],
              },
            },
            sequence: ['block.international'],
            preferences: { show_default_blocks: true },
          },
        },

        // ✅ Payment success handler
        handler: async (response) => {
          try {
            // Verify signature on backend before unlocking
            await paymentAPI.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              resumeId: id,
            })

            setPaymentStatus(true, response.razorpay_payment_id)
            setShowPayModal(false)
            toast.success('🎉 Payment successful! Preparing your download...')
            // Auto-download after 1 second
            setTimeout(() => handleDownload(true), 1200)
          } catch (verifyErr) {
            const msg = verifyErr.response?.data?.error || 'Payment verification failed. Contact support@resumeaipro.in'
            setPayError(msg)
            toast.error(msg)
          }
        },

        modal: {
          // User closed the modal without paying
          ondismiss: () => {
            setPayLoading(false)
            toast('Payment cancelled. Your resume is still saved.', { icon: 'ℹ️' })
          },
          // Escape key or backdrop closes modal
          escape: true,
          animation: true,
        },
      }

      const rzp = new window.Razorpay(options)

      // ✅ payment.failed event
      rzp.on('payment.failed', (response) => {
        const reason = response.error?.description || response.error?.reason || 'Payment failed'
        const code   = response.error?.code || ''
        const msg    = `Payment failed: ${reason}${code ? ` (${code})` : ''}. Please try again.`
        setPayError(msg)
        toast.error(msg)
        setPayLoading(false)
      })

      rzp.open()
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Could not initiate payment.'
      setPayError(msg)
      toast.error(msg)
      setPayLoading(false)
    }
  }, [id, user, setPaymentStatus])

  // ── PDF download ──────────────────────────────────────────────
  const handleDownload = useCallback(async (paid = false) => {
    if (!isPaid && !paid) {
      setShowPayModal(true)
      return
    }
    setDownloadLoading(true)
    try {
      const name = resumeData?.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'
      // Pass resumeData for vector PDF generation (real text, not image)
      await generatePDF('resume-preview', `${name}_ResumeAIPro.pdf`, resumeData)
      toast.success('Resume downloaded! ✅')
    } catch (err) {
      toast.error('PDF generation failed. Please try again.')
      console.error('PDF error:', err)
    } finally {
      setDownloadLoading(false)
    }
  }, [isPaid, resumeData])

  // Is this a local-only preview (DB not configured)?
  const isLocal = !id || id === 'local' || id === 'new'

  const scoreColor = atsScore >= 80 ? 'text-green-400 border-green-500/30 bg-green-500/10'
                   : atsScore >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                   : 'text-red-400 border-red-500/30 bg-red-500/10'

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* ── Top toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} /> Back to Edit
            </button>
            {atsScore && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${scoreColor}`}>
                <Target size={11} /> ATS: {atsScore}/100
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
              <Edit size={13} /> Edit
            </button>
            <button
              onClick={() => handleDownload()}
              disabled={downloadLoading}
              className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 disabled:opacity-60"
            >
              {downloadLoading
                ? <Loader2 size={14} className="animate-spin" />
                : isPaid ? <Download size={14} /> : <Lock size={14} />
              }
              {isPaid
                ? (downloadLoading ? 'Downloading...' : 'Download PDF')
                : 'Download — ₹49'
              }
            </button>
          </div>
        </div>

        {/* ── No-DB warning banner ── */}
        {isLocal && (
          <div className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-sm font-medium">Resume not saved to database</p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                Payment requires a saved resume. Set <code className="bg-amber-500/10 px-1 rounded">DATABASE_URL</code> in <code className="bg-amber-500/10 px-1 rounded">backend/.env</code> and restart the server, then rebuild your resume.
              </p>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Resume preview */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-96 glass rounded-2xl border border-white/10">
                <div className="text-center">
                  <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Loading resume...</p>
                </div>
              </div>
            ) : (
              <div className={`shadow-2xl rounded-xl overflow-hidden border border-white/5 ${!isPaid ? 'resume-watermark' : ''}`}>
                <ResumeTemplate
                  template={selectedTemplate}
                  data={resumeData}
                  watermark={!isPaid}
                />
              </div>
            )}
            {!isPaid && (
              <p className="text-center text-slate-600 text-xs mt-3">
                Watermark removed after payment
              </p>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-4">

            {/* Payment / Download card */}
            <div className="glass rounded-2xl border border-white/10 p-5">
              {isPaid ? (
                <div className="text-center">
                  <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                  <h3 className="font-display text-white font-bold text-lg mb-1">Payment Complete!</h3>
                  <p className="text-slate-400 text-xs mb-5">Your premium PDF is ready — no watermark</p>
                  <button
                    onClick={() => handleDownload(true)}
                    disabled={downloadLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
                  >
                    {downloadLoading
                      ? <Loader2 size={15} className="animate-spin" />
                      : <Download size={15} />
                    }
                    {downloadLoading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={() => handleDownload(true)}
                    className="mt-2 text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={11} /> Download again
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <div className="text-4xl font-display font-bold text-white mb-0.5">₹49</div>
                    <div className="text-slate-500 text-sm line-through">₹299</div>
                    <div className="inline-block mt-1 px-3 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
                      Save 84% — Limited Offer
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {[
                      'Remove watermark instantly',
                      'Premium A4 PDF — print ready',
                      'Perfect formatting guaranteed',
                      'Lifetime access to this resume',
                      'Re-download anytime',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle size={13} className="text-green-400 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { setPayError(''); setShowPayModal(true) }}
                    disabled={isLocal}
                    title={isLocal ? 'Save your resume first (requires database)' : ''}
                    className="btn-primary w-full py-4 font-display font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={16} />
                    {isLocal ? 'Save Resume First to Pay' : 'Pay ₹49 & Download'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <Shield size={11} className="text-slate-500" />
                    <span className="text-slate-500 text-xs">Secured by Razorpay · UPI · Cards · Netbanking</span>
                  </div>
                </>
              )}
            </div>

            {/* ATS score card */}
            {atsScore && (
              <div className="glass rounded-2xl border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={14} className="text-brand-400" />
                  <span className="text-white text-sm font-semibold">ATS Score</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs">Overall</span>
                  <span className={`font-bold text-sm ${atsScore >= 80 ? 'text-green-400' : atsScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                    {atsScore} / 100
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${atsScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {atsScore >= 80
                    ? '🎉 Excellent! Highly optimized for ATS systems.'
                    : atsScore >= 60
                    ? '⚡ Good. Use AI Enhance in the builder to push above 80.'
                    : '⚠️ Needs work. Go back and fill more sections + use AI Enhance.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAYMENT MODAL
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => !payLoading && setShowPayModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm glass rounded-2xl border border-brand-500/30 overflow-hidden shadow-2xl shadow-brand-500/10"
            >
              {/* Top gradient bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-400" />

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
                    <Zap size={26} className="text-brand-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    Unlock Your Resume
                  </h3>
                  <p className="text-slate-400 text-sm">One-time payment • No subscription • No hidden fees</p>
                </div>

                {/* Order summary */}
                <div className="p-4 glass rounded-xl border border-white/8 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">ATS-Optimized Resume PDF</p>
                      <p className="text-slate-500 text-xs mt-0.5">Watermark removed • Print ready</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">₹49</p>
                      <p className="text-slate-600 text-xs line-through">₹299</p>
                    </div>
                  </div>
                </div>

                {/* Feature list */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {['No watermark', 'A4 PDF format', 'Instant download', 'Download forever'].map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <CheckCircle size={11} className="text-green-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>

                {/* Error display */}
                {payError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-xs leading-relaxed">{payError}</p>
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handleRazorpay}
                  disabled={payLoading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-display font-semibold text-base mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {payLoading
                    ? <Loader2 size={17} className="animate-spin" />
                    : <CreditCard size={17} />
                  }
                  {payLoading ? 'Opening Razorpay...' : 'Pay ₹49 via Razorpay'}
                </button>

                {/* Security note */}
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mb-2">
                  <Shield size={11} />
                  <span>256-bit SSL · UPI · Debit/Credit Card · Netbanking · Wallets</span>
                </div>

                {/* Cancel */}
                {!payLoading && (
                  <button
                    onClick={() => setShowPayModal(false)}
                    className="w-full text-center text-slate-600 hover:text-slate-400 text-xs py-1 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
