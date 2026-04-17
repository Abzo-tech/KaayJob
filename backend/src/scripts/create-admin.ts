/**
 * Script pour créer un administrateur
 * Usage: npx ts-node src/scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Création de l\'administrateur...');

    // Supprimer l'ancien admin s'il existe
    await prisma.user.deleteMany({
      where: { email: 'admin@kaayjob.com' }
    });

    // Créer le nouvel admin
    const hashedPassword = await bcrypt.hash('Password123', 10);
    console.log('Password hash created, starting with:', hashedPassword.substring(0, 10));

    const admin = await prisma.user.create({
      data: {
        email: 'admin@kaayjob.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'KaayJob',
        phone: '+221000000000',
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
      },
    });

    console.log('✅ Administrateur créé:', admin.email);
    console.log('📧 Email: admin@kaayjob.com');
    console.log('🔑 Mot de passe: Password123');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();