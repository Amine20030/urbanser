# Diagrammes PlantUML — UrbanOps

Chaque fichier contient **un seul** diagramme (`@start...` … `@end...`) à coller dans [PlantText](https://www.planttext.com/) : ouvrir l’éditeur, remplacer le contenu, puis **Refresh** pour générer PNG/SVG/PDF.

| Fichier | Type |
|---------|------|
| `01-gantt-urbanops.puml` | Diagramme de Gantt (planning projet) |
| `02-class-domain.puml` | Diagramme de classes — **domaine métier** (JPA) |
| `03-class-backend-technical.puml` | Diagramme de classes — **couches techniques** backend |
| `04-usecase-urbanops.puml` | Diagramme de **cas d’utilisation** |
| `05-pert-urbanops.puml` | Réseau **PERT** (tâches + durées + dépendances) |
| `06-component-urbanops.puml` | Diagramme par **composants** |
| `07-sequence-create-incident.puml` | **Séquence** UML — création d’incident (bonus) |

Les diagrammes reflètent la logique décrite dans `docs/AI_PROJECT_CONTEXT.md` et le code sous `backend/src/main/java/ma/urbanops/`.

## Utilisation sur [PlantText](https://www.planttext.com/)

1. Ouvrir https://www.planttext.com/
2. Copier **tout** le contenu d’un fichier `.puml` (du `@start...` au `@end...` inclus).
3. Coller dans l’éditeur, puis **Refresh** (ou Alt+Enter sur Windows).
4. Exporter **PNG**, **SVG** ou **PDF** selon besoin pour le rapport LaTeX.

Si une erreur apparaît sur le **Gantt** (syntaxe selon version serveur), mettre à jour la ligne `printscale` ou retirer `note bottom` dans `01-gantt-urbanops.puml`.
