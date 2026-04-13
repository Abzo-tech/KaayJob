/**
 * Routes pour les notifications utilisateur
 */

import { Router, Response } from "express";
import { query } from "../config/database";
import { authenticate, AuthRequest } from "../middleware/auth";
import { ensureNotificationSchema } from "../services/notificationService";

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// GET /api/notifications - Liste des notifications de l'utilisateur
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    // Pour l'instant, retourner un tableau vide pour éviter les rechargements infinis
    // TODO: Implémenter un vrai système de notifications plus tard
    res.json({
      success: true,
      data: [],
      unreadCount: 0,
    });
  } catch (error) {
    console.error("Erreur liste notifications:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/notifications/:id/read - Marquer une notification comme lue
router.put("/:id/read", async (req: AuthRequest, res: Response) => {
  // Pour l'instant, simuler le succès
  res.json({ success: true, message: "Notification marquée comme lue" });
});

// PUT /api/notifications/read-all - Marquer toutes les notifications comme lues
router.put("/read-all", async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
});

// DELETE /api/notifications/:id - Supprimer une notification
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: "Notification supprimée" });
});

// DELETE /api/notifications - Supprimer toutes les notifications lues
router.delete("/", async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: "Notifications supprimées" });
});

// POST /api/notifications/test - Créer une notification de test
router.post("/test", async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: "Notification de test créée" });
});

// Fonction utilitaire pour créer une notification (à utiliser par d'autres routes)
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  link?: string,
) {
  try {
    await ensureNotificationSchema();

    await query(
      "INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())",
      [userId, title, message, type, link || null],
    );
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
}


export default router;
