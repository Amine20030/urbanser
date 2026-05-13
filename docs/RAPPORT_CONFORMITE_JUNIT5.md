# Rapport de conformité — Tests unitaires JUnit 5 (UrbanOps)

**Date de vérification :** 11 mai 2026  
**Référence pédagogique :** critères type cours (Pr. ESSABBAR) — définition tests unitaires, JUnit 5 `org.junit.jupiter`, assertions, classes d’équivalence, Mockito, JaCoCo.  
**Périmètre :** `backend/src/test/java/`, `backend/pom.xml`, exécution `mvn test`.

---

## Synthèse exécutive

| Critère « professeur » (script / checklist) | Statut |
|---------------------------------------------|--------|
| ≥ 7 classes `*Test.java` (5 services + 2 controllers) | **Non** — **5** classes seulement |
| JUnit 5 (`org.junit.jupiter`) partout, pas JUnit 4 | **Oui** |
| ≥ 20 méthodes `@Test` | **Oui** (≈ **34** méthodes annotées `@Test`, dont **2** `@Disabled`) |
| Assertions variées (≥ 30 au projet) | **Oui** (≈ **70+** appels `assert*` / `assertThrows`) |
| `@BeforeEach` / cycle de vie | **Partiel** — `@BeforeEach` présent ; `@AfterEach` surtout sur `IncidentServiceTest` |
| Mockito (`@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`, `when`/`verify`) | **Partiel** — **4/5** classes ; `AIAnalysisServiceTest` utilise `MockitoAnnotations.openMocks` sans extension Jupiter Mockito |
| `mvn test` sans erreur | **Non** — échec en **compilation** du code **principal** (sources manquantes : `UserService`, `StatsResponse`, etc.), les tests ne sont pas atteints |
| JaCoCo configuré + objectif couverture | **Oui** (plugin 0.8.11, règle ~80 % sur le code couvert — non vérifiable tant que `mvn verify` ne compile pas) |

**Verdict global par rapport à la grille « CONFORME si score ≥ 24/30 » du prompt utilisateur :** le projet est **partiellement conforme** sur le **style JUnit 5 / assertions / Mockito sur une majorité de tests**, mais **non conforme** sur la **structure minimale (7 classes)**, sur **l’homogénéité Mockito**, et sur **l’exécution Maven** dans l’état actuel du dépôt.

---

## 1. Structure des tests

### 1.1 Arborescence observée

```
backend/src/test/java/ma/urbanops/
├── controller/
│   └── AuthControllerTest.java
└── service/
    ├── AIAnalysisServiceTest.java
    ├── IncidentServiceTest.java
    ├── StatsServiceTest.java
    └── UserServiceTest.java
```

### 1.2 Comparaison avec la structure attendue

| Fichier attendu | Présent |
|-----------------|---------|
| `service/IncidentServiceTest.java` | Oui |
| `service/UserServiceTest.java` | Oui |
| `service/AlertServiceTest.java` | **Non** |
| `service/AIAnalysisServiceTest.java` | Oui |
| `service/StatsServiceTest.java` | Oui |
| `controller/IncidentControllerTest.java` | **Non** |
| `controller/AuthControllerTest.java` | Oui |
| `repository/*Test.java` (optionnel) | **Aucun** |

**Nombre de classes `*Test.java` :** **5** (exigence académique du prompt : **≥ 7**).

**Score structure (grille 4 pts du modèle) :** **2/4** — répertoire et packages corrects, nomenclature `*Test.java` respectée, mais **manque 2 classes minimales** (`AlertServiceTest`, `IncidentControllerTest` ou équivalent).

---

## 2. Annotations JUnit 5

### 2.1 Imports

- **Aucun** import `org.junit.Test`, `org.junit.Before`, etc. (JUnit 4) détecté dans `src/test/java`.
- Imports **`org.junit.jupiter.api.*`** ou équivalents (`Test`, `BeforeEach`, `Disabled`, …) sur toutes les classes de test.

**Conformité :** **Oui** — aligné avec l’exigence « package `org.junit.jupiter` ».

### 2.2 Utilisation des annotations

| Annotation | Occurrences / remarque |
|------------|-------------------------|
| `@Test` | **~34** méthodes au total sur 5 fichiers |
| `@BeforeEach` | `AuthControllerTest`, `IncidentServiceTest`, `StatsServiceTest`, `UserServiceTest`, `AIAnalysisServiceTest` |
| `@BeforeAll` | `AuthControllerTest`, `IncidentServiceTest`, `StatsServiceTest`, `UserServiceTest` |
| `@AfterAll` | Idem + `IncidentServiceTest` |
| `@AfterEach` | Principalement **`IncidentServiceTest`** |
| `@Disabled` | **`AIAnalysisServiceTest`** (test Gemini), **`IncidentServiceTest`** (test dépendant API externe) — **justifié** pour intégration, acceptable à documenter pour le jury |

**Remarque pédagogique :** la checklist demandait `@BeforeEach` « si nécessaire » — ici le setup est bien présent. En revanche, **`@AfterEach` peu répandu** : acceptable si pas de ressources à libérer, mais pour un rapport « exemplaire » le professeur peut attendre un `tearDown` cohérent sur les tests qui mutent l’état.

**Score annotations (grille 5 pts) :** **4/5**.

---

## 3. Assertions (JUnit 5)

Types observés dans le code :

- `assertEquals`, `assertNotNull`, `assertTrue`, `assertFalse`, `assertThrows`, `assertNotSame`
- `fail(...)` dans des tests désactivés / chemins impossibles

**Volume :** largement **≥ 30** assertions au sens du prompt.

**Score assertions (grille 5 pts) :** **5/5**.

---

## 4. Classes d’équivalence et granularité

Principe du cours : plusieurs sous-comportements par méthode → plusieurs `@Test`.

| Classe | Nombre de `@Test` | Commentaire |
|--------|-------------------|---------------|
| `IncidentServiceTest` | **10** | Bon découpage (find, not found, update status, delete, recent, reference, etc.) |
| `UserServiceTest` | **9** | Inscription, email dupliqué, findByEmail, findById, désactivation, stats |
| `StatsServiceTest` | **9** | Dashboard, taux résolution, agrégations, cas vides |
| `AuthControllerTest` | **4** | Register, login, me, update — correct mais **moins dense** que les services |
| `AIAnalysisServiceTest` | **4** (dont **1** `@Disabled`) | Focus sur `fallback` — **pas de tests sur `analyze()`** sans API (choix raisonnable + `@Disabled`) |

**Manque majeur pour l’équivalence « couche alerte / couche web incident » :** absence de **`AlertServiceTest`** et **`IncidentControllerTest`**, donc pas de preuve de classes d’équivalence côté alertes ni côté contrôleur incidents.

**Score classes d’équivalence (grille 4 pts) :** **2.5/4**.

---

## 5. Mockito (isolation)

| Classe | `@ExtendWith(MockitoExtension.class)` | `@Mock` / `@InjectMocks` | `when` / `verify` |
|--------|--------------------------------------|--------------------------|-------------------|
| `IncidentServiceTest` | Oui | Oui | Oui |
| `UserServiceTest` | Oui | Oui | Oui |
| `StatsServiceTest` | Oui | Oui | Oui |
| `AuthControllerTest` | Oui | Oui | Oui |
| `AIAnalysisServiceTest` | **Non** | `@InjectMocks` + `MockitoAnnotations.openMocks(this)` | **Non** `when`/`verify` (tests ciblent `fallback`) |

**Écart par rapport à la checklist « MockitoExtension sur chaque classe » :** `AIAnalysisServiceTest` **n’utilise pas** `MockitoExtension` ; les tests appellent **`fallback`** directement (peu ou pas de mocks nécessaires). Ce n’est **pas incorrect** fonctionnellement, mais c’est **moins homogène** pour une soutenance stricte.

**Score Mockito (grille 5 pts) :** **3.5/5**.

---

## 6. JaCoCo et `pom.xml`

- **Plugin** `jacoco-maven-plugin` **0.8.11** présent avec `prepare-agent`, `report` (phase `verify`), et **`check`** avec **minimum 80 %** de couverture de lignes sur les classes non exclues.
- Les dépendances **JUnit 5** et **Mockito** sont fournies notamment via **`spring-boot-starter-test`** + **`mockito-junit-jupiter`** (le `pom.xml` n’ajoute pas explicitement `junit-jupiter-api` en dépendance directe, ce qui est **courant** avec Spring Boot car transitif).

**Remarque :** tant que **`mvn compile` / `mvn test`** échoue, **`mvn verify`** ne produira pas de rapport JaCoCo exploitable.

**Score JaCoCo (grille 3 pts) :** **2/3** (configuration **oui**, résultat **non mesuré** sur cette machine à cause de la compilation).

---

## 7. Dépendances Maven (JUnit 5 / Mockito)

- `spring-boot-starter-test` (scope test) — inclut Jupiter.
- `spring-security-test` (scope test).
- `mockito-core`, `mockito-junit-jupiter` (scope test).
- **Exclusion `junit-vintage-engine` :** **non** explicitement dans le `pom.xml` actuel (Spring Boot 3 n’embarque en pratique plus Vintage par défaut ; risque faible, mais la checklist du prompt recommandait l’exclusion explicite pour « preuve » documentaire).

**Score dépendances (grille 4 pts) :** **3/4**.

---

## 8. Exécution `mvn test`

**Résultat :** **ÉCHEC** — erreurs de **compilation** du code sous `src/main/java` (classes manquantes, par ex. `UserService`, `RegisterRequest`, `CategoryService`, `SectorService`, `StatsResponse`, `SectorResponse`).

**Conséquence :** impossible d’affirmer que la suite de tests **passe** sur l’état Git actuel ; la conformité « tests verts en CI » **n’est pas satisfaite**.

---

## 9. Score global (grille indicative du prompt : /30)

| Catégorie | Max | Obtenu |
|-----------|-----|--------|
| Structure & organisation | 4 | 2 |
| Annotations JUnit 5 | 5 | 4 |
| Assertions | 5 | 5 |
| Classes d’équivalence | 4 | 2.5 |
| Mockito | 5 | 3.5 |
| JaCoCo | 3 | 2 |
| Dépendances Maven | 4 | 3 |
| **Exécution `mvn test`** (ajustement logique du prompt) | — | **0** (compilation) |

**Total indicatif :** **22/30** (~**73 %**) — en **dessous** du seuil **24/30 (80 %)** du critère de succès du prompt, surtout à cause de la **structure incomplète** et de **`mvn test` impossible**.

---

## 10. Verdict

- **Conforme JUnit 5 (syntaxe et API Jupiter) :** **Oui.**
- **Conforme à l’exigence « minimum 7 classes de test » :** **Non.**
- **Conforme « projet compilable + tests verts » :** **Non** (à date de vérification).

**Classification :** **Partiellement conforme** — base de tests **sérieuse sur les services principaux mockés**, mais **incomplète** pour une grille académique stricte et **bloquée** par l’état du code principal.

---

## 11. Correctifs recommandés (priorisés)

1. **Restaurer ou réimplémenter** les classes manquantes dans `src/main/java` (`UserService`, DTOs, services catégorie/secteur, `StatsResponse`, etc.) pour que **`mvn test`** compile et s’exécute.
2. Ajouter **`AlertServiceTest`** avec `@ExtendWith(MockitoExtension.class)`, mocks `AlertRepository` + `EmailService`, cas : création alerte, `acknowledge`, `resend`, absence d’e-mail autorité.
3. Ajouter **`IncidentControllerTest`** (`@WebMvcTest` ou `MockMvc` + mocks des services) pour les chemins GET/POST/PATCH critiques.
4. (Optionnel) Tests **`@DataJpaTest`** sur `IncidentRepository` pour les requêtes custom — valorise la couche persistance.
5. Harmoniser **`AIAnalysisServiceTest`** : soit `@ExtendWith(MockitoExtension.class)` + mocks `RestTemplate` / `@Value` pour tester `analyze` sans réseau, soit documenter explicitement que seule la méthode **`fallback`** est unitaire et que `analyze` est couvert par **tests d’intégration**.
6. Dans `pom.xml`, **exclure explicitement** `junit-vintage-engine` sous `spring-boot-starter-test` si le rapport doit coller mot pour mot au modèle du professeur.
7. Après compilation OK : lancer **`mvn verify`**, joindre **`target/site/jacoco/index.html`** au rapport de soutenance et vérifier que la règle **80 %** est tenue (sinon ajouter des tests sur les services non couverts).

---

## 12. Recommandations pour la soutenance

- Présenter le **pattern AAA** (Arrange / Act / Assert) sur un extrait de `IncidentServiceTest` ou `UserServiceTest`.
- Expliquer les **`@Disabled`** : distinction **test unitaire** vs **test d’intégration** (API externe).
- Montrer la **configuration JaCoCo** dans le `pom.xml` comme preuve d’industrialisation.

---

*Document généré à partir de l’analyse statique du dépôt et d’une exécution `mvn test` sur l’environnement du projet.*
