/**
 * Routes pour les prestataires
 */

import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import ProviderController from "../controllers/providerController";

const router = Router();

// Routes publiques (pas d'authentification)
// GET /api/providers/map - Prestataires avec coordonnées pour la carte
router.get("/map", async (req: Request, res: Response) => {
  await ProviderController.getProvidersForMap(req, res);
});

// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req: Request, res: Response) => {
  await ProviderController.getAll(req, res);
});

// GET /api/providers/:id - Détails d'un prestataire (public, doit être après les routes spécifiques)
router.get("/:id", async (req: Request, res: Response) => {
  await ProviderController.getById(req, res);
});

// Routes nécessitant une authentification (pour la gestion du profil)
router.use(authenticate);

// GET /api/providers/me - Profil du prestataire connecté (alias pour /profile)
router.get("/me", async (req: Request, res: Response) => {
  await ProviderController.getProfile(req, res);
});

// GET /api/providers/profile - Profil du prestataire connecté
router.get("/profile", async (req: Request, res: Response) => {
  await ProviderController.getProfile(req, res);
});

// PUT /api/providers/profile - Mettre à jour le profil prestataire
router.put("/profile", async (req: Request, res: Response) => {
  await ProviderController.updateProfile(req, res);
});

// PUT /api/providers/profile/location - Mettre à jour la localisation
router.put("/profile/location", async (req: Request, res: Response) => {
  await ProviderController.updateLocation(req, res);
});

// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put("/profile/availability", async (req: Request, res: Response) => {
  await ProviderController.updateAvailability(req, res);
});

// PUT /api/providers/profile/verification - Demander vérification
router.put("/profile/verification", async (req: Request, res: Response) => {
  await ProviderController.requestVerification(req, res);
});

export default router;
