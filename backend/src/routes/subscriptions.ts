/**
 * Routes des abonnements
 * Utilise le SubscriptionController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import SubscriptionController from "../controllers/subscriptionController";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/subscriptions/plans - Plans d'abonnement disponibles (public)
router.get("/plans", async (req: Request, res: Response) => {
  await SubscriptionController.getPlans(req, res);
});

// GET /api/subscriptions/plans/:id - Détails d'un plan
router.get("/plans/:id", async (req: Request, res: Response) => {
  await SubscriptionController.getPlanById(req, res);
});

// Routes nécessitant authentification
router.use(authenticate);

// GET /api/subscriptions/me - Mes abonnements
router.get("/me", async (req: Request, res: Response) => {
  await SubscriptionController.getMySubscriptions(req, res);
});

// GET /api/subscriptions/active - Mon abonnement actif
router.get("/active", async (req: Request, res: Response) => {
  await SubscriptionController.getMyActiveSubscription(req, res);
});

// POST /api/subscriptions - Souscrire à un plan
router.post("/", async (req: Request, res: Response) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({
      success: false,
      message: "planId est requis"
    });
  }

  await SubscriptionController.subscribe(req, res);
});

// DELETE /api/subscriptions/:id - Annuler un abonnement
router.delete("/:id", async (req: Request, res: Response) => {
  await SubscriptionController.cancelSubscription(req, res);
});

export default router;