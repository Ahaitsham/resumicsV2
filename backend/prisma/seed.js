// backend/prisma/seed.js
// Run with: node prisma/seed.js

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@resumeaipro.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@resumeaipro.in',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create a demo user
  const demoPassword = await bcrypt.hash('Demo@123', 12)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@resumeaipro.in' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'demo@resumeaipro.in',
      password: demoPassword,
      isVerified: true,
    },
  })
  console.log('✅ Demo user created:', demo.email)

  // Create a sample resume for demo user
  await prisma.resume.create({
    data: {
      userId: demo.id,
      personalInfo: {
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        linkedin: 'linkedin.com/in/rahulsharma',
        github: 'github.com/rahulsharma',
        portfolio: 'rahulsharma.dev',
      },
      careerObjective: 'Passionate full-stack developer with 2+ years of experience building scalable web applications using React and Node.js. Seeking to leverage expertise in modern web technologies to drive innovation at a forward-thinking tech company.',
      education: [
        {
          id: 1,
          institution: 'VIT University',
          degree: 'B.Tech',
          field: 'Computer Science',
          startYear: '2019',
          endYear: '2023',
          percentage: '8.7 CGPA',
          achievements: 'Dean\'s List, Hackathon Winner',
        },
      ],
      experience: [
        {
          id: 1,
          company: 'TechStartup Pvt Ltd',
          role: 'Software Engineer',
          location: 'Bangalore',
          startDate: '2023-07',
          endDate: '',
          current: true,
          description: 'Developed RESTful APIs using Node.js reducing response time by 40%\nBuilt React dashboards serving 10,000+ daily active users\nImplemented CI/CD pipeline using GitHub Actions and Docker',
        },
      ],
      projects: [
        {
          id: 1,
          name: 'E-Commerce Platform',
          description: 'Built full-stack e-commerce with 500+ products\nIntegrated Razorpay payment gateway\nDeployed on AWS with 99.9% uptime',
          techStack: 'React, Node.js, MongoDB, AWS, Razorpay',
          githubUrl: 'github.com/rahul/ecommerce',
          liveUrl: 'mystore.vercel.app',
        },
      ],
      skills: {
        technical: ['React', 'Node.js', 'JavaScript', 'Python', 'SQL', 'MongoDB'],
        tools: ['Git', 'Docker', 'AWS', 'Postman', 'VS Code', 'Linux'],
        soft: ['Leadership', 'Problem Solving', 'Communication', 'Teamwork'],
      },
      certifications: [
        { id: 1, name: 'AWS Cloud Practitioner', issuer: 'Amazon', year: '2023', url: '' },
      ],
      achievements: [
        'Winner — Smart India Hackathon 2022',
        'Ranked top 5% in LeetCode India',
      ],
      languages: [
        { id: 1, name: 'English', proficiency: 'Professional' },
        { id: 2, name: 'Hindi', proficiency: 'Native' },
      ],
      selectedTemplate: 'modern',
      atsScore: 87,
    },
  })
  console.log('✅ Sample resume created')

  console.log('\n🎉 Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin login:')
  console.log('  Email: admin@resumeaipro.in')
  console.log('  Password: Admin@123')
  console.log('\nDemo login:')
  console.log('  Email: demo@resumeaipro.in')
  console.log('  Password: Demo@123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
