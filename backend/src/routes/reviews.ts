/**
 * Routes des avis
 * Utilise le ReviewController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import ReviewController from "../controllers/reviewController";
import { authenticate } from "../middleware/auth";
import { createReviewValidation, updateReviewValidation } from "../validations";

const router = Router();

// GET /api/reviews - Liste des avis (admin)
router.get("/", authenticate, async (req: Request, res: Response) => {
  await ReviewController.getAll(req, res);
});

// GET /api/reviews/service/:serviceId - Avis d'un service
router.get("/service/:serviceId", async (req: Request, res: Response) => {
  await ReviewController.getByService(req, res);
});

// GET /api/reviews/provider/:providerId - Avis d'un prestataire
router.get("/provider/:providerId", async (req: Request, res: Response) => {
  await ReviewController.getByProvider(req, res);
});

// GET /api/reviews/booking/:bookingId - Avis d'une réservation
router.get("/booking/:bookingId", async (req: Request, res: Response) => {
  await ReviewController.getByBooking(req, res);
});

// POST /api/reviews - Créer un avis
router.post(
  "/",
  authenticate,
  createReviewValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ReviewController.create(req, res);
  },
);

// PUT /api/reviews/:id - Modifier son avis
router.put(
  "/:id",
  authenticate,
  updateReviewValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ReviewController.update(req, res);
  },
);

// DELETE /api/reviews/:id - Supprimer un avis
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await ReviewController.delete(req, res);
});

export default router;
