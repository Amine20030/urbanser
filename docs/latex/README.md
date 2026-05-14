# 📗 Rapport LaTeX — UrbanOps (V2.0 complet)

> **✅ Prêt à compiler** — Rapport professionnel complet avec tous les contenus.

## 📌 Fichiers principaux

| Fichier | Description |
|---------|-------------|
| **`rapport_urbanops_final.tex`** (836 lignes) | ✅ Rapport complet, structuré, avec 4 middlewares, tests, SonarQube |
| **`GUIDE_RAPPORT.md`** | 📖 Guide détaillé : compilation, contenu, structure |
| **`CAPTURES_ASSISTANT.md`** | 📸 Instructions pour générer les 12 captures/diagrammes |
| **`check_figures.sh`** | ✅ Vérifie tous les fichiers figures présents |

## 🚀 Compilation rapide (2 passes)

Avec **TeX Live** ou **MiKTeX**.

```bash
cd docs/latex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex
# → rapport_urbanops_final.pdf ✅
```

**Alternative XeLaTeX** (UTF-8 natif) :
```bash
xelatex -interaction=nonstopmode rapport_urbanops_final.tex
xelatex -interaction=nonstopmode rapport_urbanops_final.tex
```

**Avec latexmk** (automatique) :
```bash
latexmk -pdf rapport_urbanops_final.tex
```

## 📸 Figures requises (12 fichiers)

Créer dossier `figures/` et y placer 12 fichiers PNG/PDF avec noms exacts :

```bash
mkdir -p docs/latex/figures
# → Placer 12 fichiers (voir CAPTURES_ASSISTANT.md)
bash check_figures.sh  # Vérifier tous présents ✅
```

**Noms requis :**
```
gantt_planning.png, pert_taches.png, uml_classes_metier.png,
uml_classes_technique.png, uml_cas_usage.png, uml_composants.png,
uml_sequence_incident.png, landing_page_screenshot.png,
dashboard_screenshot.png, map_interactive_screenshot.png,
jacoco_report_screenshot.png, sonarqube_dashboard_screenshot.png
```

## 🎨 Présentation du rapport

✅ **`rapport_urbanops_final.tex`** inclut :
- Page de garde avec **couleurs rouge/vert** (AlertRed, SuccessGreen, UrbanBlue)
- Dédicaces, Remerciements, Résumé (FR), Abstract (EN)
- Liste abréviations, **TOC**, **List of Figures**, **List of Tables**
- **Chapitres I–IV** (romains) : cadre, besoins, conception, technologies
- **Chap. 1–7** (arabes) : intro, backend, frontend, sécurité/IA/middlewares, tests, déploiement, conclusion
- **Annexes A–D** : endpoints, config, PlantUML, captures
- **Bibliographie** (17 références)
- **Cadres sans remplissage** : fond blanc, juste bordures colorées ✅

## ✨ Caractéristiques spéciales

| Aspect | Détail |
|--------|--------|
| **Couleurs** | AlertRed, SuccessGreen, UrbanBlue, UrbanAccent |
| **Cadres** | `tcolorbox` — fond blanc, contours uniquement |
| **Tableaux** | `booktabs` (pro), `longtable` (multi-pages) |
| **Code** | `listings` — Java, SQL, Bash, TypeScript colorisés |
| **Références** | TOC, LOF, LOT auto-générées, liens PDF cliquables |
| **Numérotation** | Pages i,ii,…,v puis 1,2,…,20+ (chapitres I–IV + arabes) |
| **Réfs croisées** | `\cref`, `\label`, `\ref` pour renvois automatiques |

## 📋 Contenu du rapport (vue globale)

### Préambule (pages i–v)
Dédicaces → Remerciements → Résumé → Abstract → Abréviations → TOC/LOF/LOT

### Chapitres structurés
- **Chapitres I–IV** : Préambule contextuel (cadre, besoins, conception, technos)
- **Chapitres 1–7** : Corps (intro, backend, frontend, sécurité/IA, tests, déploiement, conclusion)

### Annexes
- **A** : REST endpoints (table)
- **B** : Configuration exemple
- **C** : Guide PlantUML
- **D** : Checklist captures

## 🔄 Workflow complet

```bash
# 1. Créer dossier figures
mkdir -p docs/latex/figures

# 2. Générer 12 captures (voir CAPTURES_ASSISTANT.md)
#    → Landing, Dashboard, Map, Diagrammes UML, JaCoCo, SonarQube

# 3. Vérifier tous les fichiers
bash check_figures.sh  # ✅ ou ❌

# 4. Compiler LaTeX x2
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex
pdflatex -interaction=nonstopmode rapport_urbanops_final.tex

# 5. Ouvrir PDF
start rapport_urbanops_final.pdf  # Windows
# ou
open rapport_urbanops_final.pdf   # Mac/Linux
```

## 🛠️ Troubleshooting

| Problème | Solution |
|----------|----------|
| Compilation échoue | Vérifier installation TeX Live/MiKTeX, packages complets |
| Images manquantes | Placer PNG/PDF dans `figures/`, noms exacts, lancer `check_figures.sh` |
| TOC vide | Compiler 2 fois (nécessaire pour références) |
| Couleurs absentes | Vérifier `\hypersetup{colorlinks=true}` dans préambule |
| Erreurs LaTeX | Chercher ligne mentionnée dans `.tex`, caractères spéciaux échappés |

## 📖 Documents complémentaires

- **GUIDE_RAPPORT.md** → Détails complets, structure détaillée, contenu par chapitre
- **CAPTURES_ASSISTANT.md** → Instructions précises pour chaque capture (12 fichiers)
- **check_figures.sh** → Vérification automatique présence fichiers

## 📞 Support

Consulter les fichiers `.md` du dossier ou encadrant pédagogique.

---

**✅ Version 2.0** — Prêt pour PFE/Mémoire/Stage. **Bon rapport !** 🎓
