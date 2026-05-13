# Figures pour le rapport LaTeX

Placez ici les images exportées (PNG ou PDF recommandés). Noms attendus par `rapport_urbanops.tex` :

| Fichier | Contenu | Source suggérée |
|---------|---------|-----------------|
| `landing_page.png` | Capture page d’accueil UrbanOps | Navigateur |
| `gantt1.png` | Diagramme de Gantt | `docs/plantuml/01-gantt-urbanops.puml` → PlantText |
| `class_domaine1.png` | Classes domaine JPA | `02-class-domain.puml` |
| `class_technique1.png` | Classes techniques backend | `03-class-backend-technical.puml` |
| `usecase1.png` | Cas d’utilisation | `04-usecase-urbanops.puml` |
| `pert1.png` | Diagramme PERT | `05-pert-urbanops.puml` |
| `composants1.png` | Diagramme par composants | `06-component-urbanops.puml` |
| `sequence_incident1.png` | Séquence création incident | `07-sequence-create-incident.puml` |
| `sonarqube1.png` | Tableau de bord SonarQube | Capture d’écran |
| `jacoco1.png` | Rapport JaCoCo (couverture) | `backend/target/site/jacoco/index.html` → capture |

Compilation LaTeX depuis `docs/latex/` :

```bash
pdflatex rapport_urbanops.tex
pdflatex rapport_urbanops.tex
```

Si une image manque, ajoutez l’option `draft` à `graphicx` dans le préambule pour des cadres vides sans erreur fatale.
