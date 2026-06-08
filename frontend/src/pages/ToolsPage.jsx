import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Linkedin, MessageSquare, Copy, Loader2, 
  Sparkles, ChevronDown, CheckCircle, Download
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { useResumeStore } from '../store'
import { aiService } from '../lib/aiService'
import toast from 'react-hot-toast'

const TOOLS = [
  {
    id: 'cover-letter',
    icon: FileText,
    title: 'AI Cover Letter Generator',
    description: 'Generate a personalized, ATS-friendly cover letter tailored to any job in seconds.',
    color: 'from-brand-500 to-purple-500',
    free: false,
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'LinkedIn Headline Generator',
    description: 'Craft a compelling LinkedIn headline that attracts recruiters and gets you noticed.',
    color: 'from-blue-500 to-cyan-500',
    free: true,
  },
  {
    id: 'interview',
    icon: MessageSquare,
    title: 'Interview Question Predictor',
    description: 'Get role-specific interview questions with model answers based on your resume.',
    color: 'from-green-500 to-teal-500',
    free: true,
  },
]

function ToolCard({ tool, onOpen }) {
  const { icon: Icon, title, description, color, free } = tool
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:border-brand-500/20 hover:scale-[1.02] cursor-pointer group"
      onClick={onOpen}
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-display text-white font-semibold text-sm leading-tight">{title}</h3>
        {free && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">Free</span>}
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{description}</p>
      <button className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
        <Sparkles size={12} /> Generate Now
      </button>
    </motion.div>
  )
}

export default function ToolsPage() {
  const { getResumeData } = useResumeStore()
  const [activeTool, setActiveTool] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobRole, setJobRole] = useState('')
  const [company, setCompany] = useState('')
  const [jd, setJd] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (toolId) => {
    setLoading(true)
    setResult('')
    const resumeData = getResumeData()
    try {
      let res
      switch (toolId) {
        case 'cover-letter':
          res = await aiService.generateCoverLetter(resumeData, jd, company)
          setResult(res.coverLetter || res.content || 'Cover letter generated successfully!')
          break
        case 'linkedin':
          res = await aiService.generateLinkedInHeadline(resumeData)
          setResult(res.headlines?.join('\n\n') || res.content || 'LinkedIn headlines generated!')
          break
        case 'interview':
          res = await aiService.generateInterviewQuestions(resumeData, jobRole)
          setResult(res.questions?.map((q, i) => `Q${i+1}: ${q.question}\n\nA: ${q.answer}`).join('\n\n---\n\n') || res.content || '')
          break
        default:
          break
      }
    } catch (err) {
      toast.error('AI generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-white mb-2">AI Career Tools</h1>
          <p className="text-slate-400">Free tools to boost your job search. Powered by AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} onOpen={() => { setActiveTool(tool); setResult('') }} />
          ))}
        </div>

        {/* Active Tool Panel */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass rounded-2xl border border-brand-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center`}>
                    <activeTool.icon size={18} className="text-white" />
                  </div>
                  <h2 className="font-display text-white font-semibold">{activeTool.title}</h2>
                </div>
                <button onClick={() => setActiveTool(null)} className="text-slate-500 hover:text-white text-xs transition-colors">
                  Close ×
                </button>
              </div>

              {/* Tool-specific inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {activeTool.id === 'cover-letter' && (
                  <>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1.5">Company Name</label>
                      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Google, Infosys, etc." className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 text-xs mb-1.5">Job Description (paste here)</label>
                      <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description..." className="input-field min-h-[100px] resize-none" />
                    </div>
                  </>
                )}
                {activeTool.id === 'interview' && (
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Target Job Role</label>
                    <input value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="Software Engineer, Product Manager..." className="input-field" />
                  </div>
                )}
                {activeTool.id === 'linkedin' && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-blue-300 text-xs">Your resume data will be used automatically to generate optimized LinkedIn headlines.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleGenerate(activeTool.id)}
                disabled={loading}
                className="btn-primary flex items-center gap-2 mb-6 disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {loading ? 'Generating...' : 'Generate with AI'}
              </button>

              {/* Result */}
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Generated Result</span>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      {copied ? <CheckCircle size={13} className="text-green-400" /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white/3 border border-white/10 rounded-xl p-5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                    {result}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
