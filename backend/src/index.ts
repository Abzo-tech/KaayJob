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

import { testConnection } from "./config/database";
import { prisma } from "./config/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Allow frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  }),
);

// Servir les fichiers statiques (images) avec CORS
app.use("/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, express.static(path.join(__dirname, "../public/images")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);

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
