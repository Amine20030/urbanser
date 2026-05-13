# UrbanOps Feature-by-Feature Walkthrough

Date: 2026-05-12

This document explains the UrbanOps codebase from the real implementation: frontend flow, backend flow, database flow, security flow, key methods, and likely professor questions.

## 1. User Login

Purpose: authenticate an existing user and issue a JWT token.

Frontend path: [frontend/app/auth/signin/page.tsx](frontend/app/auth/signin/page.tsx#L9), [frontend/lib/api.ts](frontend/lib/api.ts#L4)

Backend path: [backend/src/main/java/ma/urbanops/controller/AuthController.java](backend/src/main/java/ma/urbanops/controller/AuthController.java#L43), [backend/src/main/java/ma/urbanops/config/SecurityConfig.java](backend/src/main/java/ma/urbanops/config/SecurityConfig.java#L53), [backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java](backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java#L30)

Key methods: `SignInPage.onSubmit()` line 18, `AuthController.login()` line 45, `SecurityConfig.authenticationManager()` line 48, `JwtTokenProvider.generateToken()` line 43, `JwtAuthenticationFilter.doFilterInternal()` line 30.

Flow:
1. The user submits email/password in the sign-in form.
2. `authAPI.login()` sends `POST /auth/login`.
3. `AuthController.login()` builds `UsernamePasswordAuthenticationToken` and delegates to `AuthenticationManager`.
4. Spring Security uses `UserDetailsServiceImpl` + `BCryptPasswordEncoder` to validate credentials.
5. `JwtTokenProvider.generateToken()` creates a signed token.
6. Response contains `AuthResponse` with token and user DTO.
7. Frontend stores `urbanops_token` and `urbanops_user` in localStorage and redirects to dashboard.

Database flow: `UserRepository.findByEmail()` loads the user row, password is compared against the BCrypt hash stored in `users.password`.

Security flow: login endpoint is public, but after login every protected request is authenticated by `JwtAuthenticationFilter` reading the Bearer token.

Common bugs: wrong `Bearer` prefix, expired token, password hash mismatch, missing `@Valid` on request DTO.

Professor questions:
- Why use JWT instead of session?
- Why use `AuthenticationManager`?
- Why does the token go to localStorage?

## 2. User Registration

Purpose: create a new citizen account with hashed password and default role.

Frontend path: [frontend/app/auth/signup/page.tsx](frontend/app/auth/signup/page.tsx#L18), [frontend/lib/api.ts](frontend/lib/api.ts#L46)

Backend path: [backend/src/main/java/ma/urbanops/controller/AuthController.java](backend/src/main/java/ma/urbanops/controller/AuthController.java#L34), [backend/src/main/java/ma/urbanops/service/UserService.java](backend/src/main/java/ma/urbanops/service/UserService.java#L23)

Key methods: `SignUpPage.onSubmit()` line 41, `AuthController.register()` line 36, `UserService.register()` line 23.

Flow:
1. The form validates passwords and optional sector/phone.
2. Frontend calls `POST /auth/register` with `RegisterRequest`.
3. `AuthController.register()` delegates to `UserService.register()`.
4. `UserService.register()` checks email uniqueness, hashes password with `PasswordEncoder`, sets role `CITIZEN`, and saves through `UserRepository`.
5. Backend returns `201 Created` and a `UserResponse` DTO.
6. Frontend redirects to sign-in.

Database flow: insert into `users` table; defaults come from entity `@PrePersist` and service logic.

Common bugs: duplicate email, weak password, forgetting password hashing, exposing entity instead of DTO.

Professor questions:
- Why is `PasswordEncoder` mandatory?
- Why create only CITIZEN accounts here?
- Why use DTO instead of entity in the API?

## 3. JWT Authentication

Purpose: secure the API without server-side sessions.

Backend path: [backend/src/main/java/ma/urbanops/security/JwtTokenProvider.java](backend/src/main/java/ma/urbanops/security/JwtTokenProvider.java#L38), [backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java](backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java#L30), [backend/src/main/java/ma/urbanops/config/SecurityConfig.java](backend/src/main/java/ma/urbanops/config/SecurityConfig.java#L53)

Key methods: `getSigningKey()` line 38, `generateToken()` line 43, `getUsernameFromJWT()` line 78, `validateToken()` line 92, `doFilterInternal()` line 30.

Flow:
1. Login produces a signed JWT.
2. Frontend stores it in localStorage.
3. `api.interceptors.request.use()` attaches `Authorization: Bearer <token>`.
4. `JwtAuthenticationFilter` extracts the token from the header.
5. `JwtTokenProvider.validateToken()` checks signature and expiry.
6. `UserDetailsServiceImpl.loadUserByUsername()` rebuilds authentication state.
7. `SecurityContextHolder` receives the authenticated principal.

Security flow: stateless, so no HTTP session is kept. Authorization is enforced by URL rules and `@PreAuthorize`.

Common bugs: token signing key too short, malformed token, missing filter order before `UsernamePasswordAuthenticationFilter`.

## 4. User Management

Purpose: admin can list, inspect, deactivate users and view user stats.

Frontend path: [frontend/app/utilisateurs/page.tsx](frontend/app/utilisateurs/page.tsx#L1), [frontend/lib/api.ts](frontend/lib/api.ts#L142)

Backend path: [backend/src/main/java/ma/urbanops/controller/UserController.java](backend/src/main/java/ma/urbanops/controller/UserController.java#L32), [backend/src/main/java/ma/urbanops/service/UserService.java](backend/src/main/java/ma/urbanops/service/UserService.java#L37)

Key methods: `UserController.getAllUsers()` line 32, `getUserById()` line 40, `deactivateUser()` line 48, `getUserStats()` line 56, `UserService.findAll()` line 36, `findById()` line 45, `deactivateUser()` line 60.

Flow:
1. Admin opens users page.
2. Frontend calls `GET /users` via `userAPI.getAll()`.
3. `@PreAuthorize("hasRole('ADMIN')")` blocks non-admins.
4. Service uses `UserRepository.findAll(Pageable)` and returns `UserResponse` DTOs.
5. Deactivation flips `isActive` to false.

Common bugs: using entity directly in UI, forgetting `@PreAuthorize`, role prefix mismatch (`ROLE_`).

## 5. Incident Creation

Purpose: create an incident with metadata, coordinates, optional image, AI analysis, persistence, and alert creation.

Frontend path: [frontend/app/incidents/new/page.tsx](frontend/app/incidents/new/page.tsx#L15), [frontend/components/shared/SignalerModal.tsx](frontend/components/shared/SignalerModal.tsx#L12), [frontend/lib/api.ts](frontend/lib/api.ts#L74)

Backend path: [backend/src/main/java/ma/urbanops/controller/IncidentController.java](backend/src/main/java/ma/urbanops/controller/IncidentController.java#L69), [backend/src/main/java/ma/urbanops/service/IncidentService.java](backend/src/main/java/ma/urbanops/service/IncidentService.java#L89), [backend/src/main/java/ma/urbanops/service/AIAnalysisService.java](backend/src/main/java/ma/urbanops/service/AIAnalysisService.java#L38), [backend/src/main/java/ma/urbanops/service/AlertService.java](backend/src/main/java/ma/urbanops/service/AlertService.java#L28)

Key methods: `NewIncidentPage.onSubmit()` line 58, `SignalerModal.handleSubmit()` line 62, `IncidentController.createIncident()` line 71, `IncidentService.createIncident()` line 89, `AIAnalysisService.analyze()` line 38, `AlertService.createAndSendAlert()` line 28.

Flow:
1. Frontend loads categories and sectors.
2. User fills form and submits `FormData` with `data` JSON + optional `photo`.
3. Backend validates `IncidentRequest` and file upload.
4. Service loads `Category` and `Sector` from repositories.
5. Photo is stored through `FileStorageService.storeFile()`.
6. AI analysis classifies severity, authority, and reason.
7. Incident is saved once to get the DB id, then saved again after generating `referenceCode` like `INC-0001`.
8. If severity is HIGH or MEDIUM, alert creation is triggered.
9. Frontend receives success and updates the map/table.

Database flow: insert into `incidents`, then update `reference_code`, then insert into `alerts` if needed.

Security flow: creation is permitted in `SecurityConfig`, but reporter information is added from the authenticated user when present.

Common bugs: saving file before DB commit, double-save required for reference code, AI fallback returning MEDIUM when provider fails.

Professor questions:
- Why two saves?
- Why use multipart form-data?
- Why is the AI call wrapped in try/catch?

## 6. Incident Update and Status Change

Purpose: allow incident modification, especially status update to RESOLVED.

Backend path: [backend/src/main/java/ma/urbanops/controller/IncidentController.java](backend/src/main/java/ma/urbanops/controller/IncidentController.java#L83), [backend/src/main/java/ma/urbanops/service/IncidentService.java](backend/src/main/java/ma/urbanops/service/IncidentService.java#L169)

Key methods: `updateStatus()` line 87, `IncidentService.updateStatus()` line 169, `deleteIncident()` line 182.

Flow:
1. Admin sends `PATCH /incidents/{id}/status` with `UpdateStatusRequest`.
2. Validation ensures status is present.
3. Service loads incident, sets new status, and sets `resolvedAt` if resolved.
4. Save updates DB row.

Common bugs: updating status without admin role, forgetting resolved timestamp, overusing PUT when PATCH is more correct.

## 7. Dashboard Statistics

Purpose: expose KPIs, trends, service health, resolution rate.

Frontend path: [frontend/app/dashboard/page.tsx](frontend/app/dashboard/page.tsx#L14), [frontend/components/dashboard/KpiCards.tsx](frontend/components/dashboard/KpiCards.tsx#L7), [frontend/components/dashboard/ActivityChart.tsx](frontend/components/dashboard/ActivityChart.tsx#L6)

Backend path: [backend/src/main/java/ma/urbanops/controller/StatsController.java](backend/src/main/java/ma/urbanops/controller/StatsController.java#L28), [backend/src/main/java/ma/urbanops/service/StatsService.java](backend/src/main/java/ma/urbanops/service/StatsService.java#L29)

Key methods: `StatsController.getDashboardStats()` line 28, `StatsService.getDashboardStats()` line 29, `getStatsByCategory()` line 85, `getStatsBySector()` line 95, `getHourlyStats()` line 103, `getServicesHealth()` line 116.

Flow:
1. Dashboard loads.
2. `KpiCards` calls `statsAPI.getDashboard()`.
3. `ActivityChart` calls `statsAPI.getHourly()`.
4. `StatsService` aggregates counts via repository queries and returns `StatsResponse`.
5. Frontend renders cards and chart.

Database flow: counts and group-by queries on incidents and users.

Common bugs: empty result sets, division by zero in resolution rate, slow group-by queries on big data.

## 8. Alerts System

Purpose: create alerts when incident severity requires authority intervention and let admin acknowledge/resend.

Frontend path: [frontend/app/alertes/page.tsx](frontend/app/alertes/page.tsx#L1), [frontend/lib/api.ts](frontend/lib/api.ts#L110)

Backend path: [backend/src/main/java/ma/urbanops/controller/AlertController.java](backend/src/main/java/ma/urbanops/controller/AlertController.java#L32), [backend/src/main/java/ma/urbanops/service/AlertService.java](backend/src/main/java/ma/urbanops/service/AlertService.java#L28)

Key methods: `getAllAlerts()` line 32, `resendAlert()` line 64, `acknowledgeAlert()` line 72, `AlertService.createAndSendAlert()` line 28, `resendAlert()` line 67.

Flow:
1. Incident creation triggers `AlertService.createAndSendAlert()`.
2. Alert entity is stored with severity/title/message/sentTo.
3. Email is sent asynchronously.
4. Admin can acknowledge or resend from UI.

Common bugs: `emailSent=true` before SMTP confirmation, resend endpoint using incidentId naming while service expects alertId in some flows.

## 9. AI Analysis System and Gemini Integration

Purpose: classify incidents automatically and determine the competent authority.

Backend path: [backend/src/main/java/ma/urbanops/service/AIAnalysisService.java](backend/src/main/java/ma/urbanops/service/AIAnalysisService.java#L38)

Key methods: `analyze()` line 38, `callGemini()` line 63, `buildPrompt()` line 94, `parseResponse()` line 126, `fallback()` line 153.

Flow:
1. `analyze()` checks API key.
2. If key is missing or Gemini fails, fallback rules are used.
3. If API is available, `RestTemplate.exchange()` posts a JSON request.
4. Prompt forces strict JSON output.
5. Returned text is parsed into `AIAnalysisResult`.
6. Severity is normalized to HIGH/MEDIUM/LOW.

Common bugs: malformed JSON from AI, 429 rate limit, prompt drift, unsafe trust in model output.

Professor questions:
- Why fallback instead of failing request?
- Why force JSON output?
- Why use prompt engineering in backend?

## 10. File/Image Upload

Purpose: attach incident photo safely and persist it on disk.

Frontend path: [frontend/app/incidents/new/page.tsx](frontend/app/incidents/new/page.tsx#L58), [frontend/components/shared/SignalerModal.tsx](frontend/components/shared/SignalerModal.tsx#L62)

Backend path: [backend/src/main/java/ma/urbanops/service/FileStorageService.java](backend/src/main/java/ma/urbanops/service/FileStorageService.java#L26), [backend/src/main/java/ma/urbanops/controller/IncidentController.java](backend/src/main/java/ma/urbanops/controller/IncidentController.java#L69)

Key methods: `storeFile()` line 36, `deleteFile()` line 70.

Flow:
1. Frontend builds `FormData` and appends `photo`.
2. Controller accepts multipart request.
3. `FileStorageService.init()` creates upload directory.
4. `storeFile()` sanitizes filename, generates UUID name, and copies stream.

Common bugs: file path traversal, file size too large, orphan files if transaction later fails.

## 11. Leaflet Map and Markers

Purpose: show incidents geographically on an interactive map.

Frontend path: [frontend/components/landing/MapSection.tsx](frontend/components/landing/MapSection.tsx#L1), [frontend/components/shared/MapView.tsx](frontend/components/shared/MapView.tsx#L47), [frontend/app/page.tsx](frontend/app/page.tsx#L1)

Backend path: [backend/src/main/java/ma/urbanops/controller/IncidentController.java](backend/src/main/java/ma/urbanops/controller/IncidentController.java#L113), [backend/src/main/java/ma/urbanops/service/IncidentService.java](backend/src/main/java/ma/urbanops/service/IncidentService.java#L236)

Key methods: `MapView.fetchIncidents()` line 59, `MapContainer` line 184, `TileLayer` line 191, `CircleMarker` line 92.

Flow:
1. `MapSection` mounts `MapView` dynamically with SSR disabled.
2. `MapView` calls `GET /incidents/map`.
3. Coordinates are validated.
4. Each incident becomes a `CircleMarker` with color based on severity.
5. Popups show category, status, authority, and coordinates.

Leaflet details:
- `MapContainer` provides the map canvas.
- `TileLayer` adds OSM/CARTO tiles.
- `CircleMarker` renders markers using latitude/longitude.

Common bugs: inverted lat/lng order, invalid coordinates, loading map in SSR mode, stale data without refresh.

## 12. Categories and Sectors

Purpose: reference data for incident classification and sector selection.

Frontend path: [frontend/app/incidents/new/page.tsx](frontend/app/incidents/new/page.tsx#L31), [frontend/app/auth/signup/page.tsx](frontend/app/auth/signup/page.tsx#L34)

Backend path: [backend/src/main/java/ma/urbanops/controller/CategoryController.java](backend/src/main/java/ma/urbanops/controller/CategoryController.java#L27), [backend/src/main/java/ma/urbanops/controller/SectorController.java](backend/src/main/java/ma/urbanops/controller/SectorController.java#L29)

Key methods: `CategoryService.findAllActive()` line 26, `create()` line 29, `update()` line 31; `SectorService.findAllActive()` line 29, `create()` line 31.

Common bugs: over-posting when sending entities directly from admin screens, missing DTO validation, not filtering inactive items.

## 13. Role Management

Purpose: distinguish citizen vs admin access.

Backend path: [backend/src/main/java/ma/urbanops/entity/User.java](backend/src/main/java/ma/urbanops/entity/User.java#L39), [backend/src/main/java/ma/urbanops/security/UserDetailsImpl.java](backend/src/main/java/ma/urbanops/security/UserDetailsImpl.java#L29), [backend/src/main/java/ma/urbanops/config/SecurityConfig.java](backend/src/main/java/ma/urbanops/config/SecurityConfig.java#L53)

Flow: `Role` enum is stored in `users.role`, converted to `ROLE_<NAME>` in Spring Security, and enforced with `@PreAuthorize`.

Professor question: Why does Spring need the `ROLE_` prefix?

## 14. Axios API Communication and CORS

Purpose: centralize HTTP calls and security token injection.

Frontend path: [frontend/lib/api.ts](frontend/lib/api.ts#L4)

Backend path: [backend/src/main/java/ma/urbanops/config/CorsConfig.java](backend/src/main/java/ma/urbanops/config/CorsConfig.java#L12), [backend/src/main/java/ma/urbanops/config/WebConfig.java](backend/src/main/java/ma/urbanops/config/WebConfig.java#L13)

Key methods: `api.interceptors.request.use()` line 13, `api.interceptors.response.use()` line 25.

Flow:
1. Request interceptor injects JWT into `Authorization` header.
2. Response interceptor logs out on 401 except login/register.
3. Backend CORS allows the Next.js origins and common methods.

Common bugs: missing origin in CORS, forgotten auth header, redirect loop on 401.

## 15. Swagger / OpenAPI

Purpose: document REST endpoints for testing and defense.

Backend path: `OpenApiConfig` plus `@Tag`, `@Operation`, `@SecurityRequirement` annotations across controllers.

Use: professors can inspect endpoints and security requirements quickly.

## 16. Email Sending and Async Processing

Purpose: send alerts without blocking the HTTP response.

Backend path: [backend/src/main/java/ma/urbanops/service/EmailService.java](backend/src/main/java/ma/urbanops/service/EmailService.java#L40), [backend/src/main/java/ma/urbanops/config/AsyncConfig.java](backend/src/main/java/ma/urbanops/config/AsyncConfig.java#L28)

Flow:
1. Alert service calls email service.
2. `@Async` runs method in thread pool.
3. API returns immediately.
4. SMTP happens in background.

Common bugs: assuming async success, not handling SMTP failure, thread pool saturation.

## 17. Database Persistence and JPA/Hibernate Relationships

Purpose: map object model to relational schema.

Entities: `Incident`, `Alert`, `User`, `Category`, `Sector`.

Important mappings:
- `Incident.category`, `Incident.sector`, `Incident.reportedBy` are `@ManyToOne(fetch = LAZY)`.
- `Incident.alerts` and `User.incidents` are `@OneToMany(... cascade = ALL, orphanRemoval = true, fetch = LAZY)`.

Why it matters: keeps data normalized, controls lazy loading, and manages child rows automatically.

## 18. Validation System

Purpose: block malformed input early.

Backend path: [backend/src/main/java/ma/urbanops/dto/request/RegisterRequest.java](backend/src/main/java/ma/urbanops/dto/request/RegisterRequest.java#L13), [backend/src/main/java/ma/urbanops/dto/request/IncidentRequest.java](backend/src/main/java/ma/urbanops/dto/request/IncidentRequest.java#L19)

Flow: `@Valid` on controller parameters triggers Jakarta validation before service code runs.

Common bugs: missing `@Valid`, relying only on frontend checks, poor error messages.

## 19. Error Handling

Purpose: return consistent JSON errors.

Backend path: [backend/src/main/java/ma/urbanops/exception/GlobalExceptionHandler.java](backend/src/main/java/ma/urbanops/exception/GlobalExceptionHandler.java#L25)

Handled exceptions: not found, unauthorized, forbidden, validation, upload too large, AI failure, bad credentials, disabled account, generic exception.

## 20. ResponseEntity Handling

Purpose: control HTTP status + body precisely.

Examples:
- `201 Created` register and create operations.
- `200 OK` reads and updates.
- `204 No Content` delete/logout.
- `202 Accepted` resend alert.

## 21. Scheduled Tasks

Purpose: background monitoring and periodic reporting.

Backend path: [backend/src/main/java/ma/urbanops/service/ScheduledTaskService.java](backend/src/main/java/ma/urbanops/service/ScheduledTaskService.java#L33)

Methods: `dailySummaryLog()`, `checkOverdueHighSeverityIncidents()`, `hourlyStatsAggregation()`.

Why used: autonomous monitoring without user request.

## 22. Search, Filter, Pagination

Purpose: let users browse incidents efficiently.

Frontend path: [frontend/app/incidents/page.tsx](frontend/app/incidents/page.tsx#L1), [frontend/components/dashboard/IncidentTable.tsx](frontend/components/dashboard/IncidentTable.tsx#L17)

Backend path: [backend/src/main/java/ma/urbanops/controller/IncidentController.java](backend/src/main/java/ma/urbanops/controller/IncidentController.java#L42), [backend/src/main/java/ma/urbanops/service/IncidentService.java](backend/src/main/java/ma/urbanops/service/IncidentService.java#L44), [backend/src/main/java/ma/urbanops/repository/IncidentRepository.java](backend/src/main/java/ma/urbanops/repository/IncidentRepository.java#L91)

Flow:
1. Frontend passes category, severity, status, keyword, pageable parameters.
2. Service builds JPA `Specification` dynamically.
3. Repository executes paged query.
4. Dashboard table renders the filtered data.

## 23. Oral Presentation Script

Introduction: UrbanOps is a smart urban supervision platform for Marrakech. It centralizes citizen reports, classifies them, notifies the right authority, and provides decision dashboards.

Problem statement: urban incidents are often reported in an unstructured way, which slows down intervention.

Objectives: create a secure, reactive, traceable system with image upload, AI classification, alerts, statistics, and admin management.

Architecture: Next.js frontend, Spring Boot REST backend, PostgreSQL persistence, JWT security, JPA/Hibernate ORM, async email, scheduled monitoring.

Backend explanation: controllers handle HTTP, services hold business logic, repositories query the DB, entities map the schema.

Frontend explanation: pages and components use `frontend/lib/api.ts` to communicate with the backend, attach JWT, and render dashboard/map/forms.

Security explanation: login produces JWT, filter validates every request, and admin-only routes are protected with roles.

AI explanation: incident text is analyzed by Gemini when available, otherwise a deterministic fallback classifies severity and authority.

Database explanation: incidents, users, categories, sectors, and alerts are normalized through JPA relations.

Challenges: external AI availability, async email reliability, coordinate handling, and security hardening.

Future improvements: Flyway migrations, object storage for uploads, token refresh/blacklist, queue-based email delivery, and more advanced map filtering.

Conclusion: the project demonstrates a complete enterprise-style workflow from citizen signalement to backend orchestration and authority notification.

## 24. Short Revision Cheat Sheet

- `@RestController` = JSON API endpoint
- `@Service` = business layer
- `@Repository` = persistence layer
- `@Entity` = JPA mapped class
- `@Transactional` = DB atomicity
- `@Valid` + validation annotations = request guardrails
- `SecurityFilterChain` = HTTP security rules
- `JwtAuthenticationFilter` = Bearer token extraction and authentication
- `MultipartFile` + `@RequestPart` = file upload
- `ResponseEntity` = explicit HTTP status handling
- `@ManyToOne` / `@OneToMany` = ORM relationships
- `LAZY` = load on demand
- `@Async` = background execution
- `@Scheduled` = cron/fixed-rate background job
- `Specification` = dynamic search/filtering
