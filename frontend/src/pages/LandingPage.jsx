import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Sparkles, Target, Download, Star, ArrowRight, CheckCircle,
  Zap, Shield, TrendingUp, Clock, Users, Award, Brain,
  FileText, BarChart3, Briefcase, GraduationCap, Code, ChevronDown
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const STATS = [
  { value: '50,000+', label: 'Resumes Created', icon: FileText },
  { value: '3.2x', label: 'More Interviews', icon: TrendingUp },
  { value: '92%', label: 'ATS Pass Rate', icon: Target },
  { value: '4.9★', label: 'User Rating', icon: Star },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Content',
    description: 'Our AI rewrites your experience with strong action verbs, quantified results, and recruiter-friendly language automatically.',
    color: 'from-brand-500 to-purple-500',
  },
  {
    icon: Target,
    title: 'ATS Score Engine',
    description: 'Real-time ATS scoring tells you exactly what to fix before applying. Never get filtered out by bots again.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Briefcase,
    title: 'Job Description Match',
    description: 'Paste any JD and our AI instantly tailors your resume to match keywords and requirements for that specific role.',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: Download,
    title: 'Premium PDF Export',
    description: 'Download a perfectly formatted A4 PDF that looks stunning in print and digital format. Just ₹49.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and never shared with third parties. Build confidently.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Zap,
    title: 'Ready in 5 Minutes',
    description: 'Fill in your details, AI does the heavy lifting. From zero to interview-ready in under 5 minutes.',
    color: 'from-violet-500 to-brand-500',
  },
]

const TEMPLATES = [
  { name: 'Modern ATS', icon: Sparkles, tag: 'Most Popular', roles: 'All roles' },
  { name: 'Software Engineer', icon: Code, tag: 'Tech Focused', roles: 'Developers' },
  { name: 'Fresher Template', icon: GraduationCap, tag: 'Students', roles: 'Entry Level' },
  { name: 'Corporate Pro', icon: Briefcase, tag: 'Professional', roles: 'Mid-Senior' },
  { name: 'Business Analyst', icon: BarChart3, tag: 'Data & Analytics', roles: 'Analysts' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at TCS',
    text: 'My ATS score jumped from 42 to 89! Got 4 interview calls in the first week. This tool is a game changer.',
    avatar: 'PS',
    stars: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst at Infosys',
    text: 'As a fresher I had no idea how to write a resume. The AI transformed my experience into something professional.',
    avatar: 'RV',
    stars: 5,
  },
  {
    name: 'Anjali Mehta',
    role: 'Product Manager at Flipkart',
    text: 'The job description matching feature is insane. I tailor my resume for each company in 2 minutes now.',
    avatar: 'AM',
    stars: 5,
  },
]

const FAQS = [
  {
    q: 'What is ATS and why does it matter?',
    a: 'ATS (Applicant Tracking System) is software used by 98% of Fortune 500 companies to filter resumes. If your resume fails ATS, no human ever sees it. Our AI ensures your resume passes ATS filters.',
  },
  {
    q: 'Is ₹49 a monthly subscription?',
    a: "No! ₹49 is a one-time payment per resume download. You can preview your resume for free. Only pay when you're ready to download the final PDF.",
  },
  {
    q: 'How does the AI improve my resume?',
    a: 'Our AI rewrites your content using strong action verbs, quantifies achievements, fixes grammar, adds industry keywords, and structures everything in ATS-friendly format.',
  },
  {
    q: 'Can I use this if I\'m a fresher with no experience?',
    a: 'Absolutely! We have a dedicated Fresher Template. Our AI helps highlight your projects, internships, certifications, and education to make the strongest possible impression.',
  },
  {
    q: 'How many resumes can I create?',
    a: 'You can create unlimited resumes. Each download costs ₹49. Preview is always free.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-white/10 rounded-2xl transition-all duration-300 ${open ? 'border-brand-500/30 bg-brand-500/5' : 'hover:border-white/20'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="text-white font-medium text-sm">{q}</span>
        <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const num = parseInt(target.replace(/[^0-9]/g, ''))
    const duration = 2000
    const step = num / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, num)
      setCount(Math.floor(current))
      if (current >= num) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {target.includes(',') ? count.toLocaleString() : count}{target.includes('+') ? '+' : ''}{suffix}
    </span>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: `rgba(99,102,241,${Math.random() * 0.4 + 0.1})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                '--duration': `${Math.random() * 4 + 4}s`,
                '--delay': `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 mb-8 border border-brand-500/30"
          >
            <Sparkles size={14} className="text-brand-400" />
            <span className="text-sm text-slate-300">AI-Powered • ATS-Optimized • ₹49 per Download</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            Beat ATS.<br />
            <span className="gradient-text">Land Your Dream Job.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            India's smartest AI resume builder. Our AI rewrites, optimizes, and formats your resume to pass ATS filters and impress recruiters — in under 5 minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-4 flex items-center gap-2 neon-glow animate-bounce-gentle"
            >
              <Zap size={18} />
              Build My Resume — Free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="btn-secondary text-base px-8 py-4 flex items-center gap-2"
            >
              <Target size={16} />
              Check ATS Score Free
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-slate-500"
          >
            {['✓ No credit card required', '✓ Free preview always', '✓ Just ₹49 to download', '✓ 50,000+ resumes created'].map(item => (
              <span key={item} className="flex items-center gap-1">{item}</span>
            ))}
          </motion.div>

          {/* Floating resume mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="glass rounded-2xl border border-brand-500/20 p-1 shadow-2xl shadow-brand-500/10">
              <div className="bg-white rounded-xl p-6 text-left">
                {/* Mock Resume */}
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <div className="h-5 w-40 bg-slate-800 rounded mb-1.5" />
                    <div className="h-3 w-56 bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-48 bg-slate-200 rounded" />
                  </div>
                  <div className="ml-auto text-right">
                    <div className="px-3 py-1 bg-green-100 rounded-full">
                      <span className="text-green-700 text-xs font-bold">ATS Score: 94/100</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 mb-3">
                  <div className="h-2 w-24 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-100 rounded mb-1.5" />
                  <div className="h-2 w-5/6 bg-slate-100 rounded mb-1.5" />
                  <div className="h-2 w-4/5 bg-slate-100 rounded" />
                </div>
                <div className="border-t border-slate-100 pt-3 mb-3">
                  <div className="h-2 w-20 bg-slate-800 rounded mb-2" />
                  <div className="flex gap-2 flex-wrap">
                    {['React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="h-2 w-28 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-100 rounded mb-1" />
                  <div className="h-2 w-3/4 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-slate-500">Generated by AI in 47 seconds</span>
                <span className="text-xs text-brand-400 font-medium flex items-center gap-1">
                  <CheckCircle size={11} /> ATS Optimized
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02] py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Icon size={20} className="text-brand-400 mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-4"
            >
              <Sparkles size={12} className="text-brand-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Everything You Need</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-heading mb-4"
            >
              Built for the Indian Job Market
            </motion.h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every feature designed to help Indian students, freshers, and professionals compete and win.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:scale-[1.02] cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-display text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">3 Steps to Your Dream Job</h2>
            <p className="text-slate-400">Simple, fast, and incredibly effective</p>
          </div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Enter Your Details', desc: 'Fill in your education, experience, projects, and skills. Our smart forms make it easy.', icon: FileText },
              { step: '02', title: 'AI Enhances Everything', desc: 'Watch as our AI rewrites your content professionally, calculates your ATS score, and suggests improvements.', icon: Brain },
              { step: '03', title: 'Pay ₹49 & Download', desc: 'Preview your stunning resume for free. Pay just ₹49 to download the premium, print-ready PDF.', icon: Download },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start p-6 glass rounded-2xl border border-white/10 hover:border-brand-500/20 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-brand-400 font-mono text-xs mb-1">{step}</div>
                  <h3 className="font-display text-white font-semibold text-lg mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-4">5 ATS-Optimized Templates</h2>
            <p className="text-slate-400">Every template is recruiter-approved and 100% ATS compatible</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEMPLATES.map(({ name, icon: Icon, tag, roles }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center hover:border-brand-500/30 hover:scale-105 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={22} className="text-brand-400" />
                </div>
                <div className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full mb-2 inline-block">{tag}</div>
                <h3 className="text-white font-medium text-sm mb-1">{name}</h3>
                <p className="text-slate-500 text-xs">{roles}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-4">Real Results from Real Users</h2>
            <p className="text-slate-400">Join 50,000+ professionals who landed their dream jobs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, avatar, stars }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card hover:border-brand-500/20"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{name}</div>
                    <div className="text-slate-500 text-xs">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="section-heading mb-4">Simple, Honest Pricing</h2>
          <p className="text-slate-400 mb-10">No subscriptions. No hidden fees. Just results.</p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card border-brand-500/30 neon-glow relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
            </div>
            <div className="mb-6">
              <div className="text-slate-400 text-sm mb-2">Per Resume Download</div>
              <div className="flex items-end gap-2 justify-center">
                <span className="font-display text-6xl font-bold text-white">₹49</span>
                <span className="text-slate-500 mb-2 line-through text-lg">₹299</span>
              </div>
              <div className="text-green-400 text-sm">Save 84% — Limited Time Offer</div>
            </div>

            <div className="space-y-3 text-left mb-8">
              {[
                'AI-powered content enhancement',
                'ATS score & analysis',
                'Job description matching',
                '5 premium templates',
                'Unlimited edits before download',
                'Premium A4 PDF download',
                'Lifetime access to your resume',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Link to="/register" className="btn-primary w-full block text-center py-4 font-display text-base">
                Start Building — Free Preview ⚡
              </Link>
              <p className="text-slate-500 text-xs">Free to build & preview • Pay ₹49 only to download</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-heading text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}
          >
            <div className="absolute inset-0 border border-brand-500/20 rounded-3xl" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Your Dream Job Is Waiting
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Don't let a weak resume hold you back. Build your ATS-optimized resume today.
              </p>
              <div className="flex items-center gap-2 justify-center mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm text-green-400">147 people building resumes right now</span>
              </div>
              <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                <Zap size={20} />
                Build My Resume Free
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
