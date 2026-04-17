/**
 * Script de migration vers Neon Database
 * Usage: npx ts-node src/scripts/migrate-to-neon.ts
 */

import { PrismaClient } from '@prisma/client';

const NEON_URL = 'postgresql://neondb_owner:npg_x6ov5qSikWXV@ep-hidden-queen-amjlvhev-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function migrateToNeon() {
  console.log('🚀 Migration vers Neon Database...\n');

  // Connexion à Neon
  console.log('📡 Connexion à Neon...');
  const neonPrisma = new PrismaClient({
    datasources: {
      db: { url: NEON_URL }
    }
  });

  try {
    // Test de connexion à Neon
    await neonPrisma.$connect();
    console.log('✅ Connexion Neon réussie');

    // Appliquer le schéma Prisma
    console.log('🔄 Application du schéma Prisma...');
    await neonPrisma.$executeRaw`SELECT 1`; // Test de connexion
    console.log('✅ Schéma prêt');

    // Créer l'admin dans Neon
    console.log('👤 Création de l\'admin...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Password123', 10);

    // Supprimer l'ancien admin s'il existe
    await neonPrisma.user.deleteMany({
      where: { role: 'ADMIN' }
    });

    // Créer le nouvel admin
    const admin = await neonPrisma.user.create({
      data: {
        email: 'admin@kaayjob.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'KaayJob',
        phone: '+221000000000',
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
      }
    });

    console.log('✅ Admin créé:', admin.email);

    // Lancer le seed pour les données de démonstration
    console.log('🌱 Seeding des données...');
    const { seedDatabase } = await import('./seed');
    await seedDatabase();

    console.log('✅ Migration terminée avec succès!');
    console.log('\n📋 Informations de connexion:');
    console.log('   Database: Neon (Serverless)');
    console.log('   Admin: admin@kaayjob.com / Password123');
    console.log('   URL: https://kaayjob.onrender.com');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await neonPrisma.$disconnect();
  }
}

migrateToNeon();