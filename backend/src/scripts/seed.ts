/**
 * Script de seed pour initialiser les données de démonstration
 * À exécuter au démarrage de l'application pour avoir du contenu de test
 */

import { query } from '../config/database';

export async function seedDatabase() {
  try {
    console.log('🌱 Initialisation des données de démonstration...');

    // Créer des catégories de base
    const categories = [
      { name: 'Plomberie', slug: 'plomberie', description: 'Services de plomberie et réparation', icon: '🔧' },
      { name: 'Électricité', slug: 'electricite', description: 'Installation et réparation électrique', icon: '⚡' },
      { name: 'Menuiserie', slug: 'menuiserie', description: 'Travaux de bois et menuiserie', icon: '🔨' },
      { name: 'Peinture', slug: 'peinture', description: 'Peinture intérieure et extérieure', icon: '🎨' },
      { name: 'Jardinage', slug: 'jardinage', description: 'Entretien d\'espaces verts', icon: '🌿' },
      { name: 'Ménage', slug: 'menage', description: 'Services de nettoyage', icon: '🧽' },
      { name: 'Réparation', slug: 'reparation', description: 'Réparations diverses', icon: '🔧' },
      { name: 'Transport', slug: 'transport', description: 'Services de transport', icon: '🚚' }
    ];

    let categoriesCreated = 0;
    for (const category of categories) {
      const existing = await query('SELECT id FROM categories WHERE slug = $1', [category.slug]);
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO categories (id, name, slug, description, icon, is_active, created_at)
          VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW())
        `, [category.name, category.slug, category.description, category.icon]);
        categoriesCreated++;
      }
    }

    console.log(`✅ ${categoriesCreated} catégories créées`);

    // Créer des prestataires de test
    const providers = [
      {
        name: 'Ahmed Diallo',
        email: 'ahmed@example.com',
        specialty: 'Plomberie',
        phone: '+22177123456',
        address: 'Plateau, Dakar',
        lat: 14.6937,
        lng: -17.4441,
        bio: 'Expert en réparation de fuites et installations sanitaires'
      },
      {
        name: 'Fatou Sow',
        email: 'fatou@example.com',
        specialty: 'Électricité',
        phone: '+22177234567',
        address: 'Yoff, Dakar',
        lat: 14.7489,
        lng: -17.4667,
        bio: 'Spécialiste en installations électriques et dépannages'
      },
      {
        name: 'Moussa Ba',
        email: 'moussa@example.com',
        specialty: 'Menuiserie',
        phone: '+22177345678',
        address: 'Parcelles Assainies, Dakar',
        lat: 14.7558,
        lng: -17.4381,
        bio: 'Artisan menuisier spécialisé dans les meubles sur mesure'
      },
      {
        name: 'Amina Kane',
        email: 'amina@example.com',
        specialty: 'Peinture',
        phone: '+22177456789',
        address: 'Mermoz, Dakar',
        lat: 14.7067,
        lng: -17.4758,
        bio: 'Peintre professionnelle pour intérieur et extérieur'
      },
      {
        name: 'Ibrahima Diop',
        email: 'ibrahima@example.com',
        specialty: 'Jardinage',
        phone: '+22177567890',
        address: 'Ouakam, Dakar',
        lat: 14.7294,
        lng: -17.4667,
        bio: 'Expert en aménagement et entretien d\'espaces verts'
      },
      {
        name: 'Mariama Faye',
        email: 'mariama@example.com',
        specialty: 'Ménage',
        phone: '+22177678901',
        address: 'Liberté 6, Dakar',
        lat: 14.6778,
        lng: -17.4444,
        bio: 'Service de nettoyage professionnel et conciergerie'
      }
    ];

    let providersCreated = 0;
    for (const provider of providers) {
      const existing = await query('SELECT id FROM users WHERE email = $1', [provider.email]);
      if (existing.rows.length === 0) {
        const [firstName, lastName] = provider.name.split(' ');
        await query(`
          INSERT INTO users (
            id, email, password, first_name, last_name, phone, role,
            bio, specialization, address, latitude, longitude,
            is_verified, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, '$2b$10$testpassword', $2, $3, $4, 'PRESTATAIRE',
            $5, $6, $7, $8, $9, true, NOW(), NOW()
          )
        `, [
          provider.email,
          firstName,
          lastName,
          provider.phone,
          provider.bio,
          provider.specialty,
          provider.address,
          provider.lat,
          provider.lng
        ]);

        // Récupérer l'ID de l'utilisateur créé
        const userResult = await query('SELECT id FROM users WHERE email = $1', [provider.email]);
        const userId = userResult.rows[0].id;

        // Créer le profil prestataire
        await query(`
          INSERT INTO provider_profiles (
            id, user_id, hourly_rate, years_experience, is_available,
            created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()
          )
        `, [userId, Math.floor(Math.random() * 50) + 20, Math.floor(Math.random() * 15) + 2]);

        providersCreated++;
      }
    }

    console.log(`✅ ${providersCreated} prestataires créés`);

    // Créer un admin si aucun n'existe
    const adminCheck = await query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
    if (adminCheck.rows.length === 0) {
      await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at)
        VALUES (gen_random_uuid(), $1, '$2b$10$adminpassword', $2, $3, $4, 'ADMIN', true, NOW())
      `, ['admin@kaayjob.com', 'Admin', 'KaayJob', '+221000000000']);
      console.log('✅ Administrateur créé');
    }

    console.log('🎉 Base de données initialisée avec succès !');
    return { categoriesCreated, providersCreated };

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

// Exécuter le seed si appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}