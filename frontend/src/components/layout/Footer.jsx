import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="font-display font-bold text-white text-xs">R</span>
              </div>
              <span className="font-display font-bold text-white">Resumics</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              India's #1 AI-powered resume builder. Beat ATS, get shortlisted.
            </p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 glass rounded-lg text-slate-400 hover:text-white hover:border-brand-500/30 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-2.5">
              {['Resume Builder', 'ATS Checker', 'Cover Letter', 'Templates', 'Pricing'].map(item => (
                <Link key={item} to="/register" className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-2.5">
              {['Resume Tips', 'ATS Guide', 'Interview Prep', 'Career Blog', 'FAQ'].map(item => (
                <a key={item} href="#" className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <div className="space-y-2.5">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact'].map(item => (
                <a key={item} href="#" className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © 2026 Resumics. All rights reserved. Made with <Heart size={10} className="inline text-red-400" /> in India.
          </p>
          <div className="flex items-center gap-1 text-slate-600 text-xs">
            <Mail size={10} />
            <span>resumics@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
