import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, AlertTriangle, CheckCircle, Loader2, ChevronDown, Briefcase, Sparkles, RefreshCw } from 'lucide-react'
import { useResumeStore } from '../../store'
import { calculateQuickATSScore } from '../../lib/aiService'
import api from '../../lib/api'
import toast from 'react-hot-toast'

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
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
      />
      <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="Syne">{score}</text>
      <text x="65" y="78" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="DM Sans">/ 100</text>
    </svg>
  )
}

export default function ATSPanel() {
  const store = useResumeStore()
  const { atsScore, atsKeywords, atsSuggestions, setAtsData,
          jobDescription, setJobDescription, matchScore, matchKeywords, setMatchData } = store

  const [showJD, setShowJD] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  // ── Live ATS recalculation whenever ANY resume field changes ──
  // Subscribe to the whole store so changes to any section trigger recalc
  useEffect(() => {
    const unsubscribe = useResumeStore.subscribe((state) => {
      const data = {
        personalInfo: state.personalInfo,
        careerObjective: state.careerObjective,
        education: state.education,
        experience: state.experience,
        projects: state.projects,
        skills: state.skills,
        certifications: state.certifications,
        achievements: state.achievements,
        languages: state.languages,
      }
      if (data.personalInfo?.fullName) {
        const result = calculateQuickATSScore(data)
        // Only update if score actually changed to avoid infinite loops
        if (result.score !== useResumeStore.getState().atsScore) {
          state.setAtsData(result.score, result.keywords, result.suggestions)
        }
      }
    })
    // Also calculate immediately on mount
    const state = useResumeStore.getState()
    const data = {
      personalInfo: state.personalInfo,
      careerObjective: state.careerObjective,
      education: state.education,
      experience: state.experience,
      projects: state.projects,
      skills: state.skills,
      certifications: state.certifications,
      achievements: state.achievements,
      languages: state.languages,
    }
    if (data.personalInfo?.fullName) {
      const result = calculateQuickATSScore(data)
      state.setAtsData(result.score, result.keywords, result.suggestions)
    }
    return unsubscribe
  }, [])

  // ── Real AI job match via backend ─────────────────────────────
  const handleJDAnalyze = async () => {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    setMatchResult(null)
    try {
      const state = useResumeStore.getState()
      const resumeData = {
        personalInfo: state.personalInfo,
        careerObjective: state.careerObjective,
        experience: state.experience,
        skills: state.skills,
        projects: state.projects,
      }
      const res = await api.post('/ai/job-match', { resumeData, jobDescription })
      const data = res.data
      setMatchData(data.matchScore, data.matchedKeywords || [])
      setMatchResult(data)
      toast.success(`Match analyzed: ${data.matchScore}%`)
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Check your AI API key.'
      toast.error(msg)
    } finally {
      setAnalyzing(false)
    }
  }

  const scoreLabel = !atsScore ? 'Not calculated'
    : atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Work'
  const scoreColor = !atsScore ? 'text-slate-400'
    : atsScore >= 80 ? 'text-green-400' : atsScore >= 60 ? 'text-amber-400' : 'text-red-400'
  const matchColor = !matchScore ? 'text-slate-400'
    : matchScore >= 70 ? 'text-green-400' : matchScore >= 50 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="sticky top-24 space-y-4">

      {/* ── ATS Score ── */}
      <div className="glass rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-brand-400" />
            <span className="text-white text-xs font-semibold">Live ATS Score</span>
          </div>
          <span className="text-slate-600 text-xs">auto-updates</span>
        </div>

        {atsScore !== null ? (
          <>
            <ATSRing score={atsScore} />
            <div className="text-center mt-2 mb-4">
              <span className={`text-sm font-semibold ${scoreColor}`}>{scoreLabel}</span>
              <p className="text-slate-600 text-xs mt-0.5">
                {atsScore >= 80 ? 'Great! You can apply confidently.' :
                 atsScore >= 60 ? 'Add more details to improve.' : 'Fill all sections to boost score.'}
              </p>
            </div>

            {atsSuggestions?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/8">
                <p className="text-slate-500 text-xs font-medium mb-1.5">Quick fixes:</p>
                {atsSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-xs">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {atsKeywords?.length > 0 && (
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
            <p className="text-slate-600 text-xs">Enter your name to see your score</p>
          </div>
        )}
      </div>

      {/* ── Job Match ── */}
      <div className="glass rounded-2xl border border-white/10 p-5">
        <button
          onClick={() => setShowJD(!showJD)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-purple-400" />
            <span className="text-white text-xs font-semibold">Job Match (AI)</span>
            {matchScore !== null && (
              <span className={`text-xs font-bold ml-1 ${matchColor}`}>{matchScore}%</span>
            )}
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
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here for accurate AI matching..."
                  className="input-field text-xs min-h-[110px] resize-none"
                />

                <button
                  onClick={handleJDAnalyze}
                  disabled={analyzing || !jobDescription.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
                >
                  {analyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {analyzing ? 'AI Analyzing...' : 'Analyze with AI'}
                </button>

                {/* Match results */}
                {matchResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-xs text-slate-400">Match Score</span>
                      <span className={`font-bold text-sm ${matchColor}`}>{matchResult.matchScore}%</span>
                    </div>

                    {matchResult.missingKeywords?.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs mb-1.5">Missing keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.missingKeywords.slice(0, 6).map(k => (
                            <span key={k} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchResult.recommendations?.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-xs mb-1.5">Recommendations:</p>
                        {matchResult.recommendations.slice(0, 3).map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <span className="text-brand-400 text-xs mt-0.5">→</span>
                            <span className="text-slate-400 text-xs">{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tips ── */}
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
            'Quantify achievements with numbers',
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
