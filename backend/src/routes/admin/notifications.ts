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
    body("userId")
      .optional()
      .notEmpty()
      .withMessage("ID utilisateur requis"),
    body("userIds")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Liste d'utilisateurs invalide"),
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

      const { userId, userIds, title, message, type, link } = req.body;
      const recipientIds = Array.isArray(userIds)
        ? userIds
        : userId
          ? [userId]
          : [];

      if (recipientIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "userId ou userIds est requis",
        });
      }

      const userExists = await query(
        "SELECT id FROM users WHERE id = ANY($1::uuid[])",
        [recipientIds],
      );
      if (userExists.rows.length !== recipientIds.length) {
        return res
          .status(404)
          .json({ success: false, message: "Un ou plusieurs utilisateurs sont introuvables" });
      }

      for (const recipientId of recipientIds) {
        await query(
          "INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())",
          [recipientId, title, message, type || "info", link || null],
        );
      }

      res.status(201).json({
        success: true,
        message: recipientIds.length > 1 ? "Notifications créées" : "Notification créée",
      });
    } catch (error) {
      console.error("Erreur création notification:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

export default router;
