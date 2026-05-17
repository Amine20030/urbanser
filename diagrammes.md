# Tableaux & Diagrammes de Gestion de Projet - UrbanOps

Ce document contient les codes sources PlantUML pour les diagrammes du projet **UrbanOps**. Vous pouvez les compiler en utilisant le plugin de PlantUML dans un éditeur (VSCode, IntelliJ), via un serveur en ligne (comme PlantText, PlantUML Web Server) ou encore en les convertissant avec l'outil CLI de PlantUML.

---

## 1. Work Breakdown Structure (WBS)
Le WBS (Structure de Découpage du Projet) divise le travail complet en hiérarchie orientée sur les tâches à livrer qui seront exécutées par l'équipe projet.

```plantuml
@startwbs
<style>
wbsDiagram {
  BackgroundColor LightBlue
  node {
    Padding 12
    Margin 3
    BackgroundColor White
    BorderColor #1c1917
  }
}
</style>
* Projet UrbanOps
** 1. Initialisation & Ingénierie
*** 1.1 Cahier des charges & Exigences
*** 1.2 Architecture du système global
*** 1.3 Maquettage UX/UI & Design System
** 2. Backend (Spring Boot)
*** 2.1 Configuration Base de données (PostgreSQL)
*** 2.2 Implémentation des API REST Crud
*** 2.3 Mécanisme de Sécurité (JWT, RBAC)
*** 2.4 Middleware & Communication (JMS, RMI, SOAP)
** 3. Frontend (Next.js)
*** 3.1 Intégration Design (Tokens, CSS Vanilla)
*** 3.2 Module Carte Interactive (Leaflet)
*** 3.3 Espace Citoyen (Signalements)
*** 3.4 Dashboard Administrateur (Gestion & Stats)
** 4. Intelligence Artificielle
*** 4.1 Configuration Gemini API
*** 4.2 Module d'Analyse (Sévérité & Description)
*** 4.3 Logique de traitement des erreurs
** 5. Tests & Assurance Qualité
*** 5.1 Tests Unitaires & Mocking (JUnit, Mockito)
*** 5.2 Couverture de Code (JaCoCo)
*** 5.3 Audit Qualité & Qualimétrie (SonarQube)
** 6. Mise en Production
*** 6.1 Conteneurisation (Docker)
*** 6.2 Déploiement des environnements
*** 6.3 Préparation de la Soutenance (Rapports, PPT)
@endwbs
```

---

## 2. Diagramme de Gantt
Il illustre le calendrier de développement avec les dépendances techniques, très utile pour montrer la progression temporelle. Les tâches critiques figurent parmi les modules structurants.

```plantuml
@startgantt
language fr
Project starts 2026-03-01

' --- Styles ---
<style>
ganttDiagram {
  task {
    BackGroundColor White
    LineColor Black
  }
  milestone {
    BackGroundColor #c2410c
    LineColor #c2410c
  }
}
</style>

' --- Tâches ---
[Cahier des charges] lasts 5 days
[Design UX/UI & Tokens] lasts 7 days
[Architecture Système] lasts 4 days

[Config BD & Init Backend] lasts 4 days
[Développement API REST] lasts 12 days
[Sécurité (JWT & RBAC)] lasts 5 days
[Développement Middleware (JMS)] lasts 7 days

[Init Frontend NextJS] lasts 3 days
[Vues & Formularires (Citoyen)] lasts 8 days
[Carte Interactive (Leaflet)] lasts 6 days
[Dashboard Administration] lasts 7 days

[Intégration Modèles IA (Gemini)] lasts 6 days

[Tests Junit/Mockito] lasts 8 days
[Analyse SonarQube] lasts 3 days

[Conteneurisation & Déploiement] lasts 4 days
[Validation Produit Fini] happens at [Conteneurisation & Déploiement]'s end

' --- Dépendances & Planification ---
[Architecture Système] starts at [Cahier des charges]'s end
[Design UX/UI & Tokens] starts at [Cahier des charges]'s end

[Config BD & Init Backend] starts at [Architecture Système]'s end
[Init Frontend NextJS] starts at [Design UX/UI & Tokens]'s end

[Développement API REST] starts at [Config BD & Init Backend]'s end
[Vues & Formularires (Citoyen)] starts at [Init Frontend NextJS]'s end

[Sécurité (JWT & RBAC)] starts at [Développement API REST]'s end
[Développement Middleware (JMS)] starts at [Sécurité (JWT & RBAC)]'s end
[Intégration Modèles IA (Gemini)] starts at [Développement API REST]'s end

[Carte Interactive (Leaflet)] starts at [Vues & Formularires (Citoyen)]'s end
[Dashboard Administration] starts at [Développement API REST]'s end
[Dashboard Administration] starts at [Carte Interactive (Leaflet)]'s end

[Tests Junit/Mockito] starts at [Développement Middleware (JMS)]'s end
[Tests Junit/Mockito] starts at [Dashboard Administration]'s end
[Analyse SonarQube] starts at [Tests Junit/Mockito]'s end

[Conteneurisation & Déploiement] starts at [Analyse SonarQube]'s end

' --- Colorisation Optionnelle ---
[Cahier des charges] is colored in #fed7aa
[Design UX/UI & Tokens] is colored in #fed7aa
[Architecture Système] is colored in #fed7aa

[Config BD & Init Backend] is colored in #bae6fd
[Développement API REST] is colored in #bae6fd
[Sécurité (JWT & RBAC)] is colored in #bae6fd
[Développement Middleware (JMS)] is colored in #bae6fd

[Init Frontend NextJS] is colored in #d9f99d
[Vues & Formularires (Citoyen)] is colored in #d9f99d
[Carte Interactive (Leaflet)] is colored in #d9f99d
[Dashboard Administration] is colored in #d9f99d

[Intégration Modèles IA (Gemini)] is colored in #fbcfe8

[Tests Junit/Mockito] is colored in #e5e5e5
[Analyse SonarQube] is colored in #e5e5e5
[Conteneurisation & Déploiement] is colored in #fde047
@endgantt
```

---

## 3. Diagramme de PERT (Version Modèle de Réseau / État)
PlantUML ne possède pas un outil natif ultra restrictif nommé « PERT », mais les praticiens utilisent le diagramme d'activité/états pour générer une vue de chemins critiques PERT claire et professionnelle.

```plantuml
@startuml
skinparam state {
  BackgroundColor White
  BorderColor #333333
  ArrowColor #c2410c
  FontName Arial
}

state "A. Analyse B. & Spécifications\nDurée: 5j\nPrécédent: -" as T1
state "B. UI/UX Design\nDurée: 7j\nPrécédent: A" as T2
state "C. Architecture globale\nDurée: 4j\nPrécédent: A" as T3
state "D. API Backend & BDD\nDurée: 12j\nPrécédent: C" as T4
state "E. Initialisation Frontend\nDurée: 8j\nPrécédent: B, C" as T5
state "F. Intégration IA (Gemini)\nDurée: 6j\nPrécédent: D" as T6
state "G. Sécurité & Middleware\nDurée: 8j\nPrécédent: D" as T7
state "H. Espace Administrateur\nDurée: 7j\nPrécédent: D, E" as T8
state "I. Assurance Qualité (Tests)\nDurée: 6j\nPrécédent: F, G, H" as T9
state "J. Déploiement\nDurée: 4j\nPrécédent: I" as T10

[*] --> T1
T1 --> T2
T1 --> T3

T2 --> T5
T3 --> T5
T3 --> T4

T4 --> T6
T4 --> T7
T4 --> T8

T5 --> T8

T6 --> T9
T7 --> T9
T8 --> T9

T9 --> T10
T10 --> [*]

note left of T4 : Tâche critique (Temps fort)
note right of T7 : Composants RMI, JMS, SOAP
@enduml
```

---
### Commandes pour la compilation
Pour compiler ou re-visualiser les diagrammes ci-dessus :
- Rendez-vous sur le site officiel PlantUML [serveur de test](https://plantuml.com/fr/server).
- Ou bien installez l'extension pour VSCode nommée `PlantUML` avec un serveur local/java.
