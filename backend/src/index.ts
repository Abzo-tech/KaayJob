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

import authRoutes from "./routes/auth";
import bookingsRoutes from "./routes/bookings";
import providersRoutes from "./routes/providers";
import categoriesRoutes from "./routes/categories";
import servicesRoutes from "./routes/services";
import reviewsRoutes from "./routes/reviews";
import adminRoutes from "./routes/admin";
import notificationsRoutes from "./routes/notifications";
import paymentsRoutes from "./routes/payments";

import { testConnection, query } from "./config/database";
import { prisma } from "./config/prisma";
import { seedDatabase } from "./scripts/seed";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
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
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  },
  express.static(path.join(__dirname, "../public/images")),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/payments", paymentsRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    // Test de connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "API KaayJob en ligne",
      timestamp: new Date().toISOString(),
      database: "connectée",
    });
  } catch (error) {
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
    const bcrypt = require('bcrypt');
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
    await testConnection();

    // NE PAS seeder automatiquement - utiliser seulement la vraie base de données
    try {
      console.log("🔄 Vérification de connexion à la base de données...");
      const usersCount = await prisma.user.count();
      const categoriesCount = await prisma.category.count();
      console.log(`✅ Base de données connectée: ${usersCount} utilisateurs, ${categoriesCount} catégories`);
      console.log("🚫 Seed automatique désactivé - utilisation des données réelles uniquement");
    } catch (dbError) {
      console.log("⚠️ Erreur de connexion base de données:", dbError);
    }

    app.listen(PORT, () => {
      console.log(`✅ Serveur KaayJob démarré sur le port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Échec du démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

export default app;
