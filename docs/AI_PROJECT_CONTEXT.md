# UrbanOps — AI Project Context

**Purpose:** This document gives AI assistants (and humans) a single source of truth for **architecture**, **data flow**, **DB ↔ backend ↔ frontend communication**, and **diagram hints** (UML, sequence, deployment, Gantt). Use it when generating documentation, diagrams, or onboarding tasks.

**Stack summary:** Monorepo — **Spring Boot 3.2 / Java 17 / PostgreSQL / JPA** (backend), **Next.js 14 / TypeScript / Axios / Leaflet** (frontend). API base: `http://localhost:8080` with **context-path** `/api/v1` → full API root `http://localhost:8080/api/v1`.

---

## 1. Product logic (business)

- **UrbanOps** is a smart urban supervision platform focused on **Marrakech**: citizens report urban incidents; the system stores them, may **classify severity** via **Google Gemini** (with keyword fallback), notifies **category authority emails**, and exposes **dashboards** for admins.
- **Actors:** `CITIZEN` (report, view own incidents), `ADMIN` (users, status changes, alerts, destructive ops).
- **Incident lifecycle:** Typically `OPEN` → `IN_PROGRESS` → `RESOLVED`; `resolved_at` set when status becomes resolved.
- **Reference codes:** `INC-0001` style after persistence (ID-based formatting).

---

## 2. Layered architecture (for package / component diagrams)

```text
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                      │
│  app/* pages  →  components  →  lib/api.ts (Axios + fetch)       │
│  JWT: localStorage `urbanops_token`                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/JSON + multipart
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot 3.2)                      │
│  Controller (REST) → Service (transactions, rules)                │
│       → Repository (Spring Data JPA) → PostgreSQL                 │
│  Security: JWT filter → UserDetailsService → BCrypt passwords     │
│  Cross-cutting: GlobalExceptionHandler, OpenAPI, CORS, Actuator   │
└────────────────────────────┬────────────────────────────────────┘
                             │ JDBC
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                          │
│  Tables: users, categories, sectors, incidents, alerts          │
│  Schema: Hibernate ddl-auto=update (entities are source of truth) │
└─────────────────────────────────────────────────────────────────┘
```

**External systems:** Gmail SMTP (alerts), Google Gemini HTTP API (analysis). Optional: SonarQube, JaCoCo reports.

---

## 3. Database ↔ backend mapping (for ER / class diagrams)

JPA entities map 1:1 to relational tables (`@Table`). Relationships drive foreign keys.

| Entity / table    | Primary key | Main relations |
|-------------------|-------------|------------------|
| **User** (`users`) | `id` | `OneToMany` → Incident (`reported_by_id` on incidents) |
| **Category** (`categories`) | `id` | Referenced by Incident (`category_id` NOT NULL) |
| **Sector** (`sectors`) | `id` | Referenced by Incident (`sector_id` NOT NULL) |
| **Incident** (`incidents`) | `id` | `ManyToOne` → Category, Sector, User (optional); `OneToMany` → Alert |
| **Alert** (`alerts`) | `id` | `ManyToOne` → Incident (NOT NULL) |

**Cardinality (UML-style):**

- Category **1** — **\*** Incident  
- Sector **1** — **\*** Incident  
- User **0..1** — **\*** Incident (reporter optional for anonymous POST)  
- Incident **1** — **\*** Alert  

**Important columns (incidents):** `reference_code`, `severity` (enum string), `status`, `latitude`/`longitude`, `photo_url`, `ai_analysis_result`, `authority_notified`, `alert_sent`, timestamps, `resolved_at`.

**Categories** carry routing metadata: `default_authority`, `authority_email` (used when creating/sending alerts).

---

## 4. Backend internal flow (for UML sequence / activity diagrams)

### 4.1 Authenticated request (JWT)

1. Client sends `Authorization: Bearer <jwt>`.
2. **`JwtAuthenticationFilter`** extracts token → **`JwtTokenProvider.validateToken`** / `getUsernameFromJWT`.
3. **`UserDetailsServiceImpl.loadUserByUsername`** loads **`User`** from DB via **`UserRepository`** → builds **`UserDetailsImpl`** with `ROLE_ADMIN` or `ROLE_CITIZEN`.
4. **`SecurityFilterChain`** authorizes method/path (`@PreAuthorize`, HTTP matchers).

### 4.2 Create incident (multipart)

1. **`IncidentController`** receives `IncidentRequest` as JSON part `data` + optional `photo` file; optional **`UserDetailsImpl`** for reporter.
2. **`IncidentService.createIncident`**:
   - Loads **Category** / **Sector** by ID (404 if missing).
   - **`FileStorageService.storeFile`** → saves under `file.upload-dir`, returns stored filename as `photo_url`.
   - **`AIAnalysisService.analyze`** (Gemini or fallback) → sets severity, authority fields, AI text.
   - **`incidentRepository.save`** twice if needed for reference code generation pattern.
   - If severity HIGH or MEDIUM: **`AlertService.createAndSendAlert`** → persists **Alert**, **`EmailService.sendAlertEmail`** (`@Async`).
3. Response DTO built in controller (nested category/sector DTOs).

### 4.3 Read paths

- Paginated list: **`IncidentRepository`** + JPA **Specification** filters.
- Map light load: **`IncidentRepository.findAllForMapProjection`** → interface projection (few columns).

### 4.4 Stats dashboard

- **`StatsController`** → **`StatsService`** → **`IncidentRepository`** / **`UserRepository`** / **`AlertRepository`** counts and grouped queries → aggregated DTO (e.g. `StatsResponse` when present).

### 4.5 Scheduled jobs

- **`ScheduledTaskService`**: daily summary log, overdue HIGH+OPEN incidents, hourly incident count log. Driven by `@EnableScheduling` and cron/rate properties.

---

## 5. Frontend ↔ backend communication (for API / sequence diagrams)

**Configuration:** `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8080/api/v1` (see `frontend/lib/api.ts`).

**Pattern:**

- Most calls: **Axios** instance with JSON `Content-Type`; request interceptor attaches **Bearer** token from `localStorage`.
- **Create incident:** **native `fetch`** with `FormData` (multipart) because Axios multipart + JSON part is awkward; still attaches Bearer manually if present.
- **401 handling:** If not login/register URL, clear token and redirect to `/auth/signin`.

**Endpoint groups (prefix `/api/v1` on server):**

| Area | Typical methods | Auth |
|------|-----------------|------|
| `/auth/login`, `/auth/register` | POST | Public |
| `/auth/me`, `/auth/logout`, profile update | GET/POST/PUT | Authenticated |
| `/incidents` | GET (filters), POST multipart | POST often public; `/incidents/my` authenticated |
| `/incidents/{id}/status` | PATCH | ADMIN |
| `/categories`, `/sectors`, `/stats/*` | GET | Mostly public reads |
| `/users/*`, `/alerts/*` | Various | ADMIN |

**DTO direction:** Request DTOs (JSON) validate with Jakarta Validation; responses use nested response DTOs (not entities exposed raw).

---

## 6. Security rules (for UML deployment / policy diagrams)

- Stateless JWT; CSRF disabled (API).
- Public: actuator health/info (subset), auth register/login, GET categories/sectors/stats/incidents (broad), POST create incident.
- Authenticated: `/auth/**` (except login/register), `/incidents/my`.
- ADMIN: user management, PATCH/DELETE incidents, all `/alerts/**`.

---

## 7. Diagram generation guide (explicit instructions for AI)

### 7.1 UML **class diagram** (domain + tech)

- **Classes:** `User`, `Category`, `Sector`, `Incident`, `Alert` with attributes from JPA entities.
- **Associations:** as in section 3; add multiplicities.
- Optionally separate **layers:** `*Controller` → `*Service` → `*Repository` «interface» → entity package (dashed dependency from service to repository).

### 7.2 UML **component / deployment**

- **Nodes:** Browser, Next.js server (dev), Spring Boot JVM, PostgreSQL, SMTP (Gmail), Gemini API.
- **Connectors:** HTTPS internal (browser↔Next), HTTP/JSON (browser↔Spring or Next↔Spring depending on how you model — in this app, **browser calls Spring directly** via Axios base URL), JDBC (Spring↔Postgres), HTTPS (Spring↔Gemini, Spring↔SMTP).

### 7.3 UML **sequence diagrams** (suggested scenarios)

1. **Login:** Client → `AuthController` → `AuthenticationManager` → `UserDetailsServiceImpl` → DB → JWT `JwtTokenProvider` → client stores token.
2. **Create incident:** Client FormData → `IncidentController` → `IncidentService` → DB (category/sector) → `AIAnalysisService` (HTTP out) → DB save → `AlertService` → `EmailService` (async) → response.
3. **Admin patch status:** Client + JWT → filter → `IncidentController` → `IncidentService.updateStatus` → DB.

### 7.4 **Activity / BPMN-style** (incident pipeline)

Swimlanes: **Citizen** (submit) → **API** (validate) → **AI** (classify) → **DB** (persist) → **Alert** (email) → **Admin** (ack / status).

### 7.5 **Gantt chart** (how to use this doc)

Gantt is **time-based planning**, not code structure. Suggested **workstreams** for a reproduction plan:

| Phase | Work packages (examples) |
|-------|---------------------------|
| W1 | DB + `application.properties`, PostgreSQL |
| W2 | Entities + repositories + Flyway optional |
| W3 | Security + JWT + user seed |
| W4 | Incident pipeline + file upload + AI integration |
| W5 | Alerts + email async |
| W6 | Stats + scheduled tasks |
| W7 | Frontend pages + `api.ts` integration |
| W8 | Tests + JaCoCo + hardening |

AI should **ask the user** for sprint dates or duration per phase, then map W1–W8 to a timeline (e.g. 2-week sprints).

### 7.6 **ER diagram**

Use tables in section 3; draw FK: `incidents.category_id` → `categories.id`, `incidents.sector_id` → `sectors.id`, `incidents.reported_by_id` → `users.id`, `alerts.incident_id` → `incidents.id`.

---

## 8. Key files reference (navigation)

| Concern | Path (typical) |
|---------|----------------|
| Maven deps | `backend/pom.xml` |
| DB + JWT + mail + AI | `backend/src/main/resources/application.properties`, `application-dev.properties` |
| Entry | `backend/.../UrbanOpsApplication.java` |
| Security chain | `backend/.../config/SecurityConfig.java` |
| JWT | `backend/.../security/JwtTokenProvider.java`, `JwtAuthenticationFilter.java` |
| REST | `backend/.../controller/*.java` |
| Business | `backend/.../service/*.java` |
| Persistence | `backend/.../repository/*.java`, `entity/*.java` |
| Seed data | `backend/.../config/DataSeeder.java` |
| HTTP client | `frontend/lib/api.ts` |
| Types | `frontend/lib/types.ts` |

---

## 9. Known integrity notes (for AI when building or fixing)

- Git history may show **deleted** sources still **imported** elsewhere (e.g. `UserService`, `RegisterRequest`, `CategoryService`, `SectorService`, some DTOs/tests). Restore or reimplement before claiming a green build.
- **`AlertController`** path `POST /alerts/{incidentId}/resend` vs **`AlertService.resendAlert(Long id)`** loading an **Alert** by primary key — verify parameter is **alert id** vs **incident id** when fixing bugs.
- Frontend `Incident.severity` may include `CRITICAL`; backend enum is **HIGH / MEDIUM / LOW** — align types for diagrams and UI.

---

## 10. How AI should use this file

1. **Before** drawing UML/Gantt: read sections **2–6** for accurate arrows and labels.
2. For **any diagram**, label HTTP methods and **full path prefix** `/api/v1`.
3. For **DB diagrams**, prefer **entity names** and **FK names** consistent with JPA (`@JoinColumn`).
4. If the user asks only for diagrams, **do not invent endpoints**; use the tables in section 5 and controller code in the repo.

---

*Generated for UrbanOps. Update this file when major architectural or API changes land.*
