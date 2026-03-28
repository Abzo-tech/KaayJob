# KaayJob - Diagrammes UML Complets (StarUML)

Ce fichier contient les diagrammes prêts à être reproduits directement dans StarUML avec tous les détails techniques.

---

# DIAGRAMME ENTITÉ-RELATION COMPLET

## Structure de Base de Données avec Géolocalisation

```
================================================================================
                              KA AYJOB - BASE DE DONNÉES
================================================================================

+-----------------------------------+       +-----------------------------------+
|             USER                  |       |           CATEGORY                |
+-----------------------------------+       +-----------------------------------+
| - id: UUID (PK)                   |       | - id: UUID (PK)                   |
| - email: String (unique)          |       | - name: String                    |
| - password: String (hashed)       |       | - slug: String (unique)           |
| - firstName: String               |       | - description: String?            |
| - lastName: String                |       | - icon: String?                   |
| - phone: String                   |       | - image: String?                  |
| - role: Role                      |       | - isActive: Boolean               |
|   (CLIENT/PRESTATAIRE/ADMIN)      |       | - displayOrder: Int               |
| - avatar: String?                 |       | - parentId: UUID? (FK)            |
| - bio: String?                    |       | - createdAt: DateTime             |
| - specialization: String?         |       | - updatedAt: DateTime             |
| - address: String?                |       +----------------+------------------+
| - zone: String?                   |                   | 1:N
| - latitude: Float? (Double)       |                   |
| - longitude: Float? (Double)      |                   | Hierarchical
| - isVerified: Boolean             |                   | relationship
| - isActive: Boolean               |                   |
| - createdAt: DateTime             |                   v
| - updatedAt: DateTime             |       +-----------------------------------+
+--------------+--------------------+       |           SERVICE                 |
               | 1:1 (optional)             +-----------------------------------+
               |                            | - id: UUID (PK)                   |
               |                            | - providerId: UUID (FK)           |
               |                            | - categoryId: UUID? (FK)          |
               |                            | - name: String                    |
               |                            | - description: String?            |
               |                            | - price: Decimal (10,2)           |
               |                            | - priceType: PriceType            |
               |                            |   (FIXED/HOURLY/QUOTE)            |
               |                            | - duration: Int?                  |
               |                            | - isActive: Boolean               |
               |                            | - createdAt: DateTime             |
               |                            | - updatedAt: DateTime             |
               +-----------------------------------+
                              | 1:N
                              v
+------------------------+-----------------------------------+
|           PROVIDER_PROFILE                                |
+------------------------+-----------------------------------+
| - id: UUID (PK)        | - userId: UUID (FK) (unique)      |
| - businessName: String?| - specialty: String?             |
| - bio: String?         | - hourlyRate: Decimal? (10,2)    |
| - yearsExperience: Int?| - location: String?              |
| - address: String?     | - city: String?                  |
| - region: String?      | - postalCode: String?            |
| - serviceRadius: Int?  | - isAvailable: Boolean           |
| - rating: Decimal (3,2)| - totalReviews: Int              |
| - totalBookings: Int   | - isVerified: Boolean            |
| - profileImage: String?| - specialties: JSON?             |
| - availability: JSON?  | - createdAt: DateTime            |
| - updatedAt: DateTime  |                                   |
+------------------------+-----------------------------------+
             | 1:N                    | 1:N
             |                        |
             |                        | Reviews
             |                        v
             |            +-----------------------------------+
             |            |           REVIEW                  |
             |            +-----------------------------------+
             |            | - id: UUID (PK)                   |
             |            | - bookingId: UUID (FK) (unique)   |
             |            | - clientId: UUID (FK)             |
             |            | - providerId: UUID (FK)           |
             |            | - serviceId: UUID? (FK)           |
             |            | - rating: Int (1-5)               |
             |            | - comment: String?                |
             |            | - isVerified: Boolean             |
             |            | - createdAt: DateTime             |
             |            | - updatedAt: DateTime             |
             |            +-----------------------------------+
             |
             | 1:N (Bookings by provider)
             v
+------------------------+-----------------------------------+
|           BOOKING      |                                   |
+------------------------+-----------------------------------+
| - id: UUID (PK)        | - clientId: UUID (FK)             |
| - serviceId: UUID (FK) | - bookingDate: DateTime           |
| - bookingTime: String  | - duration: Int (minutes)         |
| - status: BookingStatus| - address: String                 |
|   (PENDING/CONFIRMED/  | - city: String                    |
|    IN_PROGRESS/        | - phone: String?                  |
|    COMPLETED/CANCELLED/| - notes: String?                  |
|    REJECTED)           | - totalAmount: Decimal? (10,2)    |
| - paymentStatus: PaySt | - createdAt: DateTime             |
|   (PENDING/PAID/       | - updatedAt: DateTime             |
|    REFUNDED)           |                                   |
+------------------------+-----------------------------------+
             | 1:1 (optional)
             |
             | 1:N (Payments per booking)
             v
+------------------------+-----------------------------------+
|           PAYMENT      |                                   |
+------------------------+-----------------------------------+
| - id: UUID (PK)        | - bookingId: UUID? (FK)           |
| - userId: UUID (FK)    | - amount: Decimal (10,2)          |
| - paymentMethod: Str?  | - status: PaymentStatus           |
|   (MOBILE_MONEY/CARD/  |   (PENDING/PAID/REFUNDED)         |
|    BANK_TRANSFER)      | - transactionId: String?          |
| - createdAt: DateTime  |                                   |
+------------------------+-----------------------------------+

+------------------------+-----------------------------------+
|       NOTIFICATION     |       SUBSCRIPTION                |
+------------------------+-----------------------------------+
| - id: UUID (PK)        | - id: UUID (PK)                   |
| - userId: UUID (FK)    | - userId: UUID (FK)               |
| - title: String        | - plan: String (slug)             |
| - message: String      | - status: String                  |
| - type: String         |   (active/cancelled/expired)      |
|   (success/error/      | - startDate: DateTime             |
|    info/warning)       | - endDate: DateTime               |
| - read: Boolean        | - subscriptionPlanId: UUID? (FK)  |
| - link: String?        | - createdAt: DateTime             |
| - createdAt: DateTime  |                                   |
+------------------------+-----------------------------------+
                                |
                                | 1:N (belongs to plan)
                                v
+------------------------+-----------------------------------+
|    SUBSCRIPTION_PLAN   |       VERIFICATION_REQUEST        |
+------------------------+-----------------------------------+
| - id: UUID (PK)        | - id: UUID (PK)                   |
| - name: String         | - userId: UUID (FK)               |
| - slug: String (unique)| - documents: JSON?                |
| - description: String? | - status: String                  |
| - price: Decimal (10,2)|   (pending/approved/rejected)     |
| - duration: Int (days) | - reviewedBy: UUID? (FK)          |
| - features: JSON       | - reviewedAt: DateTime?           |
| - isActive: Boolean    | - createdAt: DateTime             |
| - displayOrder: Int    |                                   |
| - createdAt: DateTime  |                                   |
| - updatedAt: DateTime  |                                   |
+------------------------+-----------------------------------+
```

---

# DIAGRAMME DE CAS D'UTILISATION DÉTAILLÉ

## Vue d'Ensemble avec Géolocalisation

```
+======================================================================+
|                          KA AYJOB PLATFORM                           |
+======================================================================+

                    +-------------------+
                    |     VISITEUR      |
                    +-------------------+
                            |
                            | Parcourir sans compte
                            v
                    +-------------------+
                    |     CLIENT        |<----------------+
                    +-------------------+                 |
                            |                             |
                            | Inscription/Connexion      |
                            v                             |
                    +-------------------+                 |
                    |   PRESTATAIRE     |                 |
                    +-------------------+                 |
                            |                             |
                            | Gestion plateforme          |
                            v                             |
                    +-------------------+                 |
                    |   ADMINISTRATEUR  |                 |
                    +-------------------+                 |
                            |                             |
                            +-----------------------------+
                                        ^
                                        |
                            Validation et modération

FONCTIONNALITÉS GÉOLOCALISATION (TOUS LES ACTEURS):
- Détection position GPS
- Cartes interactives
- Recherche par proximité
- Géocodage adresses
- Calculs de distance
- Zones de service

FONCTIONNALITÉS COMMUNES:
- Gestion profil
- Notifications temps réel
- Support technique
- Sécurité et confidentialité

FONCTIONNALITÉS SPÉCIFIQUES PAR RÔLE:

CLIENT:
├── Découverte services
│   ├── Recherche géolocalisée
│   ├── Filtres par catégorie/note/prix
│   ├── Tri par distance/disponibilité
│   └── Comparaison prestataires
├── Réservation
│   ├── Calendrier interactif
│   ├── Sélection créneaux horaires
│   ├── Fourniture adresse complète
│   ├── Calcul prix automatique
│   └── Confirmation instantanée
├── Gestion réservations
│   ├── Suivi temps réel statut
│   ├── Modification/annulation
│   ├── Communication prestataire
│   └── Historique complet
├── Paiement
│   ├── Mobile money/Carte/Bank
│   ├── Sécurisation SSL
│   ├── Reçus automatiques
│   └── Historique transactions
├── Évaluation
│   ├── Notation 1-5 étoiles
│   ├── Commentaires détaillés
│   ├── Photos justificatives
│   └── Réponses prestataires
└── Profil personnalisé
    ├── Préférences géographiques
    ├── Adresses favorites
    ├── Historique recherches
    └── Paramètres notifications

PRESTATAIRE:
├── Configuration profil
│   ├── Informations professionnelles
│   ├── Géolocalisation précise
│   ├── Spécialisations multiples
│   ├── Portfolio visuel
│   └── Disponibilité horaire
├── Gestion services
│   ├── Création services détaillés
│   ├── Prix flexibles (forfait/horaire)
│   ├── Catégorisation hiérarchique
│   ├── Photos et descriptions
│   └── Statut actif/inactif
├── Gestion réservations
│   ├── Accepter/Refuser demandes
│   ├── Démarrer services
│   ├── Marquer terminé
│   ├── Annuler si nécessaire
│   └── Communication clients
├── Système abonnement
│   ├── Plans Gratuit/Premium/Pro
│   ├── Changement plan automatique
│   ├── Facturation périodique
│   └── Avantages par niveau
├── Analytics performance
│   ├── Statistiques réservations
│   ├── Revenus détaillés
│   ├── Notes et avis clients
│   ├── Taux acceptation
│   └── Zones géographiques
├── Vérification compte
│   ├── Upload documents officiels
│   ├── Suivi processus validation
│   ├── Badge prestataire vérifié
│   └── Confiance accrue clients
└── Marketing visibilité
    ├── Optimisation géolocalisée
    ├── Badge premium
    ├── Positionnement recherche
    └── Statistiques visibilité

ADMINISTRATEUR:
├── Gestion utilisateurs
│   ├── Création comptes manuelle
│   ├── Modification profils
│   ├── Activation/Désactivation
│   ├── Attribution rôles
│   └── Suppression comptes
├── Modération plateforme
│   ├── Vérification prestataires
│   ├── Validation documents
│   ├── Approbation/Rejet profils
│   └── Gestion signalements
├── Gestion contenu
│   ├── Catégories hiérarchiques
│   ├── Sous-catégories dynamiques
│   ├── Réorganisation structure
│   └── Activation/Désactivation
├── Supervision réservations
│   ├── Vue globale réservations
│   ├── Modification statuts
│   ├── Résolution conflits
│   ├── Annulation administrateur
│   └── Statistiques réservations
├── Gestion financière
│   ├── Suivi paiements
│   ├── Traitement remboursements
│   ├── Génération rapports
│   ├── Calcul commissions
│   └── Intégration bancaire
├── Système abonnements
│   ├── Création/modification plans
│   ├── Gestion renouvellements
│   ├── Application remises
│   └── Statistiques souscription
├── Analytics globaux
│   ├── Métriques utilisateurs
│   ├── Performance géographique
│   ├── Tendances réservations
│   ├── Revenus plateforme
│   ├── Satisfaction clients
│   └── KPIs opérationnels
├── Communication système
│   ├── Notifications de masse
│   ├── Alertes maintenance
│   ├── Annonces importantes
│   ├── Campagnes marketing
│   └── Support utilisateurs
└── Administration système
    ├── Configuration paramètres
    ├── Gestion logs système
    ├── Sauvegarde données
    ├── Monitoring performance
    └── Sécurité plateforme
```

---

# DIAGRAMME DE CLASSES - ARCHITECTURE BACKEND COMPLÈTE

## Controllers, Services et Infrastructure

```
================================================================================
                            CONTROLLERS LAYER
================================================================================

+-----------------------------------+       +-----------------------------------+
|        AuthController             |       |         UserController            |
+-----------------------------------+       +-----------------------------------+
| - userService: UserService        |       | - userService: UserService        |
| - jwtService                      |       | - notificationService             |
| - bcrypt                          |       | - geolocationService              |
+-----------------------------------+       +-----------------------------------+
| + register(userData)              |       | + getAll(filters, pagination)     |
| + login(credentials)              |       | + getById(id)                     |
| + logout(token)                   |       | + update(id, data)                |
| + refreshToken(token)             |       | + delete(id)                      |
| + getProfile(user)                |       | + verifyProvider(id, adminId)     |
| + changePassword(old, new)        |       | + getDashboardStats(user)         |
| + forgotPassword(email)           |       | + updateProfile(user, data)       |
| + resetPassword(token, password)  |       | + updateGeolocation(user, coords) |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|     ProviderController            |       |       BookingController           |
+-----------------------------------+       +-----------------------------------+
| - providerService                 |       | - bookingService                  |
| - notificationService             |       | - notificationService             |
| - geolocationService              |       | - paymentService                  |
| - fileUploadService               |       | - calendarService                 |
+-----------------------------------+       +-----------------------------------+
| + getAll(filters, location)       |       | + create(bookingData)             |
| + getById(id)                     |       | + getAll(user, filters)           |
| + createProfile(data)             |       | + getById(id)                     |
| + updateProfile(id, data)         |       | + updateStatus(id, status)        |
| + updateLocation(id, location)    |       | + cancel(id, reason)              |
| + updateAvailability(id, schedule)|       | + getStats(dateRange)             |
| + requestVerification(id, docs)   |       | + getCalendar(user, month)        |
| + getDashboard(user)              |       | + reschedule(id, newDateTime)     |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|     CategoryController            |       |       ServiceController           |
+-----------------------------------+       +-----------------------------------+
| - categoryService                 |       | - serviceService                  |
| - cacheService                    |       | - imageService                    |
+-----------------------------------+       +-----------------------------------+
| + getAll()                        |       | + getAll(filters)                 |
| + getTree()                       |       | + getById(id)                     |
| + create(data)                    |       | + getByProvider(providerId)       |
| + update(id, data)                |       | + create(data)                    |
| + delete(id)                      |       | + update(id, data)                |
| + reorderCategories(order)        |       | + delete(id)                      |
| + activate(id, active)            |       | + duplicate(id, changes)          |
| + getSubcategories(parentId)      |       | + getStats(serviceId)             |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|     PaymentController             |       |    NotificationController         |
+-----------------------------------+       +-----------------------------------+
| - paymentService                  |       | - notificationService             |
| - stripeService                   |       | - emailService                    |
| - validationService               |       | - smsService                      |
+-----------------------------------+       +-----------------------------------+
| + processPayment(data)            |       | + getAll(user, filters)           |
| + refundPayment(id, reason)       |       | + markAsRead(id)                  |
| + getPaymentHistory(user)         |       | + markAllAsRead(user)             |
| + validatePayment(data)           |       | + delete(id)                      |
| + getPaymentStats()               |       | + createBulk(recipients, message) |
| + generateInvoice(booking)        |       | + getUnreadCount(user)            |
| + processSubscriptionPayment()    |       | + archiveRead(user)               |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|  SubscriptionController           |       |     AnalyticsController           |
+-----------------------------------+       +-----------------------------------+
| - subscriptionService             |       | - analyticsService                |
| - paymentService                  |       | - cacheService                    |
| - notificationService             |       | - exportService                   |
+-----------------------------------+       +-----------------------------------+
| + getPlans()                      |       | + getDashboardStats()             |
| + subscribe(plan, payment)        |       | + getRevenueStats(period)         |
| + cancelSubscription()            |       | + getUserStats()                  |
| + changePlan(newPlan)             |       | + getGeographicStats()            |
| + getHistory(user)                |       | + getBookingStats()               |
| + renewSubscription(id)           |       | + exportData(format, filters)     |
| + applyDiscount(code)             |       | + getRealTimeMetrics()            |
+-----------------------------------+       +-----------------------------------+

================================================================================
                            SERVICES LAYER (MÉTIER)
================================================================================

+-----------------------------------+       +-----------------------------------+
|        UserService                |       |       BookingService             |
+-----------------------------------+       +-----------------------------------+
| - prisma: PrismaClient            |       | - prisma: PrismaClient           |
| - notificationService             |       | - notificationService            |
| - emailService                    |       | - emailService                   |
| - geolocationService              |       | - paymentService                 |
| - validationService               |       | - calendarService                |
+-----------------------------------+       +-----------------------------------+
| + findAll(filters)                |       | + findAll(filters)               |
| + findById(id)                    |       | + findByClient(clientId)         |
| + findByEmail(email)              |       | + findByProvider(providerId)    |
| + create(data)                    |       | + create(bookingData)            |
| + update(id, data)                |       | + updateStatus(id, status)       |
| + delete(id)                      |       | + cancel(id, reason)             |
| + verifyProvider(id, adminId)     |       | + getStats(dateRange)           |
| + getDashboardStats(user)         |       | + calculateEarnings()            |
| + updateGeolocation(id, coords)   |       | + validateAvailability(dateTime) |
| + changePassword(id, passwords)   |       | + sendReminder(id)               |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|     ProviderService               |       |       CategoryService              |
+-----------------------------------+       +-----------------------------------+
| - prisma: PrismaClient            |       | - prisma: PrismaClient           |
| - notificationService             |       | - notificationService            |
| - geolocationService              |       | - cacheService                   |
| - fileService                     |       | - validationService              |
+-----------------------------------+       +-----------------------------------+
| + findAll(filters, location)      |       | + findAll()                      |
| + findByLocation(lat, lng, radius)|       | + findBySlug(slug)               |
| + createProfile(data)             |       | + create(data)                   |
| + updateProfile(id, data)         |       | + update(id, data)               |
| + updateLocation(id, location)    |       | + delete(id)                     |
| + updateAvailability(id, schedule)|       | + getTree()                      |
| + requestVerification(id, docs)   |       | + reorderCategories(order)       |
| + getDashboardStats(user)         |       | + validateHierarchy()            |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|       ServiceService              |       |      PaymentService               |
+-----------------------------------+       +-----------------------------------+
| - prisma: PrismaClient            |       | - paymentGateway                  |
| - notificationService             |       | - prisma: PrismaClient           |
| - imageService                    |       | - validationService              |
| - categoryService                 |       | - emailService                   |
+-----------------------------------+       +-----------------------------------+
| + findAll(filters)                |       | + processPayment(data)           |
| + findByProvider(providerId)      |       | + refundPayment(id, reason)      |
| + findByCategory(categoryId)      |       | + validatePayment(data)          |
| + create(data)                    |       | + getPaymentHistory(user)         |
| + update(id, data)                |       | + calculateFees(amount)          |
| + delete(id)                      |       | + generateInvoice(booking)        |
| + duplicate(id, changes)          |       | + processSubscriptionPayment()    |
| + getStats(serviceId)             |       | + handleWebhook(data)             |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|   NotificationService             |       |       EmailService                |
+-----------------------------------+       +-----------------------------------+
| - prisma: PrismaClient            |       | - nodemailer                     |
| - queueService                    |       | - templateEngine                 |
| - smsService                      |       | - fileService                    |
+-----------------------------------+       +-----------------------------------+
| + createNotification(data)        |       | + sendWelcome(user)              |
| + createFormattedNotification()   |       | + sendBookingConfirm(booking)    |
| + createStandardNotification()    |       | + sendVerificationRequest(user)  |
| + sendBulkNotifications()         |       | + sendPaymentReceipt(payment)    |
| + getUnreadCount(user)            |       | + sendSubscriptionRenewal()      |
| + archiveOldNotifications()       |       | + sendPasswordReset(user)        |
| + formatMessageByRole()           |       | + sendBookingReminder(booking)    |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|  NotificationFormatter            |       |    SubscriptionService            |
+-----------------------------------+       +-----------------------------------+
|                                   |       | - prisma: PrismaClient           |
|                                   |       | - paymentService                 |
+-----------------------------------+       | - notificationService            |
| + formatMessage(message, recip)   |       | - emailService                   |
| + createStandardMessage(action)   |       +-----------------------------------+
| + adaptMessageByRole()            |       | + getPlans()                     |
| + replacePlaceholders()           |       | + subscribe(user, plan)          |
| + validateMessageFormat()         |       | + cancelSubscription(id)         |
+-----------------------------------+       | + renewSubscription(id)          |
                                        | + changePlan(id, newPlan)        |
                                        | + getSubscriptionHistory(user)   |
                                        | + calculateProration(old, new)   |
                                        | + applyDiscount(code)             |
                                        +-----------------------------------+
```

---

# DIAGRAMME DE CLASSES - ARCHITECTURE FRONTEND COMPLÈTE

## Composants React avec Géolocalisation

```
================================================================================
                            APPLICATION LAYER
================================================================================

+-----------------------------------+       +-----------------------------------+
|          App.tsx                  |       |         Header.tsx                |
+-----------------------------------+       +-----------------------------------+
| - router: ReactRouter             |       | - user: UserContext              |
| - notificationProvider            |       | - notificationDropdown           |
| - authContext                     |       | - searchBar                      |
| - themeProvider                   |       | - mobileMenu                     |
+-----------------------------------+       +-----------------------------------+
| + renderRoutes()                  |       | + handleLogout()                 |
| + handleAuthRedirect()            |       | + toggleMobileMenu()             |
| + handleGlobalErrors()            |       | + navigateTo(page, params)       |
| + initializeApp()                 |       | + handleSearch(query)            |
| + handleOfflineMode()             |       | + updateNotifications()          |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|       HomePage.tsx                |       |       LoginPage.tsx               |
+-----------------------------------+       +-----------------------------------+
| - categories: Category[]          |       | - authForm: AuthForm             |
| - featuredProviders               |       | - validationRules                |
| - heroSection                     |       | - socialLoginProviders           |
| - testimonials                    |       | - forgotPasswordForm             |
+-----------------------------------+       +-----------------------------------+
| + loadCategories()                |       | + handleLogin(credentials)       |
| + loadFeaturedProviders()         |       | + handleRegister(data)           |
| + handleSearch(query)             |       | + handleForgotPassword(email)    |
| + trackUserInteractions()         |       | + handleSocialLogin(provider)    |
| + optimizeImages()                |       | + validateForm()                 |
+-----------------------------------+       +-----------------------------------+

================================================================================
                        GÉOLOCALISATION COMPONENTS
================================================================================

+-----------------------------------+       +-----------------------------------+
| ServiceProvidersMapPage.tsx       |       |       MapContainer.tsx            |
+-----------------------------------+       +-----------------------------------+
| - map: LeafletMap                 |       | - center: LatLng                  |
| - providers: Provider[]           |       | - zoom: number                   |
| - filters: MapFilters             |       | - markers: Marker[]              |
| - userLocation: LatLng            |       | - controls: MapControls          |
| - searchRadius: number            |       | - layers: TileLayer[]            |
+-----------------------------------+       +-----------------------------------+
| + initializeMap(center)           |       | + setView(center, zoom)          |
| + loadProviders(filters)          |       | + addMarker(position, popup)     |
| + applyFilters()                  |       | + drawCircle(center, radius)     |
| + handleLocationSelect(lat, lng)  |       | + fitBounds(bounds)             |
| + calculateDistances()            |       | + handleMapEvents()             |
| + updateMapBounds()               |       | + toggleLayer(layer)            |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|      LocationMarker.tsx           |       |     ProviderMarker.tsx            |
+-----------------------------------+       +-----------------------------------+
| - position: LatLng                |       | - provider: Provider             |
| - icon: LeafletIcon               |       | - position: LatLng               |
| - popup: PopupContent             |       | - icon: ProviderIcon             |
| - draggable: boolean              |       | - popup: ProviderPopup           |
+-----------------------------------+       +-----------------------------------+
| + updatePosition(newPos)          |       | + updateRating(newRating)        |
| + showPopup()                     |       | + updateAvailability(status)     |
| + hidePopup()                     |       | + calculateDistance(userLoc)     |
| + enableDrag()                    |       | + formatPriceRange()             |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|   GeolocationService.tsx          |       |   DistanceCalculator.tsx          |
+-----------------------------------+       +-----------------------------------+
| - currentPosition: LatLng         |       | - haversineFormula               |
| - watchId: number                 |       | - sphericalGeometry              |
| - accuracy: number                |       | - coordinateValidation           |
+-----------------------------------+       +-----------------------------------+
| + getCurrentPosition()            |       | + calculateDistance(p1, p2)      |
| + watchPosition(callback)         |       | + calculateBearing(p1, p2)       |
| + clearWatch()                    |       | + findNearbyPoints(center, radius)|
| + reverseGeocode(lat, lng)        |       | + validateCoordinates(lat, lng)  |
| + calculateAccuracy()             |       | + formatDistance(distance)       |
+-----------------------------------+       +-----------------------------------+

================================================================================
                           BOOKING COMPONENTS
================================================================================

+-----------------------------------+       +-----------------------------------+
|   BookingPage.tsx                 |       |   BookingForm.tsx                 |
+-----------------------------------+       +-----------------------------------+
| - service: Service                |       | - service: Service                |
| - provider: ProviderProfile       |       | - provider: ProviderProfile       |
| - selectedDateTime: DateTime      |       | - availableSlots: TimeSlot[]      |
| - bookingData: BookingData        |       | - selectedSlot: TimeSlot         |
+-----------------------------------+       +-----------------------------------+
| + loadServiceDetails(id)          |       | + validateBookingData()           |
| + loadProviderAvailability()      |       | + calculatePrice()                |
| + checkBookingConflicts()         |       | + handleDateSelection(date)      |
| + submitBooking(data)             |       | + handleTimeSelection(time)       |
| + handlePayment(booking)          |       | + checkProviderAvailability()     |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|   BookingSummary.tsx              |       |   CalendarPicker.tsx              |
+-----------------------------------+       +-----------------------------------+
| - booking: Booking                |       | - selectedDate: Date             |
| - showActions: boolean            |       | - availableDates: Date[]         |
| - compact: boolean                |       | - blockedDates: Date[]           |
| - showProvider: boolean           |       | - minDate: Date                  |
+-----------------------------------+       +-----------------------------------+
| + formatDate(date)                |       | + handleDateChange(date)         |
| + calculateTotal()                |       | + validateDate(date)             |
| + getStatusColor(status)          |       | + checkAvailability(date)        |
| + formatAddress(address)          |       | + formatDateDisplay(date)        |
| + handleAction(action, booking)   |       | + navigateMonth(direction)       |
+-----------------------------------+       +-----------------------------------+

================================================================================
                        ADMIN COMPONENTS
================================================================================

+-----------------------------------+       +-----------------------------------+
|       AdminUsers.tsx              |       |       UserTable.tsx               |
+-----------------------------------+       +-----------------------------------+
| - users: User[]                   |       | - users: User[]                   |
| - totalUsers: number              |       | - loading: boolean               |
| - currentPage: number             |       | - selectedUsers: string[]        |
| - filters: UserFilters            |       | - sortConfig: SortConfig         |
+-----------------------------------+       +-----------------------------------+
| + loadUsers(filters, page)        |       | + handleSort(column)             |
| + handleFilterChange()            |       | + handlePageChange(page)         |
| + handleBulkAction(action, ids)   |       | + handleRowSelect(id, selected)  |
| + exportUsers(format)             |       | + handleRowAction(action, user)  |
| + importUsers(file)               |       | + calculateSelectedStats()       |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|       UserFilters.tsx             |       |       UserStats.tsx               |
+-----------------------------------+       +-----------------------------------+
| - filters: UserFilters            |       | - stats: UserStats               |
| - onFilter: (filters) => void     |       | - period: 'day' | 'week' | 'month'|
| - resetFilters: () => void        |       | - loading: boolean               |
| - availableRoles: string[]        |       | - chartData: ChartData           |
+-----------------------------------+       +-----------------------------------+
| + applyFilters()                  |       | + formatNumber(value)            |
| + resetFilters()                  |       | + calculatePercent()             |
| + exportFilters()                 |       | + refreshStats()                 |
| + validateFilters()               |       | + generateChartData()            |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|    UserDetailsModal.tsx           |       |    CreateUserForm.tsx             |
+-----------------------------------+       +-----------------------------------+
| - user: User | null               |       | - onSubmit: (data) => void        |
| - isOpen: boolean                 |       | - validation: FormValidation      |
| - loading: boolean                |       | - initialData: Partial<User>      |
| - editMode: boolean               |       | - availableRoles: string[]        |
+-----------------------------------+       +-----------------------------------+
| + handleSave(data)                |       | + validateForm(data)             |
| + handleDelete()                  |       | + handleSubmit(event)            |
| + loadUserDetails(id)             |       | + resetForm()                    |
| + updateUserStatus(status)        |       | + handleRoleChange(role)         |
| + handleAvatarUpload(file)        |       | + generateSecurePassword()       |
+-----------------------------------+       +-----------------------------------+

================================================================================
                        COMMON COMPONENTS
================================================================================

+-----------------------------------+       +-----------------------------------+
|      CategoryCard.tsx             |       |      ProviderCard.tsx             |
+-----------------------------------+       +-----------------------------------+
| - category: Category              |       | - provider: ProviderProfile      |
| - onClick: () => void             |       | - onBook: () => void             |
| - showStats: boolean              |       | - showMapMarker: boolean         |
| - compact: boolean                |       | - showRating: boolean            |
+-----------------------------------+       +-----------------------------------+
| + handleClick()                   |       | + handleBook()                    |
| + formatImage()                   |       | + calculateRating()               |
| + getServiceCount()               |       | + calculateDistance()            |
| + animateHover()                  |       | + formatPriceRange()             |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
| NotificationDropdown.tsx          |       |       AuthForm.tsx                |
+-----------------------------------+       +-----------------------------------+
| - notifications: Notification[]   |       | - mode: 'login' | 'register'     |
| - unreadCount: number             |       | - onSubmit: (data) => void        |
| - isOpen: boolean                 |       | - validation: FormValidation      |
| - maxHeight: number               |       | - loading: boolean                |
+-----------------------------------+       +-----------------------------------+
| + markAsRead(id)                  |       | + validateForm()                  |
| + handleClick(notification)       |       | + handleSubmit(event)            |
| + clearAll()                      |       | + toggleMode()                    |
| + formatTimeAgo(date)             |       | + handleForgotPassword()          |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|   ImageUpload.tsx                 |       |   StatusBadge.tsx                 |
+-----------------------------------+       +-----------------------------------+
| - files: File[]                   |       | - status: string                  |
| - maxFiles: number                |       | - type: 'booking' | 'payment'     |
| - acceptedTypes: string[]         |       | - variant: 'solid' | 'outline'    |
| - uploadProgress: number          |       | - size: 'sm' | 'md' | 'lg'       |
+-----------------------------------+       +-----------------------------------+
| + handleFileSelect()              |       | + getStatusColor()               |
| + validateFiles()                 |       | + getStatusIcon()                |
| + uploadFiles()                   |       | + formatStatusText()             |
| + removeFile(index)               |       | + animateStatusChange()          |
+-----------------------------------+       +-----------------------------------+

================================================================================
                           UTILITY HOOKS
================================================================================

+-----------------------------------+       +-----------------------------------+
|       useForm.ts                  |       |   useConfirmDialog.tsx            |
+-----------------------------------+       +-----------------------------------+
| - values: FormValues              |       | - isOpen: boolean                 |
| - errors: FormErrors              |       | - title: string                   |
| - touched: FormTouched            |       | - message: string                 |
| - isSubmitting: boolean           |       | - confirmText: string             |
+-----------------------------------+       +-----------------------------------+
| + handleChange(name, value)       |       | + openDialog(config)             |
| + handleBlur(name)                |       | + closeDialog()                  |
| + handleSubmit(event)             |       | + confirm()                      |
| + resetForm()                     |       | + cancel()                       |
| + validateField(name)             |       | + handleKeyDown(event)           |
+-----------------------------------+       +-----------------------------------+

+-----------------------------------+       +-----------------------------------+
|     useMobile.ts                  |       |     useLocalStorage.ts            |
+-----------------------------------+       +-----------------------------------+
| - isMobile: boolean               |       | - key: string                     |
| - screenSize: ScreenSize          |       | - initialValue: any               |
| - orientation: Orientation        |       | - serializer: Serializer         |
+-----------------------------------+       +-----------------------------------+
| + checkIsMobile()                 |       | + getStoredValue()               |
| + getScreenSize()                 |       | + setStoredValue(value)          |
| + handleResize()                  |       | + removeStoredValue()            |
| + handleOrientationChange()       |       | + clearAllStorage()              |
+-----------------------------------+       +-----------------------------------+
```

---

# DIAGRAMME DE SÉQUENCE - INSCRIPTION PRESTATAIRE AVEC GÉOLOCALISATION

```
Participant: Client          Participant: Frontend       Participant: Backend       Participant: Database       Participant: EmailService   Participant: GeocodingAPI   Participant: FileStorage    Participant: Admin
      |                          |                          |                          |                          |                          |                          |                          |
      |  1. Accès page inscription                          |                          |                          |                          |                          |                          |                          |
      |------------------------->|                          |                          |                          |                          |                          |                          |
      |                          |  2. Remplir formulaire   |                          |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |  3. Validation frontend  |                          |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |  4. Upload documents     |                          |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |                          |  5. Stocker fichiers    |                          |                          |                          |                          |
      |                          |                          |------------------------------------------------------->|                          |                          |                          |
      |                          |                          |  6. Fichiers stockés    |                          |                          |                          |                          |
      |                          |                          |<-------------------------------------------------------|                          |                          |                          |
      |                          |  7. POST /api/auth/register                     |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |                          |  8. Validation backend |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          |  9. Vérifier email unique                         |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 10. Hash password     |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 11. INSERT user       |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 12. Créer profile provider (optionnel)           |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 13. Générer JWT      |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 14. Créer notification welcome                   |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 15. Envoyer email confirmation                   |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          | 16. Redirection dashboard                        |                          |                          |                          |                          |
      |                          |<-------------------------|                          |                          |                          |                          |                          |
      |  17. Dashboard affiché  |                          |                          |                          |                          |                          |                          |
      |<-------------------------|                          |                          |                          |                          |                          |                          |
      |                          |                          |                          |                          |                          |                          |                          |
      |                          | 18. Configuration géolocalisation                |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          | 19. Demander permission GPS                       |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          | 20. Permission accordée |                          |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |                          | 21. Obtenir coordonnées GPS                      |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 22. Reverse geocoding |                          |                          |                          |                          |
      |                          |                          |------------------------------------------------------->|                          |                          |                          |
      |                          |                          | 23. Adresse trouvée  |                          |                          |                          |                          |
      |                          |                          |<-------------------------------------------------------|                          |                          |                          |
      |                          | 24. Afficher adresse    |                          |                          |                          |                          |                          |
      |                          |<-------------------------|                          |                          |                          |                          |                          |
      |                          | 25. Sauvegarder localisation                      |                          |                          |                          |                          |
      |                          |------------------------->|                          |                          |                          |                          |                          |
      |                          |                          | 26. UPDATE user location                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 27. Créer services   |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 28. Upload photos services                        |                          |                          |                          |
      |                          |                          |------------------------------------------------------->|                          |                          |                          |
      |                          |                          | 29. Photos stockées  |                          |                          |                          |                          |
      |                          |                          |<-------------------------------------------------------|                          |                          |                          |
      |                          |                          | 30. Demande vérification                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 31. Créer VerificationRequest                    |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          | 32. Notifier admin   |                          |                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          |                          |                          |                          |                          |                          | 33. Admin reçoit notif |
      |                          |                          |                          |                          |                          |                          |------------------------->|
      |                          |                          |                          |                          |                          |                          | 34. Examiner documents |
      |                          |                          |                          |                          |                          |                          |------------------------->|
      |                          |                          |                          |                          |                          |                          | 35. Approuver/Rejeter |
      |                          |                          |                          |                          |                          |                          |<-------------------------|
      |                          |                          | 36. Mettre à jour statut                          |                          |                          |                          |
      |                          |                          |<-------------------------|                          |                          |                          |                          |
      |                          |                          | 37. Notifier prestataire                          |                          |                          |
      |                          |                          |------------------------->|                          |                          |                          |                          |
      |                          | 38. Profil vérifié     |                          |                          |                          |                          |                          |
      |                          |<-------------------------|                          |                          |                          |                          |                          |
```

---

# DIAGRAMME DE PACKAGES - ARCHITECTURE COMPLÈTE

## Structure Modulaire Détaillée

```
kaayjob-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Composants de base (shadcn/ui)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   ├── dropdown-menu-content.tsx
│   │   │   │   │   ├── dropdown-menu-item.tsx
│   │   │   │   │   ├── dropdown-menu-label.tsx
│   │   │   │   │   ├── dropdown-menu-separator.tsx
│   │   │   │   │   ├── dropdown-menu-trigger.tsx
│   │   │   │   │   └── dropdown-menu-shortcut.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── table-body.tsx
│   │   │   │   │   ├── table-caption.tsx
│   │   │   │   │   ├── table-cell.tsx
│   │   │   │   │   ├── table-head.tsx
│   │   │   │   │   ├── table-header.tsx
│   │   │   │   │   └── table-row.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── select-content.tsx
│   │   │   │   │   ├── select-group.tsx
│   │   │   │   │   ├── select-item.tsx
│   │   │   │   │   ├── select-label.tsx
│   │   │   │   │   ├── select-scroll-down-button.tsx
│   │   │   │   │   ├── select-scroll-up-button.tsx
│   │   │   │   │   ├── select-separator.tsx
│   │   │   │   │   ├── select-trigger.tsx
│   │   │   │   │   └── select-value.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── tabs-content.tsx
│   │   │   │   │   ├── tabs-list.tsx
│   │   │   │   │   ├── tabs-trigger.tsx
│   │   │   │   │   └── tabs-panel.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── card-content.tsx
│   │   │   │   │   ├── card-description.tsx
│   │   │   │   │   ├── card-footer.tsx
│   │   │   │   │   ├── card-header.tsx
│   │   │   │   │   └── card-title.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   │   ├── alert.tsx
│   │   │   │   │   ├── alert-description.tsx
│   │   │   │   │   └── alert-title.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── dialog-content.tsx
│   │   │   │   │   ├── dialog-description.tsx
│   │   │   │   ├── dialog-header.tsx
│   │   │   │   ├── dialog-footer.tsx
│   │   │   │   ├── dialog-title.tsx
│   │   │   │   └── dialog-trigger.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   │   ├── accordion.tsx
│   │   │   │   │   ├── accordion-content.tsx
│   │   │   │   │   ├── accordion-item.tsx
│   │   │   │   │   ├── accordion-trigger.tsx
│   │   │   │   │   └── accordion-header.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   │   ├── command.tsx
│   │   │   │   │   ├── command-dialog.tsx
│   │   │   │   │   ├── command-empty.tsx
│   │   │   │   │   ├── command-group.tsx
│   │   │   │   │   ├── command-input.tsx
│   │   │   │   │   ├── command-item.tsx
│   │   │   │   │   ├── command-list.tsx
│   │   │   │   │   ├── command-separator.tsx
│   │   │   │   │   └── command-shortcut.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── avatar-fallback.tsx
│   │   │   │   │   └── avatar-image.tsx
│   │   │   │   └── breadcrumb.tsx
│   │   │   │       ├── breadcrumb.tsx
│   │   │   │       ├── breadcrumb-ellipsis.tsx
│   │   │   │       ├── breadcrumb-item.tsx
│   │   │   │       ├── breadcrumb-link.tsx
│   │   │   │       ├── breadcrumb-list.tsx
│   │   │       ├── breadcrumb-page.tsx
│   │       ├── breadcrumb-separator.tsx
│   │   │   ├── common/                 # Composants communs métier
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── NotificationDropdown.tsx
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   ├── ProviderCard.tsx
│   │   │   │   ├── BookingSummary.tsx
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   ├── CalendarPicker.tsx
│   │   │   │   ├── ImageUpload.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   ├── admin/                  # Composants administration
│   │   │   │   ├── AdminUsers.tsx
│   │   │   │   ├── UserTable.tsx
│   │   │   │   ├── UserFilters.tsx
│   │   │   │   ├── UserStats.tsx
│   │   │   │   ├── UserDetailsModal.tsx
│   │   │   │   ├── CreateUserForm.tsx
│   │   │   │   ├── AdminBookings.tsx
│   │   │   │   ├── AdminCategories.tsx
│   │   │   │   ├── AdminServices.tsx
│   │   │   │   ├── AdminPayments.tsx
│   │   │   │   ├── AdminAnalytics.tsx
│   │   │   │   ├── AdminSubscriptions.tsx
│   │   │   │   ├── AdminSettings.tsx
│   │   │   │   ├── AdminNotifications.tsx
│   │   │   │   └── index.ts
│   │   │   ├── client/                 # Pages client
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ServiceCategoriesPage.tsx
│   │   │   │   ├── ServiceDetailPage.tsx
│   │   │   │   ├── ServiceProvidersListPage.tsx
│   │   │   │   ├── ServiceProvidersMapPage.tsx
│   │   │   │   ├── UserDashboard.tsx
│   │   │   │   ├── BookingPage.tsx
│   │   │   │   ├── CheckoutPage.tsx
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   ├── ContactPage.tsx
│   │   │   │   ├── FAQPage.tsx
│   │   │   │   ├── HelpPage.tsx
│   │   │   │   ├── PrivacyPage.tsx
│   │   │   │   ├── TermsPage.tsx
│   │   │   │   ├── CookiesPage.tsx
│   │   │   │   ├── PartnerPage.tsx
│   │   │   │   └── ServicesPage.tsx
│   │   │   ├── prestataire/            # Pages prestataire
│   │   │   │   ├── PrestataireDashboard.tsx
│   │   │   │   ├── PrestataireProfile.tsx
│   │   │   │   ├── PrestataireServices.tsx
│   │   │   │   ├── PrestataireBookings.tsx
│   │   │   │   ├── PrestataireSettings.tsx
│   │   │   │   ├── PrestataireSubscription.tsx
│   │   │   │   ├── PrestataireNotifications.tsx
│   │   │   │   └── PrestataireSidebar.tsx
│   │   │   ├── forms/                  # Composants formulaires
│   │   │   │   ├── EmailInput.tsx
│   │   │   │   ├── PasswordInput.tsx
│   │   │   │   ├── SelectInput.tsx
│   │   │   │   ├── TextArea.tsx
│   │   │   │   ├── TextInput.tsx
│   │   │   │   └── index.ts
│   │   │   └── figma/                  # Composants spécifiques
│   │   │       └── ImageWithFallback.tsx
│   │   ├── contexts/                  # Contextes React
│   │   │   └── NotificationContext.tsx
│   │   ├── hooks/                     # Hooks personnalisés
│   │   │   ├── useForm.ts
│   │   │   ├── useConfirmDialog.tsx
│   │   │   ├── useMobile.ts
│   │   │   └── index.ts
│   │   ├── lib/                       # Utilitaires et configurations
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── utils.ts
│   │   │   ├── validations.ts
│   │   │   ├── adminUtils.tsx
│   │   │   ├── notifications.ts
│   │   │   └── index.ts
│   │   ├── styles/                    # Styles globaux
│   │   │   └── globals.css
│   │   ├── App.tsx                    # Application principale
│   │   ├── main.tsx                   # Point d'entrée
│   │   └── vite-env.d.ts
│   ├── public/                        # Assets statiques
│   │   ├── images/
│   │   └── videos/
│   ├── tests/                         # Tests frontend
│   ├── docker/                        # Configuration Docker
│   ├── index.html                     # Template HTML
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/                    # Configuration système
│   │   │   ├── database.ts
│   │   │   ├── prisma.ts
│   │   │   ├── schema.ts
│   │   │   └── seed.ts
│   │   ├── controllers/               # Contrôleurs HTTP
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   │   ├── providerController.ts
│   │   │   ├── bookingController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── serviceController.ts
│   │   │   ├── paymentController.ts
│   │   │   └── notificationController.ts
│   │   ├── services/                  # Logique métier
│   │   │   ├── userService.ts
│   │   │   ├── bookingService.ts
│   │   │   ├── categoryService.ts
│   │   │   ├── serviceService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── emailService.ts
│   │   │   └── paymentService.ts
│   │   ├── routes/                    # Définition des routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── providers.ts
│   │   │   ├── bookings.ts
│   │   │   ├── categories.ts
│   │   │   ├── services.ts
│   │   │   ├── payments.ts
│   │   │   ├── notifications.ts
│   │   │   └── admin/
│   │   │       ├── users.ts
│   │   │       ├── bookings.ts
│   │   │       ├── categories.ts
│   │   │       ├── services.ts
│   │   │       ├── payments.ts
│   │   │       ├── subscriptions.ts
│   │   │       ├── analytics.ts
│   │   │       └── notifications.ts
│   │   ├── middleware/                # Middlewares Express
│   │   │   └── auth.ts
│   │   ├── interfaces/                # Types TypeScript
│   │   │   ├── IUser.ts
│   │   │   ├── IProvider.ts
│   │   │   ├── IBooking.ts
│   │   │   ├── IService.ts
│   │   │   ├── ICategory.ts
│   │   │   └── IReview.ts
│   │   ├── utils/                     # Utilitaires
│   │   │   ├── apiResponse.ts
│   │   │   └── notificationFormatter.ts
│   │   ├── validations/               # Validation des données
│   │   │   └── index.ts
│   │   └── index.ts                   # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   ├── docker/
│   └── package.json
├── docs/                              # Documentation
├── docker-compose.yml
├── Makefile
└── README.md
```

---

*Diagrammes complets et détaillés pour StarUML - Architecture KaayJob complète avec géolocalisation avancée*
