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
import { prisma } from "../config/prisma";

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
    body("plan").notEmpty().withMessage("Plan requis"),
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
      const {
        plan: planSlug,
        duration = 1,
        paymentMethod,
        phoneNumber,
      } = req.body;

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

      // Récupérer le plan depuis la base de données
      let planPrice = 0;
      let planDuration = 30;

      try {
        const planData = await prisma.subscriptionPlan.findUnique({
          where: { slug: planSlug },
        });
        if (planData) {
          planPrice = Number(planData.price);
          planDuration = planData.duration;
        }
      } catch (e) {
        // Fallback vers les plans par défaut
        const defaultPrices: { [key: string]: number } = {
          gratuit: 0,
          premium: 9900,
          pro: 24900,
        };
        planPrice = defaultPrices[planSlug] || 0;
      }

      // Déterminer le statut de l'abonnement
      // Pour les plans gratuits, activer directement
      // Pour les plans payants, exiger une confirmation de paiement
      let subscriptionStatus = "active";

      if (planPrice > 0) {
        // Dans un vrai système, vérifier ici le paiement auprès du provider
        // Pour l'instant, on simule que le paiement est réussi si la méthode est fournie
        if (!paymentMethod) {
          return res.status(400).json({
            success: false,
            message: "Méthode de paiement requise pour les abonnements payants",
          });
        }
        // Le paiement est considéré comme réussi (simulation)
        subscriptionStatus = "active";
      }

      // Calculer les dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + planDuration);

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
           SET plan = $1, status = $2, start_date = $3, end_date = $4
           WHERE id = $5 
           RETURNING *`,
          [
            planSlug,
            subscriptionStatus,
            startDate,
            endDate,
            existingSub.rows[0].id,
          ],
        );
      } else {
        // Créer un nouvel abonnement
        result = await query(
          `INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
           RETURNING *`,
          [userId, planSlug, subscriptionStatus, startDate, endDate],
        );
      }

      // Enregistrer le paiement si fourni
      if (planPrice > 0 && paymentMethod) {
        await query(
          `INSERT INTO payments (id, user_id, amount, payment_method, status, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'PAID', NOW())`,
          [userId, planPrice, paymentMethod],
        );
      }

      const message =
        planPrice > 0
          ? `Paiement réussi ! Abonnement ${planSlug.toUpperCase()} activé`
          : `Abonnement ${planSlug.toUpperCase()} activé avec succès`;

      res.status(201).json({
        success: true,
        message,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// Plans d'abonnement disponibles (fallback)
const subscriptionPlans = [
  {
    id: "1",
    slug: "gratuit",
    name: "Gratuit",
    description: "Plan gratuit avec fonctionnalités de base",
    price: 0,
    duration: 0,
    features: [
      "5 services maximum",
      "Visibilité standard",
      "Support par email",
    ],
    isActive: true,
  },
  {
    id: "2",
    slug: "premium",
    name: "Premium",
    description: "Plan premium avec plus de visibilité",
    price: 9900,
    duration: 30,
    features: [
      "Services illimités",
      "Badge VIP",
      "Visibilité prioritaire",
      "Support prioritaire",
      "Statistiques avancées",
    ],
    isActive: true,
  },
  {
    id: "3",
    slug: "pro",
    name: "Pro",
    description: "Plan professionnel avec toutes les fonctionnalités",
    price: 24900,
    duration: 30,
    features: [
      "Tout Premium",
      "Publication en premier",
      "Badge Pro",
      "Formation exclusive",
      "Gestion équipe",
    ],
    isActive: true,
  },
];

// GET /api/providers/subscription/plans - Liste des plans disponibles
router.get("/subscription/plans", async (req: Request, res: Response) => {
  try {
    // Essayer de récupérer les plans depuis la base de données
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (plans.length > 0) {
      // Transformer les données pour le format attendu
      const formattedPlans = plans.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        duration: p.duration,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
        isActive: p.isActive,
      }));

      return res.json({
        success: true,
        data: formattedPlans,
      });
    }

    // Fallback vers les plans par défaut
    res.json({
      success: true,
      data: subscriptionPlans,
    });
  } catch (error) {
    console.error("Erreur récupération plans:", error);
    res.json({
      success: true,
      data: subscriptionPlans,
    });
  }
});

// GET /api/providers/me/subscription/history - Historique des abonnements
router.get(
  "/me/subscription/history",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const history = await query(
        `SELECT s.*, sp.name as plan_name, sp.slug as plan_slug
         FROM subscriptions s
         LEFT JOIN subscription_plans sp ON s.plan = sp.slug
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC
         LIMIT 10`,
        [userId],
      );

      res.json({
        success: true,
        data: history.rows,
      });
    } catch (error) {
      console.error("Erreur historique:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// POST /api/providers/me/subscription/cancel - Annuler l'abonnement
router.post(
  "/me/subscription/cancel",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      // Mettre à jour le statut de l'abonnement
      const result = await query(
        `UPDATE subscriptions 
         SET status = 'cancelled', updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'
         RETURNING *`,
        [userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun abonnement actif à annuler",
        });
      }

      res.json({
        success: true,
        message: "Abonnement annulé avec succès",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur annulation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// GET /api/providers/me/payments - Historique des paiements
router.get(
  "/me/payments",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const payments = await query(
        `SELECT p.*, s.name as service_name
         FROM payments p
         LEFT JOIN bookings b ON p.booking_id = b.id
         LEFT JOIN services s ON b.service_id = s.id
         WHERE p.user_id = $1
         ORDER BY p.created_at DESC
         LIMIT 20`,
        [userId],
      );

      res.json({
        success: true,
        data: payments.rows,
      });
    } catch (error) {
      console.error("Erreur paiements:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

export default router;
