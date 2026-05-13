# 🎓 ORAL DEFENSE & CODEBASE WALKTHROUGH: URBANOPS PROJECT

This file contains the exact mapping of your features to your codebase, including file paths, execution flows, and the oral presentation script.

---

## 1. USER AUTHENTICATION, JWT & ROLES

**PURPOSE:**
Secures the platform, manages access, and maintains user sessions via JSON Web Tokens (JWT). Differentiates Citizens and Admins (RBAC).

**FRONTEND PATHS:**
* `frontend/app/auth/signin/page.tsx`
* `frontend/app/auth/signup/page.tsx`
* `frontend/lib/api.ts` (Lines 12-39 for Axios Interceptors)

**BACKEND PATH:**
* `backend/src/main/java/ma/urbanops/controller/AuthController.java`

**RELATED FILES:**
* `AuthController.java`
* `UserService.java`
* `JwtTokenProvider.java`
* `SecurityConfig.java`

**IMPORTANT METHODS:**
* `login(LoginRequest)`
* `register(RegisterRequest)`
* `api.interceptors.request.use()`

**LINE NUMBERS (AuthController.java):**
* `register()`: lines 34-41
* `login()`: lines 43-62

**FLOW:**
1. **Frontend**: User fills out the login form in React. `authAPI.login()` sends a `POST` request using Axios.
2. **Security Filter**: Spring Security's `JwtAuthenticationFilter` intercepts requests.
3. **App Logic**: `AuthController.login()` receives the DTO.
4. **Authentication**: `authenticationManager.authenticate()` validates credentials against DB via UserDetailsService.
5. **Token Generation**: `JwtTokenProvider.generateToken()` creates the JWT string.
6. **Response**: Backend responds with a `ResponseEntity` holding `AuthResponse` (token + basic user data).
7. **Frontend Storage**: Axios stores the token in `localStorage('urbanops_token')`.
8. **Subsequent Calls**: Axios interceptor attached in `api.ts` adds `Authorization: Bearer <token>` to all future requests.

**POSSIBLE PROFESSOR QUESTIONS:**
* *Why use JWT instead of Sessions?* JWT is stateless. The server doesn't have to keep session IDs in memory, allowing easier scaling.
* *How is role management implemented?* Using `@PreAuthorize("hasRole('ADMIN')")` in Controllers.

## 2. INCIDENT CREATION & AI GEMINI INTEGRATION

**PURPOSE:**
Allows a citizen to report an issue. A Gemini AI automatically analyzes the description to set severity, assign the authority, and extract metrics, while ensuring the system never crashes if AI fails.

**FRONTEND PATHS:**
* `frontend/lib/api.ts` (Lines 74-90: `incidentAPI.create(FormData)`)

**BACKEND PATH:**
* `backend/src/main/java/ma/urbanops/controller/IncidentController.java`
* `backend/src/main/java/ma/urbanops/service/IncidentService.java`
* `backend/src/main/java/ma/urbanops/service/AIAnalysisService.java`

**LINE NUMBERS:**
* `IncidentController.createIncident()`: lines 68-80
* `IncidentService.createIncident()`: lines 87-164
* `AIAnalysisService.analyze()`: lines 38-60

**FLOW:**
1. **Frontend**: Multi-part form data (including photo and DTO) is posted.
2. **Controller**: `@PostMapping(consumes = "multipart/form-data")` maps the payload.
3. **Storage**: `fileStorageService.storeFile(photo)` saves the image locally.
4. **AI Processing**: Code executes a **non-blocking AI block** (`IncidentService.java` line 116).
5. **Prompting**: `AIAnalysisService` structures a JSON-enforced Prompt, calls Google's REST Endpoint via `RestTemplate`.
6. **Graceful Degradation**: If Rate Limited (429) or API fails, `fallback()` executes using keyword matching (e.g. if desc contains "inondation", severity="HIGH").
7. **Database Saving**: `incidentRepository.save()` stores the entity. Then `generateReferenceCode()` creates a code.
8. **Alert Trigger**: If severity is HIGH/MEDIUM, `alertService.createAndSendAlert()` is triggered synchronously.

**POSSIBLE PROFESSOR QUESTIONS:**
* *Why save the incident, generate the code, and save again?* The code relies on the DB auto-increment `id` which is only available *after* the initial persist.
* *How do you prevent timeouts if Gemini is slow?* The AI block is inside a try-catch. Additionally, HTTP timeouts and a 429 rate limit retry block are implemented. If it fails, fallback rules instantly classify the incident.

## 3. DYNAMIC QUERYING, PAGINATION & DTO MAPPING

**PURPOSE:**
Fetching massive amounts of incidents efficiently based on dynamic inputs.

**BACKEND PATH:**
* `backend/src/main/java/ma/urbanops/service/IncidentService.java`

**LINE NUMBERS:**
* `getAllIncidents()`: lines 42-66 in `IncidentService.java`
* `toResponse()`: line 155 in `IncidentController.java`

**FLOW:**
1. Uses Spring Data JPA `Specification<Incident>`. It dynamically chains SQL `WHERE` clauses (`cb.equal()`).
2. **Pagination**: The DB directly handles the LIMIT and OFFSET logic.
3. **DTO Mapping**: DB returns `Page<Incident>`. `IncidentController.toResponse()` uses manual `.builder()` pattern to convert to `IncidentResponse`, safely removing cyclic references.

**POSSIBLE PROFESSOR QUESTIONS:**
* *Why use Specifications instead of standard repository methods?* Because combinations are dynamic. A user might provide a category but no status. Hardcoding combinations would mean hundreds of repository interfaces.

## 4. LEAFLET MAP & MARKERS SYSTEM

**PURPOSE:**
Visualizing all incidents spatially on a CartoDB/Esri map.

**FRONTEND PATH:**
* `frontend/components/map/IncidentsLeafletMap.tsx`
* `backend/src/main/java/ma/urbanops/controller/IncidentController.java` -> `/map` endpoint.

**LINE NUMBERS (IncidentsLeafletMap.tsx):**
* SSR prevention: lines 37-43
* Marker mapping: lines 70-89

**FLOW:**
1. Backend `getForMap()` route maps minimal data (Lat, Lng, Color, Title). No massive descriptions loaded.
2. **The Fix (Line 37)**: `React.useEffect()` ensures the map container (`<MapContainer>`) only renders *after* the client-side hydration sets `mounted = true`.
3. **Markers**: Iterates `.map((p) => <CircleMarker ...>)` to inject map bounds.

**POSSIBLE PROFESSOR QUESTIONS:**
* *Why does Leaflet show a hydration error in NextJS?* NextJS builds HTML on the server where `window` object doesn't exist, which Leaflet explicitly needs. Returning a blank `div` until mounted fixes it.

---

# 🎤 PROFESSIONAL ORAL PRESENTATION SCRIPT

*(Use this text to directly train for your defense. Practice reading it out loud at a steady, confident pace with natural pauses.)*

## 1. INTRODUCTION (Welcome & Context)
"Bonjour honorables membres du jury, Madame, Monsieur.
C’est avec une immense fierté que je vous présente aujourd'hui **UrbanOps**, la plateforme intelligente pour la gestion des incidents urbains. 

L’objectif principal de ce projet est de digitaliser et d'automatiser les signalements au sein des infrastructures de la ville. Les citoyens peuvent reporter un incident. Derrière, la plateforme prend le relais, classe l'incident, et alerte les autorités compétentes, en s'appuyant sur l'intelligence artificielle pour trier les urgences."

## 2. ARCHITECTURE & TECHNOLOGIES
"Pour garantir la performance et la maintenabilité de cette plateforme, j’ai fait le choix d’une architecture robuste et séparée.
* **Le Backend** est construit en **Java avec Spring Boot 3**, car il garantit des standards d’entreprise stricts et une sécurité maximale. 
* **Le Frontend** utilise **React.js et Next.js**, ce qui permet de créer une User Interface hautement réactive avec des capacités de rendu optimisées, utilisant **Axios** pour les appels APIs.
* **La Persistance** est assurée par une base de données relationnelle via **Spring Data JPA et Hibernate**."

## 3. FLOW DE SÉCURITÉ & AUTHENTIFICATION
"Permettez-moi de commencer par l’accès à la plateforme. Tout le système est sécurisé de bout en bout en implémentant une architecture Stateless via **JSON Web Tokens (JWT)** et **Spring Security**. 

Mon application délivre un token lors du login situé dans `AuthController`. Ce token est ensuite intercepté sur le Frontend par Axios—configuré dans mon fichier `api.ts` (lignes 13-22)—pour qu'il attache automatiquement l'en-tête `Authorization: Bearer` à chaque requête. De plus, un système RBAC robuste vérifie instantanément les droits via l'annotation `@PreAuthorize("hasRole('ADMIN')")`."

## 4. INTELLIGENCE ARTIFICIELLE & RÉSILIENCE DU BACKEND
"L'une des plus grandes valeurs ajoutées d'UrbanOps est l'analyse automatique des incidents. Lors d'un signalement, mon `IncidentService` (au niveau de la ligne 116) déclenche un appel asynchrone non-bloquant vers mon **AIAnalysisService**.

Ce service génère dynamiquement un prompt, envoyé via REST à l'API **Google Gemini**. J'utilise l'IA pour classifier la sévérité et désigner l'autorité cible. Que se passe-t-il si l'API Google tombe en panne ? J'ai introduit une méthode `fallback()` basés sur des expressions régulières. Si la requête contient 'câble' ou 'électrique', la sévérité est automatiquement relevée à HIGH sans interrompre le flow."

## 5. OPTIMISATION GÉOGRAPHIQUE & VUE CARTE
"Du côté citoyen et administration, la vue géolocalisée est primordiale. J'ai implémenté une carte interactive avec **React Leaflet**.
Pour éviter la surcharge réseau, mon backend expose une route dédiée, `/incidents/map`, qui ramène uniquement le strict minimum. De plus, gérant **Next.js**, j'ai dû contourner les erreurs d'hydratation (SSR). L'objet navigateur `window` n'étant pas disponible au rendu serveur, j'ai isolé la carte derrière un Hook `useEffect` dans `IncidentsLeafletMap.tsx`."

## 6. PAGINATION & REQUÊTAGE DYNAMIQUE
"Concernant la vue liste des incidents, recharger la base de données pour filtrer serait inefficace. J'ai donc implémenté la **Pagination via Spring Data** couplée avec les objets `Specification` de JPA. Cela m'a permis d'implémenter des requêtes 100% dynamiques, créant du SQL optimisé. Pour cloisonner l'API, je convertis systématiquement les objets métiers en **DTOs** via un pattern Builder."

## 7. CONCLUSION
"En concevant UrbanOps, j'ai géré des défis techniques pointus : la protection des form `@Valid`, l'intégration d'API avec Fallback, et la gestion des fichiers `MultipartFile`. Je vous remercie de m'avoir écouté, et je suis à présent à votre disposition pour vos questions."
