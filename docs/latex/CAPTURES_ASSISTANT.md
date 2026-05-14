# 📸 Checklist Captures d'écran — UrbanOps Rapport

**Tous les fichiers doivent aller dans:** `docs/latex/figures/`

**Format:** PNG ou PDF, résolution min 1200×800px

---

## 🔵 Diagrammes UML à exporter (PlantUML ou outil similaire)

### 1️⃣ Diagramme GANTT
- **Nom:** `gantt_planning.png`
- **Contenu:** Phases du projet, jalons, durées estimées
- **Exemple:** Phases 1-8, timelines, ressources
- **Outil:** PlantUML, MS Project, ou GanttProject
- **Générer depuis:**
  ```
  @startuml gantt_planning
  ganttDiagram
  title UrbanOps — Planning GANTT
  ...
  @enduml
  ```

### 2️⃣ Diagramme PERT
- **Nom:** `pert_taches.png`
- **Contenu:** Tâches, dépendances, cheminement critique
- **Acteur(s):** Backend, Frontend, Tests, Déploiement
- **Générer depuis:** PlantUML avec `@startuml`

### 3️⃣ Classes métier (UML)
- **Nom:** `uml_classes_metier.png`
- **Contenu:** User, Category, Sector, Incident, Alert et leurs associations
- **Cardinalités:** Montrer 1–*, 0..*
- **Attributs:** id, name, status, etc.

### 4️⃣ Classes techniques (UML)
- **Nom:** `uml_classes_technique.png`
- **Contenu:** IncidentController, IncidentService, IncidentRepository
- **Couches:** Controller → Service → Repository
- **Montrer:** Dépendances entre couches

### 5️⃣ Cas d'utilisation (UML)
- **Nom:** `uml_cas_usage.png`
- **Contenu:** Acteurs (Citoyen, Admin, Système), cas d'usage (Signaler, Consulter, Alerter)
- **Include/Extend:** Relations entre cas

### 6️⃣ Composants (UML)
- **Nom:** `uml_composants.png`
- **Contenu:** Frontend, Backend, Middlewares (REST, JMS, RMI, SOAP), Database
- **Interfaces:** Montre les connecteurs

### 7️⃣ Séquence création incident (UML)
- **Nom:** `uml_sequence_incident.png`
- **Contenu:**
  - Citoyen → Frontend → Backend (POST /incidents)
  - Backend → Gemini (classification IA) + Fallback
  - Backend → DB (save)
  - Service → EmailService → SMTP (alerte)
  - JMS si activé

---

## 🎨 Captures d'écran de l'application

### 8️⃣ Page d'accueil (Landing)
- **Nom:** `landing_page_screenshot.png`
- **Où:** Navigateur → `http://localhost:3000/`
- **Contenu:** Logo UrbanOps, titre, boutons [Connexion] [Inscription] [Je signale]
- **À faire:**
  ```bash
  # 1. Démarrer frontend
  cd frontend && npm run dev
  # 2. Ouvrir http://localhost:3000
  # 3. Prendre screenshot de la page d'accueil
  # 4. Enregistrer sous docs/latex/figures/landing_page_screenshot.png
  ```

### 9️⃣ Tableau de bord (Dashboard)
- **Nom:** `dashboard_screenshot.png`
- **Où:** `http://localhost:3000/dashboard`
- **Contenu:** KPI (nombre incidents, sévérités), graphiques Recharts (tendances), derniers incidents
- **À faire:**
  ```bash
  # 1. S'authentifier (créer compte test si besoin)
  # 2. Naviguer à /dashboard
  # 3. Attendre chargement données
  # 4. Prendre screenshot
  # 5. Sauvegarder dans figures/
  ```

### 🔟 Carte interactive (Leaflet)
- **Nom:** `map_interactive_screenshot.png`
- **Où:** `http://localhost:3000/map`
- **Contenu:** Carte avec épingles d'incidents, popup au survol/clic
- **Couleurs:** Points rouges (HIGH), orange (MEDIUM), vert (LOW)
- **À faire:**
  ```bash
  # 1. Naviguer à /map
  # 2. Vérifier 2-3 incidents visibles sur carte
  # 3. Prendre screenshot avec incidents visibles
  ```

### 1️⃣1️⃣ Rapport JaCoCo (Couverture)
- **Nom:** `jacoco_report_screenshot.png`
- **Où:** `target/site/jacoco/index.html` (après `mvn clean verify`)
- **Contenu:** Vue d'ensemble couverture (%), package breakdown, couleurs rouge/vert
- **À faire:**
  ```bash
  # 1. Backend
  cd backend
  mvn clean verify

  # 2. Ouvrir rapport
  # (Windows) start target/site/jacoco/index.html
  # (Mac/Linux) open target/site/jacoco/index.html

  # 3. Prendre screenshot de la page d'accueil
  # (Affiche tableau avec % couverture par package)

  # 4. Sauvegarder dans docs/latex/figures/jacoco_report_screenshot.png
  ```

### 1️⃣2️⃣ Tableau de bord SonarQube
- **Nom:** `sonarqube_dashboard_screenshot.png`
- **Où:** `http://localhost:9000` (après analyse SonarQube)
- **Contenu:** Projet UrbanOps, indicateurs qualité, bugs/vulnérabilités, couverture
- **À faire:**
  ```bash
  # 1. Démarrer SonarQube (Docker ou natif)
  # docker run -d -p 9000:9000 sonarqube

  # 2. Accéder http://localhost:9000 (admin/admin par défaut)

  # 3. Lancer analyse
  cd backend
  mvn clean verify sonar:sonar \
    -Dsonar.projectKey=ma.urbanops:backend \
    -Dsonar.host.url=http://localhost:9000 \
    -Dsonar.login=squ_XXXXXXXXXXXX

  # 4. Retourner à SonarQube, attendre traitement (1-2 min)

  # 5. Cliquer sur le projet "ma.urbanops:backend"

  # 6. Prendre screenshot du dashboard
  #    (Affiche Overview, Reliability, Security, etc.)

  # 7. Sauvegarder dans figures/sonarqube_dashboard_screenshot.png
  ```

---

## ✅ Ordre de réalisation recommandé

1. **Diagrammes UML** d'abord (prennent plus de temps)
2. **Captures app** (avec données réelles)
3. **JaCoCo** (tests doivent passer)
4. **SonarQube** (analyse qualité)

---

## 📋 Checklist finale

```markdown
- [ ] gantt_planning.png              ✅ FAIT
- [ ] pert_taches.png                ✅ FAIT
- [ ] uml_classes_metier.png         ✅ FAIT
- [ ] uml_classes_technique.png      ✅ FAIT
- [ ] uml_cas_usage.png              ✅ FAIT
- [ ] uml_composants.png             ✅ FAIT
- [ ] uml_sequence_incident.png      ✅ FAIT
- [ ] landing_page_screenshot.png    ✅ FAIT
- [ ] dashboard_screenshot.png       ✅ FAIT
- [ ] map_interactive_screenshot.png ✅ FAIT
- [ ] jacoco_report_screenshot.png   ✅ FAIT
- [ ] sonarqube_dashboard_screenshot.png ✅ FAIT

TOTAL: 12 fichiers à générer
```

---

## 🎬 Automatisation possible

```bash
#!/bin/bash
# Script pour créer dossier et vérifier fichiers

FIGURES_DIR="docs/latex/figures"
mkdir -p "$FIGURES_DIR"

required_files=(
  "gantt_planning.png"
  "pert_taches.png"
  "uml_classes_metier.png"
  "uml_classes_technique.png"
  "uml_cas_usage.png"
  "uml_composants.png"
  "uml_sequence_incident.png"
  "landing_page_screenshot.png"
  "dashboard_screenshot.png"
  "map_interactive_screenshot.png"
  "jacoco_report_screenshot.png"
  "sonarqube_dashboard_screenshot.png"
)

echo "📋 Vérification fichiers figures..."
for file in "${required_files[@]}"; do
  if [ -f "$FIGURES_DIR/$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (manquant)"
  fi
done
```

Sauvegarde dans: `docs/check_figures.sh`
Lancer: `bash docs/check_figures.sh`

---

## 💾 Après avoir créé les captures

```bash
# Vérifier que tous les fichiers sont là
ls -lh docs/latex/figures/

# Recompiler le rapport
cd docs/latex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex

# 🎉 Rapport final prêt : rapport_urbanops_final.pdf
```

---

**Status:** Les 12 fichiers images sont maintenant listés individuellement.
**Prochaine étape:** Générer chaque fichier selon les instructions ci-dessus, puis recompiler LaTeX. ✅
