import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, GraduationCap, Briefcase, Code, Star, Award, Globe,
  ChevronRight, ChevronLeft, Sparkles, Loader2, Target, 
  Plus, Trash2, Eye, Save, CheckCircle, Zap
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { useResumeStore } from '../store'
import { aiService, calculateQuickATSScore } from '../lib/aiService'
import { resumeAPI } from '../lib/api'
import toast from 'react-hot-toast'

import StepPersonal from '../components/resume/StepPersonal'
import StepEducation from '../components/resume/StepEducation'
import StepExperience from '../components/resume/StepExperience'
import StepProjects from '../components/resume/StepProjects'
import StepSkills from '../components/resume/StepSkills'
import StepExtras from '../components/resume/StepExtras'
import StepTemplate from '../components/resume/StepTemplate'
import ATSPanel from '../components/resume/ATSPanel'

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: User, short: 'Personal' },
  { id: 'education', label: 'Education', icon: GraduationCap, short: 'Education' },
  { id: 'experience', label: 'Experience', icon: Briefcase, short: 'Experience' },
  { id: 'projects', label: 'Projects', icon: Code, short: 'Projects' },
  { id: 'skills', label: 'Skills', icon: Star, short: 'Skills' },
  { id: 'extras', label: 'Extras', icon: Award, short: 'Extras' },
  { id: 'template', label: 'Template', icon: Globe, short: 'Template' },
]

export default function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentStep, setCurrentStep, getResumeData, atsScore, isGenerating, setIsGenerating, setAtsData } = useResumeStore()
  const [saving, setSaving] = useState(false)
  const [resumeId, setResumeId] = useState(id || null)
  const [showATS, setShowATS] = useState(false)

  // Sync resumeId when URL param changes (prevents duplicate creation)
  useEffect(() => {
    if (id && id !== resumeId) {
      setResumeId(id)
      loadResume(id)
    }
  }, [id])

  // Initial ATS calculation on mount only
  useEffect(() => {
    const data = getResumeData()
    if (data.personalInfo?.fullName) {
      const result = calculateQuickATSScore(data)
      setAtsData(result.score, result.keywords, result.suggestions)
    }
  }, [])

  const loadResume = async (id) => {
    try {
      const res = await resumeAPI.get(id)
      const { resume } = res.data
      const store = useResumeStore.getState()
      if (resume.personalInfo) store.setPersonalInfo(resume.personalInfo)
      if (resume.careerObjective) store.setCareerObjective(resume.careerObjective)
      if (resume.education) store.setEducation(resume.education)
      if (resume.experience) store.setExperience(resume.experience)
      if (resume.projects) store.setProjects(resume.projects)
      if (resume.skills) store.setSkills(resume.skills)
      if (resume.certifications) store.setCertifications(resume.certifications)
      if (resume.achievements) store.setAchievements(resume.achievements)
      if (resume.languages) store.setLanguages(resume.languages)
      if (resume.selectedTemplate) store.setSelectedTemplate(resume.selectedTemplate)
    } catch {
      toast.error('Could not load resume')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = getResumeData()
      const store = useResumeStore.getState()
      const payload = { ...data, selectedTemplate: store.selectedTemplate, atsScore: store.atsScore }
      
      if (resumeId) {
        await resumeAPI.save({ ...payload, id: resumeId })
      } else {
        const res = await resumeAPI.save(payload)
        setResumeId(res.data.resume.id)
        navigate(`/builder/${res.data.resume.id}`, { replace: true })
      }
      toast.success('Resume saved!')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    try {
      const data = getResumeData()
      const result = await aiService.generateResume(data)
      
      const store = useResumeStore.getState()
      if (result.careerObjective) store.setCareerObjective(result.careerObjective)
      if (result.experience) store.setExperience(result.experience)
      if (result.projects) store.setProjects(result.projects)
      if (result.skills) store.setSkills(result.skills)
      if (result.atsScore) store.setAtsData(result.atsScore, result.keywords || [], result.suggestions || [])
      
      toast.success('✨ AI enhanced your resume!')
    } catch {
      toast.error('AI generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreview = async () => {
    // Must have a name at minimum
    const data = getResumeData()
    if (!data.personalInfo?.fullName?.trim()) {
      toast.error('Please enter your full name before previewing.')
      setCurrentStep(0)
      return
    }

    setSaving(true)
    let savedId = resumeId
    try {
      const store = useResumeStore.getState()
      const payload = { ...data, selectedTemplate: store.selectedTemplate, atsScore: store.atsScore }
      if (resumeId) {
        await resumeAPI.save({ ...payload, id: resumeId })
      } else {
        const res = await resumeAPI.save(payload)
        savedId = res.data.resume.id
        setResumeId(savedId)
        navigate(`/builder/${savedId}`, { replace: true })
      }
    } catch (err) {
      const isDbError = !err.response || err.response?.status === 500
      if (isDbError) {
        toast('Preview works but payment requires a database. Set DATABASE_URL in backend/.env', {
          icon: '⚠️', duration: 5000,
        })
      } else {
        toast.error('Failed to save resume. Check your connection.')
        setSaving(false)
        return
      }
    } finally {
      setSaving(false)
    }

    navigate(`/preview/${savedId || 'local'}`)
  }

  const canGoNext = currentStep < STEPS.length - 1
  const canGoPrev = currentStep > 0
  const isLastStep = currentStep === STEPS.length - 1

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'personal': return <StepPersonal />
      case 'education': return <StepEducation />
      case 'experience': return <StepExperience />
      case 'projects': return <StepProjects />
      case 'skills': return <StepSkills />
      case 'extras': return <StepExtras />
      case 'template': return <StepTemplate />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between py-6 border-b border-white/5 mb-6">
          <div>
            <h1 className="font-display text-xl font-bold text-white">Resume Builder</h1>
            <p className="text-slate-500 text-xs mt-0.5">Step {currentStep + 1} of {STEPS.length}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* ATS Score badge */}
            {atsScore !== null && (
              <button
                onClick={() => setShowATS(!showATS)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  atsScore >= 80 ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                  atsScore >= 60 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                  'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                <Target size={12} />
                ATS {atsScore}/100
              </button>
            )}

            <button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all disabled:opacity-60"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              AI Enhance
            </button>

            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light text-slate-300 text-xs hover:bg-white/10 transition-all disabled:opacity-60">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Save
            </button>

            <button onClick={handlePreview} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
              <Eye size={12} />
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar steps */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl border border-white/10 p-3 sticky top-24">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                const isActive = i === currentStep
                const isDone = i < currentStep
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-1 ${
                      isActive ? 'bg-brand-500/20 border border-brand-500/30' :
                      isDone ? 'text-slate-400 hover:bg-white/5' :
                      'text-slate-600 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-green-500/20' : isActive ? 'bg-brand-500/30' : 'bg-white/5'
                    }`}>
                      {isDone ? <CheckCircle size={12} className="text-green-400" /> : <Icon size={12} className={isActive ? 'text-brand-400' : 'text-slate-500'} />}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-brand-300' : isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.label}
                    </span>
                  </button>
                )
              })}

              {/* Progress bar */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / (STEPS.length - 1)) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={!canGoPrev}
                className="flex items-center gap-2 px-5 py-2.5 glass-light rounded-xl text-slate-300 text-sm hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} /> Previous
              </button>

              {isLastStep ? (
                <button onClick={handlePreview} className="btn-primary flex items-center gap-2 px-6 py-2.5">
                  <Eye size={15} />
                  Preview Resume
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5"
                >
                  Next <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>

          {/* ATS Panel */}
          <div className="lg:col-span-1">
            <ATSPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
