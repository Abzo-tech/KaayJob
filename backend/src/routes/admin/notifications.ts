/**
 * Routes d'administration - Notifications
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { query } from "../../config/database";
import { AuthRequest } from "../../middleware/auth";

const router = Router();

// POST /api/admin/notifications - Créer une notification pour un utilisateur
router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("ID utilisateur requis"),
    body("title").notEmpty().withMessage("Titre requis"),
    body("message").notEmpty().withMessage("Message requis"),
    body("type")
      .optional()
      .isIn(["success", "error", "info", "warning"])
      .withMessage("Type invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { userId, title, message, type, link } = req.body;

      // Vérifier si l'utilisateur existe
      const userExists = await query("SELECT id FROM users WHERE id = $1", [
        userId,
      ]);
      if (userExists.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      // Créer la notification
      await query(
        "INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())",
        [userId, title, message, type || "info", link || null],
      );

      res.status(201).json({
        success: true,
        message: "Notification créée",
      });
    } catch (error) {
      console.error("Erreur création notification:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

export default router;
