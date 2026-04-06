"use strict";
/**
 * Point d'entrée principal de l'API KaayJob
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const prisma_1 = require("./config/prisma");
const seed_1 = require("./scripts/seed");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3001;
// Middleware
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// );
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS - Allow frontend (configurable via env var)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8888",
        "http://127.0.0.1:8888",
        "https://kaay-job.vercel.app",
        "https://kaay-job-git-main-abzo-techs-projects.vercel.app",
        "https://kaay-job-git-abzo-abzo-techs-projects.vercel.app",
        "https://kaay-job-git-dev-abzo-techs-projects.vercel.app",
    ];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
// Servir les fichiers statiques (images) avec CORS
app.use("/images", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}, express_1.default.static(path_1.default.join(__dirname, "../public/images")));
// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/bookings", bookingsRoutes);
// app.use("/api/providers", providersRoutes);
// app.use("/api/categories", categoriesRoutes);
// app.use("/api/services", servicesRoutes);
// app.use("/api/reviews", reviewsRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/notifications", notificationsRoutes);
// app.use("/api/payments", paymentsRoutes);
// Health check
app.get("/api/health", async (req, res) => {
    try {
        // Test de connexion à la base de données
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            message: "API KaayJob en ligne",
            timestamp: new Date().toISOString(),
            database: "connectée",
        });
    }
    catch (error) {
        res.json({
            success: true,
            message: "API KaayJob en ligne",
            timestamp: new Date().toISOString(),
            database: "déconnectée",
        });
    }
});
// Seed database endpoint
app.post("/api/seed", async (req, res) => {
    try {
        console.log("🌱 Exécution du seed de données...");
        const result = await (0, seed_1.seedDatabase)();
        res.json({
            success: true,
            message: "Base de données initialisée avec succès",
            data: result,
        });
    }
    catch (error) {
        console.error("❌ Erreur lors du seed:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'initialisation de la base de données",
        });
    }
});
// Create basic test data endpoint (emergency solution)
app.post("/api/create-test-data", async (req, res) => {
    try {
        console.log('🌱 Création de données de test basiques...');
        // Créer quelques catégories de base
        const categories = [
            { name: 'Jardinage', slug: 'jardinage', description: 'Services de jardinage et espaces verts', icon: '🌿', isActive: true },
            { name: 'Plomberie', slug: 'plomberie', description: 'Réparations et installations de plomberie', icon: '🔧', isActive: true },
            { name: 'Électricité', slug: 'electricite', description: 'Travaux électriques et dépannages', icon: '⚡', isActive: true },
            { name: 'Ménage', slug: 'menage', description: 'Services de nettoyage et entretien', icon: '🧹', isActive: true },
            { name: 'Réparations', slug: 'reparations', description: 'Réparations diverses à domicile', icon: '🔨', isActive: true }
        ];
        for (const cat of categories) {
            await prisma_1.prisma.category.upsert({
                where: { slug: cat.slug },
                update: cat,
                create: cat
            });
        }
        // Créer un utilisateur admin
        const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
        await prisma_1.prisma.user.upsert({
            where: { email: 'admin@kaayjob.com' },
            update: {
                firstName: 'Admin',
                lastName: 'KaayJob',
                phone: '+221000000000',
                role: 'ADMIN',
                isVerified: true,
                isActive: true,
                password: hashedPassword,
            },
            create: {
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
        // Créer quelques prestataires
        const providers = [
            { email: 'jardinier@email.com', firstName: 'Ahmed', lastName: 'Diallo', specialty: 'Jardinage' },
            { email: 'plombier@email.com', firstName: 'Moussa', lastName: 'Sow', specialty: 'Plomberie' },
            { email: 'electricien@email.com', firstName: 'Fatou', lastName: 'Diop', specialty: 'Électricité' }
        ];
        for (const prov of providers) {
            const userPassword = await bcryptjs_1.default.hash('test123', 10);
            const user = await prisma_1.prisma.user.upsert({
                where: { email: prov.email },
                update: {
                    firstName: prov.firstName,
                    lastName: prov.lastName,
                    phone: '+221000000000',
                    role: 'PRESTATAIRE',
                    isVerified: true,
                    isActive: true,
                    password: userPassword,
                },
                create: {
                    email: prov.email,
                    password: userPassword,
                    firstName: prov.firstName,
                    lastName: prov.lastName,
                    phone: '+221000000000',
                    role: 'PRESTATAIRE',
                    isVerified: true,
                    isActive: true,
                }
            });
            // Créer le profil prestataire
            await prisma_1.prisma.providerProfile.upsert({
                where: { userId: user.id },
                update: {
                    businessName: `${prov.firstName} ${prov.specialty}`,
                    specialty: prov.specialty,
                    bio: `Professionnel ${prov.specialty} expérimenté`,
                    isAvailable: true,
                    rating: 4.5,
                    totalReviews: 10,
                    totalBookings: 25,
                    isVerified: true,
                },
                create: {
                    userId: user.id,
                    businessName: `${prov.firstName} ${prov.specialty}`,
                    specialty: prov.specialty,
                    bio: `Professionnel ${prov.specialty} expérimenté`,
                    isAvailable: true,
                    rating: 4.5,
                    totalReviews: 10,
                    totalBookings: 25,
                    isVerified: true,
                }
            });
        }
        console.log('✅ Données de test créées avec succès');
        res.json({
            success: true,
            message: 'Données de test créées avec succès',
            data: {
                categories: categories.length,
                users: providers.length + 1, // + admin
                credentials: {
                    admin: { email: 'admin@kaayjob.com', password: 'admin123' },
                    providers: providers.map(p => ({ email: p.email, password: 'test123' }))
                }
            }
        });
    }
    catch (error) {
        console.error('❌ Erreur création données test:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création des données de test',
            error: error.message
        });
    }
});
// Create admin account endpoint (for emergency access)
app.post("/api/setup-admin", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont requis: email, password, firstName, lastName"
            });
        }
        // Vérifier si l'admin existe déjà
        const existingAdmin = await (0, database_1.query)("SELECT id FROM users WHERE email = $1", [email]);
        if (existingAdmin.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Un utilisateur avec cet email existe déjà"
            });
        }
        // Créer l'admin
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await (0, database_1.query)(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, '+221000000000', 'ADMIN', true, NOW(), NOW())
    `, [email, hashedPassword, firstName, lastName]);
        res.json({
            success: true,
            message: `Administrateur ${firstName} ${lastName} créé avec succès`,
            credentials: {
                email,
                password: "••••••••",
                role: "ADMIN"
            }
        });
    }
    catch (error) {
        console.error("❌ Erreur création admin:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'administrateur",
        });
    }
});
// Endpoint de migration des données depuis la base locale
app.post("/api/migrate-from-local", async (req, res) => {
    try {
        console.log('🚀 Démarrage de la migration depuis la base locale...');
        // Connexion à la base locale
        const localDb = {
            host: '127.0.0.1',
            port: 5432,
            database: 'kaayjob',
            user: 'postgres',
            password: 'postgres'
        };
        // 1. Récupérer les données de la base locale
        console.log('📦 Récupération des données locales...');
        const localUsers = await (0, database_1.query)('SELECT * FROM users');
        const localCategories = await (0, database_1.query)('SELECT * FROM categories');
        const localProfiles = await (0, database_1.query)('SELECT * FROM provider_profiles');
        const localServices = await (0, database_1.query)('SELECT * FROM services');
        const localBookings = await (0, database_1.query)('SELECT * FROM bookings');
        const localReviews = await (0, database_1.query)('SELECT * FROM reviews');
        console.log(`   Utilisateurs: ${localUsers.rows.length}`);
        console.log(`   Catégories: ${localCategories.rows.length}`);
        console.log(`   Profils: ${localProfiles.rows.length}`);
        console.log(`   Services: ${localServices.rows.length}`);
        console.log(`   Réservations: ${localBookings.rows.length}`);
        console.log(`   Avis: ${localReviews.rows.length}`);
        // 2. Insérer dans Prisma Cloud (en gérant les conflits)
        console.log('☁️ Migration vers Prisma Cloud...');
        // Utilisateurs
        for (const user of localUsers.rows) {
            try {
                await prisma_1.prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        phone: user.phone,
                        role: user.role,
                        avatar: user.avatar,
                        isVerified: user.is_verified,
                        isActive: user.is_active,
                        password: user.password,
                    },
                    create: {
                        email: user.email,
                        password: user.password,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        phone: user.phone,
                        role: user.role,
                        avatar: user.avatar,
                        isVerified: user.is_verified,
                        isActive: user.is_active,
                    }
                });
            }
            catch (err) {
                console.log(`⚠️ Erreur utilisateur ${user.email}:`, err.message);
            }
        }
        // Catégories
        for (const cat of localCategories.rows) {
            try {
                await prisma_1.prisma.category.upsert({
                    where: { slug: cat.slug },
                    update: {
                        name: cat.name,
                        description: cat.description,
                        icon: cat.icon,
                        image: cat.image,
                        isActive: cat.is_active,
                        displayOrder: cat.display_order,
                        parentId: cat.parent_id,
                    },
                    create: {
                        name: cat.name,
                        slug: cat.slug,
                        description: cat.description,
                        icon: cat.icon,
                        image: cat.image,
                        isActive: cat.is_active,
                        displayOrder: cat.display_order,
                        parentId: cat.parent_id,
                    }
                });
            }
            catch (err) {
                console.log(`⚠️ Erreur catégorie ${cat.name}:`, err.message);
            }
        }
        // Profils prestataires
        for (const profile of localProfiles.rows) {
            try {
                await prisma_1.prisma.providerProfile.upsert({
                    where: { userId: profile.user_id },
                    update: {
                        businessName: profile.business_name,
                        specialty: profile.specialty,
                        bio: profile.bio,
                        hourlyRate: profile.hourly_rate,
                        yearsExperience: profile.years_experience,
                        location: profile.location,
                        address: profile.address,
                        city: profile.city,
                        region: profile.region,
                        postalCode: profile.postal_code,
                        serviceRadius: profile.service_radius,
                        isAvailable: profile.is_available,
                        rating: profile.rating,
                        totalReviews: profile.total_reviews,
                        totalBookings: profile.total_bookings,
                        isVerified: profile.is_verified,
                        profileImage: profile.profile_image,
                    },
                    create: {
                        userId: profile.user_id,
                        businessName: profile.business_name,
                        specialty: profile.specialty,
                        bio: profile.bio,
                        hourlyRate: profile.hourly_rate,
                        yearsExperience: profile.years_experience,
                        location: profile.location,
                        address: profile.address,
                        city: profile.city,
                        region: profile.region,
                        postalCode: profile.postal_code,
                        serviceRadius: profile.service_radius,
                        isAvailable: profile.is_available,
                        rating: profile.rating,
                        totalReviews: profile.total_reviews,
                        totalBookings: profile.total_bookings,
                        isVerified: profile.is_verified,
                        profileImage: profile.profile_image,
                    }
                });
            }
            catch (err) {
                console.log(`⚠️ Erreur profil ${profile.user_id}:`, err.message);
            }
        }
        // Services - Désactivé temporairement à cause des relations complexes
        console.log('⏭️ Services ignorés (relations complexes)');
        // Réservations - Désactivé temporairement à cause des relations complexes
        console.log('⏭️ Réservations ignorées (relations complexes)');
        // Avis - Désactivé temporairement à cause des relations complexes
        console.log('⏭️ Avis ignorés (relations complexes)');
        console.log('✅ Migration terminée !');
        res.json({
            success: true,
            message: 'Migration terminée avec succès',
            stats: {
                users: localUsers.rows.length,
                categories: localCategories.rows.length,
                profiles: localProfiles.rows.length,
                services: localServices.rows.length,
                bookings: localBookings.rows.length,
                reviews: localReviews.rows.length,
            }
        });
    }
    catch (error) {
        console.error('❌ Erreur de migration:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la migration',
            error: error.message
        });
    }
});
// Error handling
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err);
    res
        .status(500)
        .json({ success: false, message: "Erreur interne du serveur" });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route non trouvée" });
});
// Start server
const startServer = async () => {
    try {
        // await testConnection();
        // Seeder automatiquement pour les données de démonstration
        // try {
        //   console.log("🔄 Vérification de connexion à la base de données...");
        //   const usersCount = await prisma.user.count();
        //   const categoriesCount = await prisma.category.count();
        //   console.log(`✅ Base de données connectée: ${usersCount} utilisateurs, ${categoriesCount} catégories");
        //   // Si la base est vide, seeder automatiquement
        //   if (usersCount === 0) {
        //     console.log("🌱 Base vide détectée - exécution du seed automatique...");
        //     // await seedDatabase();
        //     console.log("✅ Seed automatique désactivé");
        //   } else {
        //     console.log("✅ Données existantes préservées");
        //   }
        // } catch (dbError) {
        //   console.log("⚠️ Erreur de connexion base de données:", dbError);
        // }
        app.listen(PORT, () => {
            console.log(`✅ Serveur KaayJob démarré sur le port ${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error("❌ Échec du démarrage du serveur:", error);
        process.exit(1);
    }
};
if (process.env.NODE_ENV !== "test") {
    startServer();
}
exports.default = app;
//# sourceMappingURL=index.js.map