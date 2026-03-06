# KaayJob - End-to-End User Flows

This document describes the complete user journeys for each role in the KaayJob platform.

---

## 1. ADMIN FLOW

### 1.1 Authentication
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Login | `POST /api/auth/login` | Admin connects with email/password |
| 2 | Get Profile | `GET /api/auth/me` | Retrieve admin profile |
| 3 | Update Profile | `PUT /api/auth/profile` | Update admin details |
| 4 | Change Password | `PUT /api/auth/password` | Change admin password |

### 1.2 Dashboard & Analytics
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Stats | `GET /api/admin/stats` | View global platform statistics |
| 2 | View Analytics | Frontend `AdminAnalytics` | View charts and analytics |

### 1.3 User Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | List Users | `GET /api/admin/users` | View all users (clients & providers) |
| 2 | Verify Provider | `PUT /api/admin/users/:id/verify` | Approve/verify a provider |
| 3 | Delete User | `DELETE /api/admin/users/:id` | Remove a user account |

### 1.4 Service Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | List Services | `GET /api/admin/services` | View all services on platform |
| 2 | Delete Service | Frontend `AdminServices` | Remove inappropriate services |

### 1.5 Booking Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | List Bookings | `GET /api/admin/bookings` | View all platform bookings |
| 2 | View Details | Frontend `AdminBookings` | View booking details |

### 1.6 Category Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | List Categories | `GET /api/admin/categories` | View all categories |
| 2 | Create Category | `POST /api/admin/categories` | Add new category |
| 3 | Update Category | Frontend | Edit category details |

### 1.7 Payment Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Payments | `GET /api/admin/payments` | View payment history |

---

## 2. PRESTATAIRE (PROVIDER) FLOW

### 2.1 Authentication
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Register | `POST /api/auth/register` | Create account with role "prestataire" |
| 2 | Login | `POST /api/auth/login` | Connect with email/password |
| 3 | Get Profile | `GET /api/auth/me` | Retrieve profile |

### 2.2 Profile Setup
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Update Profile | `PUT /api/providers/profile` | Add business name, bio, location, hourly rate |
| 2 | Update Availability | `PUT /api/providers/profile/availability` | Set available days/hours |
| 3 | Request Verification | `POST /api/providers/profile/verification` | Submit verification documents |

### 2.3 Dashboard
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Dashboard | `GET /api/providers/me/dashboard` | Provider dashboard data |
| 2 | View Stats | `GET /api/providers/me/stats` | Earnings, bookings, reviews stats |

### 2.4 Services Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | List My Services | `GET /api/services/provider/:providerId` | View my services |
| 2 | Create Service | `POST /api/services` | Add new service |
| 3 | Update Service | `PUT /api/services/:id` | Edit service details |
| 4 | Delete Service | `DELETE /api/services/:id` | Remove service |

### 2.5 Bookings Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Bookings | `GET /api/bookings/me` | View incoming bookings |
| 2 | Accept Booking | `PUT /api/bookings/:id/status` | Set status to CONFIRMED |
| 3 | Start Job | `PUT /api/bookings/:id/status` | Set status to IN_PROGRESS |
| 4 | Complete Job | `PUT /api/bookings/:id/status` | Set status to COMPLETED |
| 5 | Reject Booking | `PUT /api/bookings/:id/status` | Set status to REJECTED |
| 6 | Cancel Booking | `DELETE /api/bookings/:id` | Cancel a booking |

### 2.6 Reviews Management
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Reviews | `GET /api/reviews/provider/:providerId` | View client reviews |
| 2 | Reply to Review | `PUT /api/reviews/:id` | Provider can respond |

---

## 3. CLIENT FLOW

### 3.1 Authentication
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Register | `POST /api/auth/register` | Create account with role "client" |
| 2 | Login | `POST /api/auth/login` | Connect with email/password |
| 3 | Get Profile | `GET /api/auth/me` | Retrieve profile |
| 4 | Update Profile | `PUT /api/auth/profile` | Update name, phone, avatar |
| 5 | Change Password | `PUT /api/auth/password` | Change password |

### 3.2 Discovery
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Browse Categories | `GET /api/categories` | View service categories |
| 2 | View Category | `GET /api/categories/:id` | View category details |
| 3 | List Providers | `GET /api/providers` | Browse all providers |
| 4 | Filter Providers | `GET /api/providers?category=X` | Filter by category |
| 5 | View Provider | `GET /api/providers/:id` | Provider profile page |
| 6 | View Provider Services | `GET /api/providers/:id/services` | Provider's services |
| 7 | View Provider Reviews | `GET /api/reviews/provider/:providerId` | Client reviews |

### 3.3 Booking
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Create Booking | `POST /api/bookings` | Book a service |
| 2 | View My Bookings | `GET /api/bookings/me` | List my reservations |
| 3 | View Booking | `GET /api/bookings/:id` | Booking details |
| 4 | Cancel Booking | `DELETE /api/bookings/:id` | Cancel reservation |

### 3.4 Reviews
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | Create Review | `POST /api/reviews` | Leave a review after service |
| 2 | View My Review | `GET /api/reviews/booking/:bookingId` | Check if reviewed |

### 3.5 Payments (Future)
| Step | Action | Endpoint | Description |
|------|--------|----------|-------------|
| 1 | View Payments | Frontend | Payment history (placeholder) |

---

## API ENDPOINTS SUMMARY

### Public Endpoints (No Auth)
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Category details
- `GET /api/providers` - List providers
- `GET /api/providers/:id` - Provider profile
- `GET /api/providers/:id/services` - Provider services
- `GET /api/providers/:id/reviews` - Provider reviews
- `GET /api/reviews/service/:serviceId` - Service reviews

### Authentication Required
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Provider Endpoints
- `GET /api/providers/me/dashboard` - Dashboard
- `GET /api/providers/me/stats` - Statistics
- `PUT /api/providers/profile` - Update profile
- `PUT /api/providers/profile/availability` - Update availability
- `POST /api/providers/profile/verification` - Request verification
- `GET /api/services/provider/:providerId` - My services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/bookings/me` - My bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/verify` - Verify provider
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/services` - All services
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/categories` - Categories
- `POST /api/admin/categories` - Create category
- `GET /api/admin/payments` - All payments

---

## DATABASE MODELS

### Users Table
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `firstName`, `lastName`
- `phone`
- `role` (CLIENT/PRESTATAIRE/ADMIN)
- `avatar`, `isVerified`, `isActive`
- `createdAt`, `updatedAt`

### ProviderProfile Table
- `id` (UUID)
- `userId` (FK → User)
- `businessName`, `specialty`, `bio`
- `hourlyRate`, `yearsExperience`
- `location`, `address`, `city`, `region`
- `isAvailable`, `rating`, `totalReviews`, `totalBookings`
- `isVerified`

### Service Table
- `id` (UUID)
- `providerId` (FK → ProviderProfile)
- `categoryId` (FK → Category)
- `name`, `description`
- `price`, `priceType` (FIXED/HOURLY/QUOTE)
- `duration`, `isActive`

### Booking Table
- `id` (UUID)
- `clientId` (FK → User)
- `serviceId` (FK → Service)
- `bookingDate`, `bookingTime`, `duration`
- `status` (PENDING/CONFIRMED/IN_PROGRESS/COMPLETED/CANCELLED/REJECTED)
- `address`, `city`, `phone`, `notes`
- `totalAmount`, `paymentStatus`

### Review Table
- `id` (UUID)
- `bookingId` (FK → Booking)
- `clientId`, `providerId`, `serviceId`
- `rating` (1-5), `comment`

### Payment Table
- `id` (UUID)
- `bookingId`, `userId`
- `amount`, `paymentMethod`
- `status` (PENDING/PAID/REFUNDED)
- `transactionId`

### Category Table
- `id` (UUID)
- `name`, `slug`, `description`
- `icon`, `image`
- `isActive`, `displayOrder`
- `parentId` (self-referential)

---

## PAGE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOMEPAGE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Services   │  │  Providers  │  │     Login/Signup        │  │
│  │  Categories │  │  Featured   │  │     (Role Selection)    │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                │
│         ▼                ▼                     ▼                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Service   │  │   Provider  │  │   Client/Provider/Admin  │  │
│  │  Providers  │  │   Detail    │  │        Login            │  │
│  │   List      │  │  Page       │  └───────────┬─────────────┘  │
│  └──────┬──────┘  └──────┬──────┘              │                │
│         │                │                     ▼                │
│         │                ▼          ┌─────────────────────────┐  │
│         │          ┌─────────┐      │   Role-based Redirect   │  │
│         │          │ Booking │      │   ┌────────┬────────┐   │  │
│         │          │  Page   │      │   │ Client │Provider│   │  │
│         │          └────┬────┘      │   │Dashboard│Dashboard│   │  │
│         │               │          │   └────────┴────────┘   │  │
│         ▼               ▼          └─────────────────────────┘  │
│    ┌────────┐      ┌────────┐                                   │
│    │Checkout│      │Success │                                   │
│    └────────┘      └────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

*Generated for KaayJob Platform - Last Updated: 2026*
