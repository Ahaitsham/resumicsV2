import React from 'react'
import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store'

const emptyExp = { company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }

export default function StepExperience() {
  const { experience, setExperience } = useResumeStore()

  const add = () => setExperience([...experience, { ...emptyExp, id: Date.now() }])
  const remove = (id) => setExperience(experience.filter(e => e.id !== id))
  const update = (id, field, value) => setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e))

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Briefcase size={16} className="text-green-400" />
          </div>
          <div>
            <h2 className="font-display text-white font-semibold">Work Experience</h2>
            <p className="text-slate-500 text-xs">Jobs, internships & freelance work</p>
          </div>
        </div>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/20">
        <p className="text-xs text-slate-400">
          💡 <span className="text-brand-300 font-medium">Pro tip:</span> Use bullet points separated by newlines. Start each with an action verb (Led, Built, Increased...). AI will quantify and strengthen these automatically.
        </p>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <Briefcase size={28} className="text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-1">No experience? No problem!</p>
          <p className="text-slate-600 text-xs mb-3">Add internships, part-time roles, or freelance projects</p>
          <button onClick={add} className="btn-primary text-xs py-2 px-4">Add Experience</button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-500 font-medium">Position #{i + 1}</span>
                <button onClick={() => remove(exp.id || i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Company Name *</label>
                  <input value={exp.company} onChange={e => update(exp.id || i, 'company', e.target.value)} placeholder="Google / TCS / Startup Name" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Job Title / Role *</label>
                  <input value={exp.role} onChange={e => update(exp.id || i, 'role', e.target.value)} placeholder="Software Engineer / Intern" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Location</label>
                  <input value={exp.location} onChange={e => update(exp.id || i, 'location', e.target.value)} placeholder="Bangalore / Remote" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Start Date</label>
                  <input value={exp.startDate} onChange={e => update(exp.id || i, 'startDate', e.target.value)} type="month" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">End Date</label>
                  <input
                    value={exp.current ? '' : exp.endDate}
                    onChange={e => update(exp.id || i, 'endDate', e.target.value)}
                    type="month"
                    disabled={exp.current}
                    className="input-field disabled:opacity-40"
                    placeholder={exp.current ? 'Present' : ''}
                  />
                </div>
                <div className="flex items-center gap-2 self-end pb-1">
                  <input type="checkbox" id={`current-${i}`} checked={exp.current} onChange={e => update(exp.id || i, 'current', e.target.checked)} className="accent-brand-500" />
                  <label htmlFor={`current-${i}`} className="text-slate-400 text-xs cursor-pointer">Currently working here</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-xs mb-1">Key Responsibilities & Achievements *</label>
                  <textarea
                    value={exp.description}
                    onChange={e => update(exp.id || i, 'description', e.target.value)}
                    placeholder="Developed RESTful APIs using Node.js that reduced load time by 40%&#10;Led a team of 3 engineers to deliver features on schedule&#10;Implemented CI/CD pipeline using GitHub Actions"
                    className="input-field min-h-[110px] resize-none"
                  />
                  <p className="text-slate-600 text-xs mt-1">AI will improve this with stronger action verbs & quantified results</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={add} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-slate-300 hover:border-brand-500/30 text-sm transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Add Another Position
          </button>
        </div>
      )}
    </div>
  )
}
