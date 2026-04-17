# Configuration Production Frontend

## Vercel Environment Variables

### 1. Accès au Dashboard Vercel
```
URL: https://vercel.com/dashboard
Projet: kaay-job (ou votre nom de projet)
```

### 2. Configuration des Variables d'Environnement

Dans **Project Settings > Environment Variables** :

```bash
# API Backend URL
VITE_API_URL=https://kaayjob.onrender.com/api

# Autres variables (optionnel)
NODE_ENV=production
```

### 3. Déploiement Automatique

Après avoir ajouté la variable `VITE_API_URL`, Vercel va automatiquement :
- ✅ Redéployer le frontend
- ✅ Utiliser l'API de production
- ✅ Connecter frontend ↔ backend

## 🔍 Vérification

### Test de Connexion API
```bash
# Test depuis votre navigateur
curl https://kaay-job.vercel.app/api/health
# Devrait retourner: {"success":true,"message":"API opérationnelle"}
```

### Test Fonctionnalités
```bash
# Test catégories
curl https://kaay-job.vercel.app/api/categories

# Test prestataires
curl https://kaay-job.vercel.app/api/providers?limit=5
```

## 🚀 États de Déploiement

| Service | URL | Statut |
|---------|-----|--------|
| Frontend | https://kaay-job.vercel.app/ | ✅ Actif |
| Backend | https://kaayjob.onrender.com/ | ✅ Actif |
| Database | Prisma PostgreSQL | ✅ Connecté |

## 📊 Monitoring Production

Utilisez les scripts créés pour vérifier l'état :

```bash
# Vérification configuration DB
./test-db-config.sh

# Test complet production
./check-production.sh https://kaayjob.onrender.com/api
```

## ⚡ Actions Immédiates Requises

### 1. Configuration Vercel
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet `kaay-job`
3. Aller dans **Settings > Environment Variables**
4. Ajouter : `VITE_API_URL = https://kaayjob.onrender.com/api`
5. Sauvegarder et déclencher un nouveau déploiement

### 2. Test Post-Déploiement
Après le déploiement Vercel :
```bash
# Test API connection
curl https://kaay-job.vercel.app/api/health

# Test fonctionnalités
curl https://kaay-job.vercel.app/api/categories
```

### 3. Debug (si nécessaire)
Si les appels API échouent :
```bash
# Vérifier les logs Vercel
vercel logs --follow

# Vérifier la configuration
echo $VITE_API_URL
```