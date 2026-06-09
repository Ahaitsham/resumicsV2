import express from 'express'
import { prisma } from '../index.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// POST /api/resume/save
router.post('/save', authenticate, async (req, res) => {
  try {
    const { id, personalInfo, careerObjective, education, experience, projects,
      skills, certifications, achievements, languages, selectedTemplate, atsScore } = req.body

    const data = {
      userId: req.user.id,
      personalInfo: personalInfo || {},
      careerObjective: careerObjective || '',
      education: education || [],
      experience: experience || [],
      projects: projects || [],
      skills: skills || {},
      certifications: certifications || [],
      achievements: achievements || [],
      languages: languages || [],
      selectedTemplate: selectedTemplate || 'modern',
      atsScore: atsScore || null,
    }

    let resume
    if (id) {
      const existing = await prisma.resume.findFirst({ where: { id, userId: req.user.id } })
      if (!existing) return res.status(404).json({ error: 'Resume not found' })
      resume = await prisma.resume.update({ where: { id }, data })
    } else {
      resume = await prisma.resume.create({ data })
    }

    res.json({ resume, message: 'Resume saved' })
  } catch (err) {
    console.error('Save error:', err)
    res.status(500).json({ error: 'Failed to save resume' })
  }
})

// GET /api/resume/list
router.get('/list', authenticate, async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, personalInfo: true, selectedTemplate: true,
        atsScore: true, isPaid: true, updatedAt: true, createdAt: true,
      },
    })
    res.json({ resumes })
  } catch (err) {
    console.error('List error:', err)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

// GET /api/resume/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!resume) return res.status(404).json({ error: 'Resume not found' })
    res.json({ resume })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// DELETE /api/resume/:id
// Fix: paid resumes have a related Payment record — must delete it first (cascade issue)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!resume) return res.status(404).json({ error: 'Resume not found' })

    // Delete related payment record first (if exists) to avoid FK constraint error
    await prisma.payment.deleteMany({ where: { resumeId: req.params.id } })

    // Now delete the resume safely
    await prisma.resume.delete({ where: { id: req.params.id } })

    res.json({ message: 'Resume deleted successfully' })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: 'Failed to delete resume: ' + err.message })
  }
})

export default router
