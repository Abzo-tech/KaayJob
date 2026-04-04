# 📦 Export de Base de Données KaayJob

Ce guide explique comment exporter et importer la base de données pour synchroniser le travail entre collaborateurs.

## 🚀 Export des Données

### Prérequis
- Node.js installé
- Accès à la base de données Prisma
- Variables d'environnement configurées (`.env`)

### Commande d'Export
```bash
cd backend
node export-database.js
```

### Résultat
Le script crée un fichier `backend/exports/kaayjob-export-[timestamp].sql` contenant :
- ✅ Tous les utilisateurs (clients, prestataires, admins)
- ✅ Toutes les catégories avec icônes et images
- ✅ Profils prestataires complets
- ✅ Services actifs
- ✅ Avis et réservations
- ✅ Données de démonstration

## 📥 Import des Données

### Pour votre Collaboratrice

1. **Récupérer le fichier d'export**
   ```bash
   # Copier le fichier kaayjob-export-[timestamp].sql depuis le repo
   ```

2. **Configurer la base de données**
   ```bash
   # S'assurer que PostgreSQL est installé et configuré
   # Créer une base de données vide : kaayjob
   createdb kaayjob
   ```

3. **Importer les données**
   ```bash
   # Se connecter à PostgreSQL et exécuter le fichier
   psql -U [votre_username] -d kaayjob -f kaayjob-export-[timestamp].sql

   # Ou depuis le dossier backend :
   psql -U [votre_username] -d kaayjob -f exports/kaayjob-export-[timestamp].sql
   ```

4. **Vérifier l'import**
   ```bash
   # Lancer Prisma Studio pour vérifier
   npx prisma studio

   # Ou vérifier via l'API
   curl http://localhost:3000/api/health
   ```

## 🔧 Configuration Requise

### Variables d'Environnement (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kaayjob"
JWT_SECRET="votre-secret-jwt"
NODE_ENV="development"
```

### Installation des Dépendances
```bash
cd backend
npm install
npx prisma generate
```

## 📊 Contenu de l'Export

### Tables Exportées
- `users` - Utilisateurs (clients, prestataires, admins)
- `categories` - Catégories de services
- `provider_profiles` - Profils détaillés des prestataires
- `services` - Services proposés par les prestataires
- `reviews` - Avis clients
- `bookings` - Réservations
- `subscriptions` - Abonnements (optionnel)

### Données de Test Incluses
- **Admin** : admin@kaayjob.com / admin123
- **Prestataires** : jardiniers@email.com, plombiers@email.com, etc. / test123
- **Catégories** : Plomberie, Électricité, Jardinage, etc.
- **Services actifs** pour démonstration

## 🔄 Synchronisation Régulière

Pour maintenir la cohérence :

1. **Après chaque modification importante** : Relancer l'export
2. **Avant de commencer le travail** : Importer la dernière version
3. **En cas de conflit** : Communiquer avec l'équipe

## 🆘 Dépannage

### Erreur de Connexion
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier les variables d'environnement
cat .env
```

### Erreur d'Import
```bash
# Vérifier la syntaxe SQL
psql -U [username] -d kaayjob -f kaayjob-export-[timestamp].sql --echo-errors

# En cas d'erreur, vider la base et réimporter
psql -U [username] -d kaayjob -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Problème de Permissions
```bash
# Accorder les permissions
psql -U [username] -d kaayjob -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO [username];"
```

## 📞 Support

En cas de problème avec l'import/export, contacter l'équipe de développement.