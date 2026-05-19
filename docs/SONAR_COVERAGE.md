# SonarCloud coverage (>80%)

## Why coverage shows "Set up coverage analysis"

SonarCloud **automatic analysis** (on git push) only scans source code. It does **not** run `mvn verify` or `npm test`, so **no JaCoCo/LCOV files exist** and coverage stays empty.

Coverage requires a **CI analysis** after tests.

## Required setup (one time)

1. **SonarCloud** → Project **UrbanOps Backend** → **Administration** → **Analysis Method**
2. Turn **OFF** "Automatic Analysis"
3. Turn **ON** analysis via **GitHub Actions** (or your CI)

4. **GitHub** → Repository **Settings** → **Secrets** → **Actions** → add:
   - `SONAR_TOKEN` = your SonarCloud token (My Account → Security → Generate Tokens)

5. Push to `main`. Workflow `.github/workflows/sonarcloud.yml` will:
   - `mvn clean verify` → `backend/target/site/jacoco/jacoco.xml`
   - `npm run test:coverage` → `frontend/coverage/lcov.info`
   - `mvn sonar:sonar` → upload coverage to SonarCloud

## Run locally (before push)

```powershell
.\scripts\run-sonar.ps1 -SonarToken "YOUR_SONAR_TOKEN"
```

Or manually:

```powershell
cd backend
mvn clean verify
cd ..\frontend
npm run test:coverage
cd ..\backend
mvn sonar:sonar -Dsonar.token=YOUR_SONAR_TOKEN
```

## Expected result

- **Overall coverage** ≥ 80%
- **New code coverage** ≥ 80%
- Quality Gate **Passed**
