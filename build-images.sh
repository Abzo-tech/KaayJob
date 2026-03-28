#!/bin/bash
# ===================================================================
# Script de construction rapide des images Docker pour KaayJob
# ===================================================================

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔨 Construction des images Docker KaayJob${NC}"
echo "==========================================="

# Fonction pour construire une image
build_service() {
    local service=$1
    local context=$2
    local dockerfile=$3
    local image_name=$4

    echo -e "${GREEN}🏗️ Construction de $service...${NC}"
    echo "  Context: $context"
    echo "  Dockerfile: $dockerfile"
    echo "  Image: $image_name"

    cd "$context"

    if docker build --no-cache -t "$image_name" -f "$dockerfile" .; then
        echo -e "${GREEN}✅ $service construit avec succès${NC}"
        cd - > /dev/null
        return 0
    else
        echo -e "${RED}❌ Échec de construction de $service${NC}"
        cd - > /dev/null
        exit 1
    fi
}

# Demander le registry ou utiliser la variable d'environnement
echo ""
if [ -z "$REGISTRY" ]; then
    echo -e "${BLUE}🔗 Registry Docker (laissez vide pour localhost):${NC}"
    read -r REGISTRY
fi

if [ -z "$REGISTRY" ]; then
    REGISTRY="localhost"
    echo -e "${YELLOW}📍 Utilisation de localhost${NC}"
fi

# Construction des images
echo ""
echo -e "${GREEN}🚀 Démarrage des constructions...${NC}"

# Backend
build_service "Backend" "backend" "Dockerfile" "$REGISTRY/kaayjob-backend:latest"

# Frontend
build_service "Frontend" "front" "Dockerfile" "$REGISTRY/kaayjob-frontend:latest"

# Poussée des images
echo ""
echo -e "${GREEN}📤 Poussée des images...${NC}"

echo "Poussée du backend..."
docker push "$REGISTRY/kaayjob-backend:latest"

echo "Poussée du frontend..."
docker push "$REGISTRY/kaayjob-frontend:latest"

echo ""
echo -e "${GREEN}✅ Toutes les images construites et poussées !${NC}"
echo ""
echo -e "${YELLOW}📋 Images disponibles:${NC}"
docker images | grep kaayjob
echo ""
echo -e "${BLUE}💡 Prochaine étape: ./rebuild-k8s.sh pour redéployer${NC}"