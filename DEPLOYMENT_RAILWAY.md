# ===================================================================

# Déploiement gratuit KaayJob sur Railway

# ===================================================================

## Pourquoi Railway ?

- ✅ **100% Gratuit** (avec limitations)
- ✅ **Support Docker natif**
- ✅ **PostgreSQL gratuit inclus**
- ✅ **Déploiement automatique via GitHub**
- ✅ **Domaine gratuit** (ex: kaayjob.up.railway.app)

---

## ÉTAPE 1: Préparer votre projet

### 1.1 Créer un compte Railway

1. Allez sur https://railway.app
2. Connectez-vous avec **GitHub**
3. Acceptez les conditions

### 1.2 Préparer le projet pour Railway

Créez un fichier `railway.json` à la racine du projet:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 Modifier le docker-compose pour Railway

Railway a besoin d'une configuration spéciale. Créez `docker-compose.railway.yml`:

```yaml
version: "3.8"

services:
  # PostgreSQL (fourni par Railway, on utilise DATABASE_URL)

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET:-change-this-in-production}
      - JWT_EXPIRES_IN=7d
    depends_on:
      - db
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  frontend:
    build:
      context: .
      dockerfile: front/Dockerfile
    ports:
      - "${PORT:-8080}:80"
    environment:
      - VITE_API_URL=${VITE_API_URL:-http://backend:3000}
    depends_on:
      - backend

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-kaayjob}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M

volumes:
  postgres_data:
```

---

## ÉTAPE 2: Déployer sur Railway

### 2.1 Créer un nouveau projet

1. Sur Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez votre dépôt GitHub contenant KaayJob

### 2.2 Configuration des services

Railway va créer 3 services. Configurez chacun:

#### Service 1: PostgreSQL (Database)

1. Cliquez sur le service **PostgreSQL**
2. Dans l'onglet **Variables**,noter:
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `DATABASE_URL` (format: `postgres://user:password@host:5432/db`)

#### Service 2: Backend

1. Cliquez sur **"New"** → **"GitHub Repo"**
2. Sélectionnez le backend
3. Configurez:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=@ref(postgres.DATABASE_URL)
   JWT_SECRET=votre-secret-complexe-a-changer
   JWT_EXPIRES_IN=7d
   ```

#### Service 2: Frontend

1. Cliquez sur **"New"** → **"GitHub Repo"**
2. Sélectionnez le frontend
3. Configurez:
   ```env
   VITE_API_URL=https://votre-backend.railway.app/api
   ```

---

## ÉTAPE 3: Variables d'environnement Railway

Dans chaque service Railway, allez dans **Variables** et configurez:

### Backend:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=@ref(<nom-service-postgres>.DATABASE_URL)
JWT_SECRET=<un-secret-très-long-et-complexe>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://<votre-projet>.up.railway.app
```

### Frontend:

```
VITE_API_URL=https://<votre-backend>.railway.app/api
```

---

## ÉTAPE 4: Déploiement

1. Cliquez sur **"Deploy"** dans chaque service
2. Attendez que le build se termine
3. Vérifiez les logs en cas d'erreur

---

## ÉTAPE 5: Accéder à l'application

Une fois déployé:

- **Frontend**: `https://votre-projet.up.railway.app`
- **Backend API**: `https://votre-backend-service.up.railway.app/api`

---

## Commandes Railway utiles

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Voir les logs
railway logs -e <environment>

# Ouvrir le dashboard
railway open
```

---

## Résumé

| Élément         | Provider           | Coût    |
| --------------- | ------------------ | ------- |
| Backend API     | Railway            | Gratuit |
| Frontend        | Railway            | Gratuit |
| Base de données | Railway PostgreSQL | Gratuit |
| **Total**       |                    | **0€**  |

**Limites gratuites Railway:**

- 500 heures/mois
- 1 projet gratuit
- Limites de ressources

---

## Pour votre soutenance

Vous pouvez démontrer:

1. ✅ Docker avec Dockerfile multi-étapes
2. ✅ Docker Compose pour l'orchestration
3. ✅ Déploiement cloud avec CI/CD
4. ✅ Variables d'environnement sensibles
5. ✅ Base de données PostgreSQL gérée
