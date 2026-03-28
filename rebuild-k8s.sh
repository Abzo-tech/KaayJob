#!/bin/bash
# ===================================================================
# Script de reconstruction et redéploiement complet Kubernetes pour KaayJob
# Force la reconstruction des images et redémarrage des pods
# ===================================================================

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Reconstruction complète KaayJob sur Kubernetes${NC}"
echo "======================================================"

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl n'est pas installé ou configuré${NC}"
    exit 1
fi

# Vérifier que docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

# Fonction pour nettoyer les anciennes images
cleanup_old_images() {
    echo -e "${YELLOW}🧹 Nettoyage des anciennes images...${NC}"
    docker image prune -f || true
    docker system prune -f || true
}

# Fonction pour construire une image avec cache désactivé
build_image() {
    local service=$1
    local dockerfile=$2
    local image_name=$3

    echo -e "${GREEN}🔨 Construction de l'image $service (sans cache)...${NC}"
    echo "Dockerfile: $dockerfile"
    echo "Image: $image_name"

    # Vérifier que le Dockerfile existe
    if [ ! -f "$dockerfile" ]; then
        echo -e "${RED}❌ Dockerfile non trouvé: $dockerfile${NC}"
        exit 1
    fi

    # Construire avec --no-cache pour forcer la reconstruction complète
    if docker build --no-cache -t "$image_name" -f "$dockerfile" .; then
        echo -e "${GREEN}✅ Image $service construite avec succès${NC}"
        return 0
    else
        echo -e "${RED}❌ Échec de construction de l'image $service${NC}"
        exit 1
    fi
}

# Demander le registry Docker
echo ""
echo -e "${BLUE}🔗 Configuration du registry Docker${NC}"
echo "Entrez votre registry Docker (ex: docker.io/votre-username, ghcr.io/votre-username, localhost):"
read -r REGISTRY

if [ -z "$REGISTRY" ]; then
    echo -e "${YELLOW}⚠️ Aucun registry spécifié. Recherche automatique...${NC}"

    # Essayer de détecter minikube
    if command -v minikube &> /dev/null && minikube status | grep -q "Running"; then
        REGISTRY="localhost"
        echo -e "${GREEN}✅ Minikube détecté, utilisation de localhost${NC}"
    else
        REGISTRY="localhost"
        echo -e "${YELLOW}⚠️ Utilisation de localhost par défaut${NC}"
    fi
fi

echo -e "${GREEN}📦 Registry configuré: $REGISTRY${NC}"

# Nettoyer les anciennes images
cleanup_old_images

# Utiliser le script de construction des images
echo ""
echo -e "${GREEN}🏗️ Construction des images Docker...${NC}"

export REGISTRY="$REGISTRY"
if ./build-images.sh; then
    echo -e "${GREEN}✅ Images construites et poussées avec succès${NC}"
else
    echo -e "${RED}❌ Échec de construction des images${NC}"
    exit 1
fi

# Mettre à jour les images dans les fichiers de déploiement
echo ""
echo -e "${GREEN}✏️ Mise à jour des images dans les manifestes K8s...${NC}"

# Backend
sed -i.bak "s|image:.*kaayjob-backend.*|image: $REGISTRY/kaayjob-backend:latest|g" k8s/backend.yaml
sed -i.bak "s|image: kaayjob_backend:latest|image: $REGISTRY/kaayjob-backend:latest|g" k8s/backend.yaml

# Frontend
sed -i.bak "s|image:.*kaayjob-frontend.*|image: $REGISTRY/kaayjob-frontend:latest|g" k8s/frontend.yaml
sed -i.bak "s|image: kaayjob_frontend:latest|image: $REGISTRY/kaayjob-frontend:latest|g" k8s/frontend.yaml

echo -e "${GREEN}✅ Manifestes mis à jour${NC}"

# Supprimer les anciens pods pour forcer le redémarrage avec les nouvelles images
echo ""
echo -e "${GREEN}🔄 Redémarrage des déploiements K8s...${NC}"

echo "Suppression des anciens pods..."
kubectl delete pods -n kaayjob --all --ignore-not-found=true || true

# Rollout restart pour s'assurer que les nouvelles images sont utilisées
echo "Redémarrage du déploiement backend..."
kubectl rollout restart deployment/backend -n kaayjob || true

echo "Redémarrage du déploiement frontend..."
kubectl rollout restart deployment/frontend -n kaayjob || true

# Attendre que les nouveaux pods soient prêts
echo ""
echo -e "${GREEN}⏳ Attente du redéploiement...${NC}"

echo "Attente du backend..."
kubectl wait --for=condition=available --timeout=300s deployment/backend -n kaayjob || {
    echo -e "${RED}❌ Timeout du backend, vérification des logs...${NC}"
    kubectl logs -n kaayjob --tail=50 deployment/backend || true
    exit 1
}

echo "Attente du frontend..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n kaayjob || {
    echo -e "${RED}❌ Timeout du frontend, vérification des logs...${NC}"
    kubectl logs -n kaayjob --tail=50 deployment/frontend || true
    exit 1
}

# Afficher le statut final
echo ""
echo -e "${GREEN}✅ Reconstruction et redéploiement terminés!${NC}"
echo ""
echo -e "${BLUE}📊 Statut des pods:${NC}"
kubectl get pods -n kaayjob
echo ""
echo -e "${BLUE}🌐 Services:${NC}"
kubectl get svc -n kaayjob
echo ""
echo -e "${BLUE}📦 Images utilisées:${NC}"
kubectl get deployments -n kaayjob -o jsonpath='{.items[*].spec.template.spec.containers[*].image}' | tr ' ' '\n'
echo ""

# Test rapide de connectivité
echo -e "${YELLOW}🔍 Test de connectivité rapide...${NC}"
kubectl run test-connectivity --image=busybox --rm -i --restart=Never -- sh -c "
wget -qO- --timeout=10 http://frontend-service/health || echo 'Health check non disponible';
wget -qO- --timeout=10 http://backend-service:3000/api/categories | head -c 100 || echo 'API non accessible';
echo 'Tests de connectivité terminés'
" 2>/dev/null || echo "Test de connectivité ignoré"

echo ""
echo -e "${GREEN}🎉 Prêt pour les tests E2E !${NC}"
echo ""
echo -e "${YELLOW}💡 Prochaines étapes:${NC}"
echo "  1. Exécuter: ./test-k8s.sh"
echo "  2. Vérifier les logs si nécessaire: kubectl logs -n kaayjob -f deployment/frontend"