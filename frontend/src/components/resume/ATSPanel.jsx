import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, AlertTriangle, CheckCircle, Loader2, ChevronDown, Briefcase, Sparkles } from 'lucide-react'
import { useResumeStore } from '../../store'
import { calculateQuickATSScore } from '../../lib/aiService'

function ATSRing({ score }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="mx-auto">
      <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease' }}
      />
      <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="Syne">{score}</text>
      <text x="65" y="78" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="DM Sans">/ 100</text>
    </svg>
  )
}

export default function ATSPanel() {
  const { getResumeData, atsScore, atsKeywords, atsSuggestions, setAtsData, jobDescription, setJobDescription, matchScore, setMatchData } = useResumeStore()
  const [showJD, setShowJD] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // Recalculate on mount and live
  useEffect(() => {
    const data = getResumeData()
    if (data.personalInfo?.fullName) {
      const result = calculateQuickATSScore(data)
      setAtsData(result.score, result.keywords, result.suggestions)
    }
  }, [])

  const handleJDAnalyze = async () => {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    try {
      // Client-side mock match (full AI match via API)
      await new Promise(r => setTimeout(r, 1500))
      const data = getResumeData()
      const skills = [
        ...(data.skills?.technical || []),
        ...(data.skills?.tools || []),
      ].map(s => s.toLowerCase())
      
      const jdWords = jobDescription.toLowerCase().split(/\s+/)
      const matches = skills.filter(s => jdWords.some(w => w.includes(s) || s.includes(w)))
      const score = Math.min(95, Math.round((matches.length / Math.max(skills.length, 1)) * 100) + 40)
      setMatchData(Math.min(score, 95), matches)
    } finally {
      setAnalyzing(false)
    }
  }

  const scoreLabel = !atsScore ? 'Not calculated' : atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Work'
  const scoreColor = !atsScore ? 'text-slate-400' : atsScore >= 80 ? 'text-green-400' : atsScore >= 60 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="sticky top-24 space-y-4">
      {/* ATS Score card */}
      <div className="glass rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className="text-brand-400" />
          <span className="text-white text-xs font-semibold">Live ATS Score</span>
        </div>

        {atsScore !== null ? (
          <>
            <ATSRing score={atsScore} />
            <div className="text-center mt-2 mb-4">
              <span className={`text-sm font-semibold ${scoreColor}`}>{scoreLabel}</span>
              <p className="text-slate-600 text-xs mt-0.5">Updates as you type</p>
            </div>

            {atsSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-500 text-xs font-medium mb-1.5">Improvements:</p>
                {atsSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-xs">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {atsKeywords.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/8">
                <p className="text-slate-500 text-xs mb-2">Detected keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {atsKeywords.slice(0, 8).map(k => (
                    <span key={k} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs">{k}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Target size={32} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-600 text-xs">Fill in your details to see your ATS score</p>
          </div>
        )}
      </div>

      {/* Job Match card */}
      <div className="glass rounded-2xl border border-white/10 p-5">
        <button
          onClick={() => setShowJD(!showJD)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-purple-400" />
            <span className="text-white text-xs font-semibold">Job Match</span>
          </div>
          <ChevronDown size={13} className={`text-slate-500 transition-transform ${showJD ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showJD && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                {matchScore !== null && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <span className="text-xs text-slate-400">Match Score</span>
                    <span className="text-purple-300 font-bold text-sm">{matchScore}%</span>
                  </div>
                )}
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste job description here to see how well your resume matches..."
                  className="input-field text-xs min-h-[100px] resize-none"
                />
                <button
                  onClick={handleJDAnalyze}
                  disabled={analyzing || !jobDescription.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
                >
                  {analyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {analyzing ? 'Analyzing...' : 'Analyze Match'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={13} className="text-green-400" />
          <span className="text-white text-xs font-semibold">ATS Tips</span>
        </div>
        <ul className="space-y-2">
          {[
            'Use standard section headers',
            'Avoid images and tables',
            'Include job title keywords',
            'Use simple bullet points',
          ].map(tip => (
            <li key={tip} className="text-slate-500 text-xs flex items-start gap-1.5">
              <span className="text-brand-500 mt-0.5">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
