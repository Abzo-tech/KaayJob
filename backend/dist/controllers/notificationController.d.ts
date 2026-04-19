/**
 * Contrôleur pour les notifications
 * Utilise les requêtes SQL directes pour la stabilité
 */
import { Request, Response } from "express";
export declare class NotificationController {
    /**
      * Récupérer les notifications de l'utilisateur
      */
    static getNotifications(req: Request, res: Response): Promise<void>;
    /**
      * Marquer une notification comme lue
      */
    static markAsRead(req: Request, res: Response): Promise<void>;
    /**
      * Créer une notification
      */
    static createNotification(req: Request, res: Response): Promise<void>;
    /**
      * Marquer toutes les notifications comme lues
      */
    static markAllAsRead(req: Request, res: Response): Promise<void>;
    /**
      * Supprimer une notification
      */
    static deleteNotification(req: Request, res: Response): Promise<void>;
    /**
      * Supprimer toutes les notifications lues
      */
    static deleteReadNotifications(req: Request, res: Response): Promise<void>;
    /**
     * Marquer toutes les notifications comme lues
     */
    static readAll(req: Request, res: Response): Promise<void>;
}
export default NotificationController;
//# sourceMappingURL=notificationController.d.ts.map