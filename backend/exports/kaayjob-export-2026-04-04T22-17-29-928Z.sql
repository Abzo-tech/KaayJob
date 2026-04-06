-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T22:17:29.928Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('0289a849-27b9-40eb-8425-58d648a26154', 'ahmed@example.com', '$2b$10$testpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.502Z', '2026-04-04T22:17:26.502Z')
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
VALUES ('cc9cf686-3c53-422d-ab9e-f02052385647', 'fatou@example.com', '$2b$10$testpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.522Z', '2026-04-04T22:17:26.522Z')
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
VALUES ('25652dbf-9794-4af3-a821-a7533831202e', 'moussa@example.com', '$2b$10$testpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.538Z', '2026-04-04T22:17:26.538Z')
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
VALUES ('0f1d23b1-320e-4190-9e31-7c0eca3f3ac2', 'amina@example.com', '$2b$10$testpassword', 'Amina', 'Kane', '+22177456789', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.550Z', '2026-04-04T22:17:26.550Z')
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
VALUES ('17c5dcd2-8b29-40a0-921b-07f572aca46d', 'ibrahima@example.com', '$2b$10$testpassword', 'Ibrahima', 'Diop', '+22177567890', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.566Z', '2026-04-04T22:17:26.566Z')
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
VALUES ('9e339070-b782-43a5-a4bf-78a2cd1261c4', 'mariama@example.com', '$2b$10$testpassword', 'Mariama', 'Faye', '+22177678901', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.579Z', '2026-04-04T22:17:26.579Z')
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
VALUES ('027e46e6-a301-47a2-b422-54f5e75d0bfa', 'admin@kaayjob.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'KaayJob', '+221000000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.588Z', '2026-04-04T22:17:26.588Z')
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
VALUES ('60153b6e-8a72-445c-989f-b7c21acbbd13', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+22177123456', 'CLIENT', '', '', '', '', null, null, NULL, true, true, '2026-04-04T22:17:26.595Z', '2026-04-04T22:17:26.595Z')
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
VALUES ('49967e6d-e367-4a98-a45e-d072b943cd38', 'Plomberie', 'plomberie', 'Installation, fuite, entretien et depannage a domicile.', '🔧', '/images/plomberie.png', true, 0, NULL, '2026-04-04T22:17:26.440Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('ceb226da-668b-4bfa-b606-f2774be3d589', 'Menuiserie', 'menuiserie', 'Fabrication, reparation et ajustements sur mesure.', '🔨', '/images/menuiserie.png', true, 0, NULL, '2026-04-04T22:17:26.453Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('1515a059-ff1e-4724-b0ac-b0c535c10c36', 'Cuisine', 'cuisine', 'Chefs et cuisiniers pour vos besoins du quotidien et evenements.', '👨‍🍳', '/images/cuisine.png', true, 0, NULL, '2026-04-04T22:17:26.463Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('f7ddba41-9149-4f8b-bb00-8052f986b9a5', 'Mecanique', 'mecanique', 'Diagnostic, entretien et reparation de vehicules.', '🔧', '/images/mecanique.png', true, 0, NULL, '2026-04-04T22:17:26.470Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('9f18279f-4a6a-40d5-b7f2-7d29070b7904', 'Education', 'education', 'Cours particuliers et accompagnement scolaire de proximite.', '📚', '/images/education.png', true, 0, NULL, '2026-04-04T22:17:26.482Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('cd572237-e12c-4020-a5e8-6a6e4d8215fd', 'Reparation', 'reparation', 'Interventions rapides pour vos pannes et petits travaux.', '🔧', '/images/reparation.png', true, 0, NULL, '2026-04-04T22:17:26.489Z', '2026-04-04T22:17:30.109Z')
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
VALUES ('fa6425e2-c261-49ea-8f31-70be141eb844', '0289a849-27b9-40eb-8425-58d648a26154', NULL, NULL, NULL, 51, 3, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.515Z', '2026-04-04T22:17:26.515Z')
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
VALUES ('429ef520-d1c9-4591-9b80-a7467f5508af', 'cc9cf686-3c53-422d-ab9e-f02052385647', NULL, NULL, NULL, 20, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.530Z', '2026-04-04T22:17:26.530Z')
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
VALUES ('1a6717c3-8cdc-4942-95f3-9081fb92cfea', '25652dbf-9794-4af3-a821-a7533831202e', NULL, NULL, NULL, 38, 13, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.545Z', '2026-04-04T22:17:26.545Z')
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
VALUES ('eafeffcb-30d0-4c4d-a473-333f222c1277', '0f1d23b1-320e-4190-9e31-7c0eca3f3ac2', NULL, NULL, NULL, 66, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.558Z', '2026-04-04T22:17:26.558Z')
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
VALUES ('37fc424d-cf11-4867-ba2b-6e35df29954f', '17c5dcd2-8b29-40a0-921b-07f572aca46d', NULL, NULL, NULL, 33, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.570Z', '2026-04-04T22:17:26.570Z')
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
VALUES ('c31b484b-8469-430f-ba96-de90e8c73410', '9e339070-b782-43a5-a4bf-78a2cd1261c4', NULL, NULL, NULL, 63, 6, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-04-04T22:17:26.583Z', '2026-04-04T22:17:26.583Z')
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
-- Fichier généré: kaayjob-export-2026-04-04T22-17-29-928Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 8
-- Catégories: 6
-- Profils prestataires: 6
-- Services: 0
-- Avis: 0
-- Réservations: 0
