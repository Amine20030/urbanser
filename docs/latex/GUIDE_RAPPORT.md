# Guide complet — Rapport LaTeX UrbanOps (V2.0)

## 📋 Vue d'ensemble

Le rapport **rapport_urbanops_final.tex** est un document LaTeX professionnel complet contenant :

- ✅ **Page de garde** avec couleurs rouge et vert (AlertRed, SuccessGreen)
- ✅ **Dédicaces**, **Remerciements**, **Résumé**, **Abstract**
- ✅ **4 chapitres préambule** (I-IV) + **7 chapitres numérotés** (1-7)
- ✅ **4 middlewares détaillés** (REST, JMS, RMI, SOAP)
- ✅ **Tests unitaires JUnit5** avec code source
- ✅ **Couverture JaCoCo** et **SonarQube**
- ✅ **Tous les diagrammes UML** (Gantt, PERT, classes, séquence)
- ✅ **Cadres sans background** (juste contours), couleurs rouge/vert
- ✅ **Liste des figures**, **liste des tableaux**, **table des matières**
- ✅ **Bibliographie** professionnelle

---

## 🔧 Compilation du rapport

### Prérequis

```bash
# Installer TeX Live (Windows)
# https://www.tug.org/texlive/ ou via Chocolatey
choco install texlive

# Ou MiKTeX
choco install miktex
```

### Compilation (depuis `docs/latex/`)

```bash
cd docs/latex

# Compilation x2 (table des matières, références)
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex

# Résultat : rapport_urbanops_final.pdf ✅
```

ou via XeLaTeX pour meilleure gestion polices:

```bash
xelatex -interaction=nonstopmode rapport_urbanops_final.tex
xelatex -interaction=nonstopmode rapport_urbanops_final.tex
```

---

## 📸 Captures d'écran requises

Le rapport contient 7 emplacements pour **images/captures** qui **doivent être placées** dans `docs/latex/figures/` avec les noms **EXACTS** ci-dessous.

**Toutes les captures doivent être en PNG ou PDF, résolution ≥ 1200×800px**

### Liste des noms de fichier à créer

| # | Nom fichier | Contenu | Notes |
|---|---|---|---|
| 1 | `gantt_planning.png` | **Diagramme GANTT** — phases, jalons, durée | Exporter depuis PlantUML ou MS Project |
| 2 | `pert_taches.png` | **Diagramme PERT** — dépendances, chemins critiques | Exporter depuis PlantUML ou similaire |
| 3 | `uml_classes_metier.png` | **Diagramme classes UML** — User, Category, Incident, Alert | Modèle métier |
| 4 | `uml_classes_technique.png` | **Diagramme classes UML** — Controller, Service, Repository | Couches techniques |
| 5 | `uml_cas_usage.png` | **Diagramme cas d'utilisation** — acteurs, scénarios | Citoyens, admins, système |
| 6 | `uml_composants.png` | **Diagramme composants** — modules, interfaces, dépendances | Middleware + couches |
| 7 | `uml_sequence_incident.png` | **Diagramme séquence** — création incident avec IA et alerte | Montrer appel Gemini, repli, EmailService async |
| 8 | `landing_page_screenshot.png` | **Screenshot** — Page d'accueil du site (Next.js) | État accueil + boutons auth |
| 9 | `dashboard_screenshot.png` | **Screenshot** — Tableau de bord admin/citoyen | KPI, graphiques Recharts |
| 10 | `map_interactive_screenshot.png` | **Screenshot** — Carte Leaflet interactive | Incidents visibles, popup info |
| 11 | `jacoco_report_screenshot.png` | **Screenshot** — Rapport JaCoCo (couverture) | Depuis `target/site/jacoco/index.html` |
| 12 | `sonarqube_dashboard_screenshot.png` | **Screenshot** — Tableau de bord SonarQube | Projet, indicateurs qualité |

---

## ✨ Caractéristiques du rapport

### Couleurs (définis en haut du .tex)

```latex
\definecolor{UrbanBlue}{HTML}{1E3A5F}        % Bleu foncé (titres, contours)
\definecolor{AlertRed}{HTML}{DC2626}         % ROUGE vif (alertes HIGH)
\definecolor{SuccessGreen}{HTML}{16A34A}     % VERT foncé (succès, RESOLVED)
\definecolor{UrbanAccent}{HTML}{2563EB}      % Bleu accent (sections)
```

### Cadres sans background

Tous les `tcolorbox` utilisent `colback=white` — **juste les contours colorés**:

```latex
\newtcolorbox{resumebox}{
  enhanced,
  colback=white,           % ← PAS de remplissage
  colframe=UrbanBlue,      % ← Juste le contour
  boxrule=0.6pt,
  ...
}
```

### Tableaux et listes

- Utilise `booktabs` pour lignes professionnelles
- Colonnes alignées, espacement uniforme
- `longtable` pour tableaux multi-pages
- Listes avec `enumitem` (espacements optimisés)

---

## 📖 Structure du rapport

### Partie préliminaire (pages i, ii, iii, …)

```
Dédicaces → Remerciements → Résumé → Abstract
→ List abréviations → List figures → List tableaux → Table matières
```

### Chapitres de préambule (romains I–IV)

| Chapitre | Sujet |
|----------|-------|
| **I** | Cadre général, enjeux, objectifs PFE |
| **II** | Analyse besoins détaillée, specs fonctionnelles/non-fonctionnelles |
| **III** | Conception UML, architecture 3-tiers, entités JPA |
| **IV** | Stack technique, 4 middlewares, technologies JUnit/JaCoCo/SonarQube |

### Chapitres de corps (arabes 1–7)

| # | Titre | Contenu |
|---|-------|---------|
| 1 | Introduction | Problématique, méthodologie, plan |
| 2 | Backend et persistance | Controllers, services, repositories, schéma PostgreSQL |
| 3 | Frontend et intégration | Next.js, Axios, composants React, captures |
| 4 | Sécurité, IA, middlewares | JWT/BCrypt, Gemini, REST/JMS/RMI/SOAP détails |
| 5 | Tests et qualité | JUnit5, Mockito, JaCoCo, SonarQube |
| 6 | Déploiement | Lancement dev, Actuator, .env |
| 7 | Conclusion | Synthèse, difficultés, perspectives futures |

### Annexes (A, B, C, D)

| Annexe | Contenu |
|--------|---------|
| **A** | Endpoints REST complets (table) |
| **B** | Configuration exemple (application.properties, .env) |
| **C** | Guide export PlantUML |
| **D** | Checklist captures d'écran |

---

## 🎯 Comment remplir les sections "À remplir"

### Page de garde

```latex
% Ligne 236-240 — À adapter
Auteur(s) :     & [Votre nom] et coauteurs \\
Encadrant(e) :  & [Nom professeur] \\
Technologies :  & Spring Boot~3.2, Next.js~14, PostgreSQL, Gemini, JWT \\
Année :         & 2025 – 2026 \\
```

### Dédicaces et Remerciements

- **Lignes 256-266** : Dédicaces (texte libre)
- **Lignes 273-276** : Remerciements (noms encadrants, jury, merci orgs)

---

## 🖼️ Intégration des images

### Méthode automatique

1. Créer dossier `docs/latex/figures/`
2. Placer **PNG/PDF** avec **noms exacts** du tableau ci-dessus
3. Recompiler LaTeX — images s'incrustent automatiquement

### Si image manquante

Le rapport affiche un **cadre bleu** avec :
- Nom fichier attendu
- Légende textuelle
- Instruction "Insérer image"

Cela permet de compiler même si captures non faites.

---

## 🔍 Vérification avant impression

### Checklist pré-soumission

- [ ] Toutes les captures PNG/PDF en `figures/`
- [ ] Table des matières à jour (page ii)
- [ ] List figures et tableaux corrects (pages iii–iv)
- [ ] Numérotation chapitres cohérente (I–IV, puis 1–7)
- [ ] En-têtes/pieds cohérents sur toutes pages
- [ ] Pas d'erreurs LaTeX ou `?` dans références
- [ ] PDF généré sans warning (compil x2)
- [ ] Couleurs rouge/vert visible (texte et cadres)
- [ ] Liens PDF fonctionnels (cliques sur TOC)

### Commande de vérification totale

```bash
cd docs/latex

# Nettoyer anciennes builds
rm -f *.aux *.log *.toc *.out *.lof *.lot

# Recompiler x2
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex 2>&1 | grep -i error
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex 2>&1 | grep -i error

# Vérifier PDF généré
file rapport_urbanops_final.pdf
```

---

## 📧 Livrable final

```
docs/latex/
├── rapport_urbanops_final.tex          ← Source LaTeX
├── rapport_urbanops_final.pdf          ← PDF compilé
├── figures/
│   ├── gantt_planning.png              ← À générer
│   ├── pert_taches.png                 ← À générer
│   ├── uml_classes_metier.png          ← À générer
│   ├── [... 9 fichiers PNG/PDF ...]    ← À générer
│   └── sonarqube_dashboard_screenshot.png
└── GUIDE_RAPPORT.md                    ← Ce fichier
```

---

## 🚀 Optimisations futures

1. **Annexe GitHub** : Code complet dans dossier séparé référencé
2. **Bibliographie BibTeX** : `.bib` file pour citations automatisées
3. **Index** : `\printindex` pour index termes techniques
4. **Données en temps réel** : Scripts Python pour générer tables de stats
5. **CI/CD** : Pipeline automatique LaTeX → PDF à chaque push

---

## 📞 Support

- **Compilation issue** : Vérifier installation TeX Live / MiKTeX
- **Images manquantes** : Placer PNG/PDF avec noms **exacts** dans `figures/`
- **Erreurs LaTeX** : Vérifier balises `{`, `}`, `\` non échappées
- **PDF vide** : Recompiler x2 (table des matières, références)

Bon rapport ! 🎓
