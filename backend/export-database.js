/**
 * Script d'export de la base de données KaayJob
 * Crée un fichier SQL d'import pour synchroniser les bases de données
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('🚀 Démarrage de l\'export de la base de données...');

  try {
    // Créer le dossier exports s'il n'existe pas
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFile = path.join(exportDir, `kaayjob-export-${timestamp}.sql`);

    let sqlContent = `-- ===================================================================
-- Export de la base de données KaayJob
-- Généré le: ${new Date().toISOString()}
-- ===================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

`;

    // 1. Exporter les utilisateurs
    console.log('📦 Export des utilisateurs...');
    const users = await prisma.user.findMany({
      include: {
        providerProfile: true
      }
    });

    sqlContent += `-- Utilisateurs
`;
    for (const user of users) {
      const userData = {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        role: user.role,
        bio: user.bio || '',
        specialization: user.specialization || '',
        address: user.address || '',
        zone: user.zone || '',
        latitude: user.latitude || null,
        longitude: user.longitude || null,
        avatar: user.avatar || null,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date()
      };

      sqlContent += `INSERT INTO users (id, email, password, first_name, last_name, phone, role, bio, specialization, address, zone, latitude, longitude, avatar, is_verified, is_active, created_at, updated_at)
VALUES ('${userData.id}', '${userData.email.replace(/'/g, "''")}', '${userData.password}', '${userData.firstName.replace(/'/g, "''")}', '${userData.lastName.replace(/'/g, "''")}', '${userData.phone}', '${userData.role}', '${userData.bio.replace(/'/g, "''")}', '${userData.specialization.replace(/'/g, "''")}', '${userData.address.replace(/'/g, "''")}', '${userData.zone.replace(/'/g, "''")}', ${userData.latitude}, ${userData.longitude}, ${userData.avatar ? `'${userData.avatar}'` : 'NULL'}, ${userData.isVerified}, ${userData.isActive}, '${userData.createdAt.toISOString()}', '${userData.updatedAt.toISOString()}')
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

`;
    }

    // 2. Exporter les catégories
    console.log('📦 Export des catégories...');
    const categories = await prisma.category.findMany();

    sqlContent += `
-- Catégories
`;
    for (const category of categories) {
      sqlContent += `INSERT INTO categories (id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at, updated_at)
VALUES ('${category.id}', '${category.name.replace(/'/g, "''")}', '${category.slug}', '${category.description?.replace(/'/g, "''") || ''}', '${category.icon}', ${category.image ? `'${category.image}'` : 'NULL'}, ${category.isActive}, ${category.displayOrder || 0}, ${category.parentId ? `'${category.parentId}'` : 'NULL'}, '${(category.createdAt || new Date()).toISOString()}', '${(category.updatedAt || new Date()).toISOString()}')
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

`;
    }

    // 3. Exporter les profils prestataires
    console.log('📦 Export des profils prestataires...');
    const profiles = await prisma.providerProfile.findMany();

    sqlContent += `
-- Profils prestataires
`;
    for (const profile of profiles) {
      sqlContent += `INSERT INTO provider_profiles (id, user_id, business_name, specialty, bio, hourly_rate, years_experience, location, address, city, region, postal_code, service_radius, is_available, rating, total_reviews, total_bookings, is_verified, profile_image, availability, created_at, updated_at)
VALUES ('${profile.id}', '${profile.userId}', ${profile.businessName ? `'${profile.businessName.replace(/'/g, "''")}'` : 'NULL'}, ${profile.specialty ? `'${profile.specialty.replace(/'/g, "''")}'` : 'NULL'}, ${profile.bio ? `'${profile.bio.replace(/'/g, "''")}'` : 'NULL'}, ${profile.hourlyRate || 'NULL'}, ${profile.yearsExperience || 'NULL'}, ${profile.location ? `'${profile.location.replace(/'/g, "''")}'` : 'NULL'}, ${profile.address ? `'${profile.address.replace(/'/g, "''")}'` : 'NULL'}, ${profile.city ? `'${profile.city.replace(/'/g, "''")}'` : 'NULL'}, ${profile.region ? `'${profile.region.replace(/'/g, "''")}'` : 'NULL'}, ${profile.postalCode ? `'${profile.postalCode}'` : 'NULL'}, ${profile.serviceRadius || 'NULL'}, ${profile.isAvailable}, ${profile.rating || 0}, ${profile.totalReviews || 0}, ${profile.totalBookings || 0}, ${profile.isVerified}, ${profile.profileImage ? `'${profile.profileImage}'` : 'NULL'}, ${profile.availability ? `'${JSON.stringify(profile.availability).replace(/'/g, "''")}'` : 'NULL'}, '${(profile.createdAt || new Date()).toISOString()}', '${(profile.updatedAt || new Date()).toISOString()}')
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

`;
    }

    // 4. Exporter les services
    console.log('📦 Export des services...');
    const services = await prisma.service.findMany();

    sqlContent += `
-- Services
`;
    for (const service of services) {
      sqlContent += `INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
VALUES ('${service.id}', '${service.providerId}', ${service.categoryId ? `'${service.categoryId}'` : 'NULL'}, '${service.name.replace(/'/g, "''")}', ${service.description ? `'${service.description.replace(/'/g, "''")}'` : 'NULL'}, ${service.price || 'NULL'}, '${service.priceType}', ${service.duration}, ${service.isActive}, '${(service.createdAt || new Date()).toISOString()}', '${(service.updatedAt || new Date()).toISOString()}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  duration = EXCLUDED.duration,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

`;
    }

    // 5. Exporter les avis
    console.log('📦 Export des avis...');
    const reviews = await prisma.review.findMany();

    sqlContent += `
-- Avis
`;
    for (const review of reviews) {
      sqlContent += `INSERT INTO reviews (id, provider_id, client_id, booking_id, rating, comment, created_at, updated_at)
VALUES ('${review.id}', '${review.providerId}', '${review.clientId}', ${review.bookingId ? `'${review.bookingId}'` : 'NULL'}, ${review.rating}, ${review.comment ? `'${review.comment.replace(/'/g, "''")}'` : 'NULL'}, '${(review.createdAt || new Date()).toISOString()}', '${(review.updatedAt || new Date()).toISOString()}')
ON CONFLICT (id) DO NOTHING;

`;
    }

    // 6. Exporter les réservations
    console.log('📦 Export des réservations...');
    const bookings = await prisma.booking.findMany();

    sqlContent += `
-- Réservations
`;
    for (const booking of bookings) {
      sqlContent += `INSERT INTO bookings (id, client_id, provider_id, service_id, status, booking_date, duration, total_amount, notes, created_at, updated_at)
VALUES ('${booking.id}', '${booking.clientId}', '${booking.providerId}', '${booking.serviceId}', '${booking.status}', '${(booking.bookingDate || new Date()).toISOString()}', ${booking.duration}, ${booking.totalAmount?.toNumber() || 'NULL'}, ${booking.notes ? `'${booking.notes.replace(/'/g, "''")}'` : 'NULL'}, '${(booking.createdAt || new Date()).toISOString()}', '${(booking.updatedAt || new Date()).toISOString()}')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  booking_date = EXCLUDED.booking_date,
  duration = EXCLUDED.duration,
  total_amount = EXCLUDED.total_amount,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

`;
    }

    // Finaliser le fichier SQL
    sqlContent += `
-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- ===================================================================
-- Export terminé avec succès !
-- Fichier généré: kaayjob-export-${timestamp}.sql
-- ===================================================================

-- Statistiques:
-- Utilisateurs: ${users.length}
-- Catégories: ${categories.length}
-- Profils prestataires: ${profiles.length}
-- Services: ${services.length}
-- Avis: ${reviews.length}
-- Réservations: ${bookings.length}
`;

    // Écrire le fichier
    fs.writeFileSync(exportFile, sqlContent, 'utf8');

    console.log('✅ Export terminé avec succès !');
    console.log(`📁 Fichier créé: ${exportFile}`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Utilisateurs: ${users.length}`);
    console.log(`   - Catégories: ${categories.length}`);
    console.log(`   - Profils prestataires: ${profiles.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Avis: ${reviews.length}`);
    console.log(`   - Réservations: ${bookings.length}`);

    console.log(`\n📋 Instructions pour votre collaboratrice:`);
    console.log(`1. Copier le fichier ${path.basename(exportFile)}`);
    console.log(`2. L'exécuter dans sa base de données PostgreSQL:`);
    console.log(`   psql -U [username] -d [database] -f ${path.basename(exportFile)}`);
    console.log(`3. Ou utiliser Prisma Studio pour vérifier les données`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'export
exportDatabase();