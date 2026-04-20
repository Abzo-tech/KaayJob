/**
 * Routes administrateur - Regroupement de toutes les routes admin
 */

import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import usersRoutes from "./users";
import servicesRoutes from "./services";
import bookingsRoutes from "./bookings";
import categoriesRoutes from "./categories";
import paymentsRoutes from "./payments";
import analyticsRoutes from "./analytics";
import subscriptionsRoutes from "./subscriptions";
import notificationsRoutes from "./notifications";

const router = Router();

router.use(authenticate, requireAdmin);

// Monter toutes les routes admin
router.use("/users", usersRoutes);
router.use("/services", servicesRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
