/**
 * Routes d'administration - Services
 * Utilise le service serviceService pour la logique métier
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../../middleware/auth";
import {
  listServices,
  getServiceById,
  updateService,
  deleteService,
} from "../../services/serviceService";

const router = Router();

// GET /api/admin/services - Liste des services
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, category } = req.query;

    const result = await listServices({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erreur liste services:", error);
    res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// GET /api/admin/services/:id - Obtenir un service
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);
    res.json({ success: true, data: service });
  } catch (error: any) {
    console.error("Erreur obtenir service:", error);
    res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// PUT /api/admin/services/:id - Mettre à jour un service
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Nom requis"),
    body("description").optional(),
    body("price").optional().isNumeric().withMessage("Prix invalide"),
    body("duration")
      .optional()
      .isInt({ min: 15 })
      .withMessage("Durée invalide"),
    body("isActive").optional().isBoolean().withMessage("Statut invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description, price, duration, isActive, priceType } = req.body;

      const service = await updateService(
        id,
        { name, description, price, duration, isActive, priceType },
        req.user?.id,
      );

      res.json({
        success: true,
        message: "Service mis à jour",
        data: service,
      });
    } catch (error: any) {
      console.error("Erreur mise à jour service:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/services/:id - Supprimer un service
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteService(id, req.user?.id);

    res.json({ success: true, message: "Service supprimé" });
  } catch (error: any) {
    console.error("Erreur suppression service:", error);
    res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

export default router;
