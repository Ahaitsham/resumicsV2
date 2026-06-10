import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, CheckCircle, XCircle, AlertTriangle, ArrowRight, ChevronDown, Zap } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    id: 'what',
    title: 'What is ATS?',
    content: `ATS stands for Applicant Tracking System. It's software used by companies to automatically screen resumes before a human recruiter ever sees them. Over 98% of Fortune 500 companies and most Indian MNCs — TCS, Infosys, Wipro, Flipkart, Amazon India — use ATS to filter candidates.

When you apply online, your resume goes into the ATS first. The system scans it for keywords, formats, and structure. If it doesn't match, your resume is rejected automatically — no human ever reads it.`,
  },
  {
    id: 'scoring',
    title: 'How ATS Scores Your Resume',
    content: `ATS systems look at several factors to generate a score or ranking:

• Keyword matching — Does your resume contain the exact words from the job description?
• Section headers — Are sections labeled with standard names like "Work Experience" and "Education"?
• Contact information — Is your name, email, and phone clearly present at the top?
• File format — PDF and DOCX are preferred; avoid image-based PDFs scanned from paper.
• Formatting — Clean, simple layouts score higher than complex designs with columns, tables, or graphics.
• Date formats — Consistent date formats (e.g. Jan 2022 — Dec 2023) are easier to parse.`,
  },
  {
    id: 'score-meaning',
    title: 'What Your ATS Score Means',
    content: `Our ATS score (0–100) gives you a real-time indication of how well your resume would perform in an ATS system.

80–100 — Excellent. Your resume is highly optimised and should pass most ATS filters.
60–79 — Good. Minor improvements will significantly boost your callback rate.
40–59 — Needs work. Several key elements are missing or poorly formatted.
0–39 — Poor. Major sections are missing. Fill in all details and use AI Enhance.`,
  },
]

const DOS = [
  'Use standard section headers: Work Experience, Education, Skills, Projects',
  'Include the exact keywords from the job description',
  'Use a clean single-column layout',
  'Quantify achievements: "Increased sales by 30%" not "Improved sales"',
  'Use common fonts: Arial, Calibri, Times New Roman',
  'Save as PDF or DOCX',
  'Put your name at the very top in large text',
  'Include your email, phone, and LinkedIn URL',
  'Use bullet points for experience descriptions',
  'Tailor your resume for each job application',
]

const DONTS = [
  'Use tables, columns, or text boxes — ATS cannot read them',
  'Submit a photo or graphics-heavy resume',
  'Use fancy fonts or excessive formatting',
  'Write "References available on request" — wastes space',
  'Use headers and footers for important info — ATS often ignores them',
  'Submit a scanned image as PDF',
  'Use abbreviations the ATS won\'t recognise',
  'Leave large unexplained employment gaps without addressing them',
  'Use the same resume for every job',
  'Stuff keywords unnaturally — ATS detects keyword spam',
]

const KEYWORDS_BY_ROLE = [
  {
    role: 'Software Engineer',
    keywords: ['React', 'Node.js', 'Python', 'REST API', 'Agile', 'Git', 'CI/CD', 'AWS', 'Microservices', 'SQL'],
  },
  {
    role: 'Data Analyst',
    keywords: ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Data Visualisation', 'ETL', 'Pandas', 'Statistics', 'Dashboard'],
  },
  {
    role: 'Product Manager',
    keywords: ['Roadmap', 'Agile', 'Scrum', 'Stakeholder', 'KPI', 'User Stories', 'Jira', 'A/B Testing', 'Go-to-market', 'OKRs'],
  },
  {
    role: 'MBA / Business',
    keywords: ['P&L', 'Strategy', 'Revenue Growth', 'Market Analysis', 'Cross-functional', 'Stakeholder Management', 'Operations', 'ROI', 'Business Development', 'Leadership'],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-white/10 rounded-2xl transition-all ${open ? 'border-brand-500/30 bg-brand-500/5' : 'hover:border-white/20'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left gap-4">
        <span className="text-white text-sm font-medium">{q}</span>
        <ChevronDown size={15} className={`text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

export default function ATSGuidePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-6 border border-brand-500/30">
            <Target size={12} className="text-brand-400" />
            <span className="text-xs text-slate-400">Complete ATS Guide</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl font-bold text-white mb-4">
            Beat ATS.<br /><span className="gradient-text">Get Shortlisted.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg">
            Everything you need to know about Applicant Tracking Systems — and how to write a resume that beats them.
          </motion.p>
        </div>
      </section>

      {/* Main sections */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-5">
          {SECTIONS.map(({ id, title, content }, i) => (
            <motion.div key={id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/10 p-7"
            >
              <h2 className="font-display text-xl font-bold text-white mb-4">{title}</h2>
              <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{content}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-12 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">ATS Do's & Don'ts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl border border-green-500/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle size={18} className="text-green-400" />
                <h3 className="font-display text-white font-semibold">Always Do This</h3>
              </div>
              <ul className="space-y-3">
                {DOS.map((item, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl border border-red-500/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle size={18} className="text-red-400" />
                <h3 className="font-display text-white font-semibold">Never Do This</h3>
              </div>
              <ul className="space-y-3">
                {DONTS.map((item, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keywords by role */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">High-Value Keywords by Role</h2>
            <p className="text-slate-400 text-sm">Include these in your resume to match what ATS systems look for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {KEYWORDS_BY_ROLE.map(({ role, keywords }, i) => (
              <motion.div key={role}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl border border-white/10 p-5"
              >
                <h3 className="font-medium text-white text-sm mb-3">{role}</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(k => (
                    <span key={k} className="px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-300 text-xs">{k}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Common Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Does a higher ATS score guarantee an interview?', a: 'A high ATS score means your resume is more likely to pass automated screening. However, the final decision is made by human recruiters. A good ATS score increases your chances significantly but doesn\'t guarantee an interview.' },
              { q: 'Should I use a different resume for each job?', a: 'Yes, absolutely. Tailoring your resume to each job description — especially matching keywords — can increase your ATS score by 20-40 points. Use our Job Match feature to see exactly which keywords to add.' },
              { q: 'What file format should I submit?', a: 'PDF is preferred for most applications as it preserves formatting. However, some older ATS systems parse DOCX better. When in doubt, submit PDF. Our downloads are always A4 PDF.' },
              { q: 'Can I use a creative or graphic resume?', a: 'Not for companies that use ATS. Creative resumes with columns, graphics, and custom fonts are often misread by ATS and scored very low. Save creative formats for design portfolios or personal websites.' },
              { q: 'How often should I update my resume?', a: 'Update your resume every time you complete a significant project, get a promotion, earn a certification, or before applying for jobs. An updated resume with recent keywords always scores higher.' },
            ].map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="p-10 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}>
            <div className="absolute inset-0 border border-brand-500/20 rounded-3xl" />
            <div className="relative">
              <Zap size={32} className="text-brand-400 mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold text-white mb-3">Check Your ATS Score Now</h2>
              <p className="text-slate-400 mb-6">Build your resume with AI and see your score update in real time.</p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Build My Resume Free <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
