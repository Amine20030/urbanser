# Script pour présentation (prof — Systèmes distribués)

Durée cible : 5–7 minutes. Lis calmement, en montrant schéma si possible.

---

## 1) Intro rapide (30s)

Bonjour, je présente UrbanOps, une plateforme de supervision urbaine full‑stack développée en Next.js (frontend) et Spring Boot (backend). Elle permet aux citoyens de signaler des incidents (pannes, inondations, éclairage public...), aux opérateurs de les suivre et aux autorités d’être notifiées automatiquement.

Phrase d'ouverture : « UrbanOps est conçu comme un système distribué: clients Web, API stateless, services métier, messages asynchrones et intégrations externes. »

---

## 2) Architecture générale (1 min)

- Frontend : Next.js (App Router) — pages : `auth`, `incidents`, `carte`, `dashboard`, `admin`.
- Backend : Spring Boot exposant une API REST (/api/v1), services métier, persistance JPA → PostgreSQL.
- Asynchrone : JMS (ActiveMQ embedded) pour alertes / emails.
- Intégrations : SOAP (WSDL/XSD) et possibilité d'appels RMI pour composants Java distants; AI via API externe (Gemini).

Schéma verbal : Navigateur → HTTP(S) → API REST → Security Filter → Controller → Service → Repository → PostgreSQL. Pour notifications critiques : Service → JMS Producer → Queue → JMS Consumer → EmailService.

---

## 3) Parcours utilisateur concret (1.5 min)

Exemple 1 — Login
1. Utilisateur saisit email/mdp sur `/auth/signin`.
2. Frontend appelle `POST /api/v1/auth/login` via `lib/api.ts`.
3. Backend authentifie via `AuthenticationManager`, génère JWT et renvoie token.
4. Frontend stocke token (localStorage) ; l'interceptor l'ajoute aux requêtes suivantes.

Exemple 2 — Créer un incident
1. Formulaire (multipart) envoie `POST /api/v1/incidents` (données + photo).
2. `JwtAuthenticationFilter` valide token (si présent) et peuple `SecurityContext`.
3. `IncidentService` orchestre : upload photo, lookup catégorie/secteur, appel AI (si activé), persist en DB.
4. Si sévérité >= seuil, `AlertProducer` publie un message JMS sur la queue.
5. `AlertConsumer` (async) consomme et appelle `EmailService` pour notifier autorités.
6. Frontend reçoit réponse et rafraîchit la carte.

Points clefs à dire : la notification est asynchrone — l’utilisateur a une réponse rapide même si l’envoi d’email prend du temps.

---

## 4) Interface frontend — responsabilités (45s)

- `lib/api.ts` : client Axios centralisé. Interceptors attachent JWT et gèrent 401.
- Pages : `app/incidents/new` (formulaire), `app/carte` (MapView + polling), `app/dashboard` (widgets indépendants appelant /stats).
- Composants partagés : `MapView`, `SignalerModal`, KPI cards. Ils consomment l’API et rendent l’état.

Conseil : montrez `Navbar` pour prouver distinction rôles (ADMIN badge) et lien `/admin/*` visible seulement aux admin.

---

## 5) Pourquoi c'est un système distribué (45s)

- Composants séparés sur réseau : navigateur ↔ API ↔ DB ↔ broker JMS ↔ services externes (AI, SMTP, SOAP, RMI).
- Découplage temporel : JMS permet d'assumer latence et pannes de l’emailer sans bloquer la transaction principale.
- Scalabilité : API stateless (JWT) facilite horizontal scaling. Les consommateurs JMS peuvent être mis en pool.
- Tolérance aux pannes : fallback IA local, retry/failure handling sur JMS consumer, GlobalExceptionHandler pour réponses cohérentes.

Phrase-clé : « On sépare la transaction utilisateur du traitement secondaire pour réduire le couplage et améliorer la disponibilité. »

---

## 6) Détails middleware (1.5 min) — ce que le jury attend en SDS

Frontend middleware
- `lib/api.ts` (Axios interceptors)
  - Request interceptor : lit `localStorage.urbanops_token` et ajoute `Authorization: Bearer <token>`.
  - Response interceptor : si 401 (et pas login/register), purge token et redirige vers `/auth/signin`.

Backend middleware
- `JwtAuthenticationFilter` (OncePerRequestFilter)
  - Extrait le header `Authorization`, vérifie signature et expiry via `JwtTokenProvider`, charge `UserDetails` et peuple `SecurityContextHolder`.
  - Effet : rend l'identité disponible partout (controllers/services) pour autorisation et audit.

- `SecurityConfig`
  - Déclare routes publiques et protégées, insère le JWT filter avant `UsernamePasswordAuthenticationFilter`, définit `SessionCreationPolicy.STATELESS`.

- `GlobalExceptionHandler` (`@RestControllerAdvice`)
  - Normalise les erreurs (400, 401, 403, 404, 413, 502, 500) en JSON lisible par le frontend.

- `JmsConfig` + `AlertProducer`/`AlertConsumer`
  - `JmsTemplate` convertit objets → JSON texte (MappingJackson2MessageConverter).
  - Producer : `convertAndSend(queue, msg)` (retour immédiat). Consumer : `@JmsListener`, traite et envoie emails.
  - Propriétés clés : concurrency, errorHandler, transaction management possible.

- `SoapConfig`
  - Expose `/soap/*` via `MessageDispatcherServlet`, publie WSDL basé sur `urbanops.xsd` pour intégrations contractuelles.

Autres éléments
- MultipartResolver : gère uploads (max 10MB) ; erreurs remontées via `MaxUploadSizeExceededException`.
- `@Async`/`AsyncConfig` pour tâches non‑bloquantes complémentaires.

---

## 7) Questions pièges & réponses courtes (à réciter)

- Q: "Pourquoi JWT et pas sessions ?" R: Stateless → scalabilité horizontale, pas de session serveur.
- Q: "Que se passe-t-il si l’email échoue ?" R: message JMS reste (ou est retrié/config poison) ; incident est déjà enregistré.
- Q: "REST vs SOAP ?" R: REST = légèreté/interop ; SOAP = contrat strict/WSDL pour partenaires legacy.
- Q: "Comment éviter les doublons d’alerte ?" R: idempotence dans consumer, tokens de message, transaction JMS+DB ou dedupe logique.

---

## 8) Conclusion et ouverture (15s)

UrbanOps illustre bien les principes des systèmes distribués : découplage, asynchronisme, sécurité stateless et interopérabilité. Je peux maintenant détailler n’importe quel composant (sécurité, JMS, AI, ou flux réseau) selon vos questions.

Fin.
