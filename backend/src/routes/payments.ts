/**
 * Routes de paiement
 */

import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { processSubscriptionPayment } from "../services/paymentService";
import { query } from "../config/database";

const router = Router();

// POST /api/payments/subscription - Traiter un paiement d'abonnement
router.post(
  "/subscription",
  authenticate,
  [
    body("amount").isNumeric().withMessage("Montant invalide"),
    body("paymentMethod").notEmpty().withMessage("Méthode de paiement requise"),
    body("planName").notEmpty().withMessage("Nom du plan requis"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = (req as any).user;
      const { amount, paymentMethod, planName } = req.body;

      // Traiter le paiement d'abonnement
      await processSubscriptionPayment(user.id, Number(amount), paymentMethod, planName);

      res.json({
        success: true,
        message: "Paiement d'abonnement traité avec succès",
      });
    } catch (error) {
      console.error("Erreur traitement paiement abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

export default router;