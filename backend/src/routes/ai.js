import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// const MODEL = 'claude-sonnet-4-20250514'
const MODEL = 'claude-sonnet-4-6'

async function callClaude(prompt, systemPrompt, maxTokens = 2000) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })
  return response.content[0].text
}

// ── POST /api/ai/generate-resume ──────────────────────────────────
router.post('/generate-resume', authenticate, async (req, res) => {
  try {
    const userData = req.body
    const system = `You are an expert ATS resume writer and career coach specializing in the Indian job market.
Your task is to enhance and rewrite the user's resume content professionally.
RULES:
- Use strong action verbs (Led, Built, Developed, Implemented, Increased, Reduced, etc.)
- Quantify achievements with numbers/percentages wherever possible
- Use industry-standard keywords for ATS optimization
- Write in third person implied (no "I" or "we")
- Be concise and impactful
- Return ONLY valid JSON, no markdown, no explanations`

    const prompt = `Enhance this resume data for ATS optimization and professional quality:
${JSON.stringify(userData, null, 2)}

Return a JSON object with these fields:
{
  "careerObjective": "Enhanced 3-4 sentence professional summary with keywords",
  "experience": [same structure but with enhanced descriptions - use bullet points with strong verbs],
  "projects": [same structure but with better technical descriptions and impact],
  "skills": { keep structure, may suggest additions },
  "atsScore": number 0-100,
  "keywords": ["array", "of", "key", "skills"],
  "suggestions": ["improvement suggestion 1", "suggestion 2", "suggestion 3"]
}`

    const raw = await callClaude(prompt, system, 3000)
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)

    res.json(result)
  } catch (err) {
    console.error('AI generate error:', err)
    
    res.status(500).json({ error: 'AI generation failed', details: err.message })
  }
})

// ── POST /api/ai/enhance-section ─────────────────────────────────
router.post('/enhance-section', authenticate, async (req, res) => {
  try {
    const { section, content, jobContext } = req.body
    const system = `You are an expert resume writer. Enhance the given resume section to be more professional, ATS-friendly, and impactful. Return only the enhanced content as plain text or JSON matching the input format.`
    const prompt = `Enhance this ${section} section:
${typeof content === 'string' ? content : JSON.stringify(content)}
${jobContext ? `\nJob context: ${jobContext}` : ''}`

    const result = await callClaude(prompt, system, 1500)
    res.json({ enhanced: result })
  } catch (err) {
    res.status(500).json({ error: 'Enhancement failed' })
  }
})

// ── POST /api/ai/ats-score ────────────────────────────────────────
router.post('/ats-score', authenticate, async (req, res) => {
  try {
    const resumeData = req.body
    const system = `You are an ATS (Applicant Tracking System) expert. Analyze resumes and provide detailed ATS scores. Return ONLY valid JSON.`
    const prompt = `Analyze this resume for ATS compatibility and return:
${JSON.stringify(resumeData, null, 2)}

Return JSON:
{
  "score": number (0-100),
  "breakdown": {
    "contactInfo": number,
    "summary": number,
    "experience": number,
    "education": number,
    "skills": number,
    "format": number
  },
  "keywords": ["detected", "keywords"],
  "missingKeywords": ["suggested", "keywords", "to", "add"],
  "suggestions": ["actionable suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "strengths": ["strength 1", "strength 2"]
}`

    const raw = await callClaude(prompt, system, 1500)
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'ATS analysis failed' })
  }
})

// ── POST /api/ai/job-match ────────────────────────────────────────
router.post('/job-match', authenticate, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body
    const system = `You are a job matching expert. Analyze resume vs job description and return JSON only.`
    const prompt = `Compare this resume to the job description:

RESUME: ${JSON.stringify(resumeData, null, 2)}
JOB DESCRIPTION: ${jobDescription}

Return JSON:
{
  "matchScore": number (0-100),
  "matchedKeywords": ["matched", "keywords"],
  "missingKeywords": ["missing", "important", "keywords"],
  "recommendations": ["specific action to improve match 1", "action 2", "action 3"],
  "tailoredObjective": "Rewritten career objective targeting this specific job"
}`

    const raw = await callClaude(prompt, system, 1500)
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Job match analysis failed' })
  }
})

// ── POST /api/ai/cover-letter ─────────────────────────────────────
router.post('/cover-letter', authenticate, async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName } = req.body
    const system = `You are an expert cover letter writer specializing in professional Indian job applications. Write compelling, personalized cover letters that get interviews.`
    const prompt = `Write a professional cover letter for:
Name: ${resumeData?.personalInfo?.fullName}
Company: ${companyName || 'the company'}
Resume: ${JSON.stringify(resumeData, null, 2)}
Job Description: ${jobDescription || 'General application'}

Write a compelling 3-paragraph cover letter that:
1. Opens with a strong hook mentioning the role and company
2. Highlights 2-3 key achievements relevant to the role
3. Closes with confidence and clear call to action
Keep it under 300 words. Professional but personable tone.`

    const result = await callClaude(prompt, system, 1000)
    res.json({ coverLetter: result })
  } catch (err) {
    res.status(500).json({ error: 'Cover letter generation failed' })
  }
})

// ── POST /api/ai/linkedin-headline ───────────────────────────────
router.post('/linkedin-headline', authenticate, async (req, res) => {
  try {
    const { resumeData } = req.body
    const system = `You are a LinkedIn optimization expert. Create compelling headlines that attract recruiters.`
    const prompt = `Based on this resume data, generate 5 different LinkedIn headline options:
${JSON.stringify(resumeData?.personalInfo || {}, null, 2)}
Skills: ${JSON.stringify(resumeData?.skills || {}, null, 2)}
Experience: ${JSON.stringify(resumeData?.experience?.[0] || {}, null, 2)}

Return 5 headlines, each on a new line. Max 220 characters each.
Make them specific, value-driven, and keyword-rich.`

    const result = await callClaude(prompt, system, 500)
    const headlines = result.split('\n').filter(h => h.trim()).slice(0, 5)
    res.json({ headlines })
  } catch (err) {
    res.status(500).json({ error: 'LinkedIn headline generation failed' })
  }
})

// ── POST /api/ai/interview-questions ─────────────────────────────
router.post('/interview-questions', authenticate, async (req, res) => {
  try {
    const { resumeData, jobRole } = req.body
    const system = `You are an experienced technical interviewer and career coach. Generate relevant interview questions with model answers. Return ONLY valid JSON.`
    const prompt = `Generate 8 interview questions for this candidate applying for ${jobRole || 'a software role'}:
${JSON.stringify(resumeData, null, 2)}

Return JSON:
{
  "questions": [
    { "question": "...", "answer": "Personalized model answer based on their resume...", "type": "behavioral|technical|situational" },
    ...8 questions
  ]
}`

    const raw = await callClaude(prompt, system, 2000)
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Interview questions generation failed' })
  }
})


router.get('/models', async (req, res) => {
  try {
    const models = await anthropic.models.list()
    res.json(models)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})



export default router
