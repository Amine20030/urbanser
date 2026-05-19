# Run tests, generate JaCoCo + LCOV, then upload to SonarCloud.
# Usage: .\scripts\run-sonar.ps1 -SonarToken "your_token_here"

param(
    [Parameter(Mandatory = $true)]
    [string]$SonarToken
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "==> Backend: mvn clean verify (JaCoCo report)"
Push-Location "$root\backend"
mvn clean verify
if (-not (Test-Path "target\site\jacoco\jacoco.xml")) {
    throw "JaCoCo report missing at backend/target/site/jacoco/jacoco.xml"
}
Pop-Location

Write-Host "==> Frontend: npm test:coverage (LCOV report)"
Push-Location "$root\frontend"
npm run test:coverage
if (-not (Test-Path "coverage\lcov.info")) {
    throw "LCOV report missing at frontend/coverage/lcov.info"
}
Pop-Location

Write-Host "==> SonarCloud scan"
Push-Location "$root\backend"
mvn sonar:sonar "-Dsonar.token=$SonarToken"
Pop-Location

Write-Host "Done. Check https://sonarcloud.io/dashboard?id=Amine20030_urbanser"
