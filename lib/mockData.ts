export type Severity = 'HIGH' | 'MED' | 'LOW'
export type Status = 'open' | 'in_progress' | 'resolved'
export type Category = 'Transport' | 'Eau' | 'Déchets' | 'Éclairage' | 'Électricité' | 'Voirie' | 'Sécurité' | 'Espaces verts'

export interface Incident {
  id: string
  title: string
  description: string
  category: Category
  sector: string
  severity: Severity
  status: Status
  authority: string
  reportedBy: string
  date: string
  lat: number
  lng: number
  photoUrl?: string
}

export const INCIDENTS: Incident[] = [
  { id: 'INC-1001', title: 'Embouteillage Av. Mohammed VI', description: 'Trafic bloqué depuis 2h, aucune alternative', category: 'Transport', sector: 'Guéliz', severity: 'HIGH', status: 'open', authority: 'Police Circulation', reportedBy: 'Yassine B.', date: 'Il y a 8 min', lat: 31.6347, lng: -8.0083 },
  { id: 'INC-1002', title: 'Fuite d\'eau rue Bab Doukkala', description: 'Fuite importante, chaussée inondée', category: 'Eau', sector: 'Médina', severity: 'HIGH', status: 'in_progress', authority: 'RADEEMA', reportedBy: 'Fatima Z.', date: 'Il y a 22 min', lat: 31.6330, lng: -7.9990 },
  { id: 'INC-1003', title: 'Poubelles non collectées Mellah', description: '3 jours sans collecte, odeurs', category: 'Déchets', sector: 'Mellah', severity: 'MED', status: 'open', authority: 'Commune', reportedBy: 'Mohamed A.', date: 'Il y a 1h', lat: 31.6282, lng: -7.9880 },
  { id: 'INC-1004', title: 'Lampadaires hors service Hivernage', description: '12 lampadaires éteints sur 300m', category: 'Éclairage', sector: 'Hivernage', severity: 'MED', status: 'in_progress', authority: 'Commune', reportedBy: 'Sara K.', date: 'Il y a 2h', lat: 31.6198, lng: -8.0120 },
  { id: 'INC-1005', title: 'Câble électrique exposé Daoudiate', description: 'Câble HT tombé sur le trottoir, danger immédiat', category: 'Électricité', sector: 'Daoudiate', severity: 'HIGH', status: 'open', authority: 'ONEE', reportedBy: 'Karim M.', date: 'Il y a 35 min', lat: 31.6405, lng: -8.0200 },
  { id: 'INC-1006', title: 'Nid de poule Av. Hassan II', description: 'Trou profond, risque pneu', category: 'Voirie', sector: 'Guéliz', severity: 'MED', status: 'resolved', authority: 'Commune', reportedBy: 'Amina T.', date: 'Il y a 3h', lat: 31.6290, lng: -8.0060 },
  { id: 'INC-1007', title: 'Inondation parking souterrain Guéliz', description: 'Eau s\'accumule, parking inaccessible', category: 'Eau', sector: 'Guéliz', severity: 'HIGH', status: 'in_progress', authority: 'RADEEMA', reportedBy: 'Omar H.', date: 'Il y a 45 min', lat: 31.6310, lng: -8.0140 },
  { id: 'INC-1008', title: 'Bac à ordures débordant Palmeraie', description: 'Bac plein depuis 2 jours', category: 'Déchets', sector: 'Palmeraie', severity: 'LOW', status: 'resolved', authority: 'Commune', reportedBy: 'Nadia L.', date: 'Il y a 4h', lat: 31.6550, lng: -7.9700 },
  { id: 'INC-1009', title: 'Signalisation dégradée Rte Casablanca', description: 'Panneau STOP tombé à l\'intersection', category: 'Transport', sector: 'M\'Hamid', severity: 'MED', status: 'open', authority: 'Police', reportedBy: 'Hassan R.', date: 'Il y a 1h30', lat: 31.6100, lng: -8.0300 },
  { id: 'INC-1010', title: 'Tags sur mur patrimonial Médina', description: 'Graffiti sur façade classée', category: 'Voirie', sector: 'Médina', severity: 'LOW', status: 'open', authority: 'Commune', reportedBy: 'Leila S.', date: 'Il y a 5h', lat: 31.6218, lng: -7.9870 },
]

export const STATS = {
  totalReports: 1284,
  resolved: 1089,
  open: 15,
  inProgress: 13,
  highSeverity: 3,
  totalCitizens: 847,
}

export interface Alert {
  id: string
  severity: Severity
  title: string
  service: string
  time: string
}

export const ALERTS: Alert[] = [
  { id: 'ALT-001', severity: 'HIGH', title: 'Câble électrique exposé — Daoudiate', service: 'Électricité', time: 'Il y a 35 min' },
  { id: 'ALT-002', severity: 'HIGH', title: 'Inondation parking — Guéliz', service: 'Eau & Assainissement', time: 'Il y a 45 min' },
  { id: 'ALT-003', severity: 'HIGH', title: 'Embouteillage critique Av. Mohammed VI', service: 'Transport & Trafic', time: 'Il y a 8 min' },
  { id: 'ALT-004', severity: 'MED', title: '12 lampadaires hors service — Hivernage', service: 'Éclairage public', time: 'Il y a 2h' },
  { id: 'ALT-005', severity: 'MED', title: 'Fuite eau Bab Doukkala', service: 'Eau & Assainissement', time: 'Il y a 22 min' },
  { id: 'ALT-006', severity: 'LOW', title: 'Collecte déchets retardée — Mellah', service: 'Collecte des déchets', time: 'Il y a 1h' },
]

export const SECTORS = ['Guéliz', 'Médina', 'Mellah', 'Hivernage', 'Daoudiate', 'Palmeraie', 'M\'Hamid']

export const CATEGORIES: { value: Category; icon: string; label: string }[] = [
  { value: 'Transport', icon: '🚌', label: 'Transport' },
  { value: 'Eau', icon: '💧', label: 'Eau' },
  { value: 'Déchets', icon: '🗑️', label: 'Déchets' },
  { value: 'Éclairage', icon: '💡', label: 'Éclairage' },
  { value: 'Électricité', icon: '⚡', label: 'Électricité' },
  { value: 'Voirie', icon: '🚧', label: 'Voirie' },
  { value: 'Sécurité', icon: '🚨', label: 'Sécurité' },
  { value: 'Espaces verts', icon: '🌳', label: 'Espaces verts' },
]

export const SERVICE_STATS = [
  { name: 'Transport & Trafic', percentage: 87, color: '#06b6d4' },
  { name: 'Eau & Assainissement', percentage: 92, color: '#8b5cf6' },
  { name: 'Collecte des déchets', percentage: 78, color: '#ef4444' },
  { name: 'Éclairage public', percentage: 95, color: '#22c55e' },
]

export const ACTIVITY_DATA = [
  { hour: '01h', transport: 2, water: 1, waste: 0, lighting: 0 },
  { hour: '03h', transport: 1, water: 0, waste: 0, lighting: 1 },
  { hour: '05h', transport: 0, water: 2, waste: 1, lighting: 0 },
  { hour: '07h', transport: 4, water: 3, waste: 2, lighting: 1 },
  { hour: '09h', transport: 8, water: 5, waste: 3, lighting: 2 },
  { hour: '11h', transport: 12, water: 7, waste: 4, lighting: 3 },
  { hour: '13h', transport: 15, water: 9, waste: 6, lighting: 4 },
  { hour: '15h', transport: 18, water: 11, waste: 7, lighting: 5 },
  { hour: '17h', transport: 14, water: 13, waste: 8, lighting: 6 },
  { hour: '19h', transport: 10, water: 8, waste: 5, lighting: 7 },
  { hour: '21h', transport: 6, water: 5, waste: 3, lighting: 4 },
  { hour: '23h', transport: 3, water: 2, waste: 1, lighting: 2 },
]

export function getAuthorityForCategory(category: Category): string {
  const authorityMap: Record<Category, string> = {
    'Transport': 'Police Circulation',
    'Eau': 'RADEEMA',
    'Déchets': 'Commune',
    'Éclairage': 'Commune',
    'Électricité': 'ONEE',
    'Voirie': 'Commune',
    'Sécurité': 'Police',
    'Espaces verts': 'Commune',
  }
  return authorityMap[category] || 'Commune'
}
