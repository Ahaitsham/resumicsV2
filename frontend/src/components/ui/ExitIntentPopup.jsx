import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ArrowRight } from 'lucide-react'
import { useUIStore } from '../../store'
import { useNavigate } from 'react-router-dom'

export default function ExitIntentPopup() {
  const { showExitIntent, setShowExitIntent } = useUIStore()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {showExitIntent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowExitIntent(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-brand-900 to-slate-900 rounded-3xl border border-brand-500/40 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
            
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Wait! Your Resume Could Be Costing You Jobs
              </h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                75% of resumes are rejected by ATS before a human even sees them. 
                Let our AI fix yours in under 5 minutes.
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <Gift size={20} className="text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-slate-300">
                    Get a <span className="text-amber-400 font-bold">FREE ATS score check</span> — no payment needed. See exactly what's wrong.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setShowExitIntent(false); navigate('/register') }}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              >
                Get Free ATS Check <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setShowExitIntent(false)}
                className="mt-3 text-slate-500 text-xs hover:text-slate-400 transition-colors"
              >
                No thanks, I'll risk my career
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
