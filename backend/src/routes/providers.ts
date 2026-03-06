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

export default router;
