export type Category = 'Transport' | 'Eau' | 'Déchets' | 'Éclairage' | 'Électricité' | 'Voirie'
export type Severity = 'HIGH' | 'MED' | 'LOW' | 'CRITICAL' | 'MEDIUM'
export type Status = 'open' | 'in_progress' | 'resolved'

export interface Incident {
  id: string
  title: string
  description: string
  category: Category
  severity: Severity
  status: Status
  sector: string
  authority: string
  date: string
}

export interface Alert {
  id: string
  title: string
  service: string
  severity: 'HIGH' | 'MED' | 'LOW'
  time: string
}

export const SECTORS = [
  'Guéliz',
  'Hivernage',
  'Medina',
  'Sidi Youssef',
  'Daoudiat',
  'M\'hamid',
  'Targa',
  'Bab Doukkala',
  'Kennaria',
  'Riad Zitoune',
]

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    title: 'Lampadaire hors service',
    description: 'Plusieurs lampadaires ne fonctionnent pas dans la rue principale',
    category: 'Éclairage',
    severity: 'MED',
    status: 'open',
    sector: 'Guéliz',
    authority: 'ONEE',
    date: '2025-01-15',
  },
  {
    id: 'INC-002',
    title: 'Accumulation de déchets',
    description: 'Poubelles non vidées depuis 3 jours',
    category: 'Déchets',
    severity: 'HIGH',
    status: 'in_progress',
    sector: 'Medina',
    authority: 'Commune',
    date: '2025-01-14',
  },
  {
    id: 'INC-003',
    title: 'Nid-de-poule dangereux',
    description: 'Grand trou sur la route causant des accidents',
    category: 'Voirie',
    severity: 'HIGH',
    status: 'open',
    sector: 'Hivernage',
    authority: 'Commune',
    date: '2025-01-16',
  },
  {
    id: 'INC-004',
    title: 'Fuite d\'eau',
    description: 'Fuite importante devant l\'école primaire',
    category: 'Eau',
    severity: 'MED',
    status: 'in_progress',
    sector: 'Daoudiat',
    authority: 'ONEP',
    date: '2025-01-13',
  },
  {
    id: 'INC-005',
    title: 'Bus en panne',
    description: 'Bus bloquant la circulation depuis 1h',
    category: 'Transport',
    severity: 'MED',
    status: 'resolved',
    sector: 'Guéliz',
    authority: 'Transport',
    date: '2025-01-12',
  },
  {
    id: 'INC-006',
    title: 'Câble électrique exposé',
    description: 'Câble basse tension au sol après tempête',
    category: 'Électricité',
    severity: 'HIGH',
    status: 'open',
    sector: 'Targa',
    authority: 'ONEE',
    date: '2025-01-16',
  },
]

export const ALERTS: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Incident critique non résolu > 48h',
    service: 'Voirie',
    severity: 'HIGH',
    time: '2h',
  },
  {
    id: 'ALT-002',
    title: 'Alerte météo: pluies intenses',
    service: 'Météo',
    severity: 'MED',
    time: '4h',
  },
  {
    id: 'ALT-003',
    title: 'Surplus de signalements eau',
    service: 'ONEP',
    severity: 'MED',
    time: '6h',
  },
  {
    id: 'ALT-004',
    title: 'Éclairage public: 5 pannes',
    service: 'ONEE',
    severity: 'LOW',
    time: '8h',
  },
  {
    id: 'ALT-005',
    title: 'Déchets: retard collecte',
    service: 'Commune',
    severity: 'LOW',
    time: '12h',
  },
]

export const SERVICES = [
  { name: 'Commune', incidents: 12, alerts: 3 },
  { name: 'ONEE', incidents: 8, alerts: 2 },
  { name: 'ONEP', incidents: 6, alerts: 1 },
  { name: 'Transport', incidents: 4, alerts: 0 },
]
