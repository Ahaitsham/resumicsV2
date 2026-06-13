import { pdf, Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'

// ── Colours ───────────────────────────────────────────────────────
const BRAND = '#4F46E5'
const DARK  = '#1E1B4B'
const GRAY  = '#374151'
const LIGHT = '#6B7280'
const LINE  = '#E5E7EB'

const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: GRAY,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
    backgroundColor: '#ffffff',
  },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2, marginBottom: 2 },
  contactText: { fontSize: 8, color: LIGHT },
  contactLink: { fontSize: 8, color: BRAND, textDecoration: 'none' },
  headerLine: { borderBottomWidth: 1.5, borderBottomColor: BRAND, marginTop: 8 },

  section: { marginTop: 10 },
  sectionTitle: {
    fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: BRAND,
    letterSpacing: 1.2, textTransform: 'uppercase',
    borderBottomWidth: 0.5, borderBottomColor: LINE,
    paddingBottom: 3, marginBottom: 6,
  },

  entryBlock: { marginBottom: 8 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  entryTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: DARK },
  entryDate: { fontSize: 8, color: LIGHT },
  entrySubtitle: { fontSize: 8.5, color: BRAND, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  entryMeta: { fontSize: 8, color: LIGHT, marginBottom: 2 },

  bulletRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 6 },
  bulletDot: { fontSize: 9, color: GRAY, marginRight: 5, marginTop: 0.5 },
  bulletText: { fontSize: 8.5, color: GRAY, flex: 1, lineHeight: 1.45 },

  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: DARK, width: 72 },
  skillValue: { fontSize: 8.5, color: GRAY, flex: 1, lineHeight: 1.4 },
  listItem: { fontSize: 8.5, color: GRAY, marginBottom: 2.5, lineHeight: 1.4 },
})

function Bullet({ text }) {
  const clean = text.replace(/^[•\-–]\s*/, '').trim()
  if (!clean) return null
  return (
    <View style={S.bulletRow}>
      <Text style={S.bulletDot}>•</Text>
      <Text style={S.bulletText}>{clean}</Text>
    </View>
  )
}

function Section({ title, children }) {
  return (
    <View style={S.section}>
      <Text style={S.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

function ResumePDF({ data }) {
  const {
    personalInfo = {}, careerObjective = '',
    education = [], experience = [], projects = [],
    skills = {}, certifications = [], achievements = [], languages = [],
  } = data || {}

  const contacts = [
    { v: personalInfo.email,     h: personalInfo.email     ? `mailto:${personalInfo.email}` : null },
    { v: personalInfo.phone,     h: null },
    { v: personalInfo.location,  h: null },
    { v: personalInfo.linkedin,  h: personalInfo.linkedin  ? `https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}` : null },
    { v: personalInfo.github,    h: personalInfo.github    ? `https://${personalInfo.github.replace(/^https?:\/\//, '')}` : null },
    { v: personalInfo.portfolio, h: personalInfo.portfolio ? `https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}` : null },
  ].filter(c => c.v)

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* Header */}
        <View>
          <Text style={S.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <View style={S.contactRow}>
            {contacts.map((c, i) => (
              c.h
                ? <Text key={i} style={S.contactLink}><Link src={c.h}>{c.v}</Link></Text>
                : <Text key={i} style={S.contactText}>{c.v}</Text>
            ))}
          </View>
          <View style={S.headerLine} />
        </View>

        {/* Summary */}
        {careerObjective ? (
          <Section title="Professional Summary">
            <Text style={{ fontSize: 8.5, lineHeight: 1.5, textAlign: 'justify', color: GRAY }}>{careerObjective}</Text>
          </Section>
        ) : null}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience">
            {experience.map((exp, i) => (
              <View key={i} style={S.entryBlock} wrap={false}>
                <View style={S.entryRow}>
                  <Text style={S.entryTitle}>{exp.role}</Text>
                  <Text style={S.entryDate}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <Text style={S.entrySubtitle}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</Text>
                {(exp.description || '').split('\n').filter(Boolean).map((l, j) => <Bullet key={j} text={l} />)}
              </View>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <View key={i} style={S.entryBlock} wrap={false}>
                <View style={S.entryRow}>
                  <Text style={S.entryTitle}>{edu.degree} in {edu.field}</Text>
                  <Text style={S.entryDate}>{edu.startYear} — {edu.endYear}</Text>
                </View>
                <Text style={S.entrySubtitle}>{edu.institution}</Text>
                {edu.percentage ? <Text style={S.entryMeta}>Score: {edu.percentage}</Text> : null}
                {edu.achievements ? <Text style={S.entryMeta}>{edu.achievements}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((proj, i) => (
              <View key={i} style={S.entryBlock} wrap={false}>
                <View style={S.entryRow}>
                  <Text style={S.entryTitle}>{proj.name}</Text>
                  <Text style={S.entryDate}>{proj.liveUrl ? 'Live' : proj.githubUrl ? 'GitHub' : ''}</Text>
                </View>
                {proj.techStack ? <Text style={S.entrySubtitle}>Tech: {proj.techStack}</Text> : null}
                {(proj.description || '').split('\n').filter(Boolean).map((l, j) => <Bullet key={j} text={l} />)}
              </View>
            ))}
          </Section>
        )}

        {/* Skills */}
        {(skills.technical?.length || skills.tools?.length || skills.soft?.length) ? (
          <Section title="Skills">
            {skills.technical?.length > 0 && <View style={S.skillRow}><Text style={S.skillLabel}>Technical:</Text><Text style={S.skillValue}>{skills.technical.join(' • ')}</Text></View>}
            {skills.tools?.length      > 0 && <View style={S.skillRow}><Text style={S.skillLabel}>Tools:</Text><Text style={S.skillValue}>{skills.tools.join(' • ')}</Text></View>}
            {skills.soft?.length       > 0 && <View style={S.skillRow}><Text style={S.skillLabel}>Soft Skills:</Text><Text style={S.skillValue}>{skills.soft.join(' • ')}</Text></View>}
          </Section>
        ) : null}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((c, i) => (
              <Text key={i} style={S.listItem}>
                • {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}
              </Text>
            ))}
          </Section>
        )}

        {/* Achievements */}
        {achievements.filter(Boolean).length > 0 && (
          <Section title="Achievements">
            {achievements.filter(Boolean).map((a, i) => <Text key={i} style={S.listItem}>• {a}</Text>)}
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 20 }}>
              {languages.map((l, i) => (
                <Text key={i} style={S.listItem}>{l.name}{l.proficiency ? ` (${l.proficiency})` : ''}</Text>
              ))}
            </View>
          </Section>
        )}

      </Page>
    </Document>
  )
}

// ── Main export ───────────────────────────────────────────────────
export async function generatePDF(elementId, filename = 'resume.pdf', resumeData = null) {
  if (resumeData) {
    try {
      const blob = await pdf(<ResumePDF data={resumeData} />).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = filename
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 3000)
      return true
    } catch (err) {
      console.error('Vector PDF error, using canvas fallback:', err.message)
    }
  }
  return canvasFallback(elementId, filename)
}

export async function generatePDFBlob(elementId, resumeData = null) {
  if (resumeData) {
    try { return await pdf(<ResumePDF data={resumeData} />).toBlob() } catch {}
  }
  return canvasBlobFallback(elementId)
}

// ── Canvas fallback ───────────────────────────────────────────────
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

async function getCanvas(el) {
  const s = { w: el.style.width, mw: el.style.maxWidth, mh: el.style.minHeight, t: el.style.transform }
  el.style.width = '794px'; el.style.maxWidth = '794px'
  el.style.minHeight = 'unset'; el.style.transform = 'none'
  void el.offsetHeight
  let c
  try {
    c = await html2canvas(el, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#fff', logging: false, width: 794, windowWidth: 794, height: el.scrollHeight, windowHeight: el.scrollHeight })
  } finally {
    el.style.width = s.w; el.style.maxWidth = s.mw; el.style.minHeight = s.mh; el.style.transform = s.t
  }
  return c
}

async function canvasFallback(elementId, filename) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Element not found')
  const c = await getCanvas(el)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight()
  const r = w / c.width, ch = c.height * r
  doc.addImage(c.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, w, Math.min(ch, h))
  doc.save(filename)
  return true
}

async function canvasBlobFallback(elementId) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Element not found')
  const c = await getCanvas(el)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight()
  const r = w / c.width, ch = c.height * r
  doc.addImage(c.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, w, Math.min(ch, h))
  return doc.output('blob')
}
