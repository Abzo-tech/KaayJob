"use strict";
/**
 * Service de notification
 * Fonctions utilitaires pour créer des notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNotificationSchema = ensureNotificationSchema;
exports.createNotification = createNotification;
exports.createFormattedNotification = createFormattedNotification;
exports.createStandardNotification = createStandardNotification;
const prisma_1 = require("../config/prisma");
const notificationFormatter_1 = require("../utils/notificationFormatter");
let privateRecipientsColumnAvailable = null;
async function hasPrivateRecipientsColumn() {
    if (!privateRecipientsColumnAvailable) {
        privateRecipientsColumnAvailable = (async () => {
            try {
                const result = await prisma_1.prisma.$queryRaw `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'notifications'
              AND column_name = 'private_recipients'
          ) AS "exists"
        `;
                return Boolean(result[0]?.exists);
            }
            catch (error) {
                console.warn("Impossible de verifier la colonne notifications.private_recipients, fallback sans ce champ:", error);
                return false;
            }
        })();
    }
    return privateRecipientsColumnAvailable;
}
async function ensureNotificationSchema() {
    await hasPrivateRecipientsColumn();
}
/**
 * Créer une notification pour un utilisateur
 */
async function createNotification(userId, title, message, type = "info", link, privateRecipients) {
    try {
        const canStorePrivateRecipients = Array.isArray(privateRecipients) && privateRecipients.length > 0
            ? await hasPrivateRecipientsColumn()
            : false;
        console.log("Creating notification for user:", userId, "title:", title, "message:", message, "privateRecipients:", privateRecipients);
        const data = {
            userId,
            title,
            message,
            type,
            link: link || null,
        };
        if (canStorePrivateRecipients) {
            data.privateRecipients = privateRecipients;
        }
        else if (privateRecipients?.length) {
            console.warn("Colonne private_recipients absente, notification creee sans privateRecipients");
        }
        await prisma_1.prisma.notification.create({
            data,
        });
        console.log("Notification created successfully for user:", userId);
    }
    catch (error) {
        console.error("Erreur création notification:", error);
    }
}
/**
 * Créer une notification formatée selon le destinataire
 */
async function createFormattedNotification(recipient, title, baseMessage, type = "info", link, privateRecipients, context) {
    try {
        // Formater le message selon le destinataire
        const formattedMessage = (0, notificationFormatter_1.formatNotificationMessage)(baseMessage, recipient, context);
        console.log("Creating formatted notification for user:", recipient.id, "title:", title, "original message:", baseMessage, "formatted message:", formattedMessage);
        await createNotification(recipient.id, title, formattedMessage, type, link, privateRecipients);
    }
    catch (error) {
        console.error("Erreur création notification formatée:", error);
    }
}
/**
 * Créer une notification standardisée selon l'action
 */
async function createStandardNotification(recipient, action, entity, type = "info", link, privateRecipients, context) {
    try {
        const title = getNotificationTitle(action);
        const message = (0, notificationFormatter_1.createStandardNotificationMessage)(action, entity, recipient, context);
        console.log("Creating standard notification for user:", recipient.id, "action:", action, "entity:", entity, "title:", title, "message:", message);
        await createNotification(recipient.id, title, message, type, link, privateRecipients);
    }
    catch (error) {
        console.error("Erreur création notification standard:", error);
    }
}
/**
 * Obtenir le titre approprié selon l'action
 */
function getNotificationTitle(action) {
    const titles = {
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
//# sourceMappingURL=notificationService.js.map