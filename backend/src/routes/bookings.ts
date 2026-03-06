/**
 * Routes des réservations
 * Utilise le BookingController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import BookingController from "../controllers/bookingController";
import { authenticate } from "../middleware/auth";
import {
  createBookingValidation,
  updateBookingStatusValidation,
} from "../validations";

const router = Router();

// GET /api/bookings/me - Mes réservations
router.get("/me", authenticate, async (req: Request, res: Response) => {
  await BookingController.getMyBookings(req, res);
});

// GET /api/bookings - Liste des réservations (selon rôle)
router.get("/", authenticate, async (req: Request, res: Response) => {
  await BookingController.getAll(req, res);
});

// POST /api/bookings - Créer une réservation
router.post(
  "/",
  authenticate,
  createBookingValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await BookingController.create(req, res);
  },
);

// GET /api/bookings/:id
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  await BookingController.getById(req, res);
});

// PUT /api/bookings/:id/status - Mettre à jour le statut
router.put(
  "/:id/status",
  authenticate,
  updateBookingStatusValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await BookingController.updateStatus(req, res);
  },
);

// DELETE /api/bookings/:id - Annuler une réservation
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await BookingController.cancel(req, res);
});

export default router;
