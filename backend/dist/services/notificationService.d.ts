/**
 * Service de notification
 * Fonctions utilitaires pour créer des notifications
 */
import { NotificationRecipient, NotificationContext } from "../utils/notificationFormatter";
export declare function ensureNotificationSchema(): Promise<void>;
/**
 * Créer une notification pour un utilisateur
 */
export declare function createNotification(userId: string, title: string, message: string, type?: string, link?: string, privateRecipients?: string[]): Promise<void>;
/**
 * Créer une notification formatée selon le destinataire
 */
export declare function createFormattedNotification(recipient: NotificationRecipient, title: string, baseMessage: string, type?: string, link?: string, privateRecipients?: string[], context?: NotificationContext): Promise<void>;
/**
 * Créer une notification standardisée selon l'action
 */
export declare function createStandardNotification(recipient: NotificationRecipient, action: string, entity: string, type?: string, link?: string, privateRecipients?: string[], context?: NotificationContext): Promise<void>;
//# sourceMappingURL=notificationService.d.ts.map