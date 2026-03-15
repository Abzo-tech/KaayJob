#!/bin/sh
# ===================================================================
# Docker Entrypoint - KaayJob Backend
# Attend que la base de données soit prête puis lance le serveur
# ===================================================================

echo "🐳 Backend Docker - Démarrage..."

# Afficher toutes les variables d'environnement (sans les valeurs sensibles)
echo "📋 Variables d'environnement:"
env | grep -E '^(DATABASE_URL|DB_HOST|DB_PORT|PORT|NODE_ENV)=' | sed 's/=.*/=***/g' || true

# Extraire l'host et le port de DATABASE_URL si disponible
if [ -n "$DATABASE_URL" ]; then
    # Format: postgresql://user:password@host:port/database
    # Utiliser awk pour gérer les mots de passe spéciaux
    DB_HOST=$(echo "$DATABASE_URL" | awk -F'[@:/]' '{print $(NF-3)}')
    DB_PORT=$(echo "$DATABASE_URL" | awk -F'[@:/]' '{print $(NF-2)}')
    echo "📦 Database URL détectée - Host: $DB_HOST, Port: $DB_PORT"
    
    # Utiliser les valeurs extraites
    export DB_HOST
    export DB_PORT
fi

# Si DB_HOST ou DB_PORT n'est pas défini, utiliser les valeurs par défaut ou ne pas attendre
if [ -z "$DB_HOST" ]; then
    echo "⚠️ DB_HOST non défini, pas d'attente de la base de données"
else
    # Attendre que la base de données soit prête
    echo "⏳ Attente de la base de données ($DB_HOST:$DB_PORT)..."
    MAX_RETRIES=30
    RETRY_COUNT=0

    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        # Utiliser nc (netcat) pour vérifier si le port est ouvert
        if nc -z -w 2 $DB_HOST $DB_PORT 2>/dev/null; then
            echo "✅ Base de données prête!"
            break
        fi
        
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "⏳ Tentative $RETRY_COUNT/$MAX_RETRIES - Base de données non prête..."
        sleep 2
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "⚠️ Impossible de vérifier la connexion à la base de données, tentative de connexion anyway..."
    fi
fi

# Exécuter les migrations Prisma si DATABASE_URL est disponible
if [ -n "$DATABASE_URL" ]; then
    echo "🔄 Exécution des migrations Prisma..."
    npx prisma migrate deploy || echo "⚠️ Migrations déjà à jour ou ignorées"
fi

echo "🚀 Lancement du serveur backend..."
exec "$@"
