# Documentation Kubernetes - KaayJob

## Overview

KaayJob utilise Kubernetes (K8s) pour le déploiement en production. La configuration utilise **Kustomize** pour gérer les environments.

## Structure des fichiers K8s

```
k8s/
├── kustomization.yaml   # Fichier principal Kustomize
├── namespace.yaml      # Définition du namespace
├── secrets.yaml       # Variables sensibles
├── configmap.yaml    # Configuration non-sensitive
├── postgres.yaml   # Base de données PostgreSQL
├── backend.yaml    # API Backend Node.js
├── frontend.yaml   # Application Front React
├── ingress.yaml  # Exposition externe (optionnel)
```

## Déploiement

### 1. Prérequis

- Kubernetes 1.24+
- kubectl configuré
- (Optionnel) Kustomize ou Helm

### 2. Appliquer la configuration

```bash
# Appliquer tout avec Kustomize
kubectl apply -k k8s/

# Ou apply fichier par fichier
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

### 3. Vérifier le déploiement

```bash
# Voir les pods
kubectl get pods -n kaayjob

# Voir les services
kubectl get svc -n kaayjob

#Voir les déploiements
kubectl get deployments -n kaayjob

# Voir les logs
kubectl logs -n kaayjob -l app=backend
kubectl logs -n kaayjob -l app=frontend
```

## Composants

### Namespace

**Fichier:** `namespace.yaml`

- Nom: `kaayjob`
- Labels: `app.kubernetes.io/name: kaayjob`

### PostgreSQL

**Fichier:** `postgres.yaml`

- Image: `postgres:15-alpine`
- Type: **StatefulSet** (données persistantes)
- Storage: 5Gi (volumeClaimTemplates)
- Ressources: 256Mi-512Mi RAM, 250m-500m CPU
- Health checks: `pg_isready`

**Service:**
- Nom: `postgres-service`
- Port: 5432 (ClusterIP)

### Backend API

**Fichier:** `backend.yaml`

- Image: `kaayjob-backend:latest` (à configurer)
- Réplicas: 2
- Ressources: 256Mi-512Mi RAM, 250m-500m CPU
- Environment:
  - `NODE_ENV`: production
  - `PORT`: 3000
  - `DATABASE_URL`: (depuis secrets)
  - `JWT_SECRET`: (depuis secrets)
  - `JWT_EXPIRES_IN`: 7d

**Service:**
- Nom: `backend-service`
- Port: 3000 (ClusterIP)

### Frontend

**Fichier:** `frontend.yaml`

- Image: `kaayjob-frontend:latest` (à configurer)
- Réplicas: 2
- Ressources: 128Mi-256Mi RAM, 100m-200m CPU
- Environment:
  - `VITE_API_URL`: /api (ou URL externe)

**Service:**
- Nom: `frontend-service`
- Ports: 80 (NodePort 30001 pour Minikube)

### Ingress

**Fichier:** `ingress.yaml`

- Classe: nginx
- Règles:
  - `/` → frontend:80
  - `/api` → backend:3000
- Timeout: 30s

## Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| NODE_ENV | Environment | production |
| PORT | Port backend | 3000 |
| DATABASE_URL | Connexion PostgreSQL | - |
| JWT_SECRET | Clé JWT | - |
| JWT_EXPIRES_IN | Expiration JWT | 7d |
| VITE_API_URL | URL API frontend | /api |

### Ressources par composant

| Composant | Requests | Limits |
|-----------|----------|--------|
| Frontend | 128Mi, 100m | 256Mi, 200m |
| Backend | 256Mi, 250m | 512Mi, 500m |
| PostgreSQL | 256Mi, 250m | 512Mi, 500m |

## Opérations

### Mise à l'échelle

```bash
# Scale frontend
kubectl scale deployment frontend --replicas=3 -n kaayjob

# Scale backend
kubectl scale deployment backend --replicas=3 -n kaayjob
```

### Mise à jour

```bash
# Mise à jour image
kubectl set image deployment/backend backend= nouveau-tag -n kaayjob

# Rollback
kubectl rollout undo deployment/backend -n kaayjob
```

### Surveillance

```bash
# Statut pods
kubectl get pods -n kaayjob -w

# Stats ressources
kubectl top pods -n kaayjob

# Events
kubectl get events -n kaayjob --sort-by='.lastTimestamp'
```

### Nettoyage

```bash
# Supprimer tout
kubectl delete -k k8s/

# Supprimer namespace
kubectl delete namespace kaayjob
```

## Docker

### Build des images

```bash
# Backend
docker build -t kaayjob-backend:latest ./backend

# Frontend
docker build -t kaayjob-frontend:latest ./front
```

### Push vers registry

```bash
# Tag
docker tag kaayjob-backend:latest your-registry/kaayjob-backend:latest

# Push
docker push your-registry/kaayjob-backend:latest
```

### Configuration registry privé

Modifier `k8s/secrets.yaml`:
```yaml
stringData:
  DOCKER_USERNAME: your-username
  DOCKER_PASSWORD: your-password
```

## Développement local (Minikube)

```bash
# Démarrer Minikube
minikube start

# Activer ingress
minikube addons enable ingress

# Appliquer la config
kubectl apply -k k8s/

# Accéder au frontend
minikube service frontend-service -n kaayjob

# Dashboard Kubernetes
minikube dashboard
```

## Production

### Prérequis supplémentaires

1. **Ingress Controller** (nginx, traefik, ou cloud)
2. **SSL/TLS** (Let's Encrypt ou certificat)
3. **Monitoring** (Prometheus, Grafana)
4. **Logging** (ELK, Loki)

### Checklist production

- [ ] Changer les secrets (`JWT_SECRET`, mot de passe DB)
- [ ] Configurer le domain dans `ingress.yaml`
- [ ] Activer SSL/TLS
- [ ] Configurer le storage (SSD recommandé pour PostgreSQL)
- [ ] Setup backup PostgreSQL
- [ ] Configure auto-scaling (HPA)
- [ ] Monitoring et alertes

### Auto-scaling (optionnel)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: kaayjob
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Résolution de problèmes

```bash
# Voir les erreurs
kubectl describe pod <pod-name> -n kaayjob

# Logs temps réel
kubectl logs -f <pod-name> -n kaayjob

#Redémarrer un pod
kubectl delete pod <pod-name> -n kaayjob

# Voir les ressources
kubectl top pods -n kaayjob

# Debug réseau
kubectl exec -it <pod-name> -n kaayjob -- sh
```