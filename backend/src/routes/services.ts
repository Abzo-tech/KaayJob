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
  (req: Request, res: Response, next: any) => {
    require('fs').appendFileSync('/tmp/debug.log', `MIDDLEWARE: POST /api/services called with method: ${req.method}\n`);
    next();
  },
  authenticate,
  createServiceValidation,
  async (req: Request, res: Response) => {
    try {
      require('fs').appendFileSync('/tmp/debug.log', `HANDLER: Route POST /api/services called\n`);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        require('fs').appendFileSync('/tmp/debug.log', `Validation errors: ${JSON.stringify(errors.array())}\n`);
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      require('fs').appendFileSync('/tmp/debug.log', `Calling ServiceController.create\n`);
      await ServiceController.create(req, res);
    } catch (error: any) {
      require('fs').appendFileSync('/tmp/debug.log', `Route error: ${error.message}\n`);
      res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
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
