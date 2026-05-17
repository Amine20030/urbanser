# 🌲 ARBORESCENCE COMPLÈTE DU PROJET URBANOPS

Voici l'arborescence brute extraite directement de votre code source, documentée dossier par dossier. Si votre professeur vous demande de lui montrer un fichier spécifique, utilisez cette carte visuelle.

---

## 1. LE FRONTEND (Next.js / React)

Le frontend suit l'architecture moderne `App Router` de Next.js.
```text
C:\UrbanOps\frontend\
+---app\                     <-- Le Routage Web (Chaque dossier ici est une page web)
|   |   globals.css          <-- Styles globaux
|   |   layout.tsx           <-- Le squelette ("Shell") de toutes les pages contenant la Navbar
|   |   page.tsx             <-- La page d'accueil (Landing Page)
|   |   
|   +---auth\                <-- Section d'authentification
|   |   +---signin\          <-- /auth/signin (Page de Connexion - Appelle AuthController)
|   |   |       page.tsx
|   |   \---signup\          <-- /auth/signup (Page d'Inscription)
|   |           page.tsx
|   |           
|   +---carte\               <-- /carte (La Map globale géante)
|   |       page.tsx
|   |       
|   +---dashboard\           <-- /dashboard (Statistiques Citoyen)
|   |       page.tsx
|   |       
|   \---incidents\           <-- /incidents (Liste des signalements publics)
|       |   page.tsx
|       \---[id]\            <-- /incidents/5 (Détail dynamique d'un incident précis)
|
+---components\              <-- Les briques visuelles isolées (Non-routes)
|   +---dashboard\           <-- Ex: IncidentTable.tsx, ServiceCards.tsx
|   +---layout\              <-- Navbar.tsx, Sidebar.tsx
|   +---map\                 <-- IncidentsLeafletMap.tsx (Le composant React-Leaflet gérant la vue Sat)
|   \---shared\              <-- SignalerModal.tsx (La Popup de signalement IA)
|
\---lib\                     <-- Fonctions Utilitaires & APIs
        api.ts               <-- FICHIER CARDINAL: Intercepte le JWT Axios et contacte le Backend REST
        types.ts             <-- Typages TypeScript (Interfaces correspondant aux DTOs Java)
        utils.ts             <-- Fonctions d'aide (ex: getSeverityColor)
```

---

## 2. LE BACKEND (Java Spring Boot / Jakarta)

Le backend respecte l'architecture en couches de l'industrie (N-Tiers / SOA).
```text
C:\UrbanOps\backend\
+---src\
|   +---main\
|   |   +---java\ma\urbanops\
|   |   |   |   UrbanOpsApplication.java       <-- Point d'entrée Spring Boot (Run)
|   |   |   |   
|   |   |   +---config\                        <-- Configurations des Pare-feux & Middlewares
|   |   |   |       CorsConfig.java            <-- Autorise le frontend React à appeler le backend
|   |   |   |       JmsConfig.java             <-- Configure le système de messagerie (ActiveMQ)
|   |   |   |       RmiServerConfig.java       <-- Déploie le registre RMI (rmiregistry) pour l'IA
|   |   |   |       SecurityConfig.java        <-- Définit que /admin nécessite le rôle ADMIN (RBAC)
|   |   |   |       SoapConfig.java            <-- Déploie le Web Service XML WSDL
|   |   |   |       
|   |   |   +---controller\                    <-- Points d'entrée REST (Les APIs HTTP)
|   |   |   |       AdminUserController.java   <-- Gère le CRUD des utilisateurs par l'Administrateur
|   |   |   |       AuthController.java        <-- "/auth/login" -> Vérifie password et donne JWT
|   |   |   |       IncidentController.java    <-- Reçoit le MultipartData pour la création du signalement
|   |   |   |       
|   |   |   +---dto\                           <-- Data Transfer Objects (Les boites postales réseau)
|   |   |   |   +---request\                   <-- Objets reçus du Front (Ex: LoginRequest.java)
|   |   |   |   \---response\                  <-- Objets envoyés au Front (Ex: IncidentResponse.java)
|   |   |   |           
|   |   |   +---entity\                        <-- Mapping ORM (Les Tables de la Base de Données)
|   |   |   |       Incident.java              <-- Table 'incidents' avec colonnes Latitude/Longitude
|   |   |   |       User.java                  <-- Table 'users' 
|   |   |   |       
|   |   |   +---jms\                           <-- Middleware Asynchrone
|   |   |   |       AlertConsumer.java         <-- Écoute passivement les alertes et envoie les emails
|   |   |   |       AlertProducer.java         <-- Pousse l'alerte fraîchement créée dans la Queue
|   |   |   |       
|   |   |   +---repository\                    <-- Les requêtes SQL cachées (Spring Data JPA)
|   |   |   |       IncidentRepository.java    <-- Extends JpaRepository (Génère requêtes findAll, save)
|   |   |   |       
|   |   |   +---rmi\                           <-- Middleware Distribution
|   |   |   |       AIAnalysisRemote.java      <-- L'Interface RMI partagée (Stub)
|   |   |   |       AIAnalysisRemoteImpl.java  <-- L'implémentation distante exécutant le code lourd
|   |   |   |       
|   |   |   +---security\                      <-- Composants techniques du JWT
|   |   |   |       JwtAuthenticationFilter.java <-- Intercepte tout trafic API et décode le token Bearer
|   |   |   |       JwtTokenProvider.java      <-- Forge le Token JWT à la connexion
|   |   |   |       
|   |   |   +---service\                       <-- Le BUSINESS LOGIC LAYER (Le Cerveau)
|   |   |   |       AIAnalysisService.java     <-- Construit le prompt Gemini et traite le Fallback
|   |   |   |       IncidentService.java       <-- Orchestre ! Ex: Crée l'incident -> Demande l'IA -> Sauvegarde Image -> Alerte
|   |   |   |       ScheduledTaskService.java  <-- Exécute des tâches par CRON Jobs
|   |   |   |       
|   |   |   \---soap\                          <-- Middleware Legacy/Gouvernemental
|   |   |           IncidentSoapEndpoint.java  <-- Expose l'API en format XML WSDL
|   |   |                   
|   |   \---resources\
|   |           application.properties         <-- Fichier de paramétrage (Ports, Identifiants DB, URL Gemini)
|   |           data.sql                       <-- Script SQL initialisant les Villes et Catégories au boot
|   |           
|   \---test\                                  <-- Les Tests Unitaires (Qualité Logicielle)
|       \---java\ma\urbanops\
|                   IncidentServiceTest.java
```

---

## 🧭 COMMENT NAVIGUER PENDANT L'EXAMEN ?

**Si le professeur vous dit : *"Montrez-moi comment l'IA est appelée lors de la validation du formulaire."***
*   **Action 1 :** Allez dans le frontend : `components/shared/SignalerModal.tsx`. Montrez le block `handleNext()` qui fait appel à axios (`incidentApi.create(formData)`).
*   **Action 2 :** Allez dans le backend : `controller/IncidentController.java`. Cherchez la méthode `createIncident()` tagguée `@PostMapping`.
*   **Action 3 :** Descendez au Service : Ouvrez `service/IncidentService.java`. Pointez avec votre souris la méthode `createIncident()`, expliquez que ce fichier prend les commandes.
*   **Action 4 :** Montrez l'IA : Ouvrez `service/AIAnalysisService.java` et montrez le bloc `RestTemplate` (la connexion à Gemini) ou l'appel distribué RMI.

**Si le professeur vous dit : *"Montrez-moi comment fonctionne l'authentification et votre système de Token."***
*   **Action 1 :** Ouvrez `controller/AuthController.java` (Méthode `login()`).
*   **Action 2 :** Ouvrez `security/JwtTokenProvider.java` -> Montrez la génération formelle du JWT.
*   **Action 3 :** Ouvrez le pare-feu `config/SecurityConfig.java` et montrez `.requestMatchers("/admin/**").hasRole("ADMIN")`.
*   **Action 4 :** Ouvrez le Frontend `lib/api.ts` et montrez l'intercepteur : `api.interceptors.request.use` qui injecte le token dans le navigateur.
