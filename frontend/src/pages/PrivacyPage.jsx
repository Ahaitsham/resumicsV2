import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly when you:
• Create an account (name, email, password)
• Sign in with Google (name, email, Google ID)
• Build a resume (personal details, work history, education, skills)
• Make a payment (processed securely by Razorpay — we never store card details)

We also collect basic usage data (pages visited, features used) to improve the product.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to:
• Provide and improve the ResumeAI Pro service
• Generate AI-powered resume content using your input
• Process payments via Razorpay
• Send transactional emails (password reset, payment confirmation)
• Analyse usage patterns to improve features

We do not sell your data to third parties. Ever.`,
  },
  {
    title: '3. Data Storage & Security',
    content: `Your data is stored in a secure PostgreSQL database hosted on Neon (AWS infrastructure). All data in transit is encrypted using TLS/HTTPS. Passwords are hashed using bcrypt and are never stored in plain text.

Resume data is stored against your account and is only accessible to you when logged in.`,
  },
  {
    title: '4. Third-Party Services',
    content: `We use the following third-party services:
• Anthropic Claude AI — to generate resume content (your resume data is sent to their API for processing)
• Razorpay — for payment processing (governed by Razorpay's privacy policy)
• Google OAuth — for social login (governed by Google's privacy policy)
• Neon — for database hosting
• Vercel / Railway — for application hosting

Each provider has their own privacy policy which we encourage you to review.`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your account and resume data as long as your account is active. You can delete individual resumes from your dashboard at any time. To delete your entire account and all associated data, contact us at resumics@gmail.com and we will process the request within 7 business days.`,
  },
  {
    title: '6. Cookies',
    content: `We use localStorage (not traditional cookies) to store your session token and resume draft data on your device. This data stays on your device and is cleared when you log out. We do not use advertising cookies or tracking pixels.`,
  },
  {
    title: '7. Your Rights',
    content: `You have the right to:
• Access the personal data we hold about you
• Correct inaccurate data
• Request deletion of your data
• Export your resume data

To exercise any of these rights, email resumics@gmail.com`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this privacy policy from time to time. We will notify you of significant changes via email or a notice on the website. Continued use of the service after changes constitutes acceptance of the updated policy.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <section className="relative pt-32 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6 border border-brand-500/30">
            <Shield size={12} className="text-brand-400" />
            <span className="text-xs text-slate-400">Last updated: January 2025</span>
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Your privacy matters to us. Here's exactly what we collect, why, and how we protect it.</p>
        </div>
      </section>

      <section className="py-8 px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-4">
          {SECTIONS.map(({ title, content }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl border border-white/10 p-6"
            >
              <h2 className="font-display text-white font-semibold mb-3">{title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{content}</p>
            </motion.div>
          ))}
          <div className="glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-white font-semibold mb-2">Contact</h2>
            <p className="text-slate-400 text-sm">For any privacy-related questions, email us at <a href="mailto:resumics@gmail.com" className="text-brand-400 hover:text-brand-300">resumics@gmail.com</a></p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
