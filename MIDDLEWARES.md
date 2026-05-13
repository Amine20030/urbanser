# MIDDLEWARES — UrbanOps (détail pour l'oral)

Ce fichier rassemble les middlewares front et back, leur rôle, ordre d'exécution, extraits de code clés, pièges possibles (questions du prof) et réponses courtes à mémoriser.

---

## Règles générales
- "Middleware" = code qui intercepte/transforme une requête ou réponse en-dehors de la logique métier (ex. Axios interceptors, filtres Spring).
- Pour l'examen, sachez: *où* il s'exécute, *quand* (ordre), *ce qu'il modifie*, et *quel effet observable* sur le client ou la DB.

---

## 1) `frontend/lib/api.ts` — Axios interceptors (Client)

- Emplacement: `frontend/lib/api.ts`
- Rôle: centraliser l'HTTP client, attacher JWT, gérer erreurs globales (401 → redirection), logique retry/refresh possible.
- Ordre: Request interceptor (avant envoi), Response interceptor (à la réception).

Comportements clés (pseudocode):

```ts
// Request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/auth/signin'
    }
    return Promise.reject(err)
  }
)
```

Pièges / questions probables & réponses courtes:
- Q: "Que se passe-t-il si le token a expiré ?" — R: l'interceptor reçoit 401, supprime le token et redirige; on peut étendre avec refresh token.
- Q: "Pourquoi utiliser un interceptor et pas ajouter le header manuellement ?" — R: centralisation, moins d'erreurs, possibilité d'ajouter logging/metrics.

Conseil oral: montrez que vous distinguez request vs response interceptors et donnez l'exemple concret du login (token stocké → attaché automatiquement).

---

## 2) `JwtAuthenticationFilter` — validation JWT (Backend)

- Emplacement: `backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java`
- Type: `OncePerRequestFilter` (s'exécute une fois par requête)
- Rôle: extraire `Authorization` header, valider token, créer `Authentication` et remplir `SecurityContext`.
- Position dans la chaîne: inséré via `SecurityConfig.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` — donc avant les contrôleurs.

Extrait clé (pseudocode Java):

```java
String token = extractToken(request);
if (token != null && jwtProvider.validateToken(token)) {
  String userId = jwtProvider.getUserId(token);
  UserDetails user = userDetailsService.loadById(userId);
  UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
  SecurityContextHolder.getContext().setAuthentication(auth);
}
filterChain.doFilter(request, response);
```

Pièges / questions probables & réponses courtes:
- Q: "Que contient le SecurityContext ?" — R: l'objet `Authentication` avec principal (UserDetails), autorisations (roles), et éventuellement credentials=null.
- Q: "Que se passe-t-il si le token est invalide ?" — R: on n'ajoute pas d'Authentication; `SecurityConfig` rejettera si endpoint protégé.
- Q: "Pourquoi `OncePerRequestFilter` ?" — R: garantit exécution unique par requête (pas doublons dans forward/include).

Conseil oral: expliquez que le filtre rend l'utilisateur disponible partout (controllers/services) via `SecurityContextHolder`.

---

## 3) `SecurityConfig` — chaîne de filtres & règles d'autorisation (Backend)

- Emplacement: `backend/src/main/java/ma/urbanops/config/SecurityConfig.java`
- Rôle: définir routes publiques/protégées, ordonnancer filtres, configurer CORS/CSRF et rôle Admin.

Comportements typiques:

```java
http
  .csrf().disable()
  .cors().and()
  .authorizeHttpRequests(auth -> {
    auth.requestMatchers("/api/auth/**").permitAll();
    auth.requestMatchers("/api/users/**").hasRole("ADMIN");
    auth.anyRequest().authenticated();
  })
  .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
```

Pièges / questions probables & réponses courtes:
- Q: "Si `/api/auth/login` est `permitAll`, le filtre JWT est-il ignoré ?" — R: le filtre s'exécute toujours si positionné, mais l'autorisation laisse passer la requête même sans Authentication.
- Q: "Où définir CORS pour autoriser `http://localhost:3000` ?" — R: soit globalement dans `SecurityConfig` via `cors()` (et bean `CorsConfigurationSource`), soit dans `CorsConfig` dédié.

Conseil oral: donnez un exemple d'endpoint public vs admin-only et montrez l'ordre: CORS → JWT filter → authorization rules → controller.

---

## 4) `GlobalExceptionHandler` — gestion centralisée des erreurs (Backend)

- Emplacement: `backend/src/main/java/ma/urbanops/exception/GlobalExceptionHandler.java`
- Rôle: intercepter exceptions (contrôleurs/services) et renvoyer JSON structuré avec code HTTP.

Extrait (pseudocode):

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorDto> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto("Not found", ex.getMessage()));
  }
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDto> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("Server error", ex.getMessage()));
  }
}
```

Pièges / questions probables & réponses courtes:
- Q: "Que renvoie le client si une exception non gérée se produit ?" — R: `GlobalExceptionHandler` capte généralement et renvoie JSON; sinon serveur renverra 500 brut.
- Q: "Pourquoi ne pas lancer l'exception brute ?" — R: fournit UX prévisible pour le frontend et mappe aux statuts HTTP.

Conseil oral: montrez un exemple concret (ID introuvable → 404 JSON) et expliquez où attraper les erreurs côté frontend (response interceptor).

---

## 5) `CorsConfig` (rappels)

- Emplacement: `backend/src/main/java/ma/urbanops/config/CorsConfig.java` ou bean dans `SecurityConfig`.
- Rôle: autoriser origine `http://localhost:3000`, méthodes, en-têtes (Authorization), et autoriser prévol `OPTIONS`.

Piège: si CORS mal configuré, le navigateur bloque avant JWT filter — le prof peut vous demander d'expliquer la différence entre erreur réseau CORS (navigateur) et erreur 401 (serveur).

Réponse courte: CORS est côté client (navigateur) — si bloqué, la requête n'atteint pas le serveur.

---

## 6) JMS / `JmsConfig`, `AlertProducer`, `AlertConsumer` (asynchrone)

- Emplacement: `backend/src/main/java/ma/urbanops/config/JmsConfig.java`, `backend/.../jms/`
- Rôle: configurer broker (ActiveMQ Artemis), destinations; découpler tâches longues (envoi email) de la requête HTTP.

Flux typique:
- `IncidentService` appelle `alertProducer.sendAlert(msg)` → `JmsTemplate.convertAndSend("alertQueue", msg)` (non bloquant)
- `AlertConsumer` annoté `@JmsListener("alertQueue")` consomme plus tard, créé enregistrement `Alert` et appelle `EmailService`.

Piège: Le prof peut demander: "Est-ce transactionnel ?" — réponse: dépend de la config; on peut configurer transactions JMS + DB pour garantir exactly-once ou au moins once.

Conseil oral: expliquez latence perçue réduite, et dites comment gérer les duplications (idempotence, dedupe).

---

## 7) `AsyncConfig` et `@Async`

- Emplacement: `backend/src/main/java/ma/urbanops/config/AsyncConfig.java`
- Rôle: fournir pool de threads pour méthodes `@Async` (ex. envoi d'email non-JMS).

Piège: attention au dimensionnement du pool et aux ressources; pour l'examen, mentionnez `ThreadPoolTaskExecutor` et timeouts.

---

## 8) Multipart / Upload handling (MultipartResolver)

- Rôle: parser `multipart/form-data` pour `MultipartFile`.
- Point important: les limites (`max-file-size`) doivent être configurées; sinon le serveur rejette avant controller.

Piège: le prof peut vous demander où l'erreur apparaît (status code) — généralement 400 ou 500 selon le parsing.

---

## 9) Ordre d'exécution résumé (par requête HTTP protégée)

1. CORS preflight (OPTIONS) — si applicable
2. `CorsFilter` / configuration CORS
3. Servlet filters (ex. logging) — infra
4. `JwtAuthenticationFilter` (extrait token, remplit SecurityContext)
5. `SecurityConfig` authorization checks
6. Spring MVC argument resolvers (MultipartResolver) → Controller
7. Controller → Service (business)
8. Services peuvent appeler `JmsTemplate` ou `@Async`
9. Si exception, `GlobalExceptionHandler` formate la réponse
10. Response retournée → `frontend/lib/api.ts` response interceptor

---

## 10) Deux exemples courts (phrases à apprendre pour l'oral)

- Login: "La requête de login est `permitAll` dans `SecurityConfig`. Le serveur valide les identifiants via `AuthService`, génère un JWT, le frontend le sauvegarde, puis l'interceptor `lib/api.ts` l'ajoute aux requêtes suivantes."

- Create Incident: "Le client envoie un multipart avec `Authorization`. CORS autorise la requête, `JwtAuthenticationFilter` valide le token et peuple `SecurityContext`. Le controller reçoit `MultipartFile`, `IncidentService` sauvegarde l'entité, puis `AlertProducer` queue un message JMS pour notification asynchrone — la requête HTTP retourne rapidement."

---

## 11) Pièges d'examen (liste courte à mémoriser)
- Confondre CORS et 401 : CORS bloque côté navigateur (prévol), 401 est réponse serveur.
- Penser que `permitAll` empêche l'exécution du JWT filter : non, le filtre peut s'exécuter mais l'autorisation permet le passage.
- Oublier que JMS est asynchrone : l'alerte n'est pas forcément dans la DB au moment de la réponse HTTP.
- Confondre `SecurityContext` (thread local) et session server-side : JWT est stateless, SecurityContext est re-créé par requête.

---

## 12) Où lire ces fichiers dans le repo


Si vous voulez, je peux maintenant :

---

## Détail approfondi des middlewares (niveau professeur systèmes distribués)

Cette section explique techniquement *comment* fonctionnent les middlewares clés, *où* ils s'exécutent, *quelles ressources* ils touchent (thread, SecurityContext, transactions), et *quel comportement* on attend sous charge ou panne.

### 1) `frontend/lib/api.ts` — Axios interceptors (détail)
- Emplacement: `frontend/lib/api.ts`.
- Execution: s'exécute dans le thread UI du navigateur avant / après chaque requête HTTP initiée par `api`.
- Request interceptor :
  - Lit `localStorage.getItem('urbanops_token')` (synchrones). Si le token est présent il ajoute `Authorization: Bearer <token>`.
  - Limitation: appels réalisés avec `fetch(...)` contournent cet interceptor — il faut ajouter manuellement l'entête.
  - Race conditions: si plusieurs onglets modifient `localStorage`, utiliser l'événement `storage` pour synchroniser l'état UI.

- Response interceptor :
  - Sur 401, il purge le token (sauf pour les endpoints de login/register) et redirige vers `/auth/signin`.
  - Amélioration possible : implémenter un flow de refresh token qui intercepte le 401, tente `POST /auth/refresh`, rejoue la requête originale si refresh OK (nécessite file d'attente locale des requêtes en attente pour éviter duplications).

### 2) `JwtAuthenticationFilter` (backend) — deep dive
- Emplacement: `backend/src/main/java/ma/urbanops/security/JwtAuthenticationFilter.java`.
- Type: `OncePerRequestFilter` — s'exécute exactement une fois par requête.

- Étapes internes :
  1. Lire header `Authorization`.
  2. Extraire token (strip `Bearer `).
  3. Valider signature et claims (`exp`, éventuellement `aud`/`iss`).
  4. Extraire l'identifiant (`sub` ou `email`).
  5. Charger `UserDetails` via `UserDetailsServiceImpl`.
  6. Créer `UsernamePasswordAuthenticationToken` et `setAuthentication` dans `SecurityContextHolder`.
  7. Continuer la chaîne `filterChain.doFilter(request,response)`.

- Threading & propagation :
  - `SecurityContextHolder` est par défaut un `ThreadLocal`. Si le travail se déporte sur un autre thread (ex. `@Async`), le contexte n'est pas propagé automatiquement — utiliser `DelegatingSecurityContext`.

### 3) `SecurityConfig` — ordering, matchers, method security
- Emplacement: `backend/src/main/java/ma/urbanops/config/SecurityConfig.java`.
- Rôle: construire la `SecurityFilterChain`, définir endpoints `permitAll` ou protégés, insérer `JwtAuthenticationFilter`.

- Points précis :
  - `addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)` place notre filtre avant l'authentification standard.
  - `sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)` pour stateless JWT.
  - `EnableMethodSecurity(prePostEnabled=true)` permet `@PreAuthorize` au niveau méthode.

### 4) `GlobalExceptionHandler` — mapping & bonnes pratiques
- Emplacement: `backend/src/main/java/ma/urbanops/exception/GlobalExceptionHandler.java`.
- Rôle: transformer exceptions Java en réponses HTTP JSON prévisibles.

- Bonnes pratiques :
  - Ne pas exposer stacktraces en production.
  - Mapper erreurs métier → codes HTTP corrects (ex: 404, 401, 403, 400, 413, 502, 500).

### 5) JMS — transactional behaviour, DLQ, idempotence
- Emplacement: `backend/src/main/java/ma/urbanops/jms` et `JmsConfig.java`.

- Concepts clés :
  - `jmsTemplate.convertAndSend()` → at-least-once delivery sauf configuration transactionnelle.
  - Pour exactly-once (rare en pratique) configurer transaction JMS+DB (XA) ou utiliser logique idempotence côté consumer.
  - Configurer DLQ/poison queue pour messages qui échouent N fois.

### 6) SOAP integration
- `SoapConfig` expose `/soap/*`, génère WSDL basé sur `urbanops.xsd`.
- Usage: contrats stricts pour partenaires legacy, validation XSD à l'entrée.

### 7) CORS & préflight
- `cors.allowed-origins` doit inclure l'origine du frontend pour éviter échecs de préflight.
- Préflight OPTIONS ne contiennent pas d'Authorization ; le serveur doit autoriser `Access-Control-Allow-Headers: Authorization`.

### 8) Multipart / Upload
- Config: `spring.servlet.multipart.max-file-size` et `max-request-size`.
- Erreur `MaxUploadSizeExceededException` → gérée par `GlobalExceptionHandler` (413).

### 9) Phrases prêtes et réponses courtes (à réciter)
- "Le JWT est ajouté côté client par un interceptor Axios et validé côté serveur par `JwtAuthenticationFilter`, qui peuple `SecurityContextHolder` pour la durée de la requête." 
- "Les alertes sont publish/subscribe via JMS pour découpler le traitement asynchrone (email) de la transaction utilisateur." 

---

Cette section approfondie complète la fiche — dites si vous voulez que j'intègre quelques diagrammes spécifiques (séquence filter → controller → JMS) ou une version très courte 90s pour révision rapide.

---

## Annexes : extraits réels et diagramme

Ci-dessous j'inclus des extraits réels des fichiers importants (interceptors, filtres, JMS, SOAP) trouvés dans le projet, puis un diagramme Mermaid résumant REST/JMS/SOAP/RMI.

### Extrait — `frontend/lib/api.ts` (interceptors)

```ts
// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('urbanops_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — do not redirect on failed login/register (those return 401 too)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url ?? '');
      const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthAttempt && typeof window !== 'undefined') {
        localStorage.removeItem('urbanops_token');
        localStorage.removeItem('urbanops_user');
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);
```

### Extrait — `JwtAuthenticationFilter.java`

```java
protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
    try {
        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String username = tokenProvider.getUsernameFromJWT(jwt);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    } catch (Exception ex) {
        log.error("Could not set user authentication in security context", ex);
    }

    filterChain.doFilter(request, response);
}
```

### Extrait — `SecurityConfig.java` (règles et insertion du filtre)

```java
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
.authorizeHttpRequests(auth -> auth
        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
        .requestMatchers(HttpMethod.POST, "/auth/register", "/auth/login").permitAll()
        .requestMatchers(HttpMethod.GET, "/stats/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/incidents/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/incidents").permitAll()
        .requestMatchers("/users/**").hasRole("ADMIN")
        .anyRequest().authenticated()
)
```

### Extrait — `GlobalExceptionHandler.java` (gestion d'erreurs représentative)

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
        ResourceNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getRequestURI()
    );
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
}

@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleGlobalException(
        Exception ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred",
            request.getRequestURI()
    );
    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

### Extrait — `AlertProducer.java` (JMS producer)

```java
public void sendAlertToQueue(Incident incident) {
    try {
        AlertMessage message = AlertMessage.builder()
                .incidentId(incident.getId())
                .referenceCode(incident.getReferenceCode())
                .title(incident.getTitle())
                // ... other fields
                .build();

        jmsTemplate.convertAndSend(alertQueue, message);
        log.info("[JMS PRODUCER] Alert message sent to queue '{}' for incident {}",
                alertQueue, incident.getReferenceCode());

    } catch (Exception e) {
        log.error("[JMS PRODUCER] Failed to send to queue, incident saved anyway: {}",
                e.getMessage());
    }
}
```

### Extrait — `AlertConsumer.java` (JMS consumer)

```java
@JmsListener(destination = "${jms.queue.alert}",
        containerFactory = "jmsListenerContainerFactory")
public void receiveAlert(AlertMessage message) {
    log.info("[JMS CONSUMER] Received alert from queue for incident {}",
            message.getReferenceCode());

    try {
        emailService.sendAlertEmailFromJms(
                message.getAuthorityEmail(),
                message.getAuthorityName(),
                message.getReferenceCode(),
                message.getTitle(),
                message.getDescription(),
                message.getSeverity(),
                message.getCategory(),
                message.getSector(),
                message.getLatitude(),
                message.getLongitude()
        );
    } catch (Exception e) {
        log.error("[JMS CONSUMER] Failed to send email for {}: {}",
                message.getReferenceCode(), e.getMessage());
    }
}
```

### Extrait — `JmsConfig.java` (conversion JSON <-> JMS)

```java
@Bean
public MessageConverter jacksonJmsMessageConverter() {
    MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
    converter.setTargetType(MessageType.TEXT);
    converter.setTypeIdPropertyName("_type");
    return converter;
}

@Bean
public JmsTemplate jmsTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
    JmsTemplate template = new JmsTemplate(connectionFactory);
    template.setMessageConverter(messageConverter);
    return template;
}
```

### Extrait — `SoapConfig.java` (exposition SOAP via Spring-WS)

```java
@EnableWs
@Configuration
public class SoapConfig extends WsConfigurerAdapter {
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean<>(servlet, "/soap/*");
    }

    @Bean(name = "urbanops")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema urbanopsSchema) {
        DefaultWsdl11Definition wsdl = new DefaultWsdl11Definition();
        wsdl.setPortTypeName("UrbanOpsPort");
        wsdl.setLocationUri("/soap");
        wsdl.setTargetNamespace("http://urbanops.ma/soap");
        wsdl.setSchema(urbanopsSchema);
        return wsdl;
    }
}
```

### Extrait — `urbanops.xsd` (schéma SOAP)

```xml
<xs:element name="getIncidentStatsRequest">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="sector" type="xs:string" minOccurs="0"/>
            <xs:element name="category" type="xs:string" minOccurs="0"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

> Note: `RmiConfig.java` n'a pas été trouvé dans `backend/src/main/java/ma/urbanops/config/` — si vous voulez l'extrait RMI, indiquez où il se trouve ou je chercherai d'autres fichiers liés.

### Diagramme Mermaid (REST / JMS / SOAP / RMI overview)

```mermaid
flowchart LR
  subgraph FE [Frontend]
    A[User action]\n(Signin/Create/Map)
    B[lib/api.ts - Axios interceptors]
  end

  subgraph BE [Backend - Spring Boot]
    C[JwtAuthenticationFilter]
    D[SecurityConfig]
    E[Controllers]
    F[Services]
    G[Repositories]
    H[JMS Queue (ActiveMQ)]
    I[SOAP endpoint (/soap)]
    J[RMI service? (not found)]
  end

  A --> B -->|HTTP/JSON or multipart| E
  E --> F --> G
  F -->|sendAlertToQueue| H
  H -->|@JmsListener| F
  B -- attach JWT --> C
  C --> D --> E
  F -->|call SOAP client| I
  F -->|call RMI stub (if present)| J
```

---

Fait: j'ai inclus les extraits réels trouvés et un diagramme Mermaid résumé. Voulez-vous que j'ajoute aussi une courte fiche mémo (30s) au début du fichier pour l'oral ?
Dites-moi quelle option vous préférez.