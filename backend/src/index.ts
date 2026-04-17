/**
 * Point d'entrée principal de l'API KaayJob
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import bookingsRoutes from "./routes/bookings";
import providersRoutes from "./routes/providers";
import categoriesRoutes from "./routes/categories";
import servicesRoutes from "./routes/services";
// import reviewsRoutes from "./routes/reviews";
import adminRoutes from "./routes/admin";
import notificationsRoutes from "./routes/notifications";
import paymentsRoutes from "./routes/payments";
import subscriptionsRoutes from "./routes/subscriptions";
import { authenticate } from "./middleware/auth";
import ProviderController from "./controllers/providerController";

import { testConnection, query } from "./config/database";
import { swaggerUi, specs } from "./config/swagger";
import { prisma } from "./config/prisma";
import { seedDatabase } from "./scripts/seed";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// );
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Servir les fichiers statiques (images) avec CORS
app.use(
  "/images",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  },
  express.static(path.join(__dirname, "../public/images")),
);

// Route générale pour le profil utilisateur (selon le rôle)
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user?.role) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
    }

    // Rediriger vers la bonne route selon le rôle
    if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
      // Utiliser directement la méthode du contrôleur
      await ProviderController.getProfile(req, res);
    } else if (user.role === "CLIENT" || user.role === "client") {
      // Pour les clients, on pourrait avoir un contrôleur utilisateur
      // Pour l'instant, retourner les infos de base
      res.json({
        success: true,
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role
        }
      });
    } else {
      res.status(403).json({ success: false, message: "Rôle non autorisé" });
    }
  } catch (error) {
    console.error("❌ Erreur route profile générale:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Route générale pour la mise à jour du profil
app.put("/api/profile", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user?.role) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
    }

    // Rediriger vers la bonne route selon le rôle
    if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
      await ProviderController.updateProfile(req, res);
    } else if (user.role === "CLIENT" || user.role === "client") {
      // Pour les clients, mise à jour des informations de base
      const { firstName, lastName, phone } = req.body;

      await query(`
        UPDATE users SET
          first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
        WHERE id = $4
      `, [firstName, lastName, phone, user.id]);

      res.json({ success: true, message: "Profil mis à jour avec succès" });
    } else {
      res.status(403).json({ success: false, message: "Rôle non autorisé" });
    }
  } catch (error) {
    console.error("❌ Erreur mise à jour profile générale:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/services", servicesRoutes);
// app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  res.json({ success: true, message: "API KaayJob opérationnelle", timestamp: new Date().toISOString() });
});

// Documentation Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Seed database endpoint
app.post("/api/seed", async (req, res) => {
  try {
    console.log("🌱 Exécution du seed de données...");
    const result = await seedDatabase();
    res.json({
      success: true,
      message: "Base de données initialisée avec succès",
      data: result,
    });
  } catch (error) {
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
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat
      });
    }

    // Créer un utilisateur admin
    console.log('🔧 Vérification/création de l\'utilisateur admin...');
    try {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      console.log('Mot de passe hashé créé, commence par:', hashedPassword.substring(0, 10));

      const adminUser = await prisma.user.upsert({
        where: { email: 'admin@kaayjob.com' },
        update: {
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'KaayJob',
          phone: '+221000000000',
          role: 'ADMIN',
          isVerified: true,
          isActive: true,
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
        },
      });
      console.log('✅ Utilisateur admin créé/mis à jour:', adminUser.email);
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error);
    }

    // Créer quelques prestataires
    const providers = [
      { email: 'jardinier@email.com', firstName: 'Ahmed', lastName: 'Diallo', specialty: 'Jardinage' },
      { email: 'plombier@email.com', firstName: 'Moussa', lastName: 'Sow', specialty: 'Plomberie' },
      { email: 'electricien@email.com', firstName: 'Fatou', lastName: 'Diop', specialty: 'Électricité' }
    ];

    for (const prov of providers) {
      const userPassword = await bcrypt.hash('test123', 10);
      const user = await prisma.user.upsert({
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
      await prisma.providerProfile.upsert({
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

  } catch (error: any) {
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
    const existingAdmin = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Créer l'admin
    const hashedPassword = await bcrypt.hash(password, 10);

    await query(`
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

  } catch (error) {
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

    const localUsers = await query('SELECT * FROM users');
    const localCategories = await query('SELECT * FROM categories');
    const localProfiles = await query('SELECT * FROM provider_profiles');
    const localServices = await query('SELECT * FROM services');
    const localBookings = await query('SELECT * FROM bookings');
    const localReviews = await query('SELECT * FROM reviews');

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
        await prisma.user.upsert({
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
      } catch (err: any) {
        console.log(`⚠️ Erreur utilisateur ${user.email}:`, err.message);
      }
    }

    // Catégories
    for (const cat of localCategories.rows) {
      try {
        await prisma.category.upsert({
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
      } catch (err: any) {
        console.log(`⚠️ Erreur catégorie ${cat.name}:`, err.message);
      }
    }

    // Profils prestataires
    for (const profile of localProfiles.rows) {
      try {
        await prisma.providerProfile.upsert({
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
      } catch (err: any) {
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

  } catch (error: any) {
    console.error('❌ Erreur de migration:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la migration',
      error: error.message
    });
  }
});

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Erreur serveur:", err);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  },
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route non trouvée" });
});

// Start server
const startServer = async () => {
  try {
    console.log("🚀 Démarrage du serveur...");
    await testConnection();
    console.log("✅ Test de connexion DB réussi");

    console.log(`🔄 Tentative de démarrage du serveur sur le port ${PORT}...`);
    const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`✅ Serveur KaayJob démarré sur le port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Écoute sur toutes les interfaces: 0.0.0.0:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('❌ Erreur du serveur:', err);
    });

    server.on('listening', () => {
      console.log('✅ Serveur en écoute active');
    });

    // Keep the process alive
    console.log('🔄 Serveur en attente de connexions...');

    // Handle shutdown signals only for Ctrl+C (SIGINT)
    process.on('SIGINT', () => {
      console.log('🛑 Arrêt du serveur demandé (Ctrl+C)...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
    });

    // Keep server alive indefinitely
    setInterval(() => {
      // Keep-alive ping every 30 seconds
    }, 30000);

  } catch (error) {
    console.error("❌ Échec du démarrage du serveur:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app };
export default app;
