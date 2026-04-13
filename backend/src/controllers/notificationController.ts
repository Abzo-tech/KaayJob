/**
 * Contrôleur pour les notifications
 * Utilise les requêtes SQL directes pour la stabilité
 */

import { Request, Response } from "express";

export class NotificationController {
  /**
   * Récupérer les notifications de l'utilisateur
   */
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implémenter l'authentification pour récupérer l'utilisateur connecté
      // Pour l'instant, on retourne une liste vide
      const notifications: any[] = [];

      console.log('🔔 Récupération des notifications');

      res.json({
        success: true,
        data: notifications,
        pagination: {
          total: 0,
          page: 1,
          limit: 50,
          totalPages: 0
        }
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

      console.log('✅ Marquer notification comme lue:', id);

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
      const { userId, title, message, type } = req.body;

      console.log('📝 Création notification pour:', userId);

      res.json({
        success: true,
        message: 'Notification créée',
        data: { id: 'temp-id', title, message, type }
      });
    } catch (error) {
      console.error('❌ Erreur création notification:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

export default NotificationController;