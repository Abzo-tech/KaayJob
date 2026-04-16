"use strict";
/**
 * Routes pour les notifications utilisateur
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const express_1 = require("express");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent authentification
router.use(auth_1.authenticate);
// GET /api/notifications - Liste des notifications de l'utilisateur
router.get("/", async (req, res) => {
    try {
        const user = req.user;
        const userId = user?.id;
        const { limit = 20, offset = 0, unreadOnly } = req.query;
        const parsedLimit = Number(limit);
        const parsedOffset = Number(offset);
        const params = [userId];
        // Créer la table notifications si elle n'existe pas
        await (0, database_1.query)(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(50) DEFAULT 'info',
        read BOOLEAN DEFAULT false,
        link VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        let whereClause = "user_id = $1";
        // Filter by read status
        if (unreadOnly === "true") {
            whereClause += " AND read = false";
        }
        // Get unread count
        const unreadCountQuery = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND read = false
    `;
        const unreadCountResult = await (0, database_1.query)(unreadCountQuery, [userId]);
        // Get notifications
        const selectQuery = `
      SELECT id, title, message, type, read, link, created_at
      FROM notifications
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
        const result = await (0, database_1.query)(selectQuery, [...params, parsedLimit, parsedOffset]);
        res.json({
            success: true,
            data: result.rows,
            unreadCount: parseInt(unreadCountResult.rows[0].count, 10),
        });
    }
    catch (error) {
        console.error("Erreur liste notifications:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/notifications/:id/read - Marquer une notification comme lue
router.put("/:id/read", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // Vérifier que la notification appartient à l'utilisateur
        const existing = await (0, database_1.query)("SELECT id FROM notifications WHERE id = $1 AND user_id = $2", [id, userId]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Notification non trouvée" });
        }
        // Marquer comme lue
        await (0, database_1.query)("UPDATE notifications SET read = true, updated_at = NOW() WHERE id = $1", [id]);
        res.json({ success: true, message: "Notification marquée comme lue" });
    }
    catch (error) {
        console.error("Erreur mise à jour notification:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/notifications/read-all - Marquer toutes les notifications comme lues
router.put("/read-all", async (req, res) => {
    try {
        const userId = req.user?.id;
        await (0, database_1.query)("UPDATE notifications SET read = true, updated_at = NOW() WHERE user_id = $1 AND read = false", [userId]);
        res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
    }
    catch (error) {
        console.error("Erreur mise à jour notifications:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// DELETE /api/notifications/:id - Supprimer une notification
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // Vérifier que la notification appartient à l'utilisateur
        const existing = await (0, database_1.query)("SELECT id FROM notifications WHERE id = $1 AND user_id = $2", [id, userId]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Notification non trouvée" });
        }
        // Supprimer la notification
        await (0, database_1.query)("DELETE FROM notifications WHERE id = $1", [id]);
        res.json({ success: true, message: "Notification supprimée" });
    }
    catch (error) {
        console.error("Erreur suppression notification:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// DELETE /api/notifications - Supprimer toutes les notifications lues
router.delete("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        await (0, database_1.query)("DELETE FROM notifications WHERE user_id = $1 AND read = true", [userId]);
        res.json({ success: true, message: "Notifications lues supprimées" });
    }
    catch (error) {
        console.error("Erreur suppression notifications:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/notifications/test - Créer une notification de test
router.post("/test", async (req, res) => {
    try {
        const userId = req.user?.id;
        const { title, message, type, link } = req.body;
        // Créer la table si elle n'existe pas
        await (0, database_1.query)(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(50) DEFAULT 'info',
        read BOOLEAN DEFAULT false,
        link VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        // Insérer la notification
        await (0, database_1.query)("INSERT INTO notifications (user_id, title, message, type, link, created_at) VALUES ($1, $2, $3, $4, $5, NOW())", [userId, title || "Test", message || "Ceci est une notification de test", type || "info", link || null]);
        res.json({ success: true, message: "Notification de test créée" });
    }
    catch (error) {
        console.error("Erreur création notification test:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// Fonction utilitaire pour créer une notification (à utiliser par d'autres routes)
async function createNotification(userId, title, message, type = "info", link) {
    try {
        await (0, notificationService_1.ensureNotificationSchema)();
        await (0, database_1.query)("INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())", [userId, title, message, type, link || null]);
    }
    catch (error) {
        console.error("Erreur création notification:", error);
    }
}
exports.default = router;
//# sourceMappingURL=notifications.js.map