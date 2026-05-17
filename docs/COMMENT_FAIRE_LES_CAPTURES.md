# Guide : Comment prendre les bonnes captures pour votre rapport LaTeX

Suivez ces instructions pour capturer exactement ce qu'il faut afin d'avoir un rapport super professionnel ! Tous les fichiers `.png` doivent être placés dans `docs/latex/figures/`.

## 1. Captures Frontend (UI)
- **`landing_page_screenshot.png`** : Lancez votre application Next.js (`npm run dev`), allez sur `http://localhost:3000` en plein écran. Prenez un screenshot de la jolie page d'accueil d'UrbanOps.
- **`dashboard_screenshot.png`** : Connectez-vous sur votre application, allez dans la vue Dashboard avec le tableau des KPIs et statuts chiffrés. Prenez un screenshot.
- **`map_interactive_screenshot.png`** : Allez sur la page où la carte s'affiche. Prenez de préférence en plein écran pour qu'on voie bien la carte Leaflet et les petits marqueurs !

## 2. Captures Middlewares
- **`postman_rest.png`** : 
   - Lancez Spring Boot. Ouvrez *Swagger* (`http://localhost:8080/api/v1/swagger-ui/index.html`) ou *Postman*.
   - Dépliez la route `GET /api/v1/incidents`. Cliquez sur *Try it out* puis sur Execute. Prenez en capture la réponse JSON (le statut 200).
- **`soapUI_test.png`** :
   - Ouvrez Postman, configurez une requête `POST` sur `http://localhost:8080/api/v1/soap`.
   - Dans le Headers : `Content-Type: text/xml`. Dans le Body (Raw XML), faites une fausse enveloppe `<soapenv:Envelope>...`
   - Capturez l'écran de la réponse XML reçue.

## 3. Captures Qualité (JaCoCo & Sonar)
- **`jacoco_report.png`** :
   - Dans le terminal de votre backend, lancez la commande : `mvn clean test jacoco:report`
   - Un dossier va se créer dans `backend/target/site/jacoco/`.
   - Allez chercher le fichier `index.html` situé à l'intérieur, et ouvrez-le avec Chrome ou Edge.
   - Vous verrez de belles barres vertes et rouges de pourcentage. Faites-en une capture !
- **`sonarqube_dashboard.png`** : 
   - Si vous avez installé SonarQube, connectez-vous sur `localhost:9000` et prenez votre tableau de bord en capture. 
   - (Si vous n'en avez pas, vous pouvez simplement effacer le bloc `\urbanfig{fig:sonar}...` de votre `.tex`).

## 4. Générer les Diagrammes UML
Allez voir le dossier `docs/plantuml/`. Je vous y ai créé les codes des diagrammes. Vous pouvez soit installer l'extension "PlantUML" dans VSCode pour les exporter en PNG, soit aller sur [PlantText.com](https://www.planttext.com/) et coller le code, puis enregistrer l'image avec le bon nom !
