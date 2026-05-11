# Guide d'Installation Complet — UrbanOps

> **Smart Urban Supervision Platform** — Projet Full-Stack Spring Boot + Next.js

---

## 📋 Table des Matières

1. [Phase 0 — Prérequis](#phase-0--prérequis)
2. [Phase 1 — PostgreSQL](#phase-1--postgresql)
3. [Phase 2 — Configuration du Projet](#phase-2--configuration-du-projet)
4. [Phase 3 — Lancer le Backend](#phase-3--lancer-le-backend)
5. [Phase 4 — Lancer le Frontend](#phase-4--lancer-le-frontend)
6. [Phase 5 — Tester le Système](#phase-5--tester-le-système)
7. [Phase 6 — Tests et JaCoCo](#phase-6--tests-et-jacoco)
8. [Phase 7 — Problèmes Courants](#phase-7--problèmes-courants)
9. [Phase 8 — Checklist Finale](#phase-8--checklist-finale)

---

## Phase 0 — Prérequis

### Étape 0.1 — Installer Java 17 (JDK)

**Quoi faire :** Installer le kit de développement Java

**Où cliquer :**
```
→ Ouvrir votre navigateur
→ Aller à : https://www.oracle.com/java/technologies/downloads/#java17
→ Sous l'onglet "Java 17", cliquer sur l'onglet de votre OS (Windows / macOS / Linux)
→ Windows : cliquer sur le lien ".exe" (exemple : jdk-17_windows-x64_bin.exe)
→ Exécuter l'installateur → Next → Next → Install → Close
```

**Vérification :**
```
→ Touche Windows → taper "cmd" → Entrée
→ Dans le terminal noir, taper :
  java -version

✅ Ce que vous devez voir :
  java version "17.0.x" 2024-xx-xx LTS
  Java(TM) SE Runtime Environment (build 17.0.x+xx-LTS-xxx)
  Java HotSpot(TM) 64-Bit Server VM (build 17.0.x+xx-LTS-xxx, mixed mode, sharing)
```

**❌ Si erreur "java is not recognized" :**
```
→ Panneau de configuration → Système → Paramètres système avancés
→ Variables d'environnement → Nouvelle (système)
→ Nom : JAVA_HOME
→ Valeur : C:\Program Files\Java\jdk-17
→ OK → OK → OK
→ Redémarrer le terminal cmd
→ Retester : java -version
```

---

### Étape 0.2 — Installer Maven 3.8+

**Quoi faire :** Installer l'outil de build Java

**Où cliquer :**
```
→ Aller à : https://maven.apache.org/download.cgi
→ Sous "Binary zip archive", cliquer sur apache-maven-3.9.x-bin.zip
→ Extraire dans : C:\Program Files\Maven\
→ Vous devez avoir : C:\Program Files\Maven\apache-maven-3.9.x\
```

**Configurer le PATH :**
```
→ Panneau de configuration → Système → Paramètres système avancés
→ Variables d'environnement → Path (système) → Modifier
→ Nouveau → C:\Program Files\Maven\apache-maven-3.9.x\bin
→ OK → OK → OK
→ FERMER et rouvrir le terminal
```

**Vérification :**
```
→ Dans cmd, taper :
  mvn -version

✅ Ce que vous devez voir :
  Apache Maven 3.9.x (xxxxxxxxxxxxxxxx)
  Maven home: C:\Program Files\Maven\apache-maven-3.9.x
  Java version: 17.0.x, vendor: Oracle Corporation
```

**🍎 macOS (shortcut) :**
```bash
brew install maven
```

**❌ Si "mvn not found" :** Le PATH n'est pas configuré correctement — refaire l'étape PATH ci-dessus.

---

### Étape 0.3 — Installer Node.js 18+

**Quoi faire :** Installer l'environnement JavaScript

**Où cliquer :**
```
→ Aller à : https://nodejs.org/en/download
→ Cliquer le gros bouton vert "18.x.x LTS"
→ Exécuter l'installateur → Next → Accepter la licence → Next → Install
```

**Vérification :**
```
→ Dans cmd, taper :
  node -version
  npm -version

✅ Ce que vous devez voir :
  v18.x.x
  9.x.x
```

---

### Étape 0.4 — Installer Git

**Quoi faire :** Installer le système de versionnement

**Où cliquer :**
```
→ Aller à : https://git-scm.com/downloads
→ Télécharger pour Windows → Exécuter avec options par défaut
```

**Vérification :**
```
→ Dans cmd, taper :
  git --version

✅ Ce que vous devez voir :
  git version 2.xx.x.windows.x
```

---

### Étape 0.5 — Installer un IDE (choisir un)

**💡 Option A — IntelliJ IDEA Community (recommandé pour le backend) :**
```
→ Aller à : https://www.jetbrains.com/idea/download/
→ Télécharger "IntelliJ IDEA Community Edition" (gratuit)
→ Installer avec options par défaut
```

**💡 Option B — VS Code (bon pour le frontend) :**
```
→ Aller à : https://code.visualstudio.com/download
→ Télécharger et installer
→ Extensions recommandées :
  1. Extension Pack for Java
  2. Spring Boot Extension Pack
  3. ES7+ React/Redux/React-Native snippets
  4. Tailwind CSS IntelliSense
```

---

### ✅ Vérification — Phase 0 terminée

```
[✅] java -version → 17.x
[✅] mvn -version → 3.9.x
[✅] node -version → 18.x
[✅] git --version → 2.x
[✅] IDE installé (IntelliJ ou VS Code)
```

---

## Phase 1 — PostgreSQL

### Étape 1.1 — Télécharger PostgreSQL

**Quoi faire :** Télécharger le serveur de base de données

**Où cliquer :**
```
→ Ouvrir votre navigateur
→ Aller à : https://www.postgresql.org/download/
→ Cliquer sur votre système d'exploitation (Windows / macOS / Linux)

POUR WINDOWS :
→ Redirection vers : https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
→ Trouver la ligne "PostgreSQL 16" (première ligne)
→ Colonne "Windows x86-64" → cliquer le bouton bleu de téléchargement
→ Fichier : postgresql-16.x-windows-x64.exe (environ 300Mo)
→ Attendre la fin du téléchargement
```

---

### Étape 1.2 — Exécuter l'Installateur PostgreSQL

**Quoi faire :** Installer PostgreSQL et pgAdmin

**Où cliquer :**
```
→ Ouvrir le dossier Téléchargements
→ Double-cliquer sur postgresql-16.x-windows-x64.exe
→ Si Windows demande "Autoriser cette application ?" → CLIQUER OUI

ÉCRANS DE L'ASSISTANT (cliquer Next à chaque fois sauf indication) :

Écran 1 : "Welcome to the Setup Wizard"
→ Cliquer : Next

Écran 2 : "Installation Directory"
→ Laisser par défaut : C:\Program Files\PostgreSQL\16
→ Cliquer : Next

Écran 3 : "Select Components" ⚠️ TRÈS IMPORTANT
→ Vérifier que TOUTES les cases sont cochées :
  ✅ PostgreSQL Server
  ✅ pgAdmin 4        ← OUTIL VISUEL ESSENTIEL
  ✅ Stack Builder
  ✅ Command Line Tools
→ Cliquer : Next

Écran 4 : "Data Directory"
→ Laisser par défaut
→ Cliquer : Next

Écran 5 : "Password" ⚠️ TRÈS IMPORTANT
→ Entrer un mot de passe pour le superutilisateur postgres
→ Exemple : Admin1234 (utilisez quelque chose que vous retiendrez !)
→ ⚠️ ÉCRIVEZ CE MOT DE PASSE — vous ne pouvez pas le récupérer
→ Le re-taper dans la confirmation
→ Cliquer : Next

Écran 6 : "Port"
→ Laisser par défaut : 5432
→ Cliquer : Next

Écran 7 : "Advanced Options / Locale"
→ Laisser par défaut
→ Cliquer : Next

Écran 8 : "Pre Installation Summary"
→ Vérifier que tout est correct
→ Cliquer : Next

Écran 9 : "Installing..."
→ Attendre 2-5 minutes pendant la copie des fichiers
→ NE PAS FERMER LA FENÊTRE

Écran 10 : "Completing the PostgreSQL Setup"
→ DÉCOCHER "Launch Stack Builder at exit" (pas besoin)
→ Cliquer : Finish
```

---

### Étape 1.3 — Vérifier que PostgreSQL est en cours d'exécution

**Quoi faire :** Confirmer que le service PostgreSQL tourne

**Où cliquer :**
```
→ Touche Windows
→ Taper : Services
→ Cliquer sur "Services" (icône avec un engrenage)
→ Dans la liste, faire défiler jusqu'à trouver "postgresql-x64-16"
→ Colonne "Statut" doit afficher : "En cours d'exécution" (Running)

❌ Si "Arrêté" (Stopped) :
→ Clic droit sur postgresql-x64-16 → Démarrer
```

---

### Étape 1.4 — Créer la Base de Données UrbanOps avec pgAdmin

**Quoi faire :** Créer la base de données vide

**Où cliquer :**
```
→ Touche Windows
→ Taper : pgAdmin 4
→ Cliquer pgAdmin 4 pour l'ouvrir
→ Une fenêtre de navigateur s'ouvre (pgAdmin fonctionne dans le navigateur)
→ Au premier lancement : demande un Master Password
→ Définir un mot de passe (ex: Admin1234) → OK

BARRE LATÉRALE GAUCHE — CONNEXION AU SERVEUR :
→ Cliquer la flèche ▶ à côté de "Servers" pour l'ouvrir
→ Cliquer la flèche ▶ à côté de "PostgreSQL 16"
→ Une popup "Connect to Server" apparaît
→ Entrer le mot de passe défini à l'Étape 1.2 (Admin1234)
→ Cliquer : OK

✅ VOUS ÊTES MAINTENANT CONNECTÉ. Vous voyez :
→ Databases (2)
→ Login/Group Roles (3)
→ Tablespaces (1)

CRÉER LA BASE DE DONNÉES :
→ Clic droit sur "Databases" dans la barre latérale gauche
→ Dans le menu : "Create" → "Database..."

BOÎTE DE DIALOGUE QUI S'OUVRE :
→ Champ "Database" : taper exactement : urbanops_db
→ Dropdown "Owner" : sélectionner : postgres
→ Cliquer le bouton bleu "Save"

✅ VOUS DEVEZ MAINTENANT VOIR :
→ Databases (3)
→ urbanops_db apparaît dans la liste ← SUCCÈS

VÉRIFIER LA BASE DE DONNÉES :
→ Cliquer la flèche ▶ à côté de "urbanops_db"
→ Vous devez voir : Casts, Catalogs, Event Triggers, Extensions, Foreign Data Wrappers, Languages, Schemas
→ Cela signifie que la base de données est créée correctement
```

---

### Étape 1.5 — Alternative : Créer la Base via Ligne de Commande

**Si pgAdmin ne fonctionne pas :**
```
→ Touche Windows
→ Taper : psql
→ Clic droit sur "SQL Shell (psql)" → "Exécuter en tant qu'administrateur"
→ Il demande :
  Server [localhost]: ← appuyer Entrée (garder défaut)
  Database [postgres]: ← appuyer Entrée (garder défaut)
  Port [5432]: ← appuyer Entrée (garder défaut)
  Username [postgres]: ← appuyer Entrée (garder défaut)
  Password for user postgres: ← taper votre mot de passe (rien ne s'affiche), Entrée

✅ Vous devez voir : postgres=#

→ Taper exactement cette commande et Entrée :
  CREATE DATABASE urbanops_db;

✅ Vous devez voir : CREATE DATABASE

→ Pour vérifier : \l
→ urbanops_db doit apparaître dans la liste

→ Taper : \q et Entrée pour quitter
```

---

### ✅ Vérification — Phase 1 terminée

```
[✅] PostgreSQL 16 installé
[✅] Service "postgresql-x64-16" en cours d'exécution
[✅] pgAdmin 4 ouvre dans le navigateur
[✅] Base de données "urbanops_db" créée et visible
```

---

## Phase 2 — Configuration du Projet

### Étape 2.1 — Obtenir les Fichiers du Projet

**Option A — Si vous avez un fichier ZIP :**
```
→ Trouver le fichier urbanops.zip
→ Clic droit → Extraire tout
→ Destination : C:\Projects\urbanops
→ Cliquer Extraire
```

**Option B — Si le projet est sur GitHub :**
```bash
→ Ouvrir l'invite de commandes (cmd)
→ Taper :
  cd C:\Projects
  git clone https://github.com/[votre-username]/urbanops.git
  cd urbanops
```

**Vérifier la structure :**
```
→ Ouvrir l'Explorateur de fichiers
→ Naviguer vers : C:\Projects\urbanops
→ Vous devez voir DEUX dossiers :
  📁 backend
  📁 frontend
→ Et des fichiers comme README.md, RAPPORT_TECHNIQUE.md, etc.
```

---

### Étape 2.2 — Configurer le Backend

**Quoi faire :** Modifier le fichier de configuration

**Où cliquer :**
```
→ Explorateur de fichiers
→ Naviguer vers : C:\Projects\urbanops\backend\src\main\resources\
→ Trouver le fichier : application.properties
→ Clic droit → Ouvrir avec → Bloc-notes (ou VS Code)

TROUVER CES LIGNES ET LES MODIFIER :

Ligne : spring.datasource.password=yourpassword
Changer en : spring.datasource.password=Admin1234
(utiliser le MOT DE PASSE EXACT de l'Étape 1.2)

Ligne : spring.datasource.url=jdbc:postgresql://localhost:5432/urbanops_db
→ Laisser EXACTEMENT comme ça (ne pas changer)

Ligne : spring.datasource.username=postgres
→ Laisser EXACTEMENT comme ça

Ligne : ai.gemini.api-key=YOUR_GEMINI_API_KEY
→ Remplacer par votre vraie clé API Gemini (voir Étape 2.3)
→ Si vous n'en avez pas encore, laisser comme ça pour l'instant

Ligne : spring.mail.username=urbanops.marrakech@gmail.com
Ligne : spring.mail.password=yourapppassword
→ Si vous n'avez pas configuré l'email, laisser comme ça
→ L'application fonctionnera quand même, les alertes n'enverront juste pas d'emails

→ Ctrl+S pour enregistrer
→ Fermer le Bloc-notes
```

---

### Étape 2.3 — Obtenir une Clé API Gemini (pour la fonction d'analyse IA)

**Quoi faire :** Créer une clé pour l'intelligence artificielle

**Où cliquer :**
```
→ Ouvrir le navigateur
→ Aller à : https://aistudio.google.com/app/apikey
→ Se connecter avec un compte Google
→ Cliquer : "Create API Key"
→ Cliquer : "Create API key in new project"
→ Copier la clé qui apparaît (commence par "AIza...")
→ Retourner dans application.properties
→ Remplacer YOUR_GEMINI_API_KEY par cette clé
→ Enregistrer le fichier
```

---

### Étape 2.4 — Configurer le Frontend

**Quoi faire :** Créer le fichier de configuration

**Où cliquer :**
```
→ Explorateur de fichiers
→ Naviguer vers : C:\Projects\urbanops\frontend\
→ Vérifier si un fichier .env.local existe

❌ S'il N'EXISTE PAS :
→ Clic droit dans le dossier (sur un espace vide)
→ Nouveau → Document texte
→ Nommer exactement : .env.local (avec le point, pas de .txt à la fin)
→ Si Windows dit "Êtes-vous sûr ?" → Oui
→ L'ouvrir avec le Bloc-notes
→ Taper exactement cette ligne :
  NEXT_PUBLIC_API_URL=http://localhost:8080/api
→ Enregistrer et fermer

✅ S'il EXISTE DÉJÀ :
→ L'ouvrir et vérifier qu'il contient :
  NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

### ✅ Vérification — Phase 2 terminée

```
[✅] Projet extrait dans C:\Projects\urbanops
[✅] application.properties modifié avec le bon mot de passe
[✅] Clé API Gemini configurée (ou laissée par défaut)
[✅] Fichier .env.local créé avec l'URL de l'API
```

---

## Phase 3 — Lancer le Backend

### Étape 3.1 — Ouvrir le Backend dans un Terminal

**Quoi faire :** Ouvrir une fenêtre de commandes

**Où cliquer :**
```
→ Touche Windows
→ Taper : cmd
→ Appuyer Entrée
→ Une fenêtre noire s'ouvre — c'est l'invite de commandes

→ Taper ces commandes UNE PAR UNE (Entrée après chaque) :
  cd C:\Projects\urbanops\backend

✅ Le prompt doit changer en :
  C:\Projects\urbanops\backend>
```

---

### Étape 3.2 — Compiler le Projet

**Quoi faire :** Télécharger les dépendances et compiler

**Où cliquer :**
```
→ Dans le même terminal, taper :
  mvn clean install -DskipTests

→ CE QUE CELA FAIT :
  - Télécharge toutes les dépendances depuis Internet (première fois : 5-10 minutes)
  - Compile le code Java
  - Ignore les tests pour l'instant (démarrage plus rapide)

→ PENDANT L'EXÉCUTION, vous verrez beaucoup de texte :
  [INFO] Downloading from central: ...
  [INFO] Building jar...

✅ SORTIE RÉUSSIE se termine par :
  [INFO] BUILD SUCCESS
  [INFO] -------------------------------
  [INFO] Total time: X:XX min

❌ SI VOUS VOYEZ : [ERROR] BUILD FAILURE
  Causes courantes :
  - Java mal installé → exécuter : java -version
  - Maven mal installé → exécuter : mvn -version
  - Problème de connexion Internet → réessayer la commande
```

---

### Étape 3.3 — Démarrer le Serveur Backend

**Quoi faire :** Lancer l'application Spring Boot

**Où cliquer :**
```
→ Dans le même terminal, taper :
  mvn spring-boot:run

→ PENDANT LE DÉMARRAGE, vous verrez :
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

→ ATTENDRE jusqu'à voir cette ligne (15-30 secondes) :
  Started UrbanOpsApplication in X.XXX seconds

✅ VOUS DEVEZ AUSSI VOIR (seeding de données) :
  INFO: Seeding 8 categories...
  INFO: Seeding 8 sectors of Marrakech...
  INFO: Creating admin user: admin@urbanops.ma
  INFO: Seeding 10 sample incidents...
  INFO: Data seeding complete.

⚠️ LE SERVEUR TOURNE MAINTENANT. NE PAS FERMER CE TERMINAL.

VÉRIFICATION DANS LE NAVIGATEUR :
→ Ouvrir le navigateur
→ Aller à : http://localhost:8080/api/swagger-ui.html
→ Vous devez voir l'interface Swagger UI — une page avec tous vos endpoints API listés
→ Cela confirme que le backend fonctionne
```

**❌ ERREURS COURANTES :**

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Port 8080 already in use" | Une autre app utilise le port 8080 | Dans application.properties, changer `server.port=8080` en `server.port=8081`. Puis modifier .env.local en : `NEXT_PUBLIC_API_URL=http://localhost:8081/api` |
| "Unable to acquire JDBC Connection" | PostgreSQL ne tourne pas OU mauvais mot de passe | Vérifier Étape 1.3 (service PostgreSQL en cours). Re-vérifier que application.properties a le même mot de passe que l'Étape 1.2 |
| "Could not create upload directory" | Dossier uploads manquant | Créer manuellement : `C:\Projects\urbanops\backend\uploads\` |

---

### Étape 3.4 — Vérifier que la Base de Données a été Peuplée

**Quoi faire :** Confirmer que les tables et données existent

**Où cliquer :**
```
→ Retourner dans pgAdmin dans votre navigateur
→ Dans la barre latérale : Servers → PostgreSQL 16 → Databases → urbanops_db → Schemas → public → Tables
→ Vous devez voir ces tables :
  ✅ alerts
  ✅ categories
  ✅ incidents
  ✅ sectors
  ✅ users

→ Pour voir les données : clic droit "users" → View/Edit Data → All Rows
→ Vous devez voir 2 lignes :
  - admin@urbanops.ma (role: ADMIN)
  - citoyen@test.ma (role: CITIZEN)

→ Clic droit "categories" → View/Edit Data → All Rows
→ Vous devez voir 8 lignes : Transport, Eau, Déchets, Éclairage, Électricité, Voirie, Sécurité, Espaces verts
```

---

### ✅ Vérification — Phase 3 terminée

```
[✅] mvn clean install → BUILD SUCCESS
[✅] mvn spring-boot:run → "Started UrbanOpsApplication"
[✅] Data seeding affiché dans le terminal
[✅] Swagger UI accessible à http://localhost:8080/api/swagger-ui.html
[✅] Tables créées avec données de test dans pgAdmin
```

---

## Phase 4 — Lancer le Frontend

### Étape 4.1 — Ouvrir un NOUVEAU Terminal (garder le backend ouvert)

**⚠️ IMPORTANT :** Ne pas fermer le terminal du backend !

**Où cliquer :**
```
→ Touche Windows
→ Taper : cmd → Entrée
→ Une NOUVELLE fenêtre noire s'ouvre
→ Taper :
  cd C:\Projects\urbanops\frontend
```

---

### Étape 4.2 — Installer les Dépendances Frontend

**Quoi faire :** Télécharger les packages JavaScript

**Où cliquer :**
```
→ Taper :
  npm install

→ Cela télécharge tous les packages JavaScript (première fois : 2-5 minutes)
→ Vous verrez une barre de progression et beaucoup de texte

✅ SORTIE RÉUSSIE se termine par :
  added XXX packages in Xs

⚠️ SI VOUS VOYEZ des avertissements sur les vulnérabilités :
  C'est normal — ignorez-les pour un projet étudiant

❌ SI VOUS VOYEZ : npm ERR! code ERESOLVE
  Solution : npm install --legacy-peer-deps
```

---

### Étape 4.3 — Démarrer le Frontend

**Quoi faire :** Lancer le serveur de développement Next.js

**Où cliquer :**
```
→ Dans le terminal frontend, taper :
  npm run dev

✅ SORTIE RÉUSSIE :
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

  ✓ Ready in Xs

⚠️ LE FRONTEND TOURNE MAINTENANT. NE PAS FERMER CE TERMINAL.

VÉRIFICATION DANS LE NAVIGATEUR :
→ Aller à : http://localhost:3000
→ Vous devez voir la page d'accueil UrbanOps avec :
  - Fond sombre
  - Titre "Marrakech signale, la ville répond."
  - Une carte interactive de Marrakech
  - Des cartes d'incidents récents sous la carte
  - Ces cartes montrent maintenant des DONNÉES RÉELLES de votre base PostgreSQL
```

**❌ ERREURS COURANTES :**

| Erreur | Solution |
|--------|----------|
| "EADDRINUSE: address already in use :::3000" | Une autre app utilise le port 3000. Fix : `npm run dev -- --port 3001` puis accéder à http://localhost:3001 |
| Page charge mais carte vide / cartes en chargement infini | Backend ne tourne pas ou erreur CORS. Vérifier que le terminal Étape 3.3 montre toujours "Started UrbanOpsApplication". Ouvrir console navigateur (F12 → Console) pour voir les erreurs |
| "Network Error" dans la console | URL backend incorrecte. Vérifier que .env.local contient : `NEXT_PUBLIC_API_URL=http://localhost:8080/api` |

---

### ✅ Vérification — Phase 4 terminée

```
[✅] npm install → packages ajoutés
[✅] npm run dev → Ready on http://localhost:3000
[✅] Page d'accueil s'affiche avec fond sombre
[✅] Carte visible avec marqueurs
[✅] Cartes d'incidents affichent des données réelles
```

---

## Phase 5 — Tester le Système Complet

### Étape 5.1 — Tester le Flux Citoyen

**S'INSCRIRE EN TANT QUE CITOYEN :**
```
→ Aller à : http://localhost:3000
→ Cliquer "S'inscrire" (en haut à droite)
→ Remplir le formulaire :
  Prénom: Ahmed
  Nom: Benali
  Email: ahmed@test.ma
  Téléphone: 0612345678
  Quartier: Guéliz
  Mot de passe: Test1234!
  Confirmer: Test1234!
→ Cliquer "Créer mon compte"
→ Redirection vers la page d'accueil, connecté

✅ RÉSULTAT ATTENDU : Connecté en tant qu'Ahmed Benali
```

**SIGNALER UN INCIDENT :**
```
→ Cliquer "Signaler un problème" (bouton bleu)
→ Une modale s'ouvre
→ Étape 1 : Cliquer sur "🚌 Transport & Trafic"
→ Étape 2 : Écrire en description : "Embouteillage important avenue Mohammed VI"
→ Téléverser une photo (n'importe quelle photo)
→ Sélectionner secteur : Guéliz
→ Cliquer "Envoyer le signalement →"
→ Étape 3 : Vous devez voir le résultat de l'analyse IA :
  Catégorie détectée: Transport ✓
  Criticité: MEDIUM ✓
  Autorité alertée: Police Circulation ✓

✅ RÉSULTAT ATTENDU : Signalement créé avec référence INC-XXXX
```

---

### Étape 5.2 — Tester le Tableau de Bord Admin

**SE CONNECTER EN TANT QU'ADMIN :**
```
→ Aller à : http://localhost:3000/auth/signin
→ Entrer :
  Email: admin@urbanops.ma
  Password: Admin@1234
→ Cliquer "Se connecter"
→ Redirection vers : http://localhost:3000/dashboard

✅ VÉRIFIER QUE LE TABLEAU DE BORD AFFICHE DES DONNÉES RÉELLES :
→ Les cartes KPI (en haut) doivent montrer des chiffres de votre base de données
→ Le graphique d'activité doit afficher des données d'incidents
→ Le panneau d'alertes doit montrer les alertes des incidents soumis

ALLER À LA CARTE :
→ Cliquer "Carte" dans la barre latérale gauche
→ La carte de Marrakech doit apparaître
→ Vous devez voir des points colorés sur la carte (incidents)
  ROUGE = criticité HIGH
  AMBRE = criticité MEDIUM
  CYAN = criticité LOW
→ Cliquer sur un point → popup avec détails de l'incident
```

---

### Étape 5.3 — Tester l'API Directement (via Swagger)

**TESTER LA CONNEXION :**
```
→ Aller à : http://localhost:8080/api/swagger-ui.html
→ Vous voyez tous les endpoints API groupés par contrôleur

TESTER LE LOGIN :
→ Cliquer "auth-controller" pour l'ouvrir
→ Cliquer "POST /auth/login"
→ Cliquer "Try it out"
→ Dans le corps de la requête, remplacer par :
  {
    "email": "admin@urbanops.ma",
    "password": "Admin@1234"
  }
→ Cliquer "Execute"
→ Faire défiler jusqu'à "Response body"
→ Vous devez voir une réponse JSON avec un champ "token"
→ Copier la valeur du token (longue chaîne commençant par eyJ...)

AUTORISER SWAGGER :
→ Cliquer le bouton vert "Authorize 🔒" en haut de Swagger UI
→ Dans le champ "Value", taper : Bearer [coller votre token]
→ Cliquer "Authorize"
→ Vous pouvez maintenant tester les endpoints authentifiés

TESTER GET INCIDENTS :
→ Cliquer "incident-controller"
→ Cliquer "GET /api/incidents"
→ Cliquer "Try it out" → "Execute"
→ Vous devez voir une liste d'incidents dans la réponse
```

---

### ✅ Vérification — Phase 5 terminée

```
[✅] Inscription citoyen fonctionne
[✅] Signalement d'incident avec analyse IA fonctionne
[✅] Connexion admin fonctionne
[✅] Dashboard affiche des données réelles
[✅] Carte montre les points d'incidents
[✅] Swagger API testé et fonctionnel
```

---

## Phase 6 — Tests et JaCoCo

### Étape 6.1 — Exécuter les Tests Unitaires

**Quoi faire :** Lancer les tests avec couverture

**Où cliquer :**
```
→ Ouvrir un terminal (ou utiliser le terminal backend après avoir arrêté le serveur avec Ctrl+C)
→ Naviguer vers backend :
  cd C:\Projects\urbanops\backend

→ Lancer les tests avec couverture JaCoCo :
  mvn clean verify

✅ CE QUE VOUS VERREZ :
  [INFO] Running ma.urbanops.service.IncidentServiceTest
  [INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 1  ← test @Disabled
  [INFO] Running ma.urbanops.service.UserServiceTest
  [INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
  [INFO] Running ma.urbanops.service.AlertServiceTest
  [INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
  ...

✅ Dernières lignes doivent être :
  [INFO] Tests run: 46, Failures: 0, Errors: 0, Skipped: 1
  [INFO]
  [INFO] BUILD SUCCESS

❌ SI VOUS VOYEZ BUILD FAILURE avec erreurs de test :
→ Lire le nom du test qui a échoué et le message d'erreur
→ Solution courante : mvn clean verify -X (affiche l'erreur détaillée)
```

---

### Étape 6.2 — Voir le Rapport de Couverture JaCoCo

**Quoi faire :** Ouvrir le rapport HTML de couverture

**Où cliquer :**
```
→ Ouvrir l'Explorateur de fichiers
→ Naviguer vers : C:\Projects\urbanops\backend\target\site\jacoco\
→ Trouver le fichier : index.html
→ Double-cliquer index.html — il s'ouvre dans votre navigateur

✅ CE QUE VOUS VOYEZ :
→ Un tableau montrant chaque package et classe
→ Chaque ligne a :
  - Nom de classe (ex: IncidentService)
  - % de couverture Instructions (ex: 87%)
  - % de couverture Branches (ex: 79%)
  - Couverture de lignes (barre verte/rouge)

→ COUVERTURE GLOBALE doit être > 80%
→ Si un service montre < 80%, ajouter plus de tests pour cette classe

📸 CE FICHIER EST CE QUE VOUS MONTREREZ AU PROFESSEUR comme preuve de tests.
Prenez une capture d'écran de cette page pour votre présentation.
```

---

### Étape 6.3 — Analyse SonarQube (Optionnel mais impressionnant)

**INSTALLER SONARQUBE :**
```
→ Aller à : https://www.sonarsource.com/products/sonarqube/downloads/
→ Cliquer "Community Edition" → Télécharger
→ Extraire le ZIP dans : C:\sonarqube\
```

**DÉMARRER SONARQUBE :**
```
→ Ouvrir l'invite de commandes en tant qu'Administrateur
→ Taper :
  cd C:\sonarqube\bin\windows-x86-64
  StartSonar.bat

→ Attendre jusqu'à voir : SonarQube is up
→ Ouvrir le navigateur : http://localhost:9000
→ Login : admin / admin
→ Il demandera de changer le mot de passe → définir : Admin@1234
```

**CRÉER UN PROJET :**
```
→ Cliquer "Create a project manually"
→ Project key : urbanops-backend
→ Display name : UrbanOps Backend
→ Cliquer "Set up"
→ Choisir : "Locally"
→ Générer un token → le copier (exemple : sqp_abc123...)
```

**LANCER L'ANALYSE :**
```
→ Retourner au terminal backend
→ Taper :
  mvn sonar:sonar -Dsonar.token=sqp_abc123...

→ Quand terminé, aller à : http://localhost:9000/dashboard?id=urbanops-backend
→ Vous devez voir :
  Bugs: 0
  Vulnerabilities: 0
  Coverage: 86%

📸 Prenez une capture d'écran pour le professeur
```

---

### ✅ Vérification — Phase 6 terminée

```
[✅] mvn clean verify → BUILD SUCCESS, 46 tests, 0 failures
[✅] JaCoCo rapport : target/site/jacoco/index.html → >80% couverture
[✅] (Optionnel) SonarQube configuré avec 86% couverture
```

---

## Phase 7 — Problèmes Courants et Solutions

### Problème 1 : "Port 5432 is already in use"

**Cause :** Une autre instance PostgreSQL tourne déjà

**Solution :**
```
→ Touche Windows → Services → trouver "postgresql-x64-16" → vérifier le statut
→ Ou utiliser un port différent dans application.properties :
  spring.datasource.url=jdbc:postgresql://localhost:5433/urbanops_db
→ Et pendant l'installation PostgreSQL, changer le port de 5432 à 5433
```

---

### Problème 2 : "Failed to obtain JDBC Connection"

**Cause :** Le mot de passe PostgreSQL dans application.properties est incorrect

**Solution :**
```
→ Ouvrir pgAdmin → clic droit PostgreSQL 16 → Propriétés → Connexion
→ Confirmer le mot de passe
→ Mettre à jour application.properties : spring.datasource.password=VotreMotDePasseCorrect
```

---

### Problème 3 : Le frontend montre un spinner de chargement éternel

**Cause :** Le backend ne tourne pas OU CORS bloque la requête

**Solution 1 :** Vérifier que le terminal backend montre "Started UrbanOpsApplication"

**Solution 2 :** Ouvrir DevTools navigateur (F12) → onglet Network → chercher les requêtes rouges échouées

**Solution 3 :** Si vous voyez "CORS error", vérifier que CorsConfig.java autorise localhost:3000

---

### Problème 4 : "npm install" échoue avec des erreurs node-gyp

**Solution :**
```
→ Exécuter en tant qu'Administrateur :
  npm install --global windows-build-tools
→ Puis réessayer : npm install
```

---

### Problème 5 : "mvn: command not found" après installation de Maven

**Cause :** Le PATH n'a pas été configuré correctement

**Solution :**
```
→ Panneau de configuration → Système → Paramètres système avancés
→ Variables d'environnement
→ Sous Variables système, trouver "Path" → Modifier
→ Cliquer "Nouveau" → ajouter : C:\Program Files\Maven\apache-maven-3.x.x\bin
→ Cliquer OK → OK → OK
→ IMPORTANT : Fermer et rouvrir le terminal
→ Tester : mvn -version
```

---

### Problème 6 : La popup de mot de passe pgAdmin apparaît sans cesse

**Cause :** Le Master Password pgAdmin est différent du mot de passe PostgreSQL

**Solution :**
```
Dans pgAdmin :
→ Cliquer l'icône de cadenas en haut à droite
→ Entrer votre Master Password pgAdmin (défini quand vous avez ouvert pgAdmin la première fois)
→ C'est DIFFÉRENT du mot de passe de la base de données postgres
```

---

### Problème 7 : La carte ne s'affiche pas sur la page

**Cause :** Problème de SSR Leaflet dans Next.js

**Solution :**
```
→ C'est déjà géré dans le code avec des imports dynamiques
→ Si toujours cassé :
  → Ouvrir la console navigateur (F12 → Console)
  → Chercher le message d'erreur exact
  → Redémarrer avec : npm run dev
```

---

## Phase 8 — Checklist Finale Avant la Présentation

### ✅ Vérification Installation

```
[✅] Java 17 : java -version ✓
[✅] Maven : mvn -version ✓
[✅] Node.js : node -version ✓
[✅] PostgreSQL : pgAdmin montre urbanops_db avec toutes les tables ✓
```

### ✅ Vérification Backend

```
[✅] mvn clean verify → BUILD SUCCESS, 46 tests, 0 failures ✓
[✅] Rapport JaCoCo : target/site/jacoco/index.html → >80% couverture ✓
[✅] Backend tournant : http://localhost:8080/api/swagger-ui.html charge ✓
```

### ✅ Vérification Frontend

```
[✅] npm run dev → Ready on http://localhost:3000 ✓
[✅] Page d'accueil s'affiche avec carte et données réelles ✓
[✅] Connexion fonctionne : admin@urbanops.ma / Admin@1234 ✓
[✅] Dashboard affiche les cartes KPI avec des chiffres ✓
[✅] Page Incidents montre les 10 incidents de test ✓
[✅] Modale Signaler → soumet et montre le résultat IA ✓
```

### 📄 Documents à Montrer au Professeur

```
[✅] RAPPORT_TECHNIQUE.md (ouvrir dans VS Code preview ou rendre en PDF)
[✅] Capture d'écran rapport JaCoCo (target/site/jacoco/index.html)
[✅] Capture d'écran dashboard SonarQube (si configuré)
[✅] Swagger UI montrant les 43 endpoints
[✅] Application tournante à http://localhost:3000
```

### 🎬 Scénario de Démo

```
1. Ouvrir http://localhost:3000 → montrer la page d'accueil avec la carte
2. Cliquer "Signaler un problème" → soumettre un incident avec photo
3. Montrer le résultat de l'analyse IA à l'étape 3 de la modale
4. Se connecter en tant qu'admin → aller au Dashboard
5. Montrer que le nouvel incident apparaît en temps réel
6. Aller à la page Incidents → montrer que les filtres fonctionnent
7. Aller à Carte → montrer la carte avec les points d'incidents
8. Ouvrir Swagger UI → tester GET /api/incidents directement
9. Montrer le rapport JaCoCo → 86% de couverture
10. Montrer la section 5.6 du RAPPORT_TECHNIQUE.md (code des tests)
```

---

## 🎉 FÉLICITATIONS — UrbanOps est Complètement Installé !

Vous avez maintenant :
- ✅ Une base de données PostgreSQL avec des données réelles
- ✅ Un backend Spring Boot avec 43 endpoints REST
- ✅ Un frontend Next.js connecté au backend
- ✅ 46 tests unitaires avec 86% de couverture
- ✅ Une application complète prête pour la démonstration

**Pour arrêter l'application :**
```
→ Terminal frontend : Ctrl+C puis fermer la fenêtre
→ Terminal backend : Ctrl+C puis fermer la fenêtre
→ PostgreSQL continue de tourner en arrière-plan (c'est normal)
```

**Pour redémarrer plus tard :**
```
1. Vérifier que PostgreSQL tourne (Services)
2. Terminal 1 : cd C:\Projects\urbanops\backend && mvn spring-boot:run
3. Terminal 2 : cd C:\Projects\urbanops\frontend && npm run dev
4. Ouvrir http://localhost:3000
```

---

**Guide écrit par l'équipe UrbanOps — Marrakech, Maroc**

*Version 1.0 — Mai 2025*
