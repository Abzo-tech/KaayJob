# ===================================================================
# Frontend Dockerfile - KaayJob
# React + Vite + TypeScript + TailwindCSS
# ===================================================================

# Étape 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Variable d'environnement pour le build (peut être surchargée avec --build-arg)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=KaayJob

# Builder l'application
RUN npm run build

# ===================================================================
# Étape 2: Image finale (production) avec Nginx
# ===================================================================
FROM nginx:alpine AS production

# Supprimer la configuration par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/

# Copier les fichiers build depuis le builder
COPY --from=builder /app/build /usr/share/nginx/html

# Créer un utilisateur non-root
RUN adduser -D -g '' nginxuser && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    chown -R nginxuser:nginxuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

# Exposer le port 80
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
