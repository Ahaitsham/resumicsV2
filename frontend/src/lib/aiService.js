// AI Service — calls our backend which proxies to Claude/Gemini
import api from './api'

export const aiService = {
  // Generate full resume content
  async generateResume(userData) {
    const response = await api.post('/ai/generate-resume', userData)
    return response.data
  },

  // Enhance a specific section
  async enhanceSection(section, content, jobContext = '') {
    const response = await api.post('/ai/enhance-section', { section, content, jobContext })
    return response.data
  },

  // Analyze ATS score
  async analyzeATS(resumeData) {
    const response = await api.post('/ai/ats-score', resumeData)
    return response.data
  },

  // Job description matching
  async matchJobDescription(resumeData, jobDescription) {
    const response = await api.post('/ai/job-match', { resumeData, jobDescription })
    return response.data
  },

  // Generate cover letter
  async generateCoverLetter(resumeData, jobDescription, companyName) {
    const response = await api.post('/ai/cover-letter', { resumeData, jobDescription, companyName })
    return response.data
  },

  // Generate LinkedIn headline
  async generateLinkedInHeadline(resumeData) {
    const response = await api.post('/ai/linkedin-headline', { resumeData })
    return response.data
  },

  // Generate interview questions
  async generateInterviewQuestions(resumeData, jobRole) {
    const response = await api.post('/ai/interview-questions', { resumeData, jobRole })
    return response.data
  },
}

// ATS Score calculator (client-side quick check)
export function calculateQuickATSScore(resumeData) {
  let score = 0
  const suggestions = []
  const keywords = []

  const { personalInfo, careerObjective, education, experience, projects, skills, certifications, achievements } = resumeData

  // Personal info completeness (20 pts)
  if (personalInfo?.fullName) score += 4
  if (personalInfo?.email) score += 4
  if (personalInfo?.phone) score += 4
  if (personalInfo?.location) score += 4
  if (personalInfo?.linkedin) score += 2
  else suggestions.push('Add LinkedIn profile URL')
  if (personalInfo?.github) score += 2
  else suggestions.push('Add GitHub profile URL')

  // Career objective (10 pts)
  if (careerObjective && careerObjective.length > 50) {
    score += 10
  } else {
    suggestions.push('Add a compelling career objective (50+ characters)')
  }

  // Education (15 pts)
  if (education?.length > 0) {
    score += 10
    if (education[0]?.gpa || education[0]?.percentage) score += 5
  } else {
    suggestions.push('Add your education details')
  }

  // Experience (20 pts)
  if (experience?.length > 0) {
    score += 10
    experience.forEach(exp => {
      if (exp.description && exp.description.length > 100) score += 5
    })
    score = Math.min(score, score) // cap
  } else {
    suggestions.push('Add work experience or internships')
  }

  // Projects (15 pts)
  if (projects?.length > 0) {
    score += 8
    if (projects?.length >= 2) score += 7
  } else {
    suggestions.push('Add at least 2 projects')
  }

  // Skills (10 pts)
  const totalSkills = (skills?.technical?.length || 0) + (skills?.soft?.length || 0) + (skills?.tools?.length || 0)
  if (totalSkills >= 10) score += 10
  else if (totalSkills >= 5) score += 6
  else suggestions.push('Add more skills (aim for 10+)')

  // Certifications (5 pts)
  if (certifications?.length > 0) score += 5
  else suggestions.push('Add certifications to stand out')

  // Achievements (5 pts)
  if (achievements?.length > 0) score += 5
  else suggestions.push('Add achievements with quantified results')

  // Extract keywords from skills
  if (skills?.technical) keywords.push(...(skills.technical || []))
  if (skills?.tools) keywords.push(...(skills.tools || []))

  return {
    score: Math.min(100, score),
    suggestions: suggestions.slice(0, 5),
    keywords: keywords.slice(0, 10),
  }
}
