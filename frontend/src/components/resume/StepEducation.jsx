import React from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store'

const emptyEdu = { institution: '', degree: '', field: '', startYear: '', endYear: '', percentage: '', gpa: '', achievements: '' }

export default function StepEducation() {
  const { education, setEducation } = useResumeStore()
  
  const add = () => setEducation([...education, { ...emptyEdu, id: Date.now() }])
  const remove = (id) => setEducation(education.filter(e => e.id !== id))
  const update = (id, field, value) => setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e))

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <GraduationCap size={16} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display text-white font-semibold">Education</h2>
            <p className="text-slate-500 text-xs">Degrees, diplomas & certifications</p>
          </div>
        </div>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
          <Plus size={12} /> Add
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <GraduationCap size={28} className="text-slate-600 mx-auto mb-2" />
          <p className="text-slate-600 text-sm mb-3">No education added yet</p>
          <button onClick={add} className="btn-primary text-xs py-2 px-4">Add Education</button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-500 font-medium">Education #{i + 1}</span>
                <button onClick={() => remove(edu.id || i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-xs mb-1">Institution Name *</label>
                  <input value={edu.institution} onChange={e => update(edu.id || i, 'institution', e.target.value)} placeholder="IIT Delhi / Delhi University / BITS Pilani" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Degree *</label>
                  <input value={edu.degree} onChange={e => update(edu.id || i, 'degree', e.target.value)} placeholder="B.Tech / B.Sc / MBA" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Field of Study *</label>
                  <input value={edu.field} onChange={e => update(edu.id || i, 'field', e.target.value)} placeholder="Computer Science" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Start Year</label>
                  <input value={edu.startYear} onChange={e => update(edu.id || i, 'startYear', e.target.value)} placeholder="2020" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">End Year (or Expected)</label>
                  <input value={edu.endYear} onChange={e => update(edu.id || i, 'endYear', e.target.value)} placeholder="2024" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Percentage / CGPA</label>
                  <input value={edu.percentage} onChange={e => update(edu.id || i, 'percentage', e.target.value)} placeholder="8.5 CGPA / 85%" className="input-field" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Relevant Achievements</label>
                  <input value={edu.achievements} onChange={e => update(edu.id || i, 'achievements', e.target.value)} placeholder="Dean's List, Gold Medal, etc." className="input-field" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={add} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-slate-300 hover:border-brand-500/30 text-sm transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Add Another
          </button>
        </div>
      )}
    </div>
  )
}
