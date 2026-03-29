/**
 * Utilitaires pour formater les messages de notifications selon le destinataire
 */
export interface NotificationRecipient {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
}
export interface NotificationContext {
    actor?: {
        firstName: string;
        lastName: string;
        role: string;
    };
    target?: {
        firstName: string;
        lastName: string;
        role: string;
    };
    action?: string;
    entity?: string;
    details?: string;
}
/**
 * Reformule un message de notification selon le destinataire
 * Évite les formulations à la première personne pour les admins
 */
export declare function formatNotificationMessage(baseMessage: string, recipient: NotificationRecipient, context?: NotificationContext): string;
/**
 * Crée un message de notification standardisé selon l'action et le destinataire
 */
export declare function createStandardNotificationMessage(action: string, entity: string, recipient: NotificationRecipient, context?: NotificationContext): string;
//# sourceMappingURL=notificationFormatter.d.ts.map