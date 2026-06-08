import React from 'react'
import { Code, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useResumeStore } from '../../store'

const emptyProject = { name: '', description: '', techStack: '', liveUrl: '', githubUrl: '', highlights: '' }

export default function StepProjects() {
  const { projects, setProjects } = useResumeStore()

  const add = () => setProjects([...projects, { ...emptyProject, id: Date.now() }])
  const remove = (id) => setProjects(projects.filter(p => p.id !== id))
  const update = (id, field, value) => setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p))

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Code size={16} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-display text-white font-semibold">Projects</h2>
            <p className="text-slate-500 text-xs">Personal, academic & professional projects</p>
          </div>
        </div>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-slate-400">
          🚀 <span className="text-amber-400 font-medium">Freshers:</span> Projects are your goldmine! Add at least 2-3 strong projects to dramatically improve your ATS score.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <Code size={28} className="text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-3">Showcase your best work</p>
          <button onClick={add} className="btn-primary text-xs py-2 px-4">Add Project</button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, i) => (
            <div key={project.id || i} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-500 font-medium">Project #{i + 1}</span>
                <button onClick={() => remove(project.id || i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-xs mb-1">Project Name *</label>
                  <input value={project.name} onChange={e => update(project.id || i, 'name', e.target.value)} placeholder="E-Commerce Platform / Portfolio Website" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Live URL</label>
                  <div className="relative">
                    <ExternalLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={project.liveUrl} onChange={e => update(project.id || i, 'liveUrl', e.target.value)} placeholder="myproject.vercel.app" className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">GitHub URL</label>
                  <div className="relative">
                    <Code size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={project.githubUrl} onChange={e => update(project.id || i, 'githubUrl', e.target.value)} placeholder="github.com/user/project" className="input-field pl-9" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-xs mb-1">Tech Stack Used *</label>
                  <input value={project.techStack} onChange={e => update(project.id || i, 'techStack', e.target.value)} placeholder="React, Node.js, MongoDB, AWS" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-xs mb-1">Project Description & Impact *</label>
                  <textarea
                    value={project.description}
                    onChange={e => update(project.id || i, 'description', e.target.value)}
                    placeholder="Built a full-stack e-commerce platform with 500+ products&#10;Implemented payment gateway reducing checkout time by 30%&#10;Deployed on AWS with 99.9% uptime"
                    className="input-field min-h-[100px] resize-none"
                  />
                  <p className="text-slate-600 text-xs mt-1">Include numbers and impact where possible — AI will quantify and enhance</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={add} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-slate-300 hover:border-brand-500/30 text-sm transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Add Another Project
          </button>
        </div>
      )}
    </div>
  )
}
