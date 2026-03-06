/**
 * Routes des catégories
 * Utilise le CategoryController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import CategoryController from "../controllers/categoryController";
import { authenticate } from "../middleware/auth";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../validations";

const router = Router();

// GET /api/categories - Liste des catégories (public)
router.get("/", async (req: Request, res: Response) => {
  await CategoryController.getAll(req, res);
});

// GET /api/categories/:id - Une catégorie
router.get("/:id", async (req: Request, res: Response) => {
  await CategoryController.getById(req, res);
});

// GET /api/categories/:id/services - Services d'une catégorie
router.get("/:id/services", async (req: Request, res: Response) => {
  await CategoryController.getServices(req, res);
});

// POST /api/categories - Créer une catégorie (admin)
router.post(
  "/",
  authenticate,
  createCategoryValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await CategoryController.create(req, res);
  },
);

// PUT /api/categories/:id - Modifier une catégorie (admin)
router.put(
  "/:id",
  authenticate,
  updateCategoryValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await CategoryController.update(req, res);
  },
);

// DELETE /api/categories/:id - Supprimer une catégorie (admin)
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await CategoryController.delete(req, res);
});

export default router;
