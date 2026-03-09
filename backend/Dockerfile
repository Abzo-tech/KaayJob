# ===================================================================
# Backend Dockerfile - KaayJob
# Node.js + Express + Prisma + PostgreSQL
# ===================================================================

# Étape 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances (y compris devDependencies pour le build)
COPY backend/package*.json ./

RUN npm ci && \
    npm install -g prisma

# Copier le code source du backend
COPY backend/ .

# Générer le client Prisma
RUN npx prisma generate

# Builder TypeScript
RUN npm run build

# ===================================================================
# Étape 2: Image finale (production)
# ===================================================================
FROM node:20-alpine AS production

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copier le script d'entrée
COPY backend/docker-entrypoint.sh /app/docker-entrypoint.sh

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Installer netcat pour le script d'attente de la base de données et OpenSSL 1.1 pour Prisma
RUN apk add --no-cache netcat-openbsd openssl

# Changer les permissions pour le script d'entrée AVANT de changer d'utilisateur
RUN chmod +x /app/docker-entrypoint.sh || true

# Les variables d'environnement sont passées via docker-compose
# Pas de création de fichier .env nécessaire

# Changer les permissions
USER nodejs

# Exposer le port
EXPOSE 3000

# Commande de démarrage avec entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
