import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, LayoutDashboard, Wrench, LogOut,
  Menu, X, ChevronDown, Shield, User, Home, Sparkles
} from 'lucide-react'
import { useAuthStore } from '../../store'
import logo from './logo.png'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const navLinks = isAuthenticated ? [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/builder',   icon: FileText,        label: 'Build Resume' },
    { to: '/tools',     icon: Wrench,          label: 'AI Tools' },
  ] : [
    { to: '/',         icon: Home,     label: 'Home' },
    { to: '/login',    icon: User,     label: 'Login' },
    { to: '/register', icon: Sparkles, label: 'Get Started' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5 shadow-xl shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
                    <img
                      src={logo}
                      alt="Resumics Logo"
                      className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                    />
          
                    <span className="font-display font-bold text-white text-lg hidden sm:block">
                      Resumics<span>.</span>
                      <span className="gradient-text">online</span>
                    </span>
                  </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} /> {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:block">
                  Get Started Free
                </Link>
              </>
            ) : (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 glass-light rounded-xl px-3 py-2 hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      {/* Click outside to close */}
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 py-2 shadow-xl z-20"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors">
                          <User size={14} /> My Resumes
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-sm transition-colors">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger — visible on mobile only */}
            <button
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center glass-light rounded-xl"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={18} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={18} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Drawer — slides in from RIGHT ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-slate-900 border-l border-white/10 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img src="/favicon.ico" alt="ResumeAI Pro" className="w-7 h-7 rounded-lg object-cover"
                    onError={(e) => { e.target.style.display='none' }} />
                  <span className="font-display font-bold text-white text-sm">ResumeAI Pro</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* User info (if logged in) */}
              {isAuthenticated && (
                <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navLinks.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to} to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === to
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={17} /> {label}
                  </Link>
                ))}

                {isAuthenticated && user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    <Shield size={17} /> Admin Panel
                  </Link>
                )}
              </div>

              {/* Bottom actions */}
              <div className="px-3 py-4 border-t border-white/10 flex-shrink-0 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/20"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full block text-center py-3 text-sm">
                      Get Started Free 🚀
                    </Link>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full block text-center py-2.5 text-slate-400 text-sm hover:text-white transition-colors">
                      Already have an account? Login
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
