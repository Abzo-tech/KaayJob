/**
 * Service de paiement d'abonnements
 * Gère uniquement les paiements d'abonnements prestataires
 */

import { query } from "../config/database";
import { createNotification } from "./notificationService";

/**
 * Traiter un paiement d'abonnement prestataire
 */
export async function processSubscriptionPayment(
  userId: string,
  amount: number,
  paymentMethod: string,
  planName: string,
): Promise<void> {
  try {
    // Vérifier que l'utilisateur est un prestataire
    const userResult = await query(
      "SELECT first_name, last_name, role FROM users WHERE id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new Error("Utilisateur non trouvé");
    }

    const user = userResult.rows[0];
    if (user.role !== "PRESTATAIRE") {
      throw new Error("Seuls les prestataires peuvent payer des abonnements");
    }

    // Enregistrer le paiement d'abonnement
    await query(
      `INSERT INTO payments (id, user_id, amount, payment_method, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'PAID', NOW())`,
      [userId, amount, paymentMethod],
    );

    // Notifier le prestataire du paiement réussi
    await createNotification(
      userId,
      "Paiement d'abonnement réussi",
      `Votre paiement de ${amount}€ pour l'abonnement ${planName.toUpperCase()} a été traité avec succès.`,
      "success",
      "/prestataire/subscription",
    );

  } catch (error) {
    console.error("Erreur traitement paiement abonnement:", error);
    throw error;
  }
}