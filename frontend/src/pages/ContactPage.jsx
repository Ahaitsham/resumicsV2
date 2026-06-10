import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Clock, Send, Loader2, CheckCircle, Linkedin, Instagram } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Simple mailto fallback — replace with your email API if needed
    await new Promise(r => setTimeout(r, 1000))
    const mailto = `mailto:support@resumeaipro.in?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    window.location.href = mailto
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <section className="relative pt-32 pb-12 px-4">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-white mb-4">
            Get in Touch
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-slate-400">
            Have a question, feedback, or need help? We usually respond within a few hours.
          </motion.p>
        </div>
      </section>

      <section className="py-8 px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', value: 'support@resumeaipro.in', href: 'mailto:support@resumeaipro.in', desc: 'For support & refunds' },
              { icon: Clock, title: 'Response Time', value: 'Within 24 hours', href: null, desc: 'Mon–Sat, 9am–6pm IST' },
            ].map(({ icon: Icon, title, value, href, desc }) => (
              <motion.div key={title}
                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-white/10 p-5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-brand-400" />
                </div>
                <p className="text-slate-500 text-xs mb-0.5">{title}</p>
                {href
                  ? <a href={href} className="text-white text-sm font-medium hover:text-brand-300 transition-colors">{value}</a>
                  : <p className="text-white text-sm font-medium">{value}</p>
                }
                <p className="text-slate-600 text-xs mt-0.5">{desc}</p>
              </motion.div>
            ))}

            {/* Socials */}
            <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl border border-white/10 p-5">
              <p className="text-slate-500 text-xs mb-3">Follow us</p>
              <div className="space-y-2">
                <a href="https://www.linkedin.com/in/ahaitsham" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white text-sm transition-colors">
                  <Linkedin size={15} className="text-blue-400" /> LinkedIn
                </a>
                <a href="https://www.instagram.com/resumics" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white text-sm transition-colors">
                  <Instagram size={15} className="text-pink-400" /> @resumics
                </a>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 glass rounded-2xl border border-white/10 p-7">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <CheckCircle size={48} className="text-green-400 mb-4" />
                <h3 className="font-display text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm">Your email client should have opened. We'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Your Name</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Rahul Sharma" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Email Address</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="rahul@example.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Subject</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="input-field">
                    <option value="">Select a topic</option>
                    <option>Payment / Refund Issue</option>
                    <option>Technical Problem</option>
                    <option>Feature Request</option>
                    <option>Partnership / Business</option>
                    <option>General Feedback</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1.5">Message</label>
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue or question in detail..."
                    className="input-field min-h-[130px] resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60">
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {sending ? 'Opening mail...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
