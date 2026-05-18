# 🎯 Distribution des Tâches Frontend - 2 Développeurs

**Projet:** UrbanOps Frontend (Next.js)  
**Date:** Mai 2026  
**Équipe:** Dev 1 + Dev 2  

---

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND URBANOPS                        │
├──────────────────────┬──────────────────────────────────────┤
│   DEV 1              │   DEV 2                              │
│  (Core Ops)          │  (Auth & Admin)                      │
├──────────────────────┼──────────────────────────────────────┤
│ ✅ Incidents        │ ✅ Auth (signin/signup)              │
│ ✅ Dashboard        │ ✅ Admin Panel                       │
│ ✅ Alertes          │ ✅ Users Management                  │
│ ✅ Carte/Maps       │ ✅ Paramètres                        │
│ ✅ Mes-signalements │ ✅ Shared Components (80%)           │
│                      │ ✅ Infrastructure                    │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 👤 DEV 1 : Core Operations & Features

### Zone de responsabilité
```
frontend/
├── app/
│   ├── dashboard/          ← DEV 1
│   ├── incidents/          ← DEV 1
│   ├── alertes/            ← DEV 1
│   ├── carte/              ← DEV 1
│   ├── mes-signalements/   ← DEV 1
│   └── page.tsx            ← DEV 1 (Landing/Accueil)
│
├── components/
│   ├── dashboard/          ← DEV 1 (80%)
│   ├── home/               ← DEV 1
│   ├── map/                ← DEV 1
│   └── shared/ui-*.tsx     ← Helper (utilise DEV 2)
│
└── lib/
    ├── api-incidents.ts    ← DEV 1
    ├── api-alertes.ts      ← DEV 1
    ├── types-incidents.ts  ← DEV 1
    └── hooks/              ← DEV 1 (custom hooks)
```

### ✅ Tâches détaillées

#### Phase 1 : Pages & Layout (Week 1)
- [ ] `app/dashboard/page.tsx` - Page principale du dashboard
- [ ] `app/dashboard/layout.tsx` - Layout avec sidebar/stats
- [ ] `app/dashboard/loading.tsx` - States de chargement
- [ ] `app/incidents/page.tsx` - Liste des incidents
- [ ] `app/incidents/[id]/page.tsx` - Détail d'un incident
- [ ] `app/incidents/new/page.tsx` - Créer un incident

#### Phase 2 : Composants Métier (Week 1-2)
- [ ] `components/dashboard/KpiCards.tsx` - Cartes KPI
- [ ] `components/dashboard/ActivityChart.tsx` - Graphiques d'activité
- [ ] `components/dashboard/IncidentsTable.tsx` - Tableau des incidents
- [ ] `components/home/IncidentList.tsx` - Liste filtrée
- [ ] `components/home/IncidentCard.tsx` - Carte incident

#### Phase 3 : Features & Logique (Week 2)
- [ ] `app/alertes/page.tsx` - Gestion des alertes
- [ ] `app/carte/page.tsx` - Carte interactive des incidents
- [ ] `app/mes-signalements/page.tsx` - Signalements utilisateur
- [ ] `components/map/MapView.tsx` - Composant Leaflet
- [ ] `components/map/MarkerCluster.tsx` - Clustering des marqueurs

#### Phase 4 : API & Data (Week 2)
- [ ] `lib/api-incidents.ts` - Endpoints incidents
- [ ] `lib/api-alertes.ts` - Endpoints alertes
- [ ] `lib/hooks/useIncidents.ts` - Custom hook incidents
- [ ] `lib/hooks/useAlertes.ts` - Custom hook alertes
- [ ] `app/actions.ts` (incidents) - Server actions pour incidents

#### Phase 5 : Intégration & Tests (Week 3)
- [ ] Connexion API Spring Boot
- [ ] Tests composants
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Performance optimization
- [ ] Caching strategy

### 📋 Conventions DEV 1

```typescript
// Nommage des fichiers
- Pages: lowercase (dashboard, incidents)
- Composants: PascalCase (IncidentCard.tsx)
- Hooks: useIncidents.ts, useAlertes.ts
- Types: types-incidents.ts

// Structure API
export const incidentsAPI = {
  list: async () => {},
  getById: async (id) => {},
  create: async (data) => {},
  update: async (id, data) => {},
  delete: async (id) => {},
};

// Types
export interface IIncident {
  id: string;
  titre: string;
  description: string;
  statut: 'OUVERT' | 'EN_COURS' | 'FERME';
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

// Composants
'use client'; // si interactif

export function IncidentCard({ incident }: { incident: IIncident }) {
  return <div>{/*...*/}</div>;
}
```

### 🔌 Dépendances externes (DEV 2)
- ✅ `lib/api.ts` - Client API centralisé (DEV 2)
- ✅ `components/shared/LoadingSkeleton.tsx` - Skeleton (DEV 2)
- ✅ `components/shared/Button.tsx` - Button UI (DEV 2)
- ✅ `components/shared/Card.tsx` - Card UI (DEV 2)
- ✅ `components/layout/Navbar.tsx` - Navbar (DEV 2)
- ✅ `components/layout/Sidebar.tsx` - Sidebar (DEV 2)

---

## 👤 DEV 2 : Auth, Admin & Infrastructure

### Zone de responsabilité
```
frontend/
├── app/
│   ├── auth/               ← DEV 2
│   │   ├── signin/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── admin/              ← DEV 2
│   ├── utilisateurs/       ← DEV 2
│   ├── parametres/         ← DEV 2
│   ├── layout.tsx          ← DEV 2
│   ├── globals.css         ← DEV 2
│   └── error.tsx           ← DEV 2
│
├── components/
│   ├── layout/             ← DEV 2 (100%)
│   ├── shared/             ← DEV 2 (100%)
│   ├── ui/                 ← DEV 2 (100%)
│   └── admin/              ← DEV 2
│
└── lib/
    ├── api.ts              ← DEV 2 (Client central)
    ├── auth.ts             ← DEV 2
    ├── types.ts            ← DEV 2 (Types globaux)
    ├── utils.ts            ← DEV 2
    ├── hooks/shared/       ← DEV 2
    └── db.ts               ← DEV 2 (si Prisma)
```

### ✅ Tâches détaillées

#### Phase 1 : Infrastructure & Layout (Week 1)
- [ ] `app/layout.tsx` - Layout root global
- [ ] `app/globals.css` - Styles Tailwind
- [ ] `components/layout/Navbar.tsx` - Navigation bar
- [ ] `components/layout/Sidebar.tsx` - Sidebar navigation
- [ ] `components/layout/Footer.tsx` - Footer
- [ ] `components/ThemeProvider.tsx` - Dark/Light theme

#### Phase 2 : Composants Partagés (Week 1)
- [ ] `components/shared/Button.tsx` - Bouton réutilisable
- [ ] `components/shared/Card.tsx` - Carte réutilisable
- [ ] `components/shared/Badge.tsx` - Badge/label
- [ ] `components/shared/Modal.tsx` - Modal dialog
- [ ] `components/shared/LoadingSkeleton.tsx` - Skeleton loader
- [ ] `components/shared/ErrorState.tsx` - Error fallback
- [ ] `components/shared/Toast.tsx` - Notifications

#### Phase 3 : Authentification (Week 1-2)
- [ ] `app/auth/signin/page.tsx` - Page connexion
- [ ] `app/auth/signup/page.tsx` - Page inscription
- [ ] `app/auth/forgot-password/page.tsx` - Récup. mot de passe
- [ ] `lib/auth.ts` - Logique authentification
- [ ] `lib/session.ts` - Gestion sessions
- [ ] Middleware authentification

#### Phase 4 : Admin & Users (Week 2-3)
- [ ] `app/admin/page.tsx` - Dashboard admin
- [ ] `app/admin/users/page.tsx` - Liste utilisateurs
- [ ] `app/admin/users/[id]/page.tsx` - Détail utilisateur
- [ ] `app/utilisateurs/page.tsx` - Gestion utilisateurs
- [ ] `app/parametres/page.tsx` - Paramètres utilisateur
- [ ] `components/admin/UserTable.tsx` - Tableau utilisateurs
- [ ] `components/admin/AdminChart.tsx` - Stats admin

#### Phase 5 : API & Infrastructure (Week 2-3)
- [ ] `lib/api.ts` - Client API centralisé
  ```typescript
  export const apiClient = axios.create({...});
  apiClient.interceptors.response.use(...);
  ```
- [ ] `lib/types.ts` - Types globaux (User, Auth, etc.)
- [ ] `app/actions.ts` (auth) - Server actions auth
- [ ] `app/api/auth/*` - Route handlers
- [ ] Environment variables setup
- [ ] Error boundaries

#### Phase 6 : UI Components (Week 3)
- [ ] `components/ui/input.tsx` - Input field
- [ ] `components/ui/textarea.tsx` - Textarea
- [ ] `components/ui/select.tsx` - Select dropdown
- [ ] `components/ui/alert.tsx` - Alert box
- [ ] Tailwind config optimization
- [ ] Responsive design system

### 📋 Conventions DEV 2

```typescript
// API Client centralisé
// lib/api.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Gestion d'erreur centralisée
    throw new Error(error.response?.data?.message);
  }
);

// Auth Service
export const authAPI = {
  signin: (email, pwd) => apiClient.post('/auth/signin', {...}),
  signup: (data) => apiClient.post('/auth/signup', {...}),
  logout: () => apiClient.post('/auth/logout'),
};

// Types globaux
// lib/types.ts
export interface IUser {
  id: string;
  email: string;
  nom: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
}

export type AuthContextType = {
  user: IUser | null;
  isLoading: boolean;
  login: (email, pwd) => Promise<void>;
  logout: () => void;
};

// Composants UI
export function Button({ 
  variant = 'primary', 
  disabled, 
  children, 
  ...props 
}: ButtonProps) {
  return <button className={cn(styles[variant])} {...props}>{children}</button>;
}
```

### 🔌 Dépendances externes
- ❌ Zéro dépendances (DEV 2 crée LA base)
- ✅ Expose API pour DEV1

---

## 🔗 Dépendances Entre Devs

### DEV 1 utilise depuis DEV 2 ✅

```typescript
// DEV 1 dépend de:
import { apiClient } from '@/lib/api';              // DEV 2
import { Button, Card, Badge } from '@/components/shared'; // DEV 2
import { useAuth } from '@/lib/hooks/useAuth';      // DEV 2
import { IUser } from '@/lib/types';                // DEV 2
```

### DEV 2 n'utilise RIEN de DEV 1

```typescript
// DEV 2 construit l'infrastructure
// Les composants de DEV 1 viendront s'accrocher dessus après
```

---

## 📅 Timeline & Milestones

### Semaine 1

#### Jour 1-2 (Lundi-Mardi)
- **DEV 2:** Setup infrastructure
  - `app/layout.tsx` ✅
  - `components/layout/*` ✅
  - `lib/api.ts` ✅
  - `lib/types.ts` ✅
  
- **DEV 1:** En attente (bloqué par DEV 2)

#### Jour 3-5 (Mercredi-Samedi)
- **DEV 2:** Composants partagés
  - `components/shared/*` ✅
  - `components/ui/*` ✅
  
- **DEV 1:** Peut commencer les pages
  - `app/dashboard/*` ✅
  - `app/incidents/*` ✅
  - `components/dashboard/*` ✅

### Semaine 2

- **DEV 1:** Features principales
  - Alertes + Carte ✅
  - API integration ✅
  - Tests composants ✅
  
- **DEV 2:** Auth + Admin
  - `app/auth/*` ✅
  - `app/admin/*` ✅
  - Route handlers ✅
  - Middleware ✅

### Semaine 3

- **DEV 1:** Optimisation + Responsive
- **DEV 2:** Polish UI + Performance

### Semaine 4

- **Integration meeting:**
  - Test complet
  - Bug fixes
  - Déploiement

---

## 💻 Working Together - Best Practices

### 1. Git Workflow

```bash
# DEV 1 - Feature branch
git checkout -b feature/incidents-list
git commit -m "feat: Add incidents page and components"
git push origin feature/incidents-list
# → Create Pull Request

# DEV 2 - Feature branch  
git checkout -b feature/auth-signin
git commit -m "feat: Add signin form with validation"
git push origin feature/auth-signin
# → Create Pull Request

# Main branch: merge après code review
```

### 2. File Organization - Avoid Conflicts ✅

```
✅ SAFE (pas de conflits)
├── app/dashboard/          ← DEV 1 only
├── app/incidents/          ← DEV 1 only
├── app/auth/               ← DEV 2 only
├── app/admin/              ← DEV 2 only
└── components/
    ├── dashboard/          ← DEV 1 only
    ├── home/               ← DEV 1 only
    ├── layout/             ← DEV 2 only
    ├── shared/             ← DEV 2 only (DEV 1 uses)
    └── ui/                 ← DEV 2 only (DEV 1 uses)

❌ DANGER (risque de conflits)
- app/layout.tsx            → ASSIGNED DEV 2 ONLY
- app/globals.css           → ASSIGNED DEV 2 ONLY
- lib/api.ts                → ASSIGNED DEV 2 ONLY
- lib/types.ts              → ASSIGNED DEV 2 ONLY (extendable)
```

### 3. Communication Protocol 📱

#### Standups (Daily - 15min)
```
DEV 1: "Incidents page done, integrating API"
DEV 2: "WIP on Button component, need feedback"
Blocker: "Waiting for api.ts merge"
```

#### PR Reviews
- DEV 1 reviews DEV 2's API design BEFORE merging
- DEV 2 reviews DEV 1's component usage of shared libs

#### Slack/Teams Messages
```
DEV 1: "Adding new endpoint requirement to api.ts - need POST /incidents"
DEV 2: "Adding it now, 10 mins"
```

### 4. Type Sharing

```typescript
// lib/types.ts (DEV 2 manages)
export interface IIncident {
  id: string;
  titre: string;
  // ...
}

export interface IAlertes {
  id: string;
  // ...
}

// DEV 1 imports and uses
import { IIncident, IAlertes } from '@/lib/types';
```

### 5. API Design Contract

**DEV 2 defines:**
```typescript
// lib/api.ts
export const incidentsAPI = {
  list: {
    method: 'GET',
    endpoint: '/incidents',
    response: IIncident[]
  },
  getById: {
    method: 'GET',
    endpoint: '/incidents/:id',
    response: IIncident
  },
  create: {
    method: 'POST',
    endpoint: '/incidents',
    payload: CreateIncidentDTO,
    response: IIncident
  }
};
```

**DEV 1 uses it:**
```typescript
const incidents = await incidentsAPI.list();
const incident = await incidentsAPI.getById(id);
```

---

## 🚀 Setup Commands

### Initial Setup (Both)
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

### For DEV 1
```bash
# Start working on features branch
git checkout -b feature/incidents

# Develop & test
npm run dev
npm run lint

# Commit regularly
git commit -m "feat: Add IncidentCard component"
```

### For DEV 2
```bash
# Start on infrastructure branch
git checkout -b feature/infrastructure

# Setup base components first
npm run dev

# Then auth
git commit -m "feat: Complete auth infrastructure"
```

---

## ✅ Task Checklist for Merge

### Before DEV 1 PR
- [ ] No TypeScript errors
- [ ] Uses types from `@/lib/types.ts`
- [ ] Only imports from `/shared` and `/ui`
- [ ] Responsive on mobile
- [ ] E2E tested with mock API

### Before DEV 2 PR
- [ ] No TypeScript errors
- [ ] API contract documented
- [ ] Interceptors working
- [ ] Error handling complete
- [ ] Env variables documented

---

## 📊 Parallel Development Timeline

```
Week 1:
DEV 2 ██████░░░░░░░░░░░░░ Infrastructure (50%)
DEV 1 ░░░░░░░░░░░░░░░░░░░░ Blocked (waiting)

Day 3:
DEV 2 ████████░░░░░░░░░░░░ Infrastructure (80%)
DEV 1 ██░░░░░░░░░░░░░░░░░░ Starting pages (10%)

Week 2:
DEV 2 ████████████░░░░░░░░ Auth + Admin (60%)
DEV 1 ██████████░░░░░░░░░░ Features (50%)

Week 3:
DEV 2 ████████████████░░░░ Complete (80%)
DEV 1 ████████████████░░░░ Optimize (80%)

Week 4:
DEV 2 ████████████████████ Polish (100%)
DEV 1 ████████████████████ Testing (100%)
```

---

## 🎯 Success Criteria

- ✅ Zero merge conflicts
- ✅ All pages working
- ✅ API integration complete
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ <3s Largest Contentful Paint (LCP)
- ✅ <100ms First Input Delay (FID)
- ✅ TypeScript strict mode passing
- ✅ Zero console errors in production build

---

## 🆘 If Something Goes Wrong

### API changes needed mid-stream
```
DEV 1: "Need PUT /incidents/:id/status endpoint"
DEV 2: "Adding now, branched from main"
→ DEV 1 pulls latest main after merge
```

### Blocking issue
```
DEV 1: "Can't work without useAuth hook"
DEV 2: "I'll create it in next 30 mins"
→ meanwhile: mock the hook locally
```

### Merge conflict
```
git checkout --theirs lib/types.ts  # Keep DEV 2 version
# or
git checkout --ours lib/types.ts    # Keep your version
```

---

**Start coding! 🚀**
