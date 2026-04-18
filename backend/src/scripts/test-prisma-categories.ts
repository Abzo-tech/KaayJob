/**
 * Test Prisma categories
 */
import { prisma } from '../config/prisma';

async function testPrismaCategories() {
  try {
    console.log('🔍 Test Prisma catégories...\n');

    // Test simple
    const allCategories = await prisma.category.findMany();
    console.log(`Toutes les catégories (${allCategories.length}):`);
    allCategories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug}) - Active: ${cat.isActive}`));

    // Test avec filtre
    const activeCategories = await prisma.category.findMany({
      where: { isActive: true }
    });
    console.log(`\nCatégories actives (${activeCategories.length}):`);
    activeCategories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug}) - Active: ${cat.isActive}`));

  } catch (error) {
    console.error('❌ Erreur Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaCategories();