import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto neon-glow">
            <span className="font-display text-2xl font-bold text-white">R</span>
          </div>
          <div className="absolute -inset-2 rounded-2xl border-2 border-brand-500/30 animate-ping"></div>
        </div>
        <p className="font-body text-slate-400 text-sm animate-pulse">Loading Resumics...</p>
      </div>
    </div>
  )
}
