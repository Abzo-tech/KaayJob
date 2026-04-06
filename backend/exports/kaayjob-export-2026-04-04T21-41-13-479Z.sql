-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T21:41:13.479Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('bd3ac26e-f6cf-462f-952d-753df4960558', 'ahmed@example.com', '$2b$10$testpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.421Z', '2026-04-04T21:41:10.421Z')
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
VALUES ('58990042-2046-467c-92a0-83acdca05ee0', 'fatou@example.com', '$2b$10$testpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.437Z', '2026-04-04T21:41:10.437Z')
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
VALUES ('a4c27d14-f652-4144-ae25-fccf15a0e9fd', 'moussa@example.com', '$2b$10$testpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.450Z', '2026-04-04T21:41:10.450Z')
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
VALUES ('90247494-261a-474b-85fc-19a673e77bc4', 'amina@example.com', '$2b$10$testpassword', 'Amina', 'Kane', '+22177456789', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.467Z', '2026-04-04T21:41:10.467Z')
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
VALUES ('5c0e82a5-3de1-4f31-8167-65eb7e016727', 'ibrahima@example.com', '$2b$10$testpassword', 'Ibrahima', 'Diop', '+22177567890', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.481Z', '2026-04-04T21:41:10.481Z')
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
VALUES ('7058bb44-b34f-470f-891a-c7cbaaee2492', 'mariama@example.com', '$2b$10$testpassword', 'Mariama', 'Faye', '+22177678901', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.492Z', '2026-04-04T21:41:10.492Z')
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
VALUES ('5e714bb0-da4f-47c0-b8d6-b0b915e877d0', 'admin@kaayjob.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'KaayJob', '+221000000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.501Z', '2026-04-04T21:41:10.501Z')
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
VALUES ('77dcf981-b7b9-4c93-acac-beb4b26352b2', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+22177123456', 'CLIENT', '', '', '', '', null, null, NULL, true, true, '2026-04-04T21:41:10.505Z', '2026-04-04T21:41:10.505Z')
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
VALUES ('e444e859-5671-4eb6-a93c-210c6900ca08', 'Plomberie', 'plomberie', 'Installation, fuite, entretien et depannage a domicile.', '🔧', '/images/plomberie.png', true, 0, NULL, '2026-04-04T21:41:10.367Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('ca520913-34a3-4615-a045-c3be3bbd526a', 'Menuiserie', 'menuiserie', 'Fabrication, reparation et ajustements sur mesure.', '🔨', '/images/menuiserie.png', true, 0, NULL, '2026-04-04T21:41:10.380Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('890a319a-2f23-43db-bf5f-b43479b4037f', 'Cuisine', 'cuisine', 'Chefs et cuisiniers pour vos besoins du quotidien et evenements.', '👨‍🍳', '/images/cuisine.png', true, 0, NULL, '2026-04-04T21:41:10.390Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('5def6078-deff-49d0-b1f7-9342b3853ec7', 'Mecanique', 'mecanique', 'Diagnostic, entretien et reparation de vehicules.', '🔧', '/images/mecanique.png', true, 0, NULL, '2026-04-04T21:41:10.397Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('4f13c0c5-c2ef-4540-aefa-81b3a6666f22', 'Education', 'education', 'Cours particuliers et accompagnement scolaire de proximite.', '📚', '/images/education.png', true, 0, NULL, '2026-04-04T21:41:10.405Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('f9dbdbc0-89ae-4c4b-8cd7-aa7cd4351705', 'Reparation', 'reparation', 'Interventions rapides pour vos pannes et petits travaux.', '🔧', '/images/reparation.png', true, 0, NULL, '2026-04-04T21:41:10.412Z', '2026-04-04T21:41:13.581Z')
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
VALUES ('0116a46f-7a44-4071-ae68-4a0e9d68294c', 'bd3ac26e-f6cf-462f-952d-753df4960558', NULL, NULL, NULL, 47, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.429Z', '2026-04-04T21:41:10.429Z')
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
VALUES ('09729074-9d45-43ed-a0bd-22d533f2f23f', '58990042-2046-467c-92a0-83acdca05ee0', NULL, NULL, NULL, 35, 11, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.442Z', '2026-04-04T21:41:10.442Z')
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
VALUES ('4a6054dc-0c8f-480b-b771-397a024dc593', 'a4c27d14-f652-4144-ae25-fccf15a0e9fd', NULL, NULL, NULL, 54, 3, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.460Z', '2026-04-04T21:41:10.460Z')
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
VALUES ('0a9e0e5f-ee8e-43d0-80b2-57695c229a72', '90247494-261a-474b-85fc-19a673e77bc4', NULL, NULL, NULL, 23, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.475Z', '2026-04-04T21:41:10.475Z')
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
VALUES ('323e0524-2dc6-442d-beac-c11a19264e1f', '5c0e82a5-3de1-4f31-8167-65eb7e016727', NULL, NULL, NULL, 31, 9, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.487Z', '2026-04-04T21:41:10.487Z')
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
VALUES ('a877c2b0-6c15-43c6-b9e5-24ed32fd0542', '7058bb44-b34f-470f-891a-c7cbaaee2492', NULL, NULL, NULL, 30, 16, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T21:41:10.496Z', '2026-04-04T21:41:10.496Z')
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
-- Fichier généré: kaayjob-export-2026-04-04T21-41-13-479Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 8
-- Catégories: 6
-- Profils prestataires: 6
-- Services: 0
-- Avis: 0
-- Réservations: 0
