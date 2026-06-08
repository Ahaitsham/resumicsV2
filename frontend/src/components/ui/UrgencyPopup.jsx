import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Users, TrendingUp, Clock } from 'lucide-react'
import { useUIStore } from '../../store'
import { useNavigate } from 'react-router-dom'

const LIVE_USERS = Math.floor(Math.random() * 50) + 120

export default function UrgencyPopup() {
  const { showUrgencyPopup, setShowUrgencyPopup } = useUIStore()
  const [countdown, setCountdown] = useState(600) // 10 minutes
  const navigate = useNavigate()

  useEffect(() => {
    if (!showUrgencyPopup) return
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [showUrgencyPopup])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {showUrgencyPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowUrgencyPopup(false)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-brand-500/30 overflow-hidden shadow-2xl shadow-brand-500/20"
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-500" />
            
            <button
              onClick={() => setShowUrgencyPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6">
              {/* Live indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-medium">{LIVE_USERS} professionals building resumes right now</span>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-xl bg-brand-500/20 flex-shrink-0">
                  <Zap size={20} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-display text-white font-bold text-lg leading-tight">
                    🚀 Don't Miss Your Dream Job!
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Recruiters spend just <span className="text-white font-semibold">6 seconds</span> on a resume. Make yours impossible to ignore.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: Users, value: '50K+', label: 'Users' },
                  { icon: TrendingUp, value: '3x', label: 'More Interviews' },
                  { icon: Clock, value: '5 min', label: 'Build Time' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <Icon size={16} className="text-brand-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">{value}</div>
                    <div className="text-slate-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400" />
                  <span className="text-amber-300 text-sm font-medium">Special offer expires in:</span>
                </div>
                <span className="font-mono text-amber-400 font-bold text-lg">{formatTime(countdown)}</span>
              </div>

              <button
                onClick={() => { setShowUrgencyPopup(false); navigate('/register') }}
                className="w-full btn-primary py-3.5 text-center font-display font-semibold text-sm"
              >
                Build My ATS Resume — ₹49 Only ⚡
              </button>
              <p className="text-center text-slate-500 text-xs mt-3">
                No subscription. Pay once, download forever.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
