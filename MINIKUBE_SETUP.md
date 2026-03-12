# ===================================================================

# Guide: Créer un cluster Kubernetes local avec Minikube

# ===================================================================

## Prérequis

- VirtualBox ou Hyper-V installé
- 4GB RAM disponibles
- 20GB espace disque

---

## ÉTAPE 1: Installer Minikube

### Sur Linux (Ubuntu):

```bash
# Installer kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Installer Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo cp minikube-linux-amd64 /usr/local/bin/minikube
chmod +x /usr/local/bin/minikube
```

### Sur Windows:

1. Télécharger et installer **Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Activer **Kubernetes** dans Docker Desktop Settings
3. Installer **kubectl**: `choco install kubernetes-cli`

### Sur macOS:

```bash
# Avec Homebrew
brew install kubectl
brew install minikube
```

---

## ÉTAPE 2: Démarrer Minikube

```bash
# Démarrer le cluster (avec VirtualBox)
minikube start --driver=virtualbox

# Ou avec Docker (plus simple si Docker Desktop)
minikube start --driver=docker
```

---

## ÉTAPE 3: Vérifier que ça fonctionne

```bash
# Voir le statut
minikube status

# Voir les nœuds
kubectl get nodes

# Voir les pods
kubectl get pods -A
```

---

## ÉTAPE 4: Déployer KaayJob

### 4.1 Préparer les images Docker

```bash
# Construire les images
docker build -t kaayjob-backend:latest -f backend/Dockerfile .
docker build -t kaayjob-frontend:latest -f front/Dockerfile .

# Les charger dans minikube
minikube image load kaayjob-backend:latest
minikube image load kaayjob-frontend:latest
```

### 4.2 Modifier les manifestes

Editer `k8s/backend.yaml` pour utiliser les images locales:

```yaml
image: kaayjob-backend:latest
```

(remplacer par votre image)

### 4.3 Déployer

```bash
# Appliquer les manifestes
kubectl apply -f k8s/

# Vérifier le statut
kubectl get pods -n kaayjob
kubectl get svc -n kaayjob
```

---

## ÉTAPE 5: Accéder à l'application

```bash
# Ouvrir le frontend dans le navigateur
minikube service frontend-service -n kaayjob

# Ou obtenir l'URL
minikube service list -n kaayjob
```

---

## Commandes utiles

```bash
# Arrêter le cluster
minikube stop

# Supprimer le cluster
minikube delete

# Voir les logs d'un pod
kubectl logs -n kaayjob -l app=backend

# Accéder à un conteneur
kubectl exec -it <pod-name> -n kaayjob -- /bin/sh

# Redémarrer un déploiement
kubectl rollout restart deployment/backend -n kaayjob
```

---

## Résumé

```
1. installer Minikube + kubectl
2. minikube start
3. builder les images Docker
4. kubectl apply -f k8s/
5. minikube service frontend
```

Voulez-vous que je vous aide pour une étape spécifique?
