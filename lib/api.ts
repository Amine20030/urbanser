import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import {
  Incident,
  Alert,
  DashboardStats,
  ServiceHealth,
  MapIncident,
  HourlyActivity,
  PageResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Category,
  Sector,
  User,
  UpdateStatusRequest,
} from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('urbanops_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 → redirect to login
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('urbanops_token')
        localStorage.removeItem('urbanops_user')
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error)
  }
)

// Typed API methods
export const incidentApi = {
  getRecent: () => api.get<Incident[]>('/incidents/recent'),
  getMap: () => api.get<MapIncident[]>('/incidents/map'),
  getAll: (params?: { page?: number; size?: number; categoryId?: number; severity?: string; status?: string }) =>
    api.get<PageResponse<Incident>>('/incidents', { params }),
  getById: (id: number) => api.get<Incident>(`/incidents/${id}`),
  getMine: () => api.get<Incident[]>('/incidents/my'),
  getBySector: (id: number) => api.get<Incident[]>(`/incidents/sector/${id}`),
  getByCategory: (id: number) => api.get<Incident[]>(`/incidents/category/${id}`),
  create: async (data: FormData) => {
    const headers: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('urbanops_token')
      if (token) headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(`${api.defaults.baseURL}/incidents`, {
      method: 'POST',
      headers,
      body: data,
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw { response: { data: errData } }
    }
    return { data: await res.json() } as any
  },
  updateStatus: (id: number, status: string) =>
    api.patch<Incident>(`/incidents/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/incidents/${id}`),
}

export const alertApi = {
  getAll: (params?: { severity?: string; acknowledged?: boolean }) =>
    api.get<PageResponse<Alert>>('/alerts', { params }),
  getRecent: () => api.get<Alert[]>('/alerts/recent'),
  getCritical: () => api.get<Alert[]>('/alerts/critical'),
  getById: (id: number) => api.get<Alert>(`/alerts/${id}`),
  acknowledge: (id: number) => api.patch<Alert>(`/alerts/${id}/acknowledge`),
  resend: (id: number) => api.post(`/alerts/${id}/resend`),
}

export const statsApi = {
  getDashboard: () => api.get<DashboardStats>('/stats/dashboard'),
  getByCategory: () => api.get<{ name: string; count: number }[]>('/stats/incidents/by-category'),
  getBySeverity: () => api.get<{ severity: string; count: number }[]>('/stats/incidents/by-severity'),
  getByStatus: () => api.get<{ status: string; count: number }[]>('/stats/incidents/by-status'),
  getBySector: () => api.get<{ name: string; count: number }[]>('/stats/incidents/by-sector'),
  getHourly: () => api.get<HourlyActivity[]>('/stats/incidents/hourly'),
  getHealth: () => api.get<ServiceHealth[]>('/stats/services/health'),
}

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  me: () => api.get<User>('/auth/me'),
  updateMe: (data: Partial<User>) => api.put<User>('/auth/me', data),
}

export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
}

export const sectorApi = {
  getAll: () => api.get<Sector[]>('/sectors'),
  getById: (id: number) => api.get<Sector>(`/sectors/${id}`),
  getByCity: (city: string) => api.get<Sector[]>(`/sectors/city/${city}`),
}

export const adminUsersApi = {
  getAll: () => api.get<User[]>('/admin/users'),
  create: (data: any) => api.post<User>('/admin/users', data),
  update: (id: number, data: any) => api.put<User>(`/admin/users/${id}`, data),
  delete: (id: number) => api.delete(`/admin/users/${id}`),
}

export default api
