import React from 'react'
import logo from './logo.png'


export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto neon-glow">
            <img 
              src={logo} 
              alt="Resumics Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute -inset-2 rounded-2xl border-2 border-brand-500/30 animate-ping"></div>
        </div>

        <p className="font-body text-slate-400 text-sm animate-pulse">
          Loading Resumics...
        </p>
      </div>
    </div>
  )
}