import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Code, GraduationCap, Briefcase, BarChart3, CheckCircle } from 'lucide-react'
import { useResumeStore } from '../../store'

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern ATS',
    description: 'Clean, professional design optimized for all ATS systems. Best for most roles.',
    icon: Sparkles,
    color: 'from-brand-500 to-brand-700',
    tag: 'Most Popular',
    tagColor: 'bg-brand-500/20 text-brand-300',
    recommended: true,
  },
  {
    id: 'software',
    name: 'Software Engineer',
    description: 'Tech-focused layout highlighting skills, GitHub, and technical projects prominently.',
    icon: Code,
    color: 'from-cyan-500 to-blue-600',
    tag: 'For Developers',
    tagColor: 'bg-cyan-500/20 text-cyan-300',
  },
  {
    id: 'fresher',
    name: 'Fresher Template',
    description: 'Perfect for students and new graduates. Emphasizes education, projects, and skills.',
    icon: GraduationCap,
    color: 'from-green-500 to-teal-600',
    tag: 'Students',
    tagColor: 'bg-green-500/20 text-green-300',
  },
  {
    id: 'corporate',
    name: 'Corporate Pro',
    description: 'Traditional corporate design for experienced professionals in established industries.',
    icon: Briefcase,
    color: 'from-slate-500 to-slate-700',
    tag: 'Professional',
    tagColor: 'bg-slate-500/20 text-slate-300',
  },
  {
    id: 'analyst',
    name: 'Business Analyst',
    description: 'Data-driven layout with emphasis on metrics, analytical skills, and business impact.',
    icon: BarChart3,
    color: 'from-amber-500 to-orange-600',
    tag: 'Analytics',
    tagColor: 'bg-amber-500/20 text-amber-300',
  },
]

export default function StepTemplate() {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore()

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-brand-400" />
        </div>
        <div>
          <h2 className="font-display text-white font-semibold">Choose Template</h2>
          <p className="text-slate-500 text-xs">All templates are 100% ATS compatible</p>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
        <p className="text-xs text-slate-400">
          ✅ All templates are designed to pass ATS systems. Choose based on your industry and role level.
        </p>
      </div>

      <div className="space-y-3">
        {TEMPLATES.map(({ id, name, description, icon: Icon, color, tag, tagColor, recommended }) => (
          <motion.button
            key={id}
            onClick={() => setSelectedTemplate(id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
              selectedTemplate === id
                ? 'border-brand-500/50 bg-brand-500/10'
                : 'border-white/8 bg-white/3 hover:border-white/15'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white text-sm font-medium">{name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
            </div>
            {selectedTemplate === id && (
              <CheckCircle size={18} className="text-brand-400 flex-shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-5 p-4 glass rounded-xl border border-white/10">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-white font-medium">Selected: </span>
          <span className="text-brand-300">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
          {' '} — You can always change this before downloading.
        </p>
      </div>
    </div>
  )
}
