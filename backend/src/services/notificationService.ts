/**
 * Service de notification
 * Fonctions utilitaires pour créer des notifications
 */

import { prisma } from "../config/prisma";
import {
  formatNotificationMessage,
  createStandardNotificationMessage,
  NotificationRecipient,
  NotificationContext,
} from "../utils/notificationFormatter";

let privateRecipientsColumnAvailable: Promise<boolean> | null = null;

async function hasPrivateRecipientsColumn(): Promise<boolean> {
  if (!privateRecipientsColumnAvailable) {
    privateRecipientsColumnAvailable = (async () => {
      try {
        const result = await prisma.$queryRaw<Array<{ exists: boolean }>>`
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'notifications'
              AND column_name = 'private_recipients'
          ) AS "exists"
        `;

        return Boolean(result[0]?.exists);
      } catch (error) {
        console.warn(
          "Impossible de verifier la colonne notifications.private_recipients, fallback sans ce champ:",
          error,
        );
        return false;
      }
    })();
  }

  return privateRecipientsColumnAvailable;
}

export async function ensureNotificationSchema(): Promise<void> {
  await hasPrivateRecipientsColumn();
}

/**
 * Créer une notification pour un utilisateur
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  link?: string,
  privateRecipients?: string[],
): Promise<void> {
  try {
    const canStorePrivateRecipients =
      Array.isArray(privateRecipients) && privateRecipients.length > 0
        ? await hasPrivateRecipientsColumn()
        : false;

    console.log(
      "Creating notification for user:",
      userId,
      "title:",
      title,
      "message:",
      message,
      "privateRecipients:",
      privateRecipients,
    );

    const data: any = {
      userId,
      title,
      message,
      type,
      link: link || null,
    };

    if (canStorePrivateRecipients) {
      data.privateRecipients = privateRecipients;
    } else if (privateRecipients?.length) {
      console.warn(
        "Colonne private_recipients absente, notification creee sans privateRecipients",
      );
    }

    await prisma.notification.create({
      data,
    });
    console.log("Notification created successfully for user:", userId);
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
}

/**
 * Créer une notification formatée selon le destinataire
 */
export async function createFormattedNotification(
  recipient: NotificationRecipient,
  title: string,
  baseMessage: string,
  type: string = "info",
  link?: string,
  privateRecipients?: string[],
  context?: NotificationContext,
): Promise<void> {
  try {
    // Formater le message selon le destinataire
    const formattedMessage = formatNotificationMessage(
      baseMessage,
      recipient,
      context,
    );

    console.log(
      "Creating formatted notification for user:",
      recipient.id,
      "title:",
      title,
      "original message:",
      baseMessage,
      "formatted message:",
      formattedMessage,
    );

    await createNotification(
      recipient.id,
      title,
      formattedMessage,
      type,
      link,
      privateRecipients,
    );
  } catch (error) {
    console.error("Erreur création notification formatée:", error);
  }
}

/**
 * Créer une notification standardisée selon l'action
 */
export async function createStandardNotification(
  recipient: NotificationRecipient,
  action: string,
  entity: string,
  type: string = "info",
  link?: string,
  privateRecipients?: string[],
  context?: NotificationContext,
): Promise<void> {
  try {
    const title = getNotificationTitle(action);
    const message = createStandardNotificationMessage(
      action,
      entity,
      recipient,
      context,
    );

    console.log(
      "Creating standard notification for user:",
      recipient.id,
      "action:",
      action,
      "entity:",
      entity,
      "title:",
      title,
      "message:",
      message,
    );

    await createNotification(
      recipient.id,
      title,
      message,
      type,
      link,
      privateRecipients,
    );
  } catch (error) {
    console.error("Erreur création notification standard:", error);
  }
}

/**
 * Obtenir le titre approprié selon l'action
 */
function getNotificationTitle(action: string): string {
  const titles: { [key: string]: string } = {
    subscription_created: "Abonnement activé",
    subscription_cancelled: "Abonnement annulé",
    subscription_renewed: "Abonnement renouvelé",
    booking_created: "Nouvelle réservation",
    booking_confirmed: "Réservation confirmée",
    booking_cancelled: "Réservation annulée",
    payment_success: "Paiement réussi",
    verification_requested: "Demande de vérification",
    plan_created: "Plan créé",
    plan_updated: "Plan mis à jour",
    plan_deleted: "Plan supprimé",
  };

  return titles[action] || "Notification";
}
