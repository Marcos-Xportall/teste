// Shared types between frontend and backend

export interface User {
  id: string
  email: string
  name: string
  plan: 'starter' | 'pro' | 'scale'
  credits: number
  avatar?: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'generating' | 'ready' | 'deployed' | 'failed'
  code?: {
    html: string
    css: string
    javascript: string
  }
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Deployment {
  id: string
  projectId: string
  url?: string
  status: 'pending' | 'deploying' | 'success' | 'failed'
  provider: string
  error?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'credit_purchase' | 'credit_usage' | 'subscription' | 'refund'
  amount: number
  credits?: number
  description?: string
  createdAt: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
