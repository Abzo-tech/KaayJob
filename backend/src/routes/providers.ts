/**
 * Routes pour les prestataires
 */

import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import ProviderController from "../controllers/providerController";

const router = Router();

// GET /api/providers/map - Prestataires avec coordonnées pour la carte (doit être avant /:id)
router.get("/map", async (req: Request, res: Response) => {
  await ProviderController.getProvidersForMap(req, res);
});

// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req: Request, res: Response) => {
  await ProviderController.getAll(req, res);
});

// GET /api/providers/:id - Détails d'un prestataire (doit être après les routes spécifiques)
router.get("/:id", async (req: Request, res: Response) => {
  await ProviderController.getById(req, res);
});

// TODO: Ajouter les autres routes quand le contrôleur sera complet

export default router;