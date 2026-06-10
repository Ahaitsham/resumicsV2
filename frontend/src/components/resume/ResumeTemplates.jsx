import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react'

// ── MODERN ATS TEMPLATE ──────────────────────────────────────────
export function ModernTemplate({ data, watermark = false }) {
  const { personalInfo = {}, careerObjective = '', education = [], experience = [], projects = [], skills = {}, certifications = [], achievements = [], languages = [] } = data || {}

  return (
    <div id="resume-preview" className={`bg-white text-gray-900 font-sans max-w-[794px] mx-auto ${watermark ? 'resume-watermark' : ''}`}
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.5', padding: '40px', minHeight: '1123px' }}>

      {/* Header */}
      <div style={{ borderBottom: '2px solid #4F46E5', paddingBottom: '16px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B', margin: '0 0 4px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: '#555', fontSize: '10px' }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>⌂ {personalInfo.github}</span>}
          {personalInfo.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Objective */}
      {careerObjective && (
        <Section title="PROFESSIONAL SUMMARY">
          <p style={{ color: '#374151', textAlign: 'justify' }}>{careerObjective}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="WORK EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '12px', color: '#1E1B4B' }}>{exp.role}</div>
                  <div style={{ color: '#4F46E5', fontWeight: '600' }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</div>
                </div>
                <div style={{ color: '#6B7280', fontSize: '10px', whiteSpace: 'nowrap' }}>
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <ul style={{ marginTop: '6px', paddingLeft: '16px' }}>
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ marginBottom: '3px', color: '#374151' }}>
                      {line.startsWith('•') ? line.slice(1).trim() : line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="EDUCATION">
          {education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#1E1B4B' }}>{edu.degree} in {edu.field}</div>
                <div style={{ color: '#4F46E5' }}>{edu.institution}</div>
                {edu.percentage && <div style={{ color: '#6B7280' }}>Score: {edu.percentage}</div>}
                {edu.achievements && <div style={{ color: '#374151', fontStyle: 'italic' }}>{edu.achievements}</div>}
              </div>
              <div style={{ color: '#6B7280', fontSize: '10px', whiteSpace: 'nowrap' }}>
                {edu.startYear} — {edu.endYear}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="PROJECTS">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '700', color: '#1E1B4B' }}>{proj.name}</div>
                <div style={{ color: '#6B7280', fontSize: '10px' }}>
                  {proj.githubUrl && <span>GitHub</span>}
                  {proj.liveUrl && <span>{proj.githubUrl ? ' | ' : ''}Live</span>}
                </div>
              </div>
              {proj.techStack && <div style={{ color: '#4F46E5', fontSize: '10px', marginBottom: '3px' }}>Tech: {proj.techStack}</div>}
              {proj.description && (
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {proj.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ color: '#374151', marginBottom: '2px' }}>
                      {line.startsWith('•') ? line.slice(1).trim() : line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
        <Section title="SKILLS">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {skills.technical?.length > 0 && (
                <tr>
                  <td style={{ fontWeight: '700', color: '#1E1B4B', width: '140px', verticalAlign: 'top', paddingBottom: '4px' }}>Technical:</td>
                  <td style={{ color: '#374151' }}>{skills.technical.join(' • ')}</td>
                </tr>
              )}
              {skills.tools?.length > 0 && (
                <tr>
                  <td style={{ fontWeight: '700', color: '#1E1B4B', verticalAlign: 'top', paddingBottom: '4px' }}>Tools:</td>
                  <td style={{ color: '#374151' }}>{skills.tools.join(' • ')}</td>
                </tr>
              )}
              {skills.soft?.length > 0 && (
                <tr>
                  <td style={{ fontWeight: '700', color: '#1E1B4B', verticalAlign: 'top' }}>Soft Skills:</td>
                  <td style={{ color: '#374151' }}>{skills.soft.join(' • ')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="CERTIFICATIONS">
          <ul style={{ paddingLeft: '16px' }}>
            {certifications.map((cert, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#1E1B4B' }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#6B7280' }}> — {cert.issuer}</span>}
                {cert.year && <span style={{ color: '#9CA3AF' }}> ({cert.year})</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && achievements.some(Boolean) && (
        <Section title="ACHIEVEMENTS">
          <ul style={{ paddingLeft: '16px' }}>
            {achievements.filter(Boolean).map((ach, i) => (
              <li key={i} style={{ marginBottom: '3px', color: '#374151' }}>{ach}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="LANGUAGES">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {languages.map((lang, i) => (
              <span key={i} style={{ color: '#374151' }}>
                <span style={{ fontWeight: '600' }}>{lang.name}</span>
                {lang.proficiency && <span style={{ color: '#9CA3AF' }}> ({lang.proficiency})</span>}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '14px', pageBreakInside: 'avoid' }}>
      <h2 style={{
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: '#4F46E5',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '4px',
        marginBottom: '8px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

// ── FRESHER TEMPLATE ─────────────────────────────────────────────
export function FresherTemplate({ data, watermark = false }) {
  const { personalInfo = {}, careerObjective = '', education = [], projects = [], skills = {}, certifications = [], achievements = [], languages = [] } = data || {}

  return (
    <div id="resume-preview" className={`bg-white text-gray-900 max-w-[794px] mx-auto ${watermark ? 'resume-watermark' : ''}`}
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.5', minHeight: '1123px' }}>

      {/* Colored top bar */}
      <div style={{ backgroundColor: '#1E1B4B', color: 'white', padding: '30px 40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>{personalInfo.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', opacity: 0.85, fontSize: '10px' }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>⌂ {personalInfo.github}</span>}
        </div>
      </div>

      <div style={{ padding: '30px 40px' }}>
        {careerObjective && (
          <Section title="OBJECTIVE">
            <p style={{ color: '#374151' }}>{careerObjective}</p>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="EDUCATION">
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '12px' }}>{edu.degree} in {edu.field}</div>
                <div style={{ color: '#4F46E5', fontWeight: '600' }}>{edu.institution}</div>
                <div style={{ color: '#6B7280' }}>{edu.startYear} — {edu.endYear} {edu.percentage && `| ${edu.percentage}`}</div>
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="PROJECTS">
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '700' }}>{proj.name}</div>
                {proj.techStack && <div style={{ color: '#4F46E5', fontSize: '10px' }}>Stack: {proj.techStack}</div>}
                {proj.description && proj.description.split('\n').filter(Boolean).map((line, j) => (
                  <div key={j} style={{ color: '#374151', marginLeft: '8px' }}>• {line}</div>
                ))}
              </div>
            ))}
          </Section>
        )}

        {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
          <Section title="SKILLS">
            {skills.technical?.length > 0 && <div><strong>Technical: </strong>{skills.technical.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><strong>Tools: </strong>{skills.tools.join(', ')}</div>}
            {skills.soft?.length > 0 && <div><strong>Soft: </strong>{skills.soft.join(', ')}</div>}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="CERTIFICATIONS">
            {certifications.map((c, i) => <div key={i}>• {c.name} {c.issuer && `— ${c.issuer}`} {c.year && `(${c.year})`}</div>)}
          </Section>
        )}

        {achievements.some(Boolean) && (
          <Section title="ACHIEVEMENTS">
            {achievements.filter(Boolean).map((a, i) => <div key={i}>• {a}</div>)}
          </Section>
        )}
      </div>
    </div>
  )
}

// Template selector
export function ResumeTemplate({ template = 'modern', data, watermark = false }) {
  switch (template) {
    case 'fresher': return <FresherTemplate data={data} watermark={watermark} />
    default: return <ModernTemplate data={data} watermark={watermark} />
  }
}
