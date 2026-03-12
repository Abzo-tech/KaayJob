# ===================================================================

# Déploiement gratuit sur Render.com

# ===================================================================

## Pourquoi Render?

- ✅ 100% Gratuit (sans carte de crédit)
- ✅ Supporte Docker
- ✅ PostgreSQL gratuit
- ✅ CI/CD automatique

---

## ÉTAPE 1: Créer un compte Render

1. Allez sur https://render.com
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec **GitHub**
4. Validez votre email

---

## ÉTAPE 2: Créer la base de données PostgreSQL

1. Dashboard → **"New"** → **"PostgreSQL"**
2. Configurez:
   - **Name**: kaayjob-db
   - **Database**: kaayjob
   - **User**: postgres
3. Cliquez **"Create Database"**
4. Notez les informations de connexion (Internal Database URL)

---

## ÉTAPE 3: Déployer le Backend

1. Dashboard → **"New"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Configurez:
   - **Name**: kaayjob-backend
   - **Root Directory**: backend
   - **Build Command**: (laisser vide - utilise le Dockerfile)
   - **Start Command**: (laisser vide)
4. Dans **Environment Variables**, ajoutez:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<collez-la-URL-de-PostgreSQL>
   JWT_SECRET=votre-secret-complexe
   JWT_EXPIRES_IN=7d
   ```
5. Cliquez **"Create Web Service"**

---

## ÉTAPE 4: Déployer le Frontend

1. Dashboard → **"New"** → **"Static Site"**
2. Connectez votre dépôt GitHub
3. Configurez:
   - **Name**: kaayjob-frontend
   - **Root Directory**: front
   - **Build Command**: npm run build
   - **Publish directory**: dist
4. Dans **Environment Variables**, ajoutez:
   ```
   VITE_API_URL=https://kaayjob-backend.onrender.com/api
   ```
5. Cliquez **"Create Static Site"**

---

## Accès à l'application

Une fois déployé:

- **Frontend**: https://kaayjob-frontend.onrender.com
- **Backend**: https://kaayjob-backend.onrender.com/api

---

## Notes importantes

1. **Démarrage gratuit**: Les services gratuits s'endorment après 15 min d'inactivité
2. **Base de données**: La première connexion peut prendre 1-2 minutes
3. **Build**: Le premier déploiement prend 5-10 minutes
