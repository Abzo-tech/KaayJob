-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T22:25:19.992Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('e2ae7fbe-35b9-4771-8282-c04f58051a3a', 'ahmed@example.com', '$2b$10$testpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.807Z', '2026-04-04T22:24:56.807Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('ee1af60d-0e7f-46fa-914d-f96dfe6e89ad', 'fatou@example.com', '$2b$10$testpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.826Z', '2026-04-04T22:24:56.826Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('8e4e29a3-09f3-4a41-9163-467d1448b921', 'moussa@example.com', '$2b$10$testpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.840Z', '2026-04-04T22:24:56.840Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('d967c602-489d-4d85-8455-522081587297', 'amina@example.com', '$2b$10$testpassword', 'Amina', 'Kane', '+22177456789', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.851Z', '2026-04-04T22:24:56.851Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('c2f2da20-fb6f-42c7-b8c7-77139d56fb12', 'ibrahima@example.com', '$2b$10$testpassword', 'Ibrahima', 'Diop', '+22177567890', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.862Z', '2026-04-04T22:24:56.862Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('abc4046a-d106-4cdc-b1f7-a7f68948b10c', 'mariama@example.com', '$2b$10$testpassword', 'Mariama', 'Faye', '+22177678901', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:24:56.873Z', '2026-04-04T22:24:56.873Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('3dc6b991-32a0-401d-a0c7-87d87ce7ad4f', 'admin@kaayjob.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'KaayJob', '+221000000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:25:15.274Z', '2026-04-04T22:25:15.274Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('bbcc0860-8b1d-4d4c-9d28-db606846190d', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+22177123456', 'CLIENT', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:25:15.277Z', '2026-04-04T22:25:15.277Z')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avatar = EXCLUDED.avatar,
  is_verified = EXCLUDED.is_verified,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;


-- Catégories
INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('d2e75f7e-ec24-403e-b33d-4782c5e4f2e2', 'Plomberie', 'plomberie', 'Installation, fuite, entretien et depannage a domicile.', '🔧', '/images/plomberie.png', true, 0, NULL, '2026-04-04T22:24:56.753Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;

INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('32fbc74d-ed8e-48ec-a537-663f742dd25d', 'Menuiserie', 'menuiserie', 'Fabrication, reparation et ajustements sur mesure.', '🔨', '/images/menuiserie.png', true, 0, NULL, '2026-04-04T22:24:56.762Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;

INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('19e41f36-dd2d-485b-a8fa-55fbff3aa65e', 'Cuisine', 'cuisine', 'Chefs et cuisiniers pour vos besoins du quotidien et evenements.', '👨‍🍳', '/images/cuisine.png', true, 0, NULL, '2026-04-04T22:24:56.773Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;

INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('d965d137-e148-4cfd-985f-99cebe10b4c7', 'Mecanique', 'mecanique', 'Diagnostic, entretien et reparation de vehicules.', '🔧', '/images/mecanique.png', true, 0, NULL, '2026-04-04T22:24:56.780Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;

INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('b85eb68a-ffd5-4c6d-b5fa-186109aa0ccd', 'Education', 'education', 'Cours particuliers et accompagnement scolaire de proximite.', '📚', '/images/education.png', true, 0, NULL, '2026-04-04T22:24:56.790Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;

INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('a52a3c7a-de5d-441d-85c6-9f9516b7d78b', 'Reparation', 'reparation', 'Interventions rapides pour vos pannes et petits travaux.', '🔧', '/images/reparation.png', true, 0, NULL, '2026-04-04T22:24:56.796Z', '2026-04-04T22:25:20.129Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  parent_id = EXCLUDED.parent_id,
  updated_at = EXCLUDED.updated_at;


-- Profils prestataires
INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('3d8e9d36-7aed-4316-a5b5-546a687074c9', 'e2ae7fbe-35b9-4771-8282-c04f58051a3a', NULL, NULL, NULL, 25, 14, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.816Z', '2026-04-04T22:24:56.816Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;

INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('a7cc0d5d-21af-4afb-b88c-5e6f65ea3b63', 'ee1af60d-0e7f-46fa-914d-f96dfe6e89ad', NULL, NULL, NULL, 56, 8, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.832Z', '2026-04-04T22:24:56.832Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;

INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('ec12e813-07e4-48e9-b33c-03419a40cbef', '8e4e29a3-09f3-4a41-9163-467d1448b921', NULL, NULL, NULL, 25, 6, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.845Z', '2026-04-04T22:24:56.845Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;

INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('ca6d1a89-8b74-47e4-80d6-63214621de35', 'd967c602-489d-4d85-8455-522081587297', NULL, NULL, NULL, 51, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.857Z', '2026-04-04T22:24:56.857Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;

INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('6b924b28-ab09-4207-b8fa-912428213621', 'c2f2da20-fb6f-42c7-b8c7-77139d56fb12', NULL, NULL, NULL, 48, 15, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.868Z', '2026-04-04T22:24:56.868Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;

INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('722e201b-f206-4457-9f8a-a87dc7ab4827', 'abc4046a-d106-4cdc-b1f7-a7f68948b10c', NULL, NULL, NULL, 39, 12, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:24:56.878Z', '2026-04-04T22:24:56.878Z')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  years_experience = EXCLUDED.years_experience,
  location = EXCLUDED.location,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  service_radius = EXCLUDED.service_radius,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_bookings = EXCLUDED.total_bookings,
  is_verified = EXCLUDED.is_verified,
  profile_image = EXCLUDED.profile_image,
  availability = EXCLUDED.availability,
  updated_at = EXCLUDED.updated_at;


-- Services
INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('707a08f9-ba5f-4367-b976-ab3901b0cea3', 'e2ae7fbe-35b9-4771-8282-c04f58051a3a', 'd2e75f7e-ec24-403e-b33d-4782c5e4f2e2', 'Service Plomberie', 'Service professionnel de plomberie', 25, 'HOURLY', 1, true, '2026-04-04T22:25:15.193Z', '2026-04-04T22:25:15.193Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('3a9d06cc-b478-44a3-9fae-a353a559731b', 'ee1af60d-0e7f-46fa-914d-f96dfe6e89ad', 'd965d137-e148-4cfd-985f-99cebe10b4c7', 'Service Mecanique', 'Service professionnel de mecanique', 25, 'HOURLY', 1, true, '2026-04-04T22:25:15.232Z', '2026-04-04T22:25:15.232Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('d5d1009f-2cbe-451f-a9fb-caecd7e118c6', '8e4e29a3-09f3-4a41-9163-467d1448b921', '32fbc74d-ed8e-48ec-a537-663f742dd25d', 'Service Menuiserie', 'Service professionnel de menuiserie', 25, 'HOURLY', 1, true, '2026-04-04T22:25:15.244Z', '2026-04-04T22:25:15.244Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('98271c8f-f32f-4ec4-a58e-4332b63dae66', 'd967c602-489d-4d85-8455-522081587297', '19e41f36-dd2d-485b-a8fa-55fbff3aa65e', 'Service Cuisine', 'Service professionnel de cuisine', 25, 'HOURLY', 1, true, '2026-04-04T22:25:15.255Z', '2026-04-04T22:25:15.255Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('5daec31a-e552-4243-b3d9-fc090ae1f61e', 'c2f2da20-fb6f-42c7-b8c7-77139d56fb12', 'b85eb68a-ffd5-4c6d-b5fa-186109aa0ccd', 'Service Education', 'Service professionnel de education', 25, 'HOURLY', 1, true, '2026-04-04T22:25:15.262Z', '2026-04-04T22:25:15.262Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;


-- Avis

-- Réservations

-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- ===================================================================
-- Export terminé avec succès !
-- Fichier généré: kaayjob-export-2026-04-04T22-25-19-992Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 8
-- Catégories: 6
-- Profils prestataires: 6
-- Services: 5
-- Avis: 0
-- Réservations: 0
