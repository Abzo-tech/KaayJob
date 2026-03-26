/**
 * Routes d'administration - Catégories
 * Utilise le service categoryService pour la logique métier
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../../middleware/auth";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const router = Router();

// GET /api/admin/categories - Liste des catégories
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const categories = await listCategories();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Erreur liste catégories:", error);
    res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// GET /api/admin/categories/:id - Obtenir une catégorie
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Erreur obtenir catégorie:", error);
    res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// POST /api/admin/categories - Créer une catégorie
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    body("description").optional().isLength({ max: 200 }),
    body("icon").optional().isLength({ max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name, description, icon, image } = req.body;

      const category = await createCategory(
        { name, description, icon, image },
        req.user?.id,
      );

      res.status(201).json({
        success: true,
        message: "Catégorie créée",
        data: category,
      });
    } catch (error: any) {
      console.error("Erreur création catégorie:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// PUT /api/admin/categories/:id - Mettre à jour une catégorie
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Nom requis")
      .isLength({ max: 50 }),
    body("description").optional().isLength({ max: 200 }),
    body("icon").optional().isLength({ max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { name, description, icon, image, isActive, displayOrder } = req.body;

      const category = await updateCategory(
        id,
        { name, description, icon, image, isActive, displayOrder },
        req.user?.id,
      );

      res.json({
        success: true,
        message: "Catégorie mise à jour",
        data: category,
      });
    } catch (error: any) {
      console.error("Erreur mise à jour catégorie:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/categories/:id - Supprimer une catégorie
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategory(id, req.user?.id);

    res.json({ success: true, message: "Catégorie supprimée" });
  } catch (error: any) {
    console.error("Erreur suppression catégorie:", error);
    res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

export default router;
