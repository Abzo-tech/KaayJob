# KaayJob - Documentation de Modélisation

Ce document contient tous les diagrammes UML du projet KaayJob, prêts à être reproduits dans StarUML.

---

## 1. DIAGRAMME ENTITÉ-RELATION (ERD)

### 1.1 Entités Principales

```
+------------------------+       +-----------------------+
|        USER           |       |    CATEGORY           |
+------------------------+       +-----------------------+
| - id: UUID            |<----->| - id: UUID            |
| - email: String       |       | - name: String        |
| - password: String    |       | - slug: String        |
| - firstName: String   |       | - description: String |
| - lastName: String    |       | - icon: String        |
| - phone: String       |       | - image: String       |
| - role: Role         |       | - isActive: Boolean   |
| - avatar: String?    |       | - displayOrder: Int   |
| - isVerified: Boolean |       | - parentId: UUID?     |
| - isActive: Boolean   |       +-----------+-----------+
| - createdAt: DateTime|                   |
| - updatedAt: DateTime|                   | 1:N
+----------+-----------+                   |
            |                               v
            | 1:1                  +---------------+
            |                       |    SERVICE    |
            v                       +---------------+
+------------------------+       | - id: UUID    |
|   PROVIDER_PROFILE     |       | - providerId  |
+------------------------+       | - categoryId |
| - id: UUID            |<------>| - name: String|
| - userId: UUID        |       | - description |
| - businessName: String|       | - price: Decimal|
| - specialty: String   |       | - priceType   |
| - bio: String?        |       | - duration: Int|
| - hourlyRate: Decimal |       | - isActive    |
| - yearsExperience: Int|       +-------+-------+
| - location: String    |               |
| - address: String      |               | N:1
| - city: String        |               v
| - region: String      |       +---------------+
| - postalCode: String  |       | PROVIDER_     |
| - serviceRadius: Int  |       | PROFILE       |
| - isAvailable: Boolean|       +---------------+
| - rating: Decimal     |
| - totalReviews: Int   |       +---------------+
| - totalBookings: Int  |       |    BOOKING    |
| - isVerified: Boolean |       +---------------+
| - profileImage: String|       | - id: UUID    |
+----------+------------+       | - clientId    |
            |                    | - serviceId   |
            | 1:N                | - bookingDate |
            v                    | - bookingTime |
+------------------------+     | - duration: Int|
|        REVIEW          |     | - status      |
+------------------------+     | - address     |
| - id: UUID            |     | - city        |
| - bookingId: UUID     |<----| - phone       |
| - clientId: UUID     |     | - notes       |
| - providerId: UUID    |     | - totalAmount |
| - serviceId: UUID?   |     | - paymentStatus|
| - rating: Int         |     +---------------+
| - comment: String?    |
| - isVerified: Boolean |
+----------------------+

+------------------------+
|       PAYMENT          |
+------------------------+
| - id: UUID            |
| - bookingId: UUID?    |
| - userId: UUID        |
| - amount: Decimal     |
| - paymentMethod: String|
| - status: PaymentStatus|
| - transactionId: String|
+------------------------+

+------------------------+
|    NOTIFICATION       |
+------------------------+
| - id: UUID            |
| - userId: UUID        |
| - title: String       |
| - message: String     |
| - type: String        |
| - read: Boolean       |
| - link: String?       |
| - createdAt: DateTime |
+------------------------+

+------------------------+
|    SUBSCRIPTION       |
+------------------------+
| - id: UUID            |
| - userId: UUID        |
| - plan: String        |
| - status: String      |
| - startDate: DateTime |
| - endDate: DateTime   |
| - subscriptionPlanId  |
+------------------------+

+------------------------+
|  SUBSCRIPTION_PLAN    |
+------------------------+
| - id: UUID            |
| - name: String        |
| - slug: String        |
| - description: String |
| - price: Decimal      |
| - duration: Int       |
| - features: JSON      |
| - isActive: Boolean   |
+------------------------+
```

### 1.2 Énumérations

```
+------------------------+
|         ROLE          |
+------------------------+
| CLIENT                 |
| PRESTATAIRE            |
| ADMIN                  |
+------------------------+

+------------------------+
|      BOOKING_STATUS    |
+------------------------+
| PENDING                |
| CONFIRMED              |
| IN_PROGRESS            |
| COMPLETED              |
| CANCELLED              |
| REJECTED               |
+------------------------+

+------------------------+
|     PAYMENT_STATUS     |
+------------------------+
| PENDING                |
| PAID                   |
| REFUNDED               |
+------------------------+

+------------------------+
|       PRICE_TYPE       |
+------------------------+
| FIXED                  |
| HOURLY                 |
| QUOTE                  |
+------------------------+
```

---

## 2. DIAGRAMME DE CAS D'UTILISATION

### 2.1 Cas d'utilisation - Client

```
+--------------------------------------------------+
|                  CLIENT                           |
+--------------------------------------------------+
|                                                  |
|  +-------------+                                 |
|  | S'inscrire  |                                 |
|  +------+------+                                 |
|         |                                        |
|         v                                        |
|  +-------------+     +-------------+              |
|  | Se connecter|---->| Parcourir   |              |
|  +------+------+     | catégories  |              |
|         |            +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Consulter   |     | Rechercher  |              |
|  | profil      |     | prestataire |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Modifier    |     | Voir        |              |
|  | profil      |     | profil      |              |
|  +------+------+     | prestataire |              |
|         |            +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Réserver    |     | Consulter   |              |
|  | service     |     | services    |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Paiement    |     | Laisser     |              |
|  | (futur)     |     | avis        |              |
|  +-------------+     +-------------+              |
|                                                  |
+--------------------------------------------------+
```

### 2.2 Cas d'utilisation - Prestataire

```
+--------------------------------------------------+
|                PRESTATAIRE                        |
+--------------------------------------------------+
|                                                  |
|  +-------------+                                 |
|  | S'inscrire  |                                 |
|  +------+------+                                 |
|         |                                        |
|         v                                        |
|  +-------------+     +-------------+              |
|  | Se connecter|---->| Configurer   |              |
|  +------+------+     | profil       |              |
|         |            +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Consulter   |     | Ajouter     |              |
|  | dashboard   |     | services    |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Voir        |     | Gérer       |              |
|  | réservations|     | services    |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Accepter/   |     | Répondre    |              |
|  | Refuser     |     | aux avis    |              |
|  | réservation |     |             |              |
|  +------+------+     +-------------+              |
|         |                                        |
|         v                                        |
|  +-------------+                                 |
|  | Demander    |                                 |
|  | vérification|                                 |
|  +-------------+                                 |
|                                                  |
+--------------------------------------------------+
```

### 2.3 Cas d'utilisation - Administrateur

```
+--------------------------------------------------+
|               ADMINISTRATEUR                      |
+--------------------------------------------------+
|                                                  |
|  +-------------+                                 |
|  | Se connecter|                                 |
|  +------+------+                                 |
|         |                                        |
|         v                                        |
|  +-------------+     +-------------+              |
|  | Voir        |     | Gérer       |              |
|  | dashboard   |     | utilisateurs |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Voir        |     | Vérifier    |              |
|  | analytics   |     | prestataire |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Gérer       |     | Gérer       |              |
|  | catégories  |     | services    |              |
|  +------+------+     +------+------+             |
|         |                   |                    |
|         v                   v                    |
|  +-------------+     +-------------+              |
|  | Gérer       |     | Voir        |              |
|  | réservations|     | paiements   |              |
|  +-------------+     +-------------+              |
|                                                  |
+--------------------------------------------------+
```

---

## 3. DIAGRAMME DE CLASSES (BACKEND)

### 3.1 Structure des Controllers

```
+------------------------+
|     <<interface>>     |
|     IUserController   |
+------------------------+
| + register()          |
| + login()             |
| + getProfile()        |
| + updateProfile()     |
| + changePassword()   |
+------------------------+
          ^
          | implements
          |
+------------------------+
|    AuthController     |
+------------------------+
| - userService         |
| - jwtService          |
+------------------------+
| + register()          |
| + login()             |
| + getProfile()        |
| + updateProfile()     |
| + changePassword()   |
+------------------------+

+------------------------+
|  <<interface>>        |
| IProviderController   |
+------------------------+
| + getAll()            |
| + getById()           |
| + getByCategory()     |
| + createProfile()      |
| + updateProfile()     |
+------------------------+
          ^
          | implements
          |
+------------------------+
| ProviderController    |
+------------------------+
| - providerService     |
+------------------------+
| + getAll()            |
| + getById()           |
| + getByCategory()     |
| + createProfile()     |
| + updateProfile()    |
| + getDashboard()     |
+------------------------+
```

### 3.2 Modèles de Données

```
+------------------------+       +-------------------+
|      <<enum>>         |       |   <<enum>>        |
|       Role            |       |  BookingStatus    |
+------------------------+       +-------------------+
| CLIENT                |       | PENDING            |
| PRESTATAIRE           |       | CONFIRMED          |
| ADMIN                 |       | IN_PROGRESS        |
+------------------------+       | COMPLETED          |
                                 | CANCELLED          |
                                 | REJECTED           |
                                 +-------------------+

+------------------------+
|      <<model>>        |
|        User           |
+------------------------+
| - id: UUID           |
| - email: String      |
| - password: String    |
| - firstName: String  |
| - lastName: String   |
| - phone: String      |
| - role: Role         |
| - avatar: String?    |
+------------------------+
| + validatePassword() |
| + toJSON()           |
+------------------------+

+------------------------+
|    <<model>>          |
| ProviderProfile       |
+------------------------+
| - id: UUID           |
| - userId: UUID       |
| - businessName: Str  |
| - specialty: String  |
| - bio: String?       |
| - hourlyRate: Decimal|
| - rating: Decimal    |
+------------------------+
| + updateRating()      |
| + incrementBookings() |
+------------------------+
```

---

## 4. DIAGRAMME DE SÉQUENCE

### 4.1 Flux d'Inscription Client

```
Participant: Client          Participant: Frontend       Participant: Backend       Participant: Database
     |                          |                          |                          |
     |  1. Remplir formulaire   |                          |                          |
     |------------------------->|                          |                          |
     |                          |  2. POST /api/auth/register|                          |
     |                          |------------------------->|                          |
     |                          |                          |  3. Validate input      |
     |                          |                          |------------------------->|
     |                          |                          |  4. Hash password       |
     |                          |                          |------------------------->|
     |                          |                          |  5. INSERT user         |
     |                          |                          |------------------------->|
     |                          |                          |                          |
     |                          |  6. Return user         |                          |
     |                          |<-------------------------|                          |
     |  7. Redirect to login   |                          |                          |
     |<-------------------------|                          |                          |
```

### 4.2 Flux de Réservation

```
Participant: Client          Participant: Frontend       Participant: Backend       Participant: Database
     |                          |                          |                          |
     |  1. Sélectionner service |                          |                          |
     |------------------------->|                          |                          |
     |                          |  2. POST /api/bookings   |                          |
     |                          |------------------------->|                          |
     |                          |                          |  3. Validate booking    |
     |                          |                          |------------------------->|
     |                          |                          |  4. Check availability  |
     |                          |                          |------------------------->|
     |                          |                          |  5. INSERT booking      |
     |                          |                          |------------------------->|
     |                          |  6. Return booking      |                          |
     |                          |<-------------------------|                          |
     |  7. Afficher confirmation|                          |                          |
     |<-------------------------|                          |                          |
```

### 4.3 Flux d'Authentification JWT

```
Participant: Client          Participant: Frontend       Participant: Backend       Participant: Database
     |                          |                          |                          |
     |  1. Login form          |                          |                          |
     |------------------------->|                          |                          |
     |                          |  2. POST /api/auth/login|                          |
     |                          |------------------------->|                          |
     |                          |                          |  3. Find user           |
     |                          |                          |------------------------->|
     |                          |                          |  4. Compare password    |
     |                          |                          |------------------------->|
     |                          |  5. Generate JWT        |                          |
     |                          |------------------------->|                          |
     |                          |  6. Return token        |                          |
     |                          |<-------------------------|                          |
     |                          |  7. Store token        |                          |
     |  8. Redirect to dashboard|                          |                          |
     |<-------------------------|                          |                          |
     |                          |                          |                          |
     |  9. Request with token   |                          |                          |
     |------------------------->|                          |                          |
     |                          |  10. GET /api/bookings/me                        |
     |                          |------------------------->|                          |
     |                          |  11. Verify JWT         |                          |
     |                          |------------------------->|                          |
     |                          |  12. Extract userId    |                          |
     |                          |  13. Query bookings    |                          |
     |                          |------------------------->|                          |
     |                          |  14. Return data       |                          |
     |                          |<-------------------------|                          |
```

---

## 5. DIAGRAMME D'ÉTATS (STATE MACHINE)

### 5.1 États d'une Réservation

```
                                    +----------+
                                    | PENDING  |
                                    +----+-----+
                                         |
                     Accepter             |
                 +-----------------------+
                 |
                 v
        +---------------+      Démarrer       +-------------+
        |  CONFIRMED    |-------------------->| IN_PROGRESS |
        +-------+-------+                     +------+------+
                |                                    |
        Annuler |                               Terminer|
                |                                    |
                v                                    v
        +-------------+                     +------------+
        |  REJECTED   |                     |  COMPLETED  |
        +-------------+                     +------------+

+---------------------+
|  CANCELLED          |
|  ( depuis any state)|
+---------------------+
```

### 5.2 États d'un Prestataire

```
                          +----------+
                          |  PENDING |
                          +----+-----+
                               |
               Approbation     |
               admin           |
                               v
                      +----------------+
                      |    VERIFIED    |
                      +----+----------+
                           |
                           |
                 Désactiver|
                 (admin)  |
                           v
                      +------------+
                      |  SUSPENDED  |
                      +------------+
```

---

## 6. DIAGRAMME DE COMPOSANTS

### 6.1 Architecture des Composants Backend (APRÈS REFACTORING)

```
+------------------------------------------------------------------+
|                        BACKEND SERVER                             |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                      EXPRESS APP                           |  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +------------+  +------------+  +------------+           |  |
|  |  |   Routes   |  | Middleware  |  | Controllers|           |  |
|  |  +------------+  +------------+  +------------+           |  |
|  |  | /auth      |  | auth       |  | AuthController       |  |
|  |  | /providers |  | cors       |  | ProviderController  |  |
|  |  | /bookings  |  | helmet     |  | BookingController   |  |
|  |  | /services  |  |            |  | CategoryController   |  |
|  |  | /categories|  |            |  | ServiceController    |  |
|  |  | /reviews   |  |            |  | ReviewController    |  |
|  |  | /admin     |  |            |  |                     |  |
|  |  +------------+  +------------+  +------------+           |  |
|  |         |                |              |                |  |
|  |         v                v              v                |  |
|  |  +--------------------------------------------------+   |  |
|  |  |              SERVICES LAYER (NOUVEAU!)           |   |  |
|  |  +--------------------------------------------------+   |  |
|  |  |  UserService      | BookingService | CategoryService|   |  |
|  |  |  ServiceService   | EmailService  | NotificationSvc |   |  |
|  |  +--------------------------------------------------+   |  |
|  |                          |                               |  |
|  |                          v                               |  |
|  |  +--------------------------------------------------+   |  |
|  |  |                   PRISMA ORM                      |   |  |
|  |  +--------------------------------------------------+   |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                              |                                    |
+------------------------------|------------------------------------+
                                v
                     +-------------------+
                     |   POSTGRESQL      |
                     |   (Prisma         |
                     |   Accelerate)     |
                     +-------------------+
```

### 6.2 Architecture Routes Admin (APRÈS REFACTORING)

```
+------------------------------------------------------------------+
|                     ROUTES ADMIN MODULARISÉES                     |
+------------------------------------------------------------------+
|                                                                   |
|  /api/admin                                                       |
|  |                                                               |
|  +--- /users ---------> backend/src/routes/admin/users.ts        |
|  |                        -> utilise userService                  |
|  +--- /bookings -------> backend/src/routes/admin/bookings.ts    |
|  |                        -> utilise bookingService               |
|  +--- /categories -----> backend/src/routes/admin/categories.ts  |
|  |                        -> utilise categoryService              |
|  +--- /services -------> backend/src/routes/admin/services.ts     |
|  |                        -> utilise serviceService               |
|  +--- /payments -------> backend/src/routes/admin/payments.ts     |
|  +--- /subscriptions --> backend/src/routes/admin/subscriptions.ts
|  +--- /analytics ------> backend/src/routes/admin/analytics.ts     |
|  +--- /notifications -> backend/src/routes/admin/notifications.ts |
|                                                                   |
|  Fichiers créés:                                                  |
|  - backend/src/services/userService.ts                            |
|  - backend/src/services/bookingService.ts                         |
|  - backend/src/services/categoryService.ts                        |
|  - backend/src/services/serviceService.ts                         |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.3 Architecture des Composants Frontend (APRÈS REFACTORING)

```
+------------------------------------------------------------------+
|                     FRONTEND APPLICATION                          |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                      REACT APP                             |  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +------------------+  +------------------+                 |  |
|  |  |     PAGES        |  |    COMPONENTS    |                 |  |
|  |  +------------------+  +------------------+                 |  |
|  |  | HomePage         |  | Header           |                 |  |
|  |  | LoginPage        |  | Footer           |                 |  |
|  |  | ServiceCategories|  | ProviderCard     |                 |  |
|  |  | ServiceDetail    |  | CategoryCard     |                 |  |
|  |  | ProviderList     |  | BookingForm      |                 |  |
|  |  | UserDashboard    |  | ReviewForm       |                 |  |
|  |  | ProviderDashboard|  | NotificationBell |                 |  |
|  |  | AdminDashboard   |  |                  |                 |  |
|  |  +------------------+  +------------------+                 |  |
|  |         |                       |                          |  |
|  |         v                       v                          |  |
|  |  +------------------------------------------------+       |  |
|  |  |        ADMIN COMPONENTS (NOUVEAU!)             |       |  |
|  |  +------------------------------------------------+       |  |
|  |  |  UserFilters  | UserStats  | UserTable        |       |  |
|  |  |  UserDetailsModal | CreateUserForm            |       |  |
|  |  +------------------------------------------------+       |  |
|  |         |                       |                          |  |
|  |         v                       v                          |  |
|  |  +------------------------------------------------+       |  |
|  |  |                  LIB / UTILS                    |       |  |
|  |  +------------------------------------------------+       |  |
|  |  |  api.ts  | auth.ts  | notifications.ts | adminUtils.tsx |  |
|  |  +------------------------------------------------+       |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                              |                                    |
+------------------------------|------------------------------------+
                                v
                     +-------------------+
                     |    VITE PROXY    |
                     |   (/api -> ...)  |
                     +-------------------+
                                |
                                v
                     +-------------------+
                     |    BACKEND API    |
                     | (Render.com)      |
                     +-------------------+
```

---

## 7. DIAGRAMME DE PACKAGES

### 7.1 Structure des Packages Backend (APRÈS REFACTORING)

```
+------------------------------------------------------------------+
|                         BACKEND                                   |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                     src                                      |  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +------------------+  +------------------+  +-----------+ |  |
|  |  |     config       |  |    controllers   |  | middleware| |  |
|  |  +------------------+  +------------------+  +-----------+ |  |
|  |  | - database.ts   |  | - auth.ts       |  | - auth.ts | |  |
|  |  | - prisma.ts    |  | - booking.ts    |  +-----------+ |  |
|  |  | - schema.ts    |  | - provider.ts   |                |  |
|  |  | - seed.ts      |  | - category.ts   |                |  |
|  |  +------------------+  | - service.ts    |                |  |
|  |                       | - review.ts     |                |  |
|  |                       +------------------+                |  |
|  |                                                            |  |
|  |  +------------------+  +------------------+  +-----------+ |  |
|  |  |     routes       |  |    services     |  | interfaces| |  |
|  |  +------------------+  +------------------+  +-----------+ |  |
|  |  | - auth.ts       |  | - userService   |  | - IUser   | |  |
|  |  | - bookings.ts   |  | - bookingService |  | - IProvider| |  |
|  |  | - providers.ts |  | - categoryService|  | - IBooking | |  |
|  |  | - categories.ts|  | - serviceService |  | - IService | |  |
|  |  | - services.ts  |  | - emailService   |  | - ICategory| |  |
|  |  | - reviews.ts   |  | - notifService   |  +-----------+ |  |
|  |  | - admin.ts     |  +------------------+                |  |
|  |  | - notifications|                                          |  |
|  |  +------------------+                                      |  |
|  |                                                            |  |
|  |  +------------------+  +------------------+                 |  |
|  |  |   routes/admin  |  |   validations   |                 |  |
|  |  +------------------+  +------------------+                 |  |
|  |  | - users.ts      |  | - index.ts      |                 |  |
|  |  | - bookings.ts   |  +------------------+                 |  |
|  |  | - categories.ts |                                      |  |
|  |  | - services.ts   |                                      |  |
|  |  | - payments.ts   |                                      |  |
|  |  | - subscriptions|                                      |  |
|  |  | - analytics.ts |                                      |  |
|  |  | - notifications|                                      |  |
|  |  +------------------+                                      |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 8. DIAGRAMME DE DÉPLOIEMENT

### 8.1 Architecture de Production

```
                                    INTERNET
                                      |
          +---------------------------+---------------------------+
          |                           |                           |
          v                           v                           v
+-------------------+      +-------------------+      +-------------------+
|   USER BROWSER   |      |    VERCEL CDN     |      |  RENDER.COM       |
|                   |      |                   |      |                   |
| - Chrome          |      | - Frontend Build  |      | - Backend Docker  |
| - Firefox         |      | - Static Assets   |      | - Node.js         |
| - Safari          |      | - API Proxy       |      | - Express.js      |
| - Mobile          |      +-------------------+      +--------+----------+
+-------------------+                                        |
          |                                                  v
          |                                       +-------------------+
          |                                       | PRISMA ACCELERATE |
          +------------------------------------->| (PostgreSQL)      |
                                        HTTPS     +-------------------+

 COMMUNICATIONS:
 
 Client <-> Vercel: HTTPS (Frontend + Proxy)
 Vercel <-> Render: HTTPS (API calls)
 Render <-> Prisma: PostgreSQL (SSL)
```

---

## 9. RÉSUMÉ DES RELATIONS ENTITÉ

| Entité 1        | Relation      | Entité 2        | Type       |
|-----------------|---------------|-----------------|------------|
| User            | 1:1           | ProviderProfile | Optionnel  |
| User            | 1:N           | Booking         | Client     |
| User            | 1:N           | Review          | Client     |
| User            | 1:N           | Payment         | Payeur     |
| User            | 1:N           | Notification    | Proprio    |
| ProviderProfile | 1:N           | Service         | Prestataire|
| ProviderProfile | 1:N           | Review          | Réception  |
| Category        | 1:N           | Service         | Parente    |
| Category        | Self 1:N      | Category        | Hiérarchie |
| Service         | 1:N           | Booking         | Proposé    |
| Booking         | 1:1           | Review          | Révisable  |
| Booking         | 1:N           | Payment         | Payé       |
| Service         | 1:N           | Review          | Évalué     |
| Subscription    | N:1           | User            | Proprio    |
| SubscriptionPlan| 1:N           | Subscription    | Plan       |

---

## 10. RÉSUMÉ DES CHANGEMENTS DE REFACTORING

### Backend
1. **Routes admin modularisées** (backend/src/routes/admin/)
   - users.ts, bookings.ts, categories.ts, services.ts, payments.ts, subscriptions.ts, analytics.ts, notifications.ts

2. **Services créés** (backend/src/services/)
   - userService.ts, bookingService.ts, categoryService.ts, serviceService.ts

3. **admin.ts** est maintenant un point d'entrée qui importe tous les modules

### Frontend
1. **Composants réutilisables créés** (front/src/components/admin/)
   - UserFilters.tsx, UserStats.tsx, UserTable.tsx, UserDetailsModal.tsx, CreateUserForm.tsx

2. **AdminUsers.tsx** refactorisé pour utiliser les composants réutilisables

3. **Nouveaux utilitaires** (front/src/lib/)
   - adminUtils.tsx (fonctions pour les badges, statuts, formatting)

---

*Document généré pour KaayJob - Prêt pour StarUML*
*Mis à jour après refactoring*
