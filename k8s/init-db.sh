#!/bin/bash
# ===================================================================
# Script d'initialisation de la base de données Kubernetes
# ===================================================================

set -e

echo "🔄 Initialisation de la base de données KaayJob..."

# Apply migrations sur le pod backend
kubectl exec -it -n kaayjob deployment/backend -- sh -c "npx prisma migrate deploy"

# Ou exécuter dans le pod postgres directement
# kubectl exec -it -n kaayjob postgres-0 -- psql -U postgres -d kaayjob -c "SELECT 1"

echo "✅ Base de données initialisée!"