/**
 * Routes d'administration - Notifications
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../config/prisma";
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

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: recipientIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (users.length !== recipientIds.length) {
        return res
          .status(404)
          .json({ success: false, message: "Un ou plusieurs utilisateurs sont introuvables" });
      }

      await prisma.notification.createMany({
        data: recipientIds.map((recipientId: string) => ({
          userId: recipientId,
          title,
          message,
          type: type || "info",
          link: link || null,
        })),
      });

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
