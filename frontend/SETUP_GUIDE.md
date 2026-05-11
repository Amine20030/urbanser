# ╔══════════════════════════════════════════════════════════════╗
# ║          ÉTAPE 0 — INSTALLATION ET CONFIGURATION            ║
# ║                    DE POSTGRESQL                            ║
# ╚══════════════════════════════════════════════════════════════╝

## 1. TÉLÉCHARGER POSTGRESQL
   → Aller sur: https://www.postgresql.org/download/
   → Choisir votre OS (Windows / macOS / Linux)
   → Télécharger la version 16 (LTS recommandée)
   → Lancer l'installeur, garder les options par défaut
   → Choisir un mot de passe pour l'utilisateur "postgres" (notez-le!)
   → Port par défaut: 5432 (ne pas changer)

## 2. CRÉER LA BASE DE DONNÉES

### Option A — pgAdmin (interface graphique, installé avec PostgreSQL):
   → Ouvrir pgAdmin
   → Clic droit sur "Databases" → Create → Database
   → Name: urbanops_db
   → Owner: postgres
   → Save

### Option B — Ligne de commande:
   → Ouvrir un terminal
   → psql -U postgres
   → CREATE DATABASE urbanops_db;
   → \q

## 3. VÉRIFIER LA CONNEXION
   → Host: localhost
   → Port: 5432
   → Database: urbanops_db
   → Username: postgres
   → Password: [votre mot de passe]

## 4. INSTALLER SONARQUBE (pour le rapport de qualité)
   → Aller sur: https://www.sonarsource.com/products/sonarqube/downloads/
   → Télécharger la version Community Edition
   → Dézipper → lancer bin/[OS]/sonar.sh start
   → Ouvrir: http://localhost:9000
   → Login: admin / admin (changer au premier login)
   → Créer un projet: urbanops-backend
   → Générer un token (garder-le pour plus tard)

## 5. LANCER LE PROJET BACKEND APRÈS GÉNÉRATION
   → cd urbanops/backend
   → mvn clean install
   → mvn spring-boot:run
   → API disponible sur: http://localhost:8080/api

## 6. LANCER LE FRONTEND
   → cd urbanops/frontend
   → npm install
   → npm run dev
   → Application disponible sur: http://localhost:3000
