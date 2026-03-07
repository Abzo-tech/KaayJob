/**
 * Service de notification
 * Fonctions utilitaires pour créer des notifications
 */

import { query } from "../config/database";

/**
 * Créer une notification pour un utilisateur
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  link?: string,
): Promise<void> {
  try {
    console.log(
      "Creating notification for user:",
      userId,
      "title:",
      title,
      "message:",
      message,
    );
    await query(
      "INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())",
      [userId, title, message, type, link || null],
    );
    console.log("Notification created successfully for user:", userId);
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
}
