import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ── Auth Store ────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        // Always fully replace — never merge — so switching accounts is clean
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        // Clear auth store
        set({ user: null, token: null, isAuthenticated: false })
        // Also clear resume store on logout so next user starts fresh
        useResumeStore.getState().resetResume()
        // Clear any persisted resume data from localStorage
        try {
          localStorage.removeItem('resume-store')
        } catch {}
      },

      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ── Resume Store ──────────────────────────────────────────────────
export const useResumeStore = create(
  persist(
    (set, get) => ({
      personalInfo: {
        fullName: '', email: '', phone: '',
        location: '', linkedin: '', github: '', portfolio: '',
      },
      careerObjective: '',
      education: [],
      experience: [],
      projects: [],
      skills: { technical: [], soft: [], tools: [] },
      certifications: [],
      achievements: [],
      languages: [],
      enhancedContent: null,
      atsScore: null,
      atsKeywords: [],
      atsSuggestions: [],
      jobDescription: '',
      matchScore: null,
      matchKeywords: [],
      selectedTemplate: 'modern',
      isPaid: false,
      paymentId: null,
      currentStep: 0,
      isGenerating: false,
      isEnhancing: false,
      generatedResume: null,

      setPersonalInfo:    (data) => set({ personalInfo: data }),
      setCareerObjective: (text) => set({ careerObjective: text }),
      setEducation:       (data) => set({ education: data }),
      setExperience:      (data) => set({ experience: data }),
      setProjects:        (data) => set({ projects: data }),
      setSkills:          (data) => set({ skills: data }),
      setCertifications:  (data) => set({ certifications: data }),
      setAchievements:    (data) => set({ achievements: data }),
      setLanguages:       (data) => set({ languages: data }),
      setSelectedTemplate:(t)    => set({ selectedTemplate: t }),
      setCurrentStep:     (s)    => set({ currentStep: s }),
      setIsGenerating:    (v)    => set({ isGenerating: v }),
      setIsEnhancing:     (v)    => set({ isEnhancing: v }),
      setGeneratedResume: (d)    => set({ generatedResume: d }),
      setAtsData: (score, keywords, suggestions) =>
        set({ atsScore: score, atsKeywords: keywords, atsSuggestions: suggestions }),
      setMatchData:    (score, keywords) => set({ matchScore: score, matchKeywords: keywords }),
      setJobDescription:(text) => set({ jobDescription: text }),
      setEnhancedContent:(data) => set({ enhancedContent: data }),
      setPaymentStatus: (paid, paymentId) => set({ isPaid: paid, paymentId }),

      resetResume: () => set({
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        careerObjective: '',
        education: [], experience: [], projects: [],
        skills: { technical: [], soft: [], tools: [] },
        certifications: [], achievements: [], languages: [],
        enhancedContent: null,
        atsScore: null, atsKeywords: [], atsSuggestions: [],
        matchScore: null, matchKeywords: [],
        jobDescription: '',
        selectedTemplate: 'modern',
        isPaid: false, paymentId: null,
        currentStep: 0, generatedResume: null,
      }),

      getResumeData: () => {
        const s = get()
        return {
          personalInfo:   s.personalInfo,
          careerObjective:s.careerObjective,
          education:      s.education,
          experience:     s.experience,
          projects:       s.projects,
          skills:         s.skills,
          certifications: s.certifications,
          achievements:   s.achievements,
          languages:      s.languages,
        }
      },
    }),
    {
      name: 'resume-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ── UI Store ──────────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  showUrgencyPopup:  false,
  showExitIntent:    false,
  showPaymentModal:  false,
  sidebarOpen:       false,
  setShowUrgencyPopup: (v) => set({ showUrgencyPopup: v }),
  setShowExitIntent:   (v) => set({ showExitIntent: v }),
  setShowPaymentModal: (v) => set({ showPaymentModal: v }),
  setSidebarOpen:      (v) => set({ sidebarOpen: v }),
}))
