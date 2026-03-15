#!/bin/sh
# ===================================================================
# Docker Entrypoint - KaayJob Backend
# Attend que la base de données soit prête puis lance le serveur
# ===================================================================

echo "🐳 Backend Docker - Démarrage..."

# Extraire l'host et le port de DATABASE_URL si disponible
if [ -n "$DATABASE_URL" ]; then
    # Format: postgresql://user:password@host:port/database
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:]+):([0-9]+)/.*|\1|')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:]+):([0-9]+)/.*|\2|')
    echo "📦 Database URL détectée - Host: $DB_HOST, Port: $DB_PORT"
fi

# Si DB_HOST ou DB_PORT n'est pas défini, utiliser les valeurs par défaut
DB_HOST=${DB_HOST:-postgres-service}
DB_PORT=${DB_PORT:-5432}

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

# Exécuter les migrations Prisma si DATABASE_URL est disponible
if [ -n "$DATABASE_URL" ]; then
    echo "🔄 Exécution des migrations Prisma..."
    npx prisma migrate deploy || echo "⚠️ Migrations déjà à jour ou ignorées"
fi

echo "🚀 Lancement du serveur backend..."
exec "$@"
