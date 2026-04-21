#!/bin/bash
# ===================================================================
# Script de déploiement Kubernetes pour KaayJob
# ===================================================================

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Déploiement KaayJob sur Kubernetes${NC}"
echo "=========================================="

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo -e "${YELLOW}⚠️ kubectl n'est pas installé. Veuillez l'installer d'abord.${NC}"
    exit 1
fi

# Vérifier que kustomize est installé (optionnel)
HAS_KUSTOMIZE=false
if command -v kustomize &> /dev/null; then
    HAS_KUSTOMIZE=true
fi

# Demander le registry Docker
echo ""
echo "Entrez votre registry Docker (ex: docker.io/votre-username, ghcr.io/votre-username):"
read -r REGISTRY

if [ -z "$REGISTRY" ]; then
    echo -e "${YELLOW}⚠️ Aucun registry spécifié. Utilisation de localhost.${NC}"
    REGISTRY="localhost"
fi

# Se placer à la racine du projet (parent de k8s)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Construire et pousser les images
echo ""
echo -e "${GREEN}📦 Construction et thérapeutage des images Docker...${NC}"

echo "Backend..."
docker build -t "$REGISTRY/kaayjob-backend:latest" ./backend
docker push "$REGISTRY/kaayjob-backend:latest"

echo "Frontend..."
docker build -t "$REGISTRY/kaayjob-frontend:latest" ./front
docker push "$REGISTRY/kaayjob-frontend:latest"

# Mettre à jour les images dans les fichiers de déploiement
echo ""
echo -e "${GREEN}✏️ Mise à jour des images dans les manifestes...${NC}"
sed -i "s|image: kaayjob-backend:latest|image: $REGISTRY/kaayjob-backend:latest|g" k8s/backend.yaml
sed -i "s|image: kaayjob-frontend:latest|image: $REGISTRY/kaayjob-frontend:latest|g" k8s/frontend.yaml

# Supprimer les anciennes ressources pour éviter les erreurs de selector
echo ""
echo -e "${GREEN}🗑️ Suppression des anciennes ressources...${NC}"
kubectl delete -k k8s/ 2>/dev/null || true

# Appliquer les manifestes Kubernetes
echo ""
echo -e "${GREEN}�️ Application des manifestes Kubernetes...${NC}"

if [ "$HAS_KUSTOMIZE" = true ]; then
    kubectl apply -k k8s/
else
    kubectl apply -f k8s/
fi

# Attendre que les pods soient prêts
echo ""
echo -e "${GREEN}⏳ Attente du déploiement...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/backend -n kaayjob || true
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n kaayjob || true

# Afficher le statut
echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo ""
echo "Statut des pods:"
kubectl get pods -n kaayjob
echo ""
echo "Services:"
kubectl get svc -n kaayjob
echo ""
echo -e "${YELLOW}⚠️ N'oubliez pas de:${NC}"
echo "  1. Configurer votre domaine dans k8s/ingress.yaml"
echo "  2. Configurer SSL/TLS (cert-manager)"
echo "  3. Mettre à jour les secrets en production"
