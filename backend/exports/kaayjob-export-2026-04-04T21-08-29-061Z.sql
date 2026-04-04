-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: 2026-04-04T21:08:29.061Z
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Utilisateurs
INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('e54718c1-759a-4dfe-896b-2abd9160db85', 'valid.test.1774717089250@example.com', '$2a$10$XBRLUxjWVoCFKPOtKSyueuM1IJ4JNBQqurVPT21zke/mogs3j62Eq', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:58:19.499Z', '2026-03-28T16:58:19.499Z')
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
VALUES ('978d6324-656a-4a43-9bb9-6f5c6dbc6e3d', 'valid.test.1774717116832@example.com', '$2a$10$4djZyNUZOQzVflVPpniUFukngo/Yw8gS19Pa5IGbTJNXFCDKrYuVi', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:58:47.047Z', '2026-03-28T16:58:47.047Z')
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
VALUES ('test-provider-1', 'ahmed@example.com', '$2b$10$hashedpassword', 'Ahmed', 'Diallo', '+22177123456', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-25T22:58:35.386Z', '2026-03-25T22:58:35.386Z')
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
VALUES ('test-provider-2', 'fatou@example.com', '$2b$10$hashedpassword', 'Fatou', 'Sow', '+22177234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-25T22:59:15.456Z', '2026-03-25T22:59:15.456Z')
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
VALUES ('test-provider-3', 'moussa@example.com', '$2b$10$hashedpassword', 'Moussa', 'Ba', '+22177345678', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-25T22:59:15.465Z', '2026-03-25T22:59:15.465Z')
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
VALUES ('9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', 'ahmed.plombier@email.com', '$2a$12$kZvPbYM/p3U/.FRjJUFflOic4ttiJbqyxPRwH2NA1/AoVoQAIcA0S', 'Ahmed', 'Khan', '+221771234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:52.883Z', '2026-03-09T01:15:52.883Z')
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
VALUES ('94b93434-0df9-4d1f-a8f9-6114ad45b2ca', 'valid.test.1774718797076@example.com', '$2a$10$Zcd9.0hQMKLWi97XFnCbB.sWt0UAqM8o93OeMXikI9lBoqh0n7ZDO', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:26:47.731Z', '2026-03-28T17:26:47.731Z')
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
VALUES ('2a819f60-c3ab-49d2-b6fa-471e06375bb2', 'ibrahim.elec@email.com', '$2a$12$JbfZ4bvPlAAKNFENCyDXTugVI.wEkIn2qTtB4lu4T1clo3lArJ8Ay', 'Ibrahim', 'Sarr', '+221771234569', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:53.872Z', '2026-03-09T01:15:53.872Z')
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
VALUES ('9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'oussein.brico@email.com', '$2a$12$aZib6zYLZKxT8L3sOHxF5.8HYg/qU9NSexzS4WOUb/1rIHtFz.eJ2', 'Ousseynou', 'Ba', '+221771234571', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:54.321Z', '2026-03-09T01:15:54.321Z')
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
VALUES ('18dc130d-1ed8-454b-8e11-78792917e365', 'moussa.macon@email.com', '$2a$12$PRR8JK16CtBYWYiTJbQkaOJQfCnGV6seXTvWBYIdKyOQ9zj/sB14q', 'Moussa', 'Sow', '+221771234572', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:54.772Z', '2026-03-09T01:15:54.772Z')
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
VALUES ('7ae6604b-d05a-441d-831b-a4930c450caa', 'ali.bois@email.com', '$2a$12$edGla1AvMcILiq.DN.ibzOpJACjpfZOjeKD7PQFiE5hBLAIIGPjwK', 'Ali', 'Diallo', '+221771234573', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:55.221Z', '2026-03-09T01:15:55.221Z')
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
VALUES ('75679302-1937-472f-815e-ba0f92e8a033', 'youssou.metal@email.com', '$2a$12$HVLPb0ANKNcsJRBgk3cHQuXOY4RTAlZMdBX0oSHgBELAAmbs61VAO', 'Youssoufa', 'Ndiaye', '+221771234574', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:55.675Z', '2026-03-09T01:15:55.675Z')
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
VALUES ('f677333b-5d25-4920-908b-1666c61335ae', 'mamadou.reparation@email.com', '$2a$12$.CQEZGnAVkYhxNWC2TV5rue9LTOy2KJhFYk5J.atZeyGcOgHA4QwS', 'Mamadou', 'Fall', '+221771234575', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:56.117Z', '2026-03-09T01:15:56.117Z')
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
VALUES ('aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', 'fatou.menage@email.com', '$2a$12$/GaiuKx.TdXOH/v3XQTvwO2g1REC4qffbs7Jn/fdm33d8jp9mfg6G', 'Fatou', 'Sall', '+221771234576', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:56.564Z', '2026-03-09T01:15:56.564Z')
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
VALUES ('b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'prof.samba@email.com', '$2a$12$/wEWH5QCPQu5CmbEsKRLZOAJRoKQ5Xw8x.Vensz9haMACUsQUEoey', 'Samba', 'Ndiour', '+221771234577', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:57.013Z', '2026-03-09T01:15:57.013Z')
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
VALUES ('d6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'client1@email.com', '$2a$12$MSDpTZa5XDQEUnpyUTL3QO/PLzIk2P.13C5bxYD7La4OXu7Tylw/a', 'Pierre', 'Dupont', '+221771234580', 'CLIENT', '', '', '', '', null, null, NULL, false, true, '2026-03-09T01:15:57.548Z', '2026-03-09T01:15:57.548Z')
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
VALUES ('51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'client2@email.com', '$2a$12$4WhZxfYUVyFWsNRSllb90OHOVQzkuNlC4o3yzUQk9e12G.BGNzixK', 'Sophie', 'Martin', '+221771234581', 'CLIENT', '', '', '', '', null, null, NULL, false, true, '2026-03-09T01:15:58.005Z', '2026-03-09T01:15:58.005Z')
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
VALUES ('f5cca877-b2b9-4f77-937e-3b94fda2459e', 'client3@email.com', '$2a$12$fm7Xk7qZrlNqHNT.QBCi0u60MNcXOFyseffYHIWc2lMzaHdZjdnqq', 'Jean', 'Bernard', '+221771234582', 'CLIENT', '', '', '', '', null, null, NULL, false, true, '2026-03-09T01:15:58.449Z', '2026-03-09T01:15:58.449Z')
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
VALUES ('2d91e183-73db-4f17-8e4d-ac13f1e40dd9', 'diengabzo@gmail.com', 'Passer123', 'Abzo', 'Dieng', '+221785474553', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:22:07.926Z', '2026-03-09T01:22:07.926Z')
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
VALUES ('74e63a3d-126c-4140-9723-c8b0ed952b84', 'aboubakr.dieng@kaayjob.sn', '$2a$12$1OuC8j4symnVR6lu1Tsf0OzpPMPX3Zg6XEr7AlLDck45PohvLR9kG', 'Aboubakry', 'Dieng', '+221770000000', 'ADMIN', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:52.268Z', '2026-03-09T01:44:29.486Z')
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
VALUES ('51bae0d2-fde9-4ebc-b739-1a3d1ba23a1b', 'valid.test.1774718822239@example.com', '$2a$10$ooYLUXtaw5fZXrm4kAldreq7cLpsK3/GNl/ZEIfa.2ZQbdUUk3q8C', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:27:12.493Z', '2026-03-28T17:27:12.493Z')
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
VALUES ('9112652e-6049-4c6e-b181-a181a5ce1d1d', 'valid.test.1774719565953@example.com', '$2a$10$VeosX/frBLmGuAlGPPBMO.Qxbx.4oEbx7yuXBFzXj8blDJSoB1ZkW', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:39:36.206Z', '2026-03-28T17:39:36.206Z')
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
VALUES ('45d36ca2-4401-4bdf-b9bb-eeeaec8d69bc', 'test.1774714029995@example.com', '$2a$10$1.KS5rhpctv6BLgvdaOep.jsSeFD2sblhnhx0F4twhq7HhkcAWL3a', 'Test', 'Services', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:07:37.428Z', '2026-03-28T16:07:37.428Z')
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
VALUES ('b4a5b4b2-0382-48c4-981a-6cc56656af6a', 'test.1774714032360@example.com', '$2a$10$qZr0TlaXprnNpj5bP7s3yuApDZYxA3rJBgbpJW6Y0wXQCoAotrwKe', 'Test', 'Services', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:07:37.503Z', '2026-03-28T16:07:37.503Z')
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
VALUES ('3daf4903-af3a-4350-b465-19440990bad9', 'test.1774714676126@example.com', '$2a$10$IK2MVdJGHE.GT9ySVPduOuYUpZc5tLCh1oZBfBYqN//K6hxIyF84i', 'Test', 'Services', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:18:22.768Z', '2026-03-28T16:18:22.768Z')
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
VALUES ('2a46c2d2-e92b-44e1-a211-7d8ec47dfb02', 'test.1774714675206@example.com', '$2a$10$jMVY7KA5MWRaOWZBTUEXS.TmzqKbELdWFpL1XknjJBp2UoV1g/aSm', 'Test', 'Services', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:18:22.767Z', '2026-03-28T16:18:22.767Z')
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
VALUES ('57391a79-1fc2-4f17-822b-2784c989e653', 'test.api@example.com', '$2a$10$Odb0ty/R0RfmXd0AjQyjH.C1tmSrIfLO9P4nqZNzvz3k6aMDUgNLu', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:50:48.793Z', '2026-03-28T16:50:48.793Z')
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
VALUES ('f8a263ad-cad9-40b0-8e46-e2707d36e000', 'valid.test.1774716975830@example.com', '$2a$10$/1DmTaOrBgnOkMgZnk9qxOtZAWvR4xQxPGwCH1QFwZ.pn9ZO7ZWU2', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:56:26.064Z', '2026-03-28T16:56:26.064Z')
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
VALUES ('e50a8f65-ffb2-46cf-adef-5c85d3893dc6', 'valid.test.1774716976224@example.com', '$2a$10$tMI.wQlPP0fyE6uq6G8mcORSoeIMmn2QbuPdHXsRhyONzaCJCP9sW', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T16:56:26.467Z', '2026-03-28T16:56:26.467Z')
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
VALUES ('0f53ed2e-baaf-4614-8de5-6222923ab8d3', 'verified.provider.1774719554619@example.com', '$2a$10$iekUgBWqxoAMworWpoEGLeGcyfYEK9xeFD2EhcKkdz.zueUVPdHjK', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:44:35.277Z', '2026-03-28T17:44:35.277Z')
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
VALUES ('999c8ca1-47ee-4ca8-af2f-ccdc012604fb', 'subscribed.provider.1774719560212@example.com', '$2a$10$LrCxhpMvZ8fl4Rm7IJN6YuKyoroFj7Ue/CSbryf5H5ejcRofUxx72', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:44:55.415Z', '2026-03-28T17:44:55.415Z')
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
VALUES ('b1efb264-1820-49bb-b383-e853ac6fe9ac', 'valid.test.1774719909812@example.com', '$2a$10$/L07kCM2G8DvTmomc8yA5OM.sR8fywWIhAVyTWsAqoOszqD.flcGu', 'PrestataireTest', 'PrestataireTest', '+221781234567', 'PRESTATAIRE', '', '', '', '', null, null, NULL, false, true, '2026-03-28T17:45:20.090Z', '2026-03-28T17:45:20.090Z')
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
VALUES ('e9cc02e7-9940-48c1-a093-a0d1d40bcdcf', 'marie.menage@email.com', '$2a$12$5DD7OxuggOjmxOs/HhAUpukEpjfHI6nDW9EhA72bwRf.QqskRUY2i', 'Marie', 'Diop', '+221771234568', 'PRESTATAIRE', '', '', '', '', null, null, NULL, true, true, '2026-03-09T01:15:53.411Z', '2026-04-01T23:51:15.866Z')
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
VALUES ('58878179-52f2-4ae4-8c52-9bed630ac0ed', 'Mécanique', 'mecanique', 'Services de mécanique automobile', '🔧', '/images/mecanique.png', true, 13, NULL, '2026-03-09T01:15:52.330Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('aa4d5968-bc5a-4b9a-9050-233b76463917', 'Cuisine', 'cuisine', 'Services de cuisine et préparation de repas', '🍳', '/images/cuisine.png', false, 14, NULL, '2026-03-09T01:15:52.337Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Ménage', 'menage', 'Services de nettoyage domestique', '🧹', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', true, 1, NULL, '2026-03-09T01:15:52.275Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Bricolage', 'bricolage', 'Travaux de réparation et petit bricolage', '🔧', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800', true, 3, NULL, '2026-03-09T01:15:52.282Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Électricité', 'electricite', 'Services électriques et installation', '💡', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', true, 4, NULL, '2026-03-09T01:15:52.285Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Plomberie', 'plomberie', 'Réparation plomberie et installation', '🚿', '/images/plomberie.png', true, 5, NULL, '2026-03-09T01:15:52.288Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('c946a875-85f7-42cb-9aaa-dbdfc2aeb1b6', 'Peinture', 'peinture', 'Travaux de peinture intérieure et extérieure', '🎨', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800', true, 6, NULL, '2026-03-09T01:15:52.293Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('bc6ef689-c261-45df-844c-c1b94c6a4731', 'Déménagement', 'demangement', 'Aide au déménagement et transport', '📦', '/images/Demenagement.png', true, 7, NULL, '2026-03-09T01:15:52.299Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation', 'reparation', 'Services de réparation et maintenance', '🔩', '/images/Reparation.png', true, 8, NULL, '2026-03-09T01:15:52.303Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Maçon', 'macon', 'Travaux de construction et maçonnerie', '🧱', '/images/maçon.png', true, 9, NULL, '2026-03-09T01:15:52.308Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('289ccb62-a3d0-4532-8661-19487169f202', 'Menuisier bois', 'menuisier-bois', 'Travail du bois et fabrication de meubles', '🪵', '/images/menuiserie.png', true, 10, NULL, '2026-03-09T01:15:52.314Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Menuisier métallique', 'menuisier-metal', 'Travail du métal et ferronnerie', '⚙️', '/images/metalique.png', true, 11, NULL, '2026-03-09T01:15:52.319Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Éducation', 'education', 'Cours à domicile et soutien scolaire', '📚', '/images/education.png', true, 12, NULL, '2026-03-09T01:15:52.323Z', '2026-04-04T21:08:29.215Z')
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
VALUES ('109fae9a-9000-4b13-b67d-9842f5043495', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', 'Ahmed Services', 'Plomberie', 'Plombier professionnel avec 10 ans d''expérience. Spécialisé en réparation de fuites et installation de canalisations.', 25, 10, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 25, 47, true, NULL, NULL, '2026-03-09T01:15:52.891Z', '2026-03-09T01:15:52.891Z')
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
VALUES ('8fafc4b0-16a5-44ea-a750-1f19dc0f1e2b', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', 'Sarr Électricité', 'Électricité', 'Électricien certifié. Installation électrique, dépannage, mise aux normes.', 30, 8, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 21, 81, true, NULL, NULL, '2026-03-09T01:15:53.878Z', '2026-03-09T01:15:53.878Z')
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
VALUES ('9c67d933-362d-4f98-9001-58926a88bb94', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'Brico Services', 'Bricolage', 'Bricoleur polyvalent. Réparations diverses, montage de meubles, petits travaux.', 18, 4, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 47, 46, true, NULL, NULL, '2026-03-09T01:15:54.327Z', '2026-03-09T01:15:54.327Z')
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
VALUES ('d2c4c18c-ab9f-461b-9cd5-23e6c95c2349', '18dc130d-1ed8-454b-8e11-78792917e365', 'Sow Construction', 'Maçon', 'Maçon professionnel. Construction, rénovation, dallage, fondation. Qualité garantie.', 35, 12, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 15, 21, true, NULL, NULL, '2026-03-09T01:15:54.779Z', '2026-03-09T01:15:54.779Z')
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
VALUES ('e2540d73-6d74-44be-a303-fdfca3affba8', '7ae6604b-d05a-441d-831b-a4930c450caa', 'Diallo Menuiserie', 'Menuisier bois', 'Menuisier qualifié. Fabrication et pose de meubles, portes, fenêtres, escaliers.', 28, 10, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 50, 52, true, NULL, NULL, '2026-03-09T01:15:55.228Z', '2026-03-09T01:15:55.228Z')
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
VALUES ('6ee28107-c45e-47dc-8390-cbbbb7e3e166', '75679302-1937-472f-815e-ba0f92e8a033', 'Ndiaye Ferronnerie', 'Menuisier métallique', 'Ferronnier d''art. Portails, grilles, rambarde, mobilier métallique sur mesure.', 32, 8, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 56, 103, true, NULL, NULL, '2026-03-09T01:15:55.681Z', '2026-03-09T01:15:55.681Z')
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
VALUES ('70992a2f-cd82-4eef-9c33-32f867a3fc1e', 'f677333b-5d25-4920-908b-1666c61335ae', 'Fall Réparations', 'Réparation', 'Spécialiste en réparation d''appareils électroménagers, meubles et équipements.', 22, 6, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 21, 97, true, NULL, NULL, '2026-03-09T01:15:56.123Z', '2026-03-09T01:15:56.123Z')
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
VALUES ('8624c699-8621-454a-b338-2a85e58e7593', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', 'Fatou Services Ménagers', 'Femme de ménage', 'Femme de ménage expérimentée. Nettoyage complet, repassage, rangement.', 12, 7, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 38, 44, true, NULL, NULL, '2026-03-09T01:15:56.569Z', '2026-03-09T01:15:56.569Z')
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
VALUES ('1de2dee9-c23d-48ca-b5f8-0b497d401e0a', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'Cours Particuliers Samba', 'Éducation', 'Professeur certifié. Maths, Physique, Chimie. Tous niveaux du primaire à l''université.', 35, 12, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 44, 117, true, NULL, NULL, '2026-03-09T01:15:57.020Z', '2026-03-09T01:15:57.020Z')
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
VALUES ('78d683c6-bb6f-46f7-b978-4d8873e94016', '2d91e183-73db-4f17-8e4d-ac13f1e40dd9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, true, NULL, NULL, '2026-03-09T01:22:37.984Z', '2026-03-09T01:22:37.984Z')
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
VALUES ('7735843b-af2e-47da-8ee2-02274df95d56', 'test-provider-1', NULL, NULL, NULL, 54, 6, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-26T00:36:20.988Z', '2026-03-26T00:36:20.988Z')
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
VALUES ('62562e04-3dff-49e6-b27d-d73e7fd158cf', 'e9cc02e7-9940-48c1-a093-a0d1d40bcdcf', 'Marie Nettoyage', 'Ménage', 'Experte en nettoyage domestique. Services de qualité pour particuliers et entreprises.', 15, 5, 'Dakar', NULL, 'Dakar', NULL, NULL, NULL, true, 4.5, 30, 21, true, NULL, '{"friday":{"end":"18:00","start":"08:00","enabled":true},"monday":{"end":"18:00","start":"08:00","enabled":true},"sunday":{"end":"12:00","start":"09:00","enabled":true},"tuesday":{"end":"18:00","start":"08:00","enabled":true},"saturday":{"end":"16:00","start":"09:00","enabled":true},"thursday":{"end":"18:00","start":"08:00","enabled":true},"wednesday":{"end":"18:00","start":"08:00","enabled":true}}', '2026-03-09T01:15:53.418Z', '2026-03-26T01:35:59.121Z')
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
VALUES ('345a20b5-aed3-45bf-ae07-3135bf0106d9', 'test-provider-3', NULL, NULL, NULL, 40, 10, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, true, NULL, NULL, '2026-03-25T22:59:15.468Z', '2026-03-26T19:13:08.862Z')
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
VALUES ('2fdd2f6e-344e-405d-840a-32894890b895', 'test-provider-2', NULL, NULL, NULL, 66, 9, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, true, NULL, NULL, '2026-03-25T22:59:15.458Z', '2026-03-26T19:45:04.628Z')
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
VALUES ('17dcb57a-ca71-4717-8975-c92e118b53fb', '45d36ca2-4401-4bdf-b9bb-eeeaec8d69bc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:07:37.428Z', '2026-03-28T16:07:37.428Z')
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
VALUES ('9991c00f-3cc7-43a6-8577-ea59d6847b21', 'b4a5b4b2-0382-48c4-981a-6cc56656af6a', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:07:37.503Z', '2026-03-28T16:07:37.503Z')
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
VALUES ('804ccd9a-e98d-473c-a371-f668435470f2', '3daf4903-af3a-4350-b465-19440990bad9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:18:22.768Z', '2026-03-28T16:18:22.768Z')
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
VALUES ('cb297399-6cfb-4310-9977-1dc00cb8ba9a', '2a46c2d2-e92b-44e1-a211-7d8ec47dfb02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:18:22.767Z', '2026-03-28T16:18:22.767Z')
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
VALUES ('0cbf1fa9-b68e-4809-acd0-915ef669ed9f', '57391a79-1fc2-4f17-822b-2784c989e653', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:50:48.793Z', '2026-03-28T16:50:48.793Z')
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
VALUES ('f4f064c0-84e6-4138-84bb-a1ac39e5a857', 'f8a263ad-cad9-40b0-8e46-e2707d36e000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:56:26.064Z', '2026-03-28T16:56:26.064Z')
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
VALUES ('110bcf5f-cdd4-4bec-9b45-b91ab6b914aa', 'e50a8f65-ffb2-46cf-adef-5c85d3893dc6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:56:26.467Z', '2026-03-28T16:56:26.467Z')
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
VALUES ('ebe36602-78c6-4aee-b3e4-f3437be39492', 'e54718c1-759a-4dfe-896b-2abd9160db85', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:58:19.499Z', '2026-03-28T16:58:19.499Z')
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
VALUES ('1ec4e678-34b0-4e99-bcc1-2b8e79522a36', '978d6324-656a-4a43-9bb9-6f5c6dbc6e3d', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T16:58:47.047Z', '2026-03-28T16:58:47.047Z')
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
VALUES ('ec5e2f40-35b8-42a0-9ef3-220f30d7d2c0', '94b93434-0df9-4d1f-a8f9-6114ad45b2ca', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T17:26:47.731Z', '2026-03-28T17:26:47.731Z')
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
VALUES ('50a5a4e3-91ee-4bf0-84f5-a4077e73df3e', '51bae0d2-fde9-4ebc-b739-1a3d1ba23a1b', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T17:27:12.493Z', '2026-03-28T17:27:12.493Z')
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
VALUES ('b11b89c9-7017-47d3-bc58-03d11bce7985', '9112652e-6049-4c6e-b181-a181a5ce1d1d', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T17:39:36.206Z', '2026-03-28T17:39:36.206Z')
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
VALUES ('2cf1b97c-0d9c-4a8a-957a-a664fc843db7', '0f53ed2e-baaf-4614-8de5-6222923ab8d3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T17:44:35.277Z', '2026-03-28T17:44:35.277Z')
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
VALUES ('e9c75b63-4e24-467b-9f54-de88556fbfc5', '999c8ca1-47ee-4ca8-af2f-ccdc012604fb', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, false, NULL, NULL, '2026-03-28T17:44:55.415Z', '2026-03-28T17:44:55.415Z')
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
VALUES ('16e5fffa-fa95-4b47-8bbf-0142a7c840c8', 'b1efb264-1820-49bb-b383-e853ac6fe9ac', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 0, 0, 0, true, NULL, NULL, '2026-03-28T17:45:20.090Z', '2026-04-01T15:47:03.287Z')
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
VALUES ('80c5b86d-1d13-4b35-9ae2-5c66eac009d0', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Réparation de fuite', 'Détection et réparation de fuites d''eau', 5000, 'HOURLY', 60, true, '2026-03-09T01:15:57.025Z', '2026-03-09T01:15:57.025Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('d51b1d85-036c-4425-bb4e-8600f60ca6b9', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Débouchage canalisation', 'Débouchage de WC, lavabo, évier', 8000, 'HOURLY', 90, true, '2026-03-09T01:15:57.029Z', '2026-03-09T01:15:57.029Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('be1ca366-9b64-42bb-93ad-0ea60066eed8', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Installation sanitaires', 'Pose de lavabo, WC, baignoire', 25000, 'HOURLY', 180, true, '2026-03-09T01:15:57.031Z', '2026-03-09T01:15:57.031Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('1fab6bbe-d394-4fda-8cd5-e70094271c17', 'e9cc02e7-9940-48c1-a093-a0d1d40bcdcf', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Nettoyage maison', 'Nettoyage complet domicile', 10000, 'HOURLY', 120, true, '2026-03-09T01:15:57.034Z', '2026-03-09T01:15:57.034Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c2dd8a66-604e-4685-b13a-8ffee38379b5', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Dépannage électrique', 'Intervention rapide pour panne électrique', 10000, 'HOURLY', 60, true, '2026-03-09T01:15:57.041Z', '2026-03-09T01:15:57.041Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('be1624ff-5d41-4c5d-9e44-dd104f8af92f', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Installation prise', 'Pose de prises électriques', 5000, 'HOURLY', 30, true, '2026-03-09T01:15:57.044Z', '2026-03-09T01:15:57.044Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('efeec479-19ce-4f03-9963-d044bfe26df9', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Mise aux normes', 'Mise aux normes du tableau électrique', 50000, 'HOURLY', 360, true, '2026-03-09T01:15:57.046Z', '2026-03-09T01:15:57.046Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('778124e2-c6aa-4232-addc-7f7783a46ee7', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Montage meubles', 'Montage de meubles IKEA et autres', 5000, 'HOURLY', 45, true, '2026-03-09T01:15:57.048Z', '2026-03-09T01:15:57.048Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('0d5b04d9-80bc-4d0a-a809-dcdf79562884', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Petite réparation', 'Réparations diverses à domicile', 3000, 'HOURLY', 30, true, '2026-03-09T01:15:57.051Z', '2026-03-09T01:15:57.051Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('96d8c7b0-967b-434a-a9da-b2c513affac0', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Pose étagère', 'Installation d''étagères et rangements', 4000, 'HOURLY', 30, true, '2026-03-09T01:15:57.053Z', '2026-03-09T01:15:57.053Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('abb6dbc7-1133-4d7b-a670-e1d5db399cae', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Construction mur', 'Construction de murs en briques ou parpaings', 25000, 'HOURLY', 240, true, '2026-03-09T01:15:57.055Z', '2026-03-09T01:15:57.055Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('139eba89-2abf-471e-b989-049ae9cc8714', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Rénovation maçonnerie', 'Réparation et réfection de maçonnerie', 20000, 'HOURLY', 180, true, '2026-03-09T01:15:57.059Z', '2026-03-09T01:15:57.059Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('4a32f6fc-52a7-4914-9001-0c91c3766750', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Dallage', 'Pose de dallage extérieur ou intérieur', 30000, 'HOURLY', 300, true, '2026-03-09T01:15:57.061Z', '2026-03-09T01:15:57.061Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('b4ccb049-10a3-45fe-8646-bc58b8e5be83', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Fabrication meuble', 'Meuble sur mesure en bois', 45000, 'HOURLY', 480, true, '2026-03-09T01:15:57.063Z', '2026-03-09T01:15:57.063Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9c54f807-7432-48e2-870b-84299eb906bc', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose porte', 'Installation de portes intérieures et extérieures', 15000, 'HOURLY', 120, true, '2026-03-09T01:15:57.065Z', '2026-03-09T01:15:57.065Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('459e2b9a-cf52-40da-b109-ad40ab3dda14', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose fenêtre', 'Pose de fenêtres en bois', 20000, 'HOURLY', 180, true, '2026-03-09T01:15:57.068Z', '2026-03-09T01:15:57.068Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('ec6e6447-8279-4340-9a46-eaa73a0f6514', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Portail métallique', 'Fabrication et pose de portail', 80000, 'HOURLY', 360, true, '2026-03-09T01:15:57.070Z', '2026-03-09T01:15:57.070Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('060bc4fb-e39e-4018-b7ac-93f54cf60cc0', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Grille de sécurité', 'Installation de grilles aux fenêtres', 25000, 'HOURLY', 180, true, '2026-03-09T01:15:57.073Z', '2026-03-09T01:15:57.073Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('090c567d-34e0-40d6-84cd-202c4c7051d9', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Rambarde escalier', 'Pose de rambarde ou garde-corps', 35000, 'HOURLY', 240, true, '2026-03-09T01:15:57.075Z', '2026-03-09T01:15:57.075Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9d59c347-f71c-4592-b054-a5e524ce4a10', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation electroménager', 'Réparation d''appareils électroménagers', 8000, 'HOURLY', 60, true, '2026-03-09T01:15:57.078Z', '2026-03-09T01:15:57.078Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c4f53f7f-d49a-40e0-9228-1bb3915c3e7b', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation meubles', 'Réparation et restauration de meubles', 5000, 'HOURLY', 45, true, '2026-03-09T01:15:57.081Z', '2026-03-09T01:15:57.081Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('936fc3d8-8211-432b-8011-76a3c21f5a5f', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Maintenance équipements', 'Entretien et maintenance d''équipements', 6000, 'HOURLY', 45, true, '2026-03-09T01:15:57.083Z', '2026-03-09T01:15:57.083Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('2c20fab1-790c-4eba-a2f2-70a3c26866bc', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Nettoyage quotidien', 'Nettoyage quotidien du domicile', 8000, 'HOURLY', 120, true, '2026-03-09T01:15:57.086Z', '2026-03-09T01:15:57.086Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('42bb8038-6483-4406-84ea-3a920fc08fda', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Repassage', 'Service de repassage à domicile', 5000, 'HOURLY', 90, true, '2026-03-09T01:15:57.089Z', '2026-03-09T01:15:57.089Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('5d23c655-2cda-4739-81d7-870701f6465d', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Grand nettoyage', 'Nettoyage complet et approfondi', 20000, 'HOURLY', 240, true, '2026-03-09T01:15:57.091Z', '2026-03-09T01:15:57.091Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('5d295fdd-b795-408e-b69a-80349f8ea7ee', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Maths', 'Cours particuliers de mathématiques', 10000, 'HOURLY', 60, true, '2026-03-09T01:15:57.094Z', '2026-03-09T01:15:57.094Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('79604ad0-5270-427f-8aef-fcaf311bc45d', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Physique', 'Cours particuliers de physique', 10000, 'HOURLY', 60, true, '2026-03-09T01:15:57.096Z', '2026-03-09T01:15:57.096Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('6f10133f-c13e-435c-931e-a05aec420449', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Soutien scolaire', 'Aide aux devoirs et soutien scolaire', 8000, 'HOURLY', 60, false, '2026-03-09T01:15:57.099Z', '2026-03-09T01:27:57.542Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('3906f409-e22c-4752-a92d-422a153d46bb', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Réparation de fuite', 'Détection et réparation de fuites d''eau', 5000, 'HOURLY', 60, true, '2026-03-23T20:39:38.564Z', '2026-03-23T20:39:38.564Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('340939c1-0ad7-4ef5-8787-b52180ed02b9', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Débouchage canalisation', 'Débouchage de WC, lavabo, évier', 8000, 'HOURLY', 90, true, '2026-03-23T20:39:38.570Z', '2026-03-23T20:39:38.570Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('4d2a9018-8286-4f90-9fd8-024b799355a8', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Installation sanitaires', 'Pose de lavabo, WC, baignoire', 25000, 'HOURLY', 180, true, '2026-03-23T20:39:38.574Z', '2026-03-23T20:39:38.574Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('127f9e9b-1bef-4399-be01-7941a732350d', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Dépannage électrique', 'Intervention rapide pour panne électrique', 10000, 'HOURLY', 60, true, '2026-03-23T20:39:38.590Z', '2026-03-23T20:39:38.590Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('79e936e6-75ac-4623-9e70-260c75b6edad', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Installation prise', 'Pose de prises électriques', 5000, 'HOURLY', 30, true, '2026-03-23T20:39:38.594Z', '2026-03-23T20:39:38.594Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('4c0d4e47-f6f0-4a8c-97c6-0bfa9255a71f', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Mise aux normes', 'Mise aux normes du tableau électrique', 50000, 'HOURLY', 360, true, '2026-03-23T20:39:38.597Z', '2026-03-23T20:39:38.597Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('3fd84ac5-c35e-4714-8c14-af0528068209', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Montage meubles', 'Montage de meubles IKEA et autres', 5000, 'HOURLY', 45, true, '2026-03-23T20:39:38.600Z', '2026-03-23T20:39:38.600Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('49fbe034-6d4b-4715-af1c-5b56d9cd0cb7', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Petite réparation', 'Réparations diverses à domicile', 3000, 'HOURLY', 30, true, '2026-03-23T20:39:38.603Z', '2026-03-23T20:39:38.603Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('398c8349-06d9-485f-84e6-746122e1b266', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Pose étagère', 'Installation d''étagères et rangements', 4000, 'HOURLY', 30, true, '2026-03-23T20:39:38.606Z', '2026-03-23T20:39:38.606Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('6755ca7c-2db3-47ae-845b-cae726ad7051', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Construction mur', 'Construction de murs en briques ou parpaings', 25000, 'HOURLY', 240, true, '2026-03-23T20:39:38.610Z', '2026-03-23T20:39:38.610Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('a8fb5753-dd1e-45b2-be21-6ecf93e156d4', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Rénovation maçonnerie', 'Réparation et réfection de maçonnerie', 20000, 'HOURLY', 180, true, '2026-03-23T20:39:38.613Z', '2026-03-23T20:39:38.613Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('8827de15-9f9c-4291-8429-f9ff4e514e60', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Dallage', 'Pose de dallage extérieur ou intérieur', 30000, 'HOURLY', 300, true, '2026-03-23T20:39:38.615Z', '2026-03-23T20:39:38.615Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('a19be93e-1d80-43e6-88a6-5460805058f5', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Fabrication meuble', 'Meuble sur mesure en bois', 45000, 'HOURLY', 480, true, '2026-03-23T20:39:38.618Z', '2026-03-23T20:39:38.618Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('2135baae-cefb-4569-97b5-993cf7f1044a', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose porte', 'Installation de portes intérieures et extérieures', 15000, 'HOURLY', 120, true, '2026-03-23T20:39:38.621Z', '2026-03-23T20:39:38.621Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('45a0df56-60e0-479e-8117-9a9e6d39e1bc', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose fenêtre', 'Pose de fenêtres en bois', 20000, 'HOURLY', 180, true, '2026-03-23T20:39:38.624Z', '2026-03-23T20:39:38.624Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('b696d21a-93aa-4441-a0b6-9722cccc8dba', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Portail métallique', 'Fabrication et pose de portail', 80000, 'HOURLY', 360, true, '2026-03-23T20:39:38.627Z', '2026-03-23T20:39:38.627Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('e6d09532-94ee-43b5-99d3-a3db0a3a317f', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Grille de sécurité', 'Installation de grilles aux fenêtres', 25000, 'HOURLY', 180, true, '2026-03-23T20:39:38.629Z', '2026-03-23T20:39:38.629Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('d623f8c9-2a80-4992-9c36-87a4d1a35311', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Rambarde escalier', 'Pose de rambarde ou garde-corps', 35000, 'HOURLY', 240, true, '2026-03-23T20:39:38.632Z', '2026-03-23T20:39:38.632Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('cbb1d691-1234-4970-bd49-d79fc46cdd8c', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation electroménager', 'Réparation d''appareils électroménagers', 8000, 'HOURLY', 60, true, '2026-03-23T20:39:38.634Z', '2026-03-23T20:39:38.634Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('3b53ca6e-b230-4997-920e-dc703fa5bb2b', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation meubles', 'Réparation et restauration de meubles', 5000, 'HOURLY', 45, true, '2026-03-23T20:39:38.637Z', '2026-03-23T20:39:38.637Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('351a0f15-5380-41f3-a7e3-69411d61c36f', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Maintenance équipements', 'Entretien et maintenance d''équipements', 6000, 'HOURLY', 45, true, '2026-03-23T20:39:38.639Z', '2026-03-23T20:39:38.639Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('61da0900-0c99-4dee-893c-df4a75acf134', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Nettoyage quotidien', 'Nettoyage quotidien du domicile', 8000, 'HOURLY', 120, true, '2026-03-23T20:39:38.642Z', '2026-03-23T20:39:38.642Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('20bdd8f5-635f-41e4-b728-9de7a80a3ac1', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Repassage', 'Service de repassage à domicile', 5000, 'HOURLY', 90, true, '2026-03-23T20:39:38.645Z', '2026-03-23T20:39:38.645Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9d674970-1993-4712-a34b-4c6829f1c9e9', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Grand nettoyage', 'Nettoyage complet et approfondi', 20000, 'HOURLY', 240, true, '2026-03-23T20:39:38.648Z', '2026-03-23T20:39:38.648Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('2f97d6e2-49ef-446b-9d76-4fbead11734b', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Maths', 'Cours particuliers de mathématiques', 10000, 'HOURLY', 60, true, '2026-03-23T20:39:38.650Z', '2026-03-23T20:39:38.650Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('f61ca4e4-17a2-4984-820e-93028cbf3d7f', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Physique', 'Cours particuliers de physique', 10000, 'HOURLY', 60, true, '2026-03-23T20:39:38.654Z', '2026-03-23T20:39:38.654Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('d63bb5ca-bdd5-41a6-b217-5aa7bc73cbf9', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Soutien scolaire', 'Aide aux devoirs et soutien scolaire', 8000, 'HOURLY', 60, true, '2026-03-23T20:39:38.657Z', '2026-03-23T20:39:38.657Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('8eb968ed-48bb-4891-8c99-510b9f68794d', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Réparation de fuite', 'Détection et réparation de fuites d''eau', 5000, 'HOURLY', 60, true, '2026-03-25T04:27:12.865Z', '2026-03-25T04:27:12.865Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('4a6fa336-efe4-4bdf-8e06-5f0d31b3a265', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Débouchage canalisation', 'Débouchage de WC, lavabo, évier', 8000, 'HOURLY', 90, true, '2026-03-25T04:27:12.875Z', '2026-03-25T04:27:12.875Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('8453f11b-b6fe-490e-8eee-6d0d02b75ca0', '9e3f447b-f73e-4bc3-85cc-a6cfaecdebf9', '8f2989ab-8bf7-4e33-b7b8-e03e6dbc13fb', 'Installation sanitaires', 'Pose de lavabo, WC, baignoire', 25000, 'HOURLY', 180, true, '2026-03-25T04:27:12.880Z', '2026-03-25T04:27:12.880Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('a0ff67c1-9ce4-4481-a8bc-684d8400e25d', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Dépannage électrique', 'Intervention rapide pour panne électrique', 10000, 'HOURLY', 60, true, '2026-03-25T04:27:12.892Z', '2026-03-25T04:27:12.892Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('81ef570c-e1b2-48af-acc8-c47ce880e8dd', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Installation prise', 'Pose de prises électriques', 5000, 'HOURLY', 30, true, '2026-03-25T04:27:12.896Z', '2026-03-25T04:27:12.896Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c913b200-afc6-4dfb-80cf-3ff2b813f8ca', '2a819f60-c3ab-49d2-b6fa-471e06375bb2', '3cb82a11-dabe-4de8-badc-cf6c0a6c8cff', 'Mise aux normes', 'Mise aux normes du tableau électrique', 50000, 'HOURLY', 360, true, '2026-03-25T04:27:12.900Z', '2026-03-25T04:27:12.900Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('5b24b869-5262-42f7-8dc7-60f0a62bd5d4', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Montage meubles', 'Montage de meubles IKEA et autres', 5000, 'HOURLY', 45, true, '2026-03-25T04:27:12.903Z', '2026-03-25T04:27:12.903Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('b4fcd824-dfd2-4260-bef3-70d37cb67256', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Petite réparation', 'Réparations diverses à domicile', 3000, 'HOURLY', 30, true, '2026-03-25T04:27:12.906Z', '2026-03-25T04:27:12.906Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('b8d17667-bcb4-46a8-9657-75d0165006cb', '9cf4e24a-7c32-4aa7-8a84-1b901039c935', 'f1ea2a99-b2d3-4ef6-8461-15455deb8b91', 'Pose étagère', 'Installation d''étagères et rangements', 4000, 'HOURLY', 30, true, '2026-03-25T04:27:12.908Z', '2026-03-25T04:27:12.908Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c4ee357c-88ee-4398-ad8c-8b4d972e5fab', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Construction mur', 'Construction de murs en briques ou parpaings', 25000, 'HOURLY', 240, true, '2026-03-25T04:27:12.912Z', '2026-03-25T04:27:12.912Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9e3d9fb1-2b6c-4c0c-b40d-8afa581f8064', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Rénovation maçonnerie', 'Réparation et réfection de maçonnerie', 20000, 'HOURLY', 180, true, '2026-03-25T04:27:12.916Z', '2026-03-25T04:27:12.916Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('0fb570c3-5e52-497f-8074-8bb68b296d2d', '18dc130d-1ed8-454b-8e11-78792917e365', 'f85d17de-f0a4-4eca-bffc-1901fca5c11b', 'Dallage', 'Pose de dallage extérieur ou intérieur', 30000, 'HOURLY', 300, true, '2026-03-25T04:27:12.919Z', '2026-03-25T04:27:12.919Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('38bbe40b-f2f4-49d0-8c48-156fde1756b1', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Fabrication meuble', 'Meuble sur mesure en bois', 45000, 'HOURLY', 480, true, '2026-03-25T04:27:12.921Z', '2026-03-25T04:27:12.921Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('db0a533b-0ab7-48e8-b89c-c19aa1b6c83d', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose porte', 'Installation de portes intérieures et extérieures', 15000, 'HOURLY', 120, true, '2026-03-25T04:27:12.924Z', '2026-03-25T04:27:12.924Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('434d95fe-1732-4a9c-94e7-4cd7dfbedbf4', '7ae6604b-d05a-441d-831b-a4930c450caa', '289ccb62-a3d0-4532-8661-19487169f202', 'Pose fenêtre', 'Pose de fenêtres en bois', 20000, 'HOURLY', 180, true, '2026-03-25T04:27:12.926Z', '2026-03-25T04:27:12.926Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('2a1fd9ba-e675-4558-b3d8-810da59033ec', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Portail métallique', 'Fabrication et pose de portail', 80000, 'HOURLY', 360, true, '2026-03-25T04:27:12.929Z', '2026-03-25T04:27:12.929Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('ce2484ea-9ee1-4f44-872c-90cc5020e363', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Grille de sécurité', 'Installation de grilles aux fenêtres', 25000, 'HOURLY', 180, true, '2026-03-25T04:27:12.931Z', '2026-03-25T04:27:12.931Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c57e89c0-c99c-4569-af3d-1f4b8d07516c', '75679302-1937-472f-815e-ba0f92e8a033', '47fea6ad-8a16-4827-bc93-f54f1c7644af', 'Rambarde escalier', 'Pose de rambarde ou garde-corps', 35000, 'HOURLY', 240, true, '2026-03-25T04:27:12.934Z', '2026-03-25T04:27:12.934Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('fbc584ee-e543-42b8-986a-242b08790337', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation electroménager', 'Réparation d''appareils électroménagers', 8000, 'HOURLY', 60, true, '2026-03-25T04:27:12.936Z', '2026-03-25T04:27:12.936Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9d025471-733c-473a-aacc-6836512133db', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Réparation meubles', 'Réparation et restauration de meubles', 5000, 'HOURLY', 45, true, '2026-03-25T04:27:12.938Z', '2026-03-25T04:27:12.938Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('54551566-7729-477f-8e28-33c4d271fed6', 'f677333b-5d25-4920-908b-1666c61335ae', 'a922d45d-8adc-40d2-90c1-8a3bfe721939', 'Maintenance équipements', 'Entretien et maintenance d''équipements', 6000, 'HOURLY', 45, true, '2026-03-25T04:27:12.940Z', '2026-03-25T04:27:12.940Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('c6a9cb38-5b69-4dd5-a947-1071ae8e0650', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Nettoyage quotidien', 'Nettoyage quotidien du domicile', 8000, 'HOURLY', 120, true, '2026-03-25T04:27:12.943Z', '2026-03-25T04:27:12.943Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('00396ed8-9045-4592-bf53-678a019d4900', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Repassage', 'Service de repassage à domicile', 5000, 'HOURLY', 90, true, '2026-03-25T04:27:12.945Z', '2026-03-25T04:27:12.945Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('8abaaff5-770b-47b2-bcb7-ee82a8608af4', 'aee5383d-bd3c-4d7b-b1d4-ecebeb2b8f23', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Grand nettoyage', 'Nettoyage complet et approfondi', 20000, 'HOURLY', 240, true, '2026-03-25T04:27:12.947Z', '2026-03-25T04:27:12.947Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('51b1f2bc-4de2-4ac3-8543-ac5bc11a1ed4', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Maths', 'Cours particuliers de mathématiques', 10000, 'HOURLY', 60, true, '2026-03-25T04:27:12.949Z', '2026-03-25T04:27:12.949Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('5d6846d0-e335-4204-96fd-d8a8eebbbd67', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Cours de Physique', 'Cours particuliers de physique', 10000, 'HOURLY', 60, true, '2026-03-25T04:27:12.952Z', '2026-03-25T04:27:12.952Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('9c099df9-aa89-45d8-9935-2d7fcbd7e910', 'b4637520-00ba-4f6d-ae5d-f82f3a417b6e', 'b594b2c0-e0d7-4ab0-8c0f-7e73884fc56f', 'Soutien scolaire', 'Aide aux devoirs et soutien scolaire', 8000, 'HOURLY', 60, true, '2026-03-25T04:27:12.954Z', '2026-03-25T04:27:12.954Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('345b00b6-5793-45e9-9095-d32855463f40', 'e9cc02e7-9940-48c1-a093-a0d1d40bcdcf', '402fd7ee-fb0b-4a29-939b-b03a1dfe661c', 'Menager', NULL, 25000, 'FIXED', 60, true, '2026-04-01T23:35:51.518Z', '2026-04-01T23:35:51.518Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;


-- Avis
INSERT INTO reviews (id, provider_id, client_id, booking_id, rating, comment, created_at, updated_at)
VALUES ('03e22e5f-2d3a-4fea-bf25-36ca16dd7f39', '109fae9a-9000-4b13-b67d-9842f5043495', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'eb3d07b8-542f-4b13-bfb6-415c1272b1cb', 5, 'Excellent travail, très professionnel et ponctuel. Je recommande!', '2026-03-09T01:15:58.493Z', '2026-03-09T01:15:58.493Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, provider_id, client_id, booking_id, rating, comment, created_at, updated_at)
VALUES ('6d36e0d5-0678-44d0-a94a-899050e247e1', '62562e04-3dff-49e6-b27d-d73e7fd158cf', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', '174a10ad-7ba6-4bbe-a125-988049dfa92f', 4, 'Très bon service, légèrement en retard mais travail bien fait.', '2026-03-09T01:15:58.498Z', '2026-03-09T01:15:58.498Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, provider_id, client_id, booking_id, rating, comment, created_at, updated_at)
VALUES ('203f6ecc-621c-4cff-9cc3-f27dc9916257', '8fafc4b0-16a5-44ea-a750-1f19dc0f1e2b', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', '893ad2fe-5813-4b29-a936-17e4ae6102da', 5, 'Service impeccable, Electricien très compétent. Je referai appel.', '2026-03-09T01:15:58.502Z', '2026-03-09T01:15:58.502Z')
ON CONFLICT (id) DO NOTHING;


-- Réservations
INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('eb3d07b8-542f-4b13-bfb6-415c1272b1cb', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '80c5b86d-1d13-4b35-9ae2-5c66eac009d0', 'COMPLETED', '2026-03-19T01:15:58.462Z', 60, 5000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.466Z', '2026-03-09T01:15:58.466Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('174a10ad-7ba6-4bbe-a125-988049dfa92f', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', '1fab6bbe-d394-4fda-8cd5-e70094271c17', 'COMPLETED', '2026-03-17T01:15:58.470Z', 120, 10000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.472Z', '2026-03-09T01:15:58.472Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('893ad2fe-5813-4b29-a936-17e4ae6102da', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'c2dd8a66-604e-4685-b13a-8ffee38379b5', 'COMPLETED', '2026-03-14T01:15:58.473Z', 60, 10000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.474Z', '2026-03-09T01:15:58.474Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('99ffc3b1-87d9-401f-8f1f-18c867f92dd7', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '778124e2-c6aa-4232-addc-7f7783a46ee7', 'CONFIRMED', '2026-03-11T01:15:58.476Z', 45, 5000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.477Z', '2026-03-09T01:15:58.477Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('1b272b79-2935-4d02-ac40-5f8d19794ec2', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'd51b1d85-036c-4425-bb4e-8600f60ca6b9', 'CONFIRMED', '2026-03-10T01:15:58.482Z', 90, 8000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.483Z', '2026-03-09T01:15:58.483Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('ffcd6341-7c85-44c7-a129-3b37751b83d9', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', 'abb6dbc7-1133-4d7b-a670-e1d5db399cae', 'CONFIRMED', '2026-03-09T01:15:58.479Z', 240, 25000, 'Merci de arriver à l''heure', '2026-03-09T01:15:58.480Z', '2026-03-14T00:04:38.880Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('ab7ce73d-a4bf-4de4-a214-f0ba6df93b33', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '80c5b86d-1d13-4b35-9ae2-5c66eac009d0', 'COMPLETED', '2026-04-02T20:39:40.439Z', 60, 5000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.443Z', '2026-03-23T20:39:40.443Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('e0ad732e-8445-45cb-8d55-8ace64cf1985', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', '1fab6bbe-d394-4fda-8cd5-e70094271c17', 'COMPLETED', '2026-03-31T20:39:40.448Z', 120, 10000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.450Z', '2026-03-23T20:39:40.450Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('1d294725-f40a-43b5-b064-6e861b3c66e6', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'c2dd8a66-604e-4685-b13a-8ffee38379b5', 'COMPLETED', '2026-03-28T20:39:40.452Z', 60, 10000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.454Z', '2026-03-23T20:39:40.454Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('d036187d-40f0-412e-aad8-16ed00c6c6cf', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', 'abb6dbc7-1133-4d7b-a670-e1d5db399cae', 'PENDING', '2026-03-23T20:39:40.459Z', 240, 25000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.460Z', '2026-03-23T20:39:40.460Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('69277af5-f50e-4ff0-bf59-ca28c833ec0a', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'd51b1d85-036c-4425-bb4e-8600f60ca6b9', 'CONFIRMED', '2026-03-24T20:39:40.462Z', 90, 8000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.464Z', '2026-03-23T20:39:40.464Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('33c3e26f-66cb-417e-aec5-796f41da2f4f', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '778124e2-c6aa-4232-addc-7f7783a46ee7', 'COMPLETED', '2026-03-25T20:39:40.456Z', 45, 5000, 'Merci de arriver à l''heure', '2026-03-23T20:39:40.457Z', '2026-03-23T20:43:18.714Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('8745a39b-82c8-49c3-92f3-ad1542b18781', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '778124e2-c6aa-4232-addc-7f7783a46ee7', 'COMPLETED', '2026-03-26T00:00:00.000Z', 60, 5000, 'Test booking', '2026-03-25T03:19:21.039Z', '2026-03-25T03:22:58.997Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('84fbf011-4623-4463-8075-a79f92d789f2', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '80c5b86d-1d13-4b35-9ae2-5c66eac009d0', 'COMPLETED', '2026-04-04T04:27:14.752Z', 60, 5000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.763Z', '2026-03-25T04:27:14.763Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('e377283f-78d4-4dc6-9c74-e3e84ecd37f2', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', '1fab6bbe-d394-4fda-8cd5-e70094271c17', 'COMPLETED', '2026-04-02T04:27:14.770Z', 120, 10000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.771Z', '2026-03-25T04:27:14.771Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('6552e579-699e-4641-818a-76ea6854cfed', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'c2dd8a66-604e-4685-b13a-8ffee38379b5', 'COMPLETED', '2026-03-30T04:27:14.773Z', 60, 10000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.775Z', '2026-03-25T04:27:14.775Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('b9cdbb20-fc14-4538-a6f3-94435248f8a4', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '778124e2-c6aa-4232-addc-7f7783a46ee7', 'CONFIRMED', '2026-03-27T04:27:14.777Z', 45, 5000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.778Z', '2026-03-25T04:27:14.778Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('9792cb36-1bd6-414c-ac1e-8e0b56dc6572', '51aa1155-03ca-4fc8-a130-8d910dfab5c4', 'undefined', 'abb6dbc7-1133-4d7b-a670-e1d5db399cae', 'PENDING', '2026-03-25T04:27:14.779Z', 240, 25000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.780Z', '2026-03-25T04:27:14.780Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('c3d43426-9470-486d-a10c-d162782d2640', 'f5cca877-b2b9-4f77-937e-3b94fda2459e', 'undefined', 'd51b1d85-036c-4425-bb4e-8600f60ca6b9', 'CONFIRMED', '2026-03-26T04:27:14.782Z', 90, 8000, 'Merci de arriver à l''heure', '2026-03-25T04:27:14.783Z', '2026-03-25T04:27:14.783Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('5e5db7af-f20a-43ff-92a2-9fc24d7af237', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '398c8349-06d9-485f-84e6-746122e1b266', 'CANCELLED', '2026-03-26T00:00:00.000Z', 60, 4000, NULL, '2026-03-25T02:36:10.597Z', '2026-03-26T18:58:59.638Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('73aa6156-8600-4898-a322-438bf41819f5', 'd6f31905-bdf5-40ed-8d5e-8822d8e9c387', 'undefined', '1fab6bbe-d394-4fda-8cd5-e70094271c17', 'REJECTED', '2026-03-27T00:00:00.000Z', 60, 10000, NULL, '2026-03-26T18:57:49.951Z', '2026-04-01T23:53:08.829Z')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;


-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- ===================================================================
-- Export terminé avec succès !
-- Fichier généré: kaayjob-export-2026-04-04T21-08-29-061Z.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: 33
-- Catégories: 13
-- Profils prestataires: 29
-- Services: 83
-- Avis: 3
-- Réservations: 21
