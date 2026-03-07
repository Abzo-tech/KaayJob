"use strict";
/**
 * Point d'entrée principal de l'API KaayJob
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const providers_1 = __importDefault(require("./routes/providers"));
const categories_1 = __importDefault(require("./routes/categories"));
const services_1 = __importDefault(require("./routes/services"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const admin_1 = __importDefault(require("./routes/admin"));
const database_1 = require("./config/database");
const prisma_1 = require("./config/prisma");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS - Allow frontend
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    credentials: true,
}));
// Servir les fichiers statiques (images)
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../public/images")));
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/providers", providers_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/services", services_1.default);
app.use("/api/reviews", reviews_1.default);
app.use("/api/admin", admin_1.default);
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
        await (0, database_1.testConnection)();
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
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map