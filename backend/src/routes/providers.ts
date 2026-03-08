/**
 * Routes des prestataires
 * Utilise le ProviderController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import ProviderController from "../controllers/providerController";
import { authenticate } from "../middleware/auth";
import { updateProviderProfileValidation } from "../validations";
import { query } from "../config/database";

const router = Router();

// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req: Request, res: Response) => {
  await ProviderController.getAll(req, res);
});

// GET /api/providers/categories - Catégories disponibles
router.get("/categories", async (req: Request, res: Response) => {
  await ProviderController.getCategories(req, res);
});

// GET /api/providers/:id - Profil d'un prestataire
router.get("/:id", async (req: Request, res: Response) => {
  await ProviderController.getById(req, res);
});

// GET /api/providers/:id/services - Services d'un prestataire
router.get("/:id/services", async (req: Request, res: Response) => {
  await ProviderController.getServices(req, res);
});

// GET /api/providers/:id/reviews - Avis d'un prestataire
router.get("/:id/reviews", async (req: Request, res: Response) => {
  await ProviderController.getReviews(req, res);
});

// PUT /api/providers/profile - Mettre à jour son profil (prestataire uniquement)
router.put(
  "/profile",
  authenticate,
  updateProviderProfileValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ProviderController.updateProfile(req, res);
  },
);

// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put(
  "/profile/availability",
  authenticate,
  [body("availability").isObject().withMessage("Disponibilité invalide")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ProviderController.updateAvailability(req, res);
  },
);

// PUT /api/providers/profile/verification - Demander la vérification
router.post(
  "/profile/verification",
  authenticate,
  [body("documents").isArray().withMessage("Documents requis")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ProviderController.requestVerification(req, res);
  },
);

// GET /api/providers/me/dashboard - Tableau de bord prestataire
router.get(
  "/me/dashboard",
  authenticate,
  async (req: Request, res: Response) => {
    await ProviderController.getDashboard(req, res);
  },
);

// GET /api/providers/me/stats - Statistiques prestataire
router.get("/me/stats", authenticate, async (req: Request, res: Response) => {
  await ProviderController.getStats(req, res);
});

// GET /api/providers/me/subscription - Abonnement actuel du prestataire
router.get(
  "/me/subscription",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      // Récupérer l'abonnement actuel
      const result = await query(
        `SELECT s.*, u.email, u.first_name, u.last_name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`,
        [userId],
      );

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: null,
          message: "Aucun abonnement actif",
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// POST /api/providers/me/subscription/subscribe - Souscrire à un abonnement
router.post(
  "/me/subscription/subscribe",
  authenticate,
  [
    body("plan")
      .notEmpty()
      .withMessage("Plan requis")
      .isIn(["gratuit", "premium", "pro"])
      .withMessage("Plan invalide: gratuit, premium ou pro"),
    body("duration")
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage("Durée invalide (1-12 mois)"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = (req as any).user.id;
      const { plan, duration = 1 } = req.body;

      // Vérifier si l'utilisateur est un prestataire
      const userResult = await query(
        "SELECT id, role FROM users WHERE id = $1",
        [userId],
      );

      if (userResult.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      if (userResult.rows[0].role !== "PRESTATAIRE") {
        return res.status(403).json({
          success: false,
          message: "Seuls les prestataires peuvent s'abonner",
        });
      }

      // Calculer les dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + Number(duration));

      // Vérifier si un abonnement existe déjà
      const existingSub = await query(
        "SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      let result;
      if (existingSub.rows.length > 0) {
        // Mettre à jour l'abonnement existant
        result = await query(
          `UPDATE subscriptions 
           SET plan = $1, status = 'active', start_date = $2, end_date = $3
           WHERE id = $4 
           RETURNING *`,
          [plan, startDate, endDate, existingSub.rows[0].id],
        );
      } else {
        // Créer un nouvel abonnement
        result = await query(
          `INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'active', $3, $4, NOW())
           RETURNING *`,
          [userId, plan, startDate, endDate],
        );
      }

      res.status(201).json({
        success: true,
        message: `Abonnement ${plan.toUpperCase()} activé avec succès`,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// Plans d'abonnement disponibles
const subscriptionPlans = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: 0,
    duration: "Indéfinie",
    features: [
      "5 services maximum",
      "Visibilité standard",
      "Support par email",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 9900,
    duration: "1 mois",
    features: [
      "Services illimités",
      "Badge VIP",
      "Visibilité prioritaire",
      "Support prioritaire",
      "Statistiques avancées",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 24900,
    duration: "1 mois",
    features: [
      "Tout Premium",
      "Publication en premier",
      "Badge Pro",
      "Formation exclusive",
      "Gestion équipe",
    ],
  },
];

// GET /api/providers/subscription/plans - Liste des plans disponibles
router.get("/subscription/plans", async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: subscriptionPlans,
  });
});

export default router;
