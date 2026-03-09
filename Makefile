# ===================================================================
# Makefile - KaayJob Docker Commands
# ===================================================================

# Couleurs
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Variables
COMPOSE = docker-compose
DOCKER = docker

.PHONY: help build up down restart logs logs-backend logs-frontend logs-db clean ps migrate seed

# ===================================================================
# Commandes principales
# ===================================================================

help:
	@echo ""
	@echo "$(BLUE)🐳 KaayJob - Commandes Docker$(NC)"
	@echo ""
	@echo "$(GREEN)make build$(NC)       - Construire les images Docker"
	@echo "$(GREEN)make up$(NC)          - Démarrer tous les services"
	@echo "$(GREEN)make down$(NC)        - Arrêter tous les services"
	@echo "$(GREEN)make restart$(NC)     - Redémarrer tous les services"
	@echo "$(GREEN)make logs$(NC)         - Voir tous les logs"
	@echo "$(GREEN)make logs-backend$(NC)   - Logs du backend"
	@echo "$(GREEN)make logs-frontend$(NC)  - Logs du frontend"
	@echo "$(GREEN)make logs-db$(NC)        - Logs de la base de données"
	@echo "$(GREEN)make ps$(NC)          - Statut des containers"
	@echo "$(GREEN)make clean$(NC)       - Supprimer les containers et volumes"
	@echo "$(GREEN)make migrate$(NC)    - Exécuter les migrations Prisma"
	@echo "$(GREEN)make seed$(NC)        - Exécuter le seed de la base de données"
	@echo ""

# Construire les images
build:
	@echo "$(YELLOW)🔨 Construction des images Docker...$(NC)"
	$(COMPOSE) build --no-cache

# Démarrer les services
up:
	@echo "$(YELLOW)🚀 Démarrage des services...$(NC)"
	$(COMPOSE) up -d
	@echo ""
	@echo "$(GREEN)✅ Services démarrés!$(NC)"
	@echo "$(BLUE)   Frontend: http://localhost$(NC)"
	@echo "$(BLUE)   Backend:  http://localhost:3000$(NC)"
	@echo "$(BLUE)   API:      http://localhost:3000/api$(NC)"

# Arrêter les services
down:
	@echo "$(YELLOW)🛑 Arrêt des services...$(NC)"
	$(COMPOSE) down

# Redémarrer les services
restart: down up

# Logs
logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

logs-db:
	$(COMPOSE) logs -f db

# Statut des containers
ps:
	$(COMPOSE) ps

# Nettoyer
clean:
	@echo "$(YELLOW)🧹 Nettoyage des containers et volumes...$(NC)"
	$(COMPOSE) down -v
	$(DOCKER) system prune -f

# Exécuter les migrations
migrate:
	@echo "$(YELLOW)📦 Exécution des migrations Prisma...$(NC)"
	$(COMPOSE) exec backend npx prisma migrate deploy

# Exécuter le seed
seed:
	@echo "$(YELLOW)🌱 Exécution du seed...$(NC)"
	$(COMPOSE) exec backend npx ts-node src/config/seed.ts
