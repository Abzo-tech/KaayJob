/**
 * Routes des services
 * Utilise le ServiceController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import ServiceController from "../controllers/serviceController";
import { authenticate } from "../middleware/auth";
import {
  createServiceValidation,
  updateServiceValidation,
} from "../validations";

const router = Router();

// GET /api/services - Liste des services
router.get("/", async (req: Request, res: Response) => {
  await ServiceController.getAll(req, res);
});

// GET /api/services/:id
router.get("/:id", async (req: Request, res: Response) => {
  await ServiceController.getById(req, res);
});

// POST /api/services - Créer un service (prestataire)
router.post(
  "/",
  authenticate,
  createServiceValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await ServiceController.create(req, res);
  },
);

// PUT /api/services/:id - Mettre à jour un service
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  await ServiceController.update(req, res);
});

// DELETE /api/services/:id
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await ServiceController.delete(req, res);
});

// GET /api/services/provider/:providerId - Services d'un prestataire
router.get("/provider/:providerId", async (req: Request, res: Response) => {
  await ServiceController.getByProvider(req, res);
});

export default router;
