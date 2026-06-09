import axios from 'axios'
import { useAuthStore } from '../store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000, // 45s for slow mobile networks
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle auth errors and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    // Improve network error messages for mobile
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timed out. Check your internet connection and try again.'
      } else if (error.message === 'Network Error') {
        error.message = 'Cannot connect to server. Check your internet connection.'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get('/auth/profile'),
}

// Resume APIs
export const resumeAPI = {
  generate: (data) => api.post('/resume/generate', data),
  enhance: (section, content) => api.post('/resume/enhance', { section, content }),
  analyzeATS: (data) => api.post('/resume/ats-analyze', data),
  matchJob: (resumeData, jobDescription) => api.post('/resume/job-match', { resumeData, jobDescription }),
  save: (data) => api.post('/resume/save', data),
  list: () => api.get('/resume/list'),
  get: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
  generateCoverLetter: (data) => api.post('/resume/cover-letter', data),
  generateLinkedIn: (data) => api.post('/resume/linkedin-headline', data),
  generateInterviewQs: (data) => api.post('/resume/interview-questions', data),
}

// Payment APIs
export const paymentAPI = {
  createOrder: (resumeId) => api.post('/payment/create-order', { resumeId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getHistory: () => api.get('/payment/history'),
}

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  getPayments: (page = 1) => api.get(`/admin/payments?page=${page}`),
  getRevenue: () => api.get('/admin/revenue'),
}
