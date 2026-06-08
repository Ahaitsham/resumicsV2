import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Download, FileText, TrendingUp, BarChart3, Loader2, RefreshCw } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { adminAPI } from '../lib/api'
import { format } from 'date-fns'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, paymentsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getPayments(),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.users || [])
      setPayments(paymentsRes.data.payments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const STAT_CARDS = stats ? [
    { icon: Users, label: 'Total Users', value: stats.totalUsers || 0, sub: `+${stats.newUsersToday || 0} today`, color: 'text-brand-400' },
    { icon: FileText, label: 'Total Resumes', value: stats.totalResumes || 0, sub: `${stats.resumesToday || 0} today`, color: 'text-cyan-400' },
    { icon: DollarSign, label: 'Total Revenue', value: `₹${((stats.totalRevenue || 0) / 100).toFixed(0)}`, sub: `₹${((stats.revenueToday || 0) / 100).toFixed(0)} today`, color: 'text-green-400' },
    { icon: Download, label: 'Downloads', value: stats.totalDownloads || 0, sub: `${stats.downloadsToday || 0} today`, color: 'text-amber-400' },
  ] : []

  const TABS = ['overview', 'users', 'payments']

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Monitor users, payments, and growth</p>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 glass-light px-4 py-2 rounded-xl text-slate-300 text-sm hover:bg-white/10 transition-all">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-60">
            <Loader2 size={32} className="animate-spin text-brand-400" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {STAT_CARDS.map(({ icon: Icon, label, value, sub, color }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="card"
                    >
                      <Icon size={18} className={`${color} mb-2`} />
                      <div className="font-display text-2xl font-bold text-white mb-0.5">{value}</div>
                      <div className="text-slate-500 text-xs mb-1">{label}</div>
                      <div className="text-green-400 text-xs">{sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="card">
                  <h3 className="font-display text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand-400" /> Recent Payments
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['User', 'Amount', 'Date', 'Status'].map(h => (
                            <th key={h} className="text-left text-slate-500 text-xs py-2 pr-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {payments.slice(0, 5).map((p, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-3 pr-4 text-slate-300 text-xs">{p.user?.name || 'Unknown'}</td>
                            <td className="py-3 pr-4 text-white text-xs font-medium">₹{(p.amount / 100).toFixed(0)}</td>
                            <td className="py-3 pr-4 text-slate-500 text-xs">{p.createdAt ? format(new Date(p.createdAt), 'MMM d, yyyy') : '—'}</td>
                            <td className="py-3 text-xs">
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                {p.status || 'completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {payments.length === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-600 text-xs">No payments yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="card">
                <h3 className="font-display text-white font-semibold mb-4">All Users ({users.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Name', 'Email', 'Resumes', 'Joined', 'Role'].map(h => (
                          <th key={h} className="text-left text-slate-500 text-xs py-2 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/2">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300 text-xs font-bold">
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-white text-xs">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-400 text-xs">{u.email}</td>
                          <td className="py-3 pr-4 text-slate-300 text-xs">{u._count?.resumes || 0}</td>
                          <td className="py-3 pr-4 text-slate-500 text-xs">{u.createdAt ? format(new Date(u.createdAt), 'MMM d') : '—'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-400'}`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-slate-600 text-xs">No users yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="card">
                <h3 className="font-display text-white font-semibold mb-4">All Payments ({payments.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['User', 'Amount', 'Payment ID', 'Resume', 'Date', 'Status'].map(h => (
                          <th key={h} className="text-left text-slate-500 text-xs py-2 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-3 pr-4 text-slate-300 text-xs">{p.user?.name}</td>
                          <td className="py-3 pr-4 text-white text-xs font-medium">₹{(p.amount / 100).toFixed(0)}</td>
                          <td className="py-3 pr-4 text-slate-500 text-xs font-mono">{p.razorpayPaymentId?.slice(0, 14)}...</td>
                          <td className="py-3 pr-4 text-slate-500 text-xs truncate max-w-[100px]">{p.resume?.personalInfo?.fullName || '—'}</td>
                          <td className="py-3 pr-4 text-slate-500 text-xs">{p.createdAt ? format(new Date(p.createdAt), 'MMM d, HH:mm') : '—'}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">{p.status}</span>
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-600 text-xs">No payments yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
