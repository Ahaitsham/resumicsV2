import React from 'react'
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText } from 'lucide-react'
import { useResumeStore } from '../../store'

export default function StepPersonal() {
  const { personalInfo, setPersonalInfo, careerObjective, setCareerObjective } = useResumeStore()

  const updateField = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value })
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <User size={16} className="text-brand-400" />
        </div>
        <div>
          <h2 className="font-display text-white font-semibold">Personal Information</h2>
          <p className="text-slate-500 text-xs">Your basic contact details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs mb-1.5">Full Name *</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.fullName}
              onChange={e => updateField('fullName', e.target.value)}
              placeholder="Rahul Sharma"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1.5">Email Address *</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.email}
              onChange={e => updateField('email', e.target.value)}
              type="email"
              placeholder="rahul@example.com"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1.5">Phone Number *</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.phone}
              onChange={e => updateField('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1.5">Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.location}
              onChange={e => updateField('location', e.target.value)}
              placeholder="Bangalore, India"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1.5">LinkedIn URL</label>
          <div className="relative">
            <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.linkedin}
              onChange={e => updateField('linkedin', e.target.value)}
              placeholder="linkedin.com/in/rahulsharma"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs mb-1.5">GitHub URL</label>
          <div className="relative">
            <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.github}
              onChange={e => updateField('github', e.target.value)}
              placeholder="github.com/rahulsharma"
              className="input-field pl-9"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-400 text-xs mb-1.5">Portfolio Website</label>
          <div className="relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={personalInfo.portfolio}
              onChange={e => updateField('portfolio', e.target.value)}
              placeholder="rahulsharma.dev"
              className="input-field pl-9"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-slate-400 text-xs mb-1.5">Career Objective / Professional Summary *</label>
        <div className="relative">
          <FileText size={14} className="absolute left-3 top-3 text-slate-500" />
          <textarea
            value={careerObjective}
            onChange={e => setCareerObjective(e.target.value)}
            placeholder="e.g. Passionate Computer Science graduate with 2+ years of experience in full-stack development, seeking to leverage expertise in React and Node.js to build innovative solutions at a forward-thinking tech company..."
            className="input-field pl-9 pt-3 min-h-[120px] resize-none"
          />
        </div>
        <p className="text-slate-600 text-xs mt-1">AI will enhance this. Just give the rough idea. ({careerObjective.length} chars)</p>
      </div>
    </div>
  )
}
