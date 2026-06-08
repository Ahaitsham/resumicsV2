import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useAuthStore, useUIStore } from './store'
import UrgencyPopup from './components/ui/UrgencyPopup'
import ExitIntentPopup from './components/ui/ExitIntentPopup'
import LoadingScreen from './components/ui/LoadingScreen'

const LandingPage       = lazy(() => import('./pages/LandingPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/RegisterPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const BuilderPage       = lazy(() => import('./pages/BuilderPage'))
const PreviewPage       = lazy(() => import('./pages/PreviewPage'))
const ToolsPage         = lazy(() => import('./pages/ToolsPage'))
const AdminPage         = lazy(() => import('./pages/AdminPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { setShowUrgencyPopup, setShowExitIntent } = useUIStore()

  // Show urgency popup after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowUrgencyPopup(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  // Exit intent detection
  useEffect(() => {
    let shown = false
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !shown) {
        shown = true
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />

        <UrgencyPopup />
        <ExitIntentPopup />

        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/"               element={<LandingPage />} />
            <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register"       element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/builder"        element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/builder/:id"    element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/preview/:id"    element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
            <Route path="/tools"          element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />

            <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

            <Route path="*"              element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
