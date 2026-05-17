# Figures du rapport LaTeX (`rapport_urbanops.tex`)

## Où enregistrer les fichiers (obligatoire)

**Dossier unique (même niveau que ce README) :**

`urbanops/docs/latex/figures/`

Chemin complet typique sous Windows :

`C:\Users\NOONE\CascadeProjects\urbanops\docs\latex\figures\`

- Enregistrez chaque image en **PNG** (ou PDF si vous adaptez le `.tex`) avec le **nom exact** indiqué (casse, tirets bas `_`).
- Après ajout des fichiers, recompilez depuis `docs/latex/` : `pdflatex rapport_urbanops.tex` **deux fois**.
- Si un fichier est absent : le PDF affiche un **cadre réservé** avec le nom attendu (pas d’erreur bloquante).

---

## Une seule « tawsira » (document final) — chno howa ?

- **Ma tdir** walu f fichier weḥed bach tjmع les captures : **rapport PDF** (`rapport_urbanops.pdf`) howa **weḥed** — fih ga3 chapitres + figures li **ytḥṭu** automatiquement ila PNG kaynin f `figures/`.
- **Chno nta tdir** : (1) ṣawer / sdder les images ; (2) smi b noms dyal tableau ; (3) ḥṭ f `docs/latex/figures/` ; (4) `pdflatex` juj merrat men `docs/latex/`.
- **Annexe** f PDF (figures et captures) + **`README_FIGURES.md`** : finhom **tartib** u **kifach** (détails).

---

## Ordre des captures (nabdou bih — session waḥda, backend mqeli)

Démarrer **une fois** : `mvn spring-boot:run` f `backend/` (terminal ma تسدّوش حتى تكمّل middleware). Ensuite **selon** :

| # | Fichier à enregistrer | Ach no tṣawer (b débt) |
|---|----------------------|------------------------|
| 1 | `swagger_ui.png` | Navigateur : Swagger UI → login → **Authorize** `Bearer …` → capture (bach yban JWT). |
| 2 | `jms_logs_terminal.png` | Men **Swagger** : `POST /incidents` (multipart, sévérité HIGH ou MEDIUM) → **Execute** → rje3 l terminal dyal Spring → capture logs `JMS PRODUCER` / `JMS CONSUMER`. |
| 3 | `rmi_client_demo.png` | Terminal **jdid** : `cd backend` → `java -cp target/classes ma.urbanops.rmi.RmiClientDemo` → capture sortie. |
| 4 | `soap_wsdl_browser.png` | Navigateur : URL WSDL (`…/soap/urbanops.wsdl`) → capture XML. |
| 5 | `soap_postman_response.png` | Postman : `POST …/soap` + body XML → capture **requête + réponse**. |

**Mbaad** (machi obligatoires f nfs session) : frontend (`landing_page.png`, …), JaCoCo, Sonar, diagrammes PlantUML — nfs tartib li bghiti, ma 3ndhomch dépendance 3la backend.

---

## Où chaque image apparaît dans le rapport

| Fichier | Partie du rapport |
|---------|-------------------|
| `gantt1.png` | Chapitre **III** — diagrammes |
| `pert1.png` | Chapitre **III** |
| `usecase1.png` | Chapitre **III** |
| `class_domaine1.png` | Chapitre **III** |
| `class_technique1.png` | Chapitre **III** |
| `composants1.png` | Chapitre **III** |
| `sequence_incident1.png` | Chapitre **III** |
| `swagger_ui.png` | Chapitre **IV** — middleware (juste après le tableau REST/JMS/RMI/SOAP) |
| `jms_logs_terminal.png` | Chapitre **IV** |
| `rmi_client_demo.png` | Chapitre **IV** |
| `soap_wsdl_browser.png` | Chapitre **IV** |
| `soap_postman_response.png` | Chapitre **IV** |
| `landing_page.png` | Chapitre **« Réalisation — Frontend »** (après l’extrait intercepteur) |
| `dashboard_capture.png` | Même chapitre |
| `map_incidents.png` | Même chapitre |
| `jacoco1.png` | Chapitre **Tests / qualité** |
| `sonarqube1.png` | Chapitre **Tests / qualité** |

---

## Comment faire les captures « middleware » (détail)

### `swagger_ui.png`

1. Démarrer le backend : `mvn spring-boot:run` dans `backend/`.
2. Ouvrir : `http://localhost:8080/api/v1/swagger-ui/index.html`
3. **auth-controller** → `POST /auth/login` → *Try it out* → corps JSON admin → **Execute** → copier le `token`.
4. Bouton **Authorize** → coller : `Bearer <votre_token>` → **Authorize** puis **Close**.
5. Optionnel : ouvrir **incident-controller** pour montrer un endpoint protégé.
6. Capture d’écran plein navigateur → enregistrer sous **`swagger_ui.png`**.

### `jms_logs_terminal.png`

1. Backend démarré ; terminal visible.
2. Avec JWT (Swagger ou Postman), **POST** `/incidents` (multipart) avec un incident **HIGH** ou **MEDIUM** pour déclencher la file.
3. Dans les logs Spring Boot, montrer les lignes type **`[JMS PRODUCER]`** puis **`[JMS CONSUMER]`** (et éventuellement e-mail).
4. Capture du terminal → **`jms_logs_terminal.png`**.

### `rmi_client_demo.png`

1. Backend démarré (registre RMI actif, port **1099**).
2. Compiler si besoin : `mvn compile` dans `backend/`.
3. Terminal : `java -cp target/classes ma.urbanops.rmi.RmiClientDemo` (adapter si votre IDE lance autrement).
4. Capture de la sortie (ping + classifications JSON) → **`rmi_client_demo.png`**.

### `soap_wsdl_browser.png`

1. Backend démarré.
2. Ouvrir dans le navigateur : `http://localhost:8080/api/v1/soap/urbanops.wsdl`
3. Capture montrant l’URL et le XML WSDL → **`soap_wsdl_browser.png`**.

### `soap_postman_response.png`

1. **POST** `http://localhost:8080/api/v1/soap`  
   Headers : `Content-Type: text/xml`, `SOAPAction: ""` (ou selon votre client).  
   Corps : enveloppe SOAP (ex. `getIncidentStatsRequest` — voir `RAPPORT_MIDDLEWARE.md` dans la racine du projet).
2. Capture montrant **requête + réponse XML** → **`soap_postman_response.png`**.

---

## Diagrammes (pas des screenshots d’appli)

| Fichier | Source |
|---------|--------|
| `gantt1.png` … `sequence_incident1.png` | Exporter depuis `docs/plantuml/*.puml` (ou `ALL_DIAGRAMMES_urbanops.puml`) avec PlantUML → enregistrer le PNG sous le nom attendu dans **`figures/`**. |

---

## Qualité (JaCoCo / Sonar)

| Fichier | Procédure |
|---------|-----------|
| `jacoco1.png` | Après `mvn verify`, ouvrir `backend/target/site/jacoco/index.html` → capture. |
| `sonarqube1.png` | Après analyse Sonar, capture du tableau de bord du projet **UrbanOps**. |

---

## Résumé

| Vous voulez… | Action |
|--------------|--------|
| Que l’image **s’affiche dans le PDF** | Mettre le fichier dans **`docs/latex/figures/`** avec le **bon nom**. |
| Savoir **où** dans le rapport | Voir le tableau « Où chaque image apparaît » ci-dessus (identique à l’annexe du `.tex`). |
| Savoir **comment** capturer | Suivre les sections Swagger / JMS / RMI / SOAP ci-dessus. |
