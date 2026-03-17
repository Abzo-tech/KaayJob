# Architecture du Projet KaayJob

## 1. Vue d'Ensemble

KaayJob est une plateforme de mise en relation entre clients et prestataires de services. Le projet suit une architecture **microservices** avec un frontend séparé du backend, déployés sur des plateformes cloud distinctes.

---

## 2. Architecture du Backend

### 2.1 Stack Technologique

| Technologie | Description |
|-------------|-------------|
| **Node.js** | Environnement d'exécution JavaScript côté serveur |
| **Express.js** | Framework web pour API REST |
| **Prisma** | ORM (Object-Relational Mapping) pour PostgreSQL |
| **PostgreSQL** | Base de données relationnelle (via Prisma Accelerate) |
| **JWT** | Authentification par tokens |
| **Helmet** | Sécurité des en-têtes HTTP |
| **Morgan** | Journalisation des requêtes HTTP |
| **CORS** | Cross-Origin Resource Sharing |

### 2.2 Structure des Répertoires

```
backend/
├── src/
│   ├── config/           # Configuration de l'application
│   │   ├── database.ts   # Connexion à la base de données
│   │   ├── prisma.ts     # Instance Prisma
│   │   ├── schema.ts     # Schéma de validation
│   │   ├── seed.ts       # Données initiales
│   │   └── init-db.ts    # Initialisation de la base
│   ├── controllers/      # Logique métier
│   │   ├── authController.ts
│   │   ├── bookingController.ts
│   │   ├── categoryController.ts
│   │   ├── providerController.ts
│   │   ├── reviewController.ts
│   │   └── serviceController.ts
│   ├── routes/          # Définition des routes API
│   │   ├── auth.ts
│   │   ├── bookings.ts
│   │   ├── categories.ts
│   │   ├── providers.ts
│   │   ├── services.ts
│   │   ├── reviews.ts
│   │   ├── admin.ts
│   │   └── notifications.ts
│   ├── middleware/      # Intergiciels
│   │   └── auth.ts      # Authentification JWT
│   ├── services/        # Services externes
│   │   ├── emailService.ts
│   │   └── notificationService.ts
│   ├── interfaces/      # Définitions TypeScript
│   │   ├── IBooking.ts
│   │   ├── ICategory.ts
│   │   ├── IProvider.ts
│   │   ├── IReview.ts
│   │   ├── IService.ts
│   │   └── IUser.ts
│   ├── validations/    # Validation des données
│   │   └── index.ts
│   └── index.ts        # Point d'entrée de l'application
├── prisma/
│   └── schema.prisma   # Schéma de la base de données
└── package.json
```

### 2.3 Modèle de Données (Entités)

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Category     │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ email           │       │ name            │
│ password        │       │ slug            │
│ firstName       │       │ description     │
│ lastName        │       │ icon            │
│ phone           │       │ image           │
│ role            │       └────────┬────────┘
│ avatar          │                │
└────────┬────────┘                │
         │                         │
         │ 1:1                     │ 1:N
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   Provider      │       │    Service      │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ userId          │       │ providerId (FK) │
│ specialty       │       │ categoryId (FK) │
│ bio             │       │ name            │
│ hourlyRate      │       │ description     │
│ yearsExperience │       │ price           │
│ location        │       │ priceType       │
│ isAvailable     │       │ duration        │
│ rating          │       │ isActive        │
│ totalReviews    │       └─────────────────┘
│ totalBookings   │
│ isVerified      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐
│    Booking      │       │    Review      │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ clientId (FK)   │       │ bookingId (FK)  │
│ providerId (FK)  │       │ rating          │
│ serviceId (FK)  │       │ comment         │
│ bookingDate     │       │ createdAt       │
│ bookingTime     │       └─────────────────┐
│ duration        │
│ status          │
│ address         │
│ city            │
│ phone           │
│ notes           │
│ totalAmount     │
│ paymentStatus   │
└─────────────────┘
```

### 2.4 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **Auth** | | |
| POST | `/api/auth/register` | Inscription utilisateur |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Profil utilisateur |
| **Categories** | | |
| GET | `/api/categories` | Liste des catégories |
| POST | `/api/categories` | Créer catégorie (admin) |
| **Providers** | | |
| GET | `/api/providers` | Liste des prestataires |
| GET | `/api/providers/:id` | Détails prestataire |
| POST | `/api/providers` | Créer profil prestataire |
| PUT | `/api/providers/:id` | Mettre à jour prestataire |
| **Services** | | |
| GET | `/api/services` | Liste des services |
| POST | `/api/services` | Créer service |
| **Bookings** | | |
| GET | `/api/bookings` | Liste des réservations |
| POST | `/api/bookings` | Créer réservation |
| PUT | `/api/bookings/:id` | Mettre à jour réservation |
| DELETE | `/api/bookings/:id` | Annuler réservation |
| **Reviews** | | |
| GET | `/api/reviews/provider/:id` | Avis sur prestataire |
| POST | `/api/reviews` | Ajouter avis |
| **Admin** | | |
| GET | `/api/admin/users` | Liste utilisateurs |
| PUT | `/api/admin/users/:id` | Modifier utilisateur |
| DELETE | `/api/admin/users/:id` | Supprimer utilisateur |
| **Notifications** | | |
| GET | `/api/notifications` | Liste notifications |
| PUT | `/api/notifications/:id/read` | Marquer lu |

### 2.5 Déploiement Backend

- **Plateforme**: Render.com (Web Service)
- **Base de données**: Prisma Accelerate (PostgreSQL)
- **URL**: `https://kaayjob.onrender.com`
- **Port**: 10000 (Render)

---

## 3. Architecture du Frontend

### 3.1 Stack Technologique

| Technologie | Description |
|-------------|-------------|
| **React** | Bibliothèque JavaScript pour l'interface utilisateur |
| **TypeScript** | Typage statique pour JavaScript |
| **TailwindCSS** | Framework CSS utilitaire |
| **Vite** | Outil de build et développement |
| **React Router** | Gestion des routes |
| **React Hook Form** | Gestion des formulaires |
| **Axios** | Client HTTP |
| **Lucide React** | Icônes |
| **Recharts** | Graphiques |
| **Radix UI** | Composants UI accessibles |
| **Shadcn UI** | Composants UI personnalisés |
| **Vercel** | Plateforme de déploiement |

### 3.2 Structure des Répertoires

```
front/
├── src/
│   ├── components/
│   │   ├── admin/           # Composants administration
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdminBookings.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminPayments.tsx
│   │   │   ├── AdminServices.tsx
│   │   │   ├── AdminSettings.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminSubscriptions.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── client/          # Composants client
│   │   │   ├── BookingPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ServiceCategoriesPage.tsx
│   │   │   ├── ServiceDetailPage.tsx
│   │   │   ├── ServiceProvidersListPage.tsx
│   │   │   └── UserDashboard.tsx
│   │   ├── common/          # Composants partagés
│   │   │   ├── AuthForm.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   ├── CalendarPicker.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   ├── ProviderCard.tsx
│   │   │   └── ...
│   │   ├── forms/           # Composants de formulaires
│   │   ├── prestataire/     # Composants prestataire
│   │   │   ├── PrestataireBookings.tsx
│   │   │   ├── PrestataireDashboard.tsx
│   │   │   ├── PrestataireProfile.tsx
│   │   │   ├── PrestataireServices.tsx
│   │   │   ├── PrestataireSettings.tsx
│   │   │   └── PrestataireSidebar.tsx
│   │   ├── ui/              # Composants UI de base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── figma/           # Composants FIGMA
│   ├── lib/
│   │   ├── api.ts           # Configuration API
│   │   ├── auth.ts          # Fonctions authentification
│   │   └── notifications.ts # Gestion notifications
│   ├── App.tsx             # Application principale
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### 3.3 Flux de Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                        Page d'Accueil                           │
│                    (Route: / ou /home)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────────┐
│  Catégories     │ │ Connexion   │ │ Inscription         │
│  Services       │ │ (/login)    │ │ (/register)         │
└────────┬────────┘ └──────┬──────┘ └──────────┬──────────┘
         │                 │                    │
         │     ┌───────────┴────────┐          │
         │     │                    │          │
         ▼     ▼                    ▼          ▼
┌──────────────────────────────────────────────────────────────┐
│                     ESPACE CLIENT                            │
├──────────────────────────────────────────────────────────────┤
│ • Dashboard (/dashboard)                                     │
│ • Réservations (/bookings)                                  │
│ • Profil (/profile)                                          │
│ • Recherche prestataires (/providers)                        │
│ • Détails service (/services/:id)                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   ESPACE PRESTATAIRE                         │
├──────────────────────────────────────────────────────────────┤
│ • Dashboard (/prestataire/dashboard)                        │
│ • Services (/prestataire/services)                           │
│ • Réservations (/prestataire/bookings)                       │
│ • Profil (/prestataire/profile)                             │
│ • Abonnement (/prestataire/subscription)                    │
│ • Paramètres (/prestataire/settings)                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     ESPACE ADMIN                            │
├──────────────────────────────────────────────────────────────┤
│ • Dashboard (/admin)                                        │
│ • Utilisateurs (/admin/users)                               │
│ • Catégories (/admin/categories)                            │
│ • Services (/admin/services)                                │
│ • Réservations (/admin/bookings)                             │
│ • Paiements (/admin/payments)                               │
│ • Analytics (/admin/analytics)                             │
│ • Paramètres (/admin/settings)                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Déploiement Frontend

- **Plateforme**: Vercel
- **URL**: `https://kaay-job.vercel.app`
- **Build**: Vite (production)

---

## 4. Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└─────────────────────────────┬───────────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        │                                             │
        ▼                                             ▼
┌───────────────────────┐               ┌───────────────────────────┐
│    Frontend (Vercel)  │               │    Backend (Render.com)  │
│                       │               │                           │
│ https://kaay-job.    │               │  https://kaayjob.         │
│ vercel.app           │               │  onrender.com             │
│                       │               │                           │
│ ┌─────────────────┐   │    ┌────────┴────────┐                  │
│ │ React + Vite    │   │    │ Express.js     │                  │
│ │                 │───▶│    │ API REST        │                  │
│ │ - Client        │   │    │                 │                  │
│ │ - Prestataire    │   │    └────────┬────────┘                  │
│ │ - Admin          │   │             │                          │
│ └─────────────────┘   │             │                          │
└───────────────────────┘             │                          │
                                      │                          │
                                      ▼                          │
                              ┌───────────────┐                  │
                              │ Prisma        │                  │
                              │ Accelerate    │                  │
                              │ (PostgreSQL)  │                  │
                              └───────────────┘                  │
```

### 4.1 Communication API

1. **En développement local**:
   - Le frontend utilise le proxy Vite (`/api` → `localhost:3001`)

2. **En production**:
   - Le frontend appelle `/api/*`
   - Vercel rewrit vers `https://kaayjob.onrender.com/api/*`
   - Le backend répond avec les en-têtes CORS appropriés

---

## 5. Sécurité

### 5.1 Backend
- **JWT** pour l'authentification
- **Helmet** pour les en-têtes HTTP sécurisés
- **CORS** configuré pour les origines autorisées
- **bcrypt** pour le hachage des mots de passe
- **Validation** des données avec schéma

### 5.2 Base de Données
- **Prisma ORM** avec requêtes paramétrées (protection XSS/SQL Injection)
- **SSL** requis pour la connexion PostgreSQL

---

## 6. Conclusion

Ce projet suit les meilleures pratiques de développement web moderne avec:
- Une séparation claire des préoccupations (frontend/backend)
- Une architecture RESTful pour l'API
- Un typage fort avec TypeScript
- Un déploiement cloud automatisé
- Une base de données relationnelle normalisée
