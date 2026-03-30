/**
 * Script de migration des données depuis le dossier backend
 */

const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

async function migrateData() {
  console.log('🚀 Démarrage de la migration des données...');

  // Connexion à la base locale
  const localClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'kaayjob',
    user: 'postgres',
    password: 'postgres'
  });

  // Connexion à Prisma Cloud
  const prisma = new PrismaClient();

  try {
    await localClient.connect();
    console.log('✅ Connecté à la base locale');

    console.log('📦 Récupération des données locales...');

    const users = await localClient.query('SELECT * FROM users');
    const categories = await localClient.query('SELECT * FROM categories');
    const profiles = await localClient.query('SELECT * FROM provider_profiles');
    const services = await localClient.query('SELECT * FROM services');

    console.log(`   Utilisateurs: ${users.rows.length}`);
    console.log(`   Catégories: ${categories.rows.length}`);
    console.log(`   Profils: ${profiles.rows.length}`);
    console.log(`   Services: ${services.rows.length}`);

    console.log('☁️ Migration vers Prisma Cloud...');

    // Catégories
    for (const cat of categories.rows) {
      try {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {
            name: cat.name,
            description: cat.description,
            icon: cat.icon,
            image: cat.image,
            is_active: cat.is_active,
            display_order: cat.display_order,
            parent_id: cat.parent_id,
          },
          create: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            image: cat.image,
            is_active: cat.is_active,
            display_order: cat.display_order,
            parent_id: cat.parent_id,
          }
        });
        console.log(`   ✅ Catégorie: ${cat.name}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur catégorie ${cat.name}:`, err.message);
      }
    }

    // Utilisateurs
    for (const user of users.rows) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            is_verified: user.is_verified,
            is_active: user.is_active,
            password: user.password,
          },
          create: {
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            is_verified: user.is_verified,
            is_active: user.is_active,
          }
        });
        console.log(`   ✅ Utilisateur: ${user.email}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur utilisateur ${user.email}:`, err.message);
      }
    }

    // Profils prestataires
    for (const profile of profiles.rows) {
      try {
        await prisma.providerProfile.upsert({
          where: { user_id: profile.user_id },
          update: {
            business_name: profile.business_name,
            specialty: profile.specialty,
            bio: profile.bio,
            hourly_rate: profile.hourly_rate,
            years_experience: profile.years_experience,
            location: profile.location,
            is_available: profile.is_available,
            rating: profile.rating,
            total_reviews: profile.total_reviews,
            total_bookings: profile.total_bookings,
            is_verified: profile.is_verified,
            profile_image: profile.profile_image,
          },
          create: {
            user_id: profile.user_id,
            business_name: profile.business_name,
            specialty: profile.specialty,
            bio: profile.bio,
            hourly_rate: profile.hourly_rate,
            years_experience: profile.years_experience,
            location: profile.location,
            is_available: profile.is_available,
            rating: profile.rating,
            total_reviews: profile.total_reviews,
            total_bookings: profile.total_bookings,
            is_verified: profile.is_verified,
            profile_image: profile.profile_image,
          }
        });
        console.log(`   ✅ Profil: ${profile.business_name || profile.user_id}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur profil ${profile.user_id}:`, err.message);
      }
    }

    // Services
    for (const service of services.rows) {
      try {
        await prisma.service.create({
          data: {
            provider_id: service.provider_id,
            category_id: service.category_id,
            name: service.name,
            description: service.description,
            price: service.price,
            price_type: service.price_type,
            duration: service.duration,
            is_active: service.is_active,
          }
        });
        console.log(`   ✅ Service: ${service.name}`);
      } catch (err) {
        console.log(`   ⚠️ Erreur service ${service.name}:`, err.message);
      }
    }

    console.log('✅ Migration terminée avec succès !');
    console.log('🎉 Vos données ont été migrées vers Prisma Cloud');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await localClient.end();
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateData();