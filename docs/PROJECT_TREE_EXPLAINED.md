# 🌳 ARBORESCENCE & CARTOGRAPHIE DU PROJET URBANOPS

**Objectif de ce document :** Si le professeur vous demande lors de la soutenance : *"Où sont vos contrôleurs ?"* ou *"Où se trouve la logique métier de l'IA ?"*, ce guide vous permettra de naviguer instantanément dans le projet et d'expliquer le rôle exact de chaque dossier et fichier.

---

## 🏛️ VUE GÉNÉRALE DU PROJET
Le projet est séparé en deux grands dossiers à la racine :
1. **`backend/`** : Contient l'API Java Spring Boot. C'est le moteur de l'application.
2. **`frontend/`** : Contient l'interface client en React / Next.js. C'est le visage de l'application.

---

## ☕ 1. LE BACKEND (Chemin : `backend/src/main/java/ma/urbanops/`)
C'est ici que réside votre architecture en couches (N-Tiers). 

### 🟢 Couche 1 : Les Contrôleurs (`/controller`)
*   **Où chercher :** `backend/.../controller/`
*   **Rôle :** C'est la "porte d'entrée" Web du Backend. Ce sont eux qui interceptent les requêtes HTTP (Issues du frontend Axios) via des URLs.
*   **Fichiers importants :**
    *   `IncidentController.java` : Reçoit les requêtes liées aux incidents (création, mise à jour du statut). **Il communique immédiatement avec `IncidentService`.**
    *   `AuthController.java` : Connecte l'utilisateur et délivre le JWT. Communique avec `UserService` et `JwtTokenProvider`.
*   **Que dire au prof :** *"Toute cette couche n'a pour seul but que de valider la requête entrante et de la passer immédiatement à la couche Service. Il n'y a AUCUNE logique stricte ici, juste du routage."*

### 🟡 Couche 2 : Les Services (`/service`)
*   **Où chercher :** `backend/.../service/`
*   **Rôle :** C'est le Cerveau (Le *Business Logic Layer*). C'est ici que toute la puissance algorithmique se passe.
*   **Fichiers importants :**
    *   `IncidentService.java` : Orchestre la création de l'incident. C'est lui qui demande à `FileStorageService` de sauvegarder l'image, à `AIAnalysisService` d'analyser le texte, et à `AlertService` de déclencher le système JMS.
    *   `AIAnalysisService.java` : Formule la requête JSON et l'envoie à l'API Google Gemini.
*   **Que dire au prof :** *"Le contrôleur délègue la tâche au Service. Le Service orchestre les algorithmes, puis utilise le Repository pour sauvegarder le résultat final."*

### 🔵 Couche 3 : Les Repositories (`/repository`)
*   **Où chercher :** `backend/.../repository/`
*   **Rôle :** C'est la couche d'accès aux données (Data Access Layer). Fini les requêtes SQL (SELECT, UPDATE) écrites à la main.
*   **Fichiers importants :**
    *   `IncidentRepository.java`, `UserRepository.java`, etc. (Des interfaces *Spring Data JPA*).
*   **Que dire au prof :** *"Ces interfaces communiquent directement avec Hibernate. Hibernate traduit les méthodes Java (ex: `findById`) en véritables requêtes SQL vers notre base de données."*

### 🟣 Les Entités & Objets Métiers (`/entity` et `/dto`)
*   **Où chercher :** `backend/.../entity/` et `backend/.../dto/`
*   **Rôle :**
    *   **Entity** (`User.java`, `Incident.java`) : Ce sont les tables de la base de données mappées en Java. Une Entity ne doit jamais sortir du backend !
    *   **DTO** (`IncidentResponse.java`, `LoginRequest.java`) : (*Data Transfer Object*). Ce sont les boîtes postales. On charge l'Entity dans un DTO allégé, et on envoie le DTO au frontend (JSON).
*   **Que dire au prof :** *"Je sépare les Entities des DTOs pour une raison de sécurité et de performances. Je ne veux pas transmettre tout un utilisateur avec son mot de passe au réseau, je crée donc un DTO vide que je remplis avec juste son nom et son rôle."*

### ⚙️ Sécurité & Conf (`/security` et `/config`)
*   **Où chercher :** `backend/.../config/SecurityConfig.java`
*   **Rôle :** Configure le pare-feu du serveur. 
*   **Que dire au prof :** *"Ce fichier agit comme un douanier. Il lit les requêtes. Si une adresse commence par `/admin`, il vérifie que le JWT possède le rôle ADMIN, sinon il rejette l'accès."*

### 📦 La complexité des Middlewares
*   `jms/AlertProducer.java` : Appelé par le *Service* pour envoyer une alerte dans une file d'attente (Asynchronisme).
*   `rmi/AIAnalysisRemoteImpl.java` : Un objet contenant l'IA, logeant sur un registre séparé.
*   `soap/IncidentSoapEndpoint.java` : Appelé par des ministères (clients extérieurs) avec des fichiers XML (WSDL) plutôt que du JSON.

---

## 🎨 2. LE FRONTEND (Chemin : `frontend/`)
Il est basé sur **Next.js (App Router)** et interagit avec le Spring Boot.

### 🛣️ Les Pages (`app/`)
*   **Où chercher :** `frontend/app/`
*   **Rôle :** Gère le l'URL du navigateur. Si le citoyen interroge `monSite.com/auth/login`, il tombe sur le fichier `app/auth/login/page.tsx`.
*   **Fichiers importants :**
    *   `app/admin/incidents/page.tsx` : Le tableau de bord Admin listant tous les incidents.
*   **Que dire au prof :** *"J'utilise le routage par dossier de Next.js. Une sous-page correspond physiquement à un dossier."*

### 🧩 Les Composants Visuels (`components/`)
*   **Où chercher :** `frontend/components/`
*   **Rôle :** Des morceaux d'interface réutilisables (Boutons isolés, Formulaires, Modales, la Carte).
*   **Fichiers importants :**
    *   `shared/SignalerModal.tsx` : La grosse modale complète où l'utilisateur signale son problème.
    *   `map/IncidentsLeafletMap.tsx` : Le composant qui dessine la carte avec React-Leaflet.
*   **Que dire au prof :** *"Au lieu de tout coder dans la page, je découple mon code en petits composants React. `SignalerModal` communique avec `api.ts` pour poster la photo et les textes au backend."*

### 🔌 La Communication API (`lib/`)
*   **Où chercher :** `frontend/lib/api.ts`
*   **Rôle :** Le pont central vers le serveur Java.
*   **Fichiers importants :**
    *   `api.ts` : Utilise Axios. Gère l'intercepteur HTTP (Ligne 13) qui récupère le JWT sauvegardé dans le navigateur, et le "colle" automatiquement sur toutes les requêtes dirigées vers `localhost:8080` (Le Java).
*   **Que dire au prof :** *"Ce fichier est stratégique. C'est le seul et unique point de contact avec le backend. Si le serveur Java change d'adresse ou de version d'API pour passer en v2, je n'ai qu'une seule variable à changer ici, et tout le projet s'adapte immédiatement."*
