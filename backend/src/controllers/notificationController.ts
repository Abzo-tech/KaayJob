/**
 * Contrôleur pour les notifications
 * Utilise Prisma pour les opérations de données
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// Types pour les notifications
interface CreateNotificationData {
  userId: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

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
    message: data.message ?? '',
    type: data.type || 'info',
    link: data.link,
  };
}

export class NotificationController {
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      const { limit = 20, offset = 0, unreadOnly } = req.query as any;
      const parsedLimit = Number(limit);
      const parsedOffset = Number(offset);

      const where: any = { userId: user.id };
      if (unreadOnly === 'true') {
        where.read = false;
      }

      const [total, unreadCount, notifications] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId: user.id, read: false } }),
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: parsedLimit,
          skip: parsedOffset,
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            read: true,
            link: true,
            createdAt: true,
          },
        }),
      ]);

      const totalPages = parsedLimit > 0 ? Math.ceil(total / parsedLimit) : 1;

      res.json({
        success: true,
        data: notifications,
        pagination: {
          total,
          page: Math.floor(parsedOffset / parsedLimit) + 1,
          limit: parsedLimit,
          totalPages,
        },
        unreadCount,
      });
    } catch (error) {
      console.error('❌ Erreur notifications:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      const existing = await prisma.notification.findFirst({
        where: { id, userId: user.id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Notification non trouvée' });
        return;
      }

      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      res.json({ success: true, message: 'Notification marquée comme lue' });
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationData = validateCreateNotification(req.body);
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message ?? '',
          type: notificationData.type,
          link: notificationData.link,
        },
      });

      res.status(201).json({ success: true, message: 'Notification créée', data: notification });
    } catch (error: any) {
      console.error('❌ Erreur création notification:', error);
      if (error.message.includes('requis') || error.message.includes('doit')) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
      }
    }
  }

  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      });

      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      const existing = await prisma.notification.findFirst({
        where: { id, userId: user.id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Notification non trouvée' });
        return;
      }

      await prisma.notification.delete({ where: { id } });

      res.json({ success: true, message: 'Notification supprimée' });
    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async deleteReadNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await prisma.notification.deleteMany({
        where: { userId: user.id, read: true },
      });

      res.json({ success: true, message: 'Notifications lues supprimées' });
    } catch (error) {
      console.error('❌ Erreur suppression notifications lues:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  static async readAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      });

      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      console.error('❌ Erreur marquage notifications lues:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
}

export default NotificationController;
