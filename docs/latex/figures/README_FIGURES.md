# Figures du rapport UrbanOps

Placez vos captures et diagrammes dans ce dossier (`docs/latex/figures/`).
Le rapport les charge automatiquement via `\urbanfig{nom_fichier.png}`.

## Fichiers attendus

| Fichier | Description |
|---------|-------------|
| `diagramme_gantt.png` | Diagramme de Gantt du projet |
| `diagramme_perte.png` | Diagramme PERT / réseau |
| `wbs_arborescent.png` | WBS arborescent condensé |
| `diagramme_cas_utilisation.png` | Diagramme de cas d'utilisation |
| `diagramme_classes.png` | Diagramme de classes |
| `landing_page.png` | Page d'accueil |
| `formulaire_inscription.png` | Formulaire d'inscription |
| `ecran_connexion.png` | Écran de connexion |
| `tableau_bord_admin.png` | Tableau de bord administrateur |
| `tableau_bord_user.png` | Tableau de bord citoyen |
| `vue_analytique.png` | Vue analytique / statistiques |
| `sonarcloud_quality_gate.png` | SonarCloud — Quality Gate |
| `sonarcloud_issues.png` | SonarCloud — Issues |
| `sonarcloud_duplication.png` | SonarCloud — Duplication |
| `sonarcloud_securite.png` | SonarCloud — Sécurité |
| `jacoco_couverture.png` | (optionnel) Rapport JaCoCo |

Formats acceptés : `.png`, `.jpg`, `.pdf` (adapter l'extension dans `rapport.tex` si besoin).

## Compilation

```bash
cd docs/latex
pdflatex rapport.tex
pdflatex rapport.tex
```
