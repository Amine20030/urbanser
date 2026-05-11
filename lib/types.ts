export type Severity = 'HIGH' | 'MED' | 'LOW'
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export interface Category {
  id: number
  name: string
  icon: string
  defaultAuthority: string
  authorityEmail: string
  description?: string
  active: boolean
}

export interface Sector {
  id: number
  name: string
  city: string
  latitude: number
  longitude: number
  active: boolean
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'CITIZEN' | 'ADMIN'
  sector?: string
  active: boolean
  createdAt: string
}

export interface Incident {
  id: number
  referenceCode: string
  title: string
  description: string
  category: Category
  sector: Sector
  severity: Severity
  status: IncidentStatus
  reportedBy?: User
  photoUrl?: string
  latitude: number
  longitude: number
  authorityNotified?: string
  aiAnalysis?: string
  createdAt: string
  resolvedAt?: string
  updatedAt: string
}

export interface Alert {
  id: number
  incident: {
    id: number
    referenceCode: string
    title: string
  }
  severity: Severity
  title: string
  message: string
  sentTo: string
  emailSent: boolean
  sentAt: string
  acknowledged: boolean
  acknowledgedAt?: string
}

export interface DashboardStats {
  totalIncidents: number
  openIncidents: number
  inProgressIncidents: number
  resolvedIncidents: number
  highSeverityCount: number
  totalCitizens: number
  resolvedLast24h: number
  resolutionRate: number
  incidentsByCategory: { name: string; icon: string; count: number }[]
  incidentsBySector: { name: string; count: number }[]
}

export interface ServiceHealth {
  category: string
  icon: string
  healthPercent: number
  activeCount: number
}

export interface MapIncident {
  id: number
  title: string
  latitude: number
  longitude: number
  severity: Severity
  status: IncidentStatus
}

export interface HourlyActivity {
  hour: string
  transport: number
  water: number
  waste: number
  lighting: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  sector?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface UpdateStatusRequest {
  status: IncidentStatus
}
