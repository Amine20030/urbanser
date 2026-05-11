# UrbanOps - Smart Urban Supervision Platform

A full-stack, production-grade urban incident reporting and monitoring system for the city of Marrakech, Morocco.

## Architecture

This is a **monorepo** containing both backend and frontend:

```
urbanops/
├── backend/     ← Spring Boot 3.2 + PostgreSQL
├── frontend/    ← Next.js 14 + TypeScript
└── docs/        ← Setup guides & technical report
```

## Features

### Backend (Spring Boot)
- **JWT Authentication**: Secure stateless authentication
- **REST API**: Full CRUD operations for all entities
- **AI Analysis**: Integration with Google Gemini API for incident classification
- **Email Alerts**: Automatic notifications to authorities
- **File Upload**: Photo storage with UUID naming
- **Database**: PostgreSQL with JPA/Hibernate
- **Testing**: JUnit 5 + Mockito + JaCoCo (80% coverage target)
- **Quality**: SonarQube integration

### Frontend (Next.js 14)
- **Dark Techno Dashboard**: Mission-control style interface
- **Citizen Reporting**: Multi-step incident submission form
- **Interactive Map**: Leaflet with CartoDB dark tiles
- **Real-time Dashboard**: Stats, charts, and alerts
- **Responsive Design**: Mobile, tablet, desktop

## Quick Start

### Prerequisites
- Java 17 JDK
- PostgreSQL 16
- Node.js 18+
- Maven 3.8+

### 1. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE urbanops_db;"
```

### 2. Backend

```bash
cd backend

# Configure application.properties (set your DB password)
# Then run:
mvn clean install
mvn spring-boot:run

# API: http://localhost:8080/api
# Swagger: http://localhost:8080/api/swagger-ui.html
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev

# App: http://localhost:3000
```

## API Documentation

Swagger UI available at: `http://localhost:8080/api/swagger-ui.html`

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | Login with JWT |
| `POST /api/auth/register` | Create citizen account |
| `GET /api/incidents` | List all incidents |
| `POST /api/incidents` | Create new incident |
| `GET /api/stats/dashboard` | Dashboard statistics |
| `GET /api/categories` | List categories |
| `GET /api/sectors` | List sectors |

## Testing

### Backend Tests

```bash
cd backend
mvn test              # Run all tests
mvn verify            # Run tests + generate JaCoCo report

# View coverage report:
# open target/site/jacoco/index.html
```

### Test Classes

- `IncidentServiceTest`
- `UserServiceTest`
- `AlertServiceTest`
- `AIAnalysisServiceTest`
- `StatsServiceTest`
- `IncidentControllerTest`
- `AuthControllerTest`

## Quality Analysis

```bash
cd backend
mvn sonar:sonar -Dsonar.token=YOUR_TOKEN
```

## Documentation

- `SETUP_GUIDE.md` - PostgreSQL and environment setup
- `SCRUM_PLAN.md` - Sprint planning and user stories
- `RAPPORT_TECHNIQUE.md` - Complete technical report (French)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL 16
- Google Gemini API
- JavaMailSender
- JUnit 5 + Mockito
- JaCoCo + SonarQube

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Axios
- react-leaflet
- Recharts
- Lucide React

## Default Accounts

After starting the backend, these accounts are auto-created:

| Email | Password | Role |
|-------|----------|------|
| admin@urbanops.ma | Admin@1234 | ADMIN |
| citoyen@test.ma | Test@1234 | CITIZEN |

## Project Structure

```
backend/
├── src/main/java/ma/urbanops/
│   ├── config/         # Security, CORS, OpenAPI
│   ├── controller/     # REST controllers
│   ├── service/        # Business logic
│   ├── repository/     # JPA repositories
│   ├── entity/         # JPA entities
│   ├── dto/            # Request/Response DTOs
│   ├── security/       # JWT configuration
│   └── exception/      # Global exception handler
└── src/test/           # JUnit 5 tests

frontend/
├── app/                # Next.js pages
├── components/         # React components
├── lib/                # Utilities & API client
└── public/             # Static assets
```

## License

MIT

## Contributors

UrbanOps Team - Smart City Initiative for Marrakech

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
