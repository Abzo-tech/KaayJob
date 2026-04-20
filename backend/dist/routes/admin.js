"use strict";
/**
 * Routes d'administration - Point d'entrée principal
 *
 * Ce fichier redirige vers la structure modulaire dans ./admin/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../config/prisma");
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
        const [clientUsers, providerUsers, adminUsers, totalBookings, pendingBookings, completedBookings, cancelledBookings, completedRevenue, totalProviders, verifiedProviders,] = await Promise.all([
            prisma_1.prisma.user.count({ where: { role: "CLIENT" } }),
            prisma_1.prisma.user.count({ where: { role: "PRESTATAIRE" } }),
            prisma_1.prisma.user.count({ where: { role: "ADMIN" } }),
            prisma_1.prisma.booking.count(),
            prisma_1.prisma.booking.count({ where: { status: "PENDING" } }),
            prisma_1.prisma.booking.count({ where: { status: "COMPLETED" } }),
            prisma_1.prisma.booking.count({ where: { status: "CANCELLED" } }),
            prisma_1.prisma.booking.aggregate({
                where: { status: "COMPLETED" },
                _sum: { totalAmount: true },
            }),
            prisma_1.prisma.providerProfile.count(),
            prisma_1.prisma.providerProfile.count({ where: { isVerified: true } }),
        ]);
        res.json({
            success: true,
            data: {
                users: [
                    { role: "CLIENT", total: String(clientUsers) },
                    { role: "PRESTATAIRE", total: String(providerUsers) },
                    { role: "ADMIN", total: String(adminUsers) },
                ],
                bookings: {
                    total: String(totalBookings),
                    pending: String(pendingBookings),
                    completed: String(completedBookings),
                    cancelled: String(cancelledBookings),
                },
                revenue: Number(completedRevenue._sum.totalAmount?.toString() || 0),
                providers: {
                    total: String(totalProviders),
                    verified: String(verifiedProviders),
                },
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