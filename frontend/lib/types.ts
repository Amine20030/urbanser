export interface Incident {
  id: number;
  referenceCode: string;
  title: string;
  description: string;
  category: { id: number; name: string; icon: string };
  sector: { id: number; name: string; city: string };
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  latitude: number;
  longitude: number;
  authorityNotified?: string;
  aiAnalysisResult?: string;
  reportedBy?: { firstName: string; lastName: string; email: string };
  photoUrl?: string;
  alertSent?: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface DashboardStats {
  totalIncidents: number;
  openIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  incidentsByHour: Array<{ hour: number; count: number }>;
}