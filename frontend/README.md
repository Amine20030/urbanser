# UrbanOps - Smart Urban Supervision Platform

A modern, dark-themed urban incident reporting and monitoring system for the city of Marrakech, Morocco.

## Features

- **Citizen Reporting**: Citizens can report urban problems by submitting photos and descriptions
- **AI-Powered Analysis**: Automatic detection of problem category, danger level, and routing to the correct authority
- **Real-time Dashboard**: Mission-control style interface for administrators
- **Interactive Map**: Leaflet-based map with CartoDB dark tiles showing all incidents
- **Live Alerts**: Priority-based alert system for critical incidents

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: react-leaflet + Leaflet.js with CartoDB dark tiles
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
cd C:\Users\NOONE\CascadeProjects\urbanops
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
urbanops/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page (public)
│   ├── dashboard/           # Admin dashboard
│   ├── carte/              # Full map page
│   ├── incidents/          # Incidents list
│   ├── alertes/            # Live alerts
│   └── auth/               # Authentication pages
├── components/
│   ├── layout/             # Navbar, Footer, Sidebar
│   ├── landing/            # Hero, Stats, Map, Reports
│   ├── dashboard/          # KPI cards, charts, tables
│   └── shared/             # Reusable components
├── lib/
│   ├── mockData.ts         # Mock data
│   └── utils.ts            # Utility functions
```

## Pages

- `/` - Landing page with hero, map, and recent reports
- `/dashboard` - Admin dashboard with KPIs and charts
- `/carte` - Full-screen interactive map
- `/incidents` - Filterable incidents table
- `/alertes` - Live alerts grouped by severity
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

## Design System

- **Background**: Deep dark (#0b0f14, #0e1218, #131920)
- **Text**: Primary (#e8edf3), Muted (#7a8899), Very muted (#3a4556)
- **Colors**: Red (#ef4444), Amber (#f59e0b), Green (#22c55e), Blue (#3b82f6), Cyan (#06b6d4), Purple (#8b5cf6)
- **Typography**: Geist (body), Geist Mono (data/numbers)

## License

© 2025 UrbanOps — Marrakech, Maroc
