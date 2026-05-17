# Diapositive 1 : Titre de la présentation
**Projet UrbanOps : Présentation du Management de Projet**
* **Matière :** Gestion de projet
* **Projet :** Plateforme Intelligente de Gestion des Incidents Urbains
* **Présenté par :** [Votre Nom / Votre Équipe]

---

# Diapositive 2 : Contexte du projet
* **Transition vers les Smart Cities :** Les villes modernes nécessitent des approches numériques pour la gestion de l'espace urbain.
* **Le projet UrbanOps :** Une plateforme logicielle dédiée à la centralisation et au traitement intelligent des incidents (voirie, éclairage, propreté, etc.).
* **Besoin citoyen :** Une attente forte pour plus de transparence, de réactivité et d'implication dans la vie de la ville.

---

# Diapositive 3 : Problématique
**Les défis actuels de la gestion urbaine :**
* *Lenteur :* Les citoyens manquent d'un moyen rapide et centralisé pour signaler les incidents.
* *Surcharge :* Les administrations sont souvent submergées par des rapports manuels difficiles à trier.
* *Manque de priorisation :* L'absence d'outils analytiques rend difficile l'estimation de l'urgence ou de la sévérité réelle d'un incident.
* **Question centrale :** *Comment organiser techniquement et humainement le développement d'une solution intelligente pour hiérarchiser et résoudre ces incidents en temps réel ?*

---

# Diapositive 4 : Plan de management du contenu (Objectifs)
**Ce que nous voulons accomplir :**
* Développer une interface (Frontend) intuitive cartographique (React/CartoDB).
* Construire un cœur de système robuste (Backend Spring Boot) avec gestion stricte des rôles via JWT (RBAC).
* Mettre en œuvre une architecture distribuée s'appuyant sur plusieurs Middlewares (REST, JMS, RMI, SOAP).
* Intégrer de l'Intelligence Artificielle (API Gemini) pour le triage et l'évaluation de la sévérité des incidents.

---

# Diapositive 5 : Plan de management du contenu (Périmètre)
**Inclusions (Ce qui est livré) :**
* Application Web fonctionnelle (Tableaux de bord citoyens et administrateurs).
* Système de sécurité et d'authentification.
* Processus complet d'assurance qualité (Rapports SonarQube, JaCoCo).
* Logiciel de résilience (Failover) en cas d'indisponibilité de l'IA.

**Exclusions (Ce qui est hors-périmètre) :**
* Installation physique de capteurs IoT dans la ville.
* Achat ou gestion de la flotte de camions d'intervention sur le terrain.

---

# Diapositive 6 : Plan de management des ressources humaines
**L'organisation de l'équipe :**
* **Chef de projet (Scrum Master) :** Garantit le respect des délais, gère le backlog et la communication.
* **Développeurs Backend :** Responsables de l'API REST, Spring Security (JWT) et des Middlewares (JMS, RMI, SOAP).
* **Développeurs Frontend :** Déploiement des tableaux de bord interactifs (KpiCards, MapSection) et de l'expérience utilisateur.
* **Architecte IA :** Connexion à Gemini, gestion des prompts et des stratégies de repli ("Fallback").
* **Ingénieur Qualité (QA) :** Mise en œuvre des tests (JUnit 5, Mockito) et audits (SonarQube).

---

# Diapositive 7 : Plan de management des ressources matérielles
**Ressources logicielles et d'infrastructure :**
* **Hébergement & Cloud :** Serveurs de base de données (PostgreSQL), déploiement Backend.
* **Outils d'Intelligence Artificielle :** Accès à l'API Google Gemini 3.1 Pro via des clés de service.
* **Stack de développement :** 
  * IDEs (IntelliJ, VS Code).
  * Outils de versioning de code (Git, GitHub).
* **Outils de Qualité & CI/CD :** Serveur SonarQube pour l'analyse statique du code, Postman pour les API.

---

# Diapositive 8 : Plan de management de coût (Estimation)
**Principales catégories de dépenses :**
1. **Coûts de la main d’œuvre (RH) :** Jours/Hommes des développeurs, du QA et de la gestion.
2. **Licences et Logiciels :** Coûts des outils professionnels de gestion (si applicables) et des serveurs d'intégration continue.
3. **Coûts d'infrastructure (Cloud) :** Location des serveurs, bande passante.
4. **Coûts liés à l'IA :** Modèle de facturation au token/requête pour l'utilisation de l'API Gemini lors de la classification.

---

# Diapositive 9 : Plan de management de coût (Contrôle)
**Stratégies d'optimisation prévues :**
* **Mise en cache (Caching) :** Pour limiter les appels inutiles à l'API Gemini et réduire la facture IA.
* **Suivi des budgets cloud :** Mise en place de seuils d'alerte automatiques (Billing alerts).
* **Priorisation des fonctionnalités :** Validation précoce des POC (Proof Of Concept) sur les Middlewares pour éviter les refontes coûteuses.

---

# Diapositive 10 : Plan de management de délai (Méthodologie)
**Organisation Temporelle :**
* Adoption de la méthodologie Agile (Sprints de 2 à 3 semaines).
* Itérations courtes permettant de livrer des fonctionnalités validées rapidement.

**Phases majeures du cycle de vie :**
* **Phase 1 :** Modélisation et fondations sécurisées (JWT, BDD).
* **Phase 2 :** Intégration des APIs complexes (Middlewares, IA).
* **Phase 3 :** Finalisation de l'Interface Visuelle (Cartographie) et tests système.
* **Phase 4 :** Rédaction documentaire (Rapports LaTeX de soutenance).

---

# Diapositive 11 : Plan de management de délai (Outils)
* **Diagramme de Gantt :** Utilisé pour visualiser l'ensemble des tâches de développement, leurs dates de début/fin, et suivre l'avancement global semaine par semaine.
* **Réseau PERT :** Essentiel dans UrbanOps pour identifier les dépendances fortes. 
  * *Exemple :* Le module Frontend de la carte ("MapSection") nécessite des endpoints REST fonctionnels.
  * *Exemple 2 :* L'évaluation de l'IA (Gemini) ne peut être validée qu'après la persistance sécurisée des rapports d'incidents.

---

# Diapositive 12 : Plan de management de qualité (Outils et Mesures)
**Objectif :** Atteindre un niveau de qualité professionnel (Code propre, sans dette technique).
* **Tests Unitaires & Mocks :** Écriture de tests systématiques (JUnit 5, Mockito) pour les services cruciaux de triage d'incidents.
* **Couverture de Code :** Utilisation de **JaCoCo** pour garantir qu'un pourcentage cible (ex: 80%) du backend est testé.
* **Audits continus :** Passage sous **SonarQube** pour bloquer la mise en production si le code contient :
  * Des vulnérabilités de sécurité.
  * Des "Code Smells" (Mauvaises pratiques).

---

# Diapositive 13 : Plan de management de qualité (Processus)
**Critères d'acceptation stricts :**
* Un incident signalé par l'application doit toujours aboutir en base de données, même si l'IA de classification est hors-service.
* Le RBAC doit empêcher strictement tout "Citoyen" de modifier le statut "Résolu" d'un incident.
* **Revue de code (Peer Review) :** Chaque fonctionnalité est validée par au moins un autre développeur avant la fusion via Pull Request.

---

# Diapositive 14 : Plan de management des risques
**Matrice des risques anticipés sur UrbanOps :**
1. **Risque IA (Impact: Élevé, Probabilité: Moyenne) :** Indisponibilité du service Gemini ou temps de réponse excessif. 
   * *Solution :* Architecture non bloquante avec *Fallback* manuel.
2. **Risque Technique (Impact: Élevé, Probabilité: Haute) :** Complexité d'intégration des 4 Middlewares (JMS, RMI, SOAP, REST).
   * *Solution :* Isolation des services, tests en silos.
3. **Risque Sécurité (Impact: Critique, Probabilité: Faible) :** Escalade de privilèges.
   * *Solution :* Utilisation éprouvée de Spring Security `@PreAuthorize` et audit SonarQube sur l'authentification.

---

# Diapositive 15 : Plan de management de communication
**Garantir la circulation de l'information :**
* *Quotidien :* **Daily Stand-up meetings** de 15 min (Qu'ai-je fait hier ? Que fais-je aujourd'hui ? Suis-je bloqué ?), souvent via Discord/Teams.
* *Hebdomadaire :* Révision du Gantt en équipe et revue du code critique.
* *Fin de jalon :* Démonstration logicielle (Démo de l'UI et de l'alerte sur carte).
* *Documentation technique :* Tout le projet (spécifications, choix d'architecture) est centralisé numériquement et exporté via un rapport technique LaTeX de haute qualité.

---

# Diapositive 16 : Gestion de changement(s)
**L'adaptabilité au cœur du projet UrbanOps :**
* Les changements (nouvelles idées ou contraintes) sont documentés en "Tickets" (Issus) et priorisés dans le Backlog.

**Exemple réel géré durant le projet :**
1. *Constat :* Au départ, la sévérité des incidents était jugée manuellement.
2. *Changement demandé :* Confier le classement à une IA pour gagner en réactivité.
3. *Évaluation & Décision :* L'équipe technique de développement a analysé l'impact sur le code existant.
4. *Action :* Réécriture du système de façon modulaire (pour permettre l'IA sans casser l'existant) et acceptation du changement dans le planning avec mise à jour de l'architecture logicielle.
