# Diagrammes PlantUML — UrbanOps

## StarUML vs PlantUML

**StarUML** (`.mdj`) ne compile **pas** le langage texte ci-dessous. Pour obtenir les images à partir du **code**, utilisez **PlantUML** ([plantuml.com](https://plantuml.com/)), l’extension **PlantUML** dans VS Code/Cursor, ou [PlantText](https://www.planttext.com/).

Pour **tout le code dans un seul fichier** (export en lot avec `plantuml.jar`) : **`ALL_DIAGRAMMES_urbanops.puml`**.

---

Chaque fichier `0x-*.puml` contient **un seul** diagramme (`@start...` … `@end...`) à coller dans [PlantText](https://www.planttext.com/) : ouvrir l’éditeur, remplacer le contenu, puis **Refresh** pour générer PNG/SVG/PDF.

| Fichier | Type |
|---------|------|
| `01-gantt-urbanops.puml` | Diagramme de Gantt (planning projet) |
| `02-class-domain.puml` | Diagramme de classes — **domaine métier** (JPA) |
| `03-class-backend-technical.puml` | Diagramme de classes — **couches techniques** backend |
| `04-usecase-urbanops.puml` | Diagramme de **cas d’utilisation** |
| `05-pert-urbanops.puml` | Réseau **PERT** (tâches + durées + dépendances) |
| `06-component-urbanops.puml` | Diagramme par **composants** |
| `07-sequence-create-incident.puml` | **Séquence** UML — création d’incident (bonus) |
| `ALL_DIAGRAMMES_urbanops.puml` | **Les 7 diagrammes** concaténés (compilation PlantUML en lot) |

Les diagrammes reflètent la logique décrite dans `docs/AI_PROJECT_CONTEXT.md` et le code sous `backend/src/main/java/ma/urbanops/`.

### Compilation en ligne de commande (exemple)

```bash
cd docs/plantuml
java -jar plantuml.jar ALL_DIAGRAMMES_urbanops.puml
```

(Adaptez le chemin vers `plantuml.jar` ou utilisez l’exécutable `plantuml` selon votre installation.)

## Utilisation sur [PlantText](https://www.planttext.com/)

1. Ouvrir https://www.planttext.com/
2. Copier **tout** le contenu d’un fichier `.puml` (du `@start...` au `@end...` inclus).
3. Coller dans l’éditeur, puis **Refresh** (ou Alt+Enter sur Windows).
4. Exporter **PNG**, **SVG** ou **PDF** selon besoin pour le rapport LaTeX.

Si une erreur apparaît sur le **Gantt** (syntaxe selon version serveur), mettre à jour la ligne `printscale` ou retirer `note bottom` dans `01-gantt-urbanops.puml`.
