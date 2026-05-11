# ╔══════════════════════════════════════════════════════════════╗
# ║                    SCRUM BACKLOG — URBANOPS                 ║
# ╚══════════════════════════════════════════════════════════════╝

## PRODUCT BACKLOG (User Stories)

| ID | Points | Description |
|----|--------|-------------|
| US-001 | 8pts | En tant que citoyen, je veux signaler un problème avec photo + description + localisation |
| US-002 | 5pts | En tant que citoyen, je veux suivre le statut de mon signalement |
| US-003 | 5pts | En tant que citoyen, je veux m'inscrire et me connecter |
| US-004 | 8pts | En tant qu'admin, je veux voir tous les incidents sur une carte en temps réel |
| US-005 | 5pts | En tant qu'admin, je veux filtrer les incidents par catégorie, sévérité, secteur, statut |
| US-006 | 8pts | En tant que système, je veux analyser la photo et le texte pour détecter la catégorie et la criticité (IA) |
| US-007 | 5pts | En tant que système, je veux envoyer une alerte email à l'autorité compétente automatiquement |
| US-008 | 5pts | En tant qu'admin, je veux voir le tableau de bord avec statistiques en temps réel |
| US-009 | 3pts | En tant qu'admin, je veux exporter les rapports |
| US-010 | 3pts | En tant que système, je veux historiser tous les incidents et alertes |

---

## SPRINT 1 — FONDATIONS (Semaine 1-2)

**Goal:** Infrastructure, authentification, CRUD incidents de base

**Stories:** US-003, US-001 (partiel), US-010

### Tasks:
- [ ] Setup Spring Boot project + PostgreSQL
- [ ] Entités JPA: User, Incident, Alert, Category, Sector
- [ ] Repositories + Services + Controllers
- [ ] Endpoints Auth (register/login/JWT)
- [ ] Endpoints Incidents (CRUD complet)
- [ ] Tests unitaires: UserService, IncidentService
- [ ] Configuration JaCoCo + SonarQube

---

## SPRINT 2 — LOGIQUE MÉTIER (Semaine 3-4)

**Goal:** IA classification, alertes, filtrage avancé

**Stories:** US-002, US-005, US-006, US-007

### Tasks:
- [ ] Endpoint AI analysis (Gemini API integration)
- [ ] Service AlertRouting (logique de routage par autorité)
- [ ] Service EmailService (JavaMailSender)
- [ ] Endpoints Alertes (CRUD + filtres)
- [ ] Endpoints Stats (tableau de bord)
- [ ] Tests unitaires: AlertService, AIAnalysisService, EmailService

---

## SPRINT 3 — QUALITÉ ET FINALISATION (Semaine 5-6)

**Goal:** Tests complets, qualité code, rapport SonarQube, frontend

**Stories:** US-004, US-008, US-009

### Tasks:
- [ ] Compléter couverture tests JUnit 5 (objectif: >80%)
- [ ] Rapport JaCoCo complet
- [ ] Analyse SonarQube (0 blocker, 0 critical)
- [ ] Frontend Next.js complet
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Rapport technique final
