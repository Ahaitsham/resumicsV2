import React from 'react'
import { Award, Trophy, Globe, Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store'

export default function StepExtras() {
  const { certifications, setCertifications, achievements, setAchievements, languages, setLanguages } = useResumeStore()

  const addCert = () => setCertifications([...certifications, { id: Date.now(), name: '', issuer: '', year: '', url: '' }])
  const removeCert = (id) => setCertifications(certifications.filter(c => c.id !== id))
  const updateCert = (id, field, value) => setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c))

  const addAchievement = () => setAchievements([...achievements, ''])
  const removeAchievement = (i) => setAchievements(achievements.filter((_, idx) => idx !== i))
  const updateAchievement = (i, val) => setAchievements(achievements.map((a, idx) => idx === i ? val : a))

  const addLanguage = () => setLanguages([...languages, { id: Date.now(), name: '', proficiency: 'Professional' }])
  const removeLanguage = (id) => setLanguages(languages.filter(l => l.id !== id))
  const updateLanguage = (id, field, value) => setLanguages(languages.map(l => l.id === id ? { ...l, [field]: value } : l))

  return (
    <div className="space-y-5">
      {/* Certifications */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Award size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display text-white font-semibold text-sm">Certifications</h2>
              <p className="text-slate-500 text-xs">Online courses, professional certs</p>
            </div>
          </div>
          <button onClick={addCert} className="flex items-center gap-1.5 text-xs text-brand-400 border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
            <Plus size={12} /> Add
          </button>
        </div>
        {certifications.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4">No certifications yet — add AWS, Google, Coursera certs to stand out</p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div key={cert.id || i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/3 border border-white/8 relative">
                <button onClick={() => removeCert(cert.id)} className="absolute top-2 right-2 text-red-400/60 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Certificate Name</label>
                  <input value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} placeholder="AWS Cloud Practitioner" className="input-field py-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Issuing Organization</label>
                  <input value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} placeholder="Amazon / Google / Coursera" className="input-field py-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Year</label>
                  <input value={cert.year} onChange={e => updateCert(cert.id, 'year', e.target.value)} placeholder="2024" className="input-field py-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">Credential URL</label>
                  <input value={cert.url} onChange={e => updateCert(cert.id, 'url', e.target.value)} placeholder="https://..." className="input-field py-2 text-xs" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy size={16} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-white font-semibold text-sm">Achievements & Awards</h2>
              <p className="text-slate-500 text-xs">Hackathons, ranks, recognitions</p>
            </div>
          </div>
          <button onClick={addAchievement} className="flex items-center gap-1.5 text-xs text-brand-400 border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
            <Plus size={12} /> Add
          </button>
        </div>
        {achievements.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4">Add hackathon wins, academic ranks, or work recognitions</p>
        ) : (
          <div className="space-y-2">
            {achievements.map((achievement, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={achievement}
                  onChange={e => updateAchievement(i, e.target.value)}
                  placeholder="Winner, Smart India Hackathon 2023 | Ranked 3rd in GATE CS 2024"
                  className="input-field flex-1 py-2 text-xs"
                />
                <button onClick={() => removeAchievement(i)} className="text-red-400/60 hover:text-red-400 px-2">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Globe size={16} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-white font-semibold text-sm">Languages</h2>
              <p className="text-slate-500 text-xs">Spoken & written languages</p>
            </div>
          </div>
          <button onClick={addLanguage} className="flex items-center gap-1.5 text-xs text-brand-400 border border-brand-500/30 rounded-lg px-3 py-1.5 hover:bg-brand-500/10">
            <Plus size={12} /> Add
          </button>
        </div>
        {languages.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4">Add English, Hindi, and any regional languages you know</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((lang, i) => (
              <div key={lang.id || i} className="flex gap-2 items-center p-3 rounded-xl bg-white/3 border border-white/8">
                <input value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} placeholder="English" className="input-field flex-1 py-2 text-xs" />
                <select value={lang.proficiency} onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)} className="input-field py-2 text-xs w-36">
                  <option>Native</option>
                  <option>Professional</option>
                  <option>Intermediate</option>
                  <option>Basic</option>
                </select>
                <button onClick={() => removeLanguage(lang.id)} className="text-red-400/60 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
