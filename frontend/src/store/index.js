import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'auth-store' }
  )
)

// Resume Store
export const useResumeStore = create(
  persist(
    (set, get) => ({
      // Form data
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
      },
      careerObjective: '',
      education: [],
      experience: [],
      projects: [],
      skills: { technical: [], soft: [], tools: [] },
      certifications: [],
      achievements: [],
      languages: [],
      
      // AI enhanced content
      enhancedContent: null,
      
      // ATS data
      atsScore: null,
      atsKeywords: [],
      atsSuggestions: [],
      
      // Job match
      jobDescription: '',
      matchScore: null,
      matchKeywords: [],
      
      // Template
      selectedTemplate: 'modern',
      
      // Payment
      isPaid: false,
      paymentId: null,
      
      // UI state
      currentStep: 0,
      isGenerating: false,
      isEnhancing: false,
      generatedResume: null,

      // Actions
      setPersonalInfo: (data) => set({ personalInfo: data }),
      setCareerObjective: (text) => set({ careerObjective: text }),
      setEducation: (data) => set({ education: data }),
      setExperience: (data) => set({ experience: data }),
      setProjects: (data) => set({ projects: data }),
      setSkills: (data) => set({ skills: data }),
      setCertifications: (data) => set({ certifications: data }),
      setAchievements: (data) => set({ achievements: data }),
      setLanguages: (data) => set({ languages: data }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsGenerating: (val) => set({ isGenerating: val }),
      setIsEnhancing: (val) => set({ isEnhancing: val }),
      setGeneratedResume: (data) => set({ generatedResume: data }),
      setAtsData: (score, keywords, suggestions) => set({ atsScore: score, atsKeywords: keywords, atsSuggestions: suggestions }),
      setMatchData: (score, keywords) => set({ matchScore: score, matchKeywords: keywords }),
      setJobDescription: (text) => set({ jobDescription: text }),
      setEnhancedContent: (data) => set({ enhancedContent: data }),
      setPaymentStatus: (paid, paymentId) => set({ isPaid: paid, paymentId }),
      
      resetResume: () => set({
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
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
        matchScore: null,
        matchKeywords: [],
        jobDescription: '',
        selectedTemplate: 'modern',
        isPaid: false,
        paymentId: null,
        currentStep: 0,
        generatedResume: null,
      }),

      getResumeData: () => {
        const state = get()
        return {
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
      }
    }),
    { name: 'resume-store' }
  )
)

// UI Store
export const useUIStore = create((set) => ({
  showUrgencyPopup: false,
  showExitIntent: false,
  showPaymentModal: false,
  sidebarOpen: false,
  
  setShowUrgencyPopup: (val) => set({ showUrgencyPopup: val }),
  setShowExitIntent: (val) => set({ showExitIntent: val }),
  setShowPaymentModal: (val) => set({ showPaymentModal: val }),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
}))
