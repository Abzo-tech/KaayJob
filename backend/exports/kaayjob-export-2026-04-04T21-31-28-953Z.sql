-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T21:31:28.953Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('2d080b3e-f4fb-4151-917e-136709516fb0', 'ahmed@example.com', '$2b$10$testpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.175Z', '2026-04-04T21:31:24.175Z')
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
VALUES ('f8ec6758-ced0-4923-9cad-4134c797e55e', 'fatou@example.com', '$2b$10$testpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.195Z', '2026-04-04T21:31:24.195Z')
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
VALUES ('d6902415-ecac-41c5-8179-e66f2075eec5', 'moussa@example.com', '$2b$10$testpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.209Z', '2026-04-04T21:31:24.209Z')
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
VALUES ('c0451862-acb1-4ac7-8b72-eae6d93bcdb1', 'amina@example.com', '$2b$10$testpassword', 'Amina', 'Kane', '+22177456789', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.222Z', '2026-04-04T21:31:24.222Z')
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
VALUES ('fd69470a-7b00-4cee-81e1-79495819a872', 'ibrahima@example.com', '$2b$10$testpassword', 'Ibrahima', 'Diop', '+22177567890', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.236Z', '2026-04-04T21:31:24.236Z')
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
VALUES ('7893369b-23b1-44b1-87b9-3a86f300b6a7', 'mariama@example.com', '$2b$10$testpassword', 'Mariama', 'Faye', '+22177678901', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.249Z', '2026-04-04T21:31:24.249Z')
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
VALUES ('53ae96dc-4994-434c-9d3d-9e50272ae6b0', 'admin@kaayjob.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'KaayJob', '+221000000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.261Z', '2026-04-04T21:31:24.261Z')
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
VALUES ('4c094740-d96c-4483-8095-269c71baf993', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+22177123456', 'CLIENT', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:31:24.266Z', '2026-04-04T21:31:24.266Z')
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
VALUES ('2da2b72e-d777-4663-9583-94149dc9cf6b', 'Plomberie', 'plomberie', 'Installation, fuite, entretien et depannage a domicile.', '🔧', '/images/plomberie.png', true, 0, NULL, '2026-04-04T21:31:24.114Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('ba95287e-3dcb-48d7-a572-68a1b84bd7ef', 'Menuiserie', 'menuiserie', 'Fabrication, reparation et ajustements sur mesure.', '🔨', '/images/menuiserie.png', true, 0, NULL, '2026-04-04T21:31:24.126Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('02ea574c-6057-4564-9f64-6a66755b88eb', 'Cuisine', 'cuisine', 'Chefs et cuisiniers pour vos besoins du quotidien et evenements.', '👨‍🍳', '/images/cuisine.png', true, 0, NULL, '2026-04-04T21:31:24.134Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('bcddcf59-b26b-4bf5-b0d6-f16a4a061efc', 'Mecanique', 'mecanique', 'Diagnostic, entretien et reparation de vehicules.', '🔧', '/images/mecanique.png', true, 0, NULL, '2026-04-04T21:31:24.141Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('09738875-366a-4be4-990d-f1ee52ece6ff', 'Education', 'education', 'Cours particuliers et accompagnement scolaire de proximite.', '📚', '/images/education.png', true, 0, NULL, '2026-04-04T21:31:24.152Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('d9b04542-f4a7-4f43-8f35-7498849d96b2', 'Reparation', 'reparation', 'Interventions rapides pour vos pannes et petits travaux.', '🔧', '/images/Reparation.png', true, 0, NULL, '2026-04-04T21:31:24.160Z', '2026-04-04T21:31:29.121Z')
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
VALUES ('6660cbec-57a6-4bbd-837e-9e8d3b93ea2a', '2d080b3e-f4fb-4151-917e-136709516fb0', NULL, NULL, NULL, 32, 8, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.186Z', '2026-04-04T21:31:24.186Z')
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
VALUES ('73aba99c-21fb-4011-acbc-d863a64679b1', 'f8ec6758-ced0-4923-9cad-4134c797e55e', NULL, NULL, NULL, 58, 11, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.202Z', '2026-04-04T21:31:24.202Z')
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
VALUES ('f167a4c6-050a-4fb0-a96d-5dbb7fce6181', 'd6902415-ecac-41c5-8179-e66f2075eec5', NULL, NULL, NULL, 52, 11, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.217Z', '2026-04-04T21:31:24.217Z')
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
VALUES ('a0ff99f7-c5c4-4c1f-b04f-2b236ab0c81d', 'c0451862-acb1-4ac7-8b72-eae6d93bcdb1', NULL, NULL, NULL, 57, 4, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.230Z', '2026-04-04T21:31:24.230Z')
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
VALUES ('61f515df-14c6-4af8-a459-046a5dd7e8c1', 'fd69470a-7b00-4cee-81e1-79495819a872', NULL, NULL, NULL, 37, 12, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.241Z', '2026-04-04T21:31:24.241Z')
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
VALUES ('21c1e2f4-4b49-4914-9939-5dfa11bfa9d2', '7893369b-23b1-44b1-87b9-3a86f300b6a7', NULL, NULL, NULL, 35, 4, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:31:24.254Z', '2026-04-04T21:31:24.254Z')
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
-- Fichier généré: kaayjob-export-2026-04-04T21-31-28-953Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 8
-- Catégories: 6
-- Profils prestataires: 6
-- Services: 0
-- Avis: 0
-- Réservations: 0
