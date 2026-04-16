"use strict";
/**
 * Script de seed pour initialiser les données de démonstration
 * À exécuter au démarrage de l'application pour avoir du contenu de test
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const database_1 = require("../config/database");
const seed_subscriptions_1 = require("./seed-subscriptions");
async function seedDatabase() {
    try {
        console.log('🌱 Initialisation des données de démonstration...');
        // Créer des catégories de base (alignées avec le frontend)
        const categories = [
            { name: 'Plomberie', slug: 'plomberie', description: 'Installation, fuite, entretien et depannage a domicile.', image: '/images/plomberie.png', icon: '🔧' },
            { name: 'Menuiserie', slug: 'menuiserie', description: 'Fabrication, reparation et ajustements sur mesure.', image: '/images/menuiserie.png', icon: '🔨' },
            { name: 'Cuisine', slug: 'cuisine', description: 'Chefs et cuisiniers pour vos besoins du quotidien et evenements.', image: '/images/cuisine.png', icon: '👨‍🍳' },
            { name: 'Mecanique', slug: 'mecanique', description: 'Diagnostic, entretien et reparation de vehicules.', image: '/images/mecanique.png', icon: '🔧' },
            { name: 'Education', slug: 'education', description: 'Cours particuliers et accompagnement scolaire de proximite.', image: '/images/education.png', icon: '📚' },
            { name: 'Reparation', slug: 'reparation', description: 'Interventions rapides pour vos pannes et petits travaux.', image: '/images/reparation.png', icon: '🔧' }
        ];
        let categoriesCreated = 0;
        for (const category of categories) {
            const existing = await (0, database_1.query)('SELECT id FROM categories WHERE slug = $1', [category.slug]);
            if (existing.rows.length === 0) {
                await (0, database_1.query)(`
          INSERT INTO categories (id, name, slug, description, icon, image, is_active, created_at)
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW())
        `, [category.name, category.slug, category.description, category.icon, category.image]);
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
                specialty: 'Mecanique',
                phone: '+22177234567',
                address: 'Yoff, Dakar',
                lat: 14.7489,
                lng: -17.4667,
                bio: 'Spécialiste en mécanique et dépannages automobiles'
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
                specialty: 'Cuisine',
                phone: '+22177456789',
                address: 'Mermoz, Dakar',
                lat: 14.7067,
                lng: -17.4758,
                bio: 'Cheffe cuisinière pour événements et cuisine du quotidien'
            },
            {
                name: 'Ibrahima Diop',
                email: 'ibrahima@example.com',
                specialty: 'Education',
                phone: '+22177567890',
                address: 'Ouakam, Dakar',
                lat: 14.7294,
                lng: -17.4667,
                bio: 'Professeur particulier pour cours à domicile'
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
            const existing = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [provider.email]);
            if (existing.rows.length === 0) {
                const [firstName, lastName] = provider.name.split(' ');
                await (0, database_1.query)(`
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
                const userResult = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [provider.email]);
                const userId = userResult.rows[0].id;
                // Créer le profil prestataire avec coordonnées géographiques
                await (0, database_1.query)(`
          INSERT INTO provider_profiles (
            id, user_id, specialty, bio, location, latitude, longitude,
            hourly_rate, years_experience, is_available, rating, total_reviews,
            is_verified, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, true, 4.5, 10,
            true, NOW(), NOW()
          )
        `, [
                    userId,
                    provider.specialty,
                    provider.bio,
                    provider.address,
                    provider.lat,
                    provider.lng,
                    Math.floor(Math.random() * 50) + 20,
                    Math.floor(Math.random() * 15) + 2
                ]);
                providersCreated++;
            }
        }
        console.log(`✅ ${providersCreated} prestataires créés`);
        // Créer des services pour chaque prestataire (minimum 1 service actif requis)
        let servicesCreated = 0;
        for (const provider of providers) {
            const user = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [provider.email]);
            if (user.rows.length > 0) {
                const category = await (0, database_1.query)('SELECT id FROM categories WHERE name = $1', [provider.specialty]);
                if (category.rows.length > 0) {
                    await (0, database_1.query)(`
            INSERT INTO services (id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'HOURLY', 1, true, NOW(), NOW())
          `, [
                        user.rows[0].id,
                        category.rows[0].id,
                        `Service ${provider.specialty}`,
                        `Service professionnel de ${provider.specialty.toLowerCase()}`,
                        25
                    ]);
                    servicesCreated++;
                }
            }
        }
        console.log(`✅ ${servicesCreated} services créés`);
        // Initialiser les plans d'abonnement
        await (0, seed_subscriptions_1.seedSubscriptionPlans)();
        // Mettre à jour les coordonnées géographiques des prestataires
        const { updateProviderCoordinates } = await Promise.resolve().then(() => __importStar(require('./update-coordinates')));
        await updateProviderCoordinates();
        return { categoriesCreated, providersCreated };
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map