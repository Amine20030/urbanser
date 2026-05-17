#!/bin/bash
# Script de vérification — UrbanOps Rapport LaTeX

set -e

FIGURES_DIR="figures"
ECHO_RED='\033[0;31m'
ECHO_GREEN='\033[0;32m'
ECHO_YELLOW='\033[1;33m'
ECHO_NC='\033[0m' # No Color

required_files=(
  "gantt_planning.png"
  "pert_taches.png"
  "uml_classes_metier.png"
  "uml_classes_technique.png"
  "uml_cas_usage.png"
  "uml_composants.png"
  "uml_sequence_incident.png"
  "landing_page_screenshot.png"
  "dashboard_screenshot.png"
  "map_interactive_screenshot.png"
  "jacoco_report_screenshot.png"
  "sonarqube_dashboard_screenshot.png"
)

echo -e "${ECHO_YELLOW}📋 Vérification des fichiers figures UrbanOps...${ECHO_NC}\n"

if [ ! -d "$FIGURES_DIR" ]; then
  echo -e "${ECHO_YELLOW}📁 Création du dossier $FIGURES_DIR${ECHO_NC}"
  mkdir -p "$FIGURES_DIR"
fi

missing_count=0
found_count=0

for file in "${required_files[@]}"; do
  if [ -f "$FIGURES_DIR/$file" ]; then
    size=$(du -h "$FIGURES_DIR/$file" | cut -f1)
    echo -e "${ECHO_GREEN}✅${ECHO_NC} $file ($size)"
    ((found_count++))
  else
    echo -e "${ECHO_RED}❌${ECHO_NC} $file (manquant)"
    ((missing_count++))
  fi
done

echo ""
echo -e "${ECHO_YELLOW}📊 Résumé: $found_count/${#required_files[@]} fichiers trouvés${ECHO_NC}"

if [ $missing_count -eq 0 ]; then
  echo -e "${ECHO_GREEN}✅ Tous les fichiers sont présents ! Vous pouvez compiler LaTeX.${ECHO_NC}"
  exit 0
else
  echo -e "${ECHO_RED}❌ $missing_count fichier(s) manquant. Voir CAPTURES_ASSISTANT.md pour les générer.${ECHO_NC}"
  exit 1
fi
