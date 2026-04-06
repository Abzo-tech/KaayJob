-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T21:15:23.069Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('d802eff0-79be-4cbc-9df2-a5f87def49d1', 'ahmed@example.com', '$2b$10$testpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.818Z', '2026-04-04T21:15:19.818Z')
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
VALUES ('79d9daa5-25ec-4ada-838e-6b8c1d1aa82f', 'fatou@example.com', '$2b$10$testpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.834Z', '2026-04-04T21:15:19.834Z')
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
VALUES ('994fc2fd-349f-461c-88c8-36159651d586', 'moussa@example.com', '$2b$10$testpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.841Z', '2026-04-04T21:15:19.841Z')
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
VALUES ('c151089a-fed5-4940-90e2-3fb1fd41e54d', 'amina@example.com', '$2b$10$testpassword', 'Amina', 'Kane', '+22177456789', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.857Z', '2026-04-04T21:15:19.857Z')
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
VALUES ('2d0fb5aa-6697-4b7f-aa69-ee641bf9bbac', 'ibrahima@example.com', '$2b$10$testpassword', 'Ibrahima', 'Diop', '+22177567890', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.872Z', '2026-04-04T21:15:19.872Z')
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
VALUES ('eb027640-1c50-4941-b8c2-98a3631bb00a', 'mariama@example.com', '$2b$10$testpassword', 'Mariama', 'Faye', '+22177678901', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.885Z', '2026-04-04T21:15:19.885Z')
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
VALUES ('7341dcfc-8578-476e-97ac-a334f6df34a8', 'admin@kaayjob.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'KaayJob', '+221000000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.901Z', '2026-04-04T21:15:19.901Z')
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
VALUES ('43c6dac3-84f6-4468-b90e-d4ae092b2a39', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+22177123456', 'CLIENT', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:15:19.904Z', '2026-04-04T21:15:19.904Z')
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
VALUES ('7b9031c1-b4e6-44c9-b7bc-dd92fef0c94f', 'Plomberie', 'plomberie', 'Services de plomberie et réparation', '🔧', NULL, true, 0, NULL, '2026-04-04T21:15:19.751Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('9e793ff6-58f3-4aef-b50c-6165f0b9af0a', 'Électricité', 'electricite', 'Installation et réparation électrique', '⚡', NULL, true, 0, NULL, '2026-04-04T21:15:19.764Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('87004d01-a4ee-4916-9448-5dd79da1c8f7', 'Menuiserie', 'menuiserie', 'Travaux de bois et menuiserie', '🔨', NULL, true, 0, NULL, '2026-04-04T21:15:19.772Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('601fd16a-1d7a-4259-88ed-76987bc4a317', 'Peinture', 'peinture', 'Peinture intérieure et extérieure', '🎨', NULL, true, 0, NULL, '2026-04-04T21:15:19.782Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('6b91210a-fa39-45d0-bb53-627377c70bfe', 'Jardinage', 'jardinage', 'Entretien d''espaces verts', '🌿', NULL, true, 0, NULL, '2026-04-04T21:15:19.790Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('b1a8a320-0ff5-4727-946c-053ac905e89a', 'Ménage', 'menage', 'Services de nettoyage', '🧽', NULL, true, 0, NULL, '2026-04-04T21:15:19.799Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('27691c02-99c4-4bfa-8afd-bf4f9bfa2fd9', 'Réparation', 'reparation', 'Réparations diverses', '🔧', NULL, true, 0, NULL, '2026-04-04T21:15:19.804Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('bf48b588-df3c-44a3-903b-73374f8df791', 'Transport', 'transport', 'Services de transport', '🚚', NULL, true, 0, NULL, '2026-04-04T21:15:19.811Z', '2026-04-04T21:15:23.214Z')
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
VALUES ('f1c708ac-a988-416d-a5f6-98222009e400', 'd802eff0-79be-4cbc-9df2-a5f87def49d1', NULL, NULL, NULL, 60, 15, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.825Z', '2026-04-04T21:15:19.825Z')
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
VALUES ('0a2f28c2-bbc0-4f79-98cc-3fc1a47e8dfd', '79d9daa5-25ec-4ada-838e-6b8c1d1aa82f', NULL, NULL, NULL, 25, 2, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.837Z', '2026-04-04T21:15:19.837Z')
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
VALUES ('eec5c6fd-4794-4b58-9a11-ad7e87519b3d', '994fc2fd-349f-461c-88c8-36159651d586', NULL, NULL, NULL, 20, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.848Z', '2026-04-04T21:15:19.848Z')
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
VALUES ('cb2cb98a-c4d9-474f-a779-afbc2759e4eb', 'c151089a-fed5-4940-90e2-3fb1fd41e54d', NULL, NULL, NULL, 37, 16, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.866Z', '2026-04-04T21:15:19.866Z')
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
VALUES ('10caa858-f3ff-400f-b327-3359f7e69ef8', '2d0fb5aa-6697-4b7f-aa69-ee641bf9bbac', NULL, NULL, NULL, 46, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.879Z', '2026-04-04T21:15:19.879Z')
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
VALUES ('88fa7806-257e-4f43-9507-6815638dde05', 'eb027640-1c50-4941-b8c2-98a3631bb00a', NULL, NULL, NULL, 54, 16, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:15:19.889Z', '2026-04-04T21:15:19.889Z')
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

-- Avis

-- Réservations

-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- ===================================================================
-- Export terminé avec succès !
-- Fichier généré: kaayjob-export-2026-04-04T21-15-23-068Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 8
-- Catégories: 8
-- Profils prestataires: 6
-- Services: 0
-- Avis: 0
-- Réservations: 0
