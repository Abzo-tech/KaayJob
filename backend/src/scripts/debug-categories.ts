/**
 * Debug script pour les catégories
 */
import { query } from '../config/database';

async function debugCategories() {
  try {
    console.log('🔍 Debug catégories...\n');

    // Test simple
    const allCategories = await query('SELECT id, name, slug, is_active FROM categories', []);
    console.log(`Toutes les catégories (${allCategories.rows.length}):`);
    allCategories.rows.forEach((cat: any) => console.log(`  - ${cat.name}: ${cat.is_active}`));

    // Test avec filtre actif
    const activeCategories = await query('SELECT id, name, slug, is_active FROM categories WHERE is_active = $1', [true]);
    console.log(`\nCatégories actives (${activeCategories.rows.length}):`);
    activeCategories.rows.forEach((cat: any) => console.log(`  - ${cat.name}: ${cat.is_active}`));

    // Test la requête exacte du contrôleur
    const controllerQuery = "SELECT id, name, slug, description, icon, image, is_active, created_at FROM categories WHERE 1=1 ORDER BY name ASC";
    const controllerResult = await query(controllerQuery, []);
    console.log(`\nRequête contrôleur (${controllerResult.rows.length}):`);
    controllerResult.rows.forEach((cat: any) => console.log(`  - ${cat.name}: ${cat.is_active}`));

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

debugCategories();