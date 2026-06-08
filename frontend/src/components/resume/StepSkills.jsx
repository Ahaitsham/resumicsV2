import React, { useState } from 'react'
import { Star, Plus, X } from 'lucide-react'
import { useResumeStore } from '../../store'

const SUGGESTED = {
  technical: ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'Machine Learning', 'Data Analysis', 'REST APIs'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking', 'Adaptability'],
  tools: ['VS Code', 'GitHub', 'Jira', 'Figma', 'Postman', 'Linux', 'Excel', 'Tableau', 'Jenkins', 'Kubernetes'],
}

function SkillChip({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/15 border border-brand-500/30 rounded-full text-xs text-brand-300">
      {skill}
      <button onClick={onRemove} className="hover:text-red-400 transition-colors">
        <X size={11} />
      </button>
    </span>
  )
}

function SkillSection({ title, color, type, skills, onAdd, onRemove }) {
  const [input, setInput] = useState('')
  const suggestions = SUGGESTED[type] || []

  const handleAdd = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      onAdd(type, input.trim())
      setInput('')
    }
  }

  return (
    <div className="p-4 rounded-xl bg-white/3 border border-white/8">
      <h3 className={`text-xs font-semibold mb-3 ${color}`}>{title}</h3>
      
      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {skills.map(skill => (
          <SkillChip key={skill} skill={skill} onRemove={() => onRemove(type, skill)} />
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={`Type a ${type} skill...`}
          className="input-field flex-1 py-2 text-xs"
        />
        <button onClick={handleAdd} className="px-3 py-2 bg-brand-500/20 border border-brand-500/30 rounded-xl text-brand-400 hover:bg-brand-500/30 transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-slate-600 text-xs mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
            <button
              key={s}
              onClick={() => onAdd(type, s)}
              className="px-2.5 py-1 glass rounded-full text-xs text-slate-400 hover:text-white hover:border-brand-500/30 transition-all border border-white/5"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function StepSkills() {
  const { skills, setSkills } = useResumeStore()

  const safeSkills = {
    technical: skills?.technical || [],
    soft: skills?.soft || [],
    tools: skills?.tools || [],
  }

  const handleAdd = (type, skill) => {
    setSkills({ ...safeSkills, [type]: [...(safeSkills[type] || []), skill] })
  }

  const handleRemove = (type, skill) => {
    setSkills({ ...safeSkills, [type]: (safeSkills[type] || []).filter(s => s !== skill) })
  }

  const totalSkills = safeSkills.technical.length + safeSkills.soft.length + safeSkills.tools.length

  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Star size={16} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-white font-semibold">Skills</h2>
            <p className="text-slate-500 text-xs">Add 10+ skills for best ATS score</p>
          </div>
        </div>
        <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${totalSkills >= 10 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {totalSkills} skills
        </div>
      </div>

      <div className="space-y-4">
        <SkillSection
          title="🖥️ Technical Skills"
          color="text-blue-400"
          type="technical"
          skills={safeSkills.technical}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
        <SkillSection
          title="🛠️ Tools & Technologies"
          color="text-purple-400"
          type="tools"
          skills={safeSkills.tools}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
        <SkillSection
          title="🤝 Soft Skills"
          color="text-green-400"
          type="soft"
          skills={safeSkills.soft}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>

      {totalSkills < 10 && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-300">Add {10 - totalSkills} more skills to reach the optimal ATS threshold</p>
        </div>
      )}
    </div>
  )
}
