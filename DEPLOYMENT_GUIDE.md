# ===================================================================

# Guide de déploiement KaayJob - VPS (le plus simple)

# ===================================================================

## Prérequis

Vous avez besoin d'un serveur VPS. Voici quelques options abordables:

| Provider         | Prix approximatif | Lien                     |
| ---------------- | ----------------- | ------------------------ |
| **Hetzner**      | ~5€/mois          | https://hetzner.cloud    |
| **DigitalOcean** | ~6$/mois          | https://digitalocean.com |
| **OVH**          | ~5€/mois          | https://ovh.com          |

---

## ÉTAPE 1: Commander un serveur VPS

1. Créez un compte sur Hetzner, DigitalOcean ou OVH
2. Commandez un VPS avec:
   - **CPU**: 2 vCPU minimum
   - **RAM**: 2 GB minimum
   - **Stockage**: 25 GB SSD
   - **OS**: Ubuntu 22.04 LTS

3. Notez l'adresse IP de votre serveur

---

## ÉTAPE 2: Se connecter au serveur

Ouvrez un terminal et connectez-vous:

```bash
ssh root@ADRESSE_IP_VOTRE_SERVER
```

Remplacez `ADRESSE_IP_VOTRE_SERVER` par l'IP de votre VPS.

---

## ÉTAPE 3: Installer Docker

Exécutez ces commandes sur le serveur:

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
usermod -aG docker votre_nom_utilisateur

# Installer Docker Compose
apt install docker-compose -y

# Vérifier l'installation
docker --version
docker-compose --version
```

---

## ÉTAPE 4: Transférer les fichiers du projet

Sur votre machine locale, exécutez:

```bash
# Créer un dossier pour le projet sur le serveur
scp -r . root@ADRESSE_IP_VOTRE_SERVER:/root/kaayjob/
```

Ou utilisez un client FTP comme FileZilla.

---

## ÉTAPE 5: Configurer les variables d'environnement

Sur le serveur, créez le fichier `.env`:

```bash
cd /root/kaayjob
cp .env.docker .env
nano .env
```

Modifiez les valeurs:

```env
# Ports
DB_PORT=5432
BACKEND_PORT=3002
FRONTEND_PORT=8080

# Base de données
DB_NAME=kaayjob
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_FORT

# JWT
JWT_SECRET=VOTRE_SECRET_TRES_LONG_ET_COMPLEXE

# URLs
FRONTEND_URL=http://ADRESSE_IP_VOTRE_SERVER
```

---

## ÉTAPE 6: Démarrer l'application

```bash
cd /root/kaayjob
docker-compose up -d
```

Vérifiez que tout fonctionne:

```bash
docker-compose ps
docker-compose logs -f
```

---

## ÉTAPE 7: Accéder à l'application

- **Frontend**: http://ADRESSE_IP_VOTRE_SERVER:8080
- **Backend API**: http://ADRESSE_IP_VOTRE_SERVER:3002/api

---

## Configuration HTTPS (SSL) - Optionnel mais recommandé

Pour ajouter SSL avec Let's Encrypt:

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx -y

# Obtenir le certificat
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Suivez les instructions à l'écran
```

---

## Commandes utiles

```bash
# Arrêter l'application
docker-compose down

# Redémarrer l'application
docker-compose restart

# Voir les logs
docker-compose logs -f backend

# Mettre à jour l'application
git pull
docker-compose build
docker-compose up -d
```

---

## Résumé des étapes

```
1. Commander VPS (Hetzner/DigitalOcean/OVH)
   ↓
2. Se connecter en SSH
   ↓
3. Installer Docker + Docker Compose
   ↓
4. Transférer les fichiers (scp)
   ↓
5. Configurer .env
   ↓
6. docker-compose up -d
   ↓
7. ✅ Application en ligne!
```
