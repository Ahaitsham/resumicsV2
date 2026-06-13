import React from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Instagram, Mail, Heart } from 'lucide-react'

const PRODUCT_LINKS = [
  { to: '/builder',    label: 'Resume Builder' },
  { to: '/ats-guide',  label: 'ATS Checker Guide' },
  { to: '/tools',      label: 'Cover Letter AI' },
  { to: '/tools',      label: 'Interview Prep' },
]

const RESOURCE_LINKS = [
  { to: '/ats-guide',  label: 'ATS Guide' },
  { to: '/about',      label: 'About Us' },
  { to: '/contact',    label: 'Contact' },
]

const LEGAL_LINKS = [
  { to: '/about',      label: 'About Us' },
  { to: '/privacy',    label: 'Privacy Policy' },
  { to: '/terms',      label: 'Terms of Service' },
  { to: '/refund',     label: 'Refund Policy' },
  { to: '/contact',    label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/favicon.ico" alt="Resumics"
                className="w-7 h-7 rounded-lg object-cover"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
              <div className="w-7 h-7 rounded-lg bg-brand-600 items-center justify-content-center hidden">
                <span className="font-display font-bold text-white text-xs">R</span>
              </div>
              <span className="font-display font-bold text-white">Resumics</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              India's AI-powered resume builder. Beat ATS, get shortlisted, land your dream job.
            </p>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/in/ahaitsham-15b225255/" target="_blank" rel="noopener noreferrer"
                className="p-2 glass rounded-lg text-slate-400 hover:text-white hover:border-brand-500/30 transition-all">
                <Linkedin size={14} />
              </a>
              <a href="https://www.instagram.com/resumics" target="_blank" rel="noopener noreferrer"
                className="p-2 glass rounded-lg text-slate-400 hover:text-white hover:border-pink-500/30 transition-all">
                <Instagram size={14} />
              </a>
              <a href="mailto:resumics@gmail.com"
                className="p-2 glass rounded-lg text-slate-400 hover:text-white hover:border-brand-500/30 transition-all">
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-2.5">
              {PRODUCT_LINKS.map(({ to, label }) => (
                <Link key={label} to={to}
                  className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-2.5">
              {RESOURCE_LINKS.map(({ to, label }) => (
                <Link key={label} to={to}
                  className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {label}
                </Link>
              ))}
              <a href="mailto:resumics@gmail.com"
                className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Support
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <div className="space-y-2.5">
              {LEGAL_LINKS.map(({ to, label }) => (
                <Link key={label} to={to}
                  className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Resumics by{' '}
            <a href="https://www.linkedin.com/in/ahaitsham" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors">
              Ahaitsham Khan
            </a>
            . Made with <Heart size={10} className="inline text-red-400" /> in Greater Noida, India.
          </p>
          <div className="flex items-center gap-1 text-slate-600 text-xs">
            <Mail size={10} />
            <a href="mailto:resumics@gmail.com" className="hover:text-slate-400 transition-colors">
              resumics@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
