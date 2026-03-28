#!/bin/bash
# ===================================================================
# Script pour exécuter les tests E2E avec les conteneurs Kubernetes
# ===================================================================

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Exécution des tests E2E avec Kubernetes${NC}"
echo "==========================================="

# Vérifier que kubectl est installé et configuré
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl n'est pas installé ou configuré${NC}"
    exit 1
fi

# Vérifier que les pods sont en cours d'exécution
echo -e "${YELLOW}🔍 Vérification de l'état des pods...${NC}"
kubectl get pods -n kaayjob

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente que les services soient prêts...${NC}"
kubectl wait --for=condition=available --timeout=120s deployment/backend -n kaayjob 2>/dev/null || echo "Backend peut ne pas être prêt"
kubectl wait --for=condition=available --timeout=120s deployment/frontend -n kaayjob 2>/dev/null || echo "Frontend peut ne pas être prêt"

# Obtenir l'URL du frontend
echo -e "${YELLOW}🌐 Détection de l'URL du frontend...${NC}"

# Essayer d'obtenir l'URL depuis l'ingress
FRONTEND_URL=$(kubectl get ingress kaayjob-ingress -n kaayjob -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "")

if [ -z "$FRONTEND_URL" ] || [ "$FRONTEND_URL" = "kaayjob.example.com" ]; then
    # Essayer avec minikube
    if command -v minikube &> /dev/null; then
        FRONTEND_URL=$(minikube service frontend-service -n kaayjob --url 2>/dev/null | head -1 || echo "")
    fi

    # Fallback: utiliser localhost avec port-forwarding
    if [ -z "$FRONTEND_URL" ]; then
        echo -e "${YELLOW}⚠️ Configuration automatique de port-forwarding...${NC}"
        kubectl port-forward svc/frontend-service 3000:80 -n kaayjob > /dev/null 2>&1 &
        PORT_FORWARD_PID=$!
        sleep 3
        FRONTEND_URL="http://localhost:3000"
        echo -e "${YELLOW}📡 Port-forwarding démarré (PID: $PORT_FORWARD_PID)${NC}"
    fi
fi

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}❌ Impossible de déterminer l'URL du frontend${NC}"
    echo "Vérifiez votre configuration Kubernetes ou Ingress"
    exit 1
fi

echo -e "${GREEN}✅ Frontend accessible sur: $FRONTEND_URL${NC}"

# Aller dans le répertoire frontend
cd front

# Exécuter les tests avec la configuration K8s
echo -e "${GREEN}🚀 Lancement des tests...${NC}"
FRONTEND_URL="$FRONTEND_URL" npx playwright test --config=playwright.config.k8s.ts "$@"

# Nettoyer le port-forwarding si nécessaire
if [ -n "$PORT_FORWARD_PID" ]; then
    echo -e "${YELLOW}🧹 Nettoyage du port-forwarding...${NC}"
    kill $PORT_FORWARD_PID 2>/dev/null || true
fi

echo -e "${GREEN}✅ Tests terminés!${NC}"