/**
 * Routes d'administration - Point d'entrée principal
 *
 * Ce fichier redirige vers la structure modulaire dans ./admin/
 */

import { Router } from "express";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

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
    const { query: dbQuery } = await import("../config/database");

    const usersResult = await dbQuery(
      "SELECT COUNT(*) as total, role FROM users GROUP BY role",
    );
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
