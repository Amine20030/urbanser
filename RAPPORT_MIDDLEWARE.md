# Rapport Middleware — UrbanOps
## Systèmes Distribués | Contrôle de démonstration

---

## 1. RÉCAPITULATIF DES 4 MIDDLEWARE

| # | Middleware | Protocole | Port | URL de test | Statut |
|---|-----------|-----------|------|-------------|--------|
| 1 | REST | HTTP/JSON | 8080 | http://localhost:8080/api/v1/incidents | ✅ |
| 2 | JMS | AMQP/ActiveMQ | embedded | http://localhost:8080/api/v1/stats/jms/status | ✅ |
| 3 | RMI | Java RMI | 1099 | rmi://localhost:1099/AIAnalysisService | ✅ |
| 4 | SOAP | HTTP/XML | 8080 | http://localhost:8080/api/v1/soap/urbanops.wsdl | ✅ |

---

## 2. MIDDLEWARE 1 — REST API

### Définition
REST (Representational State Transfer) est un style architectural pour les
services web. Il utilise les méthodes HTTP (GET, POST, PUT, PATCH, DELETE)
pour manipuler des ressources identifiées par des URLs. Les données sont
échangées en format JSON.

### Comment ça marche dans UrbanOps
```
Citoyen (navigateur)
    │
    │ HTTP POST /api/v1/incidents
    │ Content-Type: multipart/form-data
    │ Authorization: Bearer eyJhbGci...
    │
    ▼
IncidentController.java
    │ @PostMapping("/incidents")
    │ @Valid IncidentRequest + MultipartFile
    │
    ▼
IncidentService.createIncident()
    │
    ▼
PostgreSQL (incidents table)
    │
    ▼
HTTP 201 Created + IncidentResponse JSON
    │
    ▼
Frontend affiche le résultat IA
```

### Fichiers impliqués
```
backend/src/main/java/ma/urbanops/
├── controller/IncidentController.java    ← @RestController, mappings
├── controller/AuthController.java        ← login, register
├── controller/StatsController.java       ← dashboard stats
├── controller/AlertController.java       ← alertes admin
├── controller/UserController.java        ← gestion utilisateurs
├── controller/CategoryController.java    ← catégories
├── controller/SectorController.java      ← secteurs
├── config/SecurityConfig.java            ← règles d'accès JWT
└── security/JwtTokenProvider.java        ← génération/validation JWT
```

### Endpoints principaux
```
POST   /api/v1/auth/login                 → Authentification → JWT token
POST   /api/v1/auth/register              → Inscription citoyen
POST   /api/v1/incidents                  → Créer incident (multipart)
GET    /api/v1/incidents                  → Liste paginée avec filtres
GET    /api/v1/incidents/map              → Données légères pour la carte
GET    /api/v1/incidents/recent           → 10 plus récents
GET    /api/v1/stats/dashboard            → Statistiques tableau de bord
GET    /api/v1/alerts                     → Alertes (ADMIN only)
PATCH  /api/v1/incidents/{id}/status      → Changer statut (ADMIN)
```

### Test devant le professeur — Swagger UI
```
1. Ouvrir: http://localhost:8080/api/v1/swagger-ui/index.html
2. Cliquer sur "auth-controller" → POST /auth/login
3. Cliquer "Try it out"
4. Body:
   {
     "email": "admin@urbanops.ma",
     "password": "Admin@1234"
   }
5. Cliquer Execute
6. Copier le token JWT de la réponse (champ "token")
7. Cliquer le bouton vert "Authorize 🔒" en haut
8. Entrer: Bearer [votre token]
9. Maintenant tester: GET /incidents → voir la liste JSON
10. Montrer: POST /incidents avec une photo
```

### Test alternatif — cURL
```bash
# Login et récupérer le token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@urbanops.ma","password":"Admin@1234"}'

# Réponse: {"token":"eyJhbGci...","user":{...}}
# Copier le token et tester un endpoint protégé:
curl http://localhost:8080/api/v1/incidents \
  -H "Authorization: Bearer eyJhbGci..."
```

### Ce que vous dites au prof
> "REST est le middleware principal d'UrbanOps. Toute la communication
> frontend-backend passe par REST. Les données sont échangées en JSON,
> les ressources sont identifiées par URLs sémantiques (/incidents, /alerts),
> et la sécurité est assurée par JWT Bearer token. Swagger UI génère
> automatiquement la documentation interactive depuis les annotations @Operation."

---

## 3. MIDDLEWARE 2 — JMS (Java Message Service)

### Définition
JMS est une API Java pour la messagerie asynchrone entre applications.
Un **Producer** envoie des messages dans une **Queue** (file d'attente).
Un **Consumer** reçoit et traite les messages de manière asynchrone.
Le broker de messages (ici ActiveMQ Artemis) stocke les messages temporairement.

### Comment ça marche dans UrbanOps
```
POST /api/v1/incidents
    │
    ▼
IncidentService.createIncident()
    │ ← incident sauvé en DB (rapide)
    │
    ▼
AlertProducer.sendAlertToQueue(incident)
    │ jmsTemplate.convertAndSend("urbanops.alert.queue", alertMessage)
    │
    ▼
[ActiveMQ Artemis Queue: urbanops.alert.queue]
    │ ← message stocké dans la file
    │
    ▼ (asynchrone — dans un thread séparé)
AlertConsumer.receiveAlert(AlertMessage)
    │ @JmsListener(destination="urbanops.alert.queue")
    │
    ▼
EmailService.sendAlertEmailFromJms(...)
    │ Envoi email à l'autorité (ONEE, Police, RADEEMA...)
    ▼
API retourne 201 Created immédiatement
(sans attendre l'email)
```

### Pourquoi JMS et pas @Async direct ?
- **@Async** : le thread reste lié au serveur. Si le serveur redémarre, le mail est perdu.
- **JMS** : le message est dans la queue. Si le serveur redémarre, le message reste. C'est de la **persistance**.
- **Résilience** : si le serveur SMTP est lent (30 secondes), le thread API n'est pas bloqué.

### Fichiers impliqués
```
backend/src/main/java/ma/urbanops/
├── jms/AlertProducer.java              ← @Component, envoie dans la queue
├── jms/AlertConsumer.java              ← @JmsListener, reçoit et traite
├── dto/jms/AlertMessage.java           ← DTO sérialisé en JSON dans la queue
├── config/JmsConfig.java               ← Configuration MessageConverter + Factory
└── service/EmailService.java           ← sendAlertEmailFromJms() appelé par Consumer

backend/src/main/resources/
└── application.properties:
    spring.artemis.mode=embedded
    spring.artemis.embedded.enabled=true
    jms.queue.alert=urbanops.alert.queue
```

### Test devant le professeur

**Méthode 1 — Via Swagger UI (le plus impressionnant) :**
```
1. Ouvrir Swagger: http://localhost:8080/api/v1/swagger-ui/index.html
2. S'authentifier (comme expliqué dans REST ci-dessus)
3. Aller à "incident-controller" → POST /incidents
4. Cliquer "Try it out"
5. Remplir le formulaire multipart:
   incident: {"title":"Test JMS","description":"câble électrique exposé","categoryId":5,"sectorId":2,"latitude":31.6347,"longitude":-8.0083}
6. Cliquer Execute → 201 Created
7. IMMÉDIATEMENT regarder les logs Spring Boot dans le terminal:
   [JMS PRODUCER] Alert message sent to queue 'urbanops.alert.queue' for incident INC-XXXX
   [JMS CONSUMER] Received alert from queue for incident INC-XXXX
   [EMAIL] Send attempted to: urgences.elec@onee.ma
```

**Méthode 2 — Via l'endpoint de status :**
```bash
curl http://localhost:8080/api/v1/stats/jms/status
# Réponse:
{
  "broker": "ActiveMQ Artemis (embedded)",
  "queue": "urbanops.alert.queue",
  "status": "active",
  "description": "Asynchronous alert queue — incidents trigger JMS messages"
}
```

**Méthode 3 — Via Postman :**
```
POST http://localhost:8080/api/v1/incidents
Headers: Authorization: Bearer [token]
Body: form-data
  incident (text): {"title":"Test","description":"fuite eau","categoryId":2,"sectorId":1,"latitude":31.63,"longitude":-8.01}
```

### Ce que vous dites au prof
> "JMS est utilisé pour le système d'alertes. Quand un incident est créé,
> AlertProducer envoie un message JSON dans la queue ActiveMQ Artemis.
> AlertConsumer écoute la queue avec @JmsListener et envoie l'email à
> l'autorité compétente de manière asynchrone. L'API répond en 201 immédiatement
> sans attendre l'email. Si le serveur SMTP est indisponible, le message
> reste dans la queue et peut être retraité. C'est le pattern Producer/Consumer
> classique des systèmes distribués."

---

## 4. MIDDLEWARE 3 — RMI (Remote Method Invocation)

### Définition
RMI permet à un objet Java d'appeler des méthodes sur un objet situé dans
une autre JVM (machine virtuelle Java), potentiellement sur une machine distante.
Le code appelant ne sait pas que la méthode est distante — ça ressemble à
un appel local. Le RMI Registry (annuaire) permet de trouver le service par nom.

### Comment ça marche dans UrbanOps
```
RmiClientDemo.java (JVM cliente)
    │
    │ 1. Connexion au registre RMI
    │    Registry registry = LocateRegistry.getRegistry("localhost", 1099)
    │
    │ 2. Lookup du service par nom
    │    AIAnalysisRemote remote = registry.lookup("AIAnalysisService")
    │
    │ 3. Appel de méthode distante (transparence)
    │    String result = remote.classifyIncident("câble exposé", "Électricité")
    │
    ▼ [Réseau TCP port 1099 — sérialisation Java]
    │
Spring Boot JVM (serveur)
    │
    ▼
AIAnalysisRemoteImpl.classifyIncident()
    │ extends UnicastRemoteObject
    │ délègue à AIAnalysisService (Gemini API)
    │
    ▼
Résultat JSON retourné à la JVM cliente:
{"category":"Électricité","severity":"HIGH","authority":"ONEE","confidence":0.94}
```

### Fichiers impliqués
```
backend/src/main/java/ma/urbanops/
├── rmi/AIAnalysisRemote.java           ← Interface Remote (extends java.rmi.Remote)
├── rmi/AIAnalysisRemoteImpl.java       ← Implémentation (extends UnicastRemoteObject)
├── rmi/RmiClientDemo.java              ← Client de démonstration (main method)
└── config/RmiServerConfig.java         ← @PostConstruct → crée registry port 1099

Logs au démarrage de Spring Boot:
[RMI] Registry created on port 1099
[RMI] AIAnalysisService bound to registry — accessible at rmi://localhost:1099/AIAnalysisService
```

### Test devant le professeur

**Méthode principale — RmiClientDemo :**
```bash
# Terminal 1: Spring Boot doit être démarré
mvn spring-boot:run

# Terminal 2: Exécuter le client RMI
cd backend
java -cp target/classes ma.urbanops.rmi.RmiClientDemo

# Sortie attendue:
=== UrbanOps RMI Client Demo ===
Ping: OK — UrbanOps RMI AI Service running
Classification 1: {"category":"Électricité","severity":"HIGH","authority":"ONEE Marrakech","confidence":0.92,"fallback":false}
Classification 2: {"category":"Transport","severity":"MEDIUM","authority":"Police Circulation","confidence":0.87,"fallback":false}
Severity: HIGH
=== RMI Demo Complete ===
```

**Méthode 2 — Via Swagger (status uniquement) :**
```
GET http://localhost:8080/api/v1/stats/rmi/status
Réponse:
{
  "service": "AIAnalysisService",
  "protocol": "RMI (Java Remote Method Invocation)",
  "url": "rmi://localhost:1099/AIAnalysisService",
  "methods": ["classifyIncident(description, categoryHint)", "getSeverity(description)", "ping()"]
}
```

### Ce que vous dites au prof
> "RMI expose le service d'analyse IA comme un service distant. L'interface
> AIAnalysisRemote étend java.rmi.Remote — toute méthode déclare throws RemoteException.
> L'implémentation AIAnalysisRemoteImpl étend UnicastRemoteObject et est exportée
> sur le port 1099 via RmiServerConfig. RmiClientDemo prouve qu'on peut appeler
> classifyIncident() depuis une JVM externe, comme si c'était un appel local.
> La sérialisation Java transporte les paramètres et le résultat sur le réseau."

---

## 5. MIDDLEWARE 4 — SOAP (Simple Object Access Protocol)

### Définition
SOAP est un protocole de communication basé sur XML. Contrairement à REST
(flexible), SOAP utilise un contrat formel WSDL (Web Services Description Language)
qui décrit exactement les opérations, les types de données et les messages.
Spring-WS génère automatiquement le WSDL depuis un schéma XSD.

### Comment ça marche dans UrbanOps
```
Client SOAP (navigateur, Postman, SoapUI)
    │
    │ HTTP POST /api/v1/soap
    │ Content-Type: text/xml
    │ Body: enveloppe SOAP XML
    │
    ▼
MessageDispatcherServlet (Spring-WS sur /soap/*)
    │
    ▼
IncidentSoapEndpoint.java
    │ @PayloadRoot(namespace, localPart)
    │
    ├─ getIncidentStats() → StatsService.getDashboard()
    └─ getIncidentByReference() → IncidentRepository.findByReferenceCode()
    │
    ▼
Réponse XML SOAP:
<soapenv:Envelope>
  <soapenv:Body>
    <tns:getIncidentStatsResponse>
      <tns:totalIncidents>36</tns:totalIncidents>
      <tns:openIncidents>15</tns:openIncidents>
      <tns:resolutionRate>84.5</tns:resolutionRate>
    </tns:getIncidentStatsResponse>
  </soapenv:Body>
</soapenv:Envelope>
```

### Fichiers impliqués
```
backend/src/main/java/ma/urbanops/
├── soap/IncidentSoapEndpoint.java      ← @Endpoint, 2 opérations SOAP
└── config/SoapConfig.java              ← MessageDispatcherServlet + WSDL bean

backend/src/main/resources/
└── urbanops.xsd                        ← Schéma XSD des types SOAP

WSDL auto-généré:
http://localhost:8080/api/v1/soap/urbanops.wsdl

Opérations exposées:
1. getIncidentStats(sector?, category?) → statistiques
2. getIncidentByReference(referenceCode) → détail incident
```

### Test devant le professeur

**Méthode 1 — WSDL dans le navigateur :**
```
Ouvrir: http://localhost:8080/api/v1/soap/urbanops.wsdl
→ Le navigateur affiche le XML WSDL complet
→ Montrer: portType, binding, operations, types XSD
```

**Méthode 2 — Via Postman (le plus visuel) :**
```
URL: POST http://localhost:8080/api/v1/soap
Headers:
  Content-Type: text/xml
  SOAPAction: ""

Body (raw XML):
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="http://urbanops.ma/soap">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:getIncidentStatsRequest>
      <tns:sector>Guéliz</tns:sector>
    </tns:getIncidentStatsRequest>
  </soapenv:Body>
</soapenv:Envelope>

→ Réponse XML avec totalIncidents, openIncidents, resolutionRate
```

**Méthode 3 — cURL depuis le terminal :**
```bash
# Test getIncidentStats
curl -X POST http://localhost:8080/api/v1/soap \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: ''" \
  -d '<?xml version="1.0"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="http://urbanops.ma/soap">
  <soapenv:Body>
    <tns:getIncidentStatsRequest/>
  </soapenv:Body>
</soapenv:Envelope>'

# Test getIncidentByReference
curl -X POST http://localhost:8080/api/v1/soap \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="http://urbanops.ma/soap">
  <soapenv:Body>
    <tns:getIncidentByReferenceRequest>
      <tns:referenceCode>INC-0001</tns:referenceCode>
    </tns:getIncidentByReferenceRequest>
  </soapenv:Body>
</soapenv:Envelope>'
```

### Ce que vous dites au prof
> "SOAP expose un service de reporting via Spring-WS. Le contrat est défini
> dans urbanops.xsd — le WSDL est généré automatiquement. L'endpoint
> IncidentSoapEndpoint expose deux opérations : getIncidentStats retourne
> les statistiques globales, getIncidentByReference retourne le détail
> d'un incident par son code INC-XXXX. Contrairement à REST qui est flexible,
> SOAP impose un contrat strict XML que tous les consommateurs doivent respecter.
> C'est utilisé dans les systèmes gouvernementaux ou municipaux."

---

## 6. CHECKLIST DE DÉMONSTRATION (ordre recommandé)

```
AVANT LE CONTRÔLE:
□ mvn spring-boot:run → vérifier "Started UrbanOpsApplication"
□ Vérifier logs RMI: "[RMI] AIAnalysisService bound to registry"
□ Vérifier logs JMS: "[JMS] Consumer ready"
□ Ouvrir browser: http://localhost:8080/api/v1/swagger-ui/index.html
□ Ouvrir Postman (ou garder cURL prêt)
□ Ouvrir terminal 2 pour RmiClientDemo

ORDRE DE DÉMO (5-7 minutes):

1. REST (2 min):
   → Swagger UI: login → copier token → Authorize
   → GET /incidents → montrer JSON
   → Dire: "40+ endpoints, JWT, Spring Boot"

2. JMS (1.5 min):
   → POST /incidents via Swagger
   → Montrer les logs terminal: [JMS PRODUCER] puis [JMS CONSUMER]
   → GET /stats/jms/status → montrer JSON status
   → Dire: "ActiveMQ Artemis embedded, Producer/Consumer, asynchrone"

3. RMI (1.5 min):
   → Terminal 2: java -cp target/classes ma.urbanops.rmi.RmiClientDemo
   → Montrer la sortie: classification JSON retournée
   → Dire: "port 1099, AIAnalysisRemote extends Remote, UnicastRemoteObject"

4. SOAP (1 min):
   → Browser: http://localhost:8080/api/v1/soap/urbanops.wsdl → montrer le XML
   → Postman: POST /soap avec body XML → montrer réponse XML
   → Dire: "Spring-WS, WSDL auto-généré depuis XSD, contrat formel"
```
