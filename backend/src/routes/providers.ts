/**
 * Routes pour les prestataires
 */

import { Router, Request, Response } from "express";
import ProviderController from "../controllers/providerController";

const router = Router();

// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req: Request, res: Response) => {
  await ProviderController.getAll(req, res);
});

// TODO: Ajouter les autres routes quand le contrôleur sera complet

export default router;