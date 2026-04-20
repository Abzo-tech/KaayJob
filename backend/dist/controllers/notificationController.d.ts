/**
 * Contrôleur pour les notifications
 * Utilise Prisma pour les opérations de données
 */
import { Request, Response } from "express";
export declare class NotificationController {
    static getNotifications(req: Request, res: Response): Promise<void>;
    static markAsRead(req: Request, res: Response): Promise<void>;
    static createNotification(req: Request, res: Response): Promise<void>;
    static markAllAsRead(req: Request, res: Response): Promise<void>;
    static deleteNotification(req: Request, res: Response): Promise<void>;
    static deleteReadNotifications(req: Request, res: Response): Promise<void>;
    static readAll(req: Request, res: Response): Promise<void>;
}
export default NotificationController;
//# sourceMappingURL=notificationController.d.ts.map