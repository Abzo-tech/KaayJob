"use strict";
/**
 * Service de paiement d'abonnements
 * Gère uniquement les paiements d'abonnements prestataires
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSubscriptionPayment = processSubscriptionPayment;
const prisma_1 = require("../config/prisma");
const notificationService_1 = require("./notificationService");
async function processSubscriptionPayment(userId, amount, paymentMethod, planName) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }
    if (user.role !== "PRESTATAIRE") {
        throw new Error("Seuls les prestataires peuvent payer des abonnements");
    }
    await prisma_1.prisma.payment.create({
        data: {
            userId,
            amount: amount,
            paymentMethod,
            status: "PAID",
        },
    });
    await (0, notificationService_1.createNotification)(userId, "Paiement d'abonnement réussi", `Votre paiement de ${amount}€ pour l'abonnement ${planName.toUpperCase()} a été traité avec succès.`, "success", "/prestataire/subscription");
}
//# sourceMappingURL=paymentService.js.map