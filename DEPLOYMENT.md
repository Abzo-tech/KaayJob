# 🚀 Guide de Déploiement KaayJob

## Prérequis

- Node.js 20+
- PostgreSQL (local ou Neon)
- Redis (optionnel pour cache)

## Variables d'environnement

### Production (Render)

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=10000
```

### Développement

```bash
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=kaayjob
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev-secret-key
NODE_ENV=development
PORT=3001
```

## Déploiement sur Render

### 1. Base de données

- Créer une base PostgreSQL sur Neon ou Render
- Exécuter les migrations Prisma :

```bash
npx prisma db push
```

### 2. Backend

- Créer un service Web sur Render
- Branch: `main`
- Build Command: `npm run build`
- Start Command: `npm start`
- Variables d'environnement: voir ci-dessus

### 3. Frontend

- Créer un service Static Site
- Branch: `main`
- Build Command: `npm run build`
- Publish Directory: `dist`
- Variables d'environnement: `VITE_API_URL=https://your-backend-url`

## Tests de déploiement

### Tests automatisés

```bash
# Tests end-to-end
npm test

# Tests de performance
node test-performance.js

# Tests de debug
node test-debug.js
```

### Vérifications manuelles

- [ ] Inscription client ✅
- [ ] Inscription prestataire ✅
- [ ] Création de service ✅
- [ ] Réservation ✅
- [ ] Paiements ✅
- [ ] Reviews ✅
- [ ] Dashboard admin ✅

## Monitoring

### Logs importants

- Erreurs de base de données
- Échecs d'authentification
- Temps de réponse > 5s

### Métriques clés

- Taux de succès des réservations
- Temps de réponse moyen
- Nombre d'utilisateurs actifs

## Rollback

En cas de problème :

1. Revenir à la version précédente sur Render
2. Vérifier les logs
3. Corriger et redéployer

## Sécurité

- JWT tokens avec expiration
- Rate limiting activé
- CORS configuré
- Validation des inputs
- Sanitisation des données

---

**Dernière mise à jour:** Avril 2026
**Version:** 1.0.0
**Status:** ✅ Prêt pour production
