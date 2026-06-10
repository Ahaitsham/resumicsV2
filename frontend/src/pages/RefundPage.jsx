import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, XCircle, Mail } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <section className="relative pt-32 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6 border border-brand-500/30">
            <RefreshCw size={12} className="text-brand-400" />
            <span className="text-xs text-slate-400">Simple & fair</span>
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-slate-400 max-w-xl mx-auto">We want you to be happy with your purchase. Here's exactly when and how refunds work.</p>
        </div>
      </section>

      <section className="py-8 px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Eligible */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-2xl border border-green-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-green-400" />
              <h2 className="font-display text-white font-semibold">You are eligible for a full refund if:</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Your PDF failed to download due to a technical error on our side',
                'You were charged but never received a download link or unlocked resume',
                'You were double-charged for the same resume',
                'A confirmed system error occurred during your payment',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not eligible */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-2xl border border-red-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={18} className="text-red-400" />
              <h2 className="font-display text-white font-semibold">Refunds are not provided for:</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Change of mind after downloading the PDF',
                'Dissatisfaction with AI-generated content (a free preview is always available before payment)',
                'Requests made more than 48 hours after purchase',
                'User errors such as entering incorrect information in the resume',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-white font-semibold mb-4">How to Request a Refund</h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Email us within 48 hours', desc: 'Send an email to support@resumeaipro.in with subject "Refund Request"' },
                { step: '02', title: 'Include your details', desc: 'Your registered email address, payment ID from Razorpay, and a brief description of the issue' },
                { step: '03', title: 'We review within 24 hours', desc: 'Our team reviews every request personally and responds within 1 business day' },
                { step: '04', title: 'Refund processed in 5–7 days', desc: 'Approved refunds are returned to your original payment method within 5–7 business days' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 font-mono text-xs">{step}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-0.5">{title}</p>
                    <p className="text-slate-400 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-2xl border border-brand-500/20 p-6 text-center">
            <Mail size={24} className="text-brand-400 mx-auto mb-3" />
            <h2 className="font-display text-white font-semibold mb-2">Questions about a refund?</h2>
            <p className="text-slate-400 text-sm mb-4">We're a small team and we care about every customer. Reach out and we'll make it right.</p>
            <a href="mailto:support@resumeaipro.in"
              className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-6">
              <Mail size={14} /> support@resumeaipro.in
            </a>
          </motion.div>

        </div>
      </section>
      <Footer />
    </div>
  )
}
