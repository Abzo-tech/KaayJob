# KaayJob - Documentation du Projet

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Structure des Fichiers](#structure-des-fichiers)
5. [Guide d'Installation](#guide-dinstallation)
6. [Guide Utilisateur](#guide-utilisateur)
   - [Partie Client](#partie-client)
   - [Partie Prestataire](#partie-prestataire)
   - [Partie Admin](#partie-admin)
7. [Modèle Économique](#modèle-économique)
8. [Fonctionnalités Futures](#fonctionnalités-futures)

---

## Introduction

**KaayJob** est une plateforme de mise en relation entre clients et prestataires de services au Sénégal. Elle permet aux utilisateurs de trouver et réserver des services variés (réparation, ménage, cours, coiffure, etc.) auprès de prestataires locaux.

### Types d'utilisateurs

- **Client** : Recherche et reserve des services
- **Prestataire** : Propose ses services et gère les réservations
- **Admin** : Gère la plateforme, les utilisateurs et les abonnements

---

## Architecture du Projet

### Structure des branches Git

```
main                    # Version stable
├── dev/admin.v1        # Partie admin (terminée)
└── dev/prestataire.v1  # Partie prestataire (terminée)
```

### Base de données (à implémenter)

- **Users** : Clients, prestataires, admins
- **Services** : Services proposés par les prestataires
- **Bookings** : Réservations
- **Subscriptions** : Abonnements Premium
- **Payments** : Paiements des abonnements

---

## Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS + Shadcn UI
- **Icons** : Lucide React
- **State** : React Hooks (useState)

---

## Structure des Fichiers

```
src/
├── App.tsx                    # Point d'entrée principal
├── main.tsx                   # Rendu React
├── index.css                  # Styles globaux
├── components/
│   ├── Header.tsx            # Navigation principale
│   ├── HomePage.tsx          # Page d'accueil
│   ├── LoginPage.tsx         # Connexion
│   ├── ServiceCategoriesPage.tsx  # Catégories
│   ├── ServiceDetailPage.tsx # Détails service
│   ├── BookingPage.tsx       # Réservation
│   ├── CheckoutPage.tsx      # Paiement
│   ├── UserDashboard.tsx     # Espace client
│   ├── ContactPage.tsx      # Contact
│   ├── Logo.tsx             # Logo KaayJob
│   └── ui/                  # Composants UI (shadcn)
│
├── admin/                    # Pages admin
│   ├── AdminSidebar.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminUsers.tsx
│   ├── AdminServices.tsx
│   ├── AdminBookings.tsx
│   ├── AdminAnalytics.tsx
│   ├── AdminSettings.tsx
│   ├── AdminSubscriptions.tsx
│   └── AdminPayments.tsx
│
└── prestataire/              # Pages prestataire
    ├── PrestataireSidebar.tsx
    ├── PrestataireDashboard.tsx
    ├── PrestataireServices.tsx
    ├── PrestataireBookings.tsx
    ├── PrestataireProfile.tsx
    └── PrestataireSettings.tsx
```

---

## Guide d'Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/MameBoussoKa/KaayJob.git
cd KaayJob

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Construction pour production

```bash
npm run build
```

---

## Guide Utilisateur

### Partie Client

#### Homepage

- Présentation de la plateforme
- Catégories de services
- call-to-action vers la recherche

#### Recherche de services

- Par catégorie
- Par localisation
- Filtrage par prix, note

#### Réservation

1. Choisir un service
2. Sélectionner un prestataire
3. Choisir date et heure
4. Confirmer la réservation

---

### Partie Prestataire

Accessible via : **Header → Prestataire**

#### Dashboard

- Vue d'ensemble des statistiques
- Réservations récentes
- Badge Premium affiché
- Services actifs

#### Mes Services

- Liste des services proposés
- Ajout/modification/suppression
- Activation/désactivation

#### Réservations

- Voir les demandes en attente
- Accepter ou refuser
- Marquer comme terminé
- **Note** : Paiement géré directement avec le client

#### Profil

- Photo de profil
- Informations personnelles
- Abonnement Premium
- Biography

#### Paramètres

- Préférences générales
- Notifications
- Sécurité (mot de passe, 2FA)

---

### Partie Admin

Accessible via : **Header → Admin**

#### Dashboard

- Statistiques globales
- Réservations récentes
- Services populaires

#### Utilisateurs

- Liste des clients et prestataires
- Filtres par rôle
- Actions : voir, modifier, désactiver

#### Services

- Tous les services de la plateforme
- Gestion des catégories
- Statut (actif/inactif)

#### Réservations

- Suivi de toutes les réservations
- Filtres par statut

#### Analyses

- Statistiques détaillées
- Graphiques
- Top prestataires
- Activité récente

#### Abonnements

- **3 Plans :**
  - **Gratuit** : 5 services max, visibilité standard
  - **Premium** (9 900 CFA/mois) : Services illimités, badge VIP, priorité
  - **Pro** (24 900 CFA/mois) : Tout Premium + publication en premier, formation

#### Paiements

- **Workflow :**
  1. Prestataire paie via Wave/Orange Money
  2. Soumet l'ID de transaction
  3. Admin valide
  4. Abonnement activé

#### Paramètres

- Configuration de la plateforme
- Profil administrateur
- Notifications
- Sécurité

---

## Modèle Économique

### Revenus de KaayJob

1. **Abonnements Premium/Pro** des prestataires
   - 9 900 CFA/mois (Premium)
   - 24 900 CFA/mois (Pro)

2. **Pas de commission sur les services**
   - Paiements directement entre client et prestataire
   - KaayJob ne gère pas l'argent des services

### Cycle de paiement

```
Prestataire → Wave/Orange Money → Preuve de paiement → Admin valide → Abonnement activé
```

---

## Fonctionnalités Futures

### Phase 2

- [ ] Intégration paiement en ligne (Wave API, Orange Money API)
- [ ] Système de messagerie client-prestataire
- [ ] Notifications push
- [ ] Application mobile (React Native/Flutter)

### Phase 3

- [ ] Système de messagerie interne
- [ ] Galerie photos/portfolio prestataires
- [ ] Blog/Actualités
- [ ] Programme de fidélité

---

## Équipe

- **Développeur Frontend** : [Ton ami]
- **Développeur Frontend/Admin** : [Toi]

---

## Licence

Projet académique - Soutenance

---

_Dernière mise à jour : Février 2024_
