# ===================================================================

# Guide pas à pas: Déployer KaayJob sur Railway

# ===================================================================

## Ce qui sera déployé:

- **Backend**: API Node.js/Express (port 3000)
- **Frontend**: Application React/Nginx (port 80)
- **Base de données**: PostgreSQL

---

## ÉTAPE 1: Créer le projet Railway

1. Allez sur https://railway.app
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Cherchez et sélectionnez votre dépôt **KaayJob**

---

## ÉTAPE 2: Créer la base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database"** → **"PostgreSQL"**
3. Attendez que PostgreSQL soit prêt (vert)
4. Cliquez sur PostgreSQL → onglet **Variables**
5. Notez la variable `DATABASE_URL` (vous en aurez besoin)

---

## ÉTAPE 3: Créer le service Backend

1. Cliquez sur **"+ New"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez votre dépôt **KaayJob**
4. Dans **Root Directory**, tapez: `backend` (car le Dockerfile est dans le dossier backend)
5. Cliquez sur **"Deploy"**

**Variables du Backend** (à configurer):

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://...@...:5432/...  (collez ici la DATABASE_URL de PostgreSQL)
JWT_SECRET=kaayjob-secret-key-2024-soutenance
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-projet.up.railway.app
```

---

## ÉTAPE 4: Créer le service Frontend

1. Cliquez sur **"+ New"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez votre dépôt **KaayJob**
4. Dans **Root Directory**, tapez: `front` (car le Dockerfile est dans le dossier front)
5. Cliquez sur **"Deploy"**

**Variables du Frontend**:

```
VITE_API_URL=https://votre-backend.up.railway.app/api
```

_(Remplacez "votre-backend" par le nom réel de votre service backend)_

---

## ÉTAPE 5: Attendre le déploiement

1. Cliquez sur chaque service et regardez les logs
2. Attendez que le déploiement soit terminé (État: Vert)

---

## ÉTAPE 6: Tester l'application

Une fois déployé:

- **Frontend**: `https://kaayjob.up.railway.app`
- **Backend API**: `https://kaayjob-backend.up.railway.app/api`

---

## Dépannage

### Si le déploiement échoue:

1. Cliquez sur le service → onglet **Logs**
2. Cherchez les erreurs (souvent liées aux variables d'environnement)

### Pour redémarrer:

1. Cliquez sur le service
2. Cliquez sur **"Restart"**

### Pour voir les variables:

1. Cliquez sur le service
2. Allez dans l'onglet **Variables**
