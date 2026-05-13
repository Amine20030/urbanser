# Rapport LaTeX — UrbanOps

## Fichier principal

- **`rapport_urbanops.tex`** — rapport complet (page de garde, résumé, abstract, listes, TOC, chapitres I–IV, introduction chapitre 1, corps, annexes).

## Compilation (2 passes pour la table des matières et les références)

Avec **TeX Live** ou **MiKTeX** (Windows). Le préambule utilise **tcolorbox**, **listings**, **tocloft**, **tabularx** : installez les collections « complètes » si des packages manquent.

```bash
cd docs/latex
pdflatex -interaction=nonstopmode rapport_urbanops.tex
pdflatex -interaction=nonstopmode rapport_urbanops.tex
```

**XeLaTeX** (UTF-8 étendu, polices système) :

```bash
xelatex -interaction=nonstopmode rapport_urbanops.tex
xelatex -interaction=nonstopmode rapport_urbanops.tex
```

**latexmk** :

```bash
latexmk -pdf rapport_urbanops.tex
```

## Figures

1. Exporter vos diagrammes PlantUML (voir `docs/plantuml/`) en **PNG** (ou PDF).
2. Les enregistrer dans `docs/latex/figures/` avec les noms listés dans `figures/README_FIGURES.md`.
3. Les `\urbanfig{...}{figures/nom.png}{...}{...}` du `.tex` incluent automatiquement le fichier s’il existe ; sinon un **cadre gris** « emplacement réservé » s’affiche (sans erreur fatale).

## Numérotation

- Pages **i, ii, iii, …** (`\frontmatter`) : dédicaces, remerciements, résumé, abstract, abréviations, listes, table des matières.
- Pages **1, 2, 3, …** (`\mainmatter`) : d’abord les chapitres **I à IV** (titres en **chiffres romains** dans le corps et la TOC, via `\ChapterRoman`), puis **Chapitre 1 — Introduction** et la suite en **chiffres arabes** (2, 3, …) — `\setcounter{chapter}{0}` puis `\chapter{Introduction}` assure que l’introduction est bien le **chapitre 1**.

## Personnalisation rapide

- Page de garde : bloc `titlepage` (institution, auteurs, encadrant).
- Option figures manquantes : décommenter `\usepackage[draft]{graphicx}` dans le préambule (remplacer la ligne `graphicx` normale).
