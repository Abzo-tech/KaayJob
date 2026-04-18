/**
 * Script pour vérifier les données dans Neon
 */
import { query } from '../config/database';

async function checkNeonData() {
  try {
    console.log('🔍 Vérification des données dans Neon...\n');

    // Vérifier les catégories
    const categories = await query('SELECT id, name, slug, is_active FROM categories', []);
    console.log(`📂 Catégories (${categories.rows.length}):`);
    categories.rows.forEach((cat: any) => console.log(`  - ${cat.name} (${cat.slug}) - Active: ${cat.is_active}`));

    // Vérifier les utilisateurs
    const users = await query('SELECT id, email, role, is_active FROM users', []);
    console.log(`\n👥 Utilisateurs (${users.rows.length}):`);
    users.rows.forEach((user: any) => console.log(`  - ${user.email} (${user.role}) - Active: ${user.is_active}`));

    // Vérifier les services
    const services = await query('SELECT id, name FROM services', []);
    console.log(`\n🔧 Services (${services.rows.length}):`);
    services.rows.forEach((service: any) => console.log(`  - ${service.name}`));

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkNeonData();