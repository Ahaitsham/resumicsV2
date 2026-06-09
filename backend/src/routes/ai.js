import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Lazy-init Anthropic client
let _anthropic = null
function getAI() {
  if (!_anthropic) {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('REPLACE')) {
      throw new Error('ANTHROPIC_API_KEY not set in backend/.env')
    }
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _anthropic
}

const MODEL = 'claude-sonnet-4-20250514'

// Robust JSON parser — handles markdown fences and trailing text
function parseJSON(raw) {
  // Strip markdown fences
  let clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  // Try direct parse first
  try { return JSON.parse(clean) } catch {}
  // Find first { or [ and last } or ]
  const firstBrace = clean.indexOf('{')
  const firstBracket = clean.indexOf('[')
  let start = -1
  if (firstBrace === -1) start = firstBracket
  else if (firstBracket === -1) start = firstBrace
  else start = Math.min(firstBrace, firstBracket)
  if (start === -1) throw new Error('No JSON found in response')
  const isArray = clean[start] === '['
  const endChar = isArray ? ']' : '}'
  const end = clean.lastIndexOf(endChar)
  if (end === -1) throw new Error('Malformed JSON in response')
  return JSON.parse(clean.slice(start, end + 1))
}

async function callClaude(prompt, systemPrompt, maxTokens = 2000) {
  const ai = getAI()
  const response = await ai.messages.create({
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
    const system = `You are an expert ATS resume writer for the Indian job market.
Enhance resume content professionally. Use strong action verbs, quantify achievements.
IMPORTANT: Return ONLY a valid JSON object. No markdown. No explanation. No extra text.`

    const prompt = `Enhance this resume for ATS optimization:
${JSON.stringify(userData, null, 2)}

Return ONLY this JSON (no markdown, no extra text):
{
  "careerObjective": "Enhanced 3-4 sentence professional summary with keywords",
  "experience": [array with same structure but enhanced descriptions],
  "projects": [array with same structure but better descriptions],
  "skills": { "technical": [], "soft": [], "tools": [] },
  "atsScore": 85,
  "keywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`

    const raw = await callClaude(prompt, system, 3000)
    const result = parseJSON(raw)
    res.json(result)
  } catch (err) {
    console.error('AI generate-resume error:', err.message)
    res.status(500).json({ error: 'AI generation failed: ' + err.message })
  }
})

// ── POST /api/ai/enhance-section ─────────────────────────────────
router.post('/enhance-section', authenticate, async (req, res) => {
  try {
    const { section, content, jobContext } = req.body
    const system = `You are an expert resume writer. Enhance the given section to be more professional, ATS-friendly and impactful. Return only the enhanced content as plain text.`
    const prompt = `Enhance this ${section} section for an Indian professional's resume:
${typeof content === 'string' ? content : JSON.stringify(content)}
${jobContext ? `\nJob context: ${jobContext}` : ''}

Return only the enhanced text, no explanations.`
    const result = await callClaude(prompt, system, 1500)
    res.json({ enhanced: result })
  } catch (err) {
    console.error('Enhance error:', err.message)
    res.status(500).json({ error: 'Enhancement failed: ' + err.message })
  }
})

// ── POST /api/ai/ats-score ────────────────────────────────────────
router.post('/ats-score', authenticate, async (req, res) => {
  try {
    const resumeData = req.body
    const system = `You are an ATS expert. Analyze resumes and provide detailed scores. Return ONLY valid JSON, no markdown, no extra text.`
    const prompt = `Analyze this resume for ATS compatibility:
${JSON.stringify(resumeData, null, 2)}

Return ONLY this JSON:
{
  "score": 85,
  "breakdown": { "contactInfo": 20, "summary": 15, "experience": 20, "education": 15, "skills": 15, "format": 15 },
  "keywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "strengths": ["strength1", "strength2"]
}`
    const raw = await callClaude(prompt, system, 1500)
    const result = parseJSON(raw)
    res.json(result)
  } catch (err) {
    console.error('ATS score error:', err.message)
    res.status(500).json({ error: 'ATS analysis failed: ' + err.message })
  }
})

// ── POST /api/ai/job-match ────────────────────────────────────────
router.post('/job-match', authenticate, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body
    if (!jobDescription?.trim()) {
      return res.status(400).json({ error: 'Job description is required' })
    }
    const system = `You are a job matching expert for Indian job market. Analyze resume vs JD carefully. Return ONLY valid JSON, no markdown.`
    const prompt = `Compare this resume to the job description and give an accurate match score:

RESUME SKILLS: ${JSON.stringify(resumeData?.skills || {})}
RESUME EXPERIENCE: ${JSON.stringify(resumeData?.experience || [])}
RESUME OBJECTIVE: ${resumeData?.careerObjective || ''}

JOB DESCRIPTION:
${jobDescription}

Return ONLY this JSON (matchScore must be accurate 0-100, NOT always 40):
{
  "matchScore": 72,
  "matchedKeywords": ["react", "nodejs"],
  "missingKeywords": ["kubernetes", "terraform"],
  "recommendations": ["Add kubernetes experience", "Highlight REST API work", "Mention agile methodology"],
  "tailoredObjective": "Rewritten career objective targeting this specific job"
}`
    const raw = await callClaude(prompt, system, 1500)
    const result = parseJSON(raw)
    res.json(result)
  } catch (err) {
    console.error('Job match error:', err.message)
    res.status(500).json({ error: 'Job match analysis failed: ' + err.message })
  }
})

// ── POST /api/ai/cover-letter ─────────────────────────────────────
router.post('/cover-letter', authenticate, async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName } = req.body
    const system = `You are an expert cover letter writer for Indian job applications. Write compelling, personalized cover letters.`
    const prompt = `Write a professional cover letter for:
Name: ${resumeData?.personalInfo?.fullName || 'the candidate'}
Company: ${companyName || 'the company'}
Role highlights: ${resumeData?.careerObjective || ''}
Top skills: ${JSON.stringify(resumeData?.skills?.technical?.slice(0, 6) || [])}
Job Description: ${jobDescription || 'General application'}

Write a compelling 3-paragraph cover letter (under 300 words). Professional but personable.`
    const result = await callClaude(prompt, system, 1000)
    res.json({ coverLetter: result })
  } catch (err) {
    console.error('Cover letter error:', err.message)
    res.status(500).json({ error: 'Cover letter generation failed: ' + err.message })
  }
})

// ── POST /api/ai/linkedin-headline ───────────────────────────────
router.post('/linkedin-headline', authenticate, async (req, res) => {
  try {
    const { resumeData } = req.body
    const system = `You are a LinkedIn optimization expert. Create compelling headlines that attract Indian recruiters. Return plain text only.`
    const prompt = `Generate 5 LinkedIn headline options for this professional:
Name: ${resumeData?.personalInfo?.fullName || ''}
Skills: ${JSON.stringify(resumeData?.skills?.technical?.slice(0, 8) || [])}
Latest role: ${resumeData?.experience?.[0]?.role || ''} at ${resumeData?.experience?.[0]?.company || ''}
Objective: ${resumeData?.careerObjective?.slice(0, 200) || ''}

Return exactly 5 headlines, one per line. Max 220 chars each. No numbering, no bullets.`
    const result = await callClaude(prompt, system, 500)
    const headlines = result.split('\n').map(h => h.trim()).filter(h => h.length > 10).slice(0, 5)
    res.json({ headlines })
  } catch (err) {
    console.error('LinkedIn error:', err.message)
    res.status(500).json({ error: 'LinkedIn headline generation failed: ' + err.message })
  }
})

// ── POST /api/ai/interview-questions ─────────────────────────────
router.post('/interview-questions', authenticate, async (req, res) => {
  try {
    const { resumeData, jobRole } = req.body
    const system = `You are an experienced technical interviewer and career coach for Indian companies like TCS, Infosys, Wipro, startups and MNCs.
Generate relevant interview questions with detailed model answers.
CRITICAL: Return ONLY a valid JSON object. No markdown. No code fences. No explanation. Start your response with { and end with }.`

    const prompt = `Generate 6 interview questions for: ${jobRole || 'Software Engineer'}

Candidate background:
- Skills: ${JSON.stringify(resumeData?.skills?.technical?.slice(0, 8) || [])}
- Experience: ${resumeData?.experience?.[0]?.role || 'Fresher'} at ${resumeData?.experience?.[0]?.company || 'N/A'}
- Projects: ${resumeData?.projects?.map(p => p.name).join(', ') || 'None listed'}
- Education: ${resumeData?.education?.[0]?.degree || ''} from ${resumeData?.education?.[0]?.institution || ''}

Return this exact JSON structure (no markdown, start with {):
{"questions":[{"question":"Tell me about yourself","answer":"Based on your background, you should say...","type":"behavioral"},{"question":"second question","answer":"model answer","type":"technical"}]}`

    const raw = await callClaude(prompt, system, 2500)
    console.log('Interview raw response (first 200):', raw.slice(0, 200))

    let result
    try {
      result = parseJSON(raw)
    } catch (parseErr) {
      console.error('JSON parse failed for interview questions:', parseErr.message)
      console.error('Raw response was:', raw.slice(0, 500))
      // Fallback: return a structured error with partial content
      return res.status(500).json({
        error: 'AI returned invalid JSON. Please try again.',
        details: parseErr.message,
      })
    }

    if (!result.questions || !Array.isArray(result.questions)) {
      return res.status(500).json({ error: 'Invalid response format. Please try again.' })
    }

    res.json(result)
  } catch (err) {
    console.error('Interview questions error:', err.message)
    res.status(500).json({ error: 'Interview questions generation failed: ' + err.message })
  }
})

export default router
