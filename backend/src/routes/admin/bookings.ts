/**
 * Routes d'administration - Réservations
 * Utilise le service bookingService pour la logique métier
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../../middleware/auth";
import {
  listBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../../services/bookingService";

const router = Router();

// GET /api/admin/bookings - Liste des réservations
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, providerId, clientId } = req.query;

    const result = await listBookings({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      providerId: providerId as string,
      clientId: clientId as string,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erreur liste réservations:", error);
    res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// GET /api/admin/bookings/:id - Obtenir une réservation
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    res.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Erreur obtenir réservation:", error);
    res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// PUT /api/admin/bookings/:id - Mettre à jour une réservation
router.put(
  "/:id",
  [
    body("status")
      .optional()
      .isIn([
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "REJECTED",
      ])
      .withMessage(
        "Statut invalide: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED",
      ),
    body("paymentStatus")
      .optional()
      .isIn(["PENDING", "PAID", "REFUNDED"])
      .withMessage("Statut paiement invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const {
        status,
        paymentStatus,
        bookingDate,
        bookingTime,
        address,
        city,
        notes,
      } = req.body;

      const booking = await updateBooking(
        id,
        {
          status,
          paymentStatus,
          bookingDate,
          bookingTime,
          address,
          city,
          notes,
        },
        req.user?.id,
      );

      res.json({
        success: true,
        message: "Réservation mise à jour",
        data: booking,
      });
    } catch (error: any) {
      console.error("Erreur mise à jour réservation:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/bookings/:id - Supprimer une réservation
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteBooking(id);

    res.json({ success: true, message: "Réservation supprimée" });
  } catch (error: any) {
    console.error("Erreur suppression réservation:", error);
    res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

export default router;
