# Configuration Production KaayJob

## 🚀 Déploiement Frontend + Backend

### Option 1: Backend sur Vercel (Recommandé)
```bash
# Dans le dossier backend
vercel --prod
# Suivre les instructions pour configurer la DB
```

### Option 2: Backend sur Railway/Heroku
```bash
# Railway (recommandé pour PostgreSQL)
railway login
railway init
railway up

# Variables d'environnement sur Railway:
DATABASE_URL=postgresql://...
JWT_SECRET=votre-secret-jwt
NODE_ENV=production
```

### Option 3: API externe existante
Si vous avez déjà une API déployée :
```bash
# Dans Vercel dashboard ou vercel.json
VITE_API_URL=https://votre-backend-api.com/api
```

## 🔧 Configuration Vercel

### 1. Variables d'environnement Frontend
```bash
# Dans Vercel dashboard > Project Settings > Environment Variables
VITE_API_URL=https://votre-backend-api.com/api
```

### 2. API Routes (si backend sur Vercel)
```javascript
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 📊 Test des Données en Production

### Via l'interface admin :
```
URL: https://kaay-job.vercel.app/admin
Login: admin@kaayjob.com / Password123
```

### Via les APIs :
```bash
# Remplacer YOUR_TOKEN par le token admin
curl -X GET "https://votre-api.com/api/admin/stats" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Via Prisma Studio :
```bash
# Configurer DATABASE_URL vers la DB de prod
npx prisma studio
```

## 🔍 Debugging Production

### 1. Logs Vercel
```bash
vercel logs --follow
```

### 2. Variables d'environnement
```bash
# Vérifier dans Vercel dashboard
VITE_API_URL=?
DATABASE_URL=?
```

### 3. Test API directe
```bash
# Test health endpoint
curl https://votre-api.com/api/health
```

## 📈 Monitoring Production

### Métriques disponibles :
- `/api/admin/stats` - Statistiques générales
- `/api/admin/users` - Liste utilisateurs
- `/api/admin/bookings` - Liste réservations
- `/api/admin/services` - Liste services

### Alertes à surveiller :
- Erreurs 500 (logs Vercel)
- Temps de réponse API
- Connexions DB échouées