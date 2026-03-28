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
export function formatNotificationMessage(
  baseMessage: string,
  recipient: NotificationRecipient,
  context?: NotificationContext
): string {
  // Pour les admins, reformuler les messages qui utilisent "Vous"
  if (recipient.role === 'admin' || recipient.role === 'ADMIN') {
    // Remplacer "Vous" par le nom de l'utilisateur concerné
    if (baseMessage.includes('Vous') && context?.actor) {
      const actorName = `${context.actor.firstName} ${context.actor.lastName}`;
      return baseMessage
        .replace(/Vous/g, actorName)
        .replace(/votre/g, `de ${actorName}`)
        .replace(/Votre/g, `De ${actorName}`);
    }

    // Ajouter du contexte si nécessaire
    if (context?.actor && !baseMessage.includes(context.actor.firstName)) {
      return `${context.actor.firstName} ${context.actor.lastName} : ${baseMessage}`;
    }
  }

  return baseMessage;
}

/**
 * Crée un message de notification standardisé selon l'action et le destinataire
 */
export function createStandardNotificationMessage(
  action: string,
  entity: string,
  recipient: NotificationRecipient,
  context?: NotificationContext
): string {
  const templates = {
    // Pour les utilisateurs normaux (clients/prestataires)
    user: {
      subscription_created: `Votre abonnement ${entity} a été activé avec succès`,
      subscription_cancelled: `Votre abonnement a été annulé`,
      subscription_renewed: `Votre abonnement a été renouvelé pour ${context?.details || '1 mois'}`,
      booking_created: `Votre réservation pour ${entity} a été créée`,
      booking_confirmed: `Votre réservation pour ${entity} a été confirmée`,
      booking_cancelled: `Votre réservation pour ${entity} a été annulée`,
      payment_success: `Votre paiement de ${entity} a été traité avec succès`,
      verification_requested: `Votre demande de vérification a été soumise`,
    },

    // Pour les admins
    admin: {
      subscription_created: `Un nouvel abonnement ${entity} a été créé par un prestataire`,
      subscription_cancelled: `${context?.actor?.firstName} ${context?.actor?.lastName} a annulé son abonnement`,
      subscription_renewed: `L'abonnement de ${context?.actor?.firstName} ${context?.actor?.lastName} a été renouvelé`,
      booking_created: `Nouvelle réservation pour ${entity}`,
      booking_confirmed: `Réservation confirmée pour ${entity}`,
      booking_cancelled: `Réservation annulée pour ${entity}`,
      payment_success: `Paiement de ${entity} traité avec succès`,
      verification_requested: `${context?.actor?.firstName} ${context?.actor?.lastName} a demandé la vérification de son profil`,
      plan_created: `Le plan "${entity}" a été créé avec succès`,
      plan_updated: `Le plan "${entity}" a été mis à jour`,
      plan_deleted: `Le plan "${entity}" a été supprimé`,
    }
  };

  const isAdmin = recipient.role === 'admin' || recipient.role === 'ADMIN';
  const template = isAdmin ? templates.admin : templates.user;

  return template[action as keyof typeof template] || `Action ${action} effectuée sur ${entity}`;
}