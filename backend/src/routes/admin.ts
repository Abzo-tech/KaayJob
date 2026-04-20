/**
 * Routes d'administration - Point d'entrée principal
 *
 * Ce fichier redirige vers la structure modulaire dans ./admin/
 */

import { Router } from "express";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";
import { prisma } from "../config/prisma";

// Import des sous-routes
import usersRouter from "./admin/users";
import servicesRouter from "./admin/services";
import bookingsRouter from "./admin/bookings";
import categoriesRouter from "./admin/categories";
import paymentsRouter from "./admin/payments";
import subscriptionsRouter from "./admin/subscriptions";
import analyticsRouter from "./admin/analytics";
import notificationsRouter from "./admin/notifications";

const router = Router();

// Middleware global pour toutes les routes admin
router.use(authenticate);
router.use(requireAdmin);

// Route racine admin - Info
router.get("/", (req: AuthRequest, res) => {
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
router.get("/stats", async (req: AuthRequest, res) => {
  try {
    const [
      clientUsers,
      providerUsers,
      adminUsers,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      completedRevenue,
      totalProviders,
      verifiedProviders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.user.count({ where: { role: "PRESTATAIRE" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalAmount: true },
      }),
      prisma.providerProfile.count(),
      prisma.providerProfile.count({ where: { isVerified: true } }),
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
  } catch (error) {
    console.error("Erreur statistiques:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Montage des sous-routes
router.use("/users", usersRouter);
router.use("/services", servicesRouter);
router.use("/bookings", bookingsRouter);
router.use("/categories", categoriesRouter);
router.use("/payments", paymentsRouter);
router.use("/subscriptions", subscriptionsRouter);
// router.use("/subscription-plans", subscriptionsRouter); // Désactivé - utiliser /subscriptions/plans
router.use("/analytics", analyticsRouter);
router.use("/notifications", notificationsRouter);

export default router;
