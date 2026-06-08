import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'Resumics'}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Reset your Resumics password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #020617; color: #F8FAFC; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #4F46E5; border-radius: 12px; line-height: 48px; text-align: center; font-size: 20px; font-weight: bold; color: white;">R</div>
          <h1 style="color: white; font-size: 24px; margin: 16px 0 0;">Resumics</h1>
        </div>
        <h2 style="color: white;">Password Reset Request</h2>
        <p style="color: #94A3B8;">Hi ${name},</p>
        <p style="color: #94A3B8;">We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748B; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        <p style="color: #334155; font-size: 12px; border-top: 1px solid #1E293B; padding-top: 16px; margin-top: 32px;">
          Resumics · India's #1 AI Resume Builder
        </p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email, name) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: '🚀 Welcome to Resumics!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #020617; color: #F8FAFC; padding: 40px; border-radius: 16px;">
        <h1 style="color: white;">Welcome, ${name}! 🎉</h1>
        <p style="color: #94A3B8;">You're now part of 50,000+ professionals building better resumes with AI.</p>
        <a href="${process.env.FRONTEND_URL}/builder" style="display: inline-block; background: #4F46E5; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Build My First Resume →
        </a>
        <p style="color: #64748B; font-size: 13px;">Remember: Preview is always free. Pay just ₹49 to download.</p>
      </div>
    `,
  })
}
