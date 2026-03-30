/**
 * Script de migration des données de la base locale vers Prisma Cloud
 */

import { PrismaClient } from '@prisma/client';
import { query } from '../src/config/database';

// Base locale (source)
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@127.0.0.1:5432/kaayjob?schema=public"
    }
  }
});

// Base Prisma Cloud (destination)
const cloudPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  console.log('🚀 Démarrage de la migration des données...');

  try {
    // 1. Migrer les utilisateurs
    console.log('📦 Migration des utilisateurs...');
    const users = await localPrisma.user.findMany();
    console.log(`   Trouvé ${users.length} utilisateurs`);

    for (const user of users) {
      await cloudPrisma.user.upsert({
        where: { email: user.email },
        update: {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          specialization: user.specialization,
          address: user.address,
          zone: user.zone,
          latitude: user.latitude,
          longitude: user.longitude,
          isVerified: user.isVerified,
          isActive: user.isActive,
          password: user.password, // Garder le même hash
        },
        create: {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          specialization: user.specialization,
          address: user.address,
          zone: user.zone,
          latitude: user.latitude,
          longitude: user.longitude,
          isVerified: user.isVerified,
          isActive: user.isActive,
        }
      });
    }

    // 2. Migrer les catégories
    console.log('📂 Migration des catégories...');
    const categories = await localPrisma.category.findMany();
    console.log(`   Trouvé ${categories.length} catégories`);

    for (const category of categories) {
      await cloudPrisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          icon: category.icon,
          image: category.image,
          isActive: category.isActive,
          displayOrder: category.displayOrder,
          parentId: category.parentId,
        },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          image: category.image,
          isActive: category.isActive,
          displayOrder: category.displayOrder,
          parentId: category.parentId,
        }
      });
    }

    // 3. Migrer les profils prestataires
    console.log('👨‍🔧 Migration des profils prestataires...');
    const profiles = await localPrisma.providerProfile.findMany();
    console.log(`   Trouvé ${profiles.length} profils prestataires`);

    for (const profile of profiles) {
      await cloudPrisma.providerProfile.upsert({
        where: { userId: profile.userId },
        update: {
          businessName: profile.businessName,
          specialty: profile.specialty,
          bio: profile.bio,
          hourlyRate: profile.hourlyRate,
          yearsExperience: profile.yearsExperience,
          location: profile.location,
          address: profile.address,
          city: profile.city,
          region: profile.region,
          postalCode: profile.postalCode,
          serviceRadius: profile.serviceRadius,
          isAvailable: profile.isAvailable,
          rating: profile.rating,
          totalReviews: profile.totalReviews,
          totalBookings: profile.totalBookings,
          isVerified: profile.isVerified,
          profileImage: profile.profileImage,
          specialties: profile.specialties,
          availability: profile.availability,
        },
        create: {
          userId: profile.userId,
          businessName: profile.businessName,
          specialty: profile.specialty,
          bio: profile.bio,
          hourlyRate: profile.hourlyRate,
          yearsExperience: profile.yearsExperience,
          location: profile.location,
          address: profile.address,
          city: profile.city,
          region: profile.region,
          postalCode: profile.postalCode,
          serviceRadius: profile.serviceRadius,
          isAvailable: profile.isAvailable,
          rating: profile.rating,
          totalReviews: profile.totalReviews,
          totalBookings: profile.totalBookings,
          isVerified: profile.isVerified,
          profileImage: profile.profileImage,
          specialties: profile.specialties,
          availability: profile.availability,
        }
      });
    }

    // 4. Migrer les services
    console.log('🛠️ Migration des services...');
    const services = await localPrisma.service.findMany();
    console.log(`   Trouvé ${services.length} services`);

    for (const service of services) {
      await cloudPrisma.service.create({
        data: {
          providerId: service.providerId,
          categoryId: service.categoryId,
          name: service.name,
          description: service.description,
          price: service.price,
          priceType: service.priceType,
          duration: service.duration,
          isActive: service.isActive,
        }
      });
    }

    // 5. Migrer les réservations
    console.log('📅 Migration des réservations...');
    const bookings = await localPrisma.booking.findMany();
    console.log(`   Trouvé ${bookings.length} réservations`);

    for (const booking of bookings) {
      await cloudPrisma.booking.create({
        data: {
          clientId: booking.clientId,
          serviceId: booking.serviceId,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          duration: booking.duration,
          status: booking.status,
          address: booking.address,
          city: booking.city,
          phone: booking.phone,
          notes: booking.notes,
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus,
        }
      });
    }

    // 6. Migrer les avis
    console.log('⭐ Migration des avis...');
    const reviews = await localPrisma.review.findMany();
    console.log(`   Trouvé ${reviews.length} avis`);

    for (const review of reviews) {
      await cloudPrisma.review.create({
        data: {
          bookingId: review.bookingId,
          clientId: review.clientId,
          providerId: review.providerId,
          serviceId: review.serviceId,
          rating: review.rating,
          comment: review.comment,
          isVerified: review.isVerified,
        }
      });
    }

    console.log('✅ Migration terminée avec succès !');
    console.log('🎉 Toutes vos données ont été migrées vers Prisma Cloud');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await localPrisma.$disconnect();
    await cloudPrisma.$disconnect();
  }
}

// Exécuter la migration
migrateData();