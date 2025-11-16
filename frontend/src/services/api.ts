import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description: string; prompt: string }) =>
    api.post('/projects', data),
  update: (id: string, data: Partial<any>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  generate: (id: string, prompt: string) =>
    api.post(`/projects/${id}/generate`, { prompt }),
  deploy: (id: string) => api.post(`/projects/${id}/deploy`),
}

// AI API
export const aiAPI = {
  generateIdea: (prompt: string) =>
    api.post('/ai/generate-idea', { prompt }),
  generateCode: (prompt: string, context?: any) =>
    api.post('/ai/generate-code', { prompt, context }),
  editComponent: (componentCode: string, instruction: string) =>
    api.post('/ai/edit-component', { componentCode, instruction }),
  analyzeImage: (imageUrl: string) =>
    api.post('/ai/analyze-image', { imageUrl }),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: Partial<any>) =>
    api.put('/user/profile', data),
  getCredits: () => api.get('/user/credits'),
  getUsage: () => api.get('/user/usage'),
}

// Payments API
export const paymentsAPI = {
  createCheckoutSession: (priceId: string) =>
    api.post('/payments/create-checkout-session', { priceId }),
  getPlans: () => api.get('/payments/plans'),
  getTransactions: () => api.get('/payments/transactions'),
}

export default api
