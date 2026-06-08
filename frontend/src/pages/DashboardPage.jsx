import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, FileText, Download, Trash2, Eye, Edit, Clock,
  TrendingUp, Target, Sparkles, BarChart3, Award
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { resumeAPI } from '../lib/api'
import { useAuthStore, useResumeStore } from '../store'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { resetResume } = useResumeStore()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, downloaded: 0, avgAts: 0 })

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      const res = await resumeAPI.list()
      setResumes(res.data.resumes || [])
      const total = res.data.resumes?.length || 0
      const downloaded = res.data.resumes?.filter(r => r.isPaid).length || 0
      const avgAts = total > 0 
        ? Math.round(res.data.resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / total)
        : 0
      setStats({ total, downloaded, avgAts })
    } catch (err) {
      // Show empty state
    } finally {
      setLoading(false)
    }
  }

  const handleNewResume = () => {
    resetResume()
    navigate('/builder')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    try {
      await resumeAPI.delete(id)
      setResumes(r => r.filter(r => r.id !== id))
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-400 text-sm">Manage your resumes and track your job search progress.</p>
          </div>
          <button onClick={handleNewResume} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus size={16} />
            New Resume
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: FileText, label: 'Total Resumes', value: stats.total, color: 'text-brand-400' },
            { icon: Download, label: 'Downloaded', value: stats.downloaded, color: 'text-green-400' },
            { icon: Target, label: 'Avg ATS Score', value: stats.avgAts ? `${stats.avgAts}/100` : '—', color: 'text-amber-400' },
            { icon: Award, label: 'Membership', value: 'Free', color: 'text-purple-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <Icon size={18} className={`${color} mb-2`} />
              <div className="font-display text-xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Resumes list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-white">My Resumes</h2>
          {resumes.length > 0 && (
            <span className="text-slate-500 text-xs">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-40 shimmer" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={36} className="text-brand-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">No resumes yet</h3>
            <p className="text-slate-500 text-sm mb-6">Build your first AI-powered resume in minutes</p>
            <button onClick={handleNewResume} className="btn-primary flex items-center gap-2 mx-auto">
              <Sparkles size={16} />
              Build My First Resume
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New Resume card */}
            <motion.button
              onClick={handleNewResume}
              whileHover={{ scale: 1.02 }}
              className="card border-dashed border-brand-500/30 flex flex-col items-center justify-center gap-3 py-10 hover:border-brand-500/50 cursor-pointer min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                <Plus size={20} className="text-brand-400" />
              </div>
              <span className="text-slate-400 text-sm font-medium">New Resume</span>
            </motion.button>

            {resumes.map((resume, i) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card hover:border-brand-500/20 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <FileText size={15} className="text-brand-400" />
                  </div>
                  {resume.isPaid ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Download size={10} /> Downloaded
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Draft</span>
                  )}
                </div>

                <h3 className="font-medium text-white text-sm mb-1 truncate">
                  {resume.personalInfo?.fullName || 'Untitled Resume'}
                </h3>
                <p className="text-slate-500 text-xs mb-3 capitalize">{resume.selectedTemplate} template</p>

                {resume.atsScore && (
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={12} className="text-slate-500" />
                    <span className={`text-xs font-semibold ${getScoreColor(resume.atsScore)}`}>
                      ATS {resume.atsScore}/100
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  <Clock size={11} className="text-slate-600" />
                  <span className="text-slate-600 text-xs">
                    {resume.updatedAt ? format(new Date(resume.updatedAt), 'MMM d, yyyy') : 'Recently'}
                  </span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/builder/${resume.id}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors">
                    <Edit size={12} /> Edit
                  </Link>
                  <Link to={`/preview/${resume.id}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg glass-light text-slate-300 hover:bg-white/10 transition-colors">
                    <Eye size={12} /> Preview
                  </Link>
                  <button onClick={() => handleDelete(resume.id)} className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick tips */}
        <div className="mt-12 p-6 glass rounded-2xl border border-brand-500/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-brand-400" />
            <h3 className="font-display font-semibold text-white text-sm">Pro Tips to Get More Interviews</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Target, title: 'Aim for 80+ ATS', desc: 'Resumes with 80+ ATS score get 3x more callbacks.' },
              { icon: BarChart3, title: 'Quantify Everything', desc: 'Use numbers: "Increased sales by 30%" beats "Improved sales".' },
              { icon: TrendingUp, title: 'Tailor Each Resume', desc: 'Match your resume keywords to the job description for each application.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <Icon size={16} className="text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-xs font-medium mb-0.5">{title}</div>
                  <div className="text-slate-500 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
