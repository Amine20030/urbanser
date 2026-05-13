# UrbanOps - Detailed Project Tree with Complete Data Flows

## Overview

This document explains **every important file**, its **role**, and **complete data flow examples** showing how user interactions trigger backend requests and database operations.

---

## PART 1: FRONTEND STRUCTURE (Next.js)

```
frontend/
├── app/                              # Next.js App Router - contains all pages/routes
│   ├── page.tsx                      # HOME PAGE (Landing Page)
│   ├── layout.tsx                    # ROOT LAYOUT (wraps all pages, providers)
│   ├── globals.css                   # GLOBAL STYLES
│   │
│   ├── auth/                         # AUTHENTICATION ROUTES
│   │   ├── signin/
│   │   │   └── page.tsx              # LOGIN PAGE
│   │   └── signup/
│   │       └── page.tsx              # REGISTRATION PAGE
│   │
│   ├── dashboard/                    # ADMIN DASHBOARD
│   │   └── page.tsx                  # DASHBOARD PAGE (KPIs, charts)
│   │
│   ├── incidents/                    # INCIDENTS MANAGEMENT
│   │   ├── page.tsx                  # INCIDENTS LIST PAGE (table)
│   │   ├── new/
│   │   │   └── page.tsx              # CREATE NEW INCIDENT PAGE
│   │   └── [id]/
│   │       └── page.tsx              # VIEW INCIDENT DETAIL PAGE
│   │
│   ├── carte/                        # MAP PAGE
│   │   └── page.tsx                  # MAP VIEW PAGE (Leaflet)
│   │
│   ├── alertes/                      # ALERTS PAGE
│   │   └── page.tsx                  # ALERTS LIST PAGE
│   │
│   ├── parametres/                   # SETTINGS PAGE
│   │   └── page.tsx                  # USER SETTINGS PAGE
│   │
│   └── utilisateurs/                 # USERS MANAGEMENT (Admin)
│       └── page.tsx                  # USERS LIST PAGE
│
├── components/                       # REUSABLE UI COMPONENTS
│   ├── ThemeProvider.tsx             # THEME/CONTEXT PROVIDER
│   │
│   ├── layout/                       # LAYOUT COMPONENTS
│   │   ├── Navbar.tsx                # TOP NAVIGATION BAR
│   │   ├── Sidebar.tsx               # LEFT SIDE NAVIGATION
│   │   ├── Footer.tsx                # FOOTER
│   │   ├── DashboardShell.tsx        # DASHBOARD LAYOUT WRAPPER
│   │   └── ...                       # Other layout helpers
│   │
│   ├── dashboard/                    # DASHBOARD WIDGETS
│   │   ├── KpiCards.tsx              # KPI DISPLAY COMPONENT
│   │   ├── ActivityChart.tsx         # INCIDENT CHART COMPONENT
│   │   ├── AlertsPanel.tsx           # RECENT ALERTS COMPONENT
│   │   ├── IncidentTable.tsx         # INCIDENTS TABLE COMPONENT
│   │   ├── ServiceCards.tsx          # SERVICE HEALTH COMPONENT
│   │   └── ...                       # Other dashboard components
│   │
│   ├── landing/                      # LANDING PAGE COMPONENTS
│   │   ├── HeroSection.tsx           # HERO BANNER
│   │   ├── HowItWorks.tsx            # PROCESS VISUALIZATION
│   │   ├── MapSection.tsx            # MAP DEMO SECTION
│   │   ├── RecentReports.tsx         # RECENT INCIDENTS SHOWCASE
│   │   └── ...                       # Other landing components
│   │
│   ├── shared/                       # SHARED/REUSABLE COMPONENTS
│   │   ├── SignalerModal.tsx         # INCIDENT CREATION MODAL
│   │   ├── MapView.tsx               # LEAFLET MAP WRAPPER
│   │   ├── LoadingSkeleton.tsx       # LOADING PLACEHOLDER
│   │   ├── ErrorState.tsx            # ERROR DISPLAY
│   │   ├── StatusBadge.tsx           # STATUS INDICATOR
│   │   ├── SeverityBadge.tsx         # SEVERITY INDICATOR
│   │   └── ...                       # Other shared components
│   │
│   ├── map/                          # MAP-SPECIFIC COMPONENTS
│   │   └── ...                       # Map utilities
│   │
│   └── ui/                           # DESIGN SYSTEM COMPONENTS
│       ├── button.tsx                # BUTTON COMPONENT
│       ├── card.tsx                  # CARD COMPONENT
│       ├── dialog.tsx                # MODAL DIALOG COMPONENT
│       ├── input.tsx                 # INPUT FIELD COMPONENT
│       ├── select.tsx                # DROPDOWN COMPONENT
│       └── ...                       # Other UI primitives
│
├── lib/                              # FRONTEND UTILITIES & CONFIG
│   ├── api.ts                        # HTTP CLIENT & API WRAPPERS ⭐ CRITICAL
│   ├── types.ts                      # TYPESCRIPT INTERFACES
│   ├── mockData.ts                   # LOCAL TEST DATA
│   ├── utils.ts                      # HELPER FUNCTIONS
│   └── lib/
│       └── ...                       # Additional utilities
│
├── public/                           # STATIC ASSETS
│   └── images/                       # IMAGE FILES
│
├── package.json                      # DEPENDENCIES & SCRIPTS
├── tsconfig.json                     # TYPESCRIPT CONFIG
├── next.config.js                    # NEXT.JS CONFIG
├── postcss.config.js                 # CSS PROCESSING CONFIG
└── tailwind.config.ts                # TAILWIND CONFIG (styling)
```

---

## PART 2: BACKEND STRUCTURE (Spring Boot)

```
backend/
├── src/main/java/ma/urbanops/       # MAIN SOURCE CODE
│   │
│   ├── controller/                   # REST ENDPOINTS (HTTP entry points)
│   │   ├── AuthController.java       # AUTH ENDPOINTS: /api/auth/login, signup, me, logout
│   │   ├── IncidentController.java   # INCIDENT ENDPOINTS: /api/incidents (CRUD + filter)
│   │   ├── StatsController.java      # STATS ENDPOINTS: /api/stats/dashboard
│   │   ├── AlertController.java      # ALERT ENDPOINTS: /api/alerts/recent
│   │   ├── CategoryController.java   # CATEGORY ENDPOINTS: /api/categories
│   │   ├── SectorController.java     # SECTOR ENDPOINTS: /api/sectors (⚠️ missing)
│   │   └── UserController.java       # USER ENDPOINTS: /api/users (admin only)
│   │
│   ├── service/                      # BUSINESS LOGIC (core processing)
│   │   ├── AuthService.java          # AUTH BUSINESS LOGIC
│   │   ├── IncidentService.java      # INCIDENT ORCHESTRATION ⭐ CRITICAL
│   │   ├── AIAnalysisService.java    # GEMINI AI INTEGRATION
│   │   ├── AlertService.java         # ALERT CREATION & DISPATCH
│   │   ├── EmailService.java         # EMAIL SENDING
│   │   ├── FileStorageService.java   # FILE UPLOAD/STORAGE
│   │   ├── StatsService.java         # KPI AGGREGATION
│   │   └── ...                       # Other business services
│   │
│   ├── repository/                   # DATA ACCESS (DATABASE queries)
│   │   ├── IncidentRepository.java   # INCIDENT QUERIES
│   │   ├── UserRepository.java       # USER QUERIES
│   │   ├── AlertRepository.java      # ALERT QUERIES
│   │   ├── CategoryRepository.java   # CATEGORY QUERIES
│   │   ├── SectorRepository.java     # SECTOR QUERIES
│   │   └── ...                       # Other repositories
│   │
│   ├── entity/                       # DATABASE MODELS (JPA entities)
│   │   ├── User.java                 # USER TABLE MODEL
│   │   ├── Incident.java             # INCIDENT TABLE MODEL
│   │   ├── Alert.java                # ALERT TABLE MODEL
│   │   ├── Category.java             # CATEGORY TABLE MODEL ⭐ REFERENCE
│   │   ├── Sector.java               # SECTOR TABLE MODEL ⭐ REFERENCE
│   │   └── ...                       # Other entities
│   │
│   ├── security/                     # AUTHENTICATION & SECURITY
│   │   ├── JwtTokenProvider.java     # JWT TOKEN GENERATION/VALIDATION
│   │   ├── JwtAuthenticationFilter.java # JWT REQUEST FILTER ⭐ MIDDLEWARE 1
│   │   ├── CustomUserDetails.java    # USER DETAILS IMPLEMENTATION
│   │   ├── CustomUserDetailsService.java # USER LOADING SERVICE
│   │   └── ...                       # Other security classes
│   │
│   ├── config/                       # APPLICATION CONFIGURATION
│   │   ├── SecurityConfig.java       # SECURITY FILTER CHAIN CONFIG ⭐ MIDDLEWARE 2
│   │   ├── CorsConfig.java           # CORS SETTINGS
│   │   ├── JmsConfig.java            # JMS QUEUE CONFIG
│   │   ├── AsyncConfig.java          # ASYNC TASK CONFIG
│   │   ├── OpenApiConfig.java        # SWAGGER/OPENAPI CONFIG
│   │   ├── RmiConfig.java            # RMI SERVICE CONFIG
│   │   ├── SoapConfig.java           # SOAP SERVICE CONFIG
│   │   └── ...                       # Other configs
│   │
│   ├── jms/                          # ASYNC MESSAGING (JMS)
│   │   ├── AlertProducer.java        # SENDS ALERT MESSAGES TO QUEUE
│   │   ├── AlertConsumer.java        # RECEIVES ALERT MESSAGES FROM QUEUE
│   │   ├── AlertMessage.java         # MESSAGE MODEL
│   │   └── JmsConfig.java            # JMS CONFIGURATION
│   │
│   ├── dto/                          # DATA TRANSFER OBJECTS (API request/response)
│   │   ├── AuthRequest.java          # LOGIN REQUEST DTO
│   │   ├── AuthResponse.java         # LOGIN RESPONSE DTO
│   │   ├── IncidentRequest.java      # INCIDENT CREATE/UPDATE REQUEST DTO
│   │   ├── IncidentResponse.java     # INCIDENT RESPONSE DTO
│   │   ├── StatsResponse.java        # STATS RESPONSE DTO
│   │   ├── AlertResponse.java        # ALERT RESPONSE DTO
│   │   └── ...                       # Other DTOs
│   │
│   ├── exception/                    # ERROR HANDLING
│   │   ├── GlobalExceptionHandler.java # CENTRALIZED ERROR HANDLER ⭐ MIDDLEWARE 3
│   │   ├── ResourceNotFoundException.java # NOT FOUND EXCEPTION
│   │   ├── UnauthorizedException.java # AUTH EXCEPTION
│   │   └── ...                       # Other exceptions
│   │
│   └── UrbanopsApplication.java      # SPRING BOOT MAIN APPLICATION CLASS
│
├── src/main/resources/               # CONFIGURATION FILES
│   ├── application.properties        # DEFAULT CONFIGURATION
│   ├── application-dev.properties    # DEVELOPMENT PROFILE
│   ├── application-prod.properties   # PRODUCTION PROFILE
│   └── urbanops.xsd                  # SCHEMA DEFINITION (SOAP)
│
├── src/test/                         # TEST CODE
│   └── java/
│       └── ma/urbanops/
│           └── ...                   # Unit tests, integration tests
│
├── pom.xml                           # MAVEN BUILD CONFIGURATION
├── sonar-project.properties          # CODE QUALITY CONFIG
└── logs/                             # APPLICATION LOGS
```

---

## PART 3: FILE ROLES & MIDDLEWARE EXPLANATION

### **FRONTEND: lib/api.ts** ⭐ CRITICAL

**File**: [frontend/lib/api.ts](frontend/lib/api.ts)

**Role**: Axios HTTP client with interceptors (middleware layer)

**What it does**:
1. Creates Axios instance
2. **Request interceptor**: Attaches JWT token to every request
3. **Response interceptor**: Handles 401 errors (redirects to login)
4. Exports API wrapper functions for each endpoint

**How middleware works**:
```typescript
// MIDDLEWARE 1: REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // ← Inject token
  }
  return config
})

// MIDDLEWARE 2: RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ← 401 means token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/auth/signin'  // ← Redirect to login
    }
  }
)
```

**Exported functions**:
```typescript
authAPI.login(email, password)          // → POST /api/auth/login
authAPI.register(data)                   // → POST /api/auth/signup
authAPI.getMe()                          // → GET /api/auth/me
statsAPI.getDashboard()                  // → GET /api/stats/dashboard
statsAPI.getHourly()                     // → GET /api/stats/incidents/hourly
statsAPI.getServicesHealth()             // → GET /api/stats/services/health
alertAPI.getRecent()                     // → GET /api/alerts/recent
incidentAPI.create(formData)             // → POST /api/incidents (multipart)
incidentAPI.getByReference(ref)          // → GET /api/incidents/{reference}
// ... many more
```

---

### **BACKEND: JwtAuthenticationFilter.java** ⭐ MIDDLEWARE 1

**File**: `backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java`

**Role**: Security filter that validates JWT token on every request

**How it works**: (Middleware chain)

```
CLIENT REQUEST
    ↓
[1] JwtAuthenticationFilter
    - Extracts Authorization header
    - Validates JWT signature & expiry
    - Loads user details from token
    - Places user in SecurityContext ← Important!
    ↓
[2] SecurityConfig filter chain
    - Checks if endpoint requires authentication
    - Blocks unauthorized requests
    ↓
[3] Controllers
    - Now receives authenticated request
    - Can access user from SecurityContext
    ↓
RESPONSE with user data
```

**Code flow**:
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) {
        String token = extractTokenFromHeader(request)  // ← Get "Bearer xxxx"
        
        if (token != null && jwtProvider.validateToken(token)) {
            String userId = jwtProvider.extractUserId(token)
            UserDetails user = userDetailsService.loadUserById(userId)
            
            // ← KEY: Populate SecurityContext
            SecurityContext context = SecurityContextHolder.createEmptyContext()
            context.setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
            )
            SecurityContextHolder.setContext(context)
        }
        
        filterChain.doFilter(request, response)  // ← Pass to next filter
    }
}
```

---

### **BACKEND: SecurityConfig.java** ⭐ MIDDLEWARE 2

**File**: `backend/src/main/java/ma/urbanops/config/SecurityConfig.java`

**Role**: Defines which endpoints need authentication, CORS settings, filter chain

**How it works**:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers("/api/auth/**").permitAll()        // ← Public
                auth.requestMatchers("/api/incidents", "GET").permitAll() // ← Public
                auth.requestMatchers("/api/incidents/**").authenticated() // ← Protected
                auth.requestMatchers("/api/users/**").hasRole("ADMIN")    // ← Admin only
                auth.anyRequest().authenticated()                         // ← Everything else needs auth
            })
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class  // ← Add JWT filter
            )
            .build()
    }
}
```

---

### **BACKEND: GlobalExceptionHandler.java** ⭐ MIDDLEWARE 3

**File**: `backend/src/main/java/ma/urbanops/exception/GlobalExceptionHandler.java`

**Role**: Centralized error handler (catches all exceptions automatically)

**How it works**:

```java
@RestControllerAdvice  // ← Intercepts ALL exceptions
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException ex
    ) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("Resource not found", ex.getMessage()))
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
        UnauthorizedException ex
    ) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Unauthorized", ex.getMessage()))
    }
}
```

Instead of returning raw errors, all exceptions become clean JSON responses:
```json
{
  "message": "Resource not found",
  "details": "Incident with ID 123 not found"
}
```

---

### **BACKEND: IncidentService.java** ⭐ CRITICAL BUSINESS LOGIC

**File**: `backend/src/main/java/ma/urbanops/service/IncidentService.java`

**Role**: Orchestrates entire incident creation workflow

**What happens when user creates incident**:

```java
@Service
public class IncidentService {
    
    public IncidentResponse createIncident(
        IncidentRequest request,
        MultipartFile photo
    ) {
        // Step 1: Validate input
        validateIncidentData(request)
        
        // Step 2: Upload photo to file system
        String photoPath = fileStorageService.uploadFile(photo)
        
        // Step 3: Get category & sector from database
        Category category = categoryRepository.findById(request.categoryId)
        Sector sector = sectorRepository.findById(request.sectorId)
        
        // Step 4: Call AI service for severity analysis
        AIAnalysisResult aiResult = aiAnalysisService.analyzeWithGemini(
            request.description,
            photo.getBytes()
        )  // ← Gemini API call
        
        // Step 5: Create incident entity
        Incident incident = new Incident()
            .setDescription(request.description)
            .setLocation(request.location)
            .setCategory(category)
            .setSector(sector)
            .setSeverity(aiResult.severity)     // ← From AI
            .setRecommendedAuthority(aiResult.authority)  // ← From AI
            .setPhotoPath(photoPath)
            .setStatus("OPEN")
        
        // Step 6: Save to database
        Incident saved = incidentRepository.save(incident)
        
        // Step 7: Send alert through JMS (async)
        alertProducer.sendAlert(
            new AlertMessage(saved.getId(), saved.getSeverity())
        )  // ← Queued for future processing
        
        // Step 8: Return response
        return new IncidentResponse(saved)
    }
}
```

**Database diagram for incident creation**:
```
USER clicks "Signaler un incident" button
    ↓
SignalerModal.tsx (frontend form)
    ↓
Call: incidentAPI.create(formData)
    ↓
POST /api/incidents (with file upload)
    ↓
IncidentController.createIncident()
    ↓
IncidentService.createIncident()
    ├─ Upload file → filesystem
    ├─ Query: categoryRepository.findById(categoryId) → CATEGORY table
    ├─ Query: sectorRepository.findById(sectorId) → SECTOR table
    ├─ Call AI: aiAnalysisService.analyzeWithGemini()
    └─ Insert: incidentRepository.save() → INCIDENT table
    ├─ Alert created (via JMS) → ALERT table (async)
    ├─ Email queued → eventual email sent
    ↓
Return IncidentResponse with new incident ID
    ↓
Frontend receives response
    ↓
Dispatch 'incident-created' event
    ↓
MapView component re-fetches incidents
```

---

### **BACKEND: JMS Producer/Consumer** (Asynchronous Alerts)

**Producer**: `backend/src/main/java/ma/urbanops/jms/AlertProducer.java`

```java
@Component
public class AlertProducer {
    private JmsTemplate jmsTemplate;
    
    public void sendAlert(AlertMessage msg) {
        // This is ASYNC - doesn't wait
        jmsTemplate.convertAndSend("alertQueue", msg)
        // Control returns immediately to caller
    }
}
```

**Consumer**: `backend/src/main/java/ma/urbanops/jms/AlertConsumer.java`

```java
@Component
public class AlertConsumer {
    
    @JmsListener(destination = "alertQueue")
    public void receiveAlert(AlertMessage msg) {
        // This method runs later (when message arrives in queue)
        Alert alert = new Alert()
            .setIncidentId(msg.incidentId)
            .setSeverity(msg.severity)
        
        alertRepository.save(alert)  // ← Save to ALERT table
        emailService.sendAlert(msg)  // ← Send email
    }
}
```

**Timeline**:
```
t=0ms    → User clicks "Signaler" button
t=50ms   → Incident saved to database
t=55ms   → Alert message queued (producer returns immediately)
t=60ms   → User sees success message
...
t=500ms  → Consumer picks up message from queue
t=550ms  → Alert saved to ALERT table
t=600ms  → Email service sends notification
```

---

## PART 4: COMPLETE DATA FLOW EXAMPLES

### **EXAMPLE 1: User Logs In**

**URL**: `http://localhost:3000/auth/signin`

**Step-by-step flow**:

1. **Frontend - User fills form**
   - File: [frontend/app/auth/signin/page.tsx](frontend/app/auth/signin/page.tsx)
   - User enters email & password, clicks "Connecter"

2. **Frontend - Form submit**
   ```typescript
   // In signin/page.tsx
   const handleSubmit = async (e) => {
     const response = await authAPI.login({
       email: "user@example.com",
       password: "password123"
     })
     // response = { accessToken: "jwt_token_here", user: {...} }
   }
   ```

3. **Frontend - Middleware (lib/api.ts)**
   ```typescript
   POST http://localhost:8080/api/auth/login
   Body: { email, password }
   Headers: Content-Type: application/json
   ```

4. **Backend - SecurityConfig**
   - URL matcher: `/api/auth/login` is in `.permitAll()` list
   - ✅ Request allowed (no authentication needed yet)

5. **Backend - AuthController**
   ```java
   @PostMapping("/login")
   public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
       // Call authService.authenticate()
       User user = authService.authenticate(request.getEmail(), request.getPassword())
       String token = jwtTokenProvider.generateToken(user)
       
       return ResponseEntity.ok(
           new AuthResponse(token, user.getName())
       )
   }
   ```

6. **Backend - AuthService**
   ```java
   public User authenticate(String email, String password) {
       // Query database
       User user = userRepository.findByEmail(email)
       
       if (!passwordEncoder.matches(password, user.getPassword())) {
           throw new UnauthorizedException("Invalid password")
       }
       return user
   }
   ```

7. **Backend - Repository Layer**
   ```java
   // Executes SQL query
   SELECT * FROM users WHERE email = 'user@example.com'
   // Returns User entity
   ```

8. **Backend - Database**
   ```sql
   -- PostgreSQL
   TABLE: users
   | id  | email              | password_hash   | name       | role  |
   |-----|-------------------|-----------------|-----------|------|
   | 1   | user@example.com  | $2a$10$hashed.. | John Doe  | USER |
   ```

9. **Backend - JWT Token created**
   ```java
   String token = Jwts.builder()
       .setSubject(user.getId())
       .claim("email", user.getEmail())
       .claim("role", user.getRole())
       .setIssuedAt(new Date())
       .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // 24h
       .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
       .compact()
   
   // Returns: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZW1..."
   ```

10. **Backend - Response sent**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
      "userName": "John Doe"
    }
    ```

11. **Frontend - Middleware Response Interceptor**
    - Receives response with token
    - Stores token in localStorage:
    ```typescript
    localStorage.setItem('authToken', response.accessToken)
    ```

12. **Frontend - User redirected**
    ```typescript
    router.push('/dashboard')  // ← Navigate to dashboard
    ```

13. **Result**: User is now logged in ✅

---

### **EXAMPLE 2: Dashboard Loads (User clicks Dashboard button)**

**URL**: `http://localhost:3000/dashboard`

**Step-by-step flow**:

1. **Frontend - Component mounts**
   - File: [frontend/app/dashboard/page.tsx](frontend/app/dashboard/page.tsx)
   - Page renders multiple widgets

2. **Frontend - Widget 1: KPI Cards**
   - File: [frontend/components/dashboard/KpiCards.tsx](frontend/components/dashboard/KpiCards.tsx)
   ```typescript
   useEffect(() => {
     const loadStats = async () => {
       const data = await statsAPI.getDashboard()
       // statsAPI calls: GET /api/stats/dashboard
       setKpis(data)
     }
     loadStats()
   }, [])
   ```

3. **Frontend - lib/api.ts Request Interceptor**
   - Before sending request, attach JWT token:
   ```typescript
   GET http://localhost:8080/api/stats/dashboard
   Headers: {
     "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9...",
     "Content-Type": "application/json"
   }
   ```

4. **Backend - Request reaches JwtAuthenticationFilter**
   - Middleware 1: JWT validation
   ```java
   String token = "eyJhbGciOiJIUzUxMiJ9..."
   
   if (jwtProvider.validateToken(token)) {  // ← Check signature & expiry
       String userId = jwtProvider.extractUserId(token)  // ← Get user ID from token
       UserDetails user = userDetailsService.loadUserById(userId)
       
       // Put user in SecurityContext
       SecurityContextHolder.getContext()
           .setAuthentication(...)
   }
   ```

5. **Backend - SecurityConfig checks endpoint**
   - Middleware 2: Authorization
   ```java
   "/api/stats/dashboard" matches: authenticated()
   // ← Requires valid JWT (✅ we have one)
   ```

6. **Backend - StatsController receives request**
   ```java
   @GetMapping("/dashboard")
   public ResponseEntity<StatsResponse> getDashboard() {
       User currentUser = securityContext.getAuthentication().getPrincipal()
       // ← User is automatically available!
       
       return ResponseEntity.ok(statsService.getDashboardStats(currentUser))
   }
   ```

7. **Backend - StatsService queries database**
   ```java
   public StatsResponse getDashboardStats(User user) {
       // Query repository
       Long totalIncidents = incidentRepository.count()
       Long openIncidents = incidentRepository
           .countByStatus("OPEN")
       Long resolvedIncidents = incidentRepository
           .countByStatus("RESOLVED")
       
       Double healthPercentage = calculateHealth(totalIncidents, resolvedIncidents)
       
       return new StatsResponse(
           totalIncidents,
           openIncidents,
           resolvedIncidents,
           healthPercentage
       )
   }
   ```

8. **Backend - Repository executes queries**
   ```sql
   -- Query 1: Count total incidents
   SELECT COUNT(*) FROM incidents
   Result: 156
   
   -- Query 2: Count open incidents
   SELECT COUNT(*) FROM incidents WHERE status = 'OPEN'
   Result: 43
   
   -- Query 3: Count resolved incidents
   SELECT COUNT(*) FROM incidents WHERE status = 'RESOLVED'
   Result: 113
   ```

9. **Backend - Response created**
   ```json
   {
     "totalIncidents": 156,
     "openIncidents": 43,
     "resolvedIncidents": 113,
     "healthPercentage": 72.4
   }
   ```

10. **Backend - GlobalExceptionHandler**
    - No errors occurred, so no exception handling needed
    - Response passes through unchanged

11. **Frontend - Response interceptor**
    - Status code is 200 ✅
    - Response is valid
    - Pass to component

12. **Frontend - Component renders**
    ```typescript
    <KpiCard label="Total" value={156} color="blue" />
    <KpiCard label="Open" value={43} color="red" />
    <KpiCard label="Resolved" value={113} color="green" />
    ```

13. **Result**: Dashboard loads with live data ✅

---

### **EXAMPLE 3: User Creates Incident (Click "Signaler un incident" button)**

**URL**: `http://localhost:3000/` (from any page)

**Step-by-step flow**:

1. **Frontend - User clicks button**
   - File: [frontend/components/shared/SignalerModal.tsx](frontend/components/shared/SignalerModal.tsx)
   - Modal opens with form

2. **Frontend - User fills form**
   ```typescript
   Form fields:
   - Category: "Panne Électrique"
   - Sector: "Électricité"
   - Description: "Panne totale quartier Guéliz depuis 2h"
   - Location: "Marrakech"
   - Photo: (file uploaded)
   ```

3. **Frontend - Form submit**
   ```typescript
   const handleSubmit = async (formData) => {
     const form = new FormData()
     form.append('categoryId', '1')
     form.append('sectorId', '2')
     form.append('description', 'Panne totale...')
     form.append('location', 'Marrakech')
     form.append('photo', fileObject)  // ← Binary file
     
     const response = await incidentAPI.create(form)
   }
   ```

4. **Frontend - Middleware (lib/api.ts)**
   ```typescript
   POST http://localhost:8080/api/incidents
   Headers: {
     "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9...",
     "Content-Type": "multipart/form-data"  // ← File upload!
   }
   Body: (multipart with file)
   ```

5. **Backend - JWT Filter validates token**
   - ✅ Token is valid
   - User ID: "123"

6. **Backend - SecurityConfig checks permission**
   - `/api/incidents` with POST matches: `authenticated()`
   - ✅ User is authenticated

7. **Backend - IncidentController receives request**
   ```java
   @PostMapping
   public ResponseEntity<IncidentResponse> createIncident(
       @RequestBody IncidentRequest request,
       @RequestParam MultipartFile photo
   ) {
       return ResponseEntity.ok(
           incidentService.createIncident(request, photo)
       )
   }
   ```

8. **Backend - IncidentService orchestrates**
   ```java
   public IncidentResponse createIncident(
       IncidentRequest request,
       MultipartFile photo
   ) {
       // Step A: Validate
       if (request.getCategoryId() == null) {
           throw new IllegalArgumentException("Category required")
       }
       
       // Step B: Upload file
       String photoPath = fileStorageService.uploadFile(photo)
       // Saves to: /tmp/uploads/incident_123_photo.jpg
       
       // Step C: Query database for category
       Category category = categoryRepository.findById(request.getCategoryId())
       // SQL: SELECT * FROM categories WHERE id = 1
       // Result: { id: 1, name: "Panne Électrique", ... }
       
       // Step D: Query database for sector
       Sector sector = sectorRepository.findById(request.getSectorId())
       // SQL: SELECT * FROM sectors WHERE id = 2
       // Result: { id: 2, name: "Électricité", ... }
       
       // Step E: Call AI service (Google Gemini API)
       AIAnalysisResult aiResult = aiAnalysisService.analyzeWithGemini(
           request.getDescription(),
           photo.getBytes()
       )
       // API Call to Google Gemini
       // Input: "Panne totale quartier Guéliz depuis 2h"
       // Output: {
       //   severity: "HIGH",
       //   category: "POWER_OUTAGE",
       //   recommendedAuthority: "MAROC_TELECOM_SUPPORT"
       // }
       
       // Step F: Create incident entity
       Incident incident = new Incident()
           .setDescription(request.getDescription())
           .setLocation(request.getLocation())
           .setCategory(category)
           .setSector(sector)
           .setSeverity(aiResult.getSeverity())      // ← From AI
           .setRecommendedAuthority(aiResult.getAuthority())  // ← From AI
           .setPhotoPath(photoPath)
           .setStatus("OPEN")
           .setCreatedAt(LocalDateTime.now())
           .setCreatedBy(user)  // ← Current logged-in user
       
       // Step G: INSERT into database
       Incident saved = incidentRepository.save(incident)
       // SQL: INSERT INTO incidents 
       //      (description, location, category_id, severity, status, photo_path, created_at)
       //      VALUES ('...', 'Marrakech', 1, 'HIGH', 'OPEN', '...', now())
       // Generated ID: 999
       
       // Step H: Create alert message for queue
       AlertMessage alertMsg = new AlertMessage()
           .setIncidentId(saved.getId())        // 999
           .setSeverity(saved.getSeverity())    // HIGH
           .setCategory(saved.getCategory())
       
       // Step I: Send to JMS queue (ASYNC - doesn't wait)
       alertProducer.sendAlert(alertMsg)
       // Message goes to queue
       // Control returns immediately
       
       // Step J: Return response
       return new IncidentResponse(saved)
       // JSON: { id: 999, description: "...", severity: "HIGH", ... }
   }
   ```

9. **Backend - Database state after incident creation**
   ```sql
   -- INCIDENTS table
   INSERT INTO incidents VALUES (
     999,                              -- id
     '123',                            -- created_by (user id)
     'Panne totale...',               -- description
     'Marrakech',                      -- location
     1,                                -- category_id → categories(1)
     2,                                -- sector_id → sectors(2)
     'HIGH',                           -- severity
     'OPEN',                           -- status
     '/tmp/uploads/incident_999.jpg',  -- photo_path
     'MAROC_TELECOM_SUPPORT',          -- recommended_authority
     NOW(),                            -- created_at
     NULL                              -- resolved_at
   )
   
   -- ALERTS table (via JMS Consumer, a few ms later)
   INSERT INTO alerts VALUES (
     5001,        -- id
     999,         -- incident_id
     'HIGH',      -- severity
     'New incident reported'  -- message
   )
   ```

10. **Frontend - Response received**
    ```json
    {
      "id": 999,
      "description": "Panne totale...",
      "severity": "HIGH",
      "status": "OPEN",
      "location": "Marrakech",
      "photoPath": "/tmp/uploads/incident_999.jpg"
    }
    ```

11. **Frontend - Dispatch event**
    ```typescript
    dispatch(new CustomEvent('incident-created', {
      detail: { incidentId: 999 }
    }))
    ```

12. **Frontend - MapView component listens**
    ```typescript
    addEventListener('incident-created', () => {
      // Re-fetch incidents from backend
      const incidents = await incidentAPI.getMap()
      // Map updates with new incident marker
    })
    ```

13. **Frontend - Show notification**
    ```typescript
    toast.success("Incident créé avec succès!")
    modal.close()
    ```

14. **Result**: Incident saved, email queued, map updated ✅

---

### **EXAMPLE 4: Map Loads (Auto-refresh every 30 seconds)**

**URL**: `http://localhost:3000/carte`

**Step-by-step flow**:

1. **Frontend - Component mounts**
   - File: [frontend/components/shared/MapView.tsx](frontend/components/shared/MapView.tsx)

2. **Frontend - Initial load**
   ```typescript
   useEffect(() => {
     const fetchIncidents = async () => {
       const data = await incidentAPI.getMap()
       // GET /api/incidents/map
       setIncidents(data)
       renderMapMarkers(data)
     }
     
     fetchIncidents()
     
     // Setup auto-refresh every 30 seconds
     const interval = setInterval(fetchIncidents, 30000)
     return () => clearInterval(interval)
   }, [])
   ```

3. **Frontend - API call with middleware**
   ```
   GET http://localhost:8080/api/incidents/map
   Headers: Authorization: Bearer JWT_TOKEN
   ```

4. **Backend - JWT Filter validates**
   - ✅ Token valid

5. **Backend - IncidentController**
   ```java
   @GetMapping("/map")
   public ResponseEntity<List<IncidentMapResponse>> getIncidentsForMap() {
       return ResponseEntity.ok(
           incidentService.getIncidentsForMap()
       )
   }
   ```

6. **Backend - IncidentService**
   ```java
   public List<IncidentMapResponse> getIncidentsForMap() {
       // Query only OPEN incidents (for performance)
       List<Incident> incidents = incidentRepository
           .findByStatusAndCreatedAtAfter(
               "OPEN",
               LocalDateTime.now().minusDays(7)  // ← Last 7 days only
           )
       
       return incidents.stream()
           .map(incident -> new IncidentMapResponse(
               incident.getId(),
               incident.getLocation(),
               incident.getSeverity(),
               incident.getLatitude(),
               incident.getLongitude()
           ))
           .collect(Collectors.toList())
   }
   ```

7. **Backend - Repository query**
   ```sql
   SELECT * FROM incidents 
   WHERE status = 'OPEN' 
   AND created_at > NOW() - INTERVAL '7 days'
   
   Result:
   | id  | location     | severity | latitude  | longitude |
   |-----|--------------|----------|-----------|-----------|
   | 999 | Marrakech    | HIGH     | 31.6295   | -7.9811   |
   | 998 | Casablanca   | MEDIUM   | 33.5731   | -7.5898   |
   | 997 | Fez          | LOW      | 34.0330   | -5.0033   |
   ```

8. **Frontend - Response**
   ```json
   [
     {
       "id": 999,
       "location": "Marrakech",
       "severity": "HIGH",
       "latitude": 31.6295,
       "longitude": -7.9811
     },
     { ... }
   ]
   ```

9. **Frontend - Render Leaflet markers**
   ```typescript
   incidents.forEach(incident => {
     const color = incident.severity === "HIGH" ? "red" 
                 : incident.severity === "MEDIUM" ? "orange" 
                 : "green"
     
     L.circleMarker([incident.latitude, incident.longitude], {
       radius: 8,
       fillColor: color,
       color: "white",
       weight: 2,
       opacity: 1,
       fillOpacity: 0.8
     })
       .bindPopup(`${incident.location} - ${incident.severity}`)
       .addTo(map)
   })
   ```

10. **Result**: Map shows live incidents with color-coded severity ✅

---

## PART 5: Architecture Summary

### **Request/Response Flow (Overview)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js + React)                                          │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [Page Component] → [Reusable Component]                        │ │
│ │    ↓                      ↓                                     │ │
│ │ [API Wrapper (api.ts)]                                         │ │
│ │    ↓                                                            │ │
│ │ [Request Interceptor]  ← Attach JWT token                      │ │
│ │    ↓                                                            │ │
│ │ [HTTP Request]                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                    [HTTP over network - 5ms-100ms]
                                     │
┌────────────────────────────────────┬────────────────────────────────┐
│ BACKEND (Spring Boot)              ↓                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [JWT Auth Filter]         ← Validate token, populate context   │ │
│ │    ↓                                                            │ │
│ │ [Security Filter Chain]   ← Check if endpoint requires auth    │ │
│ │    ↓                                                            │ │
│ │ [Controller]              ← Route to correct endpoint          │ │
│ │    ↓                                                            │ │
│ │ [Service Layer]           ← Business logic & orchestration     │ │
│ │    ├─ Call repository     ← Query database                     │ │
│ │    ├─ Call external API   ← e.g., Gemini                       │ │
│ │    ├─ Send to JMS queue   ← Async task                         │ │
│ │    └─ Return response                                          │ │
│ │    ↓                                                            │ │
│ │ [Global Exception Handler] ← Catch errors, format response     │ │
│ │    ↓                                                            │ │
│ │ [HTTP Response]                                                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                    [HTTP over network - 5ms-100ms]
                                     │
┌────────────────────────────────────┬────────────────────────────────┐
│ FRONTEND (continued)               ↓                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [Response Interceptor]    ← Handle 401, errors                 │ │
│ │    ↓                                                            │ │
│ │ [Update State]            ← setState, update UI                │ │
│ │    ↓                                                            │ │
│ │ [Re-render Component]     ← Show data to user                  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

### **Database Schema (Simplified)**

```
┌──────────────────┐          ┌──────────────────┐
│ USERS            │          │ CATEGORIES       │
├──────────────────┤          ├──────────────────┤
│ id (PK)          │          │ id (PK)          │
│ email            │          │ name             │
│ password_hash    │          │ description      │
│ name             │          └──────────────────┘
│ role             │                   △
└──────────────────┘                   │
         △                      (FK)   │
         │               ┌─────────────┘
         │(FK)    ┌──────────────────────────────┐
         │        │ INCIDENTS                    │
┌────────┴────────┼──────────────────────────────┤
│                 │ id (PK)                      │
│                 │ description                  │
│                 │ location                     │
│                 │ category_id (FK) ─────────┐  │
│                 │ sector_id (FK) ─────────┐ │  │
│                 │ severity                 │ │  │
│                 │ status                   │ │  │
│                 │ photo_path              │ │  │
│                 │ created_by (FK) ────────┼─┘  │
│                 │ created_at              │    │
│                 └──────────────────────────────┘
│                        │
│                        │(1:many)
│          ┌─────────────▼──────────┐
│          │ ALERTS                  │
│          ├─────────────────────────┤
│          │ id (PK)                 │
│          │ incident_id (FK)        │
│          │ severity                │
│          │ message                 │
│          │ sent_at                 │
│          └─────────────────────────┘
│
└─────────────────────────┐
                      ┌───────────────────┐
                      │ SECTORS           │
                      ├───────────────────┤
                      │ id (PK)           │
                      │ name              │
                      │ description       │
                      └───────────────────┘
```

---

## Key Takeaways

| Component | Type | Purpose | Example |
|-----------|------|---------|---------|
| `lib/api.ts` | Frontend Middleware | Attach auth token to requests | JWT automatically added to headers |
| `JwtAuthenticationFilter` | Backend Middleware 1 | Validate JWT, populate SecurityContext | Extract user ID from token, load user details |
| `SecurityConfig` | Backend Middleware 2 | Define which endpoints need auth | `/api/auth/**` is public, `/api/users/**` is admin-only |
| `GlobalExceptionHandler` | Backend Middleware 3 | Centralize error handling | All exceptions become JSON error responses |
| `IncidentService` | Business Logic | Orchestrate incident creation | Validate → Upload → Query DB → Call AI → Save → Queue alert |
| `AlertProducer/Consumer` | Async Pattern | Queue alerts for async processing | Send alert message, consumer processes it 100ms-500ms later |

