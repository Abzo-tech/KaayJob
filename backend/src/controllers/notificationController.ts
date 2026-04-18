/**
 * Contrôleur pour les notifications
 * Utilise les requêtes SQL directes pour la stabilité
 */

import { Request, Response } from "express";
import { query } from "../config/database";

// Types pour les notifications
interface CreateNotificationData {
  userId: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

// Validation des données de création
function validateCreateNotification(data: any): CreateNotificationData {
  if (!data.userId || typeof data.userId !== 'string') {
    throw new Error('userId est requis et doit être une chaîne');
  }
  if (!data.title || typeof data.title !== 'string' || data.title.length > 255) {
    throw new Error('title est requis et doit être une chaîne de moins de 255 caractères');
  }
  if (data.message && typeof data.message !== 'string') {
    throw new Error('message doit être une chaîne');
  }
  if (data.type && !['info', 'success', 'warning', 'error'].includes(data.type)) {
    throw new Error('type doit être info, success, warning ou error');
  }
  if (data.link && typeof data.link !== 'string') {
    throw new Error('link doit être une chaîne');
  }

  return {
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type || 'info',
    link: data.link
  };
}

export class NotificationController {
  /**
    * Récupérer les notifications de l'utilisateur
    */
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      const userId = user.id;
      const { limit = 20, offset = 0, unreadOnly } = req.query;

      const parsedLimit = Number(limit);
      const parsedOffset = Number(offset);
      const params: any[] = [userId];

      // Créer la table notifications si elle n'existe pas
      await query(`
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

      // Filtrer par statut de lecture
      if (unreadOnly === "true") {
        whereClause += " AND read = false";
      }

      // Obtenir le nombre de non lus
      const unreadCountQuery = `
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = $1 AND read = false
      `;
      const unreadCountResult = await query(unreadCountQuery, [userId]);

      // Obtenir le nombre total
      const totalQuery = `SELECT COUNT(*) as count FROM notifications WHERE ${whereClause}`;
      const totalResult = await query(totalQuery, params);

      // Obtenir les notifications
      const selectQuery = `
        SELECT id, title, message, type, read, link, created_at
        FROM notifications
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;

      const result = await query(selectQuery, [...params, parsedLimit, parsedOffset]);

      const total = parseInt(totalResult.rows[0].count, 10);
      const totalPages = Math.ceil(total / parsedLimit);

      console.log('🔔 Récupération des notifications:', result.rows.length, 'trouvées');

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          total,
          page: Math.floor(parsedOffset / parsedLimit) + 1,
          limit: parsedLimit,
          totalPages
        },
        unreadCount: parseInt(unreadCountResult.rows[0].count, 10)
      });
    } catch (error) {
      console.error('❌ Erreur notifications:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
    * Marquer une notification comme lue
    */
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      // Vérifier que la notification appartient à l'utilisateur
      const existing = await query(
        "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
        [id, user.id],
      );

      if (existing.rows.length === 0) {
        res.status(404).json({ success: false, message: 'Notification non trouvée' });
        return;
      }

      // Marquer comme lue
      await query(
        "UPDATE notifications SET read = true, updated_at = NOW() WHERE id = $1",
        [id],
      );

      console.log('✅ Notification marquée comme lue:', id);

      res.json({ success: true, message: 'Notification marquée comme lue' });
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
    * Créer une notification
    */
  static async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationData = validateCreateNotification(req.body);

      // Créer la table si elle n'existe pas
      await query(`
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
      const result = await query(`
        INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
        RETURNING id, title, message, type, read, link, created_at
      `, [notificationData.userId, notificationData.title, notificationData.message, notificationData.type, notificationData.link]);

      console.log('📝 Notification créée pour:', notificationData.userId);

      res.status(201).json({
        success: true,
        message: 'Notification créée',
        data: result.rows[0]
      });
    } catch (error: any) {
      console.error('❌ Erreur création notification:', error);

      if (error.message.includes('requis') || error.message.includes('doit')) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
      }
    }
  }

  /**
    * Marquer toutes les notifications comme lues
    */
  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await query(
        "UPDATE notifications SET read = true, updated_at = NOW() WHERE user_id = $1 AND read = false",
        [user.id],
      );

      console.log('✅ Toutes les notifications marquées comme lues pour:', user.id);

      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
    * Supprimer une notification
    */
  static async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      // Vérifier que la notification appartient à l'utilisateur
      const existing = await query(
        "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
        [id, user.id],
      );

      if (existing.rows.length === 0) {
        res.status(404).json({ success: false, message: 'Notification non trouvée' });
        return;
      }

      // Supprimer la notification
      await query("DELETE FROM notifications WHERE id = $1", [id]);

      console.log('🗑️ Notification supprimée:', id);

      res.json({ success: true, message: 'Notification supprimée' });
    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
    * Supprimer toutes les notifications lues
    */
  static async deleteReadNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await query(
        "DELETE FROM notifications WHERE user_id = $1 AND read = true",
        [user.id],
      );

      console.log('🗑️ Notifications lues supprimées pour:', user.id);

      res.json({ success: true, message: 'Notifications lues supprimées' });
    } catch (error) {
      console.error('❌ Erreur suppression notifications lues:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async readAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await query(
        "UPDATE notifications SET read = true, read_at = NOW() WHERE user_id = $1 AND read = false",
        [user.id],
      );

      console.log('✅ Toutes les notifications marquées comme lues pour:', user.id);

      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      console.error('❌ Erreur marquage notifications lues:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

export default NotificationController;