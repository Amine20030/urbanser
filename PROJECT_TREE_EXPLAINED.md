# UrbanOps Project Tree (Explained)

This document gives you:
- A practical project tree
- What each main folder is for
- How frontend and backend connect

## 1) High-Level Architecture

UrbanOps is a monorepo with:
- `frontend/`: Next.js application (UI)
- `backend/`: Spring Boot application (API + business + database access)
- `docs/`: reports and technical documentation

Request flow:

Frontend (Next.js) -> HTTP (Axios/Fetch) -> Backend REST API (Spring Boot) -> Service Layer -> Repository Layer -> PostgreSQL

For asynchronous alerts:

Incident Service -> JMS Producer -> Queue -> JMS Consumer -> Email Service

## 2) Project Tree (Main)

```text
urbanops/
|- frontend/
|  |- app/
|  |  |- page.tsx
|  |  |- auth/
|  |  |  |- signin/page.tsx
|  |  |  |- signup/page.tsx
|  |  |- dashboard/page.tsx
|  |  |- incidents/
|  |  |  |- page.tsx
|  |  |  |- new/page.tsx
|  |  |  |- [id]/page.tsx
|  |  |- carte/page.tsx
|  |  |- alertes/page.tsx
|  |- components/
|  |  |- dashboard/
|  |  |- landing/
|  |  |- layout/
|  |  |- shared/
|  |  |- ui/
|  |- lib/
|  |  |- api.ts
|  |  |- types.ts
|  |  |- mockData.ts
|  |  |- utils.ts
|  |- package.json
|  |- tsconfig.json
|
|- backend/
|  |- src/main/java/ma/urbanops/
|  |  |- controller/
|  |  |- service/
|  |  |- repository/
|  |  |- entity/
|  |  |- security/
|  |  |- config/
|  |  |- jms/
|  |  |- dto/
|  |  |- exception/
|  |- src/main/resources/
|  |  |- application.properties
|  |  |- application-dev.properties
|  |  |- application-prod.properties
|  |- pom.xml
|
|- docs/
|  |- AI_PROJECT_CONTEXT.md
|  |- RAPPORT_CONFORMITE_JUNIT5.md
|  |- latex/
|  |- plantuml/
|
|- README.md
|- SETUP_GUIDE.md
|- SCRUM_PLAN.md
|- RAPPORT_TECHNIQUE.md
```

## 3) Folder-by-Folder Explanation

### `frontend/app/`
Contains route pages (Next.js App Router).

Examples:
- `auth/signin/page.tsx`: login screen
- `incidents/new/page.tsx`: incident creation form
- `carte/page.tsx`: map page
- `dashboard/page.tsx`: operational dashboard

### `frontend/components/`
Reusable UI blocks.

- `dashboard/`: KPI cards, charts, alert panel, incident table
- `shared/`: map view, reusable modal, status badges
- `layout/`: navbar, sidebar, footer, dashboard shell
- `ui/`: base design system components (button, card, input, dialog)

### `frontend/lib/`
Frontend infrastructure and helpers.

- `api.ts`: HTTP client, API wrappers, auth interceptors
- `types.ts`: shared TypeScript interfaces
- `mockData.ts`: local sample data used by some screens
- `utils.ts`: utility functions

### `backend/src/main/java/ma/urbanops/controller/`
REST entry points (HTTP endpoints).

Examples:
- `AuthController`: register/login/me/logout
- `IncidentController`: create/read/filter/status
- `StatsController`: dashboard metrics
- `AlertController`: alert operations

### `backend/src/main/java/ma/urbanops/service/`
Business logic layer.

- `IncidentService`: orchestration for incident lifecycle
- `AIAnalysisService`: Gemini call + fallback rules
- `AlertService`: alert creation and dispatch
- `EmailService`: email sending
- `StatsService`: KPI/statistics aggregation

### `backend/src/main/java/ma/urbanops/repository/`
Data access layer (Spring Data JPA).

Repositories execute query methods and custom JPQL/native queries.

### `backend/src/main/java/ma/urbanops/entity/`
Database model (JPA entities).

Core entities:
- `User`
- `Incident`
- `Category`
- `Sector`
- `Alert`

### `backend/src/main/java/ma/urbanops/security/`
Authentication and authorization internals.

- JWT token generation/validation
- user details loading
- request authentication filter

### `backend/src/main/java/ma/urbanops/config/`
Application configuration.

Includes:
- security config (filter chain)
- CORS config
- JMS config
- async config
- OpenAPI/Swagger config
- SOAP and RMI integration config

### `backend/src/main/java/ma/urbanops/jms/`
Asynchronous messaging components.

- Producer sends alert messages to queue
- Consumer receives and triggers email processing

### `backend/src/main/resources/`
Runtime configuration per environment.

- `application.properties`: common settings
- `application-dev.properties`: development profile
- `application-prod.properties`: production profile

### `docs/`
Project documentation and reports.

- Architecture and context notes
- Quality/testing report
- LaTeX report assets
- PlantUML diagrams

## 4) Practical Data Flow

### Login
1. UI form in `frontend/app/auth/signin/page.tsx`
2. API call via `frontend/lib/api.ts`
3. `AuthController` validates credentials
4. JWT returned and stored on client
5. Interceptor attaches token for protected requests

### Create Incident
1. UI form builds multipart request (data + optional photo)
2. `IncidentController` receives request
3. `IncidentService` validates and orchestrates processing
4. AI analysis computes severity/authority
5. Entity saved through repository to PostgreSQL
6. Alert may be queued through JMS for async email sending
7. Response returns incident payload to UI

## 5) Why This Tree Matters

This structure gives:
- Clear separation of concerns
- Easier maintenance
- Better scalability
- Cleaner testing strategy

If you want, I can also generate a second file with a **full expanded tree** (deeper levels) and a **Mermaid diagram** for visual architecture.