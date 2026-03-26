"use strict";
/**
 * Routes d'administration - Point d'entrée principal
 *
 * Ce fichier redirige vers la structure modulaire dans ./admin/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
// Import des sous-routes
const users_1 = __importDefault(require("./admin/users"));
const services_1 = __importDefault(require("./admin/services"));
const bookings_1 = __importDefault(require("./admin/bookings"));
const categories_1 = __importDefault(require("./admin/categories"));
const payments_1 = __importDefault(require("./admin/payments"));
const subscriptions_1 = __importDefault(require("./admin/subscriptions"));
const analytics_1 = __importDefault(require("./admin/analytics"));
const notifications_1 = __importDefault(require("./admin/notifications"));
const router = (0, express_1.Router)();
// Middleware global pour toutes les routes admin
router.use(auth_1.authenticate);
router.use(auth_1.requireAdmin);
// Route racine admin - Info
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API d'administration KaayJob",
        version: "2.0.0",
        endpoints: [
            "/stats",
            "/users",
            "/services",
            "/bookings",
            "/categories",
            "/payments",
            "/subscriptions",
            "/subscription-plans",
            "/analytics",
            "/notifications",
        ],
    });
});
// Route stats globale
router.get("/stats", async (req, res) => {
    try {
        const { query: dbQuery } = await Promise.resolve().then(() => __importStar(require("../config/database")));
        const usersResult = await dbQuery("SELECT COUNT(*) as total, role FROM users GROUP BY role");
        const bookingsResult = await dbQuery(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
             SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);
        const revenueResult = await dbQuery(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM bookings
      WHERE status = 'COMPLETED'
    `);
        const providersResult = await dbQuery(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified
      FROM provider_profiles
    `);
        res.json({
            success: true,
            data: {
                users: usersResult.rows,
                bookings: bookingsResult.rows[0],
                revenue: parseFloat(revenueResult.rows[0].total_revenue),
                providers: providersResult.rows[0],
            },
        });
    }
    catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// Montage des sous-routes
router.use("/users", users_1.default);
router.use("/services", services_1.default);
router.use("/bookings", bookings_1.default);
router.use("/categories", categories_1.default);
router.use("/payments", payments_1.default);
router.use("/subscriptions", subscriptions_1.default);
// router.use("/subscription-plans", subscriptionsRouter); // Désactivé - utiliser /subscriptions/plans
router.use("/analytics", analytics_1.default);
router.use("/notifications", notifications_1.default);
exports.default = router;
//# sourceMappingURL=admin.js.map