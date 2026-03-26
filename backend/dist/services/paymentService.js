"use strict";
/**
 * Service de paiement d'abonnements
 * Gère uniquement les paiements d'abonnements prestataires
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSubscriptionPayment = processSubscriptionPayment;
const database_1 = require("../config/database");
const notificationService_1 = require("./notificationService");
/**
 * Traiter un paiement d'abonnement prestataire
 */
async function processSubscriptionPayment(userId, amount, paymentMethod, planName) {
    try {
        // Vérifier que l'utilisateur est un prestataire
        const userResult = await (0, database_1.query)("SELECT first_name, last_name, role FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            throw new Error("Utilisateur non trouvé");
        }
        const user = userResult.rows[0];
        if (user.role !== "PRESTATAIRE") {
            throw new Error("Seuls les prestataires peuvent payer des abonnements");
        }
        // Enregistrer le paiement d'abonnement
        await (0, database_1.query)(`INSERT INTO payments (id, user_id, amount, payment_method, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'PAID', NOW())`, [userId, amount, paymentMethod]);
        // Notifier le prestataire du paiement réussi
        await (0, notificationService_1.createNotification)(userId, "Paiement d'abonnement réussi", `Votre paiement de ${amount}€ pour l'abonnement ${planName.toUpperCase()} a été traité avec succès.`, "success", "/prestataire/subscription");
    }
    catch (error) {
        console.error("Erreur traitement paiement abonnement:", error);
        throw error;
    }
}
//# sourceMappingURL=paymentService.js.map