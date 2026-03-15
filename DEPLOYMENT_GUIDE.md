# Guide de Déploiement - KaayJob

## Déploiement en ligne (Vercel + Render)

Ce guide explique comment déployer l'application KaayJob sur Vercel (Frontend) et Render (Backend).

---

## Étape 1: Prérequis

1. Créer un compte sur [Render.com](https://render.com) (gratuit)
2. Créer un compte sur [Vercel.com](https://vercel.com) (gratuit)
3. Pousser votre code sur GitHub

---

## Étape 2: Déployer le Backend sur Render

### Option A: Déploiement automatique avec render.yaml

1. Pousser le code sur GitHub/GitLab
2. Se connecter à [Render Dashboard](https://dashboard.render.com)
3. Cliquer "New +" → "Blueprint"
4. Connecter votre repository
5. Sélectionner le fichier `render.yaml`
6. Cliquer "Apply"

### Option B: Déploiement manuel

1. Se rendre sur [Render Dashboard](https://dashboard.render.com)
2. Cliquer "New +" → "Web Service"
3. Connecter votre repository GitHub
4. Configurer:
   - **Name**: kaayjob-backend
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/Dockerfile.render`
   - **Docker Command**: `sh -c "npx prisma migrate deploy && node dist/index.js"`
5. Cliquer "Create Web Service"

### Configuration des Variables d'environnement sur Render

Dans le dashboard Render, ajouter ces variables:

```
DATABASE_URL=postgresql://user:password@host:5432/kaayjob
NODE_ENV=production
PORT=3000
JWT_SECRET=votre-secret-jwt-tres-securise
ALLOWED_ORIGINS=https://kaayjob.vercel.app
FRONTEND_URL=https://kaayjob.vercel.app
```

**Note**: Render crée automatiquement la base de données PostgreSQL. La variable `DATABASE_URL` sera automatiquement définie par Render.

---

## Étape 3: Déployer le Frontend sur Vercel

1. Se rendre sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquer "Add New..." → "Project"
3. Importer votre repository GitHub
4. Configurer:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Dans "Environment Variables", ajouter:
   ```
   VITE_API_URL=https://kaayjob-backend.onrender.com
   ```
6. Cliquer "Deploy"

---

## Étape 4: Configurer les переменations finales

Une fois le backend déployé:

1. Copier l'URL du backend (ex: `https://kaayjob-backend.onrender.com`)
2. Sur Vercel, mettre à jour la variable d'environnement:
   - `VITE_API_URL` = URL du backend Render
3. Ajouter le domaine Vercel aux variables d'environnement du backend Render:
   - `ALLOWED_ORIGINS` = `https://votre-projet.vercel.app`

---

## Étape 5: Exécuter le Seed (première fois)

Pour ajouter les données de test:

1. Se connecter au backend via terminal:
   ```bash
   render ssh kaayjob-backend
   ```
2. Ou utiliser le service shell de Render
3. Exécuter:
   ```bash
   DATABASE_URL="votre-connection-string" npx prisma db push
   node dist/config/seed.js
   ```

---

## Comptes de test (après seed)

```
ADMIN:
  Email: admin@kaayjob.sn
  Mot de passe: Admin123

PRESTATAIRES:
  Email: ahmed.plombier@email.com | Mot de passe: Password123!

CLIENTS:
  Email: client1@email.com | Mot de passe: Password123!
```

---

## Structure des fichiers de déploiement

```
kaayjob/
├── backend/
│   ├── Dockerfile          # Pour Docker local
│   ├── Dockerfile.render   # Pour Render
│   └── ...
├── front/
│   ├── vercel.json        # Configuration Vercel
│   └── ...
├── render.yaml            # Blueprint Render
└── DEPLOYMENT_GUIDE.md   # Ce fichier
```

---

## Dépannage

### CORS errors

- Vérifier que `ALLOWED_ORIGINS` inclut le domaine Vercel
- Vérifier que `VITE_API_URL` est correcte sur Vercel

### Database connection errors

- Vérifier que `DATABASE_URL` est correcte
- Vérifier que les migrations ont été exécutées

### Build errors

- Vérifier que `npm run build` fonctionne localement
- Vérifier les logs sur le dashboard Render/Vercel
