import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Linkedin, Instagram, MapPin, Code2, Lightbulb, Rocket, ArrowRight, Heart } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const TIMELINE = [
  {
    year: '2020',
    title: 'First Startup Idea',
    desc: 'Started exploring the world of entrepreneurship, building small products and learning what it takes to ship real software.',
    icon: Lightbulb,
  },
  {
    year: '2022',
    title: 'Deep Dive into Full Stack',
    desc: 'Mastered React, Node.js, and cloud infrastructure. Built and shipped multiple projects that real users depend on.',
    icon: Code2,
  },
  {
    year: '2024',
    title: 'Built Resumics (Resumics)',
    desc: 'Noticed how many talented people in India were getting rejected by ATS before a human ever saw their resume. Built the fix.',
    icon: Rocket,
  },
]

const STATS = [
  { value: '50,000+', label: 'Resumes Created' },
  { value: '92%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'More Interviews' },
  { value: '₹49', label: 'Per Download' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6 border border-brand-500/30"
          >
            <Heart size={12} className="text-red-400" />
            <span className="text-xs text-slate-400">Built with passion in India</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight"
          >
            The Story Behind<br />
            <span className="gradient-text">Resumics</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A product born from a simple observation — too many talented Indian
            professionals were being filtered out before a recruiter ever read their name.
          </motion.p>
        </div>
      </section>

      {/* ── Founder card ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo side */}
              <div className="relative bg-gradient-to-br from-brand-900/60 to-slate-900 p-10 flex flex-col items-center justify-center text-center">
                {/* Glow ring */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl scale-110" />
                  <img
                    src="https://res.cloudinary.com/dglmkbwr3/image/upload/v1781062979/4510b943-496c-41a2-9273-4f2260043979_2_luqswp.jpg"
                    alt="Ahaitsham Khan — Founder, Resumics"
                    className="relative w-44 h-44 rounded-2xl object-cover border-2 border-brand-500/40 shadow-2xl shadow-brand-500/20"
                    loading="lazy"
                  />
                </div>

                <h2 className="font-display text-2xl font-bold text-white mb-1">Ahaitsham Khan</h2>
                <p className="text-brand-400 text-sm font-medium mb-1">Founder & Full Stack Developer</p>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-6">
                  <MapPin size={11} />
                  <span>Greater Noida, Uttar Pradesh</span>
                </div>

                {/* Socials */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/ahaitsham"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass-light rounded-xl text-sm text-slate-300 hover:text-white hover:border-brand-500/30 transition-all border border-white/10"
                  >
                    <Linkedin size={15} className="text-blue-400" />
                    LinkedIn
                  </a>
                  <a
                    href="https://www.instagram.com/resumics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass-light rounded-xl text-sm text-slate-300 hover:text-white hover:border-brand-500/30 transition-all border border-white/10"
                  >
                    <Instagram size={15} className="text-pink-400" />
                    Instagram
                  </a>
                </div>
              </div>

              {/* Text side */}
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1 mb-5 w-fit">
                  <span className="text-brand-400 text-xs font-medium">Founder's Note</span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  I've always been more curious about building things than just learning them.
                  Over the past few years I've turned several ideas into real products — each
                  one teaching me something the last one didn't.
                </p>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Resumics came from a real frustration. I kept hearing from friends and
                  fellow developers — people with genuine skills — that they weren't getting
                  callbacks. The culprit almost every time? Their resume never made it past
                  the ATS bot. A robot was deciding their future before any human could.
                </p>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  So I built Resumics. A tool that levels the playing field — where a
                  fresher from Greater Noida has the same shot as someone from a tier-1 city
                  or a big college. Your skills should speak for you. This tool makes sure
                  they get the chance to.
                </p>

                <Link
                  to="/register"
                  className="btn-primary self-start flex items-center gap-2 text-sm py-2.5 px-5"
                >
                  Build Your Resume <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-white mb-3">The Journey</h2>
            <p className="text-slate-400 text-sm">From curiosity to a product used by 50,000+ professionals</p>
          </div>

          <div className="space-y-6">
            {TIMELINE.map(({ year, title, desc, icon: Icon }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 glass rounded-2xl border border-white/10 p-6 hover:border-brand-500/20 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-brand-400 font-mono text-xs mb-0.5">{year}</div>
                  <h3 className="font-display text-white font-semibold mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 px-4 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}
          >
            <div className="absolute inset-0 border border-brand-500/20 rounded-3xl" />
            <div className="relative">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-xl mx-auto">
                To ensure that no talented Indian professional loses an opportunity
                because their resume wasn't formatted correctly. Skills matter.
                We make sure they're seen.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Start for Free <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
