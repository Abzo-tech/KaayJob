"use strict";
/**
 * Service de notification
 * Fonctions utilitaires pour créer des notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const database_1 = require("../config/database");
/**
 * Créer une notification pour un utilisateur
 */
async function createNotification(userId, title, message, type = "info", link) {
    try {
        console.log("Creating notification for user:", userId, "title:", title, "message:", message);
        await (0, database_1.query)("INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())", [userId, title, message, type, link || null]);
        console.log("Notification created successfully for user:", userId);
    }
    catch (error) {
        console.error("Erreur création notification:", error);
    }
}
//# sourceMappingURL=notificationService.js.map