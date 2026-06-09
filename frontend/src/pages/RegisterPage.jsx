import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { authAPI } from '../lib/api'
import { useAuthStore } from '../store'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

const PERKS = [
  'Free resume preview always',
  'ATS score analysis included',
  'AI content enhancement',
  'Download for just ₹49',
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Email/password register
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register(data)
      setUser(res.data.user, res.data.token)
      toast.success("Account created! Let's build your resume 🚀")
      navigate('/builder')
    } catch (err) {
      const msg = err.response?.data?.error
        || err.message
        || 'Registration failed. Please try again.'
      toast.error(msg)
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth
  const googleLogin = useGoogleLogin({
    // Force account picker — prevents stale cached account
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const res = await authAPI.googleLogin(tokenResponse.access_token)
        setUser(res.data.user, res.data.token)
        toast.success('Account created with Google!')
        navigate('/builder')
      } catch (err) {
        toast.error(err.response?.data?.error || 'Google sign-up failed. Try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed.')
      setGoogleLoading(false)
    },
  })

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left panel — only visible on md+ */}
        <div className="hidden md:flex flex-col justify-center">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-10 transition-colors">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mb-6 neon-glow">
            <span className="font-display font-bold text-white text-lg">R</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Start Building Your<br />
            <span className="gradient-text">Dream Resume</span>
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Join 50,000+ professionals who built ATS-optimized resumes with our AI.
          </p>
          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Mobile back link */}
          <div className="md:hidden mb-4">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Free forever. Pay only when you download.</p>

          {/* ── Google Register Button ── */}
          <button
            onClick={() => { setGoogleLoading(true); googleLogin() }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 px-4 rounded-xl border border-gray-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-5 shadow-sm"
          >
            {googleLoading
              ? <Loader2 size={16} className="animate-spin text-gray-500" />
              : <GoogleIcon />
            }
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">or register with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ── Email Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name too short' },
                  })}
                  placeholder="Rahul Sharma"
                  className="input-field pl-9"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('email', {
                    required: 'Email required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  type="email"
                  placeholder="rahul@example.com"
                  className="input-field pl-9"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('password', {
                    required: 'Password required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Free Account 🚀'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="text-brand-400">Terms</a> &{' '}
            <a href="#" className="text-brand-400">Privacy Policy</a>
          </p>

          <p className="text-center text-slate-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
