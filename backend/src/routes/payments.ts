/**
 * Routes des paiements
 * Utilise le PaymentController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import PaymentController from "../controllers/paymentController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// GET /api/payments/me - Mes paiements
router.get("/me", async (req: Request, res: Response) => {
  await PaymentController.getMyPayments(req, res);
});

// GET /api/payments/:id - Détails d'un paiement d'abonnement
router.get("/:id", async (req: Request, res: Response) => {
  await PaymentController.getPaymentById(req, res);
});

// Routes admin seulement
router.use(requireAdmin);

// GET /api/payments - Tous les paiements (Admin)
router.get("/", async (req: Request, res: Response) => {
  await PaymentController.getAllPayments(req, res);
});

// PUT /api/payments/:id/status - Mettre à jour le statut d'un paiement (Admin)
router.put("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "status est requis"
    });
  }

  await PaymentController.updatePaymentStatus(req, res);
});

export default router;