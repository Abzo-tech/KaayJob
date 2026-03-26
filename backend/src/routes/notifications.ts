/**
 * Routes pour les notifications utilisateur
 */

import { Router, Response } from "express";
import { query } from "../config/database";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// GET /api/notifications - Liste des notifications de l'utilisateur
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const userId = user?.id;
    const userRole = user?.role;
    const { limit = 20, offset = 0, unreadOnly } = req.query;

    let whereClause = "";
    let params: any[] = [];

    // Logique de filtrage selon le rôle
    if (userRole === "admin" || userRole === "ADMIN") {
      // Admin voit TOUTES les notifications
      whereClause = "1=1"; // Pas de restriction pour admin
    } else {
      // Clients et prestataires : voient leurs notifications directes + celles où ils sont dans private_recipients
      whereClause = "user_id = $1 OR EXISTS (SELECT 1 FROM json_array_elements_text(private_recipients::json) AS elem WHERE elem::text = $1)";
      params = [userId];
    }

    if (unreadOnly === "true") {
      whereClause += (whereClause === "1=1" ? " AND" : " AND") + " read = false";
    }

    // Compter les notifications non lues
    const countQuery = `SELECT COUNT(*) as count FROM notifications WHERE ${whereClause}`;
    const countResult = await query(countQuery, params);

    // Récupérer les notifications
    const selectQuery = `SELECT id, title, message, type, read, link, created_at
       FROM notifications
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const result = await query(selectQuery, [...params, Number(limit), Number(offset)]);

    res.json({
      success: true,
      data: result.rows,
      unreadCount: parseInt(countResult.rows[0].count),
    });
  } catch (error) {
    console.error("Erreur liste notifications:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/notifications/:id/read - Marquer une notification comme lue
router.put("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Vérifier que la notification appartient à l'utilisateur
    const existing = await query(
      "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Notification non trouvée" });
    }

    await query(
      "UPDATE notifications SET read = true WHERE id = $1",
      [id],
    );

    res.json({ success: true, message: "Notification marquée comme lue" });
  } catch (error) {
    console.error("Erreur mise à jour notification:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/notifications/read-all - Marquer toutes les notifications comme lues
router.put("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await query(
      "UPDATE notifications SET read = true WHERE user_id = $1 AND read = false",
      [userId],
    );

    res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
  } catch (error) {
    console.error("Erreur mise à jour notifications:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// DELETE /api/notifications/:id - Supprimer une notification
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Vérifier que la notification appartient à l'utilisateur
    const existing = await query(
      "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Notification non trouvée" });
    }

    await query("DELETE FROM notifications WHERE id = $1", [id]);

    res.json({ success: true, message: "Notification supprimée" });
  } catch (error) {
    console.error("Erreur suppression notification:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// DELETE /api/notifications - Supprimer toutes les notifications lues
router.delete("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await query(
      "DELETE FROM notifications WHERE user_id = $1 AND read = true",
      [userId],
    );

    res.json({ success: true, message: "Notifications supprimées" });
  } catch (error) {
    console.error("Erreur suppression notifications:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/notifications/test - Créer une notification de test
router.post("/test", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, message, type } = req.body;

    await query(
      "INSERT INTO notifications (id, user_id, title, message, type, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())",
      [userId, title || "Test", message || "Ceci est une notification de test", type || "info"],
    );

    res.json({ success: true, message: "Notification de test créée" });
  } catch (error) {
    console.error("Erreur création notification test:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
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
    await query(
      "INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())",
      [userId, title, message, type, link || null],
    );
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
}

export default router;
module.exports = router;
