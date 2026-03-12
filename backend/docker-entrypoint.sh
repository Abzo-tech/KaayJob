#!/bin/sh
# ===================================================================
# Docker Entrypoint - KaayJob Backend
# Attend que la base de données soit prête puis lance le serveur
# ===================================================================

echo "🐳 Backend Docker - Démarrage..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Utiliser nc (netcat) pour vérifier si le port est ouvert
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
        echo "✅ Base de données prête!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Tentative $RETRY_COUNT/$MAX_RETRIES - Base de données non prête..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Impossible de se connecter à la base de données"
    exit 1
fi

# Les migrations et la génération du client Prisma sont déjà faites au moment du build
# Pas besoin de les refaire au démarrage

echo "🚀 Lancement du serveur backend..."
exec "$@"
