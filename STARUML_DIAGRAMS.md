# KaayJob - Diagrammes UML (StarUML)

Ce fichier contient les diagrammes prêts à être reproduits directement dans StarUML.

---

# Diagramme de Cas d'Utilisation - Client

## Fonctionnalités Principales et Secondaires

```
+======================================================================+
|                        Application KaayJob                             |
|                          CLIENT                                       |
+======================================================================+

+-----------------------------+
|      S'inscrire             | <-- Principal
+-----------------------------+

+-----------------------------+
|     Se connecter            | <-- Principal
+-----------------------------+

+-----------------------------+        +-----------------------------+
| Parcourir catégories         | ----> | Filtrer par catégorie      | <-- Secondaire
+-----------------------------+        +-----------------------------+

+-----------------------------+        +-----------------------------+
| Rechercher prestataire      | ----> | Filtrer par note          | <-- Secondaire
+-----------------------------+        +-----------------------------+
                               ----> | Filtrer par prix          | <-- Secondaire
                               ----> | Filtrer par localisation  | <-- Secondaire

+-----------------------------+
| Voir profil prestataire     | <-- Principal
+-----------------------------+
                               ----> | Voir services proposés    | <-- Secondaire
                               ----> | Voir avis et notes        | <-- Secondaire
                               ----> | Voir disponibilité        | <-- Secondaire

+-----------------------------+        +-----------------------------+
| Réserver service            | ----> | Choisir date               | <-- Secondaire
+-----------------------------+        +-----------------------------+
                               ----> | Choisir créneau horaire    | <-- Secondaire
                               ----> | Ajouter addresse           | <-- Secondaire
                               ----> | Ajouter notes              | <-- Secondaire

+-----------------------------+
| Consulter mes réservations  | <-- Principal
+-----------------------------+
                               ----> | Filtrer par statut        | <-- Secondaire
                               ----> | Trier par date            | <-- Secondaire

+-----------------------------+
| Laisser un avis              | <-- Principal
+-----------------------------+
                               ----> | Noter le prestataire      | <-- Secondaire
                               ----> | Écrire un commentaire    | <-- Secondaire
                               ----> | Ajouter des photos       | <-- Secondaire

+-----------------------------+
| Modifier profil              | <-- Principal
+-----------------------------+

+-----------------------------+
| Consulter notifications     | <-- Secondaire
+-----------------------------+

+-----------------------------+
| Contacter support           | <-- Secondaire
+-----------------------------+
```

---

# Diagramme de Cas d'Utilisation - Prestataire

## Fonctionnalités Principales et Secondaires

```
+======================================================================+
|                        Application KaayJob                             |
|                        PRESTATAIRE                                    |
+======================================================================+

+-----------------------------+
|      S'inscrire             | <-- Principal
+-----------------------------+

+-----------------------------+
|     Se connecter            | <-- Principal
+-----------------------------+

+-----------------------------+
| Configurer profil           | <-- Principal
+-----------------------------+
                               ----> | Ajouter photo            | <-- Secondaire
                               ----> | Ajouter description      | <-- Secondaire
                               ----> | Définir zone service     | <-- Secondaire
                               ----> | Définir tarifs           | <-- Secondaire

+-----------------------------+
| Ajouter services             | <-- Principal
+-----------------------------+
                               ----> | Définir prix             | <-- Secondaire
                               ----> | Définir durée            | <-- Secondaire
                               ----> | Ajouter description      | <-- Secondaire

+-----------------------------+
| Gérer services              | <-- Principal
+-----------------------------+
                               ----> | Modifier service         | <-- Secondaire
                               ----> | Supprimer service        | <-- Secondaire
                               ----> | Activer/Désactiver       | <-- Secondaire

+-----------------------------+
| Voir réservations           | <-- Principal
+-----------------------------+
                               ----> | Filtrer par statut       | <-- Secondaire
                               ----> | Trier par date          | <-- Secondaire

+-----------------------------+
| Accepter/Refuser rés.      | <-- Principal
+-----------------------------+

+-----------------------------+
| Démarrer réservation        | <-- Principal
+-----------------------------+

+-----------------------------+
| Terminer réservation        | <-- Principal
+-----------------------------+

+-----------------------------+
| Répondre aux avis           | <-- Principal
+-----------------------------+

+-----------------------------+
| Demander vérification       | <-- Principal
+-----------------------------+

+-----------------------------+
| Voir dashboard              | <-- Principal
+-----------------------------+
                               ----> | Voir statistiques        | <-- Secondaire
                               ----> | Voir revenus             | <-- Secondaire
                               ----> | Voir taux acceptance    | <-- Secondaire

+-----------------------------+
| Gérer disponibilités        | <-- Secondaire
+-----------------------------+

+-----------------------------+
| Voir notifications          | <-- Secondaire
+-----------------------------+

+-----------------------------+
| Modifier tarif horaire       | <-- Secondaire
+-----------------------------+
```

---

# Diagramme de Cas d'Utilisation - Administrateur

## Fonctionnalités Principales et Secondaires

```
+======================================================================+
|                        Application KaayJob                             |
|                      ADMINISTRATEUR                                    |
+======================================================================+

+-----------------------------+
|     Se connecter            | <-- Principal
+-----------------------------+

+-----------------------------+
| Voir dashboard              | <-- Principal
+-----------------------------+
                               ----> | Voir statistiques        | <-- Secondaire
                               ----> | Voir KPI                | <-- Secondaire

+-----------------------------+
| Gérer utilisateurs          | <-- Principal
+-----------------------------+
                               ----> | Rechercher utilisateur   | <-- Secondaire
                               ----> | Filtrer par rôle        | <-- Secondaire
                               ----> | Filtrer par statut      | <-- Secondaire

+-----------------------------+
| Créer utilisateur           | <-- Principal
+-----------------------------+

+-----------------------------+
| Modifier utilisateur        | <-- Principal
+-----------------------------+

+-----------------------------+
| Supprimer utilisateur       | <-- Principal
+-----------------------------+

+-----------------------------+
| Vérifier prestataire        | <-- Principal
+-----------------------------+

+-----------------------------+
| Gérer catégories            | <-- Principal
+-----------------------------+
                               ----> | Ajouter sous-catégorie   | <-- Secondaire
                               ----> | Réordonner catégories   | <-- Secondaire

+-----------------------------+
| Gérer services              | <-- Principal
+-----------------------------+

+-----------------------------+
| Gérer réservations          | <-- Principal
+-----------------------------+
                               ----> | Filtrer par statut       | <-- Secondaire
                               ----> | Rechercher              | <-- Secondaire

+-----------------------------+
| Voir paiements              | <-- Principal
+-----------------------------+
                               ----> | Filtrer par statut      | <-- Secondaire
                               ----> |Exporter rapport         | <-- Secondaire

+-----------------------------+
| Gérer abonnements           | <-- Principal
+-----------------------------+

+-----------------------------+
| Voir analytics              | <-- Principal
+-----------------------------+
                               ----> | Voir tendances          | <-- Secondaire
                               ----> | Voir répartition        | <-- Secondaire
                               ----> | Exporter données        | <-- Secondaire

+-----------------------------+
| Envoyer notification        | <-- Secondaire
+-----------------------------+

+-----------------------------+
| Gérer paramètres système    | <-- Secondaire
+-----------------------------+

+-----------------------------+
| Voir logs système           | <-- Secondaire
+-----------------------------+
```

---

# Diagramme de Classes Complet - Entités

## Relations entre les classes

```
+-----------------+       1       1       +-----------------+
|      USER       |------------------------|  PROVIDER_PROFILE|
+-----------------+       |                +-----------------+
| - id: UUID      |       |                | - id: UUID      |
| - email: String |       |                | - userId: UUID  |
| - password: Str |       |                | - businessName:|
| - firstName: Str|       |                | - specialty: Str|
| - lastName: Str |       |                | - bio: String?  |
| - phone: String |       |                | - hourlyRate:   |
| - role: Role   |<------+-------->       | - yearsExperience
| - avatar: Str? |    1:1 optional          | - location: Str|
| - isVerified:  |                           | - isAvailable: |
+-----------------+                           | - rating: Deci |
                                                | - totalReviews: |
                                                +-----------------+
                                                       ^
                                                       | 1:N
                                                       |
+-----------------+                           +-----------------+
|    BOOKING     |                           |    SERVICE      |
+-----------------+                           +-----------------+
| - id: UUID     |<--------------------------| - id: UUID      |
| - clientId: U |       N:1                 | - providerId: U|
| - providerId:U |                           | - categoryId:? |
| - serviceId:? |                           | - name: String |
| - bookingDate |       +-----------------+ | - description: |
| - bookingTime |       |    REVIEW        | | - price: Deci  |
| - duration: I |       +-----------------+ | - priceType:   |
| - status: B.S|       | - id: UUID     | | - duration: I  |
| - address: Str|       | - bookingId: U |<| - isActive: B  |
| - city: String|       | - clientId: U | | +-----------------+
| - phone: Str? |       | - providerId:U| |
| - notes: Str? |       | - serviceId:?| | +-----------------+
| - totalAmount |       | - rating: Int| | |   CATEGORY     |
| - paymentStat |       | - comment: ?| | +-----------------+
+-----------------+       | - isVerified | | | - id: UUID     |
                         +---------------+ | | - name: String |
                                          | | - slug: String |
+-----------------+                       | | - description: |
|    PAYMENT      |       +---------------+ | - icon: String?|
+-----------------+       | NOTIFICATION  | | - image: String|
| - id: UUID     |       +---------------+ | - isActive: B  |
| - bookingId: ? |<----->| - id: UUID   | | - parentId: ?  |
| - userId: UUID |       | - userId: U  | +-----------------+
| - amount: Deci|       | - title: Str | |       ^
| - paymentMeth |       | - message: S| |       | 1:N
| - status: P.S|       | - type: Str | |       v
| - transaction |       | - read: B   | | +-----------------+
+-----------------+       | - link: Str?| | |   SUBSCRIPTION |
                         +---------------+ | +-----------------+
                                          | | - id: UUID     |
                                          | | - userId: UUID |
                                          | | - plan: String |
                                          | | - status: Str  |
                                          | | - startDate: D |
                                          | | - endDate: D   |
                                          +-----------------+
```

---

# Diagramme de Classes - Services Layer

```
+---------------------+         +---------------------+
|   UserService       |         |  BookingService    |
+---------------------+         +---------------------+
| - prisma           |<------->| - prisma           |
+---------------------+         +---------------------+
| + findAll()        |         | + findAll()        |
| + findById()       |         | + findByClient()   |
| + findByEmail()    |         | + findByProvider() |
| + create()          |         | + create()         |
| + update()          |         | + update()         |
| + delete()          |         | + cancel()         |
| + verifyProvider()  |         +---------------------+
+---------------------+                ^
                                      |
+---------------------+                |
|CategoryService      |                | uses
+---------------------+                |
| - prisma           |                v
+---------------------+         +---------------------+
| + findAll()        |         |    BookingController |
| + findBySlug()     |         +---------------------+
| + create()         |         | - bookingService   |
| + update()         |         +---------------------+
| + delete()         |         | + create()         |
+---------------------+         | + getAll()         |
                                | + getById()        |
+---------------------+         | + update()         |
|  ServiceService     |         | + cancel()         |
+---------------------+         +---------------------+
| - prisma           |
+---------------------+
| + findAll()        |
| + findByProvider() |
| + findByCategory() |
| + create()         |
| + update()         |
| + delete()         |
+---------------------+
```

---

# Diagramme de Packages

```
+=====================================================================+
|                         Application KaayJob                          |
+=====================================================================+

+--------+     +--------+     +---------+     +--------+     +-------+
| Routes |     |Services|     |Contrllrs|     |  Data  |     | Lib   |
+--------+     +--------+     +---------+     +--------+     +-------+
| /auth  | --> |UserSvc | --> | AuthCnt | --> |Prisma  |     | api.ts|
| /book. | --> |BookSvc | --> |BookCnt  | --> |Client  |     |utils  |
| /cat.  | --> |CatSvc  | --> |CatCnt   | --> |        |     |adminU |
| /svc.  | --> |SvcSvc  | --> |SvcCnt   | --> |        |     |       |
| /admin |     |        |     |         |     |        |     |       |
+--------+     +--------+     +---------+     +--------+     +-------+
```

---

# Diagramme de Séquence - Inscription

```
+--------+      +---------+      +---------+      +---------+
| Client |      |Frontend |      | Backend |      |Database |
+--------+      +---------+      +---------+      +---------+
   |              |             |             |
   | 1.Submit    |             |             |
   |------------>|             |             |
   |              | 2.POST     |             |
   |              |------------>|             |
   |              |             | 3.SELECT  |
   |              |             |---------->|
   |              |             | 4.INSERT |
   |              |             |---------->|
   |              |             | 5.RETURN  |
   |              |             |<----------|
   |              | 6.Response  |             |
   |              |<------------|             |
   | 7.Redirect  |             |             |
   |<------------|             |             |
```

---

# Diagramme de Séquence - Réservation

```
+--------+      +---------+      +---------+      +---------+
| Client |      |Frontend |      | Backend |      |Database |
+--------+      +---------+      +---------+      +---------+
   |              |             |             |
   | 1.Select    |             |             |
   |  service    |             |             |
   |------------>|             |             |
   |              | 2.POST     |             |
   |              | /bookings  |             |
   |              |------------>|             |
   |              |             | 3.Validate|
   |              |             |---------->|
   |              |             | 4.Check   |
   |              |             |---------->|
   |              |             | 5.INSERT |
   |              |             | booking   |
   |              |             |---------->|
   |              |             | 6.RETURN |
   |              |             |<----------|
   |              | 7.Booking  |             |
   |              |<------------|             |
   | 8.Confirm   |             |             |
   |<------------|             |             |
```

---

*Diagrammes prêts pour StarUML - KaayJob*
