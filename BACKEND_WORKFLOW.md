# KaayJob - Backend Workflow & Technical Specification

## Project Overview

- **Project Name**: KaayJob - Service Marketplace Platform
- **Frontend**: React + TypeScript + Vite (already built)
- **Backend**: Node.js + Express + PostgreSQL
- **SMS Notifications**: To be integrated (provider TBD)

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Booking Flow](#booking-flow)
5. [Notification System](#notification-system)
6. [Frontend-Backend Integration](#frontend-backend-integration)
7. [Development Tasks](#development-tasks)

---

## 🗄️ Database Schema (PostgreSQL)

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('client', 'prestataire', 'admin')) NOT NULL,
    profile_image VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Services Table (offered by providers)

```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    price_type VARCHAR(20) CHECK (price_type IN ('hourly', 'fixed', 'quote')),
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id),
    provider_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    booking_date DATE NOT NULL,
    booking_time VARCHAR(10) NOT NULL,
    duration INTEGER DEFAULT 1,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    client_address VARCHAR(500) NOT NULL,
    client_city VARCHAR(100) NOT NULL,
    notes TEXT,
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    client_id INTEGER REFERENCES users(id),
    provider_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Provider Profiles Table (additional info for providers)

```sql
CREATE TABLE provider_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    specialty VARCHAR(100),
    bio TEXT,
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    address VARCHAR(500),
    city VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    rating_average DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Register new user      |
| POST   | `/api/auth/login`           | User login             |
| POST   | `/api/auth/logout`          | User logout            |
| GET    | `/api/auth/me`              | Get current user       |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password         |

### Users

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/api/users`     | Get all users (admin) |
| GET    | `/api/users/:id` | Get user by ID        |
| PUT    | `/api/users/:id` | Update user           |
| DELETE | `/api/users/:id` | Delete user (admin)   |

### Categories

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/categories`       | Get all categories      |
| GET    | `/api/categories/:slug` | Get category by slug    |
| POST   | `/api/categories`       | Create category (admin) |
| PUT    | `/api/categories/:id`   | Update category (admin) |
| DELETE | `/api/categories/:id`   | Delete category (admin) |

### Providers/Services

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| GET    | `/api/providers`              | Get all providers (with filters) |
| GET    | `/api/providers/:id`          | Get provider details             |
| GET    | `/api/providers/:id/services` | Get provider's services          |
| POST   | `/api/providers/services`     | Create service (provider)        |
| PUT    | `/api/providers/services/:id` | Update service (provider)        |
| DELETE | `/api/providers/services/:id` | Delete service (provider)        |

### Bookings

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/bookings`            | Get user's bookings   |
| GET    | `/api/bookings/:id`        | Get booking details   |
| POST   | `/api/bookings`            | Create new booking    |
| PUT    | `/api/bookings/:id/status` | Update booking status |
| PUT    | `/api/bookings/:id/cancel` | Cancel booking        |

### Reviews

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/reviews/provider/:id` | Get provider reviews |
| POST   | `/api/reviews`              | Create review        |

### Notifications

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/notifications`          | Get user notifications |
| PUT    | `/api/notifications/:id/read` | Mark as read           |
| PUT    | `/api/notifications/read-all` | Mark all as read       |

### Dashboard/Analytics (Admin)

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/admin/stats`    | Get platform statistics |
| GET    | `/api/admin/users`    | Manage users            |
| GET    | `/api/admin/bookings` | Manage all bookings     |

---

## 🔐 Authentication Flow

```
1. User Registration
   POST /api/auth/register
   → Validate input
   → Check if email exists
   → Hash password
   → Create user record
   → Return JWT token

2. User Login
   POST /api/auth/login
   → Find user by email
   → Compare password hash
   → Generate JWT token
   → Return user data + token

3. Token Verification
   → All protected routes verify JWT
   → Token expires in 7 days
   → Refresh token mechanism
```

---

## 📅 Booking Flow

```
1. Client selects service category
   → Frontend: GET /api/categories
   → Display categories

2. Client selects provider
   → Frontend: GET /api/providers?category=plomberie
   → Display providers list

3. Client views provider details
   → Frontend: GET /api/providers/123
   → Display provider info + services

4. Client fills booking form
   → Frontend: POST /api/bookings
   → Validate input
   → Create booking record (status: pending)
   → Send SMS notification to provider
   → Return booking confirmation

5. Provider receives notification
   → SMS: "New booking request from [client name]"
   → Provider views in dashboard

6. Provider confirms/responds
   → Frontend: PUT /api/bookings/456/status
   → Update status to 'confirmed'
   → Send SMS to client: "Your booking is confirmed"

7. Service completion
   → Provider marks as 'completed'
   → Client can leave review
```

---

## 📱 Notification System

### SMS Notifications (Provider TBD - Orange, Wave, etc.)

- New booking received
- Booking confirmed
- Booking cancelled
- Booking reminder (2 hours before)
- Review received

### In-App Notifications

- New booking (for providers)
- Booking confirmed/cancelled (for clients)
- Review received (for providers)
- Profile updates

### Notification Triggers

```javascript
// When new booking created
await sendSMS(
  provider.phone,
  `Nouvelle réservation de ${clientName} pour le ${date} à ${time}`,
);

// When booking confirmed
await sendSMS(
  client.phone,
  `Votre réservation du ${date} a été confirmée par ${providerName}`,
);

// When booking completed
await createNotification(
  client.id,
  "booking_completed",
  "Réservation terminée",
  "Votre service a été effectuée",
);
```

---

## 🔗 Frontend-Backend Integration

### Current Frontend State

The frontend is already built with these pages:

- HomePage (`/`)
- LoginPage (`/login`)
- ServiceCategoriesPage (`/categories`)
- ServiceProvidersListPage (`/service-providers`)
- ServiceDetailPage (`/service-detail`)
- BookingPage (`/booking`)
- UserDashboard (`/dashboard`)
- ContactPage (`/contact`)
- Admin pages (`/admin-*`)
- Provider pages (`/prestataire-*`)

### Required API Calls to Implement

```javascript
// api/auth.js
export const authAPI = {
  login: (email, password) =>
    axios.post("/api/auth/login", { email, password }),
  register: (userData) => axios.post("/api/auth/register", userData),
  getMe: () => axios.get("/api/auth/me"),
};

// api/services.js
export const servicesAPI = {
  getCategories: () => axios.get("/api/categories"),
  getProviders: (category) => axios.get(`/api/providers?category=${category}`),
  getProvider: (id) => axios.get(`/api/providers/${id}`),
};

// api/bookings.js
export const bookingsAPI = {
  create: (bookingData) => axios.post("/api/bookings", bookingData),
  getMyBookings: () => axios.get("/api/bookings"),
  getBooking: (id) => axios.get(`/api/bookings/${id}`),
  updateStatus: (id, status) =>
    axios.put(`/api/bookings/${id}/status`, { status }),
};
```

---

## 📝 Development Tasks

### Phase 1: Backend Setup (Week 1)

- [ ] Initialize Node.js project with Express
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Create database migrations
- [ ] Set up authentication (JWT)
- [ ] Create user routes

### Phase 2: Core Features (Week 2)

- [ ] Implement categories CRUD
- [ ] Implement providers/services CRUD
- [ ] Implement bookings CRUD
- [ ] Integrate SMS notifications
- [ ] Create notification system

### Phase 3: Reviews & Dashboard (Week 3)

- [ ] Implement reviews system
- [ ] Create admin dashboard
- [ ] Create provider dashboard
- [ ] Create client dashboard
- [ ] Add analytics

### Phase 4: Integration & Testing (Week 4)

- [ ] Connect frontend to backend
- [ ] Implement API error handling
- [ ] Add loading states
- [ ] Test all flows
- [ ] Deploy to production

---

## 🌍 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kaayjob
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kaayjob
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# SMS (Provider TBD)
SMS_API_KEY=your_sms_api_key
SMS_API_URL=https://api.smsprovider.com
SMS_FROM=KaayJob

# Server
PORT=3000
NODE_ENV=development
```

---

## 📂 Project Structure

```
kaayjob-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── categoryController.js
│   │   ├── providerController.js
│   │   ├── bookingController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── providerRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── smsService.js
│   │   └── emailService.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 📌 Next Steps for Your Friend

1. **Install PostgreSQL** on your machine
2. **Create database**: `createdb kaayjob`
3. **Clone/fork this backend structure**
4. **Set up environment variables**
5. **Run migrations**: `npm run migrate`
6. **Start server**: `npm run dev`

---

## 📌 Next Steps for You (Frontend Integration)

1. **Create API service layer** in frontend
2. **Replace mock data** with API calls
3. **Add JWT token handling**
4. **Implement loading states**
5. **Add error handling**

---

_Document generated for KaayJob Project - Backend Workflow_
_Version: 1.0_
_Last Updated: 2026-02-28_
